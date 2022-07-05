/*
 @file 场区日志-控制指令日志
 */

import request from '@/http/http'
// 获取控制指令日志 （场区指令日志页面）
export function controlInstruction(data) {
  return request('/api/unit_evc/evc/instruction/logs', {
    method: 'get',
    params: data
  })
}

// 获取选择器的内容(内容需要自己过滤)
export function getRegionAreaFieldRoomTypeUnitV2(data) {
  return request('/api/unit_evc/myBaseFieldUnit/getRegionAreaFieldRoomTypeUnitV2', {
    method: 'get',
    params: data
  })
}

/*
 @file 场区日志-场区单元报警日志
 */

// 获取场区单元报警日志 (报警日志推送页面)
export function siteUnitAlarmPushLog(data) {
  return request('/api/unit_evc/myEvcPushLog/pageListV2', {
    method: 'get',
    params: data
  })
}

// 获取场区单元报警日志 (参数变更日志见面)
export function siteUnitAlarmLog(data) {
  return request('/api/unit_evc/myEvcPushLog/pageListV1', {
    method: 'get',
    params: data
  })
}

// 告警日志合并 （报警日志合并页面）
export function myEvcAlarmUnionLog(data) {
  return request('/api/unit_evc/myEvcAlarmUnionLog/list', {
    method: 'get',
    params: data
  })
}

// 场区告警日志 (场区告警日志页面)

export function fieldWranningList(data) {
  return request('/api/unit_evc/myEvcAlarmLog/pageList', {
    method: 'get',
    params: data
  })
}
// 单元报警日志导出
export function alarmLogExport(data) {
  return request('api/unit_evc/myEvcAlarmDataRealTime/alarmLog/export', {
    method: 'get',
    params: data
  })
}

// 数据导出
export function derive(baseUrl, data) {
  let url = baseUrl + '?'
  for (const name in data) {
    url += name + '=' + data[name] + '&'
  }
  // eslint-disable-next-line no-unused-vars
  var newWindow

  url += 'token=' + localStorage.getItem('TOKEN')
  newWindow = window.open(url, 'left=0,meunbar=no,toolbar=no,scrollbar=yes,status=yes')
  // newWindow=window.open('http://localhost:8080')
  setTimeout(function() {
    // newWindow.close();
  }, 2000)
}

// 参数上报日志

// 参数上报日志列表
// /api/unit_evc/paramReportLog/pushLogs
// ?areaId=-101&block&fieldId=-1001&fromTime=2020-10-26%2016%3A53%3A49&
// pageIndex=1&pageSize=20&regionId=-11&roomTypeId=13906&toTime=2020-10-27%2016%3A53%3A54&unitName=67
export function getPushLogsList(data) {
  return request('/api/unit_evc/paramReportLog/pushLogs', {
    method: 'get',
    params: data
  })
}
