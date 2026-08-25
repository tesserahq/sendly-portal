import { DetailContent } from '@/components/detail-content'
import { AppPreloader } from '@/components/loader/pre-loader'
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
  useTemplate,
} from '@/resources/hooks/template/use-template'
import { mergeTemplateIntoLayout } from '@/utils/helpers/layout.helper'
import { generateRandomString } from '@/utils/helpers/slug.helper'
import { Button } from '@shadcn/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@shadcn/ui/popover'
import { CopyCheck, Edit, MoreHorizontal, Send, Trash2 } from 'lucide-react'
import { useRef } from 'react'
import { Link, useNavigate } from 'react-router'
import { EmptyContent, ResourceID, toast } from 'tessera-ui'
import { DateTime } from 'tessera-ui/components'
import DeleteConfirmation, {
  type DeleteConfirmationHandle,
} from 'tessera-ui/components/delete-confirmation'

interface TemplateOverviewContentProps {
  apiUrl: string
  token: string
  nodeEnv: NodeENVType
  templateId: string
}

export function TemplateOverviewContent({
  apiUrl,
  token,
  nodeEnv,
  templateId,
}: TemplateOverviewContentProps) {
  const navigate = useNavigate()
  const deleteConfirmationRef = useRef<DeleteConfirmationHandle>(null)
  const cloneTemplateDialogRef = useRef<CloneTemplateDialogHandle>(null)
  const sendEmailDialogRef = useRef<SendEmailDialogHandle>(null)
  const config = { apiUrl, token, nodeEnv }

  const { data, isLoading, error } = useTemplate(config, templateId, { enabled: !!token })
  const cloneTemplateMutation = useCloneTemplate(config)
  const { mutateAsync: deleteTemplate } = useDeleteTemplate(config, {
    onSuccess: () => {
      toast.success('Template deleted successfully')
      navigate('/templates')
    },
    onError: (error) => {
      toast.error('Failed to delete template', {
        description: error?.message || 'Please try again.',
      })
    },
  })

  const handleDelete = () => {
    if (!data) return
    deleteConfirmationRef.current?.open({
      title: 'Delete Template',
      description: `Are you sure you want to delete "${data.name}"? This action cannot be undone.`,
      onDelete: async () => {
        deleteConfirmationRef.current?.updateConfig({ isLoading: true })
        await deleteTemplate(templateId)
      },
    })
  }

  const handleClone = () => {
    if (!data) return
    const randomSuffix = generateRandomString(5)
    const clonedName = `Copy of ${data.name}-${randomSuffix}`
    const clonedAlias = `copy-of-${data.alias}-${randomSuffix}`

    cloneTemplateDialogRef.current?.open({
      title: 'Clone Template',
      description: `Clone "${data.name}"? A copy named "${clonedName}" will be created.`,
      onClone: async () => {
        cloneTemplateDialogRef.current?.updateConfig({ isLoading: true })
        try {
          const cloned = await cloneTemplateMutation.mutateAsync({
            id: data.id,
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

  if (isLoading) return <AppPreloader className="min-h-screen" />

  if (!data || error) {
    return (
      <EmptyContent
        title="Failed to load template"
        description={error?.message}
        image="/images/empty-provider.png"
      />
    )
  }

  const previewHtml = data.layout?.html
    ? mergeTemplateIntoLayout(data.layout.html, data.html)
    : data.html

  return (
    <div className="animate-slide-up">
      <DetailContent
        title={data.name || data.alias}
        actions={
          <Popover>
            <PopoverTrigger asChild>
              <Button size="icon" variant="ghost">
                <MoreHorizontal size={18} />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" side="bottom" className="w-52 p-2">
              <Button
                variant="ghost"
                className="flex w-full justify-start gap-2"
                onClick={() => navigate(`/templates/${templateId}/edit`)}>
                <Edit size={16} />
                <span>Edit</span>
              </Button>
              <Button
                variant="ghost"
                className="flex w-full justify-start gap-2"
                onClick={handleClone}>
                <CopyCheck size={16} />
                <span>Clone</span>
              </Button>
              <Button
                variant="ghost"
                className="flex w-full justify-start gap-2"
                onClick={() => sendEmailDialogRef.current?.open(data)}>
                <Send size={16} />
                <span>Send Test Email</span>
              </Button>
              <Button
                variant="ghost"
                className="hover:bg-destructive hover:text-destructive-foreground flex w-full
                  justify-start gap-2"
                onClick={handleDelete}>
                <Trash2 size={16} />
                <span>Delete</span>
              </Button>
            </PopoverContent>
          </Popover>
        }>
        <div className="d-list">
          <div className="d-item">
            <dt className="d-label">ID</dt>
            <dd className="d-content font-mono text-sm">
              <ResourceID value={data.id} />
            </dd>
          </div>
          <div className="d-item">
            <dt className="d-label">Alias</dt>
            <dd className="d-content font-mono text-sm">{data.alias}</dd>
          </div>
          <div className="d-item">
            <dt className="d-label">Name</dt>
            <dd className="d-content">{data.name || 'N/A'}</dd>
          </div>
          <div className="d-item">
            <dt className="d-label">Subject</dt>
            <dd className="d-content">{data.subject}</dd>
          </div>
          <div className="d-item">
            <dt className="d-label">From Email</dt>
            <dd className="d-content">{data.from_email || 'N/A'}</dd>
          </div>
          <div className="d-item">
            <dt className="d-label">Reply To</dt>
            <dd className="d-content">{data.reply_to || 'N/A'}</dd>
          </div>
          <div className="d-item">
            <dt className="d-label">Layout</dt>
            <dd className="d-content">
              {data.layout_id ? (
                <Link to={`/layouts/${data.layout_id}`} className="button-link text-sm">
                  {data.layout?.name}
                </Link>
              ) : (
                'N/A'
              )}
            </dd>
          </div>
          <div className="d-item">
            <dt className="d-label">Created At</dt>
            <dd className="d-content">
              <DateTime date={data.created_at} />
            </dd>
          </div>
          <div className="d-item">
            <dt className="d-label">Updated At</dt>
            <dd className="d-content">
              <DateTime date={data.updated_at} />
            </dd>
          </div>
        </div>

        <div className="mt-10">
          <iframe
            srcDoc={previewHtml}
            className="w-full h-[600px] border-0"
            sandbox=""
            title="Email Content"
          />
        </div>
      </DetailContent>

      <DeleteConfirmation ref={deleteConfirmationRef} />
      <CloneTemplateDialog ref={cloneTemplateDialogRef} />
      <SendEmailDialog ref={sendEmailDialogRef} config={config} />
    </div>
  )
}
