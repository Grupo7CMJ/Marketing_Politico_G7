// useState: guarda valores que cambian (menú abierto/cerrado, sección elegida)
// useRef: guarda una referencia a un elemento de la pantalla (el buscador, los desplegables)
import { useEffect, useRef, useState } from 'react'
// Mismo logo que el login
import logo from '../assets/logo.png'
import './Menu.css'
// Pantalla de gestión de rutas
import Rutas from './Rutas'

// ----- ÍCONOS -----
// Cada ícono es una lista de trazos SVG (líneas finas, como los del login)
const ICONOS = {
  usuarios: ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', 'M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z'],
  militantes: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z', 'm16 11 2 2 4-4'],
  encuestados: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z', 'M14 2v6h6', 'M12 12a2 2 0 1 0 0 .01', 'M8 18a4 4 0 0 1 8 0'],
  roles: ['M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6Z', 'm9 12 2 2 4-4'],
  permisos: ['M15 7a4 4 0 1 0-3.9 5L4 19v2h3l1-1v-2h2v-2h2l1.4-1.4A4 4 0 0 0 15 7Z', 'M16 7h.01'],
  campanas: ['M3 11v2a1 1 0 0 0 1 1h3l5 4V6L7 10H4a1 1 0 0 0-1 1Z', 'M16 9a4 4 0 0 1 0 6', 'M19 6a8 8 0 0 1 0 12'],
  zonas: ['M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z', 'M12 7.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z'],
  barrios: ['M3 21h18', 'M5 21V10l5-4 5 4v11', 'M15 21v-7h4v7', 'M9 21v-4h2v4'],
  calles: ['M5 21 9 3', 'M19 21 15 3', 'M12 5v2', 'M12 11v2', 'M12 17v2'],
  rutas: ['M6 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z', 'M18 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z', 'M6 9v3a3 3 0 0 0 3 3h6'],
  equipos: ['M17 21v-2a4 4 0 0 0-3-3.9', 'M7 21v-2a4 4 0 0 1 3-3.9', 'M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z', 'M19 8a2.5 2.5 0 1 1 0 5', 'M5 8a2.5 2.5 0 1 0 0 5'],
  cuestionarios: ['M9 4H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2', 'M9 2h6v4H9Z', 'M9 12h6', 'M9 16h4'],
  categorias: ['M4 4h6v6H4Z', 'M14 4h6v6h-6Z', 'M4 14h6v6H4Z', 'M14 14h6v6h-6Z'],
  preguntas: ['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z', 'M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14', 'M12 17h.01'],
  opciones: ['M9 6h11', 'M9 12h11', 'M9 18h11', 'M4.5 6h.01', 'M4.5 12h.01', 'M4.5 18h.01'],
  respuestas: ['M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z', 'm8 10 2 2 4-4'],
  inicio: ['m3 11 9-8 9 8', 'M5 10v10h14V10'],
  salir: ['M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4', 'm16 17 5-5-5-5', 'M21 12H9'],
  campana: ['M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9', 'M10.3 21a1.9 1.9 0 0 0 3.4 0'],
  flecha: ['M5 12h14', 'm13 6 6 6-6 6'],
  actividad: ['M3 12h4l3-8 4 16 3-8h4'],
  mail: ['M3 5h18v14H3Z', 'm3 7 9 6 9-6'],
  buscar: ['M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Z', 'm20 20-3.5-3.5'],
  abajo: ['m6 9 6 6 6-6'],
}

