// ----- COLUMNA DERECHA: actividad reciente -----
import Icono from './Icono'

export default function ColumnaDerecha() {
  return (
    <aside className="menu__lado menu__lado--der">
      <section className="panel">
        <h2 className="panel__titulo">Actividad reciente</h2>
        {/* TODO: cuando haya endpoints, listar acá las últimas encuestas cargadas */}
        <div className="actividad">
          <span className="actividad__pulso"><Icono nombre="actividad" /></span>
          <p>Cuando se carguen encuestas, vas a ver acá lo último que pasó.</p>
        </div>
      </section>
    </aside>
  )
}
