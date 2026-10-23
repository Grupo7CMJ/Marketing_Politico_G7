import { useState } from 'react'
// Importa la pantalla de login que creamos
import Login from './components/Login'

function App() {
  // "user" guarda los datos del usuario logueado. null = nadie inició sesión todavía
  const [user, setUser] = useState(null)

  // Si no hay usuario, muestra el login.
  // Cuando el login sale bien, Login llama a setUser(...) y se pasa a la siguiente pantalla
  if (!user) return <Login onLogin={setUser} />

  // Acá va el resto de tu sistema (dashboard, menú, etc.). Por ahora un texto de prueba
  return <h1>Sesión iniciada</h1>
}

export default App