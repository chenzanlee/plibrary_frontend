<template>
  <div class="overview-home" :style="isfullScreen ? 'height:100%' : ''">

    <nav-form
      v-show="!isfullScreen"
      id="regionalAlarmMonitoring"
      class="nav-view"
      :data="navFormInfo.data"
      :field-list="navFormInfo.fieldList"
    >
      <!-- 自定义插槽的使用 -->
      <template v-slot:form-cascader>
        <div>
          <el-cascader
            ref="cascader"
            v-model="navFormInfo.data.cascader"
            clearable
            :options="navFormInfo.fieldList.left.inpLists[0].options"
            :props="{
              checkStrictly:
                true,
              expandTrigger: 'hover',
              label: navFormInfo.fieldList.left.inpLists[0].customLabel
                ? navFormInfo.fieldList.left.inpLists[0].customLabel
                : 'label',
              value: navFormInfo.fieldList.left.inpLists[0].customValue
                ? navFormInfo.fieldList.left.inpLists[0].customValue
                : 'value',
            }"
            :class="
              navFormInfo.fieldList.left.inpLists[0].checkStrictly ||
                navFormInfo.fieldList.left.inpLists[0].width
                ? 'shadow addwidth'
                : 'shadow '
            "
            filterable
            :placeholder="navFormInfo.fieldList.left.inpLists[0].placeholder"
            :style="{ width: navFormInfo.fieldList.left.inpLists[0].width }"
            @change="handleEvent"
            @visible-change="visibleChange"
          >
            <template slot-scope="{ data, node }">
              <div v-if="!data.hasOwnProperty('children')" class="custom-data">
                {{ data.title }}
                <div
                  v-if="fieldIds.indexOf(data.value) !== -1"
                  class="focus-ico"
                  @click.stop="focus(node, 'noFocus')"
                >
                  <svg-icon icon-class="focus" />
                </div>
                <div
                  v-else
                  class="focus-ico"
                  @click.stop="focus(node, 'focus')"
                >
                  <svg-icon icon-class="no-focus" />
                </div>
              </div>
            </template>
          </el-cascader>
        </div>
      </template>
      <template v-slot:left>
        <!-- <div class="top-l">
          <p>
            室外温湿度：<span class="temperature"
              ><svg-icon icon-class="temperature-ico" />{{
                deviceOverviewInfo &&
                deviceOverviewInfo.temperatureOuter !== -100 &&
                deviceOverviewInfo.temperatureOuter !== undefined
                  ? deviceOverviewInfo.temperatureOuter + '℃'
                  : '---'
              }}</span
            ><span class="humi "
              ><svg-icon icon-class="humi-ico" />{{
                deviceOverviewInfo &&
                deviceOverviewInfo.humiditieOuter !== -100 &&
                deviceOverviewInfo.humiditieOuter !== undefined
                  ? deviceOverviewInfo.humiditieOuter + '%'
                  : '---'
              }}</span
            >
          </p>
        </div> -->
        <div v-show="!isfullScreen" class="focus-list">
          <div style="flex-shrink: 0;">我的关注：</div>
          <div class="focus-scrollbar">
            <div
              v-for="(item, index) in focusLists"
              :key="index"
              class="focus-list"
            >
              <div
                v-if="index < 20"
                class="focus-txt"
                :class="focusCurrent === item.id ? 'focus-txt-current' : ''"
                @click="currentFocus(item)"
              >
                {{ item.fieldName }}
              </div>
            </div>
          </div>
          <div style="flex-shrink: 0;">
            <button class="btn-border more-focus" @click="dialogDtatus = true">
              <svg-icon icon-class="view-more" />
              所有关注
            </button>
          </div>
        </div>
      </template>
      <template v-slot:right>
        <!-- <div class="top-l">
              <p><svg-icon icon-class='warn-ico' /> 该场区未配置全场报警推送人，请前往<span class="warn">基础信息维护 — 报警推送管理 — 推送目标维护</span>进行配置</p>
          </div> -->
      </template>
    </nav-form>
    <div
      class="dialog"
      :class="dialogDtatus ? 'dialog-block' : 'dialog-hidden'"
    >
      <div class="dialog-body Highlight">
        <div class="dialog-head">
          <span>我的关注</span>
          <div class="dialog-head-close" @click="close">
            <i class="iconfont">&#xe61a;</i>
          </div>
        </div>
        <div class="dialog-container">
          <div
            v-for="(item, index) in focusLists"
            :key="index"
            class="focus-list"
          >
            <div
              class="focus-txt"
              :class="focusCurrent === item.id ? 'focus-txt-current' : ''"
              @click="confirm(item)"
            >
              {{ item.fieldName }}
            </div>
          </div>
        </div>
        <!-- <div class="dialog-foot">
          <button-list
            :btn-list="btnList"
            @btn-added="confirm"
            @btn-edit="close"
          />
        </div> -->
      </div>
      <div class="dialog-close" @click="close" />
    </div>

    <el-alert
      v-if="!isHasFieldConfigAlarmNoticeUsers"
      title="场区未配置全场报警推送人,请前往 基础信息维护-告警推送管理-推送人员维护 进行配置!"
      type="warning"
      show-icon
      style="margin-bottom: 10px"
    />

    <el-row :gutter="20" :style="isfullScreen ? 'height:100%' : ''">
      <el-col
        v-loading="loading"
        :span="18"
        class="view-height"
        :style="isfullScreen ? 'height:100%' : ''"
      >
        <div class="titleHighlight view-height" :style="isfullScreen ? 'height:100%' : ''">
          <h3 class="short-title">单元信息</h3>
          <div>
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane
                v-for="(item, index) in table"
                :key="index"
                :label="item.name"
                :name="item.val"
              >
                <span slot="label" class="tab-t">{{ item.name }}</span>
                <el-scrollbar class="radio-scrollbar">
                  <div class="radio">
                    <el-button
                      v-for="(j, k) in item.radio"
                      :key="k"
                      :class="{ active: currentSort == k }"
                      @click="active(j, k)"
                    >
                      <svg-icon v-if="k !== 0" :icon-class="j.icon" />
                      {{ j.name }}({{ j.number }})</el-button>
                  </div>
                  <div class="option">
                    <div class="filter default">
                      <el-select
                        v-model="filterValue"
                        placeholder="请选择"
                        @change="sortChange"
                      >
                        <el-option
                          v-for="item in filterOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </div>
                    <div
                      class="layout"
                      @click="
                        () => {
                          if (viewDisplay === 'panel') {
                            viewDisplay = 'table'
                          } else {
                            viewDisplay = 'panel'
                          }
                        }
                      "
                    >
                      <svg-icon icon-class="view-layout" />
                    </div>
                    <div v-if="!isfullScreen" class="full-screen" @click="checkFullScreen">
                      <svg-icon icon-class="full-screen" />
                    </div>
                    <div v-if="isfullScreen" class="full-screen" @click="checkFullScreen">
                      <svg-icon icon-class="shirk-screen" />
                    </div>
                  </div>
                </el-scrollbar>
                <el-scrollbar
                  v-if="pigHouseLists.length !== 0 && viewDisplay === 'panel'"
                  :ref="'homeWarpScrollbar' + index"
                  class="home-warp-scrollbar"
                  :class="isfullScreen ? 'scrollbar-full' : ''"
                >
                  <div ref="homeWrap" class="home-warp">
                    <el-col
                      v-for="(data, k) in pigHouseLists"
                      :key="k"
                      :lg="8"
                      :xl="6"
                    >
                      <div
                        class="home-item"
                        :style="
                          data.statusWarning === 1
                            ? 'border: 2px solid #FF5656!important;'
                            : ''
                        "
                        @click="link(data)"
                      >
                        <div class="item-title">
                          {{ data.fieldName ? data.fieldName : '---' }}
                        </div>
                        <div class="item-title">
                          <div class="name">
                            <!-- <div class="room"> -->
                            {{
                              data.roomTypeName
                                ? data.roomTypeName + data.unit
                                : '---'
                            }}
                            <!-- </div> -->
                            <!-- <div class="unit"> -->
                            <!-- {{data.unit}} -->
                            <!-- </div> -->
                          </div>
                          <!-- <svg-icon :icon-class="item.status"></svg-icon> -->
                          <div class="icon-box">
                            <svg-icon
                              class="icon-item"
                              :icon-class="
                                data.statusOnline === 1
                                  ? 'online-ico'
                                  : 'offline-ico'
                              "
                            />
                            <svg-icon
                              v-if="data.statusWarning === 1"
                              class="icon-item"
                              icon-class="warn-num"
                            />
                            <svg-icon
                              v-if="data.isEmptyUnit === 1"
                              class="icon-item"
                              icon-class="empty-ico"
                            />
                            <svg-icon
                              v-if="data.isAlarmSuspend === 1"
                              class="icon-item"
                              icon-class="stop-alarm"
                            />
                            <svg-icon
                              v-if="data.isParamLock === true"
                              class="icon-item"
                              icon-class="lock-ico"
                            />
                          </div>
                        </div>
                        <div v-if="viewDisplay === 'panel'" class="item-main">
                          <div class="item-imgs">
                            <div class="item-img">
                              <div class="ico">
                                <div class="ico-img">
                                  <svg-icon icon-class="fan-ico" />
                                  <div class="num">
                                    {{ data.constantFanNum || '0' }}
                                  </div>
                                </div>
                              </div>
                              <div class="info">定速</div>
                            </div>
                            <div class="item-img">
                              <div class="ico">
                                <div class="ico-img">
                                  <svg-icon icon-class="fan-ico" />
                                  <div class="num">
                                    {{ data.trenchFanNum || '0' }}
                                  </div>
                                </div>
                              </div>
                              <div class="info">地沟</div>
                            </div>
                            <div class="item-img">
                              <div class="ico">
                                <div class="ico-img">
                                  <svg-icon icon-class="fan-ico" />
                                  <div class="num">
                                    {{ data.hotChangeFanNum || '0' }}
                                  </div>
                                </div>
                              </div>
                              <div class="info">热交换</div>
                            </div>
                            <div class="item-img">
                              <div class="ico">
                                <div class="ico-img">
                                  <svg-icon icon-class="fan-ico" />
                                  <div class="num">
                                    {{ data.endFanNum || '0' }}
                                  </div>
                                </div>
                              </div>
                              <div class="info">端部</div>
                            </div>
                          </div>
                          <!-- <div class="detail"> -->
                          <!-- <div class="deathRateWeek">
                              <div
                                class="num"
                                :style="viewColor(data.deathRateWeek)"
                              >
                                {{ data.deathRateWeek || '---' }}
                              </div>
                              <div class="info">周死亡率</div>
                            </div>
                            <div class="deathRateDay">
                              <div
                                class="num"
                                :style="viewColor(data.deathRateDay)"
                              >
                                {{ data.deathRateDay || '---' }}
                              </div>
                              <div class="info">日死亡率</div>
                            </div>
                            <div class="deathRateTotal">
                              <div
                                class="num"
                                :style="viewColor(data.deathRateTotal)"
                              >
                                {{ data.deathRateTotal || '---' }}
                              </div>
                              <div class="info">累计死亡率</div>
                            </div> -->
                          <!-- </div> -->
                          <div class="item-t">
                            <div>
                              <span>前</span>
                              <span>{{
                                data.temperatureInner1 &&
                                  data.temperatureInner1 !== -100
                                  ? data.temperatureInner1 + '°C'
                                  : '---'
                              }}</span>
                              <span>{{
                                data.humiditieInner1 &&
                                  data.humiditieInner1 !== -100
                                  ? data.humiditieInner1 + '%'
                                  : '---'
                              }}</span>
                            </div>
                          </div>
                          <div class="item-b">
                            <div>
                              <span>后</span>
                              <span>{{
                                data.temperatureInner2 &&
                                  data.temperatureInner2 !== -100
                                  ? data.temperatureInner2 + '°C'
                                  : '---'
                              }}</span>
                              <span>{{
                                data.humiditieInner2 &&
                                  data.humiditieInner2 !== -100
                                  ? data.humiditieInner2 + '%'
                                  : '---'
                              }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </el-col>
                  </div>
                </el-scrollbar>
                <div
                  v-else-if="
                    pigHouseLists.length !== 0 && viewDisplay === 'table'
                  "
                  class="home-warp"
                  style="height: calc(100vh - 353px);width:100%"
                  :class="isfullScreen ? 'scrollbar-full' : ''"
                >
                  <view-table
                    ref="tableData"
                    :table-data="pigHouseLists"
                    @handleRowClick="handleRowClick"
                  />
                </div>
                <div
                  v-else
                  style="height: calc(100vh - 390px);display: flex;
                        justify-content: center;
                        align-items: center;"
                  class="home-warp-none"
                >
                  <img style="max-width:300px" :src="noData | noDataFile('noData', 'svg')" alt="">
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </el-col>
      <el-col
        v-loading="loading"
        :span="6"
        class="view-height"
        style="overflow: hidden;"
        :style="isfullScreen ? 'height:100%' : ''"
      >
        <div
          class="main-right view-height titleHighlight"
          :style="isfullScreen ? 'height:100%' : ''"
        >
          <h3 class="short-title">报警信息</h3>
          <div class="right-tab overfolw">
            <!-- <div
              class="right-tab-bg"
              @mouseenter="clearTimes"
              @mouseleave="reloadTimes"
              @mousedown="move"
            > -->
            <div v-if="alarmInfo.length === 0" class="warn-none">
              <img style="max-width:300px" :src="noData | noDataFile('noData', 'svg')" alt="">
            </div>
            <!-- <vue-seamless-scroll v-else :data="alarmInfo" class="seamless-warp overfolw" :class-option="classOption"> -->
            <div class="seamless-warp overfolw">
              <div v-for="(item, index) in alarmInfo" :key="index">
                <p class="title">
                  <span class="prefix">|</span> {{ Object.keys(item)[0] }}
                </p>
                <ul>
                  <el-tooltip
                    v-for="(j, k) in Object.values(item)[0]"
                    :key="k"
                    class="item"
                    :visible-arrow="false"
                    popper-class="view-tooltip"
                    effect="dark"
                    placement="left"
                  >
                    <div slot="content" class="content">{{ j.name }} - {{ j.info }}<div class="nabla-right" /></div>
                    <!-- <div
                      class="option"
                      @click.stop.prevent="fieldList.head.handleClick"
                    >
                      <svg-icon
                        class="waring-icon"
                        :icon-class="fieldList.head.optionIcon"
                      />
                      {{ fieldList.head.option }}
                    </div> -->
                    <li>
                      {{ j.name }} - {{ j.info }}
                    </li>
                  </el-tooltip>
                </ul>
              </div>
            <!-- </vue-seamless-scroll> -->
            </div>
            <!-- <el-scrollbar class="ul-scrollbar"> -->
            <!-- <div v-if="alarmInfo.length === 0" class="warn-none">
                暂无报警信息
              </div> -->
            <!-- <div v-for="(item, index) in alarmInfo" v-else :key="index">
                <p class="title">
                  <span class="prefix">|</span> {{ Object.keys(item)[0] }}
                </p>
                <ul>
                  <li v-for="(j, k) in Object.values(item)[0]" :key="k">
                    {{ j.name }} - {{ j.info }}
                  </li>
                </ul>
              </div> -->
            <!-- </el-scrollbar> -->
          </div>
          <div class="cut" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  getRegionAreaFieldTree,
  isFieldConfigAlarmNoticeUsers,
  addFocus,
  cancelFocus,
  focusList,
  // getLeaderInfo,
  updateFieldLeaderInfo
} from '@/http/api/fieldDeviceOverview'
import { getDevicesByField, getAlarmInfosByField } from '@/http/api/regionalAlarmMonitoring'
import { collection } from '@/common/utils/array'
// import buttonList from '@/components/ElementComponent/button'
import navForm from '@/components/commonComponent/navForm'
import viewTable from '../common/components/viewTable/viewTable'
// import vueSeamlessScroll from 'vue-seamless-scroll'
import {
  radioList,
  initRadioList
} from '@/views/IntelligentControl/regionalAlarmMonitoring/common/mock'
// import noData from '@/assets/image/page/noData.png'
import { collectionMany } from '@/common/utils/array'
import Dialog from '@/components/dialog/dialog.js'
import EmptySetup from '@/views/IntelligentControl/regionalAlarmMonitoring/common/components/EmptySetup'
import { mapGetters } from 'vuex'
import { getConfigElement } from '@/utils/overtService'
export default {
  components: {
    navForm,
    // buttonList,
    viewTable
    // vueSeamlessScroll
  },
  provide() {
    return {
      overview: this
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'fullScreen']),
    isfullScreen() {
      return this.fullScreen
    }
    // classOption() {
    //   return {
    //     step: 0.2, // 数值越大速度滚动越快
    //     limitMoveNum: 0, // 开始无缝滚动的数据量 this.dataList.length
    //     hoverStop: true, // 是否开启鼠标悬停stop
    //     direction: 1, // 0向下 1向上 2向左 3向右
    //     openWatch: true, // 开启数据实时监控刷新dom
    //     singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
    //     singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
    //     waitTime: 1000 // 单步运动停止的时间(默认值1000ms)
    //   }
    // }
  },
  data() {
    return {
      noData: '',
      regionId: this.$route.params.regionId,
      areaId: this.$route.params.areaId,
      fieldId: this.$route.params.fieldId,
      isHasFieldConfigAlarmNoticeUsers: true,
      refreshInterval: '',
      loading: false,
      filterOptions: [
        {
          value: 'unit',
          label: '单元'
        },
        {
          value: 'batchNumber',
          label: '批次'
        },
        {
          value: 'temperatureInner1',
          label: '室内前温度'
        },
        {
          value: 'humiditieInner1',
          label: '室内前湿度'
        },
        {
          value: 'temperatureInner2',
          label: '室内后温度'
        },
        {
          value: 'humiditieInner2',
          label: '室内后湿度'
        }
      ],
      filterValue: 'unit',
      // pigHouseLists,
      editLeaderInfo: false,
      LeaderInfo: {
        fieldLeaderName: '',
        fieldLeaderPhone: ''
      },
      dialogDtatus: false,
      btnList: [
        {
          name: '取消',
          class: 'btn-border',
          size: '60',
          event: 'edit'
        },
        {
          name: '保存',
          class: 'btn-blue',
          size: '60',
          event: 'added'
        }
      ],
      viewDisplay: 'panel',
      pigHouseLists: [],
      fieldIds: [],
      focusLists: [],
      focusCurrent: '',
      top: 0,
      positionY: 0,
      // tabFilterList: pigHouseLists,
      tabFilterList: [],
      selectedOption: [],
      // selectedOption: ['-11', '-101', '-1001'],
      selectedLabel: '',
      hasConfigureNotifier: true,
      alarmInfo: [],
      timeHeight: null,
      deviceOverviewInfo: '',
      deviceList: '',
      navFormInfo: {
        data: {
          cascader: ''
        },
        fieldList: {
          left: {
            inpLists: [
              // {
              //   key: 'cascader',
              //   type: 'cascader',
              //   className: 'shadow',
              //   placeholder: '大区 / 区域 / 场区',
              //   width: '300px',
              //   customLabel: 'title',
              //   customValue: '',
              //   options: [],
              //   // handleChange: (val) => {
              //   //   console.log('更改的大区选择', val)
              //   //   this.selectedOption = val
              //   // }
              // },
              {
                key: 'cascader',
                type: 'slot',
                className: 'shadow',
                placeholder: '大区 / 区域 / 场区',
                width: '300px',
                customLabel: 'title',
                customValue: '',
                options: []
              },
              {
                type: 'button',
                innerText: '查询',
                className: 'btn-blue',
                authCode: 'getDevicesByAreaField:getAlarmInfosByAreaField',
                handleClick: () => {
                  // console.log('查询',this.navFormInfo)
                  if (document.querySelector('.home-warp-scrollbar')) {
                    this.$nextTick(() => {
                      this.table.forEach((item, index) => {
                        if (this.$refs.tableData) {
                          this.$refs['homeWarpScrollbar' + index][0].wrap.scrollTop = 0
                        }
                      })
                    })
                  }
                  if (document.querySelector('.home-warp')) {
                    this.$nextTick(() => {
                      this.table.forEach((item, index) => {
                        if (this.$refs.tableData) {
                          this.$refs.tableData[index].$children[0].bodyWrapper.scrollTop = 0
                        }
                      })
                    })
                  }
                  console.log(this.navFormInfo.data.cascader)
                  if (this.navFormInfo.data.cascader !== '' || this.navFormInfo.data.cascader.length !== 0) {
                    this.submitOption()
                    this.getBaseInfo()
                  } else {
                    this.$message.error('请选择区域！')
                  }
                }
              }
              // {
              //   type: 'button',
              //   innerText: '空圈设置',
              //   className: 'btn-border',
              //   handleClick: () => {
              //     this.setEmptyCircle()
              //   }
              // },
              // {
              //   type: 'button',
              //   innerText: '暂停报警设置',
              //   className: 'btn-blue',
              //   handleClick: () => {
              //     // console.log('获取的报警设置', this.selectedOption)
              //     if (this.selectedOption.length !== 0) {
              //       // console.log('暂停报警设置')
              //       this.$confirm('是否前往配置?', '该场区未设置全场告警推送人', {
              //         confirmButtonText: '前往配置',
              //         cancelButtonText: '取 消',
              //         type: 'warning'
              //       }).then(() => {
              //         this.$router.push({ path: '/unit-evc/baseInfo/alarmManagement/targetMaintenance' })
              //       })
              //     } else {
              //       this.$message.error('请选择场区！')
              //     }
              //   }
              // }
            ]
          }
        }
      },
      currentSort: 0,
      // tab可以选择默认
      activeName: 'all',
      table: [{ val: 'all', name: '全部类型', radio: radioList }],
      selection: ''
    }
  },
  watch: {
    'navFormInfo.data.cascader'(vals) {
      const isNoVal = vals.every(v => {
        if (!v) return true
      })
      if (isNoVal) {
        this.selectedOption = []
      }
    }
  },
  created() {
    this.initUrl()
  },
  mounted() {
    if (this.regionId && this.areaId && this.fieldId) {
      this.selectedOption = [this.regionId, this.areaId, this.fieldId]
      this.navFormInfo.data.cascader = [this.regionId, this.areaId, this.fieldId]
      this.submitOption()
      this.getBaseInfo()
    }
    console.log(this.selectedOption)
    const pageElement = getConfigElement('regionalAlarmMonitoring')
    console.log('权限', pageElement)
    console.log('mock模拟的数据', this.pigHouseLists)
    getRegionAreaFieldTree().then((res) => {
      console.log('获取的场区数据', res)
      this.navFormInfo.fieldList.left.inpLists[0].options = res.data
      // console.log('获取的大区id',this.fieldIds)
    })
    this.getFocusList()
    this.table = [{ val: 'all', name: '全部类型', radio: initRadioList }]
    console.log('当前的table', this.table)
    // this.selectedOption = ['-11', '-101']
    // this.navFormInfo.data.cascader = ['-11', '-101']
    // this.$refs['cascader'].showAllLevels = true
    if (sessionStorage.getItem('historyData') && sessionStorage.getItem('historyDataName')) {
      const data = JSON.parse(sessionStorage.getItem('historyData'))
      const data1 = JSON.parse(sessionStorage.getItem('historyDataName'))
      this.selectedOption = [data[0], data[1], data[2]]
      this.selectedLabel = [data1[0], data1[1], data1[2]]
      this.navFormInfo.data.cascader = [data[0], data[1], data[2]]
      if (!data[2]) {
        this.selectedOption = [data[0], data[1]]
        this.selectedLabel = [data1[0], data1[1]]
        this.navFormInfo.data.cascader = [data[0], data[1]]
      }
      sessionStorage.removeItem('historyData')
      sessionStorage.removeItem('historyDataName')
      this.submitOption()
      this.getBaseInfo()
    }
    // this.table[0].radio.forEach((item) => {
    //   // console.log('遍历的数据',item);
    //   if (item.name === '全部') {
    //     item.number = pigHouseLists.length
    //   } else {
    //     item.number = collectionMany(pigHouseLists, item.icon, 'status').length
    //   }
    // })
  },
  methods: {
    initUrl() {
      this.noData = this.$getImgUrl('noData', 'svg')
    },
    viewColor(val) {
      if (!val) {
        // return 'color:red'
      } else if (val < 0.25) {
        return 'color:#03C785'
      } else if (val >= 0.25 && val < 0.5) {
        return 'color:#E6D300'
      } else if (val > 0.5) {
        return 'color:#FF5656'
      }
    },
    checkFullScreen() {
      this.$store.dispatch('checkFullScreen')
    },
    sortChoosedUnit(list) {
      const obj = {}
      let arr = []
      list.forEach((item, index) => {
        const key = item.segmentName
        const keys = Object.keys(obj)
        obj[key] = keys.indexOf(key) !== -1 ? [...obj[key], item] : [item]
      })
      const values = Object.values(obj)
      if (values && values.length > 0) {
        values.forEach((item) => {
          const array = [
            ...item.sort((a, b) => {
              return a.unit - b.unit
            })
          ]
          arr = [...arr, ...array]
        })
      }
      return arr
    },
    sortChange(event) {
      // console.log('排序的内容', event, this.pigHouseLists)
      // let arr = [
      //   ...this.pigHouseLists.sort((a, b) => {
      //     return b.temperatureInner1 - a.temperatureInner1
      //   }),
      // ]
      switch (event) {
        case 'unit':
          this.pigHouseLists = [...this.sortChoosedUnit(this.pigHouseLists)]
          break
        case 'temperatureInner1':
          this.pigHouseLists = [
            ...this.pigHouseLists.sort((a, b) => {
              return b.temperatureInner1 - a.temperatureInner1
            })
          ]
          break
        case 'temperatureInner2':
          this.pigHouseLists = [
            ...this.pigHouseLists.sort((a, b) => {
              return b.temperatureInner2 - a.temperatureInner2
            })
          ]
          break
        case 'humiditieInner1':
          this.pigHouseLists = [
            ...this.pigHouseLists.sort((a, b) => {
              return b.humiditieInner1 - a.humiditieInner1
            })
          ]
          break
        case 'humiditieInner2':
          this.pigHouseLists = [
            ...this.pigHouseLists.sort((a, b) => {
              return b.humiditieInner2 - a.humiditieInner2
            })
          ]
          break
        case 'batchNumber':
          this.pigHouseLists = [
            ...this.pigHouseLists.sort((a, b) => {
              return b.batchNumber - a.batchNumber
            })
          ]
          break
        default:
          break
      }
    },
    confirm(item) {
      this.dialogDtatus = false
      this.currentFocus(item)
    },
    close() {
      this.dialogDtatus = false
    },
    currentFocus(item) {
      if (document.querySelector('.home-warp-scrollbar')) {
        this.$nextTick(() => {
          this.table.forEach((item, index) => {
            this.$refs['homeWarpScrollbar' + index][0].wrap.scrollTop = 0
            if (this.$refs.tableData) {
              this.$refs.tableData.bodyWrapper.scrollTop = 0
            }
          })
        })
      }
      if (document.querySelector('.home-warp')) {
        this.$nextTick(() => {
          this.table.forEach((item, index) => {
            if (this.$refs.tableData) {
              this.$refs.tableData[index].$children[0].bodyWrapper.scrollTop = 0
            }
          })
        })
      }
      console.log('当前选中的item', item)
      this.focusCurrent = item.id
      this.navFormInfo.data.cascader = this.selectedOption = [
        item.regionId,
        item.areaId,
        item.fieldId
      ]
      this.selectedLabel = [item.regionName, item.areaName, item.fieldName]
      this.submitOption()
      this.getBaseInfo()
    },
    saveLeaderInfo() {
      if (this.selectedOption[2]) {
        if (
          !this.LeaderInfo.fieldLeaderName ||
          !this.LeaderInfo.fieldLeaderPhone
        ) {
          this.$message.error('厂长名称和电话不能为空!')
        } else {
          const data = {
            fieldId: this.selectedOption[2],
            fieldLeaderName: this.LeaderInfo.fieldLeaderName,
            fieldLeaderPhone: this.LeaderInfo.fieldLeaderPhone
          }
          updateFieldLeaderInfo(data).then((res) => {
            console.log('更新厂长信息', res)
            this.$message.success('修改厂长信息成功')
            this.LeaderInfo.fieldLeaderName = res.data.fieldLeaderName
            this.LeaderInfo.fieldLeaderPhone = res.data.fieldLeaderPhone
            this.editLeaderInfo = false
          })
        }
      } else {
        this.$message.error('请选择场区')
      }
    },
    getFocusList() {
      focusList().then((res) => {
        console.log('获取的关注列表', res)
        this.focusLists = res.data
        this.fieldIds =
          res.data && res.data.length > 0
            ? res.data.map((item) => {
              console.log(item)
              return item.fieldId
            })
            : []
        console.log('getFocusList -> fieldIds', this.fieldIds)
      })
    },
    focus(node, val) {
      console.log('获取的关注的节点', node)
      if (val !== 'noFocus') {
        const data = {
          regionId: node.path[0],
          regionName: node.pathLabels[0],
          areaId: node.path[1],
          areaName: node.pathLabels[1],
          fieldId: node.path[2],
          fieldName: node.pathLabels[2]
        }
        addFocus(data)
          .then((res) => {
            this.$message.success(res.message)
            // this.fieldIds = [...this.fieldIds,res.data]
            this.getFocusList()
          })
      } else {
        console.log(collection(this.focusLists, node.value, 'fieldId'))
        cancelFocus({
          attentionId: collection(this.focusLists, node.value, 'fieldId').id
        }).then((res) => {
          this.$message.success(res.message)
          // this.fieldIds = [...this.fieldIds,res.data]
          this.getFocusList()
        })
      }
    },
    visibleChange(flag) {
      if (!flag) {
        console.log('wwwwwwwwwwwwwwwwwwwwwwwwwwwwww', this.$refs['cascader'])
      }
    },
    handleEvent(val) {
      if (val.length !== 0) {
        let cascader = {}
        this.focusCurrent = ''
        const nodeE = this.$refs['cascader'].getCheckedNodes()[0]
        if (nodeE && nodeE.level === 1) {
          this.$nextTick(vm => {
            this.$refs.cascader.checkedValue = []
            this.$refs.cascader.inputValue = ''
            event.path[0].innerText = []
          })
        } else {
          if (this.$refs['cascader'].getCheckedNodes().length !== 0) {
            cascader = this.$refs['cascader'].getCheckedNodes()[0]
          } else {
            cascader['path'] = this.$refs['cascader'].checkedValue
            cascader['pathLabels'] = []
            cascader['pathLabels'] = event.path[0].innerText
              .replace(/\s*/g, '')
              .split('/')
          }
          if (cascader.path.length !== 1) {
            if (cascader.path.length < 3) {
              this.selectedOption = cascader.path
              this.selectedLabel = cascader.pathLabels
              this.selectedOption[2] = ''
            } else if (cascader.path.length >= 3 && cascader.path[cascader.path.length - 1]) {
              this.selectedOption = cascader.path
              this.selectedLabel = cascader.pathLabels
              this.$refs['cascader'].dropDownVisible = false // 监听值发生变化就关闭它
            }
          } else {
            this.selectedOption = []
          }
        }
      }
      // if (nodeE === undefined || !nodeE) {
      //   cascader.path = this.$refs['cascader'].checkedValue
      //   cascader.pathLabels = []
      //   cascader.pathLabels = event.path[0].innerText
      //     .replace(/\s*/g, '')
      //     .split('/')
      // }
      // const children = this.$refs['cascader'].getCheckedNodes()
      // if (children.length > 0 && children[0].children.length < 1) { // 判断有没有下级
      //   this.$refs['cascader'].dropDownVisible = false // 监听值发生变化就关闭它
      // }
    },
    active(item, index) {
      // console.log('状态的点击事件', item, i)
      if (item.name === '全部') {
        this.pigHouseLists = this.tabFilterList
      } else {
        // this.pigHouseLists = collectionMany(
        //   this.tabFilterList,
        //   item.icon,
        //   'status'
        // )
        switch (item.name) {
          case '在线':
            this.pigHouseLists = collectionMany(
              this.tabFilterList,
              1,
              'statusOnline'
            )
            break
          case '离线':
            this.pigHouseLists = collectionMany(
              this.tabFilterList,
              0,
              'statusOnline'
            )
            break
          case '报警':
            this.pigHouseLists = collectionMany(
              this.tabFilterList,
              1,
              'statusWarning'
            )
            break
          case '空圈':
            this.pigHouseLists = collectionMany(
              this.tabFilterList,
              1,
              'isEmptyUnit'
            )
            break
          case '暂停报警':
            this.pigHouseLists = collectionMany(
              this.tabFilterList,
              1,
              'isAlarmSuspend'
            )
            break
          case '参数锁定':
            this.pigHouseLists = collectionMany(
              this.tabFilterList,
              true,
              'isParamLock'
            )
            break
        }
      }
      this.currentSort = index
    },
    link(item) {
      console.log('获取得详情的内容', item)
      this.clearTimes()
      this.clearRefreshInterval()
      sessionStorage.setItem('historyData', JSON.stringify(this.navFormInfo.data.cascader))
      sessionStorage.setItem('historyDataName', JSON.stringify(this.selectedLabel))
      this.selectedOption[2] = item.fieldId
      this.selectedLabel[2] = item.fieldName
      sessionStorage.setItem('fieldDeviceOverviewDetail', JSON.stringify({
        unitList: this.pigHouseLists,
        overview: item,
        selectedOption: this.selectedOption,
        selectedLabel: this.selectedLabel
      }))
      this.$router.push({
        name: 'intelligentControlOverview',
        params: {
          unitList: this.pigHouseLists,
          overview: item,
          selectedOption: this.selectedOption,
          selectedLabel: this.selectedLabel
        }
      })
    },
    handleRowClick(event) {
      console.log('表格点击事件', event)
      this.link(event)
    },
    // tab的点击事件
    handleClick(tab, event) {
      console.log('tab点击事件', tab)
      this.currentSort = 0
      if (tab.label === '全部类型') {
        this.pigHouseLists = this.tabFilterList = this.deviceList
      } else {
        this.pigHouseLists = this.tabFilterList = collectionMany(
          this.deviceList,
          tab.name,
          'roomTypeId'
        )
      }
      this.table[tab.index].radio.forEach((item) => {
        switch (item.name) {
          case '全部':
            console.log('获取的状态值', item, this.tabFilterList.length)
            item.number = this.tabFilterList.length
            break
          case '在线':
            item.number = collectionMany(
              this.tabFilterList,
              1,
              'statusOnline'
            ).length
            break
          case '离线':
            item.number = collectionMany(
              this.tabFilterList,
              0,
              'statusOnline'
            ).length
            break
          case '报警':
            item.number = collectionMany(
              this.tabFilterList,
              1,
              'statusWarning'
            ).length
            break
          case '空圈':
            item.number = collectionMany(
              this.tabFilterList,
              1,
              'isEmptyUnit'
            ).length
            break
          case '暂停报警':
            item.number = collectionMany(
              this.tabFilterList,
              1,
              'isAlarmSuspend'
            ).length
            break
          case '参数锁定':
            item.number = collectionMany(
              this.tabFilterList,
              true,
              'isParamLock'
            ).length
            break
        }
      })
      this.$nextTick(() => { this.sortChange('unit') })
    },
    // 自动刷新
    refreshIntervalFun() {
      this.refreshInterval = setInterval(() => {
        this.submitOption()
      }, 180000)
    },
    clearRefreshInterval() {
      clearInterval(this.refreshInterval)
    },
    // 基础信息查询
    getBaseInfo() {
      // getLeaderInfo({ fieldId: this.selectedOption[2] }).then((res) => {
      //   console.log('获取的厂长信息', res)
      //   this.LeaderInfo = res.data
      // })
      isFieldConfigAlarmNoticeUsers({
        regionId: this.navFormInfo.data.cascader[0],
        areaId: this.navFormInfo.data.cascader[1],
        fieldId: this.navFormInfo.data.cascader[2]
      }).then((res) => {
        console.log('查询场区是否配置整场告警通知推送接收人员', res)
        this.isHasFieldConfigAlarmNoticeUsers = res.data
      })
    },
    // 查询
    submitOption() {
      const obj = {
        regionId: this.navFormInfo.data.cascader[0],
        areaId: this.navFormInfo.data.cascader[1],
        fieldId: this.navFormInfo.data.cascader[2]
      }
      console.log('选择的场区', this.selectedOption)
      if (this.selectedOption.length !== 0) {
        this.loading = true
        getAlarmInfosByField(obj).then((res) => {
          console.log('获取的告警信息', res)
          this.top = 0
          this.alarmInfo = res.data && res.data.length > 0 ? res.data : []
          console.log('alarmInfo', this.alarmInfo)
          this.clearTimes()
          // setTimeout(() => {
          //   this.reloadTimes()
          // }, 100)
          this.clearRefreshInterval()
          this.refreshIntervalFun()
        })
        // getLeaderInfo({ fieldId: this.selectedOption[2] }).then((res) => {
        //   console.log('获取的厂长信息', res)
        //   this.LeaderInfo = res.data
        // })
        // isFieldConfigAlarmNoticeUsers({
        //   regionId: this.selectedOption[0],
        //   areaId: this.selectedOption[1],
        //   fieldId: this.selectedOption[2]
        // }).then((res) => {
        //   console.log('查询场区是否配置整场告警通知推送接收人员', res)
        // })
        getDevicesByField(obj)
          .then((res) => {
            this.loading = false
            this.table = [{ val: 'all', name: '全部类型', radio: radioList }]
            this.deviceOverviewInfo = res.data
            this.pigHouseLists = this.tabFilterList = this.deviceList =
              res.data && res.data.deviceList ? res.data.deviceList : []
            this.table.push(...this.getTabs(this.deviceList))
            this.activeName = 'all'
            this.handleClick({ label: '全部类型', index: 0 })
            this.clearRefreshInterval()
            this.refreshIntervalFun()
          })
          .catch(() => {
            this.loading = false
          })
      } else {
        this.$message.error('请选择区域！')
      }
    },
    getTabs(data) {
      const arr = []
      data.forEach((item) => {
        if (item.roomTypeId && item.roomTypeName) {
          if (
            JSON.stringify(arr).indexOf(
              JSON.stringify({
                val: item.roomTypeId,
                name: item.roomTypeName,
                radio: radioList
              })
            ) === -1
          ) {
            arr.push({
              val: item.roomTypeId,
              name: item.roomTypeName,
              radio: radioList
            })
          }
        }
      })
      return arr
    },

    // 空圈
    setEmptyCircle() {
      if (this.navFormInfo.data.cascader) {
        const options = {
          rows: this.navFormInfo.data.cascader,
          closeDialog: () => {},
          handleOk: (e) => {},
          childs: EmptySetup
        }
        Dialog(options)
      } else {
        this.$message.warning('请选择场区')
      }
    },

    clearTimes() {
      window.clearInterval(this.timeHeight)
    },

    reloadTimes() {
      this.conditionScroll()
    }
    // move(e) {
    //   const dom = document.getElementsByClassName('right-tab')[0]
    //   const bgheight = document.getElementsByClassName('right-tab-bg')[0].offsetHeight
    //   // const odiv = e.target // 获取目标元素
    //   const disY = e.clientY
    //   document.onmousemove = (e) => { // 鼠标按下并移动的事件
    //     // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
    //     const top = e.clientY - disY
    //     this.positionY = top
    //     if (this.top + this.positionY < 0) {
    //       dom.scrollTop = 0
    //     } else if (this.top + this.positionY >= bgheight) {
    //       dom.scrollTop = bgheight - this.top
    //     } else {
    //       dom.scrollTop = this.top + this.positionY
    //     }
    //     // 绑定元素位置到positionX和positionY上面
    //     // this.positionX = top
    //     // 移动当前元素
    //     // odiv.style.top = top + 'px'
    //   }
    //   document.onmouseup = (e) => {
    //     this.top = this.top + this.positionY < 0 ? 0 : this.top + this.positionY
    //     document.onmousemove = null
    //     document.onmouseup = null
    //   }
    // },

    // conditionScroll() {
    //   this.clearTimes()
    //   const dom = document.getElementsByClassName('right-tab')[0]
    //   const domHeight = document.getElementsByClassName('right-tab')[0].offsetHeight
    //   const bgheight = document.getElementsByClassName('right-tab-bg')[0]?.offsetHeight
    //   if (bgheight <= domHeight) {
    //     return
    //   }
    //   this.timeHeight = setInterval(
    //     function() {
    //       this.top += 1
    //       dom.scrollTop = this.top
    //       if (dom.scrollHeight - dom.scrollTop === domHeight) {
    //         this.top = 0
    //       } else if (this.top + domHeight >= bgheight) {
    //         this.top = 0
    //       }
    //     }.bind(this),
    //     20
    //   )
    // }
  }
}
</script>
<style lang="scss">
.el-alert--warning.is-light  {
  background: rgba(253,246,236,0.2)
}
.overview-home{
.logManagement{
  flex-wrap: nowrap !important;
}
}

