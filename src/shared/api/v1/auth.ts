import { axiosInstance } from '../axiosInstance'
import type { paths } from '../generated/schema'

export type RequestOtpPayload =
  paths['/api/v1/auth/otp']['post']['requestBody']['content']['application/json']
export type AuthorizePayload =
  paths['/api/v1/auth/authorize']['post']['requestBody']['content']['application/json']
export type AuthorizeResponse =
  paths['/api/v1/auth/authorize']['post']['responses']['200']['content']['application/json']

export const requestOtpApi = async (
  payload: RequestOtpPayload
): Promise<void> => {
  await axiosInstance.post('/v1/auth/otp', payload)
}

export const authorizeApi = async (
  payload: AuthorizePayload
): Promise<AuthorizeResponse> => {
  const response = await axiosInstance.post<AuthorizeResponse>(
    '/v1/auth/authorize',
    payload
  )

  return response.data
}

export const refreshApi = async (): Promise<AuthorizeResponse> => {
  const response =
    await axiosInstance.get<AuthorizeResponse>('/v1/auth/refresh')

  return response.data
}

export const logoutApi = async (): Promise<void> => {
  await axiosInstance.post('/v1/auth/logout')
}
