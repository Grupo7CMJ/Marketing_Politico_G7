// Qué pantalla se muestra para cada opción del menú (los ids son los de menu/secciones.js).
// Para agregar una tabla nueva: crear su archivo acá, importarlo y sumarlo a PANTALLAS

// Estilos comunes a todas las pantallas de tablas (buscador, botones, formulario, tabla)
import './Pantallas.css'

import Barrios from './Barrios'
import Calles from './Calles'
import Categorias from './Categorias'
import Cuestionarios from './Cuestionarios'
import Encuestados from './Encuestados'
import Equipos from './Equipos'
import Militantes from './Militantes'
import Opciones from './Opciones'
import Permisos from './Permisos'
import Preguntas from './Preguntas'
import Respuestas from './Respuestas'
import Roles from './Roles'
import Rutas from './Rutas'
import Usuarios from './Usuarios'
import Zonas from './Zonas'

export const PANTALLAS = {
  usuarios: Usuarios,
  militantes: Militantes,
  encuestados: Encuestados,
  roles: Roles,
  permisos: Permisos,
  zonas: Zonas,
  barrios: Barrios,
  calles: Calles,
  rutas: Rutas,
  equipos: Equipos,
  cuestionarios: Cuestionarios,
  categorias: Categorias,
  preguntas: Preguntas,
  opciones: Opciones,
  respuestas: Respuestas,
}
