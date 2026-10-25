from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from rest_framework import status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Equipos, Militantes
from .serializers import LoginSerializer, MilitanteSerializer, UsuarioSerializer


class LoginView(APIView):
    """POST /api/auth/login/ con {email, password} → {token, usuario}"""

    authentication_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        usuario = serializer.validated_data["usuario"]

        token, _ = Token.objects.get_or_create(user=usuario)
        return Response({
            "token": token.key,
            "usuario": UsuarioSerializer(usuario).data,
        })


class LogoutView(APIView):
    """POST /api/auth/logout/ → borra el token, que deja de servir"""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.auth.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class MeView(APIView):
    """GET /api/auth/me/ → datos del usuario dueño del token"""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UsuarioSerializer(request.user).data)


class MilitanteViewSet(viewsets.ModelViewSet):
    """
    GET    /api/militantes/       → listado
    POST   /api/militantes/       → alta
    PUT    /api/militantes/<id>/  → modificación
    DELETE /api/militantes/<id>/  → baja
    GET    /api/militantes/opciones/ → equipos, usuarios y roles para los desplegables
    """

    permission_classes = [IsAuthenticated]
    serializer_class = MilitanteSerializer
    queryset = (
        Militantes.objects.select_related("id_equipo", "id_usuario")
        .prefetch_related("id_usuario__groups")
        .order_by("apellido", "nombre")
    )

    @action(detail=False)
    def opciones(self, request):
        # Solo los usuarios que todavía no son de otro militante (la relación es uno a uno)
        usuarios = get_user_model().objects.filter(militante__isnull=True).order_by("email")
        return Response({
            "equipos": list(Equipos.objects.order_by("nombre").values("id_equipo", "nombre")),
            "usuarios": list(usuarios.values("id", "email", "first_name", "last_name")),
            "roles": list(Group.objects.order_by("name").values("id", "name")),
        })
