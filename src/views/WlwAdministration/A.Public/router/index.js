/**
 *
 * @file 模块路由
 * @author author-name(李红波 15537053107)
 */

/* Layout */
// import Layout from '@/views/WlwAdministration/layout'

import navList from '@/common/constants/navList'
import env from '@/common/config/env.js'

const context = require.context('@/views/WlwAdministration/A.Public/router/modules', false, /\.js$/)
let moduleStores = []
context.keys().forEach(key => {
  moduleStores = moduleStores.concat(context(key).default)
})
const WlwAdministration = {
  path: (navList[env.router_name.WLW_ADMINISTRATION] && navList[env.router_name.WLW_ADMINISTRATION].path) || '',
  component: () => import('@/components/layout'),
  // redirect: '/wlw/areaMaintain/unitInformation',
  children: [
    ...moduleStores
  ]
}

export default WlwAdministration
