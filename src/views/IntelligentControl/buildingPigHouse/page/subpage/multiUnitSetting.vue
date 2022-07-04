<template>
  <div class="multi-unit-setting">
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
        <button class="btn-blue" @click="distributionHistory()">下发记录</button>
        <el-popconfirm
          title="确定发送指令到设备吗？"
          @onConfirm="singleUnit()"
        >
          <el-button slot="reference" class="btn-blue" :loading="singleUnitLoading">下发指令</el-button>
        </el-popconfirm>
        <el-button class="btn-red" @click="parameterSetting()">退出多单元编辑</el-button>
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
          <div v-loading="workModeConfigLoading" class="overview-box wunitConfigork-mode-config work-mode-config">
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
                <el-checkbox label="unitConfig">单元参数</el-checkbox>
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
              <!-- <div class="box-head"> -->
              <div class="title">
                <el-checkbox label="statusReportPeriod">上报周期</el-checkbox>
              </div>
            <!-- </div> -->
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
                <!-- 照明开启/关闭时间 -->
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
              <!-- <div class="box-head"> -->
              <div class="title">
                <el-checkbox label="deviceConfig">设备参数</el-checkbox>
              </div>

              <!-- </div> -->
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
          <!-- 温湿度传感器校准值 -->
          <div class="overview-box flex-grow-2">
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
          <div class="overview-box windowConfigs flex-grow-1" style="marginRight: 0;">
            <div v-loading="sensorConfigLoading" class="overview-panel" style="height: 100%;">
              <el-form ref="windowConfigs" :model="windowConfigs">
                <div class="box-head">
                  <div class="title">
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
  // ArgsInfo,
  multiUnitSetting
} from '@/http/api/pigHouse.js'
import OverviewBox from '@/views/IntelligentControl/fieldDeviceOverview/common/components/OverviewBox'
import rulesService from './utils/verification'
export default {
  components: {
    OverviewBox
  },
  inject: ['overviewDetail'],
  data() {
    return {
      dialogDtatus: false,
      // equipmentConfigLoading: false,
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
      focusCurrent: '',
      singleUnitLoading: false,
      progressOptions: ['alarmConfig', 'workModeConfig', 'unitConfig', 'statusReportPeriod', 'lightConfig', 'deviceConfig', 'sprayConfig', 'ariConditioningConfig', 'heatDeviceConfig', 'sensorConfigs', 'windowConfigs'],
      checkedProgress: [],
      allChecked: false,
      IntelligentControl: '',
      template: '',
      templateLists: [],
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
              // isShow: false,
              controlsPositionRight: 'right',
              ...rulesService.limit_15_30
            },
            {
              label: '适宜温度(℃):',
              key: 'suitableTemp',
              type: 'inputNumber',
              // isShow: false,
              controlsPositionRight: 'right',
              ...rulesService.limit_20_35
            },
            {
              label: '上限温度(℃):',
              key: 'upperTemp',
              type: 'inputNumber',
              // isShow: false,
              controlsPositionRight: 'right',
              ...rulesService.limitControl(20, 40)
            },
            {
              label: '下偏移温度(℃):',
              key: 'lowerAdjustTemp',
              type: 'inputNumber',
              // isShow: false,
              controlsPositionRight: 'right',
              ...rulesService.limit_0_5
            },
            {
              label: '上偏移温度(℃):',
              key: 'upperAdjustTemp',
              type: 'inputNumber',
              // isShow: false,
              controlsPositionRight: 'right',
              ...rulesService.limit_0_5
            },
            {
              label: '警戒湿度(%):',
              key: 'warningHumi',
              type: 'inputNumber',
              // isShow: false,
              controlsPositionRight: 'right',
              ...rulesService.limit_0_100
            },
            {
              label: '下限湿度(%):',
              key: 'lowerHumi',
              type: 'inputNumber',
              // isShow: false,
              controlsPositionRight: 'right',
              ...rulesService.limit_0_100
            },
            {
              label: '上限湿度(%):',
              key: 'upperHumi',
              type: 'inputNumber',
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
              // isShow: false,
              controlsPositionRight: 'right',
              ...rulesService.limit_20_50
            },
            {
              label: '关闭温度（单位: ℃）:',
              key: 'closeTemp',
              type: 'inputNumber',
              // isShow: false,
              controlsPositionRight: 'right',
              ...rulesService.limit_20_50
            }
          ]
        }
      },
      // 滑动窗口设置
      windowConfigs: {
        sendShow: false,
        disabled: false,
        data: [
          { adjustTime: '', totalPosUp: '', totalPosDown: '', rules: rulesService.rulesNull },
          { adjustTime: '', totalPosUp: '', totalPosDown: '', rules: rulesService.rulesNull },
          { adjustTime: '', totalPosUp: '', totalPosDown: '', rules: rulesService.rulesNull }
        ]
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
      // 温湿度校准值
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
                ...rulesService.verGreaterThan([-10, 10], '<', '必须小于伴热带关闭温度!', this, 'temperatureControlConfig', 'heatBelt', 'closeTemp')
              },
              {
                key: 'closeTemp',
                controlsPositionRight: 'right',
                precision: 1,
                step: 0.1,
                ...rulesService.verGreaterThan([-10, 10], '>', '必须大于伴热带开启温度!', this, 'temperatureControlConfig', 'heatBelt', 'openTemp')
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
          disconnectedNetMask: 0
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
          lockParam: ''
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
            }
            // {
            //   title: '定速风机数量（0-5）',
            //   key: 'fixSpeedFanAmount',
            //   type: 'inputNumber',
            //   min: 0,
            //   max: 5,
            //   controlsPositionRight: 'right'
            // },
            // {
            //   title: '室内前温湿度传感器Mac地址',
            //   key: 'indoorBeforeProbe',
            //   secKey: 'mac',
            //   type: 'input'
            // },
            // {
            //   title: '室内后温湿度传感器Mac地址',
            //   key: 'indoorAfterProbe',
            //   secKey: 'mac',
            //   type: 'input'
            // },
            // {
            //   title: '暖灯温湿度传感器Mac地址',
            //   key: 'heatLampProbe',
            //   secKey: 'mac',
            //   type: 'input'
            // }
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
              // min: 10,
              // max: 3600,
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
  mounted() {
    this.IntelligentControl = JSON.parse(sessionStorage.getItem('setMultiUnit'))
  },
  methods: {
    distributionHistory() {
      this.$router.push({
        name: 'pigHouseOrderHistory',
        query: {
          fieldId: this.overviewDetail.overview.fieldId
        }
      })
    },
    handleCheckAllChange(val) {
      this.checkedProgress = val ? this.progressOptions : []
    },
    handleCheckedChange(val) {
      const checkedCount = val.length
      this.allChecked = checkedCount === this.progressOptions.length
    },
    close() {
      this.dialogDtatus = false
    },
    parameterSetting() {
      // this.overviewDetail.ArgsInfo()
      this.overviewDetail.progress = 'parameterSetting'
    },

    changePicker(event) {
      console.log('选择的时间', event, this.lightConfig.data.entrys)
    },
    // ArgsInfo() {
    //   console.log(this.overviewDetail.overview, 'this.overviewDetail.overview')
    //   ArgsInfo({ deviceId: this.overviewDetail.overview.deviceId }).then(
    //     (res) => {
    //       if ((res && res.status === 200 || res.rel) && res.data) {
    //         console.log(res.data, 'res.dataaa')
    //         this.ArgsInfoData = res.data
    //         this.initArgsInfoData()
    //       }
    //       if (this.cur_prg !== 0) {
    //         if (
    //           new Date(this.ArgsInfoData.reportTime).getTime() > this.singleTime
    //         ) {
    //           this.$message.success('参数设置成功!')
    //           this.clearViewInterval()
    //         }
    //       }
    //       console.log('返回的参数信息', res, this.temperatureControlConfig)
    //     }
    //   )
    // },
    // initArgsInfoData() {
    //   this.unitConfig.fieldList.body[4].isShow = true
    //   this.unitConfig.fieldList.body[5].isShow = true
    //   const ArgsInfoData = JSON.parse(JSON.stringify(this.ArgsInfoData))
    //   if (ArgsInfoData.temperatureControlConfig) {
    //     this.temperatureControlConfig = ArgsInfoData.temperatureControlConfig || {}
    //     const exchange = this.temperatureControlConfig.exchange || {}
    //     const gutter = this.temperatureControlConfig.gutter || {}
    //     const g2Humidifying = this.temperatureControlConfig.g2Humidifying || {}
    //     const shower = this.temperatureControlConfig.shower || {}
    //     exchange.openDuration = exchange.openDuration / 60
    //     gutter.openDuration = gutter.openDuration / 60
    //     g2Humidifying.closeDuration = g2Humidifying.closeDuration / 60
    //     shower.closeDuration = shower.closeDuration / 60
    //   }
    //   // 报警
    //   if (ArgsInfoData.alarmConfig) { this.alarmConfig.data = ArgsInfoData.alarmConfig }
    //   // 工作模式
    //   if (ArgsInfoData.workModeConfig) { this.workModeConfig.data = ArgsInfoData.workModeConfig }
    //   // 单元信息
    //   if (ArgsInfoData.unitConfig) { this.unitConfig.data = ArgsInfoData.unitConfig }
    //   // 照明
    //   if (ArgsInfoData.lightConfig) { this.lightConfig.data.entrys = ArgsInfoData.lightConfig && ArgsInfoData.lightConfig.entrys }
    //   // 设置设备参数
    //   if (ArgsInfoData.deviceConfig) { this.deviceConfig.data = ArgsInfoData.deviceConfig }
    //   // 喷淋
    //   if (ArgsInfoData.sprayConfig) { this.sprayConfig.data = ArgsInfoData.sprayConfig }
    //   // 空气
    //   if (ArgsInfoData.ariConditioningConfig) { this.ariConditioningConfig.data = ArgsInfoData.ariConditioningConfig }
    //   // 设置加热
    //   if (ArgsInfoData.heatDeviceConfig) { this.heatDeviceConfig.data = ArgsInfoData.heatDeviceConfig }
    //   // 滑动窗口设置
    //   if (ArgsInfoData.windowConfigs && ArgsInfoData.windowConfigs.length > 0) {
    //     const arr = JSON.parse(JSON.stringify(ArgsInfoData.windowConfigs))
    //     for (const i of arr) {
    //       i.rules = rulesService.rulesNull
    //       i.controlsPositionRight = 'right'
    //     }
    //     this.windowConfigs.data = arr
    //   } else {
    //     this.windowConfigs.data = []
    //   }
    //   // 温湿度
    //   if (ArgsInfoData.sensorConfig) {
    //     this.sensorConfig = ArgsInfoData.sensorConfig
    //   }
    //   this.initUnitConfig(ArgsInfoData.unitConfig.hoggeryType)
    //   if (ArgsInfoData.statusReportPeriod) {
    //     this.setEscalationPeriod.data.statusReportPeriod = ArgsInfoData.statusReportPeriod
    //   }
    // },
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
    addTime() {
      const entrys = this.lightConfig.data.entrys
      if (entrys.length >= 8) {
        return
      } else {
        const obj = { openTime: '', closeTime: '' }
        this.lightConfig.data.entrys = [...entrys, obj]
      }
    },
    addFeedTime() {
      const entrys = this.feedConfig.data.entrys
      if (entrys.length >= 8) {
        return
      } else {
        const obj = { openTime: '', openDuration: '' }
        this.feedConfig.data.entrys = [...entrys, obj]
      }
    },
    deleteTime(index) {
      this.lightConfig.data.entrys.splice(index, 1)
    },
    deleteFeedTime(index) {
      this.feedConfig.data.entrys.splice(index, 1)
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
          if (type.indexOf(1) !== -1) {
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
        const data = {}
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
            delete data['unitConfig'].hoggeryTypeDesc
            delete data['unitConfig'].posDesc
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
          // 滑窗参数设置
          if (item === 'windowConfigs') {
            data['windowConfigs'] = this.windowConfigs.data
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

        const datas = {
          config: data,
          deviceNames: this.IntelligentControl.deviceNames,
          fieldId: this.IntelligentControl.fieldId,
          fieldName: this.IntelligentControl.fieldName,
          unitNames: this.IntelligentControl.unitNames
        }
        this.loading = true
        this.singleUnitLoading = true
        multiUnitSetting(datas).then((res) => {
          this.loading = false
          this.singleUnitLoading = false
          if (res.rel) {
            this.$confirm('您的指令下发任务已提交成功', '提示', {
              confirmButtonText: '下发记录',
              confirmButtonClass: 'btn-blue btn-blue-confirm',
              cancelButtonText: '返回',
              cancelButtonClass: 'btn-border',
              type: 'success'
            }).then(() => {
              this.$router.push({
                name: 'pigHouseOrderHistory',
                query: {
                  fieldId: this.overviewDetail.overview.fieldId
                }
              })
            })
            if (res.data) {
              this.alarmConfig.data = res.data.runtimeArgs.alarmConfig
              this.equipmentConfig.data = res.data.runtimeArgs.equipmentConfig
              this.workModeConfig.data = res.data.runtimeArgs.workModeConfig
              this.unitConfig.data = res.data.runtimeArgs.unitConfig
              this.unitConfig.fieldList.body[4].isShow = true
              this.unitConfig.fieldList.body[5].isShow = true
              this.initUnitConfig(res.data.unitConfig.hoggeryType)
              this.lightConfig.data.entrys =
              res.data.runtimeArgs.lightConfig.entrys
              this.sensorConfig = res.data.runtimeArgs.sensorConfig
              this.setEscalationPeriod.data.statusReportPeriod =
              res.data.runtimeArgs.statusReportPeriod
              this.windowConfig.data = res.data.runtimeArgs.windowConfig
            } else {
              this.viewIntervalFun()
            }
          } else {
            this.$message.error(res.message)
          }
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
.el-message-box__btns:nth-child(1){
  border: 1px solid #3c7ab0;
  padding: 10px 20px;
  border: solid 1px #3f80b9;
  border-radius: 3px;
  // color: #cdd8f7;
  @include font_color('mainFontColor11');
  /* background-color: transparent;
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #FFF;  */
}
.work-mode-config .overview-box, .light-config .overview-box {
    padding: 20px;
}
.multi-unit-setting, .multi-function-setting {
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
  .work-mode-config {
    margin-left: 20px;
  }
  .option {
    .el-button {
      padding: 8px 15px;
      margin-left: 10px;
      background-image: linear-gradient(180deg, #178efe 0%, #0c4197 100%);
      border-image: linear-gradient(#49bcff, #004a96) 5 5;
      color: #fff;
      font-weight: 400;
    }
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

.multi-unit-setting{
  .overview-box .el-form-item .el-input__inner{
    border: none;
  }
  .overview-box .el-form-item{
    margin-bottom: 12px;
  }
  .el-form-item__error{
    top: 35px;
  }
  .overview-box{
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
  .windowConfigs {
    .el-form-item__error{
      top: 34px;
    }
  }
}
</style>
<style lang="scss" scoped>
 .win-title {
    font-size: 12px;
    // color: #cdd8f7;
    @include font_color('mainFontColor11');
    line-height: 15px;
    margin-bottom: 10px;
    display: inline-block;
  }
ul {
  list-style-type: none;
  margin: 0;
}
.template {
  .template-item {
    margin-bottom: 10px;
    color: rgb(205, 216, 247);
    cursor: pointer;
    &:hover{
    color: #409eff;
    }
  }
}
.header {
  .title {
    // color: #fff;
    @include font_color('mainFontColor2');
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
      // color: #fff;
      @include font_color('mainFontColor2');
      background-image: linear-gradient(180deg, #0090E7 0%, #0090E7 100%);
    }
  }
}
.allcheckContent {
  // color: #cdd8f7;
  @include font_color('mainFontColor11');
  margin-bottom: 10px;
}
.nav {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 20px;
  .parameter-template {
    display: flex;
    // color: #cdd8f7;
    @include font_color('mainFontColor11');
    .current {
      color: #409eff;
    }
  }
}
.btn-border,
.btn-blue,
.btn-red {
  padding: 5px 15px;
  margin-left: 10px;
}
.row-box {
  margin-bottom: 20px;
  width: 100%;
}

.multi-unit-setting {
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
        @include font_color('mainFontColor11');
      }
    }
    .form-body {
      display: flex;
      // align-items: center;
      // color: #cdd8f7;
      @include font_color('mainFontColor11');
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
