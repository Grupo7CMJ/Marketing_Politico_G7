from django.db.models import Count
from rest_framework import status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Rutas
from .serializers import LoginSerializer, RutaSerializer, UsuarioSerializer


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


class RutaViewSet(viewsets.ModelViewSet):
    """
    GET    /api/rutas/       → lista
    POST   /api/rutas/       → crea
    PUT    /api/rutas/<id>/  → edita
    DELETE /api/rutas/<id>/  → borra, SOLO si no tiene equipos (si tiene → 409)
    """

    serializer_class = RutaSerializer
    permission_classes = [IsAuthenticated]
    queryset = Rutas.objects.annotate(cantidad_equipos=Count("equipos")).order_by("nombre")

    def destroy(self, request, *args, **kwargs):
        ruta = self.get_object()

        # Una ruta con equipos asignados no se puede eliminar
        if ruta.equipos.exists():
            return Response(
                {"detail": "Esta ruta tiene equipos asignados y no se puede eliminar."},
                status=status.HTTP_409_CONFLICT,
            )

        ruta.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)