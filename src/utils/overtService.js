import { getUserFrontInfo } from '@/http/api/jurisdiction'
import { getOneBySomeId } from '@/http/api/unitCockpit'
import { Loading } from 'element-ui'

// 深拷贝
export function disabledCopy(arr) {
  return changeDisabled(arr)
}
function changeDisabled(arr) {
  arr.map((item) => {
    item.disabled = true
    if (item.children && item.children.length > 0) {
      changeDisabled(item.children)
    }
  })
}
// 切换导航-加载权限时的loading
let loading
function startLoading(txt) { // 使用Element loading-start 方法
  loading = Loading.service({
    background: 'rgba(0,0,0,0.5)',
    lock: true,
    text: txt
  })
}
function endLoading() { // 使用Element loading-close 方法
  if (loading) {
    loading.close()
  }
}
export function storageFrontInfo(appcode) {
  if (localStorage.userJurisdiction && JSON.parse(localStorage.userJurisdiction).currentAppCode === 'all') {
    return new Promise((res) => {
      setTimeout(() => {
        res(5)
      })
    })
  } else {
    if (appcode === 'all') {
      obtainInfo(appcode)
    } else {
      startLoading('拼命加载权限中...')
      return obtainInfo(appcode)
    }
  }
}
function obtainInfo(appCode) {
  return getUserFrontInfo({ frontAppCode: appCode }).then((res) => {
    if (res && res.elements) {
      const d = JSON.parse(JSON.stringify(res))
      d.currentAppCode = appCode
      localStorage.userJurisdiction = JSON.stringify(d)
    } else {
      this.$message.error('获取权限失败')
    }
    // 触发权限指令
    endLoading()
    return res
  }).catch(() => {
    endLoading()
  })
}

// 获取用户权限信息，并缓存
// export function storageFrontInfo(appCode) {
//   const data = {
//     frontAppCode: appCode
//   }
//   return getUserFrontInfo(data).then((res) => {
//     const d = JSON.parse(JSON.stringify(res))
//     d.currentAppCode = appCode
//     localStorage.userJurisdiction = JSON.stringify(d)
//     // 触发权限指令
//     return res
//   })
// }

// export function storageFrontInfoAppCode() {
//   const d = JSON.parse(localStorage.userJurisdiction)
//   if (d && d.currentAppCode === 'all') {
//     return true
//   } else {
//     const appCode = 'all'
//     const data = {
//       frontAppCode: appCode
//     }
//     getUserFrontInfo(data).then((res) => {
//       const d = JSON.parse(JSON.stringify(res))
//       d.currentAppCode = appCode
//       localStorage.userJurisdiction = JSON.stringify(d)
//     })
//   }
// }

// 权限
export function getConfigElement(pageName) {
  if (localStorage.userJurisdiction && localStorage.userJurisdiction !== 'undefined') {
    const elements = JSON.parse(localStorage.userJurisdiction)
    const pageElement = {}
    const appCode = JSON.parse(localStorage.getItem('currentlySelect')).appCode || 'unit-evc'
    if (elements.status === 2100003) {
      resetLocal()
      window.location.reload()
    } else if (elements && !elements.elements) {
      resetLocal()
      window.location.reload()
    } else {
      elements.elements.forEach((item) => {
        if (item.code.split(':')[0] === pageName && item.appCode === appCode) {
          pageElement[item.code.split(':')[1]] = item
        }
      })
      return pageElement
    }
  } else {
    return {}
  }
}
export function resetLocal() {
  localStorage.clear()
  // localStorage.removeItem('user-token')
  // localStorage.removeItem('refreshToken')
  // localStorage.removeItem('antd-pro-authority')
  // localStorage.removeItem('info')
  // localStorage.removeItem('menu')
  // localStorage.removeItem('leftSeconds')
  // localStorage.removeItem('routerData')
  // localStorage.removeItem('bytes')
}

// 全局取消loading
export function cancelLoadingMask() {
  const dom = document.getElementsByClassName('el-loading-mask')
  for (const i of dom) {
    i.className = 'el-loading-mask none'
  }
}

