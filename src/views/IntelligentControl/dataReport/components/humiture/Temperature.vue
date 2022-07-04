<template>
  <div class="facility titleHighlight">
    <h3 class="short-title2">温度</h3>
    <div v-if="show" class="flexbg">
      <div ref="myEchartOne" class="chart" />
    </div>
    <div v-if="!show" class="img-box">
      <img :src="noData | noDataFile('noData', 'svg')" alt="" style="max-width:300px;">
    </div>
  </div>
</template>
<script>
// import echarts from 'echarts'
import moment from 'moment'
export default {
  props: {
    lineType: {
      type: String,
      default: 'REAL_TIME'
    },
    mess: {
      type: Array,
      default: () => { return [] }
    }
  },
  data() {
    return {
      noData: '',
      show: false,
      width: '',
      option: {
        xAxis: {
          type: 'category',
          data: [],
          axisPointer: {
            type: 'shadow'

          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#CDD8F7'
            }
          },
          axisLabel: {
            textStyle: {
              color: '#fff' // 这里用参数代替了
            }
          },
          scale: true
          // boundaryGap: false,
          // axisLine: { onZero: false },
          // splitLine: { show: false },
          // splitNumber: 20,
          // min: 'dataMin',
          // max: 'dataMax'
        },
        legend: {
          data: ['室内前温度', '室内前温度均值', '室内后温度', '室内后温度均值'],
          textStyle: {
            color: '#fff' // 这里用参数代替了
          }
        },
        dataZoom: [
          {
            // start: this.startZoom,
            type: 'inside',
            start: 86,
            end: 100
          },
          {
            show: true,
            type: 'slider',
            top: '90%',
            start: 86,
            end: 100,
            handleSize: 8
          }
        ],
        grid: {
          x: '5%',
          y: '20%',
          x2: '5%',
          y2: '18%'
        },

        tooltip: {
          trigger: 'axis',
          formatter: (val) => {
            let str = `<span style="padding-left:24px;">${val && val[0].name}</span>`
            val.forEach((item) => {
              if (item.seriesName === '室内前温度') {
                str += `<br/><span style="display: inline-block; width:80px; padding-left:24px;">前温: </span>`
                str += '谷值: ' +
                            `<span style="display: inline-block; width:100px;">` +
                            (item.value[1] && item.value[1].toFixed(1) || '--') +
                            `℃</span>`
                str += `峰值: ` +
                            `<span style="display: inline-block; width:100px;">` +
                            (item.value[2] && item.value[2].toFixed(1) || '--') +
                            `℃</span>`
              } else if (item.seriesName === '室内后温度') {
                str += `<br/><span style="display: inline-block; width:80px; padding-left:24px;">后温: </span>`
                str += `谷值: ` +
                            `<span style="display: inline-block; width:100px;">` +
                            (item.value[1] && item.value[1].toFixed(1) || '--') +
                            `℃</span>`
                str += '峰值: ' +
                            `<span style="display: inline-block; width:100px;">` +
                            (item.value[2] && item.value[2].toFixed(1) || '--') +
                            `℃</span>`
              } else if (item.seriesName === '室内前温度均值' || item.seriesName === '室内后温度均值') {
                str += '均值: ' +
                            `<span style="display: inline-block; width:100px;">` +
                            (item.value && Number(item.value).toFixed(1) || '--') +
                            `℃</span>`
              }
            })
            return str
          }
        },
        yAxis: {
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#242E5B'
            }
          },
          axisLabel: {
            interval: 0,
            textStyle: {
              color: '#fff' // 这里用参数代替了
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#CDD8F7'
            }
          },
          name: '温度（℃）',
          nameTextStyle: {
            // y轴上方单位的颜色
            color: '#fff'
          }
        },
        series: [{
          type: 'candlestick',
          name: '室内前温度',
          itemStyle: {
            normal: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#10FFB7' }, // 柱图渐变色
                { offset: 1, color: '#077E5A' } // 柱图渐变色
              ])
            }
          },
          data: [
            [20, 30, 20, 30],
            [40, 35, 30, 55],
            [33, 38, 33, 40],
            [40, 40, 32, 42]
          ]
        }, {
          name: '室内前温度均值',
          type: 'line',
          data: [10, 15, 20],
          itemStyle: {
            normal: {
              color: '#10FBB4', // 改变折线点的颜色
              lineStyle: {
                color: '#10FBB4' // 改变折线颜色
              }
            }
          }
        }, {
          type: 'candlestick',
          name: '室内后温度',
          data: [
            [20, 30, 20, 30],
            [40, 35, 30, 55],
            [33, 38, 33, 40],
            [40, 40, 32, 42]
          ],
          itemStyle: {
            width: 5,
            normal: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#FF6B6B' }, // 柱图渐变色
                { offset: 1, color: '#803535' } // 柱图渐变色
              ])
            }
          }
        }, {
          name: '室内后温度均值',
          type: 'line',
          data: [30, 15, 20],
          itemStyle: {
            normal: {
              color: '#FE6A6A', // 改变折线点的颜色
              lineStyle: {
                color: '#FE6A6A' // 改变折线颜色
              }
            }
          }
        }

        ]
      }
    }
  },
  computed: {
    startZoom() {
      const now = moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss')
      const before = [...this.mess.filter((item, index) => {
        const now_date = moment(now)
        const date = moment(item.uploadTime)
        if (date < now_date) {
          return item
        }
      })]
      return (before.length / this.mess.length).toFixed(2) * 100
    },
    allStyles() {
      return this.$store.state.echartStyle.allStyles
    }
  },
  'watch': {
    'mess': {
      handler: function(n) {
        if (n.length === 0) {
          this.show = false
          return
        } else {
          this.show = true
          setTimeout((e) => {
            this.setEcharts(n)
          }, 0)
        }
      },
      deep: true
    },
    'allStyles.flag'(newValue, oldValue) {
      this.$refs.myEchartOne && this.resetChart() // 自己绘制echarts的方法
    }
  },
  created() {
    this.initUrl()
  },
  methods: {
    initUrl() {
      this.noData = this.$getImgUrl('noData', 'svg')
    },
    setEcharts(n) {
      if (!this.$refs.myEchartOne) {
        return
      }
      this.option.xAxis.data = []
      this.option.series[0].data = []
      this.option.series[1].data = []
      this.option.series[2].data = []
      this.option.series[3].data = []
      n.forEach(item => {
        const time = this.lineType === 'DAY_LINE' ? item.uploadTime.split(' ')[0] : item.uploadTime
        this.option.xAxis.data.push(time)
        this.option.series[0].data.push([
          item.minTemperatureInner1 === -100 ? null : item.minTemperatureInner1,
          item.maxTemperatureInner1 === -100 ? null : item.maxTemperatureInner1,
          item.minTemperatureInner1 === -100 ? null : item.minTemperatureInner1,
          item.maxTemperatureInner1 === -100 ? null : item.maxTemperatureInner1
        ])
        this.option.series[1].data.push(
          item.meanTemperatureInner1 === -100 ? null : item.meanTemperatureInner1
        )
        this.option.series[2].data.push(
          [
            item.minTemperatureInner2 === -100 ? null : item.minTemperatureInner2,
            item.maxTemperatureInner2 === -100 ? null : item.maxTemperatureInner2,
            item.minTemperatureInner2 === -100 ? null : item.minTemperatureInner2,
            item.maxTemperatureInner2 === -100 ? null : item.maxTemperatureInner2
          ]
        )
        this.option.series[3].data.push(item.meanTemperatureInner2 === -100 ? null : item.meanTemperatureInner2)
      })
      this.resetChart()
    },
    resetChart() {
      this.option.xAxis.axisLabel.textStyle.color = this.allStyles.xAxisName
      this.option.xAxis.axisLine.lineStyle.color = this.allStyles.xAxisColor
      this.option.legend.textStyle.color = this.allStyles.legendTextColor
      this.option.yAxis.splitLine.lineStyle.color = this.allStyles.splitLineCol
      this.option.yAxis.axisLine.lineStyle.color = this.allStyles.yAxisColor
      this.option.yAxis.axisLabel.textStyle.color = this.allStyles.yAxisName
      this.option.yAxis.nameTextStyle.color = this.allStyles.yAxisName
      this.$nextTick(() => {
        const myChart = this.$echarts.init(this.$refs.myEchartOne)
        myChart.setOption(this.option)
      })
    }
  }
}
</script>
<style lang="css" scoped>
.tooltip-box {
  padding: 24px;
}
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
  height: calc((100% - 54px) / 2);
  margin-right: 20px;
  position: relative;
}
.chart {
  width: 100%;
  height:100%;
  position: absolute;
}
.img-box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}
.flexbg{
  position: relative;
  width: 100%;
  height: calc(100% - 40px);
  top: -20px;
}
</style>
