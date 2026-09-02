import { useState } from 'react'
import clsx from 'clsx'

const COLORS = [
  { label: 'Warm Neutrals', hex: '#e8d8c0', textDark: true },
  { label: 'Cool Neutrals', hex: '#d4d8dc', textDark: true },
  { label: 'Earth Tones', hex: '#c4956a', textDark: false },
  { label: 'White', hex: '#f9f9f7', textDark: true },
  { label: 'Beige', hex: '#d4c4a8', textDark: true },
  { label: 'Brown', hex: '#7a5230', textDark: false },
  { label: 'Grey', hex: '#9a9898', textDark: false },
  { label: 'Black', hex: '#1c1917', textDark: false },
  { label: 'Sage Green', hex: '#8aaa88', textDark: false },
  { label: 'Deep Blue', hex: '#2a4a6a', textDark: false },
]

export default function ColorSelector({ selected, onChange }) {
  const [customColor, setCustomColor] = useState('')
  const [showCustom, setShowCustom] = useState(false)

  const toggle = (label) => {
    if (selected.includes(label)) {
      onChange(selected.filter(c => c !== label))
    } else {
      onChange([...selected, label])
    }
  }

  const addCustom = () => {
    const trimmed = customColor.trim()
    if (trimmed && !selected.includes(trimmed)) {
      onChange([...selected, trimmed])
      setCustomColor('')
      setShowCustom(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="label m-0">Preferred Colors</label>
        {selected.length > 0 && (
          <button type="button" onClick={() => onChange([])}
            className="text-xs text-stone-400 hover:text-stone-700 transition-colors">
            Clear
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {COLORS.map(color => {
          const isSelected = selected.includes(color.label)
          return (
            <button
              key={color.label}
              type="button"
              onClick={() => toggle(color.label)}
              className={clsx(
                'relative flex flex-col items-center p-2.5 border-2 transition-all duration-200 group',
                isSelected ? 'border-stone-900' : 'border-stone-200 hover:border-stone-500'
              )}
            >
              {/* Color swatch */}
              <div
                className="w-full aspect-square mb-2 relative"
                style={{ backgroundColor: color.hex }}
              >
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className={clsx('w-4 h-4', color.textDark ? 'text-stone-700' : 'text-white')}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
              <p className={clsx('text-xs text-center leading-tight font-medium',
                isSelected ? 'text-stone-900' : 'text-stone-500')}>
                {color.label}
              </p>
            </button>
          )
        })}

        {/* Custom color */}
        <button
          type="button"
          onClick={() => setShowCustom(v => !v)}
          className={clsx(
            'flex flex-col items-center p-2.5 border-2 transition-all duration-200',
            showCustom ? 'border-stone-900 bg-stone-50' : 'border-dashed border-stone-200 hover:border-stone-400'
          )}
        >
          <div className="w-full aspect-square mb-2 bg-gradient-to-br from-rose-200 via-amber-100 to-blue-200 flex items-center justify-center">
            <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <p className="text-xs text-stone-400 text-center">Custom</p>
        </button>
      </div>

      {showCustom && (
        <div className="flex gap-2">
          <input
            type="text"
            value={customColor}
            onChange={e => setCustomColor(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCustom()}
            placeholder="e.g. Dusty Rose, Teal, Olive"
            className="input flex-1 text-sm"
            autoFocus
          />
          <button type="button" onClick={addCustom} className="btn-secondary px-4 py-2 text-xs">
            Add
          </button>
        </div>
      )}

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map(c => (
            <span key={c} className="inline-flex items-center gap-1 text-xs bg-stone-100 text-stone-600 px-2.5 py-1">
              {c}
              <button type="button" onClick={() => toggle(c)} className="text-stone-400 hover:text-stone-700">×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
