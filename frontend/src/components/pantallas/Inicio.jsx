// Pantalla de inicio: saludo, resumen, accesos rápidos y calendario de la semana
import { useState } from 'react'
import Icono from '../menu/Icono'
import './Inicio.css'

// ----- TARJETAS GRANDES (accesos rápidos) -----
const ACCESOS = [
  { id: 'cuestionarios', titulo: 'Cuestionarios', detalle: 'Formularios de campo', color: 'blue' },
  { id: 'equipos', titulo: 'Equipos', detalle: 'Equipos de trabajo', color: 'purple' },
  { id: 'usuarios', titulo: 'Usuarios', detalle: 'Cuentas de acceso', color: 'orange' },
  { id: 'zonas', titulo: 'Zonas', detalle: 'Áreas territoriales', color: 'pink' },
]

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

export default function Inicio({ user, onIr }) {
  const [hoy] = useState(() => new Date()) // fecha de hoy, se calcula una sola vez

  return (
    <div className="menu__vista">
      {/* Bienvenida */}
      <h1 className="inicio__hola">
        Hola, {user.first_name || user.username} <span className="inicio__mano" aria-hidden="true">👋</span>
      </h1>
      <p className="inicio__sub">¿Qué querés gestionar hoy?</p>
      <div className="menu__bar" aria-hidden="true"><span /><span /><span /><span /></div>

      {/* Fila de números del resumen */}
      <div className="inicio__resumen">
        {RESUMEN.map((r) => (
          <div key={r.texto} className="inicio__stat">
            <strong className={`txt-${r.color}`}>{r.valor}</strong>
            <span>{r.texto}</span>
          </div>
        ))}
      </div>

      {/* Tarjetas de colores con accesos rápidos */}
      <div className="inicio__cards">
        {ACCESOS.map((a) => (
          <button
            key={a.id}
            type="button"
            className={`inicio__card bg-${a.color}`}
            onClick={() => onIr(a.id)}
          >
            <span className="inicio__card-icon"><Icono nombre={a.id} /></span>
            <span className="inicio__card-text">
              <strong>{a.titulo}</strong>
              <small>{a.detalle}</small>
            </span>
            <span className="inicio__card-go"><Icono nombre="flecha" /></span>
          </button>
        ))}
      </div>

      {/* Calendario de la semana actual, con el día de hoy marcado */}
      <section className="inicio__semana">
        <div className="inicio__semana-head">
          <h2>Esta semana</h2>
          <span>{hoy.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}</span>
        </div>
        <div className="inicio__dias">
          {semanaDe(hoy).map((d, i) => (
            <div
              key={d.toISOString()}
              className={`inicio__dia ${d.toDateString() === hoy.toDateString() ? 'is-today' : ''}`}
            >
              <small>{DIAS[i]}</small>
              <strong>{d.getDate()}</strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
