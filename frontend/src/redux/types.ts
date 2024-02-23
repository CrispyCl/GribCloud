export interface AccountResponse {
  id: string
  email: string
  username: string
  created: Date
  img?: string

  access: string
  refresh: string
}
