// Aviso para las pantallas que todavía no tienen su listado (ABM).
// Cuando armes una pantalla, reemplazá <Proximamente /> por el contenido real
import Icono from '../menu/Icono'

export default function Proximamente({ id, tabla }) {
  return (
    <div className="menu__vacio">
      <Icono nombre={id} />
      <p>Próximamente: listado de la tabla <code>{tabla}</code></p>
    </div>
  )
}
