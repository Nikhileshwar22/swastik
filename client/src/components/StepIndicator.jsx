import clsx from 'clsx'

const STEPS = [
  { id: 1, label: 'Space', description: 'Upload your room' },
  { id: 2, label: 'Inspiration', description: 'Add references' },
  { id: 3, label: 'Requirements', description: 'Style & budget' },
  { id: 4, label: 'AI Analysis', description: 'Design brief' },
  { id: 5, label: 'Visualization', description: 'Generated concepts' },
  { id: 6, label: 'Refine', description: 'Customize design' },
]

export default function StepIndicator({ currentStep, completedSteps = [], onStepClick }) {
  return (
    <div className="bg-white border-b border-stone-100">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
        {/* Mobile: compact progress bar + current step */}
        <div className="flex md:hidden items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-400 tracking-widest uppercase font-medium">
              Step {currentStep} of {STEPS.length}
            </span>
            <span className="text-sm font-medium text-stone-800">
              {STEPS[currentStep - 1]?.label}
            </span>
          </div>
          <div className="flex gap-1">
            {STEPS.map(s => (
              <div
                key={s.id}
                className={clsx(
                  'h-1 rounded-full transition-all duration-300',
                  s.id === currentStep
                    ? 'w-6 bg-stone-900'
                    : completedSteps.includes(s.id)
                    ? 'w-3 bg-stone-400'
                    : 'w-3 bg-stone-200'
                )}
              />
            ))}
          </div>
        </div>

        {/* Desktop: full step row */}
        <div className="hidden md:flex items-stretch">
          {STEPS.map((step, index) => {
            const isActive = step.id === currentStep
            const isCompleted = completedSteps.includes(step.id)
            const isClickable = isCompleted || isActive
            const isLast = index === STEPS.length - 1

            return (
              <div key={step.id} className="flex items-center flex-1">
                <button
                  onClick={() => isClickable && onStepClick?.(step.id)}
                  disabled={!isClickable}
                  className={clsx(
                    'flex-1 flex flex-col items-center py-4 px-2 relative transition-all duration-200 group',
                    isClickable ? 'cursor-pointer' : 'cursor-default',
                    isActive && 'bg-stone-50'
                  )}
                >
                  {/* Number circle */}
                  <div
                    className={clsx(
                      'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold mb-2 transition-all duration-200 border',
                      isCompleted
                        ? 'bg-stone-900 border-stone-900 text-white'
                        : isActive
                        ? 'bg-stone-900 border-stone-900 text-white'
                        : 'bg-white border-stone-200 text-stone-400'
                    )}
                  >
                    {isCompleted ? (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span>{String(step.id).padStart(2, '0')}</span>
                    )}
                  </div>

                  {/* Labels */}
                  <span
                    className={clsx(
                      'text-xs font-semibold tracking-widest uppercase transition-colors duration-200',
                      isActive ? 'text-stone-900' : isCompleted ? 'text-stone-600' : 'text-stone-300'
                    )}
                  >
                    {step.label}
                  </span>
                  <span
                    className={clsx(
                      'text-xs mt-0.5 transition-colors duration-200',
                      isActive ? 'text-stone-500' : 'text-stone-300'
                    )}
                  >
                    {step.description}
                  </span>

                  {/* Active underline */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900" />
                  )}
                </button>

                {/* Connector */}
                {!isLast && (
                  <div className="flex-shrink-0 w-8 flex items-center justify-center">
                    <svg
                      className={clsx(
                        'w-3 h-3 transition-colors duration-200',
                        completedSteps.includes(step.id) ? 'text-stone-400' : 'text-stone-200'
                      )}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
