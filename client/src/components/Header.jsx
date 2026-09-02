import { useState, useEffect } from 'react'

export default function Header({ onHome, demoMode = false }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm border-b border-stone-200' : 'bg-transparent'
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={onHome}
            className="flex items-center gap-3 group"
          >
            <div className="w-7 h-7 bg-stone-900 flex items-center justify-center">
              <span className="text-stone-50 text-sm font-serif font-medium">S</span>
            </div>
            <span className="text-stone-900 text-sm font-semibold tracking-[0.15em] uppercase">
              Swastik
            </span>
          </button>

          {/* Center nav */}
          <nav className="hidden md:flex items-center gap-8">
            <span className="text-xs tracking-widest uppercase text-stone-400 font-medium">
              AI Interior &amp; Architectural Visualizer
            </span>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {demoMode && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 text-xs tracking-widest uppercase font-medium text-stone-500 border border-stone-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Demo Mode
              </span>
            )}
            <button
              onClick={onHome}
              className="text-xs tracking-widest uppercase text-stone-500 hover:text-stone-900 transition-colors font-medium"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
