<template>
  <div class="sortbg">
    <div class="title card-bgc-fill">
      <div class="head-title">
        <div>
          <slot name="title">{{ resData.fieldName }}</slot>
        </div>
      </div>
    </div>
    <div class="main-contain">
      <div class="main-con-l">
        <div class="m-c-l-list-1">单元概况</div>
        <div class="m-c-l-list-2">
          <div>在线：</div>
          <div>{{ resData.onlineUnitCount }}</div>
        </div>
        <div class="m-c-l-list-2">
          <div>离线：</div>
          <div>{{ resData.offlineUnitCount }}</div>
        </div>
        <div class="m-c-l-list-2">
          <div>告警：</div>
          <div>{{ resData.alarmUnitCount }}</div>
        </div>
        <div class="m-c-l-list-2">
          <div>空圈：</div>
          <div>{{ resData.emptyUnitCount }}</div>
        </div>
        <div class="m-c-l-list-2">
          <div>刷圈：</div>
          <div>{{ resData.sweepUnitCount }}</div>
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
          regionId: 0,
          regionName: 0,
          areaId: 0,
          areaName: 0,
          fieldId: 0,
          fieldName: 0,
          onlineUnitCount: 0,
          offlineUnitCount: 0,
          alarmUnitCount: 0,
          emptyUnitCount: 0,
          sweepUnitCount: 0,
          comfortZoneNameData: {
            mostComfortZoneCount: 0,
            comfortZoneCount: 0,
            lessComfortZoneCount: 0,
            unComfortZoneCount: 0,
            heatStressZoneCount: 0,
            coldStressZoneCount: 0,
            coldDamageZoneCount: 0,
            heatDamageZoneCount: 0,
            heatDestructionZoneCount: 0,
            coldDestructionZoneCount: 0
          }
        }
      }
    }
  },
  data() {
    return {
      resData: {
        regionId: 0,
        regionName: 0,
        areaId: 0,
        areaName: 0,
        fieldId: 0,
        fieldName: 0,
        onlineUnitCount: 0,
        offlineUnitCount: 0,
        alarmUnitCount: 0,
        emptyUnitCount: 0,
        sweepUnitCount: 0,
        comfortZoneNameData: {
          mostComfortZoneCount: 0,
          comfortZoneCount: 0,
          lessComfortZoneCount: 0,
          unComfortZoneCount: 0,
          heatStressZoneCount: 0,
          coldStressZoneCount: 0,
          coldDamageZoneCount: 0,
          heatDamageZoneCount: 0,
          heatDestructionZoneCount: 0,
          coldDestructionZoneCount: 0
        }
      }
    }
  },
  watch: {
    listData: {
      handler(newValue, oldValue) {
        this.resData.regionId = newValue && newValue.regionId !== null ? newValue.regionId : 0
        this.resData.regionName = newValue && newValue.regionName !== null ? newValue.regionName : 0
        this.resData.areaId = newValue && newValue.areaId !== null ? newValue.areaId : 0
        this.resData.areaName = newValue && newValue.areaName !== null ? newValue.areaName : 0
        this.resData.fieldId = newValue && newValue.fieldId !== null ? newValue.fieldId : 0
        this.resData.fieldName = newValue && newValue.fieldName !== null ? newValue.fieldName : 0
        this.resData.onlineUnitCount = newValue && newValue.onlineUnitCount !== null ? newValue.onlineUnitCount : 0
        this.resData.offlineUnitCount = newValue && newValue.offlineUnitCount !== null ? newValue.offlineUnitCount : 0
        this.resData.alarmUnitCount = newValue && newValue.alarmUnitCount !== null ? newValue.alarmUnitCount : 0
        this.resData.emptyUnitCount = newValue && newValue.emptyUnitCount !== null ? newValue.emptyUnitCount : 0
        this.resData.sweepUnitCount = newValue && newValue.sweepUnitCount !== null ? newValue.sweepUnitCount : 0
        this.resData.comfortZoneNameData.mostComfortZoneCount = newValue && newValue.comfortZoneNameData && newValue.comfortZoneNameData.mostComfortZoneCount !== null ? newValue.comfortZoneNameData.mostComfortZoneCount : 0
        this.resData.comfortZoneNameData.comfortZoneCount = newValue && newValue.comfortZoneNameData && newValue.comfortZoneNameData.comfortZoneCount !== null ? newValue.comfortZoneNameData.comfortZoneCount : 0
        this.resData.comfortZoneNameData.lessComfortZoneCount = newValue && newValue.comfortZoneNameData && newValue.comfortZoneNameData.lessComfortZoneCount !== null ? newValue.comfortZoneNameData.lessComfortZoneCount : 0
        this.resData.comfortZoneNameData.unComfortZoneCount = newValue && newValue.comfortZoneNameData && newValue.comfortZoneNameData.unComfortZoneCount !== null ? newValue.comfortZoneNameData.unComfortZoneCount : 0
        this.resData.comfortZoneNameData.heatStressZoneCount = newValue && newValue.comfortZoneNameData && newValue.comfortZoneNameData.heatStressZoneCount !== null ? newValue.comfortZoneNameData.heatStressZoneCount : 0
        this.resData.comfortZoneNameData.coldStressZoneCount = newValue && newValue.comfortZoneNameData && newValue.comfortZoneNameData.coldStressZoneCount !== null ? newValue.comfortZoneNameData.coldStressZoneCount : 0
        this.resData.comfortZoneNameData.coldDamageZoneCount = newValue && newValue.comfortZoneNameData && newValue.comfortZoneNameData.coldDamageZoneCount !== null ? newValue.comfortZoneNameData.coldDamageZoneCount : 0
        this.resData.comfortZoneNameData.heatDamageZoneCount = newValue && newValue.comfortZoneNameData && newValue.comfortZoneNameData.heatDamageZoneCount !== null ? newValue.comfortZoneNameData.heatDamageZoneCount : 0
        this.resData.comfortZoneNameData.heatDestructionZoneCount = newValue && newValue.comfortZoneNameData && newValue.comfortZoneNameData.heatDestructionZoneCount !== null ? newValue.comfortZoneNameData.heatDestructionZoneCount : 0
        this.resData.comfortZoneNameData.coldDestructionZoneCount = newValue && newValue.comfortZoneNameData && newValue.comfortZoneNameData.coldDestructionZoneCount !== null ? newValue.comfortZoneNameData.coldDestructionZoneCount : 0
        this.makeChart(this.resData)
        console.log('watch', this.resData)
      },
      deep: true
    }
  },
  mounted() {
    this.makeChart(this.resData)
  },
  methods: {
    chartResize() { // 重置echarts
      if (this.myChart) {
        this.myChart.resize()
      }
    },
    makeChart(params) { // echarts设置
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
              { value: params.comfortZoneNameData.mostComfortZoneCount, name: '最舒适', itemStyle: { color: '#03B050' }},
              { value: params.comfortZoneNameData.comfortZoneCount, name: '舒适区', itemStyle: { color: '#93D04F' }},
              { value: params.comfortZoneNameData.lessComfortZoneCount, name: '欠舒适', itemStyle: { color: '#D1DEEE' }},
              { value: params.comfortZoneNameData.unComfortZoneCount, name: '不舒适', itemStyle: { color: '#9DC4E6' }},
              { value: params.comfortZoneNameData.heatStressZoneCount, name: '热应激', itemStyle: { color: '#FFAE79' }},
              { value: params.comfortZoneNameData.coldStressZoneCount, name: '冷应激', itemStyle: { color: ' #00B2F6' }},
              { value: params.comfortZoneNameData.heatDamageZoneCount, name: '热伤害', itemStyle: { color: '#F38337' }},
              { value: params.comfortZoneNameData.coldDamageZoneCount, name: '冷伤害', itemStyle: { color: '#2D76B5' }},
              { value: params.comfortZoneNameData.heatDestructionZoneCount, name: '热毁灭', itemStyle: { color: '#D45200' }},
              { value: params.comfortZoneNameData.coldDestructionZoneCount, name: '冷毁灭', itemStyle: { color: '#006ECC' }}
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
  background: linear-gradient(90deg, rgba(34, 68, 195, 0.65) 0%,rgba(34, 68, 195, 0.1) 100%);
  border-radius:.25rem;
}
.sortbg {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: #cdd8f7;
  font-size: .75rem;
  background: rgba(28,28,95,0.2);
  border: .0625em solid #6498ff;
  border-radius: .25em;
  box-shadow: 0px 0px .9375em 0px #1c63ff inset;

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
    background: #223e9c;
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
    background: #223e9c;
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
      color: #CDD8F7;
      font-size: .75rem;
    }
  }
}

.title {
  width: 100%;
  height: 2.25rem;
  border-bottom: .125rem solid #303A8E;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap:wrap;
  align-items: center;
  box-sizing: border-box;
  color: #cdd8f7;
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
