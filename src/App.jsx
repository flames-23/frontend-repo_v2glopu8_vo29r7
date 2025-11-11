import { useEffect, useState } from 'react'
import Spline from '@splinetool/react-spline'

function App() {
  const [backendUrl] = useState(import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000')
  const [status, setStatus] = useState('Checking backend...')
  const [token, setToken] = useState('')
  const [email, setEmail] = useState('demo@sutt.ai')
  const [password, setPassword] = useState('demo1234')

  useEffect(() => {
    fetch(`${backendUrl}/test`).then(r => r.json()).then(() => setStatus('Backend connected')).catch(() => setStatus('Backend unreachable'))
  }, [backendUrl])

  const login = async (e) => {
    e.preventDefault()
    const body = new URLSearchParams()
    body.append('username', email)
    body.append('password', password)
    body.append('grant_type', 'password')
    const res = await fetch(`${backendUrl}/auth/token`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body })
    const data = await res.json()
    if (data.access_token) setToken(data.access_token)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black text-white">
      <div className="h-[60vh] relative">
        <Spline scene="https://prod.spline.design/hGDm7Foxug7C6E8s/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
        <div className="absolute bottom-8 left-8">
          <h1 className="text-3xl md:text-5xl font-bold">Smart Urban Travel Tool</h1>
          <p className="text-slate-300 mt-2">{status}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold mb-4">Quick Login</h2>
          <form onSubmit={login} className="space-y-3">
            <input className="w-full bg-white/10 rounded px-3 py-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
            <input className="w-full bg-white/10 rounded px-3 py-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
            <button className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded font-medium">Get Token</button>
          </form>
          {token && <p className="mt-3 text-sm break-all">Token: {token}</p>}
        </div>

        <div className="bg-white/5 rounded-xl p-6 border border-white/10 space-y-3">
          <h2 className="text-xl font-semibold">Sample APIs</h2>
          <div className="space-y-2">
            <Endpoint label="Generate Itinerary" method="POST" url={`${backendUrl}/api/itinerary/generate`} token={token} body={{ user_id: 'u_123', dates: ['2025-12-01','2025-12-03'], preferences: { interests: ['spiritual','trekking'], budget: 'moderate' } }} />
            <Endpoint label="Forecast Next 7" method="GET" url={`${backendUrl}/api/forecast/next7?place_id=dummy`} token={token} />
            <Endpoint label="Vision Alert" method="POST" url={`${backendUrl}/api/vision/alerts`} token={token} body={{ camera_id: 'cam_9', timestamp: new Date().toISOString(), alert_type: 'crowd_density', confidence: 0.87, coords: { lat: 30.3165, lng: 78.0322 } }} />
          </div>
        </div>
      </div>
    </div>
  )
}

function Endpoint({ label, method, url, token, body }) {
  const [resp, setResp] = useState('')
  const call = async () => {
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) })
    const data = await res.json().catch(()=>({ error: 'Invalid JSON' }))
    setResp(JSON.stringify(data, null, 2))
  }
  return (
    <div className="border border-white/10 rounded p-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">{label}</p>
          <p className="text-xs text-slate-300 break-all">{method} {url}</p>
        </div>
        <button onClick={call} className="bg-emerald-600 hover:bg-emerald-500 px-3 py-1 rounded text-sm">Send</button>
      </div>
      {resp && <pre className="mt-2 text-xs bg-black/40 p-2 rounded max-h-40 overflow-auto">{resp}</pre>}
    </div>
  )
}

export default App
