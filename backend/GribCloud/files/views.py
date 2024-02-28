from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import IsSelfOrReadOnly
from files.models import File
from files.serializers import FileCreateSerializer, FileSerializer


class FileCreateAPIView(APIView):
    def post(self, request):
        serializer = FileCreateSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FileListAPIList(generics.ListAPIView):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    permission_classes = (IsSelfOrReadOnly,)
