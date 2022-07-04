<template>
  <div class="home el-delogBG2 RegionalMonitoring">
    <!-- 头部导航 -->
    <nav-form ref="navForm" :data="navFormInfo.data" :field-list="navFormInfo.fieldList">
      <span slot="right" @click="exportData()">
        <!-- <el-tooltip class="" effect="dark" content="导出" placement="top-start">
          <img src="@/assets/image/export.png">
        </el-tooltip> -->
        <el-button class="btn-blue">
          <svg-icon icon-class="newExport" />
          导出
        </el-button>
      </span>
    </nav-form>
    <!-- 柱状图 -->
    <div>
      <div class="flex marB10">
        <div v-loading="isLoading" class="inspection-charts Highlight marR10">
          <div v-if="chartShow">
            <!-- <img class="regionNodata" src="@/assets/image/page/noData.png" alt=""> -->
            <img :src="url" class="regionNodata" alt="暂无数据">
          </div>
          <div v-else ref="chartOne" :pie-data="chartOneData" title="" class="w350" el-id="chartPie1" />
        </div>
        <div v-loading="isLoading" class="inspection-charts Highlight marR10">
          <div v-if="chartShow">
            <!-- <img class="regionNodata" src="@/assets/image/page/noData.png" alt=""> -->
            <img :src="url" class="regionNodata" alt="暂无数据">
          </div>
          <div v-else ref="chartTwo" :pie-data="chartTwoData" title="" class="w350" el-id="chartPie2" />
        </div>
      </div>
      <div class="flex">
        <div v-loading="isLoading" class="inspection-charts Highlight marR10">
          <div v-if="chartShow">
            <!-- <img class="regionNodata" src="@/assets/image/page/noData.png" alt=""> -->
            <img :src="url" class="regionNodata" alt="暂无数据">
          </div>
          <div v-else ref="chartThree" :pie-data="chartThreeData" title="" class="w350" el-id="chartPie3" />
        </div>
        <div v-loading="isLoading" class="inspection-charts Highlight marR10">
          <div v-if="chartShow">
            <!-- <img class="regionNodata" src="@/assets/image/page/noData.png" alt=""> -->
            <img :src="url" class="regionNodata" alt="暂无数据">
          </div>
          <div v-else ref="chartFour" :pie-data="chartFourData" title="" class="w350" el-id="chartPie4" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navForm from '@/components/commonComponent/navForm/index.vue'
// import ChartBar from '../components/chart'
// import echarts from 'echarts'
import { evcJsonh2Tree } from '@/components/tree/evcJsonh2Tree.js'
// import { informationList, getRegionAreaFieldRoomTypeUnitV2 } from '@/http/api/RegionalMonitoring'
import { derive } from '@/http/api/exportData/export'
import { getConfigElement } from '@/utils/overtService'

