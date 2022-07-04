import request from '@/http/http'

// 获取场区指定猪舍信息
export function getFieldPigInfo(data) {
  return request('/api/unit_evc/myBaseInfo/getFieldPigInfo', {
    method: 'get',
    params: data
  })
}
// 获取指定日期内天气
export function getListWeather(data) {
  return request('/api/unit_evc/myEvcWeatherInfo/listWeather', {
    method: 'post',
    data: data
  })
}
// 、、、/equipment/getDevicesByField
export function getDevicesreportTime(data) {
  return request('/api/unit_evc/equipment/getDevicesByField', {
    method: 'get',
    params: data
  })
}
export function getOutdoorWeatherStationByDeviceIds(data) {
  return request('/api/unit_evc/equipment/getOutdoorWeatherStationByDeviceIds', {
    method: 'get',
    params: data
  })
}

// 获取猪舍环境数据
export function getPigOneInfo(data) {
  return request('/api/unit_evc/myEvcOperationDynamicsRealTime/getOne', {
    method: 'get',
    params: data
  })
}
// 获取猪舍数据
export function getPigUnit(data) {
  return request('/api/unit_evc/myBaseInfo/getFieldPigMsgInfo', {
    method: 'get',
    params: data
  })
}
// 获取饲养员
export function getFeedList(data) {
  return request('/api/unit_evc/myBaseInfo/getFeedList', {
    method: 'get',
    params: data
  })
}
// 获取大区列表
export function getRegionAreaFieldTree(data) {
  return request('/api/unit_evc/myBaseFieldUnit/getRegionAreaFieldTree', {
    method: 'get',
    params: data
  })
}
// 告警信息
export function getAlarmInfosByField(data) {
  return request('/api/unit_evc/equipment/getAlarmInfosByField', {
    method: 'get',
    params: data
  })
}
// 场区设备列表
export function getDevicesByField(data) {
  return request('/api/unit_evc/equipment/getDevicesByField', {
    method: 'get',
    params: data
  })
}
// 获取场区设备ID
export function getEquipmentId(data) {
  return request('/api/clean_produce/myCpContaminantDevice/infoByField', {
    method: 'get',
    params: data
  })
}

// 根据设备id获取ou值
export function getEquipmentOu(data) {
  return request('/api/clean_produce/contaminant/lastest', {
    method: 'get',
    params: data
  })
}

// 管链纤细
export function pipeChainInfo(data) {
  return request(`/api/feed_scheduling/myYyRequirement/selectTotalInfo`, {
    method: 'get',
    params: data
  })
}
// 获取详情头部的设备详情
export function getDeviceInfoByUnit(data) {
  return request(`/api/unit_evc/myEvcOperationDynamicsRealTime/getDeviceInfoByUnit`, {
    method: 'get',
    params: data
  })
}
// 初始化导出文件
export function initFile(data) {
  return request(`/api/unit_evc/myEvcOperationDynamicsRealTime/export`, {
    method: 'get',
    params: data
  })
}

// 导出
export function exportFile(data) {
  return request(`/api/unit_evc/myEvcOperationDynamicsRealTime/file/url`, {
    method: 'get',
    params: data
  })
}
// 设备告警信息
export function alarmInfo(data) {
  return request(`/api/unit_evc/myEvcAlarmDataRealTime/getAlarmDetails`, {
    method: 'get',
    params: data
  })
}
// 获取首页基础信息
export function myBaseFieldInfo(data) {
  return request(`/api/unit_evc/myBaseFieldInfo/getInfo`, {
    method: 'get',
    params: data
  })
}
