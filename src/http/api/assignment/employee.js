import request from '@/http/http'

// 获取选择器的内容(内容需要自己过滤)  http://localhost:8080/api/bar_patrol/myBaseInfo/treeForSelect
export function getRegionAreaFieldRoomTypeUnitV2(data) {
  return request('/api/bar_patrol/myBaseInfo/treeForSelect', {
    method: 'post',
    data: data
  })
}
export function getPushObjectList(data) {
  return request('/api/bar_patrol/myBpPigPushTarget/getPushObjectList', {
    method: 'get',
    params: data
  })
}
export function getHrPersonPostOne(data) {
  return request('/api/bar_patrol/myBpPigPushTarget/getHrPersonPostOne', {
    method: 'get',
    params: data
  })
}
export function getOneVo(data) {
  return request('/api/bar_patrol/myBpPigPushTarget/getOneVo', {
    method: 'get',
    params: data
  })
}

// 任务管理 - 员工管理 - 列表
// export function employeeList(data) {
//   return request('/api/bar_patrol/myBpPigPushTarget/list', {
//     method: 'post',
//     data: data
//   })
// }
export function employeeList(data) {
  return request('/api/bar_patrol/myBpPigPushTarget/getList', {
    method: 'get',
    params: data
  })
}
export function updatePowerTypeStatus(data) {
  return request('/api/bar_patrol/myBpPigPushTarget/updatePowerTypeStatus', {
    method: 'get',
    params: data
  })
}

// 任务管理 - 员工管理 - 审核
export function employeeReview(data) {
  const url = '/api/bar_patrol/myBpPigPushTarget/review?ids=' + data.ids
  return request(url, {
    method: 'post',
    data: data
  })
}

// 任务管理 - 员工管理 - 反审核
export function employeeUnreview(data) {
  const url = '/api/bar_patrol/myBpPigPushTarget/unreview?ids=' + data.ids
  return request(url, {
    method: 'post',
    data: data
  })
}

// 任务管理 - 员工管理 - 添加
export function employeeAdd(data) {
  return request('/api/bar_patrol/myBpPigPushTarget/addVo', {
    method: 'post',
    data: data
  })
}

// 任务管理 - 员工管理 - 编辑
export function employeeUpdate(data) {
  return request('/api/bar_patrol/myBpPigPushTarget/updateVo', {
    method: 'post',
    data: data
  })
}

// 任务管理 - 员工管理 - 删除
export function employeeDel(data) {
  const url = '/api/bar_patrol/myBpPigPushTarget/delete?ids=' + data.ids
  return request(url, {
    method: 'DELETE',
    data: data
  })
}
