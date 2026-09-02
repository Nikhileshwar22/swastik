import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

import Header from '../components/Header.jsx'
import StepIndicator from '../components/StepIndicator.jsx'
import SpaceUploader from '../components/SpaceUploader.jsx'
import FloorPlanUploader from '../components/FloorPlanUploader.jsx'
import ReferenceUploader from '../components/ReferenceUploader.jsx'
import BudgetSelector from '../components/BudgetSelector.jsx'
import StyleSelector from '../components/StyleSelector.jsx'
import ColorSelector from '../components/ColorSelector.jsx'
import MaterialSelector from '../components/MaterialSelector.jsx'
import DesignBrief from '../components/DesignBrief.jsx'
import AIAnalysis from '../components/AIAnalysis.jsx'
import GenerationLoader from '../components/GenerationLoader.jsx'
import ConceptGrid from '../components/ConceptGrid.jsx'
import ImageViewer from '../components/ImageViewer.jsx'
import RefinementPanel from '../components/RefinementPanel.jsx'

const STEP_SPACE = 1
const STEP_INSPIRATION = 2
const STEP_REQUIREMENTS = 3
const STEP_ANALYSIS = 4
const STEP_VISUALIZATION = 5
const STEP_REFINE = 6

export default function DesignStudio({ onHome }) {
  // ── State ──────────────────────────────────────────────────────────────────
  const [currentStep, setCurrentStep] = useState(STEP_SPACE)
  const [completedSteps, setCompletedSteps] = useState([])
  const [demoMode, setDemoMode] = useState(false)

  // Step 1 — Space
  const [roomImages, setRoomImages] = useState([])
  const [floorPlan, setFloorPlan] = useState(null)

  // Step 2 — Inspiration
  const [referenceImages, setReferenceImages] = useState([])

  // Step 3 — Requirements
  const [budget, setBudget] = useState('')
  const [styles, setStyles] = useState([])
  const [colors, setColors] = useState([])
  const [materials, setMaterials] = useState([])
  const [designBrief, setDesignBrief] = useState('')

  // Step 4 — Analysis
  const [analysis, setAnalysis] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Step 5 — Visualization
  const [concepts, setConcepts] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [viewerConcept, setViewerConcept] = useState(null)

  // Step 6 — Refine
  const [selectedConcept, setSelectedConcept] = useState(null)

  // ── Check demo mode on mount ───────────────────────────────────────────────
  useEffect(() => {
    axios.get('/api/health').then(res => {
      setDemoMode(res.data.demoMode)
    }).catch(() => {})
  }, [])

  // ── Navigation helpers ─────────────────────────────────────────────────────
  const completeStep = (step) => {
    setCompletedSteps(prev => prev.includes(step) ? prev : [...prev, step])
  }

  const goToStep = (step) => {
    setCurrentStep(step)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleStepClick = (step) => {
    if (completedSteps.includes(step) || step === currentStep) {
      goToStep(step)
    }
  }

  // ── Step 1 → 2 ────────────────────────────────────────────────────────────
  const handleContinueFromSpace = () => {
    if (roomImages.length === 0) {
      toast.error('Please upload at least one photo of your room.')
      return
    }
    completeStep(STEP_SPACE)
    goToStep(STEP_INSPIRATION)
  }

  // ── Step 2 → 3 ────────────────────────────────────────────────────────────
  const handleContinueFromInspiration = () => {
    completeStep(STEP_INSPIRATION)
    goToStep(STEP_REQUIREMENTS)
  }

  // ── Step 3 → 4: Analyze ───────────────────────────────────────────────────
  const handleAnalyze = async () => {
    if (!budget && styles.length === 0 && !designBrief.trim()) {
      toast.error('Please fill in at least one requirement (budget, style, or design brief).')
      return
    }

    setIsAnalyzing(true)
    const toastId = toast.loading('Analyzing your requirements…')

    try {
      const formData = new FormData()
      formData.append('budget', budget)
      formData.append('styles', JSON.stringify(styles))
      formData.append('colors', JSON.stringify(colors))
      formData.append('materials', JSON.stringify(materials))
      formData.append('additionalRequirements', designBrief)

      roomImages.forEach(img => formData.append('roomImages', img))
      referenceImages.forEach(img => formData.append('referenceImages', img))
      if (floorPlan) formData.append('floorPlan', floorPlan)

      const { data } = await axios.post('/api/analyze', formData)
      if (!data.success) throw new Error(data.error)

      setAnalysis(data.analysis)
      completeStep(STEP_REQUIREMENTS)
      goToStep(STEP_ANALYSIS)
      toast.success('Analysis complete!', { id: toastId })
    } catch (err) {
      toast.error(err.response?.data?.error || 'Analysis failed. Please try again.', { id: toastId })
    } finally {
      setIsAnalyzing(false)
    }
  }

  // ── Step 4 → 5: Generate ──────────────────────────────────────────────────
  const handleGenerate = async () => {
    setIsGenerating(true)
    completeStep(STEP_ANALYSIS)
    goToStep(STEP_VISUALIZATION)

    const toastId = toast.loading('Generating your design concepts…')

    try {
      const formData = new FormData()
      formData.append('budget', budget)
      formData.append('styles', JSON.stringify(styles))
      formData.append('colors', JSON.stringify(colors))
      formData.append('materials', JSON.stringify(materials))
      formData.append('additionalRequirements', designBrief)
      if (analysis) formData.append('analysis', JSON.stringify(analysis))

      roomImages.forEach(img => formData.append('roomImages', img))
      referenceImages.forEach(img => formData.append('referenceImages', img))
      if (floorPlan) formData.append('floorPlan', floorPlan)

      const { data } = await axios.post('/api/generate', formData, {
        timeout: 180000,
      })

      if (!data.success) throw new Error(data.error)

      setConcepts(data.concepts)
      if (data.demoMode) setDemoMode(true)
      completeStep(STEP_VISUALIZATION)
      toast.success(`${data.concepts.length} concepts generated!`, { id: toastId })
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Generation failed. Please try again.'
      toast.error(msg, { id: toastId })
      // Stay on visualization step but show error state
    } finally {
      setIsGenerating(false)
    }
  }

  // ── Step 5 → 6: Select concept ────────────────────────────────────────────
  const handleSelectConcept = (concept) => {
    setSelectedConcept(concept)
    completeStep(STEP_VISUALIZATION)
    goToStep(STEP_REFINE)
    toast.success(`"${concept.title}" selected for refinement.`)
  }

  const handleBackFromRefine = () => {
    goToStep(STEP_VISUALIZATION)
  }

  // ── Get room image URL for BeforeAfter ────────────────────────────────────
  const roomImageUrl = roomImages[0]?.preview || null

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-stone-50">
      <Header onHome={onHome} demoMode={demoMode} />

      {/* Step indicator — sticky below header */}
      <div className="sticky top-16 z-40">
        <StepIndicator
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={handleStepClick}
        />
      </div>

      {/* Main content */}
      <main className="max-w-screen-xl mx-auto px-6 lg:px-12 py-12">

        {/* ── STEP 1: SPACE ─────────────────────────────────────────────── */}
        {currentStep === STEP_SPACE && (
          <div className="max-w-3xl mx-auto space-y-8 page-enter">
            <SpaceUploader images={roomImages} onChange={setRoomImages} />
            <div className="pt-2">
              <FloorPlanUploader file={floorPlan} onChange={setFloorPlan} />
            </div>
            <div className="flex justify-end pt-2">
              <button onClick={handleContinueFromSpace} className="btn-primary px-10 py-4">
                Continue to Inspiration
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: INSPIRATION ───────────────────────────────────────── */}
        {currentStep === STEP_INSPIRATION && (
          <div className="max-w-3xl mx-auto space-y-8 page-enter">
            {/* Your Space summary */}
            {roomImages.length > 0 && (
              <div className="border border-stone-100 bg-white p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs tracking-widest uppercase font-semibold text-stone-400">Your Space</span>
                  <div className="h-px flex-1 bg-stone-100" />
                  <button onClick={() => goToStep(STEP_SPACE)} className="text-xs text-stone-400 hover:text-stone-700 transition-colors">
                    Edit
                  </button>
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {roomImages.map((img, i) => (
                    <img key={i} src={img.preview} alt={img.name}
                      className="w-20 h-16 object-cover flex-shrink-0 border border-stone-100" />
                  ))}
                </div>
              </div>
            )}

            <ReferenceUploader images={referenceImages} onChange={setReferenceImages} />

            <div className="flex items-center justify-between pt-2">
              <button onClick={() => goToStep(STEP_SPACE)} className="btn-ghost">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <button onClick={handleContinueFromInspiration} className="btn-primary px-10 py-4">
                Continue to Requirements
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: REQUIREMENTS ──────────────────────────────────────── */}
        {currentStep === STEP_REQUIREMENTS && (
          <div className="max-w-3xl mx-auto space-y-10 page-enter">
            <div>
              <h2 className="font-display text-2xl font-medium text-stone-900 mb-1">
                Tell Us What You Want
              </h2>
              <p className="text-stone-500 text-sm leading-relaxed">
                Share your budget, style preferences, and any specific requirements.
              </p>
            </div>

            <div className="space-y-10">
              <BudgetSelector value={budget} onChange={setBudget} />
              <div className="divider" />
              <StyleSelector selected={styles} onChange={setStyles} />
              <div className="divider" />
              <ColorSelector selected={colors} onChange={setColors} />
              <div className="divider" />
              <MaterialSelector selected={materials} onChange={setMaterials} />
              <div className="divider" />
              <DesignBrief value={designBrief} onChange={setDesignBrief} />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button onClick={() => goToStep(STEP_INSPIRATION)} className="btn-ghost">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="btn-primary px-10 py-4"
              >
                {isAnalyzing ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Analyzing…
                  </>
                ) : (
                  <>
                    Analyze My Requirements
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: ANALYSIS ──────────────────────────────────────────── */}
        {currentStep === STEP_ANALYSIS && (
          <div className="max-w-3xl mx-auto space-y-6 page-enter">
            <AIAnalysis
              analysis={analysis}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              demoMode={demoMode}
            />
            <div className="flex justify-start">
              <button onClick={() => goToStep(STEP_REQUIREMENTS)} className="btn-ghost">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
                Edit Requirements
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 5: VISUALIZATION ─────────────────────────────────────── */}
        {currentStep === STEP_VISUALIZATION && (
          <div className="space-y-8 page-enter">
            {/* Loading */}
            <GenerationLoader isLoading={isGenerating} />

            {/* Results */}
            {!isGenerating && concepts.length > 0 && (
              <>
                <ConceptGrid
                  concepts={concepts}
                  onView={setViewerConcept}
                  onSelect={handleSelectConcept}
                  demoMode={demoMode}
                />
                <div className="flex justify-start">
                  <button onClick={() => goToStep(STEP_ANALYSIS)} className="btn-ghost">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Analysis
                  </button>
                </div>
              </>
            )}

            {/* Error/empty state after generation attempt */}
            {!isGenerating && concepts.length === 0 && (
              <div className="max-w-md mx-auto text-center py-20 space-y-5">
                <div className="w-14 h-14 border border-stone-200 flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-display text-xl font-medium text-stone-800">Generation didn't complete</h3>
                  <p className="text-stone-500 text-sm mt-2 leading-relaxed">
                    We couldn't generate the concepts. This might be due to an API issue or timeout.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button onClick={handleGenerate} className="btn-primary px-8">
                    Try Again
                  </button>
                  <button onClick={() => goToStep(STEP_ANALYSIS)} className="btn-secondary">
                    Back to Analysis
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 6: REFINE ────────────────────────────────────────────── */}
        {currentStep === STEP_REFINE && selectedConcept && (
          <RefinementPanel
            concept={selectedConcept}
            roomImage={roomImageUrl}
            onBack={handleBackFromRefine}
            demoMode={demoMode}
          />
        )}

      </main>

      {/* Fullscreen image viewer */}
      {viewerConcept && (
        <ImageViewer
          concept={viewerConcept}
          onClose={() => setViewerConcept(null)}
          onSelect={handleSelectConcept}
        />
      )}
    </div>
  )
}
