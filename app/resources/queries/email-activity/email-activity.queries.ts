import { fetchApi } from '@/libraries/fetch'
import { IPaging } from '@/resources/types'
import { IQueryConfig, IQueryParams } from '..'
import { EmailActivityType } from './email-activity.type'

const EMAIL_ACTIVITY_ENDPOINT = '/emails'

/**
 * Get paginated email activity listing
 */
export async function getEmailActivityListing(
  config: IQueryConfig,
  params: IQueryParams
): Promise<IPaging<EmailActivityType>> {
  const { apiUrl, token, nodeEnv } = config
  const { page, size } = params

  const response = await fetchApi(`${apiUrl}${EMAIL_ACTIVITY_ENDPOINT}`, token, nodeEnv, {
    method: 'GET',
    pagination: { page, size },
  })

  return response as IPaging<EmailActivityType>
}

/**
 * Get email activity detail by email_id
 * @param emailID email_id
 */
export async function getEmailActivityDetail(
  config: IQueryConfig,
  emailID: string
): Promise<EmailActivityType> {
  const { apiUrl, token, nodeEnv } = config

  const response = await fetchApi(
    `${apiUrl}${EMAIL_ACTIVITY_ENDPOINT}/${emailID}`,
    token,
    nodeEnv,
    {
      method: 'GET',
    }
  )

  return response as EmailActivityType
}
