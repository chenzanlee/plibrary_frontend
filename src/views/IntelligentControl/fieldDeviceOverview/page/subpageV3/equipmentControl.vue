<template>
  <div class="equipment-control">

    <div v-loading="loading" class="equipment-body-v2">

      <div class="row-1">
        <!-- 定速风机 -->
        <overview-box
          ref="FixedFan"
          class="overview-box"
          :data="FixedFan.data"
          :field-list="FixedFan.fieldList"
          :checker-id="FixedFan.checkerId"
        />
        <!-- 地沟变速风机 -->
        <overview-box
          ref="ThyrodeGutter"
          class="overview-box"
          :data="ThyrodeGutter.data"
          :field-list="ThyrodeGutter.fieldList"
          :checker-id="ThyrodeGutter.checkerId"
        />
        <!-- 热交换变速风机 -->
        <overview-box
          ref="ThyrodeExchange"
          class="overview-box"
          :data="ThyrodeExchange.data"
          :field-list="ThyrodeExchange.fieldList"
          :checker-id="ThyrodeExchange.checkerId"
        />
        <!-- 进风口 -->
        <overview-box
          ref="AirInlet"
          class="overview-box"
          :data="AirInlet.data"
          :field-list="AirInlet.fieldList"
          :checker-id="AirInlet.checkerId"
        />
        <!-- 出风口 -->
        <overview-box
          ref="AirOutlet"
          class="overview-box"
          :data="AirOutlet.data"
          :field-list="AirOutlet.fieldList"
          :checker-id="AirOutlet.checkerId"
        />
      </div>

      <div class="row-3">
        <!-- 端部变频风机 -->
        <overview-box
          ref="InverterEnd"
          class="overview-box"
          :data="InverterEnd.data"
          :field-list="InverterEnd.fieldList"
          :checker-id="InverterEnd.checkerId"
        />
        <!-- 吊顶变频风机 -->
        <overview-box
          ref="InverterCeiling"
          class="overview-box small"
          :data="InverterCeiling.data"
          :field-list="InverterCeiling.fieldList"
          :checker-id="InverterCeiling.checkerId"
        />

        <div class="flex flex-view small">
          <div class="grid">
            <!-- 地沟变频风机 -->
            <overview-box
              ref="InverterGutter"
              :data="InverterGutter.data"
              :field-list="InverterGutter.fieldList"
            />
            <!-- 热交换变频风机 -->
            <overview-box
              ref="InverterExchange"
              :data="InverterExchange.data"
              :field-list="InverterExchange.fieldList"
              :checker-id="InverterExchange.checkerId"
            />
          </div>
        </div>

        <!-- <div class="flex flex-view small"> -->
        <!-- <div class="grid"> -->
        <!-- 警铃 -->
        <overview-box
          ref="AlarmBell"
          :data="AlarmBell.data"
          :field-list="AlarmBell.fieldList"
        />
        <!-- 警灯 -->
        <!-- <overview-box
              ref="AlarmLight"
              class="overview-box small overview-box-bottom"
              :data="AlarmLight.data"
              :field-list="AlarmLight.fieldList"
            /> -->
        <!-- </div>
        </div> -->

        <div class="flex flex-view small">
          <div class="grid">
            <!-- 暖灯 -->
            <overview-box
              ref="HeatLamp"
              :data="HeatLamp.data"
              :field-list="HeatLamp.fieldList"
            />
            <!-- 伴热带 -->
            <overview-box
              ref="HeatBelt"
              class="overview-box small overview-box-bottom"
              :data="HeatBelt.data"
              :field-list="HeatBelt.fieldList"
            />
          </div>
        </div>
      </div>

      <div class="row-3">
        <!-- 饲喂 -->
        <overview-box
          ref="Feed"
          class="overview-box"
          :data="Feed.data"
          :field-list="Feed.fieldList"
          :checker-id="Feed.checkerId"
        />
        <!-- 喷淋 -->
        <overview-box
          ref="Shower"
          class="overview-box"
          :data="Shower.data"
          :field-list="Shower.fieldList"
          :checker-id="Shower.checkerId"
        />
        <!-- 饮水 -->
        <overview-box
          ref="Drink"
          class="overview-box small"
          :data="Drink.data"
          :field-list="Drink.fieldList"
        />
        <!-- 雾化盘 -->
        <overview-box
          ref="Humidifying"
          class="overview-box small"
          :data="Humidifying.data"
          :field-list="Humidifying.fieldList"
        />
        <!-- 照明 -->
        <overview-box
          ref="Lamp"
          class="overview-box small"
          :data="Lamp.data"
          :field-list="Lamp.fieldList"
        />
      </div>

      <div class="row-3">
        <overview-box
          ref="stateTrigger"
          :data="stateTrigger.data"
          :field-list="stateTrigger.fieldList"
        />
        <overview-box
          :data="stateParameters.data"
          :field-list="stateParameters.fieldList"
        />
        <overview-box
          ref="Reboot"
          :data="Reboot.data"
          :field-list="Reboot.fieldList"
        />
        <overview-box
          ref="resetDevInstall"
          :data="resetDevInstall.data"
          :field-list="resetDevInstall.fieldList"
        />
        <overview-box
          ref="factorySetting"
          :data="factorySetting.data"
          :field-list="factorySetting.fieldList"
        />
      </div>

    </div>
  </div>
