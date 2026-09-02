import { useState } from 'react'
import clsx from 'clsx'

const SECTION_ICONS = {
  style: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
    </svg>
  ),
  colors: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
    </svg>
  ),
  materials: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
    </svg>
  ),
  furniture: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  ),
  lighting: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    </svg>
  ),
  spatial: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
    </svg>
  ),
}

function TagList({ items, color = 'stone' }) {
  if (!items?.length) return null
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {items.map((item, i) => (
        <span key={i} className={clsx(
          'text-xs px-2.5 py-1 font-medium tracking-wide',
          color === 'warm'
            ? 'bg-amber-50 text-amber-800 border border-amber-100'
            : 'bg-stone-100 text-stone-700'
        )}>
          {item}
        </span>
      ))}
    </div>
  )
}

function BudgetBar({ label, value }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-stone-500 w-28 flex-shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-stone-700 rounded-full transition-all duration-1000"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs text-stone-400 w-8 text-right">{value}%</span>
    </div>
  )
}

export default function AIAnalysis({ analysis, onGenerate, isGenerating, demoMode }) {
  const [expanded, setExpanded] = useState(true)

  if (!analysis) return null

  const { style, allStyles, colors, materials, furniture, lighting, spatialCharacteristics, designDirection, budgetAnalysis } = analysis

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs tracking-widest uppercase font-semibold text-green-700">Analysis Complete</span>
          </div>
          <h2 className="font-display text-2xl font-medium text-stone-900">AI Design Analysis</h2>
          <p className="text-stone-500 text-sm mt-1">
            Based on your space, references, and requirements.
          </p>
        </div>
        <button
          onClick={() => setExpanded(v => !v)}
          className="btn-ghost text-xs flex items-center gap-1"
        >
          {expanded ? 'Collapse' : 'Expand'}
          <svg className={clsx('w-3.5 h-3.5 transition-transform', expanded ? 'rotate-180' : '')}
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {expanded && (
        <>
          {/* Analysis card */}
          <div className="border border-stone-200 bg-white">
            {/* Primary style banner */}
            <div className="bg-stone-900 text-white px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border border-stone-600 flex items-center justify-center">
                  <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-stone-400 tracking-widest uppercase font-medium">Design Direction</p>
                  <p className="text-lg font-display font-medium text-white mt-0.5">{style}</p>
                </div>
              </div>
            </div>

            {/* Grid of analysis sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-stone-100">
              {/* Colors */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2 text-stone-500">
                  {SECTION_ICONS.colors}
                  <span className="text-xs font-semibold tracking-widest uppercase">Color Palette</span>
                </div>
                <TagList items={colors} color="warm" />
              </div>

              {/* Materials */}
              <div className="p-5 border-t md:border-t-0 border-stone-100">
                <div className="flex items-center gap-2 mb-2 text-stone-500">
                  {SECTION_ICONS.materials}
                  <span className="text-xs font-semibold tracking-widest uppercase">Materials</span>
                </div>
                <TagList items={materials} />
              </div>

              {/* Lighting */}
              <div className="p-5 border-t lg:border-t-0 border-stone-100">
                <div className="flex items-center gap-2 mb-2 text-stone-500">
                  {SECTION_ICONS.lighting}
                  <span className="text-xs font-semibold tracking-widest uppercase">Lighting</span>
                </div>
                <TagList items={lighting} />
              </div>

              {/* Furniture */}
              <div className="p-5 border-t border-stone-100">
                <div className="flex items-center gap-2 mb-2 text-stone-500">
                  {SECTION_ICONS.furniture}
                  <span className="text-xs font-semibold tracking-widest uppercase">Furniture</span>
                </div>
                <TagList items={furniture} />
              </div>

              {/* Spatial */}
              <div className="p-5 border-t border-stone-100">
                <div className="flex items-center gap-2 mb-2 text-stone-500">
                  {SECTION_ICONS.spatial}
                  <span className="text-xs font-semibold tracking-widest uppercase">Spatial</span>
                </div>
                <TagList items={spatialCharacteristics} />
              </div>

              {/* Design direction text */}
              <div className="p-5 border-t border-stone-100">
                <div className="flex items-center gap-2 mb-2 text-stone-500">
                  {SECTION_ICONS.style}
                  <span className="text-xs font-semibold tracking-widest uppercase">Summary</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">{designDirection?.slice(0, 180)}{designDirection?.length > 180 ? '…' : ''}</p>
              </div>
            </div>
          </div>

          {/* Budget breakdown */}
          {budgetAnalysis && budgetAnalysis.label && (
            <div className="border border-stone-100 bg-stone-50 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-stone-600">Budget Direction</p>
                  <p className="text-sm text-stone-800 font-medium mt-0.5">{budgetAnalysis.label}</p>
                </div>
                <span className="text-xs text-stone-400 bg-white border border-stone-200 px-3 py-1.5">
                  AI Guidance — Not a Cost Estimate
                </span>
              </div>
              <div className="space-y-2.5">
                <BudgetBar label="Furniture" value={budgetAnalysis.furniture} />
                <BudgetBar label="Lighting" value={budgetAnalysis.lighting} />
                <BudgetBar label="Wall Treatment" value={budgetAnalysis.wallTreatment} />
                <BudgetBar label="Flooring" value={budgetAnalysis.flooring} />
                <BudgetBar label="Decor & Accessories" value={budgetAnalysis.decor} />
              </div>
            </div>
          )}
        </>
      )}

      {/* Generate button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="btn-primary text-sm px-10 py-4 w-full sm:w-auto"
        >
          {isGenerating ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating…
            </>
          ) : (
            <>
              Generate Design Concepts
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </>
          )}
        </button>
        <p className="text-xs text-stone-400 leading-relaxed">
          {demoMode
            ? 'Demo mode: sample architectural concepts will be shown.'
            : 'AI will generate 3–4 personalized concepts based on this analysis.'}
        </p>
      </div>
    </div>
  )
}
