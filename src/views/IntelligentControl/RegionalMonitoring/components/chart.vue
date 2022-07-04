<template>
  <div :id="elId" class="chart-pie">chart</div>
</template>

<script>
export default {
  name: 'ChartPie',
  props: {
    elId: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    pieData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  mounted() {
    this.drawPie()
  },
  methods: {
    drawPie() {
      const myChart = this.$echarts.init(document.getElementById(this.elId))
      const legendData = this.pieData.map(item => item.name)
      myChart.setOption({
        legend: {
          data: legendData,
          textStyle: {
            color: '#fff'
          }
        },
        title: {
          text: '共计：',
          left: 'center',
          textStyle: {
            color: '#fff',
            fontSize: 13
          }
        },
        color: ['#3880e8', '#27bf8f', '#6ec8ec'],
        xAxis: {
          axisLine: {
            show: true,
            lineStyle: {
              color: '#CDD8F7'
            }
          },
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisLabel: {
            textStyle: {
              color: '#fff'
            }
          }
        },
        yAxis: {
          axisLine: {
            show: true,
            lineStyle: {
              color: '#CDD8F7'
            }
          },
          type: 'value',
          name: '报警单元数排名',
          nameTextStyle: {
            color: '#fff'
          },
          axisLabel: {
            textStyle: {
              color: '#fff'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#242E5B'
            }
          }
        },
        series: [{
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar',
          barWidth: 30
        }]
      })
    }
  }
}
</script>

<style scoped>
.chart-pie {
  flex: 1;
}
</style>
