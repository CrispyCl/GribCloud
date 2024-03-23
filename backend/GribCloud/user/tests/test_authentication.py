from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from user.models import User


class JWTAuthenticationTestCase(APITestCase):
    fixtures = ["user/fixtures/test.json"]
    ordered = True

    def setUp(self):
        self.user = User.objects.get(username="testuser")

    def test_jwt_authentication(self):
        url = reverse("token_obtain_pair")
        data = {"username": "testuser", "password": "111"}
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)

        access = response.data["access"]

        url = reverse("users:detail", kwargs={"pk": self.user.id})
        response = self.client.patch(url, {"username": "new_testuser"}, HTTP_AUTHORIZATION=f"Bearer {access}")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "new_testuser")

    def test_jwt_email_authentication(self):
        url = reverse("token_obtain_pair")
        data = {"username": "teseuser@mail.ru", "password": "111"}
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)

        access = response.data["access"]

        url = reverse("users:detail", kwargs={"pk": self.user.id})
        response = self.client.patch(url, {"username": "new_testuser"}, HTTP_AUTHORIZATION=f"Bearer {access}")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "new_testuser")

    def test_jwt_refresh_token(self):
        url = reverse("token_obtain_pair")
        data = {"username": "testuser", "password": "111"}
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
