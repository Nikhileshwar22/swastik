import { useState, useRef, useCallback } from 'react'
import clsx from 'clsx'

const TABS = [
  { id: 'original', label: 'Original Space' },
  { id: 'generated', label: 'AI Generated' },
  { id: 'refined', label: 'Refined' },
]

function SliderComparison({ beforeSrc, afterSrc, beforeLabel = 'Before', afterLabel = 'After' }) {
  const [position, setPosition] = useState(50)
  const containerRef = useRef(null)
  const isDragging = useRef(false)

  const updatePosition = useCallback((clientX) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    setPosition((x / rect.width) * 100)
  }, [])

  const onMouseDown = (e) => {
    isDragging.current = true
    e.preventDefault()
  }

  const onMouseMove = useCallback((e) => {
    if (!isDragging.current) return
    updatePosition(e.clientX)
  }, [updatePosition])

  const onMouseUp = () => { isDragging.current = false }

  const onTouchMove = useCallback((e) => {
    updatePosition(e.touches[0].clientX)
  }, [updatePosition])

  return (
    <div
      ref={containerRef}
      className="relative select-none overflow-hidden aspect-video cursor-col-resize"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchMove={onTouchMove}
    >
      {/* After image (full width, underneath) */}
      <img src={afterSrc} alt={afterLabel} className="absolute inset-0 w-full h-full object-cover" />

      {/* Before image (clipped to left of slider) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <img src={beforeSrc} alt={beforeLabel} className="absolute inset-0 w-full h-full object-cover"
          style={{ width: `${100 / (position / 100)}%`, maxWidth: 'none' }} />
      </div>

      {/* Slider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
        style={{ left: `${position}%` }}
      >
        {/* Handle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 bg-white rounded-full shadow-xl flex items-center justify-center cursor-col-resize border border-stone-100"
          onMouseDown={onMouseDown}
          onTouchStart={() => { isDragging.current = true }}
          onTouchEnd={() => { isDragging.current = false }}
        >
          <svg className="w-4 h-4 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l-3 3 3 3M16 9l3 3-3 3" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-3 left-3 bg-stone-900/70 text-white text-xs px-2.5 py-1 tracking-wide pointer-events-none">
        {beforeLabel}
      </div>
      <div className="absolute bottom-3 right-3 bg-stone-900/70 text-white text-xs px-2.5 py-1 tracking-wide pointer-events-none">
        {afterLabel}
      </div>
    </div>
  )
}

export default function BeforeAfter({ roomImage, selectedConcept, refinedImage }) {
  const [activeTab, setActiveTab] = useState('generated')
  const [mode, setMode] = useState('sidebyside') // 'sidebyside' | 'slider'

  const hasRefined = !!refinedImage
  const availableTabs = TABS.filter(t => {
    if (t.id === 'original') return !!roomImage
    if (t.id === 'generated') return !!selectedConcept
    if (t.id === 'refined') return hasRefined
    return false
  })

  if (!selectedConcept && !roomImage) return null

  const getActiveImage = () => {
    switch (activeTab) {
      case 'original': return { src: roomImage, label: 'Original Space' }
      case 'generated': return { src: selectedConcept?.imageUrl, label: selectedConcept?.title || 'AI Generated' }
      case 'refined': return { src: refinedImage?.imageUrl, label: 'Refined Concept' }
      default: return null
    }
  }

  const activeImage = getActiveImage()

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="font-display text-xl font-medium text-stone-900">Before / After</h3>
          <p className="text-stone-500 text-xs mt-0.5">Compare your original space with the AI visualization</p>
        </div>
        {/* Mode toggle */}
        {roomImage && selectedConcept && (
          <div className="flex border border-stone-200 self-start sm:self-auto">
            <button
              onClick={() => setMode('sidebyside')}
              className={clsx(
                'px-3 py-1.5 text-xs tracking-wide font-medium transition-colors',
                mode === 'sidebyside' ? 'bg-stone-900 text-white' : 'text-stone-500 hover:text-stone-800'
              )}
            >
              Side by Side
            </button>
            <button
              onClick={() => setMode('slider')}
              className={clsx(
                'px-3 py-1.5 text-xs tracking-wide font-medium transition-colors border-l border-stone-200',
                mode === 'slider' ? 'bg-stone-900 text-white' : 'text-stone-500 hover:text-stone-800'
              )}
            >
              Slider
            </button>
          </div>
        )}
      </div>

      {/* Slider mode */}
      {mode === 'slider' && roomImage && selectedConcept && (
        <div className="border border-stone-200">
          <SliderComparison
            beforeSrc={roomImage}
            afterSrc={hasRefined && activeTab === 'refined' ? refinedImage.imageUrl : selectedConcept.imageUrl}
            beforeLabel="Original Space"
            afterLabel={hasRefined && activeTab === 'refined' ? 'Refined Design' : 'AI Design'}
          />
          <p className="text-center text-xs text-stone-400 py-2.5">Drag the slider to compare</p>
        </div>
      )}

      {/* Side by side / tab mode */}
      {mode === 'sidebyside' && (
        <>
          {/* Tab bar */}
          {availableTabs.length > 1 && (
            <div className="flex border-b border-stone-100">
              {availableTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    'px-5 py-2.5 text-xs font-semibold tracking-widest uppercase transition-all duration-200 border-b-2 -mb-px',
                    activeTab === tab.id
                      ? 'border-stone-900 text-stone-900'
                      : 'border-transparent text-stone-400 hover:text-stone-700'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* Two-up comparison */}
          <div className={clsx(
            'grid gap-4',
            roomImage && selectedConcept ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
          )}>
            {/* Original room */}
            {roomImage && (
              <div className="space-y-2">
                <p className="text-xs text-stone-400 tracking-widest uppercase font-medium">Original Space</p>
                <div className="aspect-video overflow-hidden bg-stone-100 border border-stone-200">
                  <img src={roomImage} alt="Original room" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            {/* AI concept / refined */}
            {selectedConcept && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-stone-400 tracking-widest uppercase font-medium">
                    {hasRefined ? 'Refined Concept' : 'AI Generated'}
                  </p>
                  {hasRefined && (
                    <span className="text-xs text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 font-medium">
                      Refined
                    </span>
                  )}
                </div>
                <div className="aspect-video overflow-hidden bg-stone-100 border border-stone-200 relative">
                  <img
                    src={hasRefined ? refinedImage.imageUrl : selectedConcept.imageUrl}
                    alt="AI generated concept"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-stone-900/60 text-white text-xs px-2 py-0.5">
                    {hasRefined ? 'Refined Design' : selectedConcept.title}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Arrow indicator for side-by-side */}
      {mode === 'sidebyside' && roomImage && selectedConcept && (
        <div className="hidden md:flex items-center justify-center gap-2 text-stone-300">
          <div className="h-px w-16 bg-stone-200" />
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
          <div className="h-px w-16 bg-stone-200" />
        </div>
      )}
    </div>
  )
}
