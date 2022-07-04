<template>
  <div class="equipment-control">
    <div v-hasAuth="'buildingPigHouse:multiRoomUnitControl'" class="nav">
      <div class="option">
        <button class="btn-blue" @click="multiUnit()">多单元设备控制</button>
      </div>
    </div>
    <div v-loading="loading" class="equipment-body">

      <div class="row-2">
        <overview-box
          ref="humidifying"
          v-loading="humidifyingLoading"
          class="overview-box"
          :data="humidifying.data"
          :field-list="humidifying.fieldList"
        />

        <overview-box
          ref="water"
          v-loading="waterLoading"
          class="overview-box small"
          :data="water.data"
          :field-list="water.fieldList"
        />
        <overview-box
          ref="warmLight"
          v-loading="warmLightLoading"
          class="overview-box small"
          :data="warmLight.data"
          :field-list="warmLight.fieldList"
        />
        <overview-box
          ref="light"
          v-loading="lightLoading"
          class="overview-box small"
          :data="light.data"
          :field-list="light.fieldList"
        />
        <overview-box
          ref="alarm"
          v-loading="alarmLoading"
          class="overview-box small"
          :data="alarm.data"
          :field-list="alarm.fieldList"
        />
      </div>
      <div class="row-3">
        <overview-box
          ref="electricHeatingPlate"
          v-loading="electricHeatingPlateLoading"
          class="overview-box small"
          :data="electricHeatingPlate.data"
          :field-list="electricHeatingPlate.fieldList"
        />
        <overview-box
          ref="airInlet"
          v-loading="airInletLoading"
          class="overview-box small"
          :data="airInlet.data"
          :field-list="airInlet.fieldList"
        />
        <overview-box
          ref="AirOutlet"
          v-loading="AirOutletLoading"
          class="overview-box small"
          :data="AirOutlet.data"
          :field-list="AirOutlet.fieldList"
        />
        <overview-box
          ref="hotExchange"
          v-loading="hotExchangeLoading"
          class="overview-box small"
          :data="hotExchange.data"
          :field-list="hotExchange.fieldList"
        />
        <overview-box
          ref="sewage"
          v-loading="sewageLoading"
          class="overview-box small"
          :data="sewage.data"
          :field-list="sewage.fieldList"
        />
      </div>
      <div class="row-3">
        <overview-box
          ref="spray"
          v-loading="sprayLoading"
          class="overview-box small"
          :data="spray.data"
          :field-list="spray.fieldList"
          :checker-id="spray.checkerId"
        />
        <div class="flex flex-view small">
          <overview-box
            ref="stateTrigger"
            :data="stateTrigger.data"
            :field-list="stateTrigger.fieldList"
          />
          <overview-box
            ref="Reboot"
            :data="Reboot.data"
            :field-list="Reboot.fieldList"
          />
          <overview-box
            :data="stateParameters.data"
            :field-list="stateParameters.fieldList"
          />
          <overview-box
            :data="FactorySettings.data"
            :field-list="FactorySettings.fieldList"
          />
        </div>
        <div class="flex flex-view small" />
        <div class="flex flex-view small" />
        <div class="flex flex-view small" />
      </div>
      <!-- </el-col> -->
      <!-- </el-row> -->
    </div>
  </div>
</template>

