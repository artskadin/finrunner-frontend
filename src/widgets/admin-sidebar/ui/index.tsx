import { Text } from '@gravity-ui/uikit'
import { CustomLink } from '@/shared/ui/CustomLink'

import styles from './styles.module.css'

export function AdminSideBar() {
  return (
    <div className={styles['sidebar-content']}>
      <div className={styles['sidebar-items']}>
        <CustomLink
          to={'/admin'}
          view='primary'
          activeProps={{ className: styles.navigation__active }}
          activeOptions={{ exact: true }}
        >
          <Text variant='body-2'>Главная</Text>
        </CustomLink>
        <CustomLink
          to={'/admin/dashboard'}
          view='primary'
          activeProps={{ className: styles.navigation__active }}
        >
          <Text variant='body-2'>Дашбоард</Text>
        </CustomLink>
        <CustomLink
          to={'/admin/currencies'}
          view='primary'
          activeProps={{ className: styles.navigation__active }}
        >
          <Text variant='body-2'>Валютные пары</Text>
        </CustomLink>
        <CustomLink
          to={'/admin/users'}
          view='primary'
          activeProps={{ className: styles.navigation__active }}
        >
          <Text variant='body-2'>Пользователи</Text>
        </CustomLink>
      </div>
    </div>
  )
}
