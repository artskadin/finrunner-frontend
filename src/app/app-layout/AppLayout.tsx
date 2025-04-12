import { PropsWithChildren } from 'react'
import { Header } from '@/widgets/header-widget'
import { useCurrentUserQuery } from '@/entities/user/hooks/useCurrentUserQuery'

import styles from './AppLayout.module.css'

export function AppLayout({ children }: PropsWithChildren) {
  useCurrentUserQuery()

  return (
    <div className={styles['root-content']}>
      <Header />

      <main className={styles['main-content']}>{children}</main>
    </div>
  )
}
