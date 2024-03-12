from django.apps import AppConfig
from django.utils.translation import pgettext_lazy


class AlbumsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "albums"
    verbose_name = pgettext_lazy("app name", "albums")
