import { EmailActivityListing } from '@/components/email-activity'
import { AppPreloader } from '@/components/loader/pre-loader'
import { useApp } from '@/context/AppContext'
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

export default function EmailActivity() {
  const { apiUrl, nodeEnv, pagination } = useLoaderData<typeof loader>()
  const { token, isLoading } = useApp()

  if (isLoading) {
    return <AppPreloader />
  }

  return (
    <EmailActivityListing
      apiUrl={apiUrl!}
      token={token!}
      nodeEnv={nodeEnv!}
      pagination={pagination}
      authLoading={isLoading}
    />
  )
}
