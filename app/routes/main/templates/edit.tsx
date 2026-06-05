import { AppPreloader } from '@/components/loader/pre-loader'
import { TemplateFormContent } from '@/components/templates/form/content'
import { useApp } from 'tessera-ui'
import { useLoaderData } from 'react-router'

export async function loader({ params }: { params: { templateID: string } }) {
  const apiUrl = process.env.API_URL
  const nodeEnv = process.env.NODE_ENV
  return { apiUrl, nodeEnv, id: params.templateID }
}

export default function EditTemplate() {
  const { apiUrl, nodeEnv, id } = useLoaderData<typeof loader>()
  const { token, isLoadingIdenties } = useApp()

  if (isLoadingIdenties) {
    return <AppPreloader />
  }

  return <TemplateFormContent apiUrl={apiUrl!} token={token!} nodeEnv={nodeEnv!} templateId={id} />
}
