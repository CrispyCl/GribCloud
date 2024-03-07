import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AccountResponse } from '../types'

type AuthState = {
  token: string | null
  refreshToken: string | null
  account: AccountResponse | null
  avatar: string | undefined
}

const initialState: AuthState = {
  token: localStorage.getItem('token') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  account: null,
  avatar: undefined,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthTokens: (
      state,
      action: PayloadAction<{
        token: string | null
        refreshToken: string | null
      }>,
    ) => {
      state.refreshToken = action.payload.refreshToken
      state.token = action.payload.token
    },
    setAccount: (state, action: PayloadAction<AccountResponse>) => {
      state.account = action.payload
    },
    setAvatarUrl: (state, action: PayloadAction<{ avatar: string }>) => {
      state.avatar = action.payload.avatar
    },
    setLogout: state => {
      localStorage.clear()
      state.account = null
      state.refreshToken = null
      state.token = null
    },
  },
})

export const { actions, reducer } = authSlice
