from django.contrib.auth import get_user_model
from django.test import TestCase

from files.models import File
from files.serializers import FileCreateSerializer, FileSerializer

User = get_user_model()


class FileCreateSerializerTests(TestCase):
    fixtures = ["files/fixtures/test.json"]

    def test_create_with_no_author(self):
        data = {"files": ["file1.txt", "file2.txt"]}
        serializer = FileCreateSerializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertIn("Author not provided", serializer.errors["author"])

    def test_create_with_no_files(self):
        data = {"files": [], "author": 2}
        serializer = FileCreateSerializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertIn("No files provided", serializer.errors["files"])

    def test_create_with_files(self):
        user = User.objects.get(username="testuser")
        data = {"files": ["file1.txt", "file2.txt"], "author": user.id}
        serializer = FileCreateSerializer(data=data)

        self.assertTrue(serializer.is_valid())
        serializer.save()

        self.assertEqual(File.objects.count(), 2)
        self.assertEqual(File.objects.filter(author=user).count(), 2)


class FileSerializerTests(TestCase):
    fixtures = ["files/fixtures/test.json"]

    def test_contains_expected_fields(self):
        file = File.objects.create(file="test.txt", author=User.objects.get(username="testuser"))
        serializer = FileSerializer(file)
        list_in = ["id", "author", "file", "created_at"]
        keys = serializer.data.keys()
        for el in list_in:
            self.assertIn(el, keys)
