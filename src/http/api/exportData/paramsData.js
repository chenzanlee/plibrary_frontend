
import request from '@/http/http'

// 获取设备类型
export function getEquipmentType(data) {
  return request('/api/unit_evc/myBaseInfo/getEquipmentType', {
    method: 'post',
    data: data
  })
}

// 获取设备型号
export function getEquipmentVersion(data) {
  return request('/api/unit_evc/myBaseInfo/getEquipmentVersion', {
    method: 'post',
    data: data
  })
}

// 获取环控用户地图权限
export function treeForSelectV4(data) {
  return request('/api/unit_evc/myBaseFieldUnit/getRegionAreaFieldTree?isBuilding=false', {
    method: 'get',
    data: data
  })
}
