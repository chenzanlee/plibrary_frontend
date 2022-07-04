'use strict'
var strictUriEncode = require('strict-uri-encode')
var objectAssign = require('object-assign')
export function resetLocal() {
  // localStorage.removeItem('user-token')
  // localStorage.removeItem('refreshToken')
  // localStorage.removeItem('antd-pro-authority')
  localStorage.removeItem('userJurisdiction')
  // localStorage.removeItem('menu')
  // localStorage.removeItem('leftSeconds')
  // localStorage.removeItem('routerData')
  // localStorage.removeItem('bytes')
}
export function getConfigElement(pageName) {
  if (localStorage.userJurisdiction && localStorage.userJurisdiction !== 'undefined') {
    const elements = JSON.parse(localStorage.userJurisdiction)
    const pageElement = {}
    if (elements.status === 2100003) {
      resetLocal()
      window.location.reload()
    } else if (elements && !elements.elements) {
      resetLocal()
      window.location.reload()
    } else {
      elements.elements.forEach((item) => {
        if (item.code.split(':')[0] === pageName) {
          pageElement[item.code.split(':')[1]] = item
        }
      })
      return pageElement
    }
  } else {
    return null
  }
}

// 此方法处理对象删除空属性 并返回处理后的OBJ
export function deleteObjectPropertyOfno(obj) {
  const o = { ...obj }
  for (const key in o) {
    if (o[key] instanceof Array) { // 数组
      o[key].length === 0 && delete o[key]
    } else if (obj[key] === null || obj[key] === '' || obj[key] === undefined) {
      delete o[key]
    }
  }
  return o
}

// 小数与百分比转换
export function percentConvert(val, submit, text) {
  if (!val || val === null) {
    return ''
  }
  if (submit) { // 向后台提交
    return val && (parseFloat(val) / 100)
  } else {
    let temp = val && (val * 100).toFixed(2)
    if (text) {
      temp += text
    }
    return temp
  }
}

// 物料编码集合
export function generateMatList() {
  const arr = []
  for (let i = 65; i < 82; i += 1) {
    arr.push({ 'key': String.fromCharCode(i), 'value': String.fromCharCode(i) })
  }
  return arr
}

function encoderForArrayFormat(opts) {
  switch (opts.arrayFormat) {
    case 'index':
      return function(key, value, index) {
        return value === null ? [
          encode(key, opts),
          '[',
          index,
          ']'
        ].join('') : [
          encode(key, opts),
          '[',
          encode(index, opts),
          ']=',
          encode(value, opts)
        ].join('')
      }

    case 'bracket':
      return function(key, value) {
        return value === null ? encode(key, opts) : [
          encode(key, opts),
          '[]=',
          encode(value, opts)
        ].join('')
      }

    default:
      return function(key, value) {
        return value === null ? encode(key, opts) : [
          encode(key, opts),
          '=',
          encode(value, opts)
        ].join('')
      }
  }
}

function parserForArrayFormat(opts) {
  var result

  switch (opts.arrayFormat) {
    case 'index':
      return function(key, value, accumulator) {
        result = /\[(\d*)\]$/.exec(key)

        key = key.replace(/\[\d*\]$/, '')

        if (!result) {
          accumulator[key] = value
          return
        }

        if (accumulator[key] === undefined) {
          accumulator[key] = {}
        }

        accumulator[key][result[1]] = value
      }

    case 'bracket':
      return function(key, value, accumulator) {
        result = /(\[\])$/.exec(key)
        key = key.replace(/\[\]$/, '')

        if (!result) {
          accumulator[key] = value
          return
        } else if (accumulator[key] === undefined) {
          accumulator[key] = [value]
          return
        }

        accumulator[key] = [].concat(accumulator[key], value)
      }

    default:
      return function(key, value, accumulator) {
        if (accumulator[key] === undefined) {
          accumulator[key] = value
          return
        }

        accumulator[key] = [].concat(accumulator[key], value)
      }
  }
}

function encode(value, opts) {
  if (opts.encode) {
    return opts.strict ? strictUriEncode(value) : encodeURIComponent(value)
  }

  return value
}

function keysSorter(input) {
  if (Array.isArray(input)) {
    return input.sort()
  } else if (typeof input === 'object') {
    return keysSorter(Object.keys(input)).sort(function(a, b) {
      return Number(a) - Number(b)
    }).map(function(key) {
      return input[key]
    })
  }

  return input
}

