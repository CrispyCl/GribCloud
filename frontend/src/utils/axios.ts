import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  },
})

api.interceptors.response.use(
  response => {
    return response
  },
  async error => {
    const originalRequest = error.config

    // if (error.response) {
    //   const errorCode = error.response.status
    //   const errorMessage = error.response.data.message || 'Unknown error'
    //   console.error('Error details:')
    //   console.error(error)
    //   console.error('Error code:', errorCode)
    //   console.error('Error message:', errorMessage)
    //   console.error('Error detail', error.response.data.detail)
    // }

    if (error.response.status === 401 && !originalRequest._retry) {
      if (
        error.response.data.detail === 'Токен недействителен или просрочен' ||
        error.response.data.detail === 'Token is invalid or expired'
      ) {
        localStorage.clear()
        window.location.href = '/login'
      } else {
        originalRequest._retry = true

        const refresh = localStorage.getItem('refreshToken')

        try {
          const response = await api.post('/api/v1/token/refresh/', { refresh })
          const newAccessToken = response.data.access

          localStorage.setItem('token', newAccessToken)
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`

          return api(originalRequest)
        } catch (refreshError) {
          return Promise.reject(refreshError)
        }
      }
    }
    return Promise.reject(error)
  },
)

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error),
)

export default api
