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
          <el-button slot="reference" class="btn-blue" :loading="singleUnitLoading">下发指令</el-button>
        </el-popconfirm>
        <el-button class="btn-red" @click="parameterSetting()">退出多功能编辑</el-button>
      </div>
    </div>
    <div class="allcheckContent">
      <el-checkbox v-model="allChecked" @change="handleCheckAllChange" />全选
    </div>
    <el-checkbox-group v-model="checkedProgress" @change="handleCheckedChange">
      <div v-loading="loading" class="main">
        <div class="overview-box-main">
          <!-- 设置报警 -->
          <overview-box
            ref="alarmConfig"
            v-loading="alarmConfigLoading"
            class="overview-box"
            :data="alarmConfig.data"
            :field-list="alarmConfig.fieldList"
          >
            <template v-slot:head>
              <!-- <div class="box-head"> -->
              <el-checkbox label="alarmConfig">报警参数</el-checkbox>
            <!-- </div> -->
            </template>
          </overview-box>
          <!-- 工作模式 -->
          <div v-loading="workModeConfigLoading" class="overview-box work-mode-config">
            <div class="box-head">
              <div class="title">
                <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
                <el-checkbox label="workModeConfig">工作模式</el-checkbox>
              </div>
            </div>
            <div class="overview-box">
              <el-form ref="workModeConfig" :model="workModeConfig.data">
                <el-row :gutter="10">
                  <el-col :span="24">
                    <div class="title">
                      {{ workModeConfig.fieldList.workMode.title }}:
                    </div>
                    <el-form-item>
                      <el-radio-group
                        v-model="workModeConfig.data.workMode"
                        :disabled="workModeConfig.fieldList.disabled"
                      >
                        <el-radio
                          v-for="(item, index) in workModeConfig.fieldList
                            .workMode.optList"
                          :key="index"
                          :disabled="item.disabled"
                          class="overview-radio"
                          :label="item.value"
                        >
                          {{ item.label }}
                        </el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>
          <!-- 设置单元 -->
          <overview-box
            ref="unitConfig"
            v-loading="unitConfigLoading"
            class="overview-box unit-config"
            :data="unitConfig.data"
            :field-list="unitConfig.fieldList"
          >
            <template v-slot:head>
              <!-- <div class="box-head"> -->
              <div class="title">
                <el-checkbox label="unitConfig">设置单元参数</el-checkbox>
              </div>
            <!-- </div> -->
            </template>
          </overview-box>
          <!-- 设置上报周期 -->
          <overview-box
            ref="statusReportPeriod"
            v-loading="setEscalationPeriodLoading"
            class="overview-box unit-config"
            :data="setEscalationPeriod.data"
            :field-list="setEscalationPeriod.fieldList"
          >
            <template v-slot:head>
              <div class="title">
                <el-checkbox label="statusReportPeriod">上报周期</el-checkbox>
              </div>
            </template>
          </overview-box>
          <!-- 照明开启/关闭时间 -->
          <div
            ref="lightConfig"
            v-loading="lightConfigLoading"
            class="overview-box light-config"
            style="height: calc(100% - 20px);"
          >
            <div class="box-head">
              <div class="title">
                <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->

                <el-checkbox label="lightConfig">照明开启/关闭时间</el-checkbox>
              </div>
            </div>
            <div class="overview-box">
              <el-form ref="lightConfig" :model="lightConfig.entrys">
                <div class="title">
                  开启时间 — 关闭时间（时 / 分）:
                </div>
                <el-form-item
                  v-for="(item, index) in lightConfig.data.entrys"
                  :key="index"
                >
                  <div class="form-time-item">
                    <el-time-picker
                      v-model="item.openTime"
                      class="time-picker"
                      :disabled="lightConfig.fieldList.disabled"
                      placeholder="开始时间"
                      value-format="HH:mm"
                      format="HH:mm"
                      @change="changePicker"
                    />
                    -
                    <el-time-picker
                      v-model="item.closeTime"
                      class="time-picker"
                      :disabled="lightConfig.fieldList.disabled"
                      placeholder="结束时间"
                      value-format="HH:mm"
                      format="HH:mm"
                      @change="changePicker"
                    />
                    <div
                      v-if="index !== 0"
                      class="delete"
                      style="font-size: 16px;color: #FF2727;cursor: pointer;margin-left:10px"
                      @click="
                        lightConfig.fieldList.disabled ? '' : deleteTime(index)
                      "
                    >
                      <i class="el-icon-close" />
                    </div>
                  </div>
                </el-form-item>
                <div
                  class="add-time"
                  style="font-size: 12px;color: #10AEFF;cursor: pointer;"
                  @click="lightConfig.fieldList.disabled ? '' : addTime()"
                >
                  添加记录
                </div>
              </el-form>
            </div>
          </div>
        </div>

        <div class="overview-box-main">
          <!-- 设置设备参数 -->
          <overview-box
            ref="deviceConfig"
            v-loading="deviceConfigLoading"
            class="overview-box unit-config"
            :data="deviceConfig.data"
            :field-list="deviceConfig.fieldList"
          >
            <template v-slot:head>
              <div class="title">
                <el-checkbox label="deviceConfig">设备参数</el-checkbox>
              </div>
            </template>
          </overview-box>

          <!-- 喷淋参数设置 -->
          <overview-box
            ref="sprayConfig"
            v-loading="sprayConfigLoading"
            class="overview-box"
            :data="sprayConfig.data"
            :field-list="sprayConfig.fieldList"
          >
            <template v-slot:head>
              <!-- <div class="box-head"> -->
              <div class="title">
                <el-checkbox label="sprayConfig">喷淋参数</el-checkbox>
              </div>
              <!-- </div> -->
            </template>
          </overview-box>

          <!-- 空气参数设置 -->
          <overview-box
            ref="ariConditioningConfig"
            v-loading="ariConditioningConfigLoading"
            class="overview-box unit-config"
            :data="ariConditioningConfig.data"
            :field-list="ariConditioningConfig.fieldList"
          >
            <template v-slot:head>
              <!-- <div class="box-head"> -->
              <div class="title">
                <el-checkbox label="ariConditioningConfig">空气调节参数</el-checkbox>
              </div>
              <!-- </div> -->
            </template>
          </overview-box>
          <!-- 设置加热参数 -->
          <overview-box
            ref="heatDeviceConfig"
            v-loading="heatDeviceConfigLoading"
            class="overview-box unit-config"
            :data="heatDeviceConfig.data"
            :field-list="heatDeviceConfig.fieldList"
            style="marginRight: 0;"
          >
            <template v-slot:head>
              <!-- <div class="box-head"> -->
              <div class="title">
                <el-checkbox label="heatDeviceConfig">设置加热参数</el-checkbox>
              </div>
              <!-- </div> -->
            </template>
          </overview-box>
        </div>

        <div class="overview-box-main">
          <!-- 设置温湿度传感器校准值 -->
          <div class="overview-box flex-grow-2" :style="windowConfigs.data.length > 0 ? '' : 'margin-right: 0'">
            <div v-loading="sensorConfigLoading" class="overview-panel" style="height: 100%;">
              <el-form ref="sensorConfigs" :model="sensorConfig">
                <div class="box-head">
                  <div class="title">
                    <el-checkbox label="sensorConfigs">温湿度传感器校准值</el-checkbox>
                  </div>
                </div>

                <div class="box-body">
                  <el-row class="form-title" :gutter="10">
                    <el-col :span="3">1</el-col>
                    <el-col
                      v-for="(item, index) in sensorConfigs.titles"
                      :key="index"
                      class="title"
                      :span="Math.floor(21 / sensorConfigs.titles.length)"
                    >
                      {{ item }}
                    </el-col>
                  </el-row>

                  <el-row
                    v-for="(item, index) in sensorConfigs.labels"
                    :key="index"
                    class="form-body"
                    :gutter="10"
                  >
                    <el-col :span="3">{{ item.label }}</el-col>
                    <el-col
                      v-for="(childItem, index) in item.lists"
                      :key="index"
                      :span="Math.floor(21 / sensorConfigs.titles.length)"
                    >
                      <el-form-item
                        :prop="item.key + '.' +childItem.key"
                        :rules="childItem.rules"
                      >
                        <!-- solt -->
                        <template v-if="childItem.type === 'slot'">
                          <slot :name="'form-' + childItem.key" />
                        </template>
                        <el-radio-group
                          v-if="childItem.type === 'radio'"
                          v-model="sensorConfig[item.key][childItem.key]"
                          :disabled="sensorConfigs.disabled"
                        >
                          <el-radio
                            v-for="(radioItem, index) in childItem.optList"
                            :key="index"
                            class="overview-radio"
                            :label="radioItem.value"
                          >
                            {{ radioItem.label }}
                          </el-radio>
                        </el-radio-group>
                        <el-input
                          v-else-if="childItem.type === 'input'"
                          v-model="sensorConfig[item.key][childItem.key]"
                          :disabled="sensorConfigs.disabled"
                          :precision="childItem.precision"
                          :step="childItem.step"
                          :controls-position="childItem.controlsPositionRight"
                          :size="childItem.size"
                          :min="childItem.min"
                          :max="childItem.max"
                        />
                        <el-input-number
                          v-else
                          v-model="sensorConfig[item.key][childItem.key]"
                          :disabled="sensorConfigs.disabled"
                          :precision="childItem.precision"
                          :step="childItem.step"
                          :controls-position="childItem.controlsPositionRight"
                          :size="childItem.size"
                          :min="childItem.min"
                          :max="childItem.max"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </el-form>
            </div>
          </div>
          <!-- 滑窗参数设置 -->
          <div v-if="windowConfigs.data.length > 0" class="overview-box flex-grow-1" style="marginRight: 0;">
            <div v-loading="sensorConfigLoading" class="overview-panel" style="height: 100%;">
              <el-form ref="windowConfigs" :model="windowConfigs">
                <div class="box-head">
                  <div class="title">
                    <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->

                    <el-checkbox label="windowConfigs">滑窗参数</el-checkbox>
                  </div>
                </div>

                <div class="box-body">
                  <el-row class="form-title" :gutter="10">
                    <el-col :span="8"><span class="win-title"> 校准次数(次)</span></el-col>
                    <el-col :span="8"><span class="win-title"> 满关时间(秒)</span> </el-col>
                    <el-col :span="8"><span class="win-title"> 满开时间(秒)</span></el-col>
                    <el-col
                      v-for="(item, index) in windowConfigs.data"
                      :key="index"
                      class="title"
                      :span="item.span"
                    >
                      <el-col :span="8">
                        <el-form-item
                          class="el-form-item_bottom"
                          :prop="`data.${index}.adjustTime`"
                          :rules="item.rules"
                        >
                          <el-input-number
                            v-model="item['adjustTime']"
                            :disabled="windowConfigs.disabled"
                            :precision="item.precision"
                            :step="item.step"
                            controls-position="right"
                            :size="item.size"
                            :min="5"
                          />
                        </el-form-item>
                      </el-col>

                      <el-col :span="8">
                        <el-form-item
                          class="el-form-item_bottom"
                          :prop="`data.${index}.totalPosUp`"
                          :rules="item.rules"
                        >
                          <el-input-number
                            v-model="item['totalPosUp']"
                            :disabled="windowConfigs.disabled"
                            :precision="item.precision"
                            :step="item.step"
                            controls-position="right"
                            :size="item.size"
                            :min="20"
                          />
                        </el-form-item>
                      </el-col>

                      <el-col :span="8">
                        <el-form-item
                          class="el-form-item_bottom"
                          :prop="`data.${index}.totalPosDown`"
                          :rules="item.rules"
                        >
                          <el-input-number
                            v-model="item['totalPosDown']"
                            :disabled="windowConfigs.disabled"
                            :precision="item.precision"
                            :step="item.step"
                            controls-position="right"
                            :size="item.size"
                            :min="20"
                          />
                        </el-form-item>
                      </el-col>

                    </el-col>
                  </el-row>
                </div>
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </el-checkbox-group>
  </div>