export function extract(str) {
  return str.split('?')[1] || ''
}

export function parse(str, opts) {
  opts = objectAssign({ arrayFormat: 'none' }, opts)

  var formatter = parserForArrayFormat(opts)

  // Create an object with no prototype
  // https://github.com/sindresorhus/query-string/issues/47
  var ret = Object.create(null)

  if (typeof str !== 'string') {
    return ret
  }

  str = str.trim().replace(/^(\?|#|&)/, '')

  if (!str) {
    return ret
  }

  str.split('&').forEach(function(param) {
    var parts = param.replace(/\+/g, ' ').split('=')
    // Firefox (pre 40) decodes `%3D` to `=`
    // https://github.com/sindresorhus/query-string/pull/37
    var key = parts.shift()
    var val = parts.length > 0 ? parts.join('=') : undefined

    // missing `=` should be `null`:
    // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
    val = val === undefined ? null : decodeURIComponent(val)

    formatter(decodeURIComponent(key), val, ret)
  })

  return Object.keys(ret).sort().reduce(function(result, key) {
    var val = ret[key]
    if (Boolean(val) && typeof val === 'object' && !Array.isArray(val)) {
      // Sort object keys, not values
      result[key] = keysSorter(val)
    } else {
      result[key] = val
    }

    return result
  }, Object.create(null))
}

export function stringify(obj, opts) {
  var defaults = {
    encode: true,
    strict: true,
    arrayFormat: 'none'
  }

  opts = objectAssign(defaults, opts)

  var formatter = encoderForArrayFormat(opts)

  return obj ? Object.keys(obj).sort().map(function(key) {
    var val = obj[key]

    if (val === undefined) {
      return ''
    }

    if (val === null) {
      return encode(key, opts)
    }

    if (Array.isArray(val)) {
      var result = []

      val.slice().forEach(function(val2) {
        if (val2 === undefined) {
          return
        }

        result.push(formatter(key, val2, result.length))
      })

      return result.join('&')
    }

    return encode(key, opts) + '=' + encode(val, opts)
  }).filter(function(x) {
    return x.length > 0
  }).join('&') : ''
}
// 0-100两位小数
export const weight = {
  reg: /^(100|[1-9]?\d(\.\d{1,2})?)$/,
  msg: '0-100两位小数'
}

// 是否图片
export function isImage(str) {
  var reg = /\.(png|jpg|gif|jpeg|webp)$/
  return reg.test(str)
}

export function splitArray(array, size) {
  // 获取数组的长度，如果你传入的不是数组，那么获取到的就是undefined
  const { length } = array
  // 判断不是数组，或者size没有设置，size小于1，就返回空数组
  if (!length || !size || size < 1) {
    return []
  }
  // 核心部分
  let index = 0// 用来表示切割元素的范围start
  let resIndex = 0// 用来递增表示输出数组的下标

  // 根据length和size算出输出数组的长度，并且创建它。
  const result = new Array(Math.ceil(length / size))
  // 进行循环
  while (index < length) {
    // 循环过程中设置result[0]和result[1]的值。该值根据array.slice切割得到。
    result[resIndex] = array.slice(index, (index += size))
    resIndex += 1
  }
  // 输出新数组
  return result
}
// 饲料调度监控的地址
export function getMonitorAddr() {
  const envir = process.env.NODE_ENV
  if (envir === 'development') {
    // 测试版本
    return 'http://10.106.11.37:8085'
  } else {
    // 正式环境
    return 'http://10.106.10.10:8085'
  }
}
export function getSegmentName(segmentId) {
  const segmentList = [
    {
      value: '13905',
      label: '哺乳仔猪'
    },
    {
      value: '13906',
      label: '保育'
    },
    {
      value: '13907',
      label: '育肥'
    },
    {
      value: '13908',
      label: '后备'
    },
    {
      value: '13909',
      label: '怀孕'
    },
    {
      value: '13910',
      label: '泌乳母猪'
    },
    {
      value: '13911',
      label: '公猪'
    },
    {
      value: '21254',
      label: '空怀'
    },
    {
      value: '29535',
      label: '待配母猪'
    }
  ]
  const obj = segmentList.find(sg => segmentId === sg.value)
  return obj ? obj.label : null
}

// 防抖
export function debounce(fn, wait) {
  let timeout = null
  return function() {
    if (timeout !== null) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(fn, wait)
  }
}