const navFormInfo = (that) => {
  return {
    navFormInfo: {
      data: {
        area: [],
        pushStatus: '',
        workSection: '',
        unit: '',
        time: []
      },
      fieldList: {
        left: {
          inpLists: [
            {
              key: 'area',
              type: 'cascader',
              checkStrictly: false,
              customLabel: 'title',
              className: 'shadow',
              placeholder: '大区 / 区域 / 场区',
              options: []
            },
            {
              key: 'time',
              type: 'date',
              className: 'shadow',
              dateType: 'datetimerange',
              startPlaceholder: '开始时间',
              endPlaceholder: '结束时间'
            }
          ],
          btnLists: [
            {
              innerText: '查询',
              className: 'btn-blue',
              handleClick: () => {
                that.drawChart()
              }
            },
            {
              innerText: '重置',
              className: 'btn-border',
              handleClick: () => {
                that.$refs['navForm'].resetFields()
              }
            }
          ]
        },
        right: {

        }
      }
    }
  }
}
export default {
  components: {
    navForm
    // ChartBar
  },
  data() {
    return {
      titleStyle: '',
      xAxislineStyle: '',
      xAxisaxisLabel: '',
      legendStyle: '',
      yAxissplitLine: '',
      yAxisaxisLine: '',
      yAxisaxisLabel: '',
      yAxisnameTextStyle: '',
      url: null,
      chartShow: true,
      isLoading: false,
      dialogFormVisible: false,
      title: '查看',
      status: 0, // 0=>查看 1=>xinzeng  2=>修改
      downlist: [],
      selection: '',
      row: '', // 当前选中行的数据
      search: {
        deviceId: '', // 设备标识
        mac: '', // mac地址
        limit: '', // 一页多少条
        page: '', // 页码
        regionId: '',
        areaId: '',
        fieldId: '',
        startTime: '',
        endTime: '',
        // roomTypeId: '',
        // unitId: '',
        // status: '',
        controllerType: 'BUNGALOW_UNIT_CONTROLLER'
      },
      navFormInfo: {
        data: {
          area: [],
          time: ''
        }},
      submit: {
        areaId: '',
        fieldId: '',
        roomTypeId: '',
        unitId: '',
        deviceId: '',
        deviceVersionId: '',
        deviceVersionName: '',
        equipmentId: '',
        equiptypeId: '',
        equiptypeName: '',
        deviceName: ''
      },
      auditarr: [], // 已审核数组
      unAuditarr: [], // 未审核数组
      ...navFormInfo(this),
      // 表单对应列表
      listTypeInfo: {
        typeList: [
        ]
      },
      tableData: [],
      chartOneData: [],
      chartTwoData: [],
      chartThreeData: [],
      chartFourData: [],
      xNameList1: [],
      xNameList2: [],
      xNameList3: [],
      xNameList4: [],
      seriesList1: [],
      seriesList2: [],
      seriesList3: [],
      seriesList4: [],
      defaultValue: [], // 默认选中
      option1: {
        legend: {
          data: '',
          textStyle: {
            color: '#fff'
          }
        },
        title: {
          text: '',
          left: 'center',
          padding: [30, 0, 0, 0],
          textStyle: {
            color: '#fff',
            fontSize: 13
          }
        },
        color: ['#3880e8', '#27bf8f', '#6ec8ec'],
        xAxis: [{
          type: 'category',
          inverse: 'false',
          data: [],
          axisLine: {
            show: true,
            lineStyle: {
              color: '#CDD8F7'
            }
          },
          axisLabel: {
            interval: 0,
            rotate: 40,
            textStyle: {
              color: '#fff'
            }
          }
        }],
        yAxis: {
          type: 'value',
          name: '报警单元数排名',
          // min: 0,
          // max: 800,
          nameTextStyle: {
            color: '#fff',
            padding: [0, 0, 30, 20]
          },
          axisLabel: {
            textStyle: {
              color: '#fff'
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#CDD8F7'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#242E5B'
            }
          }
        },
        series: [{
          data: [],
          type: 'bar',
          barWidth: 30,
          itemStyle: {
            normal: {
              color: new this.$echarts.graphic.LinearGradient(
                0, 1, 0, 0, [{
                  offset: 0,
                  color: '#ff7134'
                },
                {
                  offset: 1,
                  color: '#ff5988'
                }
                ]
              ),
              label: {
                show: true,
                position: 'top',
                textStyle: {
                  color: '#fff'
                }
              }
            }
          }
        }]
      },
      option2: {
        legend: {
          data: '',
          textStyle: {
            color: '#fff'
          }
        },
        title: {
          text: '',
          left: 'center',
          padding: [30, 0, 0, 0],
          textStyle: {
            color: '#fff',
            fontSize: 13
          }
        },
        color: ['#3880e8', '#27bf8f', '#6ec8ec'],
        xAxis: [{
          type: 'category',
          inverse: 'false',
          data: [],
          axisLine: {
            show: true,
            lineStyle: {
              color: '#CDD8F7'
            }
          },
          axisLabel: {
            interval: 0,
            rotate: 40,
            textStyle: {
              color: '#fff'
            }
          }
        }],
        yAxis: {
          type: 'value',
          name: '设备故障单元数排名',
          // min: 0,
          // max: 800,
          nameTextStyle: {
            color: '#fff',
            padding: [0, 0, 30, 20]
          },
          axisLabel: {
            textStyle: {
              color: '#fff'
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#CDD8F7'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#242E5B'
            }
          }
        },
        series: [{
          data: [],
          type: 'bar',
          barWidth: 30,
          itemStyle: {
            normal: {
              color: new this.$echarts.graphic.LinearGradient(
                0, 0, 0, 1, [
                  { offset: 0, color: '#06B5D7' },
                  { offset: 0.5, color: '#44C0C1' },
                  { offset: 1, color: '#71C8B1' }
                ]
              ),
              label: {
                show: true,
                position: 'top',
                textStyle: {
                  color: '#fff'
                }
              }
            }
          }
        }]
      },
      option3: {
        legend: {
          data: '',
          textStyle: {
            color: '#fff'
          }
        },
        title: {
          text: '',
          left: 'center',
          padding: [30, 0, 0, 0],
          textStyle: {
            color: '#fff',
            fontSize: 13
          }
        },
        color: ['#3880e8', '#27bf8f', '#6ec8ec'],
        xAxis: [{
          type: 'category',
          inverse: 'false',
          data: [],
          axisLine: {
            show: true,
            lineStyle: {
              color: '#CDD8F7'
            }
          },
          axisLabel: {
            interval: 0,
            rotate: 40,
            textStyle: {
              color: '#fff'
            }
          }
        }],
        yAxis: {
          type: 'value',
          name: '温度跳变单元数排名',
          // min: 0,
          // max: 800,
          nameTextStyle: {
            color: '#fff',
            padding: [0, 0, 30, 20]
          },
          axisLabel: {
            textStyle: {
              color: '#fff'
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#CDD8F7'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#242E5B'
            }
          }
        },
        series: [{
          data: [],
          type: 'bar',
          barWidth: 30,
          itemStyle: {
            normal: {
              color: new this.$echarts.graphic.LinearGradient(
                0, 1, 0, 0, [{
                  offset: 0,
                  color: '#005BEA'
                },
                {
                  offset: 1,
                  color: '#00C6FB'
                }
                ]
              ),
              label: {
                show: true,
                position: 'top',
                textStyle: {
                  color: '#fff'
                }
              }
            }
          }
        }]
      },
      option4: {
        legend: {
          data: '',
          textStyle: {
            color: '#fff'
          }
        },
        title: {
          text: '',
          left: 'center',
          padding: [30, 0, 0, 0],
          textStyle: {
            color: '#fff',
            fontSize: 13
          }
        },
        color: ['#3880e8', '#27bf8f', '#6ec8ec'],
        xAxis: [{
          type: 'category',
          inverse: 'false',
          data: [],
          axisLine: {
            show: true,
            lineStyle: {
              color: '#CDD8F7'
            }
          },
          axisLabel: {
            interval: 0,
            rotate: 40,
            textStyle: {
              color: '#fff'
            }
          }
        }],
        yAxis: {
          axisLine: {
            show: true,
            lineStyle: {
              color: '#CDD8F7'
            }
          },
          type: 'value',
          name: '变频故障单元数排名',
          // min: 0,
          // max: 800,
          nameTextStyle: {
            color: '#fff',
            padding: [0, 0, 30, 20]
          },
          axisLabel: {
            textStyle: {
              color: '#fff'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#242E5B'
            }
          }
        },
        series: [{
          data: [],
          type: 'bar',
          barWidth: 30,
          itemStyle: {
            normal: {
              color: new this.$echarts.graphic.LinearGradient(
                0, 1, 0, 0, [
                  { offset: 0, color: '#619aff' },
                  { offset: 1, color: '#c346ff' }
                ]
              ),
              label: {
                show: true,
                position: 'top',
                textStyle: {
                  color: '#fff'
                }
              }
            }
          }
        }]
      }
    }
  },
  computed: {
    allStyles() {
      return this.$store.state.echartStyle.allStyles
    }
  },
  watch: {
    // 赋值搜索条件
    'navFormInfo.data': {
      handler: function(n) {
        if (n.time) {
          this.search.fromTime =
            n.time[0] || this.formatDate(new Date().getTime() - 86400000 * 2)
          this.search.toTime =
            n.time[1] || this.formatDate(new Date().getTime())
        } else {
          // 防止未null===报错
          this.search.fromTime = this.formatDate(
            new Date().getTime() - 86400000 * 2
          )
          this.search.toTime = this.formatDate(new Date().getTime())
        }
        console.log(n.area, 223222333)
        this.search.regionId = n.area[0] || ''
        this.search.areaId = n.area[1] || ''
        this.search.fieldId = n.area[2] || ''
      },
      deep: true
    },
    'allStyles.flag'(newValue, oldValue) {
      console.log('lStyles.fla', this.allStyles)
      this.initUrl()
      this.setChart()
    }
  },
  // created() {
  //   this.getChartData()
  // },
  mounted() {
    // this.$nextTick(() => {
    //   this.setChart()
    // })
    this.initUrl()
    this.getTree()
  },
  methods: {
    initUrl() {
      this.url = this.$getImgUrl('noData', 'svg')
    },
    handleChange() {
    },
    // 审核数据接口
    setReview(idArr) {
    },
    // 反审核数据接口
    setUnreview(idArr) {
    },
    // 获取正确的事件格式
    formatDate(dateValue) {
      var date = new Date(dateValue)
      var YY = date.getFullYear() + '-'
      var MM =
        (date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) + '-'
      var DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      return YY + MM + DD + ' '
    },
    getTree() {
      const element = getConfigElement('unit-evcDataInterface')
      console.log(element)
      this.$httpRequest({
        type: element ? element.getRegionAreaFieldRoomTypeUnitV2.method : '',
        uri: element ? element.getRegionAreaFieldRoomTypeUnitV2.uri : '',
        payload: '',
        callback: (res) => {
          if (res && res.status === 200 && res.rel) {
            const arr = evcJsonh2Tree(res.data)
            arr.forEach(item => {
              if (item.children && item.children.length) {
                item.children.forEach(child => {
                  if (child.children && child.children.length) {
                    child.children.forEach(delItem => {
                      delete delItem.children
                    })
                  }
                })
              }
            })
            this.navFormInfo.fieldList.left.inpLists[0].options = arr
            this.defaultValueMe(this.navFormInfo.fieldList.left.inpLists[0].options)
            this.search.fromTime = this.formatDate(new Date().getTime() - (86400000 * 2))
            this.search.toTime = this.formatDate(new Date().getTime())
            this.navFormInfo.data.time = [this.search.fromTime, this.search.toTime]
            // this.navFormInfo.data.area = this.defaultValue
          }
        }
      })
      // getRegionAreaFieldRoomTypeUnitV2().then((data) => {
      //   const arr = evcJsonh2Tree(data.data)
      //   arr.forEach(item => {
      //     if (item.children && item.children.length) {
      //       item.children.forEach(child => {
      //         if (child.children && child.children.length) {
      //           child.children.forEach(delItem => {
      //             delete delItem.children
      //           })
      //         }
      //       })
      //     }
      //   })
      //   this.navFormInfo.fieldList.left.inpLists[0].options = arr
      //   this.defaultValueMe(this.navFormInfo.fieldList.left.inpLists[0].options)
      //   this.search.fromTime = this.formatDate(new Date().getTime() - (86400000 * 2))
      //   this.search.toTime = this.formatDate(new Date().getTime())
      //   this.navFormInfo.data.time = [this.search.fromTime, this.search.toTime]
      //   this.navFormInfo.data.area = this.defaultValue
      // })
      // setTimeout((e) => {
      //   this.drawChart()
      // }, 50)
    },
    // 默认选中
    defaultValueMe(arr) {
      if (!arr || arr.length === 0) {
        return
      }
      this.defaultValue.push(arr[0].value)
      if (arr[0].children) {
        this.defaultValueMe(arr[0].children)
      }
    },
    drawChart() {
      // if (this.xNameList1) {
      this.xNameList1 = []
      this.xNameList2 = []
      this.xNameList3 = []
      this.xNameList4 = []
      this.seriesList1 = []
      this.seriesList2 = []
      this.seriesList3 = []
      this.seriesList4 = []
      // }
      this.getChartData()
    },
    sortByUnitWarnNum(a, b) {
      if (a.unitWarnNum > b.unitWarnNum) {
        return 1
      } else if (a.unitWarnNum < b.unitWarnNum) {
        return -1
      } else {
        return 0
      }
    },
    sortByUnitTroubleNum(a, b) {
      if (a.unitTroubleNum > b.unitTroubleNum) {
        return 1
      } else if (a.unitTroubleNum < b.unitTroubleNum) {
        return -1
      } else {
        return 0
      }
    },
    sortByUnitTemperatureJumpNum(a, b) {
      if (a.unitTemperatureJumpNum > b.unitTemperatureJumpNum) {
        return 1
      } else if (a.unitTemperatureJumpNum < b.unitTemperatureJumpNum) {
        return -1
      } else {
        return 0
      }
    },
    sortByUnitfrequencyTroubleNum(a, b) {
      if (a.unitfrequencyTroubleNum > b.unitfrequencyTroubleNum) {
        return 1
      } else if (a.unitfrequencyTroubleNum < b.unitfrequencyTroubleNum) {
        return -1
      } else {
        return 0
      }
    },
    // 获取图表信息
    getChartData() {
      if (this.search.regionId === '') {
        this.$message({
          message: '请选择大区',
          type: 'warning'
        })
        return
      }
      this.chartShow = false
      this.isLoading = true
      const obj = {
        regionId: this.search.regionId,
        areaId: this.search.areaId,
        fieldId: this.search.fieldId,
        beginDate: this.search.fromTime,
        endDate: this.search.toTime
      }
      const element = getConfigElement('unitevc_realTimeAlarmAnalysis')
      console.log(element)
      this.$httpRequest({
        type: element ? element.RealTimeWarnAnalysis.method : '',
        uri: element ? element.RealTimeWarnAnalysis.uri : '',
        payload: obj,
        callback: (res) => {
          this.isLoading = false
          if (res && res.status === 200 && res.rel) {
            const data = res.data || {}
            this.option1.title.text = '共计：' + data.unitWarnTotal
            this.option2.title.text = '共计：' + data.unitTroubleTotal
            this.option3.title.text = '共计：' + data.unitTemperatureJumpTotal
            this.option4.title.text = '共计：' + data.unitFrequencyTroubleTotal
            const dataList = res.data.list || []
            const warnNum = dataList.sort(this.sortByUnitWarnNum)
            warnNum.map(res => {
              this.xNameList1.push(res.xName)
              this.seriesList1.push(res.unitWarnNum)
            })
            this.option1.xAxis[0].data = this.xNameList1
            this.option1.series[0].data = this.seriesList1

            const TroubleNum = dataList.sort(this.sortByUnitTroubleNum)
            TroubleNum.map(res => {
              this.xNameList2.push(res.xName)
              this.seriesList2.push(res.unitTroubleNum)
            })
            this.option2.xAxis[0].data = this.xNameList2
            this.option2.series[0].data = this.seriesList2

            const TemperatureJumpNum = dataList.sort(this.sortByUnitTemperatureJumpNum)
            TemperatureJumpNum.map(res => {
              this.xNameList3.push(res.xName)
              this.seriesList3.push(res.unitTemperatureJumpNum)
            })
            this.option3.xAxis[0].data = this.xNameList3
            this.option3.series[0].data = this.seriesList3

            const frequencyTroubleNum = dataList.sort(this.sortByUnitfrequencyTroubleNum)
            frequencyTroubleNum.map(res => {
              this.xNameList4.push(res.xName)
              this.seriesList4.push(res.unitfrequencyTroubleNum)
            })
            this.option4.xAxis[0].data = this.xNameList4
            this.option4.series[0].data = this.seriesList4
            // setTimeout(() => {
            // this.getChartData()
            // }, 100)
            this.setChart()
          }
        }
      })
      // informationList(obj).then(res => {
      //   const data = res.data || {}
      //   this.option1.title.text = '共计：' + data.unitWarnTotal
      //   this.option2.title.text = '共计：' + data.unitTroubleTotal
      //   this.option3.title.text = '共计：' + data.unitTemperatureJumpTotal
      //   this.option4.title.text = '共计：' + data.unitFrequencyTroubleTotal
      //   const dataList = res.data.list || []
      //   const warnNum = dataList.sort(this.sortByUnitWarnNum)
      //   warnNum.map(res => {
      //     this.xNameList1.push(res.xName)
      //     this.seriesList1.push(res.unitWarnNum)
      //   })
      //   this.option1.xAxis[0].data = this.xNameList1
      //   this.option1.series[0].data = this.seriesList1

      //   const TroubleNum = dataList.sort(this.sortByUnitTroubleNum)
      //   TroubleNum.map(res => {
      //     this.xNameList2.push(res.xName)
      //     this.seriesList2.push(res.unitTroubleNum)
      //   })
      //   this.option2.xAxis[0].data = this.xNameList2
      //   this.option2.series[0].data = this.seriesList2

      //   const TemperatureJumpNum = dataList.sort(this.sortByUnitTemperatureJumpNum)
      //   TemperatureJumpNum.map(res => {
      //     this.xNameList3.push(res.xName)
      //     this.seriesList3.push(res.unitTemperatureJumpNum)
      //   })
      //   this.option3.xAxis[0].data = this.xNameList3
      //   this.option3.series[0].data = this.seriesList3

      //   const frequencyTroubleNum = dataList.sort(this.sortByUnitfrequencyTroubleNum)
      //   frequencyTroubleNum.map(res => {
      //     this.xNameList4.push(res.xName)
      //     this.seriesList4.push(res.unitfrequencyTroubleNum)
      //   })
      //   this.option4.xAxis[0].data = this.xNameList4
      //   this.option4.series[0].data = this.seriesList4
      //   // setTimeout(() => {
      //   this.getChartData()
      //   // }, 100)
      // })
    },
    setChart() {
      // 统计图1
      this.option1.xAxis[0].axisLine.lineStyle.color = this.allStyles.xAxisColor
      this.option1.xAxis[0].axisLabel.textStyle.color = this.allStyles.xAxisName
      this.option1.legend.textStyle.color = this.allStyles.xAxisName
      this.option1.title.textStyle.color = this.allStyles.xAxisName

      this.option1.yAxis.splitLine.lineStyle.color = this.allStyles.splitLineCol
      this.option1.yAxis.axisLine.lineStyle.color = this.allStyles.yAxisColor
      this.option1.yAxis.axisLabel.textStyle.color = this.allStyles.yAxisName
      this.option1.yAxis.nameTextStyle.color = this.allStyles.yAxisName
      this.option1.series[0].itemStyle.normal.label.textStyle.color = this.allStyles.yAxisName

      // 统计图2
      this.option2.xAxis[0].axisLine.lineStyle.color = this.allStyles.xAxisColor
      this.option2.xAxis[0].axisLabel.textStyle.color = this.allStyles.xAxisName
      this.option2.legend.textStyle.color = this.allStyles.xAxisName
      this.option2.title.textStyle.color = this.allStyles.xAxisName

      this.option2.yAxis.splitLine.lineStyle.color = this.allStyles.splitLineCol
      this.option2.yAxis.axisLine.lineStyle.color = this.allStyles.yAxisColor
      this.option2.yAxis.axisLabel.textStyle.color = this.allStyles.yAxisName
      this.option2.yAxis.nameTextStyle.color = this.allStyles.yAxisName
      this.option2.series[0].itemStyle.normal.label.textStyle.color = this.allStyles.yAxisName

      // 统计图3
      this.option3.xAxis[0].axisLine.lineStyle.color = this.allStyles.xAxisColor
      this.option3.xAxis[0].axisLabel.textStyle.color = this.allStyles.xAxisName
      this.option3.legend.textStyle.color = this.allStyles.xAxisName
      this.option3.title.textStyle.color = this.allStyles.xAxisName

      this.option3.yAxis.splitLine.lineStyle.color = this.allStyles.splitLineCol
      this.option3.yAxis.axisLine.lineStyle.color = this.allStyles.yAxisColor
      this.option3.yAxis.axisLabel.textStyle.color = this.allStyles.yAxisName
      this.option3.yAxis.nameTextStyle.color = this.allStyles.yAxisName
      this.option3.series[0].itemStyle.normal.label.textStyle.color = this.allStyles.yAxisName

      // 统计图4
      this.option4.xAxis[0].axisLine.lineStyle.color = this.allStyles.xAxisColor
      this.option4.xAxis[0].axisLabel.textStyle.color = this.allStyles.xAxisName
      this.option4.legend.textStyle.color = this.allStyles.xAxisName
      this.option4.title.textStyle.color = this.allStyles.xAxisName

      this.option4.yAxis.splitLine.lineStyle.color = this.allStyles.splitLineCol
      this.option4.yAxis.axisLine.lineStyle.color = this.allStyles.yAxisColor
      this.option4.yAxis.axisLabel.textStyle.color = this.allStyles.yAxisName
      this.option4.yAxis.nameTextStyle.color = this.allStyles.yAxisName
      this.option4.series[0].itemStyle.normal.label.textStyle.color = this.allStyles.yAxisName

      const myChart1 = this.$echarts.init(this.$refs.chartOne)
      myChart1.setOption(this.option1, true)
      const myChart2 = this.$echarts.init(this.$refs.chartTwo)
      myChart2.setOption(this.option2, true)
      const myChart3 = this.$echarts.init(this.$refs.chartThree)
      myChart3.setOption(this.option3, true)
      const myChart4 = this.$echarts.init(this.$refs.chartFour)
      myChart4.setOption(this.option4, true)
    },
    // 导出数据
    exportData() {
      let regionName = ''
      let areaName = ''
      let fieldName = ''
      this.navFormInfo.fieldList.left.inpLists[0].options.map(a => {
        if (this.navFormInfo.data.area[0] === a.value) {
          regionName = a.title
          a.children.map(b => {
            if (this.navFormInfo.data.area[1] && this.navFormInfo.data.area[1] === b.value) {
              areaName = b.title
              b.children.map(c => {
                if (this.navFormInfo.data.area[2] && this.navFormInfo.data.area[2] === c.value) {
                  fieldName = c.title
                }
              })
            }
          })
        }
      })
      const obj = {
        regionId: this.search.regionId,
        areaId: this.search.areaId,
        fieldId: this.search.fieldId,
        regionName: regionName,
        areaName: areaName,
        fieldName: fieldName
      }
      console.log(obj, '选择导出地区')
      const element = getConfigElement('fieldDeviceOverview')
      const url = element ? element.deviceExport.uri : ''
      derive('/api' + url, obj)
    }
  }
}
</script>
<style lang="scss">
.RegionalMonitoring{
  .el-cascader-node.in-active-path{
  background-color: #034c90;
}
.export-icon-btn{
  cursor: pointer;
  height: 36px;
  padding: 7px 0;
}
.regionNodata{
  width: auto;
  height: 190px;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 9% auto;
  z-index: 999;
  justify-content: center;
  align-items: center;
}
}
</style>
<style lang="scss" scoped>
.el-delogBG2 {
  .el-dialog {
    max-width: 662px;
  }
}
.inspection-charts {
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0 0 0;
}
.marR10{
  margin-right:10px !important;
}
.marB10{
  margin-bottom: 10px !important;
}
.flex {
  width: 100%;
  height: calc(50vh - 97px);
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 20px;
}
.w350 {
  width: 100%;
  height: 100%;
}
</style>
