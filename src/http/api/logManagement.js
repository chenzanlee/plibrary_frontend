
import request from '@/http/http'

// 获取当前点击数据
export function getAlarmDeviceInfo(data) {
  return request('/api/unit_evc/myEvcAlarmDataRealTime/getAlarmDeviceInfo', {
    method: 'get',
    params: data
  })
}

