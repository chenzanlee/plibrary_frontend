const temperatureDataExport =
{
  path: 'temperatureDataExport',
  meta: { title: '温度数据导出', icon: 'Map', noCache: true },
  component: () => import('@/views/IntelligentControl/temperatureDataExport/page')
}

export default temperatureDataExport
