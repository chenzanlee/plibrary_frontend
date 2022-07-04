
import request from '@/http/http'

// 获取大区设备分布树状信息
export function treeForRegionArea(data) {
  return request('/api/unit_evc/myBaseInfo/getTreeForRegionArea', {
    method: 'get',
    params: data
  })
}

// 获取设备大区状态统计信息
export function getOfflineFields(data) {
  return request('/api/unit_evc/fieldOverview/getOfflineFields', {
    method: 'get',
    params: data
  })
}

// 获取品牌设备信息数据
export function getDistributedDeviceStats(data) {
  return request('api/unit_evc/fieldOverview/getDistributedDeviceStats', {
    method: 'get',
    params: data
  })
}

// 在线设备状况导出
export function fieldOverviewExport(data) {
  return request('api/unit_evc/fieldOverview/export', {
    method: 'get',
    params: data
  })
}
