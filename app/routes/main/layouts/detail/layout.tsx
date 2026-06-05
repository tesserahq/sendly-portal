/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLayout } from '@/resources/hooks/layout/use-layout'
import { FileText } from 'lucide-react'
import { Outlet, useLoaderData, useParams } from 'react-router'
import { useApp } from 'tessera-ui'
import { BreadcrumbItemData, DetailItemsProps, Layout } from 'tessera-ui/layouts'

export function loader({ params }: { params: { layoutID: string } }) {
  const apiUrl = process.env.API_URL
  const nodeEnv = process.env.NODE_ENV
  return { apiUrl, nodeEnv, id: params.layoutID }
}

export default function LayoutDetailLayout() {
  const { apiUrl, nodeEnv, id } = useLoaderData<typeof loader>()
  const params = useParams()
  const { token } = useApp()

  const { data, isLoading } = useLayout({ apiUrl: apiUrl!, token: token!, nodeEnv }, id, {
    enabled: !!token,
  })

  const menuItems: DetailItemsProps[] = [
    {
      title: 'Overview',
      path: `/layouts/${params.layoutID}/overview`,
      icon: FileText as any,
    },
  ]

  const breadcrumbs: BreadcrumbItemData[] = [
    { label: 'Layouts', link: '/layouts' },
    { label: data?.name || data?.alias || id, link: `/layouts/${id}`, disabled: true },
  ]

  return (
    <Layout.Detail
      menuItems={menuItems}
      breadcrumbs={breadcrumbs}
      isLoading={!token || !params.layoutID || isLoading}>
      <div className="max-w-screen-2xl mx-auto p-3">
        <Outlet />
      </div>
    </Layout.Detail>
  )
}
