'use client';

import { cn } from '@/lib/utils';
import { UseCase, USE_CASE_CONFIG } from '@/lib/use-cases';

// SVG Icons for each use case
function DeliveryIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 16h6V8a2 2 0 0 0-2-2h-4" />
      <path d="M22 12H16" />
      <rect x="1" y="3" width="15" height="13" rx="2" />
      <circle cx="5" cy="18" r="2" />
      <circle cx="19" cy="18" r="2" />
      <path d="M1 6h15" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
    </svg>
  );
}

function TakeawayIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

const ICONS = {
  delivery: DeliveryIcon,
  calendar: CalendarIcon,
  takeaway: TakeawayIcon,
};

interface UseCaseCardProps {
  useCase: UseCase;
  selected: boolean;
  onSelect: (useCase: UseCase) => void;
}

export function UseCaseCard({ useCase, selected, onSelect }: UseCaseCardProps) {
  const config = USE_CASE_CONFIG[useCase];
  const Icon = ICONS[config.icon];

  return (
    <button
      type="button"
      onClick={() => onSelect(useCase)}
      className={cn(
        'group relative flex cursor-pointer flex-col items-start gap-3 rounded-xl border-2 p-5 text-left transition-all duration-200',
        'hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
        selected
          ? 'border-indigo-600 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-950/30'
          : 'border-border bg-card'
      )}
    >
      {/* Selection indicator */}
      <div
        className={cn(
          'absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full transition-all duration-200',
          selected
            ? 'bg-indigo-600 text-white dark:bg-indigo-500'
            : 'border-2 border-muted-foreground/30 bg-transparent'
        )}
      >
        {selected && <CheckIcon className="h-3 w-3" />}
      </div>

      {/* Icon */}
      <div
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-lg transition-colors duration-200',
          selected
            ? 'bg-indigo-600 text-white dark:bg-indigo-500'
            : 'bg-muted text-muted-foreground group-hover:bg-indigo-100 group-hover:text-indigo-600 dark:group-hover:bg-indigo-900/50 dark:group-hover:text-indigo-400'
        )}
      >
        <Icon className="h-6 w-6" />
      </div>

      {/* Content */}
      <div className="space-y-1.5 pr-6">
        <h3
          className={cn(
            'font-semibold leading-tight transition-colors duration-200',
            selected ? 'text-indigo-900 dark:text-indigo-100' : 'text-foreground'
          )}
        >
          {config.title}
        </h3>
        <p
          className={cn(
            'text-sm leading-relaxed transition-colors duration-200',
            selected ? 'text-indigo-700 dark:text-indigo-300' : 'text-muted-foreground'
          )}
        >
          {config.description}
        </p>
      </div>
    </button>
  );
}
