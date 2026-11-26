import { Check } from 'lucide-react';
import { PmWizardStep, WIZARD_STEPS } from './types';

interface PmStepperHeaderProps {
  currentStep: PmWizardStep;
  completedSteps: Record<number, boolean>;
  isCompleted?: boolean;
  onStepSelect: (step: PmWizardStep) => void;
}

const STEP_PROGRESS_CONFIG: Record<
  PmWizardStep,
  { percent: number; scaleClass: string }
> = {
  0: { percent: 33, scaleClass: 'scale-x-[0.3333]' },
  1: { percent: 67, scaleClass: 'scale-x-[0.6667]' },
  2: { percent: 100, scaleClass: 'scale-x-100' },
};

export default function PmStepperHeader({
  currentStep,
  completedSteps,
  isCompleted = false,
  onStepSelect,
}: PmStepperHeaderProps) {
  const activeStepMeta = WIZARD_STEPS[currentStep];
  const progress = isCompleted
    ? { percent: 100, scaleClass: 'scale-x-100' }
    : STEP_PROGRESS_CONFIG[currentStep];

  return (
    <div className="space-y-3">
      {/* Top Progress Status Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="font-mono font-bold text-gray-900 tabular-nums shrink-0">
              {currentStep + 1} / {WIZARD_STEPS.length} 단계
            </span>
            <span className="text-gray-300" aria-hidden="true">
              ·
            </span>
            <span className="truncate font-semibold text-gray-700">
              {isCompleted ? '모든 단계 입력 완료' : `${activeStepMeta.title} 진행 중`}
            </span>
          </div>
          <span className="font-mono text-[11px] font-bold text-gray-600 tabular-nums shrink-0">
            {progress.percent}%
          </span>
        </div>

        {/* Continuous Progress Bar with 3-Step Dividers */}
        <div
          role="progressbar"
          aria-label="PM 견적 입력 진행 상태"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress.percent}
          aria-valuetext={`${WIZARD_STEPS.length}단계 중 ${currentStep + 1}단계 (${activeStepMeta.title})`}
          className="relative h-2 w-full overflow-hidden rounded-full bg-gray-100"
        >
          <div
            className={`h-full w-full origin-left rounded-full transition-transform duration-300 ease-out ${
              isCompleted ? 'bg-emerald-600' : 'bg-black'
            } ${progress.scaleClass}`}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-1/3 w-0.5 bg-white/80"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-2/3 w-0.5 bg-white/80"
          />
        </div>
      </div>

      {/* Interactive 3-Step Tabs */}
      <nav aria-label="PM 견적 입력 단계" className="grid grid-cols-3 gap-2">
        {WIZARD_STEPS.map((step) => {
          const isActive = currentStep === step.index;
          const isStepCompleted = Boolean(completedSteps[step.index]) && !isActive;

          return (
            <button
              key={step.num}
              type="button"
              onClick={() => onStepSelect(step.index)}
              aria-current={isActive ? 'step' : undefined}
              className={`group flex items-center gap-1.5 sm:gap-2.5 rounded-xl border px-2 py-2 sm:px-3 sm:py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 ${
                isActive
                  ? 'border-black bg-black text-white'
                  : isStepCompleted
                  ? 'border-gray-300 bg-gray-100/80 text-gray-900 hover:bg-gray-100'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span
                className={`flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-lg font-mono text-[10px] sm:text-[11px] font-bold tabular-nums ${
                  isActive
                    ? 'bg-white text-black'
                    : isStepCompleted
                    ? 'bg-gray-900 text-white'
                    : 'border border-gray-200 bg-gray-50 text-gray-600'
                }`}
              >
                {isStepCompleted ? <Check size={12} aria-hidden="true" /> : step.num}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={`truncate text-xs font-bold sm:text-sm ${
                    isActive ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {step.title}
                </p>
                <p
                  className={`hidden truncate text-[11px] sm:block ${
                    isActive ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {step.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
