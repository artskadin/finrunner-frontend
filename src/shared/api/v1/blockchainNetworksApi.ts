import { axiosInstance } from '../axiosInstance'
import { components, paths } from '../generated/schema'

export type BlockchainNetwork = components['schemas']['blockchainNetworkSchema']
export type AvailableBlockchainNetworks =
  components['schemas']['availableBlockchainNetworksSchema']

export type CreateBlockchainNetworkPayload =
  paths['/api/v1/blockchain-networks/']['post']['requestBody']['content']['application/json']
export type CreateBlockchainNetworkSuccessResposnse =
  paths['/api/v1/blockchain-networks/']['post']['responses']['201']['content']['application/json']
export type CreateBlockchainNetworkErrorResposnse =
  paths['/api/v1/blockchain-networks/']['post']['responses'][
    | '400'
    | '401'
    | '404'
    | '500']['content']['application/json']

export type UpdateBlockchainNetworkParams =
  paths['/api/v1/blockchain-networks/{id}']['patch']['parameters']['path']
export type UpdateBlockchainNetworkBody =
  components['schemas']['updateBlockchainNetworkBodySchema']
export type UpdateBlockchainNetworkSuccessResposnse =
  paths['/api/v1/blockchain-networks/{id}']['patch']['responses']['200']['content']['application/json']
export type UpdateBlockchainNetworkErrorResponse =
  paths['/api/v1/blockchain-networks/{id}']['patch']['responses'][
    | '400'
    | '401'
    | '404'
    | '500']['content']['application/json']

export type DeleteBlockchainNetworkParams =
  paths['/api/v1/blockchain-networks/{id}']['delete']['parameters']['path']
export type DeleteBlockchainNetworkSuccessResponse =
  paths['/api/v1/blockchain-networks/{id}']['delete']['responses']['200']['content']['application/json']

export const getBlockchainNetworksApi = async (): Promise<
  Array<BlockchainNetwork>
> => {
  const response = await axiosInstance.get<Array<BlockchainNetwork>>(
    '/v1/blockchain-networks'
  )

  return response.data
}

export const getAvailableBlockchainNetworksApi =
  async (): Promise<AvailableBlockchainNetworks> => {
    const response = await axiosInstance.get<AvailableBlockchainNetworks>(
      '/v1/blockchain-networks/available'
    )

    return response.data
  }

export const createBlockchainNetworkApi = async (
  payload: CreateBlockchainNetworkPayload
): Promise<BlockchainNetwork> => {
  const response = await axiosInstance.post<BlockchainNetwork>(
    '/v1/blockchain-networks',
    payload
  )

  return response.data
}

export const updateBlockchainNetworkApi = async ({
  params,
  body
}: {
  params: UpdateBlockchainNetworkParams
  body: UpdateBlockchainNetworkBody
}): Promise<UpdateBlockchainNetworkSuccessResposnse> => {
  const response =
    await axiosInstance.patch<UpdateBlockchainNetworkSuccessResposnse>(
      `/v1/blockchain-networks/${params.id}`,
      body
    )

  return response.data
}

export const deleteBlockchainNetworkApi = async (
  payload: DeleteBlockchainNetworkParams
): Promise<DeleteBlockchainNetworkSuccessResponse> => {
  const response =
    await axiosInstance.delete<DeleteBlockchainNetworkSuccessResponse>(
      `/v1/blockchain-networks/${payload.id}`
    )

  return response.data
}
