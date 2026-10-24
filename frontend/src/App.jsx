import { useEffect, useState } from 'react'
import { api, clearToken, getToken } from './api'
// Pantallas del sistema
import Login from './components/Login'
import Menu from './components/Menu'

function App() {
  // "user" guarda los datos del usuario logueado. null = nadie inició sesión todavía
  const [user, setUser] = useState(null)
  // true mientras se revisa si ya había una sesión guardada (para no mostrar el login de golpe)
  const [checking, setChecking] = useState(() => Boolean(getToken()))

  // Al abrir la página: si hay un token guardado, le pregunta a Django de quién es
  useEffect(() => {
    if (!getToken()) return
    api('/auth/me/')
      .then(setUser)
      .catch(clearToken) // token vencido o borrado: se pide login de nuevo
      .finally(() => setChecking(false))
  }, [])

  async function handleLogout() {
    try {
      await api('/auth/logout/', { method: 'POST' })
    } catch {
      // Aunque falle el servidor, igual se cierra la sesión en el navegador
    }
    clearToken()
    setUser(null)
  }

  if (checking) return null

  // Si no hay usuario, muestra el login. El login devuelve {token, usuario}
  if (!user) return <Login onLogin={(data) => setUser(data.usuario)} />

  return <Menu user={user} onLogout={handleLogout} />
}

export default App
