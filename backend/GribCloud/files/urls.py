from django.urls import path

from files import views

app_name = "users"


urlpatterns = [
    path("my/", views.FileListAPIList.as_view(), name="list"),
    path("create/", views.FileCreateAPIView.as_view(), name="create"),
]
