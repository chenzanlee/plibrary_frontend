import store from '@/store'
export const getTreeData = (that) => {
  // const data = localStorage.getItem('unitEvclogManagement') ? JSON.parse(localStorage.getItem('unitEvclogManagement')) : ''
  // return new Promise((resolve, reject) => {
  //   if (!data) {
  //     that.$httpRequest({
  //       type: 'GET',
  //       uri: '/unit_evc/myBaseFieldUnit/getRegionAreaFieldRoomTypeUnitV2',
  //       payload: '',
  //       callback: (res) => {
  //         if (res && res.status === 200 && res.rel) {
  //           const data = evcJsonh2Tree(res.data)
  //           localStorage.setItem('unitEvclogManagement', JSON.stringify(data))
  //           resolve(data)
  //         } else {
  //           reject([])
  //         }
  //       }
  //     })
  //   } else {
  //     resolve(data)
  //   }
  // })
  return new Promise((resolve, reject) => {
    const unitEvclogManagement = store.state.treeData.unitEvclogManagement
    if (!unitEvclogManagement.length) {
      store.dispatch('treeData/getTreeData').then(data => {
        resolve(data)
      }).catch(() => {
        reject([])
      })
    } else {
      resolve(unitEvclogManagement)
    }
  })
}
