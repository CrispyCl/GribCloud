import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { combineReducers } from 'redux'
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { albumsReducer } from './slices/albums'
import { reducer } from './slices/auth'
import { availableAlbumsSliceReducer } from './slices/availableAlbums'
import { publicAlbumsSliceReducer } from './slices/publicAlbums'

const rootReducer = combineReducers({
  auth: reducer,
  albums: albumsReducer,
  publicAlbums: publicAlbumsSliceReducer,
  availableAlbums: availableAlbumsSliceReducer,
})

const persistedReducer = persistReducer(
  {
    key: 'root',
    version: 1,
    storage: storage,
  },
  rootReducer,
)

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)
export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch

export default store
