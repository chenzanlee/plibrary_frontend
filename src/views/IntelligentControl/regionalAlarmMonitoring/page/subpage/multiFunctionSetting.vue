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
        <button
          v-if="template"
          class="btn-border"
          @click="
            template = ''
            overviewDetail.multiFunctionTime = new Date().getTime()
          "
        >
          取消模板
        </button>
        <!-- <el-popover
          placement="top-start"
          popper-class="view-popover"
          width="200"
          trigger="hover"
        >
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
        <el-button class="btn-blue" @click="dialogDtatus = true">选择模板</el-button>
        <el-button class="btn-blue" :loading="singleUnitLoading" @click="singleUnit()">下发指令</el-button>
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
          <!-- <div
            v-for="item in 1000"
            :key="item"
            class="focus-list"
          >
            <div
              class="focus-txt"
            >
              {{ item }}
            </div> -->
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
    <div v-if="template" class="parameter-template">
      <template>
        <div class="name">当前选择模板:</div>
        <div class="current">{{ template }}</div>
      </template>
    </div>
    <div class="allcheckContent">
      <el-checkbox v-model="allChecked" @change="handleCheckAllChange" />全选
    </div>
    <el-checkbox-group v-model="checkedProgress" @change="handleCheckedChange">
      <div v-loading="loading" class="main">
        <el-row :gutter="10" class="row-box" style="display: flex;">
          <el-col class="col-box" :span="16">
            <div class="overview-panel col-box">
              <el-form ref="trenchHeat" :model="temperatureControlConfig">
                <div class="box-head">
                  <div class="title">
                    <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" />
                    地沟热交换工作参数 -->
                    <el-checkbox label="trenchHeat">地沟热交换工作参数</el-checkbox>
                  </div>
                  <!-- <div class="option">
                    <template v-if="!trenchHeat.sendShow">
                      <div
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
                        "
                      >
                        取消
                      </div>
                      <div
                        class="send"
                        @click.stop.prevent="singleUnit('trenchHeat')"
                      >
                        <svg-icon
                          class="waring-icon"
                          icon-class="send-instructions"
                        />
                        发送指令
                      </div>
                    </template>
                  </div> -->
                </div>
                <div class="box-body">
                  <el-row class="form-title" :gutter="10">
                    <el-col :span="4" style="color:rgba(0,0,0,0)">1</el-col>
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
                    <el-col class="label" :span="4">{{ item.label }}</el-col>
                    <el-col
                      v-for="(childItem, index) in item.lists"
                      :key="index"
                      :span="20 / item.lists.length"
                    >
                      <el-form-item
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
                          :min="childItem.min"
                          :max="childItem.max"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </el-form>
            </div>
          </el-col>
          <el-col class="col-box" :span="8">
            <div class="overview-panel" style="height: 100%;">
              <el-form ref="constantSpeed" :model="temperatureControlConfig">
                <div class="box-head">
                  <div class="title">
                    <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
                    <!-- 定速风机工作参数 -->
                    <el-checkbox label="constantSpeed">定速风机工作参数</el-checkbox>
                  </div>
                  <!-- <div class="option">
                    <template v-if="!constantSpeed.sendShow">
                      <div
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
                        "
                      >
                        取消
                      </div>
                      <div
                        class="send"
                        @click.stop.prevent="singleUnit('constantSpeed')"
                      >
                        <svg-icon
                          class="waring-icon"
                          icon-class="send-instructions"
                        />
                        发送指令
                      </div>
                    </template>
                  </div> -->
                </div>
                <div class="box-body">
                  <el-row class="form-title" :gutter="10">
                    <el-col :span="4" style="color:rgba(0,0,0,0)">1</el-col>
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
                    <el-col class="label" :span="4">{{ index + 1 }}</el-col>
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
                                if (v) {
                                  (v > item.closeTemp) ? callback() : callback('必须大于关闭温度!')
                                } else if (v === undefined || v === null || v === '') {
                                  callback('不能为空')
                                } else {
                                  callback()
                                }
                              } else {
                                const v = item.closeTemp
                                if (v) {
                                  (v < item.openTemp) ? callback() : callback('必须小于关闭温度!')
                                } else if (v === undefined || v === null || v === '') {
                                  callback('不能为空')
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
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </el-form>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="row-box" style="display: flex;">
          <el-col class="col-box" :span="16">
            <div class="overview-panel col-box">
              <el-form ref="variableFrequency" :model="temperatureControlConfig">
                <div class="box-head">
                  <div class="title">
                    <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
                    <!-- 变频风机工作参数 -->
                    <el-checkbox label="variableFrequency">变频风机工作参数</el-checkbox>
                  </div>
                  <!-- <div class="option">
                    <template v-if="!variableFrequency.sendShow">
                      <div
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
                        "
                      >
                        取消
                      </div>
                      <div
                        class="send"
                        @click.stop.prevent="singleUnit('variableFrequency')"
                      >
                        <svg-icon
                          class="waring-icon"
                          icon-class="send-instructions"
                        />
                        发送指令
                      </div>
                    </template>
                  </div> -->
                </div>
                <div class="box-body">
                  <el-row class="form-title" :gutter="10">
                    <el-col :span="4" style="color:rgba(0,0,0,0)">1</el-col>
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
                              if (v) {
                                (v < item.lockFreq) ? callback() : callback('必须小于锁定频率!')
                              } else if (v === undefined || v === null || v === '') {
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
                              if (v) {
                                (v > item.baseFreq) ? callback() : callback('必须大于基础频率!')
                              } else if (v === undefined || v === null || v === '') {
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
          </el-col>

          <el-col class="col-box" :span="8">
            <div class="overview-panel" style="height: 100%;">
              <el-form ref="warmLight" :model="temperatureControlConfig">
                <div class="box-head">
                  <div class="title">
                    <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
                    <!-- 暖灯伴热带工作参数 -->
                    <el-checkbox label="warmLight">暖灯伴热带工作参数</el-checkbox>
                  </div>
                  <!-- <div class="option">
                    <template v-if="!warmLight.sendShow">
                      <div
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
                        "
                      >
                        取消
                      </div>
                      <div
                        class="send"
                        @click.stop.prevent="singleUnit('warmLight')"
                      >
                        <svg-icon
                          class="waring-icon"
                          icon-class="send-instructions"
                        />
                        发送指令
                      </div>
                    </template>
                  </div> -->
                </div>
                <div class="box-body">
                  <el-row class="form-title" :gutter="10">
                    <el-col :span="4" style="color:rgba(0,0,0,0)">1</el-col>
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
                    <el-col class="label" :span="4">{{ item.label }}</el-col>
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
                          :min="childItem.min"
                          :max="childItem.max"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </el-form>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="10" class="row-box" style="display: flex;">
          <div class="overview-panel" style="width:100%">
            <el-form ref="coolingEquipment" :model="temperatureControlConfig">
              <div class="box-head">
                <div class="title">
                  <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
                  <!-- 降温设备工作参数 -->
                  <el-checkbox label="coolingEquipment">降温设备工作参数</el-checkbox>
                </div>
                <!-- <div class="option">
                  <template v-if="!coolingEquipment.sendShow">
                    <div
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
                      "
                    >
                      取消
                    </div>
                    <div
                      class="send"
                      @click.stop.prevent="singleUnit('coolingEquipment')"
                    >
                      <svg-icon
                        class="waring-icon"
                        icon-class="send-instructions"
                      />
                      发送指令
                    </div>
                  </template>
                </div> -->
              </div>
              <div class="box-body">
                <el-row class="form-title" :gutter="10">
                  <el-col :span="4" style="color:rgba(0,0,0,0)">1</el-col>
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
                        :min="childItem.min"
                        :max="childItem.max"
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
                </el-row>
              </div>
            </el-form>
          </div>
        </el-row>

        <div class="overview-box-main">
          <overview-box
            ref="alarmConfig"
            class="overview-box"
            :data="alarmConfig.data"
            :field-list="alarmConfig.fieldList"
          >
            <template v-slot:head>
              <!-- <div class="box-head"> -->
              <div class="title">
                <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
                <!-- 报警参数 -->
                <el-checkbox label="alarmConfig">报警参数</el-checkbox>
              </div>
              <!-- <div class="option">
              <template v-if="!alarmConfig.sendShow">
                <div
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
                  "
                >
                  取消
                </div>
                <div class="send" @click.stop.prevent="singleUnit('alarmConfig')">
                  <svg-icon class="waring-icon" icon-class="send-instructions" />
                  发送指令
                </div>
              </template>
            </div> -->
              <!-- </div> -->
            </template>
          </overview-box>

          <overview-box
            ref="equipmentConfig"
            class="overview-box"
            :data="equipmentConfig.data"
            :field-list="equipmentConfig.fieldList"
          >
            <template v-slot:head>
              <!-- <div class="box-head"> -->
              <div class="title">
                <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
                <!-- 设备参数 -->
                <el-checkbox label="equipmentConfig">设备参数</el-checkbox>
              </div>
              <!-- <div class="option">
              <template v-if="!equipmentConfig.sendShow">
                <div
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
                  "
                >
                  取消
                </div>
                <div
                  class="send"
                  @click.stop.prevent="singleUnit('equipmentConfig')"
                >
                  <svg-icon class="waring-icon" icon-class="send-instructions" />
                  发送指令
                </div>
              </template>
            </div> -->
              <!-- </div> -->
            </template>
            <template v-slot:body-fot>
              <div class="body-fot">
                <button class="btn-blue" @click="sensorTesting()">温湿度传感器测试</button>
              </div>
            </template>
          </overview-box>

          <div class="overview-box work-mode-config">
            <div class="box-head">
              <div class="title">
                <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
                <!-- 工作模式 -->
                <el-checkbox label="workModeConfig">工作模式</el-checkbox>
              </div>
              <!-- <div class="option">
              <template v-if="!workModeConfig.sendShow">
                <div
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
                  "
                >
                  取消
                </div>
                <div
                  class="send"
                  @click.stop.prevent="singleUnit('workModeConfig')"
                >
                  <svg-icon class="waring-icon" icon-class="send-instructions" />
                  发送指令
                </div>
              </template>
            </div> -->
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

          <overview-box
            ref="unitConfig"
            class="overview-box unit-config"
            :data="unitConfig.data"
            :field-list="unitConfig.fieldList"
          >
            <template v-slot:head>
              <!-- <div class="box-head"> -->
              <div class="title">
                <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
                <!-- 单元参数 -->
                <el-checkbox label="unitConfig">单元参数</el-checkbox>
              </div>
              <!-- <div class="option">
              <template v-if="!unitConfig.sendShow">
                <div
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
                  "
                >
                  取消
                </div>
                <div class="send" @click.stop.prevent="singleUnit('unitConfig')">
                  <svg-icon class="waring-icon" icon-class="send-instructions" />
                  发送指令
                </div>
              </template>
            </div> -->
              <!-- </div> -->
            </template>
          </overview-box>

          <div
            class="overview-box light-config"
            style="height: calc(100% - 20px);"
          >
            <div class="box-head">
              <div class="title">
                <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
                <!-- 照明开启/关闭时间 -->
                <el-checkbox label="lightConfig">照明开启/关闭时间</el-checkbox>
              </div>
              <!-- <div class="option">
              <template v-if="!lightConfig.sendShow">
                <div
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
                    lightConfig.fieldList.disabl温湿度传感器校准值ed = true
                  "
                >温湿度传感器校准值
                  取消
                </div>
                <div class="send" @click.stop.prevent="singleUnit('lightConfig')">
                  <svg-icon class="waring-icon" icon-class="send-instructions" />
                  发送指令
                </div>
              </template>
            </div> -->
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
          <div v-if="sensorConfig" class="overview-box flex-grow-2">
            <div class="overview-panel" style="height: 100%;">
              <el-form ref="sensorConfig" :model="sensorConfig">
                <div class="box-head">
                  <div class="title">
                    <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
                    <!-- 温湿度传感器校准值 -->
                    <el-checkbox label="sensorConfig">温湿度传感器校准值</el-checkbox>
                  </div>
                  <!-- <div class="option">
                    <template v-if="!sensorConfigs.sendShow">
                      <div
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
                      <el-tooltip
                        class="item"
                        :visible-arrow="false"
                        popper-class="view-tooltip"
                        effect="dark"
                        placement="top-start"
                      >
                        <div slot="content" class="content">
                          发送指令
                          <div class="nabla" />
                        </div>
                        <div
                          class="send"
                          @click.stop.prevent="singleUnit('sensorConfig')"
                        >
                          <svg-icon
                            class="waring-icon"
                            icon-class="send-instructions"
                          />
                        </div>
                      </el-tooltip>
                    </template>
                  </div> -->
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

          <overview-box
            v-if="setEscalationPeriod.data"
            ref="setEscalationPeriod"
            class="overview-box unit-config"
            :data="setEscalationPeriod.data"
            :field-list="setEscalationPeriod.fieldList"
          >
            <template v-slot:head>
              <!-- <div class="box-head"> -->
              <div class="title">
                <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
                <!-- 上报周期 -->
                <el-checkbox label="setEscalationPeriod">上报周期</el-checkbox>
              </div>
              <!-- <div class="option">
                <template v-if="!setEscalationPeriod.sendShow">
                  <div
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
                  <el-tooltip
                    class="item"
                    :visible-arrow="false"
                    popper-class="view-tooltip"
                    effect="dark"
                    placement="top-start"
                  >
                    <div slot="content" class="content">
                      发送指令
                      <div class="nabla" />
                    </div>
                    <div
                      class="send"
                      @click.stop.prevent="singleUnit('setEscalationPeriod')"
                    >
                      <svg-icon
                        class="waring-icon"
                        icon-class="send-instructions"
                      />
                    </div>
                  </el-tooltip>
                </template>
              </div> -->
              <!-- </div> -->
            </template>
          </overview-box>
          <div
            class="overview-box light-config"
            style="height: calc(100% - 20px);"
          >
            <div class="box-head">
              <div class="title">
                <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
                <!-- 饲喂开启时间/开启时长 -->
                <el-checkbox label="feedConfig">饲喂开启时间/开启时长</el-checkbox>
              </div>
              <!-- <div class="option">
                <template v-if="!feedConfig.sendShow">
                  <div
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
                  <el-tooltip
                    class="item"
                    :visible-arrow="false"
                    popper-class="view-tooltip"
                    effect="dark"
                    placement="top-start"
                  >
                    <div slot="content" class="content">
                      发送指令
                      <div class="nabla" />
                    </div>
                    <div
                      class="send"
                      @click.stop.prevent="singleUnit('feedConfig')"
                    >
                      <svg-icon
                        class="waring-icon"
                        icon-class="send-instructions"
                      />
                    </div>
                  </el-tooltip>
                </template>
              </div> -->
            </div>
            <div class="overview-box">
              <el-form
                ref="feedConfig"
                style="    max-height: 500px;
    overflow-y: scroll;"
                :model="feedConfig.entrys"
              >
                <div class="title">
                  开启时间（时/分） / 开启时长（秒）:
                </div>
                <el-form-item
                  v-for="(item, index) in feedConfig.data.entrys"
                  :key="index"
                  :prop="`item.${index}.openDuration`"
                  :rules="[
                    {
                      validator: (rules, value ,callback) => {
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
                  <div class="form-time-item">
                    <el-time-picker
                      v-model="item.openTime"
                      class="time-picker"
                      :disabled="feedConfig.fieldList.disabled"
                      placeholder="开始时间"
                      value-format="HH:mm:ss"
                      format="HH:mm:ss"
                      @change="changePicker"
                    />
                    /
                    <el-input-number
                      v-model="item.openDuration"
                      class="input-number"
                      :disabled="feedConfig.fieldList.disabled"
                      controls-position="right"
                      :min="0"
                    />
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
                </el-form-item>
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
          <div v-if="windowConfig.data" class="overview-box " style="margin:0;margin-left:20px;margin-bottom:20px">
            <el-form ref="windowConfig" :model="windowConfig.data">
              <div class="box-head">
                <div class="title">
                  <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
                  <!-- 风口参数 -->
                  <el-checkbox label="windowConfig">风口参数</el-checkbox>
                </div>
                <!-- <div class="option">
                  <template v-if="!windowConfig.sendShow">
                    <div
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
                    <el-tooltip
                      class="item"
                      :visible-arrow="false"
                      popper-class="view-tooltip"
                      effect="dark"
                      placement="top-start"
                    >
                      <div slot="content" class="content">
                        发送指令
                        <div class="nabla" />
                      </div>
                      <div
                        class="send"
                        @click.stop.prevent="singleUnit('windowConfig')"
                      >
                        <svg-icon
                          class="waring-icon"
                          icon-class="send-instructions"
                        />
                      </div>
                    </el-tooltip>
                  </template>
                </div> -->
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
                      :min="item.min"
                      :max="item.max"
                    />
                  </el-form-item>
                </div>
              </div>
            </el-form>
          </div>
        </div>

      </div>
    </el-checkbox-group>
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
            label-width="180px"
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
          <el-button class="btn-blue" type="primary" :loading="dialogLoading" @click="sensorTestingSub">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  ArgsInfo,
  ArgsInfoV3,
  singleUnit,
  myDeviceArgsTemplate
} from '@/http/api/fieldDeviceOverview'
import OverviewBox from '@/views/IntelligentControl/fieldDeviceOverview/common/components/OverviewBox'
import generalForm from '@/components/commonComponent/generalForm'
import jsontype from './config/formJson.json'
import getFilterTemplate from './config/templateFilter.js'
import rulesService from './utils/verification'
export default {
  components: {
    OverviewBox,
    generalForm
  },
  inject: ['overviewDetail'],
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
      progressOptions: ['trenchHeat', 'constantSpeed', 'variableFrequency', 'warmLight', 'coolingEquipment', 'alarmConfig', 'equipmentConfig', 'workModeConfig', 'unitConfig', 'lightConfig', 'feedConfig', 'sensorConfig', 'setEscalationPeriod', 'windowConfig'],
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

      workModeConfig: {
        sendShow: false,
        data: {
          workMode: '',
          manualTemp: ''
        },
        fieldList: {
          disabled: false,
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
            min: 0,
            max: 60,
            controlsPositionRight: 'right'
          }
        }
      },

      unitConfig: {
        sendShow: false,
        recordHoggeryType: '',
        data: {
          batchNo: '',
          hoggeryType: '',
          isBind: 1,
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
                { label: '保育舍', value: 1 },
                { label: '育肥舍', value: 2 },
                { label: '哺乳舍', value: 3 },
                { label: '怀孕舍', value: 4 },
                { label: '后备舍', value: 5 },
                { label: '公猪舍', value: 6 },
                { label: '待配舍', value: 7 },
                { label: '一体舍', value: 8 }
              ]
            },
            {
              label: '装猪数量',
              key: 'pigCount',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_1800
            },
            {
              label: '猪日龄 ',
              key: 'pigDays',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_600
            },
            {
              label: '单元编号',
              key: 'unitNo',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_800
            },
            {
              label: '母猪胎次',
              key: 'batchNo',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_100
            },
            {
              label: '母猪体重',
              key: 'weight',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_300
            }
          ]
        }
      },

      lightConfig: {
        sendShow: false,
        data: {
          entrys: [{ openTime: '', closeTime: '' }]
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
  mounted() {
    // this.IntelligentControl = this.$store.state.IntelligentControl
    // console.log('获取的状态管理数据', this.IntelligentControl)
    console.log('获取的猪舍信息', this.overviewDetail.overview)
    this.ArgsInfo()
    this.initMyDeviceArgsTemplate()
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
          this.temperatureControlConfig = res.data.temperatureControlConfig
          const exchange = this.temperatureControlConfig.exchange
          const gutter = this.temperatureControlConfig.gutter
          const g2Humidifying = this.temperatureControlConfig.g2Humidifying
          const shower = this.temperatureControlConfig.shower
          exchange.openDuration = exchange.openDuration / 60
          gutter.openDuration = gutter.openDuration / 60
          g2Humidifying.closeDuration = g2Humidifying.closeDuration / 60
          shower.closeDuration = shower.closeDuration / 60
          this.alarmConfig.data = res.data.alarmConfig
          this.equipmentConfig.data = res.data.equipmentConfig
          this.workModeConfig.data = res.data.workModeConfig
          this.unitConfig.data = res.data.unitConfig
          console.log('获取的设置单元参数', res.data.unitConfig)
          this.initUnitConfig(res.data.unitConfig.hoggeryType)
          console.log('获取的设置渲染的内容', this.unitConfig)
          this.lightConfig.data.entrys = res.data.lightConfig.entrys
          this.sensorConfig = res.data.sensorConfig
          this.setEscalationPeriod.data.statusReportPeriod =
        res.data.statusReportPeriod
          this.windowConfig.data = res.data.windowConfig
          console.log('返回的参数信息', res, this.temperatureControlConfig)
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
      exchange.openDuration = exchange.openDuration / 60
      gutter.openDuration = gutter.openDuration / 60
      // g2Humidifying.closeDuration = g2Humidifying.closeDuration / 60
      shower.closeDuration = shower.closeDuration / 60
      // this.alarmConfig.data = argsJson.alarmConfig
      this._.merge(this.alarmConfig.data, argsJson.alarmConfig)
      // this.equipmentConfig.data = argsJson.equipmentConfig
      this._.merge(this.equipmentConfig.data, argsJson.equipmentConfig)

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
        const obj = { openTime: '', closeTime: '' }
        this.lightConfig.data.entrys = [...entrys, obj]
      }
      console.log('时间添加事件', entrys)
    },
    addFeedTime() {
      const entrys = this.feedConfig.data.entrys
      if (entrys.length >= 48) {
        return
      } else {
        const obj = { openTime: '', openDuration: '' }
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
      // console.log('依赖注入的内容', this.overviewDetail)
      // this.overviewDetail.time = new Date().getTime()
      if (this.overviewDetail.overview && this.overviewDetail.overview.statusOnline !== 0) {
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
        const params = {
          deviceId: this.overviewDetail.overview.deviceId,
          deviceName: this.overviewDetail.overview.deviceName
        }
        const data = {
          temperatureControlConfig: {
            ceilingFan: temperatureControlConfig.ceilingFan,
            waterCurtain: temperatureControlConfig.waterCurtain
          }
          // alarmConfig: this.alarmConfig.data,
          // equipmentConfig: this.equipmentConfig.data,
          // workModeConfig: this.workModeConfig.data,
          // unitConfig: this.unitConfig.data,
          // lightConfig: this.lightConfig.data,
          // sensorConfig: this.sensorConfig,
          // statusReportPeriod: this.setEscalationPeriod.data.statusReportPeriod,
          // windowConfig: this.windowConfig.data
        }
        this.checkedProgress.map(item => {
          if (item === 'trenchHeat') {
            data['temperatureControlConfig']['exchange'] = temperatureControlConfig.exchange
            data['temperatureControlConfig']['gutter'] = temperatureControlConfig.gutter
          } else if (item === 'constantSpeed') {
            data['temperatureControlConfig']['fixedFan'] = temperatureControlConfig.fixedFan
          } else if (item === 'variableFrequency') {
            data['temperatureControlConfig']['endFan'] = temperatureControlConfig.endFan
          } else if (item === 'warmLight') {
            data['temperatureControlConfig']['heatLamp'] = temperatureControlConfig.heatLamp
            data['temperatureControlConfig']['heatBelt'] = temperatureControlConfig.heatBelt
          } else if (item === 'coolingEquipment') {
            data['temperatureControlConfig']['shower'] = temperatureControlConfig.shower
            data['temperatureControlConfig']['g2Humidifying'] = temperatureControlConfig.g2Humidifying
          } else if (item === 'alarmConfig') {
            data['alarmConfig'] = this.alarmConfig.data
          } else if (item === 'equipmentConfig') {
            data['equipmentConfig'] = this.equipmentConfig.data
          } else if (item === 'workModeConfig') {
            data['workModeConfig'] = this.workModeConfig.data
          } else if (item === 'unitConfig') {
            data['unitConfig'] = this.unitConfig.data
            this.subUnitConfig(data['unitConfig'], this.unitConfig.recordHoggeryType)
            console.log('提交的单元参数设置', this.subUnitConfig(data['unitConfig'], this.unitConfig.recordHoggeryType))
          } else if (item === 'lightConfig') {
            data['lightConfig'] = this.lightConfig.data
          } else if (item === 'feedConfig') {
            data['feedConfig'] = this.feedConfig.data
          } else if (item === 'sensorConfig') {
            data['sensorConfig'] = this.sensorConfig.data
          } else if (item === 'setEscalationPeriod') {
            data['statusReportPeriod'] = this.setEscalationPeriod.data.statusReportPeriod
          } else if (item === 'windowConfig') {
            data['windowConfig'] = this.windowConfig.data
          }
        })
        console.log(data)
        this.loading = true
        this.singleUnitLoading = true
        singleUnit(params, data).then((res) => {
          console.log('提交返回的内容', res)
          this.loading = false
          this.singleUnitLoading = false
          if (res.rel) {
            if (res.data) {
            // TODO:runtimeArgs
              this.temperatureControlConfig =
              res.data.runtimeArgs.temperatureControlConfig
              const exchange = this.temperatureControlConfig.exchange
              const gutter = this.temperatureControlConfig.gutter
              const g2Humidifying = this.temperatureControlConfig.g2Humidifying
              const shower = this.temperatureControlConfig.shower
              exchange.openDuration = exchange.openDuration / 60
              gutter.openDuration = gutter.openDuration / 60
              g2Humidifying.closeDuration = g2Humidifying.closeDuration / 60
              shower.closeDuration = shower.closeDuration / 60
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
              this.$message.success('参数设置成功!')
            } else {
              this.viewIntervalFun()
            }
          } else {
            this.$message.error(res.message)
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
.multi-function-setting{
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
    color: #cdd8f7;
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
  color: #cdd8f7;
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
