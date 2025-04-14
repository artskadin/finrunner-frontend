import { createFileRoute, redirect } from '@tanstack/react-router'
import { AdminPage } from '@/pages/admin-page'
import { useAuthStore } from '@/entities/user/model/authStore'
import { queryClient } from '@/app/main'
import { getMeApi, User } from '@/shared/api/user'

export const Route = createFileRoute('/admin')({
  component: AdminPage,
  beforeLoad: ({ location }) => {
    const { accessToken, isLoading } = useAuthStore.getState()
    const isAuthenticated = !!accessToken

    if (isLoading) {
      return
    }

    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href }
      })
    }
  },
  loader: async () => {
    try {
      const user = await queryClient.fetchQuery<User | null, Error>({
        queryKey: ['users', 'me'],
        queryFn: getMeApi,
        staleTime: 1 * 60 * 1000
      })

      const userFromStore = useAuthStore.getState().user

      if (JSON.stringify(userFromStore) !== JSON.stringify(user)) {
        useAuthStore.getState().actions.setAuthState({ user: user })
      }

      if (user?.role && !['ADMIN', 'OPERATOR'].includes(user.role)) {
        throw redirect({
          to: '/exchange',
          replace: true
        })
      }

      return { user }
    } catch (err) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href }
      })
    }
  }
})
