 <template>
  <div class="sortbg  public-style">
    <!-- <div class="title">
      <span>设备TOP5</span>
      <span />
    </div> -->
    <div class="radioBg">
      <el-radio v-model="picked" label="1" style="color:#CDD8F7;">总数</el-radio>
      <el-radio v-model="picked" label="2" style="color:#CDD8F7;">在线</el-radio>
      <el-radio v-model="picked" label="3" style="color:#CDD8F7;">离线</el-radio>
      <el-radio v-model="picked" label="4" style="color:#CDD8F7;">故障</el-radio>
    </div>
    <div ref="facilitySort" class="facilitySort" />
  </div>
</template>
<script type="text/javascript">
// import echarts from 'echarts'
import { debounce } from '@/lib/utils'
export default {
  props: ['list'],
  data() {
    return {
      myChart: null,
      totalList: [],
      onlineList: [],
      offlineList: [],
      troubleList: [],
      nameList: [],
      picked: '1',
      option: {
        title: {
          text: '',
          subtext: '',
          color: '#CDD8F7'
        },
        color: '#10AEFF',
        // backgroundColor: '#153361',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },

        grid: {
          left: 20,
          right: 40,
          top: 10,
          bottom: 0,
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
          minInterval: 1,
          axisLine: {
            lineStyle: {
              color: '#3E477F'
            }
          },
          name: '台',
          nameTextStyle: {
            color: '#CDD8F7'
          },
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
    'list'(newValue, oldValue) {
      this.makeChart()
    },
    'picked'() {
      this.makeChart()
    },
    'allStyles.flag'(newValue, oldValue) {
      this.makeChart() // 自己绘制echarts的方法
    }
  },
  mounted() {
    this.makeChart()
  },
  methods: {
    // sortData(a, b) {
    //   if (this.picked === '1') {
    //     return b.totalNum - a.totalNum
    //   } else if (this.picked === '2') {
    //     return b.onlineNum - a.onlineNum
    //   } else if (this.picked === '3') {
    //     return b.offlineNum - a.offlineNum
    //   } else {
    //     return b.troubleNum - a.troubleNum
    //   }
    // },
    chartResize() { // 重置echarts
      if (this.myChart) {
        this.myChart.resize()
      }
    },
    sortData() {
      const that = this
      return function(a, b) {
        if (that.picked === '1') {
          return b.totalNum - a.totalNum
        } else if (that.picked === '2') {
          return b.onlineNum - a.onlineNum
        } else if (that.picked === '3') {
          return b.offlineNum - a.offlineNum
        } else {
          return b.troubleNum - a.troubleNum
        }
      }
    },
    makeChart() {
      this.option.yAxis.data = []
      this.totalList = []
      this.onlineList = []
      this.offlineList = []
      this.troubleList = []
      const listshow = [...this.list]// 克隆数组
      listshow.sort(this.sortData())
      if (listshow.length < 5) {
        return
      }
      for (var i = 0; i < 5; i++) {
        this.totalList.push(listshow[i].totalNum)
        this.onlineList.push(listshow[i].onlineNum)
        this.offlineList.push(listshow[i].offlineNum)
        this.troubleList.push(listshow[i].troubleNum)
        this.option.yAxis.data.push(listshow[i].areaName)
      }
      switch (this.picked) {
        case '1':
          this.option.series[0].data = this.totalList
          break
        case '2':
          this.option.series[0].data = this.onlineList
          break
        case '3':
          this.option.series[0].data = this.offlineList
          break
        case '4':
          this.option.series[0].data = this.troubleList
          break
      }
      // const myChart = this.$echarts.init(this.$refs.facilitySort)
      // myChart.setOption(this.option)
      this.option.xAxis.axisLine.lineStyle.color = this.allStyles.xAxisColor
      this.option.xAxis.axisLabel.textStyle.color = this.allStyles.xAxisName
      this.option.xAxis.nameTextStyle.color = this.allStyles.xAxisName

      this.option.yAxis.axisLine.lineStyle.color = this.allStyles.yAxisColor
      this.option.yAxis.axisLabel.textStyle.color = this.allStyles.yAxisName
      this.$nextTick(() => {
        setTimeout(() => {
          this.myChart = this.$echarts.init(this.$refs.facilitySort)
          this.myChart.setOption(this.option, true)
          window.addEventListener('resize', debounce(this.chartResize, 300))
        }, 100)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.radioBg>input{
  cursor: pointer;
}
.radioBg{
  width: 100%;
  /* height: 58px; */
  height: 16%;
  /* margin: 15px auto; */
  padding: 20px 100px;
  display: flex;
  justify-content: space-around;
  font-size: 12px;
  color: #CDD8F7;
  align-items: center;
  /* background: #153361; */
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  /* border: 1px solid green; */
}
.sortbg {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: #cdd8f7;
  font-size: 12px;
  /* border: 1px solid pink; */
}
.facilitySort {
  /* border: 1px solid orange; */
  width: 100%;
  /* height: 311px; */
  height: 84%;
  /* flex: 1; */
  box-sizing: border-box;
}
.facilitySort canvas {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}
.title {
  width: 100%;
  height: 30px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 5px;
  box-sizing: border-box;
  color: #cdd8f7;
  font-size: 14px;
}
.public-style{
  // background: rgba(28,28,95,0.2);
  @include background_color('viewBackGround');

  padding: .625rem;
  // border: .0625em solid #6498ff;
  border: .0625em solid;
  @include border_color('viewBorderColor');
  border-radius: .25em;
  // box-shadow: 0px 0px .9375em 0px #1c63ff inset;
  @include box_shadow('viewBoxShadow');
}
</style>
