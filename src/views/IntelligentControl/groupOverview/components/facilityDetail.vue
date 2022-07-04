<template>
  <div class="sortbg">
    <div class="main">
      <div class="main-header">
        <div class="title">
          <div class="title-con">
            <div class="base-icon" />
            <slot name="title"><span>环境实施概况</span></slot>
          </div>
          <!-- <div class="msg-icon" :title="tipTitle" /> -->
        </div>
        <div v-show="false" class="hover-title">
          <div>
            <slot name="mainTitle">
              <span>集团已接入智能环控的单元数/集团单元总数</span>
            </slot>
          </div>
          <div class="" />
        </div>
      </div>
      <div class="main-footer">
        <div class="main-footer-l">
          <div class="main-f-l-01">总数：<span>{{ allShowData.totalDev }}</span></div>
          <div class="main-f-l-02">
            <div class="f-l-02-1">
              <div class="f-1-icon-1" />
            </div>
            <div class="f-l-02-2">在线:</div>
            <div class="f-l-02-3">{{ allShowData.onlineDev }}</div>
          </div>
          <div class="main-f-l-02">
            <div class="f-l-02-1">
              <div class="f-1-icon-2" />
            </div>
            <div class="f-l-02-2">离线:</div>
            <div class="f-l-02-3">{{ allShowData.offlineDev }}</div>
          </div>
          <div class="main-f-l-02">
            <div class="f-l-02-1">
              <div class="f-1-icon-3" />
            </div>
            <div class="f-l-02-2">报警:</div>
            <div class="f-l-02-3">{{ allShowData.alarmDev }}</div>
          </div>
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
  props: ['listData'],
  // props: ['tipTitle'],
  data() {
    return {
      myChart: null,
      allShowData: {
        totalDev: 0,
        onlineDev: 0,
        offlineDev: 0,
        alarmDev: 0
      }
    }
  },
  watch: {
    listData: {
      handler(newValue, oldValue) {
        if (newValue) {
          this.allShowData.totalDev = newValue && newValue.totalDeviceCount !== null ? newValue.totalDeviceCount : 0
          this.allShowData.onlineDev = newValue && newValue.onlineDeviceCount !== null ? newValue.onlineDeviceCount : 0
          this.allShowData.offlineDev = newValue && newValue.offlineDeviceCount !== null ? newValue.offlineDeviceCount : 0
          this.allShowData.alarmDev = newValue && newValue.alarmDeviceCount !== null ? newValue.alarmDeviceCount : 0
        }
        this.makeChart(this.allShowData)
      },
      deep: true
    }
  },
  mounted() {
    this.makeChart(this.allShowData)
  },
  methods: {
    chartResize() { // 重置echarts
      if (this.myChart) {
        this.myChart.resize()
      }
    },
    makeChart(data) {
      this.$nextTick(() => {
        setTimeout(() => {
          this.myChart = this.$echarts.init(this.$refs.facilitySort)
          this.myChart.setOption(option, true)
          window.addEventListener('resize', debounce(this.chartResize, 300))
        }, 100)
      })
      // 配置项
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        series: [
          {
            name: '设备概况',
            type: 'pie',
            radius: ['70%', '100%'],
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
              { value: data.onlineDev, name: '在线', itemStyle: { color: '#14c291' }},
              { value: data.offlineDev, name: '离线', itemStyle: { color: '#a4b3d3' }},
              { value: data.alarmDev, name: '报警', itemStyle: { color: '#cc252d' }}
            ]
          }
        ]
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
  @include font_color('mainFontColor2')
}
.main-footer{
  width: 100%;
  height: 80%;
  display: flex;
  flex-direction: row;
}
.main-footer-l{
    padding: .3125rem 0;
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    font-size: .75rem;
    .main-f-l-01{
      height: 25%;
      width: 100%;
      color: #8cabff;
      font-size: 1rem;
      // background-image: -webkit-linear-gradient(top,#BAEAFF,#509DFF);
      // -webkit-background-clip: text;
      // -webkit-text-fill-color: transparent;
      span {
        color: #ffffff;
        @include font_color('mainFontColor2')
      }
    }
    .main-f-l-02{
      height: 18%;
      width: 100%;
      font-size: .75rem;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .f-l-02-1{
        height: 100%;
        width: 10%;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        .f-1-icon-1{
          height: .75rem;
          width: .75rem;
          border-radius: .125rem;
          background: #14c291;
        }
        .f-1-icon-2{
          height: .75rem;
          width: .75rem;
          border-radius: .125rem;
          background: #a4b3d3;
        }
        .f-1-icon-3{
          height: .75rem;
          width: .75rem;
          border-radius: .125rem;
          background: #cc252d;
        }
      }
      .f-l-02-2{
        height: 100%;
        width: 30%;
        text-align: center;
        line-height: 100%;
        font-size: .625rem;
        // color: #8CABFF;
        @include font_color('viewFontColor')
      }
      .f-l-02-3{
        height: 100%;
        width: 55%;
        // color: #ffffff
        @include font_color('mainFontColor2')
      }
    }
  }
.per-title{
  font-size: 1.25rem;
}
.echarts-con{
  width: 50%;
  height: 100%;

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
  font-weight: bold;;
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
  background-size: contain;
}
</style>
