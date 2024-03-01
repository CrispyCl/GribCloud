from django.test import Client
from django.urls import reverse
import parameterized
from rest_framework import status
from rest_framework.test import APITestCase

from user.models import User
from user.serializers import UserSerializer


class UserAPIUrlsTestCase(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create(username="testuser1", email="test1@example.com")
        self.user2 = User.objects.create(username="testuser2", email="test2@example.com")

    def test_list(self):
        url = reverse("users:list")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_detail(self):
        url = reverse("users:detail", kwargs={"pk": self.user1.id})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "testuser1")


class UserAPIPermissionsTestCase(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create(username="testuser", email="test@example.com", password="password123")
        self.user2 = User.objects.create(username="testuser2", email="test2@example.com", password="password123")

    def test_creation(self):
        url = reverse("users:list")
        data = {"username": "testuser3", "email": "test3@example.com", "password": "password123"}

        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 3)

    def test_valid_retrieve_current_user(self):
        self.client.force_login(self.user1)
        url = reverse("users:my")

        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(UserSerializer(self.user1).data, response.data)

    def test_invalid_retrieve_current_user(self):
        url = reverse("users:my")

        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @parameterized.parameterized.expand(
        [
            (Client().patch, {"username": "111"}),
            (Client().put, {"username": "111", "email": "111@mail.ru"}),
            (Client().delete, {}),
        ],
    )
    def test_invalid(self, method, data):
        url = reverse("users:detail", kwargs={"pk": self.user1.id})

        response = method(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_valid_update_delete(self):
        self.client.force_login(self.user1)
        url = reverse("users:detail", kwargs={"pk": self.user1.id})

        data = {"username": "111", "email": "111@mail.ru", "password": "password123"}
        response = self.client.put(url, data, format="json")
        user = response.data
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(user["username"], "111")
        self.assertEqual(user["email"], "111@mail.ru")

        data = {"username": "testuser"}
        response = self.client.patch(url, data, format="json")
        user = response.data
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(user["username"], "testuser")

        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(User.objects.count(), 1)

    def test_invalid_update_delete(self):
        self.client.force_login(self.user1)
        url = reverse("users:detail", kwargs={"pk": self.user2.id})

        data = {"username": "111", "email": "111@mail.ru", "password": "password123"}
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        data = {"username": "testuser"}
        response = self.client.patch(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class ChangePasswordAPITestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create(username="testuser", email="test@example.com")
        self.user.set_password("password123")
        self.user.save()

    def test_valid(self):
        self.client.force_login(self.user)
        url = reverse("users:change_password")
        data = {"password": "password123", "new_password": "new_password123", "new_password_confirm": "new_password123"}

        response = self.client.post(url, data, format="json")
        self.user.refresh_from_db()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(self.user.check_password("new_password123"))

    @parameterized.parameterized.expand(
        [
            ({},),
            ({"password": "new_password123", "new_password": "password123", "new_password_confirm": "password123"},),
            (
                {
                    "password": "password123",
                    "new_password": "new_password321",
                    "new_password_confirm": "new_password123",
                },
            ),
        ],
    )
    def test_invalid(self, data):
        self.client.force_login(self.user)
        url = reverse("users:change_password")
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
