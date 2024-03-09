from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from albums.models import Album
from albums.permissions import IsRedactorOrPublicAndReadOnly
from albums.serializers import AlbumSerializer
from core.permissions import IsAuthor


class AlbumsPublicAPIView(generics.ListAPIView):
    queryset = Album.objects.public()
    serializer_class = AlbumSerializer


class AlbumsMyAPIView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, IsAuthor)
    serializer_class = AlbumSerializer

    def get_queryset(self):
        return Album.objects.by_author(self.request.user)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class AlbumsDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer
    permission_classes = (IsAuthenticated, IsRedactorOrPublicAndReadOnly)
