
import { getToken, getExpires } from '@/views/userManagement/common/auth/authStore'

export function hasValidAccessToken() {
  if (getToken()) {
    const expires = getExpires()

    if (expires) {
      if (expires && parseInt(expires, 10) < new Date().getTime()) {
        return false
      }
      return true
    } else {
      return false
    }
  }
  return false
}
