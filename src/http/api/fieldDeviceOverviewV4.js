/*
 @file 场区设备概览
 */

import request from '@/http/http'

//  参数信息获取v4
export function ArgsInfo(params) {
  const url = 'api/unit_evc/myBoarEvc/runtime/args'
  return request(url, {
    params
  })
}
// 参数信息获取更新
export function singleUnit(params, data) {
  let url = 'api/unit_evc/boarInstruction/config/singleUnit?'
  for (const key in params) {
    url += `${key}=${params[key]}&`
  }
  return request(url, {
    method: 'PUT',
    data
  })
}
//  参数信息获取v2
export function ArgsInfoV3(params) {
  const url = 'api/unit_evc/evc/runtime/args/v3'
  return request(url, {
    params
  })
}

// 设备指令
export function mcuInstruction(params, data) {
  let url = '/api/unit_evc/boarInstruction/control/device?'
  for (const key in params) {
    url += `${key}=${params[key]}&`
  }
  return request(url, {
    method: 'PUT',
    data
  })
}

// 状态上报
export function UploadState(params, data) {
  let url = '/api/unit_evc/boarInstruction/control/self/UploadState?'
  for (const key in params) {
    url += `${key}=${params[key]}&`
  }
  return request(url, {
    method: 'PUT',
    data
  })
}

// 参数上报
export function UploadParam(params, data) {
  let url = '/api/unit_evc/boarInstruction/control/self/UploadParam?'
  for (const key in params) {
    url += `${key}=${params[key]}&`
  }
  return request(url, {
    method: 'PUT',
    data
  })
}

// 设备重启
export function DevReboot(params, data) {
  let url = '/api/unit_evc/boarInstruction/control/self/DevReboot?'
  for (const key in params) {
    url += `${key}=${params[key]}&`
  }
  return request(url, {
    method: 'PUT',
    data
  })
}

// 重新检测设备
export function ResetDevInstall(params, data) {
  let url = '/api/unit_evc/boarInstruction/control/self/ResetDevInstall?'
  for (const key in params) {
    url += `${key}=${params[key]}&`
  }
  return request(url, {
    method: 'PUT',
    data
  })
}

// 恢复出厂设置
export function FactorySetting(params, data) {
  let url = '/api/unit_evc/boarInstruction/control/self/FactorySetting?'
  for (const key in params) {
    url += `${key}=${params[key]}&`
  }
  return request(url, {
    method: 'PUT',
    data
  })
}

// 获取猪舍环境数据
export function getPigOneInfo(data) {
  return request('/api/unit_evc/myBoarEvc/getOne', {
    method: 'get',
    params: data
  })
}

// 设备告警信息
export function alarmInfo(data) {
  return request(`/api/unit_evc/myBoarEvc/getAlarmDetails`, {
    method: 'get',
    params: data
  })
}

// 获取猪舍环境数据
export function getPeriodData(data) {
  return request('/api/unit_evc/myBoarEvc/getPeriodData', {
    method: 'post',
    data: data
  })
}

// 导出
export function exportFile(data) {
  return request(`/api/unit_evc/myBoarEvc/export`, {
    method: 'get',
    params: data
  })
}
