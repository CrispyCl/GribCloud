import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AlbumResponse } from '../types'

interface AlbumsState {
  albums: AlbumResponse[]
  loading: boolean
  error: string | null
}

const initialState: AlbumsState = {
  albums: [],
  loading: false,
  error: null,
}

const albumsSlice = createSlice({
  name: 'albums',
  initialState,
  reducers: {
    fetchAlbumsStart(state) {
      state.loading = true
      state.error = null
    },
    fetchAlbumsSuccess(state, action: PayloadAction<AlbumResponse[]>) {
      state.albums = action.payload
      state.loading = false
      state.error = null
    },
    fetchAlbumsFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    logOut(state) {
      state.albums = []
      state.loading = false
      state.error = null
    },
  },
})

export const { fetchAlbumsStart, fetchAlbumsSuccess, fetchAlbumsFailure } =
  albumsSlice.actions
export const albumsReducer = albumsSlice.reducer
export const { logOut } = albumsSlice.actions
