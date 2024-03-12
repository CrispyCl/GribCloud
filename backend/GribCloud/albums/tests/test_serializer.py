from django.contrib.auth import get_user_model
from django.test import TestCase

from albums.models import Album, AlbumMembership
from albums.serializers import AlbumMembershipSerializer, AlbumSerializer

User = get_user_model()


class TestAlbumSerializer(TestCase):
    fixtures = ["albums/fixtures/test.json"]

    def test_create(self):
        user = User.objects.get(username="authoruser")
        data = {"title": "New album"}
        serializer = AlbumSerializer(data=data)
        serializer.author = user

        self.assertTrue(serializer.is_valid())

    def test_contains_expected_fields(self):
        album = Album.objects.get(title="Album public")
        serializer = AlbumSerializer(album)

        self.assertEqual(
            set(serializer.data.keys()),
            {"id", "title", "author", "is_public", "files", "memberships", "created_at"},
        )


class TestAlbumMembershipSerializer(TestCase):
    fixtures = ["albums/fixtures/test.json"]

    def test_contains_expected_fields(self):
        user = User.objects.get(username="memberuser")
        album = Album.objects.get(title="Album private")

        membership = AlbumMembership.objects.create(member=user, is_redactor=False, album=album)
        serializer = AlbumMembershipSerializer(membership)

        self.assertEqual(set(serializer.data.keys()), {"member", "is_redactor"})
