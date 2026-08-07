/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRequestInfo } from '@/hooks/useRequestInfo'
import { ROUTE_PATH as THEME_PATH } from '@/routes/resources/update-theme'
import { SITE_CONFIG } from '@/utils/config/site.config'
import { Building2, FileText, History, LayoutTemplate } from 'lucide-react'
import { Outlet, useNavigate, useParams, useSubmit } from 'react-router'
import { AuthGuard, Layout, MainItemProps } from 'tessera-ui'

export default function PrivateLayout() {
  const requestInfo = useRequestInfo()
  const submit = useSubmit()
  const params = useParams()
  const navigate = useNavigate()
  const shouldCollapseSidebar =
    Boolean(params.emailID) || Boolean(params.layoutID) || Boolean(params.templateID)

  const onSetTheme = (theme: string) => {
    submit(
      { theme },
      {
        method: 'POST',
        action: THEME_PATH,
        navigate: false,
        fetcherKey: 'theme-fetcher',
      }
    )
  }

  const menuItems: MainItemProps[] = [
    {
      title: 'Activity',
      path: '/activity',
      icon: History,
    },
    {
      title: 'Templates',
      path: '/templates',
      icon: FileText as any,
    },
    {
      title: 'Layouts',
      path: '/layouts',
      icon: LayoutTemplate as any,
    },
    {
      title: 'Providers',
      path: `/providers`,
      icon: Building2 as any,
    },
  ]

  return (
    <Layout.Main menuItems={menuItems} collapseSidebar={shouldCollapseSidebar}>
      <Layout.Header
        actionLogout={() => navigate('/logout')}
        actionProfile={() => {}}
        defaultLogo="/images/logo.png"
        defaultAvatar=""
        onSetTheme={(theme) => onSetTheme(theme)}
        selectedTheme={requestInfo.userPrefs.theme || 'system'}
        title={SITE_CONFIG.siteTitle}
      />
      <Outlet />
    </Layout.Main>
  )
}
