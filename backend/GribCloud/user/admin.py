from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _

from user.models import User


class UserAdmin(BaseUserAdmin):
    model = User

    fieldsets = (
        (
            None,
            {
                "fields": (
                    "username",
                    "password",
                ),
            },
        ),
        (_("Personal info"), {"fields": ("email",)}),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("username", "password1", "password2"),
            },
        ),
    )
    list_display = ("username", "email", "is_staff", "is_superuser")
    list_filter = ("is_staff", "is_superuser", "groups")
    search_fields = ("username", "email")
    readonly_fields = (
        User.date_joined.field.name,
        User.last_login.field.name,
    )


admin.site.register(User, UserAdmin)
