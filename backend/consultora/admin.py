from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Barrios, Calles, Equipos, Rutas, Usuario, Zonas

admin.site.register(Usuario, UserAdmin)
admin.site.register(Zonas)
admin.site.register(Barrios)
admin.site.register(Calles)
admin.site.register(Rutas)
admin.site.register(Equipos)