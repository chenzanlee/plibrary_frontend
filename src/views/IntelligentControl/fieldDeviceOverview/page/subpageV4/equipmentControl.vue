<template>
  <div class="equipment-control">
    <div v-loading="loading" class="equipment-body equipment-body-old">
      <div class="row-1">
        <!-- 变频风机 -->
        <overview-box
          ref="InverterEnd"
          class="overview-box"
          :data="InverterEnd.data"
          :field-list="InverterEnd.fieldList"
          :checker-id="InverterEnd.checkerId"
        />
        <!-- 扰流 -->
        <overview-box
          ref="ThyrodeExchange"
          class="overview-box"
          :data="ThyrodeExchange.data"
          :field-list="ThyrodeExchange.fieldList"
          :checker-id="ThyrodeExchange.checkerId"
        />
        <!-- OutFan-出风变频风机 -->
        <overview-box
          ref="OutFan"
          class="overview-box"
          :data="OutFan.data"
          :field-list="OutFan.fieldList"
          :checker-id="OutFan.checkerId"
        />
        <!-- PosiFan-正压变频风机 -->
        <overview-box
          ref="PosiFan"
          class="overview-box"
          :data="PosiFan.data"
          :field-list="PosiFan.fieldList"
          :checker-id="PosiFan.checkerId"
        />
        <!-- ThyrodeInFan-扰流变速风机 -->
        <overview-box
          ref="ThyrodeInFan"
          class="overview-box"
          :data="ThyrodeInFan.data"
          :field-list="ThyrodeInFan.fieldList"
          :checker-id="ThyrodeInFan.checkerId"
        />
      </div>
      <div class="row-2">
        <!-- 定速风机控制 -->
        <overview-box
          ref="FixedFan"
          class="overview-box"
          :data="FixedFan.data"
          :field-list="FixedFan.fieldList"
          :checker-id="FixedFan.checkerId"
        />
        <!-- AirOutlet-出风口滑窗控制 -->
        <overview-box
          ref="AirOutlet"
          class="overview-box"
          :data="AirOutlet.data"
          :field-list="AirOutlet.fieldList"
          :checker-id="AirOutlet.checkerId"
        />
        <!-- AirInlet-进风口滑窗控制 -->
        <overview-box
          ref="AirInlet"
          class="overview-box"
          :data="AirInlet.data"
          :field-list="AirInlet.fieldList"
          :checker-id="AirInlet.checkerId"
        />
        <!-- 喷淋 -->
        <overview-box
          ref="Shower"
          class="overview-box"
          :data="Shower.data"
          :field-list="Shower.fieldList"
          :checker-id="Shower.checkerId"
        />
        <!-- 饲喂 -->
        <overview-box
          ref="Feed"
          class="overview-box"
          :data="Feed.data"
          :field-list="Feed.fieldList"
          :checker-id="Feed.checkerId"
        />
      </div>
      <div class="row-3">
        <!-- 警灯警铃 -->
        <overview-box
          ref="AlarmBell"
          class="overview-box"
          :data="AlarmBell.data"
          :field-list="AlarmBell.fieldList"
          :checker-id="AlarmBell.checkerId"
        />
        <!-- 水帘 -->
        <overview-box
          ref="WaterCurtain"
          class="overview-box"
          :data="WaterCurtain.data"
          :field-list="WaterCurtain.fieldList"
        />
        <!-- 饮水 -->
        <overview-box
          ref="Drink"
          class="overview-box small"
          :data="Drink.data"
          :field-list="Drink.fieldList"
        />
        <!-- 暖灯 -->
        <overview-box
          ref="HeatLamp"
          class="overview-box small"
          :data="HeatLamp.data"
          :field-list="HeatLamp.fieldList"
        />
        <!-- 照明 -->
        <overview-box
          ref="Lamp"
          class="overview-box small"
          :data="Lamp.data"
          :field-list="Lamp.fieldList"
        />
      </div>
      <div class="row-4">
        <!-- 空调 -->
        <overview-box
          ref="Conditioner"
          class="overview-box small"
          :data="Conditioner.data"
          :field-list="Conditioner.fieldList"
        />
        <!-- 风阀 -->
        <overview-box
          ref="Valve"
          class="overview-box small"
          :data="Valve.data"
          :field-list="Valve.fieldList"
        />
        <!-- 粪塞 -->
        <overview-box
          ref="Plug"
          class="overview-box small"
          :data="Plug.data"
          :field-list="Plug.fieldList"
        />
        <div class="flex flex-view small">
          <!-- 触发状态上报 -->
          <overview-box
            ref="stateTrigger"
            :data="stateTrigger.data"
            :field-list="stateTrigger.fieldList"
          />
          <!-- 触发参数 -->
          <overview-box
            :data="stateParameters.data"
            :field-list="stateParameters.fieldList"
          />
          <!-- 重新检测设备 -->
          <overview-box
            ref="Reboot"
            :data="Reboot.data"
            :field-list="Reboot.fieldList"
          />
        </div>
        <!--  -->
        <div class="flex flex-view small">
          <!-- 设备重启 -->
          <overview-box
            ref="resetDevInstall"
            :data="resetDevInstall.data"
            :field-list="resetDevInstall.fieldList"
          />
          <!-- 恢复出厂设置 -->
          <overview-box
            ref="factorySetting"
            :data="factorySetting.data"
            :field-list="factorySetting.fieldList"
          />
        </div>
        <!-- <div class="flex flex-view small">
        </div> -->
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
} from '@/http/api/fieldDeviceOverviewV4'
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
      // 端部变频
      InverterEnd: {
        checkerId: 1,
        data: {
          ctrlDevType: 'InverterEnd',
          way: 1,
          open: true,
          duration: 120,
          freq: 20
        },
        fieldList: {
          head: {
            title: '变频风机控制',
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
                  value: '端部变频1',
                  key: 1,
                  id: 1
                },
                {
                  value: '端部变频2',
                  key: 2,
                  id: 2
                },
                {
                  value: '端部变频3',
                  key: 3,
                  id: 3
                }
              ]
            },
            {
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
              label: '生效时长',
              key: 'duration',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },
      // 热交换--变速风机
      ThyrodeExchange: {
        checkerId: 1,
        data: {
          ctrlDevType: 'ThyrodeExchange',
          way: 'ThyrodeExchange-1',
          open: true,
          duration: 120,
          percent: 20
        },
        fieldList: {
          head: {
            // title: '扰流风机控制',
            title: '变速风机控制', // 2021-1-25 修改成写交换风机
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.ThyrodeExchange.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.ThyrodeExchange.data.way
                  const tmp = data.split('-')
                  const params = {}
                  params.ctrlDevType = tmp[0]
                  params.way = tmp[1]
                  params.open = this.ThyrodeExchange.data.open
                  params.duration = this.ThyrodeExchange.data.duration
                  params.percent = this.ThyrodeExchange.data.percent
                  this.mcuInstruction([params])
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
                  value: '热交换',
                  key: 'ThyrodeExchange-1',
                  id: 1
                },
                {
                  value: '地沟1',
                  key: 'ThyrodeGutter-1',
                  id: 2
                },
                {
                  value: '地沟2',
                  key: 'ThyrodeGutter-2',
                  id: 3
                }
              ]
            },
            {
              label: '开关',
              key: 'open',
              type: 'switch'
            },
            {
              label: '转速(%)',
              key: 'percent',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_100
            },
            {
              label: '生效时长',
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
            title: '喷淋控制',
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
              label: '生效时长',
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
            title: '饲喂控制',
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
              label: '生效时长',
              key: 'duration',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },
      // 警铃警灯
      AlarmBell: {
        checkerId: 1,
        data: {
          ctrlDevType: 'AlarmBell',
          way: 1,
          open: true,
          duration: 120,
          duration2: 120
        },
        fieldList: {
          head: {
            title: '警铃警灯控制',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.AlarmBell.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.AlarmBell.data
                  const arr = [
                    { ctrlDevType: 'AlarmBell', way: 1, open: true, duration: data.duration },
                    { ctrlDevType: 'AlarmLight', way: 1, open: true, duration: data.duration2 }
                  ]
                  this.mcuInstruction(arr)
                } else {
                  this.$message.error(rulesService.submitErrorTip)
                  return false
                }
              })
            }
          },
          body: [
            {
              label: '警铃生效时长',
              key: 'duration',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            },
            {
              label: '警灯生效时长',
              key: 'duration2',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },
      // 水帘
      WaterCurtain: {
        checkerId: 1,
        data: {
          ctrlDevType: 'G2Humidifying',
          way: 1,
          open: true,
          duration: 120
        },
        fieldList: {
          head: {
            title: '水帘控制',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.WaterCurtain.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.WaterCurtain.data
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
              label: '生效时长',
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
          way: 1,
          open: true,
          duration: 120
        },
        fieldList: {
          head: {
            title: '饮水控制',
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
              label: '生效时长',
              key: 'duration',
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
          way: 1,
          open: true,
          duration: 120
        },
        fieldList: {
          head: {
            title: '暖灯控制',
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
              label: '生效时长',
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
          way: 1,
          open: true,
          duration: 120
        },
        fieldList: {
          head: {
            title: '照明控制',
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
              label: '生效时长',
              key: 'duration',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },
      // 空调
      Conditioner: {
        checkerId: 1,
        data: {
          ctrlDevType: 'Conditioner',
          way: 1,
          open: true,
          duration: 120
        },
        fieldList: {
          head: {
            title: '空调控制',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.Conditioner.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.Conditioner.data
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
              label: '生效时长',
              key: 'duration',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },
      // 风阀
      Valve: {
        checkerId: 1,
        data: {
          ctrlDevType: 'Valve',
          way: 1,
          open: true,
          duration: 120
        },
        fieldList: {
          head: {
            title: '风阀控制',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.Valve.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.Valve.data
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
              label: '生效时长',
              key: 'duration',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },
      // 粪塞
      Plug: {
        checkerId: 1,
        data: {
          ctrlDevType: 'Plug',
          way: 1,
          open: true,
          duration: 0
        },
        fieldList: {
          head: {
            title: '粪塞控制',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.Plug.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.Plug.data
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
            }
            // {
            //   label: '生效时长',
            //   key: 'duration',
            //   type: 'inputNumber',
            //   controlsPositionRight: 'right',
            //   ...rulesService.limit_0_65535
            // }
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
      },
      // AirOutlet-出风口滑窗控制
      AirOutlet: {
        checkerId: 1,
        data: {
          ctrlDevType: 'AirOutlet',
          way: 1,
          open: true,
          duration: 120,
          percent: 20
        },
        fieldList: {
          head: {
            title: '出风口滑窗控制',
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
            {
              label: '开关',
              key: 'open',
              type: 'switch'
            },
            {
              label: '频率(Hz)',
              key: 'percent',
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
                        callback('出风口滑窗频率范围为(0,20-50)')
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
              label: '生效时长',
              key: 'duration',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },
      // AirInlet-进风口滑窗控制
      AirInlet: {
        checkerId: 1,
        data: {
          ctrlDevType: 'AirInlet',
          way: 1,
          open: true,
          duration: 120,
          percent: 20
        },
        fieldList: {
          head: {
            title: '进风口滑窗控制',
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
            {
              label: '开关',
              key: 'open',
              type: 'switch'
            },
            {
              label: '频率(Hz)',
              key: 'percent',
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
                        callback('进风口滑窗频率范围为(0,20-50)')
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
              label: '生效时长',
              key: 'duration',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },
      // OutFan-出风变频风机
      OutFan: {
        checkerId: 1,
        data: {
          ctrlDevType: 'OutFan',
          way: 1,
          open: true,
          duration: 120,
          percent: 20
        },
        fieldList: {
          head: {
            title: '出风变频风机控制',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.OutFan.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.OutFan.data
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
              label: '频率(Hz)',
              key: 'percent',
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
                        callback('出风变频风机频率范围为(0,20-50)')
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
              label: '生效时长',
              key: 'duration',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },
      // PosiFan-正压变频风机
      PosiFan: {
        checkerId: 1,
        data: {
          ctrlDevType: 'PosiFan',
          way: 1,
          open: true,
          duration: 120,
          percent: 20
        },
        fieldList: {
          head: {
            title: '正压变频风机控制',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.PosiFan.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.PosiFan.data
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
              label: '频率(Hz)',
              key: 'percent',
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
                        callback('正压变频风机频率范围为(0,20-50)')
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
              label: '生效时长',
              key: 'duration',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },
      // 扰流变速风机
      ThyrodeInFan: {
        checkerId: 1,
        data: {
          ctrlDevType: 'ThyrodeInFan',
          way: 1,
          open: true,
          duration: 120,
          percent: 20
        },
        fieldList: {
          head: {
            title: '扰流变速风机',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.ThyrodeInFan.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.ThyrodeInFan.data
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
              label: '转速(%)',
              key: 'percent',
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
                        callback('扰流变速风机速度范围为(0,20-50)')
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
              label: '生效时长',
              key: 'duration',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },
      // 定速风机FixedFan
      FixedFan: {
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
      })
    },
    // 触发状态
    UploadState(data) {
      const deviceId = this.overviewDetail.equiment_info.deviceId
      const deviceName = this.overviewDetail.equiment_info.deviceName
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
    // 触发参数
    UploadParam(data) {
      const deviceId = this.overviewDetail.equiment_info.deviceId
      const deviceName = this.overviewDetail.equiment_info.deviceName
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
    // 设备重启
    DevReboot(data) {
      const deviceId = this.overviewDetail.equiment_info.deviceId
      const deviceName = this.overviewDetail.equiment_info.deviceName
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
    // 重新检测设备
    ResetDevInstall(data) {
      const deviceId = this.overviewDetail.equiment_info.deviceId
      const deviceName = this.overviewDetail.equiment_info.deviceName
      this.loading = true
      ResetDevInstall({ deviceId, deviceName }, data).then((res) => {
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
    // 恢复出厂设置
    FactorySetting(data) {
      const deviceId = this.overviewDetail.equiment_info.deviceId
      const deviceName = this.overviewDetail.equiment_info.deviceName
      this.loading = true
      FactorySetting({ deviceId, deviceName }, data).then((res) => {
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
.row-1,.row-2,.row-3,.row-4{
  display: flex;
  flex-wrap: wrap;
}
.row-4{
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
