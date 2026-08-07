import { ColumnDef } from '@tanstack/react-table'
import { BroadcastBatchType } from '@/resources/queries/broadcast'
import { DateTime } from 'tessera-ui'
import { Link } from 'react-router'

export const columns: ColumnDef<BroadcastBatchType>[] = [
  {
    accessorKey: 'batch_id',
    header: 'Batch ID',
    size: 280,
    cell: ({ row }) => {
      const { batch_id } = row.original
      return (
        <Link to={`/broadcasts/${batch_id}`} className="button-link">
          <div className="max-w-[280px] truncate font-mono text-xs" title={batch_id}>
            {batch_id}
          </div>
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
    accessorKey: 'created_at',
    header: 'Date & Time',
    size: 200,
    cell: ({ row }) => {
      const date = row.getValue('created_at') as string
      return <DateTime date={date} formatStr="dd/MM/yyyy HH:mm:ss" />
    },
  },
]
