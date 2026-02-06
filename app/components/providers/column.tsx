import { ColumnDef } from '@tanstack/react-table'
import { ProviderType } from '@/resources/queries/provider/provider.type'
import { getStatusBadgeProps } from '@/utils/helpers/badge.helper'
import { Badge } from '@/modules/shadcn/ui/badge'

export const columns: ColumnDef<ProviderType>[] = [
  {
    accessorKey: 'id',
    header: 'Id',
    size: 200,
    cell: ({ row }) => {
      const { id } = row.original
      return <div className="max-w-[200px] truncate">{id || '-'}</div>
    },
  },
  {
    accessorKey: 'name',
    header: 'Name',
    size: 200,
    cell: ({ row }) => {
      const { name } = row.original
      return <div className="max-w-[200px] truncate">{name || '-'}</div>
    },
  },
  {
    accessorKey: 'enabled',
    header: 'Enabled',
    size: 200,
    cell: ({ row }) => {
      const { enabled } = row.original
      const badge = getStatusBadgeProps(enabled)
      return (
        <Badge variant="outline" className={badge.className}>
          <span className="text-xs">{enabled ? 'Enabled' : 'Disabled'}</span>
        </Badge>
      )
    },
  },
  {
    accessorKey: 'default',
    header: 'Default',
    size: 200,
    cell: ({ row }) => {
      const { default: defaultProvider } = row.original
      const badge = getStatusBadgeProps(defaultProvider)
      return (
        <Badge variant="outline" className={badge.className}>
          <span className="text-xs">{defaultProvider ? 'Yes' : 'No'}</span>
        </Badge>
      )
    },
  },
  {
    accessorKey: 'site',
    header: 'Site',
    size: 200,
    cell: ({ row }) => {
      const { site } = row.original
      return <div className="max-w-[200px] truncate">{site || '-'}</div>
    },
  },
]
