<template>
  <div class="multi-function-setting">
    <div class="nav">
      <div class="refresh">
        <el-switch
          v-model="isRefresh"
          active-color="#10AEFF"
          inactive-color="#586CA5"
          @change="refresh"
        />
        <div class="name">开启自动刷新</div>
      </div>
      <div class="option">
        <el-popconfirm
          title="确定发送指令到设备吗？"
          @onConfirm="singleUnit()"
        >
          <el-button slot="reference" v-hasAuth="'PiggeryDeviceOverview:configSingleUnit'" class="btn-blue" :loading="singleUnitLoading">下发指令</el-button>
          <!-- <el-button slot="reference" class="btn-blue" :loading="singleUnitLoading">下发指令</el-button> -->
        </el-popconfirm>
        <!-- <el-button v-hasAuth="'PiggeryDeviceOverview:configSingleUnit'" class="btn-blue" :loading="singleUnitLoading" @click="singleUnit()">下发指令</el-button> -->
        <el-button class="btn-red" @click="parameterSetting()">退出编辑</el-button>
      </div>
    </div>
    <div class="allcheckContent">
      <el-checkbox v-model="allChecked" @change="handleCheckAllChange" />全选
    </div>
    <el-checkbox-group v-model="checkedProgress" @change="handleCheckedChange">
      <div v-loading="loading" class="main">
        <div class="overview-box-main">
          <overview-box
            v-if="deviceConfig.data"
            ref="deviceConfig"
            class="overview-box"
            :data="deviceConfig.data"
            :field-list="deviceConfig.fieldList"
          >
            <template v-slot:head>
              <div class="title">
                <!-- 设备参数 -->
                <el-checkbox label="deviceConfig">设备参数</el-checkbox>
              </div>
            </template>
          </overview-box>
          <overview-box
            v-if="destConfig.data"
            ref="destConfig"
            class="overview-box unit-config"
            :data="destConfig.data"
            :field-list="destConfig.fieldList"
          >
            <template v-slot:head>
              <div class="title">
                <!-- 目标参数 -->
                <el-checkbox label="destConfig">目标参数</el-checkbox>
              </div>
            </template>
          </overview-box>
          <overview-box
            v-if="setEscalationPeriod.data"
            ref="setEscalationPeriod"
            class="overview-box unit-config"
            :data="setEscalationPeriod.data"
            :field-list="setEscalationPeriod.fieldList"
          >
            <template v-slot:head>
              <div class="title">
                <!-- 上报周期 -->
                <el-checkbox label="setEscalationPeriod">上报周期</el-checkbox>
              </div>
            </template>
          </overview-box>
          <!-- 饲喂开启时间/时长 -->
          <div
            class="overview-box light-config-feed"
          >
            <div class="box-head">
              <div class="title">
                <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
                <el-checkbox label="feedConfig">饲喂开启时间/开启时长</el-checkbox>
              </div>
            </div>
            <div class="overview-box">
              <el-form
                ref="feedConfig"
                style="max-height:500px;overflow-y:scroll;padding: 10px 20px;"
                :model="feedConfig"
              >
                <div class="title" style="height: 36px;line-height: 36px;">
                  开启时间（时/分） / 开启时长（秒）:
                </div>
                <div v-for="(item, index) in feedConfig.data.entrys" :key="index" class="form-time-item add-total-class">
                  <el-form-item
                    class="del-margin-class"
                    :prop="`openTime${index}`"
                    :rules="[
                      {
                        validator: (rule, value ,callback) => {
                          const v = item.openTime
                          if (v == undefined || v == null || v == '') {
                            callback('不能为空')
                          } else {
                            callback()
                          }
                        },
                        trigger: ['blur', 'change']
                      }
                    ]"
                  >
                    <el-time-picker
                      v-model="item.openTime"
                      class="time-picker add-time-class"
                      :disabled="feedConfig.fieldList.disabled"
                      placeholder="开始时间"
                      value-format="HH:mm:ss"
                      format="HH:mm:ss"
                      @change="changePicker"
                    />
                  </el-form-item>
                  <el-form-item
                    class="del-margin-class"
                    :prop="`openDuration${index}`"
                    :rules="[
                      {
                        validator: (rule, value ,callback) => {
                          const v = item.openDuration
                          if (v === undefined || v === null || v === '') {
                            callback('不能为空')
                          } else {
                            callback()
                          }
                        },
                        trigger: ['blur', 'change']
                      }
                    ]"
                  >
                    <el-input-number
                      v-model="item.openDuration"
                      class="input-number add-input-class"
                      :min="0"
                      :disabled="feedConfig.fieldList.disabled"
                      controls-position="right"
                    />
                    <!-- :min="0" -->
                  </el-form-item>
                  <div
                    v-if="index !== 0"
                    class="delete"
                    style="font-size: 16px;color: #FF2727;cursor: pointer;margin-left:10px;padding-top:12px"
                    @click="
                      feedConfig.fieldList.disabled ? '' : deleteFeedTime(index)
                    "
                  >
                    <i class="el-icon-close" />
                  </div>
                </div>
                <div
                  class="add-time"
                  style="font-size: 12px;color: #10AEFF;cursor: pointer;"
                  @click="feedConfig.fieldList.disabled ? '' : addFeedTime()"
                >
                  添加记录
                </div>
              </el-form>
            </div>
          </div>
          <overview-box
            ref="tempHuConfig"
            class="overview-box"
            :data="tempHuConfig.data"
            :field-list="tempHuConfig.fieldList"
          >
            <template v-slot:head>
              <!-- <div class="box-head"> -->
              <div class="title">
                <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
                <el-checkbox label="tempHuConfig">温湿度传感器参数</el-checkbox>
              </div>
            </template>
          </overview-box>
        </div>
        <div class="overview-box-main">
          <overview-box
            ref="humidifyingConfig"
            class="overview-box next-row"
            :data="humidifyingConfig.data"
            :field-list="humidifyingConfig.fieldList"
          >
            <template v-slot:head>
              <div class="title">
                <!-- 雾化盘参数 -->
                <el-checkbox label="humidifyingConfig">雾化盘参数</el-checkbox>
              </div>
            </template>
          </overview-box>
          <overview-box
            ref="alarmConfig"
            class="overview-box next-row"
            :data="alarmConfig.data"
            :field-list="alarmConfig.fieldList"
          >
            <template v-slot:head>
              <div class="title">
                <!-- 报警参数 -->
                <el-checkbox label="alarmConfig">报警参数</el-checkbox>
              </div>
            </template>
          </overview-box>
          <overview-box
            ref="showerConfig"
            class="overview-box next-row"
            :data="showerConfig.data"
            :field-list="showerConfig.fieldList"
          >
            <template v-slot:head>
              <!-- <div class="box-head"> -->
              <div class="title">
                <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
                <el-checkbox label="showerConfig">喷淋参数</el-checkbox>
              </div>
            </template>
          </overview-box>
          <overview-box
            ref="unitConfig"
            class="overview-box unit-config next-row"
            :data="unitConfig.data"
            :field-list="unitConfig.fieldList"
          >
            <template v-slot:head>
              <div class="title">
                <!-- 单元参数 -->
                <el-checkbox label="unitConfig">单元参数</el-checkbox>
              </div>
            </template>
          </overview-box>
        </div>
      </div>
    </el-checkbox-group>
  </div>
