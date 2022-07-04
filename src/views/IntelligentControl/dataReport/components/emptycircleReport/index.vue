<template>
  <div class="facility titleHighlight">
    <h3 class="short-title5">空圈报表</h3>
    <p v-if="nodatashow == false" class="title_echart">空圈比率=(空圈单元) / (单元总数)</p>
    <div v-if="nodatashow == false" ref="myEchartOne" class="chart" />
    <div v-if="nodatashow == true" class="noDataImgbg21">
      <!-- <img src="@/assets/image/page/noData.png" alt="" style="max-width:300px;"> -->
      <img :src="url" style="max-width:300px;" alt="暂无数据">
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
  'watch': {
    'mess'() {
      this.nodatashow = false
      this.option.xAxis[0].data = this.mess[0]
      this.option.series[0].data = this.mess[1]
      this.option.series[1].data = this.mess[2]
      this.option.series[2].data = this.mess[3]
      // for (var i = 0; i < this.mess[3].length; i++) {
      //   this.mess[3][i] = this.mess[3][i].toFixed(2)
      // }
      // this.option.series[2].data = this.mess[3]
      // this.$nextTick(() => {
      //   const myChart = this.$echarts.init(this.$refs.myEchartOne)
      //   myChart.setOption(this.option)
      // })
      this.resetChart()
    },
    'allStyles.flag'(newValue, oldValue) {
      this.resetChart() // 自己绘制echarts的方法
      this.initUrl()
    }
  },
  data() {
    return {
      nodatashow: true,
      url: null,
      width: '',
      option: {
        toolbox: {
          show: false
        },
        tooltip: {
          trigger: 'axis',
          formatter: (val) => {
            let str = val[0].name + '<br>'
            val.forEach((item, i) => {
              if (item.seriesName === '空圈比率') {
                str += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:' + val[i].color + ';"></span>'
                str += `${item.seriesName}: <span style="display: inline-block; width:100px;">${item.value || item.value === 0 ? item.value + '%' : '---'}</span><br/>`
              } else {
                str += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:' + val[i].color.colorStops[0].color + ';"></span>'
                str += `${item.seriesName}: <span style="display: inline-block; width:100px;">${item.value || item.value === 0 ? item.value : '---'}</span><br/>`
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
          y: '12%',
          x2: '5%',
          y2: '15%'
        },
        dataZoom: [{
          type: 'inside',
          disabled: false
        }],
        legend: {
          data: ['单元总数', '空圈单元', '空圈比率'],
          textStyle: {
            color: '#fff' // 这里用参数代替了
          }
        },
        xAxis: [
          {
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
              // interval: 0,
              textStyle: {
                color: '#fff' // 这里用参数代替了
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '数量(个)',
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
            name: '空圈比率(%)',
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
            name: '单元总数',
            type: 'bar',
            // barMaxWidth: 30,
            barWidth: 10,
            data: [],
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
            name: '空圈单元',
            type: 'bar',
            // barMaxWidth: 30,
            barWidth: 10,
            data: [],
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#67e0d6' }, // 柱图渐变色
                  { offset: 1, color: '#67e0d6' } // 柱图渐变色
                ])
              }
            }
          },
          {
            name: '空圈比率',
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
                color: '#709ea7', // 改变折线点的颜色
                lineStyle: {
                  color: '#709ea7' // 改变折线颜色
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
  computed: {
    allStyles() {
      return this.$store.state.echartStyle.allStyles
    }
  },
  mounted() {
    this.initUrl()
  },
  created() {},
  methods: {
    initUrl() {
      this.url = this.$getImgUrl('noData', 'svg')
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

      this.nodatashow = false
      this.option.xAxis[0].data = this.mess[0]
      this.option.series[0].data = this.mess[1]
      this.option.series[1].data = this.mess[2]
      this.option.series[2].data = this.mess[3]
      this.$nextTick(() => {
        const myChart = this.$echarts.init(this.$refs.myEchartOne)
        myChart.setOption(this.option)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.flex {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 20px;
}
.facility {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
}
  .chart {
  width: 100%;
  height: 90%;
  // min-height: 600px;
  // /* flex: 1; */
}
.title_echart {
  text-align: right;
  // color: #eee;
  @include font_color('mainFontColor2');
  opacity: .6;
  margin-bottom: 5px;
  position: absolute;
  bottom: 10px;
  left: 0;
  padding-left: 50px;
}
</style>
<style scoped>
.noDataImgbg21{
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
</style>
