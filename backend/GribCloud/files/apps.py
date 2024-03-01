from django.apps import AppConfig
from django.utils.translation import pgettext_lazy


class FilesConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "files"
    verbose_name = pgettext_lazy("app name", "files")
