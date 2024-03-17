from django.utils.translation import gettext_lazy, pgettext_lazy
from rest_framework import serializers

from files.models import File, GeoData, Tag
from user.models import User


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "title"]


class GeoDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeoData
        fields = ["latitude", "longitude", "country", "city"]


class FileCreateSerializer(serializers.Serializer):
    files = serializers.ListField(child=serializers.DictField())
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
        if any(not (file.get("file") and "preview" in file.keys()) for file in data.get("files")):
            raise serializers.ValidationError(
                {
                    "files": gettext_lazy("The file should be an object: ") + "{'file': str, 'preview': str}",
                },
            )
        for file in data.get("files"):
            if not file.get("geodata"):
                continue
            geodata = file.get("geodata")
            if not (geodata.get("latitude") and geodata.get("longitude")):
                raise serializers.ValidationError(
                    {
                        "files": gettext_lazy("The file should be an object: ") + "{'file': str, 'preview': str,"
                        "'geodata': {'latitude': float, 'longitude': float}}.",
                    },
                )
            if not (type(geodata.get("latitude")) is float and type(geodata.get("longitude")) is float):
                raise serializers.ValidationError(
                    {
                        "files": gettext_lazy("The file should be an object: ") + "{'file': str, 'preview': str,"
                        "'geodata': {'latitude': float, 'longitude': float}}.",
                    },
                )
            if (
                geodata.get("country")
                and not (type(geodata.get("country")) is str)
                or geodata.get("city")
                and not (type(geodata.get("city")) is str)
            ):
                raise serializers.ValidationError(
                    {
                        "files": gettext_lazy("The file should be an object: ") + "{'file': str, 'preview': str,"
                        "'geodata': {'latitude': float, 'longitude': float, 'country': str, 'city': str}}.",
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
            path, preview = file["file"], file["preview"]
            file_instance = File(author=user, file=path, preview=preview)
            file_instance.save()
            if file.get("geodata"):
                geodata = file.get("geodata")
                file_instance.geodata = GeoData(
                    latitude=geodata.get("latitude"),
                    longitude=geodata.get("longitude"),
                )
                if geodata.get("country"):
                    file_instance.geodata.country = geodata.get("country")
                if geodata.get("city"):
                    file_instance.geodata.city = geodata.get("city")
                file_instance.geodata.save()
            answer.append(file_instance)
        return answer


class FileSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source="author.username")
    tags = TagSerializer(many=True)
    geodata = GeoDataSerializer()

    class Meta:
        model = File
        fields = ["id", "author", "author_username", "file", "preview", "geodata", "tags", "created_at"]