</template>

<script>
import { ArgsInfo, singleUnit } from '@/http/api/piggeryDeviceOverview'
import OverviewBox from '@/views/IntelligentControl/fieldDeviceOverview/common/components/OverviewBox'
import jsontype from './config/formJson.json'
import rulesService from './utils/verification'
export default {
  components: {
    OverviewBox
  },
  inject: ['overviewDetail'],
  data() {
    return {
      infos: {},
      userInfo: localStorage.userJurisdiction,
      dialogDtatus: false,
      focusCurrent: '',
      loading: false,
      singleUnitLoading: false,
      dialogLoading: false,
      cur_prg: 0,
      viewInterval: '',
      singleTime: '',
      isRefresh: false,
      progressOptions: ['deviceConfig', 'destConfig', 'feedConfig', 'setEscalationPeriod', 'alarmConfig', 'showerConfig', 'unitConfig', 'tempHuConfig', 'humidifyingConfig'],
      checkedProgress: [],
      allChecked: false,
      refreshInterval: '',

      IntelligentControl: '',
      template: '',
      templateLists: [],

      dialogVisible: false,
      ArgsInfoV3Data: '',
      // 设备参数弹框配置
      listTypeInfo: {},
      formInfo: {
        testSamples: [
          { mac: '111111' },
          { mac: '' },
          { mac: '' },
          { mac: '' },
          { mac: '' },
          { mac: '' },
          { mac: '' },
          { mac: '' },
          { mac: '' },
          { mac: '' },
          { mac: '' },
          { mac: '' }
        ],
        data: {
          lockParam: 0,
          fixSpeedFanAmount: '',
          indoorBeforeProbe_mac: '',
          indoorAfterProbe_mac: '',
          heatLampProbe_mac: ''
        },
        fieldList: jsontype.arr
      },
      deviceConfig: {
        sendShow: false,
        data: {
          lockParam: 0,
          workMode: 0
        },
        fieldList: {
          disabled: false,
          head: {
            slot: true
          },
          body: [
            {
              title: '是否锁定',
              key: 'lockParam',
              type: 'radio',
              optList: [
                { label: '是', value: 1 },
                { label: '否', value: 0 }
              ]
            },
            {
              title: '工作模式',
              key: 'workMode',
              type: 'radio',
              optList: [
                { label: '手动模式', value: 1 },
                { label: '空圈模式', value: 2 }
              ]
            }
          ]
        }
      },
      // 设置目标参数
      destConfig: {
        sendShow: false,
        data: {
          destHumi: 0
        },
        fieldList: {
          disabled: false,
          head: {
            slot: true
          },
          body: [
            {
              title: '目标湿度（单位: %）',
              key: 'destHumi',
              type: 'inputNumber',
              precision: 1,
              step: 0.1,
              controlsPositionRight: 'right',
              ...rulesService.limit__45_90
            }
          ]
        }
      },
      showerConfig: {
        sendShow: false,
        data: {
          openTemp: 0,
          openDuration: 0,
          closeDuration: 0,
          staticMode: 0 // 0动态
        },
        fieldList: {
          disabled: false,
          head: {
            slot: true
          },
          body: [
            {
              title: '开启温度（单位: ℃）',
              key: 'openTemp',
              type: 'inputNumber',
              precision: 1,
              step: 0.1,
              controlsPositionRight: 'right',
              ...rulesService.limit_10_60
            },
            {
              title: '开启时长（单位: 秒）',
              key: 'openDuration',
              type: 'inputNumber',
              precision: 1,
              step: 1,
              controlsPositionRight: 'right',
              ...rulesService.limit_3_120
            },
            {
              title: '关闭时长（单位: 分）',
              key: 'closeDuration',
              type: 'inputNumber',
              precision: 1,
              step: 1,
              controlsPositionRight: 'right',
              ...rulesService.limit_5_100
            },
            {
              title: '工作模式',
              key: 'staticMode',
              type: 'radio',
              optList: [
                { label: '动态', value: 0 },
                { label: '静态', value: 1 }
              ]
            }
          ]
        }
      },
      // 饲喂开启时间/开启时长
      feedConfig: {
        sendShow: false,
        data: {
          entrys: [{ openTime: '08:00:00', openDuration: '0' }]
        },
        fieldList: {
          disabled: false,
          entrys: []
        }
      },
      tempHuConfig: {
        sendShow: false,
        data: {
          enable: 1,
          humidity: 0,
          temperature: 0
        },
        fieldList: {
          disabled: false,
          head: {
            slot: true
          },
          body: [
            {
              title: '是否启用',
              key: 'enable',
              type: 'radio',
              optList: [
                { label: '是', value: 1 },
                { label: '否', value: 0 }
              ]
            },
            {
              title: '温度校准值（单位: ℃）',
              key: 'temperature',
              type: 'inputNumber',
              precision: 1,
              step: 0.1,
              controlsPositionRight: 'right',
              ...rulesService.limit__2_2
            },
            {
              title: '湿度校准值（单位: %）',
              key: 'humidity',
              type: 'inputNumber',
              precision: 1,
              step: 1,
              controlsPositionRight: 'right',
              ...rulesService.limit__5_5
            }
          ]
        }
      },
      humidifyingConfig: {
        sendShow: false,
        data: {
          'openHumi': 0,
          'openDuration': 0,
          'closeDuration': 0
        },
        fieldList: {
          disabled: false,
          head: {
            slot: true
          },
          body: [
            {
              title: '开启湿度（%）',
              key: 'openHumi',
              type: 'inputNumber',
              precision: 1,
              step: 0.1,
              controlsPositionRight: 'right',
              ...rulesService.limit_50_80
            },
            {
              title: '开启时长（秒）',
              key: 'openDuration',
              type: 'inputNumber',
              precision: 1,
              step: 0.1,
              controlsPositionRight: 'right',
              ...rulesService.limit_60_1200
            },
            {
              title: '关闭时长（分）',
              key: 'closeDuration',
              type: 'inputNumber',
              precision: 1,
              step: 1,
              controlsPositionRight: 'right',
              ...rulesService.limit_5_60
            }
          ]
        }
      },
      alarmConfig: {
        sendShow: false,
        data: {
          high: '',
          low: '',
          humiHighAlarm: 0,
          disconnectedNetMask: ''
        },
        fieldList: {
          disabled: false,
          head: {
            slot: true
          },
          body: [
            {
              title: '高温报警值（°C）',
              key: 'high',
              type: 'inputNumber',
              precision: 1,
              step: 0.1,
              controlsPositionRight: 'right',
              ...rulesService.limit_0_50
            },
            {
              title: '低温报警值（°C）',
              key: 'low',
              type: 'inputNumber',
              precision: 1,
              step: 0.1,
              controlsPositionRight: 'right',
              ...rulesService.limit_10_1000000
            },
            {
              title: '高湿报警值（单位: %）',
              key: 'humiHighAlarm',
              type: 'inputNumber',
              precision: 1,
              step: 1,
              controlsPositionRight: 'right',
              ...rulesService.limit__30_90
            },
            {
              title: '断网报警',
              key: 'disconnectedNetMask',
              type: 'radio',
              optList: [
                { label: '启用', value: 0 },
                { label: '屏蔽', value: 1 }
              ]
            }
          ]
        }
      },
      unitConfig: {
        sendShow: false,
        recordHoggeryType: '',
        data: {
          batchNo: '',
          hoggeryType: '',
          // isBind: 1,
          pigCount: '',
          pigDays: '',
          unitNo: 1,
          weight: ''
        },
        fieldList: {
          disabled: false,
          head: {
            slot: true
          },
          body: [
            {
              title: '猪舍类型',
              key: 'hoggeryType',
              type: 'radio',
              optList: [
                { label: '未知', value: 0 },
                { label: '保育舍', value: 1 },
                { label: '育肥舍', value: 2 },
                { label: '一体舍', value: 3 },
                { label: '哺乳舍', value: 4 },
                { label: '怀孕舍', value: 5 },
                { label: '后备舍', value: 6 },
                { label: '公猪舍', value: 7 },
                { label: '待配舍', value: 8 }
              ]
            },
            {
              title: '装猪数量',
              key: 'pigCount',
              type: 'inputNumber',
              isShow: false,
              controlsPositionRight: 'right',
              ...rulesService.limit_0_no
            },
            {
              title: '猪日龄 ',
              key: 'pigDays',
              type: 'inputNumber',
              isShow: false,
              controlsPositionRight: 'right',
              ...rulesService.limit_0_1000000
            },
            {
              title: '单元编号',
              key: 'unitNo',
              type: 'inputNumber',
              isShow: false,
              controlsPositionRight: 'right',
              ...rulesService.limit_0_800
            },
            {
              title: '母猪胎次',
              key: 'batchNo',
              type: 'inputNumber',
              isShow: true,
              controlsPositionRight: 'right',
              ...rulesService.limit_0_100
            },
            {
              title: '单猪体重',
              key: 'weight',
              type: 'inputNumber',
              isShow: false,
              controlsPositionRight: 'right',
              ...rulesService.limit_0_300
            }
          ]
        }
      },
      setEscalationPeriod: {
        sendShow: false,
        data: {
          statusReportPeriod: 0
        },
        fieldList: {
          disabled: false,
          head: {
            slot: true
          },
          body: [
            {
              title: '上报周期(秒)',
              key: 'statusReportPeriod',
              type: 'inputNumber',
              min: 10,
              max: 3600,
              controlsPositionRight: 'right',
              ...rulesService.limit_0_1000000
            }
          ]
        }
      }
    }
  },
  watch: {
    'unitConfig.data.hoggeryType': {
      handler(type) {
        console.log('unitConfig.data.type切换了')
        this.unitConfig.fieldList.body[2].title = type === 4 ? '仔猪日龄' : type === 5 ? '母猪孕龄' : '猪日龄'
        // this.unitConfig.fieldList.body[5].label = type === 5 ? '母猪体重' : '单猪体重'
        this.unitConfig.recordHoggeryType = type
        if (type) {
          switch (type) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 7:
              this.unitConfig.fieldList.body[4].isShow = true
              // this.unitConfig.fieldList.body[5].isShow = true
              break
            case 4: // 哺乳舍
              this.unitConfig.fieldList.body[4].isShow = false // 母猪体重 显示
              // this.unitConfig.fieldList.body[5].isShow = true // 母猪胎次 隐藏
              // this.unitConfig.data.type === 4 ? '仔猪日龄' :

              break
            case 5: // 怀孕舍
              this.unitConfig.fieldList.body[4].isShow = false // 体重显示
              // this.unitConfig.fieldList.body[5].isShow = false // 台次 显示
              break
            case 6: // 后背舍
              this.unitConfig.fieldList.body[4].isShow = true // 体重隐藏
              // this.unitConfig.fieldList.body[5].isShow = false // 台词 显示
              break
            case 8: // 代配舍
              this.unitConfig.fieldList.body[4].isShow = true // 体重隐藏
              // this.unitConfig.fieldList.body[5].isShow = false // 胎次 显示
              break
            default:
              this.unitConfig.fieldList.body[4].isShow = true
              // this.unitConfig.fieldList.body[5].isShow = true
              break
          }
        }
      }
    }
  },
  beforeDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
    }
  },
  mounted() {
    this.infos = JSON.parse(sessionStorage.getItem('piggeryInfos'))
    // console.log('获取的状态管理数据', this.IntelligentControl)
    console.log('获取的猪舍信息', this.overviewDetail.overview)
    this.ArgsInfo()
  },
  methods: {
    changePicker(event) {
      console.log('选择的时间', event)
    },
    deleteFeedTime(index) {
      console.log('删除元素的索引', index, this.feedConfig.data.entrys)
      this.feedConfig.data.entrys.splice(index, 1)
    },
    addFeedTime() {
      const entrys = this.feedConfig.data.entrys
      if (entrys.length >= 48) {
        return
      } else {
        // const obj = { openTime: '', openDuration: '' }
        const obj = { openTime: '08:00:00', openDuration: '0' }
        this.feedConfig.data.entrys = [...entrys, obj]
      }
      console.log('时间添加事件', entrys)
    },
    handleCheckAllChange(val) {
      this.checkedProgress = val ? this.progressOptions : []
    },
    handleCheckedChange(val) {
      const checkedCount = val.length
      this.allChecked = checkedCount === this.progressOptions.length
    },
    initUnitConfig(type) {
      this.unitConfig.fieldList.body[2].title = type === 4 ? '仔猪日龄' : type === 5 ? '母猪孕龄' : '猪日龄'
      // this.unitConfig.fieldList.body[5].label = type === 5 ? '母猪体重' : '单猪体重'
      if (type) {
        this.unitConfig.recordHoggeryType = type
        switch (type) {
          case 4:
            this.unitConfig.fieldList.body[4].isShow = false
            break
          case 5:
            this.unitConfig.fieldList.body[4].isShow = false
            // this.unitConfig.fieldList.body[5].isShow = false
            break
          case 6:
            // this.unitConfig.fieldList.body[5].isShow = false
            break
          case 8:
            // this.unitConfig.fieldList.body[5].isShow = false
            break
        }
      }
    },
    subUnitConfig(data, type) {
      if (data === undefined) { // 没有单元参数
        return data
      }
      switch (type) {
        case 4:
          // delete data.weight
          return data
          // break
        case 5:
          return data
        case 6:
          delete data.gestationTimes
          return data
        case 8:
          delete data.gestationTimes
          return data
        default:
          // delete data.weight
          delete data.gestationTimes
          return data
          // break
      }
    },
    close() {
      this.dialogDtatus = false
    },
    refresh(e) {
      console.log('switch的切换', e)
      if (e) {
        this.clearRefreshInterval()
        this.refreshIntervalFun()
      } else {
        this.clearRefreshInterval()
      }
    },

    refreshIntervalFun() {
      this.refreshInterval = setInterval(() => {
        this.ArgsInfo()
        console.log('定时器')
      }, 3 * 60 * 1000)
    },

    clearRefreshInterval() {
      clearInterval(this.refreshInterval)
    },

    viewIntervalFun() {
      this.loading = true
      this.cur_prg = 0
      this.clearViewInterval()
      this.singleTime = Date.now()
      this.viewInterval = setInterval(() => {
        if (this.cur_prg <= 5) {
          this.ArgsInfo()
          this.cur_prg++
          console.log('定时器', this.cur_prg)
        } else {
          this.clearViewInterval()
          this.$message.error('参数设置下发超时，请重试！')
          this.loading = false
        }
      }, 1000)
    },

    clearViewInterval() {
      clearInterval(this.viewInterval)
    },

    parameterSetting() {
      console.log('获取的父组件内容', this.overviewDetail)
      this.overviewDetail.progress = 'parameterSetting'
    },

    initArgsInfoData() {
      this.unitConfig.fieldList.body[4].isShow = true
      // this.unitConfig.fieldList.body[5].isShow = true
      const ArgsInfoData = JSON.parse(JSON.stringify(this.ArgsInfoData))
      const { alarmConfig, piggeryConfig } = ArgsInfoData
      if (alarmConfig !== null || alarmConfig !== undefined) {
        this.alarmConfig.data = {
          high: alarmConfig.tempHighAlarm || 0,
          low: alarmConfig.tempLowAlarm || 0,
          humiHighAlarm: alarmConfig?.humiHighAlarm || 0,
          disconnectedNetMask: alarmConfig.disnetMask || 0
        }
      } else {
        this.alarmConfig.data = {
          high: 0,
          low: 0,
          humiHighAlarm: 0,
          disconnectedNetMask: 0
        }
      }
      if (piggeryConfig !== null || piggeryConfig !== undefined) {
        this.unitConfig.data = {
          batchNo: piggeryConfig.gestationTimes || 0,
          hoggeryType: piggeryConfig.type || 0,
          // isBind: piggeryConfig.binding,
          pigCount: piggeryConfig.count || 0,
          pigDays: piggeryConfig.age || 0,
          unitNo: piggeryConfig.id || 0,
          weight: piggeryConfig.weight || 0
        }
      } else {
        this.unitConfig.data = {
          batchNo: 0,
          hoggeryType: 0,
          // isBind: 1,
          pigCount: 0,
          pigDays: 0,
          unitNo: 0,
          weight: 0
        }
      }
      this.initUnitConfig(piggeryConfig.type)
      // 设备参数
      const { deviceConfig } = ArgsInfoData
      this.deviceConfig.data = {
        lockParam: deviceConfig?.lockParam || 0,
        workMode: deviceConfig?.workMode || 0
      }
      // 目标参数
      this.destConfig.data = ArgsInfoData.destConfig || {
        destHumi: 0
      }
      // 雾化盘参数
      this.humidifyingConfig.data = ArgsInfoData.humidifyingConfig || {
        'openHumi': 0,
        'openDuration': 0,
        'closeDuration': 0
      }
      // 饲喂开启时间/开启时长
      if (ArgsInfoData?.feedConfig?.entrys?.length !== 0) {
        this.feedConfig.data.entrys = ArgsInfoData.feedConfig.entrys
      }
      // 上报周期 statusReportPeriod
      this.setEscalationPeriod.data.statusReportPeriod = ArgsInfoData.reportperiod || 0
      // 喷淋参数
      this.showerConfig.data = ArgsInfoData.tempWorkConfig || {
        openTemp: 0,
        openDuration: 0,
        closeDuration: 0,
        staticMode: 0 // 0动态
      }
      // 温湿度设置
      this.tempHuConfig.data = ArgsInfoData && ArgsInfoData.sensorConfig && ArgsInfoData.sensorConfig.indoorBefore || {
        enable: 1,
        humidity: 0,
        temperature: 0
      }
    },
    ArgsInfo() {
      ArgsInfo({ deviceId: this.infos.overview.deviceId, channel: this.infos.overview.channel }).then(
        (res) => {
          console.log(1111111111111111111111, res.data)
          this.ArgsInfoData = res.data
          this.$nextTick(() => { this.initArgsInfoData() })
          if (this.cur_prg !== 0) {
            if (
              new Date(this.ArgsInfoData.reportTime).getTime() > this.singleTime
            ) {
              this.$message.success('参数设置成功!')
              this.clearViewInterval()
            }
          }
        }
      )
    },
    runtimeArgs(data) {
      this.ArgsInfoData = data
      this.$nextTick(() => { this.initArgsInfoData() })
      this.$message.success('参数设置成功!')
    },
    singleUnit() {
      console.log(this.$refs.unitConfig.$refs)
      this.$refs.unitConfig.$refs[`overviewBoxForm`].validate((valid) => { valid ? console.log(1) : console.log(2); return false })
      // checkedProgress ["setEscalationPeriod","alarmConfig","showerConfig","unitConfig","tempHuConfig"]
      const type = []
      // 饲喂开启
      this.checkedProgress.indexOf('feedConfig') !== -1 ? this.$refs.feedConfig.validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
      // 设备参数
      this.checkedProgress.indexOf('deviceConfig') !== -1 ? this.$refs.setEscalationPeriod.$refs[`overviewBoxForm`].validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
      // 目标参数
      this.checkedProgress.indexOf('destConfig') !== -1 ? this.$refs.setEscalationPeriod.$refs[`overviewBoxForm`].validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
      // 物化盘参数
      this.checkedProgress.indexOf('humidifyingConfig') !== -1 ? this.$refs.humidifyingConfig.$refs[`overviewBoxForm`].validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
      // 上报周期
      this.checkedProgress.indexOf('setEscalationPeriod') !== -1 ? this.$refs.setEscalationPeriod.$refs[`overviewBoxForm`].validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
      // 报警参数
      this.checkedProgress.indexOf('alarmConfig') !== -1 ? this.$refs.alarmConfig.$refs[`overviewBoxForm`].validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
      // 喷淋参数
      this.checkedProgress.indexOf('showerConfig') !== -1 ? this.$refs.showerConfig.$refs[`overviewBoxForm`].validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
      // 单元参数
      this.checkedProgress.indexOf('unitConfig') !== -1 ? this.$refs.unitConfig.$refs[`overviewBoxForm`].validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
      // 温湿度传感器参数
      this.checkedProgress.indexOf('tempHuConfig') !== -1 ? this.$refs.tempHuConfig.$refs[`overviewBoxForm`].validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
      console.log('type--------', type)
      if (this.checkedProgress.length > 0) {
        if (type.indexOf(1) !== -1) {
          this.$message.error('参数错误，请根据提示，填写正确的参数')
          return
        }
      } else {
        this.$message.error('您未选择任何指令,请至少勾选一条指令!')
        return
      }
      const o = {
        deviceConfig: this.deviceConfig.data,
        destConfig: this.destConfig.data,
        feedConfig: this.feedConfig.data,
        humidifyingConfig: this.humidifyingConfig.data,
        'reportperiod': this.setEscalationPeriod.data.statusReportPeriod,
        'piggeryConfig': {
          'type': this.unitConfig.data.hoggeryType,
          'id': this.unitConfig.data.unitNo,
          'count': this.unitConfig.data.pigCount,
          'age': this.unitConfig.data.pigDays,
          'gestationTimes': this.unitConfig.data.batchNo,
          'weight': this.unitConfig.data.weight
        },
        'sensorConfig': {
          'indoorBefore': {
            'enable': this.tempHuConfig.data.enable,
            'temperature': this.tempHuConfig.data.temperature,
            'humidity': this.tempHuConfig.data.humidity
          }
        },
        'alarmConfig': {
          'tempHighAlarm': this.alarmConfig.data.high,
          'tempLowAlarm': this.alarmConfig.data.low,
          humiHighAlarm: this.alarmConfig.data.humiHighAlarm,
          'disnetMask': this.alarmConfig.data.disconnectedNetMask
        },
        'tempWorkConfig': {
          'openTemp': this.showerConfig.data.openTemp,
          'openDuration': this.showerConfig.data.openDuration,
          'closeDuration': this.showerConfig.data.closeDuration, // 关闭时长  分钟 * 60
          'staticMode': this.showerConfig.data.staticMode
        }
      }
      console.log('o---------', o)
      console.log('checkedProgress-----', this.checkedProgress)
      const data = {}
      if (this.checkedProgress.indexOf('humidifyingConfig') > -1) {
        console.log('11111111111111')
        data.humidifyingConfig = o.humidifyingConfig
      }
      if (this.checkedProgress.indexOf('feedConfig') > -1) {
        console.log('11111111111111')
        data.feedConfig = o.feedConfig
      }
      if (this.checkedProgress.indexOf('deviceConfig') > -1) {
        console.log('11111111111111')
        data.deviceConfig = o.deviceConfig
      }
      if (this.checkedProgress.indexOf('destConfig') > -1) {
        console.log('11111111111111')
        data.destConfig = o.destConfig
      }
      if (this.checkedProgress.indexOf('alarmConfig') > -1) {
        console.log('11111111111111')
        data.alarmConfig = o.alarmConfig
      }
      if (this.checkedProgress.indexOf('tempHuConfig') > -1) {
        console.log('222222222222')
        data.sensorConfig = o.sensorConfig
      }
      if (this.checkedProgress.indexOf('showerConfig') > -1) {
        data.tempWorkConfig = o.tempWorkConfig
      }
      if (this.checkedProgress.indexOf('setEscalationPeriod') > -1) {
        console.log('3333333333')
        data.reportperiod = o.reportperiod
      }
      if (this.checkedProgress.indexOf('unitConfig') > -1) {
        console.log('4444')
        data.piggeryConfig = o.piggeryConfig
      }
      console.log('checkedProgress-----', this.checkedProgress)
      console.log('data-----', data)
      this.subUnitConfig(data['piggeryConfig'], this.unitConfig.recordHoggeryType)
      if (this.infos.overview && this.infos.overview.statusOnline !== 0) {
        const params = {
          deviceId: this.infos.overview.deviceId || this.overviewDetail.overview.deviceId,
          deviceName: this.infos.overview.deviceName || this.overviewDetail.overview.deviceName,
          channel: this.infos.overview.channel || this.overviewDetail.overview.channel
        }
        this.loading = true
        this.singleUnitLoading = true
        singleUnit(params, data).then((res) => {
          console.log('提交返回的内容', res)
          this.loading = false
          this.singleUnitLoading = false
          if (res && res.status === 200 && res.rel) {
            if (res.data) {
              this.runtimeArgs(res.data.runtimeArgs)
            } else {
              this.viewIntervalFun()
            }
          } else {
            // this.$message.error(res.message)
          }
        // eslint-disable-next-line handle-callback-err
        }).catch(() => {
          this.loading = false
          this.singleUnitLoading = false
        })
      } else {
        this.$message.error('当前设备已离线!')
      }
    }
  }
}
</script>
<style lang="scss">
.multi-function-setting{
  .light-config-feed {
  margin: 0;
  // height: 681px;
  .el-input__inner {
    color: #cdd8f7;
  }
    .time-picker {
      width: auto !important;
    }
    .input-number {
      height: 40px;
    }
  .form-time-item {
    display: flex;
  }
  .time-picker {
    width: 40%;
    .el-input__inner {
      text-align: center;
    }
  }
  .overview-box .title{
    @include font_color('inPigFontColor1');
  }
  .el-form-item__error{
      top: 42px!important;
    }
}
  .el-input--suffix .el-input__inner {
    padding-right: 0;
  }
  .el-checkbox__inner {
    width: 16px;
    height: 16px;
  }
  .el-checkbox__inner::after {
    height: 10px;
    left: 6px;
  }
  .el-checkbox__label {
    // color: #cdd8f7;
    @include font_color('inPigFontColor1');
    font-size: 16px;
  }
  .el-checkbox__input.is-checked+.el-checkbox__label {
    color: #cdd8f7;
  }
  .light-config {
    .overview-box {
      margin-right: 0 !important;
      .time-picker {
        width: auto !important;
      }
      .input-number {
        height: 40px;
      }
    }
  }
}

