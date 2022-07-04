<template>
  <div class="container ddd-container">
    <!-- 单元信息 -->
    <div class="container-row container-row1">
      <div v-loading="loadingPig" class="container-col1 container-marginTop2">
        <div class="container-title">单元基础信息（{{ hoggeryTypeName }}）</div>
        <div class="container-carrier1 overfolw">
          <div
            v-for="(i) in unitInfo"
            :key="i.name"
            class="container-carrier1-row"
            style="flex: 1;"
          >
            <div style="width:40px;height:40px;border-radius: 50px;background: #162559;display:flex;align-items:center;justify-content:center;">
              <img v-if="i.name === '母猪孕龄' || i.name === '仔猪日龄' || i.name === '猪日龄'" src="@/assets/image/unitStatus/equipment-riling.svg">
              <img v-if="i.name === '装猪数量'" src="@/assets/image/unitStatus/equipment-shuliang.svg">
              <img v-if="i.name === '单猪体重' || i.name === '母猪体重'" src="@/assets/image/unitStatus/equipment-tizhong.svg">
              <img v-if="i.name === '饲养员'" src="@/assets/image/unitStatus/breederName.svg">
              <img v-if="i.name === '工号'" src="@/assets/image/unitStatus/breederNumber.svg">
              <img v-if="i.name === '母猪胎次'" src="@/assets/image/unitStatus/equipment-taici.svg">
            </div>
            <div class="container-carrier1-row-r">
              <p style="text-align:left;padding-left:16px;font-size: 14px;">{{ i.name }}</p>
              <p style="text-align:left;padding-left:16px;">{{ i.number }}<span>{{ i.company }}</span></p>
            </div>
          </div>
        </div>
      </div>
      <!-- 天气状况 -->
      <!-- <div v-loading="loadingWeather" class="container-col3 container-marginTop2">
        <div class="container-title">天气状况</div>
        <div v-show="weatherList.length === 0" class="no-data-img"><img src="@/assets/image/page/noData.png"></div>

        <div class="container-carrier2 overfolw">
          <div v-for="(i, index) in weatherList" :key="index" class="container-carrier-col">
            <div class="container-carrier-col-title">{{ i.newDay }} （{{ i.date }}）</div>
            <div class="container-carrier-col-body">
              <p class="container-carrier-col-body-weather">{{ i.weather }}</p>
              <img class="container-carrier-col-body-weather-img" :src="i.weatherImg">
              <div class="container-carrier2-row">
                <div class="container-carrier2-row-l">
                  <img src="@/assets/image/unitStatus/weather-wendu.svg">
                  温度
                </div>
                <div class="container-carrier2-row-r">{{ i.hightemp || '-' }}°<span>/{{ i.lowertemp || '-' }}°</span></div>
              </div>
              <div class="container-carrier2-row">
                <div class="container-carrier2-row-l">
                  <img src="@/assets/image/unitStatus/weather-fengli.svg">
                  风力
                </div>
                <div class="container-carrier2-row-r">{{ i.windlevel || '-级' }}</div>
              </div>
              <div class="container-carrier2-row">
                <div class="container-carrier2-row-l">
                  <img src="@/assets/image/unitStatus/weather-shidu.svg">
                  湿度
                </div>
                <div class="container-carrier2-row-r">{{ i.humidity || '-' }}%</div>
              </div>

            </div>
          </div>
          <div class="container-carrier2-width" />
        </div>

      </div> -->
    </div>

    <!-- 设备状态 -->
    <!-- 猪舍环境数据 -->
    <div class="container-row container-marginTop1 container-row3">
      <div class="container-head">
        设备状态（{{ info.overview.statusOnline === 1 ? '在线' : '离线' }}）
        <button class="btn-blue buttons2 container-head-r2" @click="refresh">当前状态</button>
        <span class="container-head-r">数据上报时间：{{ uploadTime }}</span>
      </div>
      <div v-loading="loadingInfo" class="container-carrier3 overfolw">
        <div v-for="(i, index) in equipmentList" :key="index" class="container-carrier3-col">
          <div class="container-title">
            <span>{{ i.position }}</span>
            <!-- 传感器 -->
            <div class="container-carrier3-surface">
              <suspension v-if="i.mask" type="sensing-off" title="温湿度传感器" value="开启" />
              <suspension v-else type="sensing-on" title="温湿度传感器" value="屏蔽" />
            </div>
          </div>
          <div class="container-carrier3-col-main">
            <div class="container-carrier3-col-main-div">
              <div class="container-carrier3-col-main-div-body">
                <div class="container-carrier3-col-main-div-body-div1">
                  <img src="@/assets/image/unitStatus/wendu100.png">
                </div>
                <div class="container-carrier3-col-main-div-body-div2">
                  <div>温度</div>
                  <span>{{ i.temperature === -100 ? '-' : i.temperature }}</span>
                  <i>°C</i>
                </div>
              </div>
            </div>
            <div class="container-carrier3-col-main-div">
              <div class="container-carrier3-col-main-div-body">
                <div class="container-carrier3-col-main-div-body-div1">
                  <img src="@/assets/image/unitStatus/shidu100.png">
                </div>
                <div class="container-carrier3-col-main-div-body-div2">
                  <div>湿度</div>
                  <span>{{ i.humidity === -100 ? '-' : i.humidity }}</span>
                  <i>%</i>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- 设备运行状态 -->
    <div v-loading="openIconLoading" class="container-row container-marginTop2">
      <div class="container-col2">
        <div class="container-title">设备运行状态</div>
      </div>
      <div class="status_box">
        <div v-for="item in equipmentStatusList" :key="item.tag" class="status_item" @mouseenter="alarmInfoShow(item)">
          <div class="img_box" :style="{ borderColor:oneData[item.tag]?item.aColor:'#9EB6FB'}">
            <suspensionAlarm v-if="item.name === '警灯'" :info="equipmentAlarmDetails" />
            <i class="iconfont" :style="{ color:oneData[item.tag]?item.aColor:'#9EB6FB'}">{{ item.icon }}</i>
          </div>
          <p :style="{ color:oneData[item.tag]?item.aColor:'#9EB6FB'}">{{ item.name }}</p>
        </div>
      </div>
    </div>

    <!-- 数据统计图 -->
    <div class="container-row chart_container">
      <div class="container-col2">
        <div class="container-title">数据统计图</div>
      </div>
      <div class="top">
        <div class="tab wd" :class="{active: curChartIndex === 0}" @click="curChartIndex = 0">温度数据图</div>
        <div class="tab sd" :class="{active: curChartIndex === 1}" @click="curChartIndex = 1">湿度数据图</div>
        <div class="container-carrier-dates">
          <div v-hasAuth="'PiggeryDeviceOverview:exportV1'" v-loading="exportLoading" class="container-carrier-export" @click="exportData">
            <!-- <el-tooltip class="" effect="dark" content="导出" placement="top-start">
              <img src="@/assets/image/export.png">
            </el-tooltip> -->
            <el-button class="btn-blue">
              <svg-icon icon-class="newExport" />
              导出
            </el-button>
          </div>
          <nav-form
            ref="navForm"
            class="container-carrier-date"
            style="margin-bottom:30px;"
            :data="navFormInfo.data"
            :field-list="navFormInfo.fieldList"
            @dateTimeChange="dateTimeChange"
          />
        </div>
      </div>
      <div v-loading="chartLoading" style="position:relative;height:460px;overflow:hidden;">
        <div v-show="chartDataList.length === 0" class="no-data-img">
          <img :src="noData | noDataFile('noData', 'svg')">
        </div>
        <div ref="tempChart" class="chart_box" />
      </div>
    </div>
    <exportV1 :dialog-visible="dialogVisible" :element="exportObj.element" :refresh-element="exportObj.refreshElement" :params="exportObj.params" @closeDiaglog="closeDiaglog" />
  </div>
