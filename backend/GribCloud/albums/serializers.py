from rest_framework import serializers

from albums.models import Album
from files.serializers import FileSerializer
from user.serializers import UserSerializer


class AlbumSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    files = FileSerializer(read_only=True, many=True)

    class Meta:
        model = Album
        fields = ["id", "title", "author", "is_public", "files", "members", "created_at"]

        extra_kwargs = {"members": {"read_only": True}}

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.is_public:
            data.pop("members")
        return data
