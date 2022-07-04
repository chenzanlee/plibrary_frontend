<template>
  <div class="parameter-setting">
    <div class="nav">
      <!-- {{ isNewProtocal }} -->
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
        <button v-hasAuth="'fieldDeviceOverview:configParamMultiUnit_MCU'" class="btn-blue" @click="multiUnit()">多单元参数设置</button>
        <button v-hasAuth="'fieldDeviceOverview:configParamsSingleUnit_MCU'" class="btn-border" @click="multiFunction()">
          多功能块编辑
        </button>
      </div>
    </div>
    <div v-loading="loading" class="main">
      <el-row v-if="!isNewProtocal" :gutter="10" class="row-box" style="display: flex;">
        <el-col v-loading="trenchHeatLoading" class="col-box" :span="16">
          <div class="overview-panel" style="height: 100%;">
            <el-form ref="trenchHeat" :model="temperatureControlConfig">
              <div class="box-head">
                <div class="title">
                  <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
                  地沟热交换工作参数
                </div>
                <div class="option">
                  <template v-if="!trenchHeat.sendShow">
                    <div
                      v-hasAuth="'fieldDeviceOverview:configParamsSingleUnit_MCU'"
                      class="edit"
                      @click="
                        trenchHeat.sendShow = true
                        trenchHeat.disabled = false
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
                        trenchHeat.sendShow = false
                        trenchHeat.disabled = true
                        initArgsInfoData()
                      "
                    >
                      取消
                    </div>
                    <!-- <el-tooltip
                      class="item"
                      :visible-arrow="false"
                      popper-class="view-tooltip"
                      effect="dark"
                      placement="top-start"
                    > -->
                    <!-- <div class="content">
                      发送指令
                      <div class="nabla" />
                    </div> -->
                    <div
                      class="send"
                    >
                      <el-popconfirm
                        title="确定发送指令到设备吗？"
                        @onConfirm="singleUnit('trenchHeat')"
                      >
                        <svg-icon
                          slot="reference"
                          class="waring-icon"
                          icon-class="send-instructions"
                        />
                      </el-popconfirm>
                    </div>
                    <!-- </el-tooltip> -->
                  </template>
                </div>
              </div>
              <div class="box-body">
                <el-row class="form-title" :gutter="10">
                  <el-col class="title-col" :span="4" style="color:rgba(0,0,0,0)">1</el-col>
                  <el-col
                    v-for="(item, index) in trenchHeat.titles"
                    :key="index"
                    class="title"
                    :span="20 / trenchHeat.titles.length"
                  >{{ item }}</el-col>
                </el-row>
                <!-- bbb -->
                <el-row
                  v-for="(item, index) in trenchHeat.labels"
                  :key="index"
                  class="form-body"
                  :gutter="10"
                >
                  <el-col class="label" :span="4">{{ item.label }}</el-col>
                  <el-col
                    v-for="(childItem, index) in item.lists"
                    :key="index"
                    :span="20 / item.lists.length"
                  >
                    <el-form-item v-if="childItem.type === 'radio'">
                      <!-- 111 -->
                    </el-form-item>
                    <el-form-item
                      v-else
                      :prop="item.key + '.' + childItem.key"
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
                        :disabled="trenchHeat.disabled"
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
        </el-col>
        <el-col v-if="temperatureControlConfig.fixedFan.length > 0" class="col-box" :span="8">
          <div v-loading="constantSpeedLoading" class="overview-panel" style="height: 100%;">
            <el-form ref="constantSpeed" :model="temperatureControlConfig">
              <div class="box-head">
                <div class="title">
                  <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
                  定速风机工作参数
                </div>
                <div class="option">
                  <template v-if="!constantSpeed.sendShow">
                    <div
                      v-hasAuth="'fieldDeviceOverview:configParamsSingleUnit_MCU'"
                      class="edit"
                      @click="
                        constantSpeed.sendShow = true
                        constantSpeed.disabled = false
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
                        constantSpeed.sendShow = false
                        constantSpeed.disabled = true
                        initArgsInfoData()
                      "
                    >
                      取消
                    </div>
                    <!-- <el-tooltip
                      class="item"
                      :visible-arrow="false"
                      popper-class="view-tooltip"
                      effect="dark"
                      placement="top-start"
                    > -->
                    <div
                      class="send"
                    >
                      <el-popconfirm
                        title="确定发送指令到设备吗？"
                        @onConfirm="singleUnit('constantSpeed')"
                      >
                        <svg-icon
                          slot="reference"
                          class="waring-icon"
                          icon-class="send-instructions"
                        />
                      </el-popconfirm>
                    </div>
                    <!-- </el-tooltip> -->
                  </template>
                </div>
              </div>
              <div class="box-body">
                <el-row class="form-title" :gutter="10">
                  <el-col class="title-col-8" :span="4" style="color:rgba(0,0,0,0)">1</el-col>
                  <el-col
                    v-for="(item, index) in constantSpeed.titles"
                    :key="index"
                    class="title"
                    :span="20 / constantSpeed.titles.length"
                  >{{ item }}</el-col>
                </el-row>
                <el-row
                  v-for="(item, index) in temperatureControlConfig.fixedFan"
                  :key="index"
                  class="form-body"
                  :gutter="10"
                >
                  <el-col class="label label-8" :span="4">{{
                    index + 1
                  }}</el-col>
                  <el-col
                    v-for="(childItem, childIndex) in item"
                    :key="childIndex"
                    :span="10"
                  >
                    <el-form-item
                      :prop="childIndex"
                      :rules="[
                        {
                          validator: (rule, value, callback) => {
                            if(childIndex === 'openTemp'){
                              const v = item.openTemp
                              if (v === undefined || v === null || v === '') {
                                callback('不能为空')
                              } else if ( v < 10 || v > 60) {
                                callback('取值范围在10-60之间')
                              } else if (v) {
                                (v > item.closeTemp) ? callback() : callback('必须大于关闭温度!')
                              } else {
                                callback()
                              }
                            } else {
                              const v = item.closeTemp
                              if (v === undefined || v === null || v === '') {
                                callback('不能为空')
                              } else if ( v < 10 || v > 60) {
                                callback('取值范围在10-60之间')
                              } else if (v) {
                                (v < item.openTemp) ? callback() : callback('必须小于开启温度!')
                              } else {
                                callback()
                              }
                            }
                          },
                          trigger: ['blur', 'change']
                        }
                      ]"
                    >
                      <el-input-number
                        v-model="item[childIndex]"
                        :disabled="constantSpeed.disabled"
                        controls-position="right"
                        :step="0.1"
                      />
                      <!-- :min="10"
                        :max="60" -->
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-form>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="temperatureControlConfig.endFan.length > 0" :gutter="10" class="row-box" style="display: flex;">
        <el-col v-if="!isNewProtocal" class="col-box" :span="16">
          <div v-loading="variableFrequencyLoading" class="overview-panel" style="height: 100%;">
            <el-form ref="variableFrequency" :model="temperatureControlConfig">
              <div class="box-head">
                <div class="title">
                  <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
                  变频风机工作参数
                </div>
                <div class="option">
                  <template v-if="!variableFrequency.sendShow">
                    <div
                      v-hasAuth="'fieldDeviceOverview:configParamsSingleUnit_MCU'"
                      class="edit"
                      @click="
                        variableFrequency.sendShow = true
                        variableFrequency.disabled = false
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
                        variableFrequency.sendShow = false
                        variableFrequency.disabled = true
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
                        @onConfirm="singleUnit('variableFrequency')"
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
              <div class="box-body">
                <el-row class="form-title" :gutter="10">
                  <el-col class="title-col" :span="4" style="color:rgba(0,0,0,0)">1</el-col>
                  <el-col
                    v-for="(item, index) in variableFrequency.titles"
                    :key="index"
                    class="title"
                    :span="20 / variableFrequency.titles.length"
                  >{{ item }}</el-col>
                </el-row>
                <el-row
                  v-for="(item, index) in temperatureControlConfig.endFan"
                  :key="index"
                  class="form-body"
                  :gutter="10"
                >
                  <el-col class="label" :span="4">端部{{ index + 1 }}</el-col>
                  <el-col :span="5">
                    <el-form-item
                      prop="openTemp"
                      :rules="[
                        {
                          validator: (rule, value, callback) => {
                            const v = item.openTemp
                            if (v === undefined || v === null || v === '') {
                              callback('不能为空')
                            } else if( v < 10 || v > 60) {
                              callback('取值范围在10-60之间')
                            } else {
                              callback()
                            }
                          },
                          trigger: ['blur', 'change']
                        }
                      ]"
                    >
                      <el-input-number
                        v-model="item.openTemp"
                        :precision="1"
                        :step="0.1"
                        :disabled="variableFrequency.disabled"
                        controls-position="right"
                      />
                      <!-- :min="10"
                        :max="60" -->
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item
                      prop="diffTemp"
                      :rules="[
                        {
                          validator: (rule, value, callback) => {
                            const v = item.diffTemp
                            if (v === undefined || v === null || v === '') {
                              callback('不能为空')
                            } else if( v < 1 || v > 10) {
                              callback('取值范围在1-10之间')
                            } else {
                              callback()
                            }
                          },
                          trigger: ['blur', 'change']
                        }
                      ]"
                    >
                      <el-input-number
                        v-model="item.diffTemp"
                        :precision="1"
                        :step="0.1"
                        :disabled="variableFrequency.disabled"
                        controls-position="right"
                      />
                      <!-- :min="1"
                        :max="10" -->
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item
                      prop="baseFreq"
                      :rules="[
                        {
                          validator: (rule, value, callback) => {
                            const v = item.baseFreq
                            if (v === undefined || v === null || v === '') {
                              callback('不能为空')
                            } else if( v < 20 || v > 50) {
                              callback('取值范围在20-50之间')
                            } else if (v) {
                              (v < item.lockFreq) ? callback() : callback('必须小于锁定频率!')
                            } else {
                              callback()
                            }
                          },
                          trigger: ['blur', 'change']
                        }
                      ]"
                    >
                      <el-input-number
                        v-model="item.baseFreq"
                        :disabled="variableFrequency.disabled"
                        controls-position="right"
                      />
                      <!-- :min="20"
                        :max="50" -->
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item
                      prop="lockFreq"
                      :rules="[
                        {
                          validator: (rule, value, callback) => {
                            const v = item.lockFreq
                            if (v === undefined || v === null || v === '') {
                              callback('不能为空')
                            } else if( v < 10 || v > 50) {
                              callback('取值范围在10-50之间')
                            } else if (v) {
                              (v > item.baseFreq) ? callback() : callback('必须大于基础频率!')
                            } else {
                              callback()
                            }
                          },
                          trigger: ['blur', 'change']
                        }
                      ]"
                    >
                      <el-input-number
                        v-model="item.lockFreq"
                        :disabled="variableFrequency.disabled"
                        controls-position="right"
                      />
                      <!-- :min="10"
                        :max="50" -->
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-form>
          </div>
        </el-col>
        <el-col v-else :span="16">
          <div v-loading="aimTemperatureHumidityLoading" class="overview-panel" style="height: 100%;">
            <el-form ref="aimTemperatureHumidity" :model="aimTemperatureHumidity">
              <div class="box-head">
                <div class="title">
                  <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
                  目标温湿度参数
                </div>
                <div class="option">
                  <template v-if="!aimTemperatureHumiditys.sendShow">
                    <div
                      v-hasAuth="'fieldDeviceOverview:configParamsSingleUnit_MCU'"
                      class="edit"
                      @click="
                        aimTemperatureHumiditys.sendShow = true
                        aimTemperatureHumiditys.disabled = false
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
                        aimTemperatureHumiditys.sendShow = false
                        aimTemperatureHumiditys.disabled = true
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
                        @onConfirm="singleUnit('aimTemperatureHumidity')"
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
              <div class="box-body">
                <el-row class="form-title" :gutter="10">
                  <!-- <el-col class="title-col" :span="4">1</el-col> -->
                  <el-col
                    v-for="(item, index) in aimTemperatureHumiditys.titles"
                    :key="index"
                    class="title"
                    :span="24 / aimTemperatureHumiditys.titles.length"
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
                    :span="24 / item.lists.length"
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
        </el-col>
        <el-col class="col-box" :span="8">
          <div v-loading="warmLightLoading" class="overview-panel" style="height: 100%;">
            <el-form ref="warmLight" :model="temperatureControlConfig">
              <div class="box-head">
                <div class="title">
                  <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
                  暖灯伴热带工作参数
                </div>
                <div class="option">
                  <template v-if="!warmLight.sendShow">
                    <div
                      v-hasAuth="'fieldDeviceOverview:configParamsSingleUnit_MCU'"
                      class="edit"
                      @click="
                        warmLight.sendShow = true
                        warmLight.disabled = false
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
                        warmLight.sendShow = false
                        warmLight.disabled = true
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
                        @onConfirm="singleUnit('warmLight')"
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
              <div class="box-body">
                <el-row class="form-title" :gutter="10">
                  <el-col class="title-col-8" :span="4" style="color:rgba(0,0,0,0)">1</el-col>
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
                  <el-col class="label label-8" :span="4">{{
                    item.label
                  }}</el-col>
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
        </el-col>
      </el-row>

      <el-row :gutter="10" class="row-box">
        <div v-loading="coolingEquipmentLoading" class="overview-panel">
          <el-form ref="coolingEquipment" :model="temperatureControlConfig">
            <div class="box-head">
              <div class="title">
                <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
                降温设备工作参数
              </div>
              <div class="option">
                <template v-if="!coolingEquipment.sendShow">
                  <div
                    v-hasAuth="'fieldDeviceOverview:configParamsSingleUnit_MCU'"
                    class="edit"
                    @click="
                      coolingEquipment.sendShow = true
                      coolingEquipment.disabled = false
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
                      coolingEquipment.sendShow = false
                      coolingEquipment.disabled = true
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
                      @onConfirm="singleUnit('coolingEquipment')"
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
            <div class="box-body">
              <el-row class="form-title" :gutter="10">
                <el-col class="title-col" :span="4" style="color:rgba(0,0,0,0)">1</el-col>
                <el-col
                  v-for="(item, index) in coolingEquipment.titles"
                  :key="index"
                  class="title"
                  :span="20 / coolingEquipment.titles.length"
                >{{ item }}</el-col>
              </el-row>
              <el-row
                v-for="(item, index) in coolingEquipment.labels"
                :key="index"
                class="form-body"
                :gutter="10"
              >
                <template v-if="item.isShow">
                  <el-col class="label" :span="4">{{ item.label }}</el-col>
                  <el-col
                    v-for="(childItem, index) in item.lists"
                    :key="index"
                    :span="20 / item.lists.length"
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
      </el-row>

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
            <div class="title">
              <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
              报警参数
            </div>
            <div class="option">
              <template v-if="!alarmConfig.sendShow">
                <div
                  v-hasAuth="'fieldDeviceOverview:configParamsSingleUnit_MCU'"
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
                <div
                  class="send"
                >
                  <el-popconfirm
                    title="确定发送指令到设备吗？"
                    @onConfirm="singleUnit('alarmConfig')"
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
            <!-- </div> -->
          </template>
        </overview-box>
        <!-- 设置设备 -->
        <overview-box
          ref="equipmentConfig"
          v-loading="equipmentConfigLoading"
          class="overview-box"
          :data="equipmentConfig.data"
          :field-list="equipmentConfig.fieldList"
        >
          <template v-slot:head>
            <!-- <div class="box-head"> -->
            <div class="title">
              <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
              设备参数
            </div>
            <div class="option">
              <template v-if="!equipmentConfig.sendShow">
                <div
                  v-hasAuth="'fieldDeviceOverview:configParamsSingleUnit_MCU'"
                  class="edit"
                  @click="
                    equipmentConfig.sendShow = true
                    equipmentConfig.fieldList.disabled = false
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
                    equipmentConfig.sendShow = false
                    equipmentConfig.fieldList.disabled = true
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
                    @onConfirm="singleUnit('equipmentConfig')"
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
            <!-- </div> -->
          </template>
          <template v-slot:body-fot>
            <div class="body-fot">
              <button v-hasAuth="'fieldDeviceOverview:configParamsSingleUnit_MCU'" class="btn-blue" @click="sensorTesting()">温湿度传感器测试</button>
            </div>
          </template>
        </overview-box>

        <div v-loading="workModeConfigLoading" class="overview-box work-mode-config">
          <div class="box-head">
            <div class="title">
              <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
              工作模式
            </div>
            <div class="option">
              <template v-if="!workModeConfig.sendShow">
                <div
                  v-hasAuth="'fieldDeviceOverview:configParamsSingleUnit_MCU'"
                  class="edit"
                  @click="
                    workModeConfig.sendShow = true
                    workModeConfig.fieldList.disabled = false
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
                    workModeConfig.sendShow = false
                    workModeConfig.fieldList.disabled = true
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
                    @onConfirm="singleUnit('workModeConfig')"
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
            <el-form ref="workModeConfig" :model="workModeConfig.data">
              <el-row :gutter="10">
                <el-col :span="24">
                  <div class="title">
                    {{ workModeConfig.fieldList.workMode.title }}:
                  </div>
                  <!-- <el-row :gutter="10" class="manual-temp">
                    <el-col :span="6"><div class="title">温度</div></el-col>
                    <el-col :span="18">
                      <el-form-item>
                        <el-input-number
                          v-model="workModeConfig.data.manualTemp"
                          class="manual-temp-inp"
                          :disabled="workModeConfig.fieldList.disabled"
                          :controls-position="
                            workModeConfig.fieldList.manualTemp
                              .controlsPositionRight
                          "
                          :precision="
                            workModeConfig.fieldList.manualTemp.precision
                          "
                          :step="workModeConfig.fieldList.manualTemp.step"
                          :size="workModeConfig.fieldList.manualTemp.size"
                          :min="workModeConfig.fieldList.manualTemp.min"
                          :max="workModeConfig.fieldList.manualTemp.max"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row> -->
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
              <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
              单元参数
            </div>
            <div class="option">
              <template v-if="!unitConfig.sendShow">
                <div
                  v-hasAuth="'fieldDeviceOverview:configParamsSingleUnit_MCU'"
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
                <div
                  class="send"
                >
                  <el-popconfirm
                    title="确定发送指令到设备吗？"
                    @onConfirm="singleUnit('unitConfig')"
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
            <!-- </div> -->
          </template>
        </overview-box>

        <div
          v-loading="lightConfigLoading"
          class="overview-box light-config"
          style="height: calc(100% - 20px);"
        >
          <div class="box-head">
            <div class="title">
              <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
              照明开启/关闭时间
            </div>
            <div class="option">
              <template v-if="!lightConfig.sendShow">
                <div
                  v-hasAuth="'fieldDeviceOverview:configParamsSingleUnit_MCU'"
                  class="edit"
                  @click="
                    lightConfig.sendShow = true
                    lightConfig.fieldList.disabled = false
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
                    lightConfig.sendShow = false
                    lightConfig.fieldList.disabled = true
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
                    @onConfirm="singleUnit('lightConfig')"
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
        <div class="overview-box flex-grow-2">
          <div v-loading="sensorConfigLoading" class="overview-panel" style="height: 100%;">
            <el-form ref="sensorConfig" :model="sensorConfig">
              <div class="box-head">
                <div class="title">
                  <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
                  温湿度传感器校准值
                </div>
                <div class="option">
                  <template v-if="!sensorConfigs.sendShow">
                    <div
                      v-hasAuth="'fieldDeviceOverview:configParamsSingleUnit_MCU'"
                      class="edit"
                      @click="
                        sensorConfigs.sendShow = true
                        sensorConfigs.disabled = false
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
                        sensorConfigs.sendShow = false
                        sensorConfigs.disabled = true
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
                        @onConfirm="singleUnit('sensorConfig')"
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

              <div class="box-body">
                <el-row class="form-title" :gutter="10">
                  <el-col :span="3" style="color:rgba(0,0,0,0)">1</el-col>
                  <el-col
                    v-for="(item, index) in sensorConfigs.titles"
                    :key="index"
                    class="title"
                    :span="21 / sensorConfigs.titles.length"
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
                    :span="21 / item.lists.length"
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
                        v-else
                        v-model="sensorConfig[item.key][childItem.key]"
                        :disabled="sensorConfigs.disabled"
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
        <!-- 设置上报周期 -->
        <overview-box
          ref="setEscalationPeriod"
          v-loading="setEscalationPeriodLoading"
          class="overview-box unit-config"
          :data="setEscalationPeriod.data"
          :field-list="setEscalationPeriod.fieldList"
        >
          <template v-slot:head>
            <!-- <div class="box-head"> -->
            <div class="title">
              <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
              上报周期
            </div>
            <div class="option">
              <template v-if="!setEscalationPeriod.sendShow">
                <div
                  v-hasAuth="'fieldDeviceOverview:configParamsSingleUnit_MCU'"
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
                <div
                  class="send"
                >
                  <el-popconfirm
                    title="确定发送指令到设备吗？"
                    @onConfirm="singleUnit('setEscalationPeriod')"
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
            <!-- </div> -->
          </template>
        </overview-box>

        <div
          v-loading="feedConfigLoading"
          class="overview-box light-config"
          style="height: calc(100% - 20px);"
        >
          <div class="box-head">
            <div class="title">
              <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
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
              style="    max-height: 500px;
    overflow-y: scroll;"
              :model="feedConfig"
            >
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
                        } else if (v < 0){
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
                  style="font-size: 16px;color: #FF2727;cursor: pointer;margin-left:10px"
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

        <div v-loading="windowConfigLoading" class="overview-box " style="margin: 0;margin-left:20px;margin-bottom:20px">
          <el-form ref="windowConfig" :model="windowConfig.data">
            <div class="box-head">
              <div class="title">
                <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
                风口参数
              </div>
              <div class="option">
                <template v-if="!windowConfig.sendShow">
                  <div
                    v-hasAuth="'fieldDeviceOverview:configParamsSingleUnit_MCU'"
                    class="edit"
                    @click="
                      windowConfig.sendShow = true
                      windowConfig.disabled = false
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
                      windowConfig.sendShow = false
                      windowConfig.disabled = true
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
                      @onConfirm="singleUnit('windowConfig')"
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
            <div class="overview-box" style="margin:20px;margin-bottom:0">
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
      </div>
    </div>

    <el-dialog
      class="equipment-config-equipmentConfig"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <div slot="title" class="dialog-title">
        <div class="title">设备参数</div>
        <div class="name">录入人:{{ JSON.parse(userInfo).name }}</div>
      </div>
      <div class="body">
        <div style="margin:0 auto;" class="addForm ">
          <general-form
            ref="ceshi"
            label-width="190px"
            :data="formInfo.data"
            :field-list="formInfo.fieldList"
            :list-type-info="listTypeInfo"
            form-type="slot"
            theme-type="default"
          >
            <template v-slot:form>
              <el-form-item
                v-for="(item, testIndex) in formInfo.testSamples"
                :key="testIndex + '1'"
                style="margin-bottom:22px"
                :label="'Mac地址' + (testIndex + 1)"
                class="shadow"
              >
                <el-input
                  v-model="formInfo.testSamples[testIndex].mac"
                />
              </el-form-item>

            </template>
          </general-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <div style="width:100%;margin:0 auto">
          <el-button class="btn-border canleButton" @click="dialogVisible = false">取 消</el-button>
          <el-button class="btn-blue canleButton" type="primary" :loading="dialogLoading" @click="sensorTestingSub">确 定</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- <munltiUnit
      v-if="tabStatus == 'unit'"
      :fieldId="fieldId"
      @child-next="childNext"
    /> -->
  </div>
</template>

<script>
import { ArgsInfo, ArgsInfoV3, singleUnit } from '@/http/api/fieldDeviceOverview'
import { valueExist } from '@/common/utils'
import OverviewBox from '@/views/IntelligentControl/fieldDeviceOverview/common/components/OverviewBox'
import generalForm from '@/components/commonComponent/generalForm'
// import jsontype from './config/formJson.json'
import rulesService from './utils/verification'
export default {
  components: {
    OverviewBox,
    generalForm
  },
  inject: ['overviewDetail'],

  props: {
    unitId: String
  },
  data() {
    return {
      userInfo: localStorage.userJurisdiction,
      trenchHeatLoading: false,
      constantSpeedLoading: false,
      variableFrequencyLoading: false,
      aimTemperatureHumidityLoading: false,
      warmLightLoading: false,
      coolingEquipmentLoading: false,
      alarmConfigLoading: false,
      equipmentConfigLoading: false,
      workModeConfigLoading: false,
      unitConfigLoading: false,
      lightConfigLoading: false,
      feedConfigLoading: false,
      sensorConfigLoading: false,
      setEscalationPeriodLoading: false,
      windowConfigLoading: false,
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
        fieldList: [
          {
            label: '参数锁定(喷淋、风机)：',
            key: 'lockParam',
            type: 'radio',
            className: 'shadow',
            customLabel: 'name',
            customVal: 'val',
            optList: [{ 'name': '锁定', 'val': 1 }, { 'name': '不锁定', 'val': 0 }]
          },
          {
            label: '定速风机数量(0-5)：',
            key: 'fixSpeedFanAmount',
            type: 'inputNumber',
            controlsPositionRight: 'right',
            ...rulesService.limit_1_5
          },
          {
            label: '室内前温湿度传感器Mac地址：',
            key: 'indoorBeforeProbe_mac',
            type: 'input',
            className: 'shadow',
            placeholder: 'none'
          },
          {
            label: '室内后温湿度传感器Mac地址：',
            key: 'indoorAfterProbe_mac',
            type: 'input',
            className: 'shadow',
            placeholder: 'none'
          },
          {
            label: '暖灯温湿度传感器Mac地址：',
            key: 'heatLampProbe_mac',
            type: 'input',
            className: 'shadow',
            placeholder: 'none'
          }
        ]
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
        },
        waterCurtain: {
          closeDuration: '',
          openDuration: '',
          openTemp: '',
          staticMode: ''
        }
      },
      aimTemperatureHumidity: {
        temperature: '',
        humidity: '',
        minGear: ''
      },
      sensorConfig: {
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
      },
      // 热交换 - aaa
      trenchHeat: {
        sendShow: false,
        disabled: true,
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
                ...rulesService.verGreaterThan([10, 60], '<', '必须小于热交换关闭温度!', this, 'temperatureControlConfig', 'exchange', 'closeTemp')
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
                ...rulesService.verGreaterThan([10, 60], '>', '必须大于热交换开启温度!', this, 'temperatureControlConfig', 'exchange', 'openTemp')
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
                ...rulesService.verGreaterThan([10, 60], '<', '必须小于地沟关闭温度!', this, 'temperatureControlConfig', 'gutter', 'closeTemp')
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
                ...rulesService.verGreaterThan([10, 60], '>', '必须大于地沟关闭温度!', this, 'temperatureControlConfig', 'gutter', 'openTemp')
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
      // 定速风机
      constantSpeed: {
        sendShow: false,
        disabled: true,
        titles: ['开启温度（0.1°C）', '关闭温度（0.1°C）']
      },
      // 变频风机
      variableFrequency: {
        sendShow: false,
        disabled: true,
        titles: [
          '基础温度(0.1℃)',
          '偏差温度（0.1°C）',
          '基础频率(Hz)',
          '锁定频率(Hz)'
        ]
      },
      aimTemperatureHumiditys: {
        sendShow: false,
        disabled: true,
        data: {
          temperature: '',
          humidity: '',
          minGear: ''
        },
        titles: [
          '目标温度(℃)',
          '目标湿度(%)',
          '最小风机档位'
        ],
        labels: [
          {
            key: 'aimTemperatureHumidity',
            lists: [
              {
                key: 'temperature',
                controlsPositionRight: 'right',
                precision: 1,
                step: 0.1,
                ...rulesService.limit_20_32
              },
              {
                key: 'humidity',
                controlsPositionRight: 'right',
                ...rulesService.limit_50_80
              },
              {
                key: 'minGear',
                controlsPositionRight: 'right',
                ...rulesService.limit_1_5
              }
            ]
          }
        ]
      },
      // 暖灯
      warmLight: {
        sendShow: false,
        disabled: true,
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
      // 降温设备
      coolingEquipment: {
        sendShow: false,
        disabled: true,
        titles: [
          '开启温/湿度（0.1°C/%）',
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
            isShow: true,
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
                // key: 'staticMode',
                // type: 'select',
                // option: [
                //   { label: '静态', value: true },
                //   { label: '动态', value: false }
                // ]
              }
            ]
          },
          {
            isShow: false,
            label: '水帘',
            key: 'waterCurtain',
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
                key: 'staticMode',
                type: 'select',
                option: [
                  { label: '静态', value: true },
                  { label: '动态', value: false }
                ]
              }
            ]
          }
        ]
      },
      // 设置报警
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
          disabled: true,
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
              ...rulesService.limit__40_60
            },
            {
              title: '低温报警值（°C）',
              key: 'low',
              type: 'inputNumber',
              precision: 1,
              step: 0.1,
              controlsPositionRight: 'right',
              ...rulesService.limit__40_60
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
              title: '高湿度报警值（单位: %）',
              key: 'highHumiALarmThreshold',
              type: 'inputNumber',
              precision: 1,
              step: 0.1,
              controlsPositionRight: 'right',
              ...rulesService.limit_75_95
            },
            {
              title: '断网报警',
              key: 'disconnectedNetMask',
              type: 'radio',
              optList: [
                { label: '启用', value: 0 },
                { label: '屏蔽', value: 1 }
              ]
            },
            {
              title: '地沟风机报警',
              key: 'gutterFanMask',
              type: 'radio',
              optList: [
                { label: '启用', value: 0 },
                { label: '屏蔽', value: 1 }
              ]
            },
            {
              title: '热交换报警',
              key: 'heatExchangeFanMask',
              type: 'radio',
              optList: [
                { label: '启用', value: 0 },
                { label: '屏蔽', value: 1 }
              ]
            },
            {
              title: '饲喂报警',
              key: 'feedMask',
              type: 'radio',
              optList: [
                { label: '启用', value: 0 },
                { label: '屏蔽', value: 1 }
              ]
            },
            {
              title: '喷淋报警',
              key: 'showerMask',
              type: 'radio',
              optList: [
                { label: '启用', value: 0 },
                { label: '屏蔽', value: 1 }
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
          fixSpeedFanAmount: '',
          indoorBeforeProbe: {},
          indoorAfterProbe: {},
          heatLampProbe: {}
        },
        fieldList: {
          disabled: true,
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
      // 设置工作
      workModeConfig: {
        sendShow: false,
        data: {
          workMode: '',
          manualTemp: ''
        },
        fieldList: {
          disabled: true,
          workMode: {
            title: '工作模式',
            optList: [
              { label: '自动温控', value: 2 },
              { label: '空圈', value: 3, disabled: true },
              { label: '刷圈', value: 4 },
              { label: '转猪', value: 5, disabled: true },
              { label: '手动温控', value: 6 },
              { label: '安全', value: 7, disabled: true },
              { label: '应急', value: 8 }
            ]
          },
          manualTemp: {
            precision: 1,
            step: 0.1,
            controlsPositionRight: 'right',
            ...rulesService.limit_0_60
          }
        }
      },
      // 设置单元
      unitConfig: {
        sendShow: false,
        data: {
          batchNo: 1,
          hoggeryType: '',
          isBind: 1,
          pigCount: '',
          pigDays: '',
          unitNo: 1,
          weight: ''
        },
        fieldList: {
          disabled: true,
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
                // if (val === 1) {
                //   this.unitConfig.fieldList.body[5].label = '单猪体重(0-300KG)'
                //   this.unitConfig.fieldList.body[5].isShow = false
                // } else
                // if (val === 2) {
                //   console.log('获取的val')
                //   this.unitConfig.fieldList.body[5].label = '单猪体重(0-300KG)'
                //   this.unitConfig.fieldList.body[5].isShow = false
                // } else
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
                  this.unitConfig.fieldList.body[5].label = '母猪体重(0-300KG)'
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
      // 设置照明
      lightConfig: {
        sendShow: false,
        data: {
          entrys: [{ openTime: '08:00:00', closeTime: '12:00:00' }]
        },
        fieldList: {
          disabled: true,
          entrys: []
        }
      },

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
      // 设置温湿度传感器
      sensorConfigs: {
        sendShow: false,
        disabled: true,
        titles: [
          '是否开启温湿度探头',
          '温度传感器校准值(℃)',
          '湿度传感器校准值(%)'
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
          disabled: true,
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
        disabled: true,
        data: {
          airInletConfigList: [{ mode: 1, percent: 100 }],
          airOutletConfigList: [{ mode: 1, percent: 100 }]
        },
        fieldList: [
          {
            title: '进风口工作模式',
            titleColor: '#6e83be',
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
            titleColor: '#6e83be',
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
  computed: {
    waterCurtainShow() {
      console.log('监听的单元状态值', this.overviewDetail.overview.segmentName)
      if (this.overviewDetail.overview.segmentName === '公猪') {
        return true
      } else {
        return false
      }
    },
    isNewProtocal() {
      const reg = /^4/
      const val = this.overviewDetail.overview.firmwareVersion && this.overviewDetail.overview.firmwareVersion.length > 1 ? this.overviewDetail.overview.firmwareVersion[1] : null
      if (reg.test(this.overviewDetail.overview.firmwareVersion) && valueExist(val) && parseInt(val) > 4) {
        return true
      } else {
        return false
      }
    },
    showFunMinLevel() {
      const value = this.overviewDetail.overview.firmwareVersion && this.overviewDetail.overview.firmwareVersion.length > 1 ? this.overviewDetail.overview.firmwareVersion : null
      const str = valueExist(value) ? value.toString() : ''
      const val = str ? (str.length > 4 ? parseInt(str.substring(0, 4)) : parseInt(str)) : null
      console.log('获取的固件版本', val)
      // aimTemperatureHumiditys.titles
      return !!(val && val > 4650)
    }
  },
  beforeRouteLeave() {
    this.clearRefreshInterval()
  },
  watch: {
    unitId(newValue, oldValue) {
      if (this.overviewDetail.overview.segmentName === '公猪') {
        this.coolingEquipment.labels[2].isShow = true
      } else {
        this.coolingEquipment.labels[2].isShow = false
      }
      this.ArgsInfo()
      const value = this.overviewDetail.overview.firmwareVersion && this.overviewDetail.overview.firmwareVersion.length > 1 ? this.overviewDetail.overview.firmwareVersion : null
      const str = valueExist(value) ? value.toString() : ''
      const val = str ? (str.length > 4 ? parseInt(str.substring(0, 4)) : parseInt(str)) : null
      if (val && val > 4650) {
        this.aimTemperatureHumiditys.titles = [
          '目标温度(℃)',
          '目标湿度(%)',
          '最小风机档位'
        ]
        this.aimTemperatureHumiditys.labels[0].lists = [
          {
            key: 'temperature',
            controlsPositionRight: 'right',
            precision: 1,
            step: 0.1,
            ...rulesService.limit_20_32
          },
          {
            key: 'humidity',
            controlsPositionRight: 'right',
            ...rulesService.limit_50_80
          },
          {
            key: 'minGear',
            controlsPositionRight: 'right',
            ...rulesService.limit_1_6
          }
        ]
        this.aimTemperatureHumiditys.data = {
          temperature: '',
          humidity: '',
          minGear: ''
        }
      } else {
        this.aimTemperatureHumiditys.titles = [
          '目标温度(℃)',
          '目标湿度(%)'
        ]
        this.aimTemperatureHumiditys.labels[0].lists = [
          {
            key: 'temperature',
            controlsPositionRight: 'right',
            precision: 1,
            step: 0.1,
            ...rulesService.limit_20_32
          },
          {
            key: 'humidity',
            controlsPositionRight: 'right',
            ...rulesService.limit_50_80
          }
        ]
        this.aimTemperatureHumiditys.data = {
          temperature: '',
          humidity: ''
        }
      }
      console.log('监听的单元切换', newValue, oldValue, this.overviewDetail.overview.deviceId)
      console.log('监听的依赖注入内容', this.overviewDetail.overview.segmentName)
    }
  },

  mounted() {
    console.log('依赖注入的信息', this.overviewDetail)
    console.log('时间点的测试', new Date(2016, 9, 10, 18, 40))
    if (this.overviewDetail.overview.segmentName === '公猪') {
      this.coolingEquipment.labels[2].isShow = true
    } else {
      this.coolingEquipment.labels[2].isShow = false
    }
    const value = this.overviewDetail.overview.firmwareVersion && this.overviewDetail.overview.firmwareVersion.length > 1 ? this.overviewDetail.overview.firmwareVersion : null
    const str = valueExist(value) ? value.toString() : ''
    const val = str ? (str.length > 4 ? parseInt(str.substring(0, 4)) : parseInt(str)) : null
    if (val && val > 4650) {
      this.aimTemperatureHumiditys.titles = [
        '目标温度(℃)',
        '目标湿度(%)',
        '最小风机档位'
      ]
      this.aimTemperatureHumiditys.labels[0].lists = [
        {
          key: 'temperature',
          controlsPositionRight: 'right',
          precision: 1,
          step: 0.1,
          ...rulesService.limit_20_32
        },
        {
          key: 'humidity',
          controlsPositionRight: 'right',
          ...rulesService.limit_50_80
        },
        {
          key: 'minGear',
          controlsPositionRight: 'right',
          ...rulesService.limit_1_6
        }
      ]
      this.aimTemperatureHumiditys.data = {
        temperature: '',
        humidity: '',
        minGear: ''
      }
    } else {
      this.aimTemperatureHumiditys.titles = [
        '目标温度(℃)',
        '目标湿度(%)'
      ]
      this.aimTemperatureHumiditys.labels[0].lists = [
        {
          key: 'temperature',
          controlsPositionRight: 'right',
          precision: 1,
          step: 0.1,
          ...rulesService.limit_20_32
        },
        {
          key: 'humidity',
          controlsPositionRight: 'right',
          ...rulesService.limit_50_80
        }
      ]
      this.aimTemperatureHumiditys.data = {
        temperature: '',
        humidity: ''
      }
    }
    this.ArgsInfo()
  },
  methods: {
    log(data) {
      console.log('获取的验证数据', data)
    },
    initUnitConfig(type) {
      if (type) {
        this.unitConfig.recordHoggeryType = type
        switch (type) {
          case 1:
            this.unitConfig.fieldList.body[5].label = '单猪体重(0-300KG)'
            this.unitConfig.fieldList.body[5].isShow = false
            break
          case 2:
            this.unitConfig.fieldList.body[5].label = '单猪体重(0-300KG)'
            this.unitConfig.fieldList.body[5].isShow = false
            break
          case 3:
            this.unitConfig.fieldList.body[5].label = '单猪体重(0-300KG)'
            this.unitConfig.fieldList.body[5].isShow = false
            break
          case 4:
            this.unitConfig.fieldList.body[2].label = '仔猪日龄(0-600天)'
            this.unitConfig.fieldList.body[4].isShow = false
            this.unitConfig.fieldList.body[5].label = '单猪体重(0-300KG)'
            this.unitConfig.fieldList.body[5].isShow = false
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
          case 7:
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
        case 1:
          delete data.batchNo
          return data
        case 2:
          delete data.batchNo
          return data
        // case 3:
        //   delete data.batchNo
        //   return data
        case 4:
          // delete data.weight
          return data
        case 5:
          return data
        case 6:
          delete data.batchNo
          return data
        case 8:
          delete data.batchNo
          return data
        // default:
        //   delete data.weight
        //   delete data.batchNo
        //   return data
          // break
      }
    },

    sensorTestingSub() {
      this.$refs.ceshi.validateSelf((valid) => {
        if (valid) {
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
            this.dialogVisible = false
            if (res.rel) {
              if (res.data) {
                this.runtimeArgs(res.data.runtimeArgs)
              } else {
                this.viewIntervalFun()
              }
            } else {
              this.$message.error(res.message)
            }
          }).catch(() => {
            this.dialogLoading = false
            this.dialogVisible = false
          })
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
      console.log('选择的时间', event, this.lightConfig.data.entrys)
    },

    initArgsInfoDatas() {
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

    initArgsInfoData() {
      console.log('初始化的内容', this.ArgsInfoData)
      this.unitConfig.fieldList.body[4].isShow = true
      this.unitConfig.fieldList.body[5].isShow = true
      const ArgsInfoData = JSON.parse(JSON.stringify(this.ArgsInfoData))
      this.temperatureControlConfig = ArgsInfoData.temperatureControlConfig ? ArgsInfoData.temperatureControlConfig : this.temperatureControlConfig
      if (ArgsInfoData.temperatureControlConfig) {
        const exchange = this.temperatureControlConfig.exchange
        const gutter = this.temperatureControlConfig.gutter
        const g2Humidifying = this.temperatureControlConfig.g2Humidifying
        const shower = this.temperatureControlConfig.shower
        const waterCurtain = this.temperatureControlConfig.waterCurtain
        exchange.openDuration = exchange.openDuration / 60
        gutter.openDuration = gutter.openDuration / 60
        g2Humidifying.closeDuration = g2Humidifying.closeDuration / 60
        shower.closeDuration = shower.closeDuration / 60
        waterCurtain.closeDuration = waterCurtain.closeDuration / 60
      }
      this.alarmConfig.data = ArgsInfoData.alarmConfig ? ArgsInfoData.alarmConfig : this.alarmConfig.data
      this.equipmentConfig.data = ArgsInfoData.equipmentConfig ? ArgsInfoData.equipmentConfig : this.equipmentConfig.data
      if (ArgsInfoData.aimTemperatureHumidity) {
        // if (this.showFunMinLevel) {
        this.aimTemperatureHumidity = {
          temperature: '',
          humidity: '',
          minGear: ''
        }
        this.aimTemperatureHumidity = ArgsInfoData.aimTemperatureHumidity ? ArgsInfoData.aimTemperatureHumidity : this.aimTemperatureHumidity
        this.aimTemperatureHumidity['minGear'] = ArgsInfoData.minGear
        console.log('可添加最小风机档位', this.aimTemperatureHumidity, ArgsInfoData.minGear)
        // } else {
        //   console.log('不可添加最小风机档位')
        //   this.aimTemperatureHumidity = {
        //     temperature: '',
        //     humidity: ''
        //   }
        //   // this.aimTemperatureHumidity.minGear = ArgsInfoData.minGear ? ArgsInfoData.minGear : ''
        //   this.aimTemperatureHumidity = ArgsInfoData.aimTemperatureHumidity ? ArgsInfoData.aimTemperatureHumidity : this.aimTemperatureHumidity
        // }
      }
      if (ArgsInfoData.equipmentConfig.outDoorProbe) {
        this.equipmentConfig.data.outDoorProbe.mac = ''
      }
      this.workModeConfig.data = ArgsInfoData.workModeConfig ? ArgsInfoData.workModeConfig : this.workModeConfig.data
      this.unitConfig.data = ArgsInfoData.unitConfig ? ArgsInfoData.unitConfig : this.unitConfig.data
      this.initUnitConfig(ArgsInfoData.unitConfig.hoggeryType)
      if (ArgsInfoData.lightConfig.entrys.length !== 0) {
        this.lightConfig.data.entrys = ArgsInfoData.lightConfig.entrys
      }
      if (ArgsInfoData.feedConfig.entrys.length !== 0) {
        this.feedConfig.data.entrys = ArgsInfoData.feedConfig.entrys
      }
      this.sensorConfig = ArgsInfoData.sensorConfig ? ArgsInfoData.sensorConfig : this.sensorConfig
      this.setEscalationPeriod.data.statusReportPeriod =
        ArgsInfoData.statusReportPeriod ? ArgsInfoData.statusReportPeriod : this.setEscalationPeriod.data.statusReportPeriod
      this.windowConfig.data = ArgsInfoData.windowConfig ? ArgsInfoData.windowConfig : this.windowConfig.data
    },
    ArgsInfo() {
      ArgsInfo({ deviceId: this.overviewDetail.overview.deviceId }).then(
        (res) => {
          this.ArgsInfoData = res.data
          console.log('1111111111111111111111111', this.ArgsInfoData)
          this.initArgsInfoData()
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
    runtimeArgs(data) {
      this.ArgsInfoData = data
      this.initArgsInfoData()
      this.$message.success('参数设置成功!')
    },
    requestTemperatureControlConfig(type) {
      const params = {
        deviceId: this.overviewDetail.overview.deviceId,
        deviceName: this.overviewDetail.overview.deviceName
      }
      const temperatureControlConfig = JSON.parse(
        JSON.stringify(this.temperatureControlConfig)
      )
      const exchange = temperatureControlConfig.exchange
      const gutter = temperatureControlConfig.gutter
      const g2Humidifying = temperatureControlConfig.g2Humidifying
      const shower = temperatureControlConfig.shower
      const waterCurtain = temperatureControlConfig.waterCurtain
      exchange.openDuration = exchange.openDuration * 60
      gutter.openDuration = gutter.openDuration * 60
      g2Humidifying.closeDuration = g2Humidifying.closeDuration * 60
      shower.closeDuration = shower.closeDuration * 60
      waterCurtain.closeDuration = waterCurtain.closeDuration * 60
      console.log('提交的初始内容', this.temperatureControlConfig)
      console.log('提交的格式化后的内容', temperatureControlConfig)
      // const data = { temperatureControlConfig: temperatureControlConfig }
      let data = {}
      if (type === 'trenchHeat') {
        data = {
          temperatureControlConfig: {
            exchange: temperatureControlConfig.exchange,
            gutter: temperatureControlConfig.gutter
          }
        }
      }
      if (type === 'constantSpeed') {
        data = {
          temperatureControlConfig: {
            fixedFan: temperatureControlConfig.fixedFan
          }
        }
      }
      if (type === 'variableFrequency') {
        data = {
          temperatureControlConfig: { endFan: temperatureControlConfig.endFan }
        }
      }
      if (type === 'warmLight') {
        data = {
          temperatureControlConfig: {
            heatLamp: temperatureControlConfig.heatLamp,
            heatBelt: temperatureControlConfig.heatBelt
          }
        }
      }
      if (type === 'coolingEquipment') {
        data = {
          // temperatureControlConfig
          temperatureControlConfig: {
            shower: temperatureControlConfig.shower,
            g2Humidifying: temperatureControlConfig.g2Humidifying,
            waterCurtain: temperatureControlConfig.waterCurtain
          }
        }
      }
      singleUnit(params, data).then((res) => {
        console.log('提交返回的信息', res)
        if (type === 'trenchHeat') {
          this.trenchHeatLoading = false
        } else if (type === 'constantSpeed') {
          this.constantSpeedLoading = false
        } else if (type === 'variableFrequency') {
          this.variableFrequencyLoading = false
        } else if (type === 'warmLight') {
          this.warmLightLoading = false
        } else if (type === 'coolingEquipment') {
          this.coolingEquipmentLoading = false
        }
        if (res.rel) {
          if (res.data) {
            this.runtimeArgs(res.data.runtimeArgs)
          } else {
            this.viewIntervalFun()
          }
        } else {
          this.initArgsInfoData()
          this.$message.error(res.message)
        }
      }).catch(() => {
        if (type === 'trenchHeat') {
          this.trenchHeatLoading = false
        } else if (type === 'constantSpeed') {
          this.constantSpeedLoading = false
        } else if (type === 'variableFrequency') {
          this.variableFrequencyLoading = false
        } else if (type === 'warmLight') {
          this.warmLightLoading = false
        } else if (type === 'coolingEquipment') {
          this.coolingEquipmentLoading = false
        }
      })
    },
    requestAimTemperatureHumidity() {
      const params = {
        deviceId: this.overviewDetail.overview.deviceId,
        deviceName: this.overviewDetail.overview.deviceName
      }
      let data = ''
      const aa = JSON.parse(JSON.stringify(this.aimTemperatureHumidity))
      delete aa.minGear
      if (this.showFunMinLevel) {
        // eslint-disable-next-line no-unused-vars

        data = { aimTemperatureHumidity: aa, minGear: this.aimTemperatureHumidity.minGear }
      } else {
        // eslint-disable-next-line no-unused-vars
        data = { aimTemperatureHumidity: aa }
      }

      singleUnit(params, data).then((res) => {
        console.log('提交返回的信息', res)
        this.aimTemperatureHumidityLoading = false
        if (res.rel) {
          if (res.data) {
            this.runtimeArgs(res.data.runtimeArgs)
          } else {
            this.viewIntervalFun()
          }
        } else {
          this.initArgsInfoData()
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.aimTemperatureHumidityLoading = false
      })
    },
    requestAlarmConfig() {
      const params = {
        deviceId: this.overviewDetail.overview.deviceId,
        deviceName: this.overviewDetail.overview.deviceName
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
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.alarmConfigLoading = false
      })
    },

    requestEquipmentConfig() {
      const params = {
        deviceId: this.overviewDetail.overview.deviceId,
        deviceName: this.overviewDetail.overview.deviceName
      }
      const equipmentConfig = JSON.parse(JSON.stringify(this.equipmentConfig.data))
      delete equipmentConfig.testSamples
      console.log('获取的对象', equipmentConfig, this.equipmentConfig.data)
      const data = { equipmentConfig }
      singleUnit(params, data).then((res) => {
        console.log('提交返回的信息', res)
        this.equipmentConfigLoading = false
        if (res.rel) {
          if (res.data) {
            this.runtimeArgs(res.data.runtimeArgs)
          } else {
            this.viewIntervalFun()
          }
        } else {
          this.initArgsInfoData()
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.equipmentConfigLoading = false
      })
    },

    requestWorkModeConfig() {
      const params = {
        deviceId: this.overviewDetail.overview.deviceId,
        deviceName: this.overviewDetail.overview.deviceName
      }
      const data = { workModeConfig: this.workModeConfig.data }
      singleUnit(params, data).then((res) => {
        console.log('提交返回的信息', res)
        this.workModeConfigLoading = false
        if (res.rel) {
          if (res.data) {
            this.runtimeArgs(res.data.runtimeArgs)
          } else {
            this.viewIntervalFun()
          }
        } else {
          this.initArgsInfoData()
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.workModeConfigLoading = false
      })
    },

    requestUnitConfig() {
      const params = {
        deviceId: this.overviewDetail.overview.deviceId,
        deviceName: this.overviewDetail.overview.deviceName
      }
      const data = { unitConfig: this.unitConfig.data }
      console.log(this.unitConfig.recordHoggeryType)
      this.subUnitConfig(data['unitConfig'], this.unitConfig.data.hoggeryType)
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
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.unitConfigLoading = false
      })
    },

    requestLightConfig() {
      const params = {
        deviceId: this.overviewDetail.overview.deviceId,
        deviceName: this.overviewDetail.overview.deviceName
      }
      let next = true
      // console.log('获取的时间内容', this.lightConfig.data)
      this.lightConfig.data.entrys.forEach((item) => {
        // console.log('遍历的内容', item)
        if (item.closeTime == null || item.openTime == null) {
          next = false
          // this.lightConfigLoading = false
          console.log('获取的this指向', this)
          return this.$message.error('时间不能为空')
        }
      })
      console.log('获取的next', next)
      if (next) {
        const data = { lightConfig: this.lightConfig.data }
        singleUnit(params, data).then((res) => {
          console.log('提交返回的信息', res)
          this.lightConfigLoading = false
          if (res.rel) {
            if (res.data) {
              this.runtimeArgs(res.data.runtimeArgs)
            } else {
              this.viewIntervalFun()
            }
          } else {
            this.initArgsInfoData()
            this.$message.error(res.message)
          }
        }).catch(() => {
          this.lightConfigLoading = false
        })
      } else {
        console.log('获取的this指向', this)
        console.log('aaaaaaaaa')
        setTimeout(() => {
          this.lightConfigLoading = false
        }, 0)
      }
    },

    requestFeedConfig() {
      const params = {
        deviceId: this.overviewDetail.overview.deviceId,
        deviceName: this.overviewDetail.overview.deviceName
      }
      const data = { feedConfig: this.feedConfig.data }
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
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.feedConfigLoading = false
      })
    },
    requestSensorConfig() {
      const params = {
        deviceId: this.overviewDetail.overview.deviceId,
        deviceName: this.overviewDetail.overview.deviceName
      }
      const data = { sensorConfig: this.sensorConfig }
      singleUnit(params, data).then((res) => {
        console.log('提交返回的信息', res)
        this.sensorConfigLoading = false
        if (res.rel) {
          if (res.data) {
            this.runtimeArgs(res.data.runtimeArgs)
          } else {
            this.viewIntervalFun()
          }
        } else {
          this.initArgsInfoData()
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.sensorConfigLoading = false
      })
    },

    requestSetEscalationPeriod() {
      const params = {
        deviceId: this.overviewDetail.overview.deviceId,
        deviceName: this.overviewDetail.overview.deviceName
      }
      const data = {
        statusReportPeriod: this.setEscalationPeriod.data.statusReportPeriod
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
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.setEscalationPeriodLoading = false
      })
    },

    requestWindowConfig() {
      const params = {
        deviceId: this.overviewDetail.overview.deviceId,
        deviceName: this.overviewDetail.overview.deviceName
      }
      const data = {
        windowConfig: this.windowConfig.data
      }
      singleUnit(params, data).then((res) => {
        console.log('提交返回的信息', res)
        this.windowConfigLoading = false
        if (res.rel) {
          if (res.data) {
            this.runtimeArgs(res.data.runtimeArgs)
          } else {
            this.viewIntervalFun()
          }
        } else {
          this.initArgsInfoData()
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.windowConfigLoading = false
      })
    },
    singleUnit(val) {
      console.log('依赖注入的信息', this.overviewDetail.overview.statusOnline)
      // console.log('提交的内容singleUnit', this.temperatureControlConfig)
      if (this.overviewDetail.overview && this.overviewDetail.overview.statusOnline !== 0) {
        switch (val) {
          case 'trenchHeat':
            this.$refs.trenchHeat.validate((valid) => {
              if (valid) {
                this.requestTemperatureControlConfig('trenchHeat')
                this.trenchHeat.sendShow = false
                this.trenchHeat.disabled = true
                this.trenchHeatLoading = true
              } else {
                this.$message.error(rulesService.submitErrorTip)
                return false
              }
            })
            break
          case 'constantSpeed':
            this.$refs.constantSpeed.validate((valid) => {
              if (valid) {
                this.requestTemperatureControlConfig('constantSpeed')
                this.constantSpeed.sendShow = false
                this.constantSpeed.disabled = true
                this.constantSpeedLoading = true
              } else {
                this.$message.error(rulesService.submitErrorTip)
                return false
              }
            })
            break
          case 'variableFrequency':
            this.$refs.variableFrequency.validate((valid) => {
              if (valid) {
                this.requestTemperatureControlConfig('variableFrequency')
                this.variableFrequency.sendShow = false
                this.variableFrequency.disabled = true
                this.variableFrequencyLoading = true
              } else {
                this.$message.error(rulesService.submitErrorTip)
                return false
              }
            })
            break
          case 'warmLight':
            this.$refs.warmLight.validate((valid) => {
              if (valid) {
                this.requestTemperatureControlConfig('warmLight')
                this.warmLight.sendShow = false
                this.warmLight.disabled = true
                this.warmLightLoading = true
              } else {
                this.$message.error(rulesService.submitErrorTip)
                return false
              }
            })
            break
          case 'coolingEquipment':
            this.$refs.coolingEquipment.validate((valid) => {
              if (valid) {
                this.requestTemperatureControlConfig('coolingEquipment')
                this.coolingEquipment.sendShow = false
                this.coolingEquipment.disabled = true
                this.coolingEquipmentLoading = true
              } else {
                this.$message.error(rulesService.submitErrorTip)
                return false
              }
            })
            break
          case 'aimTemperatureHumidity':
            this.$refs.aimTemperatureHumidity.validate((valid) => {
              if (valid) {
                this.requestAimTemperatureHumidity()
                this.aimTemperatureHumiditys.sendShow = false
                this.aimTemperatureHumiditys.disabled = true
                this.aimTemperatureHumidityLoading = true
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
          case 'equipmentConfig':
            this.$refs.equipmentConfig.$refs[`overviewBoxForm`].validate((valid) => {
              if (valid) {
                console.log('ssss')
                this.requestEquipmentConfig()
                this.equipmentConfig.sendShow = false
                this.equipmentConfig.fieldList.disabled = true
                this.equipmentConfigLoading = true
              } else {
                this.$message.error(rulesService.submitErrorTip)
                return false
              }
            })
            break
          case 'workModeConfig':
            this.requestWorkModeConfig()
            this.workModeConfig.sendShow = false
            this.workModeConfig.fieldList.disabled = true
            this.workModeConfigLoading = true
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
          case 'lightConfig':
            this.requestLightConfig()
            this.lightConfig.sendShow = false
            this.lightConfig.fieldList.disabled = true
            this.lightConfigLoading = true
            break
          case 'sensorConfig':
            this.$refs.sensorConfig.validate((valid) => {
              if (valid) {
                this.requestSensorConfig()
                this.sensorConfigs.sendShow = false
                this.sensorConfigs.disabled = true
                this.sensorConfigLoading = true
              } else {
                this.$message.error(rulesService.submitErrorTip)
                return false
              }
            })
            break
          case 'setEscalationPeriod':
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
          case 'windowConfig':
            this.$refs.windowConfig.validate((valid) => {
              if (valid) {
                this.requestWindowConfig()
                this.windowConfig.sendShow = false
                this.windowConfig.disabled = true
                this.windowConfigLoading = true
              } else {
                this.$message.error(rulesService.submitErrorTip)
                return false
              }
            })
        }
      } else {
        this.$message.error('当前设备已离线!')
      }
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
    multiUnit() {
      // this.tabStatus = 'unit'
      // console.log('提交的内容', this.temperatureControlConfig)
      console.log('获取的父组件内容', this.overviewDetail)
      this.overviewDetail.progress = 'multiUnit'
    },
    multiFunction() {
      console.log('获取的父组件内容', this.overviewDetail)
      this.overviewDetail.progress = 'multiFunctionSetting'
    },
    // 子组件传值
    childNext(val) {
      console.log(val)
    }
  }
}
</script>
<style lang="scss">
// 布局兼容调整
// flex：1 调整为 width:20%
// 具体的宽度采用calc(40% + 20px)
.el-input__inner{
    height: 40px !important;
    line-height: 40px !important;
  }
.parameter-setting {
  .input-number el-input-number is-controls-right {
    height: 35px;
  }
  .el-input--suffix .el-input__inner {
    padding-right: 0;
  }
  .el-form-item__error {
    padding-top: 0;
  }
  .light-config {
  .overview-box {
    margin-right: 0 !important;
    .add-total-class{
      display: flex;
      flex-wrap: wrap;
      /* justify-content: space-between;
      flex-flow :start; */
    }
    .del-margin-class{
    margin-bottom: 0px!important;
  }
    /* .flex-item {
    width: 40%;
} */
    .time-picker {
      width: auto !important;
    }
    .add-time-class{
      height: 40px;
      min-width: 100px;
      /* max-width: 206px; */
      margin-bottom: 19px;
    }
    .input-number {
      height: 40px;
    }
    .add-input-class{
      min-width: 100px;
      margin-bottom: 15px;
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
    font-size: 21px;
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
  @media screen and (max-width: 1600px) {
.light-config {
 .form-time-item{
   display: inherit !important;
 }
  .overview-box {
    .time-picker {
      width: 140px !important;
  }
  }
}
}
  .option{
    &:hover{
      .waring-icon {
        fill: #90D9FF;
      }
    }
  }
  .row-box{
    margin-left: 0px !important;
    margin-right: 0px;
    .el-col-16{
      padding-left: 0 !important;
    }
    .el-col-8 {
      padding-right: 0 !important;
    }
  }
    .nav{
    // padding-right: 10px;
  }
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
    // color: #ffffff;
    @include font_color('mainFontColor2');
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
    @include background('comfortBackGround');
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
      // background: #162456;
      @include background('mainInputBackGroundColor');
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
      @include border_color('inputBumberBorderColor');
      border-radius: 2px;
      .el-input__inner {
        // background: #162456;
        @include background('mainInputBackGroundColor');
        border: none;
        height: auto;
      }
      .el-input-number__decrease,
      .el-input-number__increase {
        background: transparent;
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
      .el-input-number__increase{
            border-radius: 0 2px 0 0;
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
}

// 表单校验错误提示

.parameter-setting{
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
}
</style>
<style lang="scss" scoped>
.overview-box .el-form-item{
  margin-bottom: 20px;
}
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
        // color: #6e83be;
        @include font_color('viewFontColor3');
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
  // color: #f4f7ff;
  @include font_color('viewFontColor2');
  display: flex;
  align-items: center;
  // margin-bottom: 20px;
  .name {
    margin-left: 10px;
  }
}
.add-time{
  margin-top: 10px;
}
</style>