</template>

<script>
// const colors = ['#e3e3e3', '#e5e5e5', '#e2e2e2']
const openIconList = [
  { icon: '\ue615',
    tag: 'isOpenShower1',
    name: '喷淋1',
    aColor: '#0AD69B'
  },
  { icon: '\ue615',
    tag: 'isOpenShower2',
    name: '喷淋2',
    aColor: '#0AD69B'
  },
  // { icon: '\ue615',
  //   tag: 'isOpenShower3',
  //   name: '喷淋3',
  //   aColor: '#0AD69B'
  // },
  // { icon: '\ue615',
  //   tag: 'isOpenShower4',
  //   name: '喷淋4',
  //   aColor: '#0AD69B'
  // },
  { icon: '\ue60e',
    tag: 'isOpenAlarmLight',
    name: '警灯',
    aColor: '#FF2727'
  },
  { icon: '\ue614',
    tag: 'isOpenAlarmBell',
    name: '警铃',
    aColor: '#FF2727'
  },
  {
    icon: '\ue611',
    tag: 'isOpenFeed1',
    name: '饲喂',
    aColor: '#0AD69B'
  },
  {
    icon: '\ue603',
    tag: 'isOpenHumid',
    name: '雾化盘',
    aColor: '#0AD69B'
  }]
const horrgeyTypeList = [
  '未知',
  '保育舍',
  '育肥舍',
  '一体舍',
  '哺乳舍',
  '怀孕舍',
  '后备舍',
  '公猪舍',
  '待配舍'
]
import {
  getListWeather,
  getPigOneInfo,
  alarmInfo,
  getPigUnit,
  getPeriodData
} from '@/http/api/piggeryDeviceOverview'
import weatherService from '@/lib/service/weather-service'
import navForm from '@/components/commonComponent/navForm/index.vue'
import suspension from '@/components/suspension'
import suspensionAlarm from '@/components/suspensionAlarm'
// import { downloadBlob } from '@/http/api/exportData/export'
import exportV1 from '@/components/exportV1'
import feedMixin from '@/utils/mixin'

