import { fetchApi } from '@/libraries/fetch'
import { IPaging } from '@/resources/types'
import { IQueryConfig, IQueryParams } from '..'
import {
  BroadcastBatchType,
  BroadcastRecipientResultType,
  BroadcastStatusType,
} from './broadcast.type'

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

/**
 * Get paginated per-recipient results for a broadcast batch
 * @param batchID batch_id
 */
export async function getBroadcastRecipients(
  config: IQueryConfig,
  batchID: string,
  params: IQueryParams
): Promise<IPaging<BroadcastRecipientResultType>> {
  const { apiUrl, token, nodeEnv } = config
  const { page, size } = params

  const response = await fetchApi(
    `${apiUrl}${BROADCAST_ENDPOINT}/${batchID}/recipients`,
    token,
    nodeEnv,
    {
      method: 'GET',
      pagination: { page, size },
    }
  )

  return response as IPaging<BroadcastRecipientResultType>
}
