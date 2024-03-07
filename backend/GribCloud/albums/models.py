from django.conf import settings
from django.db import models
from django.utils.translation import pgettext_lazy

from files.models import File
from user.models import User


class AlbumManager(models.Manager):
    def get_queryset(self):
        return (
            super()
            .get_queryset()
            .select_related("author")
            .prefetch_related(
                models.Prefetch(
                    Album.members.field.name,
                    User.objects.only("id", "username"),
                ),
            )
            .prefetch_related(
                models.Prefetch(
                    Album.files.field.name,
                    File.objects.all(),
                ),
            )
            .only(
                Album.title.field.name,
                Album.is_public.field.name,
                Album.created_at.field.name,
                f"{Album.author.field.name}__{User.username.field.name}",
                f"{Album.author.field.name}__{User.email.field.name}",
                f"{Album.author.field.name}__{User.date_joined.field.name}",
            )
        )

    def public(self):
        return self.get_queryset().filter(is_public=True)


class Album(models.Model):
    objects = AlbumManager()

    title = models.CharField(
        verbose_name=pgettext_lazy("title field name", "title"),
        max_length=100,
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name=pgettext_lazy("author field name", "author"),
        on_delete=models.CASCADE,
        related_name="my_albums",
        related_query_name="my_album",
    )
    files = models.ManyToManyField(
        File,
        verbose_name=pgettext_lazy("files field name", "files"),
        related_name="albums",
        related_query_name="album",
    )
    members = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        verbose_name=pgettext_lazy("members field name", "members"),
        related_name="albums",
        related_query_name="album",
    )
    is_public = models.BooleanField(
        pgettext_lazy("is_public field name", "is public"),
        default=False,
    )
    created_at = models.DateTimeField(
        pgettext_lazy("created_at field name", "created at"),
        auto_now_add=True,
    )

    class Meta:
        verbose_name = pgettext_lazy("Album model verbose name", "album")
        verbose_name_plural = pgettext_lazy("Album model verbose name plural", "albums")

    def __str__(self) -> str:
        return self.title
