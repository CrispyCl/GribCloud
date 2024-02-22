from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from user.models import User


class JWTAuthenticationTestCase(APITestCase):
    ordered = True

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", email="test@example.com", password="password123")

    def test_jwt_authentication(self):
        url = reverse("token_obtain_pair")
        data = {"username": "testuser", "password": "password123"}
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)

        access = response.data["access"]

        url = reverse("users:detail", kwargs={"pk": self.user.id})
        response = self.client.patch(url, {"username": "testuser2"}, HTTP_AUTHORIZATION=f"Bearer {access}")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "testuser2")

    def test_jwt_refresh_token(self):
        url = reverse("token_obtain_pair")
        data = {"username": "testuser", "password": "password123"}
        response = self.client.post(url, data, format="json")
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        access1 = response.data["access"]
        refresh = response.data["refresh"]

        url = reverse("token_refresh")
        data = {"refresh": refresh}
        response = self.client.post(url, data, format="json")

        self.assertIn("access", response.data)

        access2 = response.data["access"]
        self.assertNotEqual(access1, access2)
