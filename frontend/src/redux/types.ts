export interface AccountResponse {
  id: number
  email: string
  username: string
  created: Date
  access: string
  refresh: string
  avatar: string
}

export interface iFormSingUp {
  email: string
  username: string
  password: string
  passwordConfirm: string
}

export interface EditAccountResponse {
  email: string
  username: string
  oldPassword: string
  newPassword: string
  newPasswordConfirm: string
  avatar?: string
}

export interface UserResponse {
  id: number
  username: string
  email: string
  date_joined: string
}
