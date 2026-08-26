import { fetchApi } from '@/libraries/fetch'
import { IPaging } from '@/resources/types'
import { IQueryConfig, IQueryParams } from '..'
import {
  TemplateType,
  CreateTemplatePayload,
  UpdateTemplatePayload,
  CloneTemplatePayload,
} from './template.type'

const TEMPLATES_ENDPOINT = '/templates'

export async function getTemplates(
  config: IQueryConfig,
  params: IQueryParams
): Promise<IPaging<TemplateType>> {
  const { apiUrl, token, nodeEnv } = config
  const { page, size, tag } = params

  const tagSearch = new URLSearchParams()
  tag?.forEach((t) => tagSearch.append('tag', t))
  const query = tagSearch.toString()

  const response = await fetchApi(
    `${apiUrl}${TEMPLATES_ENDPOINT}${query ? `?${query}` : ''}`,
    token,
    nodeEnv,
    {
      method: 'GET',
      pagination: { page, size },
    }
  )

  return response as IPaging<TemplateType>
}

export async function getTemplate(config: IQueryConfig, id: string): Promise<TemplateType> {
  const { apiUrl, token, nodeEnv } = config

  const response = await fetchApi(`${apiUrl}${TEMPLATES_ENDPOINT}/${id}`, token, nodeEnv, {
    method: 'GET',
  })

  return response as TemplateType
}

export async function createTemplate(
  config: IQueryConfig,
  data: CreateTemplatePayload
): Promise<TemplateType> {
  const { apiUrl, token, nodeEnv } = config

  const response = await fetchApi(`${apiUrl}${TEMPLATES_ENDPOINT}`, token, nodeEnv, {
    method: 'POST',
    body: JSON.stringify(data),
  })

  return response as TemplateType
}

export async function updateTemplate(
  config: IQueryConfig,
  id: string,
  data: UpdateTemplatePayload
): Promise<TemplateType> {
  const { apiUrl, token, nodeEnv } = config

  const response = await fetchApi(`${apiUrl}${TEMPLATES_ENDPOINT}/${id}`, token, nodeEnv, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })

  return response as TemplateType
}

export async function deleteTemplate(config: IQueryConfig, id: string): Promise<void> {
  const { apiUrl, token, nodeEnv } = config

  await fetchApi(`${apiUrl}${TEMPLATES_ENDPOINT}/${id}`, token, nodeEnv, {
    method: 'DELETE',
  })
}

export async function cloneTemplate(
  config: IQueryConfig,
  id: string,
  data: CloneTemplatePayload
): Promise<TemplateType> {
  const { apiUrl, token, nodeEnv } = config

  const response = await fetchApi(`${apiUrl}${TEMPLATES_ENDPOINT}/${id}/clone`, token, nodeEnv, {
    method: 'POST',
    body: JSON.stringify(data),
  })

  return response as TemplateType
}

export async function getTagTemplate(config: IQueryConfig): Promise<string[]> {
  const { apiUrl, token, nodeEnv } = config

  const response = await fetchApi(`${apiUrl}${TEMPLATES_ENDPOINT}/tags`, token, nodeEnv)

  return response as string[]
}
