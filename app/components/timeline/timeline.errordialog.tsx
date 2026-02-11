import { Button } from '@/modules/shadcn/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/modules/shadcn/ui/dialog'
import { EmailEvent } from '@/resources/queries/email-activity'
import { DateTime } from 'tessera-ui'

interface TimelineErrorDialogProps {
  data: EmailEvent
  provider: string
  to_email: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TimelineErrorDialog({
  data,
  provider,
  to_email,
  open,
  onOpenChange,
}: TimelineErrorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:min-w-[50vw]">
        <DialogHeader>
          <DialogTitle>{data.details.Name}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div className="d-list">
          <div className="d-item border-none">
            <dt className="d-label text-end pr-5">Provider:</dt>
            <dd className="d-content capitalize">{provider || 'N/A'}</dd>
          </div>
          <div className="d-item border-none">
            <dt className="d-label text-end pr-5">Address:</dt>
            <dd className="d-content">{to_email || 'N/A'}</dd>
          </div>
          <div className="d-item border-none">
            <dt className="d-label text-end pr-5">Date:</dt>
            <dd className="d-content w-full">
              <DateTime date={data?.event_timestamp} formatStr="dd/MM/yyyy HH:mm:ss" />
            </dd>
          </div>
          <div className="d-item border-none">
            <dt className="d-label text-end pr-5">Error Details:</dt>
            <dd className="d-content w-full">{data?.details.Details || 'N/A'}</dd>
          </div>
        </div>
        {data.details.Content && (
          <div
            className="mt-4 flex flex-col gap-1 overflow-auto rounded-md border bg-muted/30 p-4
              font-mono text-xs leading-relaxed text-muted-foreground max-h-[200px]">
            {data.details.Content.split(';')
              .filter((s) => s.trim().length > 0)
              .map((segment, i) => (
                <div key={i} className="break-all">
                  {(() => {
                    const trimmed = segment.trim()
                    const eqIndex = trimmed.indexOf('=')
                    if (eqIndex > -1) {
                      const key = trimmed.slice(0, eqIndex)
                      const value = trimmed.slice(eqIndex + 1)
                      return (
                        <>
                          <span className="font-bold text-foreground">{key}</span>
                          <span className="mx-1 text-foreground">=</span>
                          <span>{value}</span>
                        </>
                      )
                    }
                    return <span>{trimmed}</span>
                  })()}
                  <span className="opacity-50">;</span>
                </div>
              ))}
          </div>
        )}
        {data.details.Description && (
          <p className="text-sm text-muted-foreground mt-4">{data.details.Description}</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
