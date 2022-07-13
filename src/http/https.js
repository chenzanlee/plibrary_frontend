/**
 * 请求库的配置
 * @file 底层请求库封装
 * @author author-name(李红波 15537053107)
 */

import axios from 'axios'
import { interceptors } from '@/http/interceptors'

// 开发环境配置
var baseURL = ''
// if (location.hostname === 'localhost') {
//   baseURL = "/api/"
// } else if (location.hostname.includes('dev')) {
//   baseURL = "/api/"
// } else {
//   baseURL = "/api/"
// }

// 初始化
const service = axios.create({
  baseURL,
  timeout: 100000
})

// 拦截器
interceptors(service)

export default service
