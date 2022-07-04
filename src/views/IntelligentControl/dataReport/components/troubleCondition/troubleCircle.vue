<template>
  <div class="facility titleHighlight">
    <h3 class="short-title8">场区设备故障统计</h3>
    <div v-loading="isLoading" class="positionBg">
      <div v-if="option.series[0].data.length" ref="myEchartOne" class="chart" />
      <span v-if="!option.series[0].data.length" class="shebei-nodata">
        <!-- <img src="@/assets/image/page/noData.png" alt="" style="max-width:300px;"> -->
        <img :src="url" style="max-width:300px;" alt="暂无数据">
      </span>
      <div v-if="option.series[0].data.length" class="Top5 titleHighlight">
        <h3 class="short-title6">TOP5报警场区</h3>
        <div v-if="show" ref="myEchartTwo" :class="{'is-opacity': !show}" class="top5bg" />
        <div v-if="!show" class="top5bgImg">
          <!-- <img src="@/assets/image/page/noData.png" alt="" style="max-width:300px;"> -->
          <img :src="url" style="max-width:300px;" alt="暂无数据">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getConfigElement } from '@/utils/overtService'
const pageElement = getConfigElement('fieldDeviceAlarmStats')
import type from './type.json'
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
      show: false,
      isLoading: false,
      url: null,
      width: '',
      option: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 10,
          data: [],
          textStyle: {
            color: []
          },
          type: 'scroll'
        },
        color: ['#2B72FF', '#5F00EF', '#00F272', '#00C95F', '#00D3C5', '#00B6E7', '#0672D3', '#24AEFF', '#0759FD'],
        series: [
          {
            name: '场区设备故障统计',
            type: 'pie',
            radius: ['32%', '50%'],
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
            ]
          }
        ]
      },
      option2: {
        title: {
          text: '',
          subtext: '',
          color: '#CDD8F7'
        },
        color: '#10AEFF',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },

        grid: {
          left: '2%',
          right: '8%',
          top: '0%',
          bottom: '1%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
          axisLine: {
            lineStyle: {
              color: '#3E477F'
            }
          },
          name: '次',
          axisLabel: {
            show: true,
            textStyle: {
              color: '#CDD8F7'
            }
          },
          splitLine: {
            // 网格线
            show: false
          }
        },
        yAxis: {
          type: 'category',
          inverse: true,
          data: ['黑龙江', '云南', '牧原总部', '山西', '河南'],
          axisLabel: {
            show: true,
            textStyle: {
              color: '#CDD8F7'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#3E477F'
            }
          },
          splitLine: {
            // 网格线
            show: false
          }
        },
        series: [
          {
            name: '总数',
            type: 'bar',
            data: [20, 16, 9, 1, 33],
            barWidth: 10,
            barBorderRadius: [10, 10, 10, 10],
            itemStyle: {
              emphasis: {
                barBorderRadius: 30
              },
              normal: {
                // 柱形图圆角，初始化效果
                barBorderRadius: [10, 10, 10, 10],
                label: {
                  show: true, // 是否展示
                  textStyle: {
                    fontWeight: 'bolder',
                    fontSize: '12',
                    fontFamily: '微软雅黑'
                  },
                  position: 'right'
                }
              }
            }
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
    'allStyles.flag'(newValue, oldValue) {
      console.log('lStyles.fla')
      this.initUrl()
      this.getTop()
    }
  },
  mounted() {
    this.initUrl()
    this.getdata()
  },
  methods: {
    initUrl() {
      this.url = this.$getImgUrl('noData', 'svg')
    },
    getdata() {
      this.isLoading = true
      this.$httpRequest({
        type: 'GET',
        payload: {
          regionId: this.json.cascader1[0] || '',
          areaId: this.json.cascader1[1] || '',
          fieldId: this.json.cascader1[2] || '',
          timeScope: this.json.cascader2[0] || 'TODAY'
        },
        uri: pageElement && pageElement.getFieldDevAlarmStats && pageElement.getFieldDevAlarmStats.uri,
        callback: (data) => {
          if (data.data) {
            this.isLoading = false
            this.option.legend.data = []
            this.option.series[0].data = []
            type.data.forEach((item) => {
              if (data.data[item.code]) {
                this.option.legend.data.push(item.name)
                this.option.series[0].data.push({
                  name: item.name,
                  value: data.data[item.code],
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
            setTimeout(() => {
              if (this.$refs.myEchartOne) {
                const myChart = this.$refs.myEchartOne && this.$echarts.init(this.$refs.myEchartOne)
                myChart.setOption(this.option, true)
              }
            }, 300)
            this.getTop()
          }
        }
      })
    },
    getTop() {
      const params = {
        appCode: 'unit-evc',
        topN: 5,
        regionId: this.json.cascader1[0] || '',
        areaId: this.json.cascader1[1] || '',
        fieldId: this.json.cascader1[2] || '',
        timeScope: this.json.cascader2[0] || 'TODAY'
      }
      for (const name in params) {
        if (!params[name]) {
          delete params[name]
        }
      }
      this.$httpRequest({
        type: 'GET',
        payload: params,
        uri: pageElement && pageElement.getTopNAlarmFields && pageElement.getTopNAlarmFields.uri,
        callback: data => {
          if (data.data) {
            const arrName = []
            const arrData = []
            if (data.data.length !== 0) {
              this.show = true
            } else {
              this.show = false
              return
            }
            data.data.forEach((item) => {
              arrName.push(item.fieldName)
              arrData.push(item.num)
            })
            this.option2.yAxis.data = arrName
            this.option2.series[0].data = arrData
            setTimeout(() => {
              this.option2.title.color = this.allStyles.xAxisName
              this.option2.xAxis.axisLine.lineStyle.color = this.allStyles.xAxisColor
              this.option2.xAxis.axisLabel.textStyle.color = this.allStyles.xAxisName
              this.option2.yAxis.axisLine.lineStyle.color = this.allStyles.xAxisColor
              this.option2.yAxis.axisLabel.textStyle.color = this.allStyles.xAxisName
              const myChart2 = this.$echarts.init(this.$refs.myEchartTwo)
              myChart2.setOption(this.option2)
            }, 300)
          }
        }
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
.shebei-nodata{
 display: flex;
 justify-content: center;
 align-items: center;
 height: calc(100% - 48px);
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
  width: 70%;
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
.top5bgImg{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.is-opacity {
  opacity: 0;
}
</style>
