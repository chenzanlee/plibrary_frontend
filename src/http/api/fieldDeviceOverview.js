/*
 @file 场区设备概览
 */
import { stringify } from 'query-string'
import request from '@/http/http'

// 导出表格
export function exportTable(uri, params) {
  return `api${uri}?token=${localStorage.getItem('TOKEN')}&${stringify(
    params
  )}`
}

// 获取场区信息
export function getRegionAreaFieldTree(data) {
  return request('/api/unit_evc/myBaseFieldUnit/getRegionAreaFieldTree', {
    params: {
      isBuilding: false
    }
  })
}

// 列表查询
export function getDevicesByField(params) {
  return request('api/unit_evc/equipment/getDevicesByField', {
    params
  })
}
// 区域告警列表查询
export function AlarmGetDevicesByField(params) {
  return request('api/unit_evc/equipment/getDevicesByAreaField', {
    params: params
  })
}
// 告警信息
export function getAlarmInfosByField(fieldId) {
  return request('api/unit_evc/equipment/getAlarmInfosByField', {
    params: {
      fieldId
    }
  })
}

// 告警信息v4
export function getAlarmInfosByFieldV4(deviceId) {
  return request('api/unit_evc/myBoarEvc/getAlarmDetails', {
    params: {
      deviceId
    }
  })
}

// 查询场区是否配置整场告警通知推送接收人员
export function isFieldConfigAlarmNoticeUsers(params) {
  return request('api/unit_evc/alarmNoticeUser/isFieldConfigAlarmNoticeUsers', {
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
// 设备指令v2
export function mcuInstructionV2(params, data) {
  let url = 'api/unit_evc/mcuInstructionV2/control/device?'
  for (const key in params) {
    url += `${key}=${params[key]}&`
  }
  return request(url, {
    method: 'PUT',
    data
  })
}
// 报警控制
export function mcuInstructionAlarmV2(params, data) {
  let url = '/api/unit_evc/mcuInstructionV2/alarm/device?'
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
// 状态上报v2
export function UploadStateV2(params, data) {
  let url = 'api/unit_evc/mcuInstructionV2/control/self/UploadState?'
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
// 参数上报v2
export function UploadParamV2(params, data) {
  let url = 'api/unit_evc/mcuInstructionV2/control/self/UploadParam?'
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
// 设备重启v2
export function DevRebootV2(params, data) {
  let url = 'api/unit_evc/mcuInstructionV2/control/self/DevReboot?'
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
// 重新检测设备v2
export function ResetDevInstallV2(params, data) {
  let url = 'api/unit_evc/mcuInstructionV2/control/self/ResetDevInstall?'
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
// 重新检测设备V2
export function FactorySettingV2(params, data) {
  let url = 'api/unit_evc/mcuInstructionV2/control/self/FactorySetting?'
  for (const key in params) {
    url += `${key}=${params[key]}&`
  }
  return request(url, {
    method: 'PUT',
    data
  })
}

// 参数信息获取v2
export function ArgsInfo(params) {
  const url = 'api/unit_evc/evc/runtime/args/v2'
  // for (let key in params) {
  //   url += `${key}=${params[key]}&`;
  // };
  return request(url, {
    params
  })
}

//  参数信息获取v2
export function ArgsInfoV3(params) {
  const url = 'api/unit_evc/evc/runtime/args/v3'
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
  return request('api/unit_evc/myAttentionField/add', {
    method: 'post',
    data
  })
}

// 取消关注
export function cancelFocus(params) {
  return request('api/unit_evc/myAttentionField/cancel', {
    method: 'post',
    params
  })
}

// 获取关注列表
export function focusList(params) {
  return request('api/unit_evc/myAttentionField/list', {
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
// 新增厂长信息
export function addFieldLeaderInfo(data) {
  return request('api/unit_evc/equipment/addFieldLeaderInfo', {
    method: 'post',
    data
  })
}
// 删除厂长信息
export function delFieldLeaderInfo(params) {
  return request('api/unit_evc/equipment/deleteFieldLeaderInfoByFieldId', {
    params
  })
}
// 调用舒适区间导出接口
export function exportUnComfortExcel(params) {
  return request('api/unit_evc/evcComfortInfo/exportV2', {
    params
  })
}
// 获取舒适区间导出接口文件下载地址
export function exportUnComfortExcelUrl(params) {
  return request('api/unit_evc/evcComfortInfo/file/url', {
    params
  })
}
