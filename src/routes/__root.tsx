import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import type { RouterContext } from '@/app/router'
import { AppLayout } from '@/app/app-layout/AppLayout'
import { useAuthStore } from '@/entities/user/model/authStore'

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  loader: async () => {
    const { isLoading } = useAuthStore.getState()

    if (isLoading) {
      return
    }

    return null
  }
})

function RootComponent() {
  return (
    <AppLayout>
      <Outlet />
      <TanStackRouterDevtools initialIsOpen={false} />
    </AppLayout>
  )
}
