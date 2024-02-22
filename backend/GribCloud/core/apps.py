from django.apps import AppConfig
from django.utils.translation import pgettext_lazy


class CoreConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "core"
    verbose_name = pgettext_lazy("app name", "core")
