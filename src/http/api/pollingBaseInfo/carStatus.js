/*
 @file 基础信息维护-设备参数模板
 */

import request from '@/http/http'

// 获取选择器的内容(内容需要自己过滤)  http://localhost:8080/api/bar_patrol/myBaseInfo/treeForSelect
export function getRegionAreaFieldRoomTypeUnitV2(data) {
  return request('/api/bar_patrol/myBaseInfo/treeForSelect', {
    method: 'post',
    data: data
  })
}

// 获取小车信息
export function getCarInfo(data) {
  return request('api/bar_patrol/myBaseInfo/getCarInfo', {
    method: 'post',
    data: data
  })
}
// 单元和栏位 下发指令
export function setSpecifiedRFID(data) {
  return request('api/bar_patrol/myBarPatrolCar/setSpecifiedRFID', {
    method: 'post',
    data: data
  })
}
// 单元栏位数指令下发
export function setSpecifiedStyAmount(data) {
  return request('api/bar_patrol/myBarPatrolCar/setSpecifiedStyAmount', {
    method: 'post',
    data: data
  })
}

// 触发上报
export function setUpControl(data) {
  return request('api/bar_patrol/myBarPatrolCar/control/v2', {
    method: 'post',
    data: data
  })
}

// 获取小车综合状态  http://dev.imuyuan.com/api/bar_patrol/myBaseInfo/getEquipmentInfo/composite/status
export function getCarStatus(data) {
  return request('api/bar_patrol/myBaseInfo/getEquipmentInfo/composite/status', {
    method: 'post',
    data: data
  })
}

// 清除巡栏计划 http://dev.imuyuan.com/api/bar_patrol/myBpCarInspectPlan/clear?carNumber=0002572468043034484205DDFF31
export function clearPlans(data) {
  return request('api/bar_patrol/myBpCarInspectPlan/clear?carNumber=' + data.carNumber, {
    method: 'post',
    data: data
  })
}

// 轨道类型 指令下发/api/bar_patrol/myBarPatrolCar/setTrackType
export function setTrackType(data) {
  return request('/api/bar_patrol/myBarPatrolCar/setTrackType', {
    method: 'post',
    data: data
  })
}

// 气体传感器 指令下发api/bar_patrol/myBarPatrolCar/setGasSensorType
export function setGasSensorType(data) {
  return request('api/bar_patrol/myBarPatrolCar/setGasSensorType', {
    method: 'post',
    data: data
  })
}

// 重启小车 api/bar_patrol/newMyBarPatrolCar/carStop
export function resetCar(data) {
  return request('api/bar_patrol/newMyBarPatrolCar/carStop', {
    method: 'post',
    data: data
  })
}

// 巡检类型 指令下发 /api/bar_patrol/newMyBarPatrolCar/changeMode
export function changeMode(data) {
  return request('/api/bar_patrol/newMyBarPatrolCar/changeMode', {
    method: 'post',
    data: data
  })
}

// 设置小车充电阈值 指令下发 /api/bar_patrol/newMyBarPatrolCar/setBatteryThreshold
export function setBatteryThreshold(data) {
  return request('/api/bar_patrol/newMyBarPatrolCar/setBatteryThreshold', {
    method: 'post',
    data: data
  })
}
