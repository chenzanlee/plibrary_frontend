<template>
  <div class="area-container">
    <!-- head -->
    <div class="area-container-nav">
      <div class="area-container-nav-l">
        <button class="btn-blue go-back-btn" @click="goBack()"><i class="iconfont">&#xe61d;</i>返回</button>
        {{ overview && overview.fieldName }}-{{
          overview && overview.roomTypeName
        }}{{ overview && (overview.unit || overview.unitName) }}
        <div v-if="progress !== 'multiUnitSetting'" class="area-container-nav-l-right">
          <el-tooltip class="" effect="dark" content="没有了" placement="top-start">
            <img v-show="unitList && unitList.length > 0 && unitList[0].deviceId === currentdeviceId" class="area-container-nav-l-right-up area-container-nav-l-right-img-disable" src="@/assets/image/unitStatus/upperUnit.png">
          </el-tooltip>
          <el-tooltip class="" effect="dark" content="上一单元" placement="top-start">
            <img v-show="unitList && unitList.length > 0 && unitList[0].deviceId !== currentdeviceId" class="area-container-nav-l-right-up" src="@/assets/image/unitStatus/upperUnit.png" @click="switchUnit('low')">
            <!-- <img class="area-container-nav-l-right-up" src="@/assets/image/unitStatus/upperUnit.png" @click="switchUnit('low')"> -->
          </el-tooltip>
          <el-tooltip class="" effect="dark" content="没有了" placement="top-start">
            <img v-show="unitList && unitList.length > 0 && unitList[unitList.length - 1].deviceId === currentdeviceId" class="area-container-nav-l-right-lower area-container-nav-l-right-img-disable" src="@/assets/image/unitStatus/lowerUnit.png">
          </el-tooltip>
          <el-tooltip class="" effect="dark" content="下一单元" placement="top-start">
            <img v-show="unitList && unitList.length > 0 && unitList[unitList.length - 1].deviceId !== currentdeviceId" class="area-container-nav-l-right-lower" src="@/assets/image/unitStatus/lowerUnit.png" @click="switchUnit('up')">
            <!-- <img class="area-container-nav-l-right-lower" src="@/assets/image/unitStatus/lowerUnit.png" @click="switchUnit('up')"> -->
          </el-tooltip>
        </div>
      </div>
      <div class="area-container-nav-r">
        <template v-for="i in head.list">
          <div
            v-if="i.name !== '设备名称：'"
            :key="i.name"
            class="area-container-nav-r-row"
          >
            <span class="area-container-nav-r-col1">{{ i.name }}</span>
            <span class="area-container-nav-r-col2">{{ i.value || '-' }}</span>
          </div>
        </template>
      </div>
    </div>

    <!-- body -->
    <div class="Highlight area-container-main">
      <div class="area-container-carrier overfolw">
        <div class="area-container-carrier-nav">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="状态监控" name="first">
              <unit-monitoring-v3 v-if="deviceVersionId === '6aKGZaUNLp9poYSNu1PhnU'" :info="fieldDeviceOverviewDetail" :unit-id="currentdeviceId" @childrenInfo="alarmInfo" />
              <unit-monitoring v-else :info="fieldDeviceOverviewDetail" :unit-id="currentdeviceId" @childrenInfo="alarmInfo" />
            </el-tab-pane>
            <!-- 设备控制 -->
            <el-tab-pane label="设备控制" name="second">
              <div v-if="overview && overview.statusOnline === 0" style="height: calc(100vh - 280px);display: flex;justify-content: center;align-items: center;">
                <img style="height:60%;marginBottom:10%;" :src="statusOnline | noDataFile('status-online', 'webp')" alt="">
              </div>
              <div v-else>
                <div v-if="isShow" style="height: calc(100vh - 280px);display: flex;justify-content: center;align-items: center;"><img src="../../../../../assets/image/noPermission.webp" alt=""></div>
                <equipment-control v-if="deviceVersionId !== '6aKGZaUNLp9poYSNu1PhnU'" id="control" v-hasAuth="'fieldDeviceOverview:controlSubDevice_MCU'" :unit-id="currentdeviceId" />
                <equipment-controlv3 v-if="deviceVersionId === '6aKGZaUNLp9poYSNu1PhnU'" id="control" v-hasAuth="'fieldDeviceOverview:controlSubDevice_MCU'" :unit-id="currentdeviceId" />
              </div>
            </el-tab-pane>
            <!-- 报警控制 -->
            <el-tab-pane v-if="deviceVersionId === '6aKGZaUNLp9poYSNu1PhnU'" label="报警控制" name="four">
              <div v-if="overview && overview.statusOnline === 0" style="height: calc(100vh - 280px);display: flex;justify-content: center;align-items: center;">
                <img style="height:60%;marginBottom:10%;" :src="statusOnline | noDataFile('status-online', 'webp')" alt="">
              </div>
              <div v-else>
                <div v-if="isShow" style="height: calc(100vh - 280px);display: flex;justify-content: center;align-items: center;"><img src="../../../../../assets/image/noPermission.webp" alt=""></div>
                <alert-control v-hasAuth="'fieldDeviceOverview:controlSubDevice_MCU'" :info="fieldDeviceOverviewDetail" :unit-id="currentdeviceId" />
              </div>
            </el-tab-pane>
            <!-- 参数设置 -->
            <el-tab-pane label="参数设置" name="third">
              <template v-if="deviceVersionId === '6aKGZaUNLp9poYSNu1PhnU'">
                <parameter-setting-v3
                  v-if="progress === 'parameterSetting'"
                  :unit-id="currentdeviceId"
                />
                <multi-unit v-if="progress === 'multiUnit'" :unit-id="currentdeviceId" />
                <multi-unit-setting-v3 v-if="progress === 'multiUnitSetting'" :key="time" :unit-id="currentdeviceId" />
                <multi-function-setting-v3 v-if="progress === 'multiFunctionSetting'" :key="multiFunctionTime" :unit-id="currentdeviceId" />
              </template>
              <template v-else>
                <parameter-setting
                  v-if="progress === 'parameterSetting'"
                  :unit-id="currentdeviceId"
                />
                <multi-unit v-if="progress === 'multiUnit'" :unit-id="currentdeviceId" />
                <multi-unit-setting v-if="progress === 'multiUnitSetting'" :key="time" :unit-id="currentdeviceId" />
                <multi-function-setting v-if="progress === 'multiFunctionSetting'" :key="multiFunctionTime" :unit-id="currentdeviceId" />
              </template>
            </el-tab-pane>
          </el-tabs>
        </div>
        <!-- <div>

        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
