// Pantalla de la tabla "militantes": listado, buscador, alta, modificación y baja
import { useEffect, useState } from 'react'
import { api } from '../../api'

// Formulario vacío (para el alta). Los desplegables usan '' para "ninguno"
const VACIO = {
  nombre: '', apellido: '', documento: '', telefono: '',
  id_equipo: '', id_usuario: '', id_rol: '',
}

// Campos de texto del formulario, en el orden en que se muestran
const CAMPOS = [
  { id: 'nombre', texto: 'Nombre', obligatorio: true },
  { id: 'apellido', texto: 'Apellido', obligatorio: true },
  { id: 'documento', texto: 'Documento' },
  { id: 'telefono', texto: 'Teléfono' },
]

// Saca acentos y pasa a minúsculas, para que "perez" encuentre "Pérez"
function normalizar(texto) {
  return (texto || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

// Texto de un usuario en el desplegable: "Carlos Pérez (carlos@mail.com)" o solo el correo
function textoUsuario(u) {
  const nombre = `${u.first_name || ''} ${u.last_name || ''}`.trim()
  return nombre ? `${nombre} (${u.email})` : u.email
}

export default function Militantes() {
  const [lista, setLista] = useState([])          // militantes que vinieron de Django
  const [opciones, setOpciones] = useState({ equipos: [], usuarios: [], roles: [] })
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')          // error al cargar el listado
  const [busqueda, setBusqueda] = useState('')
  const [form, setForm] = useState(null)          // null = formulario cerrado
  const [editando, setEditando] = useState(null)  // militante que se edita, null = alta
  const [errores, setErrores] = useState({})      // errores de validación por campo
  const [guardando, setGuardando] = useState(false)

  // Trae el listado y las opciones de los desplegables (equipos, usuarios libres, roles)
  function cargar() {
    Promise.all([api('/militantes/'), api('/militantes/opciones/')])
      .then(([datos, ops]) => { setLista(datos); setOpciones(ops); setError('') })
      .catch(() => setError('No se pudo cargar el listado. ¿Está prendido Django?'))
      .finally(() => setCargando(false))
  }

  useEffect(cargar, [])

  function nuevo() {
    setForm(VACIO)
    setEditando(null)
    setErrores({})
  }

  function editar(m) {
    // Los campos vacíos vienen como null desde Django: los inputs y desplegables necesitan ''
    setForm(Object.fromEntries(Object.keys(VACIO).map((campo) => [campo, m[campo] ?? ''])))
    setEditando(m)
    setErrores({})
  }

  function cambiar(campo, valor) {
    const nuevoForm = { ...form, [campo]: valor }
    // Sin usuario no hay dónde guardar el rol
    if (campo === 'id_usuario' && !valor) nuevoForm.id_rol = ''
    setForm(nuevoForm)
  }

  async function guardar(e) {
    e.preventDefault()
    setGuardando(true)
    const cuerpo = {
      ...form,
      // Documento vacío se manda como null: si no, dos militantes sin documento chocan con el "unique"
      documento: form.documento.trim() || null,
      // Los desplegables guardan texto: se pasan a número, o null si no se eligió nada
      id_equipo: Number(form.id_equipo) || null,
      id_usuario: Number(form.id_usuario) || null,
      id_rol: Number(form.id_rol) || null,
    }
    try {
      if (editando) {
        await api(`/militantes/${editando.id_militante}/`, { method: 'PATCH', body: JSON.stringify(cuerpo) })
      } else {
        await api('/militantes/', { method: 'POST', body: JSON.stringify(cuerpo) })
      }
      setForm(null)
      cargar()
    } catch (err) {
      setErrores(err.datos || { general: ['No se pudo guardar.'] })
    } finally {
      setGuardando(false)
    }
  }

  async function borrar(m) {
    if (!window.confirm(`¿Borrar a ${m.nombre} ${m.apellido}?`)) return
    try {
      await api(`/militantes/${m.id_militante}/`, { method: 'DELETE' })
      cargar()
    } catch {
      // Falla si el militante tiene cuestionarios asignados (on_delete=PROTECT)
      window.alert('No se pudo borrar. Puede que tenga cuestionarios asignados.')
    }
  }

  const texto = normalizar(busqueda)
  const filtrados = lista.filter((m) =>
    normalizar(`${m.nombre} ${m.apellido} ${m.documento}`).includes(texto),
  )

  // Django solo manda los usuarios libres: al editar se suma el que ya tiene este militante
  const usuarios = editando?.id_usuario
    ? [{ id: editando.id_usuario, email: editando.usuario }, ...opciones.usuarios]
    : opciones.usuarios

  // Mensaje de error de un campo (Django los manda como lista)
  const errorDe = (campo) => errores[campo] && <small className="pantalla__error">{errores[campo][0]}</small>

  return (
    <div className="pantalla">
      {/* Barra de herramientas: buscador + botón de alta */}
      <div className="pantalla__barra">
        <input
          type="search"
          className="pantalla__buscar"
          placeholder="Buscar por nombre, apellido o documento"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button type="button" className="pantalla__boton" onClick={nuevo}>+ Nuevo militante</button>
      </div>

      {/* Formulario de alta / modificación */}
      {form && (
        <form className="panel pantalla__form" onSubmit={guardar}>
          <h2 className="panel__titulo">{editando ? 'Editar militante' : 'Nuevo militante'}</h2>

          <p className="pantalla__grupo">Datos personales</p>
          <div className="pantalla__campos">
            {CAMPOS.map((c) => (
              <label key={c.id} className="pantalla__campo">
                <span>{c.texto}{c.obligatorio && ' *'}</span>
                <input
                  value={form[c.id]}
                  required={c.obligatorio}
                  onChange={(e) => cambiar(c.id, e.target.value)}
                />
                {errorDe(c.id)}
              </label>
            ))}
          </div>

          <p className="pantalla__grupo">Asignación</p>
          <div className="pantalla__campos">
            <label className="pantalla__campo">
              <span>Equipo</span>
              <select value={form.id_equipo} onChange={(e) => cambiar('id_equipo', e.target.value)}>
                <option value="">Sin equipo</option>
                {opciones.equipos.map((eq) => (
                  <option key={eq.id_equipo} value={eq.id_equipo}>{eq.nombre}</option>
                ))}
              </select>
              {opciones.equipos.length === 0 && <small className="pantalla__ayuda">Todavía no hay equipos cargados.</small>}
              {errorDe('id_equipo')}
            </label>

            <label className="pantalla__campo">
              <span>Usuario del sistema</span>
              <select value={form.id_usuario} onChange={(e) => cambiar('id_usuario', e.target.value)}>
                <option value="">Sin usuario</option>
                {usuarios.map((u) => (
                  <option key={u.id} value={u.id}>{textoUsuario(u)}</option>
                ))}
              </select>
              <small className="pantalla__ayuda">La cuenta con la que entra al sistema.</small>
              {errorDe('id_usuario')}
            </label>

            <label className="pantalla__campo">
              <span>Rol</span>
              <select
                value={form.id_rol}
                disabled={!form.id_usuario}
                onChange={(e) => cambiar('id_rol', e.target.value)}
              >
                <option value="">Sin rol</option>
                {opciones.roles.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
              <small className="pantalla__ayuda">
                {form.id_usuario ? 'Se guarda en su usuario.' : 'Primero elegí un usuario.'}
              </small>
              {errorDe('id_rol')}
            </label>
          </div>

          {errores.general && <p className="pantalla__error">{errores.general[0]}</p>}
          {errores.non_field_errors && <p className="pantalla__error">{errores.non_field_errors[0]}</p>}
          <div className="pantalla__acciones">
            <button type="button" className="pantalla__boton pantalla__boton--suave" onClick={() => setForm(null)}>
              Cancelar
            </button>
            <button type="submit" className="pantalla__boton" disabled={guardando}>
              {guardando ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      )}

      {/* Listado */}
      <div className="panel pantalla__tabla-caja">
        {cargando && <p className="pantalla__aviso">Cargando…</p>}
        {!cargando && error && <p className="pantalla__aviso pantalla__error">{error}</p>}
        {!cargando && !error && filtrados.length === 0 && (
          <p className="pantalla__aviso">
            {lista.length === 0 ? 'Todavía no hay militantes cargados.' : 'No hay resultados para esa búsqueda.'}
          </p>
        )}
        {!cargando && !error && filtrados.length > 0 && (
          <table className="pantalla__tabla">
            <thead>
              <tr>
                <th>Apellido y nombre</th>
                <th>Documento</th>
                <th>Teléfono</th>
                <th>Equipo</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th aria-label="Acciones" />
              </tr>
            </thead>
            <tbody>
              {filtrados.map((m) => (
                <tr key={m.id_militante}>
                  <td><strong>{m.apellido}</strong>, {m.nombre}</td>
                  <td>{m.documento || '—'}</td>
                  <td>{m.telefono || '—'}</td>
                  <td>{m.equipo || 'Sin equipo'}</td>
                  <td>{m.usuario || 'Sin usuario'}</td>
                  <td>{m.rol || '—'}</td>
                  <td className="pantalla__fila-acciones">
                    <button type="button" onClick={() => editar(m)}>Editar</button>
                    <button type="button" className="is-peligro" onClick={() => borrar(m)}>Borrar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
