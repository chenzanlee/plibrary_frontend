<template>
  <div class="equipment-control">
    <!-- <div class="refresh">
      <el-switch
        v-model="isRefresh"
        active-color="#10AEFF"
        inactive-color="#586CA5"
      />
      <div class="name">开启自动刷新</div>
    </div> -->
    <div v-loading="loading" class="equipment-body equipment-body-old">
      <div class="row-1">
        <!-- <el-row :gutter="10" :span="25"> -->
        <!-- <el-col  class="overview-box"> -->
        <overview-box
          ref="constSpeedFan"
          class="overview-box"
          :data="constSpeedFan.data"
          :field-list="constSpeedFan.fieldList"
          :checker-id="constSpeedFan.checkerId"
        />
        <!-- </el-col> -->
        <!-- <el-col  class="overview-box"> -->
        <overview-box
          ref="frequencyConversionFan"
          class="overview-box"
          :data="frequencyConversionFan.data"
          :field-list="frequencyConversionFan.fieldList"
          :checker-id="frequencyConversionFan.checkerId"
        />
        <!-- </el-col> -->
        <overview-box
          ref="variableSpeedFan"
          class="overview-box"
          :data="variableSpeedFan.data"
          :field-list="variableSpeedFan.fieldList"
          :checker-id="variableSpeedFan.checkerId"
        />
        <!-- <el-col  class="overview-box"> -->
        <overview-box
          ref="spray"
          class="overview-box"
          :data="spray.data"
          :field-list="spray.fieldList"
          :checker-id="spray.checkerId"
        />
        <!-- </el-col> -->
        <!-- <el-col  class="overview-box"> -->
        <overview-box
          ref="feeding"
          class="overview-box"
          :data="feeding.data"
          :field-list="feeding.fieldList"
          :checker-id="feeding.checkerId"
        />
        <!-- </el-col> -->
        <!-- <el-col  class="overview-box"> -->

      </div>
      <div class="row-2">
        <overview-box
          ref="alarm"
          class="overview-box"
          :data="alarm.data"
          :field-list="alarm.fieldList"
        />
        <overview-box
          v-if="overviewDetail.overview.segmentId === '13911'"
          ref="waterCurtain"
          class="overview-box small"
          :data="waterCurtain.data"
          :field-list="waterCurtain.fieldList"
        />
        <overview-box
          ref="water"
          class="overview-box small"
          :data="water.data"
          :field-list="water.fieldList"
        />
        <overview-box
          ref="warmLight"
          class="overview-box small"
          :data="warmLight.data"
          :field-list="warmLight.fieldList"
        />
        <overview-box
          ref="light"
          class="overview-box small"
          :data="light.data"
          :field-list="light.fieldList"
        />
        <overview-box
          v-if="overviewDetail.overview.segmentId !== '13911'"
          ref="airInlet"
          class="overview-box small"
          :data="airInlet.data"
          :field-list="airInlet.fieldList"
        />
      </div>
      <div class="row-3">
        <overview-box
          v-if="overviewDetail.overview.segmentId === '13911'"
          ref="airInlet"
          class="overview-box small"
          :data="airInlet.data"
          :field-list="airInlet.fieldList"
        />
        <overview-box
          ref="AirOutlet"
          class="overview-box small"
          :data="AirOutlet.data"
          :field-list="AirOutlet.fieldList"
        />
        <div class="flex flex-view small">
          <overview-box
            ref="stateTrigger"
            :data="stateTrigger.data"
            :field-list="stateTrigger.fieldList"
          />
          <overview-box
            :data="stateParameters.data"
            :field-list="stateParameters.fieldList"
          />
        </div>
        <!--  -->
        <div class="flex flex-view small">
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
        </div>
        <!-- 恢复出厂设置 -->
        <div class="flex flex-view small">
          <overview-box
            ref="factorySetting"
            :data="factorySetting.data"
            :field-list="factorySetting.fieldList"
          />
        </div>
        <div class="flex flex-view small" />
      </div>
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
      constSpeedFan: {
        checkerId: 1,
        data: {
          ctrlDevType: 'FixedFan',
          way: 1,
          open: true,
          duration: 60
        },
        fieldList: {
          head: {
            title: '定速风机控制',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.constSpeedFan.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.constSpeedFan.data
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
                },
                {
                  value: '风机6',
                  key: 6,
                  id: 6
                }
              ]
            },
            {
              label: '风机开关',
              key: 'open',
              type: 'switch'
            },
            {
              label: '生效时长(秒)',
              key: 'duration',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },
      // 变速风机
      variableSpeedFan: {
        checkerId: 1,
        data: {
          ctrlDevType: 'ThyrodeGutter',
          duration: 60,
          percent: 20,
          way: 1,
          open: true
        },
        fieldList: {
          head: {
            title: '变速风机控制',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.variableSpeedFan.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.variableSpeedFan.data
                  console.log('qqqqqqqqqqqqqqqqqqqqqqqqqq', data)
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
                  id: 1,
                  type: 'ThyrodeGutter'
                },
                {
                  value: '地沟变速2',
                  key: 2,
                  id: 2,
                  type: 'ThyrodeGutter'
                },
                {
                  value: '热交换变速1',
                  key: 1,
                  id: 3,
                  type: 'ThyrodeExchange'
                },
                {
                  value: '热交换变速2',
                  key: 2,
                  id: 4,
                  type: 'ThyrodeExchange'
                }
              ]
            },
            {
              label: '风机开关',
              key: 'open',
              type: 'switch'
            },
            {
              label: '风机转速(%)',
              key: 'percent',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_100
            },
            {
              label: '控制时间(秒)',
              key: 'duration',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_100000
            }
          ]
        }
      },
      // 变频风机
      frequencyConversionFan: {
        checkerId: 1,
        data: {
          ctrlDevType: 'ThyrodeGutter',
          way: 1,
          duration: 60,
          freq: 20
        },
        fieldList: {
          head: {
            title: '变频风机控制',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.frequencyConversionFan.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.frequencyConversionFan.data
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
                  value: '地沟变频',
                  key: 1,
                  id: 1,
                  type: 'InverterGutter'
                },
                {
                  value: '热交换变频',
                  key: 1,
                  id: 2,
                  type: 'InverterExchange'
                },
                {
                  value: '端部变频1',
                  type: 'InverterEnd',
                  key: 1,
                  id: 3
                },
                {
                  value: '吊顶风机1',
                  type: 'InverterCeiling',
                  key: 1,
                  id: 4
                },
                {
                  value: '端部变频2',
                  type: 'InverterEnd',
                  key: 2,
                  id: 5
                },
                {
                  value: '吊顶风机2',
                  type: 'InverterCeiling',
                  key: 2,
                  id: 6
                },
                {
                  value: '端部变频3',
                  type: 'InverterEnd',
                  key: 3,
                  id: 7
                },
                {
                  value: '吊顶风机3',
                  type: 'InverterCeiling',
                  key: 3,
                  id: 8
                },
                {
                  value: '热交换变频2',
                  type: 'InverterExchange',
                  key: 2,
                  id: 9
                }
              ]
            },
            {
              label: '风机频率(Hz) ',
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
              label: '控制时间(秒)',
              key: 'duration',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_100000
            }
          ]
        }
      },
      // 喷淋
      spray: {
        checkerId: 1,
        data: {
          ctrlDevType: 'Shower',
          way: 1,
          open: true,
          duration: 60
        },
        fieldList: {
          head: {
            title: '喷淋控制',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.spray.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.spray.data
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
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },
      // 饲喂
      feeding: {
        checkerId: 1,
        data: {
          ctrlDevType: 'Feed',
          duration: 60,
          open: true,
          way: 1
        },
        fieldList: {
          head: {
            title: '饲喂控制',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.feeding.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.feeding.data
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
              title: '线路ID',
              key: 'way',
              type: 'checker',
              defaultClass: '',
              selectedClass: '',
              list: [
                {
                  value: '线路1',
                  key: 1,
                  id: 1
                },
                {
                  value: '线路2',
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
              label: '生效时长(秒)',
              key: 'duration',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },
      // 警灯警铃
      alarm: {
        data: {
          AlarmBell: 60,
          AlarmLight: 60
        },
        fieldList: {
          head: {
            title: '警铃警灯控制',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.alarm.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = [
                    {
                      ctrlDevType: 'AlarmBell',
                      way: 1,
                      open: true,
                      duration: this.alarm.data.AlarmBell
                    },
                    {
                      ctrlDevType: 'AlarmLight',
                      way: 1,
                      open: true,
                      duration: this.alarm.data.AlarmLight
                    }
                  ]
                  this.mcuInstruction(data)
                } else {
                  this.$message.error(rulesService.submitErrorTip)
                  return false
                }
              })
            }
          },
          body: [
            {
              title: '警铃生效时长（秒）',
              key: 'AlarmBell',
              type: 'inputNumber',
              ...rulesService.limit_0_3600
            },
            {
              title: '警灯生效时长（秒）',
              key: 'AlarmLight',
              type: 'inputNumber',
              ...rulesService.limit_0_3600
            }
          ]
        }
      },
      // 饮水
      water: {
        data: {
          ctrlDevType: 'Drink',
          duration: 60,
          open: true,
          way: 1
        },
        fieldList: {
          head: {
            title: '饮水控制',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.water.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.water.data
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
              label: '饮水开关',
              key: 'open',
              type: 'switch'
            },
            {
              label: '生效时长(秒)',
              key: 'duration',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },
      // 水帘
      waterCurtain: {
        data: {
          ctrlDevType: 'WaterCurtain',
          duration: 60,
          open: true,
          way: 1
        },
        fieldList: {
          head: {
            title: '水帘控制',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.waterCurtain.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.waterCurtain.data
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
              label: '水帘开关',
              key: 'open',
              type: 'switch'
            },
            {
              label: '生效时长(秒)',
              key: 'duration',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },
      // 暖灯
      warmLight: {
        data: {
          ctrlDevType: 'HeatLamp',
          duration: 60,
          open: true,
          way: 1
        },
        fieldList: {
          head: {
            title: '暖灯控制',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.warmLight.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.warmLight.data
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
              label: '暖灯开关',
              key: 'open',
              type: 'switch'
            },
            {
              label: '生效时长(秒)',
              key: 'duration',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_5_65535
            }
          ]
        }
      },
      // 照明
      light: {
        data: {
          ctrlDevType: 'Lamp',
          duration: 60,
          open: true,
          way: 1
        },
        fieldList: {
          head: {
            title: '照明控制',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.light.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.light.data
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
              label: '照明开关',
              key: 'open',
              type: 'switch'
            },
            {
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
      airInlet: {
        data: {
          ctrlDevType: 'AirInlet',
          duration: 60,
          open: true,
          percent: 60,
          way: 1
        },
        fieldList: {
          head: {
            title: '进风口滑窗控制',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.airInlet.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.airInlet.data
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
              label: '开启百分比(%)',
              key: 'percent',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_100
            },
            {
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
        data: {
          ctrlDevType: 'AirOutlet',
          duration: 60,
          open: true,
          percent: 60,
          way: 1
        },
        fieldList: {
          head: {
            title: '出风口滑窗控制',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              console.log('设备空值点击事件')
              this.$refs.AirOutlet.$refs.overviewBoxForm.validate((valid) => {
                console.log('设备空值点击事件--------refs')
                if (valid) {
                  console.log('设备空值点击事件--------CUNZAI refs')
                  const data = this.AirOutlet.data
                  this.mcuInstruction([data])
                } else {
                  console.log('设备空值点击事件--------bucunzai  refs')
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
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_100
            },
            {
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
    // 发送指令
    mcuInstruction(data) {
      // console.log(this.overviewDetail.equiment_info.deviceId, this.overviewDetail.equiment_info.deviceName, this.overviewDetail.equiment_info.deviceId)
      console.log('设备控制发送的参数', data)
      const deviceId = this.overviewDetail.equiment_info.deviceId
      const deviceName = this.overviewDetail.equiment_info.deviceName
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
        // this.$message.error(err.message || '系统错误')
      })
    },
    // 触发状态
    UploadState(data) {
      const deviceId = this.overviewDetail.equiment_info.deviceId
      const deviceName = this.overviewDetail.equiment_info.deviceName
      UploadState({ deviceId, deviceName }, data).then((res) => {
        if (res.rel) {
          this.$message.success(res.message || '指令发送成功')
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        // this.$message.error(err.message || '系统错误')
      })
    },
    // 触发参数
    UploadParam(data) {
      const deviceId = this.overviewDetail.equiment_info.deviceId
      const deviceName = this.overviewDetail.equiment_info.deviceName
      UploadParam({ deviceId, deviceName }, data).then((res) => {
        if (res.rel) {
          this.$message.success(res.message || '指令发送成功')
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        // this.$message.error(err.message || '系统错误')
      })
    },
    // 设备重启
    DevReboot(data) {
      const deviceId = this.overviewDetail.equiment_info.deviceId
      const deviceName = this.overviewDetail.equiment_info.deviceName
      DevReboot({ deviceId, deviceName }, data).then((res) => {
        if (res.rel) {
          this.$message.success(res.message || '指令发送成功')
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        // this.$message.error(err.message || '系统错误')
      })
    },
    // 重新检测设备
    ResetDevInstall(data) {
      const deviceId = this.overviewDetail.equiment_info.deviceId
      const deviceName = this.overviewDetail.equiment_info.deviceName
      ResetDevInstall({ deviceId, deviceName }, data).then((res) => {
        if (res.rel) {
          this.$message.success(res.message || '指令发送成功')
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        // this.$message.error(err.message || '系统错误')
      })
    },
    // 恢复出厂设置
    FactorySetting(data) {
      const deviceId = this.overviewDetail.equiment_info.deviceId
      const deviceName = this.overviewDetail.equiment_info.deviceName
      FactorySetting({ deviceId, deviceName }, data).then((res) => {
        if (res.rel) {
          this.$message.success(res.message || '指令发送成功')
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        // this.$message.error(err.message || '系统错误')
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
      &:nth-child(5n) {
    padding-right: 0px;
  }
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
</style>
<style lang="scss">
.equipment-body-old{
  .el-form-item__error{
    bottom: -5px;
    top: unset !important;
  }
}
</style>
