// ----- COLUMNA IZQUIERDA: perfil + accesos directos -----
import Icono from './Icono'
import { TODOS_LOS_ITEMS, iniciales, nombreCompleto } from './secciones'

// Botoncitos de acceso directo (ids de secciones.js)
const ATAJOS = ['militantes', 'encuestados', 'barrios', 'calles', 'rutas', 'preguntas']

export default function ColumnaIzquierda({ user, onIr }) {
  return (
    <aside className="menu__lado menu__lado--izq">
      <section className="panel perfil">
        {/* El aro de colores gira alrededor del avatar */}
        <div className="perfil__aro">
          <div className="perfil__avatar">{iniciales(user)}</div>
        </div>
        <strong className="perfil__nombre">{nombreCompleto(user)}</strong>
        <span className="perfil__rol">{user.grupos?.[0] || 'Usuario'}</span>
        <span className="perfil__mail"><Icono nombre="mail" /> {user.email}</span>
      </section>

      <section className="panel">
        <h2 className="panel__titulo">Accesos directos</h2>
        <div className="atajos">
          {ATAJOS.map((id) => {
            const item = TODOS_LOS_ITEMS.find((i) => i.id === id)
            return (
              <button key={id} type="button" className="atajo" onClick={() => onIr(id)}>
                <Icono nombre={id} />
                <span>{item.nombre}</span>
              </button>
            )
          })}
        </div>
      </section>
    </aside>
  )
}
