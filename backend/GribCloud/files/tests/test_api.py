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
        self.file_data = {"files": ["path/to/file1.jpg", "path/to/file2.png"]}

    def test_get_file_list(self):
        response = self.client.get(reverse("files:list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_files(self):
        url = reverse("files:list")
        data = {"files": ["path/to/file1.jpg", "path/to/file2.png"]}

        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(File.objects.count(), 2)

    @parameterized.parameterized.expand(
        [
            ({},),
            ({"files": []},),
            ({"fiiles": ["path/to/file1.jpg", "path/to/file2.png"]},),
        ],
    )
    def test_create_invalid_files(self, data):
        url = reverse("files:list")

        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
