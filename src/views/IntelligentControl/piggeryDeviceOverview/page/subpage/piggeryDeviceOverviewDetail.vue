<template>
  <div class="area-container">
    <!-- head -->
    <div class="area-container-nav">
      <div class="area-container-nav-l">
        <button class="btn-blue go-back-btn" @click="goBack()"><i class="iconfont">&#xe61d;</i>返回</button>
        {{ head.name }}
        <div v-if="unitList.length>1" class="area-container-nav-l-right">
          <el-tooltip effect="dark" content="没有了" placement="top-start">
            <img v-show="unitList && unitList[0].unitId === currentUnitId" class="area-container-nav-l-right-up area-container-nav-l-right-img-disable" src="@/assets/image/unitStatus/upperUnit.png">
          </el-tooltip>
          <el-tooltip effect="dark" content="上一单元" placement="top-start">
            <img v-show="unitList && unitList[0].unitId !== currentUnitId" class="area-container-nav-l-right-up" src="@/assets/image/unitStatus/upperUnit.png" @click="switchUnit(true)">
          </el-tooltip>
          <el-tooltip effect="dark" content="没有了" placement="top-start">
            <img v-show="unitList && unitList[unitList.length - 1].unitId === currentUnitId" class="area-container-nav-l-right-lower area-container-nav-l-right-img-disable" src="@/assets/image/unitStatus/lowerUnit.png">
          </el-tooltip>
          <el-tooltip effect="dark" content="下一单元" placement="top-start">
            <img v-show="unitList && unitList[unitList.length - 1].unitId !== currentUnitId" class="area-container-nav-l-right-lower" src="@/assets/image/unitStatus/lowerUnit.png" @click="switchUnit(false)">
          </el-tooltip>
        </div>
      </div>
      <div class="area-container-nav-r">
        <div
          v-for="i in head.list"
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
                v-if="overview && overview.statusOnline === 0"
                style="height: calc(100vh - 280px);display: flex;justify-content: center;align-items: center;"
              >
                <img style="height:60%;marginBottom:10%;" :src="statusOnline | noDataFile('status-online', 'webp')" alt="">
              </div>
              <template v-else>
                <!-- 有设备控制权限 -->
                <equipment-control id="piggControl" :key="eq_key" v-hasAuth="'PiggeryDeviceOverview:controlDevice'" />
                <!-- 没权限 -->
                <div v-if="isShow" style="height: calc(100vh - 280px);display: flex;justify-content: center;align-items: center;">
                  <img src="../../../../../assets/image/noPermission.webp" alt="">
                </div>
              </template>
            </el-tab-pane>
            <el-tab-pane label="参数设置" name="third">
              <parameter-setting v-if="progress === 'parameterSetting'" :key="pa_key" />
              <multi-unit v-if="progress === 'multiUnit'" />
              <multi-function-setting v-if="progress === 'multiFunctionSetting'" :key="mu_key" />
            </el-tab-pane>
          </el-tabs>
        </div>
        <div>
          <unit-monitoring v-if="activeName === 'first'" :key="un_key" :info="this.$route.params" @childrenInfo="alarmInfo" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import navForm from '@/components/commonComponent/navForm'
import unitMonitoring from './unitStatusMonitoring.vue'
import equipmentControl from './deviceControl.vue'
import parameterSetting from './parameterSetting'
// import multiUnit from './multiUnitSetUp'
import multiFunctionSetting from './multiFunctionSetting'
export default {
  components: {
    unitMonitoring,
    // navForm,
    equipmentControl,
    parameterSetting,
    // multiUnit,
    multiFunctionSetting
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
      multiFunctionTime: '',
      overview: this.$route.params.overview,
      selectedOption: this.$route.params.selectedOption,
      selectedLabel: this.$route.params.selectedLabel,
      progress: 'parameterSetting',
      activeName: 'first',
      equiment_info: {},
      isShow: false,
      unitList: [{ unitId: '' }], // 当前单元列表 对应父页面的 列表
      currentUnitId: '', // 当前unitId
      eq_key: 0, // 设备控制的key  用于刷新
      pa_key: 0, // 参数设置
      mu_key: 0, // 多功能
      un_key: 0
    }
  },
  computed: {
    head() {
      const o = {
        fieldName: '',
        roomTypeName: '',
        unit: '',
        unitName: '',
        deviceId: '',
        deviceName: '',
        firmwareVersion: '',
        channel: ''
      }
      const { fieldName, roomTypeName, unit, unitName, deviceId, deviceName, firmwareVersion, channel } = this.overview || o
      return {
        name: (fieldName || '-') + '-' + (roomTypeName || '-') + (unit || unitName || '-'),
        list: [
          {
            name: '设备ID：',
            value: deviceId || '-'
          },
          {
            name: '设备名称：',
            value: deviceName || '-'
          },
          {
            name: '固件版本：',
            value: firmwareVersion || '-'
          },
          {
            name: '通道号：',
            value: channel || '-'
          }
        ]
      }
    }
  },
  beforeRouteLeave(to, form, next) {
    // const DOM = document.getElementById('breadcrumb-container')
    // DOM.style.marginBottom = '12px'
    next()
  },
  mounted() {
    // const DOM = document.getElementById('breadcrumb-container')
    // DOM.style.marginBottom = '84px'
    this.isShow = document.getElementById('piggControl') && document.getElementById('piggControl').style.display === 'none'
    this.init()
    console.log('获取的初始化数据', this.overview)
  },
  methods: {
    goBack() {
      window.history.go(-1)
    },
    refreshKey() { // 刷新key 刷新组件
      this.eq_key++ // 设备控制的key  用于刷新
      this.pa_key++ // 参数设置
      this.mu_key++ // 多功能
      this.un_key++
    },
    switchUnit(flag) { // 切换上下单元 flag=true上一个
      const infos = JSON.parse(sessionStorage.getItem('piggeryInfos'))
      const curIndex = this.unitList.findIndex(item => item.unitId === this.currentUnitId)
      let willIndex
      if (flag) { // 上一个
        willIndex = curIndex - 1
        this.currentUnitId = this.unitList[willIndex].unitId // 当前 unitId
      } else { // 下一个
        willIndex = curIndex + 1
        this.currentUnitId = this.unitList[willIndex].unitId
      }
      this.overview = this.unitList[willIndex]
      infos.overview = this.unitList[willIndex]
      sessionStorage.setItem('piggeryInfos', JSON.stringify(infos)) // 重新存入
      // 这里 刷新页面
      this.refreshKey()
    },
    init() {
      const infos = JSON.parse(sessionStorage.getItem('piggeryInfos'))
      this.overview = infos.overview
      this.selectedOption = infos.selectedOption
      this.selectedLabel = infos.selectedLabel
      this.unitList = infos.currentDeviceList
      this.currentUnitId = infos.overview.unitId
    },
    handleClick(tab, event) {
      this.activeName = tab.name
    },
    alarmInfo(v) {
      if (v) {
        this.equiment_info.deviceVersion = v.data.deviceVersion || null
      }
    }
  }
}
</script>

<style lang="scss">
.area-container {
  overflow: hidden;
}
.area-container-nav {
  color: #f4f7ff;
  margin-bottom: 7px;
  // position: fixed;
  // top: 110px;
  // width: calc(100% - 320px);
  &-l {
    min-width: 285px;
    @include font_color('mainFontColor2');
    font-family: SourceHanSansCN-Medium;
    font-size: 18px;
    // height: 30px;
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
}
.area-container-carrier {
  min-height: calc(100vh - 212px);
    max-height: calc(100vh - 212px);
    overflow-x: hidden;
    overflow-y: auto;
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

