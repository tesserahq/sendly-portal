import { DataTable } from '@/components/data-table'
import { NodeENVType } from '@/libraries/fetch'
import { useDeleteLayout, useLayouts } from '@/resources/hooks/layout/use-layout'
import { LayoutType } from '@/resources/queries/layout'
import { Button } from '@shadcn/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@shadcn/ui/popover'
import { ColumnDef } from '@tanstack/react-table'
import { Edit, EyeIcon, MoreVertical, Plus, Trash2 } from 'lucide-react'
import { useMemo, useRef } from 'react'
import { Link, useNavigate } from 'react-router'
import { EmptyContent, NewButton, ResourceID } from 'tessera-ui'
import { DateTime } from 'tessera-ui/components'
import DeleteConfirmation, {
  type DeleteConfirmationHandle,
} from 'tessera-ui/components/delete-confirmation'

interface LayoutsListingContentProps {
  apiUrl: string
  token: string
  nodeEnv: NodeENVType
  pagination: {
    page: number
    size: number
  }
  authLoading: boolean
}

export function LayoutsListingContent({
  apiUrl,
  token,
  nodeEnv,
  pagination,
  authLoading,
}: LayoutsListingContentProps) {
  const navigate = useNavigate()
  const deleteConfirmationRef = useRef<DeleteConfirmationHandle>(null)
  const config = { apiUrl, token, nodeEnv }

  const { data, isLoading, error } = useLayouts(
    config,
    { page: pagination.page, size: pagination.size },
    { enabled: !!token && !authLoading }
  )

  const { mutateAsync: deleteLayout } = useDeleteLayout(config)

  const handleDelete = (layout: LayoutType) => {
    deleteConfirmationRef.current?.open({
      title: 'Delete Layout',
      description: `Are you sure you want to delete "${layout.alias}"? This action cannot be undone.`,
      onDelete: async () => {
        deleteConfirmationRef.current?.updateConfig({ isLoading: true })
        await deleteLayout(layout.id)
        deleteConfirmationRef.current?.close()
      },
    })
  }

  const columns = useMemo<ColumnDef<LayoutType>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        size: 250,
        cell: ({ row }) => (
          <Link to={`/layouts/${row.original.id}`} className="button-link">
            <div className="max-w-[250px] truncate">{row.original.name || '-'}</div>
          </Link>
        ),
      },
      {
        accessorKey: 'alias',
        header: 'Alias',
        size: 200,
        cell: ({ row }) => (
          <div className="max-w-[200px] truncate font-mono text-sm">
            {row.original.alias || '-'}
          </div>
        ),
      },
      {
        accessorKey: 'created_at',
        header: 'Created At',
        size: 200,
        cell: ({ row }) => (
          <DateTime date={row.getValue('created_at') as string} formatStr="dd/MM/yyyy HH:mm:ss" />
        ),
      },
      {
        id: 'id',
        header: 'ID',
        size: 60,
        cell: ({ row }) => {
          return <ResourceID value={row.original.id} />
        },
      },
      {
        id: 'actions',
        header: '',
        size: 60,
        cell: ({ row }) => {
          const layout = row.original
          return (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="px-0 hover:bg-transparent"
                  aria-label="Open actions">
                  <MoreVertical size={18} />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" side="bottom" className="w-40 p-2">
                <Button
                  variant="ghost"
                  className="flex w-full justify-start gap-2"
                  onClick={() => navigate(`/layouts/${layout.id}`)}>
                  <EyeIcon size={16} />
                  <span>Overview</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex w-full justify-start gap-2"
                  onClick={() => navigate(`/layouts/${layout.id}/edit`)}>
                  <Edit size={16} />
                  <span>Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  className="hover:bg-destructive hover:text-destructive-foreground flex w-full
                    justify-start gap-2"
                  onClick={() => handleDelete(layout)}>
                  <Trash2 size={16} />
                  <span>Delete</span>
                </Button>
              </PopoverContent>
            </Popover>
          )
        },
      },
    ],
    [navigate]
  )

  if (error) {
    return (
      <EmptyContent
        image="/images/empty-provider.png"
        title="Failed to load layouts"
        description={error.message}
      />
    )
  }

  const meta = data
    ? { page: data.page, pages: data.pages, size: data.size, total: data.total }
    : undefined

  return (
    <div className="h-full page-content">
      <div className="animate-slide-up relative z-10 mb-5 flex items-center justify-between">
        <h1 className="page-title">Layouts</h1>
        <NewButton label="New Layout" onClick={() => navigate('/layouts/new')} />
      </div>

      <div className="animate-slide-up">
        <DataTable columns={columns} data={data?.items || []} meta={meta} isLoading={isLoading} />
      </div>

      <DeleteConfirmation ref={deleteConfirmationRef} />
    </div>
  )
}
