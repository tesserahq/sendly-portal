import { DetailContent } from '@/components/detail-content'
import { TabButton } from '@/components/email-activity/detail/email-viewer/tab-button'
import {
  RichEmailEditor,
  type RichEmailEditorRef,
} from '@/components/email-editor/rich-email-editor'
import { getHtmlErrors } from '@/components/html-editor/html-validator'
import { useHtmlValidation } from '@/components/html-editor/use-html-validation'
import { LayoutFormFields } from '@/components/layouts/form/fields'
import { AppPreloader } from '@/components/loader/pre-loader'
import { useHandleApiError } from '@/hooks/useHandleApiError'
import { NodeENVType } from '@/libraries/fetch'
import { useCreateLayout, useLayouts } from '@/resources/hooks/layout/use-layout'
import {
  useCreateTemplate,
  useTemplate,
  useUpdateTemplate,
} from '@/resources/hooks/template/use-template'
import { uploadAssets } from '@/resources/queries/vaulta'
import Editor from '@monaco-editor/react'
import { Button } from '@shadcn/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shadcn/ui/dialog'
import { Input } from '@shadcn/ui/input'
import { Label } from '@shadcn/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shadcn/ui/select'
import { Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { EmptyContent } from 'tessera-ui'
import { TagsInput, toast } from 'tessera-ui/components'

const NO_LAYOUT = '__none__'
const SIX_MONTHS_IN_SECONDS = 60 * 60 * 24 * 30 * 6

const slugify = (v: string) =>
  v
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9_-]/g, '')

interface TemplateFormContentProps {
  apiUrl: string
  token: string
  nodeEnv: NodeENVType
  vaultaApiUrl: string
  templateId?: string
}

