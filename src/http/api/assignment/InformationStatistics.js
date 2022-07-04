import request from '@/http/http'

// 任务管理 - 推送信息统计
export function informationList(data) {
  return request('/api/bar_patrol/myPushTask/list', {
    method: 'post',
    data: data
  })
}
// 任务管理 - 推送信息统计饼状图
export function informationChart(data) {
  return request('/api/bar_patrol/myPushTask/chart', {
    method: 'post',
    data: data
  })
}
// 获取选择器的内容(内容需要自己过滤)  http://localhost:8080/api/bar_patrol/myBaseInfo/treeForSelect
export function getRegionAreaFieldRoomTypeUnitV2(data) {
  return request('/api/bar_patrol/myBaseInfo/treeForSelect', {
    method: 'post',
    data: data
  })
}
