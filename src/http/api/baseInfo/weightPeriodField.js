/*
 @file 场区-
 */

import request from '@/http/http'

// 期次
export function getPeriodInfo(data) {
  const url = '/api/feed_scheduling/myYyBaseInfo/periodInfo'
  return request(url, {
    method: 'post',
    data: data
  })
}

// 工段
export function getSegmentInfo(data) {
  const url = '/api/feed_scheduling/myYyBaseInfo/segmentInfo'
  return request(url, {
    method: 'post',
    data: data
  })
}
// 获取营养套餐
export function getNutritionList(data) {
  return request('/api/feed_scheduling/myYyBaseInfo/getNutritionList', {
    method: 'post',
    data: data
  })
}

// 获取膘情
export function getDictCode(data) {
  return request(`/api/feed_scheduling/myYyBaseInfo/dict/code/1102`, {
    method: 'get',
    params: data
  })
}

/* 场区- */
