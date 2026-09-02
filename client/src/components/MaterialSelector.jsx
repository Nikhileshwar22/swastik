import clsx from 'clsx'

const MATERIALS = [
  { label: 'Wood', icon: '🪵', desc: 'Warm natural grain' },
  { label: 'Marble', icon: '🔲', desc: 'Luxurious stone veining' },
  { label: 'Granite', icon: '⬛', desc: 'Durable speckled stone' },
  { label: 'Glass', icon: '🔷', desc: 'Sleek transparency' },
  { label: 'Metal', icon: '⚙', desc: 'Refined steel or brass' },
  { label: 'Concrete', icon: '🧱', desc: 'Raw urban texture' },
  { label: 'Stone', icon: '🪨', desc: 'Natural rugged finish' },
  { label: 'Veneer', icon: '🟫', desc: 'Premium wood finish' },
  { label: 'Laminate', icon: '📋', desc: 'Cost-effective surface' },
  { label: 'Fabric', icon: '🧵', desc: 'Soft textile upholstery' },
  { label: 'Natural', icon: '🌿', desc: 'Organic materials' },
]

export default function MaterialSelector({ selected, onChange }) {
  const toggle = (label) => {
    if (selected.includes(label)) {
      onChange(selected.filter(m => m !== label))
    } else {
      onChange([...selected, label])
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="label m-0">Preferred Materials</label>
        {selected.length > 0 && (
          <button type="button" onClick={() => onChange([])}
            className="text-xs text-stone-400 hover:text-stone-700 transition-colors">
            Clear
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {MATERIALS.map(mat => {
          const isSelected = selected.includes(mat.label)
          return (
            <button
              key={mat.label}
              type="button"
              onClick={() => toggle(mat.label)}
              className={clsx(
                'relative text-left p-3 border transition-all duration-200',
                isSelected
                  ? 'border-stone-900 bg-stone-900'
                  : 'border-stone-200 bg-white hover:border-stone-500 hover:bg-stone-50'
              )}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-lg leading-none">{mat.icon}</span>
                {isSelected && (
                  <svg className="w-3.5 h-3.5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <p className={clsx('text-xs font-semibold', isSelected ? 'text-white' : 'text-stone-800')}>
                {mat.label}
              </p>
              <p className={clsx('text-xs mt-0.5 leading-tight', isSelected ? 'text-stone-400' : 'text-stone-400')}>
                {mat.desc}
              </p>
            </button>
          )
        })}
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map(m => (
            <span key={m} className="inline-flex items-center gap-1 text-xs bg-stone-100 text-stone-600 px-2.5 py-1">
              {m}
              <button type="button" onClick={() => toggle(m)} className="text-stone-400 hover:text-stone-700">×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
