// ----- ÍCONOS -----
// Cada ícono es una lista de trazos SVG (líneas finas, como los del login).
// Se usa en el menú y en las pantallas: <Icono nombre="zonas" />
const ICONOS = {
  usuarios: ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', 'M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z'],
  militantes: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z', 'm16 11 2 2 4-4'],
  encuestados: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z', 'M14 2v6h6', 'M12 12a2 2 0 1 0 0 .01', 'M8 18a4 4 0 0 1 8 0'],
  roles: ['M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6Z', 'm9 12 2 2 4-4'],
  permisos: ['M15 7a4 4 0 1 0-3.9 5L4 19v2h3l1-1v-2h2v-2h2l1.4-1.4A4 4 0 0 0 15 7Z', 'M16 7h.01'],
  zonas: ['M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z', 'M12 7.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z'],
  barrios: ['M3 21h18', 'M5 21V10l5-4 5 4v11', 'M15 21v-7h4v7', 'M9 21v-4h2v4'],
  calles: ['M5 21 9 3', 'M19 21 15 3', 'M12 5v2', 'M12 11v2', 'M12 17v2'],
  rutas: ['M6 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z', 'M18 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z', 'M6 9v3a3 3 0 0 0 3 3h6'],
  equipos: ['M17 21v-2a4 4 0 0 0-3-3.9', 'M7 21v-2a4 4 0 0 1 3-3.9', 'M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z', 'M19 8a2.5 2.5 0 1 1 0 5', 'M5 8a2.5 2.5 0 1 0 0 5'],
  cuestionarios: ['M9 4H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2', 'M9 2h6v4H9Z', 'M9 12h6', 'M9 16h4'],
  categorias: ['M4 4h6v6H4Z', 'M14 4h6v6h-6Z', 'M4 14h6v6H4Z', 'M14 14h6v6h-6Z'],
  preguntas: ['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z', 'M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14', 'M12 17h.01'],
  opciones: ['M9 6h11', 'M9 12h11', 'M9 18h11', 'M4.5 6h.01', 'M4.5 12h.01', 'M4.5 18h.01'],
  respuestas: ['M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z', 'm8 10 2 2 4-4'],
  inicio: ['m3 11 9-8 9 8', 'M5 10v10h14V10'],
  salir: ['M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4', 'm16 17 5-5-5-5', 'M21 12H9'],
  campana: ['M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9', 'M10.3 21a1.9 1.9 0 0 0 3.4 0'],
  flecha: ['M5 12h14', 'm13 6 6 6-6 6'],
  actividad: ['M3 12h4l3-8 4 16 3-8h4'],
  mail: ['M3 5h18v14H3Z', 'm3 7 9 6 9-6'],
  buscar: ['M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Z', 'm20 20-3.5-3.5'],
  abajo: ['m6 9 6 6 6-6'],
}

export default function Icono({ nombre }) {
  return (
    <svg className="icono" viewBox="0 0 24 24" aria-hidden="true">
      {ICONOS[nombre].map((d) => <path key={d} d={d} />)}
    </svg>
  )
}