// import navForm from '@/components/commonComponent/navForm'
import unitMonitoring from '@/views/IntelligentControl/fieldDeviceOverview/page/subpage/unitMonitoring'
import equipmentControl from '@/views/IntelligentControl/fieldDeviceOverview/page/subpage/equipmentControl'
import parameterSetting from '@/views/IntelligentControl/fieldDeviceOverview/page/subpage/parameterSetting'
import multiUnit from '@/views/IntelligentControl/fieldDeviceOverview/page/subpage/subordinate/multiUnitSetUp'
import multiUnitSetting from '@/views/IntelligentControl/fieldDeviceOverview/page/subpage/multiUnitSetting'
import multiFunctionSetting from '@/views/IntelligentControl/fieldDeviceOverview/page/subpage/multiFunctionSetting'
// v3
import alertControl from '@/views/IntelligentControl/fieldDeviceOverview/page/subpageV3/alertControl'
import equipmentControlv3 from '@/views/IntelligentControl/fieldDeviceOverview/page/subpageV3/equipmentControl'
import parameterSettingV3 from '@/views/IntelligentControl/fieldDeviceOverview/page/subpageV3/parameterSetting'
import unitMonitoringV3 from '@/views/IntelligentControl/fieldDeviceOverview/page/subpageV3/unitMonitoring'
// import multiUnitv3 from '@/views/IntelligentControl/fieldDeviceOverview/page/subpageV3/subordinate/multiUnitSetUp'
import multiUnitSettingV3 from '@/views/IntelligentControl/fieldDeviceOverview/page/subpageV3/multiUnitSetting'
import multiFunctionSettingV3 from '@/views/IntelligentControl/fieldDeviceOverview/page/subpageV3/multiFunctionSetting'

import { mapGetters } from 'vuex'
import {
  getDeviceInfoByUnit
} from '@/http/api/fieldInfo'
import {
  getDevicesByField
} from '@/http/api/fieldDeviceOverview'

