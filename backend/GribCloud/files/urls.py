from django.urls import path

from files import views

app_name = "files"


urlpatterns = [
    path("", views.FileListAPIView.as_view(), name="list"),
    path("by_tags/", views.FileByTagAPIView.as_view(), name="by_tags"),
    path("<int:pk>/", views.FileDetailAPIView.as_view(), name="detail"),
    path("<int:pk>/tags/<str:tag_title>/", views.FileTagAPIView.as_view(), name="tags"),
]
