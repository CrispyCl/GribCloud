from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from albums.models import Album, AlbumMembership
from albums.permissions import IsRedactorOrPublicAndReadOnly
from albums.serializers import AlbumSerializer
from files.models import File
from files.serializers import FileSerializer
from user.models import User
from user.serializers import UserSerializer


class AlbumsAPIView(generics.ListAPIView):
    serializer_class = AlbumSerializer

    def get_queryset(self):
        available_params = ["is_public", "author", "author__email", "author__username"]

        params = list(filter(lambda param: param[0] in available_params, self.request.query_params.items()))

        return Album.objects.by_user(self.request.user).filter(*params)


class AlbumsMyAPIView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = AlbumSerializer

    def get_queryset(self):
        return Album.objects.by_author(self.request.user)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class AlbumsAvailableAPIView(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = AlbumSerializer

    def get_queryset(self):
        return Album.objects.by_member(self.request.user)


class AlbumsDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer
    permission_classes = (IsAuthenticated, IsRedactorOrPublicAndReadOnly)


class AlbumsFilesAPIView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, album_id, file_id):
        user = request.user
        album = get_object_or_404(Album, pk=album_id)
        if album.author != user and not album.is_redactor(user):
            return Response(
                {
                    "detail": gettext_lazy(
                        "You do not have permission to perform this action.",
                    ),
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        file = get_object_or_404(File, pk=file_id)
        if file.author != user and file not in album.files.all():
            return Response(
                {
                    "detail": gettext_lazy(
                        "You do not have permission to perform this action.",
                    ),
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        album_serializer = AlbumSerializer(album)
        file_serializer = FileSerializer(file)

        return Response({"album": album_serializer.data, "file": file_serializer.data})

    def post(self, request, album_id, file_id):
        user = request.user
        album = get_object_or_404(Album, pk=album_id)
        if album.author != user and not album.is_redactor(user):
            return Response(
                {
                    "detail": gettext_lazy(
                        "You do not have permission to perform this action.",
                    ),
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        file = get_object_or_404(File, pk=file_id)
        if file.author != user:
            return Response(
                {
                    "detail": gettext_lazy(
                        "You do not have permission to perform this action.",
                    ),
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        if file in album.files.all():
            return Response(
                {
                    "detail": gettext_lazy(
                        "File already added to the album",
                    ),
                },
                status=status.HTTP_409_CONFLICT,
            )
        album.files.add(file)
        album.save()
        album_serializer = AlbumSerializer(album)
        return Response(album_serializer.data)

    def delete(self, request, album_id, file_id):
        user = request.user
        album = get_object_or_404(Album, pk=album_id)
        if album.author != user and not album.is_redactor(user):
            return Response(
                {
                    "detail": gettext_lazy(
                        "You do not have permission to perform this action.",
                    ),
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        file = get_object_or_404(File, pk=file_id)
        if file not in album.files.all():
            return Response(
                {
                    "detail": gettext_lazy(
                        "File is not in the album",
                    ),
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        album.files.remove(file)
        album.save()
        album_serializer = AlbumSerializer(album)
        return Response(album_serializer.data)


class AlbumsMembersAPIView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, album_id, member_id):
        user = request.user
        album = get_object_or_404(Album, pk=album_id)
        if album.author != user:
            return Response(
                {
                    "detail": gettext_lazy(
                        "You do not have permission to perform this action.",
                    ),
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        member = get_object_or_404(User, pk=member_id)

        album_serializer = AlbumSerializer(album)
        member_serializer = UserSerializer(member)

        return Response({"album": album_serializer.data, "member": member_serializer.data})

    def post(self, request, album_id, member_id):
        user = request.user
        album = get_object_or_404(Album, pk=album_id)
        if album.author != user:
            return Response(
                {
                    "detail": gettext_lazy(
                        "You do not have permission to perform this action.",
                    ),
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        member = get_object_or_404(User, pk=member_id)

        if "is_redactor" not in request.data:
            return Response(
                {
                    "is_redactor": [
                        gettext_lazy(
                            "This field is required.",
                        ),
                    ],
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        is_redactor = request.data.get("is_redactor")
        album_membership = AlbumMembership.objects.get_or_create(member=member, album=album)[0]
        album_membership.is_redactor = is_redactor
        album_membership.save()
        album.refresh_from_db()

        album_serializer = AlbumSerializer(album)
        return Response(album_serializer.data)

    def delete(self, request, album_id, member_id):
        user = request.user
        album = get_object_or_404(Album, pk=album_id)
        if album.author != user:
            return Response(
                {
                    "detail": gettext_lazy(
                        "You do not have permission to perform this action.",
                    ),
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        member = get_object_or_404(User, pk=member_id)
        if member not in album.members.all():
            return Response(
                {
                    "detail": gettext_lazy(
                        "User is not in the album.",
                    ),
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        AlbumMembership.objects.get(member=member, album=album).delete()
        album.refresh_from_db()

        album_serializer = AlbumSerializer(album)
        return Response(album_serializer.data)
