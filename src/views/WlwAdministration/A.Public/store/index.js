/**
 *
 * @file 引入模块对象拆分出来的文件，并导出store
 * @author author-name(李红波 15537053107)
 */

import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
