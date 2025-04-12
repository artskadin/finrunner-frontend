import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@gravity-ui/uikit'

import { Toaster } from '@/shared/ui/toaster.tsx'
import { useAuthStore } from '@/entities/user/model/authStore.ts'
import { router } from './router.tsx'

import './styles/global.css'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 2 * 60 * 1000
    }
  }
})

let appHasMounted = false

function mountApp() {
  if (appHasMounted) {
    return
  }

  appHasMounted = true
  const rootElement = document.getElementById('root')!

  if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)

    root.render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme='dark'>
            <RouterProvider router={router} />
            <Toaster isShown={false} />
          </ThemeProvider>
        </QueryClientProvider>
      </StrictMode>
    )
  }
}

useAuthStore
  .getState()
  .actions.initializeAuth()
  .finally(() => {
    mountApp()
  })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