</template>

<script>
import {
  UploadStateV2,
  UploadParamV2,
  DevRebootV2,
  ResetDevInstallV2,
  FactorySettingV2,
  mcuInstructionV2,
  setMcuInstructionV2
} from '@/http/api/fieldDeviceOverview'
import OverviewBox from '@/views/IntelligentControl/fieldDeviceOverview/common/components/OverviewBox'
import rulesService from './utils/verification'
export default {
  components: {
    OverviewBox
  },
  inject: ['overviewDetail'],
  // props: {
  //   unitId: String
  // },
  data() {
    return {
      loading: false,
      isRefresh: false,
      deviceId: '4D5920363455484E501300570037',
      deviceName: '4SmfkBNuvB2k3vi987oern',
      // 定速风机
      FixedFan: {
        checkerId: 1,
        data: {
          ctrlDevType: 'FixedFan',
          way: 1,
          open: true,
          duration: 120
        },
        fieldList: {
          head: {
            title: '定速风机',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.FixedFan.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.FixedFan.data
                  this.mcuInstruction([data])
                } else {
                  this.$message.error(rulesService.submitErrorTip)
                  return false
                }
              })
            }
          },
          body: [
            {
              key: 'way',
              type: 'checker',
              defaultClass: '',
              selectedClass: '',
              list: [
                {
                  value: '风机1',
                  key: 1,
                  id: 1
                },
                {
                  value: '风机2',
                  key: 2,
                  id: 2
                },
                {
                  value: '风机3',
                  key: 3,
                  id: 3
                },
                {
                  value: '风机4',
                  key: 4,
                  id: 4
                },
                {
                  value: '风机5',
                  key: 5,
                  id: 5
                }
                // {
                //   value: '风机6',
                //   key: 6,
                //   id: 6
                // }
              ]
            },
            {
              label: '开关',
              key: 'open',
              type: 'switch'
            },
            {
              label: '生效时长(秒)',
              key: 'duration',
              type: 'inputNumber',
              className: 'el-form-item_width',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },
      // 地沟变速
      ThyrodeGutter: {
        checkerId: 1,
        data: {
          ctrlDevType: 'ThyrodeGutter',
          way: 1,
          // open: true,
          duration: 120,
          percent: 20
        },
        fieldList: {
          head: {
            title: '地沟变速风机',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.ThyrodeGutter.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.ThyrodeGutter.data
                  this.mcuInstruction([data])
                } else {
                  this.$message.error(rulesService.submitErrorTip)
                  return false
                }
              })
            }
          },
          body: [
            {
              key: 'way',
              type: 'checker',
              defaultClass: '',
              selectedClass: '',
              list: [
                {
                  value: '地沟变速1',
                  key: 1,
                  id: 1
                },
                {
                  value: '地沟变速2',
                  key: 2,
                  id: 2
                }
              ]
            },
            // {
            //   label: '开关',
            //   key: 'open',
            //   type: 'switch'
            // },
            {
              className: 'el-form-item_width',
              label: '转速(%)',
              key: 'percent',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_100
            },
            {
              className: 'el-form-item_width',
              label: '生效时长(秒)',
              key: 'duration',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },
      // 热交换变速风机
      ThyrodeExchange: {
        checkerId: 1,
        data: {
          ctrlDevType: 'ThyrodeExchange',
          // open: true,
          duration: 120,
          way: 1,
          percent: 20
        },
        fieldList: {
          head: {
            title: '热交换变速风机',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.ThyrodeExchange.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.ThyrodeExchange.data
                  this.mcuInstruction([data])
                } else {
                  this.$message.error(rulesService.submitErrorTip)
                  return false
                }
              })
            }
          },
          body: [
            {
              key: 'way',
              type: 'checker',
              defaultClass: '',
              selectedClass: '',
              list: [
                {
                  value: '热交换变速1',
                  key: 1,
                  id: 1
                },
                {
                  value: '热交换变速2',
                  key: 2,
                  id: 2
                }
              ]
            },
            // {
            //   label: '开关',
            //   key: 'open',
            //   type: 'switch'
            // },
            {
              className: 'el-form-item_width',
              label: '转速(%)',
              key: 'percent',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_100
            },
            {
              className: 'el-form-item_width',
              label: '生效时长(秒)',
              key: 'duration',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },
      // 进风口
      AirInlet: {
        checkerId: 1,
        data: {
          ctrlDevType: 'AirInlet',
          open: true,
          duration: 120,
          percent: 60,
          way: 1
        },
        fieldList: {
          head: {
            title: '进风口',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.AirInlet.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.AirInlet.data
                  this.mcuInstruction([data])
                } else {
                  this.$message.error(rulesService.submitErrorTip)
                  return false
                }
              })
            }
          },
          body: [
            // {
            //   label: '开关',
            //   key: 'open',
            //   type: 'switch'
            // },
            {
              className: 'el-form-item_width',
              label: '开启百分比(%)',
              class: 'qqqq',
              key: 'percent',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_100
            },
            {
              className: 'el-form-item_width',
              label: '生效时长(秒)',
              key: 'duration',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },
      // 出风口
      AirOutlet: {
        checkerId: 1,
        data: {
          ctrlDevType: 'AirOutlet',
          open: true,
          duration: 120,
          percent: 60,
          way: 1
        },
        fieldList: {
          head: {
            title: '出风口',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.AirOutlet.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.AirOutlet.data
                  this.mcuInstruction([data])
                } else {
                  this.$message.error(rulesService.submitErrorTip)
                  return false
                }
              })
            }
          },
          body: [
            // {
            //   label: '开关',
            //   key: 'open',
            //   type: 'switch'
            // },
            {
              className: 'el-form-item_width',
              label: '开启百分比(%)',
              key: 'percent',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_100
            },
            {
              className: 'el-form-item_width',
              label: '生效时长(秒)',
              key: 'duration',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },

      // 端部变频风机
      InverterEnd: {
        checkerId: 1,
        data: {
          ctrlDevType: 'InverterEnd',
          way: 1,
          // open: true,
          duration: 120,
          freq: 20
        },
        fieldList: {
          head: {
            title: '端部变频风机',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.InverterEnd.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.InverterEnd.data
                  this.mcuInstruction([data])
                } else {
                  this.$message.error(rulesService.submitErrorTip)
                  return false
                }
              })
            }
          },
          body: [
            {
              key: 'way',
              type: 'checker',
              defaultClass: '',
              selectedClass: '',
              list: [
                {
                  value: '端部1',
                  key: 1,
                  id: 1
                },
                {
                  value: '端部2',
                  key: 2,
                  id: 2
                },
                {
                  value: '端部3',
                  key: 3,
                  id: 3
                }
              ]
            },
            // {
            //   label: '风机开关',
            //   key: 'open',
            //   type: 'switch'
            // },
            {
              className: 'el-form-item_width',
              label: '频率(Hz)',
              key: 'freq',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              rules: [
                {
                  validator: (rule, value, callback) => {
                    if (value) {
                      const val = parseInt(value)
                      if (val === 0) {
                        callback()
                      } else if (val >= 20 && val <= 50) {
                        callback()
                      } else {
                        callback('变频风机频率范围为(0,20-50)')
                      }
                    } else if (value === undefined || value === null || value === '') {
                      callback(rulesService.inputErrorTip)
                    } else {
                      callback()
                    }
                  },
                  trigger: ['blur', 'change']
                }
              ]
            },
            {
              className: 'el-form-item_width',
              label: '生效时长(秒)',
              key: 'duration',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },
      // 吊顶变频风机
      InverterCeiling: {
        checkerId: 1,
        data: {
          ctrlDevType: 'InverterCeiling',
          way: 1,
          // open: true,
          duration: 120,
          freq: 20
        },
        fieldList: {
          head: {
            title: '吊顶变频风机',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.InverterCeiling.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.InverterCeiling.data
                  this.mcuInstruction([data])
                } else {
                  this.$message.error(rulesService.submitErrorTip)
                  return false
                }
              })
            }
          },
          body: [
            {
              key: 'way',
              type: 'checker',
              defaultClass: '',
              selectedClass: '',
              list: [
                {
                  value: '吊顶1',
                  key: 1,
                  id: 1
                },
                {
                  value: '吊顶2',
                  key: 2,
                  id: 2
                },
                {
                  value: '吊顶3',
                  key: 3,
                  id: 3
                }
              ]
            },
            // {
            //   label: '开关',
            //   key: 'open',
            //   type: 'switch'
            // },
            {
              className: 'el-form-item_width',
              label: '频率(Hz)',
              key: 'freq',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              rules: [
                {
                  validator: (rule, value, callback) => {
                    if (value) {
                      const val = parseInt(value)
                      if (val === 0) {
                        callback()
                      } else if (val >= 20 && val <= 50) {
                        callback()
                      } else {
                        callback('变频风机频率范围为(0,20-50)')
                      }
                    } else if (value === undefined || value === null || value === '') {
                      callback(rulesService.inputErrorTip)
                    } else {
                      callback()
                    }
                  },
                  trigger: ['blur', 'change']
                }
              ]
            },
            {
              className: 'el-form-item_width',
              label: '生效时长(秒)',
              key: 'duration',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },
      // 地沟变频风机
      InverterGutter: {
        checkerId: 1,
        data: {
          ctrlDevType: 'InverterGutter',
          // open: true,
          duration: 120,
          way: 1,
          freq: 20
        },
        fieldList: {
          head: {
            title: '地沟变频风机',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.InverterGutter.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.InverterGutter.data
                  this.mcuInstruction([data])
                } else {
                  this.$message.error(rulesService.submitErrorTip)
                  return false
                }
              })
            }
          },
          body: [
            // {
            //   label: '开关',
            //   key: 'open',
            //   type: 'switch'
            // },
            {
              className: 'el-form-item_width',
              label: '频率(Hz)',
              key: 'freq',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              rules: [
                {
                  validator: (rule, value, callback) => {
                    if (value) {
                      const val = parseInt(value)
                      if (val === 0) {
                        callback()
                      } else if (val >= 20 && val <= 50) {
                        callback()
                      } else {
                        callback('变频风机频率范围为(0,20-50)')
                      }
                    } else if (value === undefined || value === null || value === '') {
                      callback(rulesService.inputErrorTip)
                    } else {
                      callback()
                    }
                  },
                  trigger: ['blur', 'change']
                }
              ]
            },
            {
              className: 'el-form-item_width',
              label: '生效时长(秒)',
              key: 'duration',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },
      // 警铃
      AlarmBell: {
        checkerId: 1,
        data: {
          ctrlDevType: 'AlarmBell',
          open: true,
          duration1: 120,
          duration2: 120,
          way: 1
        },
        fieldList: {
          head: {
            title: '警铃/警灯',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.AlarmBell.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  // const data1 = this.AlarmBell.data
                  const data1 = { ctrlDevType: 'AlarmBell', duration: this.AlarmBell.data.duration1, open: this.AlarmBell.data.open, way: this.AlarmBell.data.way }
                  const data2 = { ctrlDevType: 'AlarmLight', duration: this.AlarmBell.data.duration2, open: this.AlarmBell.data.open, way: this.AlarmBell.data.way }
                  this.mcuInstruction([data1, data2])
                } else {
                  this.$message.error(rulesService.submitErrorTip)
                  return false
                }
              })
            }
          },
          body: [
            // {
            //   label: '开关',
            //   key: 'open',
            //   type: 'switch'
            // },
            {
              className: 'el-form-item_width',
              label: '警铃生效时长(秒)',
              key: 'duration1',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            },
            {
              className: 'el-form-item_width',
              label: '警灯生效时长(秒)',
              key: 'duration2',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },
      // 暖灯
      HeatLamp: {
        checkerId: 1,
        data: {
          ctrlDevType: 'HeatLamp',
          open: true,
          duration: 120,
          way: 1
        },
        fieldList: {
          head: {
            title: '暖灯',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.HeatLamp.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.HeatLamp.data
                  this.mcuInstruction([data])
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
              className: 'el-form-item_width',
              label: '生效时长(秒)',
              key: 'duration',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },

      // 热交换变频风机
      InverterExchange: {
        checkerId: 1,
        data: {
          ctrlDevType: 'InverterExchange',
          // open: true,
          duration: 120,
          way: 1,
          freq: 20
        },
        fieldList: {
          head: {
            title: '热交换变频风机',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.InverterExchange.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.InverterExchange.data
                  this.mcuInstruction([data])
                } else {
                  this.$message.error(rulesService.submitErrorTip)
                  return false
                }
              })
            }
          },
          body: [
            // {
            //   key: 'way',
            //   type: 'checker',
            //   defaultClass: '',
            //   selectedClass: '',
            //   list: [
            //     {
            //       value: '热交换变频1',
            //       key: 1,
            //       id: 1
            //     },
            //     {
            //       value: '热交换变频2',
            //       key: 2,
            //       id: 2
            //     }
            //   ]
            // },
            // {
            //   label: '开关',
            //   key: 'open',
            //   type: 'switch'
            // },
            {
              className: 'el-form-item_width',
              label: '频率(Hz)',
              key: 'freq',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              rules: [
                {
                  validator: (rule, value, callback) => {
                    if (value) {
                      const val = parseInt(value)
                      if (val === 0) {
                        callback()
                      } else if (val >= 20 && val <= 50) {
                        callback()
                      } else {
                        callback('变频风机频率范围为(0,20-50)')
                      }
                    } else if (value === undefined || value === null || value === '') {
                      callback(rulesService.inputErrorTip)
                    } else {
                      callback()
                    }
                  },
                  trigger: ['blur', 'change']
                }
              ]
            },
            {
              className: 'el-form-item_width',
              label: '生效时长(秒)',
              key: 'duration',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },
      // 警灯
      AlarmLight: {
        checkerId: 1,
        data: {
          ctrlDevType: 'AlarmLight',
          open: true,
          duration: 120,
          way: 1
        },
        fieldList: {
          head: {
            title: '警灯',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.AlarmLight.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.AlarmLight.data
                  this.mcuInstruction([data])
                } else {
                  this.$message.error(rulesService.submitErrorTip)
                  return false
                }
              })
            }
          },
          body: [
            // {
            //   label: '开关',
            //   key: 'open',
            //   type: 'switch'
            // },
            {
              className: 'el-form-item_width',
              label: '生效时长(秒)',
              key: 'duration',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },
      // 伴热带
      HeatBelt: {
        checkerId: 1,
        data: {
          ctrlDevType: 'HeatBelt',
          open: true,
          duration: 120,
          way: 1
        },
        fieldList: {
          head: {
            title: '伴热带',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.HeatBelt.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.HeatBelt.data
                  this.mcuInstruction([data])
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
              className: 'el-form-item_width',
              label: '生效时长(秒)',
              key: 'duration',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },

      // 饲喂
      Feed: {
        checkerId: 1,
        data: {
          ctrlDevType: 'Feed',
          way: 1,
          open: true,
          duration: 120
        },
        fieldList: {
          head: {
            title: '饲喂',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.Feed.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.Feed.data
                  this.mcuInstruction([data])
                } else {
                  this.$message.error(rulesService.submitErrorTip)
                  return false
                }
              })
            }
          },
          body: [
            {
              key: 'way',
              type: 'checker',
              defaultClass: '',
              selectedClass: '',
              list: [
                {
                  value: '饲喂1',
                  key: 1,
                  id: 1
                },
                {
                  value: '饲喂2',
                  key: 2,
                  id: 2
                }
              ]
            },
            {
              label: '饲喂开关',
              key: 'open',
              type: 'switch'
            },
            {
              className: 'el-form-item_width',
              label: '生效时长(秒)',
              key: 'duration',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },
      // 喷淋
      Shower: {
        checkerId: 1,
        data: {
          ctrlDevType: 'Shower',
          way: 1,
          open: true,
          duration: 120
        },
        fieldList: {
          head: {
            title: '喷淋',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.Shower.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.Shower.data
                  this.mcuInstruction([data])
                } else {
                  this.$message.error(rulesService.submitErrorTip)
                  return false
                }
              })
            }
          },
          body: [
            {
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
              className: 'el-form-item_width',
              label: '生效时长(秒)',
              key: 'duration',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },
      // 饮水
      Drink: {
        checkerId: 1,
        data: {
          ctrlDevType: 'Drink',
          open: true,
          duration: 120,
          way: 1
        },
        fieldList: {
          head: {
            title: '饮水',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.Drink.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.Drink.data
                  this.mcuInstruction([data])
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
              className: 'el-form-item_width',
              label: '生效时长(秒)',
              key: 'duration',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },
      // 雾化盘
      Humidifying: {
        checkerId: 1,
        data: {
          ctrlDevType: 'Humidifying',
          open: true,
          duration: 120,
          way: 1
        },
        fieldList: {
          head: {
            title: '雾化盘',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.Humidifying.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.Humidifying.data
                  this.mcuInstruction([data])
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
              className: 'el-form-item_width',
              label: '生效时长(秒)',
              key: 'duration',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },
      // 照明
      Lamp: {
        checkerId: 1,
        data: {
          ctrlDevType: 'Lamp',
          open: true,
          duration: 120,
          way: 1
        },
        fieldList: {
          head: {
            title: '照明',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.Lamp.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.Lamp.data
                  this.mcuInstruction([data])
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
              className: 'el-form-item_width',
              label: '生效时长(秒)',
              key: 'duration',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },

      // 触发状态
      stateTrigger: {
        fieldList: {
          head: {
            title: '触发状态上报',
            authCode: 'fieldDeviceOverview:controlSelf_MCU',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.UploadState()
            }
          }
        }
      },
      // 触发参数
      stateParameters: {
        fieldList: {
          head: {
            title: '触发参数上报',
            authCode: 'fieldDeviceOverview:controlSelf_MCU',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.UploadParam()
            }
          }
        }
      },
      // 设备重启
      Reboot: {
        fieldList: {
          head: {
            title: '设备重启',
            authCode: 'fieldDeviceOverview:controlSelf_MCU',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.DevReboot()
            }
          }
        }
      },
      // 重新检测设备
      resetDevInstall: {
        fieldList: {
          head: {
            title: '重新检测设备',
            authCode: 'fieldDeviceOverview:controlSelf_MCU',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.ResetDevInstall()
            }
          }
        }
      },
      // 恢复出厂设置
      factorySetting: {
        fieldList: {
          head: {
            title: '恢复出厂设置',
            authCode: 'fieldDeviceOverview:controlSelf_MCU',
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

  // watch: {
  //   unitId(newValue, oldValue) {
  //     // this.ArgsInfo()
  //     console.log('监听的单元切换', newValue, oldValue, this.overviewDetail.overview.deviceId)
  //   }
  // },

  methods: {
    // 下发指令
    mcuInstruction(data, type) {
      // console.log(this.overviewDetail.equiment_info.deviceId, this.overviewDetail.equiment_info.deviceName, this.overviewDetail.equiment_info.deviceId)
      console.log('设备控制发送的参数', data, type)
      const deviceId = this.overviewDetail.equiment_info.deviceId
      const deviceName = this.overviewDetail.equiment_info.deviceName
      this.loading = true
      console.log({ deviceId, deviceName })
      console.log(data)
      mcuInstructionV2({ deviceId, deviceName }, data).then((res) => {
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
    setMcuInstructionV2(d) {
      const deviceId = this.overviewDetail.equiment_info.deviceId
      const deviceName = this.overviewDetail.equiment_info.deviceName
      const data = { command: d }
      console.log(data)
      setMcuInstructionV2({ deviceId, deviceName }, data).then((res) => {
        if (res.rel) {
          this.$message.success(res.message || '指令发送成功')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 触发状态
    UploadState(data) {
      const deviceId = this.overviewDetail.equiment_info.deviceId
      const deviceName = this.overviewDetail.equiment_info.deviceName
      this.loading = true
      UploadStateV2({ deviceId, deviceName }, data).then((res) => {
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
    // 触发参数
    UploadParam(data) {
      const deviceId = this.overviewDetail.equiment_info.deviceId
      const deviceName = this.overviewDetail.equiment_info.deviceName
      this.loading = true
      UploadParamV2({ deviceId, deviceName }, data).then((res) => {
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
    // 设备重启
    DevReboot(data) {
      const deviceId = this.overviewDetail.equiment_info.deviceId
      const deviceName = this.overviewDetail.equiment_info.deviceName
      this.loading = true
      DevRebootV2({ deviceId, deviceName }, data).then((res) => {
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
    // 重新检测设备
    ResetDevInstall(data) {
      const deviceId = this.overviewDetail.equiment_info.deviceId
      const deviceName = this.overviewDetail.equiment_info.deviceName
      this.loading = true
      ResetDevInstallV2({ deviceId, deviceName }, data).then((res) => {
        if (res.rel) {
          this.loading = false
          this.$message.success(res.message || '指令发送成功')
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    // 恢复出厂设置
    FactorySetting(data) {
      const deviceId = this.overviewDetail.equiment_info.deviceId
      const deviceName = this.overviewDetail.equiment_info.deviceName
      this.loading = true
      FactorySettingV2({ deviceId, deviceName }, data).then((res) => {
        this.loading = false
        if (res.rel) {
          this.$message.success(res.message || '指令发送成功')
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.loading = false
      })
    }

  }

}
</script>

<style lang="scss" scoped>
.row-1,.row-2,.row-3{
  display: flex;
  flex-wrap: wrap;
}
.row-3{
  .flex-view{
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
    .overview-box:last-child {
      margin-top: 20px;
    }

  }
  .flex-view:last-child{
    padding-right: 0;
  }
  .grid{
    height: 100%;
    display: grid;
    grid-template-rows: 250px auto;
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
  // @include font-color('viewFontColor2');
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  .name {
    margin-left: 10px;
  }
}
.overview-box-bottom{
  // padding-bottom: 50px;
}
</style>
<style lang="scss">
.equipment-body-v2{
  .el-form-item__error{
    bottom: -5px;
    top: unset !important;
  }
  .el-form-item__label{
    // width: 80px;
  }
  .el-form-item_width{
    .el-form-item__label{
      width: 91px;
      text-align: left;
    }
  }
  .overview-box{
    .el-form-item{
        margin-bottom: 8px;
      }
  }
}
</style>
