import { User } from '../api/user'

export function isAvailableForAdmin(userRole: User['role']) {
  return userRole === 'ADMIN'
}
