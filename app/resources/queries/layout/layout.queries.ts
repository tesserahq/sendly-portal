import { fetchApi } from '@/libraries/fetch'
import { IPaging } from '@/resources/types'
import { IQueryConfig, IQueryParams } from '..'
import { LayoutType, CreateLayoutPayload, UpdateLayoutPayload } from './layout.type'

const LAYOUTS_ENDPOINT = '/layouts'

export async function getLayouts(
  config: IQueryConfig,
  params: IQueryParams
): Promise<IPaging<LayoutType>> {
  const { apiUrl, token, nodeEnv } = config
  const { page, size } = params

  const response = await fetchApi(`${apiUrl}${LAYOUTS_ENDPOINT}`, token, nodeEnv, {
    method: 'GET',
    pagination: { page, size },
  })

  return response as IPaging<LayoutType>
}

export async function getLayout(config: IQueryConfig, id: string): Promise<LayoutType> {
  const { apiUrl, token, nodeEnv } = config

  const response = await fetchApi(`${apiUrl}${LAYOUTS_ENDPOINT}/${id}`, token, nodeEnv, {
    method: 'GET',
  })

  return response as LayoutType
}

export async function createLayout(
  config: IQueryConfig,
  data: CreateLayoutPayload
): Promise<LayoutType> {
  const { apiUrl, token, nodeEnv } = config

  const response = await fetchApi(`${apiUrl}${LAYOUTS_ENDPOINT}`, token, nodeEnv, {
    method: 'POST',
    body: JSON.stringify(data),
  })

  return response as LayoutType
}

export async function updateLayout(
  config: IQueryConfig,
  id: string,
  data: UpdateLayoutPayload
): Promise<LayoutType> {
  const { apiUrl, token, nodeEnv } = config

  const response = await fetchApi(`${apiUrl}${LAYOUTS_ENDPOINT}/${id}`, token, nodeEnv, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })

  return response as LayoutType
}

export async function deleteLayout(config: IQueryConfig, id: string): Promise<void> {
  const { apiUrl, token, nodeEnv } = config

  await fetchApi(`${apiUrl}${LAYOUTS_ENDPOINT}/${id}`, token, nodeEnv, {
    method: 'DELETE',
  })
}
