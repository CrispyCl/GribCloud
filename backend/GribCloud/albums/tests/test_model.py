from django.test import TestCase

from albums.models import Album, AlbumMembership
from user.models import User


class AlbumModelTestCase(TestCase):
    fixtures = ["albums/fixtures/test.json"]

    def test_creation(self):
        user = User.objects.get(username="authoruser")
        Album.objects.create(author=user, title="album1")
        album = Album.objects.get(title="album1", author__username="authoruser")
        self.assertEqual(album.author.username, "authoruser")
        self.assertEqual(album.title, "album1")
        self.assertEqual(album.is_public, False)

    def test_string_representation(self):
        album = Album.objects.get(pk=1)
        expected_string = album.title
        self.assertEqual(str(album), expected_string)

    def test_manager_method_public(self):
        public_album = Album.objects.get(title="Album public")
        private_album = Album.objects.get(title="Album private")

        public_albums = list(Album.objects.public().all())

        self.assertIn(public_album, public_albums)
        self.assertNotIn(private_album, public_albums)

    def test_manager_method_by_author(self):
        user = User.objects.get(username="authoruser")
        albums_by_author = list(Album.objects.by_author(user).all())
        self.assertEqual(albums_by_author, list(user.my_albums.all()))

    def test_manager_method_by_member(self):
        member = User.objects.get(username="memberuser")
        albums_by_member = list(Album.objects.by_member(member).all())
        self.assertEqual(albums_by_member, list(member.albums.all()))

    def test_method_is_member(self):
        user = User.objects.get(username="admin")
        member = User.objects.get(username="memberuser")
        album = Album.objects.get(title="Album private with members")

        self.assertFalse(album.is_member(user))
        self.assertTrue(album.is_member(member))

    def test_method_is_redactor(self):
        redactor = User.objects.get(username="redactoruser")
        member = User.objects.get(username="memberuser")
        album = Album.objects.get(title="Album private with members")

        self.assertFalse(album.is_redactor(member))
        self.assertTrue(album.is_redactor(redactor))


class AlbumMembershipTestCase(TestCase):
    fixtures = ["albums/fixtures/test.json"]

    def test_creation(self):
        album = Album.objects.get(title="Album private")
        member = User.objects.get(username="memberuser")
        membership = AlbumMembership.objects.create(member=member, album=album)
        self.assertFalse(membership.is_redactor)

        album.refresh_from_db()
        member.refresh_from_db()
        self.assertIn(member, album.members.all())
        self.assertIn(album, member.albums.all())

    def test_add_redactor(self):
        album = Album.objects.get(title="Album private")
        member = User.objects.get(username="memberuser")
        membership = AlbumMembership.objects.create(member=member, album=album, is_redactor=True)
        self.assertTrue(membership.is_redactor)
