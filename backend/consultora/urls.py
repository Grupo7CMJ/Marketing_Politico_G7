from django.urls import path
from rest_framework.routers import DefaultRouter

from . import views

# El router arma solo las URLs del ABM (listado, alta, modificación, baja)
router = DefaultRouter()
router.register("militantes", views.MilitanteViewSet)

urlpatterns = [
    path("auth/login/", views.LoginView.as_view()),
    path("auth/logout/", views.LogoutView.as_view()),
    path("auth/me/", views.MeView.as_view()),
] + router.urls
