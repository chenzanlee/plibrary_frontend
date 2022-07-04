<template>
  <div class="area-container">
    <!-- head -->
    <div class="area-container-nav">
      <div class="area-container-nav-l">
        {{ overview && overview.fieldName }}-{{
          overview && overview.roomTypeName
        }}{{ overview && (overview.unit || overview.unitName) }}
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
      <div class="area-container-carrier">
        <div class="area-container-carrier-nav">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="状态监控" name="first" />
            <el-tab-pane label="设备控制" name="second">
              <div
                v-if="overview && overview.statusOnline === 0"
                style="height: calc(100vh - 280px);display: flex;
    justify-content: center;
    align-items: center;"
              >
                <img style="height:60%;marginBottom:10%;" src="../../../../../assets/image/status-online.webp" alt="">
              </div>
              <equipment-control v-else />
            </el-tab-pane>
            <el-tab-pane label="参数设置" name="third">
              <parameter-setting
                v-if="progress === 'parameterSetting'"
              />
              <multi-unit v-if="progress === 'multiUnit'" />
              <multi-unit-setting v-if="progress === 'multiUnitSetting'" :key="time" />
              <multi-function-setting v-if="progress === 'multiFunctionSetting'" :key="multiFunctionTime" />
            </el-tab-pane>
          </el-tabs>
        </div>
        <div>
          <unit-monitoring v-if="activeName === 'first'" :info="this.$route.params" @childrenInfo="alarmInfo" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import navForm from '@/components/commonComponent/navForm'
import unitMonitoring from './unitMonitoring.vue'
import equipmentControl from '@/views/IntelligentControl/fieldDeviceOverview/page/subpage/equipmentControl'
import parameterSetting from '@/views/IntelligentControl/fieldDeviceOverview/page/subpage/parameterSetting'
import multiUnit from '@/views/IntelligentControl/fieldDeviceOverview/page/subpage/subordinate/multiUnitSetUp'
import multiUnitSetting from '@/views/IntelligentControl/fieldDeviceOverview/page/subpage/multiUnitSetting'
import multiFunctionSetting from '@/views/IntelligentControl/fieldDeviceOverview/page/subpage/multiFunctionSetting'
import { mapGetters } from 'vuex'
import {
  getDeviceInfoByUnit,
  getPigOneInfo
} from '@/http/api/fieldInfo'
export default {
  components: {
    unitMonitoring,
    // navForm,
    equipmentControl,
    parameterSetting,
    multiUnit,
    multiUnitSetting,
    multiFunctionSetting
  },
  provide() {
    return {
      overviewDetail: this
    }
  },
  data() {
    return {
      time: '',
      multiFunctionTime: '',
      overview: this.$route.params.overview,
      selectedOption: this.$route.params.selectedOption,
      selectedLabel: this.$route.params.selectedLabel,
      progress: 'parameterSetting',
      activeName: 'first',
      head: {
        name: '社旗9场生长场-保育舍10',
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
              this.$route.params.overview &&
              this.$route.params.overview.firmwareVersion
          }
        ]
      },

      equiment_info: {}

    }
  },
  computed: {
    ...mapGetters(['fullScreen']),
    isfullScreen() {
      return this.fullScreen
    }
  },
  created() {
    console.log(this.isfullScreen, '是否全屏')
    if (this.isfullScreen === true) {
      this.$store.dispatch('checkFullScreen')
    }
  },
  mounted() {
    this.init()
    console.log('获取的初始化数据', this.overview)
  },
  methods: {
    handleClick(tab, event) {
      this.activeName = tab.name
    },

    init() {
      // console.log('init', this.$route.params)
      if (this.$route.params && this.$route.params.overview && this.$route.params.selectedOption) {
        this.getEquipmentInfo()
        // this.getPigInfo()
      }
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
      console.log(this.$route.params, '路由传参')
      let routeUnit = ''
      if (this.$route.params.overview.unit) {
        routeUnit = this.$route.params.overview.unit
      } else {
        routeUnit = this.$route.params.overview.unitName
      }
      const data = {
        regionld: this.$route.params.selectedOption[0],
        areaId: this.$route.params.selectedOption[1],
        fieldId: this.$route.params.selectedOption[2],
        segmentId: this.$route.params.overview.segmentId,
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
      if (this.$route.params.overview.unit) {
        routeUnit = this.$route.params.overview.unit
      } else {
        routeUnit = this.$route.params.overview.unitName
      }
      const data = {
        regionld: this.$route.params.selectedOption[0],
        areaId: this.$route.params.selectedOption[1],
        fieldId: this.$route.params.selectedOption[2],
        segmentId: this.$route.params.overview.segmentId,
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
  color: #f4f7ff;
  min-width: 1250px;
  // display: flex;
  &-l {
    // flex: 1;
    min-width: 285px;
    font-family: SourceHanSansCN-Medium;
    display: inline-block;
    font-size: 24px;
    height: 40px;
    line-height: 40px;
  }
  &-r {
    // flex: 10;
    color: #677291;
    font-family: SourceHanSansCN-Normal;
    font-size: 14px;
    line-height: 40px;
    text-align: right;
    // display: inline-block;
    float: right;
    &-row {
      display: inline-block;
    }
    &-row:first-child {
      span {
        border-left: none;
      }
    }
    &-col1 {
      border-left: 1px solid #424f75;
      padding-left: 15px;
    }

    &-col2 {
      padding-right: 15px;
    }
  }
}
.area-container-main {
  margin-top: 15px;
}
.area-container-carrier {
  // min-height: calc(100vh - 260px);
  &-nav {
    margin: 0 1.6%;
  }
  .el-tabs__nav-wrap::after {
    height: 1px !important;
    // background: #1a3166 !important;
    @include background('viewBackGround10');
  }
}
</style>
