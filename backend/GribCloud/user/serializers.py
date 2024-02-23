from django.utils.translation import pgettext_lazy
from rest_framework import serializers

from user.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "avatar", "password", "date_joined"]
        read_only_fields = ["date_joined"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )

    def update(self, instance, validated_data):
        instance.username = validated_data.get("username", instance.username)
        instance.email = validated_data.get("email", instance.email)
        instance.avatar = validated_data.get("avatar", instance.avatar)
        instance.save()
        return instance


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(
        required=True,
        style={"input_type": "password", "placeholder": "Old password"},
    )
    password1 = serializers.CharField(
        required=True,
        style={"input_type": "password", "placeholder": "Password"},
    )
    password2 = serializers.CharField(
        required=True,
        style={"input_type": "password", "placeholder": "Сonfirm password"},
    )

    def validate(self, attrs):
        if attrs["password1"] != attrs["password2"]:
            raise serializers.ValidationError(
                {
                    "password": pgettext_lazy(
                        "Change password serializer validation error",
                        "Password fields didn't match",
                    ),
                },
            )
        return attrs
