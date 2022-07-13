/**
 *
 * @file 模块路由
 * @author author-name(li chenzan)
 */
const context = require.context('@/views/plibrary/library/public/router/modules', false, /\.js$/)
let moduleStores = []
context.keys().forEach(key => {
  moduleStores = moduleStores.concat(context(key).default)
})

const plibrary = {
  path: '/library_home_page',
  component: () => import('@/views/plibrary/library/page/index'),
  children: [
    ...moduleStores
  ]
}

export default plibrary
