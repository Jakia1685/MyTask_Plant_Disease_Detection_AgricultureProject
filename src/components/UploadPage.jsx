import { useEffect, useRef, useState } from 'react'
import { CloudUpload, X, Zap, Info, AlertCircle } from 'lucide-react'
import { ALLOWED_TYPES, MAX_FILE_SIZE, PLANTS } from '@/lib/diseases.js'

export default function UploadPage({ onAnalyze }) {
  const [plant, setPlant] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!file) { setPreview(''); return }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  function pick(selected) {
    setError('')
    if (!selected) return
    if (!ALLOWED_TYPES.includes(selected.type)) {
      setError('Only JPG or PNG images are accepted.')
      return
    }
    if (selected.size > MAX_FILE_SIZE) {
      setError('The image is larger than 5 MB. Please choose a smaller one.')
      return
    }
    setFile(selected)
  }

  function clear() {
    setFile(null)
    setError('')
    if (inputRef.current) inputRef.current.value = ''
  }

  function submit(e) {
    e.preventDefault()
    if (!plant) return setError('Select a plant type to continue.')
    if (!file) return setError('Upload a leaf photograph to continue.')
    onAnalyze({ file, plant, previewUrl: preview })
  }

  return (
    <section className="page">
      <header className="page-head">
        <span className="kicker">SERVICE 01 / UNDERSTAND PLANT HEALTH</span>
        <h1>Plant Disease Detection</h1>
        <p>Upload a clear photograph of a single leaf. The AI returns the most likely disease class with a confidence score.</p>
      </header>

      <form className="grid-2" onSubmit={submit} noValidate>
        <div>
          <div
            className={`dropzone ${dragging ? 'dragging' : ''} ${preview ? 'has-image' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); pick(e.dataTransfer.files?.[0]) }}
          >
            {preview ? (
              <>
                <img src={preview} alt="Selected leaf preview" />
                <button type="button" className="remove-btn" onClick={clear} aria-label="Remove image"><X size={18} /></button>
              </>
            ) : (
              <>
                <div className="drop-icon"><CloudUpload size={32} /></div>
                <p className="drop-title">Drag and drop a leaf image</p>
                <p className="muted small">JPG or PNG · Maximum 5 MB · One leaf in focus</p>
                <label className="btn btn-primary btn-pill">
                  Browse Files
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    hidden
                    onChange={(e) => pick(e.target.files?.[0])}
                  />
                </label>
              </>
            )}
          </div>
          {file && <p className="muted small file-name">{file.name} · {(file.size / 1024).toFixed(0)} KB</p>}
        </div>

        <div className="stack">
          <label className="field">
            <span>Plant type</span>
            <select value={plant} onChange={(e) => { setPlant(e.target.value); setError('') }}>
              <option value="">Select a plant</option>
              {PLANTS.map((p) => <option key={p}>{p}</option>)}
            </select>
          </label>

          {error && <p className="form-error" role="alert"><AlertCircle size={16} /> {error}</p>}

          <button type="submit" className="btn btn-primary btn-xl">
            <Zap size={20} /> Analyze with AI
          </button>

          <div className="note">
            <Info size={20} />
            <p>Supported plants: Potato and Tomato. Results are an AI estimate, not a guaranteed diagnosis — confirm with an agricultural expert before acting.</p>
          </div>
        </div>
      </form>
    </section>
  )
}
