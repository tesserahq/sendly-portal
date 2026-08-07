import { fetchApi } from '@/libraries/fetch'
import { IPaging } from '@/resources/types'
import { IQueryConfig, IQueryParams } from '..'
import { BroadcastBatchType, BroadcastStatusType } from './broadcast.type'

const BROADCAST_ENDPOINT = '/broadcasts'

/**
 * Get paginated broadcast batch listing
 */
export async function getBroadcastListing(
  config: IQueryConfig,
  params: IQueryParams
): Promise<IPaging<BroadcastBatchType>> {
  const { apiUrl, token, nodeEnv } = config
  const { page, size } = params

  const response = await fetchApi(`${apiUrl}${BROADCAST_ENDPOINT}`, token, nodeEnv, {
    method: 'GET',
    pagination: { page, size },
  })

  return response as IPaging<BroadcastBatchType>
}

/**
 * Get broadcast batch status/progress by batch_id
 * @param batchID batch_id
 */
export async function getBroadcastDetail(
  config: IQueryConfig,
  batchID: string
): Promise<BroadcastStatusType> {
  const { apiUrl, token, nodeEnv } = config

  const response = await fetchApi(`${apiUrl}${BROADCAST_ENDPOINT}/${batchID}`, token, nodeEnv, {
    method: 'GET',
  })

  return response as BroadcastStatusType
}
