<template>
  <div class="multi-unit-control">
    <div class="header">
      <div class="title">选择的单元:</div>
      <ul class="unit-list">
        <li
          v-for="(item, index) in IntelligentControl.unitNames"
          :key="index"
          class="unit-item"
        >
          {{ item }}
        </li>
      </ul>
    </div>
    <div class="nav multi-unit-nav">
      <div class="option">
        <el-popconfirm
          title="确定发送指令到设备吗？"
          @onConfirm="singleUnit()"
        >
          <el-button slot="reference" class="btn-blue" :loading="singleUnitLoading">下发指令</el-button>
        </el-popconfirm>
        <el-button class="btn-blue" @click="parameterSetting()">退出多单元编辑</el-button>
      </div>
    </div>
    <div class="device-control">
      <div class="allcheckContent">
        <el-checkbox v-model="allChecked" @change="handleCheckAllChange" />全选
      </div>
      <el-checkbox-group v-model="checkedProgress" @change="handleCheckedChange">
        <div v-loading="loading" class="equipment-body">

          <div class="row-2">
            <overview-box
              ref="humidifying"
              class="overview-box"
              :data="humidifying.data"
              :field-list="humidifying.fieldList"
            >
              <template v-slot:head>
                <div class="title">
                  <el-checkbox label="humidifying">雾化盘控制</el-checkbox>
                </div>
              </template>
            </overview-box>

            <overview-box
              ref="water"
              class="overview-box small"
              :data="water.data"
              :field-list="water.fieldList"
            >
              <template v-slot:head>
                <div class="title">
                  <el-checkbox label="water">饮水控制</el-checkbox>
                </div>
              </template>
            </overview-box>
            <overview-box
              ref="warmLight"
              class="overview-box small"
              :data="warmLight.data"
              :field-list="warmLight.fieldList"
            >
              <template v-slot:head>
                <div class="title">
                  <el-checkbox label="warmLight">暖灯控制</el-checkbox>
                </div>
              </template>
            </overview-box>
            <overview-box
              ref="warmLight"
              class="overview-box small"
              :data="light.data"
              :field-list="light.fieldList"
            >
              <template v-slot:head>
                <div class="title">
                  <el-checkbox label="light">照明控制</el-checkbox>
                </div>
              </template>
            </overview-box>
            <overview-box
              ref="alarm"
              class="overview-box small"
              :data="alarm.data"
              :field-list="alarm.fieldList"
            >
              <template v-slot:head>
                <div class="title">
                  <el-checkbox label="alarm">报警控制</el-checkbox>
                </div>
              </template>
            </overview-box>
          </div>
          <div class="row-3">
            <overview-box
              ref="electricHeatingPlate"
              class="overview-box small"
              :data="electricHeatingPlate.data"
              :field-list="electricHeatingPlate.fieldList"
            >
              <template v-slot:head>
                <div class="title">
                  <el-checkbox label="electricHeatingPlate">电热板控制</el-checkbox>
                </div>
              </template>
            </overview-box>
            <overview-box
              ref="airInlet"
              class="overview-box small"
              :data="airInlet.data"
              :field-list="airInlet.fieldList"
            >
              <template v-slot:head>
                <div class="title">
                  <el-checkbox label="airInlet">0级进风口滑窗控制</el-checkbox>
                </div>
              </template>
            </overview-box>
            <overview-box
              ref="AirOutlet"
              class="overview-box small"
              :data="AirOutlet.data"
              :field-list="AirOutlet.fieldList"
            >
              <template v-slot:head>
                <div class="title">
                  <el-checkbox label="AirOutlet">4级出风口滑窗控制</el-checkbox>
                </div>
              </template>
            </overview-box>
            <overview-box
              ref="hotExchange"
              class="overview-box small"
              :data="hotExchange.data"
              :field-list="hotExchange.fieldList"
            >
              <template v-slot:head>
                <div class="title">
                  <el-checkbox label="hotExchange">热交换风口滑窗控制</el-checkbox>
                </div>
              </template>
            </overview-box>
            <overview-box
              ref="sewage"
              class="overview-box small"
              :data="sewage.data"
              :field-list="sewage.fieldList"
            >
              <template v-slot:head>
                <div class="title">
                  <el-checkbox label="sewage">闸阀控制</el-checkbox>
                </div>
              </template>
            </overview-box>
          </div>
          <div class="row-3">
            <overview-box
              ref="spray"
              class="overview-box small"
              :data="spray.data"
              :field-list="spray.fieldList"
              :checker-id="spray.checkerId"
            >
              <template v-slot:head>
                <div class="title">
                  <el-checkbox label="spray">喷淋</el-checkbox>
                </div>
              </template>
            </overview-box>
            <div class="flex flex-view small" />
            <div class="flex flex-view small" />
            <div class="flex flex-view small" />
            <div class="flex flex-view small" />
          </div>
          <!-- </el-col> -->
          <!-- </el-row> -->
        </div>
      </el-checkbox-group>
    </div>

    <div class="its-control">
      <div class="its-control-nav">设备自身控制</div>
      <div class="row-3">
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
        <div class="flex flex-view small" />
        <div class="flex flex-view small" />
      </div>
    </div>
  </div>
</template>

