export interface AccountResponse {
  user: {
    id: string
    email: string
    username: string
    created: Date
  }
  access: string
  refresh: string
}

export interface UserResponse {
  id: string
  email: string
  username: string
  created: Date
}
