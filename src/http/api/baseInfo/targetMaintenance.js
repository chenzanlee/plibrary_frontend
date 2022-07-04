/*
 @file 基础信息维护-设备参数模板
 */

import request from '@/http/http'

// 获取选择器的内容(内容需要自己过滤)
export function getRegionAreaFieldRoomTypeUnitV2(data) {
  return request('/api/unit_evc/noticeUserConfig/tree/unit-evc?viewType=ROOMTYPE', {
    method: 'get',
    params: data
  })
}

// 设备信息维护接口
export function getPageList(data) {
  return request('/api/unit_evc/alarmNoticeUser/getPageList', {
    method: 'get',
    params: data
  })
}

// 设备告警区域配置
export function noticeUserConfigSet(data) {
  const url = '/api/unit_evc/noticeUserConfig/config?userId=' + data.userId

  return request(url, {
    method: 'post',
    data: data
  })
}

// 获取配置区域信息
export function getNoticeAreaV3(data) {
  const url = '/api/unit_evc/noticeUserConfig/getNoticeAreaV3/unit-evc/' + data.id + '?viewType=ROOMTYPE'
  return request(url, {
    method: 'get',
    params: data
  })
}
// 获取配置区域信息1
export function getNoticeAreaClean(data) {
  const url = '/clean_produce/myBaseFieldUnit/treeForSelectV4'
  return request(url, {
    method: 'get'
    // params: data
  })
}

// 设备审核接口
export function review(data) {
  const url = '/api/unit_evc/alarmNoticeUser/review?ids=' + data.ids

  return request(url, {
    method: 'post',
    data: data
  })
}

// 设备反审核接口
export function unreview(data) {
  const url = '/api/unit_evc/alarmNoticeUser/unreview?ids=' + data.ids

  return request(url, {
    method: 'post',
    data: data
  })
}

// 获取设备条码列表
export function listEquipment(data) {
  return request('/api/unit_evc/myEvcMcuInfo/listEquipment?controllerType=BUILDING_UNIT_CONTROLLER', {
    method: 'post',
    data: data
  })
}

// 新增

export function alarmNoticeUserAdd(data) {
  return request('/api/unit_evc/alarmNoticeUser/add', {
    method: 'post',
    data: data
  })
}

// 修改

export function alarmNoticeUserUpdate(data) {
  return request('/api/unit_evc/alarmNoticeUser/update', {
    method: 'put',
    data: data
  })
}

// 删除

export function alarmNoticeUserDelete(data) {
  const ur = '/api/unit_evc/alarmNoticeUser/delete?ids=' + data.ids
  return request(ur, {
    method: 'delete',
    data: data
  })
}

/* 推送目标维护页面 */
