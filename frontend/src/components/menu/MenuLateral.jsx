// ----- MENÚ HAMBURGUESA (panel lateral) -----
// Lista de todas las tablas agrupadas por tema, más Inicio y Cerrar sesión
import logo from '../../assets/logo.png'
import Icono from './Icono'
import { SECCIONES, TODOS_LOS_ITEMS } from './secciones'

// Posición de cada opción (Inicio es la 0): la usa el CSS para que entren en cascada
const POSICION = Object.fromEntries(TODOS_LOS_ITEMS.map((item, i) => [item.id, i + 1]))

export default function MenuLateral({ abierto, seccion, onCerrar, onIr, onLogout }) {
  return (
    <>
      {/* Fondo oscuro detrás del panel: al hacer clic afuera se cierra */}
      <div
        className={`menu__overlay ${abierto ? 'is-open' : ''}`}
        onClick={onCerrar}
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
            onClick={() => onIr(null)}
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
                  onClick={() => onIr(item.id)}
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
    </>
  )
}
