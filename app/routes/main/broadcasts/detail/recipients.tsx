import { BroadcastRecipientsContent } from '@/components/broadcast'
import { ensureCanonicalPagination } from '@/utils/helpers/pagination.helper'
import { useApp } from 'tessera-ui'
import { useLoaderData } from 'react-router'

export async function loader({
  params,
  request,
}: {
  params: { batchID: string }
  request: Request
}) {
  const pagination = ensureCanonicalPagination(request, {
    defaultSize: 25,
    defaultPage: 1,
  })

  if (pagination instanceof Response) {
    return pagination
  }

  const apiUrl = process.env.API_URL
  const nodeEnv = process.env.NODE_ENV
  return { apiUrl, nodeEnv, id: params.batchID, pagination }
}

export default function BroadcastRecipients() {
  const { apiUrl, nodeEnv, id, pagination } = useLoaderData<typeof loader>()
  const { token } = useApp()

  const config = { apiUrl: apiUrl!, token: token!, nodeEnv: nodeEnv }
  return <BroadcastRecipientsContent config={config} batchID={id} pagination={pagination} />
}