export default {
  components: {
    unitMonitoring,
    // navForm,
    equipmentControl,
    parameterSetting,
    multiUnit,
    multiUnitSetting,
    multiFunctionSetting,
    // v3
    alertControl,
    equipmentControlv3,
    parameterSettingV3,
    // multiUnitv3,
    multiUnitSettingV3,
    multiFunctionSettingV3,
    unitMonitoringV3
  },
  provide() {
    return {
      overviewDetail: this
    }
  },
  data() {
    return {
      statusOnline: '',
      time: '',
      isShow: false,
      multiFunctionTime: '',
      fieldDeviceOverviewDetail: JSON.parse(sessionStorage.getItem('fieldDeviceOverviewDetail')),
      overview: JSON.parse(sessionStorage.getItem('fieldDeviceOverviewDetail')).overview,
      selectedOption: JSON.parse(sessionStorage.getItem('fieldDeviceOverviewDetail')).selectedOption,
      selectedLabel: JSON.parse(sessionStorage.getItem('fieldDeviceOverviewDetail')).selectedLabel,
      progress: 'parameterSetting',
      activeName: localStorage.getItem('fieldDeviceOverview_activeName') || 'first',
      head: {
        name: '',
        list: [
          {
            name: '设备ID：',
            value: ''
          },
          {
            name: '设备名称：',
            value: ''
          },
          {
            name: '设备类型：',
            value: ''
          },
          {
            name: '固件版本：',
            value:
              this.overview &&
              this.overview.firmwareVersion
          }
        ]
      },
      equiment_info: {},
      unitList: JSON.parse(sessionStorage.getItem('fieldDeviceOverviewDetail')).unitList,
      currentUnitId: JSON.parse(sessionStorage.getItem('fieldDeviceOverviewDetail')).overview.unitId,
      currentdeviceId: JSON.parse(sessionStorage.getItem('fieldDeviceOverviewDetail')).overview.deviceId,
      unitTimer: null,
      deviceVersionId: JSON.parse(sessionStorage.getItem('fieldDeviceOverviewDetail')).overview.deviceVersionId
    }
  },
  computed: {
    ...mapGetters(['fullScreen']),
    isfullScreen() {
      return this.fullScreen
    },
    newAgreement() {
      if (this.deviceVersionId === '6aKGZaUNLp9poYSNu1PhnU') {
        return true
      } else {
        return false
      }
    }
  },
  created() {
    if (this.isfullScreen === true) {
      this.$store.dispatch('checkFullScreen')
    }
    console.log('1111111111111111111111111111', this.deviceVersionId)
  },
  mounted() {
    this.getUnitInfo()
    // const DOM = document.getElementById('breadcrumb-container')
    // DOM.style.marginBottom = '84px'
    this.isShow = document.getElementById('control') && document.getElementById('control').style.display === 'none'
    this.init()
  },
  beforeRouteLeave(to, form, next) {
    if (to.name !== 'orderHistory' && to.name !== 'intelligentControlOverviewMultiUnitSetting') {
      localStorage.removeItem('fieldDeviceOverview_activeName')
    }
    next()
  },
  methods: {
    handleClick(tab, event) {
      this.activeName = tab.name
      localStorage.setItem('fieldDeviceOverview_activeName', tab.name)
    },

    init() {
      if (this.overview && this.overview.firmwareVersion) {
        this.head.list[3].value = this.overview.firmwareVersion
      }
      if (this.fieldDeviceOverviewDetail && this.fieldDeviceOverviewDetail.overview && this.fieldDeviceOverviewDetail.selectedOption) {
        this.getEquipmentInfo()
      }
    },
    goBack() {
      window.history.go(-1)
    },
    getUnitInfo() {
      if (!this.unitList || this.unitList.length === 0) {
        this.getPigUnitInfo()
      }
    },
    alarmInfo(v) {
      if (v) {
        this.equiment_info.deviceVersion = v.data.deviceVersion || null
        this.equipmentType()
      }
    },
    equipmentType() {
      if (this.equiment_info.deviceId && this.equiment_info.deviceName && this.equiment_info.deviceType) {
        let type = '-'
        if (this.equiment_info.deviceType !== 'evc_mcu') {
          type = '台达'
        } else {
          const str = this.equiment_info.deviceVersion ? (this.equiment_info.deviceVersion === 120 ? '（一代）' : '（二代）') : ''
          if (this.equiment_info.deviceId.indexOf('4D59') > -1) {
            type = '自研' + str
          } else if (this.equiment_info.deviceId.indexOf('4843') > -1) {
            type = '华诚'
          } else {
            type = 'ACC-I'
          }
        }
        this.head.list[0].value = this.equiment_info.deviceId
        this.head.list[1].value = this.equiment_info.deviceName
        this.head.list[2].value = type || '-'
      }
    },
    switchUnit(type) {
      console.log(this.unitList)
      clearTimeout(this.unitTimer)
      this.unitTimer = setTimeout(() => {
        if (this.unitList && this.currentdeviceId) {
          let n = null
          for (let i = 0; i < this.unitList.length; i++) {
            if (this.unitList[i].deviceId === this.currentdeviceId) {
              n = i
            }
          }
          // let n = 0
          type === 'up' ? n++ : n--
          // n = (n < 0) ? 0 : n
          // console.log(this.unitList, n)

          const labelList = [this.unitList[n].regionName, this.unitList[n].areaName, this.unitList[n].fieldName]
          const optionList = [this.unitList[n].regionId, this.unitList[n].areaId, this.unitList[n].fieldId]
          this.currentdeviceId = this.unitList[n].deviceId
          this.overview = this.unitList[n]
          this.fieldDeviceOverviewDetail.overview = this.unitList[n]
          this.fieldDeviceOverviewDetail.selectedLabel = labelList
          this.fieldDeviceOverviewDetail.selectedOption = optionList
          this.selectedOption = optionList
          this.deviceVersionId = this.unitList[n].deviceVersionId
          const d = JSON.parse(sessionStorage.getItem('fieldDeviceOverviewDetail'))
          d.overview = this.unitList[n]
          sessionStorage.setItem('fieldDeviceOverviewDetail', JSON.stringify(d))

          this.activeName === 'four' ? this.activeName = 'first' : null
          this.init()
          console.log(2222222222, this.deviceVersionId)
        }
      }, 300)
    },
    // 获取设备id、名称
    async getEquipmentInfo() {
      let routeUnit = ''
      if (this.overview.unit) {
        routeUnit = this.overview.unit
      } else {
        routeUnit = this.overview.unitName
      }
      const data = {
        regionld: this.selectedOption[0],
        areaId: this.selectedOption[1],
        fieldId: this.selectedOption[2],
        segmentId: this.overview.segmentId,
        unit: routeUnit
      }
      await getDeviceInfoByUnit(data).then((res) => {
        if (res && res.status === 200 && res.rel) {
          this.equiment_info.deviceId = res.data.deviceId || ''
          this.equiment_info.deviceName = res.data.deviceName || ''
          this.equiment_info.deviceType = res.data.deviceType || ''
          this.equipmentType()
        } else { this.$message.error(res.message) }
      })
    },
    // 获取单元列表
    async getPigUnitInfo() {
      await getDevicesByField({ fieldId: this.selectedOption[2] }).then(res => {
        if (res && res.status === 200 && res.rel) {
          this.unitList = res.data.deviceList
        } else { this.$message.error(res.message) }
      })
    }
  }
}
</script>

