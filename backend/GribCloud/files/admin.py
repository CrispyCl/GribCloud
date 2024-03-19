from django.contrib import admin

from files.models import File, GeoData, Tag


class TagAdmin(admin.ModelAdmin):
    model = Tag

    list_display = ["title", "slug"]
    list_filter = ["slug"]
    search_fields = ["slug"]
    readonly_fields = ("slug",)
    exclude = ("files",)

    def title(self, obj):
        return obj


class GeoDataAdmin(admin.ModelAdmin):
    model = GeoData

    list_display = ["title", "country", "city"]
    list_filter = ["country", "city"]
    search_fields = ["country", "city"]

    def title(self, obj):
        return obj


class FileTagsInline(admin.TabularInline):
    model = File.tags.through
    extra = 0


class GeoDataInline(admin.StackedInline):
    model = GeoData
    extra = 0


class FileAdmin(admin.ModelAdmin):
    model = File

    list_display = ("title", "author", "created_at")
    list_filter = ("author",)
    search_fields = ("author__username",)
    readonly_fields = ("created_at",)
    inlines = (GeoDataInline, FileTagsInline)

    def title(self, obj):
        return obj


admin.site.register(File, FileAdmin)
admin.site.register(Tag, TagAdmin)
admin.site.register(GeoData, GeoDataAdmin)
