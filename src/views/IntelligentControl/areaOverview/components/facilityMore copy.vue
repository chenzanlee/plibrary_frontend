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
          最舒适
        </div>
        <div class="main-cen-r">
          舒适区
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
  // props: ['listData', 'tipTitle'],
  // props: ['tipTitle'],
  data() {
    return {
      myChart: null,
      percentage: 0,
      allNumber: 0,
      numerator: 0
    }
  },
  watch: {
    // listData: {
    //   handler(newValue, oldValue) {
    //     this.numerator = newValue.numerator
    //     this.allNumber = newValue.denominator
    //     if (newValue.denominator === 0) {
    //       this.percentage = 0
    //     } else {
    //       this.percentage = Math.round(newValue.numerator / newValue.denominator * 100)
    //     }

    //     this.makeChart()
    //   },
    //   deep: true
    // }
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
    makeChart() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.myChart = this.$echarts.init(this.$refs.facilitySort)
          this.myChart.setOption(option, true)
          window.addEventListener('resize', debounce(this.chartResize, 300))
        }, 100)
      })
      const data = {
        value: 80,
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
        // color: ['#282c40'],
        color: ['#0F2B54'],
        legend: {
          show: false,
          data: []
        },
        series: [{
          name: 'Line 1',
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
            value: data.value,
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
            value: 100 - data.value
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
  color: #cdd8f7;
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
  }
  .main-cen-r{
    height: 100%;
    width: 50%;
  }
}
.main-footer{
  width: 100%;
  height: 55%;
  display: flex;
  flex-direction: row;
  padding: .625rem 0 0 0 ;
  border-top: 1px solid #6498FF;
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
        color: #ffffff;
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
        color: #ffffff;
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
