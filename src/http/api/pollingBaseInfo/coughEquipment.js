import request from '@/http/http'

// 获取选择器的内容(内容需要自己过滤)  http://localhost:8080/api/bar_patrol/myBaseInfo/treeForSelect
export function myBpSoundDeviceList(data) {
  return request('/api/bar_patrol/myBpSoundDevice/list', {
    method: 'post',
    data: data
  })
}

// 设备审核接口
export function review(data) {
  const url = 'api/bar_patrol/myBpSoundDevice/review?ids=' + data.ids

  return request(url, {
    method: 'post',
    data: data
  })
}

// 设备反审核接口
export function unreview(data) {
  const url = '/api/bar_patrol/myBpSoundDevice/unreview?ids=' + data.ids

  return request(url, {
    method: 'post',
    data: data
  })
}

// 新增摄像头信息
export function addCarema(data) {
  return request('/api/bar_patrol/myBpSoundDevice/add', {
    method: 'post',
    data: data
  })
}

// 删除摄像头
export function myEvcMcuInfoDelete(data) {
  const url = '/api/bar_patrol/myBpSoundDevice/delete?ids=' + data.ids
  return request(url, {
    method: 'delete',
    data: data
  })
}

// 摄像头修改 /bar_patrol/myBpFieldUnitCameral/update
export function updateCarema(data) {
  const url = '/api/bar_patrol/myBpSoundDevice/update'
  return request(url, {
    method: 'put',
    data: data
  })
}
