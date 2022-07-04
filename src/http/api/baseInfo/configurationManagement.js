
/*
 @file 基础信息维护-设备参数模板
 */

import request from '@/http/http'

// 获取树状选择框数据

export function getRegionAreaFieldRoomTypeTree() {
  return request('/api/unit_evc/myBaseFieldUnit/getRegionAreaFieldRoomTypeTree', {
    method: 'get',
    params: {
      isBuilding: false
    }
  })
}

// 获取风机名称
export function nameList(data) {
  return request('/api/unit_evc/myEvcWindConfig/pageList', {
    method: 'get',
    params: data
  })
}
// 获取表单数据
export function getPageList(data) {
  return request('/api/unit_evc/myEvcUnitWindConfig/getList', {
    method: 'post',
    data: data
  })
}

// 反审核接口
export function unreview(data) {
  const url = '/api/unit_evc/myEvcUnitWindConfig/unreview?ids=' + data.ids

  return request(url, {
    method: 'post',
    data: data
  })
}

// 审核接口
export function review(data) {
  const url = '/api/unit_evc/myEvcUnitWindConfig/review?ids=' + data.ids

  return request(url, {
    method: 'post',
    data: data
  })
}

// 批量配置
export function tableAdd(data) {
  const url = '/api/unit_evc/myEvcUnitWindConfig/edit/batch?ids=' + data.ids
  return request(url, {
    method: 'post',
    data: data
  })
}

// 修改

export function tableUpdate(data) {
  return request('/api/unit_evc/myEvcUnitWindConfig/edit', {
    method: 'post',
    data: data
  })
}

// 删除
export function tableDelete(data) {
  const url = '/api/unit_evc/myEvcUnitWindConfig/delete?ids=' + data.ids
  return request(url, {
    method: 'delete',
    data: data
  })
}

/* 风机数据库维护 */
