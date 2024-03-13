from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.views import APIView

from core.permissions import IsAuthor
from files.models import File
from files.serializers import FileCreateSerializer, FileSerializer


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
