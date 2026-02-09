import { Button } from '@/modules/shadcn/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/modules/shadcn/ui/dialog'
import { EmailActivityType } from '@/resources/queries/email-activity'
import { DateTime } from 'tessera-ui'

interface TimelineErrorDialogProps {
  data: EmailActivityType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TimelineErrorDialog({ data, open, onOpenChange }: TimelineErrorDialogProps) {
  return (
    <div>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle />
            <DialogDescription>
              <div className="d-list">
                <div className="d-item border-none">
                  <dt className="d-label text-end pr-5">Provider:</dt>
                  <dd className="d-content capitalize">{data?.provider || 'N/A'}</dd>
                </div>
                <div className="d-item border-none">
                  <dt className="d-label text-end pr-5">Address:</dt>
                  <dd className="d-content">{data?.to_email || 'N/A'}</dd>
                </div>
                <div className="d-item border-none">
                  <dt className="d-label text-end pr-5">Date:</dt>
                  <dd className="d-content w-full">
                    <DateTime date={data?.sent_at} formatStr="dd/MM/yyyy HH:mm:ss" />
                  </dd>
                </div>
                <div className="d-item border-none">
                  <dt className="d-label text-end pr-5">Error Message:</dt>
                  <dd className="d-content w-full">{data?.error_message || 'N/A'}</dd>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
