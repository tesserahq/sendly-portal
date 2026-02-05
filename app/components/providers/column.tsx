import { ColumnDef } from '@tanstack/react-table'
import { ProviderType } from '@/resources/queries/provider/provider.type'

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
      return <div className="max-w-[200px] truncate">{enabled ? 'Yes' : 'No'}</div>
    },
  },
  {
    accessorKey: 'default',
    header: 'Default',
    size: 200,
    cell: ({ row }) => {
      const { default: defaultProvider } = row.original
      return <div className="max-w-[200px] truncate">{defaultProvider ? 'Yes' : 'No'}</div>
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
