/*
 @file 场区设备概览
 */

import request from '@/http/http'
import { getConfigElement } from '@/utils/overtService'

// 获取场区信息
export function getRegionAreaFieldTree(data) {
  const element = getConfigElement('unit-evcDataInterface')
  const url = element ? element.getRegionAreaFieldTree.uri : ''
  return request('/api' + url, {
    // method: element ? element.getRegionAreaFieldTree.method : '',
    params: {
      isBuilding: false
    }
  })
}

// 列表查询
export function getDevicesByField(params) {
  const element = getConfigElement('getDevicesByAreaField')
  const url = element ? element.getDevicesByAreaField.uri : ''
  return request('api' + url, {
    params: params
  })
}

// 告警信息
export function getAlarmInfosByField(params) {
  const element = getConfigElement('getDevicesByAreaField')
  const url = element ? element.getAlarmInfosByAreaField.uri : ''
  return request('api' + url, {
    params: params
  })
}

// 查询场区是否配置整场告警通知推送接收人员
export function isFieldConfigAlarmNoticeUsers(params) {
  const element = getConfigElement('fieldDeviceOverview')
  const url = element ? element.isFieldConfigAlarmNoticeUsers.uri : ''
  return request('api' + url, {
    params
  })
}

// 设备指令
export function mcuInstruction(params, data) {
  let url = 'api/unit_evc/mcuInstruction/control/device?'
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
  let url = 'api/unit_evc/mcuInstruction/control/self/UploadState?'
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
  let url = 'api/unit_evc/mcuInstruction/control/self/UploadParam?'
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
  let url = 'api/unit_evc/mcuInstruction/control/self/DevReboot?'
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
  let url = 'api/unit_evc/mcuInstruction/control/self/ResetDevInstall?'
  for (const key in params) {
    url += `${key}=${params[key]}&`
  }
  return request(url, {
    method: 'PUT',
    data
  })
}

// 重新检测设备
export function FactorySetting(params, data) {
  let url = 'api/unit_evc/mcuInstruction/control/self/FactorySetting?'
  for (const key in params) {
    url += `${key}=${params[key]}&`
  }
  return request(url, {
    method: 'PUT',
    data
  })
}

// 参数信息获取
export function ArgsInfo(params) {
  const url = 'api/unit_evc/evc/runtime/args/v2'
  // for (let key in params) {
  //   url += `${key}=${params[key]}&`;
  // };
  return request(url, {
    params
  })
}

// 参数信息获取更新
export function singleUnit(params, data) {
  let url = 'api/unit_evc/mcuInstruction/config/singleUnit?'
  for (const key in params) {
    url += `${key}=${params[key]}&`
  }
  return request(url, {
    method: 'PUT',
    data
  })
}

// 获取模板
export function myDeviceArgsTemplate(params) {
  return request('api/unit_evc/myDeviceArgsTemplate/pageList', {
    params
  })
}

// 提交
export function putMultiUnit(data) {
  return request('api/unit_evc/mcuInstruction/config/multiUnit', {
    method: 'PUT',
    data
  })
}

// 关注
export function addFocus(data) {
  const element = getConfigElement('fieldDeviceOverview')
  const url = element ? element.attentionAdd.uri : ''
  return request('api' + url, {
    method: 'POST',
    data
  })
}

// 取消关注
export function cancelFocus(params) {
  const element = getConfigElement('fieldDeviceOverview')
  const url = element ? element.attentionCancel.uri : ''
  return request('api' + url, {
    method: 'POST',
    params
  })
}

// 获取关注列表
export function focusList(params) {
  const element = getConfigElement('fieldDeviceOverview')
  const url = element ? element.attentionList.uri : ''
  return request('api/unit_evc/myAttentionField/list' + url, {
    params
  })
}

// 获取厂长信息
export function getLeaderInfo(params) {
  return request('api/unit_evc/equipment/getFieldLeaderByField', {
    params
  })
}

// 更新厂长信息
export function updateFieldLeaderInfo(data) {
  return request('api/unit_evc/equipment/updateFieldLeaderInfo', {
    method: 'post',
    data
  })
}