<script>
import {
  mcuInstruction,
  UploadUnitState,
  // UploadParam,
  // DevReboot,
  ResetDevInstall,
  FactorySetting,
  multiDevice
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
      progressOptions: ['humidifying', 'water', 'warmLight', 'light', 'alarm', 'electricHeatingPlate', 'airInlet', 'AirOutlet', 'hotExchange', 'sewage', 'spray'],
      allChecked: false,
      checkedProgress: [],
      singleUnitLoading: false,
      IntelligentControl: '',
      loading: false,
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
            slot: true
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
            slot: true
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
            slot: true
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
              ...rulesService.limit_5_65535
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
            slot: true
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
            slot: true
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
            slot: true
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
            slot: true
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
            slot: true
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
            slot: true
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
            slot: true
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
            slot: true
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
            authCode: 'buildingPigHouse:multiRoomUnitSelfControl',
            titleIcon: '',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.UploadUnitState()
            }
          }
        }
      },
      stateParameters: {
        fieldList: {
          head: {
            title: '触发参数上报',
            authCode: 'buildingPigHouse:multiRoomUnitSelfControl',
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
            authCode: 'buildingPigHouse:multiRoomUnitSelfControl',
            titleIcon: '',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.DevReboot()
            }
          }
        }
      }
    }
  },
  mounted() {
    this.IntelligentControl = JSON.parse(sessionStorage.getItem('setMultiUnitCtr'))
  },
  methods: {
    singleUnit() {
      const config = []
      this.checkedProgress.map(item => {
        console.log('选中的元素', item)
        console.log('传输的参数', this.IntelligentControl)
        config.push(this[item].data)
        console.log('发送的data', config)
      })
      multiDevice({
        control: config,
        deviceNames: this.IntelligentControl.deviceNames,
        fieldId: this.IntelligentControl.fieldId,
        fieldName: this.IntelligentControl.fieldName,
        unitNames: this.IntelligentControl.unitNames
      }).then((res) => {
        this.loading = false
        if (res.rel) {
          this.$message.success('指令发送成功')
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    handleCheckAllChange(val) {
      this.checkedProgress = val ? this.progressOptions : []
    },
    handleCheckedChange(val) {
      const checkedCount = val.length
      this.allChecked = checkedCount === this.progressOptions.length
    },
    parameterSetting() {
      this.overviewDetail.isNotEnterMultiUnit = true
      this.overviewDetail.progressCtr = 'equipment'
    },
    mcuInstruction(data) {
      const deviceId = this.overviewDetail.overview.deviceId
      const deviceName = this.overviewDetail.overview.deviceName
      this.loading = true
      mcuInstruction({ deviceId, deviceName }, data).then((res) => {
        this.loading = false
        if (res.rel) {
          this.$message.success(res.message)
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    UploadUnitState(data) {
      const config = {
        command: 'UploadState', // 'UploadParam',
        deviceNames: this.IntelligentControl.deviceNames,
        fieldId: this.IntelligentControl.fieldId,
        fieldName: this.IntelligentControl.fieldName,
        unitNames: this.IntelligentControl.unitNames
      }
      UploadUnitState(config).then((res) => {
        if (res.rel) {
          this.$message.success(res.message || '指令发送成功')
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
      })
    },
    UploadParam(data) {
      const config = {
        command: 'UploadParam',
        deviceNames: this.IntelligentControl.deviceNames,
        fieldId: this.IntelligentControl.fieldId,
        fieldName: this.IntelligentControl.fieldName,
        unitNames: this.IntelligentControl.unitNames
      }
      UploadUnitState(config).then((res) => {
        if (res.rel) {
          this.$message.success(res.message || '指令发送成功')
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {})
    },
    DevReboot(data) {
      const config = {
        command: 'DevReboot',
        deviceNames: this.IntelligentControl.deviceNames,
        fieldId: this.IntelligentControl.fieldId,
        fieldName: this.IntelligentControl.fieldName,
        unitNames: this.IntelligentControl.unitNames
      }
      UploadUnitState(config).then((res) => {
        if (res.rel) {
          this.$message.success(res.message || '指令发送成功')
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {})
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
      }).catch(() => {})
    },
    FactorySetting(data) {
      const deviceId = this.overviewDetail.equiment_info.deviceId
      const deviceName = this.overviewDetail.equiment_info.deviceName
      FactorySetting({ deviceId, deviceName }, data).then((res) => {
        if (res.rel) {
          this.$message.success(res.message)
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.allcheckContent {
  color: #cdd8f7;
  margin-bottom: 10px;
}
ul {
  list-style-type: none;
  margin: 0;
}
.header {
  margin-bottom: 20px;
  .title {
    color: #fff;
  }
  .unit-list {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    .unit-item {
      margin-left: 20px;
      margin-bottom: 10px;
      padding: 8px 15px;
      font-size: 12px;
      border-radius: 4px;
      color: #fff;
      background-image: linear-gradient(180deg, #0090E7 0%, #0090E7 100%);
    }
  }
}
.device-control-nav{
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.device-control-nav,.its-control-nav{
  color: #fff;
  margin-bottom: 20px;
}
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
.el-checkbox {
  color: #fff;
}
.multi-unit-control{
  .el-form-item__error{
    top: 38px;
  }
  .overview-box .el-form-item{
    margin-bottom: 12px;
  }
}
</style>
