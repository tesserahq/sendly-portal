import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/modules/shadcn/ui/tooltip'
import { Button } from '@shadcn/ui/button'
import { Filter } from 'lucide-react'

interface FilterButtonProps {
  count?: number
  onClick: () => void
  tooltip?: string
  className?: string
  disabled?: boolean
}

export function FilterButton({
  count = 0,
  onClick,
  tooltip = 'Filter',
  className = '',
  disabled,
}: FilterButtonProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className={`relative ${className}`}
            aria-label={tooltip}
            onClick={onClick}
            disabled={disabled}>
            <Filter size={16} />
            {count > 0 && (
              <span
                className="absolute -right-1 -top-2 flex h-4 min-w-4 items-center justify-center
                  rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
                {count}
              </span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
