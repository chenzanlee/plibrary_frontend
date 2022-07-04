
export default {
  namespaced: true,
  state: () => ({
    gdMapTheme: 'amap://styles/dark' // 高德地图主题
  }),
  mutations: {
    'changeGdTheme'(state, type) {
      console.log('type---', type)
      const themeLight = 'amap://styles/normal' // 可选主题
      const themeDark = 'amap://styles/dark'
      const themeObj = {
        dark: themeDark,
        light: themeLight
      }
      state.gdMapTheme = themeObj[type]
    }
  }
}
