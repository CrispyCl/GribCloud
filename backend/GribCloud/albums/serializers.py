from rest_framework import serializers

from albums.models import Album, AlbumMembership
from files.serializers import FileSerializer
from user.serializers import UserSerializer


class AlbumMembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlbumMembership
        fields = ["member", "is_redactor"]


class AlbumSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    memberships = AlbumMembershipSerializer(many=True, read_only=True)
    files = FileSerializer(read_only=True, many=True)

    class Meta:
        model = Album
        fields = ["id", "title", "author", "is_public", "files", "memberships", "created_at"]

        extra_kwargs = {"members": {"read_only": True}}
