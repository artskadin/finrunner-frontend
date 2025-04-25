import { axiosInstance } from '../axiosInstance'
import { components, paths } from '../generated/schema'

export type CryptoAsset = components['schemas']['cryptoAssetSchema']

// Заглушка
export type FiatAsset = {
  id: string
  currencyId: string
  fiatProviderId: string
  createdAt: string
  currency?: components['schemas']['currencySchema']
  fiatProvider?: {
    id: string
    type: string
    name: string
    createdAt: string
  }
}

export type CreateCryptoAssetPayload =
  paths['/api/v1/crypto-assets/']['post']['requestBody']['content']['application/json']
export type CreateCryptoAssetSuccessResponse =
  paths['/api/v1/crypto-assets/']['post']['responses']['201']['content']['application/json']
export type CreateCryptoAssetErrorResponse =
  paths['/api/v1/crypto-assets/']['post']['responses'][
    | '400'
    | '401'
    | '404'
    | '500']['content']['application/json']

export type UpdateCryptoAssetParams =
  paths['/api/v1/crypto-assets/{id}']['patch']['parameters']['path']
export type UpdateCryptoAssetBody =
  components['schemas']['updateCryptoAssetBodySchema']
export type UpdateCryptoAssetSuccessResponse =
  paths['/api/v1/crypto-assets/{id}']['patch']['responses']['200']['content']['application/json']
export type UpdateCryptoAssetErrorResponse =
  paths['/api/v1/crypto-assets/{id}']['patch']['responses'][
    | '400'
    | '401'
    | '404'
    | '500']['content']['application/json']

export type DeleteCryptoAssetPayload =
  paths['/api/v1/crypto-assets/{id}']['delete']['parameters']['path']
export type DeleteCryptoAssetSuccessResponse =
  paths['/api/v1/crypto-assets/{id}']['delete']['responses']['200']['content']['application/json']

export const getCryptoAssetsApi = async (): Promise<Array<CryptoAsset>> => {
  const response =
    await axiosInstance.get<Array<CryptoAsset>>('/v1/crypto-assets')

  return response.data
}

export const createCryptoAssetApi = async (
  payload: CreateCryptoAssetPayload
): Promise<CreateCryptoAssetSuccessResponse> => {
  const response = await axiosInstance.post<CreateCryptoAssetSuccessResponse>(
    '/v1/crypto-assets',
    payload
  )

  return response.data
}

// Пришел к тому, что скорее не нужно давать изменять по БЛ
// export const updateCryptoAssetApi = async ({
//   params,
//   body
// }: {
//   params: UpdateCryptoAssetParams
//   body: UpdateCryptoAssetBody
// }): Promise<UpdateCryptoAssetSuccessResponse> => {
//   const response = await axiosInstance.patch<UpdateCryptoAssetSuccessResponse>(
//     `/v1/crypto-assets/${params.id}`,
//     body
//   )

//   return response.data
// }

export const deleteCryptoAssetApi = async (
  payload: DeleteCryptoAssetPayload
): Promise<DeleteCryptoAssetSuccessResponse> => {
  const response = await axiosInstance.delete<DeleteCryptoAssetSuccessResponse>(
    `/v1/crypto-assets/${payload.id}`
  )

  return response.data
}
