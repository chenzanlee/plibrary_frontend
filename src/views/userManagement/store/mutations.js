/**
 *
 * @file 存放同步读取/修改state的方法
 * @author author-name(李红波 15537053107)
 */

export default {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_REFRESHTOKEN: (state, token) => {
    state.refreshToken = token
  },
  SET_INFO: (state, info) => {
    state.user = info
  },
  SET_BYTES: (state, bytes) => {
    state.bytes = bytes
  }
}
