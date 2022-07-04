import request from '@/http/http'

// 获取选择器的内容(内容需要自己过滤)
export function getRegionAreaFieldRoomTypeUnitV2(data) {
  return request('/api/unit_evc/myBaseFieldUnit/getRegionAreaFieldRoomTypeUnitV2', {
    method: 'get',
    params: data
  })
}
// 区域实时监控 柱状图
export function informationList(data) {
  return request('/api/unit_evc/myAlarmSummary/selectList', {
    method: 'post',
    data: data
  })
}
// 导出
export function exportDataList(data) {
  return request('/api/unit_evc/myAlarmSummary/selectList', {
    method: 'post',
    data: data
  })
}
