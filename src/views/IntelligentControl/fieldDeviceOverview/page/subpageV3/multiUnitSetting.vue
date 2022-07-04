<template>
  <!-- 多单元参数设置 -->
  <div class="multi-unit-setting-v4">
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
    <div class="nav" style="padding-left:10px">
      <div class="parameter-template">
        <template v-if="template">
          <div class="name">当前选择模板:</div>
          <div class="current">{{ template }}</div>
        </template>
      </div>
      <div class="option">
        <button
          v-if="template"
          class="btn-border"
          @click="
            template = ''
          "
        >
          取消模板
        </button>
        <!-- <el-popover placement="top-start" popper-class="view-popover" width="200" trigger="hover">
          <ul class="template">
            <li
              v-for="(item, index) in templateLists"
              :key="index"
              class="template-item"
              @click="currentTemplate(item)"
            >
              {{ item.name }}
            </li>
          </ul>
          <el-button slot="reference">选择模板</el-button>
        </el-popover> -->
        <!-- <button class="btn-blue" >选择模板</button> -->
        <el-button class="btn-blue" @click="record()">下发记录</el-button>
        <!-- <el-button class="btn-blue" @click="dialogDtatus = true">选择模板</el-button> -->
        <el-popconfirm
          title="确定发送指令到设备吗？"
          @onConfirm="singleUnit()"
        >
          <el-button slot="reference" class="btn-blue" :loading="singleUnitLoading">下发指令</el-button>
        </el-popconfirm>
        <el-button class="btn-red" @click="parameterSetting()">退出编辑</el-button>
      </div>
    </div>

    <div
      class="dialog"
      :class="dialogDtatus ? 'dialog-block' : 'dialog-hidden'"
    >
      <div class="dialog-body Highlight">
        <div class="dialog-head">
          <span>选择模板</span>
          <div class="dialog-head-close" @click="close">
            <i class="iconfont">&#xe61a;</i>
          </div>
        </div>
        <div class="dialog-container">
          <div
            v-for="(item, index) in templateLists"
            :key="index"
            class="focus-list"
          >
            <div
              class="focus-txt"
              :class="focusCurrent === item.id ? 'focus-txt-current' : ''"
              @click="currentTemplate(item)"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
      <div class="dialog-close" @click="close" />
    </div>
    <div class="allcheckContent">
      <el-checkbox v-model="allChecked" @change="handleCheckAllChange" />全选
    </div>
    <el-checkbox-group v-model="checkedProgress" @change="handleCheckedChange">
      <div v-loading="loading" class="main">
        <el-row :gutter="10" class="row-box" style="padding-right:0">
          <div class=" flex-grow-2" style="margin-bottom:0">
            <div class="overview-panel" style="height: 100%;">
              <el-form ref="aimTemperatureHumidity" :model="aimTemperatureHumidity">
                <div class="box-head">
                  <div class="title">
                    <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
                    <el-checkbox label="aimTemperatureHumidity">目标温湿度参数</el-checkbox>
                  </div>
                </div>
                <div class="box-body">
                  <el-row class="form-title" :gutter="10">
                    <!-- <el-col class="title-col" :span="4">1</el-col> -->
                    <el-col
                      v-for="(item, index) in aimTemperatureHumiditys.titles"
                      :key="index"
                      class="title"
                      :span="20 / aimTemperatureHumiditys.titles.length"
                    >{{ item }}</el-col>
                  </el-row>
                  <el-row
                    v-for="(item, index) in aimTemperatureHumiditys.labels"
                    :key="index"
                    class="form-body"
                    :gutter="10"
                  >
                    <!-- <el-col class="label" :span="4" /> -->
                    <el-col
                      v-for="(childItem, index) in item.lists"
                      :key="index"
                      :span="20 / item.lists.length"
                    >
                      <el-form-item
                        :prop="childItem.key"
                        :rules="childItem.rules"
                      >
                        <template v-if="childItem.type === 'slot'">
                          <slot :name="'form-' + childItem.key" />
                        </template>
                        <!-- {{ item.key }}--{{ childItem.key }} -->
                        <el-input-number
                          v-model="aimTemperatureHumidity[childItem.key]"
                          :disabled="aimTemperatureHumiditys.disabled"
                          :precision="childItem.precision"
                          :step="childItem.step"
                          :controls-position="childItem.controlsPositionRight"
                          :size="childItem.size"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </el-form>
            </div>
          </div>

        </el-row>
        <el-row :gutter="10" class="row-box" style="display: flex;">
          <el-col :span="12" style="padding-left: 0px !important;height:100%">
            <overview-box-alarm
              ref="alarmConfig"
              style="height:100%"
              :data="alarmConfig.data"
              :field-list="alarmConfig.fieldList"
            >
              <template v-slot:head>
                <!-- <div class="box-head"> -->
                <div class="title">
                  <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
                  <el-checkbox label="alarmConfig">报警</el-checkbox>
                </div>
                <!-- </div> -->
              </template>
            </overview-box-alarm>
          </el-col>
          <el-col class="col-box" :span="12" style="margin-right:5px">
            <div
              class="gather-box"
              style="height: 100%;    display: flex;
    flex-direction: column;
    justify-content: space-between"
            >
              <div class=" work-mode-config" style="flex:1;margin-bottom:10px">
                <div class="box-head">
                  <div class="title">
                    <el-checkbox label="workModeConfig">工作模式</el-checkbox>
                  </div>
                </div>
                <div class="overview-box">
                  <el-form ref="workModeConfig" :model="workModeConfig.data">
                    <el-row :gutter="10">
                      <el-col :span="24">
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
                              class="overview-radio radio-border"
                              :class="item.disabled ? item.class : workModeConfig.data.workMode === item.value ? 'current-radio' : ''"
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
              <div class="overview-panel" style="flex:1">
                <el-form ref="warmLight" :model="temperatureControlConfig">
                  <div class="box-head">
                    <div class="title">
                      <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
                      <el-checkbox label="warmLight">伴热带目标温度</el-checkbox>
                    </div>
                  </div>
                  <div class="box-body">
                    <el-row class="form-title" :gutter="10">
                      <!-- <el-col class="title-col-8" :span="4">1</el-col> -->
                      <el-col
                        v-for="(item, index) in warmLight.titles"
                        :key="index"
                        class="title"
                        :span="20 / warmLight.titles.length"
                      >{{ item }}</el-col>
                    </el-row>
                    <el-row
                      v-for="(item, index) in warmLight.labels"
                      :key="index"
                      class="form-body"
                      :gutter="10"
                    >
                      <!-- <el-col class="label label-8" :span="4">{{
                    item.label
                  }}</el-col> -->
                      <el-col
                        v-for="(childItem, index) in item.lists"
                        :key="index"
                        :span="20 / item.lists.length"
                      >
                        <el-form-item
                          :prop="item.key + '.' +childItem.key"
                          :rules="childItem.rules"
                        >
                          <!-- solt -->
                          <template v-if="childItem.type === 'slot'">
                            <slot :name="'form-' + childItem.key" />
                          </template>
                          <el-input-number
                            v-model="
                              temperatureControlConfig[item.key][childItem.key]
                            "
                            :disabled="warmLight.disabled"
                            :precision="childItem.precision"
                            :step="childItem.step"
                            :controls-position="childItem.controlsPositionRight"
                            :size="childItem.size"
                          />
                          <!-- :min="childItem.min"
                        :max="childItem.max" -->
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                </el-form>
              </div>
            </div>
          </el-col>
        </el-row>

        <el-row class="row-box" :gutter="10" style="display: flex;">
          <el-col :span="24" style="padding-left:0 !important;padding-right:0">
            <div class="overview-panel" style="height: 100%;">
              <el-form ref="coolingEquipment" :model="temperatureControlConfig">
                <div class="box-head">
                  <div class="title">
                    <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->

                    <el-checkbox label="coolingEquipment">降温增湿设备</el-checkbox>
                  </div>
                </div>
                <div class="box-body">
                  <el-row class="form-title " :gutter="10">
                    <el-col class="label" :span="3" style="color:rgba(0,0,0,0)">11111</el-col>
                    <el-col
                      v-for="(item, index) in coolingEquipment.titles"
                      :key="index"
                      class="title"
                      :span="21 / coolingEquipment.titles.length"
                    >{{ item }}</el-col>
                  </el-row>
                  <el-row
                    v-for="(item, index) in coolingEquipment.labels"
                    :key="index"
                    class="form-body"
                    :gutter="10"
                  >
                    <template v-if="item.isShow">
                      <el-col class="label" :span="3">{{ item.label }}</el-col>
                      <el-col
                        v-for="(childItem, index) in item.lists"
                        :key="index"
                        :span="21 / item.lists.length"
                      >
                        <el-form-item :prop="item.key + '.' + childItem.key" :rules="childItem.rules">
                          <!-- solt -->
                          <template v-if="childItem.type === 'slot'">
                            <slot :name="'form-' + childItem.key" />
                          </template>
                          <el-input-number
                            v-if="childItem.type === 'inputNumber'"
                            v-model="
                              temperatureControlConfig[item.key][childItem.key]
                            "
                            :disabled="coolingEquipment.disabled"
                            :precision="childItem.precision"
                            :step="childItem.step"
                            :controls-position="childItem.controlsPositionRight"
                            :size="childItem.size"
                          />
                          <!-- :min="childItem.min"
                      :max="childItem.max" -->
                          <el-select
                            v-if="childItem.type === 'select'"
                            v-model="
                              temperatureControlConfig[item.key][childItem.key]
                            "
                            :disabled="coolingEquipment.disabled"
                            placeholder="请选择"
                          >
                            <el-option
                              v-for="selectItem in childItem.option"
                              :key="selectItem.value"
                              :label="selectItem.label"
                              :value="selectItem.value"
                            />
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </template>
                  </el-row>
                </div>
              </el-form>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="row-box" style="display: flex;margin-bottom:0">
          <el-col class="col-box" style="padding-left: 0px !important;" :span="12">
            <div
              class="overview-box light-config"
              style="height: calc(100% - 20px);"
            >
              <div class="box-head">
                <div class="title">
                  <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
                  <el-checkbox label="lightConfig">照明</el-checkbox>
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
                        value-format="HH:mm:ss"
                        format="HH:mm:ss"
                        @change="changePicker"
                      />
                      -
                      <el-time-picker
                        v-model="item.closeTime"
                        class="time-picker"
                        :disabled="lightConfig.fieldList.disabled"
                        placeholder="结束时间"
                        value-format="HH:mm:ss"
                        format="HH:mm:ss"
                        @change="changePicker"
                      />
                      <div
                        v-if="index !== 0"
                        class="delete"
                        style="font-size: 16px;color: #FF2727;cursor: pointer;margin-left:10px;"
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
          </el-col>
          <el-col class="col-box" style="padding-right: 0px !important;" :span="12">
            <div
              class="overview-box light-config"
              style="height: calc(100% - 20px);"
            >
              <div class="box-head">
                <div class="title">
                  <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->

                  <el-checkbox label="feedConfig">饲喂</el-checkbox>
                </div>
              </div>
              <div class="overview-box">
                <el-form ref="feedConfig" :model="feedConfig">
                  <div class="title">
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
                            } else if (v < 0) {
                              callback('不能小于0')
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
                        :disabled="feedConfig.fieldList.disabled"
                        controls-position="right"
                      />
                      <!-- :min="0" -->
                    </el-form-item>
                    <!-- <el-time-picker
                  v-model="item.closeTime"
                  class="time-picker"
                  :disabled="feedConfig.fieldList.disabled"
                  placeholder="结束时间"
                  value-format="HH:mm"
                  format="HH:mm"
                  @change="changePicker"
                /> -->
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
          </el-col>
        </el-row>

        <el-row :gutter="10" class="row-box" style="display: flex;">
          <el-col class="col-box" :span="16">
            <div class="overview-panel" style="height: 100%;">
              <el-form ref="equipmentConfig" :model="equipmentConfig.data">
                <div class="box-head">
                  <div class="title">
                    <el-checkbox label="equipmentConfig">设备参数</el-checkbox>
                  </div>
                </div>
                <div class="box-body" style="width:100%">
                  <el-col :span="24">
                    <el-form-item label="参数锁定（喷淋、风机）">
                      <el-radio-group
                        v-model="equipmentConfig.data.lockParam"
                        :disabled="equipmentConfig.fieldList.disabled"
                      >
                        <el-radio
                          v-for="(item, index) in equipmentConfig.fieldList
                            .radioList.optList"
                          :key="index"
                          class="overview-radio radio-border"
                          :class="equipmentConfig.data.lockParam === item.value ? 'current-radio' : ''"
                          :label="item.value"
                        >
                          {{ item.label }}
                        </el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col v-for="(item,index) in equipmentConfig.fieldList.fanConfig" :key="index" :span="12">
                    <el-form-item
                      label-width="120px"
                      style="margin-bottom: 10px;"
                      :label="item.label"
                      :prop="`fanConfig.${item.key}`"
                      :rules="item.rules"
                    >
                      <el-input-number
                        v-model="equipmentConfig.data.fanConfig[item.key]"
                        :disabled="equipmentConfig.fieldList.disabled"
                        controls-position="right"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      label-width="120px"
                      style="margin-bottom: 10px;"
                      :label="equipmentConfig.fieldList.reportPeriod.label"
                      :prop="equipmentConfig.fieldList.reportPeriod.key"
                      :rules="equipmentConfig.fieldList.reportPeriod.rules"
                    >
                      <el-input-number
                        v-model="equipmentConfig.data.reportPeriod"
                        :disabled="equipmentConfig.fieldList.disabled"
                        controls-position="right"
                      />
                    </el-form-item>
                  </el-col>
                </div>
              </el-form>
            </div>
          </el-col>
          <el-col :span="8" style="height:100%">
            <div class="overview-box " style="margin: 0;height:100% ">
              <el-form ref="windowConfig" class="default" :model="windowConfig.data">
                <div class="box-head">
                  <div class="title">
                    <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
                    <el-checkbox label="windowConfig">风口</el-checkbox>
                  </div>
                </div>
                <div style="margin:20px;margin-bottom:0">
                  <div v-for="(item, index) in windowConfig.fieldList" :key="index">
                    <div class="title" :style="{ color: item.titleColor,'margin-bottom':item.type !== 'radio' ? '10px' : '0'}">
                      {{ item.title }}
                    </div>
                    <el-form-item
                      :prop="item.mark"
                      :rules="item.rules"
                      style="margin-bottom:10px"
                      class="form-item-row"
                    >
                      <el-radio-group
                        v-if="item.type === 'radio'"
                        v-model="windowConfig.data[item.mark][0][item.key]"
                        :disabled="windowConfig.disabled"
                      >
                        <el-radio
                          v-for="(radioItem, index) in item.optList"
                          :key="index"
                          class="overview-radio"
                          :label="radioItem.value"
                        >
                          {{ radioItem.label }}
                        </el-radio>
                      </el-radio-group>
                      <el-input-number
                        v-else
                        v-model="windowConfig.data[item.mark][0][item.key]"
                        :disabled="windowConfig.disabled"
                        :precision="item.precision"
                        :step="item.step"
                        :controls-position="item.controlsPositionRight"
                        :size="item.size"
                      />
                      <!-- :min="item.min"
                    :max="item.max" -->
                    </el-form-item>
                  </div>
                </div>
              </el-form>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-checkbox-group>
  </div>
</template>

<script>
import {
  putMultiUnit,
  myDeviceArgsTemplate
} from '@/http/api/fieldDeviceOverviewV3'
import OverviewBoxAlarm from '@/views/IntelligentControl/fieldDeviceOverview/common/components/OverviewBox/indexAlram'
// import OverviewBox from '@/views/IntelligentControl/fieldDeviceOverview/common/components/OverviewBox'
// import generalForm from '@/components/commonComponent/generalForm'
import jsontype from './config/formJson.json'
import getFilterTemplate from './config/templateFilter.js'
import rulesService from './utils/verification'
export default {
  components: {
    // OverviewBox,
    OverviewBoxAlarm
  },
  // inject: ['overviewDetail'],
  // props: {
  //   unitId: String
  // },
  data() {
    return {
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
      progressOptions: ['variableFrequency', 'aimTemperatureHumidity', 'warmLight', 'coolingEquipment', 'alarmConfig', 'equipmentConfig', 'workModeConfig', 'unitConfig', 'lightConfig', 'feedConfig', 'sensorConfig', 'setEscalationPeriod', 'windowConfig', 'heatLamp'],
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

      temperatureControlConfig: {
        exchange: {
        },
        gutter: {

        },
        fixedFan: [{ openTemp: '', closeTemp: '' }],
        endFan: [

        ],
        heatLamp: {
          // destTemp: ''
        },
        heatBelt: {
          // closeTemp: '',
          // openTemp: ''
        },
        humidifying: {
          // closeDuration: '',
          // openDuration: '',
          // openTemp: '',
          // staticMode: ''
        },
        shower: {
          // closeDuration: '',
          // openDuration: '',
          // openTemp: '',
          // staticMode: ''
        },
        waterCurtain: {
          closeDuration: '',
          openDuration: '',
          openTemp: '',
          staticMode: ''
        }
      },

      aimTemperatureHumidity: {
        // destTemp: '',
        // destHumi: ''
      },
      sensorConfig: {
        heatLamp: {
          // enable: true,
          // humidity: 0,
          // temperature: 1,
          // bleMac: ''
        },
        indoorAfter: {
          // enable: true,
          // humidity: 0,
          // temperature: 1,
          // bleMac: ''
        },
        indoorBefore: {
          // enable: true,
          // humidity: 0,
          // temperature: 1,
          // bleMac: ''
        },
        outDoor: {
          // enable: true,
          // humidity: 0,
          // temperature: 1,
          // bleMac: ''
        }
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
      aimTemperatureHumiditys: {
        sendShow: false,
        disabled: false,
        data: {
          destTemp: '',
          destHumi: '',
          partDestTemp: '',
          minGear: ''
        },
        titles: [
          '目标温度(℃)',
          '目标湿度（%）',
          '暖灯目标温度(℃)',
          '最小风机档位'
        ],
        labels: [
          {
            key: 'fan',
            lists: [
              {
                key: 'destTemp',
                controlsPositionRight: 'right',
                precision: 1,
                step: 0.1,
                ...rulesService.limit_20_32
              },
              {
                key: 'destHumi',
                controlsPositionRight: 'right',
                ...rulesService.limit_50_80
              },
              {
                key: 'partDestTemp',
                controlsPositionRight: 'right',
                ...rulesService.limit_20_35
              },
              {
                key: 'minGear',
                controlsPositionRight: 'right',
                ...rulesService.limit_1_6
              }
            ]
          }
        ]
      },

      // 暖灯
      heatLamp: {
        sendShow: false,
        fieldList: {
          disabled: false,
          head: {
            slot: true
          },
          destTemp: {
            title: '目标温度（单位: ℃）',
            key: 'destTemp',
            ...rulesService.limit_20_35
          }
        }

      },

      warmLight: {
        sendShow: false,
        disabled: false,
        titles: ['开启温度（0.1°C）', '关闭温度（0.1°C）'],
        labels: [
          {
            label: '伴热带',
            key: 'heatBelt',
            lists: [
              {
                key: 'openTemp',
                controlsPositionRight: 'right',
                precision: 1,
                step: 0.1,
                ...rulesService.limit__10_10
                // ...rulesService.verGreaterThan([-10, 10], '<', '必须小于伴热带关闭温度!', this, 'temperatureControlConfig', 'heatBelt', 'closeTemp')
              },
              {
                key: 'closeTemp',
                controlsPositionRight: 'right',
                precision: 1,
                step: 0.1,
                ...rulesService.limit__10_10
                // ...rulesService.verGreaterThan([-10, 10], '>', '必须大于伴热带开启温度!', this, 'temperatureControlConfig', 'heatBelt', 'openTemp')
              }
            ]
          }
        ]
      },

      // 降温设备
      coolingEquipment: {
        sendShow: false,
        disabled: false,
        titles: [
          '开启时长（秒）',
          '关闭时长（分）',
          '工作模式'
        ],
        labels: [
          {
            isShow: true,
            label: '喷淋',
            key: 'shower',
            lists: [
              {
                key: 'openDuration',
                type: 'inputNumber',
                controlsPositionRight: 'right',
                ...rulesService.limit_3_60
              },
              {
                key: 'closeDuration',
                type: 'inputNumber',
                controlsPositionRight: 'right',
                ...rulesService.limit_2_60
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
            isShow: true,
            label: '雾化盘',
            key: 'humidifying',
            lists: [
              {
                key: 'openDuration',
                type: 'inputNumber',
                controlsPositionRight: 'right',
                ...rulesService.limit_3_120
              },
              {
                key: 'closeDuration',
                type: 'inputNumber',
                controlsPositionRight: 'right',
                ...rulesService.limit_5_100
              },
              {
                // key: 'staticMode',
                // type: 'select',
                // option: [
                //   { label: '静态', value: true },
                //   { label: '动态', value: false }
                // ]
              }
            ]
          }
        ]
      },

      // 设置报警
      alarmConfig: {
        sendShow: false,
        data: {
          // tempHighAlarm: '',
          // tempLowAlarm: '',
          // tempDiffAlarm: '',
          // highHumiAlarm: '',
          disnetMask: ''
        },
        fieldList: {
          disabled: false,
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
              ...rulesService.limit__40_60
            },
            {
              title: '低温报警值（°C）',
              key: 'tempLowAlarm',
              type: 'inputNumber',
              precision: 1,
              step: 0.1,
              controlsPositionRight: 'right',
              ...rulesService.limit__40_60
            },
            {
              title: '差温报警值（°C）',
              key: 'tempDiffAlarm',
              type: 'inputNumber',
              precision: 1,
              step: 0.1,
              controlsPositionRight: 'right',
              ...rulesService.limit__40_60
            },
            {
              title: '高湿度报警值（%）',
              key: 'highHumiAlarm',
              type: 'inputNumber',
              precision: 1,
              step: 0.1,
              controlsPositionRight: 'right',
              ...rulesService.limit_75_95
            },
            {
              title: '断网报警',
              key: 'disnetMask',
              type: 'radio',
              optList: [
                { label: '启用', value: false },
                { label: '屏蔽', value: true }
              ]
              // handleChange(val) {
              //   console.log('change的值', val)
              // }
            }

          ]
        }
      },
      // 设置设备
      equipmentConfig: {
        sendShow: false,
        data: {
          lockParam: '',
          fanConfig: {
            // exchangeInstall: '',
            // exchangeLowPercent: '',
            // fixedFanCount: '',
            // gutterInstall: '',
            // gutterLowPercent: '',
            // gutterOpenTime: '',
            // vfdInstall: ''
          }
          // reportPeriod: ''
        },
        fieldList: {
          disabled: false,
          head: {
            slot: true
          },
          radioList: {
            label: '参数锁定（喷淋、风机）',
            key: 'lockParam',
            type: 'radio',
            optList: [
              { label: '锁定', value: true },
              { label: '不锁定', value: false }
            ]
          },
          reportPeriod: {
            label: '设备上报周期（秒）',
            key: 'reportPeriod',
            ...rulesService.limit_10_3600
          },
          fanConfig: [
            {
              label: '地沟风机安装数量',
              key: 'gutterInstall',
              ...rulesService.limit_0_2
            },
            // {
            //   label: '地沟风机最小转速',
            //   key: 'gutterLowPercent',
            //   min: 5,
            //   max: 100,
            //   ...rulesService.limit_5_100
            // },
            {
              label: '热交换风机安装数量',
              key: 'exchangeInstall',
              ...rulesService.limit_0_2
            },
            // {
            //   label: '热交换最小转速',
            //   key: 'exchangeLowPercent',
            //   min: 5,
            //   max: 100,
            //   ...rulesService.limit_5_100
            // },
            {
              label: '定速风机安装数量',
              key: 'fixedFanCount',
              ...rulesService.limit_0_5
            },
            // {
            //   label: '地沟间歇运行时长',
            //   key: 'gutterOpenTime',
            //   min: 1,
            //   max: 10,
            //   ...rulesService.limit_1_10
            // },
            {
              label: '端部变频安装数量',
              key: 'vfdInstall',
              ...rulesService.limit_0_3
            }
          ]
        }
      },

      // 设置工作
      workModeConfig: {
        sendShow: false,
        data: {
          workMode: ''
        },
        fieldList: {
          disabled: false,
          workMode: {
            optList: [
              { label: '饲养', value: 1 },
              { label: '空圈', value: 2, disabled: true, class: 'overview-radio-disabled' },
              { label: '刷圈', value: 3, disabled: true, class: 'overview-radio-disabled' },
              { label: '升温', value: 4 },
              { label: '接猪', value: 5 },
              { label: '出猪', value: 6 },
              { label: '应急', value: 7, disabled: true, class: 'overview-radio-disabled' }
            ]
          }
        }
      },

      // 设置单元
      unitConfig: {
        sendShow: false,
        data: {
          pigGestationTimes: 1,
          piggeryType: '',
          isBind: 1,
          pigCount: '',
          pigAge: '',
          unitName: 1,
          weight: 1
        },
        fieldList: {
          disabled: false,
          head: {
            slot: true
          },
          body: [
            {
              title: '猪舍类型',
              key: 'piggeryType',
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
                  this.unitConfig.fieldList.body[2].label = '仔猪日龄(0-600天)'
                  this.unitConfig.fieldList.body[5].label = '单猪体重(0-300KG)'
                  this.unitConfig.fieldList.body[4].isShow = false
                  this.unitConfig.fieldList.body[5].isShow = false
                } else if (val === 5) {
                  this.unitConfig.fieldList.body[2].label = '母猪孕龄(0-600天)'
                  this.unitConfig.fieldList.body[5].label = '母猪体重(0-300KG)'
                  this.unitConfig.fieldList.body[4].isShow = false
                  this.unitConfig.fieldList.body[5].isShow = false
                } else if (val === 6) {
                  this.unitConfig.fieldList.body[2].label = '猪日龄(0-600天)'
                  this.unitConfig.fieldList.body[5].label = '单猪体重(0-300KG)'
                  this.unitConfig.fieldList.body[4].isShow = true
                  this.unitConfig.fieldList.body[5].isShow = false
                } else if (val === 8) {
                  this.unitConfig.fieldList.body[2].label = '猪日龄(0-600天)'
                  this.unitConfig.fieldList.body[5].label = '单猪体重(0-300KG)'
                  this.unitConfig.fieldList.body[4].isShow = true
                  this.unitConfig.fieldList.body[5].isShow = false
                } else {
                  this.unitConfig.fieldList.body[2].label = '猪日龄(0-600天)'
                  this.unitConfig.fieldList.body[5].label = '单猪体重(0-300KG)'
                  this.unitConfig.fieldList.body[4].isShow = true
                  this.unitConfig.fieldList.body[5].isShow = false
                }
              }
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
              key: 'pigAge',
              type: 'inputNumber',
              isShow: false,
              controlsPositionRight: 'right',
              ...rulesService.limit_0_600
            },
            {
              label: '单元编号(0-800)',
              key: 'unitName',
              type: 'inputNumber',
              isShow: false,
              controlsPositionRight: 'right',
              ...rulesService.limit_0_800
            },
            {
              label: '母猪胎次(0-100)',
              key: 'pigGestationTimes',
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
          entrys: [{ openTime: '08:00:00', openDuration: '0' }]
        },
        fieldList: {
          disabled: false,
          entrys: []
        }
      },
      // 设置温湿度传感器
      sensorConfigs: {
        sendShow: false,
        disabled: false,
        titles: [
          '是否开启温湿度探头',
          '温度传感器校准值(℃)',
          '湿度传感器校准值(%)',
          '蓝牙探头MAC地址'
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
                key: 'temperature',
                type: 'inputNumber',
                controlsPositionRight: 'right',
                precision: 1,
                step: 0.1,
                ...rulesService.limit__40_60
              },
              {
                key: 'humidity',
                type: 'inputNumber',
                controlsPositionRight: 'right',
                ...rulesService.limit_0_100
              },
              {
                key: 'bleMac',
                type: 'input',
                ...rulesService.limit_mac_address_v3
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
                key: 'temperature',
                type: 'inputNumber',
                controlsPositionRight: 'right',
                precision: 1,
                step: 0.1,
                ...rulesService.limit__40_60
              },
              {
                key: 'humidity',
                type: 'inputNumber',
                controlsPositionRight: 'right',
                ...rulesService.limit_0_100
              },
              {
                key: 'bleMac',
                type: 'input',
                ...rulesService.limit_mac_address_v3
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
                key: 'temperature',
                type: 'inputNumber',
                controlsPositionRight: 'right',
                precision: 1,
                step: 0.1,
                ...rulesService.limit__40_60
              },
              {
                key: 'humidity',
                type: 'inputNumber',
                controlsPositionRight: 'right',
                ...rulesService.limit_0_100
              },
              {
                key: 'bleMac',
                type: 'input',
                ...rulesService.limit_mac_address_v3
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
                key: 'temperature',
                type: 'inputNumber',
                controlsPositionRight: 'right',
                precision: 1,
                step: 0.1,
                ...rulesService.limit__40_60
              },
              {
                key: 'humidity',
                type: 'inputNumber',
                controlsPositionRight: 'right',
                ...rulesService.limit_0_100
              },
              {
                key: 'bleMac',
                type: 'input',
                ...rulesService.limit_mac_address_v3
              }
            ]
          }
        ]
      },

      // 设置上报周期
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
              controlsPositionRight: 'right',
              ...rulesService.limit_10_3600
            }
          ]
        }
      },

      // 设置风口参数
      windowConfig: {
        sendShow: false,
        disabled: false,
        data: {
          // airInlets: [{ mode: 1, percent: 100 }],
          // airOutlets: [{ mode: 1, percent: 100 }]
          airInlets: [{ }],
          airOutlets: [{ }]
        },
        fieldList: [
          {
            title: '进风口工作模式',
            titleColor: '#6e83be',
            mark: 'airInlets',
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
            mark: 'airInlets',
            key: 'percent',
            ...rulesService.limit_0_100_arr
          },
          {
            title: '出风口工作模式',
            titleColor: '#6e83be',
            mark: 'airOutlets',
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
            mark: 'airOutlets',
            key: 'percent',
            ...rulesService.limit_0_100_arr
          }
        ]
      }
    }
  },
  watch: {
    // unitId(newValue, oldValue) {
    //   this.initMyDeviceArgsTemplate()
    //   // console.log('监听的单元切换', newValue, oldValue, this.overviewDetail.overview.deviceId)
    // }
  },
  mounted() {
    // this.IntelligentControl = this.$store.state.IntelligentControl
    this.IntelligentControl = JSON.parse(sessionStorage.getItem('multiUnitSetting'))
    console.log('this.IntelligentControl', this.IntelligentControl)
    // console.log('this.overviewDetail.overview.roomTypeId', this.overviewDetail.overview.roomTypeId)
    // this.initMyDeviceArgsTemplate()
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
          case 3:
            this.unitConfig.fieldList.body[4].isShow = false
            break
          case 4:
            this.unitConfig.fieldList.body[4].isShow = false
            this.unitConfig.fieldList.body[5].isShow = false
            break
          case 5:
            this.unitConfig.fieldList.body[5].isShow = false
            break
          case 7:
            this.unitConfig.fieldList.body[5].isShow = false
            break
        }
      }
    },
    subUnitConfig(data, type) {
      switch (type) {
        case 3:
          delete data.weight
          return data
          // break
        case 4:
          return data
        case 5:
          delete data.batchNo
          return data
        case 7:
          delete data.batchNo
          return data
        default:
          delete data.weight
          delete data.batchNo
          return data
          // break
      }
    },
    close() {
      this.dialogDtatus = false
    },
    parameterSetting() {
      window.history.go(-1)
      // console.log('获取的父组件内容', this.overviewDetail)
      // this.overviewDetail.progress = 'parameterSetting'
    },

    changePicker(event) {
      console.log('选择的时间', event, this.lightConfig.data.entrys)
    },
    initMyDeviceArgsTemplate() {
      const params = {
        deviceVersionId: this.IntelligentControl.deviceVersionId,
        limit: 1000,
        page: 1,
        status: 'AUDITED'
      }
      myDeviceArgsTemplate(params).then((res) => {
        console.log('初始化模板返回的内容', res)
        // this.templateLists = res.data.rows
        if (res.data.rows.length > 0) {
          this.templateLists = getFilterTemplate(res.data.rows, this.IntelligentControl.roomTypeId)
        } else {
          this.templateLists = []
        }
      })
    },
    initArgsInfoData() {
      this.temperatureControlConfig = {
        exchange: {
          openTemp: '',
          diffTemp: '',
          baseSpeed: '',
          closeTemp: '',
          openDuration: ''
        },
        gutter: {
          openTemp: '',
          diffTemp: '',
          baseSpeed: '',
          closeTemp: '',
          openDuration: ''
        },
        fixedFan: [{ openTemp: '', closeTemp: '' }],
        endFan: [
          {
            baseFreq: '',
            diffTemp: '',
            lockFreq: '',
            openTemp: ''
          }
        ],
        heatLamp: {
          closeTemp: '',
          openTemp: ''
        },
        heatBelt: {
          closeTemp: '',
          openTemp: ''
        },
        g2Humidifying: {
          closeDuration: '',
          openDuration: '',
          openTemp: '',
          staticMode: ''
        },
        shower: {
          closeDuration: '',
          openDuration: '',
          openTemp: '',
          staticMode: ''
        }
      }
      this.alarmConfig.data = {
        high: '',
        low: '',
        delta: '',
        disconnectedNetMask: '',
        gutterFanMask: '',
        heatExchangeFanMask: '',
        feedMask: '',
        showerMask: ''
      }
      this.equipmentConfig.data = {
        lockParam: '',
        fixSpeedFanAmount: '',
        indoorBeforeProbe: {},
        indoorAfterProbe: {},
        heatLampProbe: {}
      }
      this.workModeConfig.data = {
        workMode: '',
        manualTemp: ''
      }
      this.unitConfig.data = {
        batchNo: '',
        hoggeryType: '',
        isBind: 1,
        pigCount: '',
        pigDays: '',
        unitNo: 1,
        weight: ''
      }
      this.lightConfig.data.entrys = [{ openTime: '', closeTime: '' }]
      this.sensorConfig = {
        heatLamp: {
          enable: true,
          humiCalibrationValue: 0,
          tempCalibrationValue: 1
        },
        indoorAfter: {
          enable: true,
          humiCalibrationValue: 0,
          tempCalibrationValue: 1
        },
        indoorBefore: {
          enable: true,
          humiCalibrationValue: 0,
          tempCalibrationValue: 1
        },
        outDoor: {
          enable: true,
          humiCalibrationValue: 0,
          tempCalibrationValue: 1
        }
      }
      this.setEscalationPeriod.data.statusReportPeriod = 0
      this.windowConfig.data = {
        airInletConfigList: [{ mode: 1, percent: 100 }],
        airOutletConfigList: [{ mode: 1, percent: 100 }]
      }
    },

    // currentTemplate(item) {
    //   const argsJson = JSON.parse(item.argsJson)
    //   this.template = item.name
    //   this.temperatureControlConfig = argsJson.temperatureControlConfig
    //   const exchange = this.temperatureControlConfig.exchange
    //   const gutter = this.temperatureControlConfig.gutter
    //   const g2Humidifying = this.temperatureControlConfig.g2Humidifying
    //   const shower = this.temperatureControlConfig.shower
    //   exchange.openDuration = exchange.openDuration / 60
    //   gutter.openDuration = gutter.openDuration / 60
    //   g2Humidifying.closeDuration = g2Humidifying.closeDuration / 60
    //   shower.closeDuration = shower.closeDuration / 60
    //   this.alarmConfig.data = argsJson.alarmConfig
    //   this.equipmentConfig.data = argsJson.equipmentConfig
    //   this.workModeConfig.data = argsJson.workModeConfig
    //   this.unitConfig.data = argsJson.unitConfig
    //   this.lightConfig.data.entrys = argsJson.lightConfig.entrys
    //   this.sensorConfig = argsJson.sensorConfig
    //   this.setEscalationPeriod.data.statusReportPeriod =
    //     argsJson.statusReportPeriod
    //   this.windowConfig.data = argsJson.windowConfig
    //   this.dialogDtatus = false
    //   this.focusCurrent = item.id
    //   console.log('当前选择的模板', item, argsJson)
    // },
    addTime() {
      const entrys = this.lightConfig.data.entrys
      if (entrys.length >= 8) {
        return
      } else {
        // const obj = { openTime: '', closeTime: '' }
        const obj = { openTime: '08:00:00', closeTime: '12:00:00' }
        this.lightConfig.data.entrys = [...entrys, obj]
      }
      console.log('时间添加事件', entrys)
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
    deleteTime(index) {
      console.log('删除元素的索引', index, this.lightConfig.data.entrys)
      this.lightConfig.data.entrys.splice(index, 1)
    },
    deleteFeedTime(index) {
      console.log('删除元素的索引', index, this.feedConfig.data.entrys)
      this.feedConfig.data.entrys.splice(index, 1)
    },
    currentTemplate(item) {
      console.log('获取的模板数据', JSON.parse(item.argsJson))
      const argsJson = JSON.parse(item.argsJson)
      this.template = item.name
      console.log('lodash数据处理', this._.merge(this.temperatureControlConfig, argsJson.temperatureControlConfig))
      console.log('处理后的数据', this.temperatureControlConfig)
      // this.temperatureControlConfig = argsJson.temperatureControlConfig
      // this.initArgsInfoData()
      this._.merge(this.temperatureControlConfig, argsJson.temperatureControlConfig)
      const exchange = this.temperatureControlConfig.exchange
      const gutter = this.temperatureControlConfig.gutter
      // const g2Humidifying = this.temperatureControlConfig.g2Humidifying = {
      //   closeDuration: '',
      //   openDuration: '',
      //   openTemp: '',
      //   staticMode: ''
      // }
      const shower = this.temperatureControlConfig.shower
      exchange.openDuration = exchange.openDuration / 60
      gutter.openDuration = gutter.openDuration / 60
      // g2Humidifying.closeDuration = g2Humidifying.closeDuration / 60
      shower.closeDuration = shower.closeDuration / 60
      // this.alarmConfig.data = argsJson.alarmConfig
      this._.merge(this.alarmConfig.data, argsJson.alarmConfig)
      // this.equipmentConfig.data = argsJson.equipmentConfig
      // this._.merge(this.equipmentConfig.data, argsJson.equipmentConfig)

      // ********** 模板回显分割 *****************
      // this.workModeConfig.data = argsJson.workModeConfig
      // this.unitConfig.data = argsJson.unitConfig
      // this.lightConfig.data.entrys = argsJson.lightConfig.entrys
      // this.sensorConfig = argsJson.sensorConfig
      // this.setEscalationPeriod.data.statusReportPeriod =
      //    argsJson.statusReportPeriod
      // this.windowConfig.data = argsJson.windowConfig

      this.dialogDtatus = false
      this.focusCurrent = item.id
      console.log('当前选择的模板', argsJson)
      // var a = { b: { x: 1, z: 3 }}
      // var b = { b: { x: 1, y: 2 }}
    },
    record() {
      this.$router.push({
        name: 'orderHistory',
        query: {
          fieldId: this.IntelligentControl.fieldId
        }
      })
    },
    singleUnit() {
      const type = []
      // // 定速风机
      // this.checkedProgress.indexOf('constantSpeed') !== -1 ? this.$refs.constantSpeed.validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
      // // 变频风机
      // this.checkedProgress.indexOf('variableFrequency') !== -1 ? this.$refs.variableFrequency.validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
      this.checkedProgress.indexOf('aimTemperatureHumidity') !== -1 ? this.$refs.aimTemperatureHumidity.validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
      // 暖灯伴热
      this.checkedProgress.indexOf('warmLight') !== -1 ? this.$refs.warmLight.validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
      // 降温设备
      this.checkedProgress.indexOf('coolingEquipment') !== -1 ? this.$refs.coolingEquipment.validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
      // 报警参数
      this.checkedProgress.indexOf('alarmConfig') !== -1 ? this.$refs.alarmConfig.$refs[`overviewBoxForm`].validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
      // 设备参数
      this.checkedProgress.indexOf('equipmentConfig') !== -1 ? this.$refs.equipmentConfig.validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
      // 工作模式
      // 单元参数
      // this.checkedProgress.indexOf('unitConfig') !== -1 ? this.$refs.unitConfig.$refs[`overviewBoxForm`].validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
      // 照明开启

      // this.checkedProgress.indexOf('heatLamp') !== -1 ? this.$refs.heatLamp.validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
      // 温湿度传感器
      // this.checkedProgress.indexOf('sensorConfig') !== -1 ? this.$refs.sensorConfig.validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
      // 上报周期
      // this.checkedProgress.indexOf('setEscalationPeriod') !== -1 ? this.$refs.setEscalationPeriod.$refs[`overviewBoxForm`].validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
      // 饲喂开启
      this.checkedProgress.indexOf('feedConfig') !== -1 ? this.$refs.feedConfig.validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
      // 风口参数
      this.checkedProgress.indexOf('windowConfig') !== -1 ? this.$refs.windowConfig.validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
      let next = true
      // 照明开启
      this.lightConfig.data.entrys.forEach((item) => {
        // console.log('遍历的内容', item)
        if (item.closeTime == null || item.openTime == null) {
          next = false
          // this.lightConfigLoading = false
          // console.log('获取的this指向', this)
          // return this.$message.error('时间不能为空')
        }
      })
      if (this.checkedProgress.length > 0) {
        if (this.checkedProgress.indexOf('lightConfig') !== -1) {
          if (!next) {
            return this.$message.error('时间不能为空')
          }
        }
        if (type.indexOf(1) !== -1) {
          this.$message.error('参数错误，请根据提示，填写正确的参数')
          return
        }
      } else {
        this.$message.error('您未选择任何指令,请至少勾选一条指令!')
        return
      }
      // if (this.overviewDetail.overview && this.overviewDetail.overview.statusOnline !== 0) {
      const temperatureControlConfig = JSON.parse(
        JSON.stringify(this.temperatureControlConfig)
      )
      // const exchange = temperatureControlConfig.exchange
      // const gutter = temperatureControlConfig.gutter
      const g2Humidifying = temperatureControlConfig.humidifying
      const shower = temperatureControlConfig.shower
      // const waterCurtain = temperatureControlConfig.waterCurtain
      // exchange.openDuration = exchange.openDuration * 60
      // gutter.openDuration = gutter.openDuration * 60
      g2Humidifying.closeDuration = g2Humidifying.closeDuration * 60
      shower.closeDuration = shower.closeDuration * 60
      // waterCurtain.closeDuration = waterCurtain.closeDuration * 60
      // const params = {
      //   deviceId: this.overviewDetail.overview.deviceId,
      //   deviceName: this.overviewDetail.overview.deviceName
      // }
      let data = {}
      if (this.checkedProgress.includes('warmLight') || this.checkedProgress.includes('coolingEquipment') || this.checkedProgress.includes('heatLamp') || this.checkedProgress.includes('aimTemperatureHumidity') || this.checkedProgress.includes('workModeConfig')) {
        data = {
          workConfig: {}
          // temperatureControlConfig: {
          //   ceilingFan: temperatureControlConfig.ceilingFan
          // }
          // alarmConfig: this.alarmConfig.data,
          // equipmentConfig: this.equipmentConfig.data,
          // workModeConfig: this.workModeConfig.data,
          // unitConfig: this.unitConfig.data,
          // lightConfig: this.lightConfig.data,
          // sensorConfig: this.sensorConfig,
          // statusReportPeriod: this.setEscalationPeriod.data.statusReportPeriod,
          // windowConfig: this.windowConfig.data
        }
      } else {
        data = {}
      }

      // const data = {
      //   workConfig: {}
      //   // temperatureControlConfig: {
      //   //   ceilingFan: temperatureControlConfig.ceilingFan
      //   // }
      //   // alarmConfig: this.alarmConfig.data,
      //   // equipmentConfig: this.equipmentConfig.data,
      //   // workModeConfig: this.workModeConfig.data,
      //   // unitConfig: this.unitConfig.data,
      //   // lightConfig: this.lightConfig.data,
      //   // sensorConfig: this.sensorConfig,
      //   // statusReportPeriod: this.setEscalationPeriod.data.statusReportPeriod,
      //   // windowConfig: this.windowConfig.data
      // }
      // if (this.checkedProgress.indexOf('alarmConfig') === -1 || this.checkedProgress.indexOf('alarmConfig') === -1 || this.checkedProgress.indexOf('alarmConfig') === -1 || this.checkedProgress.indexOf('alarmConfig') === -1 || this.checkedProgress.indexOf('alarmConfig') === -1) {
      //   delete data['temperatureControlConfig']
      // }
      this.checkedProgress.map(item => {
        if (item === 'constantSpeed') {
          // data.temperatureControlConfig = {}
          data['temperatureControlConfig']['fixedFan'] = temperatureControlConfig.fixedFan
        } else if (item === 'warmLight') {
          // data.temperatureControlConfig = {}
          // data['temperatureControlConfig']['heatLamp'] = temperatureControlConfig.heatLamp
          data['workConfig']['heatBelt'] = temperatureControlConfig.heatBelt
        } else if (item === 'coolingEquipment') {
          // data.temperatureControlConfig = {}
          delete temperatureControlConfig.shower.openTemp
          delete temperatureControlConfig.humidifying.openHumi
          data['workConfig']['shower'] = temperatureControlConfig.shower
          data['workConfig']['humidifying'] = temperatureControlConfig.humidifying
        } else if (item === 'heatLamp') {
          data['workConfig']['heatLamp'] = temperatureControlConfig.heatLamp
        } else if (item === 'alarmConfig') {
          data['alarmConfig'] = this.alarmConfig.data
        } else if (item === 'aimTemperatureHumidity') {
          data['workConfig']['fan'] = {
            destHumi: this.aimTemperatureHumidity.destHumi,
            minGear: this.aimTemperatureHumidity.minGear,
            destTemp: this.aimTemperatureHumidity.destTemp

          }
          data['workConfig']['heatLamp'] = { destTemp: this.aimTemperatureHumidity.partDestTemp }
        } else if (item === 'equipmentConfig') {
          data['deviceConfig'] = JSON.parse(JSON.stringify(this.equipmentConfig.data))
          delete data['deviceConfig'].binding
        } else if (item === 'workModeConfig') {
          data['workConfig']['workMode'] = this.workModeConfig.data.workMode
        } else if (item === 'unitConfig') {
          data['piggeryConfig'] = this.unitConfig.data
          data['piggeryConfig'].binding = 1
          delete data['piggeryConfig'].piggeryTypeInfo
          this.subUnitConfig(data['piggeryConfig'], this.unitConfig.data.piggeryType)
          // console.log('提交的单元参数设置', this.subUnitConfig(data['unitConfig'], this.unitConfig.data.piggeryType))
        } else if (item === 'lightConfig') {
          data['lightConfig'] = this.lightConfig.data
        } else if (item === 'feedConfig') {
          data['feedConfig'] = this.feedConfig.data
        } else if (item === 'sensorConfig') {
          console.log('设备参数设置', this.sensorConfig)
          data['sensorConfig'] = this.sensorConfig
        } else if (item === 'windowConfig') {
          data['windowConfig'] = this.windowConfig.data
        }
      })
      console.log(data, this.sensorConfig)
      data = {
        config: data,
        deviceNames: this.IntelligentControl.deviceNames,
        fieldId: this.IntelligentControl.fieldId,
        fieldName: this.IntelligentControl.fieldName,
        unitNames: this.IntelligentControl.unitNames
      }
      this.loading = true
      this.singleUnitLoading = true
      putMultiUnit(data).then((res) => {
        console.log('提交返回的内容', res)
        this.loading = false
        this.singleUnitLoading = false
        if (res.rel) {
          // this.$message.success({ message: '指令下发成功' })
          this.$confirm('您的指令下发任务已提交成功', '提示', {
            confirmButtonText: '下发记录',
            confirmButtonClass: 'btn-blue btn-blue-confirm',
            cancelButtonText: '返回',
            cancelButtonClass: 'btn-border',
            type: 'success'
          }).then(() => {
            console.log('下发记录的操作', this.IntelligentControl.fieldId)
            this.$router.push({
              name: 'orderHistory',
              query: {
                fieldId: this.IntelligentControl.fieldId
              }
            })
            // unreview({
            //   ids: ids
            // }).then((data) => {
            //   if (data.status === 200) {
            //     this.$message({
            //       message: '反审核成功',
            //       type: 'success'
            //     })
            //     this.selection = []
            //     this.unAuditarr = []
            //     this.auditarr = []
            //     this.getMyEvcMcuInfo()
            //   }
            // })
          })
        } else {
          this.$message.error({ message: res.message })
        }
      }).catch(() => {
        this.loading = false
        this.singleUnitLoading = false
      })
      // } else {
      //   this.$message.error('当前设备已离线!')
      // }
    }
  }
}
</script>
<style lang="scss">
.multi-unit-setting-v4{
.el-checkbox__inner {
    border: 1px solid #227fe6;
    background: #001b3f;
}
}

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
.multi-unit-setting-v4 {
   .overview-box {
      // background: #27376f
      @include background('comfortBackGround');
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
      // @include font_color('mainFontColor2');
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

.multi-unit-setting-v4{
  @include background('multiUnitBackGround3');
  .el-form-item__error{
    top: 43px;
  }
  .overview-box{
    .el-form-item__error{
      top: 78px;
    }
    .form-body {
      .el-form-item__error{
        top: 42px;
      }
    }
    .form-item-row{
      .el-form-item__error{
        top: 40px;
      }
    }
  }
  .light-config{
    .el-form-item__error{
      top: 42px;
    }
  }
  .overview-box .el-form-item{
    margin-bottom: 20px;
  }
  .overview-box-bottom{
    .el-form-item__error{
      top: 40px;
    }
  }
}
</style>
<style lang="scss" scoped>
.multi-unit-setting-v4 {
  .dialog-body {
    min-width: 30%;
    min-height: 30%;
    height: 400px;
  }
  .dialog-hidden {
    display: none;
  }
  .dialog-container {
    padding: 20px;
    // width: 30%;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    height: 350px;
    overflow-y: scroll;
    align-items: flex-start;
    align-content: flex-start;
    // justify-content: space-between;
    &::-webkit-scrollbar {
      display: none;
    }
    .focus-list {
      // width: 100%;
      margin-bottom: 20px;
    }
  }
  .focus-list {
    display: flex;
    height: 36px;
    align-items: center;
    font-size: 12px;
    // color: #cdd8f7;
    @include font_color('mainFontColor11');
  }
  .focus-txt {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #2d3e70;
    // border: 1px solid #20a4fc;
    border-radius: 2px;
    font-size: 14px;
    // color: #cdd8f7;
    @include font_color('mainFontColor11');
    // width: 100px;
    height: 36px;
    padding: 10px;
    margin-right: 15px;
  }
  .focus-txt-current {
    border: 1px solid #20a4fc;
    color: #20a4fc;
  }
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
  padding-left: 5px;
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
      color: #fff;
      // @include font_color('mainFontColor2');
      background-image: linear-gradient(180deg, #0090E7 0%, #0090E7 100%);
    }
  }
}
.allcheckContent {
  padding-left: 5px;
  // color: #cdd8f7;
  @include font_color('mainFontColor11');
  margin-bottom: 10px;
}
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  .parameter-template {
    display: flex;
    // color: #cdd8f7;
    @include font_color('mainFontColor11');
    padding-left: 5px;
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
  border: 1px solid transparent;
  // overflow: scroll;
  // &::-webkit-scrollbar {
  //   display: none;
  // }
}
.main {
  padding-left: 10px;
  display: flex;
  flex-wrap: wrap;
  // min-width: 1680px;
}
.overview-box {
  // height: 418px;
  margin-bottom: 20px;
  // margin-right: 20px;
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
    margin-bottom: 0;
  }
  .box-body {
    font-size: 12px;
    padding: 10px 20px;
    .form-title {
      .title {
        // color: #6e83be;
        @include font_color('viewFontColor3');
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
.work-mode-config .overview-radio-disabled{
  // background: #1d2c4c;
  color: #adadad;
  cursor: not-allowed;
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
.add-time{
  margin-top: 10px;
}
</style>
