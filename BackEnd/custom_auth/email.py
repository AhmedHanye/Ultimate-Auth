from djoser.email import (
    ActivationEmail as BaseActivationEmail,
    ConfirmationEmail as BaseConfirmationEmail,
    PasswordResetEmail as BasePasswordResetEmail,
    PasswordChangedConfirmationEmail as BasePasswordChangedConfirmationEmail,
    UsernameResetEmail as BaseUsernameResetEmail,
    UsernameChangedConfirmationEmail as BaseUsernameChangedConfirmationEmail,
)
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings as django_settings
from django.utils.module_loading import import_string


# * Custom Email Modifications
class ActivationEmail(BaseActivationEmail):
    template_name = "email/activation.html"


class ConfirmationEmail(BaseConfirmationEmail):
    template_name = "email/confirmation.html"


class PasswordReset(BasePasswordResetEmail):
    template_name = "email/password_reset.html"


class PasswordChangedConfirmation(BasePasswordChangedConfirmationEmail):
    template_name = "email/password_changed_confirmation.html"


class UsernameReset(BaseUsernameResetEmail):
    template_name = "email/username_reset.html"


class UsernameChangedConfirmation(BaseUsernameChangedConfirmationEmail):
    template_name = "email/username_changed_confirmation.html"


# * Custom Email addons
def resend_activation_email(request, user, context):
    email_class_path = django_settings.DJOSER["EMAIL"]["activation"]
    email_class = import_string(email_class_path)
    to = [user.email]
    email_class(request, context).send(to)


# TODO: Remove the email username next to DEFAULT_FROM_EMAIL
def send_custom_email(subject, template, context, to):
    email_body = render_to_string(f"email/{template}", context)
    send_mail(
        subject,
        "",
        django_settings.DEFAULT_FROM_EMAIL,
        [to],
        fail_silently=False,
        html_message=email_body,
    )


def registration_attempt_email(email, context):
    send_custom_email(
        "Registration Attempt Notification", "registration_attempt.html", context, email
    )


def login_notification_email(email, context):
    send_custom_email("Login Notification", "login.html", context, email)
