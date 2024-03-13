from django.utils.translation import pgettext_lazy
from rest_framework import serializers

from files.models import File
from user.models import User


class FileCreateSerializer(serializers.Serializer):
    files = serializers.ListField(child=serializers.CharField())
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
        return data

    def create(self, validated_data):
        request = self.context.get("request")
        if request:
            user = request.user
        else:
            user = validated_data.get("author")
        files = validated_data.pop("files")
        answer = []
        for file_path in files:
            file_instance = File(author=user, file=file_path)
            answer.append(file_instance)
            file_instance.save()
        return answer


class FileSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source="author.username")

    class Meta:
        model = File
        fields = ["id", "author", "author_username", "file", "created_at"]
