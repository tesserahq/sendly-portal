import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/modules/shadcn/ui/badge'
import { getEmailStatusBadge } from '@/utils/helpers/badge.helper'
import { EmailActivityType } from '@/resources/queries/email-activity'
import { DateTime } from 'tessera-ui'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/modules/shadcn/ui/tooltip'
import { Link } from 'react-router'

export const columns: ColumnDef<EmailActivityType>[] = [
  {
    accessorKey: 'event',
    header: 'Event',
    size: 10,
    cell: ({ row }) => {
      const { status, error_message } = row.original
      const badge = getEmailStatusBadge(status)
      const isFailed = status === 'failed'

      const badgeElement = (
        <Badge variant={badge.variant} className={badge.className}>
          <span className="text-xs capitalize">{status}</span>
        </Badge>
      )

      return isFailed && error_message ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{badgeElement}</TooltipTrigger>
            <TooltipContent>
              <p>{error_message}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        badgeElement
      )
    },
  },
  {
    accessorKey: 'to_email',
    header: 'Recipient',
    size: 250,
    cell: ({ row }) => {
      const { to_email } = row.original
      return (
        <Link to={`/activity/${row.original.id}`} className="button-link">
          <div className="max-w-[200px] truncate" title={to_email}>
            {to_email}
          </div>
        </Link>
      )
    },
  },
  {
    accessorKey: 'subject',
    header: 'Subject',
    size: 300,
    cell: ({ row }) => {
      const { subject } = row.original
      return <div className="max-w-[400px] truncate">{subject || '-'}</div>
    },
  },
  {
    accessorKey: 'provider',
    header: 'Provider',
    size: 200,
    cell: ({ row }) => {
      const { provider } = row.original
      return <div className="max-w-[200px] truncate">{provider || '-'}</div>
    },
  },
  {
    accessorKey: 'sent_at',
    header: 'Date & Time',
    size: 200,
    cell: ({ row }) => {
      const date = row.getValue('sent_at') as string
      return <DateTime date={date} formatStr="dd/MM/yyyy HH:mm:ss" />
    },
  },
]
