import { useAuthStore } from '@/entities/user/model/authStore'

export function ProfilePage() {
  const user = useAuthStore((state) => state.user)

  if (!user) {
    return <div>loading user .......</div>
  }

  return <div>PROFILE</div>
}
