import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { NodeENVType } from '@/libraries/fetch'
import { useLayout, useCreateLayout, useUpdateLayout } from '@/resources/hooks/layout/use-layout'
import { AppPreloader } from '@/components/loader/pre-loader'
import { DetailContent } from '@/components/detail-content'
import { EmptyContent } from 'tessera-ui'
import { toast } from 'tessera-ui/components'
import { useHandleApiError } from '@/hooks/useHandleApiError'
import { LayoutFormFields } from '@/components/layouts/form/fields'
import { Button } from '@shadcn/ui/button'
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
    <DetailContent title={isEditing ? 'Edit Layout' : 'New Layout'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <LayoutFormFields
          name={name}
          onNameChange={setName}
          alias={alias}
          onAliasChange={setAlias}
          html={html}
          onHtmlChange={setHtml}
          htmlHeight="550px"
        />

        <div className="flex items-center justify-end gap-3">
          <Link to={isEditing ? `/layouts/${layoutId}` : '/layouts'}>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Layout'}
          </Button>
        </div>
      </form>
    </DetailContent>
  )
}
