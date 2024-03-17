from django.shortcuts import get_object_or_404
from django.utils.text import slugify
from django.utils.translation import gettext_lazy
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.views import APIView

from core.permissions import IsAuthor
from files.models import File, Tag
from files.serializers import FileCreateSerializer, FileSerializer, TagSerializer


class FileListAPIView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        serializer = FileSerializer(File.objects.by_author(request.user), many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = FileCreateSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            data = serializer.save()
            answer = [FileSerializer(instance).data for instance in data]
            return Response(
                answer,
                status=status.HTTP_201_CREATED,
                headers={"Location": reverse("files:list")},
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FileDetailAPIView(generics.RetrieveDestroyAPIView):
    queryset = File.objects.all()
    serializer_class = FileSerializer

    permission_classes = (IsAuthenticated, IsAuthor)


class FileByTagAPIView(APIView):
    serializer_class = FileSerializer
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        if not request.data.get("tags"):
            return Response(
                {
                    "tags": [
                        gettext_lazy(
                            "This field is required.",
                        ),
                    ],
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        if request.data.get("filter_all_tags"):
            files = File.objects.by_all_tags(request.data.get("tags"))
        else:
            files = File.objects.by_tags(request.data.get("tags"))
        file_serializer = FileSerializer(files, many=True)

        return Response(file_serializer.data)


class FileTagAPIView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk, tag_title):
        user = request.user
        file = get_object_or_404(File, pk=pk)
        if file.author != user:
            return Response(
                {
                    "detail": gettext_lazy(
                        "You do not have permission to perform this action.",
                    ),
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        if Tag.objects.filter(title=tag_title).exists():
            tag = TagSerializer(Tag.objects.get(title=tag_title)).data
        else:
            tag = {"id": None, "title": tag_title}
        file_serializer = FileSerializer(file)

        return Response({"file": file_serializer.data, "tag": tag})

    def post(self, request, pk, tag_title):
        user = request.user
        file = get_object_or_404(File, pk=pk)
        if file.author != user:
            return Response(
                {
                    "detail": gettext_lazy(
                        "You do not have permission to perform this action.",
                    ),
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        if file.tags.filter(slug=slugify(tag_title, allow_unicode=True)).exists():
            return Response(
                {
                    "detail": gettext_lazy(
                        "Tag already added to the file.",
                    ),
                },
                status=status.HTTP_409_CONFLICT,
            )
        tag = Tag.objects.get_or_create(title=tag_title)[0]
        file.tags.add(tag)
        file.save()

        file_serializer = FileSerializer(file)
        return Response(file_serializer.data)

    def delete(self, request, pk, tag_title):
        user = request.user
        file = get_object_or_404(File, pk=pk)
        if file.author != user:
            return Response(
                {
                    "detail": gettext_lazy(
                        "You do not have permission to perform this action.",
                    ),
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        if not file.tags.filter(slug=slugify(tag_title, allow_unicode=True)).exists():
            return Response(
                {
                    "detail": gettext_lazy(
                        "Tag is not in the file.",
                    ),
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        tag = file.tags.get(slug=slugify(tag_title, allow_unicode=True))
        file.tags.remove(tag)
        file.save()
        tag.refresh_from_db()
        if not tag.files.exists():
            tag.delete()

        file_serializer = FileSerializer(file)
        return Response(file_serializer.data)
