import { DataTable } from '@/components/data-table'
import { columns } from './column'
import { NodeENVType } from '@/libraries/fetch'
import { useProviders } from '@/resources/hooks/provider/use-provider'
import { EmptyContent } from 'tessera-ui'

interface ProvidersContentProps {
  apiUrl: string
  token: string
  nodeEnv: NodeENVType
  pagination: {
    page: number
    size: number
  }
}

export function ProvidersContent({ apiUrl, token, nodeEnv, pagination }: ProvidersContentProps) {
  const { data, isLoading, error } = useProviders(
    { apiUrl, token, nodeEnv },
    { page: pagination.page, size: pagination.size },
    {
      enabled: !!token,
    }
  )

  if (error) {
    return (
      <EmptyContent
        image="/images/empty-provider.png"
        title="Failed to get providers"
        description={error.message}
      />
    )
  }

  if (data?.items.length === 0) {
    return (
      <EmptyContent
        image="/images/empty-provider.png"
        title="No providers found"
        description="No providers are available."
      />
    )
  }

  const meta = data
    ? {
        page: data.page,
        pages: data.pages,
        size: data.size,
        total: data.total,
      }
    : undefined

  return (
    <div className="h-full page-content">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="page-title">Providers</h1>
      </div>

      <DataTable columns={columns} data={data?.items || []} meta={meta} isLoading={isLoading} />
    </div>
  )
}
