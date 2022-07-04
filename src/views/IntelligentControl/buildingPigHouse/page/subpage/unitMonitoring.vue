<template>
  <div class="container">
    <!-- 单元信息 -->
    <div class="container-row container-row1">
      <div v-loading="loadingPig" class="container-col1 container-marginTop2">
        <div class="container-title">单元基础信息 （{{ unitInfo.pigType }}）</div>
        <div class="container-carrier1">
          <template
            v-for="(i, index) in unitInfo.data"
          >
            <div
              v-if="i.status"
              :key="i.name"
              class="container-carrier1-row"
            >
              <div class="container-carrier1-row-l">
                <div class="container-carrier1-row-l-icon">
                  <img v-if="index === 0" src="@/assets/image/unitStatus/equipment-riling.svg">
                  <img v-if="index === 1" src="@/assets/image/unitStatus/equipment-taici.svg">
                  <img v-if="index === 2" src="@/assets/image/unitStatus/equipment-shuliang.svg">
                  <img v-if="index === 3" src="@/assets/image/unitStatus/equipment-tizhong.svg">
                  <img v-if="index === 4" src="@/assets/image/unitStatus/breederName.svg">
                  <img v-if="index === 5" src="@/assets/image/unitStatus/breederNumber.svg">
                </div>
                <div class="content-carrier-wrap">
                  <div> {{ i.name }}</div>
                  <div class="container-carrier1-row-r">{{ i.number }}<span>{{ i.company }}</span></div>
                </div>
              </div>
            </div>
          </template>
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
        设备状态（{{ info.overview.statusOnline===1?'在线':'离线' }}）
        <button class="btn-blue buttons2 container-head-r2" @click="refresh">当前状态</button>
        <span class="container-head-r">数据采集时间：{{ reportTime }}</span>
      </div>
      <div v-loading="loadingInfo" class="container-carrier3  is-scrolling-left">
        <div v-for="(i, index) in equipmentList" :key="index" class="container-carrier3-col" :style="{ minWidth:index<3 ? '300px' : '600px' }">
          <template v-if="index<3">
            <div class="title">{{ i.position }}</div>
            <div class="container-carrier3-col-main">
              <div class="container-carrier3-col-main-div" :class="(i.type !== '1' && i.type !== '2' ? 'container-carrier3-col-main-div2' : '')">
                <div class="container-carrier3-col-main-div-body">
                  <div class="container-carrier3-col-main-div-body-div1">
                    <img src="@/assets/image/unitStatus/equipment-wendu.png">
                    温度
                  </div>
                  <div class="container-carrier3-col-main-div-body-div2">
                    <span>{{ i.temperature === -100 ? '-' : i.temperature }}</span>
                    <i>°C</i>
                  </div>
                </div>
              </div>
              <div class="container-carrier3-col-main-div" :class="(i.type !== '1' && i.type !== '2' ? 'container-carrier3-col-main-div2' : '')">
                <div class="container-carrier3-col-main-div-body">
                  <div class="container-carrier3-col-main-div-body-div1">
                    <img src="@/assets/image/unitStatus/equipment-shidu.png">
                    湿度
                  </div>
                  <div class="container-carrier3-col-main-div-body-div2">
                    <span>{{ i.humidity === -100 ? '-' : i.humidity }}</span>
                    <i>%</i>
                  </div>
                </div>
              </div>
              <div v-if="i.type === '1' || i.type === '2'" class="container-carrier3-col-main-div">
                <div class="container-carrier3-col-main-div-body">
                  <div class="container-carrier3-col-main-div-body-div1">
                    <img src="@/assets/image/unitStatus/equipment-wencha.png">
                    最大温差
                  </div>
                  <div class="container-carrier3-col-main-div-body-div2">
                    <span>{{ i.temperatureDiffer === -100 ? '-' : i.temperatureDiffer }}</span>
                    <i>°C</i>
                  </div>
                </div>
              </div>
              <div v-if="i.type === '1' || i.type === '2'" class="container-carrier3-col-main-div">
                <div class="container-carrier3-col-main-div-body">
                  <div class="container-carrier3-col-main-div-body-div1">
                    <img src="@/assets/image/unitStatus/equipment-shicha.png">
                    最大湿差
                  </div>
                  <div class="container-carrier3-col-main-div-body-div2">
                    <span>{{ i.humidityDiffer === -100 ? '-' : i.humidityDiffer }}</span>
                    <i>%</i>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="title">{{ i.position }}</div>
            <div class="dcy_last_items">
              <div class="dcy_last_item_left">
                <div class="last_item">
                  <div class="">
                    <img src="@/assets/image/unitStatus/equipment-wendu.png">
                    室外温度
                  </div>
                  <div class="">
                    <span>{{ i.outdoorTemp === -100 ? '-' : i.outdoorTemp }}</span>
                    <i>°C</i>
                  </div>
                </div>
                <div class="last_item">
                  <div class="">
                    <img src="@/assets/image/unitStatus/equipment-wendu.png">
                    暖灯温度
                  </div>
                  <div class="">
                    <span>{{ i.heatLampTemp === -100 ? '-' : i.heatLampTemp }}</span>
                    <i>°C</i>
                  </div>
                </div>
                <div class="last_item">
                  <div class="">
                    <img src="@/assets/image/unitStatus/equipment-wendu.png">
                    采用温度
                  </div>
                  <div class="">
                    <span>{{ i.useTemp === -100 ? '-' : i.useTemp }}</span>
                    <i>°C</i>
                  </div>
                </div>
              </div>
              <div class="dcy_last_item_right">
                <div class="last_item">
                  <div class="">
                    <img src="@/assets/image/unitStatus/equipment-shidu.png">
                    室外湿度
                  </div>
                  <div class="">
                    <span>{{ i.outdoorHumidity === -100 ? '-' : i.outdoorHumidity }}</span>
                    <i>%</i>
                  </div>
                </div>
                <div class="last_item">
                  <div class="">
                    <img src="@/assets/image/unitStatus/equipment-shidu.png">
                    暖灯湿度
                  </div>
                  <div class="">
                    <span>{{ i.heatLampHumidity === -100 ? '-' : i.heatLampHumidity }}</span>
                    <i>%</i>
                  </div>
                </div>
                <div class="last_item">
                  <div class="">
                    <img src="@/assets/image/unitStatus/equipment-shidu.png">
                    采用湿度
                  </div>
                  <div class="">
                    <span>{{ i.useHumidity === -100 ? '-' : i.useHumidity }}</span>
                    <i>%</i>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- 设备运行状态 -->
    <div v-loading="loadingInfo" class="container-row container-marginTop2">
      <div class="container-col2">
        <div class="container-title">设备运行状态</div>
      </div>
      <div class="container-carrier container-carrier4">
        <div class="container-carrier4-body">
          <div v-show="equipmentStatusList.length === 0" class="no-data-img"><img :src="noData | noDataFile('noData', 'svg')" style="max-width: 200px;"></div>
          <template v-for="(i, index) in equipmentStatusList" v-show="equipmentStatusList.length > 0">
            <div
              v-if="!i.isShow"
              :key="index"
              class="container-carrier4-body-div"
              :class="i.status ? '':'container-carrier4-body-divC2'"
              @mouseenter="alarmInfoShow(i)"
            >
              <div
                class="container-carrier4-body-div-border"
                :class="i.status ? 'container-carrier4-body-div-border2':'container-carrier4-body-div-border1'"
              >
                <div v-if="i.type === 1" class="container-carrier4-body-div-topl">{{ i.value }}</div>
                <div v-if="i.type === 2" class="container-carrier4-body-div-topl">
                  {{ i.value }}<span v-if="i.value !== '-'" style="font-size: 12px; color: #cdd8f7;">{{ i.unit }}</span>
                </div>
                <template v-else>
                  <suspensionAlarm v-if="i.name === '警铃'" :info="alarmList" />
                  <i
                    class="iconfont container-carrier4-body-div-icon"
                    :class="i.status ? 'container-carrier4-body-div-icon2':'container-carrier4-body-div-icon1'"
                    v-html="i.icon"
                  />
                  <img v-if="i.waring" src="@/assets/image/unitStatus/waring.png">
                </template>
              </div>
              <span :style="{color:i.status?'#0AD69B': '#7894E3'}" :class=" i.type===1 ? 'light_title':''">{{ i.name }}</span>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- 数据统计图 -->
    <div class="container-col4 container-marginTop2">
      <div class="container-row container-row5">
        <div class="container-col2">
          <div class="container-title">
            数据统计图
          </div>
        </div>
        <div v-loading="loadingEchart" class="container-carrier container-carrier5">
          <div class="container-carrier5-head">
            <div class="container-carrier5-head-l">
              <div
                class="container-carrier-btn"
                :class="chartStatus === 'temperature' ? 'container-carrier-btn-active' : ''"
                @click="switchLine('temperature')"
              >温湿度</div>
              <!-- <div
                class="container-carrier-btn"
                :class="chartStatus === 'humidity' ? 'container-carrier-btn-active' : ''"
                @click="switchLine('humidity') "
              >湿度数据</div> -->
              <div
                class="container-carrier-btn"
                :class="chartStatus === 'windSpeed' ? 'container-carrier-btn-active' : ''"
                @click="switchLine('windSpeed') "
              >通风</div>
              <!-- <div
                class="container-carrier-btn"
                :class="chartStatus === 'windOpen' ? 'container-carrier-btn-active' : ''"
                @click="switchLine('windOpen') "
              >风口开度</div> -->
              <div
                class="container-carrier-btn"
                :class="chartStatus === 'typeStatus' ? 'container-carrier-btn-active' : ''"
                @click="switchLine('typeStatus') "
              >设备状态</div>
              <div
                class="container-carrier-btn"
                :class="chartStatus === 'dataAnalysis' ? 'container-carrier-btn-active' : ''"
                @click="switchLine('dataAnalysis') "
              >数据分析</div>
              <div class="container-carrier-dates">
                <div v-hasAuth="'buildingPigHouse:unitExport'" class="container-carrier-export" @click="exportData">
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
            <div class="container-carrier5-head-r" />
          </div>
          <div v-show="lineEchartsList.length === 0" class="no-data-img"><img :src="noData | noDataFile('noData', 'svg')" style="max-width: 300px;"></div>
          <div ref="tempChart" class="container-carrier5-chart" />

        </div>
      </div>
    </div>
    <exportV1 :dialog-visible="dialogVisible" :element="exportObj.element" :refresh-element="exportObj.refreshElement" :params="exportObj.params" @closeDiaglog="dialogVisible=false" />
  </div>
