
import request from '@/http/http'

// 获取选择器的内容(内容需要自己过滤)
export function getRegionAreaFieldRoomTypeUnitV2(data) {
  return request('/api/unit_evc/myBaseFieldUnit/getRegionAreaFieldRoomTypeUnitV2', {
    method: 'get',
    params: data
  })
}
export function myEvcAlarmUnionLog(data) {
  return request('/api/unit_evc/myBaseFieldUnit/getFields', {
    method: 'get',
    params: data
  })
}
// 创建自检任务
export function AutoCheckTaskAdd(data) {
  return request('/api/unit_evc/myFieldAlarmAutoCheckTask/add', {
    method: 'post',
    data: data
  })
}
