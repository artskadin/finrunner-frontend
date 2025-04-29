import { createFileRoute } from '@tanstack/react-router'
import { CurrencyPage } from '@/pages/admin-exchange-pairs-page'

export const Route = createFileRoute('/admin/exchange-pairs/')({
  component: CurrencyPage
})
