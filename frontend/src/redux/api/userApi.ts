import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setUser } from '../slices/userSlice'
import { IUser } from './types'

const BASE_URL = '/localhost:3000/api/auth/' as string

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/users/`,
  }),
  tagTypes: ['User'],
  endpoints: builder => ({
    getMe: builder.query<IUser, null>({
      query() {
        return {
          url: 'me',
          credentials: 'include',
        }
      },
      transformResponse: (result: { data: { user: IUser } }) =>
        result.data.user,
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setUser(data))
        } catch (error) {}
      },
    }),
  }),
})
