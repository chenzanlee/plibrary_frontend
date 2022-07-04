
import request from '@/http/http'

// 获取场区设备故障统计数据
export function getParamsChangeStatsData(data) {
  return request('/api/unit_evc/paramsChange/getParamsChangeStatsData', {
    method: 'get',
    params: data
  })
}

// 获取大区设备分布树状信息
export function treeForRegionArea(data) {
  return request('/api/unit_evc/myBaseFieldUnit/getRegionAreaFieldTree', {
    method: 'get',
    params: data
  })
}