<script>
// import { valueExist } from '@/common/utils'
import {
  mcuInstruction,
  UploadState,
  UploadParam,
  DevReboot,
  ResetDevInstall,
  FactorySetting

} from '@/http/api/pigHouse'
import OverviewBox from '@/views/IntelligentControl/fieldDeviceOverview/common/components/OverviewBox'
import rulesService from './utils/verification'
export default {
  components: {
    OverviewBox
  },
  inject: ['overviewDetail'],
  data() {
    return {
      loading: false,
      humidifyingLoading: false,
      waterLoading: false,
      warmLightLoading: false,
      lightLoading: false,
      alarmLoading: false,
      electricHeatingPlateLoading: false,
      airInletLoading: false,
      AirOutletLoading: false,
      hotExchangeLoading: false,
      sewageLoading: false,
      sprayLoading: false,
      isRefresh: false,
      deviceId: '4D5920363455484E501300570037',
      deviceName: '4SmfkBNuvB2k3vi987oern',

      humidifying: {
        data: {
          duration: 60,
          iPig3SRoomMcuDevCtrlType: 'G2Humidifying',
          open: true,
          percent: 100,
          way: 1
        },
        fieldList: {
          head: {
            title: '雾化盘控制',
            titleIcon: 'spray-ico',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.humidifying.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.humidifying.data
                  this.humidifyingLoading = true
                  this.mcuInstruction([data], 'humidifyingLoading')
                } else {
                  this.$message.error(rulesService.submitErrorTip)
                  return false
                }
              })
            }
          },
          body: [
            {
              label: '雾化盘开关',
              key: 'open',
              type: 'switch'
            },
            {
              label: '生效时长(秒)',
              key: 'duration',
              min: 0,
              max: 65535,
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },
      water: {
        data: {
          iPig3SRoomMcuDevCtrlType: 'Drink', way: 1, open: true, duration: 60, percent: 100
        },
        fieldList: {
          head: {
            title: '饮水控制',
            titleIcon: 'spray-ico',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.water.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.water.data
                  this.waterLoading = true
                  this.mcuInstruction([data], 'waterLoading')
                } else {
                  this.$message.error(rulesService.submitErrorTip)
                  return false
                }
              })
            }
          },
          body: [
            {
              label: '饮水开关',
              key: 'open',
              type: 'switch'
            },
            {
              label: '生效时长(秒)',
              key: 'duration',
              min: 0,
              max: 65535,
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },
      warmLight: {
        data: {
          iPig3SRoomMcuDevCtrlType: 'HeatLamp',
          duration: 60,
          open: true,
          way: 1
        },
        fieldList: {
          head: {
            title: '暖灯控制',
            titleIcon: 'warm-light',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.warmLight.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.warmLight.data
                  this.warmLightLoading = true
                  this.mcuInstruction([data], 'warmLightLoading')
                } else {
                  this.$message.error(rulesService.submitErrorTip)
                  return false
                }
              })
            }
          },
          body: [
            {
              label: '暖灯开关',
              key: 'open',
              type: 'switch'
            },
            {
              label: '生效时长(秒)',
              key: 'duration',
              min: 0,
              max: 65535,
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },
      light: {
        data: {
          iPig3SRoomMcuDevCtrlType: 'Lamp',
          duration: 60,
          open: true,
          way: 1
        },
        fieldList: {
          head: {
            title: '照明控制',
            titleIcon: 'warm-light',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.light.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.light.data
                  this.lightLoading = true
                  this.mcuInstruction([data], 'lightLoading')
                } else {
                  this.$message.error(rulesService.submitErrorTip)
                  return false
                }
              })
            }
          },
          body: [
            {
              label: '照明开关',
              key: 'open',
              type: 'switch'
            },
            {
              label: '生效时长(秒)',
              key: 'duration',
              min: 0,
              max: 65535,
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },

      alarm: {
        data: {
          duration: '60',
          iPig3SRoomMcuDevCtrlType: 'Alarm',
          open: true,
          percent: 100,
          way: 1
        },
        fieldList: {
          head: {
            title: '报警控制',
            titleIcon: 'warm-light',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.light.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.alarm.data
                  this.alarmLoading = true
                  this.mcuInstruction([data], 'alarmLoading')
                } else {
                  this.$message.error(rulesService.submitErrorTip)
                  return false
                }
              })
            }
          },
          body: [
            {
              label: '报警开关',
              key: 'open',
              type: 'switch'
            },
            {
              label: '生效时长(秒)',
              key: 'duration',
              min: 0,
              max: 65535,
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },

      electricHeatingPlate: {
        data: {
          duration: '60',
          iPig3SRoomMcuDevCtrlType: 'HotPlate',
          open: true,
          percent: 100,
          way: 1
        },
        fieldList: {
          head: {
            title: '电热板控制',
            titleIcon: 'warm-light',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.electricHeatingPlate.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.electricHeatingPlate.data
                  this.electricHeatingPlateLoading = true
                  this.mcuInstruction([data], 'electricHeatingPlateLoading')
                } else {
                  this.$message.error(rulesService.submitErrorTip)
                  return false
                }
              })
            }
          },
          body: [
            {
              label: '开关',
              key: 'open',
              type: 'switch'
            },
            {
              label: '生效时长(秒)',
              key: 'duration',
              min: 0,
              max: 65535,
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },

      airInlet: {
        data: {
          duration: '60',
          iPig3SRoomMcuDevCtrlType: 'AirInlet',
          open: true,
          percent: '60',
          way: 1
        },
        fieldList: {
          head: {
            title: '0级进风口滑窗控制',
            titleIcon: 'spray-ico',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.airInlet.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.airInlet.data
                  this.airInletLoading = true
                  this.mcuInstruction([data], 'airInletLoading')
                } else {
                  this.$message.error(rulesService.submitErrorTip)
                  return false
                }
              })
            }
          },
          body: [
            {
              label: '开启百分比(%)',
              key: 'percent',
              min: 0,
              max: 100,
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_100
            },
            {
              label: '生效时长(秒)',
              key: 'duration',
              min: 0,
              max: 65535,
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },

      AirOutlet: {
        data: {
          duration: '60',
          iPig3SRoomMcuDevCtrlType: 'AirOutlet',
          open: true,
          percent: '60',
          way: 1
        },
        fieldList: {
          head: {
            title: '4级出风口滑窗控制',
            titleIcon: 'air-outlet',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.AirOutlet.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.AirOutlet.data
                  this.AirOutletLoading = true
                  this.mcuInstruction([data], 'AirOutletLoading')
                } else {
                  this.$message.error(rulesService.submitErrorTip)
                  return false
                }
              })
            }
          },
          body: [
            {
              label: '开启百分比(%)',
              key: 'percent',
              min: 0,
              max: 100,
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_100
            },
            {
              label: '生效时长(秒)',
              key: 'duration',
              min: 0,
              max: 65535,
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },

      hotExchange: {
        data: {
          duration: '60',
          iPig3SRoomMcuDevCtrlType: 'HotExchange',
          open: true,
          percent: '60',
          way: 1
        },
        fieldList: {
          head: {
            title: '热交换风口滑窗控制',
            titleIcon: 'air-outlet',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.hotExchange.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.hotExchange.data
                  this.hotExchangeLoading = true
                  this.mcuInstruction([data], 'hotExchangeLoading')
                } else {
                  this.$message.error(rulesService.submitErrorTip)
                  return false
                }
              })
            }
          },
          body: [
            {
              label: '开启百分比(%)',
              key: 'percent',
              min: 0,
              max: 100,
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_100
            },
            {
              label: '生效时长(秒)',
              key: 'duration',
              min: 0,
              max: 65535,
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },

      sewage: {
        data: {
          duration: '60',
          iPig3SRoomMcuDevCtrlType: 'Sewage',
          open: true,
          percent: 100,
          way: 1
        },
        fieldList: {
          head: {
            title: '闸阀控制',
            titleIcon: 'warm-light',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.sewage.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.sewage.data
                  this.sewageLoading = true
                  this.mcuInstruction([data], 'sewageLoading')
                } else {
                  this.$message.error(rulesService.submitErrorTip)
                  return false
                }
              })
            }
          },
          body: [
            {
              label: '开关',
              key: 'open',
              type: 'switch'
            },
            {
              label: '生效时长(秒)',
              key: 'duration',
              min: 0,
              max: 65535,
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },

      spray: {
        checkerId: 1,
        data: {
          duration: 60,
          iPig3SRoomMcuDevCtrlType: 'Shower',
          open: true,
          percent: 100,
          way: 1
        },
        fieldList: {
          head: {
            title: '喷淋控制',
            titleIcon: 'spray-ico',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.spray.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.spray.data
                  this.sprayLoading = true
                  this.mcuInstruction([data], 'sprayLoading')
                } else {
                  this.$message.error(rulesService.submitErrorTip)
                  return false
                }
              })
            }
          },
          body: [
            {
              title: '线路ID',
              key: 'way',
              type: 'checker',
              defaultClass: '',
              selectedClass: '',
              list: [
                {
                  value: '喷淋1',
                  key: 1,
                  id: 1
                },
                {
                  value: '喷淋2',
                  key: 2,
                  id: 2
                }
              ]
            },
            {
              label: '喷淋开关',
              key: 'open',
              type: 'switch'
            },
            {
              label: '生效时长(秒)',
              key: 'duration',
              min: 0,
              max: 65535,
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },

      stateTrigger: {
        fieldList: {
          head: {
            title: '触发状态上报',
            authCode: 'buildingPigHouse:roomSelfControl',
            titleIcon: '',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.UploadState()
            }
          }
        }
      },
      stateParameters: {
        fieldList: {
          head: {
            title: '触发参数上报',
            authCode: 'buildingPigHouse:roomSelfControl',
            titleIcon: '',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.UploadParam()
            }
          }
        }
      },
      Reboot: {
        fieldList: {
          head: {
            title: '设备重启',
            authCode: 'buildingPigHouse:roomSelfControl',
            titleIcon: '',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.DevReboot()
            }
          }
        }
      },
      FactorySettings: {
        fieldList: {
          head: {
            title: '恢复出厂设置',
            authCode: 'buildingPigHouse:roomSelfControl',
            titleIcon: '',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.FactorySetting()
            }
          }
        }
      }
    }
  },

  mounted() {
  },
  methods: {
    multiUnit() {
      console.log('获取的依赖注入信息', this.overviewDetail)
      this.overviewDetail.isNotEnterMultiUnit = false
      this.overviewDetail.progressCtr = 'multiUnitControl'
    },
    mcuInstruction(data, moadlLoading) {
      console.log(moadlLoading)
      // console.log(this.overviewDetail.equiment_info.deviceId, this.overviewDetail.equiment_info.deviceName, this.overviewDetail.equiment_info.deviceId)
      console.log('设备控制发送的参数', data)
      console.log('获取的依赖注入信息', this.overviewDetail)
      const deviceId = this.overviewDetail.overview.deviceId
      const deviceName = this.overviewDetail.overview.deviceName
      // this.loading = true
      mcuInstruction({ deviceId, deviceName }, data).then((res) => {
        // this.loading = false
        this[moadlLoading] = false
        if (res.rel) {
          this.$message.success(res.message || '指令发送成功')
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        this[moadlLoading] = false
      })
    },
    UploadState(data) {
      const deviceId = this.overviewDetail.overview.deviceId
      const deviceName = this.overviewDetail.overview.deviceName
      this.loading = true
      UploadState({ deviceId, deviceName }, data).then((res) => {
        this.loading = false
        if (res.rel) {
          this.$message.success(res.message || '指令发送成功')
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    UploadParam(data) {
      const deviceId = this.overviewDetail.overview.deviceId
      const deviceName = this.overviewDetail.overview.deviceName
      this.loading = true
      UploadParam({ deviceId, deviceName }, data).then((res) => {
        this.loading = false
        if (res.rel) {
          this.$message.success(res.message || '指令发送成功')
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    DevReboot(data) {
      const deviceId = this.overviewDetail.overview.deviceId
      const deviceName = this.overviewDetail.overview.deviceName
      this.loading = true
      DevReboot({ deviceId, deviceName }, data).then((res) => {
        this.loading = false
        if (res.rel) {
          this.$message.success(res.message || '指令发送成功')
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    ResetDevInstall(data) {
      const deviceId = this.overviewDetail.equiment_info.deviceId
      const deviceName = this.overviewDetail.equiment_info.deviceName
      ResetDevInstall({ deviceId, deviceName }, data).then((res) => {
        if (res.rel) {
          this.$message.success(res.message)
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
      })
    },
    FactorySetting(data) {
      const deviceId = this.overviewDetail.overview.deviceId
      const deviceName = this.overviewDetail.overview.deviceName
      FactorySetting({ deviceId, deviceName }, data).then((res) => {
        if (res.rel) {
          this.$message.success(res.message)
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
      })
    }
  }
}
</script>

<style lang="scss" scoped>
// .equipment-control {
//   overflow: scroll;
//   &::-webkit-scrollbar {
//     display: none;
//   }
// }
// .equipment-body {
//   display: flex;
//   flex-wrap: wrap;
//   min-width: 1680px;
// }
.row-1,.row-2,.row-3{
  display: flex;
  flex-wrap: wrap;
}
.row-3{
  .flex-view{
    // align-content:space-between;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    padding-bottom: 20px;
    padding-right: 20px;
    .overview-box {
      margin: 0;
      flex: none;
      min-width: 0;
    }
  }
}
.overview-box {
  // height: 418px;
  margin-bottom: 20px;
  margin-right: 20px;
  // width: 20%;
  // width: 320px;
  flex: 1;
  min-width: 10%;
  &:nth-child(5n) {
    margin-right: 0;
  }
}
.small {
  height: auto;
}
.refresh {
  font-size: 12px;
  color: #f4f7ff;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  .name {
    margin-left: 10px;
  }
}
.nav {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 20px;
}
.btn-border,
.btn-blue {
  padding: 5px 15px;
  margin-left: 10px;
}
</style>
<style lang="scss">
.equipment-body{
  .el-form-item__error{
    top: 36px;
  }
}
</style>
