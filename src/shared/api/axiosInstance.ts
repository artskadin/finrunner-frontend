import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/entities/user/model/authStore'
import { AuthorizeResponse } from './v1/auth'

const API_URL =
  import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3000/api'

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: unknown) => void
  reject: (reason?: any) => void
}> = []

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach((promise) => {
    error ? promise.reject(error) : promise.resolve(token)
  })

  failedQueue = []
}

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const publicPaths = [
      '/auth/otp',
      '/auth/authorize',
      '/auth/refresh',
      '/ping'
    ]

    if (
      config.url &&
      publicPaths.some((path) => config.url?.startsWith(path))
    ) {
      return config
    }

    const accessToken = useAuthStore.getState().accessToken

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config
    const authActions = useAuthStore.getState().actions

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.endsWith('/auth/refresh') &&
      !originalRequest.url?.endsWith('/auth/authorize')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`
            }

            return axiosInstance(originalRequest)
          })
          .catch(Promise.reject)
      }

      isRefreshing = true
      originalRequest._retry = true

      try {
        const { data: refreshData } =
          await axiosInstance.get<AuthorizeResponse>('/v1/auth/refresh')
        const newAccessToken = refreshData.accessToken

        if (!newAccessToken) {
          throw new Error('Refresh endpoint did not return an access token')
        }

        authActions.setAuthState({ accessToken: newAccessToken })

        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
        }

        processQueue(null, newAccessToken)

        if (originalRequest._retry) {
          delete originalRequest._retry
        }

        return axiosInstance(originalRequest)
      } catch (refreshOrUserError) {
        const axiosError = refreshOrUserError as AxiosError

        if (!axiosError.config?._retry) {
          authActions.logout({ redirect: true })
        } else {
          console.error('Token refresh failed even after retry. Aborting')
        }

        processQueue(axiosError, null)

        return Promise.reject(axiosError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)