</template>

<script>
import {
  // getListWeather,
  getUnitTemperaturePeriodData,
  getUnitPeriodData,
  alarmInfo,
  getPigInfo
} from '@/http/api/buildingPigHouse/buildingPigHouseDetail'
// import weatherService from '@/lib/service/weather-service'
import navForm from '@/components/commonComponent/navForm/index.vue'
// import { derive } from '@/http/api/exportData/export'
import suspensionAlarm from '@/components/suspensionAlarm'
// import feedMixin from '@/utils/mixin'
import { getFeedList } from '@/http/api/getFeedList'
import { initData, initEqumentData } from './utils/detailFields.js'
import exportV1 from '@/components/exportV1'
export default {
  name: 'UnitMonitoring',
  components: {
    navForm,
    suspensionAlarm,
    exportV1
  },
  // mixins: [feedMixin],
  props: {
    unitId: {
      type: String,
      default: ''
    }
    // info: {
    //   type: Object,
    //   default: function() {
    //     return {}
    //   }
    // }
  },
  data() {
    return {
      noData: '',
      reportTime: '---', // 数据采集时间
      testInterval: null,
      dialogVisible: false,
      exportObj: { // 导出需要传 的对象
        element: {},
        params: {}
      },
      // 切换图标状态
      chartStatus: 'temperature',
      lineDate: null,
      unitInfo: {
        pigType: '-',
        data: [
          {
            number: '-',
            key: 'pigDays',
            name: '日龄',
            position: 'left',
            company: '天',
            status: true
          }, {
            number: '-',
            name: '母猪胎次',
            key: 'batchNo',
            position: 'left',
            company: '',
            status: false
          },
          {
            number: '-',
            name: '装猪数量',
            position: 'top',
            key: 'pigCount',
            company: '头',
            status: true
          },
          {
            number: '-',
            name: '单猪体重',
            key: 'weight',
            position: 'right',
            company: 'kg',
            status: true
          },
          {
            number: '-',
            name: '饲养员',
            position: 'right',
            company: '',
            key: 'breederName',
            status: true
          },
          {
            number: '-',
            name: '工号',
            position: 'right',
            company: '',
            key: 'breederNumber',
            status: true
          }
        ]
      },
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
          position: '室内前',
          temperature: '-',
          temperatureDiffer: '-', // 温度
          humidity: '-',
          humidityDiffer: '-', // 湿度
          type: '1',
          sensing: '',
          signal: '0',
          voltage: '0'
        },
        {
          position: '室内中',
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
          position: '室内后',
          temperature: '-',
          temperatureDiffer: '-',
          humidity: '-',
          humidityDiffer: '-',
          type: '2',
          sensing: '',
          signal: '0',
          voltage: '0'
        },
        {
          position: '其他',
          temperature: '-',
          temperatureDiffer: null,
          humidity: '-',
          humidityDiffer: null,
          type: '5'
        }
      ],
      // 设备列表
      // equipmentList:[],
      // status： 1-在线 2-离线
      equipmentStatusList: [],
      // 设备ID
      equipmentDeviceId: null,
      equipmentAlarmDetails: [],
      lineEchartsList: [],
      showEcharysList: null,
      echartsResize: null,
      navFormInfo: {
        data: { time: [] },
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
      exportFileListInter: null,
      loadingInfo: true,
      loadingEchart: true,
      // loadingWeather: true,
      loadingPig: false,
      bottomChart: null,
      alarmList: [] // 告警列表
    }
  },
  computed: {
    allStyles() {
      return this.$store.state.echartStyle.allStyles
    }
  },
  watch: {
    'allStyles.flag'(newValue, oldValue) {
      this.switchLine(this.chartStatus)
    },
    unitId(newValue, oldValue) {
      this.info = JSON.parse(sessionStorage.getItem('buildingPigHouseDetail'))
      this.init()
    }
  },
  created() {
    this.initUrl()
    this.info = JSON.parse(sessionStorage.getItem('buildingPigHouseDetail'))
  },
  mounted() {
    this.bottomChart = this.$echarts.init(this.$refs.tempChart)
    this.initdate()
    this.init()
  },
  methods: {
    initUrl() {
      this.noData = this.$getImgUrl('noData', 'svg')
    },
    alarmInfoShow(item) {
      if (item.name === '警铃') {
        this.getAlarmInfo()
      }
    },
    // 获取报警列表 deviceId: 4D6120353543414D50080032004D
    getAlarmInfo() {
      const { deviceId } = this.info.overview
      const o = { deviceId }
      alarmInfo(o).then(res => {
        if (res && res.status === 200) {
          this.alarmList = res.data.rows
        }
      }).catch(() => {})
    },
    getFeedList() {
      const o = {
        fieldId: this.info.overview.fieldId,
        segmentId: this.info.overview.segmentId,
        unitId: this.info.overview.unitId
      }
      getFeedList(o).then(res => {
        this.unitInfo.data[4].number = res.data.breederName || '-'
        this.unitInfo.data[5].number = res.data.breederNumber || '-'
        if (res && res.status === 200) {
          // 饲养员姓名
          if (res.data) {
            this.unitInfo.data[4].number = res.data.breederName || '-'
            // 饲养员工号
            this.unitInfo.data[5].number = res.data.breederNumber || '-'
          }
        }
      }).catch(() => {})
    },
    initdate() {
      if (!this.navFormInfo.data.time || this.navFormInfo.data.time.length === 0) {
        this.navFormInfo.data.time = [this.getCurrentTime((new Date()).getTime() - 1000 * 60 * 60 * 4), this.getCurrentTime('')]
      }
    },
    init() {
      if (this.info && this.info.overview.roomTypeName) {
        this.getUnitInfo() // 猪只信息
        this.getPigData()
        this.getPigInfo()
        this.getFeedList()
      } else {
        this.$message.error('信息丢失，请重选单元')
        this.loadingInfo = false
        this.loadingEchart = false
        this.loadingPig = false
      }
    },
    refresh() {
      if (this.info.overview && this.info.overview.roomTypeName) {
        this.getPigInfo()
        this.getPigData()
        this.getUnitInfo() // 猪只信息
        this.getFeedList()
      } else {
        this.$message.error('信息丢失，请重选单元')
      }
    },
    dateTimeChange(event) {
      if (this.info && this.info.overview.roomTypeName) {
        if (!event) {
          this.navFormInfo.data.time = []
          this.initdate()
        }
        this.getPigData()
      } else {
        this.$message.error('信息丢失，请重选单元')
      }
    },
    // 绘制折线图
    setLineChart(data, time) {
      const lineOptions = {
        title: {
          show: data.titleS,
          // text: `头均通风量${data.titleData || '---'} m³/h`,
          textStyle: {
            'fontSize': 14,
            fontWeight: 'normal',
            'color': '#CDD8F7'
          },
          x: 'center',
          y: '7px',
          z: 2
        },
        tooltip: {
          formatter: (params) => {
            return params.seriesName + ': ' + params.value + '<br />' + params.name
          }
        },
        dataZoom: {
          id: 'dataZoomX',
          type: 'inside',
          xAxisIndex: [0],
          filterMode: 'none',
          start: 0,
          end: 100
        },
        legend: {
          data: data.headName,
          selected: data.hideLine,
          textStyle: { color: '#CDD8F7' },
          color: data.color,
          icon: 'circle',
          bottom: '6%'
        },
        grid: {
          left: '60px',
          right: '30px',
          top: '13%',
          bottom: '18%',
          containLabel: true
        },
        xAxis: {
          // x轴坐标系
          data: time,
          type: 'category',
          axisLine: { lineStyle: { color: '#CDD8F7' }},
          axisLabel: {
            // interval: parseInt(time.length / 22),
            textStyle: { color: '#CDD8F7' },
            rotate: 40,
            // fontSize: 8
            formatter: function(value, index) {
              return index % 2 === 1 ? null : value.substring(5, 16)
            }
          }
        },
        yAxis: data.yAxis,
        series: data.series
      }
      const { chartStatus } = this
      if (chartStatus === 'temperature') {
        lineOptions.title.textStyle.color = this.allStyles.titleColor
        lineOptions.xAxis.axisLine.lineStyle.color = this.allStyles.xAxisColor
        lineOptions.xAxis.axisLabel.textStyle.color = this.allStyles.xAxisName //  #FF3939
        lineOptions.legend.textStyle.color = this.allStyles.xAxisName
        lineOptions.yAxis[0].axisLine.lineStyle.color = this.allStyles.yAxisColor
        lineOptions.yAxis[0].axisLabel.textStyle.color = this.allStyles.yAxisName
        lineOptions.yAxis[0].nameTextStyle.color = this.allStyles.yAxisName
        lineOptions.yAxis[0].splitLine.lineStyle.color = this.allStylineOptions
        lineOptions.yAxis[1].axisLine.lineStyle.color = this.allStyles.yAxisColor
        lineOptions.yAxis[1].axisLabel.textStyle.color = this.allStyles.yAxisName
        lineOptions.yAxis[1].nameTextStyle.color = this.allStyles.yAxisName
        lineOptions.yAxis[1].splitLine.lineStyle.color = this.allStylineOptions
      } else if (chartStatus === 'humidity') {
        lineOptions.xAxis.axisLine.lineStyle.color = this.allStyles.xAxisColor
        lineOptions.xAxis.axisLabel.textStyle.color = this.allStyles.xAxisName //  #FF3939
        lineOptions.legend.textStyle.color = this.allStyles.xAxisName
        lineOptions.yAxis[0].axisLine.lineStyle.color = this.allStyles.yAxisColor
        lineOptions.yAxis[0].axisLabel.textStyle.color = this.allStyles.yAxisName
        lineOptions.yAxis[0].nameTextStyle.color = this.allStyles.yAxisName
        lineOptions.yAxis[0].splitLine.lineStyle.color = this.allStylineOptions
      } else if (chartStatus === 'windSpeed') {
        lineOptions.title.textStyle.color = this.allStyles.titleColor
        lineOptions.xAxis.axisLine.lineStyle.color = this.allStyles.xAxisColor
        lineOptions.xAxis.axisLabel.textStyle.color = this.allStyles.xAxisName //  #FF3939
        lineOptions.legend.textStyle.color = this.allStyles.xAxisName
        lineOptions.yAxis[0].axisLine.lineStyle.color = this.allStyles.yAxisColor
        lineOptions.yAxis[0].axisLabel.textStyle.color = this.allStyles.yAxisName
        lineOptions.yAxis[0].nameTextStyle.color = this.allStyles.yAxisName
        lineOptions.yAxis[0].splitLine.lineStyle.color = this.allStylineOptions
        lineOptions.yAxis[1].axisLine.lineStyle.color = this.allStyles.yAxisColor
        lineOptions.yAxis[1].axisLabel.textStyle.color = this.allStyles.yAxisName
        lineOptions.yAxis[1].nameTextStyle.color = this.allStyles.yAxisName
        lineOptions.yAxis[1].splitLine.lineStyle.color = this.allStylineOptions
      } else if (chartStatus === 'windOpen') {
        lineOptions.xAxis.axisLine.lineStyle.color = this.allStyles.xAxisColor
        lineOptions.xAxis.axisLabel.textStyle.color = this.allStyles.xAxisName //  #FF3939
        lineOptions.legend.textStyle.color = this.allStyles.xAxisName
        lineOptions.yAxis.axisLine.lineStyle.color = this.allStyles.yAxisColor
        lineOptions.yAxis.axisLabel.textStyle.color = this.allStyles.yAxisName
        lineOptions.yAxis.nameTextStyle.color = this.allStyles.yAxisName
        lineOptions.yAxis.splitLine.lineStyle.color = this.allStylineOptions
      } else if (chartStatus === 'typeStatus') {
        lineOptions.xAxis.axisLine.lineStyle.color = this.allStyles.xAxisColor
        lineOptions.xAxis.axisLabel.textStyle.color = this.allStyles.xAxisName //  #FF3939
        lineOptions.legend.textStyle.color = this.allStyles.xAxisName
        lineOptions.yAxis[0].axisLine.lineStyle.color = this.allStyles.yAxisColor
        lineOptions.yAxis[0].axisLabel.textStyle.color = this.allStyles.yAxisName
        lineOptions.yAxis[0].nameTextStyle.color = this.allStyles.yAxisName
        lineOptions.yAxis[0].splitLine.lineStyle.color = this.allStylineOptions
      } else if (chartStatus === 'dataAnalysis') {
        lineOptions.xAxis.axisLine.lineStyle.color = this.allStyles.xAxisColor
        lineOptions.xAxis.axisLabel.textStyle.color = this.allStyles.xAxisName //  #FF3939
        lineOptions.legend.textStyle.color = this.allStyles.xAxisName
        lineOptions.yAxis[0].axisLine.lineStyle.color = this.allStyles.yAxisColor
        lineOptions.yAxis[0].axisLabel.textStyle.color = this.allStyles.yAxisName
        lineOptions.yAxis[0].nameTextStyle.color = this.allStyles.yAxisName
        lineOptions.yAxis[0].splitLine.lineStyle.color = this.allStylineOptions
        lineOptions.yAxis[1].axisLine.lineStyle.color = this.allStyles.yAxisColor
        lineOptions.yAxis[1].axisLabel.textStyle.color = this.allStyles.yAxisName
        lineOptions.yAxis[1].nameTextStyle.color = this.allStyles.yAxisName
        lineOptions.yAxis[1].splitLine.lineStyle.color = this.allStylineOptions
      }
      this.bottomChart.setOption(lineOptions, true)
      // 浏览器窗口变化随之适配
      window.onresize = () => {
        clearTimeout(this.echartsResize)
        this.echartsResize = setTimeout(() => {
          this.bottomChart.resize()
        }, 1000)
      }
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
    // 切换图表
    switchLine(type) {
      this.chartStatus = type
      const listObj = this.showEcharysList
      console.log('listObj---', listObj)
      let lineList
      if (type === 'temperature') {
        lineList = {
          titleS: false,
          headName: [
            '室内前温度',
            '室内中温度',
            '室内后温度',
            '室外温度',
            '室内前湿度',
            '室内中湿度',
            '室内后湿度',
            '室外湿度',
            '暖灯温度',
            '暖灯湿度',
            // '暖灯状态',
            '采用'
          ],
          Yname: '°C',
          hideLine: {
            '室内中温度': false,
            '室外温度': false,
            '室内中湿度': false,
            '室外湿度': false,
            '暖灯温度': false,
            '暖灯湿度': false,
            // '暖灯状态': false,
            '采用': false
          },
          // color: ['#FF2727', '#48E0F4', '#43F354', '#385BFF', '#945FB9', '#1F9493' ],
          yAxis: [
            {
              type: 'value',
              name: '°C',
              // y轴数值自适应
              scale: true,
              axisLine: { lineStyle: { color: '#CDD8F7' }},
              axisLabel: { textStyle: { color: '#CDD8F7' }},
              // 去除网格线
              splitLine: { lineStyle: { color: ['#3E477F'] }},
              nameTextStyle: {}
            },
            {
              type: 'value',
              name: '%',
              // y轴数值自适应
              scale: true,
              axisLine: { lineStyle: { color: '#CDD8F7' }},
              axisLabel: { textStyle: { color: '#CDD8F7' }},
              // 去除网格线
              splitLine: { lineStyle: { color: ['rgba(0,0,0,0)'] }},
              nameTextStyle: {}
            }
          ],
          series: [
            {
              type: 'line',
              name: '室内前温度',
              data: listObj.temp_inner_before,
              itemStyle: {
                normal: { color: 'rgba(247, 227, 11, 1)', lineStyle: { color: 'rgba(247, 227, 11, 1)' }}
              },
              yAxisIndex: 0
            },
            {
              type: 'line',
              name: '室内中温度',
              data: listObj.temp_inner_middle,
              itemStyle: {
                normal: { color: '#48E0F4', lineStyle: { color: '#48E0F4' }}
              },
              yAxisIndex: 0
            },
            {
              type: 'line',
              name: '室内后温度',
              data: listObj.temp_inner_after,
              itemStyle: {
                normal: { color: '#43F354', lineStyle: { color: '#43F354' }}
              },
              yAxisIndex: 0
            },
            {
              type: 'line',
              name: '室外温度',
              data: listObj.temp_outer,
              itemStyle: {
                normal: { color: '#EF0E4C', lineStyle: { color: '#EF0E4C' }}
              },
              yAxisIndex: 0
            },
            {
              type: 'line',
              name: '室内前湿度',
              data: listObj.hum_inner_before,
              itemStyle: {
                normal: { color: 'rgba(7, 204, 244, 1)', lineStyle: { color: 'rgba(7, 204, 244, 1)' }}
              },
              yAxisIndex: 1
            },
            {
              type: 'line',
              name: '室内中湿度',
              data: listObj.hum_inner_middle,
              itemStyle: {
                normal: { color: 'rgba(244, 145, 7, 1)', lineStyle: { color: 'rgba(244, 145, 7, 1)' }}
              },
              yAxisIndex: 1
            },
            {
              type: 'line',
              name: '室内后湿度',
              data: listObj.hum_inner_after,
              itemStyle: {
                normal: { color: 'rgba(197, 244, 7, 1)', lineStyle: { color: 'rgba(197, 244, 7, 1)' }}
              },
              yAxisIndex: 1
            },
            {
              type: 'line',
              name: '室外湿度',
              data: listObj.hum_outer,
              itemStyle: {
                normal: { color: 'rgba(78, 7, 244, 1)', lineStyle: { color: 'rgba(78, 7, 244, 1)' }}
              },
              yAxisIndex: 1
            },
            {
              type: 'line',
              name: '暖灯温度',
              data: listObj.heatLampTemp,
              itemStyle: {
                normal: { color: '#945FB9', lineStyle: { color: '#945FB9' }}
              },
              yAxisIndex: 0
            },
            {
              type: 'line',
              name: '暖灯湿度',
              data: listObj.heatLampHumidity,
              itemStyle: {
                normal: { color: 'rgba(240, 7, 244, 1)', lineStyle: { color: 'rgba(240, 7, 244, 1)' }}
              },
              yAxisIndex: 0
            },
            {
              type: 'line',
              name: '采用',
              data: listObj.temp_use,
              itemStyle: {
                normal: { color: '#1F9493', lineStyle: { color: '#1F9493' }}
              },
              yAxisIndex: 0
            }
          ]
        }
      } else if (type === 'humidity') {
        lineList = {
          titleS: false,
          headName: ['室内前', '室内中', '室内后', '室外', '暖灯', '采用'],
          Yname: '%',
          hideLine: {
            室内前: true,
            室内中: true,
            室内后: true,
            室外: true,
            暖灯: true,
            采用: true
          },
          yAxis: [
            {
              type: 'value',
              name: '%',
              // y轴数值自适应
              scale: true,
              axisLine: { lineStyle: { color: '#CDD8F7' }},
              axisLabel: { textStyle: { color: '#CDD8F7' }},
              // 去除网格线
              splitLine: { lineStyle: { color: ['#3E477F'] }},
              nameTextStyle: {}
            }
          ],
          // color: ['#FF2727', '#48E0F4', '#43F354', '#385BFF', '#945FB9', '#1F9493' ],
          series: [
            {
              type: 'line',
              name: '室内前',
              data: listObj.hum_inner_before,
              itemStyle: {
                normal: { color: '#FF2727', lineStyle: { color: '#FF2727' }}
              },
              yAxisIndex: 0
            },
            {
              type: 'line',
              name: '室内中',
              data: listObj.hum_inner_middle,
              itemStyle: {
                normal: { color: '#48E0F4', lineStyle: { color: '#48E0F4' }}
              },
              yAxisIndex: 0
            },
            {
              type: 'line',
              name: '室内后',
              data: listObj.hum_inner_after,
              itemStyle: {
                normal: { color: '#43F354', lineStyle: { color: '#43F354' }}
              },
              yAxisIndex: 0
            },
            {
              type: 'line',
              name: '室外',
              data: listObj.hum_outer,
              itemStyle: {
                normal: { color: '#385BFF', lineStyle: { color: '#385BFF' }}
              },
              yAxisIndex: 0
            },
            {
              type: 'line',
              name: '暖灯',
              data: listObj.hum_heat_light,
              itemStyle: {
                normal: { color: '#945FB9', lineStyle: { color: '#945FB9' }}
              },
              yAxisIndex: 0
            },
            {
              type: 'line',
              name: '采用',
              data: listObj.hum_use,
              itemStyle: {
                normal: { color: '#1F9493', lineStyle: { color: '#1F9493' }}
              },
              yAxisIndex: 0
            }
          ]
        }
      } else if (type === 'windSpeed') { // 通风
        lineList = {
          titleS: true,
          // titleData: this.showEcharysList.avg_wind || '---',
          headName: ['0级风速', '1级风速', '2级风速', '4级风速', '0级开度', '4级开度'],
          Yname: 'm/s',
          hideLine: {
            '0级风速': true,
            '1级风速': false,
            '2级风速': false,
            '4级风速': true,
            '0级开度': false,
            '4级开度': false
          },
          yAxis: [{
            type: 'value',
            name: 'm/s',
            // y轴数值自适应
            scale: true,
            axisLine: { lineStyle: { color: '#CDD8F7' }},
            axisLabel: { textStyle: { color: '#CDD8F7' }},
            // 去除网格线
            splitLine: { lineStyle: { color: ['#3E477F'] }},
            nameTextStyle: {}
          }, {
            type: 'value',
            name: '%',
            // y轴数值自适应
            scale: true,
            axisLine: { lineStyle: { color: '#CDD8F7' }},
            axisLabel: { textStyle: { color: '#CDD8F7' }},
            // 去除网格线
            splitLine: { lineStyle: { color: ['#3E477F'] }},
            nameTextStyle: {}
          }],
          // color: ['#FF2727', '#48E0F4', '#43F354', '#385BFF', '#945FB9', '#1F9493' ],
          series: [
            {
              type: 'line',
              name: '0级风速',
              data: listObj.speed_wind_zero,
              yAxisIndex: 0,
              itemStyle: {
                normal: { color: '#FF2727', lineStyle: { color: '#FF2727' }}
              }
            },
            {
              type: 'line',
              name: '1级风速',
              data: listObj.speed_wind_one,
              yAxisIndex: 0,
              itemStyle: {
                normal: { color: '#48E0F4', lineStyle: { color: '#48E0F4' }}
              }
            },
            {
              type: 'line',
              name: '2级风速',
              data: listObj.speed_wind_two,
              yAxisIndex: 0,
              itemStyle: {
                normal: { color: '#43F354', lineStyle: { color: '#43F354' }}
              }
            },
            {
              type: 'line',
              name: '4级风速',
              data: listObj.speed_wind_four,
              yAxisIndex: 0,
              itemStyle: {
                normal: { color: '#385BFF', lineStyle: { color: '#385BFF' }}
              }
            },
            {
              type: 'line',
              name: '0级开度',
              yAxisIndex: 1,
              data: listObj.open_wind_zero,
              itemStyle: {
                normal: { color: 'rgba(240, 7, 244, 1)', lineStyle: { color: 'rgba(240, 7, 244, 1)' }}
              }
            },
            {
              type: 'line',
              name: '4级开度',
              yAxisIndex: 1,
              data: listObj.open_wind_four,
              itemStyle: {
                normal: { color: 'rgba(244, 145, 7, 1)', lineStyle: { color: 'rgba(244, 145, 7, 1)' }}
              }
            }
          ]
        }
      } else if (type === 'windOpen') { // 风口开度
        lineList = {
          titleS: true,
          headName: ['0级开度', '4级开度'],
          Yname: 'm/s',
          hideLine: {
            '0级': true,
            '4级': true
          },
          yAxis: {
            type: 'value',
            name: '%',
            // y轴数值自适应
            scale: true,
            axisLine: { lineStyle: { color: '#CDD8F7' }},
            axisLabel: { textStyle: { color: '#CDD8F7' }},
            // 去除网格线
            splitLine: { lineStyle: { color: ['#3E477F'] }},
            nameTextStyle: {}
          },
          // color: ['#FF2727', '#48E0F4', '#43F354', '#385BFF', '#945FB9', '#1F9493' ],
          series: [
            {
              type: 'line',
              name: '0级',
              data: listObj.open_wind_zero,
              itemStyle: {
                normal: { color: '#FF2727', lineStyle: { color: '#FF2727' }}
              }
            },
            {
              type: 'line',
              name: '4级',
              data: listObj.open_wind_four,
              itemStyle: {
                normal: { color: '#385BFF', lineStyle: { color: '#385BFF' }}
              }
            }
          ]
        }
      } else if (type === 'typeStatus') { // 设备状态
        lineList = {
          titleS: true,
          hideLine: {},
          headName: [// 这里的name要和series中的name保持一致
            '喷淋1',
            '喷淋2',
            '暖灯状态'
          ],
          yAxis: [
            {
              type: 'value',
              // y轴数值自适应
              scale: true,
              axisLine: { lineStyle: { color: '#CDD8F7' }},
              axisLabel: { textStyle: { color: '#CDD8F7' }},
              // 去除网格线
              splitLine: { lineStyle: { color: ['#3E477F'] }},
              nameTextStyle: {}
            }
          ],
          series: [
            {
              type: 'line',
              name: '喷淋1',
              data: listObj.shower_status1,
              itemStyle: {
                normal: { color: '#1F9493', lineStyle: { color: '#1F9493' }}
              }
            },
            {
              type: 'line',
              name: '喷淋2',
              data: listObj.shower_status2,
              itemStyle: {
                normal: { color: '#385BFF', lineStyle: { color: '#385BFF' }}
              }
            },
            {
              type: 'line',
              name: '暖灯状态',
              data: listObj.heatLampStatus,
              itemStyle: {
                normal: { color: '#945FB9', lineStyle: { color: '#945FB9' }}
              }
            }
          ]
        }
      } else if (type === 'dataAnalysis') { // 数据分析
        lineList = {
          titleS: false,
          headName: [
            '采用温度',
            '采用湿度',
            '暖灯状态',
            '喷淋1',
            '喷淋2',
            '0级开度曲线',
            '4级开度曲线',
            '暖灯温度'
          ],
          Yname: '°C',
          yAxis: [
            {
              type: 'value',
              name: '°C',
              // y轴数值自适应
              scale: true,
              axisLine: { lineStyle: { color: '#CDD8F7' }},
              axisLabel: { textStyle: { color: '#CDD8F7' }},
              // 去除网格线
              splitLine: { lineStyle: { color: ['#3E477F'] }},
              nameTextStyle: {}
            },
            {
              type: 'value',
              name: '%',
              // y轴数值自适应
              scale: true,
              axisLine: { lineStyle: { color: '#CDD8F7' }},
              axisLabel: { textStyle: { color: '#CDD8F7' }},
              // 去除网格线
              splitLine: { lineStyle: { color: ['rgba(0,0,0,0)'] }},
              nameTextStyle: {}
            }
          ],
          series: [
            {
              type: 'line',
              name: '采用温度',
              data: listObj.temp_use,
              itemStyle: {
                normal: { color: '#FF2727', lineStyle: { color: '#FF2727' }}
              },
              yAxisIndex: 0
            },
            {
              type: 'line',
              name: '采用湿度',
              data: listObj.hum_use,
              itemStyle: {
                normal: { color: '#48E0F4', lineStyle: { color: '#48E0F4' }}
              },
              yAxisIndex: 1
            },
            {
              type: 'line',
              name: '暖灯状态',
              data: listObj.heatLampStatus,
              itemStyle: {
                normal: { color: '#43F354', lineStyle: { color: '#43F354' }}
              },
              yAxisIndex: 0
            },
            {
              type: 'line',
              name: '喷淋1',
              data: listObj.shower_status1,
              itemStyle: {
                normal: { color: '#1F9493', lineStyle: { color: '#1F9493' }}
              },
              yAxisIndex: 0
            },
            {
              type: 'line',
              name: '喷淋2',
              data: listObj.shower_status2,
              itemStyle: {
                normal: { color: '#385BFF', lineStyle: { color: '#385BFF' }}
              },
              yAxisIndex: 0
            },
            {
              type: 'line',
              name: '0级开度曲线',
              data: listObj.open_wind_zero,
              itemStyle: {
                normal: { color: 'rgba(244, 145, 7, 1)', lineStyle: { color: 'rgba(244, 145, 7, 1)' }}
              },
              yAxisIndex: 1
            },
            {
              type: 'line',
              name: '4级开度曲线',
              data: listObj.open_wind_four,
              itemStyle: {
                normal: { color: 'rgba(240, 7, 244, 1)', lineStyle: { color: 'rgba(240, 7, 244, 1)' }}
              },
              yAxisIndex: 1
            },
            {
              type: 'line',
              name: '暖灯温度',
              data: listObj.heatLampTemp,
              itemStyle: {
                normal: { color: 'rgba(244, 224, 7, 1)', lineStyle: { color: 'rgba(244, 224, 7, 1)' }}
              },
              yAxisIndex: 0
            }
          ]
        }
      }
      if (lineList) {
        this.setLineChart(lineList, this.showEcharysList.time)
      }
    },
    // 处理图表数据
    handleChartData(data) {
      this.lineEchartsList = data
      const time = [] // 时间
      const temp_inner_before = [] // 室内前温度
      const temp_inner_middle = [] // 室内中
      const temp_inner_after = [] // 室内后温度
      const temp_outer = [] // 室外温度
      const temp_heat_light = [] // 暖灯温度
      const heatLampStatus = [] // 暖灯状态
      const temp_use = [] // 采用温度
      const heatLampTemp = [] // 暖灯温度
      const heatLampHumidity = [] // 暖灯湿度
      const hum_inner_before = [] // 湿度
      const hum_inner_middle = []
      const hum_inner_after = []
      const hum_outer = []
      const hum_heat_light = []
      const hum_use = []
      const speed_wind_zero = [] // 0级风口风速
      const speed_wind_one = []
      const speed_wind_two = []
      const speed_wind_four = []
      const open_wind_zero = [] // 风口开度0级
      const open_wind_four = [] // 风口开度4级
      const shower_status1 = []
      const shower_status2 = []
      for (const i of this.lineEchartsList) {
        time.push(i.uploadTime) // .slice(0, 10)
        temp_inner_before.push(i.beforeIndoorTemp)
        temp_inner_middle.push(i.centerIndoorTemp)
        temp_inner_after.push(i.afterIndoorTemp)
        temp_outer.push(i.outdoorTemp)
        temp_heat_light.push(i.temp_heat_light)
        heatLampTemp.push(i.heatLampTemp)
        heatLampHumidity.push(i.heatLampHumidity)
        heatLampStatus.push(i.heatLampStatus)
        temp_use.push(i.useTemp)
        shower_status1.push(i.showerStatus1)
        shower_status2.push(i.showerStatus2)
        hum_inner_before.push(i.beforeIndoorHumidity)
        hum_inner_middle.push(i.centerIndoorHumidity)
        hum_inner_after.push(i.afterIndoorHumidity)
        hum_outer.push(i.outdoorHumidity)
        hum_heat_light.push(i.heatLampHumidity)
        hum_use.push(i.useHumidity)
        speed_wind_zero.push(i.windowZeroSpeed)
        speed_wind_one.push(i.windowOneSpeed)
        speed_wind_two.push(i.windowTwoSpeed)
        speed_wind_four.push(i.windowFourSpeed)
        open_wind_zero.push(i.windowZeroOpenPercent)
        open_wind_four.push(i.windowFourOpenPercent)
      }
      const listObj = {
        time,
        temp_inner_before,
        temp_inner_middle,
        temp_inner_after,
        temp_outer,
        temp_heat_light,
        heatLampHumidity,
        heatLampTemp,
        heatLampStatus,
        temp_use,
        hum_inner_before,
        hum_inner_middle,
        hum_inner_after,
        hum_outer,
        hum_heat_light,
        hum_use,
        speed_wind_zero,
        speed_wind_one,
        speed_wind_two,
        speed_wind_four,
        open_wind_zero,
        open_wind_four,
        shower_status1,
        shower_status2
      }
      this.showEcharysList = listObj
      this.switchLine(this.chartStatus)
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
    // 猪舍数据统计图
    async getPigData(flag) {
      if (!flag) this.loadingEchart = true
      const { deviceId } = this.info.overview
      const data = {
        deviceId,
        startTime: this.navFormInfo.data.time[0],
        endTime: this.navFormInfo.data.time[1]
      }
      await getUnitTemperaturePeriodData(data).then((res) => {
        this.loadingEchart = false
        if (res && res.status === 200 && res.rel) {
          if (res.data.length > 0) {
            this.lineEchartsList = res.data
            this.handleChartData(res.data)
          }
        } else {
          // this.$message.error(res.message)
        }
      }).catch(() => {
        this.loadingEchart = false
        // this.$message.error(err.message)
      })
    },
    // // 天气信息
    // async getWeatherData() {
    //   this.loadingWeather = true
    //   const { fieldId } = this.info.overview
    //   const data = {
    //     endDay: this.nDate(4),
    //     fieldId,
    //     startDay: this.getCurrentTime().split(' ')[0]
    //   }
    //   await getListWeather(data).then((res) => {
    //     this.loadingWeather = false
    //     if (res && res.status === 200 && res.data) {
    //       const arr = JSON.parse(JSON.stringify(res.data.rows))
    //       for (const i of arr) {
    //         i.weatherImg = weatherService.getWeatherImg(i.weather)
    //         i.date = this.getWeek(i.day)
    //         i.newDay = i.day.split('-')[1] + '月' + i.day.split('-')[2]
    //       }
    //       arr[0].newDay = '今天'
    //       this.weatherList = arr
    //     } else {
    //       this.$message({ message: res.message, type: 'warning' })
    //     }
    //   }).catch(() => {
    //     this.loadingWeather = false
    //   })
    // },
    // 猪只信息
    async getUnitInfo() {
      this.loadingPig = true
      const { fieldId, segmentId, unit } = this.info.overview
      const data = {
        fieldId,
        segmentId,
        unit
      }
      // myBaseInfo/getFieldPigMsgInfo
      await getPigInfo(data).then((res) => {
        this.loadingPig = false
        if (res && res.status === 200) {
          initData(this)
          if (res.data) {
            this.handleUnitInfo(res.data)
          }
        } else {
          // this.$message.error(res.message)
        }
      }).catch(() => {
        this.loadingPig = false
        // this.$message.error(err.message)
      })
    },
    // 猪舍信息
    async getPigInfo() {
      this.loadingInfo = true
      const { deviceId } = this.info.overview
      const data = {
        deviceId
      }
      await getUnitPeriodData(data).then((res) => {
        this.loadingInfo = false
        if (res && res.status === 200) {
          // this.$emit('childrenInfo', res)
          initEqumentData(this)
          if (res.data) {
            this.handlePigInfo(res.data)
          }
        } else {
          // this.$message.error(res.message)
        }
      }).catch(() => {
        this.loadingInfo = false
        // this.$message.error(err.message)
      })
    },
    handleUnitInfo(d) {
      switch (d.hoggeryType) {
        case 1:
          this.unitInfo.pigType = '保育舍'
          break
        case 2:
          this.unitInfo.pigType = '育肥舍'
          break
        case 3:
          this.unitInfo.pigType = '保育育肥一体舍'
          break
        case 4:
          this.unitInfo.pigType = '哺乳舍'
          this.unitInfo.data[0].name = '仔猪日龄'
          this.unitInfo.data[1].status = true
          break
        case 5:
          this.unitInfo.pigType = '怀孕舍'
          this.unitInfo.data[0].name = '母猪孕龄'
          this.unitInfo.data[3].name = '母猪体重'
          this.unitInfo.data[1].status = true
          break
        case 6:
          this.unitInfo.pigType = '后备舍'
          break
        case 7:
          this.unitInfo.pigType = '公猪舍'
          break
        case 8:
          this.unitInfo.pigType = '待配舍'
          break
        default:
          break
      }
      this.unitInfo.data.forEach(unit => {
        if (d[unit.key] || d[unit.key] === 0) {
          unit.number = d[unit.key]
        }
      })
      // this.unitInfo.data[0].number = d.pigDays || '-'
      // this.unitInfo.data[1].number = d.batchNo || '-'
      // this.unitInfo.data[2].number = d.pigCount || '-'
      // this.unitInfo.data[3].number = d.weight || '-'
      // this.unitInfo.data[4].number
      // this.unitInfo.data[5].number
    },
    // 导出文件
    exportData() {
      // if (!this.info || !this.info.overview.roomTypeName) {
      //   this.$message.error('信息丢失，请重选单元')
      //   return
      // }
      // const o = {
      //   deviceId: this.info.overview.deviceId,
      //   startTime: this.navFormInfo.data.time[0],
      //   endTime: this.navFormInfo.data.time[1]
      // }
      // derive('/api/unit_evc/building/unitExport', o)
      const params = {
        deviceId: this.info.overview.deviceId,
        startTime: this.navFormInfo.data.time[0],
        endTime: this.navFormInfo.data.time[1]
      }
      const pageElement = this.$getConfigElement('buildingPigHouse')
      const element = pageElement['exportV1'] // 新导出
      const refreshElement = pageElement['fileUrl'] // 刷新看有无生成
      this.exportObj = {
        element,
        params,
        refreshElement
      }
      this.dialogVisible = true
    },
    valueIsNullReturn(val) {
      if (val === null || val === undefined || val === -100) {
        return '-'
      }
      return val
    },
    // 处理猪舍信息
    handlePigInfo(data) {
      this.reportTime = data.uploadTime ? data.uploadTime : '---' // 数据采集时间
      // 室内前
      this.equipmentList[0].temperature = this.valueIsNullReturn(data.beforeIndoorTemp)
      this.equipmentList[0].humidity = this.valueIsNullReturn(data.beforeIndoorHumidity)
      this.equipmentList[0].temperatureDiffer = this.valueIsNullReturn(data.beforeIndoorMaxdiffTemp)// 最大温差 字段不确定？下同 老项目未赋值
      this.equipmentList[0].humidityDiffer = this.valueIsNullReturn(data.beforeIndoorMaxdiffHumi)
      // 室内中
      this.equipmentList[1].temperature = this.valueIsNullReturn(data.centerIndoorTemp)
      this.equipmentList[1].humidity = this.valueIsNullReturn(data.centerIndoorHumidity)
      this.equipmentList[1].temperatureDiffer = this.valueIsNullReturn(data.centerIndoorMaxdiffTemp)
      this.equipmentList[1].humidityDiffer = this.valueIsNullReturn(data.centerIndoorMaxdiffHumi)
      // 室内后
      this.equipmentList[2].temperature = this.valueIsNullReturn(data.afterIndoorTemp)
      this.equipmentList[2].humidity = this.valueIsNullReturn(data.afterIndoorHumidity)
      this.equipmentList[2].temperatureDiffer = this.valueIsNullReturn(data.afterIndoorMaxdiffTemp)
      this.equipmentList[2].humidityDiffer = this.valueIsNullReturn(data.afterIndoorMaxdiffHumi)
      this.equipmentList[3].outdoorTemp = this.valueIsNullReturn(data.outdoorTemp)
      this.equipmentList[3].outdoorHumidity = this.valueIsNullReturn(data.outdoorHumidity)
      this.equipmentList[3].heatLampTemp = this.valueIsNullReturn(data.heatLampTemp)
      this.equipmentList[3].heatLampHumidity = this.valueIsNullReturn(data.heatLampHumidity)
      this.equipmentList[3].useTemp = this.valueIsNullReturn(data.useTemp)
      this.equipmentList[3].useHumidity = this.valueIsNullReturn(data.useHumidity)

      // 设备运行状态
      const arr = []
      // 喷淋1 showerStatus
      arr.push({
        name: `喷淋1`,
        icon: '&#xe615;',
        isShow: data.showerStatus1 === 255 || data.showerStatus1 === null, // 是否显示
        status: data.showerStatus1 === 1,
        waring: data.showerStatus1 === 101
      })
      // 喷淋2
      arr.push({
        name: `喷淋2`,
        icon: '&#xe615;',
        isShow: data.showerStatus2 === 255 || data.showerStatus2 === null, // 是否显示
        status: data.showerStatus2 === 1,
        waring: data.showerStatus2 === 101
      })
      // 雾化盘
      // if (data.g2HumiStatus !== 255) { // g2HumiStatus 101警告 1开启 0未开启 null未安装？
      arr.push({
        name: `雾化盘`,
        icon: '&#xe610;',
        isShow: data.g2HumiStatus === 255 || data.g2HumiStatus === null, // 是否显示
        status: data.g2HumiStatus === 1,
        waring: data.g2HumiStatus === 101
      })
      // }
      // 暖灯
      // if (data.warmLightStatus !== 255) { // heatLampStatus
      arr.push({
        name: `暖灯`,
        icon: '&#xe60f;',
        isShow: data.heatLampStatus === 255 || data.heatLampStatus === null, // 是否显示
        status: data.heatLampStatus === 1,
        waring: data.heatLampStatus === 101
      })
      // }
      // 电热板 hotPlateStatus
      arr.push({
        name: `电热板`,
        icon: '&#xe61b;',
        isShow: data.hotPlateStatus === 255 || data.hotPlateStatus === null, // 是否显示
        status: data.hotPlateStatus === 1,
        waring: data.hotPlateStatus === 101
      })
      // 排污阀门 sewageStatus
      arr.push({
        name: `排污阀门`,
        icon: '&#xe61c;',
        isShow: data.sewageStatus === 255 || data.sewageStatus === null, // 是否显示
        status: data.sewageStatus === 1,
        waring: data.sewageStatus === 101
      })
      // 饮水
      // if (data.drinkStatus !== 255) { // drinkStatus
      arr.push({
        name: `饮水`,
        icon: '&#xe616;',
        isShow: data.drinkStatus === 255 || data.drinkStatus === null, // 是否显示
        status: data.drinkStatus === 1,
        waring: data.drinkFault === 101
      })
      // }
      // 警铃
      // if (data.alarmStatus !== 255) { // alarmStatus
      arr.push({
        name: `警铃`,
        icon: '&#xe614;',
        isShow: data.alarmStatus === 255 || data.alarmStatus === null, // 是否显示
        status: data.alarmStatus === 1,
        waring: data.alarmBellFault === 101
      })
      // }
      // 照明
      // if (data.lightStatus !== 255) { // lightStatus
      arr.push({
        name: `照明`,
        icon: '&#xe613;',
        isShow: data.lightStatus === 255 || data.lightStatus === null, // 是否显示
        status: data.lightStatus === 1,
        waring: data.lightStatus === 101
      })
      // }
      // 0级开度 windowZeroOpenPercent
      arr.push({
        name: `0级开度`,
        value: this.valueIsNullReturn(data.windowZeroOpenPercent) === '-' ? this.valueIsNullReturn(data.windowZeroOpenPercent) : this.valueIsNullReturn(data.windowZeroOpenPercent) + '%',
        type: 1 // 表示没图标
      })
      // 4级开度 windowFourOpenPercent
      arr.push({
        name: `4级开度`,
        value: this.valueIsNullReturn(data.windowFourOpenPercent) === '-' ? '-' : this.valueIsNullReturn(data.windowFourOpenPercent) + '%',
        type: 1 // 表示没图标
      })
      // 热交换开度 airHotExchangeOpenPercent
      arr.push({
        name: `热交换开度`,
        value: this.valueIsNullReturn(data.airHotExchangeOpenPercent) === '-' ? '-' : this.valueIsNullReturn(data.airHotExchangeOpenPercent) + '%',
        type: 1 // 表示没图标
      })
      arr.push({
        name: `粪水温度 `,
        value: this.valueIsNullReturn(data.droppingTemp) === '-' ? '-' : Number(this.valueIsNullReturn(data.droppingTemp)) + '°C',
        type: 1 // 表示没图标
      })
      arr.push({
        name: ` 喷淋水表`,
        value: this.valueIsNullReturn(data.accShowerWaterUsage) === '-' ? '-' : Number(this.valueIsNullReturn(data.accShowerWaterUsage)).toFixed(1),
        type: 2, // 表示没图标
        unit: 'm3' // 单位
      })
      arr.push({
        name: `饮水水表`,
        value: this.valueIsNullReturn(data.accDrinkWaterUsage) === '-' ? '-' : Number(this.valueIsNullReturn(data.accDrinkWaterUsage)).toFixed(1),
        type: 2, // 表示没图标
        unit: 'm3' // 单位
      })
      arr.push({
        name: `加药水表`,
        value: this.valueIsNullReturn(data.accMedicateWaterUsage) === '-' ? '-' : Number(this.valueIsNullReturn(data.accMedicateWaterUsage)).toFixed(1),
        type: 2, // 表示没图标
        unit: 'm3' // 单位
      })
      arr.push({
        name: `刷圈水表`,
        value: this.valueIsNullReturn(data.accWashWaterUsage) === '-' ? '-' : Number(this.valueIsNullReturn(data.accWashWaterUsage)).toFixed(1),
        type: 2, // 表示没图标
        unit: 'm3' // 单位
      })
      arr.push({
        name: `饮水压力值`,
        value: this.valueIsNullReturn(data.drinkPressure) === '-' ? '-' : Number(this.valueIsNullReturn(data.drinkPressure)).toFixed(3),
        type: 2, // 表示没图标
        unit: 'MPa'
      })
      arr.push({
        name: `喷淋压力值`,
        value: this.valueIsNullReturn(data.sprayPressure) === '-' ? '-' : Number(this.valueIsNullReturn(data.sprayPressure)).toFixed(3),
        type: 2, // 表示没图标
        unit: 'MPa'
      })
      this.equipmentStatusList = arr
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  margin: 0 1.6%;
  margin-bottom: 20px;
}
.container-row {
  // color: #cdd8f7;
  @include font_color('mainFontColr11');
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
  @include background_image('viewBackGroundImage3');
  // border: 1px solid #2F3872;
  border: 1px solid;
  @include border_color('viewBorderColor2');
  border-radius: 4px;
  .title{
    padding:6px 0 0 20px;
    @include font_color('mainFontColor2');
  }
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
  // color: #F4F7FF;
  @include font_color('viewFontColor2');
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
  @include font-color('mainFontColor2');
  // border-bottom: 1px solid #2F3872;
  border-bottom: 1px solid;
  @include border_color('viewBorderColor2');
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
      // color: #CDD8F7;
      @include font_color('mainFontColor11');
      margin: 18px 0 8px 0;
    }
    &-body {
      height: 258px;
      // background: #1F316E;
      @include background('viewBackGround7');
      border: 1px solid #2F3872;
      border-radius: 4px;
      text-align: center;
      &-weather {
        margin: 10px 0;
        font-size: 12px;
        // color: #cdd8f7;
        @include font_color('mainFontColor11');
        line-height: 24px;
        &-img{
          height: 42px;
        }
      }
    }
  }
}
.container-carrier1 {
  display: flex;
  justify-content: space-around;
  .content-carrier-wrap {

  }
  &-row{
    margin: 10px;
    width: calc(100%);
    height: 80px;
    // background: #1F316E;
    @include background('viewBackGround7');
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    &-l{
      flex: 1;
      font-family: SourceHanSansCN-Normal;
      font-size: 14px;
      // color: #CDD8F7;
      @include font-color('mainFontColor11');
      position: relative;
      padding-left: 50px;
      &-icon{
        position: absolute;
        left: 0;
        top: 50%;
        transform: translate(0%, -50%);
        width: 40px;
        height: 40px;
        border-radius: 40px;
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
      font-family: DINAlternate-Bold;
      font-size: 20px;
      // color: #FFFFFF;
      @include font-color('mainFontColor2');
      span{
        font-family: PingFangSC-Regular;
        font-size: 12px;
        // color: #CDD8F7;
        @include font-color('mainFontColor11');
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
  padding-bottom: 3px;

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
      // color: #ffffff;
      @include font_color('mainFontColor2');
      border-radius: 2px;
      padding: 2px 4px;
    }
    &-main {
      &-div {
        height: 60px;
        line-height: 60px;
        margin: 0 30px;
        // border-bottom: 1px solid #252F6E;
        border-bottom: 1px solid;
        @include border_bottom_color('viewBorderColor3');
        &-body {
          display: flex;
          &-div1 {
            flex: 1;
            position: relative;
            padding-left: 46px;
            @include font_color('mainFontColor2');
            img {
              position: absolute;
              top: 50%;
              left: 0%;
              transform: translate(0%, -50%);
              width: 36px;
              height: 36px;
              background: #fff;
              @include background('mainMapIconBackGroundColor');
              border-radius: 50%;
            }
          }
          &-div2 {
            flex: 1;
            text-align: right;
            @include font_color('mainFontColor2');
          }
          i {
             font-style: normal;
             font-size: 26px;
             color: #CDD8F7;
             @include font_color('bpFontColor3');
          }
          span {
            font-size: 26px;
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
        min-width: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 10px;
        border-radius: 10px;
        font-size: 20px;
        padding: 5px;
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
        // position: absolute;
        // top: 4px;
        // left: 6px;
        // font-weight: 300;
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
        @include font_color('bpFontColor4');
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
  // color: #CDD8F7;
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
  // box-shadow: inset 0 0 10px 0 #217bfc;
  @include box_shadow('viewRadioBoxShadow');
  opacity: 1;
}
.container-carrier-export{
  display: inline-block;
  float: right;
  cursor: pointer;
  margin-right: 30px;
  margin-top: 2px;
  img{
    height: 24px;
  }
}
.container-carrier-date {
  display: inline-block;
  float: right;
  margin-top: 5px;
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
.dcy_last_items{display: flex;
  .dcy_last_item_left,.dcy_last_item_right{
    width:300px
  }
  .last_item{
    height: 80px;
    display: flex;
    justify-content: space-around;
    // border-bottom: 1px solid #252F6E;
    border-bottom: 1px solid;
    @include border_color('viewBorderColor3');
    &:nth-last-of-type(1){border-bottom: none;}
    img{margin-right:16px;}
    div{
      display: flex;
      align-items: center;
      @include font_color('mainFontColor2');
     span{font-size: 26px;}
     i{
       font-style: normal;
       font-size: 26px;
       color: #CDD8F7;
       @include font_color('bpFontColor3');
     }
    }
  }
}
.container-carrier4-body-div-topl{
    font-size: 24px;
    font-family: "PingFang SC";
    font-weight: 500;
    margin: 0 auto;
    left: 10px;
    @include font_color('mainFontColor2');
}
.light_title{
  font-size: 13px;
    font-family: "PingFang SC";
    font-weight: 400;
    color: rgb(102, 102, 102);
}
</style>
