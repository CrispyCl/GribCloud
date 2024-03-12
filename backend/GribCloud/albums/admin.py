from django.contrib import admin

from albums.models import Album


class AlbumFilesInline(admin.TabularInline):
    model = Album.files.through
    extra = 1


class AlbumMembersInline(admin.TabularInline):
    model = Album.members.through
    extra = 1


class AlbumAdmin(admin.ModelAdmin):
    model = Album

    list_display = ("title", "author", "is_public", "created_at")
    list_filter = ("author", "is_public")
    search_fields = ("title", "author__username")
    readonly_fields = ("created_at",)
    exclude = ("files", "members")

    inlines = (AlbumMembersInline, AlbumFilesInline)

    def title(self, obj):
        return obj


admin.site.register(Album, AlbumAdmin)
