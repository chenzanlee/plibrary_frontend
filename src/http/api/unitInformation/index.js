import request from '@/http/http'

// 获取三级树
export function getTreeForRegionAreaField(data) {
  return request('/api/wlw/myBaseInfo/treeForRegionAreaField', {
    method: 'post',
    data: data
  })
}
// 获取工段
export function getSegmentInfo(data) {
  return request('/api/wlw/myBaseInfo/segmentInfo', {
    method: 'post',
    data: data
  })
}
// 获取猪舍类型
export function getRoomTypes(data) {
  return request('/api/wlw/myBaseInfo/roomTypes', {
    method: 'get',
    params: data
  })
}
