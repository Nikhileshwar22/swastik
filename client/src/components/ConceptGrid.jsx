import ConceptCard from './ConceptCard.jsx'

function downloadImage(concept) {
  const link = document.createElement('a')
  // Handle both URL and base64 data URLs
  link.href = concept.imageUrl
  const ext = concept.imageUrl.startsWith('data:') ? 'png' : 'jpg'
  const slug = concept.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  link.download = `swastik-${slug}.${ext}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export default function ConceptGrid({ concepts, onView, onSelect, demoMode }) {
  if (!concepts?.length) return null

  return (
    <div className="space-y-6 page-enter">
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="font-display text-3xl font-medium text-stone-900">
            Your Space — Reimagined
          </h2>
          <p className="text-stone-500 text-sm mt-1.5 leading-relaxed">
            {demoMode
              ? 'Sample architectural concepts. Add your OpenAI API key for AI-generated results.'
              : `${concepts.length} personalized concepts inspired by your references and requirements.`}
          </p>
        </div>
        {demoMode && (
          <div className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 border border-amber-200 bg-amber-50 text-amber-700 text-xs font-medium tracking-widest uppercase self-start sm:self-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Demo Mode
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-stone-100" />
        <span className="text-xs text-stone-300 tracking-widest uppercase">
          {concepts.length} Concepts Generated
        </span>
        <div className="h-px flex-1 bg-stone-100" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {concepts.map((concept, i) => (
          <ConceptCard
            key={concept.id}
            concept={concept}
            index={i}
            onView={onView}
            onSelect={onSelect}
            onDownload={downloadImage}
          />
        ))}
      </div>

      {/* Footer note */}
      <p className="text-xs text-stone-400 text-center leading-relaxed">
        Select a concept to refine it further or click View Fullscreen to see it in detail.
      </p>
    </div>
  )
}
