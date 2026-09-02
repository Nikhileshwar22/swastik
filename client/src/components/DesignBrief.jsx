import clsx from 'clsx'

const QUICK_PROMPTS = [
  {
    label: 'Modern Luxury',
    text: 'Create a modern luxury living room inspired by these references. Use warm beige and walnut tones, marble accents, indirect cove lighting, and premium contemporary furniture.',
  },
  {
    label: 'Minimalist',
    text: 'Design a minimalist interior with clean lines, a neutral white and grey palette, natural materials, and abundant natural light. Avoid clutter and unnecessary decoration.',
  },
  {
    label: 'Contemporary Warm',
    text: 'Transform this space into a warm contemporary interior with earthy terracotta accents, natural wood textures, layered ambient lighting, and comfortable furniture.',
  },
  {
    label: 'Traditional',
    text: 'Redesign this space in a traditional Indian style with rich teak wood, brass accents, warm ivory walls, classic furniture, and decorative lighting.',
  },
  {
    label: 'Scandinavian',
    text: 'Apply a Scandinavian design approach: light wood, white walls, cozy textiles, functional furniture, and warm natural lighting. Keep the space airy and clean.',
  },
  {
    label: 'Warm & Cozy',
    text: 'Make this space feel warm, intimate and cozy. Use rich browns, deep cream tones, layered textiles, warm lighting, and plush comfortable furniture.',
  },
]

const EXAMPLE_PROMPT = `Example: I like this reference. I want a similar living room for my 3BHK apartment, but with warmer colors and a ₹4 lakh budget. Keep the existing windows and make the space feel more spacious. I prefer wood and marble finishes.`

export default function DesignBrief({ value, onChange }) {
  const applyQuick = (prompt) => {
    if (value && value.trim()) {
      // Append to existing
      onChange(value.trimEnd() + ' ' + prompt)
    } else {
      onChange(prompt)
    }
  }

  const charCount = value?.length || 0
  const maxChars = 1000

  return (
    <div className="space-y-4">
      <div>
        <label className="label">Tell Us More</label>
        <p className="text-xs text-stone-400 leading-relaxed mb-3">
          Describe your vision in your own words. The more specific you are, the better the AI can match your requirements.
        </p>
      </div>

      {/* Quick prompts */}
      <div>
        <p className="text-xs text-stone-400 mb-2 tracking-wide">Quick inspiration:</p>
        <div className="flex flex-wrap gap-2">
          {QUICK_PROMPTS.map(qp => (
            <button
              key={qp.label}
              type="button"
              onClick={() => applyQuick(qp.text)}
              className="chip text-xs hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all duration-150"
            >
              {qp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={EXAMPLE_PROMPT}
          rows={5}
          maxLength={maxChars}
          className="textarea w-full text-sm leading-relaxed"
        />
        <div className={clsx(
          'absolute bottom-3 right-3 text-xs',
          charCount > maxChars * 0.9 ? 'text-amber-500' : 'text-stone-300'
        )}>
          {charCount}/{maxChars}
        </div>
      </div>

      {/* Writing hints */}
      <div className="bg-stone-50 border border-stone-100 p-4 space-y-2">
        <p className="text-xs font-semibold text-stone-600 tracking-wide uppercase">Tips for better results</p>
        <ul className="space-y-1.5">
          {[
            'Mention which reference image you like most',
            'Specify furniture you want to keep or replace',
            'Describe the mood — cozy, airy, formal, relaxed',
            'Note any constraints — existing flooring, fixed walls',
            'Mention how the room is used — family, work, entertaining',
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-stone-400">
              <span className="w-1 h-1 rounded-full bg-stone-300 mt-1.5 flex-shrink-0" />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
