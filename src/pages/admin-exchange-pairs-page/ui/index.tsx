import { Route as AdminRoute } from '@/routes/admin/route'
import { AdminCurrencyWidget } from '@/widgets/admin-currencies-list'
import { AdminBlockchainNetworkWidget } from '@/widgets/admin-blockchain-networks-list'
import { AdminAssetsWidget } from '@/widgets/admin-assets-list'
import { AdminExchangePairsWidget } from '@/widgets/admin-exchange-pairs-list'

import styles from './styles.module.css'

export function ExchangePairsPage() {
  const adminRouteData = AdminRoute.useLoaderData()

  if (!adminRouteData) {
    return null
  }

  const { user } = adminRouteData

  if (!user) {
    return null
  }

  return (
    <div className={styles['admin-exchange-pairs-page_container']}>
      <AdminExchangePairsWidget />

      <AdminAssetsWidget />

      <AdminCurrencyWidget />

      <AdminBlockchainNetworkWidget />
    </div>
  )
}
