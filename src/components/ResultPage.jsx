import { AlertTriangle, CheckCircle2, RefreshCcw, History as HistoryIcon, FlaskConical, Leaf } from 'lucide-react'
import { CONFIDENCE_THRESHOLD, findDisease } from '@/lib/diseases.js'

export default function ResultPage({ result, onNew, onHistory }) {
  const disease = findDisease(result.plant, result.label)
  const low = result.confidence < CONFIDENCE_THRESHOLD
  const healthy = disease?.healthy

  return (
    <section className="page">
      <header className="page-head">
        <span className="kicker">DIAGNOSIS REPORT</span>
        <h1>Analysis Result</h1>
        <p>{result.plant} leaf · {new Date(result.date).toLocaleString()}</p>
      </header>

      {result.demo && (
        <div className="banner banner-warn" role="status">
          <FlaskConical size={20} />
          <p><strong>Demo mode.</strong> No trained model is connected yet, so this result is simulated and is not a real diagnosis.</p>
        </div>
      )}

      <div className="grid-2">
        <div className="result-image">
          <img src={result.image} alt={`${result.plant} leaf`} />
          <div className="image-caption">
            <div><small>Plant</small><strong>{result.plant}</strong></div>
            <div><small>Confidence</small><strong>{result.confidence}%</strong></div>
          </div>
        </div>

        <div className="stack">
          <div className="card">
            <div className="result-head">
              <div className={`result-icon ${healthy ? 'ok' : 'bad'}`}>
                {healthy ? <CheckCircle2 size={28} /> : <AlertTriangle size={28} />}
              </div>
              <div>
                <h2>{result.label}</h2>
                <p className={`tag ${healthy ? 'ok' : 'bad'}`}>{healthy ? 'No disease detected' : 'Disease detected'}</p>
              </div>
            </div>

            <div className="meter" aria-label={`Confidence ${result.confidence}%`}>
              <div className="meter-fill" style={{ width: `${Math.min(100, result.confidence)}%` }} />
            </div>
            <p className="muted small">Confidence score: {result.confidence}%</p>

            {disease && <p className="body">{disease.info}</p>}
          </div>

          {low && (
            <div className="banner banner-error" role="alert">
              <AlertTriangle size={20} />
              <p><strong>Low confidence.</strong> The score is below {CONFIDENCE_THRESHOLD}%. Please upload a clearer photo: one leaf, good daylight, in focus, filling most of the frame.</p>
            </div>
          )}

          <div className="note">
            <Leaf size={20} />
            <p>This is an AI estimate only. It does not replace an agricultural expert.</p>
          </div>

          <div className="row">
            <button className="btn btn-primary" onClick={onNew}><RefreshCcw size={16} /> Analyze another leaf</button>
            <button className="btn btn-outline" onClick={onHistory}><HistoryIcon size={16} /> View history</button>
          </div>
        </div>
      </div>
    </section>
  )
}
