from django.urls import path

from albums import views

app_name = "files"


urlpatterns = [
    path("", views.AlbumsPublicAPIView.as_view(), name="public"),
]
