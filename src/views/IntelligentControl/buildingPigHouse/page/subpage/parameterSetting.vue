<template>
  <div class="parameter-setting">
    <div class="nav">
      <div class="refresh">
        <!-- <el-switch
          v-model="isRefresh"
          active-color="#10AEFF"
          inactive-color="#586CA5"
          @change="refresh"
        />
        <div class="name">开启自动刷新</div> -->
      </div>
      <div class="option">
        <!-- <button class="btn-blue" @click="distributionHistory()">下发历史记录</button> -->
        <button v-hasAuth="'buildingPigHouse:multiRoomUnitConfig'" class="btn-blue" @click="multiUnit()">多单元参数设置</button>
        <button v-hasAuth="'buildingPigHouse:unitConfig'" class="btn-border" @click="multiFunction()">
          多功能块编辑
        </button>
      </div>
    </div>
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
            <div class="title">
              <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
              报警参数
            </div>
            <div class="option">
              <template v-if="!alarmConfig.sendShow">
                <div
                  v-hasAuth="'buildingPigHouse:unitConfig'"
                  class="edit"
                  @click="editElement('alarmConfig')"
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
        <!-- 工作模式 -->
        <div v-loading="workModeConfigLoading" class="overview-box work-mode-config">
          <div class="box-head">
            <div class="title">
              <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
              工作模式
            </div>
            <div class="option">
              <template v-if="!workModeConfig.sendShow">
                <div
                  v-hasAuth="'buildingPigHouse:unitConfig'"
                  class="edit"
                  @click="
                    editElement('workModeConfig')
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
                  v-hasAuth="'buildingPigHouse:unitConfig'"
                  class="edit"
                  @click="
                    editElement('unitConfig')
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
                  v-hasAuth="'buildingPigHouse:unitConfig'"
                  class="edit"
                  @click="
                    editElement('setEscalationPeriod')
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
              照明开启/关闭时间
            </div>
            <div class="option">
              <template v-if="!lightConfig.sendShow">
                <div
                  v-hasAuth="'buildingPigHouse:unitConfig'"
                  class="edit"
                  @click="
                    editElement('lightConfig')
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
              <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
              设备参数
            </div>
            <div class="option">
              <template v-if="!deviceConfig.sendShow">
                <div
                  v-hasAuth="'buildingPigHouse:unitConfig'"
                  class="edit"
                  @click="
                    editElement('deviceConfig')
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
                <div
                  class="send"
                >
                  <el-popconfirm
                    title="确定发送指令到设备吗？"
                    @onConfirm="singleUnit('deviceConfig')"
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

        <!-- 喷淋参数设置 -->
        <overview-box
          ref="sprayConfig"
          v-loading="sprayConfigLoading"
          class="overview-box spray-config"
          :data="sprayConfig.data"
          :field-list="sprayConfig.fieldList"
        >

          <template v-slot:head>
            <!-- <div class="box-head"> -->
            <div class="title">
              <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
              喷淋参数
            </div>
            <div class="option">
              <template v-if="!sprayConfig.sendShow">
                <div
                  v-hasAuth="'buildingPigHouse:unitConfig'"
                  class="edit"
                  @click="
                    editElement('sprayConfig')
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
                    sprayConfig.sendShow = false
                    sprayConfig.fieldList.disabled = true
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
                    @onConfirm="singleUnit('sprayConfig')"
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
              <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
              空气调节参数
            </div>
            <div class="option">
              <template v-if="!ariConditioningConfig.sendShow">
                <div
                  v-hasAuth="'buildingPigHouse:unitConfig'"
                  class="edit"
                  @click="
                    editElement('ariConditioningConfig')
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
                    ariConditioningConfig.sendShow = false
                    ariConditioningConfig.fieldList.disabled = true
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
                    @onConfirm="singleUnit('ariConditioningConfig')"
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
              <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
              加热参数
            </div>
            <div class="option">
              <template v-if="!heatDeviceConfig.sendShow">
                <div
                  v-hasAuth="'buildingPigHouse:unitConfig'"
                  class="edit"
                  @click="
                    editElement('heatDeviceConfig')
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
                    heatDeviceConfig.sendShow = false
                    heatDeviceConfig.fieldList.disabled = true
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
                    @onConfirm="singleUnit('heatDeviceConfig')"
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
      <div class="overview-box-main">
        <!-- 温湿度传感器校准值 -->
        <div class="overview-box flex-grow-2" :style="windowConfigs.data.length > 0 ? '' : 'margin-right: 0'">
          <div v-loading="sensorConfigLoading" class="overview-panel" style="height: 100%;">
            <el-form ref="sensorConfigs" :model="sensorConfig">
              <div class="box-head">
                <div class="title">
                  <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
                  温湿度传感器校准值
                </div>
                <div class="option">
                  <template v-if="!sensorConfigs.sendShow">
                    <div
                      v-hasAuth="'buildingPigHouse:unitConfig'"
                      class="edit"
                      @click="
                        editElement('sensorConfigs')
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
                        @onConfirm="singleUnit('sensorConfigs')"
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
                  <el-col :span="3" style="visibility: hidden;">1</el-col>
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
                    v-for="(childItem, l) in item.lists"
                    :key="l"
                    :span="Math.floor(21 / item.lists.length)"
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
                          v-for="(radioItem, k) in childItem.optList"
                          :key="k"
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
        <!-- 滑动窗口设置 -->
        <div v-if="windowConfigs.data.length > 0" class="overview-box flex-grow-1" style="marginRight: 0;">
          <div v-loading="windowConfigsLoading" class="overview-panel" style="height: 100%;">
            <el-form ref="windowConfigs" :model="windowConfigs">
              <div class="box-head">
                <div class="title">
                  <!-- <svg-icon class="waring-icon" icon-class="const-speed-fan" /> -->
                  滑窗参数
                </div>
                <div class="option">
                  <template v-if="!windowConfigs.sendShow">
                    <div
                      v-hasAuth="'buildingPigHouse:unitConfig'"
                      class="edit"
                      @click="
                        editElement('windowConfigs')
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
                        windowConfigs.sendShow = false
                        windowConfigs.disabled = true
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
                        @onConfirm="singleUnit('windowConfigs')"
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

    <!-- <el-dialog
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
          <el-button class="btn-blue canleButton" type="primary" :loading="dialogLoading" @click="sensorTestingSub">确 定</el-button>
        </div>
      </div>
    </el-dialog> -->
    <!-- <munltiUnit
      v-if="tabStatus == 'unit'"
      :fieldId="fieldId"
      @child-next="childNext"
    /> -->
  </div>
