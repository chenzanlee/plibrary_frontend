<template>
  <div class="facility titleHighlight">
    <h3 class="short-title8">场区参数变更统计</h3>
    <div v-loading="isLoading" class="positionBg">
      <div v-if="nodatashow == false" ref="myEchartOne" class="chart" />
      <div v-if="nodatashow == true" class="noDataImgbg212">
        <img :src="noData" alt="" style="max-width:300px;">
      </div>
    </div>
  </div>
</template>
<script>
import { getConfigElement } from '@/utils/overtService'
// import { getParamsChangeStatsData } from '@/http/api/exportData/fieldParams'
import type from './type.json'
const pageElement = getConfigElement('paramChangeStats')
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
      noData: '',
      nodatashow: true,
      width: '',
      isLoading: false,
      option: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 10,
          top: 50,
          itemGap: 40,
          data: ['热交换变速风机', '室内温湿度探头', '定速风机5', '端部变频', '高温报警'],
          textStyle: {
            color: []
          },
          type: 'scroll'
        },
        series: [
          {
            name: '场区参数变更统计',
            type: 'pie',
            radius: ['32%', '80%'],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            labelLine: {
              show: true
            },
            data: [
              { value: 335, name: '热交换变速风机', itemStyle: { normal: { color: '#3C6ED2' }}},
              { value: 310, name: '室内温湿度探头', itemStyle: { normal: { color: '#5E7092' }}},
              { value: 234, name: '定速风机5', itemStyle: { normal: { color: '#C2A2D9' }}},
              { value: 135, name: '端部变频', itemStyle: { normal: { color: '#F0BA17' }}},
              { value: 1548, name: '高温报警' }
            ]
          }
        ]
      }
    }
  },
  created() {
    this.initUrl()
  },
  methods: {
    initUrl() {
      this.noData = this.$getImgUrl('noData', 'svg')
    },
    setEcharts() {
      this.isLoading = true
      const params = {
        timeScope: this.json.time[0] || 'TODAY'
      }
      if (this.json.area[0]) {
        params.regionId = this.json.area[0]
      }
      if (this.json.area[1]) {
        params.areaId = this.json.area[1]
      }
      if (this.json.area[2]) {
        params.fieldId = this.json.area[2]
      }
      this.nodatashow = false
      this.$httpRequest({
        type: 'GET',
        payload: params,
        uri: pageElement && pageElement.getParamsChangeStatsData && pageElement.getParamsChangeStatsData.uri,
        callback: data => {
          this.isLoading = false
          if (data.status === 200 && data.data) {
            this.option.legend.data = []
            this.option.series[0].data = []
            type.data.forEach((item) => {
              if (data.data[item.code]) {
                this.option.legend.data.push(item.name)
                this.option.series[0].data.push({
                  name: item.name,
                  value: data.data[item.code] || 0,
                  itemStyle: {
                    normal: {
                      label: {
                        show: !!data.data[item.code]
                      },
                      labelLine: {
                        show: !!data.data[item.code]
                      }
                    }
                  }
                })
              }
            })
            const myChart = this.$echarts.init(this.$refs.myEchartOne)
            myChart.setOption(this.option)
          }
        }
      })
      // getParamsChangeStatsData(
      //   params
      // ).then((data) => {
      // }).catch(() => {
      //   this.isLoading = false
      // })
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
.noDataImgbg212{
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
