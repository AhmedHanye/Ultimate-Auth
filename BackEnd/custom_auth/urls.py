from django.urls import path
from . import views

urlpatterns = [
    path(
        "auth/users/",
        views.CustomUserCreateView.as_view({"post": "create"}),
        name="user-create",
    ),
    path("api/token/", views.CustomTokenObtainView.as_view(), name="token_obtain_pair"),
    path("auth/google/", views.GoogleLogin.as_view(), name="google_login"),
    path("auth/github/", views.GitHubLogin.as_view(), name="github-login"),
    path(
        "api/token/logout/",
        views.LogOut.as_view(),
        name="token blacklisting",
    ),
]
