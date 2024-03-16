from django.test import TestCase
from django.utils.text import slugify

from files.models import File, Tag
from user.models import User


class FileModelTestCase(TestCase):
    fixtures = ["files/fixtures/test.json"]

    def setUp(self):
        self.user = User.objects.get(username="authoruser")
        File.objects.create(author=self.user, file="test_file.txt")

    def test_file_creation(self):
        file_instance = File.objects.get(file="test_file.txt")
        self.assertEqual(file_instance.author.username, self.user.username)
        self.assertEqual(file_instance.file, "test_file.txt")

    def test_string_representation(self):
        file_instance = File.objects.get(file="test_file.txt")
        expected_string = f"{self.user.username}'s file №{file_instance.id}"
        self.assertEqual(str(file_instance), expected_string)

    def test_manager_method_by_author(self):
        files_by_author = list(File.objects.by_author(self.user).all())
        self.assertEqual(files_by_author, list(self.user.files.all()))


class TagModelTest(TestCase):
    fixtures = ["files/fixtures/test.json"]

    def test_creation(self):
        tag = Tag.objects.create(title='New Tag')
        self.assertEqual(tag.slug, slugify(tag.title, allow_unicode=True))
        
    def test_string_representation(self):
        tag = Tag.objects.get(pk=1)
        self.assertEqual(str(tag), tag.title)

    def test_unique_title_constraint(self):
        tag_title = "Unique Tag"
        Tag.objects.create(title=tag_title)
        with self.assertRaises(Exception):
            Tag.objects.create(title=tag_title)
            
    def test_files_related_name(self):
        tag = Tag.objects.get(pk=1)
        file = File.objects.get(pk=1)
        count = file.tags.count()
        tag.files.add(file)
        file.refresh_from_db()
        self.assertEqual(file.tags.count(), count + 1)
        self.assertEqual(file.tags.last(), tag)

    def test_file_tags_related_name(self):
        tag = Tag.objects.get(pk=1)
        file = File.objects.get(pk=1)
        count = tag.files.count()
        file.tags.add(tag)
        tag.refresh_from_db()
        self.assertEqual(tag.files.count(), count + 1)
        self.assertEqual(tag.files.last(), file)

    def test_tag_files_add_remove(self):
        tag = Tag.objects.get(pk=1)
        file = File.objects.get(pk=1)
        count = tag.files.count()
        tag.files.add(file)
        self.assertEqual(tag.files.count(), count + 1)

        tag.files.remove(file)
        self.assertEqual(tag.files.count(), count)

    def test_file_tags_add_remove(self):
        tag = Tag.objects.get(pk=1)
        file = File.objects.get(pk=1)
        count = file.tags.count()
        file.tags.add(tag)
        self.assertEqual(file.tags.count(), count + 1)

        file.tags.remove(tag)
        self.assertEqual(file.tags.count(), count)
