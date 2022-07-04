<template>
  <div class="sortbg">
    <div class="main">
      <div class="main-header">
        <div class="title">
          <div class="title-con">
            <div class="base-icon" />
            <slot name="title"><span>环境实施概况</span></slot>
          </div>
          <el-tooltip class="item" effect="dark" placement="right-end">
            <span slot="content" class="dataCenterIconTips">
              <span>{{ tipTitle }}</span>
            </span>
            <div class="msg-icon" />
          </el-tooltip>
          <!-- <div class="msg-icon" :title="tipTitle" /> -->
        </div>
        <!-- <div v-show="false" class="hover-title">
          <div>
            <slot name="mainTitle">
              <span>集团已接入智能环控的单元数/集团单元总数</span>
            </slot>
          </div>
          <div class="" />
        </div> -->
      </div>
      <div class="main-footer">
        <div class="main-footer-l">
          <slot name="name"><span>实施率</span></slot>
          <br>
          <span class="per-title">{{ listData }}%</span>
        </div>
        <div class="echarts-con">
          <div ref="facilitySort" class="facilitySort" />
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import { debounce } from '@/lib/utils'
export default {
  props: ['listData', 'tipTitle', 'name'],
  data() {
    return {
      myChart: null
    }
  },
  watch: {
    listData: {
      handler(newValue, oldValue) {
        this.makeChart(newValue)
      },
      deep: true
    }
  },
  mounted() {
    this.makeChart(this.listData)
  },
  methods: {
    chartResize() { // 重置echarts
      if (this.myChart) {
        this.myChart.resize()
      }
    },
    makeChart(val) {
      this.$nextTick(() => {
        setTimeout(() => {
          this.myChart = this.$echarts.init(this.$refs.facilitySort)
          this.myChart.setOption(option, true)
          window.addEventListener('resize', debounce(this.chartResize, 300))
        }, 100)
      })
      const data = {
        value: val,
        company: '执行率',
        ringColor: [{
          offset: 0,
          color: '#007FF9' // 0% 处的颜色
        }, {
          offset: 1,
          color: '#14DCF8' // 100% 处的颜色
        }]
      }
      const option = {
        title: {
          // text: data.value + '%',
          x: 'center',
          y: 'center',
          textStyle: {
            color: '#fff',
            fontSize: '18'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter(params) {
            if (params.dataIndex === 0) {
              return `单元${params.seriesName}:${params.value}%`
            } else {
              return `单元未${params.seriesName}：${params.value}%`
            }
          }
        },
        // color: ['#282c40'],
        color: ['#0F2B54'],
        legend: {
          show: false,
          data: []
        },
        series: [{
          name: this.name,
          type: 'pie',
          clockWise: true,
          radius: ['75%', '100%'], // 设置圆环的半径
          itemStyle: {
            normal: {
              label: {
                show: false
              },
              labelLine: {
                show: false
              }
            }
          },
          hoverAnimation: false,
          data: [{
            value: (data.value).toFixed(2),
            name: '',
            itemStyle: {
              normal: {
                color: { // 完成的圆环的颜色
                  colorStops: data.ringColor
                },
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              }
            }
          }, {
            name: '',
            value: (100 - data.value).toFixed(2)
          }]
        }]
      }
      // this.myChart.clear()
      // this.myChart.setOption(option)
    }
  }
}
</script>
<style lang="scss" scoped>
.sortbg {
  margin: 0 auto;
  width: 100%;
  height: 100%;
  // color: #cdd8f7;
  @include font_color('mainFontColor11');
  font-size: 12px;
}
.main{
  width: 100%;
  height: 100%;
}
.main-header{
  width: 100%;
  /* height: 1.25rem; */
  height: 20%;
  font-size: 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.hover-title{
  height: 24px;
  font-size: 12px;
  line-height: 24px;
  background:#2A3686;
  color: #ffffff;
}
.main-footer{
  width: 100%;
  height: 80%;
  display: flex;
  flex-direction: row;
}
.main-footer-l{
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: .75rem;
  }
.per-title{
  font-weight: 800;
  font-size: 1.25rem;
  color: #CDD8F7;
  @include font_color('mainFontColor10')
}
.echarts-con{
  width: 50%;
  height: 100%;
  // border: 1px solid red;

}
.facilitySort {
  width: 100%;
  height: 100%;
}
.title {
  width: 100%;
  /* height: 30px; */
  display: flex;
  flex-direction: row;
  align-items: center;
}
.title-con{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: .75rem;
  background-image: -webkit-linear-gradient(top,#BAEAFF,#509DFF);
  @include background_image('control_title_con');
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: MicrosoftYaHei, MicrosoftYaHei-Bold;
  font-weight: bold;
}
.msg-icon{
  margin-top: 2px;
  margin-left: 5px;
  width: 1rem;
  height: 1rem;
  background: url('~@/assets/image/cleanProduct/info-item.svg') no-repeat center center;
  background-size: contain;
  cursor: pointer;
}
.base-icon{
  width: .75rem;
  height: .75rem;
  margin-right: .3rem;
  background: url('~@/assets/image/dataBase.png') no-repeat center center;
  // @include background_image('dataCenterTitleIcon_img');
  background-size: contain;
}
</style>
