<template>
  <div
    class="alarm-row"
  >
    <div
      class="alarm-row-tl"
      :class="'alarm-row-tl2'"
    >
      <div v-if="info.length === 0" class="alarm-row-nodata">暂无数据</div>
      <div v-if="info.length > 0" class="alarm-row-table">
        <div class="alarm-row-table-row alarm-row-table-head">
          <div class="alarm-row-table-row-col alarm-row-table-row-col0">告警编号</div>
          <div class="alarm-row-table-row-col alarm-row-table-row-col1">告警类型</div>
          <div class="alarm-row-table-row-col alarm-row-table-row-col2">告警名称</div>
          <div class="alarm-row-table-row-col alarm-row-table-row-col3">告警信息</div>
        </div>

        <div v-for="(i, index) of info" :key="index" class="alarm-row-table-row">
          <div class="alarm-row-table-row-col alarm-row-table-row-col0">{{ i.num }}</div>
          <div class="alarm-row-table-row-col alarm-row-table-row-col1">{{ i.type }}</div>
          <div class="alarm-row-table-row-col alarm-row-table-row-col2">{{ i.name }}</div>
          <div class="alarm-row-table-row-col alarm-row-table-row-col3">{{ i.info }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AlarmBox',
  props: {
    info: Array
  }
}
</script>
<style lang="scss" scoped>
.alarm{
  &-row{
    max-height: 300px;
    overflow-y: auto;
    &-tl{
      display: none;
      z-index: 999;
      line-height: 20px;
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
      }
    }
    &-tl2{
      display: block;
      transition: all .5s;
    }
    &-nodata{
      color: #6E83BE;
      @include font_color('bpFontColor1');
      text-align: center;
      padding: 10px 0;
    }
    &-table{
      &-row{
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        color: #fff;
        @include font_color('alarmBoxFontColor1');
        display: flex;
        border: 1px solid #404f89;
        @include border_color('alarmBoxBorderColor');
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
        color: #CDD8EF;
        @include font_color('alarmBoxFontColor');
        border-bottom: 1px solid #404f89;
      }
    }
  }
}

</style>
