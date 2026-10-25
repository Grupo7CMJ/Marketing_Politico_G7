// ----- OPCIONES DEL MENÚ HAMBURGUESA -----
// Cada opción es una tabla de la base de datos. "id" se usa para saber cuál está elegida
// y para buscar su pantalla en pantallas/index.js.
// Campañas no está acá: se elige en la pantalla que aparece después del login
export const SECCIONES = [
  {
    titulo: 'Personas',
    items: [
      { id: 'usuarios', nombre: 'Usuarios', tabla: 'usuarios' },
      { id: 'militantes', nombre: 'Militantes', tabla: 'militantes' },
      { id: 'encuestados', nombre: 'Encuestados', tabla: 'encuestados' },
    ],
  },
  {
    titulo: 'Accesos',
    items: [
      // Roles = grupos de Django (Administrador, Coordinador, Militante…)
      { id: 'roles', nombre: 'Roles', tabla: 'auth_group' },
      { id: 'permisos', nombre: 'Permisos', tabla: 'auth_permission' },
    ],
  },
  {
    titulo: 'Territorio',
    items: [
      { id: 'zonas', nombre: 'Zonas', tabla: 'zonas' },
      { id: 'barrios', nombre: 'Barrios', tabla: 'barrios' },
      { id: 'calles', nombre: 'Calles', tabla: 'calles' },
      { id: 'rutas', nombre: 'Rutas', tabla: 'rutas' },
      { id: 'equipos', nombre: 'Equipos', tabla: 'equipos' },
    ],
  },
  {
    titulo: 'Encuestas',
    items: [
      { id: 'cuestionarios', nombre: 'Cuestionarios', tabla: 'cuestionarios' },
      { id: 'categorias', nombre: 'Categorías', tabla: 'categorias' },
      { id: 'preguntas', nombre: 'Preguntas', tabla: 'preguntas' },
      { id: 'opciones', nombre: 'Opciones', tabla: 'opciones' },
      { id: 'respuestas', nombre: 'Respuestas', tabla: 'respuesta_cargada' },
    ],
  },
]

// Todas las opciones en una sola lista (para buscar una por su id)
export const TODOS_LOS_ITEMS = SECCIONES.flatMap((s) => s.items)

// Nombre completo para mostrar, o el usuario si no cargó nombre
export function nombreCompleto(user) {
  return `${user.first_name} ${user.last_name}`.trim() || user.username
}

// Iniciales para el circulito del avatar: "Carlos Pérez" → "CP"
export function iniciales(user) {
  return nombreCompleto(user).split(/\s+/).slice(0, 2).map((p) => p[0]).join('').toUpperCase()
}
