from django.contrib.auth import get_user_model
from django.test import TestCase
import parameterized

from files.models import File, Tag
from files.serializers import FileCreateSerializer, FileSerializer, TagSerializer

User = get_user_model()


class FileCreateSerializerTestCase(TestCase):
    fixtures = ["files/fixtures/test.json"]

    def setUp(self):
        self.user = User.objects.get(username="authoruser")

    @parameterized.parameterized.expand(
        [
            ({},),
            ({"files": [], "author": 3},),
            ({"files": [{"file": "path/to/file1.jpg"}], "author": 3},),
            ({"files": [{"preview": "preview/to/file1.jpg"}], "author": 3},),
            ({"files": [{"file": "path/to/file1.jpg", "preview": "preview/to/file1.jpg"}]},),
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
                        {"file": "path/to/file1.jpg", "preview": "preview/to/file1.jpg", "geodata": {"latitude": 1}},
                    ],
                    "author": 3,
                },
            ),
            (
                {
                    "files": [
                        {"file": "path/to/file1.jpg", "preview": "preview/to/file1.jpg", "geodata": {"longitude": 1}},
                    ],
                    "author": 3,
                },
            ),
        ],
    )
    def test_create_invalid(self, data):
        serializer = FileCreateSerializer(data=data)

        self.assertFalse(serializer.is_valid())

    def test_create(self):
        data = {
            "files": [
                {"file": "path/to/file1.jpg", "preview": "preview/to/file1.jpg"},
                {"file": "path/to/file2.jpg", "preview": "preview/to/file2.jpg"},
            ],
            "author": self.user.id,
        }
        serializer = FileCreateSerializer(data=data)
        count1 = File.objects.count()
        count2 = File.objects.filter(author=self.user).count()

        self.assertTrue(serializer.is_valid())
        serializer.save()

        self.assertEqual(File.objects.count(), count1 + 2)
        self.assertEqual(File.objects.filter(author=self.user).count(), count2 + 2)

    @parameterized.parameterized.expand(
        [
            (
                {
                    "files": [
                        {
                            "file": "path/to/file1.jpg",
                            "preview": "preview/to/file1.jpg",
                            "geodata": {"latitude": 56.855338, "longitude": 60.605306},
                        },
                    ],
                    "author": 3,
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
                    ],
                    "author": 3,
                },
            ),
        ],
    )
    def test_create_with_geodata(self, data):
        serializer = FileCreateSerializer(data=data)
        count1 = File.objects.count()
        count2 = File.objects.filter(author=self.user).count()

        self.assertTrue(serializer.is_valid())
        serializer.save()

        self.assertEqual(File.objects.count(), count1 + 1)
        self.assertEqual(File.objects.filter(author=self.user).count(), count2 + 1)


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
