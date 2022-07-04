<template>
  <div class="facility titleHighlight">
    <h3 class="short-title6">场区锁定统计</h3>
    <div v-loading="isLoading" class="positionBg">
      <div ref="myEchartOne" :class="{'is-opacity': show}" class="chart" />
      <div v-show="show" class="noDataImgbg">
        <!-- <img class="chartImg" src="@/assets/image/page/noData.png" alt="" style="max-width:300px;"> -->
        <img :src="url" class="chartImg" style="max-width:300px;" alt="暂无数据">
      </div>
    </div>
  </div>
</template>
<script>
// import echarts from 'echarts'
import { getDeviceParamLock } from '@/http/api/exportData/cellLock.js'
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
      show: true,
      url: null,
      isLoading: false,
      width: '',
      option: {
        toolbox: {
          show: false,
          feature: {
            saveAsImage: {}
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: (val) => {
            let str = val && val[0].name + '<br />'
            val.forEach((item) => {
              if (item.seriesName === '总数' || item.seriesName === '单元锁定数') {
                str += item.seriesName + ': ' + (item.value === 0 ? item.value : (item.value || '-')) + '个<br />'
              } else if (item.seriesName === '单元锁定率') {
                str += item.seriesName + ': ' + (item.value === 0 ? item.value : (item.value || '-')) + '%'
              }
            })
            return str
          },
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
          data: ['总数', '单元锁定数', '单元锁定率'],
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
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '单元锁定数（个）',
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
            name: '单元锁定率(%)',
            nameTextStyle: {
              // y轴上方单位的颜色
              color: '#fff'
            },
            minInterval: 1,
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
            axisLine: {
              show: true,
              lineStyle: {
                color: '#CDD8F7'
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
            name: '总数',
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
            name: '单元锁定数',
            type: 'bar',
            data: [
              2.6,
              5.9,
              9.0,
              26.4,
              28.7,
              70.7,
              175.6,
              182.2,
              48.7,
              18.8,
              6.0,
              2.3
            ],
            barWidth: 10,
            itemStyle: {
              width: 5,
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#F6B623' }, // 柱图渐变色
                  { offset: 1, color: '#A77502' } // 柱图渐变色
                ])
              }
            }
          },
          {
            name: '单元锁定率',
            type: 'line',
            yAxisIndex: 1,
            smooth: true, // 平滑曲度
            itemStyle: {
              normal: {
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
  computed: {
    allStyles() {
      return this.$store.state.echartStyle.allStyles
    }
  },
  mounted() {
    this.initUrl()
  },
  'watch': {
    'mess'() {
      this.setMap()
    },
    'allStyles.flag'(newValue, oldValue) {
      this.resetChart() // 自己绘制echarts的方法
    }
  },
  created() {

  },
  methods: {
    initUrl() {
      this.url = this.$getImgUrl('noData', 'svg')
    },
    setMap() {
      this.isLoading = true
      const params = {}
      if (this.json.cascader1[0]) {
        params.regionId = this.json.cascader1[0]
      }
      if (this.json.cascader1[1]) {
        params.areaId = this.json.cascader1[1]
      }
      getDeviceParamLock(params).then((data) => {
        this.isLoading = false
        const totalArr = []
        const lockNum = []
        const scaleArr = []
        const nameArr = []
        // const myChart = this.$echarts.init(this.$refs.myEchartOne)
        if (data.data.length > 0) {
          this.show = false
          data.data.sort((a, b) => {
            return b.totalNum - a.totalNum
          })
          data.data.forEach(item => {
            totalArr.push(item.totalNum)
            lockNum.push(item.lockParamNum)
            scaleArr.push((item.lockParamRate * 100).toFixed(1))
            nameArr.push(item.areaName ?? '---')
          })
          this.option.xAxis[0].data = nameArr
          this.option.series[0].data = totalArr
          this.option.series[1].data = lockNum
          this.option.series[2].data = scaleArr
          // myChart.setOption(this.option, true)
          this.resetChart()
        } else {
          this.show = true
        }
      }).catch(() => {
        this.isLoading = false
      })
    },
    resetChart() {
      this.option.xAxis[0].axisLabel.textStyle.color = this.allStyles.xAxisName
      this.option.xAxis[0].axisLine.lineStyle.color = this.allStyles.xAxisColor
      this.option.legend.textStyle.color = this.allStyles.xAxisName
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
