/**
 * 清洁生成所有api
 * @author: 李振
 * @email: liatping@163.com
 * @date: 2020/11/03 20:29
 */
import request from '@/http/http'
// 清洁生产 基础信息数据接口

const AddUrl = '/api/clean_produce' // 如果更换环境， 请修改此参数
// 获取生产实施率 regionId /dateView/getImplementation
export async function getProductEffect(params) {
  const url = AddUrl + '/dateView/getImplementation'
  return request(url, {
    method: 'GET',
    params
  })
}

// 获取清洁生产运行率 regionId  /dateView/getOnline
export async function getWorkingEffect(params) {
  const url = AddUrl + '/dateView/getOnline'
  return request(url, {
    method: 'GET',
    params
  })
}

// 获取执行状况 regionId /dateView/getImplementatione dateView/getImplementatione
export async function getImplementEffect(params) {
  const url = AddUrl + '/dateView/getImplementatione'
  return request(url, {
    method: 'GET',
    params
  })
}

// 获取实施排行 regionId /dateView/getImplementationOrder
export async function getImplementationOrder(params) {
  const url = AddUrl + '/dateView/getImplementationOrder'
  return request(url, {
    method: 'GET',
    params
  })
}

// 获取运行排行  /dateView/getOnlineOrder /dateView/getOnlineOrder
export async function getProductOrder(params) {
  const url = AddUrl + '/dateView/getOnlineOrder'
  return request(url, {
    method: 'GET',
    params
  })
}

// 除臭达标率  regionId  /dateView/getCompliance
export async function getDeodorizationEffect(params) {
  const url = AddUrl + '/dateView/getCompliance'
  return request(url, {
    method: 'GET',
    params
  })
}

// 除臭达标率排行 /dateView/getComplianceOrder
export async function getDeodorizationOrder(params) {
  const url = AddUrl + '/dateView/getComplianceOrder'
  return request(url, {
    method: 'GET',
    params
  })
}
// 地图 获取地图 /dateView/getMapData
export async function getCleanerMapDataTwo(params) {
  const url = AddUrl + '/dateView/getMapData'
  return request(url, {
    method: 'GET',
    params
  })
}
// 地图 /dateView/getDeviceStats // 获取
export async function getCleanerMapData(params) {
  const url = AddUrl + '/dateView/getDeviceStats'
  return request(url, {
    method: 'GET',
    params
  })
}
// 获取清洁生产用户地图权限 /dateView/treeForRegionAreaField
export function treeForRegionAreaField(data) {
  const url = AddUrl + '/dateView/treeForRegionAreaField'
  return request(url, {
    method: 'post',
    data: data
  })
}
// 大区概览 接口
// 获取场区分布数据 regionId areaId fieldId type /myBaseFieldUnit/getFieldsByRegion
export async function getOrigionData(params) {
  const url = AddUrl + '/myBaseFieldUnit/getFieldsByRegion'
  return request(url, {
    method: 'GET',
    params
  })
}

// 查询告警设备数量 /regionGet/getCountAlarm /regionGet/getCountAlarm
export async function getCountAlarm(params) {
  const url = AddUrl + '/regionGet/getCountAlarm'
  return request(url, {
    method: 'GET',
    params
  })
}
// 获取大区接口 /myBaseFieldUnit/getRegions
export async function getOrigions(params) {
  const url = AddUrl + '/myBaseFieldUnit/getRegions'
  return request(url, {
    method: 'GET',
    params
  })
}
// 根据大区获取场区 /dateView/getFieldOrder 卡片展示内容
export async function getFieldsData(params) {
  const url = AddUrl + '/dateView/getFieldOrder'
  return request(url, {
    method: 'GET',
    params
  })
}
// 厂区接口
// 厂区概览 获取存栏数据  fieldId status
export async function getPigNumber(params) {
  const url = AddUrl + '/myBaseInfo/getFieldTechnicInfo'
  return request(url, {
    method: 'GET',
    params
  })
}
// 厂区概览 获取天气 /myBaseInfo/getWeather fieldId
export async function getFieldWeather(params) {
  const url = AddUrl + '/myBaseInfo/getWeather'
  return request(url, {
    method: 'GET',
    params
  })
}
// 厂区概览 获取环境状况 /myOutdoorAirQuality/getLast  fieldId
export async function getEnverSta(params) {
  const url = AddUrl + '/myOutdoorAirQuality/getLast'
  return request(url, {
    method: 'GET',
    params
  })
}
// 厂区概览 获取操作日志 /myOutdoorAirQuality/getLast  fieldId
export async function getOperatRecord(params) {
  const url = AddUrl + '/operateLog/getPageList'
  return request(url, {
    method: 'POST',
    data: params
  })
}
// 厂区概览 获取告警数据 /equipmentAlarm/getPageList  fieldId
export async function getFilAlarmData(params) {
  const url = AddUrl + '/equipmentAlarm/getPageList'
  return request(url, {
    method: 'POST',
    data: params
  })
}
// 区域概览 查询加药设备数据 /deodorant/dosing/getDeodorantDosingByFieldId  fieldId
export async function getAddDrugData(params) {
  const url = AddUrl + '/deodorant/dosing/getDeodorantDosingByFieldId'
  return request(url, {
    method: 'GET',
    params
  })
}
// 区域概览接口 二级下拉树 myBaseFieldUnit/treeForSelectV5
export async function getAreas(params) {
  const url = AddUrl + '/myBaseFieldUnit/treeForSelectV5'
  return request(url, {
    method: 'GET',
    params
  })
}
// 区域概览 获取厂区 myBaseFieldUnit/getFieldByArea areaId
export async function getFields(params) {
  const url = AddUrl + '/myBaseFieldUnit/getFieldByArea'
  return request(url, {
    method: 'GET',
    params
  })
}

