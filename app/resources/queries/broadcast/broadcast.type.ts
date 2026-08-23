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
}
