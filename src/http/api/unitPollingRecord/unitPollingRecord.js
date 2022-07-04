/*
 @file 基础信息维护-设备参数模板
 */

import request from '@/http/http'

// 获取选择器的内容(内容需要自己过滤)
export function tree(data) {
  return request('/api/bar_patrol/myBaseInfo/treeForSelect', {
    method: 'post',
    data: data
  })
}

// 设备信息维护接口
export function myEvcMcuInfo(data) {
  return request('/api/bar_patrol/myBpStatistical/select', {
    method: 'post',
    data: data
  })
}

// 获取图片
export function getOne(data) {
  let url = '/api/bar_patrol/myBpUnitStock/getOne?'
  for (var i in data) {
    url += i + '=' + data[i] + '&'
  }
  return request(url, {
    method: 'get',
    data: data
  })
}

/* 设备信息维护页面 */
