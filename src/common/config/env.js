/**
 *
 * @file 项目环境判断
 * @author author-name(李红波 15537053107)
 */

// 路由命名
const ROUTER_NAME = {
  // 数据中心
  DATA_CENTER: 'data_center',
  // 首页
  PLATFORM_OVERVIEW: 'platform-overview',
  // 智能环控
  INTELLIGENT_CONTROL: 'unit-evc',
  // 智能物联
  WLW_ADMINISTRATION: 'wlw'
}

let BASE_URL = ''
let BURY_URL = ''
// eslint-disable-next-line no-unused-vars
let ZUTAI_BASE_URl = location.origin
if (process.env.NODE_ENV === 'development') {
  BASE_URL = 'dev' // dev环境接口
  BURY_URL = '' // dev环境埋点接口
  ZUTAI_BASE_URl = location.origin // 'https://iot-test.imuyuan.com'
} else {
  BASE_URL = 'pord' // 正式生产环境
  BURY_URL = '' // 正式生产环境埋点
  ZUTAI_BASE_URl = location.origin
}
const env = {
  bury_url: BURY_URL,
  base_url: BASE_URL,
  router_name: ROUTER_NAME,
  zutai_base_url: ZUTAI_BASE_URl
}
export default env
