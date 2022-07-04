/*
 @file 喷淋设备概览
 */

import request from '@/http/http'
import { getConfigElement } from '@/utils/overtService'

const pageElement = getConfigElement('PiggeryDeviceOverview')
const commonElement = getConfigElement('unit-evcDataInterface')
import {
  Message
} from 'element-ui'
let uriLock = false
function authMsg() {
  uriLock = true
  setTimeout(() => {
    uriLock = false
    Message.error('温馨提示:用户访问权限不足!')
  }, 2000)
  return
}

// 获取场区信息 https://dev.imuyuan.com/api/unit_evc/myBaseFieldUnit/getRegionAreaFieldTree?isBuilding=false
export function getRegionAreaFieldTree(data) {
  return request('/api/unit_evc/myBaseFieldUnit/getRegionAreaFieldTree', {
    method: 'get',
    params: {
      isBuilding: false
    }
  })
}

// 获取全部猪舍类型 https://dev.imuyuan.com/api/unit_evc/myPiggeryShower/getDevicesByField?fieldId=15174016
export function getPiggeryShowerList(data) {
  return request('/api/unit_evc/myPiggeryShower/getDevicesByField', {
    method: 'get',
    params: data
  })
}

/*
 @file 喷淋设备概览详情
 */
// 单元状态监控
// https://dev.imuyuan.com/api/unit_evc/myEvcWeatherInfo/listWeather
export function getListWeather(data) { // {fieldId: "15174016", startDay: "2020-10-12", endDay: "2020-10-18"}
  const element = commonElement['getWeather']
  if ((!element || !element.uri) && !uriLock) {
    authMsg()
  } else {
    return request('/api' + element.uri, {
      method: element.method,
      data: data
    })
  }
}

// 获取猪舍环境数据----单元基础信息
const pageElement1 = getConfigElement('fieldDeviceOverview')
export function getPigUnit(data) {
  const element = pageElement1['getFieldPigMsgInfo']
  if ((!element || !element.uri) && !uriLock) {
    authMsg()
  } else {
    return request('/api' + element.uri, {
      method: element.method,
      params: data
    })
  }
}

// https://dev.imuyuan.com/api/unit_evc/myPiggeryShower/getOne?areaId=15174012&fieldId=15174016&regionId=10&segmentId=13906&unit=1
export function getPigOneInfo(data) {
  const element = pageElement['getOnePiggeryShower']
  if ((!element || !element.uri) && !uriLock) {
    authMsg()
  } else {
    return request('/api' + element.uri, {
      method: element.method,
      params: data
    })
  }
}

// https://dev.imuyuan.com/api/unit_evc/myPiggeryShower/getPeriodData
export function getPeriodData(data) {
//     channel: 1
// deviceId: "4D5D203535555850501700330029"
// endTime: "2020-10-12 17:55:00"
// startTime: "2020-10-1
  const element = pageElement['getPiggeryShowerData']
  if ((!element || !element.uri) && !uriLock) {
    authMsg()
  } else {
    return request('/api' + element.uri, {
      method: element.method,
      data: data
    })
  }
}

// ----------------设备监控
// 设备指令 unit_evc/myPiggeryShower/control/device deviceId=4D5D203535555850501700330029&deviceName=7bgdS28GdCQH3dpGwsx144&channel=1
export function mcuInstruction(params, data) {
  const element = pageElement['controlDevice']
  if ((!element || !element.uri) && !uriLock) {
    authMsg()
  } else {
    let url = '/api' + element.uri + '?'
    for (const key in params) {
      url += `${key}=${params[key]}&`
    }
    return request(url, {
      method: element.method,
      data
    })
  }
}

// 触发状态上报 https://dev.imuyuan.com/api/unit_evc/myPiggeryShower/control/self/UploadState?
// deviceId=4D5D203535555850501700330029&deviceName=7bgdS28GdCQH3dpGwsx144
export function UploadState(params, data) {
  const element = pageElement['piggeryShowerSelfControl']
  // let url = '/api/unit_evc/myPiggeryShower/control/self/UploadState?'
  if ((!element || !element.uri) && !uriLock) {
    authMsg()
  } else {
    let url = '/api' + element.uri + '/UploadState?'
    for (const key in params) {
      url += `${key}=${params[key]}&`
    }
    return request(url, {
      method: 'PUT',
      data
    })
  }
}

