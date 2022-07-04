<template>
  <div class="facility titleHighlight">
    <h3 class="short-title4">{{ brandName || '设 备' }}</h3>
    <div class="flexbg">
      <div class="flex">
        <div class="mapLi">
          <div ref="myEchartOne" class="chart" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import echarts from 'echarts'
// const brandMap = {
//   PLC: 'PLC设备',
//   MCU_HUACHENG: '华诚设备',
//   MCU_ZIYAN: '自研设备'
// }
const brandMap = {
  Bungalow: '平房猪舍环控器',
  PiggeryShower: '喷淋老猪舍环控器',
  Building: '楼房猪舍环控器',
  Boar: '公猪站环控器'
}
export default {
  props: {
    search: {
      type: Object,
      default: () => {
        return {}
      }
    },
    brandData: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      width: '',
      brandName: brandMap[this.search.brand],
      option: {
        title: {
          text: '设备在线离线数对比',
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
          right: '10%',
          top: '22%',
          textStyle: {
            color: '#fff'
          },
          data: ['在线', '离线']
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
                name: '在线',
                itemStyle: { normal: { color: '#0067FF' }}
              },
              {
                value: 0,
                name: '离线',
                itemStyle: { normal: { color: '#27BF8F' }}
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
    'brandData': { // 深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        this.option.series[0].data[0].value = val[0]
        this.option.series[0].data[1].value = val[1]
        // const myChart = this.$echarts.init(this.$refs.myEchartOne)
        // myChart.setOption(this.option)
        this.resetChart()
      },
      deep: true
    },
    'search.brand': {
      handler(val) {
        this.brandName = brandMap[val]
      }
    },
    'allStyles.flag'(newValue, oldValue) {
      this.resetChart()
    }
  },
  mounted() {
    // const myChart = this.$echarts.init(this.$refs.myEchartOne)
    // myChart.setOption(this.option)
  },
  created() {
  },
  methods: {
    resetChart() {
      this.option.title.textStyle.color = this.allStyles.xAxisName
      this.option.legend.textStyle.color = this.allStyles.xAxisName

      const myChart = this.$echarts.init(this.$refs.myEchartOne)
      myChart.setOption(this.option)
    }
  }
}
</script>
<style lang="css" scoped>
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
  /* height: 300px; */
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
  width: 350px;
  height: 100%;
}
</style>
