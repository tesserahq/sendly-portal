import { AppPreloader } from '@/components/loader/pre-loader'
import { TemplateOverviewContent } from '@/components/templates/detail/content'
import { useApp } from 'tessera-ui'
import { useLoaderData } from 'react-router'

export async function loader({ params }: { params: { templateID: string } }) {
  const apiUrl = process.env.API_URL
  const nodeEnv = process.env.NODE_ENV
  return { apiUrl, nodeEnv, id: params.templateID }
}

export default function TemplateOverview() {
  const { apiUrl, nodeEnv, id } = useLoaderData<typeof loader>()
  const { token, isLoadingIdenties } = useApp()

  if (isLoadingIdenties) {
    return <AppPreloader />
  }

  return (
    <TemplateOverviewContent apiUrl={apiUrl!} token={token!} nodeEnv={nodeEnv!} templateId={id} />
  )
}
