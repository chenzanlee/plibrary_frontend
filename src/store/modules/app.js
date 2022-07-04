/**
 *
 * @file 系统配置项
 * @author author-name(李红波 15537053107)
 */

import { lStorage } from '@/common/base/storage/baseStorage'
import { getMenuList } from '@/http/api/menuInfo'
import router from '@/router'

// let isAppCodeAuth = false
// const deepFind = (params) => {
//   const currentPath = location.hash.split('#')[1]
//   for (let index = 0; index < params.length; index++) {
//     const element = params[index]
//     if (element.frontendRoutePath === currentPath) {
//       isAppCodeAuth = true
//       break
//     } else if (Array.isArray(element.children) && element.children.length > 0) {
//       deepFind(element.children)
//     }
//   }
//   return isAppCodeAuth
// }
const getAuthMenuList = (datas) => {
  setTimeout(() => {
    console.log(datas, 'aaaaaaa')
    const hashs = location.hash.split('/')
    const appCode = Array.isArray(hashs) && hashs[1]
    const path = location.hash.split('#')[1]
    console.log(appCode, path, 'appCode')
    if (path === `/${appCode}`) { // 动态重定向到第一个有权限的子菜单
      let childPath = datas.find(d => { return (d.frontendRoutePath !== path && d.frontendRoutePath) })
      const pathArr = []
      pathArr.push(childPath.frontendRoutePath)
      if (childPath.children && childPath.children.length) {
        childPath = childPath.children[0]
        pathArr.push(childPath.frontendRoutePath)
      }
      if (childPath.children && childPath.children.length) {
        childPath = childPath.children[0]
        pathArr.push(childPath.frontendRoutePath)
      }
      sessionStorage.setItem('keyPath', JSON.stringify(pathArr))
      if (childPath) {
        router.push({
          path: childPath.frontendRoutePath
        })
      }
    } else { // 根据后台返回的菜单URL递归查找,如果访问的url没有权限,直接跳转404
      // if (!deepFind(datas)) {
      //   isAppCodeAuth = false
      //   router.push({
      //     path: '/404'
      //   })
      // }
    }
  }, 0)
}
const app = {
  state: {
    sidebar: {
      opened: true,
      withoutAnimation: false
    },
    fullScreen: false,
    siderMenuList: [],
    currentlySelect: lStorage.get('currentlySelect') || '智能环控'
  },
  mutations: {
    SET_CURRENTLY_SELECT: (state, currentlySelect) => {
      lStorage.set('currentlySelect', currentlySelect)
    },
    GET_CURRENTLY_SELECT: (state, currentlySelect) => {
      lStorage.get('currentlySelect')
    },
    CHECK_FULL_SCREEN: (state) => {
      state.fullScreen = !state.fullScreen
    },
    SET_SIDER_MENU_LIST: (state, list) => {
      state.siderMenuList = list
    }
  },
  actions: {
    // 获取菜单
    getSiderMenuDataList({ commit }, item) {
      const data = {
        frontAppCode: item.appCode
      }
      getMenuList(data).then(res => {
        if (Array.isArray(res)) {
          if (res.length) {
            getAuthMenuList(res)
          } else {
            // router.push('/unit-evc')
          }
          commit('SET_SIDER_MENU_LIST', res)
        }
      })
    },
    setCurrentlySelect({ commit }, currentlySelect) {
      commit('SET_CURRENTLY_SELECT', currentlySelect)
    },
    getCurrentlySelect({ commit }) {
      commit('GET_CURRENTLY_SELECT')
    },
    checkFullScreen({ commit }) {
      commit('CHECK_FULL_SCREEN')
    }
  }
}

export default app
