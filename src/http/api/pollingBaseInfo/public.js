// 基础信息维护 公共接口
import request from '@/http/http'

// 分级加载区域 api/bar_patrol/myBaseInfo/getListDataForTree   {"parentId":"-1","level":"1"}
export function getListDataForTree(data) {
  return request('/api/bar_patrol/myBaseInfo/getListDataForTree', {
    method: 'post',
    data: data
  })
}

export function getListDataForTreecheck(data) {
  return request('/api/bar_patrol/myBpPigPushTarget/getPowerLevelList', {
    method: 'get',
    data: data
  })
}
