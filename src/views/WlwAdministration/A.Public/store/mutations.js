/**
 *
 * @file 存放同步读取/修改state的方法
 * @author author-name(李红波 15537053107)
 */
export default {
  SET_FEED_BASE_ELEMENTS(state, payload) {
    state.feedBaseElements = payload
  },
  SET_FEED_INFO(state, payload) {
    state.feedInfo = payload
  }
}
