class Lodash {
  isObject(value) {
    const type = typeof value
    return value !== null && (type === 'object' || type === 'function')
  }
  merge(source, other) {
    if (!this.isObject(source) || !this.isObject(other)) {
      return other === undefined ? source : other
    }
    return Object.keys({
      ...source,
      ...other
    }).reduce((acc, key) => {
      acc[key] = this.merge(source[key], other[key])
      return acc
    }, Array.isArray(source) ? [] : {})
  }
}
const lodash = new Lodash()
export default lodash
