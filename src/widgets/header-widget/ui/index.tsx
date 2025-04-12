import { useRouter } from '@tanstack/react-router'
import { Link, Text, Tooltip } from '@gravity-ui/uikit'
import { LogoTelegram } from '@gravity-ui/icons'
import clsx from 'clsx'
import {
  useAuthStore,
  useIsAuthenticated
} from '@/entities/user/model/authStore'
import { CustomLink } from '@/shared/ui/CustomLink'

import styles from './styles.module.css'

export function Header() {
  const isAuthenticated = useIsAuthenticated()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.actions.logout)
  const router = useRouter()

  const isAdmin = user?.role === 'ADMIN'
  const isOperator = user?.role === 'OPERATOR'

  const handleLogout = () => {
    logout({ redirect: false })
    router.navigate({
      to: '/login',
      search: { logged_out: 'true' },
      replace: true
    })
  }

  return (
    <header className={styles['header-container']}>
      <div className={styles['header-content']}>
        <CustomLink
          to='/'
          view='primary'
          className={styles['logo-container']}
          activeOptions={{ exact: true }}
        >
          <Text variant='display-1'>Fin</Text>
          <Text variant='display-1'>Runner</Text>
        </CustomLink>

        <nav className={styles.navigation}>
          <CustomLink to='/exchange' view='primary'>
            Обмен
          </CustomLink>
          <CustomLink
            to='/rules'
            view='primary'
            activeProps={{ className: styles.navigation__active }}
          >
            Правила
          </CustomLink>
          <CustomLink
            to='/aml'
            view='primary'
            activeProps={{ className: styles.navigation__active }}
          >
            AML/KYC
          </CustomLink>
          <CustomLink
            to='/contacts'
            view='primary'
            activeProps={{ className: styles.navigation__active }}
          >
            Контакты
          </CustomLink>
          <CustomLink
            to='/blog'
            view='primary'
            activeProps={{ className: styles.navigation__active }}
          >
            Блог
          </CustomLink>
        </nav>

        <nav className={clsx(styles.navigation, styles['navigation-auth'])}>
          {isAuthenticated && (isAdmin || isOperator) && (
            <CustomLink
              to='/admin'
              view='primary'
              activeProps={{ className: styles.navigation__active }}
            >
              Админка
            </CustomLink>
          )}

          {isAuthenticated && (
            <>
              <CustomLink
                to='/profile'
                view='primary'
                activeProps={{ className: styles.navigation__active }}
              >
                Профиль
              </CustomLink>
              <Link href='' view='secondary' onClick={handleLogout}>
                Выйти
              </Link>
            </>
          )}

          {!isAuthenticated && (
            <>
              <CustomLink
                to='/login'
                view='primary'
                activeProps={{ className: styles.navigation__active }}
              >
                Войти
              </CustomLink>
              <Tooltip
                content={'Осуществляется через нашего телеграм бота'}
                openDelay={100}
              >
                <Link
                  href={import.meta.env.VITE_TG_BOT_REGISTER_LINK}
                  target='_blank'
                  view='primary'
                  className={styles['add-telegram-link']}
                >
                  <LogoTelegram /> Регистрация
                </Link>
              </Tooltip>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
