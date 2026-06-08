import { useRef } from 'react'
import { Link, useNavigate } from 'react-router'
import { NodeENVType } from '@/libraries/fetch'
import { useTemplate, useDeleteTemplate } from '@/resources/hooks/template/use-template'
import { AppPreloader } from '@/components/loader/pre-loader'
import { DetailContent } from '@/components/detail-content'
import { EmailViewer } from '@/components/email-activity/detail/email-viewer/email-viewer'
import { EmptyContent, ResourceID } from 'tessera-ui'
import { DateTime } from 'tessera-ui/components'
import { Popover, PopoverContent, PopoverTrigger } from '@shadcn/ui/popover'
import { Button } from '@shadcn/ui/button'
import { Edit, MoreHorizontal, Trash2 } from 'lucide-react'
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
  const config = { apiUrl, token, nodeEnv }

  const { data, isLoading, error } = useTemplate(config, templateId, { enabled: !!token })
  const { mutateAsync: deleteTemplate } = useDeleteTemplate(config)

  const handleDelete = () => {
    if (!data) return
    deleteConfirmationRef.current?.open({
      title: 'Delete Template',
      description: `Are you sure you want to delete "${data.alias}"? This action cannot be undone.`,
      onDelete: async () => {
        deleteConfirmationRef.current?.updateConfig({ isLoading: true })
        await deleteTemplate(templateId)
        navigate('/templates')
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
            <PopoverContent align="end" side="bottom" className="w-40 p-2">
              <Button
                variant="ghost"
                className="flex w-full justify-start gap-2"
                onClick={() => navigate(`/templates/${templateId}/edit`)}>
                <Edit size={16} />
                <span>Edit</span>
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
            <dt className="d-label">Layout ID</dt>
            <dd className="d-content">
              {data.layout_id ? (
                <Link to={`/layouts/${data.layout_id}`} className="button-link font-mono text-sm">
                  {data.layout_id}
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
          <EmailViewer html={data.html} raw={data.html} />
        </div>
      </DetailContent>

      <DeleteConfirmation ref={deleteConfirmationRef} />
    </div>
  )
}
