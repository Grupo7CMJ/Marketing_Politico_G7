import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { api } from '../api'
import './Rutas.css'

const FORM_VACIO = { nombre: '', descripcion: '' }

// Pasa a minúsculas y saca acentos
function normalizar(texto) {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

// Convierte los errores de Django ({campo: ["mensaje"]}) en {campo: "mensaje"}
function leerErrores(error) {
  const data = error.data
  if (!data || typeof data !== 'object') {
    return {
      general: error.status
        ? `El servidor respondió con error ${error.status}. Mirá la terminal de Django para ver el detalle.`
        : 'No se pudo conectar con el servidor. Revisá que Django esté encendido.',
    }
  }
  const resultado = {}
  for (const [campo, msgs] of Object.entries(data)) {
    const texto = Array.isArray(msgs) ? msgs.join(' ') : String(msgs)
    resultado[campo === 'non_field_errors' || campo === 'detail' ? 'general' : campo] = texto
  }
  return resultado
}

// Ventana emergente. Se dibuja fuera del menú (en <body>) para que quede por encima de todo
function Modal({ titulo, onClose, children }) {
  useEffect(() => {
    function teclas(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', teclas)
    return () => window.removeEventListener('keydown', teclas)
  }, [onClose])

  return createPortal(
    <div className="rt-modal" onMouseDown={onClose}>
      <div
        className="rt-modal__caja"
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2>{titulo}</h2>
        {children}
      </div>
    </div>,
    document.body,
  )
}

export default function Rutas() {
  const [rutas, setRutas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [errorLista, setErrorLista] = useState('')
  const [busqueda, setBusqueda] = useState('')

  const [form, setForm] = useState(null)             // null = formulario cerrado
  const [editandoId, setEditandoId] = useState(null) // null = es una ruta nueva
  const [errores, setErrores] = useState({})
  const [guardando, setGuardando] = useState(false)

  const [aBorrar, setABorrar] = useState(null)       // ruta que se está por borrar
  const [borrando, setBorrando] = useState(false)
  const [errorBorrar, setErrorBorrar] = useState('')

  const [aviso, setAviso] = useState('')

  // ----- Carga de la lista -----
  // silencioso = true: recarga sin mostrar "Cargando…" (se usa después de guardar o borrar)
  async function cargar(silencioso = false) {
    if (!silencioso) setCargando(true)
    setErrorLista('')
    try {
      setRutas(await api('/rutas/'))
    } catch {
      setErrorLista('No se pudieron cargar las rutas. Revisá que el servidor esté encendido.')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  // El cartelito verde se apaga solo a los 3 segundos
  useEffect(() => {
    if (!aviso) return
    const t = setTimeout(() => setAviso(''), 3000)
    return () => clearTimeout(t)
  }, [aviso])

  const visibles = useMemo(() => {
    const q = normalizar(busqueda.trim())
    if (!q) return rutas
    return rutas.filter((r) => normalizar(`${r.nombre} ${r.descripcion || ''}`).includes(q))
  }, [rutas, busqueda])

  // ----- Crear / editar -----
  function abrirNueva() {
    setEditandoId(null)
    setForm(FORM_VACIO)
    setErrores({})
  }

  function abrirEditar(ruta) {
    setEditandoId(ruta.id_ruta)
    setForm({ nombre: ruta.nombre, descripcion: ruta.descripcion || '' })
    setErrores({})
  }

  function cerrarForm() {
    if (!guardando) setForm(null)
  }

  function cambiar(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }))
    setErrores((e) => ({ ...e, [campo]: undefined, general: undefined }))
  }

  async function guardar(e) {
    e.preventDefault()

    if (!form.nombre.trim()) {
      setErrores({ nombre: 'Escribí un nombre para la ruta.' })
      return
    }

    setGuardando(true)
    setErrores({})
    try {
      const body = JSON.stringify({
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim() || null,
      })
      if (editandoId) {
        await api(`/rutas/${editandoId}/`, { method: 'PUT', body })
      } else {
        await api('/rutas/', { method: 'POST', body })
      }
      setForm(null)
      setAviso(editandoId ? 'Ruta actualizada.' : 'Ruta creada.')
      await cargar(true)
    } catch (err) {
      setErrores(leerErrores(err))
    } finally {
      setGuardando(false)
    }
  }

  // ----- Borrar -----
  async function borrar() {
    setBorrando(true)
    setErrorBorrar('')
    try {
      await api(`/rutas/${aBorrar.id_ruta}/`, { method: 'DELETE' })
      setABorrar(null)
      setAviso('Ruta eliminada.')
      await cargar(true)
    } catch (err) {
      // Si Django la rechazó porque ya tiene equipos, muestra su mensaje y refresca la lista
      setErrorBorrar(err.data?.detail || 'No se pudo eliminar la ruta. Probá de nuevo.')
      if (err.status === 409) cargar(true)
    } finally {
      setBorrando(false)
    }
  }

  // ----- Pantalla -----
  return (
    <div className="rutas">
      <div className="rt-barra">
        <input
          type="search"
          className="rt-input rt-barra__buscar"
          placeholder="Buscar por nombre o descripción…"
          aria-label="Buscar rutas"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button type="button" className="rt-btn rt-btn--primario" onClick={abrirNueva}>
          + Nueva ruta
        </button>
      </div>

      {aviso && <div className="rt-aviso" role="status">{aviso}</div>}

      {cargando && <div className="rt-estado">Cargando rutas…</div>}

      {!cargando && errorLista && (
        <div className="rt-estado rt-estado--error">
          <p>{errorLista}</p>
          <button type="button" className="rt-btn" onClick={() => cargar()}>Reintentar</button>
        </div>
      )}

      {!cargando && !errorLista && rutas.length === 0 && (
        <div className="rt-estado">
          <p>Todavía no hay rutas cargadas.</p>
          <button type="button" className="rt-btn rt-btn--primario" onClick={abrirNueva}>
            Crear la primera ruta
          </button>
        </div>
      )}

      {!cargando && !errorLista && rutas.length > 0 && (
        <>
          <p className="rt-contador">
            {visibles.length} de {rutas.length} {rutas.length === 1 ? 'ruta' : 'rutas'}
          </p>

          {visibles.length === 0 ? (
            <div className="rt-estado">No hay rutas que coincidan con la búsqueda.</div>
          ) : (
            <div className="rt-tabla-wrap">
              <table className="rt-tabla">
                <thead>
                  <tr>
                    <th>Ruta</th>
                    <th>Descripción</th>
                    <th className="rt-num">Equipos</th>
                    <th aria-label="Acciones" />
                  </tr>
                </thead>
                <tbody>
                  {visibles.map((r) => (
                    <tr key={r.id_ruta}>
                      <td><strong>{r.nombre}</strong></td>
                      <td>{r.descripcion || <span className="rt-sin">—</span>}</td>
                      <td className="rt-num">{r.cantidad_equipos}</td>
                      <td className="rt-acciones">
                        <button type="button" className="rt-btn rt-btn--chico" onClick={() => abrirEditar(r)}>
                          Editar
                        </button>

                        {/* Con equipos asignados: el botón queda bloqueado y explica por qué */}
                        {r.cantidad_equipos > 0 ? (
                          <button
                            type="button"
                            className="rt-btn rt-btn--chico"
                            disabled
                            title="Tiene equipos asignados: no se puede eliminar"
                          >
                            Eliminar
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="rt-btn rt-btn--chico rt-btn--peligro"
                            onClick={() => {
                              setErrorBorrar('')
                              setABorrar(r)
                            }}
                          >
                            Eliminar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ===== Formulario de crear / editar ===== */}
      {form && (
        <Modal titulo={editandoId ? 'Editar ruta' : 'Nueva ruta'} onClose={cerrarForm}>
          <form onSubmit={guardar} noValidate>
            <label className="rt-campo">
              <span>Nombre *</span>
              <input
                className="rt-input"
                type="text"
                maxLength={120}
                autoFocus
                value={form.nombre}
                onChange={(e) => cambiar('nombre', e.target.value)}
              />
              {errores.nombre && <em>{errores.nombre}</em>}
            </label>

            <label className="rt-campo">
              <span>Descripción</span>
              <textarea
                className="rt-input"
                rows={3}
                placeholder="Opcional: recorrido, referencias, horarios…"
                value={form.descripcion}
                onChange={(e) => cambiar('descripcion', e.target.value)}
              />
              {errores.descripcion && <em>{errores.descripcion}</em>}
            </label>

            {errores.general && <p className="rt-error">{errores.general}</p>}

            <div className="rt-modal__pie">
              <button type="button" className="rt-btn" onClick={cerrarForm} disabled={guardando}>
                Cancelar
              </button>
              <button type="submit" className="rt-btn rt-btn--primario" disabled={guardando}>
                {guardando ? 'Guardando…' : 'Guardar'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ===== Confirmación de borrado ===== */}
      {aBorrar && (
        <Modal titulo="Eliminar ruta" onClose={() => !borrando && setABorrar(null)}>
          <p className="rt-confirmar">
            ¿Seguro que querés eliminar la ruta <strong>{aBorrar.nombre}</strong>?
            Se borra de forma permanente y no se puede deshacer.
          </p>
          {errorBorrar && <p className="rt-error">{errorBorrar}</p>}
          <div className="rt-modal__pie">
            <button type="button" className="rt-btn" onClick={() => setABorrar(null)} disabled={borrando}>
              Cancelar
            </button>
            <button type="button" className="rt-btn rt-btn--peligro-solido" onClick={borrar} disabled={borrando}>
              {borrando ? 'Eliminando…' : 'Eliminar definitivamente'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}