import hasAuth from './modules/hasAuth'
const importDirective = (Vue) => {
  Vue.directive('hasAuth', hasAuth)
}
export default importDirective
