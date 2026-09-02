import { useState } from 'react'
import Home from './pages/Home.jsx'
import DesignStudio from './pages/DesignStudio.jsx'

export default function App() {
  const [page, setPage] = useState('home')

  return (
    <div className="min-h-screen bg-stone-50">
      {page === 'home' && <Home onStart={() => setPage('studio')} />}
      {page === 'studio' && <DesignStudio onHome={() => setPage('home')} />}
    </div>
  )
}
