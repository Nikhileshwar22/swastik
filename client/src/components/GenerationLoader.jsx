import { useState, useEffect } from 'react'
import clsx from 'clsx'

const MESSAGES = [
  { text: 'Analyzing your space…', sub: 'Reading room geometry and existing features' },
  { text: 'Understanding your inspiration…', sub: 'Extracting style, mood and design language' },
  { text: 'Identifying materials and colors…', sub: 'Mapping palettes and surface finishes' },
  { text: 'Creating your personalized design…', sub: 'Applying your requirements and budget' },
  { text: 'Rendering your visualization…', sub: 'Finalizing 4 unique design concepts' },
]

function SkeletonCard({ delay = 0 }) {
  return (
    <div
      className="bg-white border border-stone-100 overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="aspect-video skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-24 skeleton rounded" />
        <div className="h-2 w-full skeleton rounded" />
        <div className="h-2 w-3/4 skeleton rounded" />
        <div className="flex gap-2 pt-1">
          <div className="h-8 flex-1 skeleton rounded" />
          <div className="h-8 flex-1 skeleton rounded" />
        </div>
      </div>
    </div>
  )
}

export default function GenerationLoader({ isLoading }) {
  const [msgIndex, setMsgIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [fadeIn, setFadeIn] = useState(true)

  useEffect(() => {
    if (!isLoading) {
      setMsgIndex(0)
      setProgress(0)
      return
    }

    // Progress animation — ramps up to ~90% then waits
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 88) return prev
        const increment = prev < 40 ? 2 : prev < 70 ? 1.5 : 0.5
        return Math.min(prev + increment, 88)
      })
    }, 300)

    // Message cycling
    const messageInterval = setInterval(() => {
      setFadeIn(false)
      setTimeout(() => {
        setMsgIndex(prev => (prev + 1) % MESSAGES.length)
        setFadeIn(true)
      }, 250)
    }, 3500)

    return () => {
      clearInterval(progressInterval)
      clearInterval(messageInterval)
    }
  }, [isLoading])

  if (!isLoading) return null

  const current = MESSAGES[msgIndex]

  return (
    <div className="space-y-8 page-enter">
      {/* Status header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          {/* Animated logo mark */}
          <div className="w-10 h-10 bg-stone-900 flex items-center justify-center relative">
            <span className="text-stone-50 text-base font-serif">S</span>
            <div className="absolute inset-0 border-2 border-stone-400 animate-ping opacity-20" />
          </div>
        </div>

        <h2 className="font-display text-2xl font-medium text-stone-900">
          Swastik is creating your concepts
        </h2>

        {/* Cycling message */}
        <div className="h-12 flex flex-col items-center justify-center">
          <p
            className={clsx(
              'text-stone-800 font-medium text-base transition-all duration-300',
              fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
            )}
          >
            {current.text}
          </p>
          <p
            className={clsx(
              'text-stone-400 text-sm mt-1 transition-all duration-300',
              fadeIn ? 'opacity-100' : 'opacity-0'
            )}
          >
            {current.sub}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="max-w-md mx-auto space-y-2">
        <div className="h-0.5 bg-stone-100 w-full overflow-hidden">
          <div
            className="h-full bg-stone-900 transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-stone-400">
          <span>Processing</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Step dots */}
      <div className="flex items-center justify-center gap-2">
        {MESSAGES.map((msg, i) => (
          <div
            key={i}
            className={clsx(
              'transition-all duration-500',
              i === msgIndex
                ? 'w-6 h-1.5 bg-stone-900 rounded-full'
                : i < msgIndex
                ? 'w-1.5 h-1.5 bg-stone-400 rounded-full'
                : 'w-1.5 h-1.5 bg-stone-200 rounded-full'
            )}
          />
        ))}
      </div>

      {/* Skeleton concept cards */}
      <div>
        <p className="text-xs text-stone-400 tracking-widest uppercase font-medium mb-4 text-center">
          Preparing your concepts
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SkeletonCard delay={0} />
          <SkeletonCard delay={150} />
          <SkeletonCard delay={300} />
          <SkeletonCard delay={450} />
        </div>
      </div>

      {/* Tip */}
      <div className="text-center">
        <p className="text-xs text-stone-400 max-w-sm mx-auto leading-relaxed">
          AI image generation typically takes 15–45 seconds.
          Each concept is uniquely personalized for your space.
        </p>
      </div>
    </div>
  )
}
