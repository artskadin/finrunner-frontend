import { User } from '../api/user'

export function iaAvailableForAdmin(userRole: User['role']) {
  return userRole === 'ADMIN'
}
