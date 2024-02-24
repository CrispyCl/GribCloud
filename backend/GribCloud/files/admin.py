from django.contrib import admin

from files.models import File


class FileAdmin(admin.ModelAdmin):
    model = File

    list_display = ("file", "author", "is_video", "created_at")
    list_filter = ("is_video", "author")
    search_fields = ("author__username",)
    readonly_fields = ("created_at",)


admin.site.register(File, FileAdmin)