// Pasa a minúsculas y saca los acentos: así "categoria" encuentra "Categorías"
function normalizar(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

// ----- ONDAS ANIMADAS (los colores de las olas del login) -----
// Cada capa es una onda que se repite: el SVG mide el doble de ancho y se corre
// hacia la izquierda en loop, así parece que el mar nunca se corta
function onda(y, alto) {
  let d = `M0 ${y}`
  for (let x = 0; x < 2880; x += 720) {
    d += ` C${x + 360} ${y - alto} ${x + 360} ${y + alto} ${x + 720} ${y}`
  }
  return `${d} V200 H0 Z`
}

// De atrás hacia adelante: celeste, naranja, rosa, violeta
const CAPAS = [
  { color: '#35b4e7', d: onda(70, 40), segundos: 34 },
  { color: '#fdb03e', d: onda(95, 34), segundos: 26 },
  { color: '#d8267e', d: onda(122, 30), segundos: 20 },
  { color: '#533693', d: onda(150, 22), segundos: 15 },
]

function Olas() {
  return (
    <div className="olas" aria-hidden="true">
      {CAPAS.map((c, i) => (
        <svg
          key={c.color}
          viewBox="0 0 2880 200"
          preserveAspectRatio="none"
          // las capas pares van para un lado y las impares para el otro
          style={{ '--seg': `${c.segundos}s`, animationDirection: i % 2 ? 'reverse' : 'normal' }}
        >
          <path d={c.d} fill={c.color} />
        </svg>
      ))}
    </div>
  )
}

function Icono({ nombre }) {
  return (
    <svg className="icono" viewBox="0 0 24 24" aria-hidden="true">
      {ICONOS[nombre].map((d) => <path key={d} d={d} />)}
    </svg>
  )
}

// ----- SECCIONES DEL MENÚ HAMBURGUESA -----
// Cada opción es una tabla de la base de datos. "id" se usa para saber cuál está elegida
const SECCIONES = [
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
      { id: 'campanas', nombre: 'Campañas', tabla: 'campanas' },
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

// Busca una opción del menú por su id (para mostrar el título de la sección elegida)
const TODOS_LOS_ITEMS = SECCIONES.flatMap((s) => s.items)
// Posición de cada opción (Inicio es la 0): la usa el CSS para que entren en cascada
const POSICION = Object.fromEntries(TODOS_LOS_ITEMS.map((item, i) => [item.id, i + 1]))

// ----- TARJETAS GRANDES DEL INICIO (accesos rápidos) -----
const ACCESOS = [
  { id: 'cuestionarios', titulo: 'Cuestionarios', detalle: 'Formularios de campo', color: 'blue' },
  { id: 'equipos', titulo: 'Equipos', detalle: 'Equipos de trabajo', color: 'purple' },
  { id: 'usuarios', titulo: 'Usuarios', detalle: 'Cuentas de acceso', color: 'orange' },
  { id: 'zonas', titulo: 'Zonas', detalle: 'Áreas territoriales', color: 'pink' },
]

// ----- ACCESOS DIRECTOS DE LA COLUMNA IZQUIERDA -----
const ATAJOS = ['campanas', 'militantes', 'encuestados', 'barrios', 'rutas', 'preguntas']

// ----- NÚMEROS DEL RESUMEN -----
// TODO: traerlos de la API cuando existan los endpoints. Por ahora quedan en 0
const RESUMEN = [
  { valor: 0, texto: 'Encuestas hoy', color: 'purple' },
  { valor: 0, texto: 'Rutas activas', color: 'pink' },
  { valor: 0, texto: 'Equipos activos', color: 'orange' },
]

const DIAS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

// Devuelve los 7 días (lunes a domingo) de la semana de "hoy"
function semanaDe(hoy) {
  const lunes = new Date(hoy)
  lunes.setDate(hoy.getDate() - ((hoy.getDay() + 6) % 7)) // getDay(): 0 = domingo
  return Array.from({ length: 7 }, (_, i) => {
    const dia = new Date(lunes)
    dia.setDate(lunes.getDate() + i)
    return dia
  })
}

// Iniciales para el circulito del avatar: "Carlos Pérez" → "CP"
function iniciales(user) {
  const texto = `${user.first_name} ${user.last_name}`.trim() || user.username
  return texto.split(/\s+/).slice(0, 2).map((p) => p[0]).join('').toUpperCase()
}

// Componente Menu. Recibe el usuario logueado y la función para cerrar sesión
export default function Menu({ user, onLogout }) {
  const [abierto, setAbierto] = useState(false)  // true = menú hamburguesa desplegado
  const [seccion, setSeccion] = useState(null)   // id de la tabla elegida, null = inicio
  const [hoy] = useState(() => new Date())       // fecha de hoy, se calcula una sola vez
  const [popup, setPopup] = useState(null)       // desplegable abierto: 'perfil', 'avisos' o null
  const [busqueda, setBusqueda] = useState('')   // lo que se escribe en el buscador
  const [resaltado, setResaltado] = useState(0)  // resultado marcado con las flechas del teclado
  const [scrolleado, setScrolleado] = useState(false) // true = la página bajó (la barra lleva sombra)
  const buscadorRef = useRef(null)
  const derechaRef = useRef(null)

  // Teclado: Escape cierra el menú y los desplegables, Ctrl+K va al buscador
  useEffect(() => {
    function teclas(e) {
      if (e.key === 'Escape') {
        setAbierto(false)
        setPopup(null)
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        buscadorRef.current?.focus()
      }
    }
    window.addEventListener('keydown', teclas)
    return () => window.removeEventListener('keydown', teclas)
  }, [])

  // Un clic afuera de la campanita o del avatar cierra su desplegable
  useEffect(() => {
    if (!popup) return
    function afuera(e) {
      if (!derechaRef.current?.contains(e.target)) setPopup(null)
    }
    document.addEventListener('pointerdown', afuera)
    return () => document.removeEventListener('pointerdown', afuera)
  }, [popup])

  // Sombra de la barra solo cuando la página bajó un poco
  useEffect(() => {
    const revisar = () => setScrolleado(window.scrollY > 8)
    window.addEventListener('scroll', revisar, { passive: true })
    return () => window.removeEventListener('scroll', revisar)
  }, [])

  function ir(id) {
    setSeccion(id)
    setAbierto(false)
  }

  // Resultados del buscador: las tablas cuyo nombre contiene lo escrito
  const resultados = busqueda.trim()
    ? TODOS_LOS_ITEMS.filter((i) => normalizar(i.nombre).includes(normalizar(busqueda.trim())))
    : []

  function elegirResultado(item) {
    ir(item.id)
    setBusqueda('')
    buscadorRef.current?.blur()
  }

  // Flechas arriba/abajo recorren los resultados, Enter abre el marcado
  function teclasBuscador(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setResaltado((r) => Math.min(r + 1, resultados.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setResaltado((r) => Math.max(r - 1, 0))
    } else if (e.key === 'Enter' && resultados[resaltado]) {
      elegirResultado(resultados[resaltado])
    } else if (e.key === 'Escape') {
      setBusqueda('')
      e.currentTarget.blur()
    }
  }

  const nombre = user.first_name || user.username
  const rol = user.grupos?.[0] || 'Usuario'
  const elegida = TODOS_LOS_ITEMS.find((i) => i.id === seccion)

  return (
    <div className="menu">

      {/* Manchas de color borrosas que flotan despacio en el fondo (solo decoración) */}
      <div className="menu__fondo" aria-hidden="true">
        <span className="mancha mancha--purple" />
        <span className="mancha mancha--pink" />
        <span className="mancha mancha--orange" />
        <span className="mancha mancha--blue" />
      </div>

      {/* ===== BARRA SUPERIOR VIOLETA ===== */}
      <header className={`menu__top ${scrolleado ? 'is-scrolled' : ''}`}>
        {/* Botón hamburguesa: 3 rayitas de distinto largo que se emparejan con el mouse */}
        <button
          type="button"
          className="menu__burger"
          onClick={() => setAbierto(true)}
          aria-label="Abrir menú"
          aria-expanded={abierto}
        >
          <span /><span /><span />
        </button>

        {/* Logo + título. El logo también vuelve al inicio */}
        <button type="button" className="menu__marca" onClick={() => ir(null)} aria-label="Ir al inicio">
          <img className="menu__top-logo" src={logo} alt="" />
          <span className="menu__top-title">
            <strong>Panel de gestión</strong>
            {/* Dónde está parado el usuario: "Inicio" o "Inicio › Zonas" */}
            <span className="menu__migas">
              Inicio{elegida && <> <span aria-hidden="true">›</span> {elegida.nombre}</>}
            </span>
          </span>
        </button>

        {/* ----- BUSCADOR: escribís el nombre de una tabla y vas directo ----- */}
        <div className="buscador">
          <Icono nombre="buscar" />
          <input
            ref={buscadorRef}
            type="search"
            placeholder="Buscar sección…"
            aria-label="Buscar sección"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value)
              setResaltado(0)
            }}
            onKeyDown={teclasBuscador}
            onBlur={() => setBusqueda('')}
          />
          <kbd>Ctrl K</kbd>

          {busqueda.trim() && (
            <ul className="buscador__lista" role="listbox">
              {resultados.length === 0 && <li className="buscador__nada">No hay secciones con ese nombre</li>}
              {resultados.map((item, i) => (
                <li
                  key={item.id}
                  role="option"
                  aria-selected={i === resaltado}
                  className={i === resaltado ? 'is-active' : ''}
                  // onMouseDown (y no onClick) para que se elija antes de que el input pierda el foco
                  onMouseDown={(e) => {
                    e.preventDefault()
                    elegirResultado(item)
                  }}
                  onMouseEnter={() => setResaltado(i)}
                >
                  <Icono nombre={item.id} />
                  {item.nombre}
                  <small>{SECCIONES.find((s) => s.items.includes(item)).titulo}</small>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ----- LADO DERECHO: campanita + avatar, cada uno con su desplegable ----- */}
        <div className="menu__top-right" ref={derechaRef}>
          <div className="menu__pop-wrap">
            <button
              type="button"
              className="menu__bell"
              aria-label="Notificaciones"
              aria-expanded={popup === 'avisos'}
              onClick={() => setPopup(popup === 'avisos' ? null : 'avisos')}
            >
              <Icono nombre="campana" />
            </button>
            <div className={`menu__pop ${popup === 'avisos' ? 'is-open' : ''}`}>
              <p className="menu__pop-titulo">Notificaciones</p>
              <div className="menu__pop-vacio">
                <Icono nombre="campana" />
                <span>No tenés notificaciones nuevas</span>
              </div>
            </div>
          </div>

          <div className="menu__pop-wrap">
            <button
              type="button"
              className="menu__usuario"
              aria-label="Mi cuenta"
              aria-expanded={popup === 'perfil'}
              onClick={() => setPopup(popup === 'perfil' ? null : 'perfil')}
            >
              <span className="menu__avatar">{iniciales(user)}</span>
              <span className="menu__usuario-texto">
                <strong>{nombre}</strong>
                <small>{rol}</small>
              </span>
              <Icono nombre="abajo" />
            </button>
            <div className={`menu__pop ${popup === 'perfil' ? 'is-open' : ''}`}>
              <div className="menu__pop-perfil">
                <span className="menu__avatar menu__avatar--grande">{iniciales(user)}</span>
                <strong>{`${user.first_name} ${user.last_name}`.trim() || user.username}</strong>
                <small>{user.email}</small>
              </div>
              <button type="button" className="menu__pop-item" onClick={onLogout}>
                <Icono nombre="salir" /> Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ===== MENÚ HAMBURGUESA (panel lateral) ===== */}
      {/* Fondo oscuro detrás del panel: al hacer clic afuera se cierra */}
      <div
        className={`menu__overlay ${abierto ? 'is-open' : ''}`}
        onClick={() => setAbierto(false)}
        aria-hidden="true"
      />
      <nav className={`menu__drawer ${abierto ? 'is-open' : ''}`} aria-label="Menú principal">
        {/* Cabecera blanca con el logo y la ola de colores (igual que el login) */}
        <div className="menu__drawer-head">
          <img src={logo} alt="Logo" />
          <svg viewBox="0 0 320 40" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 18 C80 2 160 34 320 12 V40 H0 Z" fill="#fdb03e" />
            <path d="M0 26 C90 12 170 40 320 22 V40 H0 Z" fill="#d8267e" />
            <path d="M0 32 C100 22 190 44 320 30 V40 H0 Z" fill="#533693" />
          </svg>
        </div>

        <div className="menu__drawer-body">
          <button
            type="button"
            className={`menu__link ${seccion === null ? 'is-active' : ''}`}
            style={{ '--i': 0 }}
            onClick={() => ir(null)}
          >
            <Icono nombre="inicio" /> Inicio
          </button>

          {/* Un bloque por cada sección (Personas, Accesos, Territorio, Encuestas) */}
          {SECCIONES.map((s) => (
            <div key={s.titulo} className="menu__group">
              <p className="menu__group-title">{s.titulo}</p>
              {s.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`menu__link ${seccion === item.id ? 'is-active' : ''}`}
                  style={{ '--i': POSICION[item.id] }}
                  onClick={() => ir(item.id)}
                >
                  <Icono nombre={item.id} /> {item.nombre}
                </button>
              ))}
            </div>
          ))}

          <button
            type="button"
            className="menu__link menu__link--logout"
            style={{ '--i': TODOS_LOS_ITEMS.length + 1 }}
            onClick={onLogout}
          >
            <Icono nombre="salir" /> Cerrar sesión
          </button>
        </div>
      </nav>

      {/* ===== CONTENIDO: 3 columnas en PC (izquierda | centro | derecha) ===== */}
      <div className="menu__layout">

      {/* ----- COLUMNA IZQUIERDA: perfil + accesos directos ----- */}
      <aside className="menu__lado menu__lado--izq">
        <section className="panel perfil">
          {/* El aro de colores gira alrededor del avatar */}
          <div className="perfil__aro">
            <div className="perfil__avatar">{iniciales(user)}</div>
          </div>
          <strong className="perfil__nombre">
            {`${user.first_name} ${user.last_name}`.trim() || user.username}
          </strong>
          <span className="perfil__rol">{rol}</span>
          <span className="perfil__mail"><Icono nombre="mail" /> {user.email}</span>
        </section>

        <section className="panel">
          <h2 className="panel__titulo">Accesos directos</h2>
          <div className="atajos">
            {ATAJOS.map((id) => {
              const item = TODOS_LOS_ITEMS.find((i) => i.id === id)
              return (
                <button key={id} type="button" className="atajo" onClick={() => setSeccion(id)}>
                  <Icono nombre={id} />
                  <span>{item.nombre}</span>
                </button>
              )
            })}
          </div>
        </section>
      </aside>

      <main className="menu__main">
        {elegida ? (
          // Pantalla de una tabla. Por ahora es un aviso: acá va el listado (ABM) de esa tabla
          // key distinta por tabla: React vuelve a crear la vista y se repite la animación de entrada
          <section key={elegida.id} className="menu__seccion menu__vista">
            <button type="button" className="menu__volver" onClick={() => setSeccion(null)}>
              ← Volver al inicio
            </button>
            <h1>{elegida.nombre}</h1>
            <div className="menu__bar" aria-hidden="true"><span /><span /><span /><span /></div>
                        {elegida.id === 'rutas' ? (
              <Rutas />
            ) : (
              <div className="menu__vacio">
                <Icono nombre={elegida.id} />
                <p>Próximamente: listado de la tabla <code>{elegida.tabla}</code></p>
              </div>
            )}
          </section>
        ) : (
          <div key="inicio" className="menu__vista">
            {/* Bienvenida */}
            <h1 className="menu__hola">
              Hola, {nombre} <span className="menu__mano" aria-hidden="true">👋</span>
            </h1>
            <p className="menu__sub">¿Qué querés gestionar hoy?</p>
            <div className="menu__bar" aria-hidden="true"><span /><span /><span /><span /></div>

            {/* Fila de números del resumen */}
            <div className="menu__resumen">
              {RESUMEN.map((r) => (
                <div key={r.texto} className="menu__stat">
                  <strong className={`txt-${r.color}`}>{r.valor}</strong>
                  <span>{r.texto}</span>
                </div>
              ))}
            </div>

            {/* Tarjetas de colores con accesos rápidos */}
            <div className="menu__cards">
              {ACCESOS.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  className={`menu__card bg-${a.color}`}
                  onClick={() => setSeccion(a.id)}
                >
                  <span className="menu__card-icon"><Icono nombre={a.id} /></span>
                  <span className="menu__card-text">
                    <strong>{a.titulo}</strong>
                    <small>{a.detalle}</small>
                  </span>
                  <span className="menu__card-go"><Icono nombre="flecha" /></span>
                </button>
              ))}
            </div>

            {/* Calendario de la semana actual, con el día de hoy marcado */}
            <section className="menu__semana">
              <div className="menu__semana-head">
                <h2>Esta semana</h2>
                <span>
                  {hoy.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div className="menu__dias">
                {semanaDe(hoy).map((d, i) => (
                  <div
                    key={d.toISOString()}
                    className={`menu__dia ${d.toDateString() === hoy.toDateString() ? 'is-today' : ''}`}
                  >
                    <small>{DIAS[i]}</small>
                    <strong>{d.getDate()}</strong>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* ----- COLUMNA DERECHA: campaña + actividad ----- */}
      <aside className="menu__lado menu__lado--der">
        {/* Tarjeta con degradé animado de los colores de las olas */}
        <section className="panel campana-activa">
          <span className="campana-activa__chip">Campaña activa</span>
          <strong>Todavía no hay campañas</strong>
          <p>Creá la primera campaña para organizar equipos, rutas y encuestas.</p>
          <button type="button" onClick={() => setSeccion('campanas')}>
            Ver campañas <Icono nombre="flecha" />
          </button>
        </section>

        <section className="panel">
          <h2 className="panel__titulo">Actividad reciente</h2>
          {/* TODO: cuando haya endpoints, listar acá las últimas encuestas cargadas */}
          <div className="actividad">
            <span className="actividad__pulso"><Icono nombre="actividad" /></span>
            <p>Cuando se carguen encuestas, vas a ver acá lo último que pasó.</p>
          </div>
        </section>
      </aside>

      </div>

      {/* Ondas de colores al pie de la página */}
      <Olas />
    </div>
  )
}
