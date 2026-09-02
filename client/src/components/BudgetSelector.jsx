import { useState } from 'react'
import clsx from 'clsx'

const BUDGET_OPTIONS = [
  { label: 'Under ₹2 lakh', value: 'Under ₹2 lakh', tier: 'budget', desc: 'Smart budget design' },
  { label: '₹2–4 lakh', value: '₹2–4 lakh', tier: 'budget', desc: 'Value-conscious choices' },
  { label: '₹4–7 lakh', value: '₹4–7 lakh', tier: 'mid', desc: 'Quality mid-range' },
  { label: '₹7–10 lakh', value: '₹7–10 lakh', tier: 'mid', desc: 'Premium mid-range' },
  { label: '₹10–20 lakh', value: '₹10–20 lakh', tier: 'premium', desc: 'Luxury finishes' },
  { label: '₹20 lakh+', value: '₹20 lakh+', tier: 'luxury', desc: 'High-end custom' },
]

const TIER_COLORS = {
  budget: 'border-stone-200 hover:border-stone-500',
  mid: 'border-stone-200 hover:border-stone-600',
  premium: 'border-stone-200 hover:border-stone-700',
  luxury: 'border-stone-200 hover:border-stone-900',
}

export default function BudgetSelector({ value, onChange }) {
  const [showCustom, setShowCustom] = useState(false)
  const [customValue, setCustomValue] = useState('')

  const handleSelect = (option) => {
    setShowCustom(false)
    onChange(option.value)
  }

  const handleCustom = () => {
    setShowCustom(true)
    onChange('')
  }

  const handleCustomInput = (e) => {
    setCustomValue(e.target.value)
    onChange(e.target.value)
  }

  return (
    <div className="space-y-3">
      <label className="label">Budget</label>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {BUDGET_OPTIONS.map(opt => {
          const isSelected = value === opt.value && !showCustom
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSelect(opt)}
              className={clsx(
                'relative text-left p-4 border-2 transition-all duration-200',
                isSelected
                  ? 'border-stone-900 bg-stone-900 text-white'
                  : `bg-white text-stone-700 ${TIER_COLORS[opt.tier]}`
              )}
            >
              <p className={clsx('text-sm font-semibold', isSelected ? 'text-white' : 'text-stone-900')}>
                {opt.label}
              </p>
              <p className={clsx('text-xs mt-0.5', isSelected ? 'text-stone-300' : 'text-stone-400')}>
                {opt.desc}
              </p>
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <svg className="w-4 h-4 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          )
        })}

        {/* Custom budget */}
        <button
          type="button"
          onClick={handleCustom}
          className={clsx(
            'text-left p-4 border-2 transition-all duration-200',
            showCustom
              ? 'border-stone-900 bg-stone-50'
              : 'border-dashed border-stone-200 hover:border-stone-400 bg-white text-stone-500'
          )}
        >
          <p className="text-sm font-semibold text-stone-700">Custom</p>
          <p className="text-xs text-stone-400 mt-0.5">Enter your budget</p>
        </button>
      </div>

      {/* Custom input */}
      {showCustom && (
        <div className="flex items-center gap-2">
          <span className="text-stone-500 text-sm">₹</span>
          <input
            type="text"
            value={customValue}
            onChange={handleCustomInput}
            placeholder="e.g. 5 lakh, 8,00,000"
            className="input flex-1"
            autoFocus
          />
        </div>
      )}

      {/* Budget guidance note */}
      {value && (
        <p className="text-xs text-stone-400 flex items-center gap-1.5">
          <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Budget guidance is an AI design direction, not a final construction estimate.
        </p>
      )}
    </div>
  )
}
