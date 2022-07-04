<template>
  <div class="container">
    <!-- 单元信息 -->
    <div class="container-row container-row1">
      <div v-loading="loadingPig" class="container-col1 container-marginTop2">
        <div class="container-title">单元基础信息</div>
        <div class="container-carrier1">
          <div
            v-for="(i, index) in unitInfo"
            :key="i.name"
            class="container-carrier1-row"
          >
            <div class="container-carrier1-row-l">
              <div class="container-carrier1-row-l-icon">
                <img v-if="index === 0" src="@/assets/image/unitStatus/equipment-riling.svg">
                <img v-if="index === 1" src="@/assets/image/unitStatus/equipment-shuliang.svg">
                <img v-if="index === 2" src="@/assets/image/unitStatus/equipment-tizhong.svg">
              </div>
              {{ i.name }}
            </div>
            <div class="container-carrier1-row-r">{{ i.number }}<span>{{ i.company }}</span></div>
          </div>
        </div>
      </div>
      <!-- 天气状况 -->
      <div v-loading="loadingWeather" class="container-col3 container-marginTop2">
        <div class="container-title">天气状况</div>
        <div v-show="weatherList.length === 0" class="no-data-img"><img :src="noData | noDataFile('noData', 'svg')"></div>

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

      </div>
    </div>

    <!-- 设备状态 -->
    <!-- 猪舍环境数据 -->
    <div class="container-row container-marginTop1 container-row3">
      <div class="container-head">
        设备状态
        <button class="btn-blue buttons2 container-head-r2" @click="refresh">当前状态</button>
        <span class="container-head-r">数据上报时间：{{ currentTime }}</span>
      </div>
      <div v-loading="loadingInfo" class="container-carrier3 overfolw">
        <div v-for="(i, index) in equipmentList" :key="index" class="container-carrier3-col">
          <div class="container-title">
            <span>{{ i.position }}</span>
            <!-- 传感器 -->
            <div class="container-carrier3-surface">
              <suspension v-if="i.sensing && (i.sensing !== 1)" type="sensing-off" title="温湿度传感器" value="开启" />
              <suspension v-if="i.sensing && (i.sensing === 1)" type="sensing-on" title="温湿度传感器" value="关闭" />
              <suspension v-if="i.signal" type="signal" title="信号强度" :value="i.signal" />
              <suspension v-if="i.voltage" type="voltage" title="电池电压" :value="i.voltage" />
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
                  <span>{{ i.temperature === -100 ? '-' : i.temperature }}</span>
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
                  <span>{{ i.humidity === -100 ? '-' : i.humidity }}</span>
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
                  <span>{{ i.temperatureDiffer === -100 ? '-' : i.temperatureDiffer }}</span>
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
                  <span>{{ i.humidityDiffer === -100 ? '-' : i.humidityDiffer }}</span>
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
        <div class="container-title">设备运行状态</div>
      </div>
      <div class="container-carrier container-carrier4">
        <div class="container-carrier4-body">
          <div v-show="equipmentStatusList.length === 0" class="no-data-img"><img :src="noData | noDataFile('noData', 'svg')"></div>
          <template v-for="(i, index) in equipmentStatusList" v-show="equipmentStatusList.length > 0">
            <div
              v-if="i.status !== 255 && i.status !== null"
              :key="index"
              class="container-carrier4-body-div"
              :class="i.status === 0 ? '':'container-carrier4-body-divC2'"
            >
              <span v-if="i.tips && i.tips === '0'" class="iconfont container-carrier4-body-div-topl">{{ i.status }}%</span>
              <span v-if="i.tips && i.tips === '1'" class="iconfont container-carrier4-body-div-topl">{{ i.status }}HZ</span>
              <span v-if="i.tips && (i.tips === '0' || i.tips === '1')" class="iconfont container-carrier4-body-div-topr">{{ (i.an / 10).toFixed(1) }}A</span>
              <span v-if="i.tips && i.tips === '2'" class="iconfont container-carrier4-body-div-topr">{{ i.status }}%</span>
              <div
                class="container-carrier4-body-div-border"
                :class="i.status === 0 ? 'container-carrier4-body-div-border1':'container-carrier4-body-div-border2'"
              >
                <!-- v-if="i.name === '警铃' || i.name === '警灯'"  -->
                <suspensionAlarm v-if="i.name === '警灯'" :info="equipmentAlarmDetails" />
                <i
                  class="iconfont container-carrier4-body-div-icon"
                  :class="i.status === 0 ? 'container-carrier4-body-div-icon1':'container-carrier4-body-div-icon2'"
                  v-html="i.icon"
                />
                <img v-if="i.waring" src="@/assets/image/unitStatus/waring.png">
              </div>
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
              >温度数据</div>
              <div
                class="container-carrier-btn"
                :class="chartStatus === 'humidity' ? 'container-carrier-btn-active' : ''"
                @click="switchLine('humidity') "
              >湿度数据</div>
              <div
                class="container-carrier-btn"
                :class="chartStatus === 'wind' ? 'container-carrier-btn-active' : ''"
                @click="switchLine('wind') "
              >通风量</div>
              <div class="container-carrier-dates">
                <div v-hasAuth="'fieldDeviceOverview:exportStatusData'" class="container-carrier-export" @click="exportData">
                  <!-- <img src="@/assets/image/export.png"> -->
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
          <div v-show="lineEchartsList.length === 0" class="no-data-img"><img :src="noData | noDataFile('noData', 'svg')"></div>
          <div ref="tempChart" class="container-carrier5-chart" />

        </div>
      </div>
    </div>

  </div>
