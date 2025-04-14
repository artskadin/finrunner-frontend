import { createFileRoute } from '@tanstack/react-router'
import { queryClient } from '@/app/main'
import { Currency, getCurrenciesApi } from '@/shared/api/currency'
import { CurrencyPage } from '@/pages/admin-currency-page'

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

      return { currencies }
    } catch (err) {
      console.error(err)
    }
  }
})
