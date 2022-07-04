<template>
  <div class="comfort-overview-home comfort-zone" :style="isfullScreen ? 'height:100%' : ''">
    <div class="nav-view">
      <nav-form
        v-show="!isfullScreen"
        class="nav-form"
        :data="navFormInfo.data"
        :field-list="navFormInfo.fieldList"
      >
        <template v-slot:form-cascader>
          <div>
            <el-cascader
              ref="cascader"
              v-model="navFormInfo.data.cascader"
              clearable
              :options="navFormInfo.fieldList.left.inpLists[0].options"
              :props="{
                checkStrictly:
                  navFormInfo.fieldList.left.inpLists[0].checkStrictly,
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
            >
              <template slot-scope="{ data, node }">
                <div
                  v-if="!data.hasOwnProperty('children')"
                  class="custom-data"
                >
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
      </nav-form>
      <div v-show="!isfullScreen" class="focus-list focus-flex">
        <el-tooltip class="" effect="dark" content="导出不舒适单元信息" placement="top-start">
          <el-button class="btn-blue" style="margin-right:10px; cursor:pointer;" @click="exportUncomfortData">
            <svg-icon icon-class="newExport" />
            导出
          </el-button>
          <!-- <img src="@/assets/image/export.png" > -->
        </el-tooltip>
        <div style="flex-shrink: 0">我的关注：</div>
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
        <div style="flex-shrink: 0">
          <button class="btn-border more-focus" @click="dialogDtatus = true">
            <svg-icon icon-class="view-more" />
            所有关注
          </button>
        </div>
      </div>
    </div>
    <div v-show="!isfullScreen" class="top-l">
      <el-row :gutter="10" style="margin-left:0;margin-right:0;width:100%">
        <el-col :span="18" style="padding-left:0">
          <div class="weather">
            <div class="weather-head">
              <div class="left">天气状况</div>
              <div class="right" @click="dialogWeater = true">更多></div>
            </div>
            <div class="weather-main" style="height:46px">
              <div v-if="weatherList.length !== 0" class="cut1">
                <span class="date">{{ weatherList[0].newDay || '-' }}今天</span>
                <img class="svg-img" :src="weatherList[0].weatherImg" alt="">
                <div class="container-carrier2-row">
                  <div class="container-carrier2-row-l">
                    <img class="img" src="@/assets/image/unitStatus/weather-wendu.svg">
                    温度
                  </div>
                  <div class="container-carrier2-row-r">{{ weatherList[0].hightemp || '-' }}°<span>/{{ weatherList[0].lowertemp || '-' }}°</span></div>
                </div>
                <div class="container-carrier2-row">
                  <div class="container-carrier2-row-l">
                    <img class="img" src="@/assets/image/unitStatus/weather-fengli.svg">
                    风力
                  </div>
                  <div class="container-carrier2-row-r">{{ weatherList[0].windlevel || '-级' }}</div>
                </div>
                <div class="container-carrier2-row shidu">
                  <div class="container-carrier2-row-l">
                    <img class="img" src="@/assets/image/unitStatus/weather-shidu.svg">
                    湿度
                  </div>
                  <div class="container-carrier2-row-r">{{ weatherList[0].humidity || '-' }}%</div>
                </div>
              </div>
              <div v-else style="text-align:center;height:100%;line-height:46px;">
                暂无数据
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6" style="padding-left:15px;padding-right:0">
          <div class="leader-info weather">
            <div class="weather-head">
              <div class="title left">场长信息：</div>
              <div class="edit" style="margin-left:10px;cursor: pointer;">
                <div
                  v-if="!editLeaderInfo"
                  class="ico"
                  @click="editLeaderInfo = true"
                >
                  <svg-icon icon-class="edit" />
                </div>
                <div v-else class="ico" @click="saveLeaderInfo">
                  <svg-icon icon-class="save" />
                </div>
              </div>
              <!-- <div v-if="LeaderInfo.fieldLeaderPhone && LeaderInfo.fieldLeaderName" class="edit ico" style="margin-left:10px;cursor: pointer;" @click="deleteLeaderInfo">
                <svg-icon icon-class="delete" />
              </div> -->
            </div>
            <div class="leader-main" style="display:flex;padding:5px 0;">
              <div class="name">
                <div class="ico"><svg-icon icon-class="view-people" /></div>
                <div class="name-info">
                  <div v-if="!editLeaderInfo" class="defalt">
                    {{ LeaderInfo ? LeaderInfo.fieldLeaderName : '' }}
                  </div>
                  <div v-else class="input">
                    <input v-model="LeaderInfo.fieldLeaderName" type="text">
                  </div>
                </div>
              </div>
              <div class="phone">
                <div class="ico"><svg-icon icon-class="view-phone" /></div>
                <div class="phone">
                  <div v-if="!editLeaderInfo" class="defalt">
                    {{ LeaderInfo ? LeaderInfo.fieldLeaderPhone : '' }}
                  </div>
                  <div v-else class="input">
                    <input
                      v-model="LeaderInfo.fieldLeaderPhone"
                      style="BACKGROUND-COLOR: transparent;"
                      type="text"
                    >
                  </div>
                </div>
              </div>
            </div>

          </div>
        </el-col>
      </el-row>
    </div>
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
      </div>
      <div class="dialog-close" @click="close" />
    </div>
    <div
      class="dialog"
      :class="dialogWeater ? 'dialog-block' : 'dialog-hidden'"
    >
      <div class="dialog-body Highlight">
        <div class="dialog-head">
          <span>更多天气</span>
          <div class="dialog-head-close" @click="dialogWeater = false">
            <i class="iconfont">&#xe61a;</i>
          </div>
        </div>
        <div class="dialog-container dialog-weater">
          <div
            v-for="(item, index) in weatherList"
            :key="index"
            class="weather-list"
          >
            <div class="weather-main" style="height:46px">
              <div class="cut1">
                <div class="container-carrier2-row date-row">
                  <span class="date">{{ item.newDay || '-' }}{{ item.date }}</span>
                  <img class="svg-img" :src="item.weatherImg" alt="">
                </div>
                <div class="container-carrier2-row wendu-row">
                  <div class="container-carrier2-row-l">
                    <img class="img" src="@/assets/image/unitStatus/weather-wendu.svg">
                    温度
                  </div>
                  <div class="container-carrier2-row-r">{{ item.hightemp || '-' }}°<span>/{{ item.lowertemp || '-' }}°</span></div>
                </div>
                <div class="container-carrier2-row fengli-row">
                  <div class="container-carrier2-row-l">
                    <img class="img" src="@/assets/image/unitStatus/weather-fengli.svg">
                    风力
                  </div>
                  <div class="container-carrier2-row-r">{{ item.windlevel || '-级' }}</div>
                </div>
                <div class="container-carrier2-row shidu">
                  <div class="container-carrier2-row-l">
                    <img class="img" src="@/assets/image/unitStatus/weather-shidu.svg">
                    湿度
                  </div>
                  <div class="container-carrier2-row-r">{{ item.humidity || '-' }}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <el-button
          class="btn-blue weater-close"
          style="    position: absolute;
    bottom: 30px;
    right: 45px;
