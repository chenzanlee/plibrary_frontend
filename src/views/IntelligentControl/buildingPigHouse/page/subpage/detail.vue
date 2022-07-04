<template>
  <div class="area-container">
    <!-- head v-if="isNotEnterMultiUnit"-->
    <div class="area-container-nav">
      <div class="area-container-nav-l">
        <button class="btn-blue go-back-btn" @click="goBack()"><i class="iconfont">&#xe61d;</i>返回</button>
        {{ paramsHead.title }}
        <div class="area-container-nav-l-right">
          <el-tooltip class="" effect="dark" content="没有了" placement="top-start">
            <img v-show="unitList && unitList[0].unitId === currentUnitId" class="area-container-nav-l-right-up area-container-nav-l-right-img-disable" src="@/assets/image/unitStatus/upperUnit.png">
          </el-tooltip>
          <el-tooltip class="" effect="dark" content="上一单元" placement="top-start">
            <img v-show="unitList && unitList[0].unitId !== currentUnitId" class="area-container-nav-l-right-up" src="@/assets/image/unitStatus/upperUnit.png" @click="switchUnit('low')">
          </el-tooltip>
          <el-tooltip class="" effect="dark" content="没有了" placement="top-start">
            <img v-show="unitList && unitList[unitList.length - 1].unitId === currentUnitId" class="area-container-nav-l-right-lower area-container-nav-l-right-img-disable" src="@/assets/image/unitStatus/lowerUnit.png">
          </el-tooltip>
          <el-tooltip class="" effect="dark" content="下一单元" placement="top-start">
            <img v-show="unitList && unitList[unitList.length - 1].unitId !== currentUnitId" class="area-container-nav-l-right-lower" src="@/assets/image/unitStatus/lowerUnit.png" @click="switchUnit('up')">
          </el-tooltip>
        </div>
      </div>
      <div class="area-container-nav-r">
        <div
          v-for="i in paramsHead.list"
          :key="i.name"
          class="area-container-nav-r-row"
        >
          <span class="area-container-nav-r-col1">{{ i.name }}</span>
          <span class="area-container-nav-r-col2">{{ i.value }}</span>
        </div>
      </div>
    </div>

    <!-- body -->
    <div class="Highlight area-container-main">
      <div class="area-container-carrier overfolw">
        <div class="common-container-carrier-nav">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="状态监控" name="first" />
            <el-tab-pane label="设备控制" name="second">
              <div
                v-if="params && params.overview && params.overview.statusOnline === 0"
                style="height: calc(100vh - 280px);display: flex;
                  justify-content: center;
                  align-items: center;"
              >
                <img style="height:60%;marginBottom:10%;" :src="statusOnline | noDataFile('status-online', 'webp')" alt="">
              </div>
              <div v-else>
                <div
                  v-if="isShow"
                  style="height: calc(100vh - 280px);display: flex;justify-content: center;align-items: center;"
                >
                  <img src="../../../../../assets/image/noPermission.webp" alt="">
                </div>
                <div id="buildingPigHouseControl" v-hasAuth="'buildingPigHouse:roomDevControl'">
                  <equipment-control v-if="progressCtr === 'equipment'" :unit-id="currentUnitId" />
                  <multi-unit-controls v-if="progressCtr === 'multiUnitControls'" :key="timeCtr" :unit-id="currentUnitId" />
                  <multi-unit-control v-if="progressCtr === 'multiUnitControl'" :unit-id="currentUnitId" />
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="参数设置" name="third">
              <parameter-setting
                v-if="progress === 'parameterSetting'"
                :unit-id="currentUnitId"
              />
              <multi-unit v-if="progress === 'multiUnit'" :unit-id="currentUnitId" />
              <multi-unit-setting v-if="progress === 'multiUnitSetting'" :unit-id="currentUnitId" />
              <multi-function-setting v-if="progress === 'multiFunctionSetting'" :unit-id="currentUnitId" />
            </el-tab-pane>
          </el-tabs>
        </div>
        <div>
          <unit-monitoring v-if="activeName === 'first'" :unit-id="currentUnitId" :info="params" @childrenInfo="alarmInfo" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const floorObj = {
  FLOOR_ONE: '1楼',
  FLOOR_TWO: '2楼',
  FLOOR_THREE: '3楼',
  FLOOR_FOUR: '4楼',
  FLOOR_FIVE: '5楼',
  FLOOR_SIX: '6楼',
  FLOOR_SEVEN: '7楼'
}
const blockObj = {
  BLOCK_A: 'A座',
  BLOCK_B: 'B座',
  BLOCK_C: 'C座'
}
import unitMonitoring from './unitMonitoring.vue'
import equipmentControl from './equipmentControl'
import multiUnitControls from './multiUnitControl'
import parameterSetting from './parameterSetting'
import multiUnit from './subordinate/multiUnitSetUp'
import multiUnitControl from './subordinate/multiUnitControlSetUp'
import multiUnitSetting from './multiUnitSetting'
import multiFunctionSetting from './multiFunctionSetting'
import {
  getDeviceInfoByUnit,
  getPigOneInfo
} from '@/http/api/fieldInfo'
let buildingPigHouseDetail = {}
export default {
  components: {
    unitMonitoring,
    equipmentControl,
    multiUnitControls,
    parameterSetting,
    multiUnit,
    multiUnitControl,
    multiUnitSetting,
    multiFunctionSetting
  },
  data() {
    buildingPigHouseDetail = JSON.parse(sessionStorage.getItem('buildingPigHouseDetail'))
    return {
      statusOnline: '',
      params: {}, // 路由携参 见params.json
      time: '',
      unitTimer: null,
      isShow: false,
      timeCtr: '',
      isNotEnterMultiUnit: true,
      multiFunctionTime: '',
      overview: buildingPigHouseDetail.overview,
      selectedOption: buildingPigHouseDetail.selectedOption,
      selectedLabel: buildingPigHouseDetail.selectedLabel,
      progress: 'parameterSetting',
      progressCtr: 'equipment',
      activeName: 'first',
      unitList: JSON.parse(sessionStorage.getItem('buildingPigHouseDetail')).unitList,
      currentUnitId: JSON.parse(sessionStorage.getItem('buildingPigHouseDetail')).overview.unitId,
      equiment_info: {}
    }
  },
  computed: {
    paramsHead() {
      const params = this.overview
      if (this.overview.roomTypeName) {
        const { regionName, areaName, fieldName, floor, block, roomTypeName, deviceId, deviceName, firmwareVersion, unit } = params
        return {
          title: regionName + '-' + areaName + '-' + fieldName + '-' + floorObj[floor] + '-' + blockObj[block] + '-' + roomTypeName + unit,
          list: [
            {
              name: '设备ID：',
              value: deviceId
            },
            {
              name: '设备名称：',
              value: deviceName
            },
            {
              name: '固件版本：',
              value: firmwareVersion
            }
          ]
        }
      }
      return {
        title: '',
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
            name: '固件版本：',
            value: ''
          }
        ]
      }
    }
  },
  provide() {
    return {
      overviewDetail: this,
      overviewDetails: this
    }
  },
  created() {
    this.params = JSON.parse(sessionStorage.getItem('buildingPigHouseDetail'))
  },
  beforeRouteLeave(to, form, next) {
    // const DOM = document.getElementById('breadcrumb-container')
    // DOM.style.marginBottom = '12px'
    next()
  },
  mounted() {
    // const DOM = document.getElementById('breadcrumb-container')
    // DOM.style.marginBottom = '84px'
    const params = this.$route.params
    if (params.toPath === 'multiUnitSetting') {
      this.activeName = 'third'
      this.progress = 'multiUnitSetting'
    }
    this.isShow = document.getElementById('buildingPigHouseControl') && document.getElementById('buildingPigHouseControl').style.display === 'none'
    // this.init()
  },
  methods: {
    goBack() {
      this.$router.push({
        name: 'buildingPigHouse'
      })
    },
    handleClick(tab, event) {
      this.activeName = tab.name
    },
    switchUnit(type) {
      clearTimeout(this.unitTimer)
      this.unitTimer = setTimeout(() => {
        if (this.unitList && this.currentUnitId) {
          let n = null
          for (let i = 0; i < this.unitList.length; i++) {
            if (this.unitList[i].unitId === this.currentUnitId) {
              n = i
            }
          }
          type === 'up' ? n++ : n--
          this.currentUnitId = this.unitList[n].unitId
          this.overview = this.unitList[n]
          const d = JSON.parse(sessionStorage.getItem('buildingPigHouseDetail'))
          d.overview = this.unitList[n]
          sessionStorage.setItem('buildingPigHouseDetail', JSON.stringify(d))
          this.params = JSON.parse(sessionStorage.getItem('buildingPigHouseDetail'))
          this.init()
        }
      }, 300)
    },

    init() {
      buildingPigHouseDetail = JSON.parse(sessionStorage.getItem('buildingPigHouseDetail'))
      // if (buildingPigHouseDetail && buildingPigHouseDetail.overview && buildingPigHouseDetail.selectedOption) {
      //   this.getEquipmentInfo()
      // }
    },
    alarmInfo(v) {
      if (v) {
        this.equiment_info.deviceVersion = v.data.deviceVersion || null
        this.equipmentType()
      }
    },
    equipmentType() {
      if (this.equiment_info.deviceId && this.equiment_info.deviceName && this.equiment_info.deviceType && this.equiment_info.deviceVersion) {
        let type = ''
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
        this.head.list[2].value = type
      }
    },
    // 获取设备id、名称
    async getEquipmentInfo() {
      let routeUnit = ''
      if (buildingPigHouseDetail.overview.unit) {
        routeUnit = buildingPigHouseDetail.overview.unit
      } else {
        routeUnit = buildingPigHouseDetail.unitName
      }
      const data = {
        regionld: buildingPigHouseDetail.selectedOption[0],
        areaId: buildingPigHouseDetail.selectedOption[1],
        fieldId: buildingPigHouseDetail.selectedOption[2],
        segmentId: buildingPigHouseDetail.overview.segmentId,
        unit: routeUnit
      }
      await getDeviceInfoByUnit(data).then((res) => {
        if (res && res.status === 200 && res.rel) {
          this.equiment_info = res.data
          this.equipmentType()
        } else { this.$message.error(res.message) }
      })
    },

    // 猪舍信息
    async getPigInfo() {
      let routeUnit = ''
      if (buildingPigHouseDetail.overview.unit) {
        routeUnit = buildingPigHouseDetail.overview.unit
      } else {
        routeUnit = buildingPigHouseDetail.overview.unitName
      }
      const data = {
        regionld: buildingPigHouseDetail.selectedOption[0],
        areaId: buildingPigHouseDetail.selectedOption[1],
        fieldId: buildingPigHouseDetail.selectedOption[2],
        segmentId: buildingPigHouseDetail.overview.segmentId,
        unit: routeUnit
      }
      await getPigOneInfo(data).then((res) => {
        if (res && res.status === 200 && res.data) {
          this.equiment_info.deviceVersion = res.data.deviceVersion || null
          this.equipmentType()
        } else {
          this.$message({ message: res.message, type: 'warning' })
        }
      })
    }

  }
}
</script>

<style lang="scss">
.area-container {
  // min-width:  1024px;
  // margin-bottom: 10px;
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
  // min-height: calc(100vh - 260px);
  &-nav {
    // width: 100%;
    margin: 0 1.6%;
  }
  .el-tabs__nav-wrap::after {
    height: 1px !important;
    // background: #1a3166 !important;
    @include background('viewBackGround10');
  }
}
</style>
