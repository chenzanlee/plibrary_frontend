
import request from '@/http/http'

// 空圈管理获取级联列表
export function getTreeForRegionAreaField(data) {
  return request('/api/wlw/myBaseInfo/getTreeForDataAuthV2', {
    method: 'post',
    data: data
  })
}
