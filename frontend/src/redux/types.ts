export interface AccountResponse {
  id: string
  email: string
  username: string
  created: Date
  img?: string
  access: string
  refresh: string
}

export interface iFormSingUp {
  email: string
  username: string
  password: string
  passwordConfirm: string
}

export interface EditAccountResponse extends iFormSingUp {
  img?: string
  oldPassword: string
}
