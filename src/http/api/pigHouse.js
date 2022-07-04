import request from '@/http/http'
// 参数信息获取更新
export function singleUnit(params, data) {
  let url = 'api/unit_evc/mcuRoomInstruction/config/singleUnit?'
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
  const url = 'api/unit_evc/mcuRoomInstruction/runtime/args'
  // for (let key in params) {
  //   url += `${key}=${params[key]}&`;
  // };
  return request(url, {
    params
  })
}

// 设备指令
export function mcuInstruction(params, data) {
  let url = 'api/unit_evc/mcuRoomInstruction/control/device?'
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
  let url = 'api/unit_evc/mcuRoomInstruction/control/self/UploadState?'
  for (const key in params) {
    url += `${key}=${params[key]}&`
  }
  return request(url, {
    method: 'PUT',
    data
  })
}
export function UploadUnitState(data) {
  const url = 'api/unit_evc/mcuRoomInstruction/control/multiCommand'
  return request(url, {
    method: 'PUT',
    data
  })
}
export function UploadParam(params, data) {
  let url = 'api/unit_evc/mcuRoomInstruction/control/self/UploadParam?'
  for (const key in params) {
    url += `${key}=${params[key]}&`
  }
  return request(url, {
    method: 'PUT',
    data
  })
}
// api/unit_evc/mcuRoomInstruction/config/multiUnit
export function multiUnitSetting(data) {
  const url = 'api/unit_evc/mcuRoomInstruction/config/multiUnit'
  return request(url, {
    method: 'PUT',
    data
  })
}

// 设备重启
export function DevReboot(params, data) {
  let url = 'api/unit_evc/mcuRoomInstruction/control/self/DevReboot?'
  for (const key in params) {
    url += `${key}=${params[key]}&`
  }
  return request(url, {
    method: 'PUT',
    data
  })
}

export function FactorySetting(params, data) {
  let url = 'api/unit_evc/mcuRoomInstruction/control/self/FactorySetting?'
  for (const key in params) {
    url += `${key}=${params[key]}&`
  }
  return request(url, {
    method: 'PUT',
    data
  })
}

// 获取楼房猪舍场区设备概览列表
export function getDevicesByFieldForBuilding(params, data) {
  const url = 'api/unit_evc/equipment/getDevicesByFieldForBuilding'
  return request(url, {
    method: 'get',
    params
  })
}

//
export function multiDevice(data) {
  const url = 'api/unit_evc/mcuRoomInstruction/control/multiDevice'
  return request(url, {
    method: 'PUT',
    data
  })
}

