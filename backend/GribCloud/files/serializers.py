from django.utils.translation import gettext_lazy, pgettext_lazy
from rest_framework import serializers

from files.models import File, Tag
from user.models import User


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "title"]


class FileCreateSerializer(serializers.Serializer):
    files = serializers.ListField(child=serializers.ListField(child=serializers.CharField()))
    author = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)

    def validate(self, data):
        request = self.context.get("request")
        if request:
            user = request.user
            if not user:
                user = data.get("author")
                if not user:
                    raise serializers.ValidationError(
                        {
                            "author": pgettext_lazy(
                                "File Create Serializer validation error no author",
                                "Author not provided",
                            ),
                        },
                        code="required",
                        field="author",
                    )
        else:
            user = data.get("author")
            if not user:
                raise serializers.ValidationError(
                    {
                        "author": pgettext_lazy(
                            "File Create Serializer validation error no author",
                            "Author not provided",
                        ),
                    },
                    code="required",
                )
        if not data.get("files"):
            raise serializers.ValidationError(
                {
                    "files": pgettext_lazy(
                        "File Create Serializer validation error no files",
                        "No files provided",
                    ),
                },
                code="required",
            )
        if any(len(file) != 2 for file in data.get("files")):
            raise serializers.ValidationError(
                {
                    "files": gettext_lazy(
                        "The file should be a list with file_path and preview_path.",
                    ),
                },
            )
        return data

    def create(self, validated_data):
        request = self.context.get("request")
        if request:
            user = request.user
        else:
            user = validated_data.get("author")
        files = validated_data.pop("files")
        answer = []
        for file in files:
            path, preview = file
            file_instance = File(author=user, file=path, preview=preview)
            answer.append(file_instance)
            file_instance.save()
        return answer


class FileSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source="author.username")
    tags = TagSerializer(many=True)

    class Meta:
        model = File
        fields = ["id", "author", "author_username", "file", "preview", "tags", "created_at"]
