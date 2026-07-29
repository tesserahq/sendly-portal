import { fetchApi } from '@/libraries/fetch'
import { IAssetDetail, IAssetInput, IAssetResponse } from './vaulta.type'
import { IQueryConfig } from '..'

export async function uploadAssets(
  config: IQueryConfig,
  body: IAssetInput
): Promise<IAssetResponse | null> {
  const { apiUrl, token } = config

  const payload = new FormData()
  if (body.name) payload.set('name', body.name)
  if (body.labels) payload.set('labels', body.labels)
  if (body.extract_data !== undefined) payload.set('extract_data', String(body.extract_data))
  if (body.summarize !== undefined) payload.set('summarize', String(body.summarize))
  if (body.expires_in !== undefined) payload.set('expires_in', String(body.expires_in))
  payload.set('file', body.file)

  const response = await fetch(`${apiUrl}/assets`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: payload,
  })

  if (!response.ok) return null

  const data: IAssetResponse = await response.json()

  return data
}

export async function deleteAsset(config: IQueryConfig, assetId: string): Promise<void> {
  const { apiUrl, token } = config

  await fetch(`${apiUrl}/assets/${assetId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function getAsset(config: IQueryConfig, assetId: string): Promise<IAssetDetail> {
  const { apiUrl, token, nodeEnv } = config

  const data = await fetchApi(`${apiUrl}/assets/${assetId}`, token, nodeEnv)

  return data as IAssetDetail
}
