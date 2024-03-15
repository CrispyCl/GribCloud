from django.urls import reverse
import parameterized
from rest_framework import status
from rest_framework.test import APITestCase

from files.models import File
from user.models import User


class FileListAPIViewTests(APITestCase):
    fixtures = ["files/fixtures/test.json"]

    def setUp(self):
        self.user = User.objects.get(username="testuser")
        self.client.force_authenticate(user=self.user)

    def test_get_file_list(self):
        response = self.client.get(reverse("files:list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_files(self):
        url = reverse("files:list")
        data = {"files": [["path/to/file1.jpg", "preview/to/file1.jpg"], ["path/to/file2.jpg", "preview/to/file2.jpg"]]}

        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(File.objects.count(), 2)

    @parameterized.parameterized.expand(
        [
            ({},),
            ({"files": []},),
            ({"files": ["path/to/file1.jpg", "path/to/file2.png"]},),
            (
                {
                    "fiiles": [
                        ["path/to/file1.jpg", "preview/to/file1.jpg"],
                        ["path/to/file2.jpg", "preview/to/file2.jpg"],
                    ],
                },
            ),
        ],
    )
    def test_create_invalid_files(self, data):
        url = reverse("files:list")

        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class FileDetailAPIViewTests(APITestCase):
    fixtures = ["files/fixtures/test.json"]

    def setUp(self):
        self.user = User.objects.get(username="testuser")
        self.client.force_authenticate(user=self.user)
        self.client.post(reverse("files:list"), {"files": [["files/1.jpg", "previews/1.jpg"]]}, format="json")

    def test_get(self):
        url = reverse("files:detail", kwargs={"pk": 1})

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        file = response.data
        list_in = ["id", "author", "file", "created_at"]
        for el in list_in:
            self.assertIn(el, file)

    def test_delete(self):
        url = reverse("files:detail", kwargs={"pk": 1})

        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_post(self):
        url = reverse("files:detail", kwargs={"pk": 1})

        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_patch(self):
        url = reverse("files:detail", kwargs={"pk": 1})

        response = self.client.patch(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_unauthorized_access(self):
        self.client.logout()
        url = reverse("files:detail", kwargs={"pk": 1})

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_non_author_access(self):
        user = User.objects.get(username="admin")
        self.client.force_authenticate(user=user)
        url = reverse("files:detail", kwargs={"pk": 1})

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
