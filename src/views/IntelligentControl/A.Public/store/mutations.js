/**
 *
 * @file 存放同步读取/修改state的方法
 * @author author-name(李红波 15537053107)
 */

export default {
  SET_DEVICE_NAMES: (state, deviceNames) => {
    state.deviceNames = deviceNames
  },
  SET_UNIT_NAMES: (state, unitNames) => {
    state.unitNames = unitNames
  },
  SET_FIELD_ID: (state, fieldId) => {
    state.fieldId = fieldId
  },
  SET_FIELD_NAME: (state, fieldName) => {
    state.fieldName = fieldName
  },
  SET_DEVICE_VERSION_ID: (state, deviceVersionId) => {
    state.deviceVersionId = deviceVersionId
  },
  SET_ROOM_TYPE_ID: (state, roomTypeId) => {
    state.roomTypeId = roomTypeId
  },
  // deviceVersionIdFlag
  SET_DEVICE_VERSION_ID_FLAG: (state, deviceVersionIdFlag) => {
    state.deviceVersionIdFlag = deviceVersionIdFlag
  },
  SET_FIELD_DEVICE_PARAM: (state, fieldDeviceParam) => {
    state.fieldDeviceParam = fieldDeviceParam
  }
}
