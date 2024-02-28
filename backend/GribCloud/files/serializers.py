from django.utils.translation import pgettext_lazy
from rest_framework import serializers

from files.models import File


class FileCreateSerializer(serializers.Serializer):
    files = serializers.ListField(child=serializers.CharField())

    def create(self, validated_data):
        request = self.context.get("request")
        user = request.user
        files = validated_data.pop("files")
        if not files:
            raise serializers.ValidationError(
                pgettext_lazy(
                    "File Create Serializer validation error",
                    "No files provided",
                ),
            )
        for file_path in files:
            file_instance = File(author=user, file=file_path)
            file_instance.save()
        return file_instance


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ["id", "author", "file", "created_at"]
