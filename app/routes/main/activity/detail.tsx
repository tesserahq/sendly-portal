import { EmailActivityDetailContent } from '@/components/email-activity/detail/content'
import { useApp } from '@/context/AppContext'
import { useLoaderData } from 'react-router'

export async function loader({ params }: { params: { emailID: string } }) {
  const apiUrl = process.env.API_URL
  const nodeEnv = process.env.NODE_ENV
  return { apiUrl, nodeEnv, id: params.emailID }
}

export default function EmailActivityDetail() {
  const { apiUrl, nodeEnv, id } = useLoaderData<typeof loader>()
  const { token } = useApp()

  const config = { apiUrl: apiUrl!, token: token!, nodeEnv: nodeEnv }
  return <EmailActivityDetailContent config={config} emailID={id} />
}