export function TemplateFormContent({
  apiUrl,
  token,
  nodeEnv,
  vaultaApiUrl,
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
  const [fromEmail, setFromEmail] = useState('')
  const [replyTo, setReplyTo] = useState('')
  const [layoutId, setLayoutId] = useState<string>(NO_LAYOUT)
  const richEditorRef = useRef<RichEmailEditorRef>(null)
  const [editorReady, setEditorReady] = useState(false)
  const [tab, setTab] = useState<'edit' | 'html'>('edit')
  const [htmlValue, setHtmlValue] = useState('')
  const { handleMount: handleHtmlEditorMount } = useHtmlValidation(htmlValue)
  const [tags, setTags] = useState<string[]>([])

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
      setFromEmail(data.from_email || '')
      setReplyTo(data.reply_to || '')
      setLayoutId(data.layout_id || NO_LAYOUT)
      setTags(data.tags || [])
    }
  }, [data])

  // Seeding the editor is separate from the rest of `data` because the editor
  // becomes ready asynchronously (immediatelyRender: false) — if `data` had
  // already resolved (e.g. from cache) before the editor mounted, a single
  // effect keyed only on `data` would silently no-op against a still-null
  // editor. Re-checking whenever `editorReady` flips covers that race.
  useEffect(() => {
    if (data && editorReady) {
      richEditorRef.current?.setContent(data.html)
    }
  }, [data, editorReady])

  const [newLayoutOpen, setNewLayoutOpen] = useState(false)
  const [newLayoutName, setNewLayoutName] = useState('')
  const [newLayoutAlias, setNewLayoutAlias] = useState('')
  const [newLayoutHtml, setNewLayoutHtml] = useState('')

  const createTemplateMutation = useCreateTemplate(config)
  const updateTemplateMutation = useUpdateTemplate(config, templateId || '')
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

  const handleTabChange = async (next: 'edit' | 'html') => {
    if (next === 'html') {
      setHtmlValue((await richEditorRef.current?.getHTML()) ?? '')
    } else if (tab === 'html') {
      richEditorRef.current?.setContent(htmlValue)
    }
    setTab(next)
  }

  const handleUploadImage = async (file: File) => {
    try {
      const asset = await uploadAssets(
        { apiUrl: vaultaApiUrl, token, nodeEnv },
        { file, expires_in: SIX_MONTHS_IN_SECONDS }
      )
      if (!asset) throw new Error('Vaulta upload failed')
      return { url: asset.url }
    } catch (error) {
      handleApiError(error)
      throw error
    }
  }

  const isSubmitting = createTemplateMutation.isPending || updateTemplateMutation.isPending

  const handleSubmit = async () => {
    const html = tab === 'html' ? htmlValue : ((await richEditorRef.current?.getHTML()) ?? '')

    const htmlErrors = getHtmlErrors(html)
    if (htmlErrors.length > 0) {
      toast.error(
        `Fix ${htmlErrors.length} HTML error${htmlErrors.length > 1 ? 's' : ''} before saving`
      )
      setHtmlValue(html)
      setTab('html')
      return
    }

    const payload = {
      alias,
      name,
      subject,
      html,
      tags,
      from_email: fromEmail || undefined,
      reply_to: replyTo || undefined,
      layout_id: layoutId !== NO_LAYOUT ? layoutId : undefined,
    }

    try {
      if (isEditing) {
        // Update existing template
        const updated = await updateTemplateMutation.mutateAsync({
          ...payload,
          from_email: fromEmail || null,
          reply_to: replyTo || null,
          layout_id: layoutId !== NO_LAYOUT ? layoutId : null,
        })

        toast.success('Template updated successfully')
        navigate(`/templates/${updated.id}`)
      } else {
        // Create new template
        const created = await createTemplateMutation.mutateAsync(payload)
        toast.success('Template created successfully')
        navigate(`/templates/${created.id}`)
      }
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
    <div className="p-4">
      <DetailContent title={isEditing ? 'Edit Template' : 'New Template'}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            {/* Left sidebar — metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <Label htmlFor="name" className="mb-0">
                    Name
                  </Label>
                  <button
                    type="button"
                    className="text-xs leading-none text-muted-foreground hover:text-foreground
                      cursor-pointer truncate max-w-[300px]"
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
                  autoFocus
                  onChange={(e) => {
                    setName(e.target.value)
                    const slug = slugify(e.target.value)
                    setAlias(slug)
                    setDraftAlias(slug)
                  }}
                  placeholder="Welcome Email"
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
                      placeholder="welcome-email"
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
                  placeholder="Welcome to ${app_name}!"
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

            <div className="flex lg:flex-row flex-col items-start gap-5 justify-between">
              <div className="w-full lg:w-1/2">
                <Label className="text-sm font-medium">Tags</Label>
                <div className="">
                  <TagsInput value={tags} onChange={setTags} />
                </div>
              </div>

              <div className="w-full lg:w-1/2">
                <Label htmlFor="layout" className="text-sm font-medium">
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
                        {layout.name}
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

            {/* Right — HTML editor */}
            <div className="flex flex-col">
              <Label className="text-sm font-medium">Content</Label>

              <div className="flex items-center border-b">
                <TabButton active={tab === 'edit'} onClick={() => handleTabChange('edit')}>
                  Design
                </TabButton>
                <TabButton active={tab === 'html'} onClick={() => handleTabChange('html')}>
                  HTML
                </TabButton>
              </div>
              <div className="border border-t-0 rounded-b overflow-hidden">
                <div className={tab === 'edit' ? '' : 'hidden'}>
                  <RichEmailEditor
                    ref={richEditorRef}
                    height="550px"
                    onReady={() => setEditorReady(true)}
                    onUploadImage={handleUploadImage}
                  />
                </div>
                {tab === 'html' && (
                  <Editor
                    height="550px"
                    language="html"
                    value={htmlValue}
                    onChange={(v) => setHtmlValue(v ?? '')}
                    onMount={handleHtmlEditorMount}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 13,
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      wordWrap: 'on',
                      tabSize: 2,
                      automaticLayout: true,
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Link to={isEditing ? `/templates/${templateId}` : '/templates'}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </div>
      </DetailContent>
    </div>
  )
}
