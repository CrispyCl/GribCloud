from django.apps import AppConfig
from django.utils.translation import pgettext_lazy


class UserConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "user"
    verbose_name = pgettext_lazy("app name", "users")
