import { useMemo, useState } from 'react'
import { Search, Calendar, Trash2, Camera } from 'lucide-react'
import { CONFIDENCE_THRESHOLD, PLANTS, findDisease } from '@/lib/diseases.js'

export default function HistoryPage({ items, onOpen, onDelete, onClear, onNew }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')

  const shown = useMemo(() => items.filter((i) => {
    const q = query.trim().toLowerCase()
    const matchQ = !q || i.label.toLowerCase().includes(q) || i.plant.toLowerCase().includes(q)
    const matchF = filter === 'All' || i.plant === filter
    return matchQ && matchF
  }), [items, query, filter])

  return (
    <section className="page">
      <header className="page-head">
        <span className="kicker">PREDICTION HISTORY</span>
        <h1>Analysis History</h1>
        <p>Your previous disease detection results are saved in this browser.</p>
      </header>

      <div className="toolbar">
        <div className="search">
          <Search size={18} />
          <input placeholder="Search by plant or disease…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="chips">
          {['All', ...PLANTS].map((f) => (
            <button key={f} type="button" className={`chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        {items.length > 0 && (
          <button
            className="btn btn-ghost"
            onClick={() => { if (window.confirm('Delete all saved results?')) onClear() }}
          >
            <Trash2 size={16} /> Clear all
          </button>
        )}
      </div>

      <div className="cards">
        {shown.map((item) => {
          const healthy = findDisease(item.plant, item.label)?.healthy
          const low = item.confidence < CONFIDENCE_THRESHOLD
          return (
            <article className="history-card" key={item.id}>
              <div className="thumb">
                {item.image ? <img src={item.image} alt={`${item.plant} leaf`} /> : <div className="thumb-empty"><Camera size={28} /></div>}
                <span className={`tag floating ${healthy ? 'ok' : 'bad'}`}>{healthy ? 'Healthy' : 'Disease'}</span>
              </div>
              <div className="history-body">
                <div className="history-title">
                  <h3>{item.plant} — {item.label}</h3>
                  <strong className="conf">{item.confidence}%</strong>
                </div>
                <p className="muted small"><Calendar size={14} /> {new Date(item.date).toLocaleString()}</p>
                {low && <p className="small warn">Low confidence — retake the photo</p>}
                {item.demo && <p className="small muted">Demo result (simulated)</p>}
                <div className="row">
                  <button className="btn btn-outline btn-sm" onClick={() => onOpen(item)}>View report</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => onDelete(item.id)} aria-label="Delete result"><Trash2 size={16} /></button>
                </div>
              </div>
            </article>
          )
        })}

        <button className="history-card new-card" onClick={onNew}>
          <div className="drop-icon"><Camera size={30} /></div>
          <h3>New scan</h3>
          <p className="muted small">Upload a leaf photo to start a new analysis.</p>
        </button>
      </div>

      {items.length === 0 && <p className="empty muted">No saved results yet. Run your first analysis to see it here.</p>}
      {items.length > 0 && shown.length === 0 && <p className="empty muted">No results match your search.</p>}
    </section>
  )
}
