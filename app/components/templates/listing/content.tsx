import { DataTable } from '@/components/data-table'
import { FilterButton } from '@/components/filters/filter-button'
import { FilterDialog, type FilterDialogHandle } from '@/components/filters/filter-dialog'
import { TagsPreview } from '@/components/tags-preview/tags-preview'
import {
  CloneTemplateDialog,
  type CloneTemplateDialogHandle,
} from '@/components/templates/clone-template-dialog'
import {
  SendEmailDialog,
  type SendEmailDialogHandle,
} from '@/components/templates/send-email-dialog'
import { NodeENVType } from '@/libraries/fetch'
import {
  useCloneTemplate,
  useDeleteTemplate,
  useGetTagTemplate,
  useTemplates,
} from '@/resources/hooks/template/use-template'
import { TemplateType } from '@/resources/queries/template'
import { generateRandomString } from '@/utils/helpers/slug.helper'
import { useScopedParams } from '@/utils/helpers/params.helper'
import { Button } from '@shadcn/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@shadcn/ui/popover'
import { ColumnDef } from '@tanstack/react-table'
import { CopyCheck, Edit, EyeIcon, MoreVertical, Send, Trash2 } from 'lucide-react'
import { Activity, useMemo, useRef } from 'react'
import { Link, useNavigate } from 'react-router'
import { EmptyContent, NewButton, ResourceID, toast } from 'tessera-ui'
import { DateTime } from 'tessera-ui/components'
import DeleteConfirmation, {
  type DeleteConfirmationHandle,
} from 'tessera-ui/components/delete-confirmation'

interface TemplatesListingContentProps {
  apiUrl: string
  token: string
  nodeEnv: NodeENVType
  pagination: {
    page: number
    size: number
  }
  tag: string[]
  authLoading: boolean
}

