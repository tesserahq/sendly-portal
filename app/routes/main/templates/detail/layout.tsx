/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTemplate } from '@/resources/hooks/template/use-template'
import { FileText } from 'lucide-react'
import { Outlet, useLoaderData, useParams } from 'react-router'
import { useApp } from 'tessera-ui'
import { BreadcrumbItemData, DetailItemsProps, Layout } from 'tessera-ui/layouts'

export function loader({ params }: { params: { templateID: string } }) {
  const apiUrl = process.env.API_URL
  const nodeEnv = process.env.NODE_ENV
  return { apiUrl, nodeEnv, id: params.templateID }
}

export default function TemplateDetailLayout() {
  const { apiUrl, nodeEnv, id } = useLoaderData<typeof loader>()
  const params = useParams()
  const { token } = useApp()

  const { data, isLoading } = useTemplate({ apiUrl: apiUrl!, token: token!, nodeEnv }, id, {
    enabled: !!token,
  })

  const menuItems: DetailItemsProps[] = [
    {
      title: 'Overview',
      path: `/templates/${params.templateID}/overview`,
      icon: FileText as any,
    },
  ]

  const breadcrumbs: BreadcrumbItemData[] = [
    { label: 'Templates', link: '/templates' },
    { label: data?.name || data?.alias || id, link: `/templates/${id}`, disabled: true },
  ]

  return (
    <Layout.Detail
      menuItems={menuItems}
      breadcrumbs={breadcrumbs}
      isLoading={!token || !params.templateID || isLoading}>
      <div className="max-w-screen-2xl mx-auto p-3">
        <Outlet />
      </div>
    </Layout.Detail>
  )
}
