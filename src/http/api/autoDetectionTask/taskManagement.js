
import request from '@/http/http'

// 获取选择器的内容(内容需要自己过滤)
export function getRegionAreaFieldRoomTypeUnitV2(data) {
  return request('/api/unit_evc/myBaseFieldUnit/getRegionAreaFieldRoomTypeUnitV2', {
    method: 'get',
    params: data
  })
}
export function myEvcAlarmUnionLog(data) {
  return request('/api/unit_evc/myFieldAlarmAutoCheckTask/getList', {
    method: 'get',
    params: data
  })
}
export function getmyEvcAlarmUnionLogForTask(data) {
  return request('/api/unit_evc/myFieldAlarmAutoCheckTask/getStatsForTask', {
    method: 'get',
    params: data
  })
}
export function statsForTask(data) {
  return request('/api/unit_evc/myFieldAlarmAutoCheckTask/getStatsForTask', {
    method: 'get',
    params: data
  })
}
export function unitStatsForTask(data) {
  return request('/api/unit_evc/fieldAlarmCheckUnitStatus/getFieldStats', {
    method: 'get',
    params: data
  })
}
export function checkTask(data) {
  return request('/api/unit_evc/myFieldAlarmAutoCheckTask/check', {
    method: 'post',
    data: data
  })
}
