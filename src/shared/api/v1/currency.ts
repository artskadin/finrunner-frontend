import { axiosInstance } from '../axiosInstance'
import { components, paths } from '../generated/schema'

export type Currency = components['schemas']['currencySchema']

export type CreateCurrencyPayload =
  paths['/api/v1/currencies/']['post']['requestBody']['content']['application/json']
export type CreateCurrencySuccessResponse =
  paths['/api/v1/currencies/']['post']['responses']['201']['content']['application/json']
export type CreateCurrencyErrorResponse =
  paths['/api/v1/currencies/']['post']['responses'][
    | '400'
    | '401'
    | '404'
    | '500']['content']['application/json']

export type UpdateCurrencyParams =
  paths['/api/v1/currencies/{id}']['put']['parameters']['path']
export type UpdateCurrencyBody =
  paths['/api/v1/currencies/{id}']['put']['requestBody']['content']['application/json']
export type UpdateCurrencySuccessResponse =
  paths['/api/v1/currencies/{id}']['put']['responses']['200']['content']['application/json']
export type UpdateCurrencyErrorResponse =
  paths['/api/v1/currencies/{id}']['put']['responses'][
    | '400'
    | '401'
    | '404'
    | '500']['content']['application/json']

export type DeleteCurrencyParams =
  paths['/api/v1/currencies/{id}']['delete']['parameters']['path']
export type DeleteCurrencySuccessResponse =
  paths['/api/v1/currencies/{id}']['delete']['responses']['200']['content']['application/json']

export const getCurrenciesApi = async (): Promise<Array<Currency>> => {
  const response = await axiosInstance.get<Array<Currency>>('/v1/currencies')

  return response.data
}

export const createCurrencyApi = async (
  payload: CreateCurrencyPayload
): Promise<CreateCurrencySuccessResponse> => {
  const response = await axiosInstance.post<CreateCurrencySuccessResponse>(
    '/v1/currencies',
    payload
  )

  return response.data
}

export const updateCurrencyApi = async ({
  params,
  body
}: {
  params: UpdateCurrencyParams
  body: UpdateCurrencyBody
}): Promise<UpdateCurrencySuccessResponse> => {
  const response = await axiosInstance.put(`/v1/currencies/${params.id}`, body)

  return response.data
}

export const deleteCurrencyApi = async (
  payload: DeleteCurrencyParams
): Promise<DeleteCurrencySuccessResponse> => {
  const response = await axiosInstance.delete<DeleteCurrencySuccessResponse>(
    `/v1/currencies/${payload.id}`
  )

  return response.data
}
