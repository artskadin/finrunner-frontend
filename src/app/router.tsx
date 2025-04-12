import { createRouter } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/entities/user/model/authStore'
import { routeTree } from '@/routeTree.gen'
import { User } from '@/shared/api/user'
import { queryClient } from './main'
import { Loader } from '@gravity-ui/uikit'

import styles from './styles/router.module.css'

export interface RouterContext {
  queryClient: QueryClient
  auth: {
    isAuthenticated: boolean
    isLoading: boolean
    user: User | null
    logout: (options?: { redirect?: boolean }) => void
  }
}

export const router = createRouter({
  routeTree,
  context: {
    get queryClient() {
      return queryClient
    },
    get auth() {
      const { user, isLoading, accessToken } = useAuthStore.getState()
      const isAuthenticated = !!accessToken

      return {
        isAuthenticated,
        user,
        isLoading,
        logout: (options?: { redirect?: boolean }) =>
          useAuthStore.getState().actions.logout(options)
      }
    }
  },
  defaultPreload: 'intent',
  defaultPendingComponent: () => (
    <div className={styles['global-loader']}>
      <Loader size='l' /> Грузим приложение
    </div>
  ),
  defaultNotFoundComponent: () => <div>Страница не найдена (404)</div>
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
