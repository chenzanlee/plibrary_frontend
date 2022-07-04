<template>
  <div style="width:100%;height:100%;">
    <div ref="myEchartTwo" :class="{'is-opacity': !showEcharts}" class="chart" style="width:100%;height:100%" />
    <div v-show="!showEcharts" class="noDataImgbg">
      <!-- <img class="chartImg" src="@/assets/image/page/noData.png" alt="暂无数据" style="max-width:300px;"> -->
      <img :src="noData | noDataFile('noData', 'svg')" class="chartImg" style="max-width:300px;" alt="暂无数据">
    </div>
  </div>

</template>
<script>
// import echarts from 'echarts'

export default {
  props: {
    nameList: {
      type: Array,
      default: () => { return [] }
    },
    data: {
      type: Array,
      default: () => { return [] }
    },
    time: {
      type: Array,
      default: () => { return [] }
    }
  },
  data() {
    return {
      values: [],
      url: null,
      showEcharts: false,
      option: {
        tooltip: {
          trigger: 'axis',
          formatter: (val) => {
            // console.log('val---', val)
            const str0 = '单元1'
            const str1 = '单元2'
            const str2 = '单元3'
            const str3 = '单元4'
            const ah = '前湿'
            const bh = '后湿'
            let str = `${val[0].name}<br/>`
            val.forEach((item) => {
              const { seriesName, value } = item
              str += seriesName.startsWith(str0) && !str.includes(str0) ? '单元1：' : ''
              str += seriesName.startsWith(str1) && !str.includes(str1) ? '<br/>单元2：' : ''
              str += seriesName.startsWith(str2) && !str.includes(str2) ? '<br/>单元3：' : ''
              str += seriesName.startsWith(str3) && !str.includes(str3) ? '<br/>单元4：' : ''
              const ss = seriesName.endsWith(ah) ? ah : bh
              str += `<span style="display: inline-block; width:100px;">${ss}: ${(value !== null && value !== '' && value !== undefined) ? Number(value).toFixed(2) : '--'}%</span>`
            })
            return str
          },
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#505765'
            }
          }
        },
        legend: {
          textStyle: {
            color: '#CDD8F7'
          },
          data: []
        },
        grid: {
          left: '10%',
          right: '10%',
          bottom: '15%'
        },
        xAxis: {
          type: 'category',
          data: [],

          axisPointer: {
            type: 'shadow'

          },
          axisLabel: {
            textStyle: {
              color: '#fff' // 这里用参数代替了
            }
          },
          scale: true,
          boundaryGap: false,
          axisLine: {
            onZero: false,
            show: true,
            lineStyle: {
              color: '#CDD8F7'
            }
          },
          // axisLine: { onZero: false },
          //          splitLine: {
          //   show: true,
          //   lineStyle: {
          //     type: 'dashed',
          //     color: '#242E5B'
          //   }
          // },
          splitNumber: 20,
          min: 'dataMin',
          max: 'dataMax'
          // axisLabel: {
          //   show: true,
          //   splitArea: { show: false },
          //   textStyle: {
          //     color: '#CDD8F7', // 更改坐标轴文字颜色
          //     fontSize: 12 // 更改坐标轴文字大小
          //   },
          //   interval: 0,
          //   rotate: 10
          // }
        },
        yAxis: {
          type: 'value',
          name: '湿度℃',
          position: 'left',
          nameTextStyle: {
            // y轴上方单位的颜色
            color: '#CDD8F7'
          },
          // axisLabel: {
          // },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed', // 设置网格线类型 dotted：虚线   solid:实线
              color: '#242E5B'
            }
          },
          // splitLine: {
          //   lineStyle: {
          //     color: '#3E477F',
          //     type: 'dashed'
          //   }
          // },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#CDD8F7'
            }
          },
          splitArea: { show: false },
          axisLabel: {
            formatter: '{value}',
            show: true,
            textStyle: {
              color: '#fff', // 更改坐标轴文字颜色
              fontSize: 12 // 更改坐标轴文字大小
            }
          }
        },
        dataZoom: [
          {
            type: 'inside'
          },
          {
            show: true,
            type: 'slider',
            top: '90%'
          }
        ],

        series: [
        ]
      }
    }
  },
  computed: {
    allStyles() {
      return this.$store.state.echartStyle.allStyles
    }
  },
  watch: {
    nameList: {
      handler: function(newVal) {
        if (newVal.length > 0) {
          this.showEcharts = true
          this.setMapChart()
        } else {
          this.showEcharts = false
        }
      },
      deep: true
    },
    'allStyles.flag'(newValue, oldValue) {
      this.resetChart() // 自己绘制echarts的方法
    }
  },

  mounted() {
    this.initUrl()
  },
  methods: {
    initUrl() {
      this.url = this.$getImgUrl('noData', 'svg')
    },
    setMapChart() {
      if (!this.$refs.myEchartTwo) {
        return
      }
      this.option.xAxis.data = this.time
      this.option.legend.data = []
      this.option.series = []
      this.nameList.forEach((item, idx) => {
        let nameitem = item
        nameitem = nameitem.replace('温', '湿')
        this.option.legend.data.push(nameitem)
        this.option.series.push({
          name: nameitem,
          type: 'line',
          data: this.data[idx],
          symbol: 'circle',
          lineStyle: {
            opacity: 0.5
          }
        })
      })
      // const myChart = echarts.init(this.$refs.myEchartTwo)
      // const myChart = this.$echarts.init(this.$refs.myEchartTwo)
      this.resetChart()
    },
    resetChart() {
      this.option.xAxis.axisLabel.textStyle.color = this.allStyles.xAxisName
      this.option.xAxis.axisLine.lineStyle.color = this.allStyles.xAxisColor
      this.option.legend.textStyle.color = this.allStyles.xAxisName
      this.option.yAxis.splitLine.lineStyle.color = this.allStyles.splitLineCol
      this.option.yAxis.axisLine.lineStyle.color = this.allStyles.yAxisColor
      this.option.yAxis.axisLabel.textStyle.color = this.allStyles.yAxisName
      this.option.yAxis.nameTextStyle.color = this.allStyles.yAxisName
      this.$nextTick(() => {
        const myChart = this.$echarts.init(this.$refs.myEchartTwo)
        myChart.setOption(this.option)
      })
    }
  }
}
</script>
<style lang="css">
.noDataImgbg {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.is-opacity {
  opacity: 0;
}
</style>
