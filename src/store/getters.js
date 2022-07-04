/**
 *
 * @file vuex派生的状态
 * @author author-name(李红波 15537053107)
 */

const getters = {
  sidebar: state => state.app.sidebar,
  fullScreen: state => state.app.fullScreen
  // addRouters: state => state.permission.addRouters
}
export default getters
