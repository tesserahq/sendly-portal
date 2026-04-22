import { AppPreloader } from '@/components/loader/pre-loader'
import { useApp } from '@/context/AppContext'
import { useRequestInfo } from '@/hooks/useRequestInfo'
import { ROUTE_PATH as THEME_PATH } from '@/routes/resources/update-theme'
import { SITE_CONFIG } from '@/utils/config/site.config'
import { Building2, History } from 'lucide-react'
import { Outlet, useLoaderData, useNavigate, useParams, useSubmit } from 'react-router'
import { Layout, MainItemProps, TesseraProvider } from 'tessera-ui'

export function loader() {
  const identiesApiUrl = process.env.IDENTIES_API_URL

  return {
    identiesApiUrl,
  }
}

export default function PrivateLayout() {
  const { identiesApiUrl } = useLoaderData<typeof loader>()

  const { isLoading, token } = useApp()
  const requestInfo = useRequestInfo()
  const submit = useSubmit()
  const params = useParams()
  const navigate = useNavigate()
  const shouldCollapseSidebar = Boolean(params.emailID)

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
      title: 'Providers',
      path: `/providers`,
      icon: Building2,
    },
    {
      title: 'Activity',
      path: '/activity',
      icon: History,
    },
  ]

  if (isLoading) {
    return <AppPreloader className="min-h-screen" />
  }

  return (
    <TesseraProvider identiesApiUrl={identiesApiUrl!} token={token || ''}>
      <Layout.Main menuItems={menuItems} collapseSidebar={shouldCollapseSidebar}>
        <Layout.Header
          actionLogout={() => navigate('/logout')}
          actionProfile={() => {}}
          onSetTheme={(theme) => onSetTheme(theme)}
          selectedTheme={requestInfo.userPrefs.theme || 'system'}
          defaultLogo="/images/logo.png"
          title={SITE_CONFIG.siteTitle}
        />
        <Outlet />
      </Layout.Main>
    </TesseraProvider>
  )
}
