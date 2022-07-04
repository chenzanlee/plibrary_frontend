import Vue from 'vue'
import Element from 'element-ui'
import SlideVerify from 'vue-monoplasty-slide-verify'

import App from './App.vue'
import router from './router'
import store from './store'
import moment from 'moment'
import 'element-ui/lib/theme-chalk/index.css'
import '@/common/styles/index.scss'
import '@/common/styles/modular/elDialog.scss'
import '@/common/styles/modular/table.scss'
import _ from 'lodash'
import importDirective from '@/directives'
import { getConfigElement } from '@/utils/overtService'
import { getImgUrl } from '@/utils/getImgUrl'
import { httpRequest, httpExport } from '@/http/dispatch.js'
import './permission'
import '@/utils/filter'

Vue.prototype.$echarts = window.echarts
Vue.prototype._ = _
import '@/icons'
Vue.config.productionTip = false
Vue.use(Element)
Vue.use(SlideVerify)
Vue.prototype.$httpRequest = httpRequest
Vue.prototype.$httpExport = httpExport
Vue.prototype.$moment = moment
Vue.prototype.$getImgUrl = getImgUrl
Vue.prototype.$getConfigElement = getConfigElement
// 将cancel,挂载到vue原型上
Vue.prototype.cancel = () => {
  // 获取缓存的 请求取消标识 数组，取消所有关联的请求
  const cancelArr = window.axiosCancel
  cancelArr.forEach((ele, index) => {
    ele.cancel({
      status: 500,
      message: '取消了请求',
      data: {}
    })// 在失败函数中返回这里自定义的错误信息
    delete window.axiosCancel[index]
  })
}
importDirective(Vue)
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

// 获取正确的时间格式
Vue.prototype.$dateTime =
function(dateValue) {
  var date = new Date(dateValue)
  var YY = date.getFullYear() + '-'
  var MM =
    (date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1) + '-'
  var DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  var hh =
    (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  var mm =
    (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
    ':'
  var ss =
    date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return YY + MM + DD + ' ' + hh + mm + ss
}
