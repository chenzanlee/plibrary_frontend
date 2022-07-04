<template>
  <div class="facility titleHighlight">
    <h3 class="short-title2">设 备</h3>
    <div class="flexbg">
      <div class="flex">
        <div class="mapLi">
          <div ref="myEchartOne" class="chart" />
        </div>
        <div class="mapLi">
          <div ref="myEchartTwo" class="chart" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import echarts from 'echarts'
export default {
  props: {
    total: {
      type: Array,
      default: function() {
        return []
      }
    },
    online: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      width: '',
      option: {
        title: {
          text: '设备数量占比',
          bottom: '20',
          right: 'auto',
          left: '80',
          // textAlign:'center',
          // x:'center',
          textStyle: {
            color: '#fff',
            fontSize: 12
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}<br/>设备数量 : {c}<br/>所占比例 : ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: '1%',
          top: '22%',
          textStyle: {
            color: '#fff'
          },
          data: ['楼房猪舍环控器', '公猪站环控器', '喷淋老猪舍环控器', '平房猪舍环控器']
        },
        grid: {
          x: 0,
          y: 0,
          y2: 0,
          x2: 0,
          containLabel: true
        },
        series: [
          {
            center: ['35%', '40%'],
            name: '访问来源',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '14',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              {
                value: 0,
                name: '楼房猪舍环控器',
                itemStyle: { normal: { color: '#0067FF' }}
              },
              {
                value: 0,
                name: '公猪站环控器',
                itemStyle: { normal: { color: '#27BF8F' }}
              },
              {
                value: 0,
                name: '喷淋老猪舍环控器',
                itemStyle: { normal: { color: '#267268' }}
              },
              {
                value: 0,
                name: '平房猪舍环控器',
                itemStyle: { normal: { color: '#F9D423' }}
              }
            ]
          }
        ]
      },
      option2: {
        title: {
          text: '设备在线数量占比',
          bottom: '20',
          right: 'auto',
          left: '80',
          // textAlign:'center',
          // x:'center',
          textStyle: {
            color: '#fff',
            fontSize: 12
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}<br/>在线设备数量 : {c}<br/>所占比例 : ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: '1%',
          top: '22%',
          textStyle: {
            color: '#fff'
          },
          data: ['楼房猪舍环控器', '公猪站环控器', '喷淋老猪舍环控器', '平房猪舍环控器']
        },
        grid: {
          x: 0,
          y: 0,
          y2: 0,
          x2: 0,
          containLabel: true
        },
        series: [
          {
            center: ['35%', '40%'],
            name: '访问来源',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center',
              textStyle: {
                fontWeight: 300,
                fontSize: 12 // 文字的字体大小
              }
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '14',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              {
                value: 0,
                name: '楼房猪舍环控器',
                itemStyle: {
                  normal: {
                    color: '#0067FF',
                    fontSzie: 12
                  },
                  textStyle: {
                    fontWeight: 300,
                    fontSize: 12 // 文字的字体大小
                  }
                }
              },
              {
                value: 0,
                name: '公猪站环控器',
                itemStyle: { normal: { color: '#27BF8F' }}
              },
              {
                value: 0,
                name: '喷淋老猪舍环控器',
                itemStyle: { normal: { color: '#267268' }}
              },
              {
                value: 0,
                name: '平房猪舍环控器',
                itemStyle: { normal: { color: '#F9D423' }}
              }
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
  watch: {
    total() {
      this.option.series[0].data[0].value = this.total[0]
      this.option.series[0].data[1].value = this.total[1]
      this.option.series[0].data[2].value = this.total[2]
      this.option.series[0].data[3].value = this.total[3]
      // this.width =
      //   document.getElementsByClassName('facility')[0].offsetWidth / 2
      // const myChart = this.$echarts.init(this.$refs.myEchartOne)
      // myChart.setOption(this.option)
      this.resetChart1()
    },
    online() {
      this.option2.series[0].data[0].value = this.online[0]
      this.option2.series[0].data[1].value = this.online[1]
      this.option2.series[0].data[2].value = this.online[2]
      this.option2.series[0].data[3].value = this.online[3]
      // this.width =
      //   document.getElementsByClassName('facility')[0].offsetWidth / 2
      // const myChart2 = this.$echarts.init(this.$refs.myEchartTwo)
      // myChart2.setOption(this.option2)
      this.resetChart2()
    },
    'allStyles.flag'(newValue, oldValue) {
      this.resetChart1()
      this.resetChart2()
    }
  },
  mounted() {},
  created() {
  },
  methods: {
    resetChart1() {
      this.option.title.textStyle.color = this.allStyles.xAxisName
      this.option.legend.textStyle.color = this.allStyles.xAxisName

      this.option.series[0].data[0].value = this.total[0]
      this.option.series[0].data[1].value = this.total[1]
      this.option.series[0].data[2].value = this.total[2]
      this.option.series[0].data[3].value = this.total[3]
      this.width =
        document.getElementsByClassName('facility')[0].offsetWidth / 2
      const myChart = this.$echarts.init(this.$refs.myEchartOne)
      myChart.setOption(this.option)
    },
    resetChart2() {
      this.option2.title.textStyle.color = this.allStyles.xAxisName
      this.option2.legend.textStyle.color = this.allStyles.xAxisName

      this.option2.series[0].data[0].value = this.online[0]
      this.option2.series[0].data[1].value = this.online[1]
      this.option2.series[0].data[2].value = this.online[2]
      this.option2.series[0].data[3].value = this.online[3]
      this.width =
        document.getElementsByClassName('facility')[0].offsetWidth / 2
      const myChart2 = this.$echarts.init(this.$refs.myEchartTwo)
      myChart2.setOption(this.option2)
    }
  }
}
</script>
<style lang="scss" scoped>
.flex {
  width: 100%;
  height: 230px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 20px;
}
.facility {
  width: 61.72%;
  // height: 300px;
  margin-right: 20px;
  .short-title5 {
    height: 38px;
  }
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
  width: 350px;
  height: 100%;
}
</style>
