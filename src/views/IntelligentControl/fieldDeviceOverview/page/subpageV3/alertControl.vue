<template>
  <div v-loading="loading" class="equipment-control">

    <div class="equipment-body-l equipment-body-v2-alarm">

      <div class="row-3">
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

        <div class="flex flex-view small">
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
        <!-- 温湿度 -->
        <overview-box
          ref="HumiSensor"
          class="overview-box"
          :data="HumiSensor.data"
          :field-list="HumiSensor.fieldList"
          :checker-id="HumiSensor.checkerId"
        />
        <div class="flex flex-view small">
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
        <!-- 照明 -->
        <!-- <overview-box
          ref="Lamp"
          class="overview-box small"
          :data="Lamp.data"
          :field-list="Lamp.fieldList"
          :checker-id="Lamp.checkerId"
        /> -->
        <!-- <div class="flex flex-view small"> -->
        <!-- 警铃 -->
        <!-- <overview-box
            ref="AlarmBell"
            class="overview-box small"
            :data="AlarmBell.data"
            :field-list="AlarmBell.fieldList"
            :checker-id="AlarmBell.checkerId"
          /> -->
        <!-- 警灯 -->
        <!-- <overview-box
            ref="AlarmLight"
            class="overview-box small"
            :data="AlarmLight.data"
            :field-list="AlarmLight.fieldList"
            :checker-id="AlarmLight.checkerId"
          /> -->
        <!-- </div> -->

        <!-- <div class="flex flex-view small"> -->
        <!-- 暖灯 -->
        <!-- <overview-box
            ref="HeatLamp"
            :data="HeatLamp.data"
            :field-list="HeatLamp.fieldList"
          /> -->
        <!-- </div> -->

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
        <div class="flex flex-view small">
          <!-- 伴热带 -->
          <overview-box
            ref="HeatBelt"
            :data="HeatBelt.data"
            :field-list="HeatBelt.fieldList"
          />
          <!-- 饮水 -->
          <overview-box
            ref="Drink"
            class="overview-box small"
            :data="Drink.data"
            :field-list="Drink.fieldList"
          />
        </div>
        <div class="flex flex-view small">
          <!-- 雾化盘 -->
          <overview-box
            ref="Humidifying"
            class="overview-box small"
            :data="Humidifying.data"
            :field-list="Humidifying.fieldList"
          />
          <!-- 手自动 -->
          <overview-box
            ref="HandAuto"
            :data="HandAuto.data"
            :field-list="HandAuto.fieldList"
          />
        </div>
      </div>

    </div>
    <div class="equipment-body-r">
      <div class="equipment-body-r-body">
        <div class="equipment-body-r-head box-head">暂停倒计时</div>
        <div v-if="alertCountdownList.length > 0" class="equipment-body-r-connect">
          <div v-for="(i, index) in alertCountdownList" :key="index" class="equipment-body-r-connect-col">
            <span class="equipment-body-r-connect-col-l">{{ i.info }}</span>
            <span class="equipment-body-r-connect-col-r">{{ i.date }}</span>
          </div>
        </div>
        <div v-else class="no-data-img">
          <img :src="noData | noDataFile('noData', 'svg')">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { valueExist } from '@/common/utils'
