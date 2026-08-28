import { ColumnDef } from '@tanstack/react-table'
import { Link } from 'react-router'
import { Badge } from '@/modules/shadcn/ui/badge'
import { DateTime, ResourceID } from 'tessera-ui'
import { BroadcastRecipientResultType } from '@/resources/queries/broadcast'
import { EmailStatusEnum } from '@/resources/queries/email-activity'
import {
  getEmailStatusBadge,
  getRecipientOutcomeBadge,
  resolveRecipientOutcome,
} from '@/utils/helpers/badge.helper'

export function getRecipientColumns(
  batchFinished: boolean
): ColumnDef<BroadcastRecipientResultType>[] {
  return [
    {
      accessorKey: 'email',
      header: 'Recipient',
      size: 220,
      cell: ({ row }) => {
        const { email, email_id } = row.original
        const content = (
          <div className="max-w-[220px] truncate" title={email}>
            {email}
          </div>
        )
        return email_id ? (
          <Link to={`/activity/${email_id}`} className="button-link">
            {content}
          </Link>
        ) : (
          content
        )
      },
    },
    {
      accessorKey: 'client_reference_id',
      header: 'Reference',
      size: 160,
      cell: ({ row }) => {
        const { client_reference_id } = row.original
        return client_reference_id ? <ResourceID value={client_reference_id} /> : <div>-</div>
      },
    },
    {
      accessorKey: 'email_status',
      header: 'Status',
      size: 140,
      cell: ({ row }) => {
        const { email_id, email_status, suppressed, prepared } = row.original

        if (email_id) {
          const badge = getEmailStatusBadge(email_status as EmailStatusEnum)
          return (
            <Badge variant={badge.variant} className={badge.className}>
              <span className="text-xs capitalize">{email_status}</span>
            </Badge>
          )
        }

        const outcome = resolveRecipientOutcome(suppressed, prepared, batchFinished)
        const badge = getRecipientOutcomeBadge(outcome)
        return (
          <Badge variant={badge.variant} className={badge.className}>
            <span className="text-xs capitalize">{outcome}</span>
          </Badge>
        )
      },
    },
    {
      accessorKey: 'opened_at',
      header: 'Opened',
      size: 180,
      cell: ({ row }) => {
        const { opened_at } = row.original
        return opened_at ? (
          <DateTime date={opened_at} formatStr="dd/MM/yyyy HH:mm:ss" />
        ) : (
          <div>-</div>
        )
      },
    },
    {
      accessorKey: 'clicked_at',
      header: 'Clicked',
      size: 180,
      cell: ({ row }) => {
        const { clicked_at } = row.original
        return clicked_at ? (
          <DateTime date={clicked_at} formatStr="dd/MM/yyyy HH:mm:ss" />
        ) : (
          <div>-</div>
        )
      },
    },
  ]
}
