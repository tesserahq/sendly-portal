import { DetailContent } from '@/components/detail-content'
import { LayoutFormFields } from '@/components/layouts/form/fields'
import { AppPreloader } from '@/components/loader/pre-loader'
import { useHandleApiError } from '@/hooks/useHandleApiError'
import { NodeENVType } from '@/libraries/fetch'
import { useCreateLayout, useLayout, useUpdateLayout } from '@/resources/hooks/layout/use-layout'
import { Button } from '@shadcn/ui/button'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { EmptyContent } from 'tessera-ui'
import { toast } from 'tessera-ui/components'

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
    <div className="p-4">
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
              {isSubmitting ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </form>
      </DetailContent>
    </div>
  )
}
