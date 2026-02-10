import React, { useState } from 'react'
import { Mail } from 'lucide-react'
import { Badge } from '@/modules/shadcn/ui/badge'
import { EmailActivityType } from '@/resources/queries/email-activity'
import { getEmailEventTypeBadge } from '@/utils/helpers/badge.helper'
import { DateTime } from 'tessera-ui'
import { TimelineErrorDialog } from './timeline.errordialog'
import { Button } from '@/modules/shadcn/ui/button'
import { eventTypeConfig, statusConfig } from './timeline.config'

interface EmailStatusTimelineProps {
  data: EmailActivityType
}

type EventType = keyof typeof eventTypeConfig

export const EmailStatusTimeline: React.FC<EmailStatusTimelineProps> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const config = statusConfig[data.status]

  return (
    <div className="flex flex-col w-full">
      <div className={`overflow-hidden w-fit py-2 border-l-4 px-4 z-10 mb-3 ${config.color}`}>
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

      <div className="relative overflow-visible">
        {/* Vertical line */}
        <div className="absolute left-0 -top-10 bottom-0 w-[2px] bg-border" />

        {data.events.map((event, index) => {
          const eventConfig =
            eventTypeConfig[event.event_type as EventType] ?? eventTypeConfig.unknown
          const badge = getEmailEventTypeBadge(
            (event.event_type as EventType) ?? eventTypeConfig.unknown
          )
          const message = eventConfig.getMessage(data)
          return (
            <div key={index} className="relative pb-6 last:pb-0">
              <div className="flex flex-col gap-2">
                <div className="flex flex-row justify-between gap-2">
                  <div className="flex flex-row items-center gap-2">
                    {/* Dot positioned on the line */}
                    <div
                      className={`absolute -left-[3px] h-2 w-2 rounded-full
                      ${eventConfig.dotBeforeColor} border-background`}
                    />
                    <Badge variant={badge.variant} className={`${badge.className} w-fit ml-4`}>
                      <span className="text-xs capitalize">{event.event_type}</span>
                    </Badge>
                  </div>

                  <DateTime
                    date={event.event_timestamp}
                    formatStr="MMM dd, yyyy HH:mm:ss"
                    className="text-muted-foreground"
                  />
                </div>
                <p className="ml-4 text-muted-foreground text-sm">{message}</p>
                {event.event_type !== 'delivered' && (
                  <>
                    <Button
                      variant={'outline'}
                      size="xs"
                      className={'w-fit rounded-xs ml-4 text-muted-foreground bg-transparent h-6'}
                      onClick={() => setOpen(true)}>
                      <span className="text-xs capitalize">More Details</span>
                    </Button>
                    <TimelineErrorDialog
                      provider={data.provider}
                      to_email={data.to_email}
                      data={event}
                      open={open}
                      onOpenChange={setOpen}
                    />
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
