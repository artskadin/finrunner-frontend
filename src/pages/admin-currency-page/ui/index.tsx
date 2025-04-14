import { Route as CurrencyRoute } from '@/routes/admin/currencies'
import { Route as AdminRoute } from '@/routes/admin/route'
import { AdminCurrencyWidget } from '@/widgets/admin-currencies-list'

import styles from './styles.module.css'

export function CurrencyPage() {
  const currencyRouteData = CurrencyRoute.useLoaderData()
  const adminRouteData = AdminRoute.useLoaderData()

  if (!currencyRouteData || !adminRouteData) {
    return null
  }

  const { currencies } = currencyRouteData
  const { user } = adminRouteData

  if (!currencies || !user) {
    return null
  }

  return (
    <div>
      <AdminCurrencyWidget />
    </div>
  )
}
