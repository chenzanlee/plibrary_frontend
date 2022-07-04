/**
 * 用于 获取不同的 肤色下的同一处的 资源文件的地址
 * @param {string} name 文件的名字
 * @param {string} type 文件的后缀名
 */
export function getImgUrl(name, type) {
  let url = ''
  const num = this.$store.state.echartStyle.allStyles.styleType
  if (!num) return null
  if (type === 'mp4') {
    url = require(`@/assets/video/${name}${num}.${type}`)
  } else {
    url = require(`@/assets/image/${name}${num}.${type}`)
  }
  return url
}
