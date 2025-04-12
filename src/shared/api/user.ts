import { AxiosRequestConfig } from 'axios'
import { axiosInstance } from './axiosInstance'
import { components } from './generated/schema'

export type User = components['schemas']['userSchema']

export const getMeApi = async (config?: AxiosRequestConfig): Promise<User> => {
  const response = await axiosInstance.get<User>('/v1/users/me', config)

  return response.data
}

export const getUserByIdApi = async (userId: string): Promise<User> => {
  const response = await axiosInstance.get<User>(`/v1/users/${userId}`)

  return response.data
}
