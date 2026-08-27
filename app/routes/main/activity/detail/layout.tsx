/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEmailActivityDetail } from '@/resources/hooks/email-activity/use-email-activity'
import { FileText } from 'lucide-react'
import { Outlet, useLoaderData, useParams } from 'react-router'
import { useApp } from 'tessera-ui'
import { BreadcrumbItemData, DetailItemsProps, Layout } from 'tessera-ui/layouts'

export function loader({ params }: { params: { emailID: string } }) {
  const apiUrl = process.env.API_URL
  const nodeEnv = process.env.NODE_ENV
  return { apiUrl, nodeEnv, id: params.emailID }
}

export default function EmailActivityDetailLayout() {
  const { apiUrl, nodeEnv, id } = useLoaderData<typeof loader>()
  const params = useParams()
  const { token } = useApp()

  const { data, isLoading } = useEmailActivityDetail(
    { apiUrl: apiUrl!, token: token!, nodeEnv },
    id,
    { enabled: !!token }
  )

  const menuItems: DetailItemsProps[] = [
    {
      title: 'Overview',
      path: `/activity/${params.emailID}/overview`,
      icon: FileText as any,
    },
  ]

  const breadcrumbs: BreadcrumbItemData[] = [
    { label: 'Activity', link: '/activity' },
    { label: data?.to_email ?? id, link: `/activity/${id}`, disabled: true },
  ]

  return (
    <Layout.Detail
      menuItems={menuItems}
      breadcrumbs={breadcrumbs}
      isLoading={!token || !params.emailID || isLoading}>
      <div className="max-w-screen-2xl mx-auto">
        <Outlet />
      </div>
    </Layout.Detail>
  )
}
