<template>
  <div class="home equipmentParameterTemplate">
    <div v-show="isShow">
      <!-- 头部导航 -->
      <nav-form
        ref="navForm"
        :data="navFormInfo.data"
        :field-list="navFormInfo.fieldList"
      />
      <!-- 表格内容 -->
      <tablePage
        ref="tablePage"
        :is-loading="isLoading"
        :columns="columns"
        :data-source="tableData"
        :options="options"
        :fetch="fetchTableData"
        :pagination="pagination"
        @handleSizeChange="handleSizeChange"
        @handleIndexChange="handleIndexChange"
        @selection-change="handleSelectionChange"
        @child-seeRow="childSeeRow"
        @child-removeRow="childRemoveRow"
        @child-editRow="childEditRow"
      />
    </div>
    <!-- 修改 -->
    <div v-show="!isShow" class="homeTwo">
      <div class="detailForm">
        <edit-form
          ref="detailForm"
          :data="detailFormInfo.data"
          :field-list="detailFormInfo.fieldList"
        />
      </div>
      <el-form ref="ruleForm" :model="argsJson" :rules="rules" :inline="true" class="demo-ruleForm">
        <div>
          <div class="main-content">
            <div class="main-item">
              <div class="equipTemMain">
                <div>
                  <h3 class="title title9">地沟热交换工作参数</h3>
                </div>
                <div class="top">
                  <span>基础温度(0.1°C)</span>
                  <span>偏差温度(0.1°C)</span>
                  <span>最小通风量(%)</span>
                  <span>关闭温度(0.1°C)</span>
                  <span>间歇运行时长(s)</span>
                </div>
                <div class="two">
                  <span>热交换</span>
                  <el-form-item prop="exchangeOpenTemp" class="inputNumber5">
                    <el-input-number
                      v-model="argsJson.temperatureControlConfig.exchange.openTemp"
                      :disabled="type == 'detail'"
                      size="mini"
                      controls-position="right"
                      :precision="1"
                      :max="60"
                      :min="10"
                      :step="0.1"
                    />
                  </el-form-item>
                  <el-form-item class="inputNumber5">
                    <el-input-number
                      v-model="argsJson.temperatureControlConfig.exchange.diffTemp"
                      :disabled="type == 'detail'"
                      size="mini"
                      controls-position="right"
                      :precision="1"
                      :max="10"
                      :min="1"
                      :step="0.1"
                    />
                  </el-form-item>
                  <el-form-item class="inputNumber5">
                    <el-input-number
                      v-model="argsJson.temperatureControlConfig.exchange.baseSpeed"
                      :disabled="type == 'detail'"
                      size="mini"
                      controls-position="right"
                      :max="100"
                      :min="10"
                      :step="1"
                    />
                  </el-form-item>
                  <el-form-item prop="exchangeCloseTemp" class="inputNumber5">
                    <el-input-number
                      v-model="argsJson.temperatureControlConfig.exchange.closeTemp"
                      :disabled="type == 'detail'"
                      size="mini"
                      controls-position="right"
                      :precision="1"
                      :max="60"
                      :min="10"
                      :step="0.1"
                    />
                  </el-form-item>
                  <el-form-item class="inputNumber5">
                    <el-input-number
                      v-model="argsJson.temperatureControlConfig.exchange.openDuration"
                      :disabled="type == 'detail'"
                      size="mini"
                      controls-position="right"
                      :max="600"
                      :min="60"
                      :step="1"
                    />
                  </el-form-item>
                </div>
                <div class="three">
                  <span>地沟</span>
                  <el-form-item prop="gutterOpenTemp" class="inputNumber5">
                    <el-input-number
                      v-model="argsJson.temperatureControlConfig.gutter.openTemp"
                      :disabled="type == 'detail'"
                      size="mini"
                      controls-position="right"
                      :precision="1"
                      :max="60"
                      :min="10"
                      :step="0.1"
                    />
                  </el-form-item>
                  <el-form-item class="inputNumber5">
                    <el-input-number
                      v-model="argsJson.temperatureControlConfig.gutter.diffTemp"
                      :disabled="type == 'detail'"
                      size="mini"
                      controls-position="right"
                      :precision="1"
                      :max="10"
                      :min="1"
                      :step="0.1"
                    />
                  </el-form-item>
                  <el-form-item class="inputNumber5">
                    <el-input-number
                      v-model="argsJson.temperatureControlConfig.gutter.baseSpeed"
                      :disabled="type == 'detail'"
                      size="mini"
                      controls-position="right"
                      :max="100"
                      :min="10"
                      :step="1"
                    />
                  </el-form-item>
                  <el-form-item prop="gutterCloseTemp" class="inputNumber5">
                    <el-input-number
                      v-model="argsJson.temperatureControlConfig.gutter.closeTemp"
                      :disabled="type == 'detail'"
                      size="mini"
                      controls-position="right"
                      :precision="1"
                      :max="60"
                      :min="10"
                      :step="0.1"
                    />
                  </el-form-item>
                  <el-form-item class="inputNumber5">
                    <el-input-number
                      v-model="argsJson.temperatureControlConfig.gutter.openDuration"
                      :disabled="type == 'detail'"
                      size="mini"
                      controls-position="right"
                      :max="600"
                      :min="60"
                      :step="1"
                    />
                  </el-form-item>
                </div>
              </div>
            </div>
            <div class="main-item">
              <div class="equipTemMain con1">
                <h3 class="title title8">端部变频工作参数</h3>
                <div class="top">
                  <span>基础温度(0.1°C)</span>
                  <span>偏差温度(0.1°C)</span>
                  <span>基础频率(Hz)</span>
                  <span>锁定频率(Hz)</span>
                </div>
                <div class="two">
                  <span>端部1</span>
                  <el-input-number
                    v-model="argsJson.temperatureControlConfig.endFan[0].openTemp"
                    :disabled="type == 'detail'"
                    class="inputNumberMini"
                    size="mini"
                    controls-position="right"
                    :precision="1"
                    :max="60"
                    :min="10"
                    :step="0.1"
                  />
                  <el-input-number
                    v-model="argsJson.temperatureControlConfig.endFan[0].diffTemp"
                    :disabled="type == 'detail'"
                    class="inputNumberMini"
                    size="mini"
                    controls-position="right"
                    :precision="1"
                    :max="10"
                    :min="1"
                    :step="0.1"
                  />
                  <el-input-number
                    v-model="argsJson.temperatureControlConfig.endFan[0].baseFreq"
                    :disabled="type == 'detail'"
                    class="inputNumberMini"
                    size="mini"
                    controls-position="right"
                    :max="50"
                    :min="20"
                    :step="1"
                  />
                  <el-input-number
                    v-model="argsJson.temperatureControlConfig.endFan[0].lockFreq"
                    :disabled="type == 'detail'"
                    class="inputNumberMini"
                    size="mini"
                    controls-position="right"
                    :max="50"
                    :min="10"
                    :step="1"
                  />
                </div>
                <div class="three" style="margin-top: 20px">
                  <span>端部2</span>
                  <el-input-number
                    v-model="argsJson.temperatureControlConfig.endFan[1].openTemp"
                    :disabled="type == 'detail'"
                    class="inputNumberMini"
                    size="mini"
                    controls-position="right"
                    :precision="1"
                    :max="60"
                    :min="10"
                    :step="0.1"
                  />
                  <el-input-number
                    v-model="argsJson.temperatureControlConfig.endFan[1].diffTemp"
                    :disabled="type == 'detail'"
                    class="inputNumberMini"
                    size="mini"
                    controls-position="right"
                    :precision="1"
                    :max="10"
                    :min="1"
                    :step="0.1"
                  />
                  <el-input-number
                    v-model="argsJson.temperatureControlConfig.endFan[1].baseFreq"
                    :disabled="type == 'detail'"
                    class="inputNumberMini"
                    size="mini"
                    controls-position="right"
                    :max="50"
                    :min="20"
                    :step="1"
                  />
                  <el-input-number
                    v-model="argsJson.temperatureControlConfig.endFan[1].lockFreq"
                    :disabled="type == 'detail'"
                    class="inputNumberMini"
                    size="mini"
                    controls-position="right"
                    :max="50"
                    :min="10"
                    :step="1"
                  />
                </div>
                <div class="four" style="margin-top: 20px">
                  <span>端部3</span>
                  <el-input-number
                    v-model="argsJson.temperatureControlConfig.endFan[2].openTemp"
                    :disabled="type == 'detail'"
                    class="inputNumberMini"
                    size="mini"
                    controls-position="right"
                    :precision="1"
                    :max="60"
                    :min="10"
                    :step="0.1"
                  />
                  <el-input-number
                    v-model="argsJson.temperatureControlConfig.endFan[2].diffTemp"
                    :disabled="type == 'detail'"
                    class="inputNumberMini"
                    size="mini"
                    controls-position="right"
                    :precision="1"
                    :max="10"
                    :min="1"
                    :step="0.1"
                  />
                  <el-input-number
                    v-model="argsJson.temperatureControlConfig.endFan[2].baseFreq"
                    :disabled="type == 'detail'"
                    class="inputNumberMini"
                    size="mini"
                    controls-position="right"
                    :max="50"
                    :min="20"
                    :step="1"
                  />
                  <el-input-number
                    v-model="argsJson.temperatureControlConfig.endFan[2].lockFreq"
                    :disabled="type == 'detail'"
                    class="inputNumberMini"
                    size="mini"
                    controls-position="right"
                    :max="50"
                    :min="10"
                    :step="1"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="main-content">
            <div class="main-item main-item-textAlign">
              <div class="equipTemMain main1">
                <h3 class="title title6">设置报警参数</h3>
                <p class="main1Top">高温报警值(°C)</p>
                <el-input-number
                  v-model="argsJson.alarmConfig.high"
                  :disabled="type == 'detail'"
                  class="inputNumberBig"
                  size="mini"
                  controls-position="right"
                  :precision="1"
                  :max="60"
                  :min="-40"
                  :step="0.1"
                />
                <p>低温报警值(°C)</p>
                <el-input-number
                  v-model="argsJson.alarmConfig.low"
                  :disabled="type == 'detail'"
                  class="inputNumberBig"
                  size="mini"
                  controls-position="right"
                  :precision="1"
                  :max="60"
                  :min="-40"
                  :step="0.1"
                />
                <p>温差报警值(°C)</p>
                <el-input-number
                  v-model="argsJson.alarmConfig.delta"
                  :disabled="type == 'detail'"
                  class="inputNumberBig"
                  size="mini"
                  controls-position="right"
                  :precision="1"
                  :max="60"
                  :min="-40"
                  :step="0.1"
                />
                <p v-if="detailFormInfo.data.deviceVersionId === '6rtsy5euo02HjIIhBEOmox'">高湿度报警值(%)</p>
                <el-input-number
                  v-if="detailFormInfo.data.deviceVersionId === '6rtsy5euo02HjIIhBEOmox'"
                  v-model="argsJson.alarmConfig.highHumiALarmThreshold"
                  :disabled="type == 'detail'"
                  class="inputNumberBig"
                  size="mini"
                  controls-position="right"
                  :precision="1"
                  :max="95"
                  :min="75"
                  :step="0.1"
                />
                <div class="main1-content">
                  <div class="main1-item">
                    <p>断网报警</p>
                    <div class="radio-content">
                      <el-radio v-model="argsJson.alarmConfig.disconnectedNetMask" label="0">不屏蔽</el-radio>
                      <el-radio v-model="argsJson.alarmConfig.disconnectedNetMask" label="1">屏蔽</el-radio>
                    </div>
                  </div>
                  <div class="main1-item">
                    <p>地沟风机报警</p>
                    <div class="radio-content">
                      <el-radio v-model="argsJson.alarmConfig.gutterFanMask" label="0">不屏蔽</el-radio>
                      <el-radio v-model="argsJson.alarmConfig.gutterFanMask" label="1">屏蔽</el-radio>
                    </div>
                  </div>
                  <div class="main1-item">
                    <p>热交换报警</p>
                    <div class="radio-content">
                      <el-radio v-model="argsJson.alarmConfig.heatExchangeFanMask" label="0">不屏蔽</el-radio>
                      <el-radio v-model="argsJson.alarmConfig.heatExchangeFanMask" label="1">屏蔽</el-radio>
                    </div>
                  </div>
                  <div class="main1-item">
                    <p>饲喂报警</p>
                    <div class="radio-content">
                      <el-radio v-model="argsJson.alarmConfig.feedMask" label="0">不屏蔽</el-radio>
                      <el-radio v-model="argsJson.alarmConfig.feedMask" label="1">屏蔽</el-radio>
                    </div>
                  </div>
                  <div class="main1-item">
                    <p>喷淋报警</p>
                    <div class="radio-content">
                      <el-radio v-model="argsJson.alarmConfig.showerMask" label="0">不屏蔽</el-radio>
                      <el-radio v-model="argsJson.alarmConfig.showerMask" label="1">屏蔽</el-radio>
                    </div>
                  </div>
                </div>
                <!-- <p>地沟风机报警屏蔽</p>
                <div class="radio-content">
                  <el-radio v-model="argsJson.alarmConfig.disconnectedNetMask" label="0">不屏蔽</el-radio>
                  <el-radio v-model="argsJson.alarmConfig.disconnectedNetMask" label="1">屏蔽</el-radio>
                </div>
                <p>热交换报警</p>
                <div class="radio-content">
                  <el-radio v-model="argsJson.alarmConfig.disconnectedNetMask" label="0">不屏蔽</el-radio>
                  <el-radio v-model="argsJson.alarmConfig.disconnectedNetMask" label="1">屏蔽</el-radio>
                </div>
                <p>饲喂报警</p>
                <div class="radio-content">
                  <el-radio v-model="argsJson.alarmConfig.disconnectedNetMask" label="0">不屏蔽</el-radio>
                  <el-radio v-model="argsJson.alarmConfig.disconnectedNetMask" label="1">屏蔽</el-radio>
                </div>
                <p>喷淋报警</p>
                <div class="radio-content">
                  <el-radio v-model="argsJson.alarmConfig.disconnectedNetMask" label="0">不屏蔽</el-radio>
                  <el-radio v-model="argsJson.alarmConfig.disconnectedNetMask" label="1">屏蔽</el-radio>
                </div> -->
              </div>
            </div>

            <div class="main-item">
              <div class="equipTemMain con2">
                <h3 class="title title8">定速风机工作参数</h3>
                <div class="top">
                  <span>开启温度(0.1°C)</span>
                  <span>关闭温度(0.1°C)</span>
                </div>
                <div class="two">
                  <span>1</span>
                  <el-form-item prop="openTemp1" class="inputNumberMedium">
                    <el-input-number
                      v-model="argsJson.temperatureControlConfig.fixedFan[0].openTemp"
                      :disabled="type == 'detail'"
                      size="mini"
                      controls-position="right"
                      :precision="1"
                      :max="60"
                      :min="10"
                      :step="0.1"
                    />
                  </el-form-item>
                  <el-form-item prop="closeTemp1" class="inputNumberMedium">
                    <el-input-number
                      v-model="argsJson.temperatureControlConfig.fixedFan[0].closeTemp"
                      :disabled="type == 'detail'"
                      size="mini"
                      controls-position="right"
                      :precision="1"
                      :max="60"
                      :min="10"
                      :step="0.1"
                    />
                  </el-form-item>
                </div>
                <div class="three">
                  <span>2</span>
                  <el-form-item prop="openTemp2" class="inputNumberMedium">
                    <el-input-number
                      v-model="argsJson.temperatureControlConfig.fixedFan[1].openTemp"
                      :disabled="type == 'detail'"
                      size="mini"
                      controls-position="right"
                      :precision="1"
                      :max="60"
                      :min="10"
                      :step="0.1"
                    />
                  </el-form-item>
                  <el-form-item prop="closeTemp2" class="inputNumberMedium">
                    <el-input-number
                      v-model="argsJson.temperatureControlConfig.fixedFan[1].closeTemp"
                      :disabled="type == 'detail'"
                      size="mini"
                      controls-position="right"
                      :precision="1"
                      :max="60"
                      :min="10"
                      :step="0.1"
                    />
                  </el-form-item>
                </div>
                <div class="four">
                  <span>3</span>
                  <el-form-item prop="openTemp3" class="inputNumberMedium">
                    <el-input-number
                      v-model="argsJson.temperatureControlConfig.fixedFan[2].openTemp"
                      :disabled="type == 'detail'"
                      size="mini"
                      controls-position="right"
                      :precision="1"
                      :max="60"
                      :min="10"
                      :step="0.1"
                    />
                  </el-form-item>
                  <el-form-item prop="closeTemp3" class="inputNumberMedium">
                    <el-input-number
                      v-model="argsJson.temperatureControlConfig.fixedFan[2].closeTemp"
                      :disabled="type == 'detail'"
                      size="mini"
                      controls-position="right"
                      :precision="1"
                      :max="60"
                      :min="10"
                      :step="0.1"
                    />
                  </el-form-item>
                </div>
                <div class="five">
                  <span>4</span>
                  <el-form-item prop="openTemp4" class="inputNumberMedium">
                    <el-input-number
                      v-model="argsJson.temperatureControlConfig.fixedFan[3].openTemp"
                      :disabled="type == 'detail'"
                      size="mini"
                      controls-position="right"
                      :precision="1"
                      :max="60"
                      :min="10"
                      :step="0.1"
                    />
                  </el-form-item>
                  <el-form-item prop="closeTemp4" class="inputNumberMedium">
                    <el-input-number
                      v-model="argsJson.temperatureControlConfig.fixedFan[3].closeTemp"
                      :disabled="type == 'detail'"
                      size="mini"
                      controls-position="right"
                      :precision="1"
                      :max="60"
                      :min="10"
                      :step="0.1"
                    />
                  </el-form-item>
                </div>
                <div class="six">
                  <span>5</span>
                  <el-form-item prop="openTemp5" class="inputNumberMedium">
                    <el-input-number
                      v-model="argsJson.temperatureControlConfig.fixedFan[4].openTemp"
                      :disabled="type == 'detail'"
                      size="mini"
                      controls-position="right"
                      :precision="1"
                      :max="60"
                      :min="10"
                      :step="0.1"
                    />
                  </el-form-item>
                  <el-form-item prop="closeTemp5" class="inputNumberMedium">
                    <el-input-number
                      v-model="argsJson.temperatureControlConfig.fixedFan[4].closeTemp"
                      :disabled="type == 'detail'"
                      size="mini"
                      controls-position="right"
                      :precision="1"
                      :max="60"
                      :min="10"
                      :step="0.1"
                    />
                  </el-form-item>
                </div>
              </div>
            </div>
          </div>

          <div class="main-content">
            <div class="main-item">
              <div class="equipTemMain con1 main3">
                <h3 class="title title8">降温设备工作参数</h3>
                <div class="top">
                  <span>开启温度(0.1°C)</span>
                  <span>开启时长(秒)</span>
                  <span>关闭时长(分)</span>
                  <span>是否静态模式</span>
                </div>
                <div class="two">
                  <span>喷淋</span>
                  <el-input-number
                    v-model="argsJson.temperatureControlConfig.shower.openTemp"
                    :disabled="type == 'detail'"
                    class="inputNumberMini"
                    size="mini"
                    controls-position="right"
                    :precision="1"
                    :max="60"
                    :min="0"
                    :step="0.1"
                  />
                  <el-input-number
                    v-model="argsJson.temperatureControlConfig.shower.openDuration"
                    :disabled="type == 'detail'"
                    class="inputNumberMini"
                    size="mini"
                    controls-position="right"
                    :max="600"
                    :min="3"
                    :step="1"
                  />
                  <el-input-number
                    v-model="argsJson.temperatureControlConfig.shower.closeDuration"
                    :disabled="type == 'detail'"
                    class="inputNumberMini"
                    size="mini"
                    controls-position="right"
                    :max="60"
                    :min="0"
                    :step="1"
                  />
                  <div class="radio-content2">
                    <el-radio v-model="argsJson.temperatureControlConfig.shower.staticMode" label="1">是</el-radio>
                    <el-radio v-model="argsJson.temperatureControlConfig.shower.staticMode" label="0">否</el-radio>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="btn">
            <el-button class="btn-border canleButton" @click="closeModal">返回</el-button>
            <el-button v-if="type != 'detail'" class="btn-blue" :loading="buttonLoading" @click="editfn">保存模板</el-button>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import editForm from '../../components/navForm/index.vue'
