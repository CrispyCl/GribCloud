export interface AccountResponse {
  id: string
  email: string
  username: string
  created: Date
  access: string
  refresh: string
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
