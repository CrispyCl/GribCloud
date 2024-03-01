from django.contrib.auth import update_session_auth_hash
from django.utils.translation import pgettext_lazy
from rest_framework import generics, permissions, status
from rest_framework.response import Response

from core.permissions import IsSelfOrReadOnly
from user.models import User
from user.serializers import ChangePasswordSerializer, UserSerializer


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


class ChangePasswordAPIView(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ChangePasswordSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            user = request.user

            password = serializer.data.get("password")
            new_password = serializer.data.get("new_password")

            if not user.check_password(password):
                return Response(
                    {
                        "error": pgettext_lazy(
                            "Change password validation error",
                            "Old password is not correct",
                        ),
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user.set_password(new_password)
            user.save()
            update_session_auth_hash(
                request,
                user,
            )
            return Response(
                {"message": pgettext_lazy("Change password success", "Password changed successfully")},
                status=status.HTTP_200_OK,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