// 运行管理
// 楼房推送人员
// export async function getPullMan(params) {
//   const url = AddUrl + '/deviceRecord/getPageList'
//   return request(url, {
//     method: 'GET',
//     params
//   })
// }
// 运行管理
// /myNetTargetField/config  更新推送人员场区 POST
export async function updatePullMan(params) {
  const url = AddUrl + '/myNetTargetField/config'
  return request(url, {
    method: 'POST',
    data: params
  })
}
// /clean_produce/myNetTargetField/getOne 	获取推送人员场区 get
export async function getPullMan(params) {
  const url = AddUrl + '/myNetTargetField/getOne'
  return request(url, {
    method: 'GET',
    params
  })
}
// 	/clean_produce/myNetPushTarget/unreview 	推送人员反审核 p
export async function unExaminePullMan(params) {
  const url = AddUrl + '/myNetPushTarget/unreview'
  return request(url, {
    method: 'POST',
    params
  })
}
// 	/clean_produce/myNetPushTarget/review 推送人员审核p
export async function examinePullMan(params) {
  const url = AddUrl + '/myNetPushTarget/review'
  return request(url, {
    method: 'POST',
    params
  })
}
// 获取推送人员列表 p /api/clean_produce/myNetPushTarget/getPageList 10.106.11.37:8072/api/clean_produce/myNetPushTarget/getPageList
export async function getPullManList(params) {
  const url = AddUrl + '/myNetPushTarget/getPageList'
  return request(url, {
    method: 'POST',
    data: params
  })
}
// 	/clean_produce/myNetPushTarget/deleteById 删除推送人员 d
export async function delPullMan(params) {
  const url = AddUrl + '/myNetPushTarget/deleteById'
  return request(url, {
    method: 'DELETE',
    params
  })
}
//	/clean_produce/myNetPushTarget/updateResult 推送人员修改 p
export async function editPullManList(params) {
  const url = AddUrl + '/myNetPushTarget/updateResult'
  return request(url, {
    method: 'POST',
    data: params
  })
}
// 	/clean_produce/myNetPushTarget/add 新增推送人员 p
export async function addPullManList(params) {
  const url = AddUrl + '/myNetPushTarget/add'
  return request(url, {
    method: 'POST',
    headers: {
      frontAppCode: 'clean-produce'
    },
    data: params
  })
}

// 加药监控
// 参数下发 /deodorant/dosing/config
export async function putDrugOrder(params) {
  const url = AddUrl + '/deodorant/dosing/config'
  return request(url, {
    method: 'PUT',
    data: params
  })
}
// /mcu/info/getDeviceInfo 获取加药监控信息 fieldId equiptypeNames
export async function getAddDrugMoni(params) {
  const url = AddUrl + '/mcu/info/getDeviceInfo'
  return request(url, {
    method: 'GET',
    params
  })
}
// /myOperateValue/getPageList 加药浓度配比折线图 deviceId beginDate endDate page limit
export async function getAddDrugMap(params) {
  const url = AddUrl + '/myOperateValue/getPageList'
  return request(url, {
    method: 'GET',
    params
  })
}

// api/clean_produce/myBaseFieldUnit/treeForSelect 消息推送管理
// 大区场区树
export async function getOrigionTree(params) {
  const url = AddUrl + '/myBaseFieldUnit/treeForSelect'
  return request(url, {
    method: 'GET',
    params
  })
}

// myCpOutdoorAirQualityPushTarget/getPageList 获取table内容
export async function getMsgData(params) {
  const url = AddUrl + '/myCpOutdoorAirQualityPushTarget/getPageList'
  return request(url, {
    method: 'GET',
    params
  })
}

