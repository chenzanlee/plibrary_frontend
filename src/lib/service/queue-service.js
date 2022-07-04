import OAuthService from '@/lib/service/oauth-service'
import store from '@/store'
import router from '@/router/index'
class QueueService extends OAuthService {
  constructor() {
    super()
    this.isRefreshing = false
    this.requests = []
  }
  perform(config, service) {
    if (!this.isRefreshing) {
      this.isRefreshing = true
      return store.dispatch('RefreshToken').then(res => {
        config.headers['Authorization'] = this.getAccessToken()
        this.requests.forEach(cb => cb(this.getAccessToken()))
        this.requests = []
        return service(config)
      }).catch(res => {
        router.push({
          path: '/login'
        })
      }).finally(() => {
        this.isRefreshing = false
      })
    } else {
      return new Promise((resolve) => {
        this.requests.push((token) => {
          config.headers['Authorization'] = token
          resolve(service(config))
        })
      })
    }
  }
}

const queueService = new QueueService()
export default queueService
