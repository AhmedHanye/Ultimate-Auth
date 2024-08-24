from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from django.contrib.auth import get_user_model
from djoser.views import UserViewSet
from .serializers import LogOutSerializer

from .utils import (
    createUser,
    ObtainTokens,
    remove_refresh_tokens,
    Google_SSO,
    GitHub_SSO,
)

User = get_user_model()


# * Custom User Create View
class CustomUserCreateView(UserViewSet):
    def create(self, request, *args, **kwargs):
        # get data from request
        email = request.data.get("email")
        username = request.data.get("username")
        password = request.data.get("password")

        # check if user with email already exists
        if User.objects.filter(email=email).exists():
            """
            if user exists and is not active:: resend activation email
            if user exists and is active:: send registration attempt email
            """
            return createUser(request, email, username, password)

        # if user doesn't exists create user normally
        response = super().create(request, *args, **kwargs)
        response.data.pop("id", None)
        return response


# * Custom Token Obtain View
class CustomTokenObtainView(APIView):
    permission_classes = []

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        if not email or not password:
            return Response(
                {"error": "Please provide both email and password"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        """
        if user exist and is active:: return tokens and location from where the request is made 
        if not user or not active:: return invalid credentials
        """
        return ObtainTokens(request, email, password)


# * Custom LogOut View
class LogOut(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = LogOutSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        all = serializer.validated_data.get("all")
        refresh = serializer.validated_data.get("refresh")

        """
        if all is True:: blacklist all refresh tokens
        if refresh is provided:: blacklist that refresh token
        if none of the above:: return bad request
        """
        return remove_refresh_tokens(request, all, refresh)


# * SSO Login
# Google Login
class GoogleLogin(APIView):
    permission_classes = []

    def post(self, request):
        token = request.data.get("access_token")
        return Google_SSO(token,request)


# GitHub Login
class GitHubLogin(APIView):
    permission_classes = []

    def post(self, request):
        code = request.data.get("code")
        return GitHub_SSO(code,request)
