export default {
  namespaced: true,
  state: () => ({
    buildingPigHouseParam: {}
  }),
  actions: {
    saveLastSearchParam({ commit, state }, payload) {
      commit('SAVE', payload)
    }
  },
  mutations: {
    'SAVE'(state, { name, value }) {
      state[name] = value
    }
  }
}
