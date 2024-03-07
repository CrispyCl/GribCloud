from rest_framework import generics

from albums.models import Album
from albums.serializers import AlbumSerializer


class AlbumsPublicAPIView(generics.ListAPIView):
    queryset = Album.objects.public()
    serializer_class = AlbumSerializer

    permission_classes = ()
