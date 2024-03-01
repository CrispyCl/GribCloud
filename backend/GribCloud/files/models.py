from django.conf import settings
from django.db import models
from django.utils.translation import pgettext_lazy


class FileManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().select_related("author")

    def by_author(self, author):
        return self.get_queryset().filter(author=author).only("id", "author", "author__username", "file", "created_at")


class File(models.Model):
    objects = FileManager()

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name=pgettext_lazy("author field name", "author"),
        on_delete=models.CASCADE,
        related_name="files",
        related_query_name="file",
    )
    file = models.CharField(verbose_name=pgettext_lazy("file field name", "file"), max_length=1024)
    created_at = models.DateTimeField(
        pgettext_lazy("created_at field name", "created at"),
        auto_now_add=True,
    )

    class Meta:
        verbose_name = pgettext_lazy("File model verbose name", "file")
        verbose_name_plural = pgettext_lazy("File model verbose name plural", "files")

    def __str__(self) -> str:
        return f"{self.author.username}'s file №{self.id}"
