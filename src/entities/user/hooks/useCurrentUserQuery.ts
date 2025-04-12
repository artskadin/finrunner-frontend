import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useAuthStore, useIsAuthenticated } from '../model/authStore'
import { getMeApi, User } from '@/shared/api/user'
import { AxiosError } from 'axios'

export const useCurrentUserQuery = () => {
  const isAuthenticated = useIsAuthenticated()
  const isLoadingAuth = useAuthStore((state) => state.isLoading)

  const userFromStore = useAuthStore((state) => state.user)
  const setAuthState = useAuthStore((state) => state.actions.setAuthState)
  const logout = useAuthStore((state) => state.actions.logout)

  const queryResult = useQuery<User, Error>({
    queryKey: ['users', 'me'],
    queryFn: getMeApi,
    enabled: !isLoadingAuth && isAuthenticated,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true
  })

  useEffect(() => {
    if (queryResult.isSuccess && queryResult.data) {
      if (JSON.stringify(userFromStore) !== JSON.stringify(queryResult.data)) {
        setAuthState({ user: queryResult.data })
      }
    }
  }, [queryResult.isSuccess, queryResult.data, userFromStore, setAuthState])

  useEffect(() => {
    if (queryResult.isError && isAuthenticated) {
      const status = (queryResult.error as AxiosError)?.response?.status

      if (status === 401 || status === 403) {
        logout({ redirect: true })
      }
    }
  }, [queryResult.isError, queryResult.error, isAuthenticated, logout])

  return {
    user: userFromStore,
    isLoadingUser:
      isLoadingAuth ||
      (isAuthenticated &&
        queryResult.isLoading &&
        queryResult.fetchStatus !== 'idle'),
    isError: queryResult.isError,
    error: queryResult.error,
    refetch: queryResult.refetch
  }
}
