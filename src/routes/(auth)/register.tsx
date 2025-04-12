import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/register')({
  loader: () => {
    throw redirect({ to: '/login', replace: true })
  }
})
