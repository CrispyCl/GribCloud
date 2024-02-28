from rest_framework import serializers

from files.models import File


class FileCreateSerializer(serializers.ModelSerializer):
    files = serializers.ListField(child=serializers.CharField())

    class Meta:
        model = File
        fields = ["files"]

    def create(self, validated_data):
        request = self.context.get("request")
        user = request.user
        file_paths = validated_data.pop("files")
        for file_path in file_paths:
            file_instance = File(author=user, file=file_path)
            file_instance.save()
        return file_instance


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ["id", "author", "file", "created_at"]