// 表单校验错误提示

.multi-function-setting{
  .el-form-item__error{
    top: 35px;
  }
  .overview-box{
    &.next-row{
      max-width: 19%;
    }
    .el-form-item__error{
      top: 72px;
    }
    .form-body {
      .el-form-item__error{
        top: 36px;
      }
    }
    .form-item-row{
      .el-form-item__error{
        top: 36px;
      }
    }
  }
  .light-config{
    .el-form-item__error{
      top: 38px;
    }
  }
  .overview-box-bottom{
    .el-form-item__error{
      top: 34px;
    }
  }
}
</style>
<style lang="scss" scoped>
ul {
  list-style-type: none;
  margin: 0;
}
.template {
  .template-item {
    margin-bottom: 10px;
    color: rgb(205, 216, 247);
    cursor: pointer;
    &:hover {
      color: #409eff;
    }
  }
}
.parameter-template {
  display: flex;
  color: #cdd8f7;
  margin-bottom: 20px;
  .current {
    color: #409eff;
  }
}
.allcheckContent {
  // color: #cdd8f7;
  @include font_color('inPigFontColor1');
  margin-bottom: 10px;
}
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.btn-border,
.btn-blue,
.btn-red {
  padding: 5px 15px;
  margin-left: 10px;
}
.refresh {
  font-size: 12px;
  color: #f4f7ff;
  @include font_color('mainFontColor2');
  display: flex;
  align-items: center;
  // margin-bottom: 20px;
  .name {
    margin-left: 10px;
  }
}

