/*
 @file 指令下发
 */

import request from '@/http/http'
// 获取下发指令信息
export function getOrderListAll(data) {
  return request('/api/unit_evc/evcMultiUnitParamsSet/getPageList', {
    method: 'get',
    params: data
  })
  // data:{fieldId=-1001&limit=20&page=1}
  // alldata:{ endTime= &fieldId=-1001&limit=20&operator=%E6%9D%8E%E5%BD%AC&page=1&startTime=}
}
// 查看详细信息
export function getOrderDetail(data) {
  return request('/api/unit_evc/evcParamsetDeviceDispatchStats/getPageList', {
    method: 'get',
    params: data
  })
  // data:{limit=20&mainId=5cMVuXKw6UQVOGProaFJDt&page=1}
}
