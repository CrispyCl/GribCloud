from django.urls import path

from user import views

app_name = "users"


urlpatterns = [
    path("", views.UserAPIList.as_view(), name="list"),
    path("<int:pk>/", views.UserAPIDetail.as_view(), name="detail"),
]
