<template>
  <div class="facility titleHighlight">
    <h3 class="short-title6">单元解锁统计</h3>
    <div v-loading="isLoading" class="positionBg">
      <div v-if="!show" ref="myEchartOne" :class="{'is-opacity': show}" class="chart" />
      <div v-if="show" class="noDataImgbg">
        <!-- <img class="chartImg" src="@/assets/image/page/noData.png" alt="" style="max-width:300px;"> -->
        <img :src="url" class="chartImg" style="max-width:300px;" alt="暂无数据">
      </div>
    </div>
  </div>
</template>
<script>
import { getAlarmStatsData } from '@/http/api/exportData/fieldUnlock'
export default {
  props: {
    json: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      isLoading: false,
      url: null,
      show: true,
      width: '',
      search: {
        formTime: '',
        toTime: ''
      },
      option: {
        toolbox: {
          show: false,
          feature: {
            saveAsImage: {}
          }
        },
        tooltip: {
          trigger: 'axis',
          show: true,
          min: 1,
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            },
            textStyle: {
              color: '#fff'
            },
            label: {
              backgroundColor: '#505765'
            }
          },
          axisLabel: {
            textStyle: {
              color: '#fff' // 这里用参数代替了
            }
          }
        },
        grid: {
          x: '5%',
          y: '10%',
          x2: '5%',
          y2: '15%'
        },
        legend: {
          data: ['解锁数', '解锁率'],
          textStyle: {
            color: '#fff' // 这里用参数代替了
          }
        },
        xAxis: [
          {
            type: 'category',
            data: [
              '1月',
              '2月',
              '3月',
              '4月',
              '5月',
              '6月',
              '7月',
              '8月',
              '9月',
              '10月',
              '11月',
              '12月'
            ],
            axisLine: {
              show: true,
              lineStyle: {
                color: '#CDD8F7'
              }
            },
            axisPointer: {
              type: 'shadow'

            },
            axisLabel: {
              textStyle: {
                color: '#fff' // 这里用参数代替了
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '单元解锁数（个）',
            minInterval: 1,
            nameTextStyle: {
              // y轴上方单位的颜色
              color: '#fff'
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
            },
            axisPointer: {
              snap: true

            },
            interval: 1000,
            axisLabel: {
              // formatter: '{value} 个',
              textStyle: {
                color: '#fff' // 这里用参数代替了
              },
              formatter: function(v) {
                return parseInt(v)// 表示整数。其他数值类型以此类推
              }
            }
          },
          {
            type: 'value',
            name: '解锁率(%)',
            nameTextStyle: {
              // y轴上方单位的颜色
              color: '#fff'
            },
            minInterval: 1,
            axisLine: {
              show: true,
              lineStyle: {
                color: '#CDD8F7'
              }
            },
            axisPointer: {
              snap: true

            },
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed',
                color: '#242E5B'
              }
            },
            min: 0,
            max: 100,
            interval: 25,

            axisLabel: {
              formatter: '{value} ',
              textStyle: {
                color: '#fff' // 这里用参数代替了
              }
            }
          }
        ],
        series: [
          {
            name: '解锁数',
            type: 'bar',
            barWidth: 10,
            data: [
              2.0,
              4.9,
              7.0,
              23.2,
              25.6,
              76.7,
              135.6,
              162.2,
              32.6,
              20.0,
              6.4,
              3.3
            ],
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#3EA8FF' }, // 柱图渐变色
                  { offset: 1, color: '#1351C0' } // 柱图渐变色
                ])
              }
            }
          },
          {
            name: '解锁率',
            type: 'line',
            yAxisIndex: 1,
            symbol: 'none',
            smooth: true, // 平滑曲度
            areaStyle: {
              normal: {
                // color: "#396DFF", //改变区域颜色
                type: 'default',
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, // 变化度
                  // 三种由深及浅的颜色
                  [{
                    offset: 0,
                    color: '#396DFF'
                  }, {
                    offset: 1,
                    color: '#0D1C4E'
                  }])
              }
            },

            itemStyle: {
              normal: {
                areaStyle: {
                  type: 'default',
                  color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, // 变化度
                    // 三种由深及浅的颜色
                    [{
                      offset: 0,
                      color: '#3ebf9b'
                    }, {
                      offset: 0.5,
                      color: '#267268'
                    }, {
                      offset: 1,
                      color: '#14323f'
                    }])
                }, // 改变折线点的颜色
                // lineStyle: {
                //   color: "#", //改变折线颜色
                // },
                lineStyle: { // 系列级个性化折线样式
                  width: 1,
                  type: 'solid',
                  color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                    offset: 0,
                    color: '#2692FF'
                  }, {
                    offset: 0.5,
                    color: 'red'
                  }, {
                    offset: 1,
                    color: '#F9D423'
                  }])// 线条渐变色
                }
              }
            },
            data: [
              80, 90, 78, 96, 73, 81, 88, 99, 74, 85, 94, 89
            ]
          }
        ]
      }

    }
  },
  'watch': {
    'allStyles.flag'(newValue, oldValue) {
      this.resetChart() // 自己绘制echarts的方法
    }
  },
  computed: {
    allStyles() {
      return this.$store.state.echartStyle.allStyles
    }
  },
  created() {

  },
  mounted() {
    this.initUrl()
  },
  methods: {
    initUrl() {
      this.url = this.$getImgUrl('noData', 'svg')
    },
    formatDate(dateValue) {
      var date = new Date(dateValue)
      var YY = date.getFullYear() + '-'
      var MM =
        (date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) + '-'
      var DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      var hh =
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      var mm =
        (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
        ':'
      var ss =
        date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      return YY + MM + DD + ' ' + hh + mm + ss
    },
    sortArr(a, b) {
      return b.count - a.count
    },
    setEchart() {
      const that = this
      this.isLoading = true
      const params = {
        startDate: (this.json.time && this.json.time[0]) || '',
        endDate: (this.json.time && this.json.time[1]) || '',
        'regionId': this.json.area[0] || '',
        'areaId': this.json.area[1] || ''
      }
      Object.keys(params).forEach(k => {
        if (params[k] === undefined || params[k] === null || params[k] === '') {
          delete params[k]
        }
      })
      getAlarmStatsData(params).then((data) => {
        this.isLoading = false
        if (data.status !== 200) {
          this.$message({
            message: data.message || '获取失败',
            type: 'error'
          })
          return
        }
        let rowsArr = (data.data || {}).rows || []
        rowsArr = rowsArr.sort(this.sortArr)
        const nameArr = []
        const rateArr = []
        const numArr = []
        if (rowsArr.length > 0) {
          this.show = false
          rowsArr.forEach(item => {
            nameArr.push(item.name)
            rateArr.push((item.rate * 100).toFixed(0))
            numArr.push(item.count)
          })
          that.option.xAxis[0].data = nameArr
          that.option.series[0].data = numArr
          that.option.series[1].data = rateArr
          console.log(this.$refs.myEchartOne, 'this.$refs.myEchartOne')
          this.resetChart()
        } else {
          this.show = true
        }
      }).catch(() => {
        this.isLoading = false
      })
    },
    resetChart() {
      this.option.legend.textStyle.color = this.allStyles.xAxisName
      this.option.xAxis[0].axisLabel.textStyle.color = this.allStyles.xAxisName
      this.option.xAxis[0].axisLine.lineStyle.color = this.allStyles.xAxisColor
      this.option.yAxis[0].splitLine.lineStyle.color = this.allStyles.splitLineCol
      this.option.yAxis[0].axisLine.lineStyle.color = this.allStyles.yAxisColor
      this.option.yAxis[0].axisLabel.textStyle.color = this.allStyles.yAxisName
      this.option.yAxis[0].nameTextStyle.color = this.allStyles.yAxisName
      this.option.yAxis[1].splitLine.lineStyle.color = this.allStyles.splitLineCol
      this.option.yAxis[1].axisLine.lineStyle.color = this.allStyles.yAxisColor
      this.option.yAxis[1].axisLabel.textStyle.color = this.allStyles.yAxisName
      this.option.yAxis[1].nameTextStyle.color = this.allStyles.yAxisName
      this.$nextTick(() => {
        const myChart = this.$echarts.init(this.$refs.myEchartOne)
        myChart.setOption(this.option)
      })
    }
  }
}
</script>
<style lang="css" scoped>
.flex {
  width: 100%;
  height: 280px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 20px;
}
.facility {
  width: 100%;
  flex: 1;
  margin-right: 20px;
}
.mapLi {
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0 0 0;
}
.chart {
  width: 100%;
  height: 100%;
}
/* .chartImg{
  width: 262px;
  height: 180px;
} */
.noDataImgbg {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.positionBg {
  width: 100%;
  height: calc(100% - 48px);
  position: relative;
}
.Top5{
  width: 434px;
  height: 414px;
  position: absolute;
  right: 10px;
  top: calc((100% - 414px)/2);
}
.top5bg{
  width: 100%;
  height: calc(100% - 48px);
}
.is-opacity {
  opacity: 0;
}
</style>
