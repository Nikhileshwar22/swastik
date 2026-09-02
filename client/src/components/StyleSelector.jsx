import clsx from 'clsx'

const STYLES = [
  { label: 'Modern', icon: '◻', desc: 'Clean lines, open spaces' },
  { label: 'Contemporary', icon: '◈', desc: 'Current trends, balanced' },
  { label: 'Modern Luxury', icon: '◆', desc: 'Premium, opulent finish' },
  { label: 'Minimalist', icon: '○', desc: 'Less is more' },
  { label: 'Scandinavian', icon: '❄', desc: 'Functional, cozy, light' },
  { label: 'Traditional', icon: '⬡', desc: 'Classic, ornate, timeless' },
  { label: 'Indian Contemporary', icon: '◉', desc: 'Modern with cultural soul' },
  { label: 'Industrial', icon: '▣', desc: 'Raw, urban, edgy' },
  { label: 'Classic', icon: '◈', desc: 'Formal, symmetrical elegance' },
  { label: 'Japandi', icon: '◯', desc: 'Japanese-Scandi harmony' },
]

export default function StyleSelector({ selected, onChange }) {
  const toggle = (label) => {
    if (selected.includes(label)) {
      onChange(selected.filter(s => s !== label))
    } else {
      onChange([...selected, label])
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="label m-0">Preferred Style</label>
        {selected.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-xs text-stone-400 hover:text-stone-700 transition-colors"
          >
            Clear
          </button>
        )}
      </div>
      <p className="text-xs text-stone-400">Select one or more styles that appeal to you.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {STYLES.map(style => {
          const isSelected = selected.includes(style.label)
          return (
            <button
              key={style.label}
              type="button"
              onClick={() => toggle(style.label)}
              className={clsx(
                'relative text-left p-3 border transition-all duration-200 group',
                isSelected
                  ? 'border-stone-900 bg-stone-900 text-white'
                  : 'border-stone-200 bg-white hover:border-stone-600 hover:bg-stone-50'
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <span className={clsx('text-base leading-none', isSelected ? 'text-stone-300' : 'text-stone-300')}>{style.icon}</span>
                {isSelected && (
                  <svg className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <p className={clsx('text-xs font-semibold mb-0.5', isSelected ? 'text-white' : 'text-stone-800')}>
                {style.label}
              </p>
              <p className={clsx('text-xs leading-tight', isSelected ? 'text-stone-400' : 'text-stone-400')}>
                {style.desc}
              </p>
            </button>
          )
        })}
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {selected.map(s => (
            <span key={s} className="inline-flex items-center gap-1 text-xs bg-stone-100 text-stone-600 px-2.5 py-1">
              {s}
              <button
                type="button"
                onClick={() => toggle(s)}
                className="text-stone-400 hover:text-stone-700 ml-0.5"
              >×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
