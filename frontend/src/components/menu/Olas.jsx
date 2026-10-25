// ----- ONDAS ANIMADAS DEL PIE (los colores de las olas del login) -----
// Cada capa es una onda que se repite: el SVG mide el doble de ancho y se corre
// hacia la izquierda en loop, así parece que el mar nunca se corta
function onda(y, alto) {
  let d = `M0 ${y}`
  for (let x = 0; x < 2880; x += 720) {
    d += ` C${x + 360} ${y - alto} ${x + 360} ${y + alto} ${x + 720} ${y}`
  }
  return `${d} V200 H0 Z`
}

// De atrás hacia adelante: celeste, naranja, rosa, violeta
const CAPAS = [
  { color: '#35b4e7', d: onda(70, 40), segundos: 34 },
  { color: '#fdb03e', d: onda(95, 34), segundos: 26 },
  { color: '#d8267e', d: onda(122, 30), segundos: 20 },
  { color: '#533693', d: onda(150, 22), segundos: 15 },
]

export default function Olas() {
  return (
    <div className="olas" aria-hidden="true">
      {CAPAS.map((c, i) => (
        <svg
          key={c.color}
          viewBox="0 0 2880 200"
          preserveAspectRatio="none"
          // las capas pares van para un lado y las impares para el otro
          style={{ '--seg': `${c.segundos}s`, animationDirection: i % 2 ? 'reverse' : 'normal' }}
        >
          <path d={c.d} fill={c.color} />
        </svg>
      ))}
    </div>
  )
}
