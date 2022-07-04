
import request from '@/http/http'
// 获取温度曲线

export function getTemperatureCurveLinePoints(data) {
  const url = '/api/unit_evc/myEvcOperationDynamicsRealTime/getTemperatureCurveLinePoints'
  // for (const key in data) {
  //   url += `${key}=${data[key]}&`
  // }

  return request(url, {
    method: 'get',
    params: data
  })
}

// 获取湿度曲线
export function getHumidityCurveLinePoints(data) {
  const url = '/api/unit_evc/myEvcOperationDynamicsRealTime/getHumidityCurveLinePoints'
  // for (const key in data) {
  //   url += `${key}=${data[key]}&`
  // }
  return request(url, {
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
