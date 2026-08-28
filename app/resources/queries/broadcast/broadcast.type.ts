/*
Broadcast Type
*/

export interface BroadcastBatchType {
  batch_id: string
  project_id: string | null
  queued_count: number
  suppressed_count: number
  prepared_count: number
  finished: boolean
  delivered_count: number
  bounced_count: number
  complained_count: number
  opened_count: number
  clicked_count: number
  created_at: string
}

export interface BroadcastStatusType {
  batch_id: string
  queued_count: number
  suppressed_count: number
  prepared_count: number
  finished: boolean
  delivered_count: number
  bounced_count: number
  complained_count: number
  opened_count: number
  clicked_count: number
}

export interface BroadcastRecipientResultType {
  id: string
  client_reference_id: string | null
  email: string
  suppressed: boolean
  prepared: boolean
  email_id: string | null
  email_status: string | null
  opened_at: string | null
  clicked_at: string | null
}
