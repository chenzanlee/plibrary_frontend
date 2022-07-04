/**
 *
 * @file 存放所有变量
 * @author author-name(李红波 15537053107)
 */

import { getToken } from '@/views/userManagement/common/auth/authStore'

const state = {
  user: '',
  bytes: '',
  token: getToken(),
  refreshToken: '',
  refreshExpires: ''
}

export default state
