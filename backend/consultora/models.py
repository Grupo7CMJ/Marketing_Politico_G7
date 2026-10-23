from django.db import models


class Zonas(models.Model):
    id_zona = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100, unique=True)

    class Meta:
        db_table = "zonas"

    def __str__(self):
        return self.nombre


class Barrios(models.Model):
    id_barrio = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=120)
    id_zona = models.ForeignKey(
        Zonas,
        on_delete=models.PROTECT,
        related_name="barrios"
    )

    class Meta:
        db_table = "barrios"
        constraints = [
            models.UniqueConstraint(
                fields=["id_zona", "nombre"],
                name="uq_barrio_zona_nombre"
            )
        ]

    def __str__(self):
        return self.nombre


class Calles(models.Model):
    id_calle = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=150)
    id_barrio = models.ForeignKey(
        Barrios,
        on_delete=models.PROTECT,
        related_name="calles"
    )

    class Meta:
        db_table = "calles"
        constraints = [
            models.UniqueConstraint(
                fields=["id_barrio", "nombre"],
                name="uq_calle_barrio_nombre"
            )
        ]

    def __str__(self):
        return self.nombre


class Rutas(models.Model):
    id_ruta = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=120)
    descripcion = models.TextField(blank=True, null=True)
    id_calle = models.ForeignKey(
        Calles,
        on_delete=models.PROTECT,
        related_name="rutas"
    )

    class Meta:
        db_table = "rutas"

    def __str__(self):
        return self.nombre


class Equipos(models.Model):
    id_equipo = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=120)
    descripcion = models.TextField(blank=True, null=True)
    id_ruta = models.ForeignKey(
        Rutas,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="equipos"
    )

    class Meta:
        db_table = "equipos"

    def __str__(self):
        return self.nombre


class Usuarios(models.Model):
    id_usuario = models.AutoField(primary_key=True)
    nombre_usuario = models.CharField(max_length=80, unique=True)
    email = models.EmailField(
        max_length=254,
        unique=True,
        null=True,
        blank=True
    )
    password_hash = models.CharField(max_length=255)
    activo = models.BooleanField(default=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "usuarios"

    def __str__(self):
        return self.nombre_usuario


class Grupos(models.Model):
    id_grupo = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=120, unique=True)
    descripcion = models.TextField(blank=True, null=True)

    class Meta:
        db_table = "grupos"

    def __str__(self):
        return self.nombre


class Militantes(models.Model):
    id_militante = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    documento = models.CharField(
        max_length=30,
        unique=True,
        null=True,
        blank=True
    )
    telefono = models.CharField(max_length=40, blank=True, null=True)
    direccion = models.TextField(blank=True, null=True)

    id_usuario = models.OneToOneField(
        Usuarios,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="militante"
    )

    id_equipo = models.ForeignKey(
        Equipos,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="militantes"
    )

    id_grupo = models.ForeignKey(
        Grupos,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="militantes"
    )

    class Meta:
        db_table = "militantes"

    def __str__(self):
        return f"{self.nombre} {self.apellido}"


class Encuestados(models.Model):
    id_encuestado = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100, blank=True, null=True)
    apellido = models.CharField(max_length=100, blank=True, null=True)
    documento = models.CharField(
        max_length=30,
        unique=True,
        blank=True,
        null=True
    )
    telefono = models.CharField(max_length=40, blank=True, null=True)
    direccion = models.TextField(blank=True, null=True)

    id_grupo = models.ForeignKey(
        Grupos,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="encuestados"
    )

    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "encuestados"

    def __str__(self):
        return f"{self.nombre or ''} {self.apellido or ''}".strip()


class Permisos(models.Model):
    id_permiso = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True, null=True)

    grupos = models.ManyToManyField(
        Grupos,
        through="Permisosxgrupos",
        related_name="permisos"
    )

    class Meta:
        db_table = "permisos"

    def __str__(self):
        return self.nombre


class Permisosxgrupos(models.Model):
    id_grupo = models.ForeignKey(
        Grupos,
        on_delete=models.CASCADE
    )
    id_permiso = models.ForeignKey(
        Permisos,
        on_delete=models.CASCADE
    )

    class Meta:
        db_table = "permisosxgrupos"
        constraints = [
            models.UniqueConstraint(
                fields=["id_grupo", "id_permiso"],
                name="uq_permiso_grupo"
            )
        ]


class Categorias(models.Model):
    id_categoria = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=120, unique=True)
    descripcion = models.TextField(blank=True, null=True)

    class Meta:
        db_table = "categorias"

    def __str__(self):
        return self.nombre


class Cuestionarios(models.Model):
    id_cuestionario = models.AutoField(primary_key=True)
    titulo = models.CharField(max_length=180)
    descripcion = models.TextField(blank=True, null=True)

    id_categoria = models.ForeignKey(
        Categorias,
        on_delete=models.PROTECT,
        related_name="cuestionarios"
    )

    activo = models.BooleanField(default=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    militantes = models.ManyToManyField(
        Militantes,
        through="Militantexcuestionarios",
        related_name="cuestionarios"
    )

    class Meta:
        db_table = "cuestionarios"

    def __str__(self):
        return self.titulo


class Militantexcuestionarios(models.Model):
    id_militante = models.ForeignKey(
        Militantes,
        on_delete=models.CASCADE
    )

    id_cuestionario = models.ForeignKey(
        Cuestionarios,
        on_delete=models.CASCADE
    )

    asignado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "militantexcuestionarios"
        constraints = [
            models.UniqueConstraint(
                fields=["id_militante", "id_cuestionario"],
                name="uq_militante_cuestionario"
            )
        ]


class Preguntas(models.Model):
    id_pregunta = models.AutoField(primary_key=True)
    enunciado = models.TextField()
    tipo = models.CharField(
        max_length=30,
        default="opcion_multiple"
    )
    orden = models.IntegerField(default=1)
    obligatoria = models.BooleanField(default=False)

    id_cuestionario = models.ForeignKey(
        Cuestionarios,
        on_delete=models.CASCADE,
        related_name="preguntas"
    )

    class Meta:
        db_table = "preguntas"
        ordering = ["orden"]

    def __str__(self):
        return self.enunciado


class Opciones(models.Model):
    id_opcion = models.AutoField(primary_key=True)
    texto = models.TextField()
    orden = models.IntegerField(default=1)

    id_pregunta = models.ForeignKey(
        Preguntas,
        on_delete=models.CASCADE,
        related_name="opciones"
    )

    class Meta:
        db_table = "opciones"
        ordering = ["orden"]

    def __str__(self):
        return self.texto


class RespuestaCargada(models.Model):
    id_respuesta = models.AutoField(primary_key=True)

    id_encuestado = models.ForeignKey(
        Encuestados,
        on_delete=models.CASCADE,
        related_name="respuestas"
    )

    id_pregunta = models.ForeignKey(
        Preguntas,
        on_delete=models.CASCADE,
        related_name="respuestas"
    )

    id_opcion = models.ForeignKey(
        Opciones,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="respuestas"
    )

    respuesta_texto = models.TextField(blank=True, null=True)
    cargada_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "respuesta_cargada"
        constraints = [
            models.UniqueConstraint(
                fields=["id_encuestado", "id_pregunta"],
                name="uq_respuesta_encuestado_pregunta"
            ),
            models.CheckConstraint(
                condition=(
                    models.Q(id_opcion__isnull=False)
                    | models.Q(respuesta_texto__isnull=False)
                ),
                name="ck_respuesta_con_contenido"
            )
        ]