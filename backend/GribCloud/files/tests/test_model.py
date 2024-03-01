from django.test import TestCase

from files.models import File
from user.models import User


class FileModelTestCase(TestCase):
    fixtures = ["files/fixtures/test.json"]

    def setUp(self):
        user = User.objects.get(username="testuser")
        File.objects.create(author=user, file="test_file.txt")

    def test_file_creation(self):
        file_instance = File.objects.get(file="test_file.txt")
        self.assertEqual(file_instance.author.username, "testuser")
        self.assertEqual(file_instance.file, "test_file.txt")

    def test_string_representation(self):
        file_instance = File.objects.get(file="test_file.txt")
        expected_string = "testuser's file №1"
        self.assertEqual(str(file_instance), expected_string)

    def test_manager_method_by_author(self):
        user = User.objects.get(username="testuser")
        files_by_author = list(File.objects.by_author(user).all())
        self.assertEqual(files_by_author, list(user.files.all()))
