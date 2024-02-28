from django.urls import path

from files import views

app_name = "files"


urlpatterns = [
    path("", views.FileListAPIView.as_view(), name="list"),
]
