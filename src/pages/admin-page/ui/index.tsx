import { AdminSideBar } from '@/widgets/admin-sidebar'
import { Outlet } from '@tanstack/react-router'

import styles from './styles.module.css'

export function AdminPage() {
  return (
    <div className={styles['admin-layout']}>
      <AdminSideBar />

      <div className={styles['admin-page-content']}>
        <Outlet />
      </div>
    </div>
  )
}
