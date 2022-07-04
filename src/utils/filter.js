import Vue from 'vue'
import store from '../store'

Vue.filter('noDataFile', function(val, name, type) {
  let url = ''
  const num = store.state.echartStyle.allStyles.styleType
  if (!num) return ''
  if (type === 'mp4') {
    url = require(`@/assets/video/${name}${num}.${type}`)
  } else {
    url = require(`@/assets/image/${name}${num}.${type}`)
  }
  return url
})
