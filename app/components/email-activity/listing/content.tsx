import { DataTable } from '@/components/data-table'
import { columns } from './column'
import { NodeENVType } from '@/libraries/fetch'
import { EmptyContent } from 'tessera-ui'
import { useEmailActivityListing } from '@/resources/hooks/email-activity/use-email-activity'

interface EmailActivityListingContentProps {
  apiUrl: string
  token: string
  nodeEnv: NodeENVType
  pagination: {
    page: number
    size: number
  }
  authLoading: boolean
}

export function EmailActivityListing({
  apiUrl,
  token,
  nodeEnv,
  pagination,
  authLoading,
}: EmailActivityListingContentProps) {
  const { data, isLoading, error } = useEmailActivityListing(
    { apiUrl, token, nodeEnv },
    { page: pagination.page, size: pagination.size },
    {
      enabled: !!token && !authLoading,
    }
  )

  console.log(data)

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
        <h1 className="page-title">Activity</h1>
      </div>

      <DataTable columns={columns} data={data?.items || []} meta={meta} isLoading={isLoading} />
    </div>
  )
}
