import { getConfigElement } from '@/lib/utils'
export default {
  inserted(el, { value }, vnode) {
    if (value && value.includes(':')) {
      const auths = value.split(':')
      const pageElement = getConfigElement(auths[0])
      const btnName = auths[1]
      if (!pageElement[btnName]) {
        el.style.display = 'none'
        return
      }
    }
  }
}
