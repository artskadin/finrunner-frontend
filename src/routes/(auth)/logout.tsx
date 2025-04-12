import { useAuthStore } from '@/entities/user/model/authStore'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/logout')({
  beforeLoad: () => {
    const { logout } = useAuthStore.getState().actions

    logout({ redirect: false })

    throw redirect({
      to: '/login',
      search: { logged_out: 'true' },
      replace: true
    })
  },
  component: () => null
})
