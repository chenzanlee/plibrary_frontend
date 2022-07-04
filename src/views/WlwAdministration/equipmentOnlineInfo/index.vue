<template>
  <div class="equipmentOnlineInfo titleHighlight">
    <h3 class="short-title2">设备在线情况</h3>
    <!-- 头部导航 -->
    <nav-form
      ref="navForm"
      style="margin-left:10px;margin-bottom:10px;"
      :data="navFormInfo.data"
      :field-list="navFormInfo.fieldList"
      @dateChange="dateChange"
    />
    <div class="chartContent">
      <div id="equipmentOnline" v-loading="isLoading" class="chart" />
    </div>
  </div>
</template>
<script>
import navForm from '@/components/commonComponent/navForm/index.vue'
import { getConfigElement } from '@/utils/overtService'
export default {
  components: {
    navForm
  },
  data() {
    return {
      isLoading: false,
      pageElement: [], // 页面权限数组
      dataInterface: [], // 数据接口权限数组
      option: {
        title: {
          show: false,
          textStyle: {
            color: '#CDD8F7',
            fontSize: 20
          },
          text: '暂无数据',
          left: 'center',
          top: 'center'
        },
        tooltip: {
          trigger: 'axis',
          confine: true,
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'cross', // 默认为直线，可选为：'line' | 'shadow'
            label: {
              backgroundColor: '#505765'
            }
          },
          formatter: (val) => {
            let str = ''
            // console.log(val)
            let valueTotal = ''
            valueTotal = val.reduce((a, b) => { return a + b.value }, 0)
            val.forEach((item, index) => {
              if (index === 0) {
                str = `<span style="display: inline-block; width:200px;">日期: ${item.axisValue}
                <span style="display: inline-block; width:150px;text-align:center">总在线数: ${valueTotal}</span>
                </span></br>`
              }
              if ((index + 1) % 3 === 0) {
                str += `<span style="display: inline-block; width:200px;">${item.seriesName}: ${item.value}</span></br>`
              } else {
                str += `<span style="display: inline-block; width:200px;">${item.seriesName}: ${item.value}</span>`
              }
            })
            return str
          }
        },
        legend: {
          type: 'scroll',
          pageIconColor: '#CDD8F7',
          pageIconInactiveColor: '#8EA0EA',
          pageTextStyle: {
            color: '#CDD8F7'
          },
          pageButtonGap: '10',
          left: '10%',
          right: '10%',
          data: [],
          textStyle: {
            color: '#CDD8F7'
          }
        },
        grid: {
          left: '50px',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: [],
          boundaryGap: true,
          // 设置轴线的属性
          axisLine: {
            lineStyle: {
              color: '#CDD8F7'
            }
          },
          axisLabel: {
            textStyle: {
              color: '#CDD8F7'
            }
          },
          axisTick: {
            alignWithLabel: true
          },
          nameTextStyle: {}
        },
        yAxis: {
          type: 'value',
          name: '在线数量（台）',
          // 设置轴线的属性
          axisLine: {
            lineStyle: {
              color: '#CDD8F7'
            }
          },
          axisLabel: {
            textStyle: {
              color: '#CDD8F7'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#242E5B'
            }
          },
          nameTextStyle: {}
        },
        series: []
      },
      tableData: [],
      navFormInfo: {
        data: {
          time: [], // 日期
          startDate: '',
          endDate: '',
          equiptypeId: '' // 设备类型
        },
        fieldList: {
          right: {
            inpLists: [
              {
                key: 'time',
                type: 'date',
                className: 'shadow',
                dateType: 'daterange',
                clearable: false,
                startPlaceholder: '开始时间',
                endPlaceholder: '结束时间'
              },
              {
                key: 'equiptypeId',
                type: 'select',
                className: 'shadow',
                placeholder: '设备类型',
                filterable: true,
                clearable: true,
                list: [],
                props: {
                  label: 'equiptype_name',
                  value: 'id'
                }
                // handleChange: () => {
                //   this.getMyEvcMcuInfo()
                // }
              }
            ],
            btnLists: [
              {
                innerText: '查询',
                className: 'btn-blue',
                handleClick: () => {
                  this.getMyEvcMcuInfo()
                }
              }
            ]
          }
        }
      }
    }
  },
  computed: {
    allStyles() {
      return this.$store.state.echartStyle.allStyles
    }
  },
  watch: {
    tableData: {
      handler(newVal, oldValue) {
        if (newVal) {
          this.option.xAxis.data = []
          this.option.series = []
          this.option.legend.data = []
          newVal.map(item => {
            const obj = { type: 'line' }
            this.option.legend.data.push(item.equipTypeName)
            obj['name'] = item.equipTypeName
            obj['data'] = item.data.map(item1 => { return item1['onlineCount'] })
            this.option.series.push(obj)
          })
          if (newVal.length > 0) {
            newVal[0].data.map(item => {
              this.option.xAxis.data.push(item.crtDate.split(' ')[0])
            })
          } else {
            this.option.xAxis.data = []
          }
          this.$nextTick(() => {
            const myChart = this.$echarts.init(document.getElementById('equipmentOnline'))
            console.log('this.option---', this.option)
            this.option.title.textStyle.color = this.allStyles.titleColor
            this.option.xAxis.axisLabel.textStyle.color = this.allStyles.xAxisName
            this.option.xAxis.axisLine.lineStyle.color = this.allStyles.xAxisColor
            this.option.xAxis.nameTextStyle.color = this.allStyles.xAxisName
            this.option.legend.textStyle.color = this.allStyles.legendTextColor
            this.option.yAxis.splitLine.lineStyle.color = this.allStyles.splitLineCol
            this.option.yAxis.axisLine.lineStyle.color = this.allStyles.yAxisColor
            this.option.yAxis.axisLabel.textStyle.color = this.allStyles.yAxisName
            this.option.yAxis.nameTextStyle.color = this.allStyles.yAxisName
            myChart.setOption(this.option, true)
          })
        }
      },
      deep: true
    },
    'allStyles.flag'(newValue, oldValue) {
      this.getMyEvcMcuInfo()// 自己绘制echarts的方法
    }
  },
  created() {
    // 当前页面的元素权限
    this.pageElement = getConfigElement('equipmentOnlineInfo')
    this.dataInterface = getConfigElement('wlwDataInterface')
    // 获取table数据
    this.init()
  },
  mounted() {
    this.getMyEvcMcuInfo()
  },
  methods: {
    // 初始化navForm赋值
    init() {
      // 获取time
      const format = 'yyyy-MM-DD'
      this.navFormInfo.data.time = [this.$moment().subtract(6, 'days').format(format), this.$moment().format(format)]
      this.navFormInfo.data.startDate = this.navFormInfo.data.time[0]
      this.navFormInfo.data.endDate = this.navFormInfo.data.time[1]
      this.getEquiptypeIdList()
    },
    dateChange(data) {
      if (data) {
        this.navFormInfo.data.startDate = data[0]
        this.navFormInfo.data.endDate = data[1]
      }
      // this.getMyEvcMcuInfo()
    },
    // 获取table数据
    getMyEvcMcuInfo() {
      const element = this.pageElement['equipmentOnlineInfo']
      const params = {
        equiptypeId: this.navFormInfo.data.equiptypeId,
        startDate: this.navFormInfo.data.startDate,
        endDate: this.navFormInfo.data.endDate
      }
      this.isLoading = true
      this.$httpRequest({
        type: element.method,
        uri: element.uri ? element.uri : '',
        payload: params,
        callback: data => {
          this.isLoading = false
          if (data.status === 200) {
            if (data.data.total > 0) {
              this.option.title.show = false
              this.tableData = data.data.rows
            } else {
              this.tableData = []
              this.option.title.show = true
            }
            const option = {
              title: {
                show: false,
                textStyle: {
                  color: '#CDD8F7',
                  fontSize: 20
                },
                text: '暂无数据',
                left: 'center',
                top: 'center'
              },
              tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                  type: 'cross' // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: (val) => {
                  let str = ''
                  val.forEach((item, index) => {
                    const data = item.data
                    if (index === 0) {
                      str = `<span style="display: inline-block; width:200px;">日期: ${data.crtDate.split(' ')[0]}</span></br>`
                    }
                    if ((index + 1) % 3 === 0) {
                      str += `<span style="display: inline-block; width:200px;">${data.equiptypeName}: ${data.onlineCount}</span></br>`
                    } else {
                      str += `<span style="display: inline-block; width:200px;">${data.equiptypeName}: ${data.onlineCount}</span>`
                    }
                  })
                  return str
                }
              },
              legend: {
                type: 'scroll',
                pageIconColor: '#CDD8F7',
                pageIconInactiveColor: '#8EA0EA',
                pageTextStyle: {
                  color: '#CDD8F7'
                },
                pageButtonGap: '10',
                left: '10%',
                right: '10%',
                data: [],
                textStyle: {
                  color: '#CDD8F7'
                }
              },
              grid: {
                left: '4%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: {
                type: 'category',
                data: [],
                boundaryGap: true,
                // 设置轴线的属性
                axisLine: {
                  lineStyle: {
                    color: '#CDD8F7'
                  }
                },
                axisLabel: {
                  textStyle: {
                    color: '#CDD8F7'
                  }
                },
                axisTick: {
                  alignWithLabel: true
                }
              },
              yAxis: {
                type: 'value',
                name: '在线数量（台）',
                // 设置轴线的属性
                axisLine: {
                  lineStyle: {
                    color: '#CDD8F7'
                  }
                },
                axisLabel: {
                  textStyle: {
                    color: '#CDD8F7'
                  }
                },
                nameTextStyle: {}
              },
              series: []
            }
            const myChart = this.$echarts.init(document.getElementById('equipmentOnline'))
            option.title.textStyle.color = this.allStyles.titleColor
            option.xAxis.axisLabel.textStyle.color = this.allStyles.xAxisName
            option.xAxis.axisLine.lineStyle.color = this.allStyles.xAxisColor
            option.xAxis.nameTextStyle.color = this.allStyles.xAxisName
            option.legend.textStyle.color = this.allStyles.legendTextColor
            option.yAxis.splitLine.lineStyle.color = this.allStyles.splitLineCol
            option.yAxis.axisLine.lineStyle.color = this.allStyles.yAxisColor
            option.yAxis.axisLabel.textStyle.color = this.allStyles.yAxisName
            option.yAxis.nameTextStyle.color = this.allStyles.yAxisName
            myChart.setOption(option)
          } else {
            this.$message.error(data.message)
          }
        }
      })
    },
    getEquiptypeIdList() {
      const dataInterface = this.dataInterface['myEquipmentTypeGetPageListByDto']
      const params = {
        limit: 10000,
        page: 1
      }
      this.$httpRequest({
        type: dataInterface.method,
        uri: dataInterface.uri ? dataInterface.uri : '',
        payload: params,
        callback: data => {
          if (data.status === 200) {
            if (data.data.total > 0) {
              this.navFormInfo.fieldList.right.inpLists[1].list = data.data.rows
            } else {
              this.navFormInfo.fieldList.right.inpLists[1].list = []
            }
          } else {
            this.$message.error(data.message)
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.equipmentOnlineInfo {
    // width: 100%;
    height: calc(100vh - 127px);
    // overflow: hidden;
    // box-sizing: content-box;
    // padding-bottom: 20px;
    // border: 1px solid #6985fb;
    // box-shadow: inset 0 0 20px 0 #396dff;
    // border-radius: 15px 10px 10px 10px;
    // margin-bottom: 20px;
    // background-image: url("../../../assets/border/right-top-bg.png"),
    //   url("../../../assets/border/right-bottom-bg.png"),
    //   url("../../../assets/border/left-bottom-bg.png");
    // background-repeat: no-repeat, no-repeat, no-repeat;
    // background-position: top right, bottom right, bottom left;
    h3.title {
      line-height: 48px;
      padding-left: 20px;
      position: relative;
      top: -19px;
      left: -19px;
    }
    h3.title::before {
      content: "";
      height: 100%;
      width: 150%;
      background-image: url("../../../assets/border/short-h3-bg6.png");
      background-repeat: no-repeat;
      background-position: top left;
      border-radius: 10px;
      padding-left: 20px;
      position: absolute;
      top: 4px;
      left: 9px;
      z-index: -50;
    }
    .chartContent {
      height: calc(100% - 99px);
      .chart {
        width: 100%;
        height: 95%;
      }
    }
}
</style>
