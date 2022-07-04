<template>
  <div class="container">
    <!-- 单元信息 -->
    <div class="container-row container-row1">
      <div v-loading="loadingPig" class="container-col1 container-marginTop2">
        <div class="container-title">单元基础信息（{{ unitInfo.pigType }}）</div>
        <div class="container-carrier1">
          <template v-for="(i, index) in unitInfo.data">
            <div
              v-if="i.status"
              :key="i.name"
              class="container-carrier1-row"
            >
              <div class="container-carrier1-row-l-icon">
                <img v-if="index === 0" src="@/assets/image/unitStatus/equipment-riling.svg">
                <img v-if="index === 1" src="@/assets/image/unitStatus/equipment-taici.svg">
                <img v-if="index === 2" src="@/assets/image/unitStatus/equipment-shuliang.svg">
                <img v-if="index === 3" src="@/assets/image/unitStatus/equipment-tizhong.svg">
                <img v-if="index === 4" src="@/assets/image/unitStatus/breederName.svg">
                <img v-if="index === 5" src="@/assets/image/unitStatus/breederNumber.svg">
              </div>
              <div>
                <div class="container-carrier1-row-l">
                  {{ i.name }}
                </div>
                <div class="container-carrier1-row-r">{{ i.number }}<span>{{ i.company }}</span></div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- 设备状态 -->
    <!-- 猪舍环境数据 -->
    <div class="container-row container-marginTop1 container-row3">
      <div class="container-head">
        设备状态({{ (this.info && this.info.overview && this.info.overview.statusOnline && this.info.overview.statusOnline === 1) ? '在线' : '离线' }})
        <button class="btn-blue buttons2 container-head-r2" @click="refresh">当前状态</button>
        <span class="container-head-r">数据上报时间：{{ uploadTime }}</span>
      </div>
      <div v-loading="loadingInfo" class="container-carrier3 overfolw">
        <div v-for="(i, index) in equipmentList" :key="index" class="container-carrier3-col">
          <div class="container-title">
            <span>{{ i.position }}</span>
            <!-- 传感器 -->
            <div class="container-carrier3-surface">
              <suspension v-if="i.sensing && (i.sensing !== 1)" type="sensing-off" title="温湿度传感器" value="开启" />
              <suspension v-if="i.sensing && (i.sensing === 1)" type="sensing-on" title="温湿度传感器" value="关闭" />
              <suspension v-if="-100<= i.signal && i.signal <= -75" type="signal1" title="信号强度" :value="i.signal" />
              <suspension v-else-if="-74<= i.signal && i.signal <= -50" type="signal2" title="信号强度" :value="i.signal" />
              <suspension v-else-if="-49<= i.signal && i.signal <= -25" type="signal3" title="信号强度" :value="i.signal" />
              <suspension v-else-if="-24<= i.signal && i.signal <= -1" type="signal4" title="信号强度" :value="i.signal" />
              <suspension v-if=" 1 <= i.voltage && i.voltage <= 2725 " type="voltage1" title="电池电压" :value="i.voltage" />
              <suspension v-else-if=" 2726 <= i.voltage && i.voltage <= 2950 " type="voltage2" title="电池电压" :value="i.voltage" />
              <suspension v-else-if=" 2951 <= i.voltage && i.voltage <= 3175 " type="voltage3" title="电池电压" :value="i.voltage" />
              <suspension v-else-if=" 3176 <= i.voltage " type="voltage4" title="电池电压" :value="i.voltage" />
            </div>
          </div>
          <div class="container-carrier3-col-main">
            <div class="container-carrier3-col-main-div" :class="(i.type !== '1' && i.type !== '2' ? 'container-carrier3-col-main-div2' : '')">
              <div class="container-carrier3-col-main-div-body">
                <div class="container-carrier3-col-main-div-body-div1">
                  <img v-if="i.type === '5'" src="@/assets/image/unitStatus/equipment-fengliang.png">
                  <img v-if="i.type !== '5'" src="@/assets/image/unitStatus/equipment-wendu.png">
                  {{ i.type === '5' ? '通风量' : '温度' }}
                </div>
                <div class="container-carrier3-col-main-div-body-div2">
                  <!-- <span>{{ i.temperature === -100 ? '-' : i.temperature }}</span> -->
                  <span>{{ ( i.temperature >= -99 && i.temperature !== null && i.temperature !== undefined) ? i.temperature : '-' }}</span>
                  <i>{{ i.type === '5' ? 'm³/h' : '°C' }}</i>
                </div>
              </div>
            </div>
            <div class="container-carrier3-col-main-div" :class="(i.type !== '1' && i.type !== '2' ? 'container-carrier3-col-main-div2' : '')">
              <div class="container-carrier3-col-main-div-body">
                <div class="container-carrier3-col-main-div-body-div1">
                  <img v-if="i.type === '5'" src="@/assets/image/unitStatus/equipment-fengsu.png">
                  <img v-if="i.type !== '5'" src="@/assets/image/unitStatus/equipment-shidu.png">
                  {{ i.type === '5' ? '风速' : '湿度' }}
                </div>
                <div class="container-carrier3-col-main-div-body-div2">
                  <span>{{ ( i.humidity >= -99 && i.humidity !== null && i.humidity !== undefined) ? i.humidity : '-' }}</span>
                  <i>{{ i.type === '5' ? 'm/s' : '%' }}</i>
                </div>
              </div>
            </div>
            <div v-if="i.type === '1' || i.type === '2'" class="container-carrier3-col-main-div">
              <div class="container-carrier3-col-main-div-body">
                <div class="container-carrier3-col-main-div-body-div1">
                  <img src="@/assets/image/unitStatus/equipment-wencha.png">
                  温差
                </div>
                <div class="container-carrier3-col-main-div-body-div2">
                  <!-- <span>{{ i.temperatureDiffer === -100 ? '-' : i.temperatureDiffer }}</span> -->
                  <span>{{ ( i.temperatureDiffer >= -99 && i.temperatureDiffer !== null && i.temperatureDiffer !== undefined) ? i.temperatureDiffer : '-' }}</span>
                  <i>°C</i>
                </div>
              </div>
            </div>
            <div v-if="i.type === '1' || i.type === '2'" class="container-carrier3-col-main-div">
              <div class="container-carrier3-col-main-div-body">
                <div class="container-carrier3-col-main-div-body-div1">
                  <img src="@/assets/image/unitStatus/equipment-shicha.png">
                  湿差
                </div>
                <div class="container-carrier3-col-main-div-body-div">
                  <!-- <span>{{ i.humidityDiffer === -100 ? '-' : i.humidityDiffer }}</span> -->
                  <span>{{ ( i.humidityDiffer >= -99 && i.humidityDiffer !== null && i.humidityDiffer !== undefined) ? i.humidityDiffer : '-' }}</span>
                  <i>%</i>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- 设备运行状态 -->
    <div v-loading="loadingInfo" class="container-row container-marginTop2">
      <div class="container-col2">
        <div class="container-title">
          设备运行状态
          <span v-if="flowMeter" class="container-head-r container-head-r3"><img src="@/assets/image/unitStatus/flowMeter.svg">喷淋流量器</span>
        </div>
      </div>
      <div class="container-carrier container-carrier4">
        <div class="container-carrier4-body">
          <div v-show="equipmentStatusList.length === 0" class="no-data-img"><img :src="noData | noDataFile('noData', 'svg')"></div>
          <template v-for="(i, index) in equipmentStatusList" v-show="equipmentStatusList.length > 0">
            <div
              v-if="i.status !== 255 && i.status !== null"
              :key="index"
              class="container-carrier4-body-div"
              :class="i.status === 0 ? '': i.status === 2 ? 'container-carrier4-body-divC3' : 'container-carrier4-body-divC2' "
            >
              <template v-if="i.tips !== '4'">
                <span v-if="i.tips && i.tips === '0'" class="iconfont container-carrier4-body-div-topl">{{ i.status }}%</span>
                <span v-if="i.tips && i.tips === '1'" class="iconfont container-carrier4-body-div-topl">{{ i.status }}HZ</span>
                <span v-if="i.tips && (i.tips === '0' || i.tips === '1')" class="iconfont container-carrier4-body-div-topr">{{ i.an }}A</span>
                <span v-if="i.tips && i.tips === '2'" class="iconfont container-carrier4-body-div-topr">{{ i.status }}%</span>
                <div
                  class="container-carrier4-body-div-border"
                  :class="i.status === 0 ? 'container-carrier4-body-div-border1': i.status === 2 ? 'container-carrier4-body-div-border3' : 'container-carrier4-body-div-border2'"
                >
                  <!-- v-if="i.name === '警铃' || i.name === '警灯'"  -->
                  <suspensionAlarm v-if="i.name === '警灯'" :info="equipmentAlarmDetails" />
                  <i
                    class="iconfont container-carrier4-body-div-icon"
                    :class="i.status === 0 ? 'container-carrier4-body-div-icon1': i.status === 2 ? 'container-carrier4-body-div-icon3' : 'container-carrier4-body-div-icon2'"
                    v-html="i.icon"
                  />
                  <img v-if="i.waring" src="@/assets/image/unitStatus/waring.png">
                </div>
              </template>
              <div
                v-if="i.tips === '4'"
                class="container-carrier4-body-div-border container-carrier4-body-div-border2 container-carrier4-body-div-icon2"
              >{{ i.dang }}</div>
              <span>{{ i.name }}</span>
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
              <div
                class="container-carrier-btn"
                :class="chartStatus === 'wind' ? 'container-carrier-btn-active' : ''"
                @click="switchLine('wind') "
              >通风量</div>
              <div
                class="container-carrier-btn"
                :class="chartStatus === 'equipment' ? 'container-carrier-btn-active' : ''"
                @click="switchLine('equipment') "
              >设备状态</div>
              <div
                class="container-carrier-btn"
                :class="chartStatus === 'gas' ? 'container-carrier-btn-active' : ''"
                @click="switchLine('gas') "
              >气体数据</div>
              <div class="container-carrier-dates">
                <div v-hasAuth="'fieldDeviceOverview:exportStatusData'" class="container-carrier-export" @click="exportData">
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

            <div class="container-carrier5-head-r" />
          </div>
          <div v-show="lineEchartsList.length === 0 && gasEchartsList.length === 0" class="no-data-img"><img src="@/assets/image/page/noData.png"></div>
          <div ref="tempChart" class="container-carrier5-chart" />

        </div>
      </div>
    </div>

  </div>