</template>

<script>
// getFieldPigInfo
import { getPeriodData } from '@/http/api/mapMess'
import {
  getListWeather,
  getPigOneInfo,
  initFile,
  exportFile,
  alarmInfo,
  getPigUnit
} from '@/http/api/fieldInfo'
import weatherService from '@/lib/service/weather-service'
import navForm from '@/components/commonComponent/navForm/index.vue'
import suspension from '@/components/suspension'
import suspensionAlarm from '@/components/suspensionAlarm'
// import { getConfigElement } from '@/utils/overtService'

export default {
  name: 'UnitMonitoring',
  components: {
    navForm,
    suspension,
    suspensionAlarm
  },
  props: {
    info: {
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
      testInterval: null,
      // 切换图标状态
      chartStatus: 'temperature',
      lineDate: null,
      unitInfo: [
        {
          number: '-',
          name: '日龄',
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
          position: '室内前',
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
          position: '室外',
          temperature: '-',
          temperatureDiffer: null,
          humidity: '-',
          humidityDiffer: null,
          type: '3',
          sensing: '',
          signal: '0',
          voltage: '0'
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
        data: { time: [this.getCurrentTime((new Date()).getTime() - 1000 * 60 * 60 * 24), this.getCurrentTime('')] },
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
      loadingWeather: true,
      loadingPig: true
    }
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
      if (this.info && this.info.overview && this.info.selectedOption) {
        this.getPigData()
        this.getPigInfo()
        this.getPigDay()
        this.getWeatherData()
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
        this.currentTime = this.getCurrentTime('')
        this.getPigInfo()
        this.getWeatherData()
        this.getPigDay()
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
            return params.seriesName + ': ' + params.value
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
          bottom: '6%'
        },
        grid: {
          left: '30px',
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
            '喷淋1状态'
          ],
          Yname: '°C',
          hideLine: {
            室内前温度: false,
            室内后温度: false,
            室外温度: false,
            室内平均温度: true,
            暖灯温度: false,
            喷淋1状态: true
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
              splitLine: { lineStyle: { color: ['#3E477F'] }}
            },
            {
              type: 'value',
              name: '喷淋1状态',
              min: 0,
              max: 1,
              interval: 25,
              splitNumber: 1,
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
            {
              type: 'line',
              name: '喷淋1状态',
              data: this.showEcharysList.shower,
              itemStyle: {
                normal: { color: '#6284FA', lineStyle: { color: '#6284FA' }}
              },
              yAxisIndex: 1
            }
          ]
        }
      } else if (type === 'humidity') {
        lineList = {
          titleS: false,
          headName: ['室内前湿度', '室内后湿度', '室外湿度', '喷淋1状态'],
          Yname: '%',
          hideLine: {
            室内前湿度: true,
            室内后湿度: true,
            室外湿度: true,
            喷淋1状态: true
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
              splitLine: { lineStyle: { color: ['#3E477F'] }}
            },
            {
              type: 'value',
              name: '喷淋1状态',
              min: 0,
              max: 1,
              interval: 25,
              splitNumber: 1,
              axisLine: { lineStyle: { color: '#CDD8F7' }},
              axisLabel: { textStyle: { color: '#CDD8F7' }},
              // 去除网格线
              splitLine: { lineStyle: { color: ['#3E477F'] }}
            }
          ],
          series: [
            {
              type: 'line',
              name: '室内前湿度',
              data: this.showEcharysList.humi_inner1,
              itemStyle: {
                normal: { color: '#385BFF', lineStyle: { color: '#385BFF' }}
              },
              yAxisIndex: 0
            },
            {
              type: 'line',
              name: '室内后湿度',
              data: this.showEcharysList.humi_inner2,
              itemStyle: {
                normal: { color: '#48E0F4', lineStyle: { color: '#48E0F4' }}
              },
              yAxisIndex: 0
            },
            {
              type: 'line',
              name: '室外湿度',
              data: this.showEcharysList.humi_outer,
              itemStyle: {
                normal: { color: '#20D332', lineStyle: { color: '#20D332' }}
              },
              yAxisIndex: 0
            },
            {
              type: 'line',
              name: '喷淋1状态',
              data: this.showEcharysList.shower2,
              itemStyle: {
                normal: { color: '#F9BF00', lineStyle: { color: '#F9BF00' }}
              },
              yAxisIndex: 1
            }
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
      }
      if (lineList) {
        this.setLineChart(lineList, this.showEcharysList.time)
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

      // 室内前湿度
      const humi_inner1 = []
      // 室内后湿度
      const humi_inner2 = []
      // 室外湿度
      const humi_outer = []
      // 喷淋1
      const shower2 = []
      // 头均通风量
      let avg_wind = null
      const actualWind = this.lineEchartsList[this.lineEchartsList.length - 1].actualWind
      console.log(actualWind, this.unitInfo[1].number)
      if (actualWind && this.unitInfo[1].number && this.unitInfo[1].number !== '-') {
        avg_wind = (actualWind / this.unitInfo[1].number).toFixed(2)
      }

      // 实际通风量
      const wind = []
      for (const i of this.lineEchartsList) {
        const avg = parseInt(((i.temperatureInner1 + i.temperatureInner2) / 2) * 10) / 10
        const t = i.uploadTime ? (i.uploadTime.split('-')[1] + '/' + i.uploadTime.split('-')[2]) : ''
        const tt = i.uploadTime ? t.split(':')[0] + ':' + t.split(':')[1] : ''
        time.push(tt)

        temp_inner1.push(i.temperatureInner1 === -100 ? null : i.temperatureInner1)
        temp_inner2.push(i.temperatureInner2 === -100 ? null : i.temperatureInner2)
        temp_outer.push(i.temperatureOuter === -100 ? null : i.temperatureOuter)
        temp_avg.push(avg === -100 ? null : avg)
        temp_light.push(i.temperatureLight === -100 ? null : i.temperatureLight)
        shower.push(i.showerStatus1 === -100 ? null : i.showerStatus1)

        humi_inner1.push(i.humiditieInner1 === -100 ? null : i.humiditieInner1)
        humi_inner2.push(i.humiditieInner2 === -100 ? null : i.humiditieInner2)
        humi_outer.push(i.humiditieOuter === -100 ? null : i.humiditieOuter)
        shower2.push(i.showerStatus2 === -100 ? null : i.showerStatus2)

        wind.push(i.actualWind === -100 ? null : i.actualWind)
      }
      const data = {
        time: time,
        temp_inner1: temp_inner1,
        temp_inner2: temp_inner2,
        temp_outer: temp_outer,
        temp_avg: temp_avg,
        temp_light: temp_light,
        shower: shower,

        humi_inner1: humi_inner1,
        humi_inner2: humi_inner2,
        humi_outer: humi_outer,
        shower2: shower2,

        wind: wind,
        avg_wind: avg_wind
      }
      this.showEcharysList = data
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
    async getPigData() {
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

      await getPeriodData(data).then((res) => {
        this.loadingEchart = false
        if (res && res.status === 200 && res.rel) {
          // let arr = res.data
          // if (res.data.length > 50) {
          //   arr = []
          //   for (let i = res.data.length - 1; i > 0; i = i - 5) {
          //     arr.unshift(res.data[i])
          //   }
          // }
          // this.lineEchartsList = arr
          this.lineEchartsList = res.data
          this.handleData()
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.loadingEchart = false
        // this.$message.error(err.message)
      })
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
          this.$message({ message: res.message, type: 'warning' })
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
        regionld: this.info.selectedOption[0],
        areaId: this.info.selectedOption[1],
        fieldId: this.info.selectedOption[2],
        segmentId: this.info.overview.segmentId,
        unit: routeUnit
      }
      await getPigUnit(data).then((res) => {
        this.loadingPig = false
        if (res && res.status === 200 && res.rel && res.data) {
          // 日龄
          this.unitInfo[0].number = res.data.pigDays || '-'
          // 装猪数量
          this.unitInfo[1].number = res.data.pigCount || '-'
          // 单猪体重
          this.unitInfo[2].number = res.data.weight || '-'
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.loadingPig = false
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
          this.$message.error('导出失败')
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
        if (res && res.status === 200 && res.rel && res.data.exceptionStatus === 0) {
          this.loadingEchart = false
          clearInterval(this.exportFileListInter)
          window.open(res.data.downloadUrl)
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
    // 处理猪舍信息
    handlePigInfo(res) {
      const data = JSON.parse(JSON.stringify(res.data))

      // 设备ID
      this.equipmentDeviceId = data.deviceId || null
      this.getalarmInfo()

      // 室内前
      this.equipmentList[0].temperature = data.temperatureInner1 || '-'
      this.equipmentList[0].humidity = data.humiditieInner1 || '-'
      this.equipmentList[0].temperatureDiffer = data.temperatureInnerDiff1 || '-'
      this.equipmentList[0].humidityDiffer = data.humiditieInnerDiff1 || '-'
      // 室内后
      this.equipmentList[1].temperature = data.temperatureInner2 || '-'
      this.equipmentList[1].humidity = data.humiditieInner2 || '-'
      this.equipmentList[1].temperatureDiffer = data.temperatureInnerDiff2 || '-'
      this.equipmentList[1].humidityDiffer = data.humiditieInnerDiff2 || '-'
      // 室外
      this.equipmentList[2].temperature = data.temperatureOuter || '-'
      this.equipmentList[2].humidity = data.humiditieOuter || '-'
      // 暖灯
      this.equipmentList[3].temperature = data.temperatureLight || '-'
      this.equipmentList[3].humidity = data.humiditieLight || '-'
      // 其他
      this.equipmentList[4].temperature = data.actualWind || '-'
      this.equipmentList[4].humidity = data.windSpeed1 || '-'

      // 设备状态
      // sensing: '',
      // signal: 0,
      // voltage: 0
      this.equipmentList[0].sensing = data.innerAfterTempSensorMask || '-'
      this.equipmentList[0].signal = data.innerBeforeTempSensorRssi || '-'
      this.equipmentList[0].voltage = data.innerBeforeTempSensorVoltage || '-'

      this.equipmentList[1].sensing = data.innerBeforeTempSensorMask || '-'
      this.equipmentList[1].signal = data.innerAfterTempSensorRssi || '-'
      this.equipmentList[1].voltage = data.innerAfterTempSensorVoltage || '-'

      this.equipmentList[2].sensing = data.outerTempSensorMask || '-'
      this.equipmentList[2].signal = data.outerTempSensorRssi || '-'
      this.equipmentList[2].voltage = data.outerTempSensorVoltage || '-'

      this.equipmentList[3].sensing = data.heatLampTempSensorMask || '-'
      this.equipmentList[3].signal = data.heatLampTempSensorRssi || '-'
      this.equipmentList[3].voltage = data.heatLampTempSensorVoltage || '-'

      // 设备状态
      // 变频和变速风机
      // 1.变频风机 - 字段 windFrequencyStatusX (0关闭，255未安装，1-50开启)
      // 2.变速风机 - 字段 RunPercent (0:关闭 1~100:开启，255:未安装)

      // { name: '暖灯', icon: '&#xe607;', status: '2', waring: false },
      const arr = []

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

        // 猪舍变频风机
        const n2 = `positiveFan${i}FrequencyStatus`
        const f2 = `positiveFan${i}Fault`
        if (data[n2] !== undefined) {
          const j2 = {
            name: `猪舍变频风机${i}`,
            icon: '&#xe612;',
            status: data[n2],
            waring: (data[f2] > 0)
          }
          arr.push(j2)
        }

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
        // 热交换变速
        const n5 = `thyrodeExchangeFan${i}RunPercent`
        const f5 = `thyrodeExchangeFan${i}Fault`
        if (data[n5] !== undefined) {
          const j5 = {
            name: `热交换变速${i}`,
            icon: '&#xe612;',
            status: data[n5],
            waring: (data[f5] > 0),
            tips: '0',
            an: data[`windPressureStatus${i}`]
          }
          arr.push(j5)
        }
        // 地沟变速
        const n6 = `thyrodeGutterFan${i}RunPercent`
        const f6 = `thyrodeGutterFan${i}Fault`
        if (data[n6] !== undefined) {
          const j6 = {
            name: `地沟变速${i}`,
            icon: '&#xe612;',
            status: data[n6],
            waring: (data[f6] > 0),
            tips: '0',
            an: data[`windPressureStatus${i + 2}`]
          }
          arr.push(j6)
        }
      }

      // 地沟变频风机
      if (data.windFrequencyStatus1 !== 255) {
        arr.push({
          name: `地沟变频风机`,
          icon: '&#xe612;',
          status: data.windFrequencyStatus1,
          waring: (data.inverterGutterFanFault > 0),
          tips: '0',
          an: data.inverterGutterFanRunCurrent
        })
      }
      // 热交换变频
      if (data.windFrequencyStatus2 !== 255) {
        arr.push({
          name: `热交换变频`,
          icon: '&#xe612;',
          status: data.windFrequencyStatus2,
          waring: (data.exchangeFanFault > 0),
          tips: '0',
          an: data.exchangeFanRunCurrent
        })
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
      // 雾化盘  ************************************************没有故障字段
      if (data.wettingStatus !== 255) {
        arr.push({
          name: `雾化盘`,
          icon: '&#xe610;',
          status: data.wettingStatus,
          waring: (data.g2HumiFault > 0)
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
      // 暖灯
      if (data.warmLightStatus !== 255) {
        arr.push({
          name: `暖灯`,
          icon: '&#xe60f;',
          status: data.warmLightStatus,
          waring: (data.heatLampFault > 0)
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
      // 饮水
      if (data.drinkStatus !== 255) {
        arr.push({
          name: `饮水`,
          icon: '&#xe616;',
          status: data.drinkStatus,
          waring: (data.drinkFault > 0)
        })
      }
      // 警铃
      if (data.alarmStatus !== 255) {
        arr.push({
          name: `警铃`,
          icon: '&#xe614;',
          status: data.alarmStatus,
          waring: (data.alarmBellFault > 0)
        })
      }
      // 警灯
      if (data.alarmLightStatus !== 255) {
        arr.push({
          name: `警灯`,
          icon: '&#xe60e;',
          status: data.alarmLightStatus,
          waring: (data.alarmLightFault > 0)
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
  background-image: linear-gradient(225deg, rgba(43,60,122,0.50) 0%, rgba(28,42,110,0.50) 100%);
  border: 1px solid #2F3872;
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
  width: 340px;
  min-width: 340px;
  margin-right: 20px;
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
  color: #FFFFFF;
  border-bottom: 1px solid #2F3872;
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
      height: 258px;
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
  height: 299px;
  &-row{
    margin: 0 20px;
    margin-top: 20px;
    height: 80px;
    background: #1F316E;
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    &-l{
      flex: 1;
      font-family: SourceHanSansCN-Normal;
      font-size: 20px;
      color: #CDD8F7;
      position: relative;
      padding-left: 60px;
      &-icon{
        position: absolute;
        left: 0;
        top: 50%;
        transform: translate(0%, -50%);
        width: 50px;
        height: 50px;
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
      font-size: 30px;
      color: #FFFFFF;
      span{
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #CDD8F7;
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
      color: #ffffff;
      border-radius: 2px;
      padding: 2px 4px;
    }
    &-main {
      &-div {
        height: 60px;
        line-height: 60px;
        margin: 0 30px;
        border-bottom: 1px solid #252F6E;
        &-body {
          display: flex;
          &-div1 {
            flex: 1;
            position: relative;
            padding-left: 46px;
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
  @include box_shadow('viewRadioBoxShadow');
  opacity: 1;
}
.container-carrier-export{
  display: inline-block;
  float: right;
  cursor: pointer;
  margin-right: 30px;
  margin-top: 13px;
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