// 触发参数上报 https://dev.imuyuan.com/api/unit_evc/myPiggeryShower/control/self/UploadParam?
// deviceId=4D5D203535555850501700330029&deviceName=7bgdS28GdCQH3dpGwsx144
export function UploadParam(params, data) {
  const element = pageElement['piggeryShowerSelfControl']
  // let url = '/api/unit_evc/myPiggeryShower/control/self/UploadParam?'
  if ((!element || !element.uri) && !uriLock) {
    authMsg()
  } else {
    let url = '/api' + element.uri + '/UploadParam?'
    for (const key in params) {
      url += `${key}=${params[key]}&`
    }
    return request(url, {
      method: 'PUT',
      data
    })
  }
}

// 设备重启 https://dev.imuyuan.com/api/unit_evc/myPiggeryShower/control/self/DevReboot?
// deviceId=4D5D203535555850501700330029&deviceName=7bgdS28GdCQH3dpGwsx144
export function DevReboot(params, data) {
  const element = pageElement['piggeryShowerSelfControl']
  // let url = '/api/unit_evc/myPiggeryShower/control/self/DevReboot?'
  if ((!element || !element.uri) && !uriLock) {
    authMsg()
  } else {
    let url = '/api' + element.uri + '/DevReboot?'
    for (const key in params) {
      url += `${key}=${params[key]}&`
    }
    return request(url, {
      method: 'PUT',
      data
    })
  }
}

// 重新检测设备 https://dev.imuyuan.com/api/unit_evc/myPiggeryShower/control/self/ResetDevInstall?
// deviceId=4D5D203535555850501700330029&deviceName=7bgdS28GdCQH3dpGwsx144
export function ResetDevInstall(params, data) {
  const element = pageElement['piggeryShowerSelfControl']
  // let url = '/api/unit_evc/myPiggeryShower/control/self/ResetDevInstall?'
  if ((!element || !element.uri) && !uriLock) {
    authMsg()
  } else {
    let url = '/api' + element.uri + '/ResetDevInstall?'
    for (const key in params) {
      url += `${key}=${params[key]}&`
    }
    return request(url, {
      method: 'PUT',
      data
    })
  }
}

// 恢复出厂设置 https://dev.imuyuan.com/api/unit_evc/myPiggeryShower/control/self/FactorySetting?
// deviceId=4D5D203535555850501700330029&deviceName=7bgdS28GdCQH3dpGwsx144
export function FactorySetting(params, data) {
  const element = pageElement['piggeryShowerSelfControl']
  // let url = '/api/unit_evc/myPiggeryShower/control/self/FactorySetting?'
  if ((!element || !element.uri) && !uriLock) {
    authMsg()
  } else {
    let url = '/api' + element.uri + '/FactorySetting?'
    for (const key in params) {
      url += `${key}=${params[key]}&`
    }
    return request(url, {
      method: 'PUT',
      data
    })
  }
}

// -----------------参数设置
// 参数信息获取更新
// https://dev.imuyuan.com/api/unit_evc/myPiggeryShower/config/singleUnit?
// deviceId=4D5D203535555850501700330029&deviceName=7bgdS28GdCQH3dpGwsx144&channel=1
export function singleUnit(params, data) {
  const element = pageElement['configSingleUnit']
  if ((!element || !element.uri) && !uriLock) {
    authMsg()
  } else {
    let url = '/api' + element.uri + '?'
    for (const key in params) {
      url += `${key}=${params[key]}&`
    }
    return request(url, {
      method: element.method,
      data
    })
  }
}

// //  参数信息获取v2 api/unit_evc/myPiggeryShower/runtime/args
// channel: 1
// deviceId: 4D5D203535555850501700330029
export function ArgsInfo(params) {
  const element = pageElement['piggeryShowerArgs']
  if ((!element || !element.uri) && !uriLock) {
    authMsg()
  } else {
    return request('/api' + element.uri, {
      method: element.method,
      params
    })
  }
}

// 告警列表 /api/unit_evc/myPiggeryShower/getAlarmDetails
export function alarmInfo(params) {
  const element = pageElement['getAlarmDetails']
  if ((!element || !element.uri) && !uriLock) {
    authMsg()
  } else {
    return request('/api' + element.uri, {
      method: element.method,
      params
    })
  }
}
