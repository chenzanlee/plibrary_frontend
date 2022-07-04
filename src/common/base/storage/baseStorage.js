/* eslint-disable no-useless-constructor */
/**
 *
 * @file Storage底层封装
 * @author author-name(李红波 15537053107)
 */

class Store {
  constructor(store) {
    // 检测是否支持localstorage
    if (!store) {
      return
    }
    this._store = store
  }

  /**
   * @function 判断类型
   * @param {any} para 必须参数，判断的值
   */
  _getType(para) {
    const type = typeof para
    if (type === 'number' && isNaN(para)) return 'NaN'
    if (type !== 'object') return type
    return Object.prototype.toString
      .call(para)
      .replace(/[\[\]]/g, '') // eslint-disable-line
      .split(' ')[1]
      .toLowerCase()
  }

  /**
   * @function 过滤值
   * @param {any} val 必须参数，过滤的值
   */
  _filterValue(val) {
    const vType = this._getType(val)
    const nullVal = ['null', 'undefined', 'NaN']
    const stringVal = ['boolen', 'number', 'string']
    if (nullVal.indexOf(vType) >= 0) return ''
    if (stringVal.indexOf(vType) >= 0) return val
    return JSON.stringify(val)
  }
  _deserialize(strVal, defaultVal) {
    if (!strVal) {
      return defaultVal
    }
    var val = ''
    try {
      val = JSON.parse(strVal)
    } catch (e) {
      val = strVal
    }
    return val !== undefined ? val : defaultVal
  }
  /**
   * @function 设置值
   * @param {string} _k 必须参数，属性
   * @param {any} _v 非必须参数，属性值
   */
  set(_k, _v) {
    if (!this._store) return
    const kType = this._getType(_k)
    if (kType === 'string') {
      this._store.setItem(_k, this._filterValue(_v))
    } else {
      console.log('key只能为字符串！')
    }
  }

  /**
   * @function 获取值
   * @param {string} _k 必须参数，属性
   */
  get(_k) {
    if (!this._store) return
    let res
    const kType = this._getType(_k)
    if (kType === 'string') {
      res = this._store.getItem(_k)
    } else {
      console.log('key只能为字符串！')
    }
    return this._deserialize(res)
  }

  /**
   * @function 判断是否存在
   * @param {string} _k 必须参数，属性
   */
  has(_k) {
    return this.get(_k) !== undefined
  }

  /**
   * @function 移除值
   * @param {string} _k 必须参数，属性
   */
  remove(_k) {
    if (!this._store) return
    const kType = this._getType(_k)
    if (kType === 'string') {
      return this._store.removeItem(_k)
    } else {
      console.log('key只能为字符串！')
    }
  }

  /**
   * @function 移除所有
   */
  clear() {
    if (!this._store) return
    this._store.clear()
  }

  /**
   * @function 获取所有
   */
  getAll() {
    if (!this._store) return
    return this._store
  }
  /**
   * @function 遍历存储
   * @param {string} callback 回调函数
   */
  forEach(callback) {
    if (!this._store) return
    for (let i = 0; i < this._store.length; i++) {
      const key = this._store.key(i)
      callback(key, this.get(key))
    }
  }
}

class LocalStorage extends Store {
  constructor(store) {
    super(store)
  }
}

class SessionStorage extends Store {
  constructor(store) {
    super(store)
  }
}

const lStorage = new LocalStorage(window.localStorage || localStorage)
const sStorage = new SessionStorage(window.sessionStorage || sessionStorage)

export { lStorage, sStorage }
