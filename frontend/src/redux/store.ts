// import { configureStore } from '@reduxjs/toolkit'
// import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
// import { authApi } from './api/authApi'
// import { userApi } from './api/userApi'
// import userReducer from './slices/userSlice'

// export const store = configureStore({
//   reducer: {
//     [authApi.reducerPath]: authApi.reducer,
//     [userApi.reducerPath]: userApi.reducer,
//     userState: userReducer,
//   },
//   devTools: true,
//   middleware: getDefaultMiddleware =>
//     getDefaultMiddleware({}).concat([authApi.middleware, userApi.middleware]),
// })

// export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch
// export const useAppDispatch = () => useDispatch<AppDispatch>()
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import authReducer from './slices/auth'
import messageReducer from './slices/message'

const reducer = {
  auth: authReducer,
  message: messageReducer,
}

const store = configureStore({
  reducer: reducer,
  devTools: true,
})

export default store

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
