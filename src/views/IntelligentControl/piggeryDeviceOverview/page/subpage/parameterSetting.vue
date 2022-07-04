<template>
  <div class="parameter-setting">
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
        <!-- 没有参数设置 权限，，不让切换 -->
        <button v-hasAuth="'PiggeryDeviceOverview:configSingleUnit'" class="btn-border" @click="multiFunction()">
          多功能块编辑
        </button>
      </div>
    </div>
    <div v-loading="loading" class="main">
      <div class="overview-box-main">
        <!-- 设置设备参数 -->
        <overview-box
          ref="deviceConfig"
          v-loading="deviceConfigLoading"
          class="overview-box"
          :data="deviceConfig.data"
          :field-list="deviceConfig.fieldList"
        >
          <template v-slot:head>
            <div class="title">
              设备参数
            </div>
            <div class="option">
              <template v-if="!deviceConfig.sendShow">
                <div
                  v-hasAuth="'PiggeryDeviceOverview:configSingleUnit'"
                  class="edit"
                  @click="
                    deviceConfig.sendShow = true
                    deviceConfig.fieldList.disabled = false
                  "
                >
                  <svg-icon class="waring-icon" icon-class="edit-ico" />
                  编辑
                </div>
              </template>
              <template v-else>
                <div
                  class="cancel"
                  @click="
                    deviceConfig.sendShow = false
                    deviceConfig.fieldList.disabled = true
                    initArgsInfoData()
                  "
                >
                  取消
                </div>
                <el-popconfirm
                  title="确定发送指令到设备吗？"
                  style="margin-left:22px;"
                  @onConfirm="singleUnit('deviceConfig')"
                >
                  <svg-icon
                    slot="reference"
                    style="font-size:22px;cursor:pointer;"
                    class="waring-icon"
                    icon-class="send-instructions"
                  />
                </el-popconfirm>
              </template>
            </div>
            <!-- </div> -->
          </template>
        </overview-box>
        <!-- 设置目标参数 -->
        <overview-box
          ref="destConfig"
          v-loading="destConfigLoading"
          class="overview-box"
          :data="destConfig.data"
          :field-list="destConfig.fieldList"
        >
          <template v-slot:head>
            <!-- <div class="box-head"> -->
            <div class="title">
              <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
              目标参数
            </div>
            <div class="option">
              <template v-if="!destConfig.sendShow">
                <div
                  v-hasAuth="'PiggeryDeviceOverview:configSingleUnit'"
                  class="edit"
                  @click="
                    destConfig.sendShow = true
                    destConfig.fieldList.disabled = false
                  "
                >
                  <svg-icon class="waring-icon" icon-class="edit-ico" />
                  编辑
                </div>
              </template>
              <template v-else>
                <div
                  class="cancel"
                  @click="
                    destConfig.sendShow = false
                    destConfig.fieldList.disabled = true
                    initArgsInfoData()
                  "
                >
                  取消
                </div>
                <el-popconfirm
                  title="确定发送指令到设备吗？"
                  style="margin-left:22px;"
                  @onConfirm="singleUnit('destConfig')"
                >
                  <svg-icon
                    slot="reference"
                    style="font-size:22px;cursor:pointer;"
                    class="waring-icon"
                    icon-class="send-instructions"
                  />
                </el-popconfirm>
              </template>
            </div>
            <!-- </div> -->
          </template>
        </overview-box>
        <!-- 设置上报周期 -->
        <overview-box
          ref="setEscalationPeriod"
          v-loading="setEscalationPeriodLoading"
          class="overview-box unit-config"
          :data="setEscalationPeriod.data"
          :field-list="setEscalationPeriod.fieldList"
        >
          <template v-slot:head>
            <div class="title">
              上报周期
            </div>
            <div class="option">
              <template v-if="!setEscalationPeriod.sendShow">
                <div
                  v-hasAuth="'PiggeryDeviceOverview:configSingleUnit'"
                  class="edit"
                  @click="
                    setEscalationPeriod.sendShow = true
                    setEscalationPeriod.fieldList.disabled = false
                  "
                >
                  <svg-icon class="waring-icon" icon-class="edit-ico" />
                  编辑
                </div>
              </template>
              <template v-else>
                <div
                  class="cancel"
                  @click="
                    setEscalationPeriod.sendShow = false
                    setEscalationPeriod.fieldList.disabled = true
                    initArgsInfoData()
                  "
                >
                  取消
                </div>
                <el-popconfirm
                  title="确定发送指令到设备吗？"
                  style="margin-left:22px;"
                  @onConfirm="singleUnit('setEscalationPeriod')"
                >
                  <svg-icon
                    slot="reference"
                    style="font-size:22px;cursor:pointer;"
                    class="waring-icon"
                    icon-class="send-instructions"
                  />
                </el-popconfirm>
              </template>
            </div>
            <!-- </div> -->
          </template>
        </overview-box>
        <!-- 饲喂开启时间/时长 -->
        <div
          v-loading="feedConfigLoading"
          class="overview-box light-config-feed"
        >
          <div class="box-head">
            <div class="title">
              饲喂开启时间/开启时长
            </div>
            <div class="option">
              <template v-if="!feedConfig.sendShow">
                <div
                  v-hasAuth="'fieldDeviceOverview:configParamsSingleUnit_MCU'"
                  class="edit"
                  @click="
                    feedConfig.sendShow = true
                    feedConfig.fieldList.disabled = false
                  "
                >
                  <svg-icon class="waring-icon" icon-class="edit-ico" />
                  编辑
                </div>
              </template>
              <template v-else>
                <div
                  class="cancel"
                  @click="
                    feedConfig.sendShow = false
                    feedConfig.fieldList.disabled = true
                    initArgsInfoData()
                  "
                >
                  取消
                </div>
                <div
                  class="send"
                >
                  <el-popconfirm
                    title="确定发送指令到设备吗？"
                    @onConfirm="singleUnit('feedConfig')"
                  >
                    <svg-icon
                      slot="reference"
                      class="waring-icon"
                      icon-class="send-instructions"
                    />
                  </el-popconfirm>
                </div>
              </template>
            </div>
          </div>
          <div class="overview-box">
            <el-form
              ref="feedConfig"
              style="max-height: 500px;overflow-y: scroll;padding: 10px 20px;"
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
        <!-- 设置温湿度传感器 -->
        <overview-box
          ref="tempHuConfig"
          v-loading="tempHuConfigLoading"
          class="overview-box"
          :data="tempHuConfig.data"
          :field-list="tempHuConfig.fieldList"
        >
          <template v-slot:head>
            <!-- <div class="box-head"> -->
            <div class="title">
              <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
              温湿度传感器参数
            </div>
            <div class="option">
              <template v-if="!tempHuConfig.sendShow">
                <div
                  v-hasAuth="'PiggeryDeviceOverview:configSingleUnit'"
                  class="edit"
                  @click="
                    tempHuConfig.sendShow = true
                    tempHuConfig.fieldList.disabled = false
                  "
                >
                  <svg-icon class="waring-icon" icon-class="edit-ico" />
                  编辑
                </div>
              </template>
              <template v-else>
                <div
                  class="cancel"
                  @click="
                    tempHuConfig.sendShow = false
                    tempHuConfig.fieldList.disabled = true
                    initArgsInfoData()
                  "
                >
                  取消
                </div>
                <el-popconfirm
                  title="确定发送指令到设备吗？"
                  style="margin-left:22px;"
                  @onConfirm="singleUnit('tempHuConfig')"
                >
                  <svg-icon
                    slot="reference"
                    style="font-size:22px;cursor:pointer;"
                    class="waring-icon"
                    icon-class="send-instructions"
                  />
                </el-popconfirm>
              </template>
            </div>
            <!-- </div> -->
          </template>
        </overview-box>
      </div>
      <div class="overview-box-main">
        <!-- 设置雾化盘参数 -->
        <overview-box
          ref="humidifyingConfig"
          v-loading="humidifyingConfigLoading"
          class="overview-box next-row"
          :data="humidifyingConfig.data"
          :field-list="humidifyingConfig.fieldList"
        >
          <template v-slot:head>
            <!-- <div class="box-head"> -->
            <div class="title">
              <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
              雾化盘参数
            </div>
            <div class="option">
              <template v-if="!humidifyingConfig.sendShow">
                <div
                  v-hasAuth="'PiggeryDeviceOverview:configSingleUnit'"
                  class="edit"
                  @click="
                    humidifyingConfig.sendShow = true
                    humidifyingConfig.fieldList.disabled = false
                  "
                >
                  <svg-icon class="waring-icon" icon-class="edit-ico" />
                  编辑
                </div>
              </template>
              <template v-else>
                <div
                  class="cancel"
                  @click="
                    humidifyingConfig.sendShow = false
                    humidifyingConfig.fieldList.disabled = true
                    initArgsInfoData()
                  "
                >
                  取消
                </div>
                <el-popconfirm
                  title="确定发送指令到设备吗？"
                  style="margin-left:22px;"
                  @onConfirm="singleUnit('humidifyingConfig')"
                >
                  <svg-icon
                    slot="reference"
                    style="font-size:22px;cursor:pointer;"
                    class="waring-icon"
                    icon-class="send-instructions"
                  />
                </el-popconfirm>
              </template>
            </div>
            <!-- </div> -->
          </template>
        </overview-box>
        <!-- 设置报警参数 -->
        <overview-box
          ref="alarmConfig"
          v-loading="alarmConfigLoading"
          class="overview-box next-row"
          :data="alarmConfig.data"
          :field-list="alarmConfig.fieldList"
        >
          <template v-slot:head>
            <!-- <div class="box-head"> -->
            <div class="title">
              <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
              报警参数
            </div>
            <div class="option">
              <template v-if="!alarmConfig.sendShow">
                <div
                  v-hasAuth="'PiggeryDeviceOverview:configSingleUnit'"
                  class="edit"
                  @click="
                    alarmConfig.sendShow = true
                    alarmConfig.fieldList.disabled = false
                  "
                >
                  <svg-icon class="waring-icon" icon-class="edit-ico" />
                  编辑
                </div>
              </template>
              <template v-else>
                <div
                  class="cancel"
                  @click="
                    alarmConfig.sendShow = false
                    alarmConfig.fieldList.disabled = true
                    initArgsInfoData()
                  "
                >
                  取消
                </div>
                <el-popconfirm
                  title="确定发送指令到设备吗？"
                  style="margin-left:22px;"
                  @onConfirm="singleUnit('alarmConfig')"
                >
                  <svg-icon
                    slot="reference"
                    style="font-size:22px;cursor:pointer;"
                    class="waring-icon"
                    icon-class="send-instructions"
                  />
                </el-popconfirm>
              </template>
            </div>
            <!-- </div> -->
          </template>
        </overview-box>
        <!-- 设置喷淋参数 -->
        <overview-box
          ref="showerConfig"
          v-loading="showerConfigLoading"
          class="overview-box next-row"
          :data="showerConfig.data"
          :field-list="showerConfig.fieldList"
        >
          <template v-slot:head>
            <!-- <div class="box-head"> -->
            <div class="title">
              <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
              喷淋参数
            </div>
            <div class="option">
              <template v-if="!showerConfig.sendShow">
                <div
                  v-hasAuth="'PiggeryDeviceOverview:configSingleUnit'"
                  class="edit"
                  @click="
                    showerConfig.sendShow = true
                    showerConfig.fieldList.disabled = false
                  "
                >
                  <svg-icon class="waring-icon" icon-class="edit-ico" />
                  编辑
                </div>
              </template>
              <template v-else>
                <div
                  class="cancel"
                  @click="
                    showerConfig.sendShow = false
                    showerConfig.fieldList.disabled = true
                    initArgsInfoData()
                  "
                >
                  取消
                </div>
                <el-popconfirm
                  title="确定发送指令到设备吗？"
                  style="margin-left:22px;"
                  @onConfirm="singleUnit('showerConfig')"
                >
                  <svg-icon
                    slot="reference"
                    style="font-size:22px;cursor:pointer;"
                    class="waring-icon"
                    icon-class="send-instructions"
                  />
                </el-popconfirm>
              </template>
            </div>
            <!-- </div> -->
          </template>
        </overview-box>
        <!-- 设置单元 -->
        <overview-box
          ref="unitConfig"
          v-loading="unitConfigLoading"
          class="overview-box unit-config next-row"
          :data="unitConfig.data"
          :field-list="unitConfig.fieldList"
        >
          <template v-slot:head>
            <!-- <div class="box-head"> -->
            <div class="title">
              <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
              单元参数
            </div>
            <div class="option">
              <template v-if="!unitConfig.sendShow">
                <div
                  v-hasAuth="'PiggeryDeviceOverview:configSingleUnit'"
                  class="edit"
                  @click="
                    unitConfig.sendShow = true
                    unitConfig.fieldList.disabled = false
                  "
                >
                  <svg-icon class="waring-icon" icon-class="edit-ico" />
                  编辑
                </div>
              </template>
              <template v-else>
                <div
                  class="cancel"
                  @click="
                    unitConfig.sendShow = false
                    unitConfig.fieldList.disabled = true
                    initArgsInfoData()
                  "
                >
                  取消
                </div>
                <el-popconfirm
                  title="确定发送指令到设备吗？"
                  style="margin-left:22px;"
                  @onConfirm="singleUnit('unitConfig')"
                >
                  <svg-icon
                    slot="reference"
                    style="font-size:22px;cursor:pointer;"
                    class="waring-icon"
                    icon-class="send-instructions"
                  />
                </el-popconfirm>
              </template>
            </div>
            <!-- </div> -->
          </template>
        </overview-box>
      </div>
    </div>
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
      infos: {}, // sessionStorage里存的
      userInfo: localStorage.userJurisdiction,
      deviceConfigLoading: false, // 设备参数loading
      destConfigLoading: false, // 目标参数loading
      humidifyingConfigLoading: false, // 雾化盘参数
      feedConfigLoading: false, // 饲喂开启时间/开启时长loading
      showerConfigLoading: false, // 喷淋参数loading
      tempHuConfigLoading: false, // 温湿度传感器
      alarmConfigLoading: false,
      equipmentConfigLoading: false,
      unitConfigLoading: false,
      sensorConfigLoading: false,
      setEscalationPeriodLoading: false,
      loading: false,
      dialogLoading: false,
      // 选项卡状态
      tabStatus: 'default',
      fieldId: '15350029',

      cur_prg: 0,
      viewInterval: '',
      singleTime: '',

      isRefresh: false,
      refreshInterval: '',

      dialogVisible: false,

      ArgsInfoData: '',
      ArgsInfoV3Data: '',
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
      // 饲喂开启时间/开启时长
      feedConfig: {
        sendShow: false,
        data: {
          entrys: [{ openTime: '08:00:00', openDuration: '0' }]
        },
        fieldList: {
          disabled: true,
          entrys: []
        }
      },
      // 设置设备参数
      deviceConfig: {
        sendShow: false,
        data: {
          lockParam: 0,
          workMode: 0
        },
        fieldList: {
          disabled: true,
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
          disabled: true,
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
      // 设置雾化盘参数
      humidifyingConfig: {
        sendShow: false,
        data: {
          'openHumi': 0,
          'openDuration': 0,
          'closeDuration': 0
        },
        fieldList: {
          disabled: true,
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
      // 设置上报周期
      setEscalationPeriod: {
        sendShow: false,
        data: {
          statusReportPeriod: 0
        },
        fieldList: {
          disabled: true,
          head: {
            slot: true
          },
          body: [
            {
              title: '上报周期(秒)',
              key: 'statusReportPeriod',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_1000000
            }
          ]
        }
      },

      // 设置报警
      alarmConfig: {
        sendShow: false,
        data: {
          tempHighAlarm: 0,
          tempLowAlarm: 0,
          humiHighAlarm: 0,
          disnetMask: 0 // 0断网报警屏蔽
        },
        fieldList: {
          disabled: true,
          head: {
            slot: true
          },
          body: [
            {
              title: '高温报警值（°C）',
              key: 'tempHighAlarm',
              type: 'inputNumber',
              precision: 1,
              step: 0.1,
              controlsPositionRight: 'right',
              ...rulesService.limit_0_50
            },
            {
              title: '低温报警值（°C）',
              key: 'tempLowAlarm',
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
              key: 'disnetMask',
              type: 'radio',
              optList: [
                { label: '启用', value: 0 },
                { label: '屏蔽', value: 1 }
              ]
            }
          ]
        }
      },
      // 设置喷淋
      showerConfig: {
        sendShow: false,
        data: {
          openTemp: 0,
          openDuration: 0,
          closeDuration: 0,
          staticMode: 0 // 0动态
        },
        fieldList: {
          disabled: true,
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
      // 设置温湿度传感器
      tempHuConfig: {
        sendShow: false,
        data: {
          enable: 1,
          humidity: 0,
          temperature: 0
        },
        fieldList: {
          disabled: true,
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
      // 设置单元
      unitConfig: {
        sendShow: false,
        data: {
          type: 1,
          count: 0,
          age: 52,
          // binding: 0,
          gestationTimes: 1,
          id: 10,
          weight: 110
        },
        fieldList: {
          disabled: true,
          head: {
            slot: true
          },
          body: [
            {
              title: '猪舍类型',
              key: 'type',
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
              key: 'count',
              type: 'inputNumber',
              isShow: false,
              controlsPositionRight: 'right',
              ...rulesService.limit_0_no
            },
            {
              // 哺乳舍 label为仔猪日龄
              title: '猪日龄 ',
              key: 'age',
              type: 'inputNumber',
              isShow: false,
              controlsPositionRight: 'right',
              ...rulesService.limit_0_1000000
            },
            {
              title: '单元编号',
              key: 'id',
              type: 'inputNumber',
              isShow: false,
              controlsPositionRight: 'right',
              ...rulesService.limit_0_800
            },
            {
              title: '母猪胎次',
              key: 'gestationTimes',
              type: 'inputNumber',
              isShow: true,
              controlsPositionRight: 'right',
              ...rulesService.limit_0_100
            },
            {
              title: '单猪体重', // 所有分类均有 体重 且叫单猪体重 且 显示
              key: 'weight',
              type: 'inputNumber',
              isShow: false,
              controlsPositionRight: 'right',
              ...rulesService.limit_0_300
            }
          ]
        }
      }

    }
  },
  watch: {
    'unitConfig.data.type': {
      handler(type) {
        console.log('unitConfig.data.type切换了') // 4 哺乳 5 怀孕
        this.unitConfig.fieldList.body[2].title = type === 4 ? '仔猪日龄' : type === 5 ? '母猪孕龄' : '猪日龄'
        // this.unitConfig.fieldList.body[5].label = type === 5 ? '母猪体重' : '单猪体重'
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
  mounted() {
    this.infos = JSON.parse(sessionStorage.getItem('piggeryInfos'))
    console.log('依赖注入的信息', this.overviewDetail)
    console.log('时间点的测试', new Date(2016, 9, 10, 18, 40))
    this.ArgsInfo()
  },
  beforeDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
    }
  },
  methods: {
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

    changePicker(event) {
      console.log('选择的时间', event)
    },
    // 该方法赋 初值 this.ArgsInfoData 保存初始值
    initArgsInfoData() {
      console.log('初始化的内容parameterSetting', this.ArgsInfoData)
      this.unitConfig.fieldList.body[4].isShow = true
      // this.unitConfig.fieldList.body[5].isShow = true
      const ArgsInfoData = JSON.parse(JSON.stringify(this.ArgsInfoData)) // ----------
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
      // 上报周期 statusReportPeriod
      this.setEscalationPeriod.data.statusReportPeriod = ArgsInfoData.reportperiod || 0
      // 饲喂开启时间/开启时长
      if (ArgsInfoData?.feedConfig?.entrys?.length > 0) {
        this.feedConfig.data.entrys = ArgsInfoData.feedConfig.entrys
      }
      // 报警参数 tempHighAlarm: 0,tempLowAlarm: 0, disnetMask: 0 // 0断网报警屏蔽
      this.alarmConfig.data = ArgsInfoData.alarmConfig || {
        tempHighAlarm: 0,
        tempLowAlarm: 0,
        humiHighAlarm: 0,
        disnetMask: 0
      }
      // 喷淋参数
      this.showerConfig.data = ArgsInfoData.tempWorkConfig || {
        openTemp: 0,
        openDuration: 0,
        closeDuration: 0,
        staticMode: 0 // 0动态
      }
      // eslint-disable-next-line no-prototype-builtins
      ArgsInfoData.piggeryConfig && ArgsInfoData.piggeryConfig.hasOwnProperty('binding') && delete ArgsInfoData.piggeryConfig.binding
      // 单元参数设置
      this.unitConfig.data = ArgsInfoData.piggeryConfig || {
        type: 0,
        count: 0,
        age: 0,
        // binding: 0,
        gestationTimes: 0,
        id: 0,
        weight: 0
      }
      console.log('ArgsInfoData', ArgsInfoData)
      this.initUnitConfig(ArgsInfoData.piggeryConfig ? ArgsInfoData.piggeryConfig.type : 0)
      // 温湿度设置
      this.tempHuConfig.data = ArgsInfoData && ArgsInfoData.sensorConfig && ArgsInfoData.sensorConfig.indoorBefore || {
        enable: 1,
        humidity: 0,
        temperature: 0
      }
    },
    // 这里需要单独处理一下 单元参数
    initUnitConfig(type) {
      console.log('type------', type)
      this.unitConfig.fieldList.body[2].title = type === 4 ? '仔猪日龄' : type === 5 ? '母猪孕龄' : '猪日龄'
      // this.unitConfig.fieldList.body[5].label = type === 5 ? '母猪体重' : '单猪体重'
      if (type) {
        this.unitConfig.recordHoggeryType = type
        switch (type) {
          case 4: // 哺乳舍
            this.unitConfig.fieldList.body[4].isShow = false
            break
          case 5: // 怀孕舍
            this.unitConfig.fieldList.body[4].isShow = false
            // this.unitConfig.fieldList.body[5].isShow = false
            break
          case 6: // 后背舍
            // this.unitConfig.fieldList.body[5].isShow = false
            break
          case 8: // 代配舍
            // this.unitConfig.fieldList.body[5].isShow = false
            break
        }
      }
    },
    ArgsInfo() {
      const o = {
        deviceId: this.infos.overview.deviceId,
        channel: this.infos.overview.channel
      }
      ArgsInfo(o).then(
        (res) => {
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
          console.log('返回的参数信息', res, this.temperatureControlConfig)
        }
      )
    },
    runtimeArgs(data) {
      this.ArgsInfoData = data
      this.$nextTick(() => { this.initArgsInfoData() })
      this.$message.success('参数设置成功!')
    },
    requestTemperatureControlConfig(type) {
      const params = {
        deviceId: this.infos.overview.deviceId,
        deviceName: this.infos.overview.deviceName
      }
      const temperatureControlConfig = JSON.parse(
        JSON.stringify(this.temperatureControlConfig)
      )
      const exchange = temperatureControlConfig.exchange
      const gutter = temperatureControlConfig.gutter
      const g2Humidifying = temperatureControlConfig.g2Humidifying
      const shower = temperatureControlConfig.shower
      exchange.openDuration = exchange.openDuration * 60
      gutter.openDuration = gutter.openDuration * 60
      g2Humidifying.closeDuration = g2Humidifying.closeDuration * 60
      shower.closeDuration = shower.closeDuration * 60
      console.log('提交的初始内容', this.temperatureControlConfig)
      console.log('提交的格式化后的内容', temperatureControlConfig)
      // const data = { temperatureControlConfig: temperatureControlConfig }
      const data = {}
      singleUnit(params, data).then((res) => {
        console.log('提交返回的信息', res)
        if (res.rel) {
          if (res.data) {
            this.runtimeArgs(res.data.runtimeArgs)
          } else {
            this.viewIntervalFun()
          }
        } else {
          this.initArgsInfoData()
          // this.$message.error(res.message)
        }
      })
    },

    requestAlarmConfig() {
      const params = {
        deviceId: this.infos.overview.deviceId,
        deviceName: this.infos.overview.deviceName,
        channel: this.infos.overview.channel
      }
      const data = { alarmConfig: this.alarmConfig.data }
      singleUnit(params, data).then((res) => {
        console.log('提交返回的信息', res)
        this.alarmConfigLoading = false
        if (res.rel) {
          if (res.data) {
            this.runtimeArgs(res.data.runtimeArgs)
          } else {
            this.viewIntervalFun()
          }
        } else {
          this.initArgsInfoData()
          // this.$message.error(res.message)
        }
      })
    },

    requestEquipmentConfig() {
      const params = {
        deviceId: this.infos.overview.deviceId,
        deviceName: this.infos.overview.deviceName,
        channel: this.infos.overview.channel
      }
      const equipmentConfig = JSON.parse(JSON.stringify(this.showerConfig.data))
      const data = { tempWorkConfig: equipmentConfig }
      singleUnit(params, data).then((res) => {
        console.log('提交返回的信息', res)
        this.showerConfigLoading = false
        if (res.rel) {
          if (res.data) {
            this.runtimeArgs(res.data.runtimeArgs)
          } else {
            this.viewIntervalFun()
          }
        } else {
          this.initArgsInfoData()
          // this.$message.error(res.message)
        }
      })
    },
    subUnitConfig(data, type) {
      switch (type) {
        case 4: // 哺乳舍
          // delete data.weight
          return data
          // break
        case 5: // 怀孕舍
          return data
        case 6: // 后背舍
          delete data.gestationTimes
          return data
        case 8: // 代配舍
          delete data.gestationTimes
          return data
        default:
          // delete data.weight
          delete data.gestationTimes
          return data
          // break
      }
    },
    requestUnitConfig() {
      const params = {
        deviceId: this.infos.overview.deviceId,
        deviceName: this.infos.overview.deviceName,
        channel: this.infos.overview.channel
      }
      const data = { piggeryConfig: this.unitConfig.data }
      console.log('this.unitConfig.recordHoggeryType', this.unitConfig.recordHoggeryType)
      this.subUnitConfig(data['piggeryConfig'], this.unitConfig.recordHoggeryType)
      console.log('单元参数', data)
      singleUnit(params, data).then((res) => {
        console.log('提交返回的信息', res)
        this.unitConfigLoading = false
        if (res.rel) {
          if (res.data) {
            this.runtimeArgs(res.data.runtimeArgs)
          } else {
            this.viewIntervalFun()
          }
        } else {
          this.initArgsInfoData()
          // this.$message.error(res.message)
        }
      })
    },
    requestSensorConfig() {
      const params = {
        deviceId: this.infos.overview.deviceId,
        deviceName: this.infos.overview.deviceName,
        channel: this.infos.overview.channel
      }
      const data = { sensorConfig: { indoorBefore: this.tempHuConfig.data }}
      singleUnit(params, data).then((res) => {
        console.log('提交返回的信息', res)
        this.tempHuConfigLoading = false
        if (res.rel) {
          if (res.data) {
            this.runtimeArgs(res.data.runtimeArgs)
          } else {
            this.viewIntervalFun()
          }
        } else {
          this.initArgsInfoData()
          // this.$message.error(res.message)
        }
      })
    },

    requestSetEscalationPeriod() {
      const params = {
        deviceId: this.infos.overview.deviceId,
        deviceName: this.infos.overview.deviceName,
        channel: this.infos.overview.channel
      }
      const data = {
        reportperiod: this.setEscalationPeriod.data.statusReportPeriod
      }
      singleUnit(params, data).then((res) => {
        console.log('提交返回的信息', res)
        this.setEscalationPeriodLoading = false
        if (res.rel) {
          if (res.data) {
            this.runtimeArgs(res.data.runtimeArgs)
          } else {
            this.viewIntervalFun()
          }
        } else {
          this.initArgsInfoData()
          // this.$message.error(res.message)
        }
      })
    },
    requestDeviceConfig() {
      const params = {
        deviceId: this.infos.overview.deviceId,
        deviceName: this.infos.overview.deviceName,
        channel: this.infos.overview.channel
      }
      const data = {
        deviceConfig: this.deviceConfig.data
      }
      singleUnit(params, data).then((res) => {
        console.log('提交返回的信息', res)
        this.deviceConfigLoading = false
        if (res.rel) {
          if (res.data) {
            this.runtimeArgs(res.data.runtimeArgs)
          } else {
            this.viewIntervalFun()
          }
        } else {
          this.initArgsInfoData()
          // this.$message.error(res.message)
        }
      })
    },
    requestDestConfig() {
      const params = {
        deviceId: this.infos.overview.deviceId,
        deviceName: this.infos.overview.deviceName,
        channel: this.infos.overview.channel
      }
      const data = {
        destConfig: this.destConfig.data
      }
      singleUnit(params, data).then((res) => {
        console.log('提交返回的信息', res)
        this.destConfigLoading = false
        if (res.rel) {
          if (res.data) {
            this.runtimeArgs(res.data.runtimeArgs)
          } else {
            this.viewIntervalFun()
          }
        } else {
          this.initArgsInfoData()
          // this.$message.error(res.message)
        }
      })
    },
    requestFeedConfig() {
      const params = {
        deviceId: this.infos.overview.deviceId,
        deviceName: this.infos.overview.deviceName,
        channel: this.infos.overview.channel
      }
      const data = {
        feedConfig: this.feedConfig.data
      }
      singleUnit(params, data).then((res) => {
        console.log('提交返回的信息', res)
        this.feedConfigLoading = false
        if (res.rel) {
          if (res.data) {
            this.runtimeArgs(res.data.runtimeArgs)
          } else {
            this.viewIntervalFun()
          }
        } else {
          this.initArgsInfoData()
          // this.$message.error(res.message)
        }
      })
    },
    requestHumidifyingConfig() {
      const params = {
        deviceId: this.infos.overview.deviceId,
        deviceName: this.infos.overview.deviceName,
        channel: this.infos.overview.channel
      }
      const data = {
        humidifyingConfig: this.humidifyingConfig.data
      }
      singleUnit(params, data).then((res) => {
        console.log('提交返回的信息', res)
        this.humidifyingConfigLoading = false
        if (res.rel) {
          if (res.data) {
            this.runtimeArgs(res.data.runtimeArgs)
          } else {
            this.viewIntervalFun()
          }
        } else {
          this.initArgsInfoData()
          // this.$message.error(res.message)
        }
      })
    },
    singleUnit(val) { // 上报周期setEscalationPeriod 报警参数alarmConfig 设备设置equipmentConfig 设置单元unitConfig 温湿度传感器sensorConfig
      console.log('依赖注入的信息', this.overviewDetail.overview.statusOnline)
      // console.log('提交的内容singleUnit', this.temperatureControlConfig)
      if (this.infos.overview && this.infos.overview.statusOnline !== 0) {
        switch (val) {
          case 'deviceConfig':
            this.$refs.deviceConfig.$refs[`overviewBoxForm`].validate((valid) => {
              if (valid) {
                this.requestDeviceConfig()
                this.deviceConfig.sendShow = false
                this.deviceConfig.fieldList.disabled = true
                this.deviceConfigLoading = true
              } else {
                this.$message.error(rulesService.submitErrorTip)
                return false
              }
            })
            break
          case 'destConfig':
            this.$refs.destConfig.$refs[`overviewBoxForm`].validate((valid) => {
              if (valid) {
                this.requestDestConfig()
                this.destConfig.sendShow = false
                this.destConfig.fieldList.disabled = true
                this.destConfigLoading = true
              } else {
                this.$message.error(rulesService.submitErrorTip)
                return false
              }
            })
            break
          case 'humidifyingConfig':
            this.$refs.humidifyingConfig.$refs[`overviewBoxForm`].validate((valid) => {
              if (valid) {
                this.requestHumidifyingConfig()
                this.humidifyingConfig.sendShow = false
                this.humidifyingConfig.fieldList.disabled = true
                this.humidifyingConfigLoading = true
              } else {
                this.$message.error(rulesService.submitErrorTip)
                return false
              }
            })
            break
          case 'feedConfig':
            this.$refs.feedConfig.validate((valid) => {
              if (valid) {
                this.requestFeedConfig()
                this.feedConfig.sendShow = false
                this.feedConfig.fieldList.disabled = true
                this.feedConfigLoading = true
              } else {
                this.$message.error(rulesService.submitErrorTip)
                return false
              }
            })
            break
          case 'alarmConfig':
            this.$refs.alarmConfig.$refs[`overviewBoxForm`].validate((valid) => {
              if (valid) {
                this.requestAlarmConfig()
                this.alarmConfig.sendShow = false
                this.alarmConfig.fieldList.disabled = true
                this.alarmConfigLoading = true
              } else {
                this.$message.error(rulesService.submitErrorTip)
                return false
              }
            })
            break
          case 'showerConfig': // 喷淋参数
            this.$refs.showerConfig.$refs[`overviewBoxForm`].validate((valid) => {
              if (valid) {
                console.log('ssss')
                this.requestEquipmentConfig()
                this.showerConfig.sendShow = false
                this.showerConfig.fieldList.disabled = true
                this.showerConfigLoading = true
              } else {
                this.$message.error(rulesService.submitErrorTip)
                return false
              }
            })
            break
          case 'unitConfig':
            this.$refs.unitConfig.$refs[`overviewBoxForm`].validate((valid) => {
              if (valid) {
                this.requestUnitConfig()
                this.unitConfig.sendShow = false
                this.unitConfig.fieldList.disabled = true
                this.unitConfigLoading = true
              } else {
                this.$message.error(rulesService.submitErrorTip)
                return false
              }
            })
            break
          case 'tempHuConfig':
            this.$refs.tempHuConfig.$refs[`overviewBoxForm`].validate((valid) => {
              if (valid) {
                this.requestSensorConfig()
                this.tempHuConfig.sendShow = false
                this.tempHuConfig.disabled = true
                this.tempHuConfigLoading = true
              } else {
                this.$message.error(rulesService.submitErrorTip)
                return false
              }
            })
            break
          case 'setEscalationPeriod': // 上报周期
            this.$refs.setEscalationPeriod.$refs[`overviewBoxForm`].validate((valid) => {
              if (valid) {
                this.requestSetEscalationPeriod()
                this.setEscalationPeriod.sendShow = false
                this.setEscalationPeriod.fieldList.disabled = true
                this.setEscalationPeriodLoading = true
              } else {
                this.$message.error(rulesService.submitErrorTip)
                return false
              }
            })
            break
        }
      } else {
        this.$message.error('当前设备已离线!')
      }
    },
    multiFunction() {
      console.log('获取的父组件内容', this.overviewDetail)
      this.overviewDetail.progress = 'multiFunctionSetting'
    }
  }
}
</script>
<style lang="scss">
.parameter-setting {
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
  .el-form-item__error{
      top: 42px!important;
    }
}
  .input-number el-input-number is-controls-right {
    height: 35px;
  }
  .el-input--suffix .el-input__inner {
    padding-right: 0;
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
.title-col {
  width: 80px;
  min-width: 80px;
}

.send {
  .waring-icon {
    font-size: 22px;
  }
}
.col-box {
  height: 100%;
}
.title-col-8 {
  width: 50px;
  min-width: 50px;
}
.unit-config {
  .radio-box {
    margin-bottom: 30px;
  }
  .radio {
    width: 45%;
    margin-bottom: 20px;
    // &:nth-child(2n) {
    //   text-align: right;
    // }
  }
  .el-input-number {
    width: auto;
  }
}
.overview-box-main {
  width: 100%;
  display: flex;
}
.parameter-setting,
.multi-unit-setting,
.multi-function-setting {
    .addForm .el-form-item{
    width: 48%;
  }
  .el-form{
    display: flex;
    flex-wrap: wrap;
    -webkit-box-pack: justify;
    justify-content: space-between;
  }
  .dialog-footer{
  .overview-panel{
    background: none;
  }
}
  .flex-grow-2 {
  flex: 2 !important;
}
  .equipment-config-equipmentConfig{
  .dialog-title{
    display: flex;
    color: #ffffff;
    .title{
      margin-right: 30px;
    }
  }
}
  .body-fot{
  position: absolute;
  bottom: 20px;
  width: 100%;
  left: 0;
  padding: 0 20px;
  display: flex;
  justify-content: center;
}
  .el-input-number {
    width: auto;
  }
  .overview-box {
    position: relative;
    border-radius: 4px;
    // background: #27376f;
    @include background_color('inPigBackGroundColor7');
    overflow: hidden;
  }
}
.view-popover {
  // .el-popover{
  background: #001d45 !important;
  border: none !important;
  // }
}
.work-mode-config .manual-temp .manual-temp-inp {
  width: auto !important;
}
.work-mode-config {
  margin-left: 0 !important;
  .overview-box {
    margin-right: 0 !important;
  }
}
.light-config .el-date-editor .el-range-separator {
  padding: 0;
}
.overview-panel {
  .el-form-item {
    .el-radio__inner {
      border: 1px solid #cdd8f7;
      background: transparent;
    }
    .el-input__inner {
      background: #162456;
      border: 1px solid #475a9a;
      border-radius: 2px;
      color: #cdd8f7;
    }
    .el-radio__input.is-checked .el-radio__inner {
      background: #517af0;
    }
    .el-input-number {
      width: 100%;
      line-height: 40px;
      height: 40px;
      overflow: hidden;
      border: 1px solid #475a9a;
      border-radius: 2px;
      .el-input__inner {
        background: #162456;
        border: none;
      }
      .el-input-number__decrease,
      .el-input-number__increase {
        background: #162456;
        border-left: 1px solid #162456;
        border-bottom: none;
        & [class*='el-icon'] {
          color: #ffffff;
        }
      }
      .el-input-number__decrease {
        border-right: 1px solid #475a9a;
      }
      .el-input-number__increase {
        border-left: 1px solid #475a9a;
      }
    }
    .is-controls-right {
      .el-input-number__decrease {
        border-right: none;
        border-left: 1px solid #475a9a;
      }
    }
    .el-form-item__label,
    .el-form-item__content {
      font-size: 12px;
    }
    .el-form-item__label {
      color: #cdd8f7;
    }
    .el-form-item__content {
    }
  }
}

.work-mode-config,
.light-config {
  .el-input__inner {
    color: #cdd8f7;
  }
}
// .work-mode-config,
// .light-config {
//   .overview-box {
//     padding: 10px !important;
//   }
// }
.overview-box .box-head {
  // padding: 10px !important;
  width: 100%;
  @include background_color('inPigBackGroundColor8');
  border-bottom: 1px solid;
  @include border_color('inPigBorderColor4');
}

// 表单校验错误提示

.parameter-setting{
  .el-form-item__error{
    top: 35px;
  }
  .overview-box{
    // width: 19%;
    &.next-row{
      max-width: 19%;
    }
    .el-form-item__error{
      top: 72px;
    }
    .form-body {
      .el-form-item__error{
        top: 34px;
      }
    }
    .form-item-row{
      .el-form-item__error{
        top: 36px;
      }
    }
  }
}
</style>
<style lang="scss" scoped>

.row-box {
  margin-bottom: 20px;
  width: 100%;
}
.parameter-setting {
  .addForm .el-form-item{
    width: 48%;
  }
  // overflow: scroll;
  // &::-webkit-scrollbar {
  //   display: none;
  // }
}
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
    margin-right: 0;
  }
  .title {
    font-size: 12px;
    // color: #cdd8f7;
    @include font_color('inPigFontColor1');
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
    @include font_color('inPigFontColor1');
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
      .label {
        width: 80px;
        min-width: 80px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        height: 36px;
        margin-bottom: 26px;
      }
      .label-8 {
        width: 50px;
        min-width: 50px;
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

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.btn-border,
.btn-blue {
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
</style>
