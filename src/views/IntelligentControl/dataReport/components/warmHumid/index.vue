<template>
  <div class="facility titleHighlight">
    <h3 class="short-title6">设备类型统计</h3>
    <div v-loading="isLoading" class="positionBg">
      <div v-if="!show" ref="myEchartOne" class="chart" />
      <div v-if="show" class="noDataImgbg">
        <!-- <img class="chartImg2" src="@/assets/image/page/noData.png" alt=""> -->
        <img :src="url" class="chartImg2" alt="暂无数据">
      </div>
    </div>
  </div>
</template>
<script>
// import { getAlarmStatsData } from '@/http/api/exportData/warmHumidCondition'
import { getConfigElement } from '@/utils/overtService'
const unitPageElement = getConfigElement('UnitTempSeneorType')
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
      lineChartData: [],
      url: null,
      isLoading: false,
      show: true,
      width: '',
      search: {
        formTime: '',
        toTime: ''
      },
      option: {
        tooltip: {
          trigger: 'axis',
          show: true,
          min: 1,
          axisPointer: {
            type: 'shadow',
            crossStyle: {
              color: '#999'
            },
            textStyle: {
              color: '#fff'
            }
          },
          axisLabel: {
            textStyle: {
              color: '#fff' // 这里用参数代替了
            }
          }
        },
        legend: {
          data: ['室内前温度传感器', '室内前温湿度传感器', '室内后温度传感器', '室内后温湿度传感器', '室外网络传感器', '室外非网络传感器', '暖灯温度传感器', '暖灯温湿度传感器'],
          // left: 'auto',
          textStyle: {
            fontSize: 12,
            color: '#fff'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          boundaryGap: true,
          axisLabel: {
            rotate: 30,
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
          data: []
        }],
        yAxis: [{
          type: 'value',
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#242E5B'
            }
          },
          nameTextStyle: {
            color: '#fff'
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#CDD8F7'
            }
          },
          axisLabel: {
            // formatter: '{value} 台',
            textStyle: {
              color: '#fff' // 这里用参数代替了
            }
          }
        }],
        color: ['#c23531', '#24AEFF', '#61a0a8', '#00F272', '#008000', '#00D3C5', '#DAA520', '#FF7F50'],
        series: [
          {
            name: '室内前温度传感器',
            type: 'bar',
            data: []
          },
          {
            name: '室内前温湿度传感器',
            type: 'bar',
            data: []
          },
          {
            name: '室内后温度传感器',
            type: 'bar',
            data: []
          },
          {
            name: '室内后温湿度传感器',
            type: 'bar',
            data: []
          },
          {
            name: '室外网络传感器',
            type: 'bar',
            data: []
          },
          {
            name: '室外非网络传感器',
            type: 'bar',
            data: []
          },
          {
            name: '暖灯温度传感器',
            type: 'bar',
            data: []
          },
          {
            name: '暖灯温湿度传感器',
            type: 'bar',
            data: []
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
  'watch': {
    // 赋值搜索条件
    // 'json': {
    //   handler: function(n) {
    //     // const arr = []
    //     // n.scopeName.map(res => {
    //     //   arr.push(this.option.legend.data[res])
    //     // })
    //     // console.log(arr, 333)
    //     if (n.area) {
    //       this.setEchart()
    //     }
    //   },
    //   deep: true
    // }
    'allStyles.flag'(newValue, oldValue) {
      this.initUrl()
      this.resetChart() // 自己绘制echarts的方法
    }
  },
  mounted() {
    this.initUrl()
    this.setEchart()
  },
  created() {

  },
  methods: {
    initUrl() {
      this.url = this.$getImgUrl('noData', 'svg')
    },
    setEchart() {
      this.isLoading = true
      const obj = {
        regionId: this.json.area[0] || '',
        areaId: this.json.area[1] || ''
      }
      this.$httpRequest({
        type: unitPageElement.getUnitTempSeneorTypeV2 && unitPageElement.getUnitTempSeneorTypeV2.method,
        uri: unitPageElement.getUnitTempSeneorTypeV2 && unitPageElement.getUnitTempSeneorTypeV2.uri,
        payload: obj,
        callback: (res) => {
          this.show = false
          this.isLoading = false
          this.lineChartData = res.data || []
          const arr1 = []
          const arr2 = []
          this.option.series.map(ele => {
            ele.data = []
          })
          this.isLoading = false
          console.log(this.lineChartData)
          if (res.status === 200 && res.rel) {
            this.lineChartData.map(item => {
              arr1.push(item.areaName)
              arr2.push(
                {
                  name: item.areaName,
                  type: 'bar',
                  data: [item.innerBeforeTempNum, item.innerBeforeTempHumiNum,
                    item.innerAfterTempNum, item.innerAfterTempHumiNum,
                    item.outerNetworkNum, item.outerNonNetworkNum,
                    item.heatTempNum, item.heatTempHumiNum]
                }
              )
            })
            arr2.map(q => {
              q.data.map((w, i) => {
                this.option.series[i].data.push(w)
              })
            })
            this.option.xAxis[0].data = arr1
            if (res.status !== 200) {
              this.$message({
                message: res.message || '获取失败',
                type: 'error'
              })
              return
            }
            console.log(this.option)
            // setTimeout(() => {
            //   this.show = false
            //   const myChart = this.$echarts.init(this.$refs.myEchartOne)
            //   myChart.setOption(this.option, true)
            // }, 300)
            this.resetChart()
          }
        }
      })
      // getAlarmStatsData({}).then((data) => {
      //   this.show = false
      //   this.isLoading = false
      //   this.lineChartData = data.data || []
      //   const arr1 = []
      //   const arr2 = []
      //   this.lineChartData.map(res => {
      //     arr1.push(res.areaName)
      //     arr2.push(
      //       {
      //         name: res.areaName,
      //         type: 'line',
      //         data: [res.innerBeforeBleNum, res.innerBeforeNoBleNum,
      //           res.innerAfterBleNum, res.innerAfterNoBleNum,
      //           res.outerBleNum, res.outerNoBleNum,
      //           res.heatBleNum, res.heatNoBleNum]
      //       }
      //     )
      //   })
      //   arr2.map(res => {
      //     res.data.map((item, i) => {
      //       this.option.series[i].data.push(item)
      //     })
      //   })
      //   this.option.xAxis[0].data = arr1
      //   if (data.status !== 200) {
      //     this.$message({
      //       message: data.message || '获取失败',
      //       type: 'error'
      //     })
      //     return
      //   }
      //   setTimeout(() => {
      //     this.show = false
      //     const myChart = this.$echarts.init(this.$refs.myEchartOne)
      //     myChart.setOption(this.option)
      //   }, 300)
      // }).catch(() => {
      //   this.isLoading = false
      // })
    },
    resetChart() {
      this.option.xAxis[0].axisLabel.textStyle.color = this.allStyles.xAxisName
      this.option.legend.textStyle.color = this.allStyles.xAxisName
      this.option.yAxis[0].splitLine.lineStyle.color = this.allStyles.splitLineCol
      this.option.yAxis[0].axisLine.lineStyle.color = this.allStyles.yAxisColor
      this.option.yAxis[0].axisLabel.textStyle.color = this.allStyles.yAxisName
      this.option.yAxis[0].nameTextStyle.color = this.allStyles.yAxisName
      this.$nextTick(() => {
        const myChart = this.$echarts.init(this.$refs.myEchartOne)
        myChart.setOption(this.option, true)
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
.chartImg2{
  max-width:300px
  /* height: 180px; */
}
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
