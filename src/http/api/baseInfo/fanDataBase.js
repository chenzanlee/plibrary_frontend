/*
 @file 基础信息维护-设备参数模板
 */

import request from '@/http/http'

// 获取风机名称
export function nameList(data) {
  return request('/api/unit_evc/myBaseInfo/dict/direct/1901', {
    method: 'get',
    params: data
  })
}
// 获取表单数据
export function getPageList(data) {
  return request('/api/unit_evc/myEvcWindConfig/pageList', {
    method: 'get',
    params: data
  })
}
// 获取风机类型
export function typeList(data) {
  return request('/api/unit_evc/myEvcUnitWindConfig/alternativeWindType', {
    method: 'get',
    params: data
  })
}

// 获取风机型号
export function modelList(data) {
  return request('/api/unit_evc/myBaseInfo/dict/direct/' + data.code, {
    method: 'get',
    params: {}
  })
}

// 反审核接口
export function unreview(data) {
  const url = '/api/unit_evc/myEvcWindConfig/unreview?ids=' + data.ids

  return request(url, {
    method: 'post',
    data: data
  })
}

// 审核接口
export function review(data) {
  const url = '/api/unit_evc/myEvcWindConfig/review?ids=' + data.ids

  return request(url, {
    method: 'post',
    data: data
  })
}

// 新增
export function tableAdd(data) {
  return request('/api/unit_evc/myEvcWindConfig/add', {
    method: 'post',
    data: data
  })
}

// 修改

export function tableUpdate(data) {
  return request('/api/unit_evc/myEvcWindConfig/update', {
    method: 'put',
    data: data
  })
}

// 删除
export function tableDelete(data) {
  const url = '/api/unit_evc/myEvcWindConfig/delete?ids=' + data.ids
  return request(url, {
    method: 'delete',
    data: data
  })
}

/* 风机数据库维护 */
