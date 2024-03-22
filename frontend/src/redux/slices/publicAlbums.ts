import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AlbumResponse } from '../types'

interface PublicAlbumsState {
  albums: AlbumResponse[]
  loading: boolean
  error: string | null
}

const initialState: PublicAlbumsState = {
  albums: [],
  loading: false,
  error: null,
}

const publicAlbumsSlice = createSlice({
  name: 'publicAlbums',
  initialState,
  reducers: {
    fetchPublicAlbumsStart(state) {
      state.loading = true
      state.error = null
    },
    fetchPublicAlbumsSuccess(state, action: PayloadAction<AlbumResponse[]>) {
      state.albums = action.payload
      state.loading = false
      state.error = null
    },
    fetchPublicAlbumsFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    logOutPublic(state) {
      state.albums = []
      state.loading = false
      state.error = null
    },
  },
})

export const {
  fetchPublicAlbumsStart,
  fetchPublicAlbumsSuccess,
  fetchPublicAlbumsFailure,
} = publicAlbumsSlice.actions

export const publicAlbumsSliceReducer = publicAlbumsSlice.reducer
export const { logOutPublic } = publicAlbumsSlice.actions
