from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.models import Group
from rest_framework import serializers

from .models import Militantes


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        Usuario = get_user_model()
        usuario = Usuario.objects.filter(email__iexact=attrs["email"]).first()

        # authenticate() valida la contraseña y que el usuario esté activo
        if usuario:
            usuario = authenticate(
                request=self.context.get("request"),
                username=usuario.username,
                password=attrs["password"],
            )

        # Mismo mensaje para correo inexistente y contraseña mal:
        # así no se puede averiguar qué correos están registrados
        if not usuario:
            raise serializers.ValidationError("Correo o contraseña incorrectos.")

        attrs["usuario"] = usuario
        return attrs


class UsuarioSerializer(serializers.ModelSerializer):
    grupos = serializers.SlugRelatedField(
        source="groups", many=True, read_only=True, slug_field="name"
    )

    class Meta:
        model = get_user_model()
        fields = ["id", "username", "email", "first_name", "last_name", "grupos"]


class MilitanteSerializer(serializers.ModelSerializer):
    # Textos para mostrar en el listado (solo lectura)
    equipo = serializers.SerializerMethodField()
    usuario = serializers.SerializerMethodField()
    rol = serializers.SerializerMethodField()
    # Rol = grupo de Django. No es una columna de militantes: se guarda en su usuario
    id_rol = serializers.PrimaryKeyRelatedField(
        queryset=Group.objects.all(), required=False, allow_null=True, write_only=True
    )

    class Meta:
        model = Militantes
        fields = [
            "id_militante", "nombre", "apellido", "documento", "telefono",
            "id_equipo", "equipo", "id_usuario", "usuario", "id_rol", "rol",
        ]

    def get_equipo(self, militante):
        return militante.id_equipo.nombre if militante.id_equipo else None

    def get_usuario(self, militante):
        return militante.id_usuario.email if militante.id_usuario else None

    def _grupo(self, militante):
        return militante.id_usuario.groups.first() if militante.id_usuario else None

    def get_rol(self, militante):
        grupo = self._grupo(militante)
        return grupo.name if grupo else None

    def to_representation(self, militante):
        # id_rol también se devuelve, para que el formulario de edición lo muestre elegido
        datos = super().to_representation(militante)
        grupo = self._grupo(militante)
        datos["id_rol"] = grupo.pk if grupo else None
        return datos

    def validate(self, attrs):
        usuario = attrs.get("id_usuario", getattr(self.instance, "id_usuario", None))
        if attrs.get("id_rol") and not usuario:
            raise serializers.ValidationError(
                {"id_rol": ["Para darle un rol, el militante tiene que tener un usuario."]}
            )
        return attrs

    def create(self, validated_data):
        rol = validated_data.pop("id_rol", None)
        militante = super().create(validated_data)
        self._guardar_rol(militante, rol)
        return militante

    def update(self, militante, validated_data):
        rol = validated_data.pop("id_rol", None)
        militante = super().update(militante, validated_data)
        self._guardar_rol(militante, rol)
        return militante

    def _guardar_rol(self, militante, rol):
        # Un solo rol por usuario: reemplaza el que tenía
        if rol and militante.id_usuario:
            militante.id_usuario.groups.set([rol])