// 自动滚动
export function autoScroll(dom) {
  if (!dom) {
    return
  }
  dom.obj = {
    time: 30,
    timer: null,
    timer2: null,
    function: (dom) => {
      const h = dom.offsetHeight
      const childD = dom.firstElementChild
      const childH = childD.offsetHeight
      if (childH < h) {
        return
      }
      let top = dom.scrollTop
      dom.obj.timer = setInterval(() => {
        if (top > (childH - h + 20)) {
          clearInterval(dom.obj.timer)
          buffer(dom)
        } else {
          top = top + 0.5
          dom.scrollTop = top
        }
      }, dom.obj.time)
    }
  }
  clearInterval(dom.obj.timer)
  dom.obj.function()
  dom.onmouseover = function() {
    clearInterval(dom.obj.timer)
  }
  dom.onmouseout = function() {
    clearInterval(dom.obj.timer)
    dom.obj.function()
  }
}
export function buffer(dom) {
  dom.obj.timer2 = setInterval(() => {
    const scrollTop = dom.scrollTop
    const speed = Math.abs(scrollTop / 5)
    if (scrollTop < 2) {
      document.body.scrollTop = 0
      clearInterval(dom.obj.timer2)
      clearInterval(dom.obj.timer)
      dom.obj.function()
    }
    dom.scrollTop = scrollTop - speed
  }, 30)
}
// 全局关闭 蒙层
export function closeMask() { // 解决dialog里调$confirm时蒙层不消失问题
  const DOM = document.querySelector('.el-message-box__wrapper + div.v-modal')
  DOM.style.display = 'none'
}
// 数组项等分
export function groupArr(array, subGroupLength) {
  let index = 0
  const newArray = []
  while (index < array.length) {
    newArray.push(array.slice(index, index += subGroupLength))
  }
  return newArray
}
// 反查大区区域场区单元
export function getDataCenter(data) {
  getOneBySomeId(data).then(res => {
    if (res && res.status === 200 && res.rel && res.data) {
      const areaId = { name: res.data.areaName, value: res.data.areaId }
      const regionId = { name: res.data.regionName, value: res.data.regionId }
      const fieldId = { name: res.data.fieldName, value: res.data.fieldId }
      const segmentId = { name: res.data.segmentName, value: res.data.segmentId }
      const id = { name: res.data.unit, value: res.data.id }
      sessionStorage.setItem('dataCenterAreas', JSON.stringify(areaId))
      sessionStorage.setItem('dataCenterRegions', JSON.stringify(regionId))
      sessionStorage.setItem('dataCenterFieldId', JSON.stringify(fieldId))
      sessionStorage.setItem('dataCenterSegmentId', JSON.stringify(segmentId))
      sessionStorage.setItem('dataCenterUnitId', JSON.stringify(id))
    }
  })
}
export function getUnitEvc(data) {
  getOneBySomeId(data).then(res => {
    if (res && res.status === 200 && res.rel && res.data) {
      const areaId = { name: res.data.areaName, value: res.data.areaId }
      const regionId = { name: res.data.regionName, value: res.data.regionId }
      const fieldId = { name: res.data.fieldName, value: res.data.fieldId }
      const segmentId = { name: res.data.segmentName, value: res.data.segmentId }
      const id = { name: res.data.unit, value: res.data.id }
      sessionStorage.setItem('unitEvcAreas', JSON.stringify(areaId))
      sessionStorage.setItem('unitEvcRegions', JSON.stringify(regionId))
      sessionStorage.setItem('unitEvcFieldId', JSON.stringify(fieldId))
      sessionStorage.setItem('unitEvcSegmentId', JSON.stringify(segmentId))
      sessionStorage.setItem('unitEvcUnitId', JSON.stringify(id))
    }
  })
}

// 获取当前时间 2020-12-23 17:27:19
export function getCurrentTime(d) {
  const date = d ? new Date(d) : new Date()
  const Y = date.getFullYear()
  const M =
    date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1
  const D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  const hh = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  const mm =
    date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  const ss =
    date.getSeconds() < 10 ? '0' + date.getDate() : date.getSeconds()
  const time = Y + '-' + M + '-' + D + ' ' + hh + ':' + mm + ':' + ss
  return time
}

// 获取四天后 2020-12-27
export function nDate(t) {
  const date1 = new Date()
  const date2 = new Date(date1)
  date2.setDate(date1.getDate() + t)
  const day = date2.getDate() < 10 ? '0' + date2.getDate() : date2.getDate()
  const time2 = date2.getFullYear() + '-' + `${(date2.getMonth() + 1) > 10 ? (date2.getMonth() + 1) : '0' + (date2.getMonth() + 1)}` + '-' + day
  return time2
}
export function getWeek(dateString) {
  const dateArray = dateString.split('-')
  const date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2])
  return '周' + '日一二三四五六'.charAt(date.getDay())
}
