import request from '@/http/http'

export function getPatrolDataViewLevel(data) {
  return request('/api/bar_patrol/noToken/api/dataView/getPatrolDataViewLevel', {
    method: 'get',
    params: data
  })
}

export function getExceptionUnit(data) {
  return request('/api/bar_patrol/noToken/api/dataView/getExceptionUnit', {
    method: 'get',
    params: data
  })
}

export function getFeedDetailData(data) {
  return request('/api/dashboard/unitDetail/getFeedDetailData/' +
  `${data.fieldId}/${data.segmentId}/${data.unitNo}/${data.startDate}/${data.endDate}`, {
    method: 'get'
  })
}

export function getFeedDetailDataMap(data) {
  return request('/api/dashboard/unitDetail/getFeedDetailData/' +
  `${data.fieldId}/${data.segmentId}/${data.unitNo}/${data.time}`, {
    method: 'get'
  })
}

export function getUnitTodayInspectionNumber(data) {
  return request('/api/bar_patrol/noToken/api/dataView/getUnitTodayInspectionNumber', {
    method: 'get',
    params: data
  })
}

export function getSegmentUnitTree(data) {
  return request('/api/dashboard/baseInfo/getSegmentUnitTree', {
    method: 'get',
    params: data
  })
}

export function getAlarmInfosByField(data) {
  return request('/api/dashboard/baseInfo/getAlarmInfosByField', {
    method: 'get',
    params: data
  })
}

export function getUnitEvcData(data) {
  return request('/api/dashboard/dataView/getUnitEvcData', {
    method: 'get',
    params: data
  })
}

export function getAlarmFromPro(data) {
  return request('/api/dashboard/baseInfo/getAlarmFromPro', {
    method: 'post',
    data: data
  })
}

export function getAlarmFromWater(data) {
  return request('/api/dashboard/baseInfo/getAlarmFromWater', {
    method: 'post',
    data: data
  })
}

export function getFieldNewestExceptionInfo(data) {
  return request('/api/dashboard/baseInfo/getAlarmFromPatrol', {
    method: 'get',
    params: data
  })
}

export function getOneBySomeId(data) {
  return request('/api/dashboard/baseInfo/getOneBySomeId', {
    method: 'get',
    params: data
  })
}

