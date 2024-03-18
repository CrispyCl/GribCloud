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

export interface UploadImage {
  name: string
  url: string
}

export interface UploadImageResponse {
  id: number
  author: number
  name: string
  file: string
  geodata: {
    city: string
    country: string
    latitude: number
    longitude: number
  }
  url: string
  created_at: Date
  preview: string
}

export interface GroupedImages {
  date: string
  images: UploadImageResponse[]
}

export interface AlbumsResponse {
  id: number
  name: string
  author: number
  created_at: Date
  images: UploadImageResponse[]
}

export interface AlbumResponse {
  author: AccountResponse
  created_at: Date
  files: UploadImageResponse[]
  id: number
  is_public: boolean
  memberships: AccountResponse[]
  title: string
}
