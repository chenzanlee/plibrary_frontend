/*
 @file 基础信息维护-设备参数模板
 */

import request from '@/http/http'

// 获取选择器的内容(内容需要自己过滤)  http://localhost:8080/api/bar_patrol/myBaseInfo/treeForSelect
export function getRegionAreaFieldRoomTypeUnitV2(data) {
  return request('/api/bar_patrol/myBaseInfo/treeForSelect', {
    method: 'post',
    data: data
  })
}

// 设备信息维护接口
export function myEvcMcuInfo(data) {
  return request('/api/bar_patrol/myBpFieldUnitCar/list', {
    method: 'post',
    data: data
  })
}

// 设备类型接口
export function getEquipmentType(data) {
  return request('/api/bar_patrol/myBaseInfo/getEquipmentType', {
    method: 'post',
    data: data
  })
}

// 设备审核接口
export function review(data) {
  const url = '/api/bar_patrol/myBpFieldUnitCar/review?ids=' + data.ids

  return request(url, {
    method: 'post',
    data: data
  })
}

// 设备反审核接口
export function unreview(data) {
  const url = '/api/bar_patrol/myBpFieldUnitCar/unreview?ids=' + data.ids

  return request(url, {
    method: 'post',
    data: data
  })
}

// 设备下发接口

export function handedout(data) {
  const url = '/api/bar_patrol/myBpFieldUnitCar/handedout?carNumbers=' + data.carNumbers
  return request(url, {
    method: 'post',
    data: data
  })
}

// // 获取设备条码列表
// export function listEquipment(data) {
//   return request('/api/unit_evc/myEvcMcuInfo/listEquipment?controllerType=BUILDING_UNIT_CONTROLLER', {
//     method: 'post',
//     data: data
//   })
// }

// 新增 https://dev.imuyuan.com/api/bar_patrol/myBpFieldUnitCar/add

export function myEvcMcuInfoAdd(data) {
  return request('/api/bar_patrol/myBpFieldUnitCar/add', {
    method: 'post',
    data: data
  })
}

// 修改 https://dev.imuyuan.com/api/bar_patrol/myBpFieldUnitCar/update

export function myEvcMcuInfoUpdate(data) {
  return request('/api/bar_patrol/myBpFieldUnitCar/update', {
    method: 'put',
    data: data
  })
}

// 删除 https://dev.imuyuan.com/api/bar_patrol/myBpFieldUnitCar/delete?ids=1wurfaRUEiEreVl74pmd9x

export function myEvcMcuInfoDelete(data) {
  const url = '/api/bar_patrol/myBpFieldUnitCar/delete?ids=' + data.ids
  return request(url, {
    method: 'delete',
    data: data
  })
}

// 获取小车类型

export function getCarListHttp() {
  return request(`/api/bar_patrol/myBaseInfo/dict/1701023`, {
    method: 'get'
  })
}

// 获取设备型号
export function getVersionList(data) {
  return request('/api/bar_patrol/myBpFieldUnitCar/equipmentVersionList', { // 这个 正式环境不用了----
    method: 'post',
    data: data
  })
}

export function getMyBpFieldUnitCar(data) {
  return request(`/api/bar_patrol/myBpFieldUnitCar/getOne?mainId=${data}`, {
    method: 'get',
    params: data
  })
}

export function getTreeForSelectV2(data) {
  return request('/api/bar_patrol/myBaseInfo/treeForSelectV2', {
    method: 'post',
    data: data
  })
}

export function updateUnitCar(data) {
  return request('/api/bar_patrol/myBpFieldUnitCar/update', {
    method: 'put',
    data: data
  })
}

// 获取对应设备类型下的设备标识
export function getEquipmentTagList(data) {
  return request('/api/bar_patrol/myBpFieldUnitCar/equipmentList', {
    method: 'get',
    params: data
  })
}

// https://dev.imuyuan.com/api/bar_patrol/myBaseInfo/treeForSelectV2
export function getUnitList(data) {
  return request('/api/bar_patrol/myBpFieldUnitCar/equipmentList', {
    method: 'post',
    data: data // segmentId: "36176_13905"
  })
}

// api/bar_patrol/myBaseInfo/getListNoAuthDataForTree // 这个是一级一级加载区域数据的
export function getListNoAuthDataForTree(data) {
  return request('/api/bar_patrol/myBaseInfo/getListNoAuthDataForTree', {
    method: 'post',
    data: data // {level: "1" parentId: "-1"} {level: 2 parentId: "2"} {level: 3 parentId: "13902"}  {level: 4 parentId: "13902"}
  })
}

export function fieldEvcMcuInfo(data) {
  // return request('/api/bar_patrol/myBpCarConfig/list', {
  return request('/api/bar_patrol/styConf/listSelect', {
    method: 'get',
    data: data
  })
}
