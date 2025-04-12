import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { User } from '@/shared/api/user'
import { AuthorizeResponse } from '@/shared/api/auth'

interface AuthState {
  accessToken: string | null
  user: User | null
  isLoading: boolean
}

interface AuthActions {
  actions: {
    setAuthState: (
      data: Partial<Pick<AuthState, 'accessToken' | 'user'>>
    ) => void
    logout: (options?: { redirect?: boolean }) => void
    initializeAuth: () => Promise<void>
  }
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    immer((set, get) => ({
      accessToken: null,
      user: null,
      isLoading: true,

      actions: {
        setAuthState: (data) => {
          set((state) => {
            if (data.accessToken !== undefined) {
              state.accessToken = data.accessToken
            }

            if (data.user !== undefined) {
              state.user = data.user
            }
          })
        },
        logout: async (options = { redirect: true }) => {
          set({ accessToken: null, user: null, isLoading: false })

          import('@/shared/api/auth').then(({ logoutApi }) => logoutApi())
        },
        initializeAuth: async () => {
          if (!get().isLoading) {
            set({ isLoading: true })
          }

          try {
            const { axiosInstance } = await import('@/shared/api/axiosInstance')

            const { data: refreshData } =
              await axiosInstance.get<AuthorizeResponse>('/v1/auth/refresh')
            const newAccessToken = refreshData.accessToken

            if (!newAccessToken) {
              throw new Error('Refresh failed: no token')
            }

            set({ accessToken: newAccessToken })
          } catch (err: any) {
            if (err?.response?.status !== 401) {
              // console.error(
              //   'initializeAuth: Refresh failed with unexpected error.',
              //   err
              // )
            } else {
              // console.log(
              //   'initializeAuth: Refresh returned 401 (User not logged in or expired refresh token).'
              // )
            }

            set({ accessToken: null, user: null })
          } finally {
            set({ isLoading: false })
          }
        }
      }
    })),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user
      })
    }
  )
)

export const useIsAuthenticated = () =>
  useAuthStore((state) => !!state.accessToken)
