import { useState } from 'react'
import clsx from 'clsx'
import QuickActions from './QuickActions.jsx'
import DesignHistory from './DesignHistory.jsx'
import BeforeAfter from './BeforeAfter.jsx'
import axios from 'axios'
import toast from 'react-hot-toast'

function downloadImage(imageUrl, filename = 'swastik-refined-concept') {
  const link = document.createElement('a')
  link.href = imageUrl
  const ext = imageUrl.startsWith('data:') ? 'png' : 'jpg'
  link.download = `${filename}.${ext}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export default function RefinementPanel({ concept, roomImage, onBack, demoMode }) {
  const [modification, setModification] = useState('')
  const [isRefining, setIsRefining] = useState(false)
  const [history, setHistory] = useState([
    {
      id: 'original',
      type: 'concept',
      label: concept.title,
      imageUrl: concept.imageUrl,
      modification: null,
    },
  ])
  const [activeHistoryIndex, setActiveHistoryIndex] = useState(0)

  const currentItem = history[activeHistoryIndex]
  const latestRefinement = history.length > 1 ? history[history.length - 1] : null

  const handleQuickAction = (prompt) => {
    setModification(prompt)
  }

  const handleRefine = async () => {
    const trimmed = modification.trim()
    if (!trimmed) {
      toast.error('Please describe what you would like to change.')
      return
    }
    if (isRefining) return

    setIsRefining(true)
    const toastId = toast.loading('Generating revised design…')

    try {
      const formData = new FormData()
      formData.append('modification', trimmed)
      // Send the current displayed image URL for backend reference
      formData.append('currentImageUrl', currentItem.imageUrl)

      const { data } = await axios.post('/api/refine', formData, {
        timeout: 120000,
      })

      if (!data.success) throw new Error(data.error || 'Refinement failed')

      const revisionNum = history.filter(h => h.type === 'revision').length + 1
      const newItem = {
        id: `revision-${revisionNum}`,
        type: 'revision',
        label: `Revision ${revisionNum}`,
        imageUrl: data.imageUrl,
        description: data.description,
        modification: trimmed,
      }

      setHistory(prev => [...prev, newItem])
      setActiveHistoryIndex(history.length) // point to new item
      setModification('')
      toast.success('Revised design ready!', { id: toastId })
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Refinement failed. Please try again.'
      toast.error(msg, { id: toastId })
    } finally {
      setIsRefining(false)
    }
  }

  return (
    <div className="space-y-8 page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-700 mb-2 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to concepts
          </button>
          <h2 className="font-display text-2xl font-medium text-stone-900">Customize Your Design</h2>
          <p className="text-stone-500 text-sm mt-1">Refine this concept until it matches your vision exactly.</p>
        </div>

        {/* Download final */}
        <button
          onClick={() => downloadImage(
            latestRefinement?.imageUrl || concept.imageUrl,
            `swastik-${concept.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
          )}
          className="btn-secondary text-xs flex-shrink-0 self-start sm:self-auto"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Download Design
        </button>
      </div>

      {/* Main 2-col layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: selected / active image */}
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="label">Selected Concept</p>
            <div className="aspect-video overflow-hidden bg-stone-100 border border-stone-200 relative group">
              <img
                src={currentItem.imageUrl}
                alt={currentItem.label}
                className="w-full h-full object-cover img-zoom"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-stone-900/70 to-transparent p-4">
                <p className="text-white text-xs tracking-widest uppercase font-medium">{currentItem.label}</p>
                {currentItem.modification && (
                  <p className="text-stone-300 text-xs mt-0.5 line-clamp-1">{currentItem.modification}</p>
                )}
              </div>
            </div>
          </div>

          {/* Before/after comparison */}
          <BeforeAfter
            roomImage={roomImage}
            selectedConcept={{ imageUrl: concept.imageUrl, title: concept.title }}
            refinedImage={latestRefinement}
          />
        </div>

        {/* Right: refinement controls */}
        <div className="space-y-6">
          {/* Quick actions */}
          <QuickActions onSelect={handleQuickAction} disabled={isRefining} />

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-stone-100" />
            <span className="text-xs text-stone-300 tracking-widest uppercase">Or describe</span>
            <div className="h-px flex-1 bg-stone-100" />
          </div>

          {/* Custom modification textarea */}
          <div className="space-y-3">
            <label className="label">What would you like to change?</label>
            <textarea
              value={modification}
              onChange={e => setModification(e.target.value)}
              disabled={isRefining}
              rows={4}
              placeholder="Make the sofa larger and cream colored. Keep the flooring, walls and lighting unchanged."
              className="textarea w-full disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleRefine}
              disabled={isRefining || !modification.trim()}
              className="btn-primary w-full py-4 text-sm"
            >
              {isRefining ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating Revised Design…
                </>
              ) : (
                <>
                  Generate Revised Design
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </>
              )}
            </button>
            {demoMode && (
              <p className="text-xs text-stone-400 text-center">
                Demo mode: a different sample image will be shown as the revision.
              </p>
            )}
          </div>

          {/* Design history */}
          {history.length > 1 && (
            <DesignHistory
              history={history}
              activeIndex={activeHistoryIndex}
              onSelect={setActiveHistoryIndex}
            />
          )}
        </div>
      </div>

      {/* Revised concept full display */}
      {latestRefinement && (
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-xl font-medium text-stone-900">Latest Revision</h3>
              <p className="text-stone-500 text-xs mt-0.5">{latestRefinement.modification}</p>
            </div>
            <button
              onClick={() => downloadImage(
                latestRefinement.imageUrl,
                `swastik-revision-${history.filter(h => h.type === 'revision').length}`
              )}
              className="btn-secondary text-xs"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download Revision
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original concept */}
            <div className="space-y-2">
              <p className="label">Original Concept</p>
              <div className="aspect-video overflow-hidden bg-stone-100 border border-stone-200">
                <img src={concept.imageUrl} alt={concept.title} className="w-full h-full object-cover" />
              </div>
            </div>
            {/* Latest revision */}
            <div className="space-y-2">
              <p className="label">Revised Design</p>
              <div className="aspect-video overflow-hidden bg-stone-100 border border-stone-200 relative">
                <img src={latestRefinement.imageUrl} alt="Revised" className="w-full h-full object-cover" />
                <span className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-0.5 font-medium">
                  Revised
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
