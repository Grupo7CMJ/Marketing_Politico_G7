# Consultora — Sistema Web

Monorepo con dos partes:

```
backend/    API en Django + Django REST Framework (PostgreSQL en Neon)
frontend/   Interfaz en React + Vite
```

## Backend (Django)

Desde la raíz del repo:

```
python -m venv venv
venv\Scripts\activate
pip install -r backend\requirements.txt
```

Copiar `backend\.env.example` como `backend\.env` y completar los datos (la URL de la base se pasa por privado, nunca se sube al repo).

```
cd backend
python manage.py migrate
python manage.py runserver
```

La API queda en http://localhost:8000

## Frontend (React)

Requiere Node.js 20 o superior.

```
cd frontend
npm install
```

Copiar `frontend\.env.example` como `frontend\.env`.

```
npm run dev
```

La app queda en http://localhost:5173

## Reglas del equipo

- No subir ningún `.env` (ya están en `.gitignore`).
- Las migraciones (`backend/consultora/migrations/`) **sí** se suben.
- Si instalás un paquete de Python, actualizá los requirements:
  `pip freeze | Out-File -Encoding utf8 backend\requirements.txt`
- Si instalás un paquete de Node, se actualiza solo `package.json`: subilo junto con `package-lock.json`.
