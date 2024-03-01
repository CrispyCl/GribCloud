from django.test import TestCase

from user.models import User
from user.serializers import ChangePasswordSerializer, UserSerializer


class TestUserSerializer(TestCase):
    fixtures = ["user/fixtures/test.json"]

    def test_create(self):
        data = {"username": "serializer_user", "email": "serializer_user@example.com", "password": "password123"}
        serializer = UserSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        self.assertEqual(user.username, "serializer_user")

    def test_update(self):
        user = User.objects.get(username="testuser")
        data = {
            "username": "newusername",
            "email": "newemail@example.com",
        }
        serializer = UserSerializer(instance=user, data=data, partial=True)
        self.assertTrue(serializer.is_valid())
        updated_user = serializer.save()
        self.assertEqual(updated_user.username, "newusername")
        self.assertEqual(updated_user.email, "newemail@example.com")


class TestChangePasswordSerializer(TestCase):
    def test_valid(self):
        data = {"password": "oldpassword", "new_password": "newpassword", "new_password_confirm": "newpassword"}
        serializer = ChangePasswordSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_not_matching_passwords(self):
        data = {"password": "oldpassword", "new_password": "newpassword", "new_password_confirm": "notmatching"}
        serializer = ChangePasswordSerializer(data=data)
        self.assertFalse(serializer.is_valid())
