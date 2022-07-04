<template>
  <div class="facility titleHighlight">
    <h3 class="short-title6">设备在线状况</h3>
    <div class="flexbg">
      <div ref="myEchartOne" class="chart" />
    </div>
  </div>
</template>
<script>
// import echarts from 'echarts'
export default {
  props: {
    mess: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  computed: {
    allStyles() {
      return this.$store.state.echartStyle.allStyles
    }
  },
  'watch': {
    'mess'() {
      this.option.xAxis[0].data = this.mess[0]
      this.option.series[0].data = this.mess[2]
      this.option.series[1].data = this.mess[1]
      for (var i = 0; i < this.mess[3].length; i++) {
        this.mess[3][i] = this.mess[3][i].toFixed(2)
      }
      this.option.series[2].data = this.mess[3]

      // const myChart = this.$echarts.init(this.$refs.myEchartOne)
      // myChart.setOption(this.option)
      this.resetChart()
    },
    'allStyles.flag'(newValue, oldValue) {
      this.resetChart()
    }
  },
  data() {
    return {
      width: '',
      myChart: null,
      option: {
        toolbox: {
          show: false
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
          },
          formatter(params) {
            let html = params[0].name + '<br>'
            for (let i = 0; i < params.length; i++) {
              if (params[i].seriesName === '在线率') {
                html += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:' + params[i].color + ';"></span>'
                html += params[i].seriesName + ':' + params[i].value + '%<br>'
              } else {
                html += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:' + params[i].color.colorStops[0].color + ';"></span>'
                html += params[i].seriesName + ':' + params[i].value + '<br>'
              }
            }
            return html
          }
        },
        grid: {
          x: '5%',
          y: '12%',
          x2: '5%',
          y2: '15%'
        },
        legend: {
          data: ['总数', '在线数', '在线率'],
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
            name: '数量(台)',
            minInterval: 1,
            axisLine: {
              show: true,
              lineStyle: {
                color: '#CDD8F7'
              }
            },
            nameTextStyle: {
              // y轴上方单位的颜色
              color: '#fff'
            },
            splitLine: {
              lineStyle: {
                color: ['#242E5B'],
                type: 'dashed'
              }
            },
            axisPointer: {
              snap: true

            },
            interval: 1000,
            axisLabel: {
              // formatter: '{value} 台',
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
            name: '在线率(%)',
            axisLine: {
              show: true,
              lineStyle: {
                color: '#CDD8F7'
              }
            },
            nameTextStyle: {
              // y轴上方单位的颜色
              color: '#fff'
            },
            minInterval: 1,
            splitLine: {
              lineStyle: {
                color: ['#242E5B'],
                type: 'dashed'
              }
            },
            axisPointer: {
              snap: true

            },
            min: 0,
            max: 100,
            interval: 25,
            axisLabel: {
              formatter: '{value}',
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
            name: '在线数',
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
            name: '在线率',
            type: 'line',
            yAxisIndex: 1,
            // smooth:true,//平滑曲度
            // areaStyle: {
            //   normal: {
            //     color: "#396DFF", //改变区域颜色
            //   },
            // },
            itemStyle: {
              normal: {
                color: '#1BE3B3', // 改变折线点的颜色
                lineStyle: {
                  color: '#2692FF' // 改变折线颜色
                }
              }
            },
            data: [
              1, 2, 3
            ]
          }
        ]
      }
    }
  },
  mounted() {

  },
  created() {},
  methods: {
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

      const myChart = this.$echarts.init(this.$refs.myEchartOne)
      myChart.setOption(this.option)
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
  height: 305px;
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
  height:247px;
}
</style>
