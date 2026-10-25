// ----- BARRA SUPERIOR VIOLETA -----
// Hamburguesa, logo, buscador de secciones (Ctrl+K), notificaciones y usuario
import { useEffect, useRef, useState } from 'react'
import logo from '../../assets/logo.png'
import Icono from './Icono'
import { SECCIONES, TODOS_LOS_ITEMS, iniciales, nombreCompleto } from './secciones'

// Pasa a minúsculas y saca los acentos: así "categoria" encuentra "Categorías"
function normalizar(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

export default function BarraSuperior({ user, elegida, abierto, onAbrir, onIr, onLogout }) {
  const [popup, setPopup] = useState(null)       // desplegable abierto: 'perfil', 'avisos' o null
  const [busqueda, setBusqueda] = useState('')   // lo que se escribe en el buscador
  const [resaltado, setResaltado] = useState(0)  // resultado marcado con las flechas del teclado
  const [scrolleado, setScrolleado] = useState(false) // true = la página bajó (la barra lleva sombra)
  const buscadorRef = useRef(null)
  const derechaRef = useRef(null)

  // Teclado: Escape cierra los desplegables, Ctrl+K va al buscador
  useEffect(() => {
    function teclas(e) {
      if (e.key === 'Escape') setPopup(null)
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

  // Resultados del buscador: las tablas cuyo nombre contiene lo escrito
  const resultados = busqueda.trim()
    ? TODOS_LOS_ITEMS.filter((i) => normalizar(i.nombre).includes(normalizar(busqueda.trim())))
    : []

  function elegirResultado(item) {
    onIr(item.id)
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

  return (
    <header className={`menu__top ${scrolleado ? 'is-scrolled' : ''}`}>
      {/* Botón hamburguesa: 3 rayitas de distinto largo que se emparejan con el mouse */}
      <button
        type="button"
        className="menu__burger"
        onClick={onAbrir}
        aria-label="Abrir menú"
        aria-expanded={abierto}
      >
        <span /><span /><span />
      </button>

      {/* Logo + título. El logo también vuelve al inicio */}
      <button type="button" className="menu__marca" onClick={() => onIr(null)} aria-label="Ir al inicio">
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
              <strong>{user.first_name || user.username}</strong>
              <small>{user.grupos?.[0] || 'Usuario'}</small>
            </span>
            <Icono nombre="abajo" />
          </button>
          <div className={`menu__pop ${popup === 'perfil' ? 'is-open' : ''}`}>
            <div className="menu__pop-perfil">
              <span className="menu__avatar menu__avatar--grande">{iniciales(user)}</span>
              <strong>{nombreCompleto(user)}</strong>
              <small>{user.email}</small>
            </div>
            <button type="button" className="menu__pop-item" onClick={onLogout}>
              <Icono nombre="salir" /> Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
