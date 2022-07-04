<template>
  <!-- 单指令下发 -->
  <div class="parameter-setting-v4">
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
        <button v-hasAuth="'fieldDeviceOverview:configParamsSingleUnit_MCU'" class="btn-border" @click="multiFunction()">
          多功能块编辑
        </button>
      </div>
    </div>
    <div v-loading="loading" class="main">
      <el-row :gutter="10" class="row-box" style="display: flex;">
        <el-col class="col-box" :span="15">
          <div
            class="gather-box"
            style="display: flex;flex-direction: column;height: 100%"
          >
            <div v-loading="trenchHeatLoading" class="overview-panel" style="height: 100%;margin-bottom:10px">
              <el-form ref="trenchHeat" :model="temperatureControlConfig">
                <div class="box-head">
                  <div class="title">
                    变速风机工作参数
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
                  <el-row
                    v-for="(item, index) in trenchHeat.labels"
                    :key="index"
                    class="form-body"
                    :gutter="10"
                  >
                    {{ temperatureControlConfig[trenchHeat.labels.key] }}
                    <el-col class="label" :span="4">{{ item.label }}</el-col>
                    <el-col
                      v-for="(childItem, index) in item.lists"
                      :key="index"
                      :span="20 / item.lists.length"
                    >
                      <el-form-item v-if="childItem.type === 'radio'">
                        111
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
                          v-show="childItem.show !== 1"
                          v-model="temperatureControlConfig[item.key][childItem.key]"
                          :disabled="trenchHeat.disabled"
                          :precision="childItem.precision"
                          :step="childItem.step"
                          :controls-position="childItem.controlsPositionRight"
                          :size="childItem.size"
                        />
                        <!-- {{ temperatureControlConfig[item.key][childItem.key] }} -->
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </el-form>
            </div>
            <div v-loading="variableFrequencyLoading" class="overview-panel" style="height: 40%;margin-bottom:10px">
              <el-form ref="variableFrequency" :model="temperatureControlConfig">
                <div class="box-head">
                  <div class="title">
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
                              } else if (v < 10 || v > 60) {
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
                              } else if (v < 1 || v > 10) {
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
                              } else if (v < 15 || v > 50) {
                                callback('取值范围在15-50之间')
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
                              } else if (v < 10 || v > 50) {
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
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </el-form>
            </div>
            <div v-loading="malleationFrequencyLoading" class="overview-panel" style="height: 40%;">
              <el-form ref="malleationFrequency" :model="temperatureControlConfig">
                <div class="box-head">
                  <div class="title">
                    正压变频风机工作参数
                  </div>
                  <div class="option">
                    <template v-if="!malleationFrequency.sendShow">
                      <div
                        v-hasAuth="'fieldDeviceOverview:configParamsSingleUnit_MCU'"
                        class="edit"
                        @click="
                          malleationFrequency.sendShow = true
                          malleationFrequency.disabled = false
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
                          malleationFrequency.sendShow = false
                          malleationFrequency.disabled = true
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
                          @onConfirm="singleUnit('malleationFrequency')"
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
                      v-for="(item, index) in malleationFrequency.titles"
                      :key="index"
                      class="title"
                      :span="20 / malleationFrequency.titles.length"
                    >{{ item }}</el-col>
                  </el-row>
                  <!-- <el-row>
                    <div style="color: red;">
                    {{ temperatureControlConfig.inverterPositive }}
                    </div>
                  </el-row> -->
                  <el-row
                    class="form-body"
                    :gutter="10"
                  >
                    <el-col class="label" :span="4">正压变频风机</el-col>
                    <el-col :span="5">
                      <el-form-item
                        prop="openTemp"
                        :rules="[
                          {
                            validator: (rule, value, callback) => {
                              const v = temperatureControlConfig.inverterPositive.openTemp
                              if (v === undefined || v === null || v === '') {
                                callback('不能为空')
                              } else if (v < 10 || v > 60) {
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
                          v-model="temperatureControlConfig.inverterPositive.openTemp"
                          :precision="1"
                          :step="0.1"
                          :disabled="malleationFrequency.disabled"
                          controls-position="right"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="5">
                      <el-form-item
                        prop="diffTemp"
                        :rules="[
                          {
                            validator: (rule, value, callback) => {
                              const v = temperatureControlConfig.inverterPositive.diffTemp
                              if (v === undefined || v === null || v === '') {
                                callback('不能为空')
                              } else if (v < 1 || v > 10) {
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
                          v-model="temperatureControlConfig.inverterPositive.diffTemp"
                          :precision="1"
                          :step="0.1"
                          :disabled="malleationFrequency.disabled"
                          controls-position="right"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="5">
                      <el-form-item
                        prop="baseFreq"
                        :rules="[
                          {
                            validator: (rule, value, callback) => {
                              const v = temperatureControlConfig.inverterPositive.baseFreq
                              if (v === undefined || v === null || v === '') {
                                callback('不能为空')
                              } else if (v < 15 || v > 50) {
                                callback('取值范围在15-50之间')
                              } else if (v) {
                                (v < temperatureControlConfig.inverterPositive.lockFreq) ? callback() : callback('必须小于锁定频率!')
                              } else {
                                callback()
                              }
                            },
                            trigger: ['blur', 'change']
                          }
                        ]"
                      >
                        <el-input-number
                          v-model="temperatureControlConfig.inverterPositive.baseFreq"
                          :disabled="malleationFrequency.disabled"
                          controls-position="right"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="5">
                      <el-form-item
                        prop="lockFreq"
                        :rules="[
                          {
                            validator: (rule, value, callback) => {
                              const v = temperatureControlConfig.inverterPositive.lockFreq
                              if (v === undefined || v === null || v === '') {
                                callback('不能为空')
                              } else if (v < 10 || v > 50) {
                                callback('取值范围在10-50之间')
                              } else if (v) {
                                (v > temperatureControlConfig.inverterPositive.baseFreq) ? callback() : callback('必须大于基础频率!')
                              } else {
                                callback()
                              }
                            },
                            trigger: ['blur', 'change']
                          }
                        ]"
                      >
                        <el-input-number
                          v-model="temperatureControlConfig.inverterPositive.lockFreq"
                          :disabled="malleationFrequency.disabled"
                          controls-position="right"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </el-form>
            </div>
          </div>
        </el-col>
        <el-col class="col-box" :span="9">
          <div
            class="gather-box"
            style="display: flex;flex-direction: column; height:100%;"
          >
            <div v-if="temperatureControlConfig.fixedFan.length > 0" v-loading="fixedFanLoading" class="overview-panel" style="height: 100%;margin-bottom:10px">
              <el-form ref="fixedFan" :model="temperatureControlConfig">
                <div class="box-head">
                  <div class="title">
                    定速风机工作参数
                  </div>
                  <div class="option">
                    <template v-if="!fixedFan.sendShow">
                      <div
                        v-hasAuth="'fieldDeviceOverview:configParamsSingleUnit_MCU'"
                        class="edit"
                        @click="
                          fixedFan.sendShow = true
                          fixedFan.disabled = false
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
                          fixedFan.sendShow = false
                          fixedFan.disabled = true
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
                          @onConfirm="singleUnit('fixedFan')"
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
                    <el-col class="title-col" :span="8" style="color:rgba(0,0,0,0)">1</el-col>
                    <el-col
                      v-for="(item, index) in fixedFan.titles"
                      :key="index"
                      class="title"
                      :span="16 / fixedFan.titles.length"
                    >{{ item }}</el-col>
                  </el-row>
                  <el-row
                    v-for="(item, index) in temperatureControlConfig.fixedFan"
                    :key="index"
                    class="form-body"
                    :gutter="10"
                  >
                    <el-col class="label" :span="4">风机{{ index + 1 }}</el-col>
                    <el-col :span="8">
                      <el-form-item
                        prop="openTemp"
                        :rules="[
                          {
                            validator: (rule, value, callback) => {
                              const v = item.openTemp
                              if (v === undefined || v === null || v === '') {
                                callback('不能为空')
                              } else if (v < 10 || v > 60) {
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
                          :disabled="fixedFan.disabled"
                          controls-position="right"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item
                        prop="closeTemp"
                        :rules="[
                          {
                            validator: (rule, value, callback) => {
                              const v = item.closeTemp
                              if (v === undefined || v === null || v === '') {
                                callback('不能为空')
                              } else if (v < 10 || v > 60) {
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
                          v-model="item.closeTemp"
                          :precision="1"
                          :step="0.1"
                          :disabled="fixedFan.disabled"
                          controls-position="right"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </el-form>
            </div>
            <div v-loading="sensorConfigLoading" class="overview-panel" style="height: 100%;">
              <el-form ref="sensorConfig" :model="sensorConfig">
                <div class="box-head">
                  <div class="title">
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
                    <el-col :span="3">1</el-col>
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
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </el-form>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="temperatureControlConfig.endFan.length > 0" :gutter="10" class="row-box" style="display: flex;">
        <el-col class="col-box" :span="15">
          <div v-loading="coolingEquipmentLoading" class="overview-panel">
            <el-form ref="coolingEquipment" :model="temperatureControlConfig">
              <div class="box-head">
                <div class="title">
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
        <el-col class="col-box" :span="9">
          <div v-loading="warmLightLoading" class="overview-panel" style="height: 100%;">
            <el-form ref="warmLight" :model="temperatureControlConfig">
              <div class="box-head">
                <div class="title">
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
        </el-col>
      </el-row>

      <el-row :gutter="10" class="row-box">
        <el-col :span="8" class="col-box">
          <div
            v-loading="deodoriConfigLoading"
            class="overview-box light-config"
            style="height:100%;"
          >
            <div class="box-head">
              <div class="title">
                除臭参数
              </div>
              <div class="option">
                <template v-if="!deodoriConfig.sendShow">
                  <div
                    v-hasAuth="'fieldDeviceOverview:configParamsSingleUnit_MCU'"
                    class="edit"
                    @click="
                      deodoriConfig.sendShow = true
                      deodoriConfig.fieldList.disabled = false
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
                      deodoriConfig.sendShow = false
                      deodoriConfig.fieldList.disabled = true
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
                      @onConfirm="singleUnit('deodoriConfig')"
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
              <el-form ref="deodoriConfig" :model="deodoriConfig">
                <div class="title">
                  开启时间（时/分）
                  :
                </div>
                <div v-for="(item,index) in deodoriConfig.data.entrys" :key="index" class="form-time-item add-total-class">
                  <el-form-item class="del-margin-class">
                    <el-time-picker
                      v-model="item.openTime"
                      class="time-picker add-time-class"
                      :disabled="deodoriConfig.fieldList.disabled"
                      placeholder="开始时间"
                      value-format="HH:mm:ss"
                      format="HH:mm:ss"
                      @change="changePicker"
                    />
                  </el-form-item>
                  <div
                    v-if="index !== 0"
                    class="delete"
                    style="font-size: 16px;color: #FF2727;cursor: pointer;margin-left:10px;padding-top:12px"
                    @click="
                      deodoriConfig.fieldList.disabled ? '' : deleteDeodoriTime(index)
                    "
                  >
                    <i class="el-icon-close" />
                  </div>
                </div>
                <div
                  class="add-time"
                  style="font-size: 12px;color: #10AEFF;cursor: pointer;"
                  @click="deodoriConfig.fieldList.disabled ? '' : addDeodoriTime()"
                >
                  添加记录
                </div>
              </el-form>
            </div>
          </div>
        </el-col>
        <el-col class="col-box" :span="8">
          <div
            v-loading="feedConfigLoading"
            class="overview-box light-config"
            style="height:100%;"
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
                style="max-height: 500px;overflow-y: scroll;"
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
        </el-col>
        <el-col :span="8" style="height:100%;">
          <div
            v-loading="lightConfigLoading"
            class="overview-box light-config"
            style="height:100%;"
          >
            <div class="box-head">
              <div class="title">
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
        </el-col>
      </el-row>

      <el-row :gutter="10" class="row-box">
        <el-col :span="8" class="col-box">
          <overview-box
            ref="alarmConfig"
            v-loading="alarmConfigLoading"
            class="overview-box"
            :data="alarmConfig.data"
            :field-list="alarmConfig.fieldList"
          >
            <template v-slot:head>
              <div class="title">
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
            </template>
          </overview-box>
        </el-col>
        <el-col :span="8" class="col-box">
          <overview-box
            ref="equipmentConfig"
            v-loading="equipmentConfigLoading"
            class="overview-box"
            :data="equipmentConfig.data"
            :field-list="equipmentConfig.fieldList"
            style="height:100%"
          >
            <template v-slot:head>
              <div class="title">
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
            </template>
          </overview-box>
        </el-col>
        <el-col :span="8" class="col-box">
          <!-- 设置单元 -->
          <overview-box
            ref="unitConfig"
            v-loading="unitConfigLoading"
            class="overview-box unit-config"
            style="height:100%"
            :data="unitConfig.data"
            :field-list="unitConfig.fieldList"
          >
            <template v-slot:head>
              <div class="title">
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
            </template>
          </overview-box>
        </el-col>
      </el-row>

      <el-row :gutter="10" class="row-box">
        <el-col :span="8" style="height:100%">
          <!-- 空调工作参数 -->
          <!-- conditionerSetConfig -->
          <overview-box
            ref="conditionerSetConfig"
            v-loading="conditionerSetConfigLoading"
            class="overview-box"
            :data="conditionerSetConfig.data"
            :field-list="conditionerSetConfig.fieldList"
            style="height:100%"
          >
            <template v-slot:head>
              <div class="title">
                空调工作参数
              </div>
              <div class="option">
                <template v-if="!conditionerSetConfig.sendShow">
                  <div
                    v-hasAuth="'fieldDeviceOverview:configParamsSingleUnit_MCU'"
                    class="edit"
                    @click="
                      conditionerSetConfig.sendShow = true
                      conditionerSetConfig.fieldList.disabled = false
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
                      conditionerSetConfig.sendShow = false
                      conditionerSetConfig.fieldList.disabled = true
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
                      @onConfirm="singleUnit('conditionerSetConfig')"
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
            </template>
          </overview-box>
        </el-col>
        <el-col :span="8" style="height:100%">
          <!-- 风阀工作参数 -->
          <!-- valveConfig -->
          <overview-box
            ref="valveConfig"
            v-loading="valveConfigLoading"
            class="overview-box"
            :data="valveConfig.data"
            :field-list="valveConfig.fieldList"
            style="height:100%"
          >
            <template v-slot:head>
              <div class="title">
                风阀工作参数
              </div>
              <div class="option">
                <template v-if="!valveConfig.sendShow">
                  <div
                    v-hasAuth="'fieldDeviceOverview:configParamsSingleUnit_MCU'"
                    class="edit"
                    @click="
                      valveConfig.sendShow = true
                      valveConfig.fieldList.disabled = false
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
                      valveConfig.sendShow = false
                      valveConfig.fieldList.disabled = true
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
                      @onConfirm="singleUnit('valveConfig')"
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
        </el-col>
        <el-col :span="8">
          <div
            class="gather-box"
            style="height: 100%;display: flex;flex-direction: column; justify-content: space-between"
          >
            <div v-loading="workModeConfigLoading" class="overview-box work-mode-config" style="margin-bottom:10px">
              <div class="box-head">
                <div class="title">
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
          </div>
        </el-col>
      </el-row>
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
      <div slot="footer" class="dialog-footer">
        <div style="margin:0 auto;" class="addForm overview-panel">
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
          <el-button class="btn-border canleButton" @click="dialogVisible = false">取 消</el-button>
          <el-button class="btn-blue canleButton" type="primary" :loading="dialogLoading" @click="sensorTestingSub">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ArgsInfo, ArgsInfoV3, singleUnit } from '@/http/api/fieldDeviceOverviewV4'
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
      variableFrequencyLoading: false,
      fixedFanLoading: false,
      malleationFrequencyLoading: false,
      aimTemperatureHumidityLoading: false,
      warmLightLoading: false,
      coolingEquipmentLoading: false,
      conditionerSetConfigLoading: false,
      valveConfigLoading: false,
      alarmConfigLoading: false,
      equipmentConfigLoading: false,
      workModeConfigLoading: false,
      unitConfigLoading: false,
      deodoriConfigLoading: false,
      lightConfigLoading: false,
      feedConfigLoading: false,
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
        infan: {
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
        inverterPositive: {
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
        humidity: ''
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
      // 扰流风机 - aaa
      trenchHeat: {
        sendShow: false,
        disabled: true,
        titles: [
          '基础温度（0.1°C）',
          '偏差温度（0.1°C）',
          '最小通风量（%）',
          '间接运行时长（分）',
          '关闭温度（0.1°C）'
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
                ...rulesService.verGreaterThan([10, 60], '<', '必须小于关闭温度!', this, 'temperatureControlConfig', 'exchange', 'closeTemp')
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
                key: 'openDuration',
                controlsPositionRight: 'right',
                ...rulesService.limit_1_10
              },
              {
                key: 'closeTemp',
                controlsPositionRight: 'right',
                precision: 1,
                step: 0.1,
                ...rulesService.verGreaterThan([10, 60], '>', '必须大于基础温度!', this, 'temperatureControlConfig', 'exchange', 'openTemp')
              }
            ]
          },
          {
            label: '扰流',
            key: 'infan',
            lists: [
              {
                key: 'openTemp',
                controlsPositionRight: 'right',
                precision: 1,
                step: 0.1,
                ...rulesService.verGreaterThan([10, 60], '>', '必须大于关闭温度!', this, 'temperatureControlConfig', 'infan', 'closeTemp')
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
                key: 'openDuration',
                controlsPositionRight: 'right',
                ...rulesService.limit_1_10
              },
              {
                key: 'closeTemp',
                controlsPositionRight: 'right',
                precision: 1,
                step: 0.1,
                ...rulesService.verGreaterThan([10, 60], '<', '必须小于基础温度!', this, 'temperatureControlConfig', 'infan', 'openTemp')
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
                step: 0.1
                // ...rulesService.verGreaterThan([10, 60], '>', '必须大于关闭温度!', this, 'temperatureControlConfig', 'exchange', 'closeTemp')
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
                key: 'openDuration',
                controlsPositionRight: 'right',
                ...rulesService.limit_1_10
              },
              {
                show: 1,
                key: 'closeTemp',
                controlsPositionRight: 'right'
                // precision: 1,
                // step: 0.1
                // ...rulesService.verGreaterThan([10, 60], '<', '必须小于基础温度!', this, 'temperatureControlConfig', 'exchange', 'openTemp')
              }
            ]
          }
        ]
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
      // 正压变频风机
      malleationFrequency: {
        sendShow: false,
        disabled: true,
        titles: [
          '基础温度(0.1℃)',
          '偏差温度（0.1°C）',
          '基础频率(Hz)',
          '锁定频率(Hz)'
        ]
      },
      // 定速风机
      fixedFan: {
        sendShow: false,
        disabled: true,
        titles: [
          '开启温度(0.1℃)',
          '关闭温度（0.1°C）'
        ]
      },
      aimTemperatureHumiditys: {
        sendShow: false,
        disabled: true,
        data: {
          temperature: '',
          humidity: ''
        },
        titles: [
          '目标温度(℃)',
          '目标湿度(%)'
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
                ...rulesService.limit_20_30
              },
              {
                key: 'humidity',
                controlsPositionRight: 'right',
                ...rulesService.limit_55_80
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
          '开启温度（0.1°C）',
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
            label: '水帘',
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
          }
          // {
          //   isShow: true,
          //   label: '水帘',
          //   key: 'waterCurtain',
          //   lists: [
          //     {
          //       key: 'openTemp',
          //       type: 'inputNumber',
          //       controlsPositionRight: 'right',
          //       precision: 1,
          //       step: 0.1,
          //       ...rulesService.limit_0_90
          //     },
          //     {
          //       key: 'openDuration',
          //       type: 'inputNumber',
          //       controlsPositionRight: 'right',
          //       ...rulesService.limit_1_600
          //     },
          //     {
          //       key: 'closeDuration',
          //       type: 'inputNumber',
          //       controlsPositionRight: 'right',
          //       ...rulesService.limit_0_60
          //     },
          //     {
          //       key: 'staticMode',
          //       type: 'select',
          //       option: [
          //         { label: '静态', value: true },
          //         { label: '动态', value: false }
          //       ]
          //     }
          //   ]
          // }
        ]
      },
      // 空调工作参数
      conditionerSetConfig: {
        sendShow: false,
        data: {
          openTemp: '',
          closeTemp: '',
          targetTemp: '',
          workMode: '',
          windState: ''
        },
        fieldList: {
          disabled: true,
          head: {
            slot: true
          },
          body: [
            {
              title: '开启温度（0.1°C）',
              key: 'openTemp',
              type: 'inputNumber',
              precision: 1,
              step: 0.1,
              controlsPositionRight: 'right',
              // ...rulesService.limit_10_60
              ...rulesService.verGreaterThan([10, 60], '>', '必须大于关闭温度!', this, 'conditionerSetConfig', 'data', 'closeTemp')
            },
            {
              title: '关闭温度（0.1°C）',
              key: 'closeTemp',
              type: 'inputNumber',
              precision: 1,
              step: 0.1,
              controlsPositionRight: 'right',
              // ...rulesService.limit_10_60
              ...rulesService.verGreaterThan([10, 60], '<', '必须小于开启温度!', this, 'conditionerSetConfig', 'data', 'openTemp')
            },
            {
              title: '目标温度（0.1°C）',
              key: 'targetTemp',
              type: 'inputNumber',
              precision: 1,
              step: 0.1,
              controlsPositionRight: 'right',
              ...rulesService.limit_10_60
            },
            {
              title: '工作模式',
              key: 'workMode',
              type: 'radio',
              optList: [
                { label: '制冷', value: 1 },
                { label: '制热', value: 8 },
                { label: '风扇', value: 4 },
                { label: '自动', value: 16 }
              ]
            },
            {
              title: '风速',
              key: 'windState',
              type: 'radio',
              optList: [
                { label: '低', value: 2 },
                { label: '中', value: 4 },
                { label: '高', value: 8 },
                { label: '自动', value: 128 }
              ]
            }
          ]
        }
      },
      // 风阀工作参数
      valveConfig: {
        sendShow: false,
        data: {
          'openTemp': '',
          'closeTemp': '',
          'autohand': ''
        },
        fieldList: {
          disabled: true,
          head: {
            slot: true
          },
          body: [
            {
              title: '开启温度（0.1°C）',
              key: 'openTemp',
              type: 'inputNumber',
              precision: 1,
              step: 0.1,
              controlsPositionRight: 'right',
              // ...rulesService.limit_10_30
              ...rulesService.verGreaterThan([10, 30], '>', '必须大于关闭温度!', this, 'valveConfig', 'data', 'closeTemp')
            },
            {
              title: '关闭温度（0.1°C）',
              key: 'closeTemp',
              type: 'inputNumber',
              precision: 1,
              step: 0.1,
              controlsPositionRight: 'right',
              // ...rulesService.limit_20_35
              ...rulesService.verGreaterThan([20, 35], '<', '必须小于开启温度!', this, 'valveConfig', 'data', 'openTemp')
            },
            {
              key: 'autohand',
              type: 'radio',
              optList: [
                { label: '自动', value: 0 },
                { label: '手动开', value: 1 },
                { label: '手动关', value: 2 }
              ]
            }
          ]
        }
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
          heatExchangeFanMask1: '',
          heatExchangeFanMask2: '',
          feedMask: '',
          showerMask: '',
          valveMask: '',
          conditionMask: '',
          deodoriMask: ''
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
              title: '断网报警',
              key: 'disconnectedNetMask',
              type: 'radio',
              optList: [
                { label: '启用', value: 0 },
                { label: '屏蔽', value: 1 }
              ]
            },
            // {
            //   title: '地沟风机报警',
            //   key: 'gutterFanMask',
            //   type: 'radio',
            //   optList: [
            //     { label: '启用', value: 0 },
            //     { label: '屏蔽', value: 1 }
            //   ]
            // },
            {
              title: '扰流风机报警屏蔽1',
              key: 'heatExchangeFanMask1',
              type: 'radio',
              optList: [
                { label: '启用', value: 0 },
                { label: '屏蔽', value: 1 }
              ]
            },
            {
              title: '扰流风机报警屏蔽2',
              key: 'heatExchangeFanMask2',
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
            },
            {
              title: '风阀报警屏蔽1',
              key: 'valveMask1',
              type: 'radio',
              optList: [
                { label: '启用', value: 0 },
                { label: '屏蔽', value: 1 }
              ]
            },
            {
              title: '风阀报警屏蔽2',
              key: 'valveMask2',
              type: 'radio',
              optList: [
                { label: '启用', value: 0 },
                { label: '屏蔽', value: 1 }
              ]
            },
            {
              title: '空调报警屏蔽',
              key: 'conditionMask',
              type: 'radio',
              optList: [
                { label: '启用', value: 0 },
                { label: '屏蔽', value: 1 }
              ]
            },
            {
              title: '除臭报警屏蔽',
              key: 'deodoriMask',
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
              { label: '手动', value: 1 },
              { label: '自动温控', value: 2 },
              { label: '空圈', value: 3 },
              { label: '刷圈', value: 4 },
              { label: '转猪', value: 5 },
              { label: '手动温控', value: 6 },
              { label: '安全', value: 7 },
              { label: '应急', value: 8 }
            ]
          },
          manualTemp: {
            precision: 1,
            step: 0.1,
            controlsPositionRight: 'right'
          }
        }
      },
      // 设置单元
      unitConfig: {
        sendShow: false,
        data: {
          batchNo: 1,
          hoggeryType: '', // 猪舍类型
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
                { label: '公猪舍', value: 7 }
              ]
            },
            {
              title: '正负压类型',
              key: 'homeType',
              type: 'radio',

              optList: [
                { label: '负压', value: 1 },
                { label: '正压', value: 2 }
              ]
            },
            {
              label: '装猪数量(0-1800头)',
              key: 'pigCount',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_1800
            },
            {
              label: '猪日龄(0-600天)',
              key: 'pigDays',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_600
            },
            {
              label: '单元编号(0-800)',
              key: 'unitNo',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_800
            },
            // {
            //   title: '扰流风机报警屏蔽1',
            //   key: 'heatExchangeFanMask1',
            //   type: 'radio',
            //   optList: [
            //     { label: '启用', value: 0 },
            //     { label: '屏蔽', value: 1 }
            //   ]
            // },
            // {
            //   label: '母猪胎次(0-100)',
            //   key: 'batchNo',
            //   type: 'inputNumber',
            //   controlsPositionRight: 'right',
            //   ...rulesService.limit_0_100
            // },
            {
              label: '单猪体重(0-300KG)',
              key: 'weight',
              type: 'inputNumber',
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
      // 设置除臭参数
      deodoriConfig: {
        sendShow: false,
        data: {
          entrys: [{ openTime: '08:00:00' }]
        },
        fieldList: {
          disabled: true,
          entrys: []
        }
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
    }
  },
  beforeRouteLeave() {
    this.clearRefreshInterval()
  },
  watch: {
    unitId(newValue, oldValue) {
      // if (this.overviewDetail.overview.segmentName === '公猪') {
      //   this.coolingEquipment.labels[2].isShow = true
      // } else {
      //   this.coolingEquipment.labels[2].isShow = false
      // }
      this.ArgsInfo()
      console.log('监听的单元切换', newValue, oldValue, this.overviewDetail.overview.deviceId)
      console.log('监听的依赖注入内容', this.overviewDetail.overview.segmentName)
    }
  },

  mounted() {
    console.log('依赖注入的信息', this.overviewDetail)
    console.log('时间点的测试', new Date(2016, 9, 10, 18, 40))
    // if (this.overviewDetail.overview.segmentName === '公猪') {
    //   this.coolingEquipment.labels[2].isShow = true
    // } else {
    //   this.coolingEquipment.labels[2].isShow = false
    // }
    this.ArgsInfo()
  },
  methods: {
    log(data) {
      console.log('获取的验证数据', data)
    },
    initUnitConfig(type) { // 初始化 现在类型 4 5 6 8 ？
      if (type) {
        this.unitConfig.recordHoggeryType = type
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
    subUnitConfig(data, type) { // 改函数并未使用
      switch (type) {
        case 4:
          delete data.weight
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
          delete data.weight
          delete data.batchNo
          return data
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
        infan: {
          openTemp: '',
          diffTemp: '',
          baseSpeed: '',
          closeTemp: '',
          openDuration: ''
        },
        inverterPositive: {
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
        homeType: '',
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
    },

    initArgsInfoData() {
      console.log('初始化的内容', this.ArgsInfoData)
      const ArgsInfoData = JSON.parse(JSON.stringify(this.ArgsInfoData))
      this.temperatureControlConfig = ArgsInfoData.temperatureControlConfig ? ArgsInfoData.temperatureControlConfig : this.temperatureControlConfig
      if (ArgsInfoData.temperatureControlConfig.exchange) {
        this.temperatureControlConfig.exchange = ArgsInfoData.temperatureControlConfig.exchange[0]
      }
      if (ArgsInfoData.temperatureControlConfig.endFan && ArgsInfoData.temperatureControlConfig.endFan.length > 0) {
        this.temperatureControlConfig.endFan = ArgsInfoData.temperatureControlConfig.endFan
      } else {
        this.temperatureControlConfig.endFan = [
          {
            baseFreq: '',
            diffTemp: '',
            lockFreq: '',
            openTemp: ''
          }
        ]
      }
      // if (ArgsInfoData.temperatureControlConfig.fixedFan && ArgsInfoData.temperatureControlConfig.fixedFan.length > 0) {
      //   this.temperatureControlConfig.fixedFan = ArgsInfoData.temperatureControlConfig.fixedFan
      // } else {
      //   this.temperatureControlConfig.fixedFan = [
      //     {
      //       openTemp: '',
      //       closeTemp: ''
      //     },
      //     {
      //       openTemp: '',
      //       closeTemp: ''
      //     },
      //     {
      //       openTemp: '',
      //       closeTemp: ''
      //     },
      //     {
      //       openTemp: '',
      //       closeTemp: ''
      //     }
      //   ]
      // }
      if (ArgsInfoData.temperatureControlConfig.infan && ArgsInfoData.temperatureControlConfig.infan !== null) {
        this.temperatureControlConfig.infan = ArgsInfoData.temperatureControlConfig.infan
      } else {
        this.temperatureControlConfig.infan = {
          openTemp: '',
          diffTemp: '',
          baseSpeed: '',
          closeTemp: '',
          openDuration: ''
        }
      }
      if (ArgsInfoData.temperatureControlConfig.inverterPositive && ArgsInfoData.temperatureControlConfig.inverterPositive !== null) {
        this.temperatureControlConfig.inverterPositive = ArgsInfoData.temperatureControlConfig.inverterPositive
      } else {
        this.temperatureControlConfig.inverterPositive = {
          openTemp: '',
          diffTemp: '',
          baseSpeed: '',
          closeTemp: '',
          openDuration: ''
        }
      }
      if (ArgsInfoData.temperatureControlConfig) {
        const exchange = this.temperatureControlConfig.exchange

        const g2Humidifying = this.temperatureControlConfig.g2Humidifying
        const shower = this.temperatureControlConfig.shower
        exchange.openDuration = exchange.openDuration / 60
        g2Humidifying.closeDuration = g2Humidifying.closeDuration / 60
        shower.closeDuration = shower.closeDuration / 60
        this.temperatureControlConfig.gutter.openDuration = this.temperatureControlConfig.gutter.openDuration / 60
        this.temperatureControlConfig.infan.openDuration = this.temperatureControlConfig.infan.openDuration / 60
      }
      this.alarmConfig.data = ArgsInfoData.alarmConfig ? ArgsInfoData.alarmConfig : this.alarmConfig.data
      this.equipmentConfig.data = ArgsInfoData.equipmentConfig ? ArgsInfoData.equipmentConfig : this.equipmentConfig.data
      this.aimTemperatureHumidity = ArgsInfoData.aimTemperatureHumidity ? ArgsInfoData.aimTemperatureHumidity : this.aimTemperatureHumidity
      if (ArgsInfoData.equipmentConfig.outDoorProbe) {
        this.equipmentConfig.data.outDoorProbe.mac = ''
      }
      this.workModeConfig.data = ArgsInfoData.workModeConfig ? ArgsInfoData.workModeConfig : this.workModeConfig.data
      this.unitConfig.data = ArgsInfoData.unitConfig ? ArgsInfoData.unitConfig : this.unitConfig.data
      if (ArgsInfoData.deodoriConfig.entrys.length !== 0) {
        this.deodoriConfig.data.entrys = ArgsInfoData.deodoriConfig.entrys
      }
      if (ArgsInfoData.lightConfig.entrys.length !== 0) {
        this.lightConfig.data.entrys = ArgsInfoData.lightConfig.entrys
      }
      if (ArgsInfoData.feedConfig.entrys.length !== 0) {
        this.feedConfig.data.entrys = ArgsInfoData.feedConfig.entrys
      }
      this.conditionerSetConfig.data = this.temperatureControlConfig.conditionerSetConfig
      this.valveConfig.data = this.temperatureControlConfig.valveConfig
      this.sensorConfig = ArgsInfoData.sensorConfig ? ArgsInfoData.sensorConfig : this.sensorConfig
      this.setEscalationPeriod.data.statusReportPeriod =
        ArgsInfoData.statusReportPeriod ? ArgsInfoData.statusReportPeriod : this.setEscalationPeriod.data.statusReportPeriod
    },
    ArgsInfo() { // 初始化时调用
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
    requestTemperatureControlConfig(type) { // 获取参数
      const params = {
        deviceId: this.overviewDetail.overview.deviceId,
        deviceName: this.overviewDetail.overview.deviceName
      }
      const temperatureControlConfig = JSON.parse(
        JSON.stringify(this.temperatureControlConfig)
      )
      const exchange = temperatureControlConfig.exchange
      const infan = temperatureControlConfig.infan
      const gutter = temperatureControlConfig.gutter
      const g2Humidifying = temperatureControlConfig.g2Humidifying
      const shower = temperatureControlConfig.shower
      exchange.openDuration = exchange.openDuration * 60
      infan.openDuration = infan.openDuration * 60
      gutter.openDuration = gutter.openDuration * 60
      g2Humidifying.closeDuration = g2Humidifying.closeDuration * 60
      shower.closeDuration = shower.closeDuration * 60
      let data = {}
      if (type === 'trenchHeat') {
        const exchange = [temperatureControlConfig.exchange]
        const infan = temperatureControlConfig.infan
        const gutter = temperatureControlConfig.gutter
        data = {
          temperatureControlConfig: {
            exchange,
            infan,
            gutter
          }
        }
      }
      if (type === 'variableFrequency') {
        data = {
          temperatureControlConfig: { endFan: temperatureControlConfig.endFan }
        }
      }
      // 定速风机
      if (type === 'fixedFan') {
        data = {
          temperatureControlConfig: { fixedFan: temperatureControlConfig.fixedFan }
        }
      }
      // 正压变频
      if (type === 'malleationFrequency') {
        data = {
          temperatureControlConfig: { inverterPositive: temperatureControlConfig.inverterPositive }
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
            g2Humidifying: temperatureControlConfig.g2Humidifying
            // waterCurtain: temperatureControlConfig.waterCurtain
          }
        }
      }
      if (type === 'conditionerSetConfig') {
        data = {
          temperatureControlConfig: {
            conditionerSetConfig: this.conditionerSetConfig.data
          }
        }
      }
      if (type === 'valveConfig') {
        data = {
          temperatureControlConfig: {
            valveConfig: this.valveConfig.data
          }
        }
      }
      if (type === 'malleationFrequency') {
        data = {
          temperatureControlConfig: {
            inverterPositive: this.temperatureControlConfig.inverterPositive
          }
        }
      }
      console.log('requestTemperatureControlConfig -> data', data)
      singleUnit(params, data).then((res) => {
        console.log('提交返回的信息', res)
        if (type === 'trenchHeat') {
          this.trenchHeatLoading = false
        } else if (type === 'variableFrequency') {
          this.variableFrequencyLoading = false
        } else if (type === 'fixedFan') {
          this.fixedFanLoading = false
        } else if (type === 'warmLight') {
          this.warmLightLoading = false
        } else if (type === 'coolingEquipment') {
          this.coolingEquipmentLoading = false
        } else if (type === 'conditionerSetConfig') {
          this.conditionerSetConfigLoading = false
        } else if (type === 'valveConfig') {
          this.valveConfigLoading = false
        } else if (type === 'malleationFrequency') {
          this.malleationFrequencyLoading = false
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
        } else if (type === 'variableFrequency') {
          this.variableFrequencyLoading = false
        } else if (type === 'fixedFan') {
          this.fixedFanLoading = false
        } else if (type === 'warmLight') {
          this.warmLightLoading = false
        } else if (type === 'coolingEquipment') {
          this.coolingEquipmentLoading = false
        } else if (type === 'conditionerSetConfig') {
          this.conditionerSetConfigLoading = false
        } else if (type === 'valveConfig') {
          this.valveConfigLoading = false
        } else if (type === 'malleationFrequency') {
          this.malleationFrequencyLoading = false
        }
      })
    },
    requestAimTemperatureHumidity() {
      const params = {
        deviceId: this.overviewDetail.overview.deviceId,
        deviceName: this.overviewDetail.overview.deviceName
      }
      const data = { aimTemperatureHumidity: this.aimTemperatureHumidity }
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
      delete this.workModeConfig.data.manualTemp
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

    requestUnitConfig() { // 单元参数下发
      const params = {
        deviceId: this.overviewDetail.overview.deviceId,
        deviceName: this.overviewDetail.overview.deviceName
      }
      const data = { unitConfig: this.unitConfig.data }
      if (data && data.unitConfig.hoggeryType === 7) { // 公猪舍，干掉 batchNo。
        delete data.unitConfig.batchNo
        delete data.unitConfig.homeType
      }
      // this.subUnitConfig(data['unitConfig'], this.unitConfig.data.hoggeryType)
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
        setTimeout(() => {
          this.lightConfigLoading = false
        }, 0)
      }
    },
    requestDeodoriConfig() {
      const params = {
        deviceId: this.overviewDetail.overview.deviceId,
        deviceName: this.overviewDetail.overview.deviceName
      }
      const data = { deodoriConfig: this.deodoriConfig.data }
      singleUnit(params, data).then((res) => {
        console.log('提交返回的信息', res)
        this.deodoriConfigLoading = false
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
        this.deodoriConfigLoading = false
      })
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

    singleUnit(val) { // 判断下发参数对应的模块。成功后重置对应模块相应的选项框
      console.log('依赖注入的信息=====', this.overviewDetail.overview.statusOnline, val)
      // console.log('提交的内容singleUnit', this.temperatureControlConfig)
      if (this.overviewDetail.overview && this.overviewDetail.overview.statusOnline !== 0) {
        switch (val) {
          case 'trenchHeat':
            this.$refs.trenchHeat.validate((valid) => {
              console.log('扰流风机的验证', valid)
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
            // conditionerSetConfig
          case 'conditionerSetConfig':
            this.$refs.conditionerSetConfig.$refs[`overviewBoxForm`].validate((valid) => {
              if (valid) {
                this.requestTemperatureControlConfig('conditionerSetConfig')
                this.conditionerSetConfig.sendShow = false
                this.conditionerSetConfig.disabled = true
                this.conditionerSetConfigLoading = true
              } else {
                this.$message.error(rulesService.submitErrorTip)
                return false
              }
            })
            break
            // valveConfig
          case 'valveConfig':
            this.$refs.valveConfig.$refs[`overviewBoxForm`].validate((valid) => {
              if (valid) {
                this.requestTemperatureControlConfig('valveConfig')
                this.valveConfig.sendShow = false
                this.valveConfig.disabled = true
                this.valveConfigLoading = true
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
          case 'fixedFan':
            this.$refs.fixedFan.validate((valid) => {
              if (valid) {
                this.requestTemperatureControlConfig('fixedFan')
                this.fixedFan.sendShow = false
                this.fixedFan.disabled = true
                this.fixedFanLoading = true
              } else {
                this.$message.error(rulesService.submitErrorTip)
                return false
              }
            })
            break
          case 'malleationFrequency':
            this.$refs.malleationFrequency.validate((valid) => {
              if (valid) {
                this.requestTemperatureControlConfig('malleationFrequency')
                this.malleationFrequency.sendShow = false
                this.malleationFrequency.disabled = true
                this.malleationFrequencyLoading = true
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
          case 'deodoriConfig':
            // deodoriConfig
            this.requestDeodoriConfig()
            this.deodoriConfig.sendShow = false
            this.deodoriConfig.fieldList.disabled = true
            this.deodoriConfigLoading = true
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
    addDeodoriTime() {
      const entrys = this.deodoriConfig.data.entrys
      if (entrys.length >= 6) {
        return
      } else {
        const obj = { openTime: '' }
        this.deodoriConfig.data.entrys = [...entrys, obj]
      }
    },
    deleteTime(index) {
      console.log('删除元素的索引', index, this.lightConfig.data.entrys)
      this.lightConfig.data.entrys.splice(index, 1)
    },
    deleteFeedTime(index) {
      console.log('删除元素的索引', index, this.feedConfig.data.entrys)
      this.feedConfig.data.entrys.splice(index, 1)
    },
    deleteDeodoriTime(index) {
      console.log('删除元素的索引', index, this.deodoriConfig.data.entrys)
      this.deodoriConfig.data.entrys.splice(index, 1)
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
.parameter-setting-v4 {
  .overview-box-form{
    .box-body{
      .title{
        // color: #cdd8f7;
        @include font_color('mainFontColor11');
      }
    }
  }
  .el-radio__label{
    font-size: 12px;
  }
  .el-form-item__error {
    padding-top: 0;
  }
  .el-input.is-disabled .el-input__inner{
    // background-color: #1d2c4c;
    // border: 1px solid #1d2c4c;
    color: #adadad;
  }
    .light-config {
    .overview-box {
      margin-right: 0 !important;

      .el-form{
        display: block;
      }
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
    .add-total-class{
      display: flex;
      // flex-wrap: wrap;
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
      // height: 40px;
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
.parameter-setting-v4,
.multi-unit-setting,
.multi-function-setting-v4 {
//   @media screen and (max-width: 1600px) {
// .light-config {
//  .form-time-item{
//    display: inherit !important;
//  }
//   .overview-box {
//     .time-picker {
//       width: 140px !important;
//   }
//   }
// }
// }
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
    // .el-col-16{
    //   padding-left: 0 !important;
    // }
    // .el-col-8 {
    //   padding-right: 0 !important;
    // }
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
      // border: 1px solid #cdd8f7;
      @include background('mainInputBackGroundColor');
      background: transparent;
    }
    .el-input__inner {
      // background: #162456;
      @include background('mainInputBackGroundColor');
      border: 1px solid #475a9a;
      border-radius: 2px;
      // color: #cdd8f7;
      @include font_color('mainFontColor11');
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
      // color: #cdd8f7;
      @include font_color('mainFontColor11');
    }
    .el-form-item__content {
    }
  }
}

.work-mode-config,
.light-config {
  .el-input__inner {
    // color: #cdd8f7;
    @include font_color('mainFontColor11');
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

.parameter-setting-v4{
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
}
</style>
<style lang="scss" scoped>

.row-box {
  margin-bottom: 20px;
  width: 100%;
}
.parameter-setting-v4 {
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
  // height: 100%;
  // height: 418px;
  // margin-bottom: 20px;
  // margin-right: 20px;
  // // width: 20%;
  // // width: 320px;
  // flex: 1;
  // min-width: 10%;
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
// .el-radio-group{
//   display: flex;
// }
</style>
