from django.contrib import admin

from files.models import File, Tag


class TagAdmin(admin.ModelAdmin):
    model = Tag

    list_display = ["title", "slug"]
    list_filter = ["slug"]
    search_fields = ["slug"]
    readonly_fields = ("slug",)
    exclude = ("files",)

    def title(self, obj):
        return obj


class FileTagsInline(admin.TabularInline):
    model = File.tags.through
    extra = 0


class FileAdmin(admin.ModelAdmin):
    model = File

    list_display = ("title", "author", "created_at")
    list_filter = ("author",)
    search_fields = ("author__username",)
    readonly_fields = ("created_at",)
    inlines = (FileTagsInline,)

    def title(self, obj):
        return obj


admin.site.register(File, FileAdmin)
admin.site.register(Tag, TagAdmin)