export function TemplatesListingContent({
  apiUrl,
  token,
  nodeEnv,
  pagination,
  tag,
  authLoading,
}: TemplatesListingContentProps) {
  const navigate = useNavigate()
  const deleteConfirmationRef = useRef<DeleteConfirmationHandle>(null)
  const cloneTemplateDialogRef = useRef<CloneTemplateDialogHandle>(null)
  const sendEmailDialogRef = useRef<SendEmailDialogHandle>(null)
  const config = { apiUrl, token, nodeEnv }
  const { getScopedSearch } = useScopedParams()
  const filterDialogRef = useRef<FilterDialogHandle>(null)

  const { data: tags, isLoading: isLoadingTagTemplate } = useGetTagTemplate(config, {
    enabled: !!token && !authLoading,
  })

  const { data, isLoading, error } = useTemplates(
    config,
    { page: pagination.page, size: pagination.size, tag },
    { enabled: !!token && !authLoading }
  )

  const handleOpenTagFilter = () => {
    filterDialogRef.current?.open({
      title: 'Filter Templates',
      label: 'Tags',
      value: tag,
      placeholder: 'Select or search tags',
      onApply: (values) => navigate(getScopedSearch({ tag: values, page: 1 })),
      onClear: handleClearTagFilter,
    })
  }

  const handleClearTagFilter = () => {
    navigate(getScopedSearch({ tag: [], page: 1 }))
  }

  const { mutateAsync: deleteTemplate } = useDeleteTemplate(config, {
    onSuccess: () => {
      toast.success('Template deleted successfully')
    },
    onError: (error) => {
      toast.error('Failed to delete template', {
        description: error?.message || 'Please try again.',
      })
    },
  })

  const cloneTemplateMutation = useCloneTemplate(config)

  const handleDelete = (template: TemplateType) => {
    deleteConfirmationRef.current?.open({
      title: 'Delete Template',
      description: `Are you sure you want to delete "${template.name}"? This action cannot be undone.`,
      onDelete: async () => {
        deleteConfirmationRef.current?.updateConfig({ isLoading: true })
        await deleteTemplate(template.id)
        deleteConfirmationRef.current?.close()
      },
    })
  }

  const handleClone = (template: TemplateType) => {
    const randomSuffix = generateRandomString(5)
    const clonedName = `Copy of ${template.name}-${randomSuffix}`
    const clonedAlias = `copy-of-${template.alias}-${randomSuffix}`

    cloneTemplateDialogRef.current?.open({
      title: 'Clone Template',
      description: `Clone "${template.name}"? A copy named "${clonedName}" will be created.`,
      onClone: async () => {
        cloneTemplateDialogRef.current?.updateConfig({ isLoading: true })
        try {
          const cloned = await cloneTemplateMutation.mutateAsync({
            id: template.id,
            data: {
              name: clonedName,
              alias: clonedAlias,
              tags: [],
            },
          })
          cloneTemplateDialogRef.current?.close()
          toast.success('Template cloned successfully')
          navigate(`/templates/${cloned.id}`)
        } catch (error: unknown) {
          cloneTemplateDialogRef.current?.updateConfig({ isLoading: false })
          toast.error('Failed to clone template', {
            description: (error as Error)?.message || 'Please try again.',
          })
        }
      },
    })
  }

  const columns = useMemo<ColumnDef<TemplateType>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        size: 200,
        cell: ({ row }) => (
          <Link to={`/templates/${row.original.id}`} className="button-link">
            <div className="max-w-[200px] truncate">{row.original.name || '-'}</div>
          </Link>
        ),
      },
      {
        accessorKey: 'subject',
        header: 'Subject',
        size: 280,
        cell: ({ row }) => (
          <div className="max-w-[280px] truncate">{row.original.subject || '-'}</div>
        ),
      },
      {
        accessorKey: 'alias',
        header: 'Alias',
        size: 180,
        cell: ({ row }) => (
          <div className="max-w-[90%] truncate font-mono text-sm">{row.original.alias || '-'}</div>
        ),
      },
      {
        accessorKey: 'layout',
        header: 'Layout',
        size: 160,
        cell: ({ row }) => {
          const { layout, layout_id } = row.original
          const display = layout?.alias || layout_id
          if (!layout_id) {
            return (
              <div className="max-w-[160px] truncate font-mono text-sm text-muted-foreground">
                -
              </div>
            )
          }
          return (
            <Link
              to={`/layouts/${layout_id}`}
              className="button-link block max-w-[160px] truncate font-mono text-sm">
              {display}
            </Link>
          )
        },
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
        header: 'Created',
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
          const template = row.original
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
                  onClick={() => navigate(`/templates/${template.id}`)}>
                  <EyeIcon size={16} />
                  <span>Overview</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex w-full justify-start gap-2"
                  onClick={() => navigate(`/templates/${template.id}/edit`)}>
                  <Edit size={16} />
                  <span>Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex w-full justify-start gap-2"
                  onClick={() => handleClone(template)}>
                  <CopyCheck size={16} />
                  <span>Clone</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex w-full justify-start gap-2"
                  onClick={() => sendEmailDialogRef.current?.open(template)}>
                  <Send size={16} />
                  <span>Send Email</span>
                </Button>
                <Button
                  variant="ghost"
                  className="hover:bg-destructive hover:text-destructive-foreground flex w-full
                    justify-start gap-2"
                  onClick={() => handleDelete(template)}>
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
        title="Failed to load templates"
        description={error.message}
      />
    )
  }

  const meta = data
    ? { page: data.page, pages: data.pages, size: data.size, total: data.total }
    : undefined

  return (
    <div className="h-full page-content">
      <div className="relative z-10 mb-5 flex items-center animate-slide-up justify-between">
        <h1 className="page-title">Templates</h1>

        <div className="flex items-center gap-2">
          <Activity mode={tag.length === 0 && data?.total === 0 ? 'hidden' : 'visible'}>
            <FilterButton
              count={tag.length}
              onClick={handleOpenTagFilter}
              disabled={isLoadingTagTemplate}
            />
          </Activity>
          <NewButton label="New Template" onClick={() => navigate('/templates/new')} />
        </div>
      </div>

      <div className="animate-slide-up">
        <DataTable
          columns={columns}
          data={data?.items || []}
          meta={meta}
          isLoading={isLoading}
          empty={
            <EmptyContent
              image="/images/empty-provider.png"
              title={tag.length > 0 ? 'No templates found yet' : 'No templates yet'}
              description={
                tag.length > 0
                  ? 'No templates match the selected tags.'
                  : 'Create your first template to start sending emails.'
              }>
              <div className="flex items-center gap-2">
                <Button
                  variant="black"
                  onClick={() => {
                    if (tag.length > 0) handleOpenTagFilter()
                    else navigate('/templates/new')
                  }}>
                  {tag.length > 0 ? 'Chage Filter' : 'New Template'}
                </Button>
                <Activity mode={tag.length === 0 ? 'hidden' : 'visible'}>
                  <Button variant="outline" onClick={handleClearTagFilter}>
                    Reset Filter
                  </Button>
                </Activity>
              </div>
            </EmptyContent>
          }
        />
      </div>

      <FilterDialog ref={filterDialogRef} items={tags} />
      <DeleteConfirmation ref={deleteConfirmationRef} />
      <CloneTemplateDialog ref={cloneTemplateDialogRef} />
      <SendEmailDialog ref={sendEmailDialogRef} config={config} />
    </div>
  )
}
