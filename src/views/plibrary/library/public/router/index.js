/**
 *
 * @file 模块路由
 * @author author-name(li chenzan)
 */



import navList from '@/common/constants/navList'
import env from '@/common/config/env.js'

const context = require.context('@/views/plibrary/library/public/router/modules', false, /\.js$/)
let moduleStores = []
context.keys().forEach(key => {
  moduleStores = moduleStores.concat(context(key).default)
})

const plibrary = {
  path: '/library_home_page/:libraryId',
  component: () => import('@/views/plibrary/library/page/index'),
  children: [
    ...moduleStores
  ]
}

export default plibrary
