import { fetchApi } from '@/libraries/fetch'
import { IPaging } from '@/resources/types'
import { IQueryConfig, IQueryParams } from '..'
import { ProviderType } from './provider.type'

const PROVIDERS_ENDPOINT = '/providers/'

export async function getProviders(
  config: IQueryConfig,
  params: IQueryParams
): Promise<IPaging<ProviderType>> {
  const { apiUrl, token, nodeEnv } = config
  const { page, size } = params

  const memberships = await fetchApi(`${apiUrl}${PROVIDERS_ENDPOINT}`, token, nodeEnv, {
    method: 'GET',
    pagination: { page, size },
  })

  return memberships as IPaging<ProviderType>
}
