from django.contrib.auth import get_user_model
from django.urls import reverse
import parameterized
from rest_framework import status
from rest_framework.test import APITestCase

from files.models import File, Tag

User = get_user_model()


class FileListAPIViewTests(APITestCase):
    fixtures = ["files/fixtures/test.json"]

    def setUp(self):
        self.user = User.objects.get(username="authoruser")
        self.client.force_authenticate(user=self.user)

    def test_get_file_list(self):
        response = self.client.get(reverse("files:list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @parameterized.parameterized.expand(
        [
            (
                {
                    "files": [
                        {"file": "path/to/file1.jpg", "preview": "preview/to/file1.jpg"},
                        {"file": "path/to/file2.jpg", "preview": "preview/to/file2.jpg"},
                    ],
                },
            ),
            (
                {
                    "files": [
                        {
                            "file": "path/to/file1.jpg",
                            "preview": "preview/to/file1.jpg",
                            "geodata": {
                                "latitude": 56.855338,
                                "longitude": 60.605306,
                                "country": "Russian",
                                "city": "Ekaterinburg",
                            },
                        },
                        {
                            "file": "path/to/file2.jpg",
                            "preview": "preview/to/file2.jpg",
                            "geodata": {
                                "latitude": 55.751244,
                                "longitude": 37.618423,
                            },
                        },
                    ],
                },
            ),
        ],
    )
    def test_create_files(self, data):
        url = reverse("files:list")

        count = File.objects.count()
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(File.objects.count(), count + 2)

    @parameterized.parameterized.expand(
        [
            ({},),
            ({"files": []},),
            ({"files": [{"file": "path/to/file1.jpg"}]},),
            ({"files": [{"preview": "preview/to/file1.jpg"}]},),
            (
                {
                    "files": [
                        {"file": "path/to/file1.jpg", "preview": "preview/to/file1.jpg", "geodata": {"latitude": 1}},
                    ],
                },
            ),
            (
                {
                    "files": [
                        {"file": "path/to/file1.jpg", "preview": "preview/to/file1.jpg", "geodata": {"longitude": 1}},
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
        self.user = User.objects.get(username="authoruser")
        self.client.force_authenticate(user=self.user)

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


class FileTagAPIViewTestCase(APITestCase):
    fixtures = ["files/fixtures/test.json"]

    def setUp(self):
        self.user = User.objects.get(username="authoruser")
        self.file = File.objects.get(file="images/file.jpg")
        self.tag = Tag.objects.get(title="testtag")
        self.url = reverse("files:tags", args=[self.file.pk, self.tag.title])

    def test_get_file_tag(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["file"]["id"], self.file.pk)
        self.assertEqual(response.data["tag"]["title"], self.tag.title)

    def test_get_file_tag_unauthorized(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_file_tag_not_author(self):
        other_user = User.objects.get(username="testuser")
        self.client.force_authenticate(user=other_user)

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_post_file_tag(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.post(self.url)
        self.file.refresh_from_db()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn(self.tag, self.file.tags.all())

    def test_post_file_tag_already_added(self):
        self.client.force_authenticate(user=self.user)
        self.file.tags.add(self.tag)

        response = self.client.post(self.url)

        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

    def test_delete_file_tag(self):
        self.file.tags.add(self.tag)
        self.client.force_authenticate(user=self.user)

        response = self.client.delete(self.url)
        self.file.refresh_from_db()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotIn(self.tag, self.file.tags.all())

    def test_delete_file_tag_not_found(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.delete(self.url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class FileByTagAPIViewTests(APITestCase):
    fixtures = ["files/fixtures/test.json"]

    def setUp(self):
        self.user = User.objects.get(username="authoruser")
        self.client.force_authenticate(user=self.user)

        self.tag1 = Tag.objects.get(title="Red")
        self.tag2 = Tag.objects.get(title="Yellow")
        self.file1 = File.objects.get(file="images/file_with_tags.jpg")
        self.file2 = File.objects.get(file="images/yellow_file.jpg")

    def test_get_files_by_tag(self):
        url = reverse("files:by_tags")
        data = {"tags": ["yellow", "red"]}

        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_get_files_by_all_tags(self):
        url = reverse("files:by_tags")
        data = {"tags": ["yellow", "red"], "filter_all_tags": True}
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], self.file1.id)

    def test_get_files_by_tag_unauthorized(self):
        self.client.logout()
        url = reverse("files:by_tags")
        data = {"tags": ["yellow", "red"]}

        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_files_by_tag_no_tags(self):
        url = reverse("files:by_tags")

        response = self.client.post(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
