/*
 @file 基础信息维护-设备参数模板
 */

import request from '@/http/http'

// 获取table表格数据
export function equipmentLists(data) {
  return request('/api/unit_evc/myDeviceArgsTemplate/pageList', {
    method: 'get',
    params: data
  })
}

// 删除表格数据
export function delEquipment(id) {
  return request('/api/unit_evc/myDeviceArgsTemplate/delete', {
    method: 'DELETE',
    params: {
      ids: id
    }
  })
}

// 获取设备类型
export function equipmentTypeLists(data) {
  return request('/api/unit_evc/myBaseInfo/getEquipmentType', {
    method: 'POST',
    data
  })
}

// 获取设备型号
export function equipmentModelLists(data) {
  return request('/api/unit_evc/myBaseInfo/getEquipmentVersion', {
    method: 'POST',
    data
  })
}

// 新增
export function addEquipment(data) {
  return request('/api/unit_evc/myDeviceArgsTemplate/add', {
    method: 'POST',
    data
  })
}

// 获取模板详情
export function equipmentDetail(data) {
  return request('/api/unit_evc/myDeviceArgsTemplate/info', {
    method: 'get',
    params: data
  })
}

// 修改
export function editEquipment(data) {
  return request('/api/unit_evc/myDeviceArgsTemplate/update', {
    method: 'PUT',
    data
  })
}

// 审核
export function examine(idlist) {
  return request('/api/unit_evc/myDeviceArgsTemplate/review', {
    method: 'POST',
    params: {
      ids: idlist
    }
  })
}

// 反审核
export function backExamine(idlist) {
  return request('/api/unit_evc/myDeviceArgsTemplate/unreview', {
    method: 'POST',
    params: {
      ids: idlist
    }
  })
}

/*
 @file 基础信息维护-设备信息维护
 */

/** ********************空圈******************************* */
//  获取单元信息
export function obtainEmptyCircleInfo(data) {
  return request('/api/unit_evc/myBaseFieldUnit/emptyStyUnit/field', {
    method: 'get',
    params: data
  })

// regionId: -11
// areaId: -101
// fieldId: -1001
}
// 保存单元信息
export function submitEmptyCircleInfo(data) {
  return request('/api/unit_evc/myBaseFieldUnit/emptyStyUnit/configForField', {
    method: 'post',
    data: data
  })
  // addedEmptyStyUnits
  // removedEmptyStyUnits
}

export function submitAddByField(data) {
  return request('/api/unit_evc/myAlarmSuspend/addByField', {
    method: 'post',
    data: data
  })
}

/** *****************************多单元参数设置****************************************** */
// 获取单元信息
export function getDevicesForField(data) {
  return request('/api/unit_evc/equipment/getDevicesForField', {
    method: 'get',
    params: data
  })

// fieldId: -1001
}

// 获取楼房猪舍单元信息
export function getDevicesByFieldForBuilding(data) {
  return request('/api/unit_evc/equipment/getDevicesByFieldForBuilding', {
    method: 'get',
    params: data
  })

// fieldId: -1001
// block: BLOCK_A
}
