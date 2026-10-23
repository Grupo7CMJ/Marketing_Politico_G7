// Cliente base para hablar con la API de Django
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export async function api(endpoint, options = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!res.ok) throw new Error(`Error ${res.status} en ${endpoint}`)
  return res.status === 204 ? null : res.json()
}
