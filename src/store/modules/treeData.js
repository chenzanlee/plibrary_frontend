import { evcJsonh2Tree } from '@/components/tree/evcJsonh2Tree.js'
import { httpRequest } from '@/http/dispatch.js'
export default {
  namespaced: true,
  state: () => ({
    unitEvclogManagement: []
  }),
  actions: {
    getTreeData({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        httpRequest({
          type: 'GET',
          uri: '/unit_evc/myBaseFieldUnit/getRegionAreaFieldRoomTypeUnitV2',
          payload: '',
          callback: (res) => {
            if (res && res.status === 200 && res.rel) {
              const data = evcJsonh2Tree(res.data)
              commit('SAVE', data)
              resolve(data)
            }
          }
        })
      })
    }
  },
  mutations: {
    'SAVE'(state, data) {
      state.unitEvclogManagement = data
    }
  }
}
