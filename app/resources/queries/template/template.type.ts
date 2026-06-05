export interface TemplateType {
  id: string
  alias: string
  name: string
  subject: string
  html: string
  from_email: string | null
  reply_to: string | null
  layout_id: string | null
  layout?: {
    id: string
    alias: string
    name: string | null
  }
  created_at: string
  updated_at: string
}

export interface CreateTemplatePayload {
  alias: string
  name: string
  subject: string
  html: string
  from_email?: string
  reply_to?: string
  layout_id?: string
}

export interface UpdateTemplatePayload {
  alias?: string
  name?: string
  subject?: string
  html?: string
  from_email?: string | null
  reply_to?: string | null
  layout_id?: string | null
}
