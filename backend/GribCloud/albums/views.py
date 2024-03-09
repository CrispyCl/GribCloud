from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy

from albums.models import Album
from albums.permissions import IsRedactorOrPublicAndReadOnly
from albums.serializers import AlbumSerializer
from core.permissions import IsAuthor
from files.models import File
from files.serializers import FileSerializer


class AlbumsPublicAPIView(generics.ListAPIView):
    queryset = Album.objects.public()
    serializer_class = AlbumSerializer


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
                status=status.HTTP_400_BAD_REQUEST,
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
                status=status.HTTP_400_BAD_REQUEST,
            )
        album.files.remove(file) 
        album.save() 
        album_serializer = AlbumSerializer(album) 
        return Response(album_serializer.data) 
