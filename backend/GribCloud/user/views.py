from rest_framework import generics

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