<style lang="scss">
.equipment-control{
  .overview-box{
    .el-input-number{
      width: auto !important;
    }
  }
}
.area-container {
  overflow: hidden;
}
.area-container-nav {
  // color: #f4f7ff;
  @include font-color('viewFontColor2');
  margin-bottom: 7px;
  &-l {
    min-width: 285px;
    font-family: SourceHanSansCN-Medium;
    font-size: 18px;
    // height: 40px;
    line-height: 30px;
    &-right{
      float: right;
      img{
        height: 40px;
      }
      &-up{
        margin-right: 15px;
        cursor: pointer;
      }
      &-lower{
        cursor: pointer;
      }
      &-up:hover,
      &-lower:hover{
        opacity: 0.8;
      }
      &-img-disable,
      &-img-disable:hover{
        opacity: 0.5;
        cursor: no-drop;
      }
    }
  }
  &-r {
    font-family: SourceHanSansCN-Normal;
    font-size: 12px;
    color: #677291;
    margin-top: 10px;
    &-row {
      padding-left: 15px;
      display: inline-block;
    }
    &-row:first-child {
      padding-left: 0px;
    }
    &-row:last-child {
      span {
        border-right: none;
      }
    }
    &-col1 {
    }
    &-col2 {
      border-right: 1px solid #424f75;
      padding-right: 15px;
    }
  }
}
.area-container-main {
  // margin-top: 15px;
  @include background('mainHighlightBackGround');
}
.area-container-carrier {
  min-height: calc(100vh - 212px);
  max-height: calc(100vh - 212px);
  overflow-x:hidden;
  overflow-y:auto;
  /* height: 700px; */
  &-nav {
    /* width: 100%; */
    margin: 0 1.6%;
  }
  .el-tabs__nav-wrap::after {
    height: 1px !important;
    // background: #1a3166 !important;
    @include background('viewBackGround10');
  }
}
</style>
