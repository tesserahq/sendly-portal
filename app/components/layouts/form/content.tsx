import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { NodeENVType } from '@/libraries/fetch'
import {
  useLayout,
  useCreateLayout,
  useUpdateLayout,
  useDeleteLayout,
} from '@/resources/hooks/layout/use-layout'
import { AppPreloader } from '@/components/loader/pre-loader'
import { DetailContent } from '@/components/detail-content'
import { EmptyContent } from 'tessera-ui'
import { toast } from 'tessera-ui/components'
import { useHandleApiError } from '@/hooks/useHandleApiError'
import { HtmlEditor } from '@/components/html-editor/html-editor'
import { Button } from '@shadcn/ui/button'
import { Input } from '@shadcn/ui/input'
import { Label } from '@shadcn/ui/label'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@shadcn/ui/dialog'
import { AlertTriangle, Trash2 } from 'lucide-react'
import { Link } from 'react-router'

interface LayoutFormContentProps {
  apiUrl: string
  token: string
  nodeEnv: NodeENVType
  layoutId?: string
}

export function LayoutFormContent({ apiUrl, token, nodeEnv, layoutId }: LayoutFormContentProps) {
  const navigate = useNavigate()
  const handleApiError = useHandleApiError()
  const config = { apiUrl, token, nodeEnv }
  const isEditing = !!layoutId

  const [alias, setAlias] = useState('')
  const [name, setName] = useState('')
  const [html, setHtml] = useState('')

  const {
    data,
    isLoading: isLoadingDetail,
    error: detailError,
  } = useLayout(config, layoutId || '', {
    enabled: isEditing && !!token,
  })

  useEffect(() => {
    if (data) {
      setAlias(data.alias)
      setName(data.name || '')
      setHtml(data.html)
    }
  }, [data])

  const createMutation = useCreateLayout(config)
  const updateMutation = useUpdateLayout(config, layoutId || '')
  const deleteMutation = useDeleteLayout(config)

  const isMissingContentPlaceholder = html.length > 0 && !html.includes('${content}')
  const isSubmitting = createMutation.isPending || updateMutation.isPending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isEditing) {
        const updated = await updateMutation.mutateAsync({ alias, name: name || undefined, html })
        toast.success('Layout updated successfully')
        navigate(`/layouts/${updated.id}`)
      } else {
        const created = await createMutation.mutateAsync({ alias, name: name || undefined, html })
        toast.success('Layout created successfully')
        navigate(`/layouts/${created.id}`)
      }
    } catch (error) {
      handleApiError(error)
    }
  }

  const handleDelete = async () => {
    if (!layoutId) return

    try {
      await deleteMutation.mutateAsync(layoutId)
      toast.success('Layout deleted successfully')
      navigate('/layouts')
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
        title="Failed to load layout"
        description={detailError.message}
        image="/images/empty-provider.png"
      />
    )
  }

  return (
    <DetailContent
      title={isEditing ? 'Edit Layout' : 'New Layout'}
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
                <DialogTitle>Delete Layout</DialogTitle>
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
        <div className="flex flex-col gap-2">
          <Label htmlFor="alias">Alias</Label>
          <Input
            id="alias"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            placeholder="e.g. transactional-base"
            required
          />
          <p className="text-xs text-muted-foreground">
            Unique slug identifier — auto-normalised by the API on save.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name (optional)</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Transactional Base Layout"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="html">HTML</Label>
          {isMissingContentPlaceholder && (
            <div
              className="flex items-center gap-2 rounded border border-yellow-400 bg-yellow-50 px-3
                py-2 text-sm text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
              <AlertTriangle size={14} className="shrink-0" />
              <span>
                Layout HTML must contain <code className="font-mono">${'{content}'}</code> — this is
                where template content will be injected.
              </span>
            </div>
          )}
          <HtmlEditor
            id="html"
            value={html}
            onChange={setHtml}
            placeholder={'<html>\n  <body>\n    ${content}\n  </body>\n</html>'}
            required
          />
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Layout'}
          </Button>
          <Link to={isEditing ? `/layouts/${layoutId}` : '/layouts'}>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </DetailContent>
  )
}
