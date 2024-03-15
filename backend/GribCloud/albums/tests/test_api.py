from django.contrib.auth import get_user_model
from django.urls import reverse
import parameterized
from rest_framework import status
from rest_framework.test import APITestCase

from albums.models import Album, AlbumMembership
from files.models import File

User = get_user_model()


class AlbumsPublicAPIViewTests(APITestCase):
    fixtures = ["albums/fixtures/test.json"]

    def test_get(self):
        response = self.client.get(reverse("albums:public"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_fields(self):
        response = self.client.get(reverse("albums:public"))
        albums = response.data

        self.assertTrue(all(album["is_public"] for album in albums))

        album = albums[0]

        self.assertIn("id", album)
        self.assertIn("title", album)
        self.assertIn("author", album)
        self.assertIn("is_public", album)
        self.assertIn("files", album)
        self.assertIn("memberships", album)
        self.assertIn("created_at", album)


class AlbumsMyAPIViewTests(APITestCase):
    fixtures = ["albums/fixtures/test.json"]

    def setUp(self):
        self.user = User.objects.get(username="authoruser")
        self.client.force_authenticate(user=self.user)

    def test_unauthorized_access(self):
        self.client.logout()
        response = self.client.get(reverse("albums:my"))

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get(self):
        response = self.client.get(reverse("albums:my"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_fields(self):
        response = self.client.get(reverse("albums:my"))
        albums = response.data

        self.assertTrue(all(album["author"]["id"] == self.user.id for album in albums))

        album = albums[0]

        self.assertIn("id", album)
        self.assertIn("title", album)
        self.assertIn("author", album)
        self.assertIn("is_public", album)
        self.assertIn("files", album)
        self.assertIn("memberships", album)
        self.assertIn("created_at", album)

    def test_create(self):
        count = Album.objects.count()
        url = reverse("albums:my")
        data = {"title": "New album"}

        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Album.objects.count(), count + 1)

    @parameterized.parameterized.expand(
        [
            ({},),
            ({"title": ""},),
        ],
    )
    def test_create_invalid(self, data):
        url = reverse("files:list")

        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class AlbumsAvailableAPIViewTests(APITestCase):
    fixtures = ["albums/fixtures/test.json"]

    def setUp(self):
        self.user = User.objects.get(username="memberuser")
        self.client.force_authenticate(user=self.user)

    def test_unauthorized_access(self):
        self.client.logout()
        response = self.client.get(reverse("albums:available"))

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get(self):
        response = self.client.get(reverse("albums:available"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_fields(self):
        response = self.client.get(reverse("albums:available"))
        albums = response.data
        memberships = (album["memberships"] for album in albums)

        self.assertTrue(
            all(any(member["member"] == self.user.id for member in membership) for membership in memberships),
        )

        album = albums[0]

        self.assertIn("id", album)
        self.assertIn("title", album)
        self.assertIn("author", album)
        self.assertIn("is_public", album)
        self.assertIn("files", album)
        self.assertIn("memberships", album)
        self.assertIn("created_at", album)


class AlbumsDetailAPIViewTests(APITestCase):
    fixtures = ["albums/fixtures/test.json"]

    def test_get_public_unauthorized(self):
        response = self.client.get(reverse("albums:detail", kwargs={"pk": 3}))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @parameterized.parameterized.expand(
        [
            ("authoruser", status.HTTP_200_OK),
            ("memberuser", status.HTTP_200_OK),
            ("testuser", status.HTTP_200_OK),
        ],
    )
    def test_get_public(self, user, status):
        self.client.force_login(User.objects.get(username=user))
        response = self.client.get(reverse("albums:detail", kwargs={"pk": 3}))
        self.assertEqual(response.status_code, status)

    @parameterized.parameterized.expand(
        [
            ("authoruser", status.HTTP_200_OK),
            ("memberuser", status.HTTP_200_OK),
            ("testuser", status.HTTP_403_FORBIDDEN),
        ],
    )
    def test_get_private(self, user, status):
        self.client.force_login(User.objects.get(username=user))
        response = self.client.get(reverse("albums:detail", kwargs={"pk": 1}))
        self.assertEqual(response.status_code, status)

    @parameterized.parameterized.expand(
        [
            ("authoruser", status.HTTP_204_NO_CONTENT),
            ("redactoruser", status.HTTP_403_FORBIDDEN),
        ],
    )
    def test_delete(self, user, status):
        self.client.force_login(User.objects.get(username=user))
        response = self.client.delete(reverse("albums:detail", kwargs={"pk": 1}))
        self.assertEqual(response.status_code, status)

    @parameterized.parameterized.expand(
        [
            ("authoruser", status.HTTP_200_OK),
            ("redactoruser", status.HTTP_403_FORBIDDEN),
        ],
    )
    def test_put(self, user, status):
        self.client.force_login(User.objects.get(username=user))
        data = {"title": "New title", "is_public": True}
        response = self.client.put(reverse("albums:detail", kwargs={"pk": 1}), data=data)
        self.assertEqual(response.status_code, status)


class AlbumsFilesAPIViewTests(APITestCase):
    fixtures = ["albums/fixtures/test.json"]

    def test_post_unauthorized(self):
        response = self.client.post(reverse("albums:files", kwargs={"album_id": 3, "file_id": 1}))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @parameterized.parameterized.expand(
        [
            ("authoruser", status.HTTP_200_OK),
            ("redactoruser", status.HTTP_403_FORBIDDEN),
            ("memberuser", status.HTTP_403_FORBIDDEN),
            ("testuser", status.HTTP_403_FORBIDDEN),
        ],
    )
    def test_post_author_file(self, user, status):
        self.client.force_login(User.objects.get(username=user))
        response = self.client.post(reverse("albums:files", kwargs={"album_id": 1, "file_id": 1}))
        self.assertEqual(response.status_code, status)

    @parameterized.parameterized.expand(
        [
            ("authoruser", status.HTTP_403_FORBIDDEN),
            ("redactoruser", status.HTTP_200_OK),
            ("memberuser", status.HTTP_403_FORBIDDEN),
            ("testuser", status.HTTP_403_FORBIDDEN),
        ],
    )
    def test_post_redactor_file(self, user, status):
        self.client.force_login(User.objects.get(username=user))
        response = self.client.post(reverse("albums:files", kwargs={"album_id": 1, "file_id": 2}))
        self.assertEqual(response.status_code, status)

    def test_post_file_found(self):
        self.client.force_login(User.objects.get(username="authoruser"))
        album = Album.objects.get(pk=1)
        album.files.add(File.objects.get(pk=1))
        response = self.client.post(reverse("albums:files", kwargs={"album_id": 1, "file_id": 1}))
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

    @parameterized.parameterized.expand(
        [
            ("authoruser", status.HTTP_200_OK),
            ("redactoruser", status.HTTP_200_OK),
            ("memberuser", status.HTTP_403_FORBIDDEN),
            ("testuser", status.HTTP_403_FORBIDDEN),
        ],
    )
    def test_delete_author_file(self, user, status):
        self.client.force_login(User.objects.get(username=user))
        album = Album.objects.get(pk=1)
        album.files.add(File.objects.get(pk=1))
        response = self.client.delete(reverse("albums:files", kwargs={"album_id": 1, "file_id": 1}))
        self.assertEqual(response.status_code, status)

    def test_delete_file_not_found(self):
        self.client.force_login(User.objects.get(username="authoruser"))
        response = self.client.delete(reverse("albums:files", kwargs={"album_id": 1, "file_id": 1}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class AlbumsMembersAPIViewTests(APITestCase):
    fixtures = ["albums/fixtures/test.json"]

    def test_post_unauthorized(self):
        response = self.client.post(reverse("albums:members", kwargs={"album_id": 3, "member_id": 2}))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @parameterized.parameterized.expand(
        [
            ("authoruser", status.HTTP_200_OK),
            ("redactoruser", status.HTTP_403_FORBIDDEN),
            ("memberuser", status.HTTP_403_FORBIDDEN),
            ("testuser", status.HTTP_403_FORBIDDEN),
        ],
    )
    def test_post(self, user, status):
        self.client.force_login(User.objects.get(username=user))
        data = {"is_redactor": False}
        response = self.client.post(reverse("albums:members", kwargs={"album_id": 1, "member_id": 2}), data=data)
        self.assertEqual(response.status_code, status)

    def test_post_update_member_is_redactor(self):
        self.client.force_login(User.objects.get(username="authoruser"))
        membership = AlbumMembership.objects.create(
            album=Album.objects.get(pk=1),
            member=User.objects.get(pk=2),
            is_redactor=False,
        )
        data = {"is_redactor": True}
        response = self.client.post(reverse("albums:members", kwargs={"album_id": 1, "member_id": 2}), data=data)
        membership.refresh_from_db()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(membership.is_redactor)

    @parameterized.parameterized.expand(
        [
            ("authoruser", status.HTTP_200_OK),
            ("redactoruser", status.HTTP_403_FORBIDDEN),
            ("memberuser", status.HTTP_403_FORBIDDEN),
            ("testuser", status.HTTP_403_FORBIDDEN),
        ],
    )
    def test_delete(self, user, status):
        album = Album.objects.get(pk=1)
        album.members.add(User.objects.get(pk=2))
        self.client.force_login(User.objects.get(username=user))
        response = self.client.delete(reverse("albums:members", kwargs={"album_id": 1, "member_id": 2}))
        self.assertEqual(response.status_code, status)

    def test_delete_member_not_found(self):
        self.client.force_login(User.objects.get(username="authoruser"))
        response = self.client.delete(reverse("albums:members", kwargs={"album_id": 1, "member_id": 2}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
