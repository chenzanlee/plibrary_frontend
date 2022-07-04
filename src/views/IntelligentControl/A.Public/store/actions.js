/**
 *
 * @file 存放异步读取/修改state的方法
 * @author author-name(李红波 15537053107)
 */
export default {
  setMultiUnit({ commit }, multiUnit) {
    console.log('保存的单元设置信息', multiUnit)
    commit('SET_DEVICE_NAMES', multiUnit.deviceNames)
    commit('SET_UNIT_NAMES', multiUnit.unitNames)
    commit('SET_FIELD_ID', multiUnit.fieldId)
    commit('SET_FIELD_NAME', multiUnit.fieldName)
    commit('SET_DEVICE_VERSION_ID', multiUnit.deviceVersionId)
    commit('SET_ROOM_TYPE_ID', multiUnit.roomTypeId)
    commit('SET_DEVICE_VERSION_ID_FLAG', multiUnit.deviceVersionIdFlag)
  },
  saveLastSearchParam({ commit, state }, fieldDeviceParam) {
    commit('SET_FIELD_DEVICE_PARAM', fieldDeviceParam)
  }
}