.row-box {
  margin-bottom: 20px;
  width: 100%;
}

// .multi-function-setting {
//   overflow: scroll;
//   &::-webkit-scrollbar {
//     display: none;
//   }
// }
.main {
  display: flex;
  flex-wrap: wrap;
  // min-width: 1680px;
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
    // margin-right: 0;
  }
  .title {
    font-size: 12px;
    color: #cdd8f7;
  }
}
.box-head {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #034c90;
  padding: 10px 20px;
  .title {
    font-size: 16px;
    color: #cdd8f7;
  }
  .option {
    font-size: 12px;
    color: #68ccff;
    display: flex;
    .edit,
    .cancel,
    .send {
      cursor: pointer;
    }
    .send {
      margin-left: 20px;
    }
  }
}
.overview-panel {
  border-radius: 4px;
  background: #27376f;
  overflow: hidden;
  .el-form-item {
    margin-bottom: 0;
  }
  .box-body {
    font-size: 12px;
    padding: 10px 20px;
    .form-title {
      .title {
        color: #6e83be;
      }
    }
    .form-body {
      display: flex;
      // align-items: center;
      color: #cdd8f7;
      margin-bottom: 10px;
      .label {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        height: 36px;
      }
    }
  }
}
.work-mode-config,
.light-config {
  margin-left: 20px;
  border-radius: 4px;
  background: #27376f;
  overflow: hidden;
  .manual-temp {
    display: flex;
    .title {
      position: relative;
      top: 10px;
      font-size: 12px;
      margin-right: 10px;
    }
    .manual-temp-inp {
      width: 150px;
    }
  }
}
.work-mode-config,
.light-config {
  .overview-box {
    padding: 20px;
    .title {
      margin-bottom: 20px;
    }
  }
  .overview-radio {
    margin-bottom: 20px;
  }
}
.light-config {
  margin: 0;
  height: 681px;
  .form-time-item {
    display: flex;
  }
  .time-picker {
    width: 40%;
    .el-input__inner {
      text-align: center;
    }
  }
}
</style>
