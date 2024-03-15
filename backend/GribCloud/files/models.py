from django.conf import settings
from django.db import models
from django.utils.text import slugify
from django.utils.translation import pgettext_lazy

from user.models import User


class FileManager(models.Manager):
    def get_queryset(self):
        return (
            super()
            .get_queryset()
            .select_related("author")
            .prefetch_related(
                models.Prefetch(
                    "tags",
                    Tag.objects.only("id", "title"),
                ),
            )
            .only(
                File.file.field.name,
                File.preview.field.name,
                File.created_at.field.name,
                f"{File.author.field.name}__{User.username.field.name}",
                f"{File.author.field.name}__{User.email.field.name}",
            )
            .order_by("-created_at")
        )

    def by_author(self, author):
        return self.get_queryset().filter(author=author)

    def by_tags(self, tags):
        tags = {slugify(tag, allow_unicode=True) for tag in tags}
        tags = Tag.objects.filter(slug__in=tags)
        return self.get_queryset().filter(tag__in=tags)

    def by_all_tags(self, tags):
        tags = {slugify(tag, allow_unicode=True) for tag in tags}
        tags = Tag.objects.filter(slug__in=tags)

        queryset = self.get_queryset()
        for tag in tags:
            queryset = queryset.filter(tag=tag)

        return queryset


class File(models.Model):
    objects = FileManager()

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name=pgettext_lazy("author field name", "author"),
        on_delete=models.CASCADE,
        related_name="files",
        related_query_name="file",
    )
    file = models.CharField(
        verbose_name=pgettext_lazy("file field name", "file"),
        max_length=1024,
    )
    preview = models.CharField(
        verbose_name=pgettext_lazy("preview field name", "file preview"),
        max_length=1024,
    )
    created_at = models.DateTimeField(
        pgettext_lazy("created_at field name", "created at"),
        auto_now_add=True,
    )

    class Meta:
        verbose_name = pgettext_lazy("File model verbose name", "file")
        verbose_name_plural = pgettext_lazy("File model verbose name plural", "files")

    def __str__(self) -> str:
        return f"{self.author.username}'s file №{self.id}"


class Tag(models.Model):
    title = models.CharField(
        verbose_name=pgettext_lazy("title field name", "title"),
        max_length=100,
        unique=True,
    )
    slug = models.SlugField(
        max_length=150,
        blank=True,
    )
    files = models.ManyToManyField(
        File,
        verbose_name=pgettext_lazy("files field name", "files"),
        related_name="tags",
        related_query_name="tag",
    )

    class Meta:
        verbose_name = pgettext_lazy("Tag model verbose name", "tag")
        verbose_name_plural = pgettext_lazy("Tag model verbose name plural", "tags")

    def __str__(self) -> str:
        return self.title

    def save(self, *args, **kwargs):
        self.slug = slugify(self.title, allow_unicode=True)

        super().save(*args, **kwargs)
