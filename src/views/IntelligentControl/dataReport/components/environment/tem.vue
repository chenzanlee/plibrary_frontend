<template>
  <div style="width:100%;height:100%;">
    <div ref="myEchartOne" :class="{'is-opacity': !showEcharts}" class="chart" style="width:100%;height:100%" />
    <div v-show="!showEcharts" class="noDataImgbg">
      <!-- <img class="chartImg" src="@/assets/image/page/noData.png" alt="" style="max-width:300px;"> -->
      <img :src="noData | noDataFile('noData', 'svg')" class="chartImg" style="max-width:300px;" alt="暂无数据">
    </div>
  </div>
</template>
<script>
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
            // let str = ''
            // val.forEach((item) => {
            //   str += `<span style="display: inline-block; width:150px;">${item.seriesName}: ${(item.value !== null && item.value !== '' && item.value !== undefined) ? Number(item.value).toFixed(2) : '--'}℃</span> <br />`
            // })
            // return str
            const str0 = '单元1'
            const str1 = '单元2'
            const str2 = '单元3'
            const str3 = '单元4'
            const ah = '前温'
            const bh = '后温'
            let str = `${val[0].name}<br/>`
            val.forEach((item) => {
              const { seriesName, value } = item
              str += seriesName.startsWith(str0) && !str.includes(str0) ? '单元1：' : ''
              str += seriesName.startsWith(str1) && !str.includes(str1) ? '<br/>单元2：' : ''
              str += seriesName.startsWith(str2) && !str.includes(str2) ? '<br/>单元3：' : ''
              str += seriesName.startsWith(str3) && !str.includes(str3) ? '<br/>单元4：' : ''
              const ss = seriesName.endsWith(ah) ? ah : bh
              str += `<span style="display: inline-block; width:100px;">${ss}: ${(value !== null && value !== '' && value !== undefined) ? Number(value).toFixed(2) : '--'}℃</span>`
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
          data: ['MA5', 'MA10', 'MA20', 'MA30']
        },
        grid: {
          left: '10%',
          right: '10%',
          bottom: '15%'
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
        xAxis: {
          type: 'category',
          data: [],
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
          // splitLine: { show: false },
          splitNumber: 20,
          min: 'dataMin',
          max: 'dataMax',
          // splitLine: { show: false },
          splitArea: { show: false },
          axisLabel: {
            textStyle: {
              color: '#fff' // 这里用参数代替了
            }
          }
        },
        yAxis: {
          type: 'value',
          name: '温度℃',
          position: 'left',
          nameTextStyle: {
            color: '#CDD8F7'
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#242E5B'
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#CDD8F7'
            }
          },
          splitArea: { show: false },
          axisLabel: {
            show: true,
            formatter: '{value}',
            textStyle: {
              color: '#fff', // 更改坐标轴文字颜色
              fontSize: 12 // 更改坐标轴文字大小
            }
          }
        },
        series: []
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
  created() {},
  methods: {
    initUrl() {
      this.url = this.$getImgUrl('noData', 'svg')
    },
    setMapChart() {
      this.option.xAxis.data = this.time
      this.option.legend.data = this.nameList
      this.option.series = []
      this.nameList.forEach((item, idx) => {
        this.option.series.push({
          name: item,
          type: 'line',
          data: this.data[idx],
          symbol: 'circle',
          lineStyle: {
            opacity: 0.5
          }
        })
      })
      // const myChart = this.$echarts.init(this.$refs.myEchartOne)
      // myChart.setOption(this.option)
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
        const myChart = this.$echarts.init(this.$refs.myEchartOne)
        myChart.setOption(this.option)
      })
    }
  }
}
</script>
<style lang="css">
.noDataImgbg {
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
