
import request from '@/http/http'

// 获取场区设备故障统计数据
export function getAlarmStatsData(data) {
  return request('/api/unit_evc/myEquipmentUnlockInfo/queryEquipmentUnlockInfo', {
    method: 'post',
    data: data
  })
}

// 获取大区设备分布树状信息
export function treeForRegionArea(data) {
  return request('/api/unit_evc/myBaseInfo/treeForRegionArea', {
    method: 'get',
    params: data
  })
}
