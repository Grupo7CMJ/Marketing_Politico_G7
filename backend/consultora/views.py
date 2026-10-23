from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import LoginSerializer, UsuarioSerializer


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
