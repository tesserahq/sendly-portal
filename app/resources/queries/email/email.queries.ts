import { fetchApi } from '@/libraries/fetch'
import { IQueryConfig } from '..'
import { SendEmailPayload, SendEmailResponse } from './email.type'

const EMAILS_ENDPOINT = '/emails'

export async function sendEmail(
  config: IQueryConfig,
  data: SendEmailPayload
): Promise<SendEmailResponse> {
  const { apiUrl, token, nodeEnv } = config

  const response = await fetchApi(`${apiUrl}${EMAILS_ENDPOINT}`, token, nodeEnv, {
    method: 'POST',
    body: JSON.stringify(data),
  })

  return response as SendEmailResponse
}
