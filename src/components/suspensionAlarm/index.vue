<template>
  <div
    :ref="parentRef"
    class="alarm-row"
    @mouseenter="change(true)"
    @mouseleave="change(false)"
  >
    <div
      v-if="status"
      class="alarm-row-tl overfolw"
      :class="status ? 'alarm-row-tl2' : ''"
      :style="{'transform': parentPransforms}"
    >
      <div class="alarm-row-tl-title">告警详情</div>
      <div v-if="info.length === 0" class="alarm-row-nodata">暂无数据</div>
      <div v-if="info.length > 0" class="alarm-row-table">
        <div class="alarm-row-table-row alarm-row-table-head">
          <div class="alarm-row-table-row-col alarm-row-table-row-col0">告警编号</div>
          <div class="alarm-row-table-row-col alarm-row-table-row-col1">告警类型</div>
          <div class="alarm-row-table-row-col alarm-row-table-row-col2">告警名称</div>
          <div class="alarm-row-table-row-col alarm-row-table-row-col3">告警信息</div>
        </div>

        <div v-for="(i, index) of info" :key="index" class="alarm-row-table-row">
          <div class="alarm-row-table-row-col alarm-row-table-row-col0">{{ i.num || '-' }}</div>
          <div class="alarm-row-table-row-col alarm-row-table-row-col1">{{ i.type || '-' }}</div>
          <div class="alarm-row-table-row-col alarm-row-table-row-col2">{{ i.name || '-' }}</div>
          <div class="alarm-row-table-row-col alarm-row-table-row-col3">{{ i.info || '-' }}</div>
        </div>
      </div>
      <i class="alarm-row-ic" :style="{'right': iconRight}" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'Suspension',
  props: {
    info: Array
  },
  data() {
    return {
      status: false,
      timer: null,
      resizeTimer: null,
      parentPransforms: 'translate(-35%, 0%)',
      iconRight: '50%',
      parentRef: 'parent' + (new Date()).getTime()
    }
  },
  created() {
    window.onresize = () => {
      clearTimeout(this.resizeTimer)
      this.resizeTimer = setTimeout(() => {
        this.getElementPosition()
      }, 1000)
    }
  },
  methods: {
    change(s) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.status = s
      }, 300)
      if (s) {
        this.getElementPosition()
      }
    },
    // 获取元素位置
    getElementPosition() {
      const DOM = this.$refs[this.parentRef]
      const left = DOM && this.getLeft(DOM)
      const right = DOM && this.getRight(DOM)

      if (left < 500) {
        this.parentPransforms = 'translate(0%, 0%)'
        this.iconRight = '85%'
      } else if (right <= 250) {
        this.parentPransforms = 'translate(-78%, 0%)'
        this.iconRight = '8%'
      } else {
        this.parentPransforms = 'translate(-35%, 0%)'
        this.iconRight = '50%'
      }
    },
    getLeft(e) {
      let offset = e.offsetLeft
      if (e.offsetParent != null) offset += this.getLeft(e.offsetParent)
      return offset
    },
    getRight(e) {
      const left = this.getLeft(e)
      const width = e.offsetWidth
      const pWidth = window.innerWidth
      return pWidth - left - width - 26
    }
  }
}
</script>
<style lang="scss" scoped>
.alarm{
  &-row{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
    cursor: pointer;
    &-tl{
      max-height: 300px;
      overflow-y: auto;
      display: none;
      position: absolute;
      bottom: 84px;
      left: -50%;
      // transform: translate(-35%, 0%);
      z-index: 999;
      line-height: 20px;
      background: #364687;
      @include background_color('suspensionBkColor');
      padding: 5px 0;
      font-size: 12px;
      cursor: auto;
      border-radius: 2px;
      text-align: left;
      width: 500px;
      transition: all .5s;
      &-title{
        font-size: 16px;
        font-weight: 600;
        padding: 5px 10px;
        border-bottom: 1px solid #404f89;
        @include font_color('treeHintFontColor');
      }
    }
    &-tl2{
      display: block;
      transition: all .5s;
    }
    &-ic{
      position: absolute;
      bottom: -10px;
      transform: translate(50%, 0%);
      border-top: 5px solid #364687;;
      border-bottom: 5px solid rgba(0,0,0,0);
      border-left: 5px solid rgba(0,0,0,0);
      border-right: 5px solid rgba(0,0,0,0);
    }
    &-nodata{
      text-align: center;
      padding: 10px 0;
    }
    &-table{
      &-row{
        padding: 0 10px;
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        color: #fff;
        @include font_color('alarmBoxFontColor1');
        display: flex;
        border-bottom: 1px solid #404f89;
        &-col0{
          width: 70px;
          text-align: center;
        }
        &-col1{
          flex: 1;
        }
        &-col2{
          flex: 2;
        }
        &-col3{
          flex: 2;
        }
      }
      &-head{
        font-size: 14px;
        font-weight: 600;
        background: #223282;
        @include background_color('suspensionAlarmBkCOlor');
        color: #CDD8EF;
        @include font_color('alarmBoxFontColor');
      }
    }
  }
  &-row2{
    background: #064567;
  }
}

</style>
