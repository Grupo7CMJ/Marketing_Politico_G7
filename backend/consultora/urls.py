from django.urls import include, path
from rest_framework.routers import SimpleRouter

from . import views

# El router crea solo las rutas /rutas/ y /rutas/<id>/
router = SimpleRouter()
router.register("rutas", views.RutaViewSet, basename="ruta")

urlpatterns = [
    path("auth/login/", views.LoginView.as_view()),
    path("auth/logout/", views.LogoutView.as_view()),
    path("auth/me/", views.MeView.as_view()),
    path("", include(router.urls)),
]