</template>

<script>
// getFieldPigInfo
import { getPeriodData, getGasData, getGasWarningData } from '@/http/api/mapMess'
import {
  // getListWeather,
  getPigOneInfo,
  initFile,
  exportFile,
  alarmInfo,
  getPigUnit,
  getFeedList
} from '@/http/api/fieldInfo'
// import weatherService from '@/lib/service/weather-service'
import navForm from '@/components/commonComponent/navForm/index.vue'
import suspension from '@/components/suspension'
import suspensionAlarm from '@/components/suspensionAlarm'
import feedMixin from '@/utils/mixin'

const unitInfo = {
  pigType: '-',
  data: [
    {
      number: '-',
      name: '日龄',
      position: 'left',
      company: '天',
      status: true
    },
    {
      number: '-',
      name: '母猪胎次',
      position: 'left',
      company: '',
      status: false
    },
    {
      number: '-',
      name: '装猪数量',
      position: 'top',
      company: '头',
      status: true
    },
    {
      number: '-',
      name: '单猪体重',
      position: 'right',
      company: 'kg',
      status: true
    },
    {
      number: '-',
      name: '饲养员',
      position: 'right',
      company: '',
      status: true
    },
    {
      number: '-',
      name: '工号',
      position: 'right',
      company: '',
      status: true
    }
  ]
}
const equipmentList = [
  {
    position: '室内前',
    temperature: '-',
    temperatureDiffer: '-',
    humidity: '-',
    humidityDiffer: '-',
    type: '1',
    sensing: '',
    signal: null,
    voltage: null
  },
  {
    position: '室内后',
    temperature: '-',
    temperatureDiffer: '-',
    humidity: '-',
    humidityDiffer: '-',
    type: '2',
    sensing: '',
    signal: null,
    voltage: null
  },
  {
    position: '室外',
    temperature: '-',
    temperatureDiffer: null,
    humidity: '-',
    humidityDiffer: null,
    type: '3',
    sensing: '',
    signal: null,
    voltage: null
  },
  {
    position: '暖灯',
    temperature: '-',
    temperatureDiffer: null,
    humidity: '-',
    humidityDiffer: null,
    type: '4',
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
]
export default {
  name: 'UnitMonitoring',
  components: {
    navForm,
    suspension,
    suspensionAlarm
  },
  mixins: [feedMixin],
  props: {
    info: {
      type: Object,
      default: function() {
        return {}
      }
    },
    unitId: String
  },
  data() {
    return {
      noData: '',
      flowMeter: false,
      pigType: null,
      // 当前时间
      currentTime: '',
      uploadTime: '-',
      testInterval: null,
      // 切换图标状态
      chartStatus: 'temperature',
      lineDate: null,
      unitInfo: unitInfo,
      weatherList: [],
      equipmentList: equipmentList,
      // 设备列表
      // equipmentList:[],
      // status： 1-在线 2-离线
      equipmentStatusList: [],
      // 设备ID
      equipmentDeviceId: null,
      equipmentAlarmDetails: [],
      lineEchartsList: [],
      gasEchartsList: [],
      alarmEchartsList: [],
      showEcharysList: null,
      echartsResize: null,
      navFormInfo: {
        data: { time: [this.getDateDiff(4), this.getCurrentTime('')] },
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
      timer: null,
      loadingInfo: true,
      loadingEchart: true,
      loadingWeather: true,
      loadingPig: true,
      periodStatus: true,
      gasStatus: true,
      gasWarnStatus: true
    }
  },
  computed: {
    allStyles() {
      return this.$store.state.echartStyle.allStyles
    }
  },
  watch: {
    'allStyles.flag'(newValue, oldValue) {
      this.showEcharysList && this.switchLine(this.chartStatus) // 自己绘制echarts的方法
    },
    unitId(newValue, oldValue) {
      this.resetInfo()
      this.init()
    }
  },
  beforeRouteLeave(to, form, next) {
    clearInterval(this.exportFileListInter)
    clearInterval(this.timer)
    window.onresize = null
    next()
  },
  beforeDestroy() {
    clearInterval(this.exportFileListInter)
    clearInterval(this.timer)
  },
  created() {
    // this.initUrl()
  },
  mounted() {
    this.initdate()
    this.currentTime = this.getCurrentTime('')
    this.init()
  },
  methods: {
    initUrl() {
      this.noData = this.$getImgUrl('noData', 'svg')
    },
    initdate() {
      if (!this.navFormInfo.data.time || this.navFormInfo.data.time.length === 0) {
        this.navFormInfo.data.time = [this.getCurrentTime((new Date()).getTime() - 1000 * 60 * 60 * 24), this.getCurrentTime('')]
      }
    },
    init() {
      clearInterval(this.exportFileListInter)
      clearInterval(this.timer)
      if (this.info && this.info.overview && this.info.selectedOption) {
        this.getPigData()
        this.getPigInfo()
        this.getPigDay()
        // this.getWeatherData()
        this.getFeedInfo()
        this.automatic()
      } else {
        this.$message.error('信息丢失，请重选单元')
        this.loadingInfo = false
        this.loadingEchart = false
        // this.loadingWeather = false
        this.loadingPig = false
      }
    },
    automatic() {
      clearInterval(this.exportFileListInter)
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.refresh()
      }, 1000 * 60 * 3)
    },
    // 重置信息
    resetInfo() {
      this.flowMeter = false
      this.uploadTime = '-'
      this.weatherList = []
      this.unitInfo = null
      this.unitInfo = unitInfo
      this.equipmentList = null
      this.equipmentList = equipmentList
      this.equipmentStatusList = []
      this.navFormInfo.data.time = [this.getDateDiff(4), this.getCurrentTime('')]
      this.chartStatus = 'temperature'
      this.equipmentAlarmDetails = []
      this.lineEchartsList = []
      this.showEcharysList = null
    },
    refresh() {
      if (this.info && this.info.overview && this.info.selectedOption) {
        this.currentTime = this.getCurrentTime('')
        this.navFormInfo.data.time = [this.getDateDiff(4), this.getCurrentTime('')]
        this.getPigInfo()
        this.getPigDay()
        this.getFeedInfo()
        this.getPigData()
      } else {
        this.$message.error('信息丢失，请重选单元')
      }
    },
    dateTimeChange(event) {
      if (this.info && this.info.overview && this.info.selectedOption) {
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
          text: `头均通风量${data.titleData || '---'} m³/h`,
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
            if (this.chartStatus !== 'equipment') {
              if (params.seriesName.indexOf('温度') > -1) {
                return params.seriesName + ': ' + params.value + '℃' + '<br/>' + params.data.time
              } else if (params.seriesName.indexOf('湿度') > -1) {
                return params.seriesName + ': ' + params.value + '%' + '<br/>' + params.data.time
              } else {
                return params.seriesName + ': ' + params.value + '<br/>' + params.data.time
              }
            } else {
              const d = params.data
              const model = d.model === 0 ? '停止' : d.model === 1 ? '增湿' : d.model === 2 ? '降温' : '-'
              let str = ''
              if (d.value === 0) {
                str = `${params.seriesName}状态：${d.status}<br/>关闭时长：${d.close || '-'}秒<br/>工作模式：${model}<br/>${d.time || '-'}`
              } else {
                str = `${params.seriesName}状态：${d.status}<br/>开启时长：${d.open || '-'}秒<br/>工作模式：${model}<br/>${d.time || '-'}`
              }
              return str
            }
          }
        },
        dataZoom: {
          id: 'dataZoomX',
          type: 'inside',
          xAxisIndex: [0],
          filterMode: 'none',
          start: 0,
          end: 100,
          throttle: 200
        },
        legend: {
          data: data.headName,
          selected: data.hideLine,
          textStyle: { color: '#CDD8F7' },
          color: data.color,
          bottom: '6%'
        },
        grid: {
          left: '30px',
          right: '60px',
          top: '13%',
          bottom: '18%',
          containLabel: true
        },
        xAxis: {
          // x轴坐标系
          data: time,
          boundaryGap: true,
          type: 'category',
          axisLine: { lineStyle: { color: '#CDD8F7' }},
          axisLabel: {
            textStyle: { color: '#CDD8F7' },
            rotate: 45,
            fontSize: 8
          }
        },
        yAxis: data.yAxis,
        series: data.series
      }
      const DOM = this.$refs.tempChart
      if (DOM) {
        const myChart = this.$echarts.init(DOM)
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
          lineOptions.yAxis[2].axisLine.lineStyle.color = this.allStyles.yAxisColor
          lineOptions.yAxis[2].axisLabel.textStyle.color = this.allStyles.yAxisName
          lineOptions.yAxis[2].nameTextStyle.color = this.allStyles.yAxisName
          lineOptions.yAxis[2].splitLine.lineStyle.color = this.allStylineOptions
        } else if (chartStatus === 'fanGear') {
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
        } else if (chartStatus === 'wind') {
          lineOptions.title.textStyle.color = this.allStyles.titleColor
          lineOptions.xAxis.axisLine.lineStyle.color = this.allStyles.xAxisColor
          lineOptions.xAxis.axisLabel.textStyle.color = this.allStyles.xAxisName //  #FF3939
          lineOptions.legend.textStyle.color = this.allStyles.xAxisName
          lineOptions.yAxis.axisLine.lineStyle.color = this.allStyles.yAxisColor
          lineOptions.yAxis.axisLabel.textStyle.color = this.allStyles.yAxisName
          lineOptions.yAxis.nameTextStyle.color = this.allStyles.yAxisName
          lineOptions.yAxis.splitLine.lineStyle.color = this.allStylineOptions
        } else if (chartStatus === 'equipment') {
          lineOptions.xAxis.axisLine.lineStyle.color = this.allStyles.xAxisColor
          lineOptions.xAxis.axisLabel.textStyle.color = this.allStyles.xAxisName //  #FF3939
          lineOptions.legend.textStyle.color = this.allStyles.xAxisName
          lineOptions.yAxis[0].axisLine.lineStyle.color = this.allStyles.yAxisColor
          lineOptions.yAxis[0].axisLabel.textStyle.color = this.allStyles.yAxisName
          lineOptions.yAxis[0].nameTextStyle.color = this.allStyles.yAxisName
          lineOptions.yAxis[0].splitLine.lineStyle.color = this.allStylineOptions
        } else if (chartStatus === 'gas') {
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
        console.log('chartStatus---', chartStatus)
        console.log('lineOptions---', lineOptions)
        myChart.setOption(lineOptions, true)
        // 浏览器窗口变化随之适配
        window.onresize = () => {
          clearTimeout(this.echartsResize)
          this.echartsResize = setTimeout(() => {
            myChart.resize()
          }, 1000)
        }
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
    // 切换图表
    switchLine(type) {
      this.chartStatus = type
      let lineList
      if (type === 'temperature') {
        lineList = {
          titleS: false,
          headName: [
            '室内前温度',
            '室内后温度',
            '室外温度',
            '室内平均温度',
            '暖灯温度',
            '室内平均湿度',
            '室内前湿度',
            '室内后湿度',
            '室外湿度',
            '喷淋1状态'
          ],
          Yname: '°C',
          hideLine: {
            室内前温度: false,
            室内后温度: false,
            室外温度: false,
            室内平均温度: true,
            暖灯温度: false,
            室内平均湿度: true,
            室内前湿度: false,
            室内后湿度: false,
            室外湿度: false,
            喷淋1状态: true
          },
          // color: ['#FF2727', '#48E0F4', '#43F354', '#385BFF', '#945FB9', '#1F9493' ],
          yAxis: [
            {
              type: 'value',
              name: '°C',
              // y轴数值自适应
              scale: true,
              // Y轴分成几行
              // splitNumber: 5,
              // boundaryGap: [0, 1],
              // max: 17,
              axisLine: { lineStyle: { color: '#CDD8F7' }},
              nameTextStyle: {},
              axisLabel: {
                textStyle: { color: '#CDD8F7' }
                // formatter: (value) => {
                //   return value.toFixed(1)
                // }
              },
              // 去除网格线
              splitLine: { lineStyle: { color: ['#3E477F'] }},
              // Y轴刻度线对齐
              // min: this.showEcharysList.time_min,
              // max: this.showEcharysList.time_max,
              splitNumber: 5
              // interval: Math.round((this.showEcharysList.time_max - this.showEcharysList.time_min) / 5 * 10) / 10
              // interval: (this.showEcharysList.time_max - this.showEcharysList.time_min) / 5
            },
            {
              type: 'value',
              name: '%',
              // y轴数值自适应
              scale: true,
              // Y轴分成几行
              // splitNumber: 5,
              axisLine: { lineStyle: { color: '#CDD8F7' }},
              nameTextStyle: {},
              axisLabel: {
                textStyle: { color: '#CDD8F7' }
                // formatter: (value) => {
                //   return value.toFixed(1)
                // }
              },
              // 去除网格线
              splitLine: { lineStyle: { color: ['rgba(0,0,0,0)'] }},
              // Y轴刻度线对齐
              // min: this.showEcharysList.humi_min,
              // max: this.showEcharysList.humi_max,
              splitNumber: 5
              // interval: Math.round((this.showEcharysList.humi_max - this.showEcharysList.humi_min) / 5 * 10) / 10
              // interval: (this.showEcharysList.humi_max - this.showEcharysList.humi_min) / 5
            },
            {
              type: 'value',
              name: '喷淋1状态',
              min: 0,
              max: 1,
              // Y轴位置
              offset: 45,
              // 上下距离的位置
              // nameGap: 30,
              interval: 25,
              // Y轴分成几行
              splitNumber: 1,
              nameTextStyle: {},
              axisLine: { lineStyle: { color: '#CDD8F7' }},
              axisLabel: { textStyle: { color: '#CDD8F7' }},
              // 去除网格线
              splitLine: { lineStyle: { color: ['#3E477F'] }}
            }
          ],
          series: [
            {
              type: 'line',
              name: '室内前温度',
              data: this.showEcharysList.temp_inner1,
              itemStyle: {
                normal: { color: '#385BFF', lineStyle: { color: '#385BFF' }}
              },
              yAxisIndex: 0
            },
            {
              type: 'line',
              name: '室内后温度',
              data: this.showEcharysList.temp_inner2,
              itemStyle: {
                normal: { color: '#48E0F4', lineStyle: { color: '#48E0F4' }}
              },
              yAxisIndex: 0
            },
            {
              type: 'line',
              name: '室外温度',
              data: this.showEcharysList.temp_outer,
              itemStyle: {
                normal: { color: '#20D332', lineStyle: { color: '#20D332' }}
              },
              yAxisIndex: 0
            },
            {
              type: 'line',
              name: '室内平均温度',
              data: this.showEcharysList.temp_avg,
              itemStyle: {
                normal: { color: '#F9BF00', lineStyle: { color: '#F9BF00' }}
              },
              yAxisIndex: 0
            },
            {
              type: 'line',
              name: '暖灯温度',
              data: this.showEcharysList.temp_light,
              itemStyle: {
                normal: { color: '#19FD9A', lineStyle: { color: '#19FD9A' }}
              },
              yAxisIndex: 0
            },
            // 湿度-------------------
            {
              type: 'line',
              name: '室内平均湿度',
              data: this.showEcharysList.humi_avg,
              itemStyle: {
                normal: { color: '#9C19FD', lineStyle: { color: '#9C19FD' }}
              },
              yAxisIndex: 1
            },
            {
              type: 'line',
              name: '室内前湿度',
              data: this.showEcharysList.humi_inner1,
              itemStyle: {
                normal: { color: '#D7BA00', lineStyle: { color: '#D7BA00' }}
              },
              yAxisIndex: 1
            },
            {
              type: 'line',
              name: '室内后湿度',
              data: this.showEcharysList.humi_inner2,
              itemStyle: {
                normal: { color: '#7CB0FF', lineStyle: { color: '#7CB0FF' }}
              },
              yAxisIndex: 1
            },
            {
              type: 'line',
              name: '室外湿度',
              data: this.showEcharysList.humi_outer,
              itemStyle: {
                normal: { color: '#D26ECC', lineStyle: { color: '#D26ECC' }}
              },
              yAxisIndex: 1
            },
            // -----------------------
            {
              type: 'line',
              name: '喷淋1状态',
              data: this.showEcharysList.shower,
              itemStyle: {
                normal: { color: '#6284FA', lineStyle: { color: '#6284FA' }}
              },
              yAxisIndex: 2
            }
          ]
        }
      } else if (type === 'fanGear') {
        lineList = {
          titleS: false,
          headName: ['室内平均温度', '当前风机档位'],
          Yname: '%',
          // hideLine: {
          //   室内前湿度: true,
          //   室内后湿度: true,
          //   室外湿度: true,
          //   喷淋1状态: true
          // },
          yAxis: [
            {
              type: 'value',
              name: '°C',
              // y轴数值自适应
              scale: true,
              nameTextStyle: {},
              axisLine: { lineStyle: { color: '#CDD8F7' }},
              axisLabel: {
                textStyle: { color: '#CDD8F7' }
              },
              // 去除网格线
              splitLine: { lineStyle: { color: ['#3E477F'] }},
              splitNumber: 5
            },
            {
              type: 'value',
              name: '',
              // y轴数值自适应
              scale: true,
              nameTextStyle: {},
              axisLine: { lineStyle: { color: '#CDD8F7' }},
              axisLabel: { textStyle: { color: '#CDD8F7' }},
              // 去除网格线
              splitLine: { lineStyle: { color: ['rgba(0,0,0,0)'] }}
            }
          ],
          series: [
            {
              type: 'line',
              name: '室内平均温度',
              data: this.showEcharysList.temp_avg,
              itemStyle: {
                normal: { color: '#385BFF', lineStyle: { color: '#385BFF' }}
              },
              yAxisIndex: 0
            },
            {
              type: 'line',
              name: '当前风机档位',
              data: this.showEcharysList.fanGear,
              itemStyle: {
                normal: { color: '#20D332', lineStyle: { color: '#20D332' }}
              },
              yAxisIndex: 1
            }
            // {
            //   type: 'line',
            //   name: '室外湿度',
            //   data: this.showEcharysList.humi_outer,
            //   itemStyle: {
            //     normal: { color: '#20D332', lineStyle: { color: '#20D332' }}
            //   },
            //   yAxisIndex: 0
            // },
            // {
            //   type: 'line',
            //   name: '喷淋1状态',
            //   data: this.showEcharysList.shower2,
            //   itemStyle: {
            //     normal: { color: '#F9BF00', lineStyle: { color: '#F9BF00' }}
            //   },
            //   yAxisIndex: 1
            // }
          ]
        }
      } else if (type === 'wind') {
        lineList = {
          titleS: true,
          titleData: this.showEcharysList.avg_wind || '---',
          headName: ['实际通风量'],
          Yname: 'm³/h',
          hideLine: { 实际通风量: true },
          yAxis: {
            type: 'value',
            name: 'm³/h',
            // y轴数值自适应
            scale: true,
            nameTextStyle: {},
            axisLine: { lineStyle: { color: '#CDD8F7' }},
            axisLabel: { textStyle: { color: '#CDD8F7' }},
            // 去除网格线
            splitLine: { lineStyle: { color: ['#3E477F'] }}
          },
          series: [
            {
              type: 'line',
              name: '实际通风量',
              data: this.showEcharysList.wind,
              itemStyle: {
                normal: { color: '#385BFF', lineStyle: { color: '#385BFF' }}
              }
            }
          ]
        }
      } else if (type === 'equipment') {
        lineList = {
          titleS: false,
          headName: ['喷淋1', '喷淋2'],
          Yname: '',
          yAxis: [
            {
              type: 'value',
              name: '喷淋状态',
              // y轴数值自适应
              // scale: true,
              min: 0,
              max: 1,
              axisLine: { lineStyle: { color: '#CDD8F7' }},
              axisLabel: {
                textStyle: { color: '#CDD8F7' }
              },
              // 去除网格线
              splitLine: { lineStyle: { color: ['#3E477F'] }},
              splitNumber: 1,
              nameTextStyle: {}
            }
          ],
          series: [
            {
              type: 'line',
              name: '喷淋1',
              data: this.showEcharysList.shower1Switch,
              itemStyle: {
                normal: { color: '#385BFF', lineStyle: { color: '#385BFF' }}
              },
              yAxisIndex: 0
            },
            {
              type: 'line',
              name: '喷淋2',
              data: this.showEcharysList.shower2Switch,
              itemStyle: {
                normal: { color: '#F9BF00', lineStyle: { color: '#F9BF00' }}
              },
              yAxisIndex: 0
            }
          ]
        }
      } else if (type === 'gas') {
        lineList = {
          titleS: false,
          headName: ['NH3浓度', 'NH3预警', 'CO2浓度', 'CO2预警'],
          Yname: '%',
          // hideLine: {
          //   室内前湿度: true,
          //   室内后湿度: true,
          //   室外湿度: true,
          //   喷淋1状态: true
          // },
          yAxis: [
            {
              type: 'value',
              name: 'NH3/ppm',
              // y轴数值自适应
              scale: true,
              nameTextStyle: {},
              axisLine: { lineStyle: { color: '#CDD8F7' }},
              axisLabel: {
                textStyle: { color: '#CDD8F7' }
              },
              // 去除网格线
              splitLine: { lineStyle: { color: ['#3E477F'] }},
              splitNumber: 5
            },
            {
              type: 'value',
              name: 'CO2/ppm',
              // y轴数值自适应
              scale: true,
              nameTextStyle: {},
              axisLine: { lineStyle: { color: '#CDD8F7' }},
              axisLabel: { textStyle: { color: '#CDD8F7' }},
              // 去除网格线
              splitLine: { lineStyle: { color: ['rgba(0,0,0,0)'] }}
            }
          ],
          series: [
            {
              type: 'line',
              name: 'NH3浓度',
              data: this.showEcharysList.nh3_concent,
              itemStyle: {
                normal: { color: '#385BFF', lineStyle: { color: '#385BFF' }}
              },
              yAxisIndex: 0
            },
            {
              type: 'line',
              name: 'NH3预警',
              data: this.showEcharysList.nh3_warning,
              itemStyle: {
                normal: { color: '#FF2727', lineStyle: { color: '#FF2727' }}
              },
              yAxisIndex: 0
            },
            {
              type: 'line',
              name: 'CO2浓度',
              data: this.showEcharysList.co2_concent,
              itemStyle: {
                normal: { color: '#20D332', lineStyle: { color: '#20D332' }}
              },
              yAxisIndex: 1
            },
            {
              type: 'line',
              name: 'CO2预警',
              data: this.showEcharysList.co2_warning,
              itemStyle: {
                normal: { color: '#F9BF00', lineStyle: { color: '#F9BF00' }}
              },
              yAxisIndex: 1
            }
          ]
        }
      }
      const times = (type === 'gas') ? this.showEcharysList.time2 : this.showEcharysList.time
      if (lineList) {
        this.setLineChart(lineList, times)
      }
    },
    // 处理图表数据
    handleData() {
      // 时间
      const time = []

      // 室内前温度
      const temp_inner1 = []
      // 室内后温度
      const temp_inner2 = []
      // 室外温度
      const temp_outer = []
      // 室内平均温度
      const temp_avg = []
      // 暖灯温度
      const temp_light = []
      // 喷淋1
      const shower = []

      // 室内平均湿度
      const humi_avg = []
      // 室内前湿度
      const humi_inner1 = []
      // 室内后湿度
      const humi_inner2 = []
      // 室外湿度
      const humi_outer = []
      // 喷淋1
      const shower2 = []
      const temp_all = []
      const humi_all = []

      // 风机档位
      const fanGear = []
      // 喷淋1开关
      const shower1Switch = []
      // 喷淋2开关
      const shower2Switch = []
      // 头均通风量
      let avg_wind = '-'
      const time2 = []
      // NH3浓度
      const nh3_concent = []
      // CO2浓度
      const co2_concent = []
      // NH3预警
      const nh3_warning = []
      // CO2预警
      const co2_warning = []
      if (this.lineEchartsList.length > 0) {
        const pigNumber = this.unitInfo.data[2].number
        const actualWind = (this.lineEchartsList[this.lineEchartsList.length - 1] && this.lineEchartsList[this.lineEchartsList.length - 1].actualWind) || ''
        if (actualWind && pigNumber && pigNumber !== '-') {
          avg_wind = (actualWind / pigNumber).toFixed(2)
        }
      }

      // 实际通风量
      const wind = []
      for (const i of this.lineEchartsList) {
        // const avg = parseInt(((i.temperatureInner1 + i.temperatureInner2) / 2) * 10) / 10
        const t = i.uploadTime ? (i.uploadTime.split('-')[1] + '/' + i.uploadTime.split('-')[2]) : ''
        const tt = i.uploadTime ? t.split(':')[0] + ':' + t.split(':')[1] : ''
        time.push(tt)

        temp_inner1.push({ value: (i.temperatureInner1 === -100 ? null : i.temperatureInner1), time: i.uploadTime })
        temp_inner2.push({ value: (i.temperatureInner2 === -100 ? null : i.temperatureInner2), time: i.uploadTime })
        temp_outer.push({ value: (i.temperatureOuter === -100 ? null : i.temperatureOuter), time: i.uploadTime })
        // temp_avg.push({ value: (avg === -100 ? null : avg), time: i.uploadTime })
        temp_avg.push({ value: (i.adoptTemperature === -100 ? null : i.adoptTemperature), time: i.uploadTime })
        temp_light.push({ value: (i.temperatureLight === -100 ? null : i.temperatureLight), time: i.uploadTime })
        shower.push({ value: (i.showerStatus1 === -100 ? null : i.showerStatus1), time: i.uploadTime })

        // temp_inner1.push(i.temperatureInner1 === -100 ? null : i.temperatureInner1)
        // temp_inner2.push(i.temperatureInner2 === -100 ? null : i.temperatureInner2)
        // temp_outer.push(i.temperatureOuter === -100 ? null : i.temperatureOuter)
        // temp_avg.push(avg === -100 ? null : avg)
        // temp_light.push(i.temperatureLight === -100 ? null : i.temperatureLight)
        // shower.push(i.showerStatus1 === -100 ? null : i.showerStatus1)

        humi_avg.push({ value: (i.adoptHumidity === -100 ? null : i.adoptHumidity), time: i.uploadTime })
        humi_inner1.push({ value: (i.humiditieInner1 === -100 ? null : i.humiditieInner1), time: i.uploadTime })
        humi_inner2.push({ value: (i.humiditieInner2 === -100 ? null : i.humiditieInner2), time: i.uploadTime })
        humi_outer.push({ value: (i.humiditieOuter === -100 ? null : i.humiditieOuter), time: i.uploadTime })

        // humi_avg.push(i.adoptHumidity === -100 ? null : i.adoptHumidity)
        // humi_inner1.push(i.humiditieInner1 === -100 ? null : i.humiditieInner1)
        // humi_inner2.push(i.humiditieInner2 === -100 ? null : i.humiditieInner2)
        // humi_outer.push(i.humiditieOuter === -100 ? null : i.humiditieOuter)

        // shower2.push(i.showerStatus2 === -100 ? null : i.showerStatus2)

        fanGear.push({ value: (i.fanGear === -100 ? null : i.fanGear), time: i.uploadTime })

        wind.push({ value: (i.actualWind === -100 ? null : i.actualWind), time: i.uploadTime })
        // wind.push(i.actualWind === -100 ? null : i.actualWind)

        shower1Switch.push({
          value: (i.showerStatus1 === -100 ? null : i.showerStatus1),
          status: i.showerStatus1 === 0 ? '关闭' : '开启',
          open: i.showerOpenDuration,
          close: i.showerCloseDuration,
          model: i.showerMode,
          time: i.uploadTime
        })
        shower2Switch.push({
          value: (i.showerStatus2 === -100 ? null : i.showerStatus2),
          status: i.showerStatus2 === 0 ? '关闭' : '开启',
          open: i.shower2OpenDuration,
          close: i.shower2CloseDuration,
          model: i.shower2Mode,
          time: i.uploadTime
        })

        temp_all.push(i.temperatureInner1 === -100 ? null : i.temperatureInner1)
        temp_all.push(i.temperatureInner2 === -100 ? null : i.temperatureInner2)
        temp_all.push(i.temperatureOuter === -100 ? null : i.temperatureOuter)
        temp_all.push(i.temperatureLight === -100 ? null : i.temperatureLight)
        temp_all.push(i.showerStatus1 === -100 ? null : i.showerStatus1)

        humi_all.push(i.adoptHumidity === -100 ? null : i.adoptHumidity)
        humi_all.push(i.humiditieInner1 === -100 ? null : i.humiditieInner1)
        humi_all.push(i.humiditieInner2 === -100 ? null : i.humiditieInner2)
        humi_all.push(i.humiditieOuter === -100 ? null : i.humiditieOuter)
      }
      for (const i of this.gasEchartsList) {
        const t = i.collectTime ? (i.collectTime.split('-')[1] + '/' + i.collectTime.split('-')[2]) : ''
        const tt = i.collectTime ? t.split(':')[0] + ':' + t.split(':')[1] : ''
        time2.push(tt)

        nh3_concent.push({ value: (i.nh3 === -100 ? null : i.nh3), time: i.collectTime })
        co2_concent.push({ value: (i.co2 === -100 ? null : i.co2), time: i.collectTime })
        nh3_warning.push({ value: (this.alarmEchartsList.NH3 === -100 ? null : this.alarmEchartsList.NH3), time: i.collectTime })
        co2_warning.push({ value: (this.alarmEchartsList.CO2 === -100 ? null : this.alarmEchartsList.CO2), time: i.collectTime })
      }
      const time_arr = temp_all.filter(item => item)
      const humi_arr = humi_all.filter(item => item)
      const data = {
        time: time,
        time2: time2,
        temp_inner1: temp_inner1,
        temp_inner2: temp_inner2,
        temp_outer: temp_outer,
        temp_avg: temp_avg,
        temp_light: temp_light,
        shower: shower,
        avg_wind: avg_wind,

        humi_avg: humi_avg,
        humi_inner1: humi_inner1,
        humi_inner2: humi_inner2,
        humi_outer: humi_outer,
        shower2: shower2,

        wind: wind,
        fanGear: fanGear,
        shower1Switch: shower1Switch,
        shower2Switch: shower2Switch,

        nh3_concent: nh3_concent,
        co2_concent: co2_concent,
        nh3_warning: nh3_warning,
        co2_warning: co2_warning,

        time_max: Math.max(...time_arr) + 0.2,
        time_min: Math.min(...time_arr),
        humi_max: Math.max(...humi_arr) + 10,
        humi_min: Math.min(...humi_arr)
      }
      this.showEcharysList = data
      this.switchLine(this.chartStatus)
    },
    nDate(t) {
      const date1 = new Date()
      const date2 = new Date(date1)
      date2.setDate(date1.getDate() + t)
      const day = date2.getDate() < 10 ? '0' + date2.getDate() : date2.getDate()
      const time2 = date2.getFullYear() + '-' + (date2.getMonth() + 1) + '-' + day
      return time2
    },
    getWeek(dateString) {
      const dateArray = dateString.split('-')
      const date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2])
      return '周' + '日一二三四五六'.charAt(date.getDay())
    },
    getDateDiff(setdateTimeStamp) {
      const difference_t = 1000 * 60 * 60 * setdateTimeStamp
      const d = new Date()
      const now_t = d.getTime()
      const return_t = now_t - difference_t
      return this.getCurrentTime(return_t)
    },
    //
    handleUnitInfo(d) {
      this.unitInfo.data[0].name = '日龄'
      this.unitInfo.data[1].status = false
      this.unitInfo.data[3].name = '单猪体重'
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
          this.unitInfo.data[1].status = true
          this.unitInfo.data[3].name = '母猪体重'
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
      this.unitInfo.data[0].number = d.pigDays || '-'
      this.unitInfo.data[1].number = d.batchNo || '-'
      this.unitInfo.data[2].number = d.pigCount || '-'
      this.unitInfo.data[3].number = d.weight || '-'
      // this.unitInfo.data[4].number
      // this.unitInfo.data[5].number
    },
    // 猪舍数据统计图
    async getPigData() {
      this.loadingEchart = true
      this.periodStatus = true
      this.gasStatus = true
      this.gasWarnStatus = true
      const data = {
        regionId: this.info.selectedOption[0],
        areaId: this.info.selectedOption[1],
        fieldId: this.info.selectedOption[2],
        segmentId: this.info.overview.segmentId,
        unit: this.info.overview.unit,

        startTime: this.navFormInfo.data.time[0],
        endTime: this.navFormInfo.data.time[1]
      }
      // 猪舍环境
      await getPeriodData(data).then((res) => {
        this.periodStatus = false
        if (res && res.status === 200 && res.rel) {
          this.lineEchartsList = res.data
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.periodStatus = false
      })
      const d = {
        regionId: this.info.selectedOption[0],
        areaId: this.info.selectedOption[1],
        fieldId: this.info.selectedOption[2],
        segmentId: this.info.overview.segmentId,
        unitName: this.info.overview.unit,
        startTime: this.navFormInfo.data.time[0],
        endTime: this.navFormInfo.data.time[1]
      }
      // 猪舍气体
      await getGasData(d).then((res) => {
        console.log('qiti', res)
        this.gasStatus = false
        if (res && res.status === 200 && res.rel) {
          this.gasEchartsList = res.data
          // this.handleData()
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.gasStatus = false
      })
      const alarmD = {
        segmentId: this.info.overview.segmentId
      }
      // 猪舍预警
      await getGasWarningData(alarmD).then((res) => {
        this.gasWarnStatus = false
        console.log('预警', res)
        if (res && res.status === 200 && res.rel) {
          this.alarmEchartsList = res.data
          // this.handleData()
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.gasWarnStatus = false
      })
      if (!this.periodStatus && !this.gasStatus && !this.gasWarnStatus) {
        console.log(11111)
        this.loadingEchart = false
        this.handleData()
      }
    },
    // 天气信息
    // async getWeatherData() {
    //   this.loadingWeather = true
    //   const data = {
    //     endDay: this.nDate(4),
    //     fieldId: this.info.selectedOption[2],
    //     startDay: this.currentTime.split(' ')[0]
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
        regionld: this.info.selectedOption[0],
        areaId: this.info.selectedOption[1],
        fieldId: this.info.selectedOption[2],
        segmentId: this.info.overview.segmentId,
        unit: routeUnit
      }
      await getPigUnit(data).then((res) => {
        this.loadingPig = false
        if (res && res.status === 200 && res.rel) {
          if (res.data) {
            this.handleUnitInfo(res.data)
          } else {
            this.handleUnitInfo({})
          }
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.loadingPig = false
        // this.$message.error(err.message)
      })
    },
    // 饲养员
    async getFeedInfo() {
      let routeUnit = ''
      if (this.info.overview.unit) {
        routeUnit = this.info.overview.unit
      } else {
        routeUnit = this.info.overview.unitName
      }
      const data = {
        fieldId: this.info.selectedOption[2],
        segmentId: this.info.overview.segmentId,
        unitId: routeUnit
      }
      await getFeedList(data).then((res) => {
        if (res && res.status === 200 && res.rel) {
          if (res.data) {
            this.unitInfo.data[4].number = res.data.breederName
            this.unitInfo.data[5].number = res.data.breederNumber
          } else {
            this.unitInfo.data[4].number = '-'
            this.unitInfo.data[5].number = '-'
          }
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        // this.$message.error(err.message)
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
        regionld: this.info.selectedOption[0],
        areaId: this.info.selectedOption[1],
        fieldId: this.info.selectedOption[2],
        segmentId: this.info.overview.segmentId,
        unit: routeUnit
      }
      await getPigOneInfo(data).then((res) => {
        this.loadingInfo = false
        if (res && res.status === 200 && res.data) {
          this.$emit('childrenInfo', res)
          this.handlePigInfo(res)
        } else {
          // this.emptyPigInfo()
          this.handlePigInfo(res)
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.loadingInfo = false
        // this.$message.error(err.message)
      })
    },
    // 初始化导出文件
    async exportData() {
      if (!this.info || !this.info.overview || !this.info.selectedOption) {
        this.$message.error('信息丢失，请重选单元')
        return
      }
      this.loadingEchart = true
      const data = {
        regionld: this.info.selectedOption[0],
        areaId: this.info.selectedOption[1],
        fieldId: this.info.selectedOption[2],
        segmentId: this.info.overview.segmentId,
        unit: this.info.overview.unit,
        startTime: this.navFormInfo.data.time[0],
        endTime: this.navFormInfo.data.time[1]
      }
      await initFile(data).then((res) => {
        if (res && res.status === 200 && res.rel) {
          this.exportFileListInter = setInterval(() => {
            this.exportFileList()
          }, 1000)
        } else {
          this.loadingEchart = false
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.loadingEchart = false
        // this.$message.error(err.message)
      })
    },
    // 导出
    async exportFileList() {
      const data = {
        regionld: this.info.selectedOption[0],
        areaId: this.info.selectedOption[1],
        fieldId: this.info.selectedOption[2],
        segmentId: this.info.overview.segmentId,
        unit: this.info.overview.unit,
        startTime: this.navFormInfo.data.time[0],
        endTime: this.navFormInfo.data.time[1]
      }
      await exportFile(data).then((res) => {
        if (res && res.status === 200 && res.rel) {
          if (res.data.exceptionStatus === 0) {
            this.loadingEchart = false
            clearInterval(this.exportFileListInter)
            window.open(res.data.downloadUrl)
          }
        } else {
          this.loadingEchart = false
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.loadingEchart = false
        // this.$message.error(err.message)
      })
    },
    // 告警详情
    async getalarmInfo() {
      const data = {
        deviceId: this.equipmentDeviceId
      }
      await alarmInfo(data).then(res => {
        if (res && res.status === 200) {
          this.equipmentAlarmDetails = res.data.rows
        }
      }).catch(() => {
        this.loadingEchart = false
        // this.$message.error(err.message)
      })
    },
    // 清空猪舍信息
    emptyPigInfo(res) {
      this.handlePigInfo(res.data)
    },
    // 处理猪舍信息
    handlePigInfo(res) {
      const data = JSON.parse(JSON.stringify(res.data))
      if (!res.data) {
        return
      }
      // 设备ID
      if (data && data.deviceId) {
        this.equipmentDeviceId = data.deviceId
        this.getalarmInfo()
      }
      // 数据更新时间
      this.uploadTime = data && data.uploadTime || '-'
      // 室内前
      this.equipmentList[0].temperature = (data && data.temperatureInner1) ?? '-'
      this.equipmentList[0].humidity = (data && data.humiditieInner1) ?? '-'
      this.equipmentList[0].temperatureDiffer = (data && data.temperatureInnerDiff1) ?? '-'
      this.equipmentList[0].humidityDiffer = (data && data.humiditieInnerDiff1) ?? '-'
      // 室内后
      this.equipmentList[1].temperature = (data && data.temperatureInner2) ?? '-'
      this.equipmentList[1].humidity = (data && data.humiditieInner2) ?? '-'
      this.equipmentList[1].temperatureDiffer = (data && data.temperatureInnerDiff2) ?? '-'
      this.equipmentList[1].humidityDiffer = (data && data.humiditieInnerDiff2) ?? '-'
      // 室外
      this.equipmentList[2].temperature = (data && data.temperatureOuter) ?? '-'
      this.equipmentList[2].humidity = (data && data.humiditieOuter) ?? '-'
      // 暖灯
      this.equipmentList[3].temperature = (data && data.temperatureLight) ?? '-'
      this.equipmentList[3].humidity = (data && data.humiditieLight) ?? '-'
      // 其他
      this.equipmentList[4].temperature = (data && data.actualWind) ?? '-'
      this.equipmentList[4].humidity = (data && data.windSpeed1) ?? '-'

      console.log(this.equipmentList[0])

      // 设备状态
      // sensing: '',
      // signal: 0,
      // voltage: 0
      this.equipmentList[0].sensing = data && data.innerAfterTempSensorMask || '-'
      this.equipmentList[0].signal = data && data.innerBeforeTempSensorRssi || null
      this.equipmentList[0].voltage = data && data.innerBeforeTempSensorVoltage || null

      this.equipmentList[1].sensing = data && data.innerBeforeTempSensorMask || '-'
      this.equipmentList[1].signal = data && data.innerAfterTempSensorRssi || null
      this.equipmentList[1].voltage = data && data.innerAfterTempSensorVoltage || null

      this.equipmentList[2].sensing = data && data.outerTempSensorMask || '-'
      this.equipmentList[2].signal = data && data.outerTempSensorRssi || null
      this.equipmentList[2].voltage = data && data.outerTempSensorVoltage || null

      this.equipmentList[3].sensing = data && data.heatLampTempSensorMask || '-'
      this.equipmentList[3].signal = data && data.heatLampTempSensorRssi || null
      this.equipmentList[3].voltage = data && data.heatLampTempSensorVoltage || null

      // 流量器状态
      this.flowMeter = (data.showerMeterStatus && data.showerMeterStatus === 1)

      // 设备状态
      // 变频和变速风机
      // 1.变频风机 - 字段 windFrequencyStatusX (0关闭，255未安装，1-50开启)
      // 2.变速风机 - 字段 RunPercent (0:关闭 1~100:开启，255:未安装)

      // { name: '暖灯', icon: '&#xe607;', status: '2', waring: false },
      if (!res.data) {
        this.equipmentStatusList = []
        return
      }
      const arr = []

      // 热交换变速
      for (let i = 0; i < 10; i++) {
        const n5 = `thyrodeExchangeFan${i}RunPercent`
        const f5 = `thyrodeExchangeFan${i}Fault`
        if (data[n5] !== undefined) {
          const j5 = {
            name: `热交换变速${i}`,
            icon: '&#xe612;',
            status: data[n5],
            waring: (data[f5] > 0),
            tips: '0',
            an: (Number(data[`windPressureStatus${i}`]) / 10).toFixed(1)
          }
          arr.push(j5)
        }
      }

      // 热交换变频
      if (data.windFrequencyStatus2 !== 255) {
        arr.push({
          name: `热交换变频`,
          icon: '&#xe612;',
          status: data.windFrequencyStatus2,
          waring: (data.exchangeFanFault > 0),
          tips: '1',
          an: data.exchangeFanRunCurrent
        })
      }

      // 地沟变速
      for (let i = 0; i < 10; i++) {
        const n6 = `thyrodeGutterFan${i}RunPercent`
        const f6 = `thyrodeGutterFan${i}Fault`
        if (data[n6] !== undefined) {
          const j6 = {
            name: `地沟变速${i}`,
            icon: '&#xe612;',
            status: data[n6],
            waring: (data[f6] > 0),
            tips: '0',
            an: (Number(data[`windPressureStatus${i + 2}`]) / 10).toFixed(1)
          }
          arr.push(j6)
        }
      }
      // 地沟变频
      if (data.windFrequencyStatus1 !== 255) {
        arr.push({
          name: `地沟变频`,
          icon: '&#xe612;',
          status: data.windFrequencyStatus1,
          waring: (data.inverterGutterFanFault > 0),
          tips: '1',
          an: data.inverterGutterFanRunCurrent
        })
      }

      // 正压变频风机
      for (let i = 0; i < 10; i++) {
        // 正压变频风机
        const n2 = `positiveFan${i}FrequencyStatus`
        const f2 = `positiveFan${i}Fault`
        if (data[n2] !== undefined) {
          const j2 = {
            name: `正压变频${i}`,
            icon: '&#xe612;',
            status: data[n2],
            waring: (data[f2] > 0)
          }
          arr.push(j2)
        }
      }

      // 端部变频风机
      if (data.windFrequencyStatus3 !== 255) {
        arr.push({
          name: `端部变频1`,
          icon: '&#xe612;',
          status: data.windFrequencyStatus3,
          waring: (data.endFan1Fault > 0),
          tips: '1',
          an: data.endFan1RunCurrent
        })
      }
      if (data.windFrequencyStatus4 !== 255) {
        arr.push({
          name: `端部变频2`,
          icon: '&#xe612;',
          status: data.windFrequencyStatus4,
          waring: (data.endFan2Fault > 0),
          tips: '1',
          an: data.endFan2RunCurrent
        })
      }
      if (data.windFrequencyStatus5 !== 255) {
        arr.push({
          name: `端部变频3`,
          icon: '&#xe612;',
          status: data.windFrequencyStatus5,
          waring: (data.endFan3Fault > 0),
          tips: '1',
          an: data.endFan3RunCurrent
        })
      }

      // 定速风机状态
      for (let i = 0; i < 10; i++) {
        // 定速风机状态
        const n = `windConstantStatus${i}`
        const f = `fixedFan${i}Fault`
        if (data[n] !== undefined) {
          const j = {
            name: `定速风机${i}`,
            icon: '&#xe612;',
            status: data[n],
            waring: (data[f] > 0)
          }
          arr.push(j)
        }
      }

      // 吊顶变频风机
      if (data.windFrequencyStatus6 !== 255) {
        arr.push({
          name: `吊顶变频1`,
          icon: '&#xe612;',
          status: data.windFrequencyStatus6,
          waring: (data.ceilingFan1Fault > 0),
          tips: '1',
          an: data.ceilingFan1RunCurrent
        })
      }
      if (data.windFrequencyStatus7 !== 255) {
        arr.push({
          name: `吊顶变频2`,
          icon: '&#xe612;',
          status: data.windFrequencyStatus7,
          waring: (data.ceilingFan2Fault > 0),
          tips: '1',
          an: data.ceilingFan2RunCurrent
        })
      }
      if (data.windFrequencyStatus8 !== 255) {
        arr.push({
          name: `吊顶变频3`,
          icon: '&#xe612;',
          status: data.windFrequencyStatus8,
          waring: (data.ceilingFan3Fault > 0),
          tips: '1',
          an: data.ceilingFan3RunCurrent
        })
      }

      // 猪舍出风机
      if (data.outFan1FrequencyStatus !== 255) {
        arr.push({
          name: `猪舍出风机`,
          icon: '&#xe612;',
          status: data.outFan1FrequencyStatus,
          waring: (data.outFan1Fault > 0)
        })
      }

      // 进风口滑窗
      if (data.airIntake1OpenPercent !== null) {
        arr.push({
          name: `进风口滑窗`,
          icon: '&#xe60d;',
          status: data.airIntake1OpenPercent,
          waring: (data.airIntake1Fault > 0),
          tips: '2'
        })
      }
      // 出风口滑窗
      if (data.airOutlet1OpenPercent !== null) {
        arr.push({
          name: `出风口滑窗`,
          icon: '&#xe60d;',
          status: data.airOutlet1OpenPercent,
          waring: (data.airOutlet1Fault > 0),
          tips: '2'
        })
      }

      // 喷淋 -------------------
      for (let i = 0; i < 10; i++) {
        // 喷淋
        const n3 = `showerStatus${i}`
        const f3 = `shower${i}Fault`
        if (data[n3] !== undefined) {
          const j3 = {
            name: `喷淋${i}`,
            icon: '&#xe615;',
            status: data[n3],
            waring: (data[f3] > 0)
          }
          arr.push(j3)
        }
      }
      // 暖灯
      if (data.warmLightStatus !== 255) {
        arr.push({
          name: `暖灯`,
          icon: '&#xe60f;',
          status: data.warmLightStatus,
          waring: (data.heatLampFault > 0)
        })
      }
      // 雾化盘
      if (data.wettingStatus !== 255) {
        arr.push({
          name: `雾化盘`,
          icon: '&#xe610;',
          status: data.wettingStatus,
          waring: (data.g2HumiFault > 0)
        })
      }
      // 饲喂 ----------------
      for (let i = 0; i < 10; i++) {
        // 饲喂
        const n4 = `feedStatus${i}`
        const f4 = `feed${i}Fault`
        if (data[n4] !== undefined) {
          const j4 = {
            name: `饲喂${i}`,
            icon: '&#xe611;',
            status: data[n4],
            waring: (data[f4] > 0)
          }
          arr.push(j4)
        }
      }
      // 饮水
      if (data.drinkStatus !== 255) {
        arr.push({
          name: `饮水`,
          icon: '&#xe616;',
          status: data.drinkStatus,
          waring: (data.drinkFault > 0)
        })
      }
      // 照明
      if (data.lightStatus !== 255) {
        arr.push({
          name: `照明`,
          icon: '&#xe613;',
          status: data.lightStatus,
          waring: (data.lampFault > 0)
        })
      }
      // 伴热带
      if (data.miqStatus !== 255) {
        arr.push({
          name: `伴热带`,
          icon: '&#xe60c;',
          status: data.miqStatus,
          waring: (data.heatBeltFault > 0)
        })
      }
      // 警灯
      if (data.alarmLightStatus !== 255) {
        arr.push({
          name: `警灯`,
          icon: '&#xe60e;',
          status: data.alarmLightStatus === 0 ? data.alarmLightStatus : 2,
          waring: (data.alarmLightFault > 0)
        })
      }
      // 警铃
      if (data.alarmStatus !== 255) {
        arr.push({
          name: `警铃`,
          icon: '&#xe614;',
          status: data.alarmStatus === 0 ? data.alarmStatus : 2,
          waring: (data.alarmBellFault > 0)
        })
      }
      // 水帘
      if (data.sprayStatus !== 255) {
        arr.push({
          name: `水帘`,
          icon: '&#xe617;',
          status: data.sprayStatus,
          waring: (data.waterCurtainFault > 0)
        })
      }
      // 当前风机档位
      if (this.info.overview.deviceVersionId === '6aKGZaUNLp9poYSNu1PhnU') {
        if (data.fanGear) {
          arr.push({
            name: `风机档位`,
            icon: '',
            status: 1,
            waring: false,
            dang: data.fanGear,
            tips: '4'
          })
        }
      }
      this.equipmentStatusList = arr
    }
  }
}
</script>

<style lang="scss" scoped>
.container-carrier1-row{
  width: 25%;
  justify-content: space-between;
}
.container {
  // margin: 0 1.6%;
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
  flex: 1;
  // display: flex;
  width: 340px;
  min-width: 340px;
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
  &-r3{
    position: relative;
    margin-right: 20px;
    img{
      position: absolute;
      margin-right: 20px;
      left: -26px;
      height: 20px;
      top: -1px;
    }
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
      height: 292px;
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
  // height: 299px;
  padding-bottom: 10px;
  &-row{
    margin: 0 20px;
    margin-top: 10px;
    height: 60px;
    // background: #1F316E;
    @include background('viewBackGround7');
    justify-content: start;
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
      // padding-left: 60px;
      &-icon{
        // position: absolute;
        // left: 0;
        // top: 50%;
        position: relative;
        top: 20px;
        transform: translate(0%, -50%);
        width: 40px;
        height: 40px;
        margin-right: 20px;
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
      text-align: left;
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
            }
          }
          &-div2 {
            flex: 1;
            text-align: right;
            @include font_color('mainFontColor2');
          }
          i {
            font-style: normal;
            font-size: 12px;
            color: #8ea0ea;
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
      &-icon3 {
        color: rgb(255, 86, 86);
      }
      &-border1 {
        border: 1px solid #7894E3;
        // box-shadow: inset 0 0 6px #404f89;
      }
      &-border2 {
        border: 1px solid #0AD69B;
        // box-shadow: inset 0 0 6px #9eb6fb;
      }
      &-border3{
        border: 1px solid rgb(255, 86, 86);
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
        color: #7894E3;
        // @include font_color('subTextColor');
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
    &-divC3{
      span{
        color: rgb(255, 86, 86)
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
  // box-shadow: inset 0 0 10px 0 #217bfc;
  @include box_shadow('viewRadioBoxShadow');
  opacity: 1;
}
.container-carrier-export{
  display: inline-block;
  float: right;
  cursor: pointer;
  margin-right: 30px;
  margin-top: 4px;
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
</style>
