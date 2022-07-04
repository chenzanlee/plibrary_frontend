import request from '@/http/http'

// 此接口为获取饲养员信息接口 三个概览 单元监控用
// /myBaseInfo/getFeedList
export function getFeedList(params) {
  const url = '/api/unit_evc/myBaseInfo/getFeedList'
  return request(url, {
    method: 'GET',
    params
  })
}
