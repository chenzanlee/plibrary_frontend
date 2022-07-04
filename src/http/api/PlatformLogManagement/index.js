import request from '@/http/http'

// 访问日志 请求列表
export function getLogTableList(data) {
  const url = '/api/unit_evc/myBpUserUsageLog/list'
  return request(url, {
    method: 'get',
    params: data
  })
}
// 行点击获取数据
export function getmyBpUserUsageLogOne(data) {
  const url = '/api/bar_patrol/myBpUserUsageLog/getOne'
  return request(url, {
    method: 'get',
    params: data
  })
}