</template>

<script>
import { ArgsInfo, singleUnit } from '@/http/api/pigHouse.js'
import OverviewBox from '@/views/IntelligentControl/fieldDeviceOverview/common/components/OverviewBox'
// import generalForm from '@/components/commonComponent/generalForm'
import jsontype from './config/formJson.json'
import rulesService from './utils/verification'
let buildingPigHouseDetail = {}
export default {
  components: {
    OverviewBox
    // generalForm
  },
  inject: ['overviewDetail'],
  props: {
    unitId: String
  },
  data() {
    return {
      unitConfigHoggeryType: null,
      userInfo: localStorage.userJurisdiction,
      // trenchHeatLoading: false,
      // constantSpeedLoading: false,
      // variableFrequencyLoading: false,
      // warmLightLoading: false,
      // coolingEquipmentLoading: false,
      alarmConfigLoading: false,
      // equipmentConfigLoading: false,
      workModeConfigLoading: false,
      unitConfigLoading: false,
      setEscalationPeriodLoading: false,
      lightConfigLoading: false,
      deviceConfigLoading: false,
      sprayConfigLoading: false,
      ariConditioningConfigLoading: false,
      heatDeviceConfigLoading: false,
      // feedConfigLoading: false,
      sensorConfigLoading: false,
      windowConfigsLoading: false,
      // windowConfigLoading: false,
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
      // 设置设备
      ArgsInfoData: {},
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
      // 温湿度数据
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
        indoorCenter: {
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
            // {
            //   title: '地沟风机报警',
            //   key: 'gutterFanMask',
            //   type: 'radio',
            //   optList: [
            //     { label: '启用', value: 0 },
            //     { label: '屏蔽', value: 1 }
            //   ]
            // },
            // {
            //   title: '热交换报警',
            //   key: 'heatExchangeFanMask',
            //   type: 'radio',
            //   optList: [
            //     { label: '启用', value: 0 },
            //     { label: '屏蔽', value: 1 }
            //   ]
            // },
            // {
            //   title: '饲喂报警',
            //   key: 'feedMask',
            //   type: 'radio',
            //   optList: [
            //     { label: '启用', value: 0 },
            //     { label: '屏蔽', value: 1 }
            //   ]
            // },
            // {
            //   title: '喷淋报警',
            //   key: 'showerMask',
            //   type: 'radio',
            //   optList: [
            //     { label: '启用', value: 0 },
            //     { label: '屏蔽', value: 1 }
            //   ]
            // }
          ]
        }
      },

      // 设置工作
      workModeConfig: {
        sendShow: false,
        data: {
          workMode: 0
        },
        fieldList: {
          disabled: true,
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
          hoggeryType: 5,
          sty: 0,
          pigCount: 1800,
          pigDays: 600,
          pos: 1,
          unitNo: 4,
          weight: 0
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
              isShow: true,
              controlsPositionRight: 'right',
              ...rulesService.limit_0_300
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
              label: '上报周期(秒)',
              key: 'statusReportPeriod',
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_10_3600
            }
          ]
        }
      },
      // 设置照明
      lightConfig: {
        sendShow: false,
        data: {
          entrys: [{ openTime: '', closeTime: '' }]
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
          bind: 0,
          emInstallSite: '未安装'
        },
        fieldList: {
          disabled: true,
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
          disabled: true,
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
          disabled: true,
          head: {
            slot: true
          },
          body: [
            {
              label: '下限温度(℃):',
              key: 'lowerTemp',
              type: 'inputNumber',
              precision: 1,
              controlsPositionRight: 'right',
              ...rulesService.limit_15_30
            },
            {
              label: '适宜温度(℃):',
              key: 'suitableTemp',
              type: 'inputNumber',
              precision: 1,
              controlsPositionRight: 'right',
              ...rulesService.limit_20_35
            },
            {
              label: '上限温度(℃):',
              key: 'upperTemp',
              type: 'inputNumber',
              precision: 1,
              controlsPositionRight: 'right',
              ...rulesService.limitControl(20, 40)
            },
            {
              label: '下偏移温度(℃):',
              key: 'lowerAdjustTemp',
              type: 'inputNumber',
              precision: 1,
              controlsPositionRight: 'right',
              ...rulesService.limit_0_5
            },
            {
              label: '上偏移温度(℃):',
              key: 'upperAdjustTemp',
              type: 'inputNumber',
              precision: 1,
              controlsPositionRight: 'right',
              ...rulesService.limit_0_5
            },
            {
              label: '警戒湿度(%):',
              key: 'warningHumi',
              type: 'inputNumber',
              precision: 1,
              controlsPositionRight: 'right',
              ...rulesService.limit_0_100
            },
            {
              label: '下限湿度(%):',
              key: 'lowerHumi',
              type: 'inputNumber',
              precision: 1,
              controlsPositionRight: 'right',
              ...rulesService.limit_0_100
            },
            {
              label: '上限湿度(%):',
              key: 'upperHumi',
              type: 'inputNumber',
              precision: 1,
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
          disabled: true,
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
              controlsPositionRight: 'right',
              ...rulesService.limit_20_50
            },
            {
              label: '关闭温度（单位: ℃）:',
              key: 'closeTemp',
              type: 'inputNumber',
              step: 0.1,
              precision: 1,
              controlsPositionRight: 'right',
              ...rulesService.limit_20_50
            }
          ]
        }
      },
      // 设置温湿度传感器
      sensorConfigs: {
        sendShow: false,
        disabled: true,
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
      // 滑动窗口设置
      windowConfigs: {
        sendShow: false,
        disabled: true,
        data: []
      }
    }
  },
  computed: {
  },
  watch: {
    unitId(newValue, oldValue) {
      this.ArgsInfo()
      // console.log('监听的单元切换', newValue, oldValue, this.overviewDetail.overview.deviceId)
    }
  },
  mounted() {
    this.ArgsInfo()
  },

  methods: {
    log(data) {
      console.log('获取的验证数据', data)
    },
    editElement(t) {
      switch (t) {
        case 'alarmConfig':
          this.alarmConfig.sendShow = true
          this.alarmConfig.fieldList.disabled = false
          break
        case 'workModeConfig':
          this.workModeConfig.sendShow = true
          this.workModeConfig.fieldList.disabled = false
          break
        case 'unitConfig':
          this.unitConfig.sendShow = true
          this.unitConfig.fieldList.disabled = false
          break
        case 'setEscalationPeriod':
          this.setEscalationPeriod.sendShow = true
          this.setEscalationPeriod.fieldList.disabled = false
          break
        case 'lightConfig':
          this.lightConfig.sendShow = true
          this.lightConfig.fieldList.disabled = false
          break
        case 'deviceConfig':
          this.deviceConfig.sendShow = true
          this.deviceConfig.fieldList.disabled = false
          break
        case 'sprayConfig':
          this.sprayConfig.sendShow = true
          this.sprayConfig.fieldList.disabled = false
          break
        case 'ariConditioningConfig':
          this.ariConditioningConfig.sendShow = true
          this.ariConditioningConfig.fieldList.disabled = false
          break
        case 'heatDeviceConfig':
          this.heatDeviceConfig.sendShow = true
          this.heatDeviceConfig.fieldList.disabled = false
          break
        case 'sensorConfigs':
          this.sensorConfigs.sendShow = true
          this.sensorConfigs.disabled = false
          break
        case 'windowConfigs':
          this.windowConfigs.sendShow = true
          this.windowConfigs.disabled = false
          break
        default:
          break
      }
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
            this.unitConfig.fieldList.body[7].isShow = false
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

    sensorTestingSub() {
      const params = {
        deviceId: buildingPigHouseDetail.overview.deviceId,
        deviceName: buildingPigHouseDetail.overview.deviceName
      }
      const data = { equipmentConfig: {
        lockParam: this.formInfo.data.lockParam || '',
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
            this.runtimeArgs(res.data)
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
        sty: 0,
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
        this.unitConfigHoggeryType = ArgsInfoData.unitConfig.hoggeryType
        this.initUnitConfig(ArgsInfoData.unitConfig.hoggeryType)
      }
      // 照明
      if (ArgsInfoData.lightConfig && ArgsInfoData.lightConfig.entrys) {
        this.lightConfig.data.entrys = ArgsInfoData.lightConfig.entrys
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
      // 滑动窗口设置
      if (ArgsInfoData.windowConfigs && ArgsInfoData.windowConfigs.length > 0) {
        const arr = JSON.parse(JSON.stringify(ArgsInfoData.windowConfigs))
        for (const i of arr) {
          i.rules = rulesService.rulesNull
        }
        this.windowConfigs.data = arr
      } else {
        this.windowConfigs.data = []
      }
      // 温湿度
      this.sensorConfig = ArgsInfoData.sensorConfig || {}
      // 上报周期
      this.setEscalationPeriod.data.statusReportPeriod = ArgsInfoData.statusReportPeriod || {}
    },
    ArgsInfo() {
      buildingPigHouseDetail = JSON.parse(sessionStorage.getItem('buildingPigHouseDetail'))
      ArgsInfo({ deviceId: buildingPigHouseDetail.overview.deviceId }).then(
        (res) => {
          if ((res && res.status === 200 || res.rel) && res.data) {
            console.log(res.data, 'res.dataaa')
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
    runtimeArgs(data) {
      this.ArgsInfoData = data
      this.initArgsInfoData()
      this.$message.success('参数设置成功!')
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
          this.$message.success('下发指令成功')
          if (res.data) {
            this.runtimeArgs(res.data)
          } else {
            this.viewIntervalFun()
          }
        } else {
          this.initArgsInfoData()
          this.$message.error(res.message)
        }
      })
    },
    requestEquipmentConfig() {
      const params = {
        deviceId: this.overviewDetail.overview.deviceId,
        deviceName: this.overviewDetail.overview.deviceName
      }
      const equipmentConfig = JSON.parse(JSON.stringify(this.equipmentConfig.data))
      delete equipmentConfig.testSamples
      const data = { equipmentConfig }
      singleUnit(params, data).then((res) => {
        console.log('提交返回的信息', res)
        this.equipmentConfigLoading = false
        if (res.rel) {
          this.$message.success('下发指令成功')
          if (res.data) {
            this.runtimeArgs(res.data)
          } else {
            this.viewIntervalFun()
          }
        } else {
          this.initArgsInfoData()
          this.$message.error(res.message)
        }
      })
    },
    requestWorkModeConfig() {
      const params = {
        deviceId: this.overviewDetail.overview.deviceId,
        deviceName: this.overviewDetail.overview.deviceName
      }
      const workMode = this.workModeConfig.fieldList.workMode.optList.find(item => {
        return item.value === this.workModeConfig.data.workMode
      })
      const data = { workModeConfig: {
        workMode: workMode.value,
        workModeDesc: workMode.label
      }}
      singleUnit(params, data).then((res) => {
        console.log('提交返回的信息', res)
        this.workModeConfigLoading = false
        if (res.rel) {
          this.$message.success('下发指令成功')
          if (res.data) {
            this.runtimeArgs(res.data)
          } else {
            this.viewIntervalFun()
          }
        } else {
          this.initArgsInfoData()
          this.$message.error(res.message)
        }
      })
    },
    requestUnitConfig() {
      this.unitConfig.data.hoggeryTypeDesc ? delete this.unitConfig.data.hoggeryTypeDesc : null
      this.unitConfig.data.posDesc ? delete this.unitConfig.data.posDesc : null
      const params = {
        deviceId: this.overviewDetail.overview.deviceId,
        deviceName: this.overviewDetail.overview.deviceName
      }
      const data = { unitConfig: this.unitConfig.data }
      this.subUnitConfig(data['unitConfig'], this.unitConfig.data.hoggeryType)
      console.log(2222222222, data)
      singleUnit(params, data).then((res) => {
        console.log('提交返回的信息', res)
        this.unitConfigLoading = false
        if (res.rel) {
          this.$message.success('下发指令成功')
          if (res.data) {
            this.runtimeArgs(res.data)
          } else {
            this.viewIntervalFun()
          }
        } else {
          this.initArgsInfoData()
          this.$message.error(res.message)
        }
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
          this.$message.success('下发指令成功')
          if (res.data) {
            this.runtimeArgs(res.data)
          } else {
            this.viewIntervalFun()
          }
        } else {
          this.initArgsInfoData()
          this.$message.error(res.message)
        }
      })
    },
    requestLightConfig() {
      const entrys = this.lightConfig.data.entrys
      const istrue = entrys.some(e => {
        return !e.openTime || !e.closeTime
      })
      if (istrue) {
        this.$message.error('开启和关闭时间不能为空')
        return
      }
      const params = {
        deviceId: this.overviewDetail.overview.deviceId,
        deviceName: this.overviewDetail.overview.deviceName
      }
      const data = { lightConfig: this.lightConfig.data }
      this.lightConfigLoading = true
      singleUnit(params, data).then((res) => {
        this.lightConfigLoading = false
        if (res.rel) {
          this.$message.success('下发指令成功')
          if (res.data) {
            this.runtimeArgs(res.data)
          } else {
            this.viewIntervalFun()
          }
        } else {
          this.initArgsInfoData()
          this.$message.error(res.message)
        }
      })
    },
    requestDeviceConfig() {
      const params = {
        deviceId: this.overviewDetail.overview.deviceId,
        deviceName: this.overviewDetail.overview.deviceName
      }
      const data = { deviceConfig: this.deviceConfig.data }
      singleUnit(params, data).then((res) => {
        console.log('提交返回的信息', res)
        this.deviceConfigLoading = false
        if (res.rel) {
          this.$message.success('下发指令成功')
          if (res.data) {
            this.runtimeArgs(res.data)
          } else {
            this.viewIntervalFun()
          }
        } else {
          this.initArgsInfoData()
          this.$message.error(res.message)
        }
      })
    },
    requestSprayConfig() {
      const params = {
        deviceId: this.overviewDetail.overview.deviceId,
        deviceName: this.overviewDetail.overview.deviceName
      }
      const data = { sprayConfig: this.sprayConfig.data }
      singleUnit(params, data).then((res) => {
        console.log('提交返回的信息', res)
        this.sprayConfigLoading = false
        if (res.rel) {
          this.$message.success('下发指令成功')
          if (res.data) {
            this.runtimeArgs(res.data)
          } else {
            this.viewIntervalFun()
          }
        } else {
          this.initArgsInfoData()
          this.$message.error(res.message)
        }
      })
    },
    requestAriConditioningConfig() {
      const { suitableTemp, upperTemp, upperAdjustTemp, lowerTemp, lowerAdjustTemp } = this.ariConditioningConfig.data
      if (upperTemp < (suitableTemp + upperAdjustTemp)) {
        this.ariConditioningConfigLoading = false
        return this.$message.error('上限温度必须大于适宜温度加上偏移温度')
      }
      if (lowerTemp > (suitableTemp - lowerAdjustTemp)) {
        this.ariConditioningConfigLoading = false
        return this.$message.error('下限温度必须小于适宜温度减偏移温度')
      }
      const params = {
        deviceId: this.overviewDetail.overview.deviceId,
        deviceName: this.overviewDetail.overview.deviceName
      }
      const data = { ariConditioningConfig: this.ariConditioningConfig.data }
      singleUnit(params, data).then((res) => {
        this.ariConditioningConfigLoading = false
        if (res.rel) {
          this.ariConditioningConfig.sendShow = false
          this.ariConditioningConfig.fieldList.disabled = true
          this.$message.success('下发指令成功')
          if (res.data) {
            this.runtimeArgs(res.data)
          } else {
            this.viewIntervalFun()
          }
        } else {
          this.initArgsInfoData()
          this.$message.error(res.message)
        }
      })
    },
    requestHeatDeviceConfig() {
      const params = {
        deviceId: this.overviewDetail.overview.deviceId,
        deviceName: this.overviewDetail.overview.deviceName
      }
      const data = { heatDeviceConfig: this.heatDeviceConfig.data }
      singleUnit(params, data).then((res) => {
        console.log('提交返回的信息', res)
        this.heatDeviceConfigLoading = false
        if (res.rel) {
          this.$message.success('下发指令成功')
          if (res.data) {
            this.runtimeArgs(res.data)
          } else {
            this.viewIntervalFun()
          }
        } else {
          this.initArgsInfoData()
          this.$message.error(res.message)
        }
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
          this.$message.success('下发指令成功')
          if (res.data) {
            this.runtimeArgs(res.data)
          } else {
            this.viewIntervalFun()
          }
        } else {
          this.initArgsInfoData()
          this.$message.error(res.message)
        }
      })
    },
    requestWindowConfigs() {
      const d = JSON.parse(JSON.stringify(this.windowConfigs.data))
      if (d && d.length > 0) {
        for (const i of d) {
          console.log(i)
          i.rules ? delete i.rules : null
        }
      }
      const params = {
        deviceId: this.overviewDetail.overview.deviceId,
        deviceName: this.overviewDetail.overview.deviceName
      }
      const data = { windowConfigs: d }
      singleUnit(params, data).then((res) => {
        console.log('提交返回的信息', res)
        this.windowConfigsLoading = false
        if (res.rel) {
          this.$message.success('下发指令成功')
          if (res.data) {
            this.runtimeArgs(res.data)
          } else {
            this.viewIntervalFun()
          }
        } else {
          this.initArgsInfoData()
          this.$message.error(res.message)
        }
      })
    },

    // requestWindowConfig() {
    //   const params = {
    //     deviceId: this.overviewDetail.overview.deviceId,
    //     deviceName: this.overviewDetail.overview.deviceName
    //   }
    //   const data = {
    //     windowConfig: this.windowConfig.data
    //   }
    //   singleUnit(params, data).then((res) => {
    //     console.log('提交返回的信息', res)
    //     this.windowConfigLoading = false
    //     if (res.rel) {
    //       if (res.data) {
    //         this.runtimeArgs(res.data.runtimeArgs)
    //       } else {
    //         this.viewIntervalFun()
    //       }
    //     } else {
    //       this.initArgsInfoData()
    //       this.$message.error(res.message)
    //     }
    //   })
    // },
    distributionHistory() {
      this.$router.push({
        name: 'orderHistory',
        query: {
          fieldId: this.overviewDetail.overview.fieldId
        }
      })
    },
    singleUnit(val) {
      console.log('依赖注入的信息', this.overviewDetail.overview.statusOnline)
      if (this.overviewDetail.overview && this.overviewDetail.overview.statusOnline !== 0) {
        switch (val) {
          // 设置报警
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
          // 设置工作
          case 'workModeConfig':
            this.requestWorkModeConfig()
            this.workModeConfig.sendShow = false
            this.workModeConfig.fieldList.disabled = true
            this.workModeConfigLoading = true
            break
          // 设置单元
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
          // 设置上报周期
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
          // 设置照明
          case 'lightConfig':
            this.requestLightConfig()
            this.lightConfig.sendShow = false
            this.lightConfig.fieldList.disabled = true
            break
          // 设置设备参数
          case 'deviceConfig':
            this.requestDeviceConfig()
            this.deviceConfig.sendShow = false
            this.deviceConfig.fieldList.disabled = true
            this.deviceConfigLoading = true
            break
          // 设置喷淋
          case 'sprayConfig':
            this.$refs.sprayConfig.$refs[`overviewBoxForm`].validate((valid) => {
              if (valid) {
                this.requestSprayConfig()
                this.sprayConfig.sendShow = false
                this.sprayConfig.fieldList.disabled = true
                this.sprayConfigLoading = true
              } else {
                this.$message.error(rulesService.submitErrorTip)
                return false
              }
            })
            break
          // 空气参数
          case 'ariConditioningConfig':
            this.$refs.ariConditioningConfig.$refs[`overviewBoxForm`].validate((valid) => {
              if (valid) {
                this.ariConditioningConfigLoading = true
                this.requestAriConditioningConfig()
              } else {
                this.$message.error(rulesService.submitErrorTip)
                return false
              }
            })
            break
          // 设置加热
          case 'heatDeviceConfig':
            this.$refs.heatDeviceConfig.$refs[`overviewBoxForm`].validate((valid) => {
              if (valid) {
                this.requestHeatDeviceConfig()
                this.heatDeviceConfig.sendShow = false
                this.heatDeviceConfig.fieldList.disabled = true
                this.heatDeviceConfigLoading = true
              } else {
                this.$message.error(rulesService.submitErrorTip)
                return false
              }
            })
            break
          // 设置温湿度传感器
          case 'sensorConfigs':
            console.log(this)
            this.$refs.sensorConfigs.validate((valid) => {
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
          // 滑动窗口
          case 'windowConfigs':
            this.$refs.windowConfigs.validate((valid) => {
              if (valid) {
                this.requestWindowConfigs()
                this.windowConfigs.sendShow = false
                this.windowConfigs.disabled = true
                this.windowConfigsLoading = true
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
        const obj = { openTime: '', closeTime: '' }
        this.lightConfig.data.entrys = [...entrys, obj]
      }
      console.log('时间添加事件', entrys)
    },
    addFeedTime() {
      const entrys = this.feedConfig.data.entrys
      if (entrys.length >= 8) {
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
    multiUnit() {
      // this.tabStatus = 'unit'
      // console.log('提交的内容', this.temperatureControlConfig)
      console.log('获取的父组件内容', this.overviewDetail)
      this.overviewDetail.isNotEnterMultiUnit = false
      this.overviewDetail.progress = 'multiUnit'
    },
    multiFunction() {
      console.log('获取的父组件内容', this.overviewDetail)
      this.overviewDetail.isNotEnterMultiUnit = false
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
.parameter-setting {
  .overview-box .el-form-item{
    margin-bottom: 12px;
  }
  .win-title {
    font-size: 12px;
    // color: #cdd8f7;
    @include font_color('mainFontColor11');
    line-height: 15px;
     margin-bottom: 10px;
    display: inline-block;
  }
  .input-number .el-input-number .is-controls-right {
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
  // .el-input-number {
  //   width: auto;
  // }
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
      // background: transparent;
    }
    .el-input__inner {
      // background: #162456;
      @include background('mainInputBackGroundColor');
      border: 1px solid #475a9a;
      border: none;
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
      // border: 1px solid #475a9a;
      border-radius: 2px;
      .el-input__inner {
        background: #162456;
        border: none;
      }
      .el-input-number__decrease,
      .el-input-number__increase {
        // background: #162456;
        // @include background('mainInputBackGroundColor');
        border-left: 1px solid #162456;
        // border-bottom: none;
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

.parameter-setting{
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
</style>
