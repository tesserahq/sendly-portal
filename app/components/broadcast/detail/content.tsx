import { DetailContent } from '@/components/detail-content'
import { AppPreloader } from '@/components/loader/pre-loader'
import { Badge } from '@/modules/shadcn/ui/badge'
import { useBroadcastDetail } from '@/resources/hooks/broadcast/use-broadcast'
import { IQueryConfig } from '@/resources/queries'
import { getEmailEventTypeBadge, getStatusBadgeProps } from '@/utils/helpers/badge.helper'
import { EmptyContent, ResourceID } from 'tessera-ui'

interface BroadcastDetailContentProps {
  config: IQueryConfig
  batchID: string
}

export function BroadcastDetailContent({ config, batchID }: BroadcastDetailContentProps) {
  const { data, isLoading, error } = useBroadcastDetail(config, batchID)

  if (isLoading) {
    return <AppPreloader className="min-h-screen" />
  }

  if (data === undefined || error) {
    return (
      <EmptyContent
        title="Oops, looks like we're failed to fetch broadcast detail"
        description={error?.message}
        image="/images/empty-email.svg"
      />
    )
  }

  return (
    <DetailContent title="Broadcast Overview" className="grid grid-cols-9 gap-y-4 h-fit">
      <div className="d-list col-span-7 col-start-2 row-start-1">
        <div className="d-item border-none">
          <dt className="d-label text-end pr-5">ID:</dt>
          <dd className="d-content font-mono text-xs">
            <ResourceID value={data.batch_id} />
          </dd>
        </div>
        <div className="d-item border-none">
          <dt className="d-label text-end pr-5">Recipients:</dt>
          <dd className="d-content">{data.queued_count}</dd>
        </div>
        <div className="d-item border-none">
          <dt className="d-label text-end pr-5">Suppressed:</dt>
          <dd className="d-content">{data.suppressed_count}</dd>
        </div>
        <div className="d-item border-none">
          <dt className="d-label text-end pr-5">Prepared:</dt>
          <dd className="d-content">
            {data.prepared_count} / {data.queued_count}
          </dd>
        </div>
        <div className="d-item border-none">
          <dt className="d-label text-end pr-5">Status:</dt>
          <dd className="d-content">
            <Badge variant="outline" {...getStatusBadgeProps(data.finished)}>
              <span className="text-xs capitalize">
                {data.finished ? 'Finished' : 'In progress'}
              </span>
            </Badge>
          </dd>
        </div>
        <div className="d-item border-none">
          <dt className="d-label text-end pr-5">Delivered:</dt>
          <dd className="d-content">
            <Badge {...getEmailEventTypeBadge('delivered')}>{data.delivered_count}</Badge>
          </dd>
        </div>
        <div className="d-item border-none">
          <dt className="d-label text-end pr-5">Opened:</dt>
          <dd className="d-content">
            <Badge {...getEmailEventTypeBadge('opened')}>{data.opened_count}</Badge>
          </dd>
        </div>
        <div className="d-item border-none">
          <dt className="d-label text-end pr-5">Bounced:</dt>
          <dd className="d-content">
            <Badge {...getEmailEventTypeBadge('bounced')}>{data.bounced_count}</Badge>
          </dd>
        </div>
        <div className="d-item border-none">
          <dt className="d-label text-end pr-5">Complained:</dt>
          <dd className="d-content">
            <Badge {...getEmailEventTypeBadge('complained')}>{data.complained_count}</Badge>
          </dd>
        </div>
      </div>
    </DetailContent>
  )
}
