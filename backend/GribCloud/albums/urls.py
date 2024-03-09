from django.urls import path

from albums import views

app_name = "albums"


urlpatterns = [
    path("", views.AlbumsPublicAPIView.as_view(), name="public"),
    path("my/", views.AlbumsMyAPIView.as_view(), name="my"),
    path("<int:pk>/", views.AlbumsDetailAPIView.as_view(), name="detail"),
]
