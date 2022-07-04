<template>
  <div class="sortbg">
    <div class="title card-bgc-fill">
      <div class="head-title">
        <div>
          <slot name="title">{{ listData.fieldName || '' }}</slot>
        </div>
      </div>
    </div>
    <div class="main-contain">
      <div class="main-con-l">
        <div class="m-c-l-list-1">单元概况</div>
        <div class="m-c-l-list-2">
          <div>在线：</div>
          <div>{{ listData.onlineUnitCount || 0 }}</div>
        </div>
        <div class="m-c-l-list-2">
          <div>离线：</div>
          <div>{{ listData.offlineUnitCount || 0 }}</div>
        </div>
        <div class="m-c-l-list-2">
          <div>告警：</div>
          <div>{{ listData.alarmUnitCount || 0 }}</div>
        </div>
        <div class="m-c-l-list-2">
          <div>空圈：</div>
          <div>{{ listData.emptyUnitCount || 0 }}</div>
        </div>
        <div class="m-c-l-list-2">
          <div>刷圈：</div>
          <div>{{ listData.sweepUnitCount || 0 }}</div>
        </div>
      </div>
      <div class="main-con-r">
        <div class="main-con-r-a">
          <div class="m-c-r-t">
            <div ref="facilitySort" class="echarts" />
          </div>
          <div class="m-c-r-f">单元舒适度分布</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { debounce } from '@/lib/utils'
export default {
  props: {
    listData: {
      type: Object,
      required: true,
      default: function() {
        return {
          onlineUnitCount: '',
          offlineUnitCount: '',
          alarmUnitCount: '',
          emptyUnitCount: '',
          sweepUnitCount: '',
          comfortZoneNameData: {}
        }
      }
    }
  },
  mounted() {
    this.makeChart()
  },
  methods: {
    chartResize() { // 重置echarts
      if (this.myChart) {
        this.myChart.resize()
      }
    },
    makeChart() { // echarts设置
      const params = this.listData
      const comfortZoneNameData = params.comfortZoneNameData || {}
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
        // legend: {
        //   orient: 'vertical',
        //   left: 10,
        //   data: ['最舒适', '舒适区', '欠舒适', '不舒适', '热应激', '冷应激', '热伤害', '冷伤害', '热毁灭', '冷毁灭']
        // },
        series: [
          {
            name: '单元舒适度概况',
            type: 'pie',
            radius: ['50%', '85%'],
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
              { value: comfortZoneNameData.mostComfortZoneCount || 0, name: '最舒适', itemStyle: { color: '#03B050' }},
              { value: comfortZoneNameData.comfortZoneCount || 0, name: '舒适区', itemStyle: { color: '#93D04F' }},
              { value: comfortZoneNameData.lessComfortZoneCount || 0, name: '欠舒适', itemStyle: { color: '#D1DEEE' }},
              { value: comfortZoneNameData.unComfortZoneCount || 0, name: '不舒适', itemStyle: { color: '#9DC4E6' }},
              { value: comfortZoneNameData.heatStressZoneCount || 0, name: '热应激', itemStyle: { color: '#FFAE79' }},
              { value: comfortZoneNameData.coldStressZoneCount || 0, name: '冷应激', itemStyle: { color: ' #00B2F6' }},
              { value: comfortZoneNameData.heatDamageZoneCount || 0, name: '热伤害', itemStyle: { color: '#F38337' }},
              { value: comfortZoneNameData.coldDamageZoneCount || 0, name: '冷伤害', itemStyle: { color: '#2D76B5' }},
              { value: comfortZoneNameData.heatDestructionZoneCount || 0, name: '热毁灭', itemStyle: { color: '#D45200' }},
              { value: comfortZoneNameData.coldDestructionZoneCount || 0, name: '冷毁灭', itemStyle: { color: '#006ECC' }}
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
<style scoped lang="scss">
  .card-bgc-fill{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  // background: linear-gradient(90deg, rgba(34, 68, 195, 0.65) 0%,rgba(34, 68, 195, 0.1) 100%);
  @include background_color("viewBackGround3");
  border-radius:.25rem;
}
.sortbg {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  // color: #cdd8f7;
  @include font_color('mainFontColor11');
  font-size: .75rem;
  // background: rgba(28,28,95,0.2);
  @include background_color("viewBackGround4");
  // border: .0625em solid #6498ff;
  border: .0625em solid;
  @include border_color("viewBorderColor");
  border-radius: .25em;
  // box-shadow: 0px 0px .9375em 0px #1c63ff inset;
  @include box_shadow("viewBoxShadow");

}
.main-contain{
  padding: .625rem .9375rem;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  .main-con-l{
    height: 100%;
    width: 44%;
    // background: #223e9c;
    @include background_color("viewBackGround5");
    border-radius: 4px;
    padding: .3125rem;
    .m-c-l-list-1{

    }
    .m-c-l-list-2{
      width: 100%;
      height: 17%;
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }
  .main-con-r{
    height: 100%;
    width: 48%;
    // background: #223e9c;
    @include background_color("viewBackGround5");
    border-radius: 4px;
    .main-con-r-a{
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .m-c-r-t{
      width: 100%;
      height: 68%;
      .echarts{
        height: 100%;
        width: 100%;
        // border: 1px solid pink;
      }
    }
    .m-c-r-f{
      width: 100%;
      height: 32%;
      display: flex;
      align-items: center;
      justify-content: center;
      // color: #CDD8F7;
      @include font_color('mainFontColor11');
      font-size: .75rem;
    }
  }
}

.title {
  width: 100%;
  height: 2.25rem;
  // border-bottom: .125rem solid #303A8E;
  border-bottom: .125rem solid;
  @include border_bottom_color('viewBorderColor1');
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap:wrap;
  align-items: center;
  box-sizing: border-box;
  // color: #cdd8f7;
  @include font_color('mainFontColor11');
  font-size: .75rem;
}
.head-title{
  margin-left: .625rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
</style>
