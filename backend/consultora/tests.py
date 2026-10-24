from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase


class LoginTests(APITestCase):

    def setUp(self):
        self.usuario = get_user_model().objects.create_user(
            username="juan", email="juan@test.com", password="clave-segura-123"
        )

    def login(self, email="juan@test.com", password="clave-segura-123"):
        return self.client.post(
            "/api/auth/login/", {"email": email, "password": password}, format="json"
        )

    def test_login_ok_devuelve_token_y_usuario(self):
        res = self.login()
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.data["token"])
        self.assertEqual(res.data["usuario"]["username"], "juan")

    def test_login_ignora_mayusculas_en_el_correo(self):
        self.assertEqual(self.login(email="JUAN@test.com").status_code, 200)

    def test_contrasena_incorrecta(self):
        self.assertEqual(self.login(password="otra").status_code, 400)

    def test_correo_inexistente(self):
        self.assertEqual(self.login(email="nadie@test.com").status_code, 400)

    def test_usuario_inactivo_no_entra(self):
        self.usuario.is_active = False
        self.usuario.save()
        self.assertEqual(self.login().status_code, 400)

    def test_me_y_logout_con_token(self):
        token = self.login().data["token"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {token}")

        res = self.client.get("/api/auth/me/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["email"], "juan@test.com")

        self.assertEqual(self.client.post("/api/auth/logout/").status_code, 204)
        # Después del logout el token ya no sirve
        self.assertEqual(self.client.get("/api/auth/me/").status_code, 401)

    def test_me_sin_token(self):
        self.assertEqual(self.client.get("/api/auth/me/").status_code, 401)
