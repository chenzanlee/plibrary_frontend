/* eslint-disable indent */
import request from '@/http/http'

// 获取table表格数据
export function equipmentLists(data) {
	return request('/api/unit_evc/myDeviceArgsTemplate/pageList', {
		method: 'get',
		params: data
	})
}
