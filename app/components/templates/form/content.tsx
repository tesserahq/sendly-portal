import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router'
import { NodeENVType } from '@/libraries/fetch'
import {
  useTemplate,
  useCreateTemplate,
  useUpdateTemplate,
  useDeleteTemplate,
} from '@/resources/hooks/template/use-template'
import { useLayouts } from '@/resources/hooks/layout/use-layout'
import { AppPreloader } from '@/components/loader/pre-loader'
import { DetailContent } from '@/components/detail-content'
import { EmptyContent } from 'tessera-ui'
import { toast } from 'tessera-ui/components'
import { useHandleApiError } from '@/hooks/useHandleApiError'
import { HtmlEditor } from '@/components/html-editor/html-editor'
import { Button } from '@shadcn/ui/button'
import { Input } from '@shadcn/ui/input'
import { Label } from '@shadcn/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shadcn/ui/select'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@shadcn/ui/dialog'
import { Trash2 } from 'lucide-react'

const NO_LAYOUT = '__none__'

interface TemplateFormContentProps {
  apiUrl: string
  token: string
  nodeEnv: NodeENVType
  templateId?: string
}

export function TemplateFormContent({
  apiUrl,
  token,
  nodeEnv,
  templateId,
}: TemplateFormContentProps) {
  const navigate = useNavigate()
  const handleApiError = useHandleApiError()
  const config = { apiUrl, token, nodeEnv }
  const isEditing = !!templateId

  const [alias, setAlias] = useState('')
  const [name, setName] = useState('')
  const [subject, setSubject] = useState('')
  const [html, setHtml] = useState('')
  const [fromEmail, setFromEmail] = useState('')
  const [replyTo, setReplyTo] = useState('')
  const [layoutId, setLayoutId] = useState<string>(NO_LAYOUT)

  const {
    data,
    isLoading: isLoadingDetail,
    error: detailError,
  } = useTemplate(config, templateId || '', { enabled: isEditing && !!token })

  const { data: layoutsData } = useLayouts(config, { page: 1, size: 100 }, { enabled: !!token })

  useEffect(() => {
    if (data) {
      setAlias(data.alias)
      setName(data.name)
      setSubject(data.subject)
      setHtml(data.html)
      setFromEmail(data.from_email || '')
      setReplyTo(data.reply_to || '')
      setLayoutId(data.layout_id || NO_LAYOUT)
    }
  }, [data])

  const createMutation = useCreateTemplate(config)
  const updateMutation = useUpdateTemplate(config, templateId || '')
  const deleteMutation = useDeleteTemplate(config)

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      alias,
      name,
      subject,
      html,
      from_email: fromEmail || undefined,
      reply_to: replyTo || undefined,
      layout_id: layoutId !== NO_LAYOUT ? layoutId : undefined,
    }

    try {
      if (isEditing) {
        const updated = await updateMutation.mutateAsync({
          ...payload,
          from_email: fromEmail || null,
          reply_to: replyTo || null,
          layout_id: layoutId !== NO_LAYOUT ? layoutId : null,
        })
        toast.success('Template updated successfully')
        navigate(`/templates/${updated.id}`)
      } else {
        const created = await createMutation.mutateAsync(payload)
        toast.success('Template created successfully')
        navigate(`/templates/${created.id}`)
      }
    } catch (error) {
      handleApiError(error)
    }
  }

  const handleDelete = async () => {
    if (!templateId) return

    try {
      await deleteMutation.mutateAsync(templateId)
      toast.success('Template deleted successfully')
      navigate('/templates')
    } catch (error) {
      handleApiError(error)
    }
  }

  if (isEditing && isLoadingDetail) {
    return <AppPreloader className="min-h-screen" />
  }

  if (isEditing && detailError) {
    return (
      <EmptyContent
        title="Failed to load template"
        description={detailError.message}
        image="/images/empty-provider.png"
      />
    )
  }

  return (
    <DetailContent
      title={isEditing ? 'Edit Template' : 'New Template'}
      actions={
        isEditing ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm" disabled={deleteMutation.isPending}>
                <Trash2 size={14} />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Template</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">
                Are you sure you want to delete <strong>{alias}</strong>? This action cannot be
                undone.
              </p>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}>
                  {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : undefined
      }>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="alias">Alias</Label>
            <Input
              id="alias"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder="e.g. welcome-email"
              required
            />
            <p className="text-xs text-muted-foreground">Auto-normalised slug identifier.</p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Welcome Email"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Welcome to ${app_name}!"
            required
          />
          <p className="text-xs text-muted-foreground">Supports Mako template variables.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="from-email">From Email (optional)</Label>
            <Input
              id="from-email"
              type="email"
              value={fromEmail}
              onChange={(e) => setFromEmail(e.target.value)}
              placeholder="noreply@example.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="reply-to">Reply-To (optional)</Label>
            <Input
              id="reply-to"
              type="email"
              value={replyTo}
              onChange={(e) => setReplyTo(e.target.value)}
              placeholder="support@example.com"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="layout">Layout (optional)</Label>
          <Select value={layoutId} onValueChange={setLayoutId}>
            <SelectTrigger id="layout">
              <SelectValue placeholder="No layout" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NO_LAYOUT}>No layout</SelectItem>
              {layoutsData?.items.map((layout) => (
                <SelectItem key={layout.id} value={layout.id}>
                  {layout.alias}
                  {layout.name ? ` — ${layout.name}` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Wrap this template&apos;s HTML inside a layout.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="html">HTML Body</Label>
          <HtmlEditor
            id="html"
            value={html}
            onChange={setHtml}
            placeholder={'<p>Hello ${first_name},</p>'}
            required
          />
          <p className="text-xs text-muted-foreground">Supports Mako template variables.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Template'}
          </Button>
          <Link to={isEditing ? `/templates/${templateId}` : '/templates'}>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </DetailContent>
  )
}
