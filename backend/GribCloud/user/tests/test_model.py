from django.contrib.auth import get_user_model
from django.test import TestCase

User = get_user_model()


class UserTestCase(TestCase):
    def test_create_user(self):
        user = User.objects.create_user(username="testuser", email="test@example.com", password="password123")
        self.assertEqual(user.username, "testuser")
        self.assertEqual(user.email, "test@example.com")
        self.assertFalse(user.is_superuser)
        self.assertFalse(user.is_staff)
        self.assertTrue(user.check_password("password123"))

    def test_create_superuser(self):
        superuser = User.objects.create_superuser(username="admin", email="admin@example.com", password="admin123")
        self.assertTrue(superuser.is_superuser)
        self.assertTrue(superuser.is_staff)
