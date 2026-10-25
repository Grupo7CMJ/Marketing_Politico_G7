
import { useEffect, useState } from 'react'
import './Menu.css'
import BarraSuperior from './menu/BarraSuperior'
import ColumnaDerecha from './menu/ColumnaDerecha'
import ColumnaIzquierda from './menu/ColumnaIzquierda'
import MenuLateral from './menu/MenuLateral'
import Olas from './menu/Olas'
import { TODOS_LOS_ITEMS } from './menu/secciones'
import Inicio from './pantallas/Inicio'
import { PANTALLAS } from './pantallas'

// Componente Menu. Recibe el usuario logueado y la función para cerrar sesión
export default function Menu({ user, onLogout }) {
  const [abierto, setAbierto] = useState(false) // true = menú hamburguesa desplegado
  const [seccion, setSeccion] = useState(null)  // id de la tabla elegida, null = inicio

  // Escape cierra el menú hamburguesa
  useEffect(() => {
    function teclas(e) {
      if (e.key === 'Escape') setAbierto(false)
    }
    window.addEventListener('keydown', teclas)
    return () => window.removeEventListener('keydown', teclas)
  }, [])

  // Ir a una sección (null = inicio) y cerrar el menú hamburguesa
  function ir(id) {
    setSeccion(id)
    setAbierto(false)
  }

  const elegida = TODOS_LOS_ITEMS.find((i) => i.id === seccion)
  const Pantalla = elegida && PANTALLAS[elegida.id] // con mayúscula: React lo usa como componente

  return (
    <div className="menu">

      {/* Manchas de color borrosas que flotan despacio en el fondo (solo decoración) */}
      <div className="menu__fondo" aria-hidden="true">
        <span className="mancha mancha--purple" />
        <span className="mancha mancha--pink" />
        <span className="mancha mancha--orange" />
        <span className="mancha mancha--blue" />
      </div>

      <BarraSuperior
        user={user}
        elegida={elegida}
        abierto={abierto}
        onAbrir={() => setAbierto(true)}
        onIr={ir}
        onLogout={onLogout}
      />

      <MenuLateral
        abierto={abierto}
        seccion={seccion}
        onCerrar={() => setAbierto(false)}
        onIr={ir}
        onLogout={onLogout}
      />

      {/* ===== CONTENIDO: 3 columnas en PC (izquierda | centro | derecha) ===== */}
      <div className="menu__layout">
        <ColumnaIzquierda user={user} onIr={ir} />

        <main className="menu__main">
          {elegida ? (
            // Pantalla de una tabla: el título es común a todas, el contenido sale de pantallas/
            // key distinta por tabla: React vuelve a crear la vista y se repite la animación de entrada
            <section key={elegida.id} className="menu__seccion menu__vista">
              <button type="button" className="menu__volver" onClick={() => ir(null)}>
                ← Volver al inicio
              </button>
              <h1>{elegida.nombre}</h1>
              <div className="menu__bar" aria-hidden="true"><span /><span /><span /><span /></div>
              <Pantalla />
            </section>
          ) : (
            <Inicio key="inicio" user={user} onIr={ir} />
          )}
        </main>

        <ColumnaDerecha />
      </div>

      {/* Ondas de colores al pie de la página */}
      <Olas />
    </div>
  )
}