// /api/clean_produce/myCpOutdoorAirQualityPushTarget/add 消息推送 新增
export async function addMsgData(params) {
  const url = AddUrl + '/myCpOutdoorAirQualityPushTarget/add'
  return request(url, {
    method: 'POST',
    data: params
    // params
  })
}

// api/clean_produce/myCpOutdoorAirQualityPushTarget/review?ids=4QTeL8hto0GitGoPVff19v 消息推送 审核
export async function examinePullMsg(params) {
  const url = AddUrl + '/myCpOutdoorAirQualityPushTarget/review'
  return request(url, {
    method: 'POST',
    params
  })
}

// api/clean_produce/myCpOutdoorAirQualityPushTarget/unreview?ids=4QTeL8hto0GitGoPVff19v 消息推送 审核
export async function unExaminePullMsg(params) {
  const url = AddUrl + '/myCpOutdoorAirQualityPushTarget/unreview'
  return request(url, {
    method: 'POST',
    params
  })
}

// api/clean_produce/myCpOutdoorAirQualityPushTarget/update put 修改
export async function modifyPullMsg(params) {
  const url = AddUrl + '/myCpOutdoorAirQualityPushTarget/update'
  return request(url, {
    method: 'put',
    data: params
  })
}

// /api/clean_produce/myCpOutdoorAirQualityPushTarget/delete 删除
export async function delPullMsg(params) {
  const url = AddUrl + '/myCpOutdoorAirQualityPushTarget/delete'
  return request(url, {
    method: 'DELETE',
    params
  })
}

// 加药监控 总用水量 /deodorant/dosing/flow/1h/listByFieldId  fieldId start end
export async function getWaterData(params) {
  const url = AddUrl + '/deodorant/dosing/flow/1h/listByFieldId'
  return request(url, {
    method: 'GET',
    params
  })
}

// 加药监控 导出用水量折线 /deodorant/dosing/flow/1h/export fieldId start end deodorant/dosing/flow/1h/listByFieldId
export async function outPutWaterLine(params) {
  const url = AddUrl + '/deodorant/dosing/flow/1h/export'
  return request(url, {
    method: 'GET',
    params
  })
}

// // 加药监控 导出折线  fieldId start end  deodorant/dosing/flow/1h/export
// export async function outPutLine(params) {
//   const url = AddUrl + '/deodorant/dosing/flow/1h/export'
//   return request(url, {
//     method: 'GET',
//     params
//   })
// }

// // 加药监控 折线全局 deodorant/dosing/1h/listByFieldId
// export async function getAllLine(params) {
//   const url = AddUrl + '/deodorant/dosing/flow/1h/export'
//   return request(url, {
//     method: 'GET',
//     params
//   })
// }

// 加药监控 全局导出 /deodorant/dosing/1h/export
export async function outPutAllLine(params) {
  const url = AddUrl + '/deodorant/dosing/1h/export'
  return request(url, {
    method: 'GET',
    params
  })
}

// 加药监控 除用水量外的数据 deodorant/dosing/1h/listByFieldId start end fieldId
export async function getHisData(params) {
  const url = AddUrl + '/deodorant/dosing/1h/listByFieldId'
  return request(url, {
    method: 'GET',
    params
  })
}

// // 加药监控 用水量的数据 deodorant/dosing/1h/listByFieldId start end fieldId
// export async function get(params) {
//   const url = AddUrl + '/deodorant/dosing/1h/listByFieldId'
//   return request(url, {
//     method: 'GET',
//     params
//   })
// }
// 楼房告警日志 clean_produce/deviceRecord/getPageList
export async function getTowerOred(params) {
  const url = AddUrl + '/deviceRecord/getPageList'
  return request(url, {
    method: 'POST',
    data: params
  })
}
/** 除臭墙的接口*/
// 除臭墙的接口 除臭墙控制器——查询  /deodorantWallInfo/pageList?limit=20&page=1 g
export async function getOrdTableData(params) {
  const url = AddUrl + '/deodorantWallInfo/pageList'
  return request(url, {
    method: 'GET',
    params
  })
}
// 除臭墙的接口 除臭墙控制器——新增 /deodorantWallInfo/add POST
export async function addOrdTableData(params) {
  const url = AddUrl + '/deodorantWallInfo/add'
  return request(url, {
    method: 'POST',
    data: params
  })
}
// 除臭墙控制器——审核 /deodorantWallInfo/review?ids=6BnMbA1dsPquThmv705xc1  PUT
export async function examinePullOrdMsg(params) {
  const url = AddUrl + '/deodorantWallInfo/review'
  return request(url, {
    method: 'put',
    data: params
  })
}
// 除臭墙控制器—反审核 /deodorantWallInfo/unreview?ids=6BnMbA1dsPquThmv705xc1 PUT
export async function unExaminePullOrdMsg(params) {
  const url = AddUrl + '/deodorantWallInfo/unreview'
  return request(url, {
    method: 'put',
    data: params
  })
}
// 除臭墙控制器——删除 /deodorantWallInfo/del?ids=6BnMbA1dsPquThmv705xc1 D
export async function delOrdMsg(params) {
  const url = AddUrl + '/deodorantWallInfo/del'
  return request(url, {
    method: 'DELETE',
    data: params
  })
}
/** 氧化剂设备，就是  单片机维护 */
// 查询 mcu/info/pageList?areaId=&fieldId=&limit=20&page=1&regionId=&status=    g

