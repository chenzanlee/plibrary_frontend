/**
 *
 * @file 数组工具函数
 * @author author-name(李红波 15537053107)
 */

/**
 *
 *
 * @export 数据采集
 * @param {*} arr 采集的数组
 * @param {*} value 采集的值
 * @param {*} name 采集的属性
 * @returns
 */
export function collection(arr, value, name) {
  function findCherries(fruit) {
    if (name) {
      return fruit[name] === value
    } else {
      return fruit === value
    }
  }
  return arr.find(findCherries)
}

export function collectionMany(arr, value, name) {
  return arr.filter((item) => {
    return item[name] === value
  })
}
