import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router'
import { NodeENVType } from '@/libraries/fetch'
import {
  useTemplate,
  useCreateTemplate,
  useUpdateTemplate,
  useDeleteTemplate,
} from '@/resources/hooks/template/use-template'
import { useLayouts, useCreateLayout } from '@/resources/hooks/layout/use-layout'
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
import { LayoutFormFields } from '@/components/layouts/form/fields'
import { Plus, Trash2 } from 'lucide-react'

const NO_LAYOUT = '__none__'

const slugify = (v: string) =>
  v
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9_-]/g, '')

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
  const [aliasDialogOpen, setAliasDialogOpen] = useState(false)
  const [draftAlias, setDraftAlias] = useState('')
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

  const { data: layoutsData, isLoading: isLoadingLayouts } = useLayouts(
    config,
    { page: 1, size: 100 },
    { enabled: !!token }
  )

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

  const [newLayoutOpen, setNewLayoutOpen] = useState(false)
  const [newLayoutName, setNewLayoutName] = useState('')
  const [newLayoutAlias, setNewLayoutAlias] = useState('')
  const [newLayoutHtml, setNewLayoutHtml] = useState('')

  const createMutation = useCreateTemplate(config)
  const updateMutation = useUpdateTemplate(config, templateId || '')
  const deleteMutation = useDeleteTemplate(config)
  const createLayoutMutation = useCreateLayout(config)

  const handleCreateLayout = async () => {
    try {
      const created = await createLayoutMutation.mutateAsync({
        alias: newLayoutAlias,
        name: newLayoutName || undefined,
        html: newLayoutHtml,
      })
      setLayoutId(created.id)
      setNewLayoutOpen(false)
      setNewLayoutName('')
      setNewLayoutAlias('')
      setNewLayoutHtml('')
      toast.success('Layout created')
    } catch (error) {
      handleApiError(error)
    }
  }

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
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          {/* Left sidebar — metadata */}
          <div className="grid grid-cols-4 gap-5">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="name" className="mb-0">
                  Name
                </Label>
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-foreground cursor-pointer
                    truncate max-w-[300px]"
                  onClick={() => {
                    setDraftAlias(alias)
                    setAliasDialogOpen(true)
                  }}>
                  Alias {alias && <span className="font-mono text-foreground">:{alias}</span>}
                </button>
              </div>
              <Input
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  const slug = slugify(e.target.value)
                  setAlias(slug)
                  setDraftAlias(slug)
                }}
                placeholder="e.g. Welcome Email"
                required
              />
            </div>

            <Dialog open={aliasDialogOpen} onOpenChange={setAliasDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Alias</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col">
                  <Label htmlFor="alias">Alias</Label>
                  <Input
                    id="alias"
                    value={draftAlias}
                    onChange={(e) => setDraftAlias(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                    placeholder="e.g. welcome-email"
                    autoFocus
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    onClick={() => {
                      setAlias(draftAlias)
                      setAliasDialogOpen(false)
                    }}>
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div className="flex flex-col">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Welcome to ${app_name}!"
                required
              />
            </div>

            <div className="flex flex-col">
              <Label htmlFor="from-email">From Email</Label>
              <Input
                id="from-email"
                type="email"
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
                placeholder="noreply@example.com"
              />
            </div>

            <div className="flex flex-col">
              <Label htmlFor="reply-to">Reply-To</Label>
              <Input
                id="reply-to"
                type="email"
                value={replyTo}
                onChange={(e) => setReplyTo(e.target.value)}
                placeholder="support@example.com"
              />
            </div>
          </div>

          {/* Right — HTML editor */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <Label className="mb-0">HTML Body</Label>
              <div className="flex items-center gap-3">
                <Label htmlFor="layout" className="text-sm mb-0">
                  Layout:
                </Label>
                <Select
                  key={`${layoutsData ? 'ready' : 'loading'}-${layoutsData?.items.length ?? 0}`}
                  value={layoutId}
                  disabled={isLoadingLayouts}
                  onValueChange={(value) => {
                    if (value === 'new_layout') {
                      setNewLayoutOpen(true)
                    } else if (value) {
                      setLayoutId(value)
                    }
                  }}>
                  <SelectTrigger id="layout">
                    <SelectValue placeholder="No layout" />
                  </SelectTrigger>
                  <SelectContent align="end">
                    <SelectItem value={NO_LAYOUT}>No layout</SelectItem>
                    {layoutsData?.items.map((layout) => (
                      <SelectItem key={layout.id} value={layout.id}>
                        {layout.alias}
                        {layout.name ? ` — ${layout.name}` : ''}
                      </SelectItem>
                    ))}
                    <SelectItem
                      value="new_layout"
                      className="border-t rounded-none hover:bg-transparent! hover:opacity-80
                        hover:cursor-pointer py-2">
                      <div className="flex items-center gap-2 w-full">
                        <Plus size={14} className="text-muted-foreground" />
                        <span>New layout</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* Dialog form new layouts */}
                <Dialog open={newLayoutOpen} onOpenChange={setNewLayoutOpen}>
                  <DialogContent className="min-w-5xl">
                    <DialogHeader>
                      <DialogTitle>New Layout</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 w-full">
                      <LayoutFormFields
                        name={newLayoutName}
                        onNameChange={setNewLayoutName}
                        alias={newLayoutAlias}
                        onAliasChange={setNewLayoutAlias}
                        html={newLayoutHtml}
                        onHtmlChange={setNewLayoutHtml}
                        htmlHeight="400px"
                      />
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button
                        disabled={
                          !newLayoutAlias || !newLayoutHtml || createLayoutMutation.isPending
                        }
                        onClick={handleCreateLayout}>
                        {createLayoutMutation.isPending ? 'Creating…' : 'Create Layout'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <HtmlEditor value={html} onChange={setHtml} height="550px" />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link to={isEditing ? `/templates/${templateId}` : '/templates'}>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Template'}
          </Button>
        </div>
      </form>
    </DetailContent>
  )
}
