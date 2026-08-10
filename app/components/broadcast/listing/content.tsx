import { DataTable } from '@/components/data-table'
import { columns } from './column'
import { NodeENVType } from '@/libraries/fetch'
import { EmptyContent } from 'tessera-ui'
import { useBroadcastListing } from '@/resources/hooks/broadcast/use-broadcast'

interface BroadcastListingContentProps {
  apiUrl: string
  token: string
  nodeEnv: NodeENVType
  pagination: {
    page: number
    size: number
  }
  authLoading: boolean
}

export function BroadcastListing({
  apiUrl,
  token,
  nodeEnv,
  pagination,
  authLoading,
}: BroadcastListingContentProps) {
  const { data, isLoading, error } = useBroadcastListing(
    { apiUrl, token, nodeEnv },
    { page: pagination.page, size: pagination.size },
    {
      enabled: !!token && !authLoading,
    }
  )

  if (error) {
    return (
      <EmptyContent
        image="/images/empty-email.svg"
        title="Failed to get broadcasts"
        description={error.message}
      />
    )
  }

  if (data?.items.length === 0) {
    return (
      <EmptyContent
        image="/images/empty-email.svg"
        title="No broadcasts found"
        description="No broadcast batches are available."
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
      <div className="mb-5 flex items-center animate-slide-up justify-between">
        <h1 className="page-title">Broadcasts</h1>
      </div>

      <div className="animate-slide-up">
        <DataTable columns={columns} data={data?.items || []} meta={meta} isLoading={isLoading} />
      </div>
    </div>
  )
}
