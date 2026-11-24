import { useEffect, useState } from 'react'
import { Brain, CheckCircle2, Loader2, Circle } from 'lucide-react'

const STEPS = ['Image uploaded', 'Resizing & normalising image', 'Running disease classifier', 'Preparing result']

export default function AnalyzingPage({ previewUrl, plant }) {
  const [active, setActive] = useState(1)

  useEffect(() => {
    const t = setInterval(() => setActive((s) => Math.min(s + 1, STEPS.length - 1)), 700)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="page analyzing">
      <div className="pulse-ring"><div className="pulse-ring-inner"><Brain size={52} /></div></div>
      <h1>Analyzing your {plant} leaf…</h1>
      <p className="muted">This usually takes a few seconds.</p>

      <div className="analyze-card">
        {previewUrl && <img src={previewUrl} alt="Leaf being analyzed" />}
        <ul>
          {STEPS.map((label, i) => (
            <li key={label} className={i < active ? 'done' : i === active ? 'running' : 'waiting'}>
              {i < active ? <CheckCircle2 size={20} /> : i === active ? <Loader2 size={20} className="spin" /> : <Circle size={18} />}
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
