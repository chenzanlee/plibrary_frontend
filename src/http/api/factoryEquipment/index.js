import request from '@/http/http'

// 轨道巡检 - 场区设备概览
// export function factoryEquipment(data) {
//   return request('/api/bar_patrol/myBpFieldUnitCar/getDevicesByField', {
//     method: 'get',
//     params: data
//   })
// }
// 巡栏在线率概览
export function factoryEquipment(data) {
  return request('/api/bar_patrol/deviceView/getPieChartOverview', {
    method: 'get',
    params: data
  })
}
// 各单元设备概览
export function getSegmentDevicesByField(data) {
  return request('/api/bar_patrol/deviceView/getSegmentDevicesByField', {
    method: 'get',
    params: data
  })
}

