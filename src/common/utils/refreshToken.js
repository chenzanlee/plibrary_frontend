
import Vue from 'vue'
import store from '@/store'
import {
  getExpires,
  getRefresh,
  getAuthTime
} from '@/views/userManagement/common/auth/authStore'
import {
  hasValidAccessToken
} from '@/common/utils/refreshService'
import router from '@/router'
const offsetSeconds = 600
const delay = parseInt((Number(getExpires()) - getAuthTime() - offsetSeconds * 1000), 10)
Vue.prototype.$offsetSeconds = offsetSeconds
Vue.prototype.$delay = delay > 0 ? delay : 1800000
// Vue.prototype.$delay = 1000

if (!hasValidAccessToken()) {
  if (getRefresh()) {
    store.dispatch('RefreshToken').then(() => {
      setInterval(() => {
        store.dispatch('RefreshToken').catch(() => {
          router.push({
            path: '/login'
          })
        })
      }, Vue.prototype.$delay)
    })
  }
} else {
  if ((getExpires() - new Date().getTime() - offsetSeconds * 1000) > 0) {
    setTimeout(() => {
      store.dispatch('RefreshToken').then(() => {
        setInterval(() => {
          store.dispatch('RefreshToken').catch(() => {
            router.push({
              path: '/login'
            })
          })
        }, Vue.prototype.$delay)
      })
    }, parseInt((getExpires() - new Date().getTime() - offsetSeconds * 1000), 10))
  }
}

