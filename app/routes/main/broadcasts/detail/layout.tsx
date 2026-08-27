/* eslint-disable @typescript-eslint/no-explicit-any */
import { useBroadcastDetail } from '@/resources/hooks/broadcast/use-broadcast'
import { FileText } from 'lucide-react'
import { Outlet, useLoaderData, useParams } from 'react-router'
import { useApp } from 'tessera-ui'
import { BreadcrumbItemData, DetailItemsProps, Layout } from 'tessera-ui/layouts'

export function loader({ params }: { params: { batchID: string } }) {
  const apiUrl = process.env.API_URL
  const nodeEnv = process.env.NODE_ENV
  return { apiUrl, nodeEnv, id: params.batchID }
}

export default function BroadcastDetailLayout() {
  const { apiUrl, nodeEnv, id } = useLoaderData<typeof loader>()
  const params = useParams()
  const { token } = useApp()

  const { data, isLoading } = useBroadcastDetail({ apiUrl: apiUrl!, token: token!, nodeEnv }, id, {
    enabled: !!token,
  })

  const menuItems: DetailItemsProps[] = [
    {
      title: 'Overview',
      path: `/broadcasts/${params.batchID}/overview`,
      icon: FileText as any,
    },
  ]

  const breadcrumbs: BreadcrumbItemData[] = [
    { label: 'Broadcasts', link: '/broadcasts' },
    { label: data?.batch_id ?? id, link: `/broadcasts/${id}`, disabled: true },
  ]

  return (
    <Layout.Detail
      menuItems={menuItems}
      breadcrumbs={breadcrumbs}
      isLoading={!token || !params.batchID || isLoading}>
      <div className="max-w-screen-2xl mx-auto">
        <Outlet />
      </div>
    </Layout.Detail>
  )
}
