/* eslint-disable no-unreachable */
// 天气图标
class WeatherService {
  WEATHER_ARR = {
    0: '雪',
    1: '沙',
    2: '尘',
    3: '冻雨',
    4: '冰雹',
    5: '台风',
    6: '霾',
    7: '雾',
    8: '阴',
    9: '雨',
    10: '晴',
    11: '云'
  }
  weatcherType(weather) {
    for (const i in this.WEATHER_ARR) {
      if (weather.indexOf(this.WEATHER_ARR[i]) >= 0) {
        return i
      }
    }
  }
  getWeatherImg(weather) {
    if (weather) {
      const type = this.weatcherType(weather)
      switch (type) {
        case '0': return require('@/assets/image/weatherIcon/xue.svg'); break
        case '1': return require('@/assets/image/weatherIcon/yangsha.svg'); break
        case '2': return require('@/assets/image/weatherIcon/fuchen.svg'); break
        case '3': return require('@/assets/image/weatherIcon/dongyu.svg'); break
        case '4': return require('@/assets/image/weatherIcon/bingbao.svg'); break
        case '5': return require('@/assets/image/weatherIcon/taifeng.svg'); break
        case '6': return require('@/assets/image/weatherIcon/wumai.svg'); break
        case '7': return require('@/assets/image/weatherIcon/wu.svg'); break
        case '8': return require('@/assets/image/weatherIcon/yin.svg'); break
        case '9': return require('@/assets/image/weatherIcon/yu.svg'); break
        case '10': return require('@/assets/image/weatherIcon/qing.svg'); break
        case '11': return require('@/assets/image/weatherIcon/yin.svg'); break
        default: return null; break
      }
    }
  }
}
const weatherService = new WeatherService()
export default weatherService
