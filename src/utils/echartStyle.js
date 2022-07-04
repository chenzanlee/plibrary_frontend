/**
 * 用于配置不同肤色下的echart的配色
 */
function whichStyle(val) {
  const echartCom = {
    light: {
      echartsBkColor: '#fff', // echarts背景色 环控--集团运维地图--更多信息
      legendTextColor: '#666666',
      xAxisColor: '#D1D7E0', // x轴颜色
      xAxisName: '#9B9B9B', // x轴类目颜色
      yAxisColor: '#D1D7E0', // y轴颜色
      yAxisName: '#9B9B9B', // y轴类目颜色
      tooltipColor: '#00A2FF',
      splitLineCol: '#DBE1EB', // 辅助线
      splitLineCol1: '#f2f2f2',
      titleColor: '#383840', // 标题
      subTitleColor: '#383844', // 子标题
      checkColor: '#666', // 仅用在疾病防控
      mapFontColor: '#00CEFF',
      test: '#FFFF00',
      saveAsImageBackgroundColor: '#fff',
      seriesColors: ['#E31717', '#00A9FF', '#117EFF', '#EC10DD', '#00DC8E', '#BAF100', '#FFBC45', '#FF7351']
    },
    dark: {
      echartsBkColor: '#153361',
      legendTextColor: '#CDD8F7',
      xAxisColor: '#3E477F',
      xAxisName: '#CDD8F7',
      yAxisColor: '#3E477F',
      yAxisName: '#CDD8F7',
      tooltipColor: '#1F3070',
      splitLineCol: '#4B497F',
      splitLineCol1: '#4B497F',
      titleColor: '#FFF',
      subTitleColor: '#AFAECF',
      checkColor: '#fff',
      mapFontColor: '#00CEFF',
      test: '#FF0000',
      saveAsImageBackgroundColor: '#001d44',
      seriesColors: ['#E31717', '#FDB900', '#FFFD70', '#EC10DD', '#3AFF87', '#EA3167', '#00DBFF', '#0075FF']
    }
  }
  let echartStyle = {}
  switch (val) {
    case 'light' : // 亮色
      echartStyle = { ...echartCom.light }
      echartStyle.styleType = 2
      break
    case 'dark' : // 暗色
      echartStyle = { ...echartCom.dark }
      echartStyle.styleType = 1
      break
    default : // 其他
      echartStyle = { ...echartCom.dark }
      echartStyle.styleType = 1
      break
  }
  return echartStyle
}
export { whichStyle }
