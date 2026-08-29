import { ColumnDef } from '@tanstack/react-table'
import { BroadcastBatchType } from '@/resources/queries/broadcast'
import { DateTime, ResourceID } from 'tessera-ui'
import { Link } from 'react-router'
import { Badge } from '@/modules/shadcn/ui/badge'
import { getEmailEventTypeBadge } from '@/utils/helpers/badge.helper'
import { TagsPreview } from '@/components/tags-preview/tags-preview'

export const columns: ColumnDef<BroadcastBatchType>[] = [
  {
    accessorKey: 'batch_id',
    header: 'ID',
    size: 280,
    cell: ({ row }) => {
      const { batch_id } = row.original
      return (
        <Link to={`/broadcasts/${batch_id}`} className="button-link">
          <ResourceID value={batch_id} />
        </Link>
      )
    },
  },
  {
    accessorKey: 'project_id',
    header: 'Project',
    size: 200,
    cell: ({ row }) => {
      const { project_id } = row.original
      return (
        <div className="max-w-[200px] truncate font-mono text-xs" title={project_id ?? undefined}>
          {project_id ?? 'Global'}
        </div>
      )
    },
  },
  {
    accessorKey: 'queued_count',
    header: 'Recipients',
    size: 120,
    cell: ({ row }) => <div>{row.original.queued_count}</div>,
  },
  {
    accessorKey: 'suppressed_count',
    header: 'Suppressed',
    size: 120,
    cell: ({ row }) => <div>{row.original.suppressed_count}</div>,
  },
  {
    accessorKey: 'delivered_count',
    header: 'Delivered',
    size: 120,
    cell: ({ row }) => (
      <Badge {...getEmailEventTypeBadge('delivered')}>{row.original.delivered_count}</Badge>
    ),
  },
  {
    accessorKey: 'opened_count',
    header: 'Opened',
    size: 120,
    cell: ({ row }) => (
      <Badge {...getEmailEventTypeBadge('opened')}>{row.original.opened_count}</Badge>
    ),
  },
  {
    accessorKey: 'bounced_count',
    header: 'Bounced',
    size: 120,
    cell: ({ row }) => (
      <Badge {...getEmailEventTypeBadge('bounced')}>{row.original.bounced_count}</Badge>
    ),
  },
  {
    accessorKey: 'complained_count',
    header: 'Complained',
    size: 120,
    cell: ({ row }) => (
      <Badge {...getEmailEventTypeBadge('complained')}>{row.original.complained_count}</Badge>
    ),
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
    size: 170,
    cell: ({ row }) => {
      const tags = row.original.tags || []

      return <TagsPreview tags={tags} />
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    size: 200,
    cell: ({ row }) => {
      const date = row.getValue('created_at') as string
      return <DateTime date={date} formatStr="dd/MM/yyyy HH:mm:ss" />
    },
  },
]
