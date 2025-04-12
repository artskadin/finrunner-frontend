import { createFileRoute, redirect } from '@tanstack/react-router'
import { LoginPage } from '@/pages/login-page'
import { useAuthStore } from '@/entities/user/model/authStore'

export const Route = createFileRoute('/(auth)/login')({
  component: LoginPage,
  validateSearch: (
    search: Record<string, unknown>
  ): { redirect?: string; logged_out?: string } => {
    return {
      redirect: search.redirect as string | undefined,
      logged_out: search.logged_out as string | undefined
    }
  },
  beforeLoad: ({ search }) => {
    const { isLoading, accessToken } = useAuthStore.getState()
    const isAuthenticated = !!accessToken

    if (isLoading) {
      return
    }

    if (isAuthenticated) {
      const redirectTo =
        typeof search.redirect === 'string' ? search.redirect : '/exchange'

      throw redirect({
        to: redirectTo,
        replace: true
      })
    }
  }
})
