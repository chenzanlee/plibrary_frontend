import request from '@/http/http'

// 获取设备的数据
export function getDeviceData(data) {
  return request('/api/unit_evc/fieldOverview/getDeviceStats', {
    method: 'get',
    params: data
  })
}

// 获取环控用户地图权限
export function treeForSelectV4(data) {
  return request('/api/unit_evc/myBaseFieldUnit/getRegionAreaFieldTree?isBuilding=false', {
    method: 'get',
    data: data
  })
}

// 获取用户关注的区域
export function attentionArea(data) {
  return request('/api/unit_evc/weatherCustomController/getUserConcernAreas', {
    method: 'get',
    params: data
  })
}

// 获取所有的子公司天气列表
export function allSubCompanyWeather(data) {
  return request('/api/unit_evc/myEvcWeatherInfo/getAllSubCompanyWeather', {
    method: 'get',
    params: data
  })
}
// 获取指定场区天气列表
export function myEvcWeatherInfo(data) {
  return request('/api/unit_evc/myEvcWeatherInfo/listWeather', {
    method: 'post',
    data: data
  })
}

// 配置关注的区域
export function setConcern(data) {
  return request('/api/unit_evc/weatherCustomController/config', {
    method: 'post',
    data: data
  })
}
// 获取所有子公司列表

export function getAllSubsidiary(data) {
  return request('/api/unit_evc/myBaseInfo/getSubcompanyList', {
    method: 'get',
    params: data
  })
}
// 获取关注过区域的天气列表
export function weatherCustomController(data) {
  return request('/api/unit_evc/weatherCustomController/config', {
    method: 'post',
    params: data
  })
}

// 获取所有子公司的设备信息

export function getAllSubCompanyDeviceStats(data) {
  return request('/api/unit_evc/fieldOverview/getDeviceStats', {
    method: 'get',
    params: data
  })
}

// 获取地图数据
export function getDeviceStats(data) {
  return request('/api/unit_evc/fieldOverview/getDeviceStats', {
    method: 'get',
    params: data
  })
}

// 获取猪舍环境数据
export function getPeriodData(data) {
  return request('/api/unit_evc/myEvcOperationDynamicsRealTime/getPeriodData', {
    method: 'post',
    data: data
  })
}
// 获取猪舍气体数据
export function getGasData(data) {
  return request('/api/unit_evc/midData/getGasData', {
    method: 'get',
    params: data
  })
}
// 获取猪舍预警数据
export function getGasWarningData(data) {
  return request('/api/unit_evc/midData/getGasWarningData', {
    method: 'get',
    params: data
  })
}

// 获取巡检用户地图权限
export function treeForRegionAreaField(data) {
  return request('/api/bar_patrol/myBaseInfo/treeForRegionAreaField', {
    method: 'post',
    data: data
  })
}

// 巡栏设备在线数据
export function getInpsectStats(data) {
  return request('/api/bar_patrol/fieldOverview/getInpsectStats', {
    method: 'get',
    params: data
  })
}

// 巡栏设备数据
export function getPatrolDeviceStats(data) {
  return request('/api/bar_patrol/fieldOverview/getDeviceStats', {
    method: 'get',
    params: data
  })
}
// 获取设备概览
export function getDeviceHistoryStatusDate(data) {
  return request('/api/bar_patrol/fieldOverview/getDeviceHistoryStatusDate', {
    method: 'post',
    data: data
  })
}
// 获取设备在线率
export function getDeviceStatusRateDate(data) {
  return request('/api/bar_patrol/fieldOverview/getDeviceStatusRateDate', {
    method: 'post',
    data: data
  })
}
// 获取导出
// export function export(data) {
//   return request('/api/bar_patrol/fieldOverview/export', {
//     method: 'get',
//     data: data
//   })
// }
// 数据导出
export function getExport(data) {
  let url = '/api/bar_patrol/fieldOverview/export?'
  for (const name in data) {
    url += name + '=' + data[name] + '&'
  }
  url += 'token=' + localStorage.getItem('MY-Admin-Token')
  window.open(url, 'left=0,meunbar=no,toolbar=no,scrollbar=yes,status=yes')
}