export default {
  name: 'UnitMonitoring',
  components: {
    navForm,
    suspension,
    suspensionAlarm,
    exportV1
  },
  mixins: [feedMixin],
  props: {
    info1: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      noData: '',
      // 当前时间
      currentTime: '',
      uploadTime: '-',
      testInterval: null,
      // 切换图标状态
      chartStatus: 'temperature',
      lineDate: null,
      hoggeryTypeName: '未知',
      unitInfo: [
        {
          number: '-',
          name: '猪日龄',
          position: 'left',
          company: '天'
        },
        {
          number: '-',
          name: '装猪数量',
          position: 'top',
          company: '头'
        },
        {
          number: '-',
          name: '单猪体重',
          position: 'right',
          company: 'kg'
        },
        {
          number: '-',
          name: '饲养员',
          position: 'right',
          company: ''
        },
        {
          number: '-',
          name: '工号',
          position: 'right',
          company: ''
        }
      ],
      weatherList: [
        // {
        //   day: '',
        //   date: '今天（周六）',
        //   weather: '阴转晴',
        //   weatherImg: require('@/assets/image/weather/duoyun.svg'),
        //   wind: '16',
        //   windlevel: '<3',
        //   winddirection: '东北风',
        //   hightemp: '26',
        //   lowertemp: '18',
        //   humidity: '78'
        // }
      ],
      equipmentList: [
        {
          position: '室内',
          temperature: '-',
          temperatureDiffer: '-',
          humidity: '-',
          humidityDiffer: '-',
          type: '1',
          sensing: '',
          signal: '0',
          voltage: '0'
        },
        {
          position: '室外',
          temperature: '-',
          temperatureDiffer: '-',
          humidity: '-',
          humidityDiffer: '-',
          type: '1',
          sensing: '',
          signal: '0',
          voltage: '0'
        }
      ],
      // 设备列表
      // equipmentList:[],
      // status： 1-在线 2-离线
      equipmentStatusList: openIconList,
      // 设备ID
      equipmentDeviceId: null,
      lineEchartsList: [],
      showEcharysList: null,
      echartsResize: null,
      navFormInfo: {
        // zheli时间往前推4个小时
        data: { time: [this.getCurrentTime((new Date()).getTime() - 1000 * 60 * 60 * 4), this.getCurrentTime('')] },
        fieldList: {
          left: {
            inpLists: [
              {
                key: 'time',
                type: 'dateTime',
                className: 'shadow',
                dateType: 'datetimerange',
                startPlaceholder: '开始时间',
                endPlaceholder: '结束时间'
              }
            ]
          }
        }
      },
      loadingInfo: true,
      loadingEchart: true,
      loadingWeather: true,
      loadingPig: true,
      info: {},
      oneData: {},
      openIconLoading: false, // 设备运行状态loading
      equipmentAlarmDetails: [], // 警告列表
      myChartDOM: null,
      curChartIndex: 0,
      chartLoading: false,
      chartDataList: [],
      exportLoading: false, // 导出的loading
      dialogVisible: false, // 控制导出的 dialog
      exportObj: { // 导出需要传 的对象
        element: {},
        params: {}
      }
    }
  },
  computed: {
    allStyles() {
      return this.$store.state.echartStyle.allStyles
    }
  },
  watch: {
    'allStyles.flag'(newValue, oldValue) {
      this.initChart('t') // 自己绘制echarts的方法
    },
    curChartIndex(val) {
      const v = val === 0 ? 't' : 'h'
      console.log('v', v)
      this.initChart(v)
    }
  },
  created() {
    // console.log('this.$store---', this.$store)
    if (this.$store.state.app.fullScreen) { // 全屏置 非全屏
      console.log('00000000000000000')
      this.$store.dispatch('checkFullScreen')
    }
    this.info = JSON.parse(sessionStorage.getItem('piggeryInfos'))
  },
  mounted() {
    const DOM = this.$refs.tempChart
    this.myChartDOM = this.$echarts.init(DOM)
    this.initdate()
    this.currentTime = this.getCurrentTime('')
    this.init()
  },
  methods: {
    closeDiaglog() {
      this.dialogVisible = false
    },
    exportData() {
      const params = {
        channel: this.info.overview.channel,
        deviceId: this.info.overview.deviceId,
        startTime: this.navFormInfo.data.time[0],
        endTime: this.navFormInfo.data.time[1]
      }
      // this.exportLoading = true
      // downloadBlob('/api/unit_evc/myPiggeryShower/export', o).then(res => {
      //   // this.$message.success('导出成功')
      //   this.exportLoading = false
      // }).catch(() => {
      //   this.exportLoading = false
      //   this.$message.error('导出失败')
      // })
      // const instance = this.$confirm('文件生成中，请耐心等待', '提示', { // el-message-box
      //   showConfirmButton: false,
      //   showCancelButton: false,
      //   center: true,
      //   // confirmButtonText: '确定',
      //   // confirmButtonClass: 'btn-blue btn-blue-confirm',
      //   // cancelButtonText: '取消',
      //   type: 'warning'
      // })
      // console.log('instance---', instance)
      const pageElement = this.$getConfigElement('PiggeryDeviceOverview')
      const element = pageElement['exportV1'] // 新导出
      const refreshElement = pageElement['fileUrl'] // 刷新看有无生成
      this.exportObj = {
        element,
        params,
        refreshElement
      }
      this.dialogVisible = true
    },
    alarmInfoShow(item) {
      if (item.name === '警灯') {
        this.getalarmInfo()
      }
    },
    // 告警详情
    async getalarmInfo() {
      const data = {
        channel: this.info.overview.channel,
        deviceId: this.info.overview.deviceId,
        deviceName: this.info.overview.deviceName
      }
      await alarmInfo(data).then(res => {
        if (res && res.status === 200) {
          this.equipmentAlarmDetails = res.data.rows
        }
      })
    },
    init() {
      if (this.info && this.info.overview && this.info.selectedOption) {
        this.getPigInfo()
        this.getPigDay()
        // this.getWeatherData()
        this.getChartData()
        const o = {
          fieldId: this.info.overview.fieldId,
          segmentId: this.info.overview.segmentId,
          unitId: this.info.overview.unitId
        }
        this.getFeedList(o)
      } else {
        this.$message.error('信息丢失，请重选单元')
        this.loadingInfo = false
        this.loadingEchart = false
        this.loadingWeather = false
        this.loadingPig = false
      }
    },
    refresh() {
      if (this.info && this.info.overview && this.info.selectedOption) {
        this.getPigInfo()
        // this.getWeatherData()
        this.getPigDay()
        this.getChartData()
        const o = {
          fieldId: this.info.overview.fieldId,
          segmentId: this.info.overview.segmentId,
          unitId: this.info.overview.unitId
        }
        this.getFeedList(o)
      } else {
        console.error('信息丢失，请重选单元')
      }
    },
    getChartData() {
      const o = {
        channel: this.info.overview.channel,
        deviceId: this.info.overview.deviceId,
        startTime: this.navFormInfo.data.time[0],
        endTime: this.navFormInfo.data.time[1]
      }
      this.chartLoading = true
      getPeriodData(o).then(res => {
        this.chartLoading = false
        if (res && res.status === 200 && res.rel === true) {
          this.chartDataList = res.data
          this.$nextTick(() => {
            this.initChart('t')
          })
        } else {
          // this.$message.error(res.message)
        }
      }).catch(() => { this.chartLoading = false })
    },
    initdate() {
      if (!this.navFormInfo.data.time || this.navFormInfo.data.time.length === 0) {
        this.navFormInfo.data.time = [this.getCurrentTime((new Date()).getTime() - 1000 * 60 * 60 * 24), this.getCurrentTime('')]
      }
    },
    dateTimeChange(event) {
      this.getChartData()
    },
    // 获取当前时间
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
    // 几天后的日期
    nDate(aa) {
      const date1 = new Date()
      const date2 = new Date(date1)
      date2.setDate(date1.getDate() + aa)
      const time2 = date2.getFullYear() + '-' + (date2.getMonth() + 1) + '-' + date2.getDate()
      return time2
    },
    // 获取星期
    getWeek(dateString) {
      const dateArray = dateString.split('-')
      const date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2])
      return '周' + '日一二三四五六'.charAt(date.getDay())
    },
    // 天气信息
    async getWeatherData() {
      this.loadingWeather = true
      const data = {
        endDay: this.nDate(5),
        fieldId: this.info.selectedOption[2],
        startDay: this.currentTime.split(' ')[0]
      }
      await getListWeather(data).then((res) => {
        this.loadingWeather = false
        if (res && res.status === 200 && res.data) {
          const arr = JSON.parse(JSON.stringify(res.data.rows))
          for (const i of arr) {
            i.weatherImg = weatherService.getWeatherImg(i.weather)
            i.date = this.getWeek(i.day)
            i.newDay = i.day.split('-')[1] + '月' + i.day.split('-')[2]
          }
          arr[0].newDay = '今天'
          this.weatherList = arr
        } else {
          // this.$message({ message: res.message, type: 'warning' })
        }
      }).catch(() => {
        this.loadingWeather = false
      })
    },
    // 猪舍日龄
    async getPigDay() {
      this.loadingPig = true
      let routeUnit = ''
      if (this.info.overview.unit) {
        routeUnit = this.info.overview.unit
      } else {
        routeUnit = this.info.overview.unitName
      }
      const data = {
        fieldId: this.info.selectedOption[2],
        segmentId: this.info.overview.segmentId,
        unit: routeUnit
      }
      await getPigUnit(data).then((res) => {
        this.loadingPig = false
        if (res && res.status === 200 && res.rel && res.data) {
          const { hoggeryType, pigDays, pigCount, weight, batchNo } = res.data
          // 猪舍类型
          this.hoggeryTypeName = horrgeyTypeList[hoggeryType] || '未知'
          // 日龄
          this.unitInfo[0].number = (pigDays === undefined || pigDays === null) ? '-' : pigDays
          if (hoggeryType === 5) { // 怀孕
            this.unitInfo[0].name = '母猪孕龄'
            this.unitInfo[2].name = '母猪体重'
          } else if (hoggeryType === 4) { // 哺乳
            this.unitInfo[0].name = '仔猪日龄'
          } else {
            this.unitInfo[0].name = '猪日龄'
          }
          this.unitInfo[1].number = (pigCount === undefined || pigCount === null) ? '-' : pigCount
          this.unitInfo[2].number = (weight === undefined || weight === null) ? '-' : weight
          console.log('hoggeryType---', hoggeryType)
          if (hoggeryType === 5 || hoggeryType === 4) { // 怀孕/哺乳
            const flag = this.unitInfo.findIndex(item => {
              return item.name === '母猪胎次'
            })
            if (flag > -1) {
              this.unitInfo.splice(3, 1, {
                number: (batchNo === undefined || batchNo === null) ? '-' : batchNo,
                name: '母猪胎次',
                position: 'right',
                company: '次'
              })
            } else {
              this.unitInfo.splice(3, 0, {
                number: (batchNo === undefined || batchNo === null) ? '-' : batchNo,
                name: '母猪胎次',
                position: 'right',
                company: '次'
              })
            }
          }
          // console.log('this.unitInfo', this.unitInfo)
        } else {
          console.log('获取不到猪只信息')
        }
      }).catch(() => {
        this.loadingPig = false
      })
    },
    // 猪舍信息
    async getPigInfo() {
      this.loadingInfo = true
      let routeUnit = ''
      if (this.info.overview.unit) {
        routeUnit = this.info.overview.unit
      } else {
        routeUnit = this.info.overview.unitName
      }
      const data = {
        regionId: this.info.selectedOption[0],
        areaId: this.info.selectedOption[1],
        fieldId: this.info.selectedOption[2],
        segmentId: this.info.overview.segmentId,
        unit: routeUnit
      }
      this.openIconLoading = true
      this.loadingInfo = true
      await getPigOneInfo(data).then((res) => {
        this.openIconLoading = false
        this.loadingInfo = false
        if (res && res.status === 200 && res.data) {
          // this.$emit('childrenInfo', res)
          this.oneData = res.data
          this.handlePigInfo(res)
        } else {
          // this.$message.error(res.message)
        }
      }).catch(() => {
        this.openIconLoading = false
      })
    },
    valueNull(value, type) {
      if (value === null || value === -100) {
        return '-'
      } else {
        return value + (!type ? '℃' : '%')
      }
    },
    initChart(chartTab) { // list 为原始数据
      if (chartTab === 't') this.curChartIndex = 0
      const list = this.chartDataList
      console.log('list', list)
      const temperatureList = [] // 温度数组
      const humidityList = [] // 湿度数组
      const open1List = [] // 喷淋1状态数组
      const open2List = []
      const open3List = []
      const open4List = []
      const xData = [] // 横轴 时间数组
      list.map(item => {
        temperatureList.push({ ...item, name: '设备温度', value: item.temperature === -100 ? null : item.temperature })
        humidityList.push({ ...item, name: '设备湿度', value: item.humidity === -100 ? null : item.humidity })
        open1List.push({ ...item, value: item.isOpenShower1 })
        open2List.push({ ...item, value: item.isOpenShower2 })
        open3List.push({ ...item, value: item.isOpenShower3 })
        open4List.push({ ...item, value: item.isOpenShower4 })
        const temp = {
          value: item.timeStr,
          textStyle: {
            color: this.allStyles.xAxisName
          }
        }
        xData.push(temp)
      })
      const objTemp = {
        t: {
          name: '温度',
          temperatureList
        },
        h: {
          name: '湿度',
          humidityList
        }
      }
      const legendData = [
        {
          name: '喷淋1状态',
          textStyle: {
            color: '#7894E3'
          }
        },
        {
          name: '喷淋2状态',
          textStyle: {
            color: '#7894E3'
          }
        }
      ]
      const lineOptions = {
        tooltip: {
          trigger: 'axis',
          formatter: params => {
            // console.log('params---', params)
            let str = params[0].axisValue + '<br/>'
            params.forEach(item => {
              if (item.seriesName === '温度') {
                str += '设备温度: ' + this.valueNull(item.value, 0) + '<br>'
              }
              if (item.seriesName === '湿度') {
                str += '设备湿度: ' + this.valueNull(item.value, 1) + '<br>'
              }
              if (item.seriesName !== '温度' && item.seriesName !== '湿度') {
                str += item.seriesName + ': ' + item.value + '<br>'
              }
            })
            // console.log('str---', str)
            return str
          }
        },
        dataZoom: [{
          type: 'inside',
          disabled: false
        }],
        legend: {
          data: legendData,
          textStyle: {}
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: false, readOnly: true },
            magicType: { show: false, type: ['line', 'bar', 'stack', 'tiled'] },
            restore: { show: false },
            saveAsImage: { show: false }
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: xData,
            nameTextStyle: {
              color: '#CDD8F7'
            },
            axisLabel: {
              // interval: parseInt(xData.length / 20), // interval为x轴两相邻数据之间所包含数据条数
              show: true,
              textStyle: {
                color: '#a9a9a9' // 更改坐标轴文字颜色
                // fontSize: 8 // 更改坐标轴文字大小
              },
              rotate: 40,
              formatter(value, index) {
                return index % 2 === 1 ? null : value.substring(5, 16)
              }
            },
            axisLine: {
              lineStyle: {}
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: chartTab === 't' ? '温度(℃)' : '湿度(%)',
            // min: chartTab === 't' ? objTemp.t.minTemperature : objTemp.h.minHumidity,
            // max: chartTab === 't' ? objTemp.t.maxTemperature : objTemp.h.maxHumidity,
            position: 'left',
            axisLine: {
              lineStyle: {
                color: '#CDD8F7'
              }
            },
            axisLabel: {
              formatter: chartTab === 't' ? '{value}℃' : '{value}%',
              textStyle: {}
            },
            nameTextStyle: {},
            scale: true,
            splitLine: { lineStyle: { color: ['#3E477F'] }}
          },
          {
            type: 'value',
            name: '喷淋状态',
            min: 0,
            max: 1,
            splitNumber: 1,
            position: 'right',
            offset: 20,
            axisLine: {
              lineStyle: {
                color: '#CDD8F7'
              }
            },
            axisLabel: {
              textStyle: {}
            },
            nameTextStyle: {},
            splitLine: { // 网格线
              show: true,
              lineStyle: {
                // 使用深浅的间隔色
                color: ['#2F3872']
              }
            }
          }
        ],
        series: [
          // color: ['#FF2727', '#48E0F4', '#43F354', '#385BFF', '#945FB9', '#1F9493' ],
          {
            name: chartTab === 't' ? objTemp.t.name : objTemp.h.name,
            type: 'line',
            yAxisIndex: 0,
            smooth: true,
            itemStyle: { color: '#FF2727' },
            data: chartTab === 't' ? objTemp.t.temperatureList : objTemp.h.humidityList
          },
          {
            name: '喷淋1状态',
            type: 'line',
            yAxisIndex: 1,
            smooth: true,
            itemStyle: { color: '#1F9493', normal: { areaStyle: { type: 'default' }}},
            data: open1List
          },
          {
            name: '喷淋2状态',
            type: 'line',
            yAxisIndex: 1,
            smooth: true,
            itemStyle: { color: '#43F354', normal: { areaStyle: { type: 'default' }}},
            data: open2List
          }
        ]
      }
      console.log('lineOptions--------', lineOptions)
      lineOptions.xAxis[0].axisLine.lineStyle.color = this.allStyles.xAxisColor
      lineOptions.xAxis[0].axisLabel.textStyle.color = this.allStyles.xAxisName //  #FF3939
      lineOptions.legend.textStyle.color = this.allStyles.xAxisName
      lineOptions.yAxis[0].axisLine.lineStyle.color = this.allStyles.yAxisColor
      lineOptions.yAxis[0].axisLabel.textStyle.color = this.allStyles.yAxisName
      lineOptions.yAxis[0].nameTextStyle.color = this.allStyles.yAxisName
      lineOptions.yAxis[0].splitLine.lineStyle.color = this.allStylineOptions
      lineOptions.yAxis[1].axisLine.lineStyle.color = this.allStyles.yAxisColor
      lineOptions.yAxis[1].axisLabel.textStyle.color = this.allStyles.yAxisName
      lineOptions.yAxis[1].nameTextStyle.color = this.allStyles.yAxisName
      console.log('lineOptions', lineOptions)
      this.myChartDOM.setOption(lineOptions, true)
      // 浏览器窗口变化随之适配
      window.onresize = () => {
        clearTimeout(this.echartsResize)
        this.echartsResize = setTimeout(() => {
          this.myChartDOM.resize()
        }, 1000)
      }
    },
    // 处理猪舍信息
    handlePigInfo(res) {
      const data = JSON.parse(JSON.stringify(res.data))
      console.log('处理猪舍信息---', data)
      // 设备ID
      this.equipmentDeviceId = data.deviceId || null
      // this.getalarmInfo()
      // 数据上报时间
      this.uploadTime = data.timeStr || '-'
      // 室内前
      this.equipmentList[0].temperature = data.temperature || '-'
      this.equipmentList[0].humidity = data.humidity || '-'
      this.equipmentList[0].mask = data.mask // mask未1 开启 0 屏蔽
      this.equipmentList[1].temperature = data.temperatureOutDoor || '-'
      this.equipmentList[1].humidity = data.humidityOutDoor || '-'
      this.equipmentList[1].mask = data.maskOutDoor || '-'
    }
  }
}
</script>
<style lang="scss">
.ddd-container .container-carrier3-surface-row-tl{
  left: -490%;
  // @include font_color('inPigFontColor2');
}
</style>
<style lang="scss" scoped>
.container {
  margin: 0 1.6%;
  margin-bottom: 20px;
}
.container-row {
  color: #cdd8f7;
}
.container-marginTop1 {
  margin-top: 30px;
}
.container-marginTop2 {
  margin-top: 20px;
}
.container-marginTop2,
.container-carrier3-col{
  // background-image: linear-gradient(225deg, rgba(43,60,122,0.50) 0%, rgba(28,42,110,0.50) 100%);
  @include background_image('inPigBackGroundImage');
  @include background_color('inPigBackGroundColor4');
  border: 1px solid;
  @include border_color('inPigBorderColor2');
  border-radius: 4px;
}
.container-row1 {
  display: flex;
}
.container-row3{
  position: relative;
  .container-head{
    width: 100%;
    position: absolute;
    left: 0;
    height: 27px;
    line-height: 27px;
  }
}
.container-col1 {
  width: 100%;
  // width: 340px;
  // min-width: 340px;
  // margin-right: 20px;
}
.container-col2 {
  flex: 3;
}
.container-col3 {
  flex: 1;
  overflow: hidden;
}
.container-col4 {
  min-width: 300px;
  flex: 1;
  overflow: hidden;
}
.container-head {
  font-size: 16px;
  color: #F4F7FF;
  &-r{
    float: right;
    font-size: 12px;
  }
  &-r2{
    float: right;
    // position: relative;
    // top: -3px;
  }
  &-img {
    position: relative;
    top: 2px;
  }
}
.container-title {
  padding: 10px 0;
  padding-left: 20px;
  font-family: SourceHanSansCN-Normal;
  font-size: 14px;
  // color: #FFFFFF;
  @include font_color('inPigFontColor');
  border-bottom: 1px solid;
  @include border_color('inPigBorderColor2');
  &-r {
    float: right;
  }
  &-button {
    margin-left: 10px;
  }
}
.container-carrier {
  margin-top: 13px;
  &-col:last-of-type{
    margin-right: 20px;
  }
  &-col {
    flex: 1;
    margin-left: 20px;
    margin-bottom: 20px;
    min-width: 206px;
    &-title {
      font-family: SourceHanSansCN-Normal;
      font-size: 12px;
      color: #CDD8F7;
      margin: 18px 0 8px 0;
    }
    &-body {
      height: calc(100% - 42px);
      background: #1F316E;
      border: 1px solid #2F3872;
      border-radius: 4px;
      text-align: center;
      &-weather {
        margin: 10px 0;
        font-size: 12px;
        color: #cdd8f7;
        line-height: 24px;
        &-img{
          height: 42px;
        }
      }
    }
  }
}
.container-carrier1 {
  // height: 299px;
  padding-bottom: 10px;
  display: flex;
  justify-content: space-around;
  height: 80px;
  overflow: auto;
  &-row{
    margin: 0 20px;
    margin-top: 10px;
    height: 60px;
    // background: #1F316E;
    @include background_color('inPigBackGroundColor6');
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    &-l{
      flex: 1;
      font-family: SourceHanSansCN-Normal;
      font-size: 14px;
      color: #CDD8F7;
      position: relative;
      padding-left: 60px;
      &-icon{
        position: absolute;
        left: 0;
        top: 50%;
        transform: translate(0%, -50%);
        width: 40px;
        height: 40px;
        border-radius: 50px;
        // background: #162559;
        @include background('viewBackGround9');
        img{
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
    &-r{
      flex: 1;
      text-align: right;
      font-family: DINAlternate-Bold;
      font-size: 20px;
      // color: #FFFFFF;
      @include font_color('inPigFontColor1');
      span{
        font-family: PingFangSC-Regular;
        font-size: 12px;
        // color: #CDD8F7;
        @include font_color('inPigFontColor1');
      }
    }
  }
}
// .container-carrier2Flow{
//   overflow-x: scroll;
//   overflow-y: hidden;
// }
.container-carrier2-width{
  width: 20px;
  flex-shrink: 0;
}
.container-carrier2 {
  overflow-x: scroll;
  overflow-y: hidden;
  width: 100%;
  display: flex;
  height: calc( 100% - 40px);
  &-row{
    margin: 0 20px;
    margin-top: 10px;
    height: 40px;
    display: flex;
    align-items: center;
    text-align: left;
    &-l{
      flex: 1;
      font-family: SourceHanSansCN-Normal;
      font-size: 12px;
      color: #0E759F;
      position: relative;
      padding-left: 20px;
      img{
        height: 16px;
        position: absolute;
        left: 0%;
        top: 0%;
      }
    }
    &-r{
      flex: 1;
      text-align: right;
      font-family: DINAlternate-Bold;
      font-size: 20px;
      color: #1FBFFF;
      span{
        font-family: PingFangSC-Regular;
        font-size: 12px;
      }
    }
  }
}
.container-carrier3 {
  overflow-y: hidden;
  overflow-x: scroll;
  display: flex;
  padding-top: 40px;

  &-surface{
    position: absolute;
    top: 8px;
    right: 0;
  }
  &-col:first-child {
    margin-left: 0;
  }
  &-col {
    min-width: 300px;
    margin-left: 20px;
    flex: 1;
    position: relative;
    min-height: 200px;
    &-fixed {
      position: absolute;
      top: 10px;
      left: 10px;
      font-size: 12px;
      color: #ffffff;
      border-radius: 2px;
      padding: 2px 4px;
    }
    &-main {display:flex;margin-top: 46px;
      &-div {
        width: 400px;
        display: flex;align-items: center;justify-content: center;
        margin: 0 30px;
        border-right: 1px solid #252F6E;
        @include border_color('treeCheckBoxBorderColor');
        &-body {
          display: flex;
          &-div1 {
            flex: 1;
            position: relative;
            padding:0 20px 0 46px;
            img {
              position: absolute;
              top: 50%;
              left: 0%;
              transform: translate(0%, -50%);
              width: 50px;
              height: 50px;
            }
          }
          &-div2 {
            div {
              font-size: 16px;
              font-family: SourceHanSansCN, SourceHanSansCN-Normal;
              font-weight: Normal;
              text-align: left;
              color: #8ea0ea;
              margin-bottom: 5px;
            }
            span{
              font-size: 36px;color: #cdd8f7;
            }
          }
          i {
            font-style: normal;
            font-size: 34px;
            font-family: SourceHanSansCN, SourceHanSansCN-Normal;
            font-weight: Normal;
            padding-left: 12px;
          }
          span {
            font-size: 36px;
          }
        }
      }
      &-div:last-of-type{
        border-bottom: none;
      }
      &-div2 {
        height: 80px;
        line-height: 80px;
      }
      &-div2:first-of-type {
        margin-top: 40px;
      }
      &-div2:last-of-type {}
    }
    &-main2{
      margin-top: 66px;
    }
  }

}
.container-carrier4 {
  &-body {
    display: flex;
    flex-flow: wrap;
    // background: palevioletred;
    // justify-content: space-between;
    &-div {
      margin: 15px 5px 15px 30px;
      text-align: center;
      position: relative;
      &-icon {
        font-size: 28px;
      }
      &-icon1 {
        color: #7894E3;
      }
      &-icon2 {
        color: #0AD69B;
      }
      &-border1 {
        border: 1px solid #7894E3;
        // box-shadow: inset 0 0 6px #404f89;
      }
      &-border2 {
        border: 1px solid #0AD69B;
        // box-shadow: inset 0 0 6px #9eb6fb;
      }
      &-border {
        height: 80px;
        width: 80px;
        line-height: 80px;
        margin-bottom: 10px;
        border-radius: 10px;
        font-size: 20px;
        position: relative;
        img {
          position: absolute;
          height: 21px;
          bottom: -2px;
          right: -10px;
        }
      }
      span {
        font-size: 12px;
        color: #CDD8F7;
      }
      &-topl{
        position: absolute;
        top: 4px;
        left: 6px;
        font-weight: 300;
      }
      &-topr{
        position: absolute;
        top: 4px;
        right: 6px;
        font-weight: 300;
      }
    }
    &-divC2{
      span{
        color: #0AD69B;
      }
    }
  }
}
.container-carrier5 {
  // height: 300px;
  height: 356px;
  &-head {
    margin-left: 30px;
  }

  &-chart {
    height: calc(100% - 24px);
    position: relative;
    span{
      position: absolute;
      top: 20px;
      right: 20px;
      color: red;
    }
  }
}
.container-carrier-btn {
  display: inline-block;
  font-size: 12px;
  height: 24px;
  line-height: 24px;
  padding: 0 10px;
  opacity: 0.5;
  background: rgba(9, 30, 64, 0);
  border: 1px solid #7894e3;
  @include font_color('mainFontColor11');
  border-radius: 2px;
  margin-right: 10px;
  margin-top: 12px;
  transition: all 0.5s;
  cursor: pointer;
}
.container-carrier-btn-active {
  background: rgba(9, 30, 64, 0);
  border: 1px solid #1fbfff;
  box-shadow: inset 0 0 10px 0 #217bfc;
  opacity: 1;
}
.container-carrier-export{
  display: inline-block;
  float: right;
  cursor: pointer;
  margin-right: 30px;
  margin-top: 14px;
  img{
    height: 24px;
  }
}
.container-carrier-date {
  display: inline-block;
  float: right;
  margin-top: 15px;
  margin-right: 10px;
}
.container-carrier-dates {
  float: right;
  height: 36px;
  position: relative;
  z-index: 99;
}

.buttons2{
  padding: 5px 10px;
  margin-left: 10px;
}
.status_box{
        // background-color: #192E6C;
        @include background_color('inPigBackGroundColor5');
        border-radius: 4px;
        height: 146px;
        display: flex;align-items: center;
        padding:0 30px;
        .status_item{
          margin-right: 30px;
          .img_box{
            position: relative;
            width: 68px;
            height: 68px;
            display: flex;
            justify-content: center;
            align-items: center;
            padding:17px;
            background: rgba(19,25,54,0);
            border: 1px solid #7894e3;
            border-radius: 14px;
            // box-shadow: 0px 2px 10px 0px #38416d inset, 0px -2px 10px 0px #38416d inset, 2px 0px 2px 0px #38416d inset, -2px 0px 1px 0px #38416d inset;
            @include box_shadow('inPigBoxShadow');
            .iconfont{font-size:30px;color:#9EB6FB;}
          }
          p{
            padding-top:10px;
            font-size: 12px;
            font-family: SourceHanSansCN, SourceHanSansCN-Normal;
            font-weight: Normal;
            text-align: center;
            color: #cdd8f7;
            line-height: 18px;
          }
        }
    }
 .chart_container{
   margin-top:20px;
  //  background-image: linear-gradient(225deg, rgba(43, 60, 122, 0.5) 0%, rgba(28, 42, 110, 0.5) 100%);
    @include background_image('inPigBackGroundImage');
    @include background_color('inPigBackGroundColor4');
    border: 1px solid;
    @include border_color('inPigBorderColor2');
    border-radius: 4px;
   .title {
        height: 56px;
        display: flex;
        align-items: center;
        font-size: 16px;
        font-family: SourceHanSansCN;
        color: #CDD8F7;
        img{width: 16px;margin-right: 6px;}
    }
        .top{
          height: 78px;
          .tab{
            display: inline-block;
            cursor: pointer;
            width: 105px;
            height: 30px;
            opacity: 0.5;
            background: rgba(9,30,64,0);
            border: 1px solid;
            @include border_color('inPigBorderColor3');
            border-radius: 2px;
            font-size: 12px;
            font-family: SourceHanSansCN, SourceHanSansCN-Normal;
            font-weight: Normal;
            text-align: center;
            line-height: 30px;
            color: #7894e3;
            margin-top: 15px;
            margin-left: 20px;
            &.active{
              color: #1fbfff;
              background: rgba(9,30,64,0);
              border: 1px solid #1fbfff!important;
              // box-shadow: 0px 0px 10px 0px #217bfc inset;
              @include box_shadow('inPigBoxShadow1');
            }
          }
          .container-carrier-date{
            float: right;
          }
        }
        .no-data-img{
          height: 482px;
        }
        .chart_box{
          height: 452px;
        }
      }
</style>