"
          @click="dialogWeater = false"
        >关闭</el-button>
        <!-- <div class="dialog-foot">
          <button-list
            :btn-list="btnList"
            @btn-added="confirm"
            @btn-edit="close"
          />
        </div> -->
      </div>
      <div class="dialog-close" @click="dialogWeater = false" />
    </div>
    <el-row
      :gutter="20"
      class="overview-home-main"
      :style="isfullScreen ? 'height:100%' : ''"
    >
      <el-col
        v-loading="loading"
        :span="24"
        class="view-height"
        :style="isfullScreen ? 'height:100%' : ''"
      >
        <div
          class="titleHighlight view-height"
          :style="isfullScreen ? 'height:100%' : ''"
        >
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
                      v-for="filterItem in filterItems"
                      :key="filterItem.value"
                      :class="{ active: currentFilterItem == filterItem.value }"
                      @click="setCurrentFilterItem(filterItem.value)"
                    >
                      <svg-icon v-if="filterItem.value !== 0" :icon-class="filterItem.icon" />
                      {{ filterItem.name }}({{ filterData(deviceList,item.name,filterItem.value).length }})
                    </el-button>
                  </div>
                  <div class="option">
                    <input
                      v-model="minTemp"
                      class="my-input"
                      type="number"
                      placeholder="低温"
                    >
                    <span>-</span>
                    <input
                      v-model="maxTemp"
                      class="my-input"
                      type="number"
                      placeholder="高温"
                      style="margin-right: 10px"
                    >
                    <input
                      v-model="minAge"
                      class="my-input"
                      type="number"
                      placeholder="短龄"
                    >
                    <span>-</span>
                    <input
                      v-model="maxAge"
                      class="my-input"
                      type="number"
                      placeholder="长龄"
                      style="margin-right: 10px"
                    >
                    <div class="filter default" style="margin-right: 10px">
                      <el-select
                        v-model="filterValue"
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="fitem in filterOptions"
                          :key="fitem.value"
                          :label="fitem.label"
                          :value="fitem.value"
                        />
                      </el-select>
                    </div>
                    <div
                      style="margin-right:10px;cursor:pointer"
                      @click="exportData"
                    >
                      <el-button class="btn-blue">
                        <svg-icon icon-class="newExport" />
                        导出
                      </el-button>
                    </div>
                    <div
                      v-show="!isfullScreen"
                      class="full-screen"
                      @click="checkFullScreen"
                    >
                      <el-tooltip class="" effect="dark" content="全屏" placement="top-start">
                        <svg-icon
                          style="font-size: 24px"
                          icon-class="full-screen"
                        />
                      </el-tooltip>
                    </div>
                    <div
                      v-show="isfullScreen"
                      class="full-screen"
                      @click="checkFullScreen"
                    >
                      <el-tooltip class="" effect="dark" content="退出全屏" placement="top-start">
                        <svg-icon
                          style="font-size: 24px"
                          icon-class="shirk-screen"
                        />
                      </el-tooltip>
                    </div>
                  </div>
                </el-scrollbar>
                <div
                  v-if="filterData(deviceList,currentRoomType,currentFilterItem).length !== 0"
                  class="home-warp"
                  style="height: calc(100vh - 436px); width: 100%"
                  :class="isfullScreen ? 'scrollbar-full' : ''"
                >
                  <view-table
                    ref="tableData"
                    :table-data="[...filterData(deviceList,currentRoomType,currentFilterItem)]"
                    @handleRowClick="handleRowClick"
                  />
                </div>
                <div
                  v-else
                  style="
                    height: calc(100vh - 390px);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  "
                  class="home-warp-none"
                >
                  <img style="max-width:300px" :src="noData" alt="">
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="导出不舒适单元信息"
      class="exportDialog"
      :show-close="false"
      :visible="exportVisible"
      :modal="false"
      width="630px"
      height="335px"
    >
      <div v-loading="fileLoading" style="height:150px;" element-loading-text="文件加载中...">
        <div style="display: flex; align-items: center;" class="optionWrapper">
          <el-cascader
            ref="refSelect"
            v-model="selectedUncomfortOption"
            class="down-cascader"
            :options="fieldTree"
            :props="{
              label: 'title',
              value: 'value',
              expandTrigger: 'hover',
              checkStrictly: true,
            }"
            @change="cascaderChange"
          />
          <el-button class="dialog-btn btn-blue" style="height: 36px;line-height:36px;" @click="sureExport">确认导出</el-button>
        </div>
        <p style="padding-top:20px;">
          请先选择导出区域再点击确认导出按钮.<br>
          确认导出后会持续生成导出文件,文件生成完毕则可点击下载按钮下载文件.
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="dialog-btn-no-back btn-border" @click="handleCancelDownload">取 消</el-button>
        <a :href="isLoad ? urlDownload : 'javascript:void(0)'"><el-button type="primary" class="dialog-btn btn-blue" :disabled="!isLoad">下 载</el-button></a>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRegionAreaFieldTree,
  getDevicesByField,
  addFocus,
  cancelFocus,
  focusList,
  getLeaderInfo,
  addFieldLeaderInfo,
  updateFieldLeaderInfo,
  delFieldLeaderInfo,
  exportUnComfortExcel,
  exportUnComfortExcelUrl
} from '@/http/api/fieldDeviceOverview'
import {
  getListWeather
} from '@/http/api/fieldInfo'
import weatherService from '@/lib/service/weather-service'
// TODO:WebSocket
// import { createWebSocket, closeWebSocket } from '../../A.Public/utils/websocket'
import { collection } from '@/common/utils/array'
import navForm from '@/components/commonComponent/navForm'
// import noData from '@/assets/image/page/noData.png'
import { mapGetters } from 'vuex'
import moment from 'moment'
import { getConfigElement } from '@/utils/overtService'
import viewTable from '../viewTable'
import { derive } from '@/http/api/exportData/export'
const pageElement = getConfigElement('fieldDeviceOverview')
export default {
  components: {
    navForm,
    viewTable
  },
  data() {
    return {
      // 当前时间
      currentTime: '',
      weatherList: [],
      noData: '',
      fieldTree: [],
      regionId: this.$route.params.regionId,
      areaId: this.$route.params.areaId,
      fieldId: this.$route.params.fieldId,
      refreshInterval: '',
      cascadervalue: this.$refs.cascader && this.$refs.cascader.checkedValue,
      loading: false,
      isShowLoading: false,
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
          value: 'comfort',
          label: '舒适度'
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
      editLeaderInfo: false,
      LeaderInfo: {
        id: '',
        fieldLeaderName: '',
        fieldLeaderPhone: ''
      },
      dialogDtatus: false,
      dialogWeater: false,
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
      fieldIds: [],
      focusLists: [],
      focusCurrent: '',
      selectedOption: [],
      selectedUncomfortOption: [],
      selectedUncomfortLabel: {},
      copySelectedOption: [],
      selectedLabel: '',
      copySelectedLabel: '',
      hasConfigureNotifier: true,
      alarmInfo: [],
      deviceOverviewInfo: '',
      deviceList: [],
      navFormInfo: {
        data: {
          cascader: ''
        },
        fieldList: {
          left: {
            inpLists: [
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
                handleClick: () => {
                  if (document.querySelector('.home-warp-scrollbar')) {
                    this.$nextTick(() => {
                      this.table.forEach((item, index) => {
                        if (this.$refs.tableData) {
                          this.$refs[
                            'homeWarpScrollbar' + index
                          ][0].wrap.scrollTop = 0
                        }
                      })
                    })
                  }
                  if (document.querySelector('.home-warp')) {
                    this.$nextTick(() => {
                      this.table.forEach((item, index) => {
                        if (this.$refs.tableData) {
                          this.$refs.tableData[
                            index
                          ].$children[0].bodyWrapper.scrollTop = 0
                        }
                      })
                    })
                  }
                  this.isShowLoading = true
                  this.copySelectedOption = this.selectedOption
                  this.copySelectedLabel = this.selectedLabel
                  // TODO:WebSocket
                  // closeWebSocket(stompClient)
                  // createWebSocket(this.selectedOption[2], (data) => {
                  //   console.log('获取的WebSocket', data)
                  //   // this.updateDeviceList(data)
                  //   // this.refreshIntervalFun()
                  // }, (client) => {
                  //   stompClient = client
                  // })
                  // console.log('获取的当前ref', this.$refs['cascader'].inputValue.replace(/\s*/g, '')
                  //   .split('/'))
                  // if (
                  //   this.$refs['cascader'].inputValue
                  //     .replace(/\s*/g, '')
                  //     .split('/')[2]
                  //     .indexOf('公猪站') !== -1
                  // ) {
                  // } else {
                  // }
                  this.submitOption()
                  this.getBaseInfo()
                }
              }
            ]
          }
        }
      },
      currentFilterItem: 0, // 当前查看状态项
      currentRoomType: '全部类型', // 当前查看单元信息
      filterItems: [
        {
          name: '全部',
          value: 0,
          number: 0,
          icon: ''
        },
        {
          name: '在线',
          value: 1,
          number: 0,
          icon: 'online-ico'
        },
        {
          name: '离线',
          value: 2,
          number: 0,
          icon: 'offline-ico'
        },
        {
          name: '报警',
          value: 3,
          number: 0,
          icon: 'warn-num'
        },
        {
          name: '空圈',
          value: 4,
          number: 0,
          icon: 'empty-ico'
        },
        {
          name: '暂停报警',
          value: 5,
          number: 0,
          icon: 'stop-alarm'
        },
        {
          name: '参数锁定',
          value: 6,
          number: 0,
          icon: 'lock-ico'
        }
      ], // 数据状态筛选项
      // tab可以选择默认
      activeName: 'all',
      table: [{ val: 'all', name: '全部类型' }],
      selection: '',
      minTemp: null, // 最低温度
      maxTemp: null, // 最高温度
      minAge: null, // 最短日龄
      maxAge: null, // 最高日龄
      exportVisible: false, // 下载弹窗的显示
      isLoad: false, // 文件是否生成
      fileLoading: false, // 是否文件加载中
      urlDownload: '', // 生成下载文件地址
      exportInterval: null // 导出定时器
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'fullScreen']),
    isfullScreen() {
      return this.fullScreen
    }
  },
  watch: {
    cascadervalue(newVal, old) {}
  },
  provide() {
    return {
      overview: this
    }
  },
  created() {
    this.initUrl()
  },
  mounted() {
    const infos = JSON.parse(
      sessionStorage.getItem('fieldDeviceOverviewDetail')
    )
    if (this.regionId && this.areaId && this.fieldId) {
      this.selectedOption = [this.regionId, this.areaId, this.fieldId]
      this.copySelectedOption = [this.regionId, this.areaId, this.fieldId]
      this.navFormInfo.data.cascader = [
        this.regionId,
        this.areaId,
        this.fieldId
      ]
      this.isShowLoading = true
      this.submitOption()
      this.getBaseInfo()
    } else if (
      infos &&
      infos.overview &&
      infos.overview.regionId &&
      infos.overview.areaId &&
      infos.overview.fieldId
    ) {
      // 保留上次 查询信息
      this.selectedOption = [
        infos.overview.regionId,
        infos.overview.areaId,
        infos.overview.fieldId
      ]
      this.copySelectedOption = [
        infos.overview.regionId,
        infos.overview.areaId,
        infos.overview.fieldId
      ]
      this.navFormInfo.data.cascader = [
        infos.overview.regionId,
        infos.overview.areaId,
        infos.overview.fieldId
      ]
      this.submitOption()
      this.getBaseInfo()
    }
    // const pageElement = getConfigElement('fieldDeviceOverview')
    getRegionAreaFieldTree().then((res) => {
      this.navFormInfo.fieldList.left.inpLists[0].options = res.data
      this.fieldTree = res.data
    })
    this.getFocusList()
    this.table = [{ val: 'all', name: '全部类型' }]
  },

  destroyed() {
    this.clearRefreshInterval()
    clearInterval(this.exportInterval)
  },

  methods: {
    initUrl() {
      this.noData = this.$getImgUrl('noData', 'svg')
    },
    deleteLeaderInfo() {
      if (!(pageElement && pageElement.deleteFieldLeader && pageElement.deleteFieldLeader.uri)) {
        this.$message.error('暂无获取场长信息权限!')
        return
      }
      if (this.selectedOption.length === 3) {
        this.$httpRequest({
          type: 'get',
          payload: {
            fieldId: this.selectedOption[2]
          },
          uri: pageElement.deleteFieldLeader && pageElement.deleteFieldLeader.uri,
          callback: () => {
            // this.getUser(fieldId)
            this.LeaderInfo.fieldLeaderName = ''
            this.LeaderInfo.fieldLeaderPhone = ''
            this.isAddLeader = true
          }
        })
      } else {
        this.$message.error('请先选择场区!')
      }
    },
    getCurrentTime(d) {
      const date = d ? new Date(d) : new Date()
      const Y = date.getFullYear()
      const M =
        date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1
      const D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      const hh = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      const mm =
        date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      const ss =
        date.getSeconds() < 10 ? '0' + date.getDate() : date.getSeconds()
      const time = Y + '-' + M + '-' + D + ' ' + hh + ':' + mm + ':' + ss
      return time
    },
    nDate(t) {
      const date1 = new Date()
      const date2 = new Date(date1)
      date2.setDate(date1.getDate() + t)
      const day = date2.getDate() < 10 ? '0' + date2.getDate() : date2.getDate()
      const time2 = date2.getFullYear() + '-' + `${(date2.getMonth() + 1) > 10 ? (date2.getMonth() + 1) : '0' + (date2.getMonth() + 1)}` + '-' + day
      return time2
    },
    getWeek(dateString) {
      const dateArray = dateString.split('-')
      const date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2])
      return '周' + '日一二三四五六'.charAt(date.getDay())
    },
    // 天气信息
    async getWeatherData() {
      console.log('获取天气信息----------------')
      this.currentTime = this.getCurrentTime('')
      // this.loadingWeather = true
      const data = {
        endDay: this.nDate(4),
        fieldId: this.selectedOption[2],
        startDay: this.currentTime.split(' ')[0]
      }
      await getListWeather(data).then((res) => {
        // this.loadingWeather = false
        if (res && res.status === 200 && res.data) {
          const arr = JSON.parse(JSON.stringify(res.data.rows))
          for (const i of arr) {
            i.weatherImg = weatherService.getWeatherImg(i.weather)
            i.date = this.getWeek(i.day)
            i.newDay = i.day.split('-')[1] + '月' + i.day.split('-')[2] + '日'
          }
          // console.log('获取的天气this.weatherList2', this.weatherList, arr)
          // arr[0].newDay = '今天'
          this.weatherList = arr
          console.log('获取的天气this.weatherList3', this.weatherList)
        } else {
          this.$message({ message: res.message, type: 'warning' })
        }
      }).catch(() => {
        // this.loadingWeather = false
      })
    },
    cascaderChange(value) {
      if (value.length === 3) {
        this.$refs.refSelect.dropDownVisible = false
        const arr_region = this.fieldTree.filter((item) => {
          return item.value === value[0]
        })
        const arr_area = arr_region.length > 0 ? arr_region[0].children.filter((item) => {
          return item.value === value[1]
        }) : []
        const arr_field = arr_area.length > 0 ? arr_area[0].children.filter((item) => {
          return item.value === value[2]
        }) : []
        this.selectedUncomfortLabel = {
          regionName: arr_region.length > 0 ? arr_region[0].title : '',
          areaName: arr_area.length > 0 ? arr_area[0].title : '',
          fieldName: arr_field.length > 0 ? arr_field[0].title : ''
        }
      } else if (value.length === 2) {
        const arr_region = this.fieldTree.filter((item) => {
          return item.value === value[0]
        })
        const arr_area = arr_region.length > 0 ? arr_region[0].children.filter((item) => {
          return item.value === value[1]
        }) : []
        this.selectedUncomfortLabel = {
          regionName: arr_region.length > 0 ? arr_region[0].title : '',
          areaName: arr_area.length > 0 ? arr_area[0].title : ''
        }
      } else if (value.length === 1) {
        const arr_region = this.fieldTree.filter((item) => {
          return item.value === value[0]
        })
        this.selectedUncomfortLabel = {
          regionName: arr_region.length > 0 ? arr_region[0].title : ''
        }
      } else {
        return
      }
    },
    viewColor(val) {
      if (!val) {
        return
      } else if (val < 0.25) {
        return 'color:#03C785'
      } else if (val >= 0.25 && val < 0.5) {
        return 'color:#E6D300'
      } else if (val > 0.5) {
        return 'color:#FF5656'
      }
    },
    handleCancelDownload() {
      clearInterval(this.exportInterval)
      this.exportInterval = null
      this.urlDownload = ''
      this.isLoad = false
      this.fileLoading = false
      this.exportVisible = false
      this.selectedUncomfortOption = []
    },
    getFileAddr(param) {
      exportUnComfortExcelUrl(param).then((res) => {
        if (res.rel) {
          const data = res.data
          clearInterval(this.exportInterval)
          this.exportInterval = null
          if (data.exceptionStatus === 0) {
            this.$message.success('导出文件已生成,请点击下载按钮下载!')
            this.fileLoading = false
            this.isLoad = true
            this.urlDownload = data.downloadUrl
          } else {
            this.handleCancelDownload()
            this.$message.error('接口异常,请重试!')
          }
        }
      })
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
    filterData(list, roomTypeName, filterItem) {
      const data = this.filterDataByRange(list)
      if (data.length < 1) {
        return []
      } else {
        const arr = [...data.filter((item) => {
          if (roomTypeName && roomTypeName !== '全部类型') {
            if (filterItem === 1) { // 在线
              return item.statusOnline === 1 && item.roomTypeName === roomTypeName
            } else if (filterItem === 2) { // 离线
              return item.statusOnline === 0 && item.roomTypeName === roomTypeName
            } else if (filterItem === 3) { // 告警
              return item.statusWarning === 1 && item.roomTypeName === roomTypeName
            } else if (filterItem === 4) { // 空圈
              return item.isEmptyUnit === 1 && item.roomTypeName === roomTypeName
            } else if (filterItem === 5) { // 暂停告警
              return item.isAlarmSuspend === 1 && item.roomTypeName === roomTypeName
            } else if (filterItem === 6) { // 参数锁定
              return item.isParamLock === true && item.roomTypeName === roomTypeName
            } else if (filterItem === 7) { // 刷圈
              return item.isSweepUnit === 1 && item.roomTypeName === roomTypeName
            } else {
              return item.roomTypeName === roomTypeName
            }
          } else {
            if (filterItem === 1) {
              return item.statusOnline === 1
            } else if (filterItem === 2) {
              return item.statusOnline === 0
            } else if (filterItem === 3) {
              return item.statusWarning === 1
            } else if (filterItem === 4) { // 空圈
              return item.isEmptyUnit === 1
            } else if (filterItem === 5) { // 暂停告警
              return item.isAlarmSuspend === 1
            } else if (filterItem === 6) { // 参数锁定
              return item.isParamLock === true
            } else if (filterItem === 7) { //
              return item.isSweepUnit === 1
            } else {
              return item
            }
          }
        })]
        if (this.filterValue) {
          const arr_sort = [...this.sortData(this.filterValue, arr)]
          return arr_sort
        } else {
          return arr
        }
      }
    },
    sortData(type, data) {
      let arr = [...data]
      switch (type) {
        case 'temperatureInner1': arr = [...data.sort((a, b) => {
          return b.temperatureInner1 - a.temperatureInner1
        })]; break
        case 'temperatureInner2': arr = [...data.sort((a, b) => {
          return b.temperatureInner2 - a.temperatureInner2
        })]; break
        case 'humiditieInner1': arr = [...data.sort((a, b) => {
          return b.humiditieInner1 - a.humiditieInner1
        })]; break
        case 'humiditieInner2': arr = [...data.sort((a, b) => {
          return b.humiditieInner2 - a.humiditieInner2
        })]; break
        case 'batchNumber': arr = [...data.sort((a, b) => {
          return a.batchNumber - b.batchNumber
        })]; break
        case 'comfort': arr = [...data.sort((a, b) => {
          return b.comfortZoneLevel - a.comfortZoneLevel
        })]; break
        case 'unit': arr = [...this.sortChoosedUnit(data)]; break
        default: break
      }
      return arr
    },
    exportData() {
      if (this.selectedOption.length !== 3) {
        this.$message({
          showClose: true,
          message: '请先选择场区',
          type: 'warning'
        })
      } else {
        derive('/api/unit_evc/equipment/exportOverviewDataByField', { fieldId: this.selectedOption[2] })
      }
    },
    exportUncomfortData() {
      this.exportVisible = true
    },
    sureExport() {
      const opt = this.selectedUncomfortOption
      if (opt.length < 1) {
        this.$message({
          showClose: true,
          message: '请先选择场区',
          type: 'warning'
        })
      } else {
        const param = {
          regionId: opt.length > 0 ? opt[0] : null,
          areaId: opt.length > 1 ? opt[1] : null,
          fieldId: opt.length > 2 ? opt[2] : null,
          ...this.selectedUncomfortLabel,
          currentTime: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        exportUnComfortExcel(param)
        this.fileLoading = true
        this.urlDownload = ''
        this.isLoad = false
        this.exportInterval = setInterval(() => { // 设置定时器
          this.getFileAddr(param)
        }, 5000)
      }
    },
    valueExist(val) {
      if (val === '' || val === undefined || val === null) {
        return false
      } else {
        return true
      }
    },
    filterDataByRange(data) {
      let data_filter = [...data]
      if (this.valueExist(this.minTemp)) {
        data_filter = [
          ...data_filter.filter((item) => {
            return (
              item.temperatureInner1 >= this.minTemp ||
              item.temperatureInner2 >= this.minTemp
            )
          })
        ]
      }
      if (this.valueExist(this.maxTemp)) {
        data_filter = [
          ...data_filter.filter((item) => {
            return (
              item.temperatureInner1 <= this.maxTemp ||
              item.temperatureInner2 <= this.maxTemp
            )
          })
        ]
      }
      if (this.valueExist(this.minAge)) {
        data_filter = [
          ...data_filter.filter((item) => {
            return item.pigDays >= this.minAge
          })
        ]
      }
      if (this.valueExist(this.maxAge)) {
        data_filter = [
          ...data_filter.filter((item) => {
            return item.pigDays <= this.maxAge
          })
        ]
      }
      return data_filter
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
              this.$refs.tableData[
                index
              ].$children[0].bodyWrapper.scrollTop = 0
            }
          })
        })
      }
      this.focusCurrent = item.id
      this.navFormInfo.data.cascader = this.copySelectedOption = this.selectedOption = [
        item.regionId,
        item.areaId,
        item.fieldId
      ]
      this.copySelectedLabel = this.selectedLabel = [
        item.regionName,
        item.areaName,
        item.fieldName
      ]
      this.isShowLoading = true
      this.submitOption()
      this.getBaseInfo()
    },
    saveLeaderInfo() {
      if (this.selectedOption[2]) {
        if (
          !this.LeaderInfo.fieldLeaderName ||
          !this.LeaderInfo.fieldLeaderPhone
        ) {
          this.$message.error('场长名称和电话不能为空!')
        } else {
          const data = {
            fieldId: this.selectedOption[2],
            fieldLeaderName: this.LeaderInfo.fieldLeaderName,
            fieldLeaderPhone: this.LeaderInfo.fieldLeaderPhone
          }
          if (this.LeaderInfo.id) {
            updateFieldLeaderInfo(data).then((res) => {
              this.$message.success('修改场长信息成功')
              this.LeaderInfo.fieldLeaderName = res.data ? res.data.fieldLeaderName : ''
              this.LeaderInfo.fieldLeaderPhone = res.data ? res.data.fieldLeaderPhone : ''
              this.editLeaderInfo = false
            })
          } else {
            addFieldLeaderInfo(data).then((res) => {
              this.$message.success('新增场长信息成功')
              this.LeaderInfo = res.data || {}
              this.editLeaderInfo = false
            })
          }
        }
      } else {
        this.$message.error('请选择场区')
      }
    },
    delFieldLeader() {
      if (this.selectedOption.length === 3) {
        // const _this = this
        delFieldLeaderInfo({ 'fieldId': this.selectedOption[2] }).then((res) => {
          if (res.rel) {
            this.LeaderInfo = {}
          }
        })
      } else {
        this.$message.error('请先选择场区!')
      }
    },
    getFocusList() {
      focusList().then((res) => {
        this.focusLists = res.data
        this.fieldIds =
          res.data && res.data.length > 0
            ? res.data.map((item) => {
              return item.fieldId
            })
            : []
      })
    },
    focus(node, val) {
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
            this.getFocusList()
          })
          .catch(() => {})
      } else {
        cancelFocus({
          attentionId: collection(this.focusLists, node.value, 'fieldId').id
        }).then((res) => {
          this.$message.success(res.message)
          this.getFocusList()
        })
      }
    },
    handleEvent() {
      const cascader = {}
      this.focusCurrent = ''
      cascader.path = this.$refs['cascader'].checkedValue
      cascader.pathLabels = []
      cascader.pathLabels = event.path[0].innerText
        .replace(/\s*/g, '')
        .split('/')
      this.selectedOption = cascader.path
      this.selectedLabel = cascader.pathLabels
      this.$store.dispatch('IntelligentControl/saveLastSearchParam', {
        selectedOption: cascader.path,
        selectedLabel: cascader.pathLabels
      })
    },
    // 设置当前激活的过滤项(全部、在线...空圈)
    setCurrentFilterItem(value) {
      this.currentFilterItem = value
    },
    link(item) {
      this.clearRefreshInterval()
      sessionStorage.setItem(
        'fieldDeviceOverviewDetail',
        JSON.stringify({
          unitList: this.filterData(this.deviceList, this.currentRoomType, this.currentFilterItem),
          overview: item,
          selectedOption:
            this.copySelectedOption.length !== 0
              ? this.copySelectedOption
              : this.selectedOption,
          selectedLabel: [item.regionName, item.areaName, item.fieldName]
        })
      )
      // TODO:新控制器协议构建
      // if (item.fieldName === '内乡牧原综合体大花岭公猪站') {
      //   this.$router.push({
      //   // name: 'intelligentControlOverview',
      //     name: 'intelligentControlOverviewV4',
      //     params: {
      //       unitList: this.filterData(this.deviceList,this.currentRoomType,this.currentFilterItem),
      //       overview: item,
      //       selectedOption: this.copySelectedOption.length !== 0 ? this.copySelectedOption : this.selectedOption,
      //       selectedLabel: this.copySelectedLabel.length !== 0 ? this.copySelectedLabel : this.selectedLabel
      //     }
      //   })
      // } else {
      this.$router.push({
        name: 'intelligentControlOverview',
        // name: 'intelligentControlOverviewV3',
        params: {
          unitList: this.filterData(this.deviceList, this.currentRoomType, this.currentFilterItem),
          overview: item,
          selectedOption:
            this.copySelectedOption.length !== 0
              ? this.copySelectedOption
              : this.selectedOption,
          selectedLabel:
            this.copySelectedLabel.length !== 0
              ? this.copySelectedLabel
              : this.selectedLabel
        }
      })
      // }
    },
    handleRowClick(event) {
      this.link(event)
    },
    // tab的点击事件
    handleClick(tab, event) {
      this.currentRoomType = tab.label
      this.currentFilterItem = 0
    },
    // 自动刷新
    refreshIntervalFun() {
      this.clearRefreshInterval()
      this.isShowLoading = false
      this.refreshInterval = setInterval(() => {
        this.submitOption()
      }, 180000)
    },
    clearRefreshInterval() {
      clearInterval(this.refreshInterval)
    },
    // 基础信息查询
    getBaseInfo() {
      if (this.selectedOption.length === 3) {
        getLeaderInfo({ fieldId: this.selectedOption[2] }).then((res) => {
          this.LeaderInfo = res.data || {}
        })
      }
    },
    // 查询
    submitOption() {
      if (this.selectedOption.length !== 0) {
        if (this.isShowLoading) {
          this.loading = true
        }
        this.getWeatherData()
        getDevicesByField({ fieldId: this.selectedOption[2] })
          .then((res) => {
            this.loading = false
            this.table = [{ val: 'all', name: '全部类型' }]
            this.deviceOverviewInfo = res.data
            this.deviceList = res.data && res.data.deviceList ? res.data.deviceList : []
            this.table.push(...this.getTabs(this.deviceList))
            this.activeName = 'all'
            this.handleClick({ label: '全部类型', index: 0 })
            this.refreshIntervalFun()
          })
          .catch(() => {})
      } else {
        this.$message.error('请选择场区！')
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
                name: item.roomTypeName
              })
            ) === -1
          ) {
            arr.push({
              val: item.roomTypeId,
              name: item.roomTypeName
            })
          }
        }
      })
      return arr
    }
  },

  beforeRouteLeave(to, from, next) {
    //  this.targetName = to.name  // 提示框点击确认后跳转的 路由
    //  if (this.checkEdit()) { // 是否对页面进行了编辑
    //     this.dialogVisible = true    // 打开离开页面的提示框
    //     next(false)
    //   } else {
    //     this.dialogVisible = false
    //     next()
    //   }
    this.clearRefreshInterval()
    clearInterval(this.exportInterval)
    next()
  }
}
</script>
<style lang="scss">
  .dialog-weater{
        .weater-close{
          position: absolute;
    bottom: 30px;
    right: 45px;
    }
    .weather-list{
      width: 100%;
    }
    .weather-main{
              font-size: 12px;
      .date{
        font-size: 12px;
        color: #cdd8f7;
        @include font_color('mainFontColor11')
      }
      .cut1{
        display: flex;
        align-items: center;
        white-space:nowrap;
        padding: 5px 0;
        // border-right: solid 1px ;
        // border-right: 1px solid #2f3872;
        // padding-right: 60px;
        .svg-img{
          // margin-left: 40px;
          // margin-right: 60px;
          margin-left: 10px;
          margin-right: 20px;
          width: 40px;
          height: 25px;
        }
        .shidu{
          width: 20%;
          &::after{
            display: none;
          }
        }
        .wendu-row{
          width: 20%;
        }
        .fengli-row{
          // flex: 1.5;
          width: 40%;
        }
        .date-row{
          widows: 20%;
                    &::after{
            display: none;
          }
        }
        .container-carrier2-row{
          position: relative;
          display: flex;
          justify-content: space-between;
          align-items: center;
          white-space:nowrap;
          // margin-r: 20px;
          padding: 0 20px;
          // flex: 1;
                          &::after{
                            position: absolute;
                            right: 0;
                            margin-top: 5px;
              content: ' ';
              height: 24px;
              width: 1px;
              background: #2f3872;
              color: #2f3872;
              // position: relative;
              // right: 10px;
              // left: 5px;
              // margin: 0 20px;
              // margin-left: 10px;
              // margin-right: 30px;
            }
          .container-carrier2-row-l{
            display: flex;
            align-items: center;
            font-size: 12px;
            color: #0e759f;
            // margin-right: 50px;
          }
          .container-carrier2-row-r{
            display: flex;
            align-items: center;
            font-size: 20px;
            color: #1fbfff;
            span{
            font-size: 12px;
            }
          }
          .img{
            margin-right: 10px;
          }
          span{
            padding: 0;
          }
        }
      }
    }
  }
