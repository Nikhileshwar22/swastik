import { useEffect, useCallback } from 'react'

function downloadImage(concept) {
  const link = document.createElement('a')
  link.href = concept.imageUrl
  const ext = concept.imageUrl.startsWith('data:') ? 'png' : 'jpg'
  const slug = concept.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'concept'
  link.download = `swastik-${slug}.${ext}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export default function ImageViewer({ concept, onClose, onSelect }) {
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  if (!concept) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/95 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Content container — stop propagation so clicking image doesn't close */}
      <div
        className="relative max-w-6xl w-full mx-4 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <p className="text-stone-400 text-xs tracking-widest uppercase font-medium">
              {concept.conceptNum || ''}
            </p>
            <h3 className="text-white font-display text-lg font-medium mt-0.5">
              {concept.title}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => downloadImage(concept)}
              className="flex items-center gap-2 text-stone-400 hover:text-white text-xs tracking-widest uppercase font-medium transition-colors px-4 py-2 border border-stone-700 hover:border-stone-400"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download
            </button>
            {onSelect && (
              <button
                onClick={() => { onSelect(concept); onClose() }}
                className="flex items-center gap-2 bg-white text-stone-900 text-xs tracking-widest uppercase font-medium px-4 py-2 hover:bg-stone-100 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                Use This Concept
              </button>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center text-stone-500 hover:text-white border border-stone-700 hover:border-stone-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="relative bg-stone-900">
          <img
            src={concept.imageUrl}
            alt={concept.title}
            className="w-full max-h-[75vh] object-contain"
          />
        </div>

        {/* Bottom caption */}
        {concept.description && (
          <div className="mt-4 px-1">
            <p className="text-stone-400 text-sm leading-relaxed max-w-2xl">
              {concept.description}
            </p>
          </div>
        )}

        {/* Escape hint */}
        <p className="text-stone-600 text-xs text-center mt-4">
          Press <kbd className="bg-stone-800 text-stone-400 px-1.5 py-0.5 text-xs">Esc</kbd> or click outside to close
        </p>
      </div>
    </div>
  )
}
