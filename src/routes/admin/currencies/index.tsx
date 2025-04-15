import { createFileRoute } from '@tanstack/react-router'
import { queryClient } from '@/app/main'
import { Currency, getCurrenciesApi } from '@/shared/api/v1/currency'
import { CurrencyPage } from '@/pages/admin-currency-page'
import {
  AvailableBlockchainNetworks,
  BlockchainNetwork,
  getAvailableBlockchainNetworksApi,
  getBlockchainNetworksApi
} from '@/shared/api/v1/blockchainNetworks'

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

      return { currencies, availableBlockchainNetworks, blockchainNetworks }
    } catch (err) {
      console.error(err)
    }
  }
})
