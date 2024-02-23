from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import IsSelfOrReadOnly
from user.models import User
from user.serializers import UserSerializer


class UserAPIList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserAPIDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsSelfOrReadOnly,)


class UserAPICurrent(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
