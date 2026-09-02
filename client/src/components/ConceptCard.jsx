import { useState } from 'react'
import clsx from 'clsx'

export default function ConceptCard({ concept, index, onView, onSelect, onDownload }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)

  const num = String(index + 1).padStart(2, '0')

  const handleDownload = (e) => {
    e.stopPropagation()
    onDownload?.(concept)
  }

  const handleView = (e) => {
    e.stopPropagation()
    onView?.(concept)
  }

  const handleSelect = (e) => {
    e.stopPropagation()
    onSelect?.(concept)
  }

  return (
    <div className="group bg-white border border-stone-200 overflow-hidden transition-all duration-300 hover:border-stone-400 hover:shadow-lg hover:shadow-stone-900/5">
      {/* Image area */}
      <div
        className="relative aspect-video overflow-hidden bg-stone-100 cursor-pointer"
        onClick={handleView}
      >
        {/* Skeleton while loading */}
        {!imgLoaded && !imgError && (
          <div className="absolute inset-0 skeleton" />
        )}

        {/* Error state */}
        {imgError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-100">
            <svg className="w-8 h-8 text-stone-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <p className="text-xs text-stone-400">Image unavailable</p>
          </div>
        )}

        <img
          src={concept.imageUrl}
          alt={concept.title}
          className={clsx(
            'w-full h-full object-cover img-zoom transition-opacity duration-500',
            imgLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setImgLoaded(true)}
          onError={() => { setImgLoaded(true); setImgError(true) }}
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/30 transition-all duration-300 flex items-center justify-center">
          <button
            onClick={handleView}
            className="opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0 flex items-center gap-2 bg-white/95 text-stone-900 text-xs font-semibold tracking-widest uppercase px-5 py-2.5 hover:bg-white"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
            View Fullscreen
          </button>
        </div>

        {/* Concept number badge */}
        <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-sm px-2.5 py-1">
          <span className="text-white text-xs font-semibold tracking-widest">CONCEPT {num}</span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-display text-base font-medium text-stone-900">{concept.title}</h3>
          <p className="text-xs text-stone-500 leading-relaxed mt-1 line-clamp-2">
            {concept.description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleSelect}
            className="flex-1 btn-primary text-xs py-2.5 px-3"
          >
            Use This Concept
          </button>
          <button
            onClick={handleView}
            className="btn-secondary text-xs py-2.5 px-3"
            title="View fullscreen"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
          </button>
          <button
            onClick={handleDownload}
            className="btn-secondary text-xs py-2.5 px-3"
            title="Download"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
