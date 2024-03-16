from django.contrib.auth import get_user_model
from django.test import TestCase

from files.models import File, Tag
from files.serializers import FileCreateSerializer, FileSerializer, TagSerializer

User = get_user_model()


class FileCreateSerializerTestCase(TestCase):
    fixtures = ["files/fixtures/test.json"]

    def test_create_with_no_author(self):
        data = {"files": [["images/file1.txt", "preview/file1.txt"], ["images/file2.txt", "preview/file2.txt"]]}
        serializer = FileCreateSerializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertIn("Author not provided", serializer.errors["author"])

    def test_create_with_no_files(self):
        data = {"files": [], "author": 3}
        serializer = FileCreateSerializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertIn("No files provided", serializer.errors["files"])

    def test_create_with_files(self):
        user = User.objects.get(username="authoruser")
        data = {
            "files": [["images/file1.txt", "preview/file1.txt"], ["images/file2.txt", "preview/file2.txt"]],
            "author": user.id,
        }
        serializer = FileCreateSerializer(data=data)
        count1 = File.objects.count()
        count2 = File.objects.filter(author=user).count()

        self.assertTrue(serializer.is_valid())
        serializer.save()

        self.assertEqual(File.objects.count(), count1 + 2)
        self.assertEqual(File.objects.filter(author=user).count(), count2 + 2)


class FileSerializerTestCase(TestCase):
    fixtures = ["files/fixtures/test.json"]

    def test_contains_expected_fields(self):
        file = File.objects.create(file="test.txt", author=User.objects.get(username="testuser"))
        serializer = FileSerializer(file)
        list_in = ["id", "author", "file", "created_at"]
        keys = serializer.data.keys()
        for el in list_in:
            self.assertIn(el, keys)


class TagSerializerTestCase(TestCase):
    fixtures = ["files/fixtures/test.json"]

    def test_contains_expected_fields(self):
        tag = Tag.objects.get(pk=1)

        serializer = TagSerializer(tag)

        self.assertEqual(set(serializer.data.keys()), {"id", "title"})
