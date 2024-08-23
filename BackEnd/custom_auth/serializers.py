from djoser.serializers import UserCreateSerializer
from rest_framework import serializers
from .models import CustomUser
from email_validator import validate_email, EmailNotValidError


# * add a better Email validation to the UserCreateSerializer
class CustomUserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = CustomUser
        fields = ("id", "email", "username", "password")

    def validate(self, data):
        data = super().validate(data)
        email = data.get("email")
        try:
            validate_email(email)
        except EmailNotValidError as e:
            raise serializers.ValidationError({"email": str(e)})
        return data


# * LogOut Serializer
class LogOutSerializer(serializers.Serializer):
    refresh = serializers.CharField(max_length=255, required=False)
    all = serializers.BooleanField()
