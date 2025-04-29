import { axiosInstance } from '../axiosInstance'
import { components, paths } from '../generated/schema'

export type ExchangePair = components['schemas']['exchangePairSchema']

export type CreateExchangePairPayload =
  components['schemas']['createExchangePairSchema']
export type CreateExchangePairSuccessResponse =
  paths['/api/v1/exchange-pairs/']['post']['responses']['201']['content']['application/json']
export type CreateExchangePairErrorResponse =
  paths['/api/v1/exchange-pairs/']['post']['responses'][
    | '400'
    | '401'
    | '404'
    | '500']['content']['application/json']

export type UpdateExchangePairParams =
  paths['/api/v1/exchange-pairs/{id}']['patch']['parameters']['path']
export type UpdateExchangePairBody =
  components['schemas']['updateExchangePairBodySchema']
export type UpdateExchangeSuccessResponse =
  paths['/api/v1/exchange-pairs/{id}']['patch']['responses']['200']['content']['application/json']
export type UpdateExchangeErrorResponse =
  paths['/api/v1/exchange-pairs/{id}']['patch']['responses'][
    | '400'
    | '401'
    | '404'
    | '500']['content']['application/json']

export type ArchiveExchangePairPayload =
  paths['/api/v1/exchange-pairs/{id}']['delete']['parameters']['path']
export type ArchiveExchangePairSuccessResponse =
  paths['/api/v1/exchange-pairs/{id}']['delete']['responses']['200']['content']['application/json']

export const getExchangePairsApi = async (): Promise<Array<ExchangePair>> => {
  const response =
    await axiosInstance.get<Array<ExchangePair>>('/v1/exchange-pairs')

  return response.data
}

export const createExchangePairApi = async (
  payload: CreateExchangePairPayload
): Promise<CreateExchangePairSuccessResponse> => {
  const resposne = await axiosInstance.post<CreateExchangePairSuccessResponse>(
    '/v1/exchange-pairs',
    payload
  )

  return resposne.data
}

export const updateExchangePairApi = async ({
  params,
  body
}: {
  params: UpdateExchangePairParams
  body: UpdateExchangePairBody
}): Promise<UpdateExchangeSuccessResponse> => {
  const response = await axiosInstance.patch<UpdateExchangeSuccessResponse>(
    `/v1/exchange-pairs/${params.id}`,
    body
  )

  return response.data
}

export const archiveExchangePairApi = async (
  payload: ArchiveExchangePairPayload
): Promise<ArchiveExchangePairSuccessResponse> => {
  const response =
    await axiosInstance.delete<ArchiveExchangePairSuccessResponse>(
      `/v1/exchange-pairs/${payload.id}`
    )

  return response.data
}
