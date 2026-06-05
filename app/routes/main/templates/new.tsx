import { AppPreloader } from '@/components/loader/pre-loader'
import { TemplateFormContent } from '@/components/templates/form/content'
import { useApp } from 'tessera-ui'
import { useLoaderData } from 'react-router'

export async function loader() {
  const apiUrl = process.env.API_URL
  const nodeEnv = process.env.NODE_ENV
  return { apiUrl, nodeEnv }
}

export default function NewTemplate() {
  const { apiUrl, nodeEnv } = useLoaderData<typeof loader>()
  const { token, isLoadingIdenties } = useApp()

  if (isLoadingIdenties) {
    return <AppPreloader />
  }

  return <TemplateFormContent apiUrl={apiUrl!} token={token!} nodeEnv={nodeEnv!} />
}
