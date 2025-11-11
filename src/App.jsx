import { useState } from 'react'

const BACKEND = import.meta.env.VITE_BACKEND_URL || ''

function App() {
  const [text, setText] = useState('Tulis naskahmu di sini. Aplikasi ini akan membuat video dengan teks berjalan selama minimal 60 detik. Kamu bisa mengubah warna, ukuran, dan FPS.')
  const [duration, setDuration] = useState(60)
  const [width, setWidth] = useState(1280)
  const [height, setHeight] = useState(720)
  const [fps, setFps] = useState(24)
  const [bg, setBg] = useState('#0f172a')
  const [color, setColor] = useState('#e2e8f0')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    setError('')
    setResult(null)
    setLoading(true)
    try {
      const res = await fetch(`${BACKEND}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, duration: Math.max(60, Number(duration)), width: Number(width), height: Number(height), fps: Number(fps), background: bg, text_color: color })
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || 'Gagal membuat video')
      }
      const data = await res.json()
      setResult({ ...data, fullUrl: `${BACKEND}${data.url}` })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="px-6 py-4 border-b bg-white/70 backdrop-blur">
        <h1 className="text-2xl font-semibold text-slate-800">Text ➜ Video Generator</h1>
        <p className="text-slate-500 text-sm">Buat video teks berjalan minimal 60 detik</p>
      </header>

      <main className="max-w-5xl mx-auto p-6 grid lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <label className="text-sm font-medium text-slate-700">Teks</label>
          <textarea
            className="mt-2 w-full h-48 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-slate-600">Durasi (detik, ≥60)</label>
              <input type="number" min={60} value={duration} onChange={(e)=>setDuration(e.target.value)} className="mt-1 w-full border rounded px-2 py-1"/>
            </div>
            <div>
              <label className="text-xs text-slate-600">Lebar</label>
              <input type="number" value={width} onChange={(e)=>setWidth(e.target.value)} className="mt-1 w-full border rounded px-2 py-1"/>
            </div>
            <div>
              <label className="text-xs text-slate-600">Tinggi</label>
              <input type="number" value={height} onChange={(e)=>setHeight(e.target.value)} className="mt-1 w-full border rounded px-2 py-1"/>
            </div>
            <div>
              <label className="text-xs text-slate-600">FPS</label>
              <input type="number" value={fps} min={10} max={60} onChange={(e)=>setFps(e.target.value)} className="mt-1 w-full border rounded px-2 py-1"/>
            </div>
            <div>
              <label className="text-xs text-slate-600">Warna Latar</label>
              <input type="color" value={bg} onChange={(e)=>setBg(e.target.value)} className="mt-1 w-full h-10 border rounded"/>
            </div>
            <div>
              <label className="text-xs text-slate-600">Warna Teks</label>
              <input type="color" value={color} onChange={(e)=>setColor(e.target.value)} className="mt-1 w-full h-10 border rounded"/>
            </div>
          </div>

          <button onClick={handleGenerate} disabled={loading} className="mt-5 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Sedang membuat...' : 'Buat Video'}
          </button>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </section>

        <section className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-slate-800">Hasil</h2>
          {!result && <p className="text-slate-500 text-sm mt-2">Video yang dibuat akan tampil di sini.</p>}
          {result && (
            <div className="mt-3">
              <video src={result.fullUrl} controls className="w-full aspect-video rounded-lg border" />
              <a href={result.fullUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block text-blue-600 hover:underline">
                Unduh video
              </a>
              <p className="text-xs text-slate-500 mt-1">Durasi: {result.duration}s</p>
            </div>
          )}
        </section>
      </main>

      <footer className="text-center text-xs text-slate-500 py-6">Dibuat otomatis • Flames Blue</footer>
    </div>
  )
}

export default App