.view-tooltip {
  background: #364687 !important;
  position: relative;

  .nabla-right {
    position: absolute;
    top: 12px;
    right: -7px;
    z-index: 99999999;
    width: 0px;
    height: 0px;
    border-left: 7px solid #364687;
    border-bottom: 7px solid transparent;
    border-top: 7px solid transparent;
  }
}
.cut {
  height: 20px;
}
.overview-home {
  overflow: hidden;
  .focus-scrollbar{
    // min-width: 100px;
    margin-right: 5px;
    display: -webkit-box;
   &::-webkit-scrollbar {
        height: 0 !important;
   }
  }
  .el-tabs__header {
    padding-left: 10px;
  }
  .el-tabs__nav-wrap::after {
    @include background_color('mainTitleBorderColor');
  }
  .el-tabs__nav-wrap::after {
    height: 1px;
  }
  .el-tabs {
    .el-tabs__item.is-active,
    .el-tabs__item {
      font-size: 14px;
    }
  }
  .radio-scrollbar {
    padding-left: 10px;
    padding-right: 10px;
    .el-scrollbar__view {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .el-scrollbar__wrap::-webkit-scrollbar {
      display: none;
    }
    .option {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      .layout {
        font-size: 24px;
        cursor: pointer;
        margin: 0 10px;
      }
      .full-screen {
        font-size: 24px;
        cursor: pointer;
      }
    }
  }
}
.overview-home,
.multi-function-setting,
.multi-unit-setting {
  .dialog {
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
    @include font-color('mainFontColor11');
  }
  .focus-txt {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    @include background_color('focusBkColor');
    @include font-color('formColor');
    border-radius: 2px;
    font-size: 14px;
    height: 36px;
    padding: 10px;
    margin-right: 15px;
  }
  .focus-txt-current {
    border: 1px solid #20a4fc;
    color: #20a4fc;
  }
}
</style>
<style lang="scss" scoped>
.nav-view{
  display: flex;
  align-items: center;
  // margin-bottom: 10px;
}
.view-height{
  height: calc(100vh - 186px) ;
}
.seamless-warp{
    height: 100%;
    overflow: auto;
}
.focus-scrollbar{
  text-align: center;
// white-space: nowrap;
  overflow-x: scroll;
  overflow-y: auto;
  margin-right: 5px;
}
.scrollbar-full {
  height: calc(100vh - 200px) !important;
}
.home-warp-scrollbar {
    height: calc(100vh - 341px);
  overflow-x: hidden;
  .home-warp-none {
    @include font_color("overviewFontColor2");
    height: calc(100vh - 341px);
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.custom-data {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}
.focus-ico {
  // padding: 20px;
  font-size: 16px;
  z-index: 1111;
}
.top-l {
  font-size: 14px;
  @include font_color("overviewFontColor2");
  line-height: 36px;
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  span {
    padding: 0 15px;
  }
  .temperature {
    color: #1fbfff;
  }
  .humi {
    color: #1fffa0;
  }
  .warn {
    color: #1fbfff;
    padding: 0;
  }
  .leader-info {
    display: flex;
    .name,
    .phone {
      display: flex;
    }
    .name {
      margin-right: 20px;
    }
    .ico {
      padding: 0 10px;
      margin-right: 4px;
    }
    .input {
      input {
        padding: 0 10px;
        max-width: 110px;
        height: 26px;
        @include font_color("overviewFontColor1");
        background: none;
        outline: none;
        border: solid 1px #409eff;
        border-radius: 2px;
      }
    }
  }
}

.more-focus {
  cursor: pointer;
  padding: 8px 20px
}
.radio {
  height: 40px;
  display: flex;
  justify-content: end;
  // margin-bottom: 10px;
  button[type='button'] {
    padding: 3px 7px;
    font-size: 12px;
    background: transparent;
    // border: 1px solid #42548b;
    border: 1px solid;
    @include border_color('viewRadioColor');
    @include font-color("taskTagFontColor");
    padding: 0 5px;
    height: 24px;
  }
  button.active[type='button'] {
    color: #1fbfff !important;
    background: rgba(9, 30, 64, 0);
    border: 1px solid #1fbfff;
    // box-shadow: inset 0 0 10px 0 #217bfc;
    @include box_shadow('viewRadioBoxShadow');
  }
}
.home-warp {
  display: flex;
  // justify-content: space-between;
  flex-wrap: wrap;
  > div {
    margin: 10px 0;
  }
}
.titleHighlight {
  padding-bottom: 15px;
}
.home-item {
  border: 2px solid transparent;
  @include background_image('viewBackGroundImage1');
  // box-shadow: 0 2px 20px 0 #04082d;
  @include box_shadow('viewBoxShadow1');
  border-radius: 4px;
  // color: #cdd8f7;
  @include font-color('mainFontColor12');
  box-sizing: border-box;
  cursor: pointer;
  min-width: 212px;
  &:hover {
    // border: 2px solid #10aeff;
    .item-main {
      @include background_image('viewBackGroundImage2');
    }
  }
  // > div {
  //   padding: 0 20px;
  // }
  .detail {
    display: flex;
    text-align: center;
    margin-top: 10px;
    // justify-content: center;
    .info {
      font-size: 10px;
      color: #99a3bf;
    }
    .num {
      font-size: 12px;
      color: #99a3bf;
    }
    .deathRateWeek {
      flex: 1;
      // .num {
      //   color: #ff5656;
      // }
    }
    .deathRateDay {
      flex: 1;
      // .num {
      //   color: #03c785;
      // }
    }
    .deathRateTotal {
      flex: 1;
      // .num {
      //   color: #e6d300;
      // }
    }
  }
  .icon-box {
    .icon-item {
      margin-left: 10px;
    }
  }
  .item-title {
    padding: 0 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    @include background_color('viewBackGround6');
    // line-height: 34px;
    // height: 34px;
    font-size: 14px;
  }
  .item-main {
    padding: 0 14px;
    padding-top: 10px;
    .item-imgs {
      display: flex;
    }
    .item-img {
      flex: 1;
      text-align: center;
      .ico {
        display: flex;
        justify-content: center;
        font-size: 10px;
        // width: 28px;
        .num {
          position: absolute;
          font-size: 10px;
          top: 0;
          right: -5px;
          border-radius: 50%;
          background: #10aeff;
          width: 14px;
          height: 14px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .ico-img {
          position: relative;
          font-size: 28px;
          width: 28px;
          // height: 28px;
        }
      }
      .info {
        font-size: 10px;
        @include font_color('viewFontColor1');
      }
    }
  }
  .item-t {
    // border-bottom: 1px solid #374990;
    border-bottom: 1px solid;
    @include border_color('viewBorderColor6');
  }
  .item-t,
  .item-b {
    line-height: 34px;
    font-size: 10px;
    @include font_color('mainFontColor12');
    > p {
      // font-size: 12px;
    }
    > div {
      display: flex;
      justify-content: space-between;
      // font-size: 12px;
    }
  }
}
.main-right {
  width: 100%;
  height: calc(100vh - 186px);
  // height: 100%;
  .warning {
    width: 100%;
    padding: 20px 5px;
    background-image: linear-gradient(225deg, #2c4190 0%, #1d2a69 100%);
    border-radius: 8px;
    border-radius: 8px;
    display: flex;
    .warning-item {
      width: 50%;
      display: flex;
      text-align: left;
      .number {
        font-size: 30px;
        color: #8ea0ea;
      }
      .name {
        font-size: 14px;
        color: #8ea0ea;
      }
      .waring-icon {
        width: 40px;
        height: 43px;
        margin: 10px;
      }
    }
  }
  .right-tab {
    padding-left: 10px;
    width: 100%;
    // margin-top: 10px;
    padding-bottom: 30px;
    height: 100%;
    flex: 1;
    overflow-y: hidden;
    // TODO:设备概览报警信息滚动
    // overflow-y: scroll;
    height: calc(100% - 34px);
    // &::-webkit-scrollbar {
    //   display: none;
    // }
    .title {
      font-size: 16px;
      @include font-color('mainFontColor12');
      margin: 10px 0;
      text-align: left;
      .prefix {
        margin-right: 10px;
      }
    }
    .right-tab-bg {
      width: 100%;
      height: auto;
      -webkit-touch-callout:none; /*系统默认菜单被禁用*/
      -webkit-user-select:none; /*webkit浏览器*/
      -khtml-user-select:none; /*早期浏览器*/
      -moz-user-select:none;/*火狐*/
      -ms-user-select:none; /*IE10*/
      user-select:none;
    }
    .ul-scrollbar {
      height: calc(100vh - 315px);
      overflow-x: hidden;
      .title {
        font-size: 16px;
        @include font-color('mainFontColor12');
        margin: 10px 0;
        text-align: left;
        .prefix {
          margin-right: 10px;
        }
      }
    }
    .warn-none {
      height: calc(100vh - 315px);
      overflow-x: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .tab-t {
      position: relative;
      > i {
        padding: 3px 5px;
        background: #e45353;
        color: #fff;
        position: absolute;
        top: 0;
        right: -25px;
        font-style: normal;
        font-size: 10px;
        line-height: 10px;
        border-radius: 10px;
      }
    }
    li {
      list-style: inside;
      font-size: 14px;
      @include font-color('mainFontColor12');
      overflow: hidden;
      line-height: 40px;
      white-space: nowrap;
      text-overflow: ellipsis;
      cursor: pointer;
    }
    li:hover {
      color: #3e9aff;
    }
  }
}
.empty-setup {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vh;
  position: fixed;
  top: 30vh;
  z-index: 9999999;
}
div.popContainer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 9999998;
}
</style>
