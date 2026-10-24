// Cliente base para hablar con la API de Django
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Token guardado en el login (localStorage si marcó "Recordar", si no sessionStorage)
export function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token')
}

export function clearToken() {
  localStorage.removeItem('token')
  sessionStorage.removeItem('token')
}

export async function api(endpoint, options = {}) {
  const token = getToken()
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      // Si hay sesión iniciada, Django identifica al usuario con este header
      ...(token && { Authorization: `Token ${token}` }),
      ...options.headers,
    },
  })
  if (!res.ok) throw new Error(`Error ${res.status} en ${endpoint}`)
  return res.status === 204 ? null : res.json()
}
