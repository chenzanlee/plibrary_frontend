/**
 *
 * @file nav 导航
 * @author author-name(李红波 15537053107)
 */
import env from '@/common/config/env.js'

const nav_list = {}
if (process.env.NODE_ENV === 'production') {
  // 正式
  nav_list[env.router_name.DATA_CENTER] = { name: '数据视窗', path: '/dashboard', appCode: 'dashboard' }
  nav_list[env.router_name.INTELLIGENT_CONTROL] = { name: '智能环控', path: '/unit-evc', appCode: 'unit-evc' }
  nav_list[env.router_name.WLW_ADMINISTRATION] = { name: '设备管理', path: '/wlw', appCode: 'wlw' }
} else if (process.env.VUE_APP_ONLY_PACK_APP_NAME === 'feed-scheduling') {
  // nav_list[env.router_name.DATA_CENTER] = { name: '数据视窗', path: '/dashboard', appCode: 'dashboard' }
  nav_list[env.router_name.INTELLIGENT_FEED] = { name: '智能饲喂', path: '/feed-scheduling', appCode: 'feed-scheduling' }
} else {
  // dev
  // 正式
  nav_list[env.router_name.DATA_CENTER] = { name: '数据视窗', path: '/dashboard', appCode: 'dashboard' }
  nav_list[env.router_name.INTELLIGENT_CONTROL] = { name: '智能环控', path: '/unit-evc', appCode: 'unit-evc' }
  nav_list[env.router_name.WLW_ADMINISTRATION] = { name: '设备管理', path: '/wlw', appCode: 'wlw' }
}

const navList = {
  ...nav_list
}
export default navList
