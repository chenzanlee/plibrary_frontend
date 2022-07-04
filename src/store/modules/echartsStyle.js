/**
 * @author  honor
 * 用于配置echarts颜色样式
 */

export default {
  state: {
    allStyles: {
      // type: 1, // 用来判断主题颜色  1 深色，
      flag: false
    }
  },
  mutations: {
    changeStyle(state, payload) {
      state.allStyles = {
        flag: !state.allStyles.flag,
        ...payload
      }
    }
  }
}
