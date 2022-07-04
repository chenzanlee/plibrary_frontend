/*
 @file 基础信息维护-设备参数模板
 */

import request from '@/http/http'

// 获取主键ID
export function alarmNoticeConfig(data) {
  return request('/api/unit_evc/alarmNoticeConfig/get', {
    method: 'get',
    params: data
  })
}

// 更新接口
export function alarmNoticeConfigPut(data) {
  return request('/api/unit_evc/alarmNoticeConfig/update', {
    method: 'put',
    data: data
  })
}

/* 告警系统设置页面 */