</template>

<script>
import {
  ArgsInfo,
  singleUnit
} from '@/http/api/pigHouse.js'
import OverviewBox from '@/views/IntelligentControl/fieldDeviceOverview/common/components/OverviewBox'
// import generalForm from '@/components/commonComponent/generalForm'
import jsontype from './config/formJson.json'
import rulesService from './utils/verification'
export default {
  components: {
    OverviewBox
    // generalForm
  },
  props: {
    unitId: String
  },
  data() {
    return {
      recordHoggeryType: '',
      userInfo: localStorage.userJurisdiction,
      dialogDtatus: false,
      focusCurrent: '',
      workModeConfigLoading: false,
      unitConfigLoading: false,
      setEscalationPeriodLoading: false,
      lightConfigLoading: false,
      deviceConfigLoading: false,
      sprayConfigLoading: false,
      ariConditioningConfigLoading: false,
      heatDeviceConfigLoading: false,
      alarmConfigLoading: false,
      // feedConfigLoading: false,
      sensorConfigLoading: false,
      windowConfigsLoading: false,
      // windowConfigLoading: false,
      loading: false,
      dialogLoading: false,
      singleUnitLoading: false,
      cur_prg: 0,
      viewInterval: '',
      singleTime: '',
      isRefresh: false,
      progressOptions: ['alarmConfig', 'workModeConfig', 'unitConfig', 'statusReportPeriod', 'lightConfig', 'deviceConfig', 'sprayConfig', 'ariConditioningConfig', 'heatDeviceConfig', 'sensorConfigs', 'windowConfigs'],
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
      // 设置工作
      workModeConfig: {
        sendShow: false,
        data: {
          workMode: 0
        },
        fieldList: {
          disabled: false,
          workMode: {
            title: '工作模式',
            optList: [
              { label: '未定义', value: 0 },
              { label: '空圈模式', value: 1 },
              { label: '手动模式', value: 2 },
              { label: '自动模式', value: 3 },
              { label: '转猪模式', value: 4 },
              { label: '刷圈模式', value: 5 },
              { label: '预热模式', value: 6 }
            ]
          },
          manualTemp: {
            precision: 1,
            step: 0.1,
            min: 0,
            max: 60,
            controlsPositionRight: 'right'
          }
        }
      },
      // 设置单元
      unitConfig: {
        sendShow: false,
        data: {
          batchNo: 1,
          hoggeryType: 2,
          sty: 0,
          pigCount: 1800,
          pigDays: 600,
          pos: 1,
          unitNo: 4,
          weight: 0
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
                { label: '保育舍', value: 1 },
                { label: '育肥舍', value: 2 },
                { label: '哺乳舍', value: 4 },
                { label: '怀孕舍', value: 5 },
                { label: '后备舍', value: 6 },
                { label: '公猪舍', value: 7 },
                { label: '待配舍', value: 8 },
                { label: '一体舍', value: 3 }
              ],
              handleChange: (val) => {
                if (val === 4) {
                  this.unitConfig.fieldList.body[4].label = '仔猪日龄(0-600天)'
                  this.unitConfig.fieldList.body[7].label = '单猪体重(0-300KG)'
                  this.unitConfig.fieldList.body[6].isShow = false
                  this.unitConfig.fieldList.body[7].isShow = false
                } else if (val === 5) {
                  this.unitConfig.fieldList.body[4].label = '母猪孕龄(0-600天)'
                  this.unitConfig.fieldList.body[7].label = '母猪体重(0-300KG)'
                  this.unitConfig.fieldList.body[6].isShow = false
                  this.unitConfig.fieldList.body[7].isShow = false
                } else if (val === 6) {
                  this.unitConfig.fieldList.body[4].label = '猪日龄(0-600天)'
                  this.unitConfig.fieldList.body[7].label = '单猪体重(0-300KG)'
                  this.unitConfig.fieldList.body[6].isShow = true
                  this.unitConfig.fieldList.body[7].isShow = false
                } else if (val === 8) {
                  this.unitConfig.fieldList.body[4].label = '猪日龄(0-600天)'
                  this.unitConfig.fieldList.body[7].label = '单猪体重(0-300KG)'
                  this.unitConfig.fieldList.body[6].isShow = true
                  this.unitConfig.fieldList.body[7].isShow = false
                } else {
                  this.unitConfig.fieldList.body[4].label = '猪日龄(0-600天)'
                  this.unitConfig.fieldList.body[7].label = '单猪体重(0-300KG)'
                  this.unitConfig.fieldList.body[6].isShow = true
                  this.unitConfig.fieldList.body[7].isShow = false
                }
              }
            },
            {
              title: '位置',
              key: 'pos',
              type: 'radio',
              optList: [
                { label: '未知', value: 0 },
                { label: 'A栋', value: 1 },
                { label: 'B栋', value: 2 }
              ]
            },
            {
              label: '栏位(>=0)',
              key: 'sty',
              type: 'inputNumber',
              isShow: false,
              controlsPositionRight: 'right',
              ...rulesService.limit_0_
            },
            {
              label: '装猪数量(0-1800头)',
              key: 'pigCount',
              type: 'inputNumber',
              isShow: false,
              controlsPositionRight: 'right',
              ...rulesService.limit_0_1800
            },
            {
              label: '猪日龄(0-600天)',
              key: 'pigDays',
              type: 'inputNumber',
              isShow: false,
              controlsPositionRight: 'right',
              ...rulesService.limit_0_600
            },
            {
              label: '单元编号(0-800)',
              key: 'unitNo',
              type: 'inputNumber',
              isShow: false,
              controlsPositionRight: 'right',
              ...rulesService.limit_0_800
            },
            {
              label: '母猪胎次(0-100)',
              key: 'batchNo',
              type: 'inputNumber',
              isShow: true,
              controlsPositionRight: 'right',
              ...rulesService.limit_0_100
            },
            {
              label: '单猪体重(0-300KG)',
              key: 'weight',
              type: 'inputNumber',
              isShow: false,
              controlsPositionRight: 'right',
              ...rulesService.limit_0_300
            }
          ]
        }
      },
      // 设置设备参数
      deviceConfig: {
        sendShow: false,
        data: {
          bind: 0,
          emInstallSite: '未安装'
        },
        fieldList: {
          disabled: false,
          head: {
            slot: true
          },
          body: [
            {
              title: '安装位置',
              key: 'bind',
              type: 'radio',
              optList: [
                {
                  value: 0,
                  label: '未安装'
                },
                {
                  value: 1,
                  label: 'A1'
                },
                {
                  value: 2,
                  label: 'A2'
                },
                {
                  value: 3,
                  label: 'A3'
                },
                {
                  value: 4,
                  label: 'A4'
                },
                {
                  value: 5,
                  label: 'A5'
                },
                {
                  value: 6,
                  label: 'A6'
                },
                {
                  value: 7,
                  label: 'A7'
                },
                {
                  value: 8,
                  label: 'B1'
                },
                {
                  value: 9,
                  label: 'B2'
                },
                {
                  value: 10,
                  label: 'B3'
                },
                {
                  value: 11,
                  label: 'B4'
                },
                {
                  value: 12,
                  label: 'B5'
                },
                {
                  value: 13,
                  label: 'B6'
                },
                {
                  value: 14,
                  label: 'B7'
                },
                {
                  value: 15,
                  label: '单元'
                }, {
                  value: 16,
                  label: '主控制器'
                }
              ]
            }
          ]
        }
      },
      // 空气参数设置
      ariConditioningConfig: {
        sendShow: false,
        data: {
          lowerTemp: '',
          suitableTemp: '',
          upperTemp: '',
          lowerAdjustTemp: '',
          upperAdjustTemp: '',
          warningHumi: '',
          lowerHumi: '',
          upperHumi: ''
        },
        fieldList: {
          disabled: false,
          head: {
            slot: true
          },
          body: [
            {
              label: '下限温度(℃):',
              key: 'lowerTemp',
              type: 'inputNumber',
              precision: 1,
              // isShow: false,
              controlsPositionRight: 'right',
              ...rulesService.limit_15_30
            },
            {
              label: '适宜温度(℃):',
              key: 'suitableTemp',
              type: 'inputNumber',
              precision: 1,
              // isShow: false,
              controlsPositionRight: 'right',
              ...rulesService.limit_20_35
            },
            {
              label: '上限温度(℃):',
              key: 'upperTemp',
              type: 'inputNumber',
              precision: 1,
              // isShow: false,
              controlsPositionRight: 'right',
              ...rulesService.limitControl(20, 40)
            },
            {
              label: '下偏移温度(℃):',
              key: 'lowerAdjustTemp',
              precision: 1,
              type: 'inputNumber',
              // isShow: false,
              controlsPositionRight: 'right',
              ...rulesService.limit_0_5
            },
            {
              label: '上偏移温度(℃):',
              key: 'upperAdjustTemp',
              precision: 1,
              type: 'inputNumber',
              // isShow: false,
              controlsPositionRight: 'right',
              ...rulesService.limit_0_5
            },
            {
              label: '警戒湿度(%):',
              key: 'warningHumi',
              type: 'inputNumber',
              precision: 1,
              // isShow: false,
              controlsPositionRight: 'right',
              ...rulesService.limit_0_100
            },
            {
              label: '下限湿度(%):',
              key: 'lowerHumi',
              type: 'inputNumber',
              precision: 1,
              // isShow: false,
              controlsPositionRight: 'right',
              ...rulesService.limit_0_100
            },
            {
              label: '上限湿度(%):',
              key: 'upperHumi',
              type: 'inputNumber',
              precision: 1,
              // isShow: false,
              controlsPositionRight: 'right',
              ...rulesService.limit_0_100
            }
          ]
        }
      },
      // 设置加热参数
      heatDeviceConfig: {
        sendShow: false,
        data: {
          openTemp: '',
          closeTemp: ''
        },
        fieldList: {
          disabled: false,
          head: {
            slot: true
          },
          body: [
            {
              label: '开启温度（单位: ℃）',
              key: 'openTemp',
              type: 'inputNumber',
              step: 0.1,
              precision: 1,
              // isShow: false,
              controlsPositionRight: 'right',
              ...rulesService.limit_20_50
            },
            {
              label: '关闭温度（单位: ℃）:',
              key: 'closeTemp',
              type: 'inputNumber',
              step: 0.1,
              precision: 1,
              // isShow: false,
              controlsPositionRight: 'right',
              ...rulesService.limit_20_50
            }
          ]
        }
      },
      // 滑窗参数设置
      windowConfigs: {
        sendShow: false,
        disabled: false,
        data: []
      },
      // 喷淋参数设置
      sprayConfig: {
        sendShow: false,
        data: {
          sprayCount: null,
          sprayChoose: '',
          humidificationOpenTime: '',
          coolingOpenTime: '',
          minCloseTime: '',
          maxCloseTime: '',
          unitTime: '',
          stableCloseTime: ''
        },
        fieldList: {
          disabled: false,
          head: {
            slot: true
          },
          body: [
            {
              label: '安装的喷淋总路数:',
              key: 'sprayCount',
              type: 'radio',
              // isShow: false,
              optList: [
                {
                  value: 1,
                  label: '1路'
                },
                {
                  value: 2,
                  label: '2路'
                }
              ]
            },
            {
              label: '喷淋选择',
              key: 'sprayChoose',
              type: 'radio',
              // isShow: false,
              optList: [
                {
                  value: 1,
                  label: '增湿喷淋'
                },
                {
                  value: 2,
                  label: '增湿和降温喷淋'
                }
              ]
            },
            {
              label: '最小打开时间(s):',
              key: 'humidificationOpenTime',
              type: 'inputNumber',
              // isShow: false,
              controlsPositionRight: 'right',
              ...rulesService.limit_0_60
            },
            {
              label: '最大打开时间:',
              key: 'coolingOpenTime',
              type: 'inputNumber',
              // isShow: false,
              controlsPositionRight: 'right',
              ...rulesService.limit_0_120
            },
            {
              label: '最小关闭时间(s):',
              key: 'minCloseTime',
              type: 'inputNumber',
              // isShow: false,
              controlsPositionRight: 'right',
              ...rulesService.limit_30_1000000
            },
            {
              label: '最大关闭时间(s):',
              key: 'maxCloseTime',
              type: 'inputNumber',
              // isShow: false,
              controlsPositionRight: 'right',
              ...rulesService.limit_360_1000000
            },
            {
              label: '当前开启时长(s):',
              key: 'unitTime',
              type: 'inputNumber',
              // isShow: false,
              controlsPositionRight: 'right',
              ...rulesService.limit_0_120
            },
            {
              label: '当前关闭时间(s):',
              key: 'stableCloseTime',
              type: 'inputNumber',
              // isShow: false,
              controlsPositionRight: 'right',
              ...rulesService.limit_30_1000000
            }
          ]
        }
      },
      sensorConfig: {
        heatLamp: {
          enable: true,
          humiCalibrationValue: 0,
          tempCalibrationValue: 1,
          bleMac: '00:00:00:00:00:00'
        },
        indoorAfter: {
          enable: true,
          humiCalibrationValue: 0,
          tempCalibrationValue: 1,
          bleMac: '00:00:00:00:00:00'
        },
        indoorCenter: {
          enable: true,
          humiCalibrationValue: 0,
          tempCalibrationValue: 1,
          bleMac: '00:00:00:00:00:00'
        },
        indoorBefore: {
          enable: true,
          humiCalibrationValue: 0,
          tempCalibrationValue: 1,
          bleMac: '00:00:00:00:00:00'
        },
        outDoor: {
          enable: true,
          humiCalibrationValue: 0,
          tempCalibrationValue: 1,
          bleMac: '00:00:00:00:00:00'
        }
      },
      trenchHeat: {
        sendShow: false,
        disabled: false,
        titles: [
          '基础温度（0.1°C）',
          '偏差温度（0.1°C）',
          '最小通风量（%）',
          '关闭温度（0.1°C）',
          '间接运行时长（分）'
        ],
        labels: [
          {
            label: '热交换',
            key: 'exchange',
            lists: [
              {
                key: 'openTemp',
                controlsPositionRight: 'right',
                precision: 1,
                step: 0.1,
                ...rulesService.verGreaterThan([10, 60], '<', '必须小于热交换变频关闭温度!', this, 'temperatureControlConfig', 'exchange', 'closeTemp')
              },
              {
                key: 'diffTemp',
                controlsPositionRight: 'right',
                precision: 1,
                step: 0.1,
                ...rulesService.limit_1_10
              },
              {
                key: 'baseSpeed',
                controlsPositionRight: 'right',
                ...rulesService.limit_5_100
              },
              {
                key: 'closeTemp',
                controlsPositionRight: 'right',
                precision: 1,
                step: 0.1,
                ...rulesService.verGreaterThan([10, 60], '>', '必须大于热交换变频开启温度!', this, 'temperatureControlConfig', 'exchange', 'openTemp')
              },
              {
                key: 'openDuration',
                controlsPositionRight: 'right',
                ...rulesService.limit_1_10
              }
            ]
          },
          {
            label: '地沟',
            key: 'gutter',
            lists: [
              {
                key: 'openTemp',
                controlsPositionRight: 'right',
                precision: 1,
                step: 0.1,
                ...rulesService.verGreaterThan([10, 60], '<', '必须小于地沟变频关闭温度!', this, 'temperatureControlConfig', 'gutter', 'closeTemp')
              },
              {
                key: 'diffTemp',
                controlsPositionRight: 'right',
                precision: 1,
                step: 0.1,
                ...rulesService.limit_1_10
              },
              {
                key: 'baseSpeed',
                controlsPositionRight: 'right',
                ...rulesService.limit_5_100
              },
              {
                key: 'closeTemp',
                controlsPositionRight: 'right',
                precision: 1,
                step: 0.1,
                ...rulesService.verGreaterThan([10, 60], '>', '必须大于地沟变频关闭温度!', this, 'temperatureControlConfig', 'gutter', 'openTemp')
              },
              {
                key: 'openDuration',
                controlsPositionRight: 'right',
                ...rulesService.limit_1_10
              }
            ]
          }
        ]
      },
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
      constantSpeed: {
        sendShow: false,
        disabled: false,
        titles: ['开启温度（0.1°C）', '关闭温度（0.1°C）']
      },

      variableFrequency: {
        sendShow: false,
        disabled: false,
        titles: [
          '基础温度(0.1℃)',
          '偏差温度（0.1°C）',
          '基础频率(Hz)',
          '锁定频率(Hz)'
        ]
      },

      warmLight: {
        sendShow: false,
        disabled: false,
        titles: ['开启温度（0.1°C）', '关闭温度（0.1°C）'],
        labels: [
          {
            label: '暖灯',
            key: 'heatLamp',
            lists: [
              {
                key: 'openTemp',
                controlsPositionRight: 'right',
                precision: 1,
                step: 0.1,
                ...rulesService.verGreaterThan([20, 35], '<', '必须小于暖灯关闭温度!', this, 'temperatureControlConfig', 'heatLamp', 'closeTemp')
              },
              {
                key: 'closeTemp',
                controlsPositionRight: 'right',
                precision: 1,
                step: 0.1,
                ...rulesService.verGreaterThan([20, 35], '>', '必须大于暖灯开启温度!', this, 'temperatureControlConfig', 'heatLamp', 'openTemp')
              }
            ]
          },
          {
            label: '伴热带',
            key: 'heatBelt',
            lists: [
              {
                key: 'openTemp',
                controlsPositionRight: 'right',
                precision: 1,
                step: 0.1,
                ...rulesService.verGreaterThan([20, 35], '<', '必须小于伴热带关闭温度!', this, 'temperatureControlConfig', 'heatBelt', 'closeTemp')
              },
              {
                key: 'closeTemp',
                controlsPositionRight: 'right',
                precision: 1,
                step: 0.1,
                ...rulesService.verGreaterThan([20, 35], '>', '必须大于伴热带开启温度!', this, 'temperatureControlConfig', 'heatBelt', 'openTemp')
              }
            ]
          }
        ]
      },

      coolingEquipment: {
        sendShow: false,
        disabled: false,
        titles: [
          '开启温度（0.1°C）',
          '开启时长（秒）',
          '关闭时长（分）',
          '工作模式'
        ],
        labels: [
          {
            label: '喷淋',
            key: 'shower',
            lists: [
              {
                key: 'openTemp',
                type: 'inputNumber',
                controlsPositionRight: 'right',
                precision: 1,
                step: 0.1,
                ...rulesService.limit_0_60
              },
              {
                key: 'openDuration',
                type: 'inputNumber',
                controlsPositionRight: 'right',
                ...rulesService.limit_0_600
              },
              {
                key: 'closeDuration',
                type: 'inputNumber',
                controlsPositionRight: 'right',
                ...rulesService.limit_0_60
              },
              {
                key: 'staticMode',
                type: 'select',
                option: [
                  { label: '静态', value: true },
                  { label: '动态', value: false }
                ]
              }
            ]
          },
          {
            label: '雾化盘',
            key: 'g2Humidifying',
            lists: [
              {
                key: 'openTemp',
                type: 'inputNumber',
                controlsPositionRight: 'right',
                precision: 1,
                step: 0.1,
                ...rulesService.limit_0_90
              },
              {
                key: 'openDuration',
                type: 'inputNumber',
                controlsPositionRight: 'right',
                ...rulesService.limit_1_600
              },
              {
                key: 'closeDuration',
                type: 'inputNumber',
                controlsPositionRight: 'right',
                ...rulesService.limit_0_60
              },
              {

              }
            ]
          }
        ]
      },

      alarmConfig: {
        sendShow: false,
        data: {
          high: '',
          low: '',
          delta: '',
          disconnectedNetMask: '',
          gutterFanMask: '',
          heatExchangeFanMask: '',
          feedMask: '',
          showerMask: ''
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
              ...rulesService.limitControl(18, 36)
            },
            {
              title: '低温报警值（°C）',
              key: 'low',
              type: 'inputNumber',
              precision: 1,
              step: 0.1,
              controlsPositionRight: 'right',
              ...rulesService.limitControl(5, 32)
            },
            {
              title: '差温报警值（°C）',
              key: 'delta',
              type: 'inputNumber',
              precision: 1,
              step: 0.1,
              controlsPositionRight: 'right',
              ...rulesService.limit__40_60
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

      equipmentConfig: {
        sendShow: false,
        data: {
          lockParam: '',
          fixSpeedFanAmount: '',
          indoorBeforeProbe: {},
          indoorAfterProbe: {},
          heatLampProbe: {}
        },
        fieldList: {
          disabled: false,
          head: {
            slot: true
          },
          body: [
            {
              title: '参数锁定（喷淋、风机）',
              key: 'lockParam',
              type: 'radio',
              optList: [
                { label: '锁定', value: 1 },
                { label: '不锁定', value: 0 }
              ]
            },
            {
              title: '定速风机数量（0-5）',
              key: 'fixSpeedFanAmount',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_5
            },
            {
              title: '室内前温湿度传感器Mac地址',
              key: 'indoorBeforeProbe',
              secKey: 'mac',
              type: 'input',
              ...rulesService.limit_mac_address
            },
            {
              title: '室内后温湿度传感器Mac地址',
              key: 'indoorAfterProbe',
              secKey: 'mac',
              type: 'input',
              ...rulesService.limit_mac_address
            },
            {
              title: '暖灯温湿度传感器Mac地址',
              key: 'heatLampProbe',
              secKey: 'mac',
              type: 'input',
              ...rulesService.limit_mac_address
            }
          ]
        }
      },
      lightConfig: {
        sendShow: false,
        data: {
          entrys: [{ openTime: '08:00:00', closeTime: '12:00:00' }]
        },
        fieldList: {
          disabled: false,
          entrys: []
        }
      },

      feedConfig: {
        sendShow: false,
        data: {
          entrys: [{ openTime: '', openDuration: '' }]
        },
        fieldList: {
          disabled: false,
          entrys: []
        }
      },
      sensorConfigs: {
        sendShow: false,
        disabled: false,
        titles: [
          '是否开启温湿度探头',
          '温度传感器校准值(℃)',
          '湿度传感器校准值(%)',
          '无线传感器MAC地址'
        ],
        labels: [
          {
            label: '室内前',
            key: 'indoorBefore',
            lists: [
              {
                key: 'enable',
                type: 'radio',
                optList: [
                  { label: '启用', value: true },
                  { label: '不启用', value: false }
                ]
              },
              {
                key: 'tempCalibrationValue',
                controlsPositionRight: 'right',
                precision: 1,
                step: 0.1,
                ...rulesService.limit__40_60
              },
              {
                key: 'humiCalibrationValue',
                controlsPositionRight: 'right',
                ...rulesService.limit_0_100
              },
              {
                key: 'bleMac',
                type: 'input',
                secKey: 'mac',
                ...rulesService.limit_mac_address
              }
            ]
          },
          {
            label: '室内中',
            key: 'indoorCenter',
            lists: [
              {
                key: 'enable',
                type: 'radio',
                optList: [
                  { label: '启用', value: true },
                  { label: '不启用', value: false }
                ]
              },
              {
                key: 'tempCalibrationValue',
                controlsPositionRight: 'right',
                precision: 1,
                step: 0.1,
                ...rulesService.limit__40_60
              },
              {
                key: 'humiCalibrationValue',
                controlsPositionRight: 'right',
                ...rulesService.limit_0_100
              },
              {
                key: 'bleMac',
                type: 'input',
                secKey: 'mac',
                ...rulesService.limit_mac_address
              }
            ]
          },
          {
            label: '室内后',
            key: 'indoorAfter',
            lists: [
              {
                key: 'enable',
                type: 'radio',
                optList: [
                  { label: '启用', value: true },
                  { label: '不启用', value: false }
                ]
              },
              {
                key: 'tempCalibrationValue',
                controlsPositionRight: 'right',
                precision: 1,
                step: 0.1,
                ...rulesService.limit__40_60
              },
              {
                key: 'humiCalibrationValue',
                controlsPositionRight: 'right',
                ...rulesService.limit_0_100
              },
              {
                key: 'bleMac',
                type: 'input',
                secKey: 'mac',
                ...rulesService.limit_mac_address
              }
            ]
          },
          {
            label: '室外',
            key: 'outDoor',
            lists: [
              {
                key: 'enable',
                type: 'radio',
                optList: [
                  { label: '启用', value: true },
                  { label: '不启用', value: false }
                ]
              },
              {
                key: 'tempCalibrationValue',
                controlsPositionRight: 'right',
                precision: 1,
                step: 0.1,
                ...rulesService.limit__40_60
              },
              {
                key: 'humiCalibrationValue',
                controlsPositionRight: 'right',
                ...rulesService.limit_0_100
              },
              {
                key: 'bleMac',
                type: 'input',
                secKey: 'mac',
                ...rulesService.limit_mac_address
              }
            ]
          },
          {
            label: '暖灯',
            key: 'heatLamp',
            lists: [
              {
                key: 'enable',
                type: 'radio',
                optList: [
                  { label: '启用', value: true },
                  { label: '不启用', value: false }
                ]
              },
              {
                key: 'tempCalibrationValue',
                controlsPositionRight: 'right',
                precision: 1,
                step: 0.1,
                ...rulesService.limit__40_60
              },
              {
                key: 'humiCalibrationValue',
                controlsPositionRight: 'right',
                ...rulesService.limit_0_100
              },
              {
                key: 'bleMac',
                type: 'input',
                secKey: 'mac',
                ...rulesService.limit_mac_address
              }
            ]
          }
        ]
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
              label: '上报周期(秒)',
              key: 'statusReportPeriod',
              type: 'inputNumber',
              min: 10,
              max: 3600,
              controlsPositionRight: 'right',
              ...rulesService.limit_10_3600
            }
          ]
        }
      },

      windowConfig: {
        sendShow: false,
        disabled: false,
        data: {
          airInletConfigList: [{ mode: 1, percent: 100 }],
          airOutletConfigList: [{ mode: 1, percent: 100 }]
        },
        fieldList: [
          {
            title: '进风口工作模式',
            titleColor: '#cdd8f7',
            mark: 'airInletConfigList',
            key: 'mode',
            type: 'radio',
            optList: [
              { label: '自动', value: 0 },
              { label: '手动', value: 1 }
            ]
          },
          {
            title: '进风口开启比例',
            titleColor: '#CDD8F7',
            mark: 'airInletConfigList',
            key: 'percent',
            ...rulesService.limit_0_100_arr
          },
          {
            title: '出风口工作模式',
            titleColor: '#cdd8f7',
            mark: 'airOutletConfigList',
            key: 'mode',
            type: 'radio',
            optList: [
              { label: '自动', value: 0 },
              { label: '手动', value: 1 }
            ]
          },
          {
            title: '出风口开启比例',
            titleColor: '#CDD8F7',
            mark: 'airOutletConfigList',
            key: 'percent',
            ...rulesService.limit_0_100_arr
          }
        ]
      }
    }
  },
  watch: {
    unitId(newValue, oldValue) {
      this.ArgsInfo()
    }
  },
  inject: ['overviewDetail'],
  mounted() {
    this.ArgsInfo()
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkedProgress = val ? this.progressOptions : []
    },
    handleCheckedChange(val) {
      const checkedCount = val.length
      this.allChecked = checkedCount === this.progressOptions.length
    },
    initUnitConfig(type) {
      if (type) {
        this.unitConfig.recordHoggeryType = type
        switch (type) {
          case 4:
            this.unitConfig.fieldList.body[4].label = '仔猪日龄(0-600天)'
            this.unitConfig.fieldList.body[6].isShow = false
            break
          case 5:
            this.unitConfig.fieldList.body[4].label = '母猪孕龄(0-600天)'
            this.unitConfig.fieldList.body[7].label = '母猪体重(0-300KG)'
            this.unitConfig.fieldList.body[6].isShow = false
            this.unitConfig.fieldList.body[7].isShow = true
            break
          case 6:
            this.unitConfig.fieldList.body[7].isShow = false
            break
          case 8:
            this.unitConfig.fieldList.body[7].isShow = false
            break
          default:
            this.unitConfig.fieldList.body[7].isShow = false
        }
      }
    },
    subUnitConfig(data, type) {
      switch (type) {
        case 4:
          return data
        case 5:
          return data
        case 6:
          delete data.batchNo
          return data
        case 8:
          delete data.batchNo
          return data
        default:
          delete data.batchNo
          return data
          // break
      }
    },
    close() {
      this.dialogDtatus = false
    },

    refresh(e) {
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
      }, 10000)
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
      this.overviewDetail.isNotEnterMultiUnit = true
      this.overviewDetail.progress = 'parameterSetting'
    },
    changePicker(event) {
    },
    initArgsInfoData() {
      this.unitConfig.fieldList.body[6].isShow = true
      this.unitConfig.fieldList.body[7].isShow = false
      const ArgsInfoData = JSON.parse(JSON.stringify(this.ArgsInfoData))
      // 报警
      this.alarmConfig.data = ArgsInfoData.alarmConfig || {}
      // 工作模式
      this.workModeConfig.data = ArgsInfoData.workModeConfig || {}
      // 单元信息
      this.unitConfig.data = ArgsInfoData.unitConfig || {}
      if (ArgsInfoData.unitConfig && ArgsInfoData.unitConfig.hoggeryType) {
        console.log(ArgsInfoData, 'ArgsInfoDataArgsInfoData======')
        this.unitConfigHoggeryType = ArgsInfoData.unitConfig.hoggeryType
        this.initUnitConfig(ArgsInfoData.unitConfig.hoggeryType)
      }
      // 照明
      if (ArgsInfoData.lightConfig) {
        this.lightConfig.data.entrys = ArgsInfoData.lightConfig && ArgsInfoData.lightConfig.entrys
      } else {
        this.lightConfig.data.entrys = [{ openTime: '', closeTime: '' }]
      }
      // 设置设备参数
      this.deviceConfig.data = ArgsInfoData.deviceConfig || {}
      // 喷淋
      this.sprayConfig.data = ArgsInfoData.sprayConfig || {}
      // 空气
      this.ariConditioningConfig.data = ArgsInfoData.ariConditioningConfig || {}
      // 设置加热
      this.heatDeviceConfig.data = ArgsInfoData.heatDeviceConfig || {}
      // 滑窗参数设置
      if (ArgsInfoData.windowConfigs && ArgsInfoData.windowConfigs.length > 0) {
        const arr = JSON.parse(JSON.stringify(ArgsInfoData.windowConfigs))
        for (const i of arr) {
          i.rules = rulesService.rulesNull
          i.controlsPositionRight = 'right'
        }
        this.windowConfigs.data = arr
      } else {
        this.windowConfigs.data = []
      }
      // 温湿度
      if (ArgsInfoData.sensorConfig) {
        this.sensorConfig = ArgsInfoData.sensorConfig
      }
      if (ArgsInfoData.statusReportPeriod) {
        this.setEscalationPeriod.data.statusReportPeriod = ArgsInfoData.statusReportPeriod
      }
    },

    ArgsInfo() {
      ArgsInfo({ deviceId: this.overviewDetail.overview.deviceId }).then(
        (res) => {
          if ((res && res.status === 200 || res.rel) && res.data) {
            this.ArgsInfoData = res.data
            this.initArgsInfoData()
          }
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
    addTime() {
      const entrys = this.lightConfig.data.entrys
      if (entrys.length >= 8) {
        return
      } else {
        const obj = { openTime: '', closeTime: '' }
        this.lightConfig.data.entrys = [...entrys, obj]
      }
    },
    deleteTime(index) {
      this.lightConfig.data.entrys.splice(index, 1)
    },
    singleUnit() {
      if (this.overviewDetail.overview && this.overviewDetail.overview.statusOnline !== 0) {
        const type = []
        // 报警
        this.checkedProgress.indexOf('alarmConfig') !== -1 ? this.$refs.alarmConfig.$refs[`overviewBoxForm`].validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
        // 工作模式
        // this.checkedProgress.indexOf('workModeConfig') !== -1 ? this.$refs.workModeConfig.validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
        // 单元信息
        this.checkedProgress.indexOf('unitConfig') !== -1 ? this.$refs.unitConfig.$refs[`overviewBoxForm`].validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
        // 上报周期
        this.checkedProgress.indexOf('statusReportPeriod') !== -1 ? this.$refs.statusReportPeriod.$refs[`overviewBoxForm`].validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
        // 照明
        // this.checkedProgress.indexOf('lightConfig') !== -1 ? this.$refs.lightConfig.validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
        // 设置设备参数
        // this.checkedProgress.indexOf('deviceConfig') !== -1 ? this.$refs.deviceConfig.$refs[`overviewBoxForm`].validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
        // 喷淋
        this.checkedProgress.indexOf('sprayConfig') !== -1 ? this.$refs.sprayConfig.$refs[`overviewBoxForm`].validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
        // 空气
        this.checkedProgress.indexOf('ariConditioningConfig') !== -1 ? this.$refs.ariConditioningConfig.$refs[`overviewBoxForm`].validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
        // 设置加热
        this.checkedProgress.indexOf('heatDeviceConfig') !== -1 ? this.$refs.heatDeviceConfig.$refs[`overviewBoxForm`].validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
        // 温湿度
        this.checkedProgress.indexOf('sensorConfigs') !== -1 ? this.$refs.sensorConfigs.validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
        // 滑窗参数设置
        this.checkedProgress.indexOf('windowConfigs') !== -1 ? this.$refs.windowConfigs.validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''

        if (this.checkedProgress.length > 0) {
          if (type.length > 0 && type.indexOf(1) !== -1) {
            this.$message.error('参数错误，请根据提示，填写正确的参数')
            return
          }
        } else {
          this.$message.error('您未选择任何指令,请至少勾选一条指令!')
          return
        }
        if (this.checkedProgress.indexOf('lightConfig') !== -1) {
          const entrys = this.lightConfig.data.entrys
          const istrue = entrys.some(e => {
            return !e.openTime || !e.closeTime
          })
          if (istrue) {
            this.$message.error('开启和关闭时间不能为空')
            return
          }
        }
        const params = {
          deviceId: this.overviewDetail.overview.deviceId,
          deviceName: this.overviewDetail.overview.deviceName
        }
        const data = {

        }
        this.checkedProgress.map(item => {
          // 报警
          if (item === 'alarmConfig') {
            data['alarmConfig'] = this.alarmConfig.data
          }
          // 设置设备参数
          if (item === 'deviceConfig') {
            data['deviceConfig'] = this.deviceConfig.data
          }
          // 单元信息
          if (item === 'unitConfig') {
            data['unitConfig'] = this.unitConfig.data
            this.unitConfig.data.hoggeryTypeDesc && delete data['unitConfig'].hoggeryTypeDesc
            this.unitConfig.data.posDesc && delete data['unitConfig'].posDesc
            this.subUnitConfig(data['unitConfig'], this.unitConfig.data.hoggeryType)
          }
          // 照明
          if (item === 'lightConfig') {
            data['lightConfig'] = {}
            data['lightConfig']['entrys'] = this.lightConfig.data.entrys
          }
          // 喷淋
          if (item === 'sprayConfig') {
            data['sprayConfig'] = this.sprayConfig.data
          }
          // 设置加热
          if (item === 'heatDeviceConfig') {
            data['heatDeviceConfig'] = this.heatDeviceConfig.data
          }
          // 滑动窗口设置
          if (item === 'windowConfigs') {
            data['windowConfigs'] = this.windowConfigs.data
            data['windowConfigs'].forEach(item => {
              delete item.controlsPositionRight
              delete item.rules
            })
          }
          // 工作模式
          if (item === 'workModeConfig') {
            data['workModeConfig'] = this.workModeConfig.data
            data['workModeConfig'].workModeDesc && delete data['workModeConfig']['workModeDesc']
          }
          // 空气
          if (item === 'ariConditioningConfig') {
            data['ariConditioningConfig'] = this.ariConditioningConfig.data
          }
          // 上报周期
          if (item === 'statusReportPeriod') {
            data['statusReportPeriod'] = this.setEscalationPeriod.data.statusReportPeriod
          }
          //  温湿度
          if (item === 'sensorConfigs') {
            data['sensorConfig'] = this.sensorConfig
          }
        })

        this.loading = true
        this.singleUnitLoading = true
        singleUnit(params, data).then((res) => {
          this.loading = false
          this.singleUnitLoading = false
          if (res.rel) {
            this.$message.success('参数设置成功!')
            if (res.data) {
              this.ArgsInfoData = res.data
              this.initArgsInfoData()
              // this.alarmConfig.data = res.data.runtimeArgs.alarmConfig
              // this.equipmentConfig.data = res.data.runtimeArgs.equipmentConfig
              // this.workModeConfig.data = res.data.runtimeArgs.workModeConfig
              // this.unitConfig.data = res.data.runtimeArgs.unitConfig
              // this.initUnitConfig(res.data.unitConfig.hoggeryType)
              // this.lightConfig.data.entrys =
              // res.data.runtimeArgs.lightConfig.entrys
              // this.sensorConfig = res.data.runtimeArgs.sensorConfig
              // this.setEscalationPeriod.data.statusReportPeriod =
              // res.data.runtimeArgs.statusReportPeriod
              // this.windowConfig.data = res.data.runtimeArgs.windowConfig
            } else {
              this.viewIntervalFun()
            }
          } else {
            this.ArgsInfo()
            this.$message.error(res.message || '系统错误')
          }
        })
      } else {
        this.$message.error('当前设备已离线!')
      }
    }
  }
}
</script>
<style lang="scss">
 .win-title {
    font-size: 12px;
    // color: #cdd8f7;
    @include font_color('mainFontColor11');
    line-height: 15px;
    margin-bottom: 10px;
    display: inline-block;
  }
.multi-function-setting{
  .overview-box .el-form-item{
    margin-bottom: 12px;
  }
  .el-form-item__error{
    top: 35px;
  }
  .overview-box{
    .el-form-item__error{
      top: 74px;
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
  .light-config{
    .el-form-item__error{
      top: 38px;
    }
  }
  .el-form-item_bottom{
    margin-bottom: 5px !important;
    .el-form-item__error{
        top: 40px;
      }
  }
  .unit-config {
  .radio-box {
    margin-bottom: 30px;
  }
  .radio {
    width: 45%;
    margin-bottom: 20px;
  }
  .el-input-number {
    width: auto;
  }
}
  .dialog-hidden{
    display: none;
  }
  .dialog-block{
    display: block;
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
    @include font_color('mainFontColor11');
    font-size: 16px;
  }
  .el-checkbox__input.is-checked+.el-checkbox__label {
    // color: #cdd8f7;
    @include font_color('mainFontColor11');
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
  // color: #cdd8f7;
  @include font_color('mainFontColor11');
  margin-bottom: 20px;
  .current {
    color: #409eff;
  }
}
.allcheckContent {
  // color: #cdd8f7;
  @include font_color('mainFontColor11');
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
  // color: #f4f7ff;
  @include font_color('viewFontColor2');
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
    // color: #cdd8f7;
    @include font_color('mainFontColor11');
  }
}
.box-head {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // background: #034c90;
  @include background('overviewBoxBackGround');
  border: 1px solid;
  @include border_color('overviewBoxBorderBottomColor');
  padding: 10px 20px;
  .title {
    font-size: 16px;
    // color: #cdd8f7;
    @include font_color('mainFontColor11');
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
  // background: #27376f;
  @include background('comfortBackGround');
  overflow: hidden;
  .el-form-item {
    margin-bottom: 12px;
  }
  .box-body {
    font-size: 12px;
    padding: 10px 20px;
    .form-title {
      .title {
        // color: #cdd8f7;
        @include font_color('viewFontColor3');
      }
    }
    .form-body {
      display: flex;
      // align-items: center;
      // color: #cdd8f7;
      @include font_color('viewFontColor3');
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
  // background: #27376f;
  @include background('comfortBackGround');
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
