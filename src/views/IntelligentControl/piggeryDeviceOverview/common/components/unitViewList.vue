<template>
  <div class="view-table table_page view-table-piggery" style="width: 100%">
    <el-table
      ref="tables"
      :data="list"
      :row-style="getRowClass"
      :header-cell-style="getRowClassHeader"
      :row-class-name="tabRowClassName"
      :stripe="true"
      highlight-current-row
      :cell-style="cellStyle"
      height="calc(100vh - 438px)"
      @row-click="handleRowClick"
    >
      <el-table-column
        fixed="left"
        label="批次"
        width="180"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.batchNumber || '---'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="left"
        label="通道"
        width="80"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.channel || '---'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="left"
        label="单元"
        width="80"
      >
        <template slot-scope="scope">
          <span :style="{ color: scope.row.alarmStatus ? 'rgb(255, 86, 86)' : '' }">{{
            scope.row.roomTypeName + scope.row.unitName
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="舒适区"
        width="120"
      >
        <template slot-scope="scope">
          <span
            style="text-align: center; width:58px; height: 24px; border-radius: 2px;"
            :style="{backgroundColor: getColor(scope.row.comfortZone).backgroundColor,
                     display: getColor(scope.row.comfortZone).display,
                     color: getColor(scope.row.comfortZone).color}"
          >{{
            scope.row.comfortZoneName || '---'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="类型"
        width="120"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.typeStr || '---'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="开启时间"
        width="120"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.startTimeDesc || '---'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="开启时长"
        width="100"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.durationDesc || '---'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="推荐温度(℃)"
        width="120"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.mostComfortTemperature === -100 ? '---' : scope.row.mostComfortTemperature
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="室内温度(℃)"
        width="120"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.temperature === -100 ? '---' : scope.row.temperature
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="室内湿度"
        width="120"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.humidity === -100 ? '---' : scope.row.humidity + '%'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="装猪数量(头)"
        width="120"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.count || '---'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="体重(kg)"
        width="100"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.weight || '---'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="日龄(天)"
        width="100"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.age || '---'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="日死亡率"
        width="100"
      >
        <template slot-scope="scope">
          <span
            :style="viewColor(scope.row.deathRateDay)"
          >{{
            scope.row.deathRateDay ? scope.row.deathRateDay + '%' : '---'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="周死亡率"
        width="100"
      >
        <template slot-scope="scope">
          <span
            :style="viewColor(scope.row.deathRateWeek)"
          >{{
            scope.row.deathRateWeek ? scope.row.deathRateWeek + '%' : '---'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="累计死亡率"
        width="120"
      >
        <template slot-scope="scope">
          <span
            :style="viewColor(scope.row.deathRateTotal)"
          >{{
            scope.row.deathRateTotal ? scope.row.deathRateTotal + '%' : '---'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        fixed="right"
        width="110"
      >
        <template slot-scope="scope">
          <div class="icon-box">
            <svg-icon
              class="icon-item"
              :icon-class="
                scope.row.statusOnline ? 'online-ico' : 'offline-ico'
              "
            />
            <!-- style="left:-500px;right:0;top:0;min-width: 500px;min-height: 100px;"  -->
            <!-- <span v-if="scope.row.alarmStatus" style="margin-right: 4px;position:relative;" @mouseenter="getalarmInfo(scope.row)">
              <suspensionAlarm
                v-show="alarmShow"
                :info="equipmentAlarmDetails"
                style="left:-500px;right:0;top:0;min-width: 500px;min-height: 100px;"
                @closeAlarm="closeAlarm"
              />
              <svg-icon icon-class="warn-num" title="警告" />
            </span> -->
            <svg-icon v-if="scope.row.alarmStatus" class="icon-item" icon-class="warn-num" />
            <svg-icon
              v-if="scope.row.isEmptyUnit"
              class="icon-item"
              :icon-class="'empty-ico'"
            />
            <svg-icon
              v-if="scope.row.lockParam"
              class="icon-item"
              :icon-class="'lock-ico'"
            />
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import suspensionAlarm from './suspensionAlarm'
export default {
  components: {
    // suspensionAlarm
  },
  props: {
    list: {
      type: Array,
      default: function() {
        return []
      }
    },
    pageElement: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      equipmentAlarmDetails: [],
      alarmShow: false
    }
  },
  methods: {
    closeAlarm() {
      this.alarmShow = false
    },
    // 告警详情
    async getalarmInfo(obj) {
      console.log('getalarmInfo---', obj)
      this.alarmShow = true
      const data = {
        channel: obj.channel,
        deviceId: obj.deviceId,
        deviceName: obj.deviceName
      }
      const element = this.pageElement['getAlarmDetails']
      this.$httpRequest({
        type: element?.method,
        uri: element?.uri,
        payload: data,
        callback: res => {
          if (res.status === 200) {
            this.equipmentAlarmDetails = res.data.rows
          }
        }
      })
    },
    getColor(val) {
      // console.log(val)
      let color_obj = {}
      switch (val) {
        case 'MostComfortZone': color_obj = {
          display: 'table',
          color: '#FFFFFF',
          backgroundColor: '#03B050'
        }; break
        case 'LessComfortZone': color_obj = {
          display: 'table',
          color: '#424242',
          backgroundColor: '#D1DEEE'
        }; break
        case 'ComfortZone': color_obj = {
          display: 'table',
          color: '#FFFFFF',
          backgroundColor: '#93D04F'
        }; break
        case 'UnComfortZone': color_obj = {
          display: 'table',
          color: '#424242',
          backgroundColor: '#FFE698'
        }; break
        case 'HeatStressZone': color_obj = {
          display: 'table',
          color: '#424242',
          backgroundColor: '#F4B182'
        }; break
        case 'HeatDamageZone': color_obj = {
          display: 'table',
          color: '#FFFFFF',
          backgroundColor: '#C55A11'
        }; break
        case 'HeatDestructionZone': color_obj = {
          display: 'table',
          color: '#FFFFFF',
          backgroundColor: '#C55A11'
        }; break
        case 'ColdStressZone': color_obj = {
          display: 'table',
          color: '#FFFFFF',
          backgroundColor: '#00B0F0'
        }; break
        case 'ColdDamageZone': color_obj = {
          display: 'table',
          color: '#FFFFFF',
          backgroundColor: '#2D76B5'
        }; break
        case 'ColdDestructionZone': color_obj = {
          display: 'table',
          color: '#FFFFFF',
          backgroundColor: '#2D76B5'
        }; break
        default: break
      }
      return color_obj
    },
    handleRowClick(event) {
      this.$emit('handleRowClick', event)
    },
    // 行颜色
    getRowClassHeader({ row, rowIndwx }) {
      var styleJson = {}
      styleJson = {
        background: '#223282',
        color: '#CDD8F7',
        height: '43px'
      }
      return styleJson // 返回对象
    },
    getRowClass({ row, rowIndwx }) {
      var styleJson = {}
      styleJson = {
        background: '#001B3F',
        color: '#CDD8F7',
        height: '43px',
        fontSize: '12px'
      }
      return styleJson // 返回对象
    },
    // 斑马色
    tabRowClassName({ row, rowIndex }) {
      const index = rowIndex + 1
      if (index % 2 === 0) {
        return 'warning-row'
      } else {
        return 'default-row'
      }
    },
    // table 文本颜色
    cellStyle(row, column, rowIndex, columnIndex) {
      if (row.column.label === '当前状态' && row.row.status === 1) {
        return {
          color: '#0ED1AA',
          'font-size': '12px'
        }
      } else if (row.column.label === '当前状态' && row.row.status === 2) {
        return {
          color: '#F3384F',
          'font-size': '12px'
        }
      }
    },
    viewColor(val) {
      if (!val) {
        // return 'color:red'
      } else if (val < 0.25) {
        return 'color:#03C785'
      } else if (val >= 0.25 && val < 0.5) {
        return 'color:#E6D300'
      } else if (val > 0.5) {
        return 'color:#FF5656'
      }
    }
  }
}
</script>
<style lang="scss">
   .view-table-piggery {
    .el-table__fixed-right{
      right:0!important;
      height: 102%!important;
      z-index: 4;
      // background: #0b1b4b;
    }
    .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar {
      width: 0px!important;/* 滚动条宽度， width：对应竖滚动条的宽度  height：对应横滚动条的高度*/
      height: 12px!important;
      border-radius: 2px!important;
      // background-color: transparent!important;
      display: inline-block!important;
      cursor: pointer!important;
    }
    .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-thumb {
      border-radius: 2px!important;
      height: 100%!important;
      // background-color: rgb(34, 50, 130)!important;
      outline: none!important;
      border:none!important;
      cursor: pointer!important;
      display: inline-block!important;
    }
    .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-thumb:hover {
      background-color: #227fe6!important;
    }
   }
  // .view-table .el-table__fixed-right-patch{
  //   background-color: rgb(34, 50, 130);border-bottom: none;
  // }
.el-table .default-row {
  // background: transparent !important;
  // background: #0b1b4b !important ;
}
.view-table {
  .el-table__row{
    cursor: pointer;
  }
  .table-full{
  height:calc(100vh - 200px) !important;
  }
  // .el-table__fixed-right-patch {
  //   background: #43619f;
  // }
  .icon-item {
    margin-right: 10px;
  }
  // .el-table--striped .el-table__body tr.el-table__row--striped td {
  //   // background: #0d2055;
  //   @include background_color('inPigBackGroundColor9');
  // }
  .el-table thead {
    font-size: 12px;
  }
  // .el-table tbody tr:hover > td {
  //   // background-color: #0d2055 !important; /*高亮*/
  //   @include background_color('inPigBackGroundColor9');
  // }
  // .hover-row,
  // .current-row {
  //   td {
  //     // background-color: #0d2055 !important; /*高亮*/
  //     @include background_color('inPigBackGroundColor9');
  //   }
  // }
}
</style>

