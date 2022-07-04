/**
 *
 * @file 存放异步读取/修改state的方法
 * @author author-name(李红波 15537053107)
 */
import { httpRequest } from '@/http/dispatch'
export default {
  getFeedInfo(context) {
    const interfaceData = context.state.feedBaseElements['fieldInfo']
    httpRequest({
      type: interfaceData.method,
      uri: interfaceData.uri,
      payload: {
        limit: 10000
      },
      callback: data => {
        const result = formatData(data.data.rows, [], 3)
        context.commit('SET_FEED_INFO', result)
      }
    })
  }
}

const formatData = function(data = [], fieldType, level) {
  let pro
  let area
  const list = []
  data.filter((item) => { // 过滤场区类型
    return fieldType.length === 0 ? true : fieldType.includes(item.FFieldTypeName)
  }).forEach((item) => {
    pro = list.find(proItem => proItem.value === item.FProID)
    if (!pro) {
      pro = {
        value: item.FProID,
        label: item.FProName
      }
      if (level > 1) {
        pro.children = []
      }
      list.push(pro)
    }
    if (level > 1) {
      area = pro.children.find(areaItem => areaItem.value === item.FAreaID)
      if (!area) {
        area = {
          value: item.FAreaID,
          label: item.FAreaName
        }
        if (level > 2) {
          area.children = []
        }
        pro.children.push(area)
      }
    }
    if (level > 2) {
      // 添加场区
      area.children.push({
        value: item.FFieldID,
        label: item.FFieldName
      })
    }
  })
  return list
}
