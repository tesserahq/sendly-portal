export interface LayoutType {
  id: string
  alias: string
  name: string | null
  html: string
  created_at: string
  updated_at: string
}

export interface CreateLayoutPayload {
  alias: string
  name?: string
  html: string
}

export interface UpdateLayoutPayload {
  alias?: string
  name?: string
  html?: string
}
