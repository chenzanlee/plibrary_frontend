<template>
  <div class="piggeryDeviceOverview overview-home" :style="isfullScreen ? 'height:100%' : ''">
    <div class="nav-view">
      <nav-form
        v-show="!isfullScreen"
        class="nav-form"
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
                  navFormInfo.fieldList.left.inpLists[0].checkStrictly,
                expandTrigger: 'hover',
                label: navFormInfo.fieldList.left.inpLists[0].customLabel
                  ? navFormInfo.fieldList.left.inpLists[0].customLabel
                  : 'label',
                value: navFormInfo.fieldList.left.inpLists[0].customValue
                  ? navFormInfo.fieldList.left.inpLists[0].customValue
                  : 'value'
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
        <div style="flex-shrink: 0;" class="my_focus">我的关注：</div>
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
    <el-alert
      v-if="!isHasFieldConfigAlarmNoticeUsers"
      title="场区未配置全场报警推送人,请前往 基础信息维护-告警推送管理-推送人员维护 进行配置!"
      type="warning"
      show-icon
    />
    <div
      class="dialog"
      :class="dialogWeater ? 'dialog-block' : 'dialog-hidden'"
    >
      <div class="dialog-body Highlight">
        <div class="dialog-head" style="padding: 10px;">
          <span>更多天气</span>
          <div class="dialog-head-close" @click="dialogWeater = false">
            <i class="iconfont">&#xe61a;</i>
          </div>
        </div>
        <div class="dialog-container dialog-weater">
          <template v-if="weatherList.length !== 0">
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
          </template>
          <template v-else>
            <div
              style="width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;"
            >
              <img style="max-width:300px;" :src="noData" alt="">
            </div>
          </template>
          <!-- <el-button class="btn-blue weater-close" @click="dialogWeater = false">关闭</el-button> -->
        </div>
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
    <div
      class="dialog"
      :class="dialogOutdoor ? 'dialog-block' : 'dialog-hidden'"
    >
      <div class="dialog-body Highlight">
        <div class="dialog-head" style="padding: 10px;">
          <span>室外气象站</span>
          <div class="dialog-head-close" @click="dialogOutdoor = false">
            <i class="iconfont">&#xe61a;</i>
          </div>
        </div>
        <div class="dialog-container dialog-weater dialog-weater1">
          <template v-if="outdoorWeatherList.length > 0">
            <div class="weather-list1 weather-list1cor">
              <p>位置</p>
              <p>当前温湿度</p>
              <p>温度范围</p>
              <p>湿度范围</p>
            </div>
            <div
              v-for="(item, index) in outdoorWeatherList"
              :key="index"
              class="weather-list1"
            >
              <p>{{ item.location ? item.location : '---' }}</p>
              <p><span style="color: #1FBFFF;">{{ item.temperature || item.temperature == 0 ? item.temperature + '℃' : '---' }}</span> / <span style="color: #1FFFA0;">{{ item.humidity || item.humidity == 0 ? item.humidity + '%': '---' }}</span></p>
              <!-- <p>{{ item.temperature }}℃  / {{ item.humidity }}%</p> -->
              <p>{{ item.tempMin || item.tempMin == 0 ? item.tempMin + '℃' : '---' }}  ~ {{ item.tempMax || item.tempMax == 0 ? item.tempMax + '℃' : '---' }} </p>
              <p>{{ item.humiMin || item.humiMin == 0 ? item.humiMin + '%' : '---' }}  ~ {{ item.humiMax || item.humiMax == 0 ? item.humiMax + '%' : '---' }} </p>
            </div>
          </template>
          <template v-else>
            <div
              style="    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;"
            >
              <img style="max-width:300px;height:180px" :src="noData" alt="">
            </div>
          </template>
        </div>
      </div>
      <div class="dialog-close" @click="dialogOutdoor = false" />
    </div>
    <div v-show="!isfullScreen" class="top-l">
      <el-row :gutter="10" style="margin-left:0;margin-right:0;width:100%">
        <el-col :span="18" style="padding-left:0">
          <div class="weather">
            <div class="weather-head">
              <div class="left" style="font-weight:bold;">室外气象站</div>
              <p v-if="deviceOverviewInfo && deviceOverviewInfo.outdoorWeatherStation && deviceOverviewInfo.outdoorWeatherStation.length > 0" class="sw">
                <span v-for="(item, index) in deviceOverviewInfo.outdoorWeatherStation" :key="index">
                  <strong v-if="index < 3" style="font-weight:400">{{ item.location ? item.location : '---' }}:
                    <i style="font-style:normal;" class="temperature">{{ item.temperature || item.temperature == 0 ? item.temperature + '℃' : '---' }}</i>
                    /
                    <i style="font-style:normal;" class="humi">{{ item.humidity || item.humidity == 0 ? item.humidity + '%': '---' }}</i>
                  </strong>
                </span>
              </p>
              <p v-else style="padding-left: 15px;font-size: 14px;text-align:left;flex: 1;">暂无数据</p>
              <div class="right" @click="dialogOutdoor = true">更多></div>
            </div>
            <div class="weather-head weather-main">
              <div class="left" style="font-weight:bold;color:#fff;">天气状况</div>
              <div v-if="weatherList.length > 0" class="cut1">
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
              <p v-else style="padding-left: 30px;font-size: 14px;text-align:left;flex: 1;">暂无数据</p>
              <div class="right" @click="dialogWeater = true">更多></div>
            </div>
            <!-- <div class="weather-main" style="height:46px">
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
              <div
                v-else
                style="height: 100%;display: flex;justify-content: center;
    align-items: center;"
              >
                暂无数据
              </div>
            </div> -->
          </div>
        </el-col>
        <el-col :span="6" style="padding-left:15px;padding-right:0">
          <div class="leader-info weather">
            <div class="weather-head">
              <div class="title left">场长信息：</div>
              <div class="icon-main" style="display:flex">
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
                <!-- <el-popconfirm
                  v-if="LeaderInfo.fieldLeaderPhone && LeaderInfo.fieldLeaderName"
                  title="确定删除场长信息吗？"
                  @onConfirm="deleteLeaderInfo"
                >
                  <div slot="reference" class="edit ico" style="margin-left:10px;cursor: pointer;">
                    <svg-icon icon-class="delete" />
                  </div>
                </el-popconfirm> -->

              </div>

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
    <el-row :gutter="20" :style="isfullScreen ? 'height:100%' : ''">
      <el-col
        v-loading="loading"
        :span="isfullScreen ? (isfullScreenAll ? 24 : 18) : 18"
        :style="isfullScreen ? 'height:100%' : ''"
      >
        <div class="titleHighlight" :style="isfullScreen ? 'height:100%' : ''">
          <div class="overflowXScroll">
            <h3 class="short-title">单元信息</h3>
            <el-tabs v-model="activeTypeName" @tab-click="handleClick">
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
                  <div class="right-options">
                    <div class="filter default">
                      <el-select
                        v-model="filterValue"
                        placeholder="请选择"
                        @change="sortChange"
                      >
                        <el-option
                          v-for="item1 in filterOptions"
                          :key="item1.value"
                          :label="item1.label"
                          :value="item1.value"
                        />
                      </el-select>
                    </div>
                    <el-tooltip class="" effect="dark" :content="viewType === 'card'?'表格' : '卡片'" placement="top-start">
                      <div style="padding: 0px 6px;position:relative;top:3px;" @click="switchView">
                        <svg-icon style="font-size: 24px;cursor: pointer;" icon-class="view-layout" />
                      </div>
                    </el-tooltip>
                    <div
                      class="export-data layout btn-do"
                      @click="exportData"
                    >
                      <el-tooltip
                        class=""
                        effect="dark"
                        content="导出"
                        placement="top-start"
                      >
                        <svg-icon
                          style="font-size: 24px"
                          icon-class="oview-export"
                        />
                      </el-tooltip>
                    </div>
                    <div
                      v-show="!isfullScreen"
                      class="full-screen btn-do"
                      @click="checkFullScreen"
                    >
                      <el-tooltip
                        class=""
                        effect="dark"
                        content="全屏"
                        placement="top-start"
                      >
                        <svg-icon
                          style="font-size: 24px"
                          icon-class="full-screen"
                        />
                      </el-tooltip>
                    </div>
                    <div
                      v-show="isfullScreen"
                      class="full-screen btn-do"
                      @click="checkFullScreen"
                    >
                      <el-tooltip
                        class=""
                        effect="dark"
                        content="退出全屏"
                        placement="top-start"
                      >
                        <svg-icon
                          style="font-size: 24px"
                          icon-class="shirk-screen"
                        />
                      </el-tooltip>
                    </div>
                  </div>
                </el-scrollbar>
              </el-tab-pane>
            </el-tabs>
            <div class="items_container">
              <template v-if="currentDeviceList.length>0">
                <el-row v-show="viewType==='card'" :gutter="16" style="width:100%;margin-left:0;margin-right:0;padding:0 2px;">
                  <el-col v-for="item1 in currentDeviceList" :key="JSON.stringify(item1)" :sm="isfullScreen && isfullScreenAll ? 8 : 12" :lg="isfullScreen && isfullScreenAll ? 4 : 6" :xl="isfullScreen && isfullScreenAll ? 4 : 6">
                    <unit-view-box :obj="item1" :page-element="pageElement" class="item_box" @click.native="goSub(item1)" />
                  </el-col>
                  <!-- </div> -->
                </el-row>
                <unit-view-list v-show="viewType==='list'" :page-element="pageElement" :list="currentDeviceList" class="list" @handleRowClick="handleRowClick" />
              </template>
              <template v-else>
                <div class="no-data-img"><img style="max-width:300px" :src="noData"></div>
              </template>
            </div>
          </div>
        </div>
      </el-col>
      <div
        v-if="isfullScreen"
        class="isfullScreenAllIcon"
        @click="isfullScreenAll = !isfullScreenAll"
      >
        <img v-show="!isfullScreenAll" src="@/assets/image/fold-show.png">
        <img v-show="isfullScreenAll" src="@/assets/image/fold-hidden.png">
      </div>
      <el-col
        v-loading="loading"
        :span="isfullScreen ? (isfullScreenAll ? 0.1 : 6) : 6"
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
            <div v-if="alarmData.length === 0" class="warn-none">
              <img style="max-width:300px" :src="noData" alt="">
            </div>
            <div class="seamless-warp overfolw">
              <div v-for="(item, index) in alarmData" :key="index">
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

                    <li>
                      {{ j.name }} - {{ j.info }}
                    </li>
                  </el-tooltip>
                </ul>
              </div>
            </div>
          </div>
          <div class="cut" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
