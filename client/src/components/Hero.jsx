import { useEffect, useRef } from 'react'

const FEATURE_ITEMS = [
  'Upload your existing space',
  'Add inspiration references',
  'Describe your requirements',
  'Receive AI-generated concepts',
  'Refine with a single click',
]

export default function Hero({ onStart }) {
  const canvasRef = useRef(null)

  // Subtle animated background dots
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const dots = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.3,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.4 + 0.1,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      dots.forEach(d => {
        d.x += d.vx
        d.y += d.vy
        if (d.x < 0 || d.x > canvas.width) d.vx *= -1
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(168, 162, 158, ${d.alpha})`
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-stone-50">
      {/* Animated background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#1c1917 1px, transparent 1px), linear-gradient(90deg, #1c1917 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto px-6 page-enter">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="h-px w-12 bg-stone-300" />
          <span className="text-xs tracking-[0.25em] uppercase text-stone-400 font-medium">
            AI-Powered Design Studio
          </span>
          <div className="h-px w-12 bg-stone-300" />
        </div>

        {/* Heading */}
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-medium text-stone-900 leading-[1.1] tracking-tight mb-6">
          Transform Your
          <br />
          <span className="italic font-normal text-stone-600">Space</span>
          {' '}With AI
        </h1>

        {/* Subtitle */}
        <p className="text-stone-500 text-lg leading-relaxed mb-12 max-w-xl mx-auto">
          Upload your space, share your inspiration, and visualize
          your dream interior in seconds.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button onClick={onStart} className="btn-primary text-base px-10 py-5">
            Start Designing
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
          <button
            onClick={onStart}
            className="btn-secondary"
          >
            View Demo
          </button>
        </div>

        {/* Feature list */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {FEATURE_ITEMS.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-stone-400">
              <div className="w-1 h-1 rounded-full bg-stone-300" />
              <span className="text-xs tracking-wide">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs tracking-widest uppercase text-stone-300">Scroll</span>
        <svg className="w-4 h-4 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-24 left-8 w-16 h-16 border-l border-t border-stone-200" />
      <div className="absolute top-24 right-8 w-16 h-16 border-r border-t border-stone-200" />
      <div className="absolute bottom-20 left-8 w-16 h-16 border-l border-b border-stone-200" />
      <div className="absolute bottom-20 right-8 w-16 h-16 border-r border-b border-stone-200" />
    </section>
  )
}
