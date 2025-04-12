import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/entities/user/model/authStore'
import { ProfilePage } from '@/pages/profile-page'

export const Route = createFileRoute('/profile/')({
  component: ProfilePage,
  beforeLoad: ({ location }) => {
    const { isLoading, accessToken } = useAuthStore.getState()
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
  }
})