import navForm from '@/components/commonComponent/navForm/index.vue'
import tablePage from '@/components/ElementComponent/iTable'
import { getConfigElement } from '@/utils/overtService'
export default {
  components: {
    tablePage,
    navForm,
    editForm
  },
  data() {
    return {
      pageElement: [], // 页面权限数组
      dataInterface: [], // 数据接口权限数组
      id: '',
      isLoading: true,
      buttonLoading: false,
      isShow: true,
      type: 'add',
      rules: {
        exchangeOpenTemp: [
          { required: true,
            validator: (rule, value, callback) => {
              if (this.argsJson.temperatureControlConfig.exchange.openTemp >= this.argsJson.temperatureControlConfig.exchange.closeTemp) {
                callback(new Error('必须小于关闭温度!'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          },
          { required: true,
            validator: (rule, value, callback) => {
              if (this.argsJson.temperatureControlConfig.exchange.openTemp >= this.argsJson.temperatureControlConfig.exchange.closeTemp) {
                callback(new Error('必须小于关闭温度!'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        exchangeCloseTemp: [
          { required: true,
            validator: (rule, value, callback) => {
              if (this.argsJson.temperatureControlConfig.exchange.closeTemp <= this.argsJson.temperatureControlConfig.exchange.openTemp) {
                callback(new Error('必须大于开启温度!'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          },
          { required: true,
            validator: (rule, value, callback) => {
              if (this.argsJson.temperatureControlConfig.exchange.closeTemp <= this.argsJson.temperatureControlConfig.exchange.openTemp) {
                callback(new Error('必须大于开启温度!'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        gutterOpenTemp: [
          { required: true,
            validator: (rule, value, callback) => {
              if (this.argsJson.temperatureControlConfig.gutter.openTemp >= this.argsJson.temperatureControlConfig.gutter.closeTemp) {
                callback(new Error('必须小于关闭温度!'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          },
          { required: true,
            validator: (rule, value, callback) => {
              if (this.argsJson.temperatureControlConfig.gutter.openTemp >= this.argsJson.temperatureControlConfig.gutter.closeTemp) {
                callback(new Error('必须小于关闭温度!'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        gutterCloseTemp: [
          { required: true,
            validator: (rule, value, callback) => {
              if (this.argsJson.temperatureControlConfig.gutter.closeTemp <= this.argsJson.temperatureControlConfig.gutter.openTemp) {
                callback(new Error('必须大于开启温度!'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          },
          { required: true,
            validator: (rule, value, callback) => {
              if (this.argsJson.temperatureControlConfig.gutter.closeTemp <= this.argsJson.temperatureControlConfig.gutter.openTemp) {
                callback(new Error('必须大于开启温度!'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        openTemp1: [
          { required: true,
            validator: (rule, value, callback) => {
              if (this.argsJson.temperatureControlConfig.fixedFan[0].openTemp <= this.argsJson.temperatureControlConfig.fixedFan[0].closeTemp) {
                callback(new Error('必须大于关闭温度!'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          },
          { required: true,
            validator: (rule, value, callback) => {
              if (this.argsJson.temperatureControlConfig.fixedFan[0].openTemp <= this.argsJson.temperatureControlConfig.fixedFan[0].closeTemp) {
                callback(new Error('必须大于关闭温度!'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        closeTemp1: [
          { required: true,
            validator: (rule, value, callback) => {
              if (this.argsJson.temperatureControlConfig.fixedFan[0].closeTemp >= this.argsJson.temperatureControlConfig.fixedFan[0].openTemp) {
                callback(new Error('必须小于开启温度!'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          },
          { required: true,
            validator: (rule, value, callback) => {
              if (this.argsJson.temperatureControlConfig.fixedFan[0].closeTemp >= this.argsJson.temperatureControlConfig.fixedFan[0].openTemp) {
                callback(new Error('必须小于开启温度!'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        openTemp2: [
          { required: true,
            validator: (rule, value, callback) => {
              if (this.argsJson.temperatureControlConfig.fixedFan[1].openTemp <= this.argsJson.temperatureControlConfig.fixedFan[1].closeTemp) {
                callback(new Error('必须大于关闭温度!'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          },
          { required: true,
            validator: (rule, value, callback) => {
              if (this.argsJson.temperatureControlConfig.fixedFan[1].openTemp <= this.argsJson.temperatureControlConfig.fixedFan[1].closeTemp) {
                callback(new Error('必须大于关闭温度!'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        closeTemp2: [
          { required: true,
            validator: (rule, value, callback) => {
              if (this.argsJson.temperatureControlConfig.fixedFan[1].closeTemp >= this.argsJson.temperatureControlConfig.fixedFan[1].openTemp) {
                callback(new Error('必须小于开启温度!'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          },
          { required: true,
            validator: (rule, value, callback) => {
              if (this.argsJson.temperatureControlConfig.fixedFan[1].closeTemp >= this.argsJson.temperatureControlConfig.fixedFan[1].openTemp) {
                callback(new Error('必须小于开启温度!'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        openTemp3: [
          { required: true,
            validator: (rule, value, callback) => {
              if (this.argsJson.temperatureControlConfig.fixedFan[2].openTemp <= this.argsJson.temperatureControlConfig.fixedFan[2].closeTemp) {
                callback(new Error('必须大于关闭温度!'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          },
          { required: true,
            validator: (rule, value, callback) => {
              if (this.argsJson.temperatureControlConfig.fixedFan[2].openTemp <= this.argsJson.temperatureControlConfig.fixedFan[2].closeTemp) {
                callback(new Error('必须大于关闭温度!'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        closeTemp3: [
          { required: true,
            validator: (rule, value, callback) => {
              if (this.argsJson.temperatureControlConfig.fixedFan[2].closeTemp >= this.argsJson.temperatureControlConfig.fixedFan[2].openTemp) {
                callback(new Error('必须小于开启温度!'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          },
          { required: true,
            validator: (rule, value, callback) => {
              if (this.argsJson.temperatureControlConfig.fixedFan[2].closeTemp >= this.argsJson.temperatureControlConfig.fixedFan[2].openTemp) {
                callback(new Error('必须小于开启温度!'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        openTemp4: [
          { required: true,
            validator: (rule, value, callback) => {
              if (this.argsJson.temperatureControlConfig.fixedFan[3].openTemp <= this.argsJson.temperatureControlConfig.fixedFan[3].closeTemp) {
                callback(new Error('必须大于关闭温度!'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          },
          { required: true,
            validator: (rule, value, callback) => {
              if (this.argsJson.temperatureControlConfig.fixedFan[3].openTemp <= this.argsJson.temperatureControlConfig.fixedFan[3].closeTemp) {
                callback(new Error('必须大于关闭温度!'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        closeTemp4: [
          { required: true,
            validator: (rule, value, callback) => {
              if (this.argsJson.temperatureControlConfig.fixedFan[3].closeTemp >= this.argsJson.temperatureControlConfig.fixedFan[3].openTemp) {
                callback(new Error('必须小于开启温度!'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          },
          { required: true,
            validator: (rule, value, callback) => {
              if (this.argsJson.temperatureControlConfig.fixedFan[3].closeTemp >= this.argsJson.temperatureControlConfig.fixedFan[3].openTemp) {
                callback(new Error('必须小于开启温度!'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        openTemp5: [
          { required: true,
            validator: (rule, value, callback) => {
              if (this.argsJson.temperatureControlConfig.fixedFan[4].openTemp <= this.argsJson.temperatureControlConfig.fixedFan[4].closeTemp) {
                callback(new Error('必须大于关闭温度!'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          },
          { required: true,
            validator: (rule, value, callback) => {
              if (this.argsJson.temperatureControlConfig.fixedFan[4].openTemp <= this.argsJson.temperatureControlConfig.fixedFan[4].closeTemp) {
                callback(new Error('必须大于关闭温度!'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        closeTemp5: [
          { required: true,
            validator: (rule, value, callback) => {
              if (this.argsJson.temperatureControlConfig.fixedFan[4].closeTemp >= this.argsJson.temperatureControlConfig.fixedFan[4].openTemp) {
                callback(new Error('必须小于开启温度!'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          },
          { required: true,
            validator: (rule, value, callback) => {
              if (this.argsJson.temperatureControlConfig.fixedFan[4].closeTemp >= this.argsJson.temperatureControlConfig.fixedFan[4].openTemp) {
                callback(new Error('必须小于开启温度!'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ]
      },
      argsJson: {
        temperatureControlConfig: {
          gutter: {
            openTemp: '',
            baseSpeed: '',
            diffTemp: '',
            closeTemp: '',
            openDuration: ''
          },
          exchange: {
            openTemp: '',
            baseSpeed: '',
            diffTemp: '',
            closeTemp: '',
            openDuration: ''
          },
          endFan: [
            { openTemp: '', diffTemp: '', baseFreq: '', lockFreq: '' },
            { openTemp: '', diffTemp: '', baseFreq: '', lockFreq: '' },
            { openTemp: '', diffTemp: '', baseFreq: '', lockFreq: '' }
          ],
          fixedFan: [
            { openTemp: '', closeTemp: '' },
            { openTemp: '', closeTemp: '' },
            { openTemp: '', closeTemp: '' },
            { openTemp: '', closeTemp: '' },
            { openTemp: '', closeTemp: '' }
          ],
          shower: { openTemp: '', openDuration: '', closeDuration: '', staticMode: '0' }
        },
        alarmConfig: {
          high: '',
          low: '',
          delta: '',
          highHumiALarmThreshold: '',
          disconnectedNetMask: '0',
          gutterFanMask: '0',
          heatExchangeFanMask: '0',
          feedMask: '0',
          showerMask: '0'
        }
      },
      detailFormInfo: {
        data: {
          name: '', // *模板名称
          equipmentTypeId: '', // 设备类型
          equipmentTypeName: '',
          deviceVersionId: '', // 设备型号
          deviceVersionName: '',
          styType: '', // 猪舍类型
          pigWeightStart: '',
          pigWeightEnd: '',
          pigDayStart: '',
          pigDayEnd: ''
        },
        fieldList: {
          right: {
            inpLists: [
              {
                key: 'name',
                type: 'input',
                required: true,
                className: 'shadow',
                placeholder: '模板名称'
              },
              {
                key: 'equipmentTypeId',
                type: 'select',
                className: 'shadow',
                placeholder: '设备类型',
                list: [],
                handleChange: (val) => {
                  this.detailFormInfo.fieldList.right.inpLists[2].list = []
                  this.detailFormInfo.data.deviceVersionId = ''
                  this.detailFormInfo.data.deviceVersionName = ''
                  this.detailFormInfo.data.equipmentTypeName = val.label
                  this.getDetailModelLists()
                }
              },
              // {
              //   key: 'equipmentTypeId',
              //   type: 'input',
              //   disabled: true,
              //   className: 'shadow',
              //   placeholder: '设备类型编码'
              // },
              {
                key: 'deviceVersionId',
                type: 'select',
                className: 'shadow',
                placeholder: '设备型号',
                list: [],
                handleChange: (val) => {
                  this.detailFormInfo.data.deviceVersionName = val.label
                  console.log(val)
                }
              },
              // {
              //   key: 'deviceVersionId',
              //   type: 'input',
              //   disabled: true,
              //   className: 'shadow',
              //   placeholder: '设备型号编码'
              // },
              {
                key: 'styType',
                type: 'select',
                className: 'shadow',
                placeholder: '猪舍类型',
                list: [
                  {
                    key: '保育舍',
                    value: 'RoomType001'
                  },
                  {
                    key: '育肥舍',
                    value: 'RoomType002'
                  },
                  {
                    key: '待配舍',
                    value: 'RoomType003'
                  },
                  {
                    key: '怀孕舍',
                    value: 'RoomType004'
                  },
                  {
                    key: '哺乳舍',
                    value: 'RoomType005'
                  },
                  {
                    key: '公猪舍',
                    value: 'RoomType006'
                  },
                  {
                    key: '后备舍',
                    value: 'RoomType007'
                  },
                  {
                    key: '保育育肥一体舍',
                    value: 'RoomType008'
                  }
                ]
              },
              {
                key: 'pigWeightStart',
                type: 'float',
                className: 'shadow inputMini',
                placeholder: '0',
                label: '猪重/kg'
              },
              {
                key: 'pigWeightEnd',
                type: 'float',
                className: 'shadow inputMini',
                placeholder: '160',
                label: '~'
              },
              {
                key: 'pigDayStart',
                type: 'float',
                className: 'shadow inputMini',
                min: 1,
                placeholder: '0',
                label: '日龄/天'
              },
              {
                key: 'pigDayEnd',
                type: 'float',
                className: 'shadow inputMini',
                placeholder: '300',
                label: '~'
              }
            ]
          }
        }
      },
      navFormInfo: {
        data: {
          name: '', // *模板名称
          equipmentTypeId: '', // 设备类型
          deviceVersionId: '', // 设备型号
          styType: '', // 猪舍类型
          status: '',
          equipmentType: ''
        },
        fieldList: {
          left: {
            inpLists: [
              {
                type: 'button',
                innerText: '新增',
                authCode: 'deviceArgsTemplate:btn_add',
                className: 'btn-blue',
                handleClick: () => {
                  this.isShow = false
                  this.type = 'add'
                  this.detailFormInfo.fieldList.right.inpLists.map((item, index) => {
                    item['disabled'] = false
                  })
                  this.detailFormInfo.data = {
                    name: '', // *模板名称
                    equipmentTypeId: '', // 设备类型
                    equipmentTypeName: '',
                    deviceVersionId: '', // 设备型号
                    deviceVersionName: '',
                    styType: '', // 猪舍类型
                    pigWeightStart: '',
                    pigWeightEnd: '',
                    pigDayStart: '',
                    pigDayEnd: ''
                  }
                  this.argsJson = {
                    temperatureControlConfig: {
                      gutter: {
                      },
                      exchange: {
                      },
                      endFan: [
                        { },
                        { },
                        { }
                      ],
                      fixedFan: [
                        { },
                        { },
                        { },
                        { },
                        { }
                      ],
                      shower: {
                        staticMode: '0'
                      }
                    },
                    alarmConfig: {
                      disconnectedNetMask: '0',
                      gutterFanMask: '0',
                      heatExchangeFanMask: '0',
                      feedMask: '0',
                      showerMask: '0'
                    }
                  }
                }
              },
              {
                type: 'button',
                innerText: '审核',
                authCode: 'deviceArgsTemplate:btn_review',
                className: 'btn-blue',
                isDisabled: true,
                handleClick: () => {
                  const ids = []
                  for (let i = 0, len = this.selection.length; i < len; i++) {
                    if (this.selection[i].status === 'NORMAL') {
                      ids.push(this.selection[i].id)
                    } else {
                      return this.$message({
                        message: '只能选择未审核数据进行审核',
                        type: 'error'
                      })
                    }
                  }
                  if (this.selection.length === 0) {
                    this.$message({
                      message: '请至少选择一条数据',
                      type: 'error'
                    })
                  } else {
                    this.$confirm('此操作将审核这些数据, 是否继续?', '提示', {
                      confirmButtonText: '确定',
                      confirmButtonClass: 'btn-blue btn-blue-confirm',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {
                      const element = this.pageElement['btn_review']
                      this.$httpRequest({
                        type: element.method,
                        uri: element.uri + '?ids=' + ids.join(','),
                        callback: data => {
                          if (data.status === 200 && data.rel) {
                            this.$message({
                              message: '审核成功',
                              type: 'success'
                            })
                            // this.selection = []
                            // this.unAuditarr = []
                            // this.auditarr = []
                            this.getLists()
                          }
                        }
                      })
                      // examine({ ids: ids.join(',') }).then((res) => {
                      //   if (res && res.status === 200) {
                      //     this.$message({
                      //       message: '审核成功',
                      //       type: 'success'
                      //     })
                      //     this.getLists()
                      //   }
                      // })
                    })
                  }
                }
              },
              {
                type: 'button',
                innerText: '反审核',
                authCode: 'deviceArgsTemplate:btn_unreview',
                className: 'btn-blue',
                isDisabled: true,
                handleClick: () => {
                  const ids = []
                  for (let i = 0, len = this.selection.length; i < len; i++) {
                    if (this.selection[i].status === 'AUDITED') {
                      ids.push(this.selection[i].id)
                    } else {
                      return this.$message({
                        message: '只能选择已审核数据进行反审核',
                        type: 'error'
                      })
                    }
                  }
                  if (this.selection.length === 0) {
                    this.$message({
                      message: '请至少选择一条数据',
                      type: 'error'
                    })
                  } else {
                    this.$confirm('此操作将反审核这些数据, 是否继续?', '提示', {
                      confirmButtonText: '确定',
                      confirmButtonClass: 'btn-blue btn-blue-confirm',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {
                      const element = this.pageElement['btn_unreview']
                      this.$httpRequest({
                        type: element.method,
                        uri: element.uri + '?ids=' + ids.join(','),
                        callback: data => {
                          if (data.status === 200 && data.rel) {
                            this.$message({
                              message: '反审核成功',
                              type: 'success'
                            })
                            this.getLists()
                          }
                        }
                      })
                      // backExamine(ids.join(',')).then((res) => {
                      //   if (res && res.status === 200) {
                      //     this.$message({
                      //       message: '反审核成功！',
                      //       type: 'success'
                      //     })
                      //     this.getLists()
                      //   }
                      // })
                    })
                    // .catch(() => {
                    //   this.$message({
                    //     message: '已取消反审核',
                    //     type: 'warning'
                    //   })
                    // })
                  }
                }
              }
            ]
          },
          right: {
            inpLists: [
              {
                key: 'name',
                type: 'input',
                required: true,
                className: 'shadow',
                placeholder: '模板名称'
              },
              {
                key: 'equipmentTypeId',
                type: 'select',
                className: 'shadow',
                placeholder: '设备类型',
                list: [],
                handleChange: (val) => {
                  this.navFormInfo.fieldList.right.inpLists[2].list = []
                  if (val) {
                    this.getmodelLists()
                    this.navFormInfo.data.deviceVersionId = ''
                  }
                }
              },
              {
                key: 'deviceVersionId',
                type: 'select',
                className: 'shadow',
                placeholder: '设备型号',
                list: []
              },
              {
                key: 'styType',
                type: 'select',
                className: 'shadow',
                placeholder: '猪舍类型',
                list: [
                  {
                    label: '保育舍',
                    value: 'RoomType001'
                  },
                  {
                    label: '育肥舍',
                    value: 'RoomType002'
                  },
                  {
                    label: '待配舍',
                    value: 'RoomType003'
                  },
                  {
                    label: '怀孕舍',
                    value: 'RoomType004'
                  },
                  {
                    label: '哺乳舍',
                    value: 'RoomType005'
                  },
                  {
                    label: '公猪舍',
                    value: 'RoomType006'
                  },
                  {
                    label: '后备舍',
                    value: 'RoomType007'
                  },
                  {
                    label: '保育育肥一体舍',
                    value: 'RoomType008'
                  }
                ],
                handleChange: (val) => {
                }
              },
              {
                key: 'status',
                type: 'radio',
                className: 'shadow',
                customLabel: 'name',
                customVal: 'val',
                optList: [
                  { name: '全部', val: '' },
                  { name: '已审核', val: 'AUDITED' },
                  { name: '未审核', val: 'NORMAL' }
                ]
              }
            ],
            btnLists: [
              {
                innerText: '查询',
                className: 'btn-blue',
                handleClick: () => {
                  this.pagination.pageIndex = 1
                  this.getLists()
                }
              },
              {
                innerText: '重置',
                className: 'btn-border',
                handleClick: () => {
                  this.pagination.pageIndex = 1
                  this.$refs['navForm'].resetFields()
                  this.getLists()
                }
              }
            ]
          }
        }
      },
      selection: [],
      columns: [
        {
          prop: 'name',
          label: '模板名称',
          width: '320'
        },
        {
          prop: 'equipmentTypeName',
          label: '设备类型',
          width: '220'
        },
        {
          prop: 'deviceVersionName',
          label: '设备型号',
          width: '220'
        },
        {
          prop: 'styType',
          label: '猪舍类型',
          width: '220',
          // render: (h, params) => {
          //   if (params.row.styType === 'RoomType001') {
          //     return h('span', '保育舍')
          //   } else if (params.row.styType === 'RoomType002') {
          //     return h('span', '育肥舍')
          //   } else if (params.row.styType === 'RoomType003') {
          //     return h('span', '待配舍')
          //   } else if (params.row.styType === 'RoomType004') {
          //     return h('span', '怀孕舍')
          //   } else if (params.row.styType === 'RoomType005') {
          //     return h('span', '哺乳舍')
          //   } else if (params.row.styType === 'RoomType006') {
          //     return h('span', '公猪舍')
          //   } else if (params.row.styType === 'RoomType007') {
          //     return h('span', '后备舍')
          //   } else if (params.row.styType === 'RoomType008') {
          //     return h('span', '保育育肥一体舍')
          //   } else {
          //     return h('span', '--')
          //   }
          // },
          rule: {
            RoomType001: '保育舍',
            RoomType002: '育肥舍',
            RoomType003: '待配舍',
            RoomType004: '怀孕舍',
            RoomType005: '哺乳舍',
            RoomType006: '公猪舍',
            RoomType007: '后备舍',
            RoomType008: '保育育肥一体舍'
          }
        },
        {
          prop: 'status',
          label: '状态',
          width: '160',
          rule: {
            NORMAL: '未审核',
            AUDITED: '已审核'
          }
        },
        // {
        //   prop: 'crtTime',
        //   label: '创建日期',
        //   width: '160'
        // },
        // {
        //   prop: 'crtName',
        //   label: '创建人',
        //   width: '100'
        // },
        {
          prop: 'updTime',
          label: '更新日期',
          width: '180'
        },
        {
          prop: 'updName',
          label: '更新人',
          width: '140'
        },
        {
          button: true,
          label: '操作',
          align: 'center',
          fixed: 'right',
          show: 'status',
          width: '180', // 操作按钮宽度
          group: [
            {
              name: '查看',
              class: 'btn-blue',
              authCode: 'deviceArgsTemplate:btn_info',
              size: 'auto',
              click: 'see',
              status: 'AUDITED'
            },
            {
              name: '修改',
              class: 'btn-blue',
              authCode: 'deviceArgsTemplate:btn_edit',
              size: 'auto',
              click: 'edit',
              status: 'NORMAL'
            },
            {
              name: '删除',
              class: 'btn-red',
              authCode: 'deviceArgsTemplate:btn_del',
              size: 'auto',
              click: 'remove',
              status: 'NORMAL'
            }
          ]
        }
      ],
      // 数据
      tableData: [],
      auditarr: [],
      unAuditarr: [],
      // 分页
      pagination: {
        total: 0,
        pageIndex: 1,
        limit: 10
      },
      options: {
        stripe: false, // 斑马纹
        firstFixed: true, // 首航固定
        mutiSelect: true, // 多选框
        index: false, // 显示序号， 多选则 mutiSelect
        loading: true, // 表格动画
        initTable: true // 是否一挂载就加载数据
      }
    }
  },
  watch: {
    // 这里侦听审核 反审核 下发配置的dis状态
    auditarr(val) {
      if (val.length > 0) {
        this.navFormInfo.fieldList.left.inpLists[2].isDisabled = false
      } else {
        this.navFormInfo.fieldList.left.inpLists[2].isDisabled = true
      }
    },
    unAuditarr(val) {
      if (val.length > 0) {
        this.navFormInfo.fieldList.left.inpLists[1].isDisabled = false
      } else {
        this.navFormInfo.fieldList.left.inpLists[1].isDisabled = true
      }
    }
    // selection(val) {
    //   if (val.length > 0) {
    //     this.navFormInfo.fieldList.left.inpLists[2].className = 'btn-blue'
    //     this.navFormInfo.fieldList.left.inpLists[2].isDisabled = false
    //     this.navFormInfo.fieldList.left.inpLists[1].className = 'btn-blue'
    //     this.navFormInfo.fieldList.left.inpLists[1].isDisabled = false
    //   } else {
    //     this.navFormInfo.fieldList.left.inpLists[2].className = 'btn-blue-disabled'
    //     this.navFormInfo.fieldList.left.inpLists[2].isDisabled = true
    //     this.navFormInfo.fieldList.left.inpLists[1].className = 'btn-blue-disabled'
    //     this.navFormInfo.fieldList.left.inpLists[1].isDisabled = true
    //   }
    // }
  },
  mounted() {
    this.pageElement = getConfigElement('deviceArgsTemplate')
    this.dataInterface = getConfigElement('unit-evcDataInterface')
    this.getLists()
    this.getTypeLists()
  },
  methods: {
    // 获取table数据
    getLists() {
      const element = this.pageElement['btn_list']
      const data = {
        page: this.pagination.pageIndex,
        limit: this.pagination.limit,
        // ...this.navFormInfo.data,
        status: ''
      }
      if (this.navFormInfo.data.name) {
        data.name = this.navFormInfo.data.name
      }
      if (this.navFormInfo.data.equipmentTypeId) {
        data.equipmentTypeId = this.navFormInfo.data.equipmentTypeId
      }
      if (this.navFormInfo.data.deviceVersionId) {
        data.deviceVersionId = this.navFormInfo.data.deviceVersionId
      }
      if (this.navFormInfo.data.styType) {
        data.styType = this.navFormInfo.data.styType
      }
      if (this.navFormInfo.data.status) {
        data.status = this.navFormInfo.data.status
      }
      this.isLoading = true
      this.$httpRequest({
        type: element ? element.method : '',
        uri: element ? element.uri : '',
        payload: data,
        callback: data => {
          this.isLoading = false
          if (data.status === 200) {
            if (data.data.total > 0) {
              this.tableData = data.data.rows
              this.pagination.total = data.data.total
              this.$refs['tablePage'].$children[0].clearSelection()
            } else {
              this.tableData = []
              this.pagination.total = 0
            }
          }
        }
      })
      // equipmentLists(data).then((res) => {
      //   if (res && res.status === 200) {
      //     if (res.data.total > 0) {
      //       this.tableData = res.data.rows
      //       this.pagination.total = res.data.total
      //       this.$refs['tablePage'].$children[0].clearSelection()
      //     } else {
      //       this.tableData = []
      //       this.pagination.total = 0
      //     }
      //     this.isLoading = false
      //   } else {
      //     this.$message.error(res.message)
      //   }
      // })
    },
    // 获取设备类型
    getTypeLists() {
      const element = this.pageElement['deviceType']
      const params = {
        belong_business_id: '7mtFvgDzS6IsLh41WHjDcS',
        status: 2
      }
      this.$httpRequest({
        type: element ? element.method : '',
        uri: element ? element.uri : '',
        payload: params,
        callback: data => {
          if (data.rel && data.status === 200) {
            data.data.map((item) => {
              const obj = {}
              obj['label'] = item.equiptype_name
              obj['value'] = item.id
              this.navFormInfo.fieldList.right.inpLists[1].list.push(obj)
              this.detailFormInfo.fieldList.right.inpLists[1].list.push(obj)
            })
          }
        }
      })
      // equipmentTypeLists(data).then((res) => {
      //   if (res && res.status === 200) {
      //     res.data.map((item) => {
      //       const obj = {}
      //       obj['label'] = item.equiptype_name
      //       obj['value'] = item.id
      //       this.navFormInfo.fieldList.right.inpLists[1].list.push(obj)
      //       this.detailFormInfo.fieldList.right.inpLists[1].list.push(obj)
      //     })
      //   } else {
      //     this.$message.error(res.message)
      //   }
      // })
    },
    // 获取设备型号
    getmodelLists() {
      const element = this.pageElement['deviceVersion']
      const params = {
        equiptype_id: this.navFormInfo.data.equipmentTypeId,
        status: 2
      }
      this.$httpRequest({
        type: element ? element.method : '',
        uri: element ? element.uri : '',
        payload: params,
        callback: data => {
          if (data && data.status === 200) {
            data.data.map((item) => {
              const obj = {}
              obj['label'] = item.version_name
              obj['value'] = item.id
              this.navFormInfo.fieldList.right.inpLists[2].list.push(obj)
            })
          }
        }
      })
      // equipmentModelLists(data).then((res) => {
      //   if (res && res.status === 200) {
      //     res.data.map((item) => {
      //       const obj = {}
      //       obj['label'] = item.version_name
      //       obj['value'] = item.id
      //       this.navFormInfo.fieldList.right.inpLists[2].list.push(obj)
      //     })
      //   } else {
      //     this.$message.error(res.message)
      //   }
      // })
    },
    // 获取设备型号
    getDetailModelLists() {
      const element = this.pageElement['deviceVersion']
      const params = {
        equiptype_id: this.detailFormInfo.data.equipmentTypeId,
        status: 2
      }
      this.$httpRequest({
        type: element ? element.method : '',
        uri: element ? element.uri : '',
        payload: params,
        callback: data => {
          if (data.status === 200) {
            data.data.map((item) => {
              const obj = {}
              obj['label'] = item.version_name
              obj['value'] = item.id
              this.detailFormInfo.fieldList.right.inpLists[2].list.push(obj)
            })
          }
        }
      })
      // equipmentModelLists(data).then((res) => {
      //   if (res && res.status === 200) {
      //     res.data.map((item) => {
      //       const obj = {}
      //       obj['label'] = item.version_name
      //       obj['value'] = item.id
      //       this.detailFormInfo.fieldList.right.inpLists[2].list.push(obj)
      //     })
      //   } else {
      //     this.$message.error(res.message)
      //   }
      // })
    },
    // 删除提示框
    // alertDia(msg) {
    //   this.displayStsates = "block";
    //   this.aletMsg = msg;
    //   // 延迟2秒后消失 自己可以更改时间
    //   window.setTimeout(() => {
    //     this.displayStsates = "none";
    //   }, 2000);
    // },
    // 分页器页码
    handleIndexChange(current) {
      this.pagination.pageIndex = current
      this.getLists()
    },
    // 分页器一页多少条
    handleSizeChange(size) {
      this.pagination.pageIndex = 1
      this.pagination.limit = size
      this.getLists()
    },
    // 删除
    childRemoveRow(row, index) {
      // this.$confirm('此操作将永久删除该模板, 是否继续?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // })
      //   .then(() => {
      const element = this.pageElement['btn_del']
      const id = this.tableData[index].id
      this.$httpRequest({
        type: element.method,
        uri: element.uri + '?ids=' + id,
        callback: data => {
          if (data.status === 200 && data.rel) {
            this.getLists()
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          }
        }
      })
      // delEquipment(id).then((res) => {
      //   if (res && res.status === 200) {
      //     // this.alertDia("删除成功");
      //     this.$message({
      //       message: '删除成功',
      //       type: 'success'
      //     })
      //     this.getLists()
      //   }
      // })
      // })
      // .catch(() => {
      //   this.$message({
      //     message: '已取消删除',
      //     type: 'warning'
      //   })
      // })
    },
    childSeeRow(row, index) {
      this.isShow = false
      this.id = row.id
      this.type = 'detail'
      this.detailFormInfo.fieldList.right.inpLists.map(item => {
        item['disabled'] = true
      })
      this.getDetail()
    },
    childEditRow(row, index) {
      this.isShow = false
      this.id = row.id
      this.type = 'edit'
      this.detailFormInfo.fieldList.right.inpLists.map(item => {
        item['disabled'] = false
      })
      this.getDetail()
    },
    getDetail() {
      const element = this.pageElement['btn_info']
      const params = { id: this.id }
      this.$httpRequest({
        type: element.method,
        uri: element.uri,
        payload: params,
        callback: data => {
          if (data.rel && data.status === 200) {
            this.detailFormInfo.data = data.data
            if (data.data.pigDayEnd === 2147483647) {
              this.detailFormInfo.data.pigDayEnd = ''
            }
            if (data.data.pigWeightEnd === 2147483647) {
              this.detailFormInfo.data.pigWeightEnd = ''
            }
            this.getDetailModelLists()
            this.argsJson = JSON.parse(data.data.argsJson)
            this.argsJson.temperatureControlConfig.shower.closeDuration = this.argsJson.temperatureControlConfig.shower.closeDuration / 60
          }
        }
      })
      // equipmentDetail(data).then((res) => {
      //   if (res && res.status === 200) {
      //     console.log(res.data)
      //     this.detailFormInfo.data = res.data
      //     if (res.data.pigDayEnd === 2147483647) {
      //       this.detailFormInfo.data.pigDayEnd = ''
      //     }
      //     if (res.data.pigWeightEnd === 2147483647) {
      //       this.detailFormInfo.data.pigWeightEnd = ''
      //     }
      //     this.getDetailModelLists()
      //     this.argsJson = JSON.parse(res.data.argsJson)
      //     this.argsJson.temperatureControlConfig.shower.closeDuration = this.argsJson.temperatureControlConfig.shower.closeDuration / 60
      //   } else {
      //     this.$message.error(res.message)
      //   }
      // })
    },
    editfn() {
      if (!this.detailFormInfo.data.name) {
        return this.$message.error('模板名称不能为空！')
      }
      if (!this.detailFormInfo.data.equipmentTypeId) {
        return this.$message.error('设备类型不能为空！')
      }
      if (!this.detailFormInfo.data.deviceVersionId) {
        return this.$message.error('设备型号不能为空！')
      }
      if (!this.detailFormInfo.data.styType) {
        return this.$message.error('猪舍类型不能为空！')
      }
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          const params = { ...this.detailFormInfo.data }
          this.argsJson.temperatureControlConfig.shower.closeDuration = this.argsJson.temperatureControlConfig.shower.closeDuration * 60
          params['argsJson'] = JSON.stringify(this.argsJson)
          if (this.type === 'add') {
            const element = this.pageElement['btn_add']
            this.buttonLoading = true
            this.$httpRequest({
              type: element.method,
              uri: element.uri,
              payload: params,
              callback: data => {
                this.buttonLoading = false
                if (data.status === 200 && data.rel) {
                  this.$message.success('添加成功！')
                  this.isShow = true
                  this.getLists()
                }
              }
            })
            // addEquipment(params).then((res) => {
            //   this.buttonLoading = false
            //   if (res && res.status === 200 && res.rel) {
            //     this.$message.success('添加成功！')
            //     this.isShow = true
            //     this.getLists()
            //   } else {
            //     this.$message.error(res.message)
            //   }
            // })
          } else if (this.type === 'edit') {
            const element = this.pageElement['btn_edit']
            params['id'] = this.id
            this.buttonLoading = true
            this.$httpRequest({
              type: element.method,
              uri: element.uri,
              payload: params,
              callback: data => {
                this.buttonLoading = false
                if (data.status === 200 && data.rel) {
                  this.isShow = true
                  this.$message.success('修改成功')
                  this.getLists()
                }
              }
            })
            // editEquipment(params).then((res) => {
            //   this.buttonLoading = false
            //   if (res && res.status === 200 && res.rel) {
            //     this.isShow = true
            //     this.$message.success('修改成功')
            //     this.getLists()
            //   } else {
            //     this.$message.error(res.message)
            //   }
            // })
          }
        } else {
          return this.$message.error('参数有误,请检查参数!')
        }
      })
    },
    closeModal() {
      this.isShow = true
    },
    // 复选框
    handleSelectionChange(selection) {
      this.selection = selection
      this.auditarr = [] // 已审核数组
      this.unAuditarr = [] // 未审核数组
      selection.forEach((item) => {
        if (item.status === 'AUDITED') {
          this.auditarr.push(item.id)
        } else {
          this.unAuditarr.push(item.id)
        }
      })
    },
    // 获取表数据方法
    fetchTableData() {
      // alert('触发请求表数据')
    }
  }
}
</script>
<style lang="scss">
/* 重写el-input样式 将decrease、increase样式和界面一致*/
.equipmentParameterTemplate {
  .homeTwo {
    .el-input__inner::placeholder {
      color: #aaaaaa;
      text-align:center;
    }
    /* 谷歌 */
    .el-input__inner::-webkit-input-placeholder {
      color: #aaaaaa;
      text-align:center;
    }
    /* 火狐 */
    .el-input__inner:-moz-placeholder {
      color: #aaaaaa;
      text-align:center;
    }
    /*ie*/
    .el-input__inner:-ms-input-placeholder {
      color: #aaaaaa;
      text-align:center;
    }
    .el-radio__label {
      font-size: 12px;
      padding-left: 5px;
    }
  }
}
</style>
<style lang="scss" scoped>
.homeTwo {
  // display: flex;
  // flex-wrap: wrap;
  // min-width: 1620px;
  .main-content {
    display: flex;
    // justify-content: space-around;
    flex-wrap: wrap;
    .main-item {
      flex: 1;
      // min-width: 570px;
    }
    .main-item:nth-of-type(2){
      margin-left: 20px;
    }
  }

  .equipTemMain {
    // width: 570px;
    width: 100%;
    min-height: 340px;
    box-sizing: content-box;
    padding-bottom: 20px;
    // background-color: #FFF;
    @include background_color("mainBackGroundColor");
    // border: 1px solid #6985fb;
    border: 1px solid;
    @include background_image("equipTemBackgroundImage");
    // box-shadow: inset 0 0 20px 0 #396dff;
    @include box_shadow("equipTemBoxShadow");
    border-radius: 15px 10px 10px 10px;
    // margin-right: 20px;
    margin-bottom: 20px;
    // background-image: url('../../../../../../assets/border/left-top-bg.png'),
    //   url("../../../../../../assets/border/right-top-bg.png"),
    //   url("../../../../../../assets/border/right-bottom-bg.png"),
    //   url("../../../../../../assets/border/left-bottom-bg.png");
    @include border_color("equipTemBorderColor");
    background-repeat: no-repeat, no-repeat, no-repeat, no-repeat;
    background-position: top left, top right, bottom right, bottom left;
    h3.title {
      line-height: 36px;
      padding-left: 10px;
      position: relative;
      margin: 0;
      width: 100%;
      border:none;
      border-top-left-radius: 15px;
      background-color: #1a3166;
      @include background_color("tepBkColor");
    }
    h3.title8::before {
      content: "";
      height: 100%;
      // background-image: url("../../../../../../assets/border/short-h3-bg8.png");
      background-repeat: no-repeat;
      background-position: top left;
      border-radius: 10px;
      padding-left: 20px;
      position: absolute;
      top: 4px;
      left: 9px;
      z-index: -50;
    }
    h3.title6::before {
      content: "";
      height: 100%;
      background-repeat: no-repeat;
      background-position: top left;
      border-radius: 10px;
      padding-left: 20px;
      position: absolute;
      top: 4px;
      left: 9px;
      z-index: -50;
      // background-image: url("../../../../../../assets/border/short-h3-bg6.png");
    }
    h3.title9::before {
      content: "";
      height: 100%;
      background-repeat: no-repeat;
      background-position: top left;
      border-radius: 10px;
      padding-left: 20px;
      position: absolute;
      top: 1px;
      left: 0px;
      z-index: -50;
      // background-image: url("../../../../../../assets/border/long-h3-bg.png");
    }
    p {
      margin-left: 15px;
      margin-top: 8px;
      font-size: 16px;
      // color: #cdd8f7;
      @include font_color("mainFontColor10");
    }
    .inputNumber {
      width: 100px;
      margin-right: 20px;
      height: 29px;
    }
    .top {
      margin-left: 71px;
      margin-right: 10px;
      margin-top: 10px;
      span {
        display: inline-block;
        width: calc(20% - 20px);
        font-size: 12px;
        // color: #6e83be;
        @include font_color("equipTemFontColor");
        margin-right: 20px;
      }
    }
    .two {
      margin-left: 20px;
      margin-right: 10px;
      display: flex;
      span {
        display: inline-block;
        height: 30px;
        line-height: 30px;
        text-align: center;
        width: 36px;
        font-size: 12px;
        // color: #cdd8f7;
        @include font_color("mainFontColor10");
        text-align: right;
        margin-right: 15px;
      }
      input {
        width: calc(20% - 23px);
        height: 30px;
        // background: #162456;
        @include background_color("mainInputBackGroundColor");
        // border: 1px solid #475a9a;
        border: 1px solid;
        @include border_color("mainInputBorderColor");
        border-radius: 2px;
        margin-right: 20px;
        padding-left: 10px;
        font-size: 12px;
        // color: #cdd8f7;
        @include font_color("mainFontColor4");
      }
    }
    .three {
      margin-left: 20px;
      margin-right: 10px;
      display: flex;
      span {
        display: inline-block;
        width: 36px;
        height: 30px;
        line-height: 30px;
        text-align: right;
        margin-right: 15px;
        font-size: 12px;
        // color: #cdd8f7;
        @include font_color("mainFontColor10");
      }
      input {
        width: calc(20% - 23px);
        height: 30px;
        // background: #162456;
        // border: 1px solid #475a9a;
        border-radius: 2px;
        margin-right: 20px;
        padding-left: 10px;
        font-size: 12px;
        // color: #cdd8f7;
        @include font_color("mainFontColor4");
      }
    }
    .four {
      margin-left: 20px;
      margin-right: 10px;
      display: flex;
      span {
        display: inline-block;
        width: 36px;
        height: 30px;
        line-height: 30px;
        text-align: right;
        margin-right: 15px;
        font-size: 12px;
        // color: #cdd8f7;
        @include font_color("mainFontColor10");
      }
      input {
        width: 100px;
        height: 30px;
        // background: #162456;
        // border: 1px solid #475a9a;
        border-radius: 2px;
        margin-right: 20px;
        padding-left: 10px;
        font-size: 12px;
        // color: #cdd8f7;
        @include font_color("mainFontColor4");
      }
    }
    .five {
      margin-left: 20px;
      margin-right: 10px;
      display: flex;
      span {
        display: inline-block;
        width: 36px;
        height: 30px;
        line-height: 30px;
        text-align: right;
        margin-right: 15px;
        font-size: 12px;
        // color: #cdd8f7;
        @include font_color("mainFontColor10");
      }
      input {
        width: 100px;
        height: 30px;
        // background: #162456;
        // border: 1px solid #475a9a;
        border-radius: 2px;
        margin-right: 20px;
        padding-left: 10px;
        font-size: 12px;
        // color: #cdd8f7;
        @include font_color("mainFontColor4");
      }
    }
    .six {
      margin-left: 20px;
      margin-right: 10px;
      display: flex;
      span {
        display: inline-block;
        width: 36px;
        height: 30px;
        line-height: 30px;
        text-align: right;
        margin-right: 15px;
        font-size: 12px;
        // color: #cdd8f7;
        @include font_color("mainFontColor10");
      }
      input {
        width: 100px;
        height: 30px;
        // background: #162456;
        // border: 1px solid #475a9a;
        border-radius: 2px;
        margin-right: 20px;
        padding-left: 10px;
        font-size: 12px;
        color: #cdd8f7;
        @include font_color("mainFontColor4");
      }
    }
  }
  .main1 {
    // width: 420px !important;
    min-height: 405px;
    a {
      display: inline-block;
      margin-left: 15px;
      margin-top: 8px;
      margin-bottom: 17px;
      font-size: 16px;
      // color: #cdd8f7;
      @include font_color("mainFontColor10");
    }
    .main1Top {
      margin-top: 10px;
    }
    p {
      margin-top: 20px;
      margin-left: 35px;
      font-size: 12px;
      // color: #6e83be;
      @include font_color("equipTemFontColor");
    }
    input {
      padding-left: 10px;
      // background: #162456;
      // border: 1px solid #475a9a;
      border-radius: 2px;
      height: 30px;
      width: 330px;
      margin-left: 30px;
      margin-top: 10px;
      font-size: 12px;
      // color: #cdd8f7;
      @include font_color("mainFontColor4");
    }
    .main1-content{
      display: flex;
      justify-content: space-between;
      .main1-item{
        width: 150px;
        margin-top: 20px;
        margin-left: 35px;
        p {
          margin-top: 0;
          margin-left: 0px;
          font-size: 12px;
          // color: #6e83be;
          @include font_color("equipTemFontColor");
        }
        .radio-content {
          margin-top: 20px;
        }
      }
    }
  }
  .main3{
    min-height: 140px;
  }
  .con1 {
    .inputNumber {
      width: 70px;
      margin-right: 60px;
      height: 29px;
    }
    .top {
      span {
        width: calc(25% - 20px) !important;
      }
    }
    input {
      width: 145px !important;
    }
    .radio-content2 {
      width: calc(25% - 23px);
      display: inline-block;
    }
  }
  .con2 {
    min-height: 405px;
    .top {
      span {
        width: calc(50% - 36px) !important;
      }
    }
    input {
      width: 228px !important;
    }
  }
  .btn {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
    margin-top: 35px;
  }
}
</style>
