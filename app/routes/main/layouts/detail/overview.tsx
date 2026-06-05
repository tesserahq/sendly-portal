import { AppPreloader } from '@/components/loader/pre-loader'
import { LayoutOverviewContent } from '@/components/layouts/detail/content'
import { useApp } from 'tessera-ui'
import { useLoaderData } from 'react-router'

export async function loader({ params }: { params: { layoutID: string } }) {
  const apiUrl = process.env.API_URL
  const nodeEnv = process.env.NODE_ENV
  return { apiUrl, nodeEnv, id: params.layoutID }
}

export default function LayoutOverview() {
  const { apiUrl, nodeEnv, id } = useLoaderData<typeof loader>()
  const { token, isLoadingIdenties } = useApp()

  if (isLoadingIdenties) {
    return <AppPreloader />
  }

  return <LayoutOverviewContent apiUrl={apiUrl!} token={token!} nodeEnv={nodeEnv!} layoutId={id} />
}
