from django.urls import path

from albums import views

app_name = "albums"


urlpatterns = [
    path("", views.AlbumsPublicAPIView.as_view(), name="public"),
    path("my/", views.AlbumsMyAPIView.as_view(), name="my"),
    path("available/", views.AlbumsAvailableAPIView.as_view(), name="available"),
    path("<int:pk>/", views.AlbumsDetailAPIView.as_view(), name="detail"),
    path("<int:album_id>/files/<int:file_id>/", views.AlbumsFilesAPIView.as_view(), name="files"),
]
