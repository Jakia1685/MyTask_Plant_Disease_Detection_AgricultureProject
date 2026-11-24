import { useState } from 'react'
import { Sprout, ScanSearch, History } from 'lucide-react'
import UploadPage from '@/components/UploadPage.jsx'
import AnalyzingPage from '@/components/AnalyzingPage.jsx'
import ResultPage from '@/components/ResultPage.jsx'
import HistoryPage from '@/components/HistoryPage.jsx'
import { predictDisease } from '@/services/diseaseApi.js'
import { addHistory, clearHistory, loadHistory, makeThumbnail, removeHistory } from '@/lib/storage.js'

export default function App() {
  const [view, setView] = useState('upload') // upload | analyzing | result | history
  const [pending, setPending] = useState(null)
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState(loadHistory)
  const [error, setError] = useState('')

  async function analyze({ file, plant, previewUrl }) {
    setError('')
    setPending({ plant, previewUrl })
    setView('analyzing')
    try {
      const [prediction, thumb] = await Promise.all([predictDisease(file, plant), makeThumbnail(file)])
      const entry = {
        id: Date.now().toString(36),
        date: new Date().toISOString(),
        plant,
        label: prediction.label,
        confidence: prediction.confidence,
        demo: prediction.demo,
        image: thumb,
      }
      setHistory(addHistory(entry))
      setResult(entry)
      setView('result')
    } catch (e) {
      // FR-14: AI সার্ভিস না পেলে ত্রুটি দেখাও, সংরক্ষিত ডেটা অপরিবর্তিত
      setError(`Could not get a prediction: ${e.message}. Your saved results are unchanged.`)
      setView('upload')
    }
  }

  const go = (v) => { setError(''); setView(v) }

  return (
    <div className="app">
      <header className="topbar">
        <button className="brand" onClick={() => go('upload')}>
          <span className="brand-icon"><Sprout size={22} /></span>
          <span>AI Smart Agriculture</span>
        </button>
        <nav>
          <button className={view === 'upload' || view === 'analyzing' || view === 'result' ? 'active' : ''} onClick={() => go('upload')}>
            <ScanSearch size={17} /> Detect
          </button>
          <button className={view === 'history' ? 'active' : ''} onClick={() => go('history')}>
            <History size={17} /> History {history.length > 0 && <span className="count">{history.length}</span>}
          </button>
        </nav>
      </header>

      <main>
        {error && <div className="banner banner-error top-error" role="alert"><p>{error}</p></div>}
        {view === 'upload' && <UploadPage onAnalyze={analyze} />}
        {view === 'analyzing' && <AnalyzingPage previewUrl={pending?.previewUrl} plant={pending?.plant} />}
        {view === 'result' && result && <ResultPage result={result} onNew={() => go('upload')} onHistory={() => go('history')} />}
        {view === 'history' && (
          <HistoryPage
            items={history}
            onOpen={(item) => { setResult(item); go('result') }}
            onDelete={(id) => setHistory(removeHistory(id))}
            onClear={() => setHistory(clearHistory())}
            onNew={() => go('upload')}
          />
        )}
      </main>

      <footer className="footer">© 2026 · AI Smart Agriculture — Plant Disease Detection module</footer>
    </div>
  )
}
