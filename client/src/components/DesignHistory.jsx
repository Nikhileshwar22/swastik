import { useState } from 'react'
import clsx from 'clsx'

function HistoryItem({ item, index, isActive, onClick, isLast }) {
  const [imgLoaded, setImgLoaded] = useState(false)

  return (
    <div className="flex gap-3">
      {/* Timeline */}
      <div className="flex flex-col items-center">
        <div
          className={clsx(
            'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold border-2 transition-all duration-200',
            isActive
              ? 'bg-stone-900 border-stone-900 text-white'
              : 'bg-white border-stone-300 text-stone-500'
          )}
        >
          {index + 1}
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-stone-100 my-1" />}
      </div>

      {/* Card */}
      <div
        className={clsx(
          'flex-1 mb-3 overflow-hidden border cursor-pointer transition-all duration-200 group',
          isActive
            ? 'border-stone-900 ring-1 ring-stone-900'
            : 'border-stone-200 hover:border-stone-400'
        )}
        onClick={onClick}
      >
        <div className="flex gap-3 p-3">
          {/* Thumbnail */}
          <div className="w-16 h-12 flex-shrink-0 bg-stone-100 overflow-hidden">
            {!imgLoaded && <div className="w-full h-full skeleton" />}
            <img
              src={item.imageUrl}
              alt={item.label}
              className={clsx('w-full h-full object-cover transition-opacity', imgLoaded ? 'opacity-100' : 'opacity-0')}
              onLoad={() => setImgLoaded(true)}
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className={clsx(
                'text-xs px-1.5 py-0.5 font-medium tracking-wide',
                item.type === 'original'
                  ? 'bg-stone-100 text-stone-600'
                  : item.type === 'concept'
                  ? 'bg-blue-50 text-blue-700'
                  : 'bg-green-50 text-green-700'
              )}>
                {item.type === 'original' ? 'Original' : item.type === 'concept' ? 'Concept' : 'Revision'}
              </span>
              {isActive && (
                <span className="text-xs text-stone-400 tracking-wide">Active</span>
              )}
            </div>
            <p className="text-sm font-medium text-stone-800 truncate">{item.label}</p>
            {item.modification && (
              <p className="text-xs text-stone-400 truncate mt-0.5 leading-tight">
                {item.modification}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DesignHistory({ history, activeIndex, onSelect }) {
  if (!history?.length) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="label m-0">Design Evolution</p>
        <span className="text-xs text-stone-400">{history.length} version{history.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="bg-stone-50 border border-stone-100 p-4">
        <div>
          {history.map((item, i) => (
            <HistoryItem
              key={item.id || i}
              item={item}
              index={i}
              isActive={i === activeIndex}
              isLast={i === history.length - 1}
              onClick={() => onSelect?.(i)}
            />
          ))}
        </div>

        {history.length >= 2 && (
          <p className="text-xs text-stone-400 text-center mt-2 leading-relaxed">
            Click any version to compare it with your current design.
          </p>
        )}
      </div>
    </div>
  )
}
