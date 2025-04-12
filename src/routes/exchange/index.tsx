import { createFileRoute } from '@tanstack/react-router'
import { ExchangePage } from '@/pages/exchange-page'

export const Route = createFileRoute('/exchange/')({
  component: ExchangePage
})
