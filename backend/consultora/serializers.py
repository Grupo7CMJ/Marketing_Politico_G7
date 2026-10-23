from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers


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
