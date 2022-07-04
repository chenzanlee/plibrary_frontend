<template>
  <div class="homepage">
    <div class="homepage-container">
      <!-- 头部 -->
      <div class="homehead">
        <div class="homehead-l">
          <nav-form
            ref="ceshi"
            :data="navFormInfo.data"
            :field-list="navFormInfo.fieldList"
          />
        </div>
        <span class="homehead-r">数据更新时间：{{ time }}</span>
      </div>

      <!-- 主体 -->
      <div class="homebody">
        <div class="homebodyL">

          <!-- 天气 -->
          <div v-loading="loadingWeather" class="homebodyL-weather Highlight2">
            <h3 class="homebody-title">环境信息</h3>
            <div class="homebodyL-weather-body">
              <div class="homebodyL-weather-body-title">{{ weatherList.name || '-' }}</div>
              <div class="homebodyL-weather-body-icon"><img class="homebodyL-weather-body-img" :src="weatherList.wlWeatherImg"></div>
              <div class="homebodyL-weather-body-main">
                <div class="homebodyL-weather-body-main-col">
                  <div>
                    <p>OU值</p>
                    <h2>{{ weatherList.ou || '-' }}<span /></h2>
                  </div>
                </div>

                <div class="homebodyL-weather-body-main-col">
                  <div class="homebodyL-weather-body-main-col-left">
                    <p>风力</p>
                    <h2>{{ weatherList.windlevel || '-' }}<span>级</span></h2>
                  </div>
                </div>

                <div class="homebodyL-weather-body-main-col">
                  <div>
                    <p>温度</p>
                    <h2>{{ weatherList.hightemp || '-' }}°<span>/{{ weatherList.lowertemp || '-' }}°</span></h2>
                  </div>
                </div>

                <div class="homebodyL-weather-body-main-col">
                  <div class="homebodyL-weather-body-main-col-left">
                    <p>湿度</p>
                    <h2>{{ weatherList.humidity || '-' }}<span>%</span></h2>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 管链 -->
          <div v-loading="loadingGuanlian" class="homebodyL-guanlian Highlight2">
            <h3 class="homebody-title">管链信息</h3>
            <div class="homebodyL-guanlian-body overfolwHidden">

              <div v-for="(item,index) in guanlian" :key="index" class="homebodyL-guanlian-body-item" :style="{borderLeft:'4px solid ' + item.color}">
                <p class="homebodyL-guanlian-body-item-title">{{ item.name }}<span>{{ item.span }} 吨</span></p>
                <div v-for="(j,k) in item.shujv" :key="k" class="homebodyL-guanlian-body-item-shuzhi">
                  <p class="homebodyL-guanlian-body-item-t">{{ j.weidu }}</p>
                  <p class="homebodyL-guanlian-body-item-b">{{ j.yipeisong }}</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- 设备 -->
        <div v-loading="loadingAlarm1" class="homebodyC Highlight2">
          <h3 class="homebody-title">设备信息</h3>
          <div class="homebodyC-top">
            <img class="homebodyC-top-img" src="@/assets/image/plant-area.png">
            <div class="homebodyC-top-tips">
              <div v-for="(i, index) of equipment" :key="index" class="homebodyC-top-tips-row">
                <div class="homebodyC-top-tips-row-l">{{ i.title }}</div>
                <div class="homebodyC-top-tips-row-r">{{ i.value }}</div>
              </div>
            </div>
          </div>
          <div class="homebodyC-bottom">
            <div class="homebodyC-bottom-l">
              <div ref="containerEchters" class="homebodyC-bottom-l-echters" />
            </div>
            <div class="homebodyC-bottom-r">
              <div v-for="(i, index) of equipmentInfo" :key="index" class="homebodyC-bottom-r-row">
                <div class="homebodyC-bottom-r-col" :class="((index + 1) % 3 !== 0) ? 'homebodyC-bottom-r-col2' : ''">
                  <div class="homebodyC-bottom-r-row-tip">{{ i.value }}</div>
                  <div class="homebodyC-bottom-r-row-value">{{ i.title }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 告警 -->
        <div v-loading="loadingAlarm2" class="homebodyR Highlight2">
          <h3 class="homebody-title">告警信息</h3>

          <!--  -->
          <div class="homebodyR-head">
            <div v-for="(i, index) of alarmInfo.title" :key="index" class="homebodyR-head-row">
              <svg-icon v-show="i.icon === '1'" class="homebodyR-head-row-img" icon-class="current-waring-icon" />
              <svg-icon v-show="i.icon === '2'" class="homebodyR-head-row-img" icon-class="processed-waring-icon" />
              <div class="homebodyR-head-row-col">
                <p>{{ i.value }}</p>
                <span>{{ i.tips }}</span>
              </div>
            </div>
          </div>

          <!--  -->
          <div class="homebodyR-container">
            <el-tabs v-model="activeName" class="homebodyR-container-head" @tab-click="handleClick">
              <el-tab-pane label="设备" name="first">
                <span slot="label" class="homebodyR-container-head-tip"><i v-show="alarmList.length > 0">{{ alarmList.length || 0 }}</i>设备</span>

                <div v-show="alarmList.length === 0" class="no-data-img"><img src="@/assets/image/page/noData.png"></div>
                <ul v-show="alarmList.length > 0" class="homebodyR-container-body">
                  <!-- <li v-for="(i, index) of alarmList" :key="index" class="homebodyR-container-body-col">
                    <span>{{ i.name }}</span>
                  </li> -->
                  <template v-for="(i, index) of alarmList2">
                    <li v-for="(j, jndex) of i.child" :key="index + '-' + jndex" class="homebodyR-container-body-col">
                      <span>{{ i.unit }}：{{ j.name }}</span>
                    </li>
                  </template>
                </ul>
              </el-tab-pane>
              <!-- <el-tab-pane label="猪只" name="second">
                <button @click="b()">组态</button>
                <div style="display:none;">
                  <button @click="a()">删除loading</button>
                  <button @click="a(1)">添加loading</button>
                  <hr/>
                  <div class="aaa" v-loading="loadingaaa">猪只</div>
                  <div class="aaa" v-loading="loadingaaa">猪只</div>
                  <div class="aaa" v-loading="loadingaaa">猪只</div>
                  <div class="aaa" v-loading="loadingaaa">猪只</div>
                </div>
             </el-tab-pane> -->
            </el-tabs>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import navForm from '@/components/commonComponent/navForm'
import {
  myEvcWeatherInfo
} from '@/http/api/mapMess'
import {
  getRegionAreaFieldTree,
  getEquipmentId,
  getEquipmentOu,
  myBaseFieldInfo,
  pipeChainInfo
} from '@/http/api/fieldInfo'
// import {
//   getAlarmInfosByField,
//   getDevicesByField
// } from '@/http/api/fieldDeviceOverview'
import weatherService from '@/lib/service/weather-service'

import { cancelLoadingMask, storageFrontInfo } from '@/utils/overtService'

export default {
  components: {
    navForm
  },
  data() {
    return {
      loadingaaa: true,
      time: '',
      weatherList: {
        name: '-',
        wlWeatherImg: weatherService.getWeatherImg(''),
        ou: '-',
        windlevel: '-',
        hightemp: '-',
        lowertemp: '-',
        humidity: '-'
      },
      fieldAreaList: [],
      navFormInfo: {
        data: {
          num: '',
          cascader: []
        },
        fieldList: {
          left: {
            inpLists: [
              {
                key: 'cascader',
                type: 'cascader',
                className: 'shadow',
                placeholder: '请选择',
                options: [],
                handleChange: (val) => {
                }
              },
              {
                label: '',
                key: 'num',
                type: 'date',
                className: 'shadow',
                placeholder: '请选择日期'
              }
            ],
            btnLists: [
              {
                innerText: '查询',
                className: 'btn-blue',
                handleClick: () => {
                  this.queryInfo()
                }
              }
            ]
          }
        }
      },
      guanlian: [
        {
          name: '配送任务量：',
          span: '-',
          color: '#3184FA',
          shujv: [
            {
              weidu: '-',
              yipeisong: '已配送量'
            },
            {
              weidu: '-',
              yipeisong: '已配送次数'
            },
            {
              weidu: '-',
              yipeisong: '待配送量'
            },
            {
              weidu: '-',
              yipeisong: '待配送次数'
            }
          ]
        },
        {
          name: '平均饮水量：',
          span: '-',
          color: '#27BF8F',
          shujv: [
            {
              weidu: '-',
              yipeisong: '泌乳母猪饮水量'
            },
            {
              weidu: '-',
              yipeisong: '保育育肥饮水量'
            }
          ]
        },
        {
          name: '平均饲喂量',
          span: '-',
          color: '#3184FA',
          shujv: [
            {
              weidu: '-',
              yipeisong: '泌乳母猪采食量'
            },
            {
              weidu: '-',
              yipeisong: '保育育肥采食量'
            }
          ]
        }
      ],
      equipment: [
        { title: '场区类型：', value: '--' },
        { title: '设计规模：', value: '--' },
        { title: '员工数量：', value: '--' },
        { title: '场长：', value: '--' },
        { title: '兽医：', value: '--' },
        { title: '投产时间：', value: '--' },
        { title: '投产地址：', value: '--' }
      ],
      // 饼形图表
      cakeOption: {
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
          //     formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: [
          {
            orient: 'vertical',
            align: 'left',
            x: '80%',
            // y: '25%',
            y: '35%',
            data: [{
              name: '在线',
              textStyle: { color: '#CDD8F7', fontSize: 14 }
            }]
          }, {
            orient: 'vertical',
            align: 'left',
            x: '80%',
            // y: '45%',
            y: '60%',
            data: [{
              name: '离线',
              textStyle: { color: '#CDD8F7', fontSize: 14 }
            }]
          }, {
            orient: 'vertical',
            align: 'left',
            x: '80%',
            y: '65%',
            data: [{
              name: '故障',
              textStyle: { color: '#CDD8F7', fontSize: 14 }
            }]
          }

        ],
        series: [
          {
            name: '',
            type: 'pie',
            color: ['#E45353', '#156CE7', '#27BF8F'],
            radius: ['30%', '70%'],
            center: ['45%', '50%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'inner'
            },
            emphasis: {
              label: {
                show: false
              }
            },
            labelLine: {
              show: false
            },
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: '{c}',
                  position: 'inner'
                },
                labelLine: { show: true }
              }
            },

            data: []
          }
        ]
      },
      equipmentInfo: [
        { title: '类型', value: '--' },
        { title: '总单元数量', value: '--' },
        { title: '装猪单元数量', value: '--' },
        { title: '累计死亡', value: '--' },
        { title: '累计死亡率', value: '--' },
        { title: '当前存栏量', value: '--' },
        { title: '保育段', value: '--' },
        { title: '育肥段', value: '--' },
        { title: '后备段', value: '--' }
      ],
      echartsResize: null,
      alarmInfo: {
        title: [
          { tips: '当前告警总数', value: '0', icon: '1' },
          { tips: '已处理告警总数', value: '0', icon: '2' }
        ],
        value: []
      },
      activeName: 'first',
      alarmList: [],
      alarmList2: [],
      loadingWeather: false,
      loadingGuanlian: false,
      loadingAlarm1: false,
      loadingAlarm2: false
    }
  },
  mounted() {
    document.onkeydown = (e) => {
      if (this.navFormInfo.data.num && this.navFormInfo.data.cascader && this.navFormInfo.data.cascader.length > 0) {
        if (e.keyCode === 13) {
          this.queryInfo()
        }
      }
    }
    this.init()
    storageFrontInfo('all')
  },
  beforeRouteLeave(to, form, next) {
    document.onkeydown = null
    next()
  },
  methods: {
    b() {
      const d = {
        name: '测试人员 ',
        id: '7lvjl3YMgsYF0C9ZSErWL7',
        model: '0',
        deviceId: '4D672033384B374E501600400032'
      }
      // const d = {
      //   name: '测试人员 ',
      //   id: '3tR7D3ab5wdufil22dOfVQ',
      //   model: '0',
      //   deviceId: '4D6738353236343947140021000F'
      // }
      // 编辑模式用/usr-draw/index.html,
      // 预览模式用/usr-draw/show.html
      window.open(
        `/draw/usr-draw/show.html?lightbox=1&highlight=0000ff&layers=1&nav=1&title=${d.name}&usr_id=${d.id}&usr_model=${d.model}&masterDeviceId=${d.deviceId}#A`,
        'blank'
      )
    },
    a(v) {
      if (v) {
        this.loadingaaa = true
      } else {
        this.loadingaaa = false
        if (this.loadingaaa === 1) {
          cancelLoadingMask()
        }
      }
    },
    init() {
      this.time = this.getCurrentTime('')
      this.navFormInfo.data.num = this.time.split(' ')[0]

      this.getRegionList()
      this.drawCake('')
    },
    handleClick() {},
    // 查询
    queryInfo() {
      this.resetData()
      this.refresh()
    },
    resetData() {
      this.weatherList = {
        name: '-',
        wlWeatherImg: weatherService.getWeatherImg(''),
        ou: '-',
        windlevel: '-',
        hightemp: '-',
        lowertemp: '-',
        humidity: '-'
      }
    },
    // 更新
    refresh() {
      this.time = this.getCurrentTime('')
      this.queryName()
      this.getWeather()
      this.equipmentID()
      this.getPipeChainInfo()
      this.getAlarmInfo()
      this.getDevicesByField()
      this.getMyBaseFieldInfo()
    },
    // 获取当前时间
    getCurrentTime(d) {
      const date = d ? new Date(d) : new Date()
      const Y = date.getFullYear()
      const M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      const D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      const hh = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      const mm = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      const ss = date.getSeconds() < 10 ? '0' + date.getDate() : date.getSeconds()
      const time = Y + '-' + M + '-' + D + ' ' + hh + ':' + mm + ':' + ss
      return time
    },
    // 递归 - children为空则删除children
    fillterChildrenNull(arr) {
      arr.map((i, index) => {
        // i.value = i.parentId
        if (!i.label) { i.label = i.title }
        if (i.children && i.children.length > 0) {
          this.fillterChildrenNull(i.children)
        } else {
          delete i.children
        }
      })
    },
    // 饼形图标
    drawCake(d) {
      const data = [
        // { value: 68, name: '故障' },
        { value: 0, name: '离线' },
        { value: 0, name: '在线' }
      ]
      if (d) {
        data[0].value = d.lixian
        data[1].value = d.zaixian
      }
      this.cakeOption.series[0].data = data
      const DOM = this.$refs.containerEchters
      const myChart = this.$echarts.init(DOM)
      myChart.setOption(this.cakeOption, true)
      // 浏览器窗口变化随之适配
      window.onresize = () => {
        clearTimeout(this.echartsResize)
        this.echartsResize = setTimeout(() => {
          myChart.resize()
        }, 1000)
      }
    },
    // 查询场区名称
    queryName() {
      const arr = this.navFormInfo.data.cascader
      for (const i of this.fieldAreaList) {
        if (i.value === arr[0] && i.children) {
          for (const j of i.children) {
            if (j.value === arr[1] && j.children) {
              for (const k of j.children) {
                if (k.value === arr[2]) {
                  this.weatherList.name = k.title
                }
              }
            }
          }
        }
      }
    },
    // 获取天气
    async getWeather() {
      this.loadingWeather = true
      const data = {
        startDay: this.navFormInfo.data.num,
        endDay: this.navFormInfo.data.num,
        // fieldId: '15350029'
        fieldId: this.navFormInfo.data.cascader[2]
      }
      await myEvcWeatherInfo(data).then((res) => {
        this.loadingWeather = false
        if (res && res.status === 200 && res.data && res.data.rows.length > 0) {
          this.weatherList = Object.assign({}, this.weatherList, res.data.rows[0])
          this.weatherList.wlWeatherImg = weatherService.getWeatherImg(res.data.rows[0].weather)
          this.weatherList.windlevel = this.weatherList.windlevel.split('级')[0]
        }
      }).catch(() => {
        // this.$message.error(err.message)
        this.loadingWeather = false
      })
    },
    // 获取区域列表
    async getRegionList() {
      const data = {
        isBuilding: false
      }
      await getRegionAreaFieldTree(data).then((res) => {
        if (res && res.status === 200) {
          if (res.data && res.data.length > 0) {
            this.navFormInfo.data.cascader[0] = res.data[0].value || null
            this.navFormInfo.data.cascader[1] = res.data[0].children[0].value || null
            this.navFormInfo.data.cascader[2] = res.data[0].children[0].children[0].value || null
            this.navFormInfo.fieldList.left.inpLists[0].placeholder = res.data[0].title + '/' + res.data[0].children[0].title + '/' + res.data[0].children[0].children[0].title

            // this.weatherList.name = res.data[0].children[0].children[0].title
            const arr = JSON.parse(JSON.stringify(res.data))
            this.fillterChildrenNull(arr)
            this.fieldAreaList = arr
            this.navFormInfo.fieldList.left.inpLists[0].options = arr // this.fillterChildrenNull(arr);

            this.refresh()
          }
        } else {
          // this.$message({ type: 'error', message: res.essage })
        }
      })
    },
    // 场区设备id
    async equipmentID() {
      const data = {
        regionld: this.navFormInfo.data.cascader[0],
        areaId: this.navFormInfo.data.cascader[1],
        fieldId: this.navFormInfo.data.cascader[2]
      }
      await getEquipmentId(data).then((res) => {
        if (res && res.status === 200 && res.rel) {
          this.equipmentOU(res.data.deviceId)
        } else {
          // this.$message.error(res.message)
        }
      })
    },
    // 根据设备id获取ou值
    async equipmentOU(deviceId) {
      const data = {
        deviceId: deviceId
      }
      await getEquipmentOu(data).then((res) => {
        if (res && res.status === 200 && res.rel) {
          this.weatherList.ou = res.data[0].odor
        } else {
          // this.$message.error(res.message)
        }
      })
    },
    // 获取管链信息
    async getPipeChainInfo() {
      this.loadingGuanlian = true
      const data = {
        fieldId: this.navFormInfo.data.cascader[2],
        date: this.navFormInfo.data.num
      }
      await pipeChainInfo(data).then((res) => {
        this.loadingGuanlian = false
        if (res && res.status === 200 && res.rel) {
          this.pipeChainData = res.data
          if (res.data.deliverInfo.status !== 0) {
            this.guanlian[0].span = res.data.deliverInfo.totalDeliver || '-'
            this.guanlian[0].shujv[0].weidu = res.data.deliverInfo.deliverQuantity || '-'
            this.guanlian[0].shujv[1].weidu = res.data.deliverInfo.deliverNumber || '-'
            this.guanlian[0].shujv[2].weidu = res.data.deliverInfo.unDeliverQuantity || '-'
            this.guanlian[0].shujv[3].weidu = res.data.deliverInfo.unDeliverNumber || '-'
          }
          if (res.data.feedWaterInfo.status !== 0) {
            this.guanlian[1].span = res.data.feedWaterInfo.avgWater.toFixed(2) || '-'
            this.guanlian[1].shujv[0].weidu = res.data.feedWaterInfo.miRuWater || '-'
            this.guanlian[1].shujv[1].weidu = res.data.feedWaterInfo.baoYuWater || '-'

            this.guanlian[2].span = res.data.feedWaterInfo.avgFeed || '-'
            this.guanlian[2].shujv[0].weidu = res.data.feedWaterInfo.miRuFeed || '-'
            this.guanlian[2].shujv[1].weidu = res.data.feedWaterInfo.baoYuFeed || '-'
          }
        } else {
          // this.$message.error(res.message)
        }
      }).catch(() => {
        // this.$message.error(err.message)
        this.loadingGuanlian = false
      })
    },
    // 设备在线离线
    async getDevicesByField() {
      // this.loadingAlarm1 = true
      // const data = {
      //   fieldId: this.navFormInfo.data.cascader[2]
      // }
      // await getDevicesByField(data).then((res) => {
      //   this.loadingAlarm1 = false
      //   if (res && res.status === 200 && res.rel) {
      //     const data = {
      //       zaixian: 0,
      //       lixian: 0
      //     }
      //     for (const i of res.data.deviceList) {
      //       if (i.statusOnline === 1) { data.zaixian++ }
      //       if (i.statusOnline === 0) { data.lixian++ }
      //     }
      //     this.drawCake(data)
      //   }
      // }).catch(() => {
      //   // this.$message.error(err.message)
      //   this.loadingAlarm1 = false
      // })
    },
    // 获取首页基本信息
    getMyBaseFieldInfo() {
      const data = {
        areaId: this.navFormInfo.data.cascader[1],
        fieldId: this.navFormInfo.data.cascader[2],
        fieldDate: this.navFormInfo.data.num
      }
      myBaseFieldInfo(data).then((res) => {
        if (res && res.status === 200 && res.rel) {
          this.equipment[0].value = res.data.fieldTypeName || '--' // 场区类型
          this.equipment[1].value = res.data.designScale || '--' // 设计规模
          this.equipment[2].value = res.data.personCount || '--' // 员工数量
          this.equipment[3].value = res.data.manager || '--' // 场长
          this.equipment[4].value = res.data.veterinary || '--' // 兽医
          this.equipment[5].value = res.data.productionTime ? res.data.productionTime.split(' ')[0] : '--' // 投产时间
          this.equipment[6].value = res.data.detailAddress || '--' // 投产地址

          this.equipmentInfo[0].value = res.data.type || '--' // 类型
          this.equipmentInfo[1].value = res.data.totalUnitCount || '--' // 总单元数量
          this.equipmentInfo[2].value = res.data.workUnitCount || '--' // 装猪单元数量
          this.equipmentInfo[3].value = res.data.type || '--' // 累计死亡
          this.equipmentInfo[4].value = res.data.type || '--' // 累计死亡率
          this.equipmentInfo[5].value = res.data.currentInventory || '--' // 当前存栏量
          this.equipmentInfo[6].value = res.data.type || '--' // 保育段
          this.equipmentInfo[7].value = res.data.type || '--' // 育肥段
          this.equipmentInfo[8].value = res.data.type || '--' // 后备段
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 获取告警信息
    async getAlarmInfo() {
      // this.loadingAlarm2 = true
      // await getAlarmInfosByField(this.navFormInfo.data.cascader[2]).then((list) => {
      //   this.loadingAlarm2 = false
      //   const res = JSON.parse(JSON.stringify(list))
      //   if (res && res.status === 200 && res.rel) {
      //     let arr = []
      //     for (const i of res.data) {
      //       for (const j in i) {
      //         arr = [...arr, ...i[j]]
      //         this.alarmList2.push({
      //           unit: j,
      //           child: i[j]
      //         })
      //       }
      //     }
      //     this.alarmList = arr
      //     this.alarmInfo.title[0].value = arr.length
      //   }
      // }).catch(() => {
      //   // this.$message.error(err.message)
      //   this.loadingAlarm2 = false
      // })
    }

  }
}
</script>
<style lang="scss" scoped>
.homepage::-webkit-scrollbar,
.homebodyL-guanlian-body::-webkit-scrollbar,
.homebodyR-container-body::-webkit-scrollbar {
  display: none;/*隐藏滚动条*/
}
.homepage{
  width: 100%;
  height: calc(100% - 64px);
  background: url('~@/assets/image/BG.webp') no-repeat 100% 100%;
  padding: 20px;
  overflow-y: scroll;
  overflow-x: hidden;
  color: #cdd8f7;
  &-container{
    height: 100%;
    min-height: 768px;
  }
}
.homehead{
  height: 36px;
  margin-bottom: 20px;
  &-l{
    float: left;
  }
  &-r{
    float: right;
    line-height: 36px;
  }
}
.homebody{
  height: calc(100% - 56px);
  width: 100%;
  display: flex;
  &-title{
    font-weight: 400;
    font-size: 16px;
    line-height: 12px;
  }
  &-title::before {
    content: '';
    height: 100%;
    width: 150%;
    background-image: url('../../assets/border/short-h3-bg4.png');
    background-repeat: no-repeat;
    background-position: top left;
    border-radius: 10px;
    position: absolute;
    top: -5px;
    left: 0px;
    z-index: -50;
  }
}
.homebodyL{
  height: 100%;
  width: 20%;
  &-weather{
    height: 300px;
    background: #0d1e4e;
    &-body{
      &-title{
        text-align: center;
        font-size: 18px;
        padding: 14px 0;
      }
      &-icon{
        height: 66px;
      }
      &-img{
        height: 66px;
        display: inherit;
        margin: 0 auto;
      }
      &-main{
        display: flex;
        flex-wrap: wrap;
        margin-top: 5px;
        &-col{
          margin: 0 auto;
          margin-top: 10px;
          width: 40%;
          font-family: PingFangSC-Regular;
          color: #0e759f;
          &-left{
            padding-left: 15%;
          }
          div{
            max-width: 105px;
            margin: 0 auto;
          }
          p{
            font-size: 14px;
          }
          h2{
            font-family: ConthraxSb-Regular;
            font-size: 30px;
            color: #1fbfff;
            font-weight: 400;
            span{
              font-size: 20px;
            }
          }
        }
        &-col:nth-of-type(2n-1){
          margin-left: 10%;
        }
      }
    }
  }

  //管链
  &-guanlian{
    height: calc(100% - 320px);
    margin-top: 20px;
    background: #0d1e4e;
    &-body{
      margin: 30px 10px 15px 10px;
      height: calc(100% - 50px);
      overflow: hidden;
      overflow-y: scroll;
      &-item{
        margin-bottom:20px;
        box-sizing: border-box;
        background-image: linear-gradient(225deg, #233578 0%, #1D2A69 100%);
        border-radius: 4px;
        border-radius: 4px;
        text-align: center;
        padding-bottom: 20px;
        display: flex;
        flex-wrap: wrap;
        &-title{
          font-size: 14px;
          color: #8EA0EA;
          line-height: 60px;
          width: 100%;
          span{
            font-size: 14px;
            color: #fff;
          }
        }
        &-shuzhi{
          width: 50%;
          float: left;
          padding: 10px 0;
          box-sizing: border-box;
        }
        &-shuzhi:nth-child(2n){
          border-right: 1px solid #2C3D83;
        }
        &-t{
          font-size: 24px;
          color: #CDD8F7;
        }
        &-b{
          font-size: 14px;
          color: #8EA0EA;
        }
      }
    }
  }
}
.homebodyC{
  height: 100%;
  flex: 1;
  margin: 0 20px;
  background: #0d1e4e;
  &-top{
    &-img{
      width: 100%;
      // width: 80%;
      // margin: 0 auto;
      // display: inherit;
    }
    &-tips{
      width: 180px;
      padding: 10px;
      font-size: 12px;
      position: absolute;
      top: 60px;
      left: 20px;
      background: rgba(10,27,70,0.80);
      border: 1px solid #18599A;
      border-radius: 4px;
      border-radius: 4px;
      z-index: 999;
      line-height: 24px;
      &-row{
        display: flex;
        &-l{
          white-space:nowrap;
          width: 60px;
          color: #7687B6;
          text-align: justify;
          text-align-last: justify;
        }
        &-r{
          color: #fff;
          padding-left: 10px;
          box-sizing: border-box;
          text-align: left;
        }
      }
    }
  }
  &-bottom{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40%;
    max-height: 300px;
    display: flex;
    &-l{
      width: 40%;
      height: 100%;
      &-echters{
        width: 100%;
        height: 100%;
      }
    }
    &-r{
      padding: 20px;
      flex: 1;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      &-row{
        width: 33.3%;
        text-align: center;
        position: relative;
        &-tip{
          font-size: 24px;
          color: #cdd8f7;
        }
        &-value{
          font-size: 14px;
          color: #8ea0ea;
          line-height: 30px;
        }
      }
      &-col{
        position: absolute;
        top: 50%;
        width: 100%;
        transform: translate(0, -50%);
      }
      &-col2:after{
        content: "";
        height: 50%;
        width: 1px;
        background: #424F75;
        position: absolute;
        top: 50%;
        right: 0;
        transform: translate(0, -50%);
      }
    }
  }
}
.homebodyR{
  height: 100%;
  width: 20%;
  background: #0d1e4e;
  &-head{
    display: flex;
    background: #263880;
    border-radius: 8px;
    padding: 20px 0;
    margin-top: 30px;
    &-row{
      padding: 0 5px;
      flex: 1;
      display: flex;
      &-img{
        width: 40px;
        height: 43px;
        margin: 10px;
      }
      &-col{
        color: #8ea0ea;
        p{
          font-size: 30px;
        }
        span{
          font-size: 14px;
        }
      }
    }
  }
  &-container{
    height: calc(100% - 160px);
    &-head{
      height: 100%;
      &-tip{
        position: relative;
        >i{
          padding:3px 5px;
          background: #E45353 ;
          color: #fff;
          position: absolute;
          top: 0;
          right: -25px;
          font-style:normal;
          font-size: 10px;
          line-height: 10px;
          border-radius: 10px;
        }
      }
    }
    &-body{
      overflow-y: scroll;
      height: 100%;
      list-style-type: square;
      &-col{
        // height: 35px;
        line-height: 35px;
        font-size: 14px;
        position: relative;
        span{
          padding-left: 20px;
        }
        span:after{
          content: "";
          height: 4px;
          width: 4px;
          border-radius: 4px;
          background: #fff;
          position: absolute;
          top: 50%;
          left: 8px;
          transform: translate(0, -50%);
        }
      }
    }
  }
}
.aaa{
  width: 200px;
  height: 100px;
  border: 1px solid red;
}
</style>
<style lang="scss">
.homebodyR-container{
  .el-tabs__content{
    height: calc(100% - 65px);
    .el-tab-pane{
      height: 100%;
    }
  }
}

</style>
