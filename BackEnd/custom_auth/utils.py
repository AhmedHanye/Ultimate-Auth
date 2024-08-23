from django.utils.crypto import get_random_string
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.response import Response
from .email import (
    resend_activation_email,
    registration_attempt_email,
    login_notification_email,
)
from geopy.geocoders import Nominatim
from django.contrib.auth import authenticate
from django.contrib.sites.shortcuts import get_current_site
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import (
    OutstandingToken,
    BlacklistedToken,
)
import requests
from django.conf import settings

User = get_user_model()


# * Create user or resend activation email
def createUser(request, email, username, password):
    user = User.objects.get(email=email)
    if not user.is_active:
        if username:
            user.username = username
        if password:
            user.set_password(password)
        user.save()

        context = {"user": user}
        resend_activation_email(request, user, context)
    else:
        domain = get_current_site(request)
        context = {
            "username": user.username,
            "sign_in_url": f"http://{domain}/auth/sign-in/",
            "password_reset_url": f"http://{domain}/auth/reseting-password/",
        }
        registration_attempt_email(email, context)

    return Response(
        {"email": email, "username": username},
        status=status.HTTP_201_CREATED,
    )


# * Token Management
# get client IP
def get_client_ip(request):
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    return (
        x_forwarded_for.split(",")[0]
        if x_forwarded_for
        else request.META.get("REMOTE_ADDR")
    )


# get location from IP
def get_location(ip):
    try:
        geolocator = Nominatim(user_agent="your_app_name")
        return geolocator.geocode(ip)
    except Exception as e:
        print(f"Geolocation error: {e}")
        return None


# Token generation
def get_tokens(user):
    try:
        refresh = RefreshToken.for_user(user)
        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }
    except Exception as e:
        raise Exception(f"Token generation error: {e}")


# Token Optain
def ObtainTokens(request, email, password):
    user = authenticate(request, username=email, password=password)
    if user:
        ip_address = get_client_ip(request)
        location = get_location(ip_address)

        context = {
            "username": user.username,
            "location": location.address if location else "Unknown location",
        }
        login_notification_email(email, context)

        tokens = get_tokens(user)
        return Response(tokens, status=status.HTTP_200_OK)
    else:
        return Response(
            {"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
        )


# * Remove refresh tokens
def remove_refresh_tokens(request, all, refresh):
    if all:
        tokens = OutstandingToken.objects.filter(user=request.user)
        for token in tokens:
            BlacklistedToken.objects.get_or_create(token=token)
        return Response({"status": "OK, goodbye, all refresh tokens blacklisted"})
    elif refresh:
        try:
            refresh_token = refresh
            token = RefreshToken(token=refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_200_OK)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)


# * SSO Login
# Create or activate user for SSO (GitHub, Google)
def create_or_activate_user(username, email):
    user, created = User.objects.get_or_create(
        email=email,
        defaults={
            "username": username,
            "is_active": True,
        },
    )

    if created:
        # Generate a random strong password
        random_password = get_random_string(length=18)
        user.set_password(random_password)
        user.save()
    else:
        # Activate the user if not active
        user.is_active = True
        user.save()

    return user


# Google SSO
def Google_SSO(token):
    try:
        # Get user info from Google
        response = requests.get(
            "https://www.googleapis.com/oauth2/v1/userinfo",
            headers={"Authorization": f"Bearer {token}"},
        )

        user_info = response.json()
        email = user_info["email"]
        username = user_info["name"]

        # Create or activate user
        user = create_or_activate_user(username, email)
        # Generate tokens
        tokens = get_tokens(user)
        return Response(tokens, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# GitHub SSO
def GitHub_SSO(code):
    try:
        if not code:
            return Response({"error": "No code provided"}, status=400)

        # Get access token from GitHub
        token_url = "https://github.com/login/oauth/access_token"
        client_id = settings.SOCIAL_AUTH_GITHUB_KEY
        client_secret = settings.SOCIAL_AUTH_GITHUB_SECRET

        token_response = requests.post(
            token_url,
            data={
                "client_id": client_id,
                "client_secret": client_secret,
                "code": code,
            },
            headers={"Accept": "application/json"},
        )

        # if token request fails
        if token_response.status_code != 200:
            return Response(
                {
                    "error": f"Failed to fetch access token. Status code: {token_response.status_code}, Response: {token_response.text}"
                },
                status=token_response.status_code,
            )

        # Get user username from GitHub
        access_token = token_response.json().get("access_token")

        user_response = requests.get(
            "https://api.github.com/user",
            headers={"Authorization": f"token {access_token}"},
        )

        user_info = user_response.json()
        username = user_info.get("login")

        # Get user email from GitHub
        emails_response = requests.get(
            "https://api.github.com/user/emails",
            headers={"Authorization": f"token {access_token}"},
        )
        # if emails request fails
        if emails_response.status_code != 200:
            return Response(
                {
                    "error": f"Failed to fetch user emails. Status code: {emails_response.status_code}, Response: {emails_response.text}"
                },
                status=emails_response.status_code,
            )

        # get primary email
        emails = emails_response.json()
        primary_emails = [
            email for email in emails if email.get("primary") and email.get("verified")
        ]
        email = (
            primary_emails[0].get("email")
            if primary_emails
            else [email for email in emails if email.get("verified")][0].get("email")
        )

        # Create or activate user
        user = create_or_activate_user(username, email)
        # Generate tokens
        tokens = get_tokens(user)
        return Response(tokens, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"error": "Something went wrong with GitHub auth."},
            status=status.HTTP_400_BAD_REQUEST,
        )
