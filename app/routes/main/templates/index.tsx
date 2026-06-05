import { AppPreloader } from '@/components/loader/pre-loader'
import { TemplatesListingContent } from '@/components/templates/listing/content'
import { useApp } from 'tessera-ui'
import { ensureCanonicalPagination } from '@/utils/helpers/pagination.helper'
import { useLoaderData } from 'react-router'

export async function loader({ request }: { request: Request }) {
  const pagination = ensureCanonicalPagination(request, {
    defaultSize: 25,
    defaultPage: 1,
  })

  if (pagination instanceof Response) {
    return pagination
  }

  const apiUrl = process.env.API_URL
  const nodeEnv = process.env.NODE_ENV

  return { apiUrl, nodeEnv, pagination }
}

export default function Templates() {
  const { apiUrl, nodeEnv, pagination } = useLoaderData<typeof loader>()
  const { token, isLoadingIdenties } = useApp()

  if (isLoadingIdenties) {
    return <AppPreloader />
  }

  return (
    <TemplatesListingContent
      apiUrl={apiUrl!}
      token={token!}
      nodeEnv={nodeEnv!}
      pagination={pagination}
      authLoading={isLoadingIdenties}
    />
  )
}