// .comfort-zone{
  .el-alert--warning.is-light {
    background: rgba(253, 246, 236, 0.2);
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
// }

.comfort-overview-home {
  // height: calc(100vh - 128px);
  overflow: hidden;
  .focus-scrollbar {
    // min-width: 100px;
    display: -webkit-box;
    margin-right: 5px;
    max-width: calc(100vw - 920px);
    &::-webkit-scrollbar {
      height: 0 !important;
    }
  }
  .logManagement {
    flex-wrap: nowrap !important;
  }
  .overview-home-main {
    height: calc(100vh - 280px);
  }
  .el-tabs__header {
    margin-top: -10px;
    padding-left: 10px;
  }
  .el-tabs__nav-wrap::after {
    // background-color: #1a3166;
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
        cursor: pointer;
        margin: 0 20px;
      }
      .full-screen {
        cursor: pointer;
      }
    }
  }
}
.comfort-overview-home {
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
    // color: #cdd8f7;
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
</style>
<style lang="scss">
.weather{
  @include background("overviewBackGround");
  border: 1px solid;
  @include border_color("overviewBorderColor");
  border-radius: 4px 4px 4px 0px 4px;
  .weather-head{
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    border-bottom: solid 1px;
    @include border_color("overviewBorderColor");
    // .left {
    //   font-weight: bold;
    //   @include font_color("overviewFontColor1");
    // }
    .right{
      font-size: 12px;
      color: #20a4fc;
      cursor: pointer;
    }
  }
  .weather-main{
    .cut1{
      display: flex;
      align-items: center;
      white-space:nowrap;
      padding: 5px 0;
      // border-right: solid 1px ;
      // border-right: 1px solid #2f3872;
      // padding-right: 60px;
      .svg-img{
        // margin-left: 40px;
        // margin-right: 60px;
        margin-left: 1%;
        margin-right: 4%;
        width: 40px;
        height: 25px;
      }
      .shidu{
        &::after{
          display: none;
        }
      }
      .container-carrier2-row{
        display: flex;
        justify-content: space-around;
        white-space:nowrap;
        flex: 1;
                        &::after{
                          margin-top: 5px;
            content: ' ';
            height: 24px;
            width: 1px;
            background: #2f3872;
            color: #2f3872;
            // margin-left: 30px;
            // margin-right: 30px;
          }
        .container-carrier2-row-l{
          display: flex;
          align-items: center;
          font-size: 12px;
          color: #0e759f;
          margin-right: 50px;
        }
        .container-carrier2-row-r{
          display: flex;
          align-items: center;
          font-size: 20px;
          color: #1fbfff;
          span{
           font-size: 12px;
          }
        }
        .img{
          margin-right: 10px;
        }
        span{
          padding: 0;
        }
      }
    }
  }
}
.leader-main{
  display: flex;
  // justify-content: space-between;
  justify-content: center;
  padding:5px !important;
}
    .custom-data {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
    }
.comfort-zone{
    .focus-scrollbar {
      text-align: center;
      overflow-x: scroll;
      overflow-y: auto;
      margin-right: 5px;
    }
    .nav-view {
      display: flex;
      align-items: center;
    }
    .view-height {
      height: 100%;
    }
    .seamless-warp {
      height: 100%;
      overflow: auto;
    }
    .focus-flex {
      margin-top: -10px;
      margin-bottom: 10px;
    }
    .scrollbar-full {
      height: calc(100vh - 200px) !important;
    }
    .home-warp-scrollbar {
      height: calc(100vh - 436px);
      overflow-x: hidden;
      padding-bottom: 20px;
      .home-warp-none {
        // color: #cdd8f7;
        @include font_color("overviewFontColor2");
        height: calc(100vh - 436px);
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .focus-ico {
      // padding: 20px;
      font-size: 16px;
    }
    .top-l {
      font-size: 14px;
      @include font_color("overviewFontColor2");
      line-height: 36px;
      margin-bottom: 10px;
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
        // display: flex;
        .name,
        .phone {
          display: flex;
        }
        .name {
          margin-right: 20px;
        }
        .ico {
          padding: 0 5px;
          // margin-right: 4px;
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
      // position: absolute;
      // right: 10px;
      padding: 8px 20px;
    }
    .radio {
      margin-right: 10px;
      height: 40px;
      display: flex;
      justify-content: end;
      // margin-bottom: 10px;
      button[type="button"] {
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
      button.active[type="button"] {
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
      //  border-radius: 20px;
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
        line-height: 34px;
        height: 34px;
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
            color: #99a3bf;
          }
        }
      }
      .item-t {
        border-bottom: 1px solid #374990;
      }
      .item-t,
      .item-b {
        line-height: 34px;
        font-size: 10px;
         @include font_color('viewFontColor1');
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
      // height: calc(100vh - 220px);
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
        box-sizing: content-box;
        padding-bottom: 30px;
        height: 100%;
        flex: 1;
        overflow-y: auto;
        // TODO:设备概览报警信息滚动
        // overflow-y: scroll;
        height: calc(100% - 50px);
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
          -webkit-touch-callout: none; /*系统默认菜单被禁用*/
          -webkit-user-select: none; /*webkit浏览器*/
          -khtml-user-select: none; /*早期浏览器*/
          -moz-user-select: none; /*火狐*/
          -ms-user-select: none; /*IE10*/
          user-select: none;
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
    .my-input {
      height: 30px;
      width: 65px;
      cursor: pointer;
      text-align: center;
      // background: rgba(20, 71, 151, 0.3);
      @include background('viewMyInputBackGround');
      border: 1px solid #227fe6;
      border-radius: 2px;
      // box-shadow: 0px 0px 10px 0px #217bfc inset;
      @include box_shadow('viewRadioBoxShadow');
      font-size: 12px;
      font-family: SourceHanSansCN, SourceHanSansCN-Normal;
      font-weight: Normal;
      color: #99a3bf;
      @include font-color('viewFontColor1');
    }
    .my-input:focus{
      outline: none;
      // border: 1px solid #fff;
      border: 1px solid;
      @include border_color('viewMyInputFocusBorderColor');
      @include font_color('mainFontColor2');
    }
    .my-input ~ span {
      padding: 0px 2px;
      color: #d8d8d8;
    }
    .default .el-input__inner {
      width: 120px;
      height: 30px;
      // background: rgba(20, 71, 151, 0.3);
      @include background('viewMyInputBackGround');
      border: 1px solid #227fe6;
      border-radius: 2px;
      // box-shadow: 0px 0px 10px 0px #217bfc inset;
      @include box_shadow('viewRadioBoxShadow');
    }
    .default .el-input__icon {
      line-height: 30px;
    }
    // 去除input[type=number]默认样式
    input[type="number"] {
      -moz-appearance: textfield;
    }
    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
}

</style>
<style scoped>
.dialog-btn-no-back{
  border: solid 1px #3f80b9!important;
  border-radius: 3px!important;
  color: #cdd8f7!important;
  background-color: transparent!important;
  padding: 5px 15px!important;
  margin-left: 10px!important;
  line-height: normal!important;
}
.dialog-btn{
  text-align: center;
  white-space: nowrap;
  cursor: pointer;
  color: #fff;
  outline: none;
  font-weight: normal;
  background-image: linear-gradient(180deg, #105FB6 0%, #0C4297 100%);
  border: 0px solid #fff;
  box-sizing: border-box;
  border-radius: 3px;
  padding: 5px 15px!important;
  margin-left: 10px;
  line-height: normal!important;
}
.optionWrapper >>> .el-input__inner{
  height: 36px!important;
  color: #cdd8f7!important;
  line-height: 36px!important;
  background: #00113a!important;
  border: 1px solid #1a3166!important;
  border-radius: 2px!important;
}
</style>
<style lang="scss">
.optionWrapper .el-input__inner{
  @include font_color('mainFontColor2');
  @include border_color('mainInputBorderColor');
  @include background_color('formBackgroundColor');
}
</style>
