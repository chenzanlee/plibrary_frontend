<template>
  <!-- 多功能编辑模块 -->
  <div class="multi-function-setting-v3">
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
        <el-button class="btn-red" @click="parameterSetting()">退出编辑</el-button>
      </div>
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
        <!-- 单元 -->
        <el-row style="height:100%;padding-right:0" :gutter="10" class="row-box">
          <overview-box-unit
            ref="unitConfig"
            style="height:100%"
            class="unit-config"
            :data="unitConfig.data"
            :field-list="unitConfig.fieldList"
          >
            <template v-slot:head>
              <div class="title">
                <el-checkbox label="unitConfig">单元</el-checkbox>
              </div>
            </template>
          </overview-box-unit>
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
          <el-col class="col-box" :span="12" style="padding-left: 5px; padding-right: 0px!important;">
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
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                </el-form>
              </div>
            </div>
          </el-col>
          <!-- <el-col :span="8" style="height:100%">
            <overview-box
              ref="unitConfig"
              style="height:100%"
              class="overview-box unit-config"
              :data="unitConfig.data"
              :field-list="unitConfig.fieldList"
            >
              <template v-slot:head>
                <div class="title">
                  <el-checkbox label="unitConfig">单元</el-checkbox>
                </div>
              </template>
            </overview-box>
          </el-col> -->
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

        <el-row :gutter="10" class="row-box">
          <div class=" flex-grow-2" style="margin-bottom:0">
            <div class="overview-panel" style="height: 100%;">
              <el-form ref="sensorConfig" :model="sensorConfig">
                <div class="box-head">
                  <div class="title">
                    <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->

                    <el-checkbox label="sensorConfig">温湿度传感器</el-checkbox>
                  </div>
                </div>

                <div class="box-body">
                  <el-row class="form-title" :gutter="10">
                    <el-col :span="4" style="color:rgba(0,0,0,0)">1</el-col>
                    <el-col
                      v-for="(item, index) in sensorConfigs.titles"
                      :key="index"
                      class="title"
                      :span="20 / sensorConfigs.titles.length"
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
                    <el-col :span="4" style="padding-top:10px">{{ item.label }}</el-col>
                    <el-col
                      v-for="(childItem, index) in item.lists"
                      :key="index"
                      class="col-box"
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
                        <el-input-number
                          v-if="childItem.type === 'inputNumber'"
                          v-model="sensorConfig[item.key][childItem.key]"
                          :disabled="sensorConfigs.disabled"
                          :precision="childItem.precision"
                          :step="childItem.step"
                          :controls-position="childItem.controlsPositionRight"
                          :size="childItem.size"
                        />
                        <el-input
                          v-if="childItem.type === 'input'"
                          v-model="sensorConfig[item.key][childItem.key]"
                          :disabled="sensorConfigs.disabled"
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
        </el-row>
      </div>
    </el-checkbox-group>
  </div>
</template>

