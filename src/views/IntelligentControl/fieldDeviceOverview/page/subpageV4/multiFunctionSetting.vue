<template>
  <!-- 多功能编辑 -->
  <div class="multi-function-setting-v4">
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
        <el-row :gutter="10" class="row-box" style="display: flex;">
          <!-- 风机 -->
          <el-col class="col-box" :span="15">
            <div
              class="gather-box"
              style="display: flex;
              flex-direction: column;height: 100%;"
            >
              <div class="overview-panel" style="height: 100%;margin-bottom:10px">
                <el-form ref="trenchHeat" :model="temperatureControlConfig">
                  <div class="box-head">
                    <div class="title">
                      <el-checkbox label="trenchHeat">扰流风机工作参数</el-checkbox>
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
                          <template v-if="childItem.type === 'slot'">
                            <slot :name="'form-' + childItem.key" />
                          </template>
                          <el-input-number
                            v-show="childItem.show !== 1"
                            v-model="
                              temperatureControlConfig[item.key][childItem.key]
                            "
                            :disabled="trenchHeat.disabled"
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
              <div class="overview-panel" style="height: 40%;margin-bottom:10px;">
                <el-form ref="variableFrequency" :model="temperatureControlConfig">
                  <div class="box-head">
                    <div class="title">
                      <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->

                      <el-checkbox label="variableFrequency">变频风机工作参数</el-checkbox>
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
                          <!-- :min="10"
                        :max="50" -->
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                </el-form>
              </div>
              <div class="overview-panel" style="height: 40%;">
                <el-form ref="malleationFrequency" :model="temperatureControlConfig">
                  <div class="box-head">
                    <div class="title">
                      <el-checkbox label="malleationFrequency">正压变频风机工作参数</el-checkbox>
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
            <!-- 定速风机 -->
            <div style="display: flex;flex-direction: column;height: 100%">
              <div v-if="temperatureControlConfig.fixedFan.length > 0" class="overview-panel" style="height: 100%;margin-bottom:10px;">
                <el-form ref="fixedFan" :model="fixedFan">
                  <div class="box-head">
                    <div class="title">
                      <el-checkbox label="fixedFan">定速风机工作参数</el-checkbox>
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
              <!-- 温湿度传感器校准值 -->
              <div class="overview-panel" style="height: 100%;">
                <el-form ref="sensorConfig" :model="sensorConfig">
                  <div class="box-head">
                    <div class="title">
                      <el-checkbox label="sensorConfig">温湿度传感器校准值</el-checkbox>
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
          </el-col>
        </el-row>
        <el-row v-if="temperatureControlConfig.endFan.length > 0" :gutter="10" class="row-box" style="display: flex;">
          <el-col class="col-box" :span="15">
            <div class="overview-panel">
              <el-form ref="coolingEquipment" :model="temperatureControlConfig">
                <div class="box-head">
                  <div class="title">
                    <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
                    <el-checkbox label="coolingEquipment">降温设备工作参数
                    </el-checkbox>
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
            <div class="overview-panel" style="height: 100%;">
              <el-form ref="warmLight" :model="temperatureControlConfig">
                <div class="box-head">
                  <div class="title">
                    <el-checkbox label="warmLight">暖灯伴热带工作参数</el-checkbox>
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
              class="overview-box light-config"
              style="height:100%;"
            >
              <div class="box-head">
                <div class="title">
                  <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
                  <el-checkbox label="deodoriConfig">除臭参数</el-checkbox>
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
              class="overview-box light-config"
              style="height:100%;"
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
                            }else if(v < 0){
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
          <el-col :span="8" style="height:100%;">
            <div
              class="overview-box light-config"
              style="height:100%;"
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
            <!-- 设置报警 -->
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
                  <el-checkbox label="alarmConfig">报警参数</el-checkbox>
                </div>
                <!-- </div> -->
              </template>
            </overview-box>
          </el-col>
          <el-col :span="8" class="col-box">
            <!-- 设置设备 -->
            <overview-box
              ref="equipmentConfig"
              class="overview-box"
              :data="equipmentConfig.data"
              :field-list="equipmentConfig.fieldList"
              style="height:100%"
            >
              <template v-slot:head>
                <!-- <div class="box-head"> -->
                <div class="title">
                  <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
                  <el-checkbox label="equipmentConfig">设备参数</el-checkbox>
                </div>
                <!-- </div> -->
              </template>
              <!-- <template v-slot:body-fot>
                <div class="body-fot">
                  <button v-hasAuth="'fieldDeviceOverview:configParamsSingleUnit_MCU'" class="btn-blue" @click="sensorTesting()">温湿度传感器测试</button>
                </div>
              </template> -->
            </overview-box>
          </el-col>
          <el-col :span="8" class="col-box">
            <!-- 设置单元 -->
            <overview-box
              ref="unitConfig"
              class="overview-box unit-config"
              style="height:100%"
              :data="unitConfig.data"
              :field-list="unitConfig.fieldList"
            >
              <template v-slot:head>
                <!-- <div class="box-head"> -->
                <div class="title">
                  <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
                  <el-checkbox label="unitConfig">单元参数</el-checkbox>
                </div>
                <!-- </div> -->
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
              class="overview-box"
              :data="conditionerSetConfig.data"
              :field-list="conditionerSetConfig.fieldList"
              style="height:100%"
            >
              <template v-slot:head>
                <!-- <div class="box-head"> -->
                <div class="title">
                  <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
                  <el-checkbox label="conditionerSetConfig">空调工作参数</el-checkbox>
                </div>
                <!-- </div> -->
              </template>
            </overview-box>
          </el-col>
          <el-col :span="8" style="height:100%">
            <!-- 风阀工作参数 -->
            <!-- valveConfig -->
            <overview-box
              ref="valveConfig"
              class="overview-box"
              :data="valveConfig.data"
              :field-list="valveConfig.fieldList"
              style="height:100%"
            >
              <template v-slot:head>
                <!-- <div class="box-head"> -->
                <div class="title">
                  <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
                  <el-checkbox label="valveConfig">风阀工作参数</el-checkbox>
                </div>
                <!-- </div> -->
              </template>
            </overview-box>
          </el-col>
          <el-col :span="8">
            <div
              class="gather-box"
              style="height: 100%;    display: flex;
    flex-direction: column;
    justify-content: space-between"
            >
              <div class="overview-box work-mode-config" style="margin-bottom:10px">
                <div class="box-head">
                  <div class="title">
                    <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
                    <!-- 工作模式 -->
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
              <!-- 设置上报周期 -->
              <overview-box
                ref="setEscalationPeriod"
                class="overview-box unit-config"
                :data="setEscalationPeriod.data"
                :field-list="setEscalationPeriod.fieldList"
              >
                <template v-slot:head>
                  <!-- <div class="box-head"> -->
                  <div class="title">
                    <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->

                    <el-checkbox label="setEscalationPeriod">上报周期</el-checkbox>
                  </div>
                  <!-- </div> -->
                </template>
              </overview-box>
            </div>
          </el-col>

        </el-row>

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
  singleUnit
} from '@/http/api/fieldDeviceOverviewV4'
import OverviewBox from '@/views/IntelligentControl/fieldDeviceOverview/common/components/OverviewBox'
import generalForm from '@/components/commonComponent/generalForm'
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
      dialogDtatus: false,
      focusCurrent: '',
      loading: false,
      singleUnitLoading: false,
      dialogLoading: false,
      cur_prg: 0,
      viewInterval: '',
      singleTime: '',
      isRefresh: false,
      progressOptions: ['deodoriConfig', 'fixedFan', 'malleationFrequency', 'conditionerSetConfig', 'valveConfig', 'trenchHeat', 'variableFrequency', 'warmLight', 'coolingEquipment', 'alarmConfig', 'equipmentConfig', 'workModeConfig', 'unitConfig', 'lightConfig', 'feedConfig', 'sensorConfig', 'setEscalationPeriod'],
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
        disabled: false,
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
        disabled: false,
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
        disabled: false,
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
        disabled: false,
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
      // 降温设备
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
          'openTemp': '',
          'closeTemp': '',
          'targetTemp': '',
          workMode: '',
          windState: ''
        },
        fieldList: {
          disabled: false,
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
          disabled: false,
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
              title: '扰流风机报警1',
              key: 'heatExchangeFanMask1',
              type: 'radio',
              optList: [
                { label: '启用', value: 0 },
                { label: '屏蔽', value: 1 }
              ]
            },
            {
              title: '扰流风机报警2',
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
              title: '风阀报警1',
              key: 'valveMask1',
              type: 'radio',
              optList: [
                { label: '启用', value: 0 },
                { label: '屏蔽', value: 1 }
              ]
            },
            {
              title: '风阀报警2',
              key: 'valveMask2',
              type: 'radio',
              optList: [
                { label: '启用', value: 0 },
                { label: '屏蔽', value: 1 }
              ]
            },
            {
              title: '空调报警',
              key: 'conditionMask',
              type: 'radio',
              optList: [
                { label: '启用', value: 0 },
                { label: '屏蔽', value: 1 }
              ]
            },
            {
              title: '除臭报警',
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
      // 设置工作
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
            ...rulesService.limit_0_60,
            controlsPositionRight: 'right'
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
                { label: '公猪舍', value: 7 }
              ]
            },
            // TODO：isShow
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
              label: '猪日龄猪日龄(0-600天)',
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
          disabled: false,
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
          disabled: false,
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
      }
    }
  },
  watch: {
    unitId(newValue, oldValue) {
      this.initData()
      this.initMyDeviceArgsTemplate()
    }
  },
  mounted() {
    console.log('获取的猪舍信息', this.overviewDetail.overview)
    this.initData()
    this.initMyDeviceArgsTemplate()
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
    close() {
      this.dialogDtatus = false
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
        isBind: 1,
        pigCount: '',
        pigDays: '',
        unitNo: 1,
        weight: '',
        homeType: ''
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

    sensorTesting() { // ？？？？
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
      })
    },

    ArgsInfo() {
      ArgsInfo({ deviceId: this.overviewDetail.overview.deviceId }).then(
        (res) => {
          this.temperatureControlConfig = res.data.temperatureControlConfig ? res.data.temperatureControlConfig : this.temperatureControlConfig
          if (res.data.temperatureControlConfig.exchange) { // ???????
            this.temperatureControlConfig.exchange = res.data.temperatureControlConfig.exchange[0]
          }
          if (res.data.temperatureControlConfig.gutter) {
            this.temperatureControlConfig.gutter = res.data.temperatureControlConfig.gutter
          } else {
            this.temperatureControlConfig.gutter = {
              openTemp: '',
              diffTemp: '',
              baseSpeed: '',
              closeTemp: '',
              openDuration: ''
            }
          }
          if (res.data.temperatureControlConfig.infan) {
            this.temperatureControlConfig.infan = res.data.temperatureControlConfig.infan
          } else {
            this.temperatureControlConfig.infan = {
              openTemp: '',
              diffTemp: '',
              baseSpeed: '',
              closeTemp: '',
              openDuration: ''
            }
          }
          if (res.data.temperatureControlConfig.inverterPositive) {
            this.temperatureControlConfig.inverterPositive = res.data.temperatureControlConfig.inverterPositive
          } else {
            this.temperatureControlConfig.inverterPositive = {
              openTemp: '',
              diffTemp: '',
              baseSpeed: '',
              closeTemp: '',
              openDuration: ''
            }
          }
          if (res.data.temperatureControlConfig) {
            const exchange = this.temperatureControlConfig.exchange
            const g2Humidifying = this.temperatureControlConfig.g2Humidifying
            const shower = this.temperatureControlConfig.shower
            exchange.openDuration = exchange.openDuration / 60
            g2Humidifying.closeDuration = g2Humidifying.closeDuration / 60
            shower.closeDuration = shower.closeDuration / 60
            this.temperatureControlConfig.gutter.openDuration = this.temperatureControlConfig.gutter.openDuration / 60
            this.temperatureControlConfig.infan.openDuration = this.temperatureControlConfig.infan.openDuration / 60
          }
          this.alarmConfig.data = res.data.alarmConfig ? res.data.alarmConfig : this.alarmConfig.data
          this.equipmentConfig.data = res.data.equipmentConfig ? res.data.equipmentConfig : this.equipmentConfig.data
          this.workModeConfig.data = res.data.workModeConfig ? res.data.workModeConfig : this.workModeConfig.data
          this.unitConfig.data = res.data.unitConfig ? res.data.unitConfig : this.unitConfig.data
          console.log('获取的设置单元参数', res.data.unitConfig)
          console.log('获取的设置渲染的内容', this.unitConfig)
          if (res.data.lightConfig.entrys.length !== 0) {
            this.lightConfig.data.entrys = res.data.lightConfig.entrys
          }
          if (res.data.feedConfig.entrys.length !== 0) {
            this.feedConfig.data.entrys = res.data.feedConfig.entrys
          }
          if (res.data.deodoriConfig.entrys.length !== 0) {
            this.deodoriConfig.data.entrys = res.data.deodoriConfig.entrys
          }
          this.conditionerSetConfig.data = this.temperatureControlConfig.conditionerSetConfig
          this.valveConfig.data = this.temperatureControlConfig.valveConfig
          this.sensorConfig = res.data.sensorConfig ? res.data.sensorConfig : this.sensorConfig
          this.setEscalationPeriod.data.statusReportPeriod =
        res.data.statusReportPeriod ? res.data.statusReportPeriod : this.setEscalationPeriod.data.statusReportPeriod
          this.loading = false
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

    currentTemplate(item) {
      console.log('获取的模板数据', JSON.parse(item.argsJson))
      const argsJson = JSON.parse(item.argsJson)
      this.template = item.name
      console.log('lodash数据处理', this._.merge(this.temperatureControlConfig, argsJson.temperatureControlConfig))
      console.log('处理后的数据', this.temperatureControlConfig)
      this._.merge(this.temperatureControlConfig, argsJson.temperatureControlConfig)
      const exchange = this.temperatureControlConfig.exchange
      const gutter = this.temperatureControlConfig.gutter
      const shower = this.temperatureControlConfig.shower
      exchange.openDuration = exchange.openDuration / 60
      gutter.openDuration = gutter.openDuration / 60
      shower.closeDuration = shower.closeDuration / 60
      this._.merge(this.alarmConfig.data, argsJson.alarmConfig)
      this._.merge(this.equipmentConfig.data, argsJson.equipmentConfig)
      this.dialogDtatus = false
      this.focusCurrent = item.id
      console.log('当前选择的模板', argsJson)
    },
    addTime() {
      const entrys = this.lightConfig.data.entrys
      if (entrys.length >= 8) {
        return
      } else {
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
    singleUnit() {
      const type = []
      console.log('获取的checkedProgress', this.checkedProgress)
      // 地沟热
      this.checkedProgress.indexOf('trenchHeat') !== -1 ? this.$refs.trenchHeat.validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
      // 变频风机
      this.checkedProgress.indexOf('variableFrequency') !== -1 ? this.$refs.variableFrequency.validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
      // 定速风机
      this.checkedProgress.indexOf('fixedFan') !== -1 ? this.$refs.fixedFan.validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
      // 正压变频风机
      this.checkedProgress.indexOf('malleationFrequency') !== -1 ? this.$refs.malleationFrequency.validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''

      // 暖灯伴热
      this.checkedProgress.indexOf('warmLight') !== -1 ? this.$refs.warmLight.validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
      // 降温设备
      this.checkedProgress.indexOf('coolingEquipment') !== -1 ? this.$refs.coolingEquipment.validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
      // 报警参数
      this.checkedProgress.indexOf('alarmConfig') !== -1 ? this.$refs.alarmConfig.$refs[`overviewBoxForm`].validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
      // 设备参数
      this.checkedProgress.indexOf('equipmentConfig') !== -1 ? this.$refs.equipmentConfig.$refs[`overviewBoxForm`].validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
      // 工作模式
      // 单元参数
      this.checkedProgress.indexOf('unitConfig') !== -1 ? this.$refs.unitConfig.$refs[`overviewBoxForm`].validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
      // 照明开启
      // 温湿度传感器
      this.checkedProgress.indexOf('sensorConfig') !== -1 ? this.$refs.sensorConfig.validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
      // 上报周期
      this.checkedProgress.indexOf('setEscalationPeriod') !== -1 ? this.$refs.setEscalationPeriod.$refs[`overviewBoxForm`].validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
      // 饲喂开启
      this.checkedProgress.indexOf('feedConfig') !== -1 ? this.$refs.feedConfig.validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
      // conditionerSetConfig 空调工作参数
      this.checkedProgress.indexOf('conditionerSetConfig') !== -1 ? this.$refs.conditionerSetConfig.$refs[`overviewBoxForm`].validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
      // valveConfig 风阀工作参数
      this.checkedProgress.indexOf('valveConfig') !== -1 ? this.$refs.valveConfig.$refs[`overviewBoxForm`].validate((valid) => { valid ? type.push(0) : type.push(1); return false }) : ''
      let next = true
      this.lightConfig.data.entrys.forEach((item) => {
        if (item.closeTime == null || item.openTime == null) {
          next = false
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
        const params = {
          deviceId: this.overviewDetail.overview.deviceId,
          deviceName: this.overviewDetail.overview.deviceName
        }
        let data = {}
        if (this.checkedProgress.includes('trenchHeat') || this.checkedProgress.includes('fixedFan') || this.checkedProgress.includes('conditionerSetConfig') || this.checkedProgress.includes('valveConfig') || this.checkedProgress.includes('variableFrequency') || this.checkedProgress.includes('malleationFrequency') || this.checkedProgress.includes('warmLight') || this.checkedProgress.includes('coolingEquipment')) {
          data = {
            temperatureControlConfig: {}
          }
        } else {
          data = {}
        }
        this.checkedProgress.map(item => {
          if (item === 'trenchHeat') {
            const exchange = [temperatureControlConfig.exchange] // 2021-1-25 修改
            const infan = temperatureControlConfig.infan
            const gutter = temperatureControlConfig.gutter
            data['temperatureControlConfig']['exchange'] = exchange
            data['temperatureControlConfig']['infan'] = infan
            data['temperatureControlConfig']['gutter'] = gutter
          } else if (item === 'variableFrequency') {
            data['temperatureControlConfig']['endFan'] = temperatureControlConfig.endFan
          } else if (item === 'malleationFrequency') {
            data['temperatureControlConfig']['inverterPositive'] = temperatureControlConfig.inverterPositive
          } else if (item === 'warmLight') {
            data['temperatureControlConfig']['heatLamp'] = temperatureControlConfig.heatLamp
            data['temperatureControlConfig']['heatBelt'] = temperatureControlConfig.heatBelt
          } else if (item === 'conditionerSetConfig') {
            data['temperatureControlConfig']['conditionerSetConfig'] = temperatureControlConfig.conditionerSetConfig
          } else if (item === 'valveConfig') {
            data['temperatureControlConfig']['valveConfig'] = temperatureControlConfig.valveConfig
          } else if (item === 'coolingEquipment') {
            data['temperatureControlConfig']['shower'] = temperatureControlConfig.shower
            data['temperatureControlConfig']['g2Humidifying'] = temperatureControlConfig.g2Humidifying
          } else if (item === 'alarmConfig') {
            data['alarmConfig'] = this.alarmConfig.data
          } else if (item === 'equipmentConfig') {
            data['equipmentConfig'] = JSON.parse(JSON.stringify(this.equipmentConfig.data))
            delete data['equipmentConfig'].testSamples
          } else if (item === 'workModeConfig') {
            delete this.workModeConfig.data.manualTemp
            data['workModeConfig'] = this.workModeConfig.data
          } else if (item === 'unitConfig') {
            data['unitConfig'] = this.unitConfig.data
            delete data.unitConfig.homeType
          } else if (item === 'lightConfig') {
            data['lightConfig'] = this.lightConfig.data
          } else if (item === 'deodoriConfig') {
            data['deodoriConfig'] = this.deodoriConfig.data
          } else if (item === 'feedConfig') {
            data['feedConfig'] = this.feedConfig.data
          } else if (item === 'sensorConfig') {
            console.log('设备参数设置', this.sensorConfig)
            data['sensorConfig'] = this.sensorConfig
          } else if (item === 'setEscalationPeriod') {
            data['statusReportPeriod'] = this.setEscalationPeriod.data.statusReportPeriod
          } else if (item === 'fixedFan') {
            data['temperatureControlConfig']['fixedFan'] = temperatureControlConfig.fixedFan
          }
        })
        console.log(data, this.sensorConfig)
        this.loading = true
        this.singleUnitLoading = true
        singleUnit(params, data).then((res) => {
          console.log('提交返回的内容+++++++++++')
          console.log(res)
          console.log('提交返回的内容-----------')
          this.loading = false
          this.singleUnitLoading = false
          if (res.rel) {
            if (res.data) {
              this.$message.success('参数设置成功!')
              // TODO:runtimeArgs
              this.temperatureControlConfig =
              res.data.runtimeArgs.temperatureControlConfig
              this.temperatureControlConfig.exchange = res.data.runtimeArgs.temperatureControlConfig.exchange[0]
              const exchange = this.temperatureControlConfig.exchange
              const g2Humidifying = this.temperatureControlConfig.g2Humidifying
              const shower = this.temperatureControlConfig.shower
              exchange.openDuration = exchange.openDuration / 60
              this.temperatureControlConfig.infan.openDuration = this.temperatureControlConfig.infan.openDuration / 60
              this.temperatureControlConfig.gutter.openDuration = this.temperatureControlConfig.gutter.openDuration / 60
              g2Humidifying.closeDuration = g2Humidifying.closeDuration / 60
              shower.closeDuration = shower.closeDuration / 60
              this.alarmConfig.data = res.data.runtimeArgs.alarmConfig
              this.equipmentConfig.data = res.data.runtimeArgs.equipmentConfig
              this.workModeConfig.data = res.data.runtimeArgs.workModeConfig
              this.unitConfig.data = res.data.runtimeArgs.unitConfig
              if (res.data.lightConfig.entrys.length !== 0) {
                this.lightConfig.data.entrys = res.data.lightConfig.entrys
              }
              if (res.data.feedConfig.entrys.length !== 0) {
                this.feedConfig.data.entrys = res.data.feedConfig.entrys
              }
              if (res.data.deodoriConfig.entrys.length !== 0) {
                this.deodoriConfig.data.entrys = res.data.deodoriConfig.entrys
              }
              this.conditionerSetConfig.data = this.temperatureControlConfig.conditionerSetConfig
              this.valveConfig.data = this.temperatureControlConfig.valveConfig
              this.sensorConfig = res.data.runtimeArgs.sensorConfig
              this.setEscalationPeriod.data.statusReportPeriod =
                res.data.runtimeArgs.statusReportPeriod
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
.multi-function-setting-v4{
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
      .el-form{
        display: block;
      }
    }
  }
}

// 表单校验错误提示

.multi-function-setting-v4{
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
.multi-function-setting-v4 {

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

// .multi-function-setting-v4 {
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
            width: 80px;
    min-width: 80px;
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
.add-time{
  margin-top: 10px;
}
</style>
