/**
 * 封装一套类似react的请求方法
 */
import request from '@/http/http'
import { derive } from '@/http/api/exportData/export.js'
import { Message } from 'element-ui'
const beforeUri = '/api'
let timer = null
export const httpRequest = function(elements, noStatus) {
  if (!elements || !elements.uri) {
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      Message.error('温馨提示:用户访问权限不足!')
    }, 2000)
    return elements.callback({
      rel: false,
      msg: '温馨提示:用户访问权限不足!'
    })
  }
  let payload = {}
  if (
    elements.type.toUpperCase() === 'GET' ||
    elements.type.toUpperCase() === 'DELETE'
  ) {
    payload = {
      params: elements.payload
    }
  } else {
    payload = {
      data: elements.payload
    }
  }
  try {
    return request(beforeUri + elements.uri, {
      method: elements.type.toUpperCase(),
      ...payload
    })
      .then(response => {
        if (noStatus || (response && response.status === 200)) {
          if (elements.callback && typeof elements.callback === 'function') elements.callback(response)
        } else {
          if (elements.callback && typeof elements.callback === 'function') {
            elements.callback({
              rel: false,
              msg: (response && response.message) || '服务器内部错误'
            })
          }
        }
        if (elements.requestEnd && typeof elements.requestEnd === 'function') elements.requestEnd(response)
      })
      .catch(response => {
        if (elements.requestEnd && typeof elements.requestEnd === 'function') elements.requestEnd(response)

        if (elements.callback && typeof elements.callback === 'function') {
          elements.callback({
            rel: false,
            msg: (response && response.message) || '服务器内部错误'
          })
        }
      })
  } catch (error) {
    if (elements.callback && typeof elements.callback === 'function') {
      elements.callback({
        rel: false,
        msg: (error && error.message) || '服务器内部错误'
      })
    }
  }
}

/** 导出的公共方法(数据权限)*/
export const httpExport = function(elements) {
  if (!elements || !elements.uri) {
    return Message.error('温馨提示:用户访问权限不足!')
  }
  derive(beforeUri + elements.uri, elements.payload)
}
