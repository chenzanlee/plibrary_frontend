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
        </div>
      </div>
      <div class="main-cen">
        <div class="main-cen-l">
          <div class="main-cen-l-t">最舒适</div>
          <div class="main-cen-l-f">{{ allShowData.mostComfortRate }}%</div>
        </div>
        <div class="main-cen-r">
          <div class="main-cen-r-t">舒适区</div>
          <div class="main-cen-r-f">{{ allShowData.comfortRate }}%</div>
        </div>
      </div>
      <div class="main-footer">
        <div class="main-footer-l">
          <div class="main-f-l-02">
            <div class="f-l-02-1">
              <div class="f-1-icon-1" />
            </div>
            <div class="f-l-02-2">最舒适</div>
            <div class="f-l-02-3">
              <div class="f-1-icon-2" />
            </div>
            <div class="f-l-02-4">舒适区</div>
          </div>
          <div class="main-f-l-02">
            <div class="f-l-02-1">
              <div class="f-1-icon-3" />
            </div>
            <div class="f-l-02-2">欠舒适</div>
            <div class="f-l-02-3">
              <div class="f-1-icon-4" />
            </div>
            <div class="f-l-02-4">不舒适</div>
          </div>
          <div class="main-f-l-02">
            <div class="f-l-02-1">
              <div class="f-1-icon-5" />
            </div>
            <div class="f-l-02-2">热应激</div>
            <div class="f-l-02-3">
              <div class="f-1-icon-6" />
            </div>
            <div class="f-l-02-4">冷应激</div>
          </div>
          <div class="main-f-l-02">
            <div class="f-l-02-1">
              <div class="f-1-icon-7" />
            </div>
            <div class="f-l-02-2">热伤害</div>
            <div class="f-l-02-3">
              <div class="f-1-icon-8" />
            </div>
            <div class="f-l-02-4">冷伤害</div>
          </div>
          <div class="main-f-l-02">
            <div class="f-l-02-1">
              <div class="f-1-icon-9" />
            </div>
            <div class="f-l-02-2">热毁灭</div>
            <div class="f-l-02-3">
              <div class="f-1-icon-10" />
            </div>
            <div class="f-l-02-4">冷毁灭</div>
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
  data() {
    return {
      myChart: null,
      allShowData: {
        mostComfortRate: 0, // 舒适区比率
        comfortRate: 0, // 最舒适比率
        mostComfortZoneCount: 0, // 最舒适区数量
        comfortZoneCount: 0, // 舒适区数量
        lessComfortZoneCount: 0, // 次舒适区数量
        unComfortZoneCount: 0, // 不舒适区数量
        heatStressZoneCount: 0, // 热应激区数量
        coldStressZoneCount: 0, // 冷应激区数量
        coldDamageZoneCount: 0, // 冷伤害区数量
        heatDamageZoneCount: 0, // 热伤害区数量
        heatDestructionZoneCount: 0, // 热毁灭区数量
        coldDestructionZoneCount: 0 // 冷毁灭区数量
      }
    }
  },
  watch: {
    listData: {
      handler(newValue, oldValue) {
        if (newValue) {
          this.allShowData.mostComfortRate = newValue && newValue.mostComfortRate !== null ? newValue.mostComfortRate : 0
          this.allShowData.comfortRate = newValue && newValue.comfortRate !== null ? newValue.comfortRate : 0
          this.allShowData.mostComfortZoneCount = newValue && newValue.comfortZoneNameData && newValue.comfortZoneNameData.mostComfortZoneCount !== null ? newValue.comfortZoneNameData.mostComfortZoneCount : 0
          this.allShowData.comfortZoneCount = newValue && newValue.comfortZoneNameData && newValue.comfortZoneNameData.comfortZoneCount !== null ? newValue.comfortZoneNameData.comfortZoneCount : 0
          this.allShowData.lessComfortZoneCount = newValue && newValue.comfortZoneNameData && newValue.comfortZoneNameData.lessComfortZoneCount !== null ? newValue.comfortZoneNameData.lessComfortZoneCount : 0
          this.allShowData.unComfortZoneCount = newValue && newValue.comfortZoneNameData && newValue.comfortZoneNameData.unComfortZoneCount !== null ? newValue.comfortZoneNameData.unComfortZoneCount : 0
          this.allShowData.heatStressZoneCount = newValue && newValue.comfortZoneNameData && newValue.comfortZoneNameData.heatStressZoneCount !== null ? newValue.comfortZoneNameData.heatStressZoneCount : 0
          this.allShowData.coldStressZoneCount = newValue && newValue.comfortZoneNameData && newValue.comfortZoneNameData.coldStressZoneCount !== null ? newValue.comfortZoneNameData.coldStressZoneCount : 0
          this.allShowData.coldDamageZoneCount = newValue && newValue.comfortZoneNameData && newValue.comfortZoneNameData.coldDamageZoneCount !== null ? newValue.comfortZoneNameData.coldDamageZoneCount : 0
          this.allShowData.heatDamageZoneCount = newValue && newValue.comfortZoneNameData && newValue.comfortZoneNameData.heatDamageZoneCount !== null ? newValue.comfortZoneNameData.heatDamageZoneCount : 0
          this.allShowData.heatDestructionZoneCount = newValue && newValue.comfortZoneNameData && newValue.comfortZoneNameData.heatDestructionZoneCount !== null ? newValue.comfortZoneNameData.heatDestructionZoneCount : 0
          this.allShowData.coldDestructionZoneCount = newValue && newValue.comfortZoneNameData && newValue.comfortZoneNameData.coldDestructionZoneCount !== null ? newValue.comfortZoneNameData.coldDestructionZoneCount : 0
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
    makeChart(params) {
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
              { value: params.mostComfortZoneCount, name: '最舒适', itemStyle: { color: '#03B050' }},
              { value: params.comfortZoneCount, name: '舒适区', itemStyle: { color: '#93D04F' }},
              { value: params.lessComfortZoneCount, name: '欠舒适', itemStyle: { color: '#D1DEEE' }},
              { value: params.unComfortZoneCount, name: '不舒适', itemStyle: { color: '#9DC4E6' }},
              { value: params.heatStressZoneCount, name: '热应激', itemStyle: { color: '#FFAE79' }},
              { value: params.coldStressZoneCount, name: '冷应激', itemStyle: { color: ' #00B2F6' }},
              { value: params.heatDamageZoneCount, name: '热伤害', itemStyle: { color: '#F38337' }},
              { value: params.coldDamageZoneCount, name: '冷伤害', itemStyle: { color: '#2D76B5' }},
              { value: params.heatDestructionZoneCount, name: '热毁灭', itemStyle: { color: '#D45200' }},
              { value: params.coldDestructionZoneCount, name: '冷毁灭', itemStyle: { color: '#006ECC' }}
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
  height: 15%;
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
.main-cen{
  width: 100%;
  height: 30%;

  display: flex;
  flex-direction: row;
  .main-cen-l{
    height: 100%;
    width: 50%;
    .main-cen-l-t{
      height: 30%;
      width: 100%;
      padding-left: 1.25rem;
      // color: #CDD8F7;
      @include font_color('mainFontColor11');
      font-size: .75rem;
    }
    .main-cen-l-f{
      // color: #ffffff;
      @include font_color('mainFontColor2');
      font-size: 1.25rem;
      font-weight: 800;
      height: 70%;
      width: 100%;
      padding-left: 1.25rem;
    }
  }
  .main-cen-r{
    height: 100%;
    width: 50%;
    .main-cen-r-t{
      height: 30%;
      width: 100%;
      // color: #CDD8F7;
      @include font_color('mainFontColor11');
      font-size: .75rem;
    }
    .main-cen-r-f{
      // color: #ffffff;
      @include font_color('mainFontColor2');
      font-size: 1.25rem;
      font-weight: 800;
      height: 70%;
      width: 100%;
    }
  }
}
.main-footer{
  width: 100%;
  height: 55%;
  display: flex;
  flex-direction: row;
  padding: .625rem 0 0 0 ;
  // border-top: 1px solid #6498FF;
  border-top: 1px solid;
  @include border_top_color('overviewBorderColor');
}
.main-footer-l{
    // padding: .3125rem 0;
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    font-size: .75rem;
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

      }
      .f-l-02-2{
        height: 100%;
        width: 40%;
        text-align: center;
        line-height: 100%;
        font-size: .625rem;
        // color: #ffffff;
        @include font_color('mainFontColor2');
      }
      .f-l-02-3{
        height: 100%;
        width: 10%;
        flex-direction: row;
        justify-content: center;
        align-items: center;
      }
      .f-l-02-4{
        height: 100%;
        width: 40%;
        text-align: center;
        line-height: 100%;
        font-size: .625rem;
        // color: #ffffff;
        @include font_color('mainFontColor2');
      }
      .f-1-icon-1{
        height: .75rem;
        width: .75rem;
        border-radius: .125rem;
        background: #03B050;
      }
      .f-1-icon-2{
        height: .75rem;
        width: .75rem;
        border-radius: .125rem;
        background: #93D04F;
      }
      .f-1-icon-3{
        height: .75rem;
        width: .75rem;
        border-radius: .125rem;
        background: #D1DEEE;
      }
      .f-1-icon-4{
        height: .75rem;
        width: .75rem;
        border-radius: .125rem;
        background: #9DC4E6;
      }
      .f-1-icon-5{
        height: .75rem;
        width: .75rem;
        border-radius: .125rem;
        background: #FFAE79;
      }
      .f-1-icon-6{
        height: .75rem;
        width: .75rem;
        border-radius: .125rem;
        background: #00B2F6;
      }
      .f-1-icon-7{
        height: .75rem;
        width: .75rem;
        border-radius: .125rem;
        background: #F38337;
      }
      .f-1-icon-8{
        height: .75rem;
        width: .75rem;
        border-radius: .125rem;
        background: #2D76B5;
      }
      .f-1-icon-9{
        height: .75rem;
        width: .75rem;
        border-radius: .125rem;
        background: #D45200;
      }
      .f-1-icon-10{
        height: .75rem;
        width: .75rem;
        border-radius: .125rem;
        background: #006ECC;
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
  font-weight: 800;
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
  background-size: contain;
}
</style>
