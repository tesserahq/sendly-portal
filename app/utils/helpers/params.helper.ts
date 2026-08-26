import { useLocation } from 'react-router'

export function getScopedParams(request: Request, scope: string = '') {
  const url = new URL(request.url)
  // if scope is not provided, return current searchParams
  return scope === ''
    ? url.searchParams
    : new URLSearchParams(
        Array.from(url.searchParams.entries())
          .filter(([key]) => key.startsWith(`${scope}:`))
          .map(([key, value]) => [key.replace(`${scope}:`, ''), value])
      )
}

type ParamsType = Record<string, string | number | boolean | string[] | undefined>
export function useScopedParams(scope: string = '') {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const prefix = scope ? `${scope}:` : ''
  const updateSearchParams = (params: ParamsType) => {
    Object.entries(params).forEach(([key, value]) => {
      const paramKey = `${prefix}${key}`
      searchParams.delete(paramKey)

      if (value === undefined) return

      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(paramKey, v))
      } else {
        searchParams.set(paramKey, String(value))
      }
    })
  }
  return {
    getParam: (key: string) => searchParams.get(`${prefix}${key}`),
    getScopedSearch: (params: ParamsType) => {
      updateSearchParams(params)
      let search = searchParams.toString()
      if (search) search = '?' + search
      return search
    },
  }
}
