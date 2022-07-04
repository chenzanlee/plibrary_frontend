const buildingPigHouse = [{
  path: 'buildingPigHouse',
  name: 'buildingPigHouse',
  meta: { title: '楼房场区概览', icon: 'Map', noCache: true },
  component: () => import('@/views/IntelligentControl/buildingPigHouse/index')
},
{
  path: 'buildingPigHouse/orderHistory',
  name: 'pigHouseOrderHistory',
  meta: { title: '指令下发历史记录', icon: 'Device-Preview', noCache: true, hidden: true },
  component: () => import('@/views/IntelligentControl/buildingPigHouse/page/subpage/orderHistory')
},
{
  path: 'buildingPigHouse/detail',
  name: 'buildingPigHouseDetail',
  meta: { title: '楼房场区概览', icon: 'Map', noCache: true, hidden: true },
  component: () => import('@/views/IntelligentControl/buildingPigHouse/page/subpage/detail')
}]
export default buildingPigHouse
