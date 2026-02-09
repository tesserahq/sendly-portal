import React, { useState } from 'react'
import { Mail } from 'lucide-react'
import { Badge } from '@/modules/shadcn/ui/badge'
import { EmailActivityType } from '@/resources/queries/email-activity'
import { getEmailStatusBadge } from '@/utils/helpers/badge.helper'
import { DateTime } from 'tessera-ui'
import { statusConfig } from './timeline.config'
import { TimelineErrorDialog } from './timeline.errordialog'
import { Button } from '@/modules/shadcn/ui/button'

interface EmailStatusTimelineProps {
  data: EmailActivityType
}

export const EmailStatusTimeline: React.FC<EmailStatusTimelineProps> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const config = statusConfig[data.status]
  const message = config.getMessage(data)
  const badge = getEmailStatusBadge(data.status)

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className={`overflow-hidden w-fit py-2 border-l-4 px-4 z-10 ${config.color}`}>
        <div className="flex flex-row items-center gap-3">
          <div className={`p-2 rounded-full ${config.dotColor}`}>
            <Mail size={20} />
          </div>
          <div className="flex flex-col">
            <span className="underline">{data.to_email}</span>
            <span className="capitalize text-xs">{data.status}</span>
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row justify-between gap-2">
            <div className="flex flex-row items-center gap-2">
              <div className={`h-2.5 w-2.5 rounded-full ${config.dotBeforeColor}`} />
              <Badge variant={badge.variant} className={`${badge.className} w-fit`}>
                <span className="text-xs capitalize">{data.status}</span>
              </Badge>
            </div>

            <DateTime
              date={data.sent_at}
              formatStr="MMM dd, yyyy HH:mm:ss"
              className="text-muted-foreground"
            />
          </div>
          <p className="ml-5 text-muted-foreground">{message}</p>
          {data.status === 'failed' && (
            <>
              <Button
                variant={'outline'}
                size="xs"
                className={'w-fit rounded-xs ml-5 text-muted-foreground bg-transparent h-6'}
                onClick={() => setOpen(true)}>
                <span className="text-xs capitalize">More Details</span>
              </Button>
              <TimelineErrorDialog data={data} open={open} onOpenChange={setOpen} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
