import { createFileRoute } from '@tanstack/react-router'
import { queryClient } from '@/app/main'
import { Currency, getCurrenciesApi } from '@/shared/api/v1/currencyApi'
import { CurrencyPage } from '@/pages/admin-currency-page'
import {
  AvailableBlockchainNetworks,
  BlockchainNetwork,
  getAvailableBlockchainNetworksApi,
  getBlockchainNetworksApi
} from '@/shared/api/v1/blockchainNetworksApi'
import { CryptoAsset, getCryptoAssetsApi } from '@/shared/api/v1/cryptoAssetApi'

export const Route = createFileRoute('/admin/currencies/')({
  component: CurrencyPage,
  loader: async () => {
    try {
      const currencies = await queryClient.fetchQuery<
        Array<Currency> | null,
        Error
      >({
        queryKey: ['admin', 'currencies', 'getAll'],
        queryFn: getCurrenciesApi
      })

      const availableBlockchainNetworks = await queryClient.fetchQuery<
        AvailableBlockchainNetworks,
        Error
      >({
        queryKey: ['admin', 'blockchainNetworks', 'getAvailable'],
        queryFn: getAvailableBlockchainNetworksApi
      })

      const blockchainNetworks = await queryClient.fetchQuery<
        Array<BlockchainNetwork> | null,
        Error
      >({
        queryKey: ['admin', 'blockchainNetworks', 'getAll'],
        queryFn: getBlockchainNetworksApi
      })

      const cryptoAssets = await queryClient.fetchQuery<
        Array<CryptoAsset> | null,
        Error
      >({
        queryKey: ['admin', 'cryptoAssets', 'getAll'],
        queryFn: getCryptoAssetsApi
      })

      return {
        currencies,
        availableBlockchainNetworks,
        blockchainNetworks,
        cryptoAssets
      }
    } catch (err) {
      console.error(err)
    }
  }
})
