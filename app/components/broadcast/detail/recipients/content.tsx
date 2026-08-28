import { DataTable } from '@/components/data-table'
import {
  useBroadcastDetail,
  useBroadcastRecipients,
} from '@/resources/hooks/broadcast/use-broadcast'
import { IQueryConfig } from '@/resources/queries'
import { EmptyContent } from 'tessera-ui'
import { getRecipientColumns } from './column'

interface BroadcastRecipientsContentProps {
  config: IQueryConfig
  batchID: string
  pagination: {
    page: number
    size: number
  }
}

export function BroadcastRecipientsContent({
  config,
  batchID,
  pagination,
}: BroadcastRecipientsContentProps) {
  const { data: batch } = useBroadcastDetail(config, batchID, { enabled: !!config.token })
  const { data, isLoading, error } = useBroadcastRecipients(config, batchID, pagination, {
    enabled: !!config.token,
  })

  if (error) {
    return (
      <EmptyContent
        image="/images/empty-email.svg"
        title="Failed to get recipients"
        description={error.message}
      />
    )
  }

  if (!isLoading && data?.items.length === 0) {
    return (
      <EmptyContent
        image="/images/empty-email.svg"
        title="No recipients found"
        description="No recipients are available for this broadcast."
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
    <div className="animate-slide-up">
      <DataTable
        columns={getRecipientColumns(batch?.finished ?? false)}
        data={data?.items || []}
        meta={meta}
        isLoading={isLoading}
      />
    </div>
  )
}
