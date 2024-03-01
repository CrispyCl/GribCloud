from django.urls import path

from files import views

app_name = "files"


urlpatterns = [
    path("", views.FileListAPIView.as_view(), name="list"),
    path("<int:pk>/", views.FileDetailAPIView.as_view(), name="detail"),
]