// 增加 mcu/info/add

/** 臭气浓度 监测设备维护 */
// 查询 clean_produce/myCpContaminantDevice/pageList?areaId=&fieldId=&limit=20&page=1&regionId= get
export async function getOrdCheckTableData(params) {
  const url = AddUrl + '/myCpContaminantDevice/pageList'
  return request(url, {
    method: 'GET',
    params
  })
}
// 增加 myCpContaminantDevice/add POST  areaId: "15292358"
// areaName: "万荣"
// deviceId: "123445567"
// deviceName: "测试数据  "
// fieldId: "15323899"
// fieldName: "万荣1厂"
// regionId: "10"
// regionName: "西北"
export async function addOrdCheckTableData(params) {
  const url = AddUrl + '/myCpContaminantDevice/add'
  return request(url, {
    method: 'POST',
    data: params
    // params
  })
}
// 反审核 myCpContaminantDevice/unreview?ids=4xOcPp5n8jrxwQN8JvWXUp     put
export async function unExamineOrdCheckMsg(params) {
  const url = AddUrl + '/myCpContaminantDevice/unreview'
  return request(url, {
    method: 'put',
    // data: params
    params
  })
}
// 审核 myCpContaminantDevice/review?ids=4xOcPp5n8jrxwQN8JvWXUp  put
export async function examineOrdCheckMsg(params) {
  const url = AddUrl + '/myCpContaminantDevice/review'
  return request(url, {
    method: 'put',
    // data: params
    params
  })
}
// 删除 myCpContaminantDevice/delete?ids=3VFQzjRvB0dVJEYWFNX1lg
export async function delOrdCheckMsg(params) {
  const url = AddUrl + '/myCpContaminantDevice/delete'
  return request(url, {
    method: 'DELETE',
    // data: params
    params
  })
}
// 更新 /clean_produce/mcu/info/update
export async function updateOrdCheckMsg(params) {
  const url = AddUrl + '/myCpContaminantDevice/update'
  return request(url, {
    method: 'put',
    data: params
  })
}

/** 加药设备，就是单片机维护*/
// 查询 clean_produce/myCpContaminantDevice/pageList?areaId=&fieldId=&limit=20&page=1&regionId= get
export async function getDrugTableData(params) {
  const url = AddUrl + '/mcu/info/pageList'
  return request(url, {
    method: 'GET',
    params
  })
}
// 增加 myCpContaminantDevice/add POST  areaId: "15292358"
// areaName: "万荣"
// deviceId: "123445567"
// deviceName: "测试数据  "
// fieldId: "15323899"
// fieldName: "万荣1厂"
// regionId: "10"
// regionName: "西北"
export async function addDrugTableData(params) {
  const url = AddUrl + '/mcu/info/add'
  return request(url, {
    method: 'POST',
    data: params
  })
}
// 反审核 myCpContaminantDevice/unreview?ids=4xOcPp5n8jrxwQN8JvWXUp  /mcu/info/review?ids=4o26532Hhq53waaQzocbes
export async function unExamineDrugMsg(params) {
  const url = AddUrl + '/mcu/info/unreview'
  return request(url, {
    method: 'put',
    // data: params
    params
  })
}
// 审核 myCpContaminantDevice/review?ids=4xOcPp5n8jrxwQN8JvWXUp  put
export async function examineDrugMsg(params) {
  const url = AddUrl + '/mcu/info/review'
  return request(url, {
    method: 'put',
    // data: params
    params
  })
}
// 删除 myCpContaminantDevice/delete?ids=3VFQzjRvB0dVJEYWFNX1lg
export async function delDrugMsg(params) {
  const url = AddUrl + '/mcu/info/delete'
  return request(url, {
    method: 'DELETE',
    // data: params
    params
  })
}
// 更新 /clean_produce/mcu/info/update
export async function updateDrugMsg(params) {
  const url = AddUrl + '/mcu/info/update'
  return request(url, {
    method: 'put',
    // data: params
    params
  })
}
/**
 * 处理楼房除臭加药特殊的删除 重要 ，不要更改
 * @param {*} params
 * @param {*} url
 */
export async function delAPI1(params, url) {
  return request(`/api${url}`, {
    method: 'DELETE',
    data: params
  })
}
