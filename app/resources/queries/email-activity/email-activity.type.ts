/* 
Email Activity Type
*/

export type EmailStatusEnum = 'sent' | 'failed' | 'queued'

export interface EmailActivityType {
  from_email: string
  to_email: string
  subject: string
  body: string
  status: EmailStatusEnum
  provider: string
  provider_message_id: string
  project_id: string
  id: string
  sent_at: string
  error_message: string
  created_at: string
  updated_at: string
  events: EmailEvent[]
}

export interface EmailEvent {
  id: string
  emaild_id: string
  created_at: string
  updated_at: string
  event_type: string
  event_timestamp: string
  details: Record<string, string>
}
