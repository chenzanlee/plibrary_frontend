/**
 *
 * @file 模块路由
 * @author author-name(李红波 15537053107)
 */

/* Layout */
// import Layout from '@/components/layout'

import navList from '@/common/constants/navList'
import env from '@/common/config/env.js'

const context = require.context('@/views/IntelligentControl/A.Public/router/modules', false, /\.js$/)
let moduleStores = []
context.keys().forEach(key => {
  moduleStores = moduleStores.concat(context(key).default)
})

const IntelligentControl = {
  // TODO:路由板块更改
  // path: navList[3].path,
  path: (navList[env.router_name.INTELLIGENT_CONTROL] && navList[env.router_name.INTELLIGENT_CONTROL].path) || '',
  component: () => import('@/components/layout'),
  // redirect: '/unit-evc/devicesDistributeChineseMap',
  children: [
    ...moduleStores
  ]
}

export default IntelligentControl