<script>
import {
  ArgsInfo,
  ArgsInfoV3,
  singleUnit,
  myDeviceArgsTemplate
} from '@/http/api/fieldDeviceOverviewV3'
// import OverviewBox from '@/views/IntelligentControl/fieldDeviceOverview/common/components/OverviewBox'
import OverviewBoxAlarm from '@/views/IntelligentControl/fieldDeviceOverview/common/components/OverviewBox/indexAlram'
import OverviewBoxUnit from '@/views/IntelligentControl/fieldDeviceOverview/common/components/OverviewBox/indexUnit'
// import generalForm from '@/components/commonComponent/generalForm'
import jsontype from './config/formJson.json'
import getFilterTemplate from './config/templateFilter.js'
import rulesService from './utils/verification'
export default {
  components: {
    // OverviewBox,
    OverviewBoxAlarm,
    OverviewBoxUnit
    // generalForm
  },
  inject: ['overviewDetail'],
  props: {
    unitId: String
  },
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
          destTemp: ''
        },
        heatBelt: {
          closeTemp: '',
          openTemp: ''
        },
        humidifying: {
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
        },
        waterCurtain: {
          closeDuration: '',
          openDuration: '',
          openTemp: '',
          staticMode: ''
        }
      },

      aimTemperatureHumidity: {
        destTemp: '',
        destHumi: '',
        partDestTemp: '',
        minGear: ''
      },
      sensorConfig: {
        heatLamp: {
          enable: true,
          humidity: 0,
          temperature: 1,
          bleMac: ''
        },
        indoorAfter: {
          enable: true,
          humidity: 0,
          temperature: 1,
          bleMac: ''
        },
        indoorBefore: {
          enable: true,
          humidity: 0,
          temperature: 1,
          bleMac: ''
        },
        outDoor: {
          enable: true,
          humidity: 0,
          temperature: 1,
          bleMac: ''
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
          tempHighAlarm: '',
          tempLowAlarm: '',
          tempDiffAlarm: '',
          disnetMask: '',
          highHumiAlarm: ''
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
            exchangeInstall: '',
            exchangeLowPercent: '',
            fixedFanCount: '',
            gutterInstall: '',
            gutterLowPercent: '',
            gutterOpenTime: '',
            vfdInstall: ''
          },
          reportPeriod: ''
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
              key: 'piggeryType',
              type: 'radio',
              className: 'piggery-radio',
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
                  this.unitConfig.fieldList.body[5].label = '母猪体重(0-300KG)'
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
              className: 'unit-box-errorTip',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_1800
            },
            {
              label: '猪日龄(0-600天)',
              key: 'pigAge',
              type: 'inputNumber',
              isShow: false,
              className: 'unit-box-errorTip',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_600
            },
            {
              label: '单元编号(0-800)',
              key: 'unitName',
              type: 'inputNumber',
              isShow: false,
              className: 'unit-box-errorTip',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_800
            },
            {
              label: '母猪胎次(0-100)',
              key: 'pigGestationTimes',
              type: 'inputNumber',
              isShow: true,
              className: 'unit-box-errorTip',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_100
            },
            {
              label: '单猪体重(0-300KG)',
              key: 'weight',
              type: 'inputNumber',
              isShow: false,
              className: 'unit-box-errorTip',
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
          airInlets: [{ mode: 1, percent: 100 }],
          airOutlets: [{ mode: 1, percent: 100 }]
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
    //   if (this.overviewDetail.overview.segmentName === '公猪') {
    //     this.coolingEquipment.labels[2].isShow = true
    //   } else {
    //     this.coolingEquipment.labels[2].isShow = false
    //   }
    //   this.initData()
    //   // this.initMyDeviceArgsTemplate()
    //   // console.log('监听的单元切换', newValue, oldValue, this.overviewDetail.overview.deviceId)
    // }
  },
  mounted() {
    // this.IntelligentControl = this.$store.state.IntelligentControl
    // console.log('获取的状态管理数据', this.IntelligentControl)
    console.log('获取的猪舍信息', this.overviewDetail.overview)
    // this.ArgsInfo()
    // if (this.overviewDetail.overview.segmentName === '公猪') {
    //   this.coolingEquipment.labels[2].isShow = true
    // } else {
    //   this.coolingEquipment.labels[2].isShow = false
    // }
    this.initData()
    // this.initMyDeviceArgsTemplate()
  },
  methods: {
    initData() {
      this.loading = true
      this.ArgsInfo()
    },
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
        this.unitConfig.fieldList.body[5].isShow = false
        switch (type) {
          case 4:
            this.unitConfig.fieldList.body[2].label = '仔猪日龄(0-600天)'
            this.unitConfig.fieldList.body[4].isShow = false
            break
          case 5:
            this.unitConfig.fieldList.body[2].label = '母猪孕龄(0-600天)'
            this.unitConfig.fieldList.body[5].label = '母猪体重(0-300KG)'
            this.unitConfig.fieldList.body[4].isShow = false
            this.unitConfig.fieldList.body[5].isShow = false
            break
          case 6:
            this.unitConfig.fieldList.body[5].isShow = false
            break
          case 8:
            this.unitConfig.fieldList.body[5].isShow = false
            break
        }
      }
    },
    subUnitConfig(data, type) {
      switch (type) {
        case 4:
          // delete data.weight
          return data
          // break
        case 5:
          return data
        case 6:
          delete data.batchNo
          return data
        case 8:
          delete data.batchNo
          return data
        default:
          // delete data.weight
          delete data.batchNo
          return data
          // break
      }
    },
    close() {
      this.dialogDtatus = false
    },

    sensorTestingSub() {
      const params = {
        deviceId: this.overviewDetail.overview.deviceId,
        deviceName: this.overviewDetail.overview.deviceName
      }
      const data = { equipmentConfig: {
        lockParam: this.formInfo.data.lockParam,
        fixSpeedFanAmount: this.formInfo.data.fixSpeedFanAmount,
        heatLampProbe: { mac: this.formInfo.data.heatLampProbe_mac },
        indoorAfterProbe: { mac: this.formInfo.data.indoorAfterProbe_mac },
        indoorBeforeProbe: { mac: this.formInfo.data.indoorBeforeProbe_mac },
        testSamples: this.formInfo.testSamples
      }}
      this.dialogLoading = true
      singleUnit(params, data).then((res) => {
        console.log('提交返回的信息', res)
        this.dialogLoading = false
        if (res.rel) {
          this.dialogVisible = false
          if (res.data) {
            this.runtimeArgs(res.data.runtimeArgs)
          } else {
            this.viewIntervalFun()
          }
        } else {
          this.$message.error(res.message)
        }
      })
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
      }, 180000)
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

    changePicker(event) {
      console.log('选择的时间', event, this.lightConfig.data.entrys)
    },

    initMyDeviceArgsTemplate() {
      const params = {
        deviceVersionId: this.overviewDetail.overview.deviceVersionId,
        limit: 1000,
        page: 1,
        status: 'AUDITED'
      }
      myDeviceArgsTemplate(params).then((res) => {
        console.log('初始化模板返回的内容', res)
        if (res.data.rows.length > 0) {
          this.templateLists = getFilterTemplate(res.data.rows, this.overviewDetail.overview.roomTypeId)
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
        piggeryType: '',
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

    sensorTesting() {
      this.dialogVisible = true
      ArgsInfoV3({ deviceId: this.overviewDetail.overview.deviceId }).then(res => {
        this.ArgsInfoV3Data = res.data
        console.log('返回的设备参数设置的数据v3', res.data)
        this.formInfo.data.lockParam = res.data.equipmentConfig.lockParam
        this.formInfo.data.fixSpeedFanAmount = res.data.equipmentConfig.fixSpeedFanAmount
        this.formInfo.data.heatLampProbe_mac = res.data.equipmentConfig.heatLampProbe.mac
        this.formInfo.data.indoorAfterProbe_mac = res.data.equipmentConfig.indoorAfterProbe.mac
        this.formInfo.data.indoorBeforeProbe_mac = res.data.equipmentConfig.indoorBeforeProbe.mac
        this.formInfo.testSamples = [
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
          { mac: '' },
          { mac: '' }
        ]
        console.log(this.formInfo.testSamples)
        //           [this.formInfo.testSamples] = [res.data.equipmentConfig.testSamples]
      })
    },

    ArgsInfo() {
      ArgsInfo({ deviceId: this.overviewDetail.overview.deviceId }).then(
        (res) => {
          this.loading = false
          this.unitConfig.fieldList.body[4].isShow = true
          this.unitConfig.fieldList.body[5].isShow = false
          this.temperatureControlConfig = res.data.workConfig ? res.data.workConfig : this.temperatureControlConfig
          if (res.data.workConfig) {
            const g2Humidifying = this.temperatureControlConfig.humidifying
            const shower = this.temperatureControlConfig.shower
            g2Humidifying.closeDuration = g2Humidifying.closeDuration / 60
            shower.closeDuration = shower.closeDuration / 60
          }
          this.alarmConfig.data = res.data.alarmConfig ? res.data.alarmConfig : this.alarmConfig.data
          delete this.alarmConfig.data.disNetMaskStr
          this.equipmentConfig.data = res.data.deviceConfig ? res.data.deviceConfig : this.equipmentConfig.data
          // TODO:目标温湿度参数设置
          const aimTemperatureHumidityData = {
            destHumi: res.data.workConfig.fan.destHumi,
            destTemp: res.data.workConfig.fan.destTemp,
            minGear: res.data.workConfig.fan.minGear,
            partDestTemp: res.data.workConfig.heatLamp.destTemp
          }
          this.aimTemperatureHumidity = aimTemperatureHumidityData
          // this.aimTemperatureHumidity = ArgsInfoData.workConfig.fan ? ArgsInfoData.workConfig.fan : this.aimTemperatureHumidity
          // this.aimTemperatureHumidity.partDestTemp = ArgsInfoData.workConfig.heatLamp ? ArgsInfoData.workConfig.heatLamp.destTemp : ''
          console.log('获取的目标温湿度参数设置', this.aimTemperatureHumidity)
          this.workModeConfig.data.workMode = res.data.workConfig ? res.data.workConfig.workMode : this.workModeConfig.data.workMode
          this.unitConfig.data = res.data.piggeryConfig ? res.data.piggeryConfig : this.unitConfig.data
          this.initUnitConfig(res.data.piggeryConfig.piggeryType)
          if (res.data.lightConfig.entrys.length !== 0) {
            this.lightConfig.data.entrys = res.data.lightConfig.entrys
          }
          if (res.data.feedConfig.entrys.length !== 0) {
            this.feedConfig.data.entrys = res.data.feedConfig.entrys
          }
          if (!res.data.sensorConfig.heatLamp.bleMac) {
            res.data.sensorConfig.heatLamp.bleMac = '00:00:00:00:00:00'
          }
          if (!res.data.sensorConfig.indoorAfter.bleMac) {
            res.data.sensorConfig.indoorAfter.bleMac = '00:00:00:00:00:00'
          }
          if (!res.data.sensorConfig.indoorBefore.bleMac) {
            res.data.sensorConfig.indoorBefore.bleMac = '00:00:00:00:00:00'
          }
          if (!res.data.sensorConfig.outDoor.bleMac) {
            res.data.sensorConfig.outDoor.bleMac = '00:00:00:00:00:00'
          }
          this.sensorConfig = {
            heatLamp: res.data.sensorConfig.heatLamp,
            indoorAfter: res.data.sensorConfig.indoorAfter,
            indoorBefore: res.data.sensorConfig.indoorBefore,
            outDoor: res.data.sensorConfig.outDoor
          }
          // this.setEscalationPeriod.data.statusReportPeriod =
          //   ArgsInfoData.statusReportPeriod
          this.windowConfig.data = res.data.windowConfig ? res.data.windowConfig : this.windowConfig.data
          //   console.log('返回的参数信息', res, this.temperatureControlConfig)
          if (this.cur_prg !== 0) {
            if (new Date(res.data.reportTime).getTime() > this.singleTime) {
              this.$message.success('参数设置成功!')
              this.clearViewInterval()
            }
          }
        }
      )
    },

    // currentTemplate(item) {
    //   console.log('获取的模板数据', JSON.parse(item.argsJson))
    //   const argsJson = JSON.parse(item.argsJson)
    //   this.template = item.name
    //   console.log('lodash数据处理', this._.merge(this.temperatureControlConfig, argsJson.temperatureControlConfig))
    //   console.log('处理后的数据', this.temperatureControlConfig)
    //   // this.temperatureControlConfig = argsJson.temperatureControlConfig
    //   // TODO：初始化数值
    //   // this.initArgsInfoData()
    //   this._.merge(this.temperatureControlConfig, argsJson.temperatureControlConfig)
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
    //      argsJson.statusReportPeriod
    //   this.windowConfig.data = argsJson.windowConfig
    //   this.dialogDtatus = false
    //   this.focusCurrent = item.id
    //   console.log('当前选择的模板', item, argsJson)
    // },
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
      const waterCurtain = this.temperatureControlConfig.waterCurtain
      exchange.openDuration = exchange.openDuration / 60
      gutter.openDuration = gutter.openDuration / 60
      // g2Humidifying.closeDuration = g2Humidifying.closeDuration / 60
      shower.closeDuration = shower.closeDuration / 60
      waterCurtain.closeDuration = waterCurtain.closeDuration / 60
      // this.alarmConfig.data = argsJson.alarmConfig
      this._.merge(this.alarmConfig.data, argsJson.alarmConfig)
      // this.equipmentConfig.data = argsJson.equipmentConfig
      this._.merge(this.equipmentConfig.data, argsJson.equipmentConfig)
      // this.aimTemperatureHumidity = argsJson.aimTemperatureHumidity
      this._.merge(this.aimTemperatureHumidity, argsJson.aimTemperatureHumidity)
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
      if (this.checkedProgress.indexOf('workModeConfig') !== -1) {
        if (!this.workModeConfig.data.workMode) {
          this.$message.error('请选择工作模式')
          return
        }
        if (this.workModeConfig.data.workMode === 2 || this.workModeConfig.data.workMode === 3 || this.workModeConfig.data.workMode === 7) {
          this.$message.error('不能下发空圈、刷圈、应急模式')
          return
        }
      }
      // 单元参数
      this.checkedProgress.indexOf('unitConfig') !== -1 ? this.$refs.unitConfig.$refs[`overviewBoxForm`].validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
      // 照明开启
      // console.log(11111111111, this.$refs)
      // this.checkedProgress.indexOf('heatLamp') !== -1 ? this.$refs.heatLamp.validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
      // 温湿度传感器
      this.checkedProgress.indexOf('sensorConfig') !== -1 ? this.$refs.sensorConfig.validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
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
      if (this.overviewDetail.overview && this.overviewDetail.overview.statusOnline !== 0) {
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
        const params = {
          deviceId: this.overviewDetail.overview.deviceId,
          deviceName: this.overviewDetail.overview.deviceName
        }
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
        this.loading = true
        this.singleUnitLoading = true
        singleUnit(params, data).then((res) => {
          console.log('提交返回的内容', res)
          this.loading = false
          this.singleUnitLoading = false
          if (res.rel) {
            if (res.data) {
              this.loading = false
              this.$message.success('参数设置成功!')
              res.data = res.data.runtimeArgs
              this.unitConfig.fieldList.body[4].isShow = true
              this.unitConfig.fieldList.body[5].isShow = true
              this.temperatureControlConfig = res.data.workConfig
              const g2Humidifying = this.temperatureControlConfig.humidifying
              const shower = this.temperatureControlConfig.shower
              g2Humidifying.closeDuration = g2Humidifying.closeDuration / 60
              shower.closeDuration = shower.closeDuration / 60
              this.alarmConfig.data = res.data.alarmConfig
              delete this.alarmConfig.data.disNetMaskStr
              this.equipmentConfig.data = res.data.deviceConfig
              // TODO:目标温湿度参数设置
              // this.aimTemperatureHumidity = res.data.workConfig.fan
              // TODO:目标温湿度参数设置
              const aimTemperatureHumidityData = {
                destHumi: res.data.workConfig.fan.destHumi,
                destTemp: res.data.workConfig.fan.destTemp,
                minGear: res.data.workConfig.fan.minGear,
                partDestTemp: res.data.workConfig.heatLamp.destTemp
              }
              this.aimTemperatureHumidity = aimTemperatureHumidityData
              // this.aimTemperatureHumidity = ArgsInfoData.workConfig.fan ? ArgsInfoData.workConfig.fan : this.aimTemperatureHumidity
              // this.aimTemperatureHumidity.partDestTemp = ArgsInfoData.workConfig.heatLamp ? ArgsInfoData.workConfig.heatLamp.destTemp : ''
              console.log('获取的目标温湿度参数设置', this.aimTemperatureHumidity)
              if (res.data.workConfig) {
                this.workModeConfig.data.workMode = res.data.workConfig.workMode
              } else {
                this.workModeConfig.data.workMode = ''
              }
              this.unitConfig.data = res.data.piggeryConfig
              this.initUnitConfig(res.data.piggeryConfig.piggeryType)
              if (res.data.lightConfig.entrys.length !== 0) {
                this.lightConfig.data.entrys = res.data.lightConfig.entrys
              }
              if (res.data.feedConfig.entrys.length !== 0) {
                this.feedConfig.data.entrys = res.data.feedConfig.entrys
              }
              this.sensorConfig = {
                heatLamp: res.data.sensorConfig.heatLamp,
                indoorAfter: res.data.sensorConfig.indoorAfter,
                indoorBefore: res.data.sensorConfig.indoorBefore,
                outDoor: res.data.sensorConfig.outDoor
              }
              // this.setEscalationPeriod.data.statusReportPeriod =
              //   ArgsInfoData.statusReportPeriod
              this.windowConfig.data = res.data.windowConfig
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
.multi-function-setting-v3{
  .overview-panel .el-form-item .el-input__inner{
    border: 1px solid #475a9a;
    @include border_color('inputInnerBorderColor');
  }
  .el-input--suffix .el-input__inner {
    @include font_color('mainFontColor11');
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
        // height: 40px;
      }
    }
  }
}

// 表单校验错误提示

.multi-function-setting-v3{
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
  .unit-config {
    .el-form-item__error{
      top: 43px;
    }
  }
}
.unit-box-errorTip{
  .el-form-item__error{
    top: 38px;
    left: 130px;
  }
}
</style>
<style lang="scss" scoped>
.multi-function-setting-v3 {
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
            display: flex;
      .title {
        // color: #6e83be;
        @include font_color('viewFontColor3');
      }
            .label {
        width: 80px;
        min-width: 80px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
    }
    .form-body {
      display: flex;
      // align-items: center;
      // color: #cdd8f7;
      @include font_color('mainFontColor11');
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
.dialog-hidden{
  display: none;
}
.dialog-block{
  display: block;
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

// .multi-function-setting-v3 {
//   overflow: scroll;
//   &::-webkit-scrollbar {
//     display: none;
//   }
// }
.main {
  display: flex;
  flex-wrap: wrap;
  padding-left: 10px;
  // min-width: 1680px;
}
.overview-box {
  // height: 418px;
  // margin-bottom: 20px;
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
.multi-function-setting-v3 .overview-radio-disabled{
  background: #1d2c4c;
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
  // margin: 10px 0;
    margin-top: 10px;
  margin-bottom: 20px;
}
</style>
