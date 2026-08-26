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
    html: string
  }
  created_at: string
  updated_at: string
  tags: string[]
}

export interface CreateTemplatePayload {
  alias: string
  name: string
  subject: string
  html: string
  from_email?: string
  reply_to?: string
  layout_id?: string
  tags?: string[]
}

export interface UpdateTemplatePayload {
  alias?: string
  name?: string
  subject?: string
  html?: string
  from_email?: string | null
  reply_to?: string | null
  layout_id?: string | null
  tags?: string[]
}

export type CloneTemplatePayload = {
  name: string
  tags: string[]
  alias: string
}
