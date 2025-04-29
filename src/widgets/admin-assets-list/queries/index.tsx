import { useQuery } from '@tanstack/react-query'
import { getCryptoAssetsApi } from '@/shared/api/v1/cryptoAssetApi'

export function useCryptoAssetsQuery() {
  return useQuery({
    queryKey: ['admin', 'cryptoAssets', 'getAll'],
    queryFn: getCryptoAssetsApi
  })
}
