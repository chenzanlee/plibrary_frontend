import request from '@/http/http'

// 猪群健康分析 - 首页 - 存栏量
export function amountPie(data) {
  return request('/api/bar_patrol/statistics/getLastInventoryByFieldAndSegment', {
    method: 'post',
    data: data
  })
}

// 猪群健康分析 - 首页 - 每周排名
export function rankOfWeek(data) {
  return request('/api/bar_patrol/statistics/rankOfWeek', {
    method: 'post',
    data: data
  })
}

// 猪群健康分析 - 首页 - 异常识别数据统计
export function unusualDataList(data) {
  return request('/api/bar_patrol/statistics/getUnusualDataList', {
    method: 'post',
    data: data
  })
}

// 猪群健康分析 - 首页 - 异常分布
export function unusualDataForChart(data) {
  return request('/api/bar_patrol/statistics/getUnusualDataForChart', {
    method: 'post',
    data: data
  })
}

// 猪群健康分析 - 首页 - 猪群分析
// endTime: "2020-09-18"
// fieldId: "15337699"
// segmentId: "13906"
// startTime: "2020-09-12"
// units: ["6"]
export function homeSwineryBar(data) {
  return request('/api/bar_patrol/statistics/getSwineryDataForChart', {
    method: 'post',
    data: data
  })
}
// 4级
export function getRegionAreaFieldRoomTypeUnitV2(data) {
  return request('/api/bar_patrol/statistics/treeToSegment', {
    method: 'post',
    params: data
  })
}
/**
 * 根据场区和工段获取单元列表
 * @param {fieldid:"厂区id",segmentId:"工段id"}
 */
export function getUnitListById(data) {
  return request('/api/bar_patrol/statistics/getUnitListByFieldIdAndSegmentId', {
    method: 'post',
    data: data
  })
}
/**
 * 根据场区和工段,单元列表获取 栏位
 * @param {fieldid:"厂区id",segmentId:"工段id"}
 */
export function getStyListById(data) {
  return request('/api/bar_patrol/statistics/getStyListByFieldIdAndSegmentId', {
    method: 'post',
    data: data
  })
}
// 猪群健康分析 - 首页 - 咳嗽分析
export function homeCoughLine(data) {
  return request('/api/bar_patrol/statistics/getCoughDataForChart', {
    method: 'post',
    data: data
  })
}

// 猪群健康分析 - 盘点估重 - chartline接口 {"fieldId":"15380178","segmentId":"13907","units":["18"]-单元列表,"stys":["1"]-栏位列表}
export function inventoryDataForChart(data) {
  return request('/api/bar_patrol/statistics/getInventoryDataForChart', {
    method: 'post',
    data: data
  })
}

// 猪群健康分析 - 盘点估重 - chartline接口
export function inventoryDataForTable(data) {
  return request('/api/bar_patrol/statistics/getInventoryDataForTable', {
    method: 'post',
    data: data
  })
}

// 猪群健康分析 - 症状分析 - chartline接口
export function symptomDataForChart(data) {
  return request('/api/bar_patrol/statistics/getHealthDataForChart', {
    method: 'post',
    data: data
  })
}

// 猪群健康分析 - 症状分析 - chartline接口
export function symptomDataForTable(data) {
  return request('/api/bar_patrol/statistics/getHealthDataForTable', {
    method: 'post',
    data: data
  })
}

// 猪群健康分析 - 咳嗽分析 - chartline接口
export function coughDataForChart(data) {
  return request('/api/bar_patrol/statistics/getCoughDataForChart', {
    method: 'post',
    data: data
  })
}

// 猪群健康分析 - 咳嗽分析 - chartline接口
export function coughDataForTable(data) {
  return request('/api/bar_patrol/statistics/getCoughDataForTable', {
    method: 'post',
    data: data
  })
}

// 猪群健康分析 - 水料检测 - chartline接口
export function feedDataForChart(data) {
  return request('/api/bar_patrol/statistics/getSlotDataforChart', {
    method: 'post',
    data: data
  })
}

// 猪群健康分析 - 水料检测 - chartline接口
export function feedDataForTable(data) {
  return request('/api/bar_patrol/statistics/getSlotDataforTable', {
    method: 'post',
    data: data
  })
}

// 获取猪群分析工段
export function getWorkSectionOfPigGroup(data) {
  return request('/api/bar_patrol/statistics/getLastInventoryByFieldAndSegmen', {
    method: 'post',
    data: data
  })
}

// 获取咳嗽分析工段
export function getCoughOfPigGroup(data) {
  return request('/api/bar_patrol/statistics/getSegmentListByFieldId', {
    method: 'post',
    data: data
  })
}

// 猪群分析&咳嗽分析 获得单元 api/bar_patrol/statistics/getUnitListByFieldIdAndSegmentId
export function getUnitDataList(data) {
  return request('/api/bar_patrol/statistics/getUnitListByFieldIdAndSegmentId', {
    method: 'post',
    data: data
  })
}
// 水料检测获取工段
export function getFeedSegmentList(data) {
  return request('/api/bar_patrol/statistics/getSegmentListByFieldId', {
    method: 'post',
    data: data
  })
}
// 症状分析获取工段
export function getSegementList(data) {
  return request('/api/bar_patrol/statistics/getSegmentListByFieldId', {
    method: 'post',
    data: data
  })
}
