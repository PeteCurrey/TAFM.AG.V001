import { cn } from '@/lib/utils'

// ─── Progress indicator ───────────────────────────────────────────────────────

interface Step {
  label: string
  description?: string
}

interface ProgressIndicatorProps {
  steps: Step[]
  currentStep: number  // 0-indexed
  className?: string
  variant?: 'horizontal' | 'vertical'
}

export function ProgressIndicator({
  steps,
  currentStep,
  className,
  variant = 'horizontal',
}: ProgressIndicatorProps) {
  if (variant === 'vertical') {
    return (
      <nav aria-label="Application progress" className={className}>
        <ol className="space-y-0" role="list">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep
            const isCurrent = index === currentStep
            const isPending = index > currentStep

            return (
              <li key={step.label} className="relative flex gap-4 pb-6 last:pb-0" role="listitem">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'absolute left-[11px] top-7 w-px h-[calc(100%-28px)]',
                      isCompleted ? 'bg-orange-500' : 'bg-[var(--color-border-light)]',
                    )}
                    aria-hidden="true"
                  />
                )}

                {/* Step indicator */}
                <div
                  className={cn(
                    'relative flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center mt-0.5',
                    isCompleted && 'bg-orange-500 border-orange-500',
                    isCurrent && 'bg-white border-orange-500',
                    isPending && 'bg-white border-[var(--color-border-light)]',
                  )}
                  aria-hidden="true"
                >
                  {isCompleted ? (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span
                      className={cn(
                        'text-caption tabular-nums',
                        isCurrent ? 'text-orange-500' : 'text-[var(--color-text-on-light-muted)]',
                      )}
                    >
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Step label */}
                <div>
                  <p
                    className={cn(
                      'text-body-sm font-light',
                      isCompleted && 'text-[var(--color-text-on-light-3)] line-through decoration-1',
                      isCurrent && 'text-[var(--color-text-on-light-primary)]',
                      isPending && 'text-[var(--color-text-on-light-muted)]',
                    )}
                    aria-current={isCurrent ? 'step' : undefined}
                  >
                    {step.label}
                  </p>
                  {isCurrent && step.description && (
                    <p className="text-caption text-[var(--color-text-on-light-muted)] mt-0.5">
                      {step.description}
                    </p>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      </nav>
    )
  }

  // Horizontal variant (header progress bar)
  return (
    <nav aria-label="Application progress" className={cn('w-full', className)}>
      <ol className="flex items-center gap-0" role="list">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep

          return (
            <li
              key={step.label}
              className={cn('flex items-center', index < steps.length - 1 && 'flex-1')}
              role="listitem"
            >
              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    'w-6 h-6 rounded-full border flex items-center justify-center text-caption',
                    isCompleted && 'bg-orange-500 border-orange-500 text-white',
                    isCurrent && 'bg-white border-orange-500 text-orange-500',
                    !isCompleted && !isCurrent && 'bg-white border-[var(--color-border-light)] text-[var(--color-text-on-light-muted)]',
                  )}
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-hidden="true"
                >
                  {isCompleted ? '✓' : index + 1}
                </div>
                <span className={cn(
                  'text-caption hidden sm:block',
                  isCurrent ? 'text-[var(--color-text-on-light-primary)]' : 'text-[var(--color-text-on-light-muted)]',
                )}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-px mx-2',
                    isCompleted ? 'bg-orange-500' : 'bg-[var(--color-border-light)]',
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          )
        })}
      </ol>
      <p className="sr-only">
        Step {currentStep + 1} of {steps.length}: {steps[currentStep]?.label}
      </p>
    </nav>
  )
}
