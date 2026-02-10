import { DetailContent } from '@/components/detail-content'
import { AppPreloader } from '@/components/loader/pre-loader'
import { EmailStatusTimeline } from '@/components/timeline'
import { useEmailActivityDetail } from '@/resources/hooks/email-activity/use-email-activity'
import { IQueryConfig } from '@/resources/queries'
import { DateTime, EmptyContent } from 'tessera-ui'
import { EmailViewer } from './email-viewer/email-viewer'

interface EmailActivityDetailContentProps {
  config: IQueryConfig
  emailID: string
}

export function EmailActivityDetailContent({ config, emailID }: EmailActivityDetailContentProps) {
  const { data, isLoading, error } = useEmailActivityDetail(config, emailID)

  if (isLoading) {
    return <AppPreloader className="min-h-screen" />
  }

  if (data === undefined || error) {
    return (
      <EmptyContent
        title="Oops, looks like we're failed to fetch email activity detail"
        description={error?.message}
        image="/images/empty-email.svg"
      />
    )
  }

  return (
    <DetailContent
      title="Email Activity Detail"
      className="grid grid-cols-9 grid-rows-[max-content_max-content] gap-y-20 h-fit">
      <div className="d-list col-span-7 col-start-2 row-start-1">
        <div className="d-item border-none">
          <dt className="d-label text-end pr-5">Provider:</dt>
          <dd className="d-content capitalize">{data?.provider || 'N/A'}</dd>
        </div>
        <div className="d-item border-none">
          <dt className="d-label text-end pr-5">Subject:</dt>
          <dd className="d-content">{data?.subject || 'N/A'}</dd>
        </div>
        <div className="d-item border-none">
          <dt className="d-label text-end pr-5">From:</dt>
          <dd className="d-content">{data?.from_email || 'N/A'}</dd>
        </div>
        <div className="d-item border-none items-start!">
          <dt className="d-label text-end pr-5">To:</dt>
          <dd className="d-content w-full overflow-visible!">
            <EmailStatusTimeline data={data} />
          </dd>
        </div>
      </div>
      <EmailViewer
        html={data?.body || ''}
        raw={data?.body || ''}
        className="w-full col-span-9 row-start-2"
      />
    </DetailContent>
  )
}