// getRegionAreaFieldTree,
// getPiggeryShowerList // 获取全部
} from '@/http/api/piggeryDeviceOverview'
import {
  updateFieldLeaderInfo,
  getLeaderInfo
} from '@/http/api/fieldDeviceOverview'
import navForm from '@/components/commonComponent/navForm'
import {
  radioList,
  initRadioList
} from '@/views/IntelligentControl/piggeryDeviceOverview/common/mock'
import unitViewBox from '../common/components/unitViewBox'
import unitViewList from '../common/components/unitViewList'
// import noData from '@/assets/image/page/noData.png'
import { collection } from '@/common/utils/array'
import { getCurrentTime, nDate, getWeek, getConfigElement } from '@/utils/overtService'
import WarnSetup from '@/views/IntelligentControl/fieldDeviceOverview/common/components/WarnSetup'
import Dialog from '@/components/dialog/dialog.js'
const pageElement = getConfigElement('fieldDeviceOverview')
import { derive } from '@/http/api/exportData/export'
import { mapGetters } from 'vuex'
import weatherService from '@/lib/service/weather-service'
export default {
  components: {
    navForm,
    unitViewBox,
    unitViewList
  },
  provide() {
    return {
      overview: this
    }
  },
  data() {
    return {
      dialogOutdoor: false,
      outdoorWeatherList: [],
      isHasFieldConfigAlarmNoticeUsers: true,
      dialogDtatus: false,
      fieldIds: [],
      focusLists: [],
      focusCurrent: '',
      isfullScreenAll: true,
      isAddLeader: false,
      LeaderInfo: {
        fieldLeaderName: '',
        fieldLeaderPhone: ''
      },
      editLeaderInfo: false,
      weatherList: [],
      dialogWeater: false,
      deviceOverviewInfo: '',
      filterOptions: [
        {
          value: 'unitName',
          label: '单元'
        },
        {
          value: 'batchNumber',
          label: '批次'
        },
        {
          value: 'comfortZoneLevel',
          label: '舒适度'
        },
        {
          value: 'temperature',
          label: '温度'
        },
        {
          value: 'humidity',
          label: '湿度'
        }
      ],
      filterValue: 'unitName',
      viewType: 'card', // 展示方式 卡片  列表list
      pageElement: [], // 当前页面数据权限
      commonElement: [], // 公共数据权限
      alarmData: [], // 获取的报警信息
      noData: '',
      loading: false,
      selectedOption: [], // selectedOption: ['-11', '-101', '-1001'],
      deviceList: '',
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
                // handleChange: (val) => {
                //   console.log('更改的大区选择', val)
                //   this.selectedOption = val
                // }
              },
              {
                type: 'button',
                innerText: '查询',
                className: 'btn-blue',
                handleClick: () => {
                  // console.log('查询',this.navFormInfo)
                  if (document.querySelector('.home-warp-scrollbar')) {
                    this.$nextTick(() => {
                      this.table.forEach((item, index) => {
                        this.$refs['homeWarpScrollbar' + index][0].wrap.scrollTop = 0
                      })
                    })
                  }
                  this.submitOption(true) // true 刷新带loading
                  // 这里跑一个定时器
                  if (!this.timer) { // 定时器不存在 则启一个
                    this.timer = setInterval(() => {
                      this.submitOption(false)
                    }, 3 * 60 * 1000)
                    this.$once('hook:beforeDestroy', () => {
                      clearInterval(this.timer)
                    })
                  } else {
                    console.log('定时器已启---')
                  }
                }
              },
              {
                type: 'button',
                innerText: '暂停报警设置',
                className: 'btn-blue',
                handleClick: () => {
                  if (this.selectedOption.length !== 0) {
                    if (this.isHasFieldConfigAlarmNoticeUsers) {
                      this.setWarnSetup()
                    } else {
                      this.$confirm(
                        '是否前往配置?',
                        '该场区未设置全场告警推送人',
                        {
                          confirmButtonText: '前往配置',
                          confirmButtonClass: 'btn-blue btn-blue-confirm',
                          cancelButtonText: '取 消',
                          type: 'warning'
                        }
                      ).then(() => {
                        this.$router.push({
                          path:
                            '/unit-evc/baseInfo/alarmManagement/targetMaintenance'
                        })
                      })
                    }
                  } else {
                    this.$message.error('请选择场区！')
                  }
                }
              }
            ]
          }
        }
      },
      currentSort: 0, // tab可以选择默认
      activeTypeName: 'all', // 单元信息
      activeStatusName: 'all', // 状态类型
      table: [{ val: 'all', name: '全部类型', radio: radioList }],
      tableObj: {
        auth_ids: [], //
        deviceList: [], // 设备列表
        fieldId: '', // 场区id
        offlineNum: 0, // 离线
        onlineNum: 0, // 在线
        total: 0 // 全部
      },
      currentDeviceList: [], // 过滤后的设备列表
      timer: null // 定时器
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'fullScreen']),
    isfullScreen() {
      return this.fullScreen
    },
    currentTabs() { // 过滤的设备列表 需要的两个tabs
      return this.activeTypeName + this.activeStatusName
    },
    allStyles() {
      return this.$store.state.echartStyle.allStyles
    }
  },
  watch: {
    currentTabs: {
      handler() {
        this.filterList()
      },
      immediate: true
    },
    activeTypeName: { // 这里更改 各状态的number
      handler(val) {
        this.$nextTick(() => { this.filterNumber(val) })
      },
      immediate: true
    },
    'allStyles.flag'(newValue, oldValue) {
      // eslint-disable-next-line no-irregular-whitespace
      this.noData = this.$getImgUrl('noData', 'svg')
    }
  },
  created() {
    // eslint-disable-next-line no-irregular-whitespace
    this.noData = this.$getImgUrl('noData', 'svg')
    this.pageElement = this.$getConfigElement('PiggeryDeviceOverview')
    this.commonElement = this.$getConfigElement('unit-evcDataInterface')
    this.getFocusList()
  },
  mounted() {
    const infos = JSON.parse(sessionStorage.getItem('piggeryInfos'))
    if (infos && infos.selectedOption) { // 保留上次 查询信息
      this.selectedOption = infos.selectedOption
      this.navFormInfo.data.cascader = infos.selectedOption
      this.submitOption(true)
    }
    const element = this.commonElement['getRegionAreaFieldTree']
    this.$httpRequest({
      type: element && element.method,
      uri: element && element.uri,
      payload: {
        isBuilding: false
      },
      callback: res => {
        if (res.status === 200 && res.rel) {
          this.navFormInfo.fieldList.left.inpLists[0].options = res.data
        } else {
          // this.$message.error(res.message)
        }
      }
    })
    this.table = [{ val: 'all', name: '全部类型', radio: initRadioList }]
  },

  methods: {
    setWarnSetup() {
      const options = {
        rows: this.navFormInfo.data.cascader,
        closeDialog: () => {},
        handleOk: e => {
          this.submitOption()
        },
        childs: WarnSetup
      }
      Dialog(options)
    },
    close() {
      this.dialogDtatus = false
    },
    confirm(item) {
      this.dialogDtatus = false
      this.currentFocus(item)
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
      console.log('当前选中的item', item)
      this.focusCurrent = item.id
      this.navFormInfo.data.cascader = this.selectedOption = [
        item.regionId,
        item.areaId,
        item.fieldId
      ]
      console.log(
        'this.navFormInfo.data.cascader',
        this.navFormInfo.data.cascader
      )
      this.isShowLoading = true
      this.submitOption('first')
    },
    handleEvent() {
      console.log(this.$refs['cascader'])
      const cascader = {}
      this.focusCurrent = ''
      cascader.path = this.$refs['cascader'].checkedValue
      cascader.pathLabels = []
      cascader.pathLabels = this.$refs['cascader'].getCheckedNodes()[0]
        ? this.$refs['cascader'].getCheckedNodes()[0].pathLabels
        : event.path[0].innerText.replace(/\s*/g, '').split('/')
      console.log('cascader.path', cascader.path)
      console.log('cascader.pathLabels', cascader.pathLabels)
      this.selectedOption = cascader.path
      // this.selectedLabel = cascader.pathLabels
      // this.$store.dispatch('IntelligentControl/saveLastSearchParam', {
      //   selectedOption: cascader.path,
      //   selectedLabel: cascader.pathLabels
      // })
      // console.log(this.navFormInfo.data.cascader)
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
          fieldName: node.pathLabels[2],
          type: 2 // 喷淋设备概览
        }
        const element = pageElement['attentionAdd']
        this.$httpRequest({
          type: element?.method,
          uri: element?.uri,
          payload: data,
          callback: res => {
            console.log('添加关注---', res)
            if (res.status === 200 && res.rel) {
              this.$message.success(res.message)
              this.getFocusList()
            } else if (res.status === 200 && !res.rel) {
              this.$message.error('关注失败')
            }
          }
        })
      } else {
        const element = pageElement['attentionCancel']
        const params = {
          attentionId: collection(this.focusLists, node.value, 'fieldId').id
        }
        this.$httpRequest({
          type: element?.method,
          uri: element?.uri + `?attentionId=${params.attentionId}`,
          payload: params,
          callback: res => {
            console.log('取消关注---', res)
            if (res.status === 200 && res.rel) {
              this.$message.success(res.message)
              this.getFocusList()
            } else if (res.status === 200 && !res.rel) {
              this.$message.error('取消失败')
            }
          }
        })
      }
    },
    getFocusList() {
      const element = pageElement['attentionList']
      const params = {
        type: 2
      }
      this.$httpRequest({
        type: element?.method,
        uri: element?.uri,
        payload: params,
        callback: res => {
          console.log('关注列表---', res)
          if (res.status === 200 && res.rel) {
            this.focusLists = res.data
            this.fieldIds =
            res.data && res.data.length > 0
              ? res.data.map(item => {
                console.log(item)
                return item.fieldId
              })
              : []
          }
        }
      })
      // focusList().then(res => {
      //   console.log('获取的关注列表', res)
      //   this.focusLists = res.data
      //   this.fieldIds =
      //     res.data && res.data.length > 0
      //       ? res.data.map(item => {
      //         console.log(item)
      //         return item.fieldId
      //       })
      //       : []
      //   console.log('getFocusList -> fieldIds', this.fieldIds)
      // })
    },
    checkFullScreen() {
      this.isfullScreenAll = true
      this.$store.dispatch('checkFullScreen')
    },
    exportData() {
      if (this.selectedOption.length !== 3) {
        this.$message({
          showClose: true,
          message: '请先选择场区',
          type: 'warning'
        })
      } else {
        derive('/api/unit_evc/myPiggeryShower/exportOverviewDataByField', {
          fieldId: this.selectedOption[2]
        })
      }
    },
    getLeaderInfo() {
      getLeaderInfo({ fieldId: this.selectedOption[2] }).then((res) => {
        console.log('获取的场长信息', res)
        this.LeaderInfo = res.data ? res.data : { fieldLeaderName: '', fieldLeaderPhone: '' }
        if (this.LeaderInfo.fieldLeaderName && this.LeaderInfo.fieldLeaderPhone) {
          console.log('')
          this.isAddLeader = false
        } else {
          this.isAddLeader = true
        }
      })
    },
    // 天气信息
    getWeatherData() {
      // console.log('获取天气信息----------------')
      this.currentTime = getCurrentTime('')
      // this.loadingWeather = true
      const data = {
        endDay: nDate(4),
        fieldId: this.selectedOption[2],
        startDay: this.currentTime.split(' ')[0]
      }
      const element = this.commonElement['getWeather']
      this.$httpRequest({
        type: element && element.method,
        uri: element && element.uri,
        payload: data,
        callback: res => {
        // this.loadingWeather = false
          if (res.status === 200) {
            const arr = JSON.parse(JSON.stringify(res.data.rows))
            for (const i of arr) {
              i.weatherImg = weatherService.getWeatherImg(i.weather)
              i.date = getWeek(i.day)
              i.newDay = i.day.split('-')[1] + '月' + i.day.split('-')[2] + '日'
            }
            this.weatherList = arr
            console.log('获取的天气this.weatherList3', this.weatherList)
          }
        }
      })
    },
    // 保存场长信息
    saveLeaderInfo() {
      if (this.selectedOption[2]) {
        if (
          !this.LeaderInfo.fieldLeaderName ||
          !this.LeaderInfo.fieldLeaderPhone
        ) {
          this.$message.warning('场长名称和电话不能为空!')
        } else {
          if (this.isAddLeader) {
            this.$httpRequest({
              type: 'post',
              payload: {
                fieldId: this.selectedOption[2],
                fieldLeaderName: this.LeaderInfo.fieldLeaderName,
                fieldLeaderPhone: this.LeaderInfo.fieldLeaderPhone
              },
              uri: pageElement.addFieldLeader && pageElement.addFieldLeader.uri,
              callback: (res) => {
                this.$message.success('新增场长信息成功')
                console.log('返回的场长信息', res)
                this.LeaderInfo.fieldLeaderName = res.data.fieldLeaderName
                this.LeaderInfo.fieldLeaderPhone = res.data.fieldLeaderPhone
                this.editLeaderInfo = false
              }
            })
          } else {
            const data = {
              fieldId: this.selectedOption[2],
              fieldLeaderName: this.LeaderInfo.fieldLeaderName,
              fieldLeaderPhone: this.LeaderInfo.fieldLeaderPhone
            }
            updateFieldLeaderInfo(data).then((res) => {
              console.log('更新场长信息', res)
              this.$message.success('修改场长信息成功')
              this.LeaderInfo.fieldLeaderName = res.data.fieldLeaderName
              this.LeaderInfo.fieldLeaderPhone = res.data.fieldLeaderPhone
              this.editLeaderInfo = false
            })
          }
        }
      } else {
        this.$message.error('请选择场区')
      }
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
              return a.unitName - b.unitName
            })
          ]
          arr = [...arr, ...array]
        })
      }
      return arr
    },
    sortChange(event) {
      // const data = [ // 模拟数据
      //   {
      //     'regionId': '10',
      //     'regionName': '西北',
      //     'areaId': '15176674',
      //     'areaName': '大荔',
      //     'fieldId': '15323744',
      //     'fieldName': '大荔5厂',
      //     'segmentId': '13906',
      //     'segmentName': '保育',
      //     'roomTypeId': '13906',
      //     'roomTypeName': '保育舍',
      //     'unitId': '4MckoccGDZkxnVNrkdA0mv',
      //     'unitName': '10',
      //     'isAlarmSuspend': 0,
      //     'deviceType': null,
      //     'deviceName': '5g1cEx3BMY2WeylyfHsTNb',
      //     'deviceId': '4D5D20303152575050150046001D',
      //     'channel': 2,
      //     'firmwareVersion': '1064',
      //     'statusOnline': 1,
      //     'alarmStatus': 0,
      //     'humidity': -100,
      //     'temperature': 21.3,
      //     'weight': 110,
      //     'mostComfortTemperature': 21.5,
      //     'temperatureInner1Diff': -0.2,
      //     'comfortZoneName': '最适区',
      //     'lockParam': 0,
      //     'count': 0,
      //     'age': 19,
      //     'batchNumber': 'DL430207232951201111',
      //     'deathRateDay': null,
      //     'deathRateWeek': null,
      //     'deathRateTotal': null,
      //     'equiptypeId': null,
      //     'equiptypeName': null,
      //     'deviceVersionId': null,
      //     'deviceVersionName': null,
      //     'equipmentId': null,
      //     'qrCode': null,
      //     'description': null,
      //     'status': null,
      //     'isOpenFeed1': 0,
      //     'isOpenShower1': 0,
      //     'isOpenShower2': 0,
      //     'isOpenShower3': 0,
      //     'isOpenShower4': 0,
      //     'isOpenAlarmBell': 0,
      //     'isOpenAlarmLight': 0,
      //     'type': 1,
      //     'typeStr': '保育',
      //     'time': '2020-12-04T02:13:22Z',
      //     'timeStr': '2020-12-04 10:13:22',
      //     'mask': 1,
      //     'startTimeDesc': null,
      //     'durationDesc': null,
      //     'suspendMinutes': 0,
      //     'comfortZone': 'MostComfortZone',
      //     'comfortZoneLevel': 1,
      //     'temperatureInner2Diff': null
      //   },
      //   ]
      const list = this.currentDeviceList
      // const list = data
      switch (event) {
        case 'unitName':
          this.currentDeviceList = [...this.sortChoosedUnit(list)]
          break
        case 'batchNumber':
          this.currentDeviceList = [
            ...list.sort((a, b) => {
              return b.batchNumber - a.batchNumber
            })
          ]
          break
        case 'comfortZoneLevel':
          this.currentDeviceList = [
            ...list.sort((a, b) => {
              return b.comfortZoneLevel - a.comfortZoneLevel
            })
          ]
          break
        case 'temperature':
          this.currentDeviceList = [
            ...list.sort((a, b) => {
              return b.temperature - a.temperature
            })
          ]
          break
        case 'humidity':
          this.currentDeviceList = [
            ...list.sort((a, b) => {
              return b.humidity - a.humidity
            })
          ]
          break
        default:
          break
      }
    },
    switchView() { // 切换展示 方式
      this.viewType = (this.viewType === 'card' ? 'list' : 'card')
    },
    filterNumber(val) { // 过滤各个type下的数量
      if (val === 'all') {
        this.table[0].radio[0].number = this.tableObj.total
        this.table[0].radio[1].number = this.tableObj.onlineNum
        this.table[0].radio[2].number = this.tableObj.offlineNum
        this.table[0].radio[3].number = this.tableObj.warmNum || 0
        return
      }
      const l = [{
        name: '全部',
        number: 0,
        icon: ''
      },
      {
        name: '在线',
        number: 0,
        icon: 'online-ico'
      },
      {
        name: '离线',
        number: 0,
        icon: 'offline-ico'
      },
      {
        name: '报警',
        number: 0,
        icon: 'warn-num'
      },
      {
        name: '空圈',
        number: 0,
        icon: 'empty-ico'
      },
      {
        name: '参数锁定',
        number: 0,
        icon: 'lock-ico'
      }]
      const list = this.tableObj.deviceList
      let allNumber = 0
      let onlineNumber = 0
      let offlineNumer = 0
      let warnNumber = 0
      let emptyNumber = 0
      let lockNumber = 0
      list.map(item => {
        if (item.roomTypeId === val) {
          allNumber++
          item.statusOnline ? onlineNumber++ : offlineNumer++
          item.alarmStatus && warnNumber++
          item.isEmptyUnit && emptyNumber++
          item.lockParam && lockNumber++
        }
      })
      l[0].number = allNumber
      l[1].number = onlineNumber
      l[2].number = offlineNumer
      l[3].number = warnNumber
      l[4].number = emptyNumber
      l[5].number = lockNumber
      console.log('radio', l)
      this.table = this.table.map(item => {
        if (item.val === val) {
          item.radio = l
          return item
        }
        return item
      })
    },
    filterList() { // 过滤各个tab选项
      const { activeTypeName, activeStatusName } = this
      const list = this.tableObj.deviceList
      if (activeTypeName === 'all' && activeStatusName === 'all') {
        this.currentDeviceList = list
      } else if (activeTypeName === 'all' && activeStatusName !== 'all') { // activeStatusName all on off warm
        switch (activeStatusName) {
          case 'on': // 在线
            this.currentDeviceList = list.filter(item => { return item.statusOnline === 1 })
            break
          case 'off': // 离线
            this.currentDeviceList = list.filter(item => { return item.statusOnline === 0 })
            break
          case 'warm': // 报警
            this.currentDeviceList = list.filter(item => { return item.alarmStatus === 1 })
            break
          case 'empty': // 空圈
            this.currentDeviceList = list.filter(item => { return item.isEmptyUnit === 1 })
            break
          case 'lock': // 参数锁定
            this.currentDeviceList = list.filter(item => { return item.lockParam === 1 })
            break
          default:
            this.currentDeviceList = []
            break
        }
      } else if (activeTypeName !== 'all' && activeStatusName === 'all') { // activeTypeName all 12132 12323
        this.currentDeviceList = list.filter(item => { return item.roomTypeId === activeTypeName })
      } else {
        switch (activeStatusName) {
          case 'on': // 在线
            this.currentDeviceList = list.filter(item => { return item.statusOnline === 1 && item.roomTypeId === activeTypeName })
            break
          case 'off': // 离线
            this.currentDeviceList = list.filter(item => { return item.statusOnline === 0 && item.roomTypeId === activeTypeName })
            break
          case 'warm': // 报警
            this.currentDeviceList = list.filter(item => { return item.alarmStatus === 1 && item.roomTypeId === activeTypeName })
            break
          case 'empty': // 空圈
            this.currentDeviceList = list.filter(item => { return item.isEmptyUnit === 1 })
            break
          case 'lock': // 参数锁定
            this.currentDeviceList = list.filter(item => { return item.lockParam === 1 })
            break
          default:
            this.currentDeviceList = []
            break
        }
      }
      this.$nextTick(() => { // 过滤完之后排序
        const filter = this.filterValue
        this.sortChange(filter)
      })
    },
    active(item, index) {
      const o = {
        '全部': 'all',
        '在线': 'on',
        '离线': 'off',
        '报警': 'warm',
        '空圈': 'empty',
        '参数锁定': 'lock'
      }
      this.activeStatusName = o[item.name]
      this.currentSort = index
    },
    handleRowClick(event) { // 表格行单击事件
      console.log('event---', event)
      this.goSub(event)
    },
    goSub(item) { // 去子页面
      console.log('获取得详情的内容', item)
      // 这里做一个sessionS存储
      const o = {
        overview: item,
        selectedOption: this.navFormInfo.data.cascader,
        selectedLabel: [item.regionName, item.areaName, item.fieldName],
        currentDeviceList: this.currentDeviceList // 这里是 当前单元信息下对应状态的列表 detail页面上下单元用
      }
      window.sessionStorage.setItem('piggeryInfos', JSON.stringify(o))
      this.$router.push({
        name: 'piggeryDeviceOverviewDetail',
        params: o
      })
    },
    // tab的点击事件
    handleClick(tab, event) {
      // console.log('tab点击事件', tab)
      if (tab.label === '全部类型') {
        this.activeTypeName = 'all'
      } else {
        this.activeTypeName = tab.name
      }
    },
    getMyEvcMcuInfo(val) { // 查询表格数据 fileStudy:pageList
      const element = this.pageElement['getAlarmInfosByField']
      const params = {
      }
      params.fieldId = val
      this.isLoading = true
      this.$httpRequest({
        type: element.method,
        uri: element.uri,
        payload: params,
        callback: res => {
          this.isLoading = false
          if (res.status === 200) {
            // 获取数据
            this.alarmData = res.data
            // console.log(res.data)
          } else {
            // this.$message.error(res.message)
          }
        }
      })
    },
    getIsFieldConfigAlarmNoticeUsers() {
      const element = pageElement['isFieldConfigAlarmNoticeUsers']
      const params = {
        regionId: this.selectedOption[0],
        areaId: this.selectedOption[1],
        fieldId: this.selectedOption[2]
      }
      this.$httpRequest({
        type: element?.method,
        uri: element?.uri,
        payload: params,
        callback: res => {
          console.log('查询场区是否配置整场告警通知推送接收人员', res)
          if (res.status === 200 && res.rel) {
            this.isHasFieldConfigAlarmNoticeUsers = res.data
          }
        }
      })
    },
    getoutdoorWeatherList(list = []) {
      if (!list) {
        return false
      }
      const unitIdsArr = list.map(item => item.unitId)
      const params = {
        unitIds: unitIdsArr.join(',')
      }
      const element = this.pageElement['getOutdoorWeatherStationByUnitIds']
      this.$httpRequest({
        type: element?.method,
        uri: element?.uri,
        payload: params,
        callback: res => {
          console.log('喷淋-室外气象站', res)
          if (res.status === 200 && res.rel) {
            this.outdoorWeatherList = res.data
          }
        }
      })
    },
    // 查询
    submitOption(flag) {
      if (this.selectedOption.length !== 0) {
        this.getWeatherData()
        this.getLeaderInfo()
        this.getIsFieldConfigAlarmNoticeUsers()
        if (flag) this.loading = true
        const o = { fieldId: this.selectedOption[2] }
        const element = this.pageElement['getPiggeryShowerDevices']
        this.getMyEvcMcuInfo(this.selectedOption[2])
        this.$httpRequest({
          type: element && element.method,
          uri: element && element.uri,
          payload: o,
          callback: res => {
            if (flag) this.loading = false
            if (res.status === 200 && res.rel) {
              this.deviceOverviewInfo = res.data
              if (res?.data?.outdoorWeatherStation?.length > 0) { // 这里改变一下---
                this.getoutdoorWeatherList(res.data.outdoorWeatherStation)
              }
              const temp = ['all']
              // initRadioList 全部 在线 离线 报警
              const list = [{ val: 'all', name: '全部类型', radio: initRadioList }] // [{ val: 'all', name: '全部类型', radio: initRadioList }]
              initRadioList[0].number = res.data.total
              initRadioList[1].number = res.data.onlineNum
              initRadioList[2].number = res.data.offlineNum
              initRadioList[4].number = res.data.emptyNum
              initRadioList[5].number = res.data.paramLockNum
              // initRadioList[3].number = res.data.warmNum || 0 // 自己过滤计算下 warmNum
              let warmNum = 0
              res.data.deviceList.map(item => {
                const { roomTypeId, roomTypeName } = item
                if (item.alarmStatus) { warmNum++ }
                if (temp.indexOf(roomTypeId) === -1) {
                  temp.push(roomTypeId)
                  list.push({
                    val: roomTypeId,
                    name: roomTypeName,
                    radio: initRadioList
                  })
                }
              })
              res.data.warmNum = warmNum
              initRadioList[3].number = warmNum
              this.tableObj = res.data
              console.log('list', list)
              this.table = list
              this.$nextTick(() => { this.filterList() })
            } else {
              // this.$message.error(res.message)
            }
          }
        })
      } else {
        this.$message.warning('请选择场区！')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.piggeryDeviceOverview{
  .my_focus, .dialog-head{
    @include font_color('spFontColor2');
  }
}
</style>
<style lang="scss">
.overview-home {
    position: relative;
    .el-alert--warning.is-light {
    background: rgba(253, 246, 236, 0.2);
}
    .focus-scrollbar {
      overflow: hidden;
      height: 36px;
      max-width: calc(100vw - 1024px);
      margin-right: 5px;
      display: -webkit-box;
      &::-webkit-scrollbar {
        height: 0 !important;
      }
    }
    .nav-view {
  display: flex;
  align-items: center;
  // margin-bottom: 10px;
}
.focus-flex {
  margin-top: -10px;
  margin-bottom: 10px;
}
    .isfullScreenAllIcon {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translate(-50%);
    // background: brown;
    // width: 10px;
    // height: 30px;
    z-index: 6666;
    cursor: pointer;
    img {
      display: block;
      width: 20px;
      height: auto;
    }
  }
    .dialog-weater{
    .weater-close{
          position: absolute;
    bottom: 30px;
    right: 45px;
    }
    .weather-list{
      width: 100%;
    }
    .weather-list1 {
    width: 100%;
    height: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 1px solid rgba(221, 221, 221, 0.2);
    border-right: 1px solid rgba(221, 221, 221, 0.2);
    border-left: 1px solid rgba(221, 221, 221, 0.2);
    text-align: left;
    p {
      padding: 0 10px;
      flex: 1;
    }
  }
  .weather-list1cor {
    // background: #15315E;
    @include background_color('inPigBackGroundColor10');
    border-top: 1px solid rgba(221, 221, 221, 0.2);
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
  .radio{align-items: center;}
  .default .el-input__inner{
    height: 34px !important;
    line-height: 34px !important;
  }
  .el-tabs__content{
    // height:44px;
  }
   .right-options{
    //  display: flex;
    //  justify-content: space-around;
    //  align-items: center;
     height: 40px;
     .filter{
       display: inline-block;
     }
     .el-tooltip{
       display: inline-block;
     }
     .btn-do{
       display: inline-block;
       position: relative;
       top: 3px;
       padding-right: 10px;
       cursor: pointer;
     }
   }
    .el-tabs__header {
    margin-top: -10px;
    padding-left: 10px;
    margin-bottom: 0 0 12px;
  }
  // .view-height{
  // // height: calc(100vh - 100px) ;
  // }
  .overflowXScroll{
    // border: 1px solid red;
    // .short-title{position: relative;top: 0px;left: 0px;}
      .items_container {
        margin-top:12px;
        overflow: scroll;
        display: flex;
        flex-wrap: wrap;
        // height: calc(100vh - 352px);
            height: calc(100vh - 444px);
        &::-webkit-scrollbar{
            display:none;
        }
        .items_row{
          // min-width: 1580px;
          width: 100%;
          // display: flex;flex-wrap: wrap;
        }
        .item_box{
          margin-bottom: 20px;
          flex: 1;
        }
      }
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
  .el-tabs__header {
    padding-left: 10px;
  }
  .el-tabs__nav-wrap::after {
    // background-color: #1a3166;
    @include background('viewBackGround10');
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
        margin: 0 10px;
      }
      .full-screen {
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
    color: #cdd8f7;
    @include font-color('mainFontColor11');
  }
  .focus-txt {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #2d3e70;
    // border: 1px solid #20a4fc;
    @include background_color('focusBkColor');
    @include font-color('formColor');
    border-radius: 2px;
    font-size: 14px;
    color: #cdd8f7;
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
<style lang="scss" scoped>
.weather{
  // background: linear-gradient(225deg,rgba(43,60,122,0.5), rgba(28,42,110,0.5));
  @include background("overviewBackGround");
  border: 1px solid;
  @include border_color("overviewBorderColor");
  border-radius: 4px 4px 4px 0px 4px;
// padding: 8px 0;
  .weather-head{
    position: relative;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    border-bottom: solid 1px;
    @include border_color("overviewBorderColor");
    .sw{
      position: absolute;
      left: 100px;
      width: 75%;
      display: flex;
      justify-content: space-between;
    }
    .left{
      @include font_color('inPigFontColor3');
    }
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
      padding: 0;
      justify-content: space-between;
      position: absolute;
      left: 100px;
      width: 75%;
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
  padding:0!important;
}
.scrollbar-full {
  height: calc(100vh - 200px) !important;
}
.home-warp-scrollbar {
  height: calc(100vh - 390px);
  overflow-x: hidden;
  .home-warp-none {
    color: #cdd8f7;
    height: calc(100vh - 390px);
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
}
.nav-form {
  // margin-bottom: 20px;
}
.top-l {
  font-size: 14px;
  // color: #cdd8f7;
  @include font_color('inPigFontColor4');
  line-height: 36px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  span {
    padding: 0 6px;
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
        // max-width: 110px;
        width: 100%;
        height: 26px;
        color: #fff;
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
    // color: #7894e3;
    @include border_color('viewRadioColor');
    @include font-color("taskTagFontColor");
    padding: 0 5px;
    height: 24px;
  }
  button.active[type='button'] {
    color: #1fbfff!important;
    background: rgba(9, 30, 64, 0);
    border: 1px solid #1fbfff;
    // box-shadow: inset 0 0 10px 0 #217bfc;
    @include box_shadow('taskTagBoxShadow');
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
  background-image: linear-gradient(225deg, #2b3c7a 0%, #1b265b 100%);
  box-shadow: 0 2px 20px 0 #04082d;
  border-radius: 4px;
  color: #cdd8f7;
  box-sizing: border-box;
  cursor: pointer;
  min-width: 212px;
  &:hover {
    // border: 2px solid #10aeff;
    .item-main {
      background-image: linear-gradient(225deg, #5166b3 0%, #334391 100%);
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
    background: #2e3e7c;
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
    color: #cdd8f7;
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
  height: calc(100vh - 280px);
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
    overflow-y: auto;
    // TODO:设备概览报警信息滚动
    // overflow-y: scroll;
    height: calc(100% - 50px);
    // &::-webkit-scrollbar {
    //   display: none;
    // }
    .title {
      font-size: 16px;
      // color: #cdd8f7;
      @include font_color('inPigFontColor1');
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
        color: #cdd8f7;
        margin: 10px 0;
        text-align: left;
        .prefix {
          margin-right: 10px;
        }
      }
    }
    .warn-none {
      height: 100%;
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
      // color: #cdd8f7;
      @include font_color('inPigFontColor1');
      overflow: hidden;
      line-height: 40px;
      white-space: nowrap;
      text-overflow: ellipsis;
      cursor: pointer;
    }
    li:hover {
      color: #3e9aff!important;
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
