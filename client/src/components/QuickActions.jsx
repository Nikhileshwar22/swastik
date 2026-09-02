import clsx from 'clsx'

const QUICK_ACTIONS = [
  { label: 'Change Sofa', prompt: 'Replace the sofa with a more stylish contemporary one. Keep all other elements exactly the same.', icon: '🛋' },
  { label: 'Change Wall Color', prompt: 'Change the wall color to a warmer, more elegant shade. Keep all furniture and fixtures unchanged.', icon: '🎨' },
  { label: 'Add TV Unit', prompt: 'Add a sleek modern TV unit on the main wall. Keep all other furniture and finishes unchanged.', icon: '📺' },
  { label: 'Change Flooring', prompt: 'Replace the flooring with premium engineered wood. Keep all furniture and walls unchanged.', icon: '🪵' },
  { label: 'Change Lighting', prompt: 'Upgrade the lighting to warm ambient cove lighting with pendant accents. Keep all other elements the same.', icon: '💡' },
  { label: 'More Luxury', prompt: 'Elevate the space with more premium and luxurious finishes — marble, brass, velvet. Keep the room layout the same.', icon: '✨' },
  { label: 'Make Minimal', prompt: 'Simplify the design — remove unnecessary items, clean lines, neutral palette. Keep the essential furniture.', icon: '◻' },
  { label: 'Add Storage', prompt: 'Add built-in storage solutions that blend with the existing design. Keep the overall look consistent.', icon: '📦' },
  { label: 'Add Plants', prompt: 'Add tasteful indoor plants and greenery to bring life to the space. Keep all other elements unchanged.', icon: '🌿' },
  { label: 'Change Curtains', prompt: 'Replace the curtains/blinds with elegant floor-to-ceiling drapes that complement the room color palette.', icon: '🪟' },
]

export default function QuickActions({ onSelect, disabled = false }) {
  return (
    <div className="space-y-3">
      <div>
        <p className="label">Quick Modifications</p>
        <p className="text-xs text-stone-400">Click any action to apply it instantly to your selected concept.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {QUICK_ACTIONS.map(action => (
          <button
            key={action.label}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(action.prompt)}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-2 text-xs font-medium border transition-all duration-150',
              disabled
                ? 'border-stone-100 text-stone-300 cursor-not-allowed bg-white'
                : 'border-stone-200 text-stone-600 bg-white hover:border-stone-800 hover:text-stone-900 hover:bg-stone-50 cursor-pointer'
            )}
          >
            <span className="text-sm leading-none">{action.icon}</span>
            {action.label}
          </button>
        ))}
      </div>
    </div>
  )
}