import {
  // mcuInstructionV2
  mcuInstructionAlarmV2
} from '@/http/api/fieldDeviceOverview'
import OverviewBox from '@/views/IntelligentControl/fieldDeviceOverview/common/components/OverviewBox'
import rulesService from './utils/verification'
export default {
  components: {
    OverviewBox
  },
  inject: ['overviewDetail'],
  props: {
    info: {
      type: Object,
      default: function() {
        return {}
      }
    },
    unitId: String
  },
  data() {
    return {
      noData: '',
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
          duration: 1
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
                }
                // {
                //   value: '风机5',
                //   key: 5,
                //   id: 5
                // },
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
              label: '暂停时长(分)',
              key: 'duration',
              type: 'inputNumber',
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
          open: true,
          duration: 1
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
            {
              label: '开关',
              key: 'open',
              type: 'switch'
            },
            {
              label: '暂停时长(分)',
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
          open: true,
          duration: 1,
          way: 1
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
            {
              label: '开关',
              key: 'open',
              type: 'switch'
            },
            {
              label: '暂停时长(分)',
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
          duration: 1,
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
            {
              label: '开关',
              key: 'open',
              type: 'switch'
            },
            {
              label: '暂停时长(分)',
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
          duration: 1,
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
            {
              label: '开关',
              key: 'open',
              type: 'switch'
            },
            {
              label: '暂停时长(分)',
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
          open: true,
          duration: 1
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
            {
              label: '风机开关',
              key: 'open',
              type: 'switch'
            },
            {
              label: '暂停时长(分)',
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
          open: true,
          duration: 1
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
            {
              label: '开关',
              key: 'open',
              type: 'switch'
            },
            {
              label: '暂停时长(分)',
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
          open: true,
          duration: 1,
          way: 1
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
            {
              label: '开关',
              key: 'open',
              type: 'switch'
            },
            {
              label: '暂停时长(分)',
              key: 'duration',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },
      // 温湿度
      HumiSensor: {
        checkerId: 1,
        data: {
          ctrlDevType: 'HumiSensor',
          open: true,
          duration: 1,
          way: 1
        },
        fieldList: {
          head: {
            title: '温湿度',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.HumiSensor.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.HumiSensor.data
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
                  value: '室内前',
                  key: 1,
                  id: 1
                },
                {
                  value: '室内后',
                  key: 2,
                  id: 2
                },
                {
                  value: '室外',
                  key: 3,
                  id: 3
                },
                {
                  value: '暖灯',
                  key: 4,
                  id: 4
                }
              ]
            },
            {
              label: '开关',
              key: 'open',
              type: 'switch'
            },
            {
              label: '暂停时长(分)',
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
          open: true,
          duration: 1,
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
              label: '暂停时长(分)',
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
          duration: 1,
          way: 1
        },
        fieldList: {
          head: {
            title: '警铃',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.AlarmBell.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.AlarmBell.data
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
              label: '暂停时长(分)',
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
          duration: 1,
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
            {
              label: '开关',
              key: 'open',
              type: 'switch'
            },
            {
              className: 'el-form-item_width',
              label: '暂停时长(分)',
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
          open: true,
          duration: 1,
          way: 1
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
            {
              label: '开关',
              key: 'open',
              type: 'switch'
            },
            {
              label: '暂停时长(分)',
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
          ctrlDevType: 'FixedFan',
          open: true,
          duration: 1,
          way: 6
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
              label: '暂停时长(分)',
              key: 'duration',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },
      // 手自动
      HandAuto: {
        checkerId: 1,
        data: {
          ctrlDevType: 'FixedFan',
          open: true,
          duration: 1,
          way: 5
        },
        fieldList: {
          head: {
            title: '手自动',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.HandAuto.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.HandAuto.data
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
              label: '暂停时长(分)',
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
          duration: 1
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
                  value: '饲喂',
                  key: 1,
                  id: 1
                }
                // {
                //   value: '饲喂2',
                //   key: 2,
                //   id: 2
                // }
              ]
            },
            {
              label: '线路开关',
              key: 'open',
              type: 'switch'
            },
            {
              label: '暂停时长(分)',
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
          duration: 1
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
              label: '暂停时长(分)',
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
          duration: 1,
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
              label: '暂停时长(分)',
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
          duration: 1,
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
              label: '暂停时长(分)',
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
          duration: 1,
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
              label: '暂停时长(分)',
              key: 'duration',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },
      alertCountdownList: [],
      alertTimer: null,
      timer: null

    }
  },
  beforeRouteLeave(to, form, next) {
    clearInterval(this.alertTimer)
    clearInterval(this.timer)
    next()
  },
  watch: {
    unitId(newValue, oldValue) {
      this.init()
    }
  },
  beforeDestroy() {
    clearInterval(this.alertTimer)
    clearInterval(this.timer)
  },
  created() {
    this.init()
    clearInterval(this.alertTimer)
  },
  methods: {
    init() {
      this.initUrl()
      this.getInfoByDeviceId()
      this.timing()
    },
    initUrl() {
      this.noData = this.$getImgUrl('noData', 'svg')
    },
    timing() {
      this.timer = setInterval(() => {
        this.getInfoByDeviceId()
      }, 1000 * 60 * 2)
    },
    // 下发指令
    mcuInstruction(datas) {
      // console.log(this.overviewDetail.equiment_info.deviceId, this.overviewDetail.equiment_info.deviceName, this.overviewDetail.equiment_info.deviceId)
      // console.log('报警控制发送的参数', data)
      const deviceId = this.overviewDetail.equiment_info.deviceId
      const deviceName = this.overviewDetail.equiment_info.deviceName
      this.loading = true
      // const a = null
      console.log('报警控制发送的参数')
      console.log({ deviceId, deviceName })
      // eslint-disable-next-line no-redeclare
      const data = JSON.parse(JSON.stringify(datas))
      data.forEach((item) => {
        item.duration = item.duration * 60
        console.log('遍历的内容', item)
      })
      console.log(data)
      // if (!a) {
      //   return
      // }
      mcuInstructionAlarmV2({ deviceId, deviceName }, data).then((res) => {
        this.loading = false
        if (res.rel) {
          this.$message.success(res.message)
          this.getInfoByDeviceId()
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    getTime(time) {
      const newT = new Date().getTime()
      const t = new Date(time).getTime()
      const differenceT = (t - newT) < 0 ? 0 : Math.floor((t - newT) / 1000)
      return differenceT
    },
    // 转化时间
    conversion(time) {
      const s = (Math.floor(time / 1) % 60) < 10 ? '0' + (Math.floor(time / 1) % 60) : (Math.floor(time / 1) % 60)
      time = Math.floor(time / 60)
      const i = (time % 60) < 10 ? '0' + (time % 60) : (time % 60)
      time = Math.floor(time / 60)
      const h = (time % 24) < 10 ? '0' + (time % 24) : (time % 24)
      return h + ':' + i + ':' + s
    },
    alertInterval() {
      clearInterval(this.alertTimer)
      this.alertTimer = setInterval(() => {
        this.alertCountdownList.map((i, index) => {
          if (i.time <= 0) {
            this.alertCountdownList.splice(index, 1)
          } else {
            i.time--
            i.date = this.conversion(i.time)
          }
        })
      }, 1000)
    },
    // 获取报警暂停倒计时
    getInfoByDeviceId() {
      const deviceId = this.info.overview.deviceId
      this.loading = true
      this.$httpRequest({
        type: 'GET',
        uri: `/unit_evc/alarmPause/getInfoByDeviceId`,
        payload: {
          deviceId: deviceId
        },
        callback: res => {
          this.loading = false
          console.log(11111, res)
          if (res && res.status === 200 && res.rel) {
            const arr = []
            for (const i of res.data) {
              i.time = this.getTime(i.stopTime)
              i.date = this.conversion(this.getTime(i.stopTime))
              arr.push(i)
            }
            console.log(arr)
            this.alertCountdownList = arr
            this.alertInterval()
          } else {
            this.$message.error(res.message)
          }
        }
      })
    }

  }

}
</script>

<style lang="scss" scoped>
.equipment-control{
  display: flex;
}
.equipment-body-l{
  flex: 4;
}
.equipment-body-r{
  flex: 1;
  border-radius: 4px;
  overflow: hidden;
  font-size: 14px;
  color: #cdd8f7;
  @include font_color('alarmLongBoxTitleColor');
  margin-left: 20px;
  margin-bottom: 20px;
  background: #27376f;
  @include background_color('alarmLongBoxBkColor');
  border: 1px solid;
  @include border_color('alarmLongBoxTitleBorderColor');
  &-body{
    height: 100%;
  }
  &-head{
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #034c90;
    @include background_color('alarmLongBoxTitleBkColor');
    border-bottom: 1px solid;
    @include border_color('alarmLongBoxTitleBorderColor');
    padding: 10px 20px;
  }
  &-connect{
    padding: 10px 20px;
    &-col{
      height: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      @include font_color('alarmBoxFontColor');
      &-l{
        width: 90%;
      }
      &-r{
        flex: 1;
      }
    }
  }
}
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
    // border: 1px solid;
    // @include border_color('alarmLongBoxTitleBorderColor');
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
.equipment-body-v2-alarm{
  .el-form-item__error{
    bottom: -5px;
    top: unset !important;
  }
}
</style>
