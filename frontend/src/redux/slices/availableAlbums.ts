import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AlbumResponse } from '../types'

interface AvailableAlbumsState {
  albums: AlbumResponse[]
  loading: boolean
  error: string | null
}

const initialState: AvailableAlbumsState = {
  albums: [],
  loading: false,
  error: null,
}

const availableAlbumsSlice = createSlice({
  name: 'availableAlbums',
  initialState,
  reducers: {
    fetchAvailableAlbumsStart(state) {
      state.loading = true
      state.error = null
    },
    fetchAvailableAlbumsSuccess(state, action: PayloadAction<AlbumResponse[]>) {
      state.albums = action.payload
      state.loading = false
      state.error = null
    },
    fetchAvailableAlbumsFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    logOutAvailable(state) {
      state.albums = []
      state.loading = false
      state.error = null
    },
  },
})

export const {
  fetchAvailableAlbumsStart,
  fetchAvailableAlbumsSuccess,
  fetchAvailableAlbumsFailure,
} = availableAlbumsSlice.actions

export const availableAlbumsSliceReducer = availableAlbumsSlice.reducer
export const { logOutAvailable } = availableAlbumsSlice.actions
