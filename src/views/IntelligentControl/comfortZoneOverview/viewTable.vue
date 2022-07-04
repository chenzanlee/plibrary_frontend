<template>
  <div class="view-table table_page comfortZoomTable" style="width: 100%">
    <el-table
      ref="tables"
      style="width: 100%"
      :class="isfullScreen ? 'table-full' : ''"
      height="calc(100vh - 448px)"
      :data="tableData"
      :row-style="getRowClass"
      :header-cell-style="getRowClassHeader"
      :row-key="getRowKey"
      :stripe="true"
      :row-class-name="tabRowClassName"
      highlight-current-row
      :cell-style="cellStyle"
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="批次" fixed width="180">
        <template slot-scope="scope">
          <span>{{
            scope.row.batchNumber ? scope.row.batchNumber : "---"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单元" fixed width="120">
        <template slot-scope="scope">
          <span
            :style="
              scope.row.statusWarning === 1 ? 'color: #FF5656!important;' : ''
            "
          >{{
            scope.row.roomTypeName
              ? scope.row.roomTypeName + scope.row.unit
              : "---"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="舒适区" width="80">
        <template slot-scope="scope">
          <span class="zoom" :style="getStyle(scope.row.comfortZone)">
            {{ scope.row.comfortZoneName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="推荐温度" width="70">
        <template slot-scope="scope">
          <span>{{
            valueExist(scope.row.mostComfortTemperature) &&
              scope.row.mostComfortTemperature !== -100
              ? scope.row.mostComfortTemperature + "°C"
              : "---"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="室内前温" width="70">
        <template slot-scope="scope">
          <span>{{
            valueExist(scope.row.temperatureInner1) &&
              scope.row.temperatureInner1 !== -100
              ? scope.row.temperatureInner1 + "°C"
              : "---"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="室内后温" width="70">
        <template slot-scope="scope">
          <span>{{
            valueExist(scope.row.temperatureInner2) &&
              scope.row.temperatureInner2 !== -100
              ? scope.row.temperatureInner2 + "°C"
              : "---"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="目标温度" width="70">
        <template slot-scope="scope">
          <span>{{
            valueExist(scope.row.targetTemperature) &&
              scope.row.targetTemperature !== -100
              ? scope.row.targetTemperature + "°C"
              : "---"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="室内前湿" width="70">
        <template slot-scope="scope">
          <span>{{
            valueExist(scope.row.humiditieInner1) &&
              scope.row.humiditieInner1 !== -100
              ? scope.row.humiditieInner1 + "%"
              : "---"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="室内后湿" width="70">
        <template slot-scope="scope">
          <span>{{
            valueExist(scope.row.humiditieInner2) &&
              scope.row.humiditieInner2 !== -100
              ? scope.row.humiditieInner2 + "%"
              : "---"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="目标湿度" width="70">
        <template slot-scope="scope">
          <span>{{
            valueExist(scope.row.targetHumidity) &&
              scope.row.targetHumidity !== -100
              ? scope.row.targetHumidity + "%"
              : "---"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开启风机数" width="90">
        <template slot-scope="scope">
          <span
            style="
              width: 28px;
              background-color:#20A4FC;
              display: inline-block;
              height: 28px;
              line-height: 28px;
              text-align: center;
              border-radius: 14px;
              font-weight: 700;
              font-size: 12px;
            "
          >{{
            valueExist(scope.row.totalFanNum) ? scope.row.totalFanNum : "---"
          }}</span>
        </template>
      </el-table-column>

      <el-table-column label="装猪数量" width="70">
        <template slot-scope="scope">
          <span>{{
            valueExist(scope.row.pigCount) ? scope.row.pigCount : "---"
          }}</span>
        </template>
      </el-table-column>

      <el-table-column label="日龄" width="70">
        <template slot-scope="scope">
          <span>{{
            valueExist(scope.row.pigDays) ? scope.row.pigDays : "---"
          }}</span>
        </template>
      </el-table-column>

      <el-table-column label="单猪体重" width="70">
        <template slot-scope="scope">
          <span>{{
            valueExist(scope.row.weight) ? scope.row.weight + "kg" : "---"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日死亡率" width="70">
        <template slot-scope="scope">
          <span
            :style="viewColor(scope.row.deathRateDay)"
          >{{
            valueExist(scope.row.deathRateDay)
              ? scope.row.deathRateDay + "%"
              : "---"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="周死亡率" width="70">
        <template slot-scope="scope">
          <span
            :style="viewColor(scope.row.deathRateWeek)"
          >{{
            valueExist(scope.row.deathRateWeek)
              ? scope.row.deathRateWeek + "%"
              : "---"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="累计死亡率">
        <template slot-scope="scope">
          <span
            :style="viewColor(scope.row.deathRateTotal)"
          >{{
            valueExist(scope.row.deathRateTotal)
              ? scope.row.deathRateTotal + "%"
              : "---"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" fixed="right" width="110">
        <template slot-scope="scope">
          <div class="icon-box">
            <svg-icon
              class="icon-item"
              :icon-class="
                scope.row.statusOnline === 1 ? 'online-ico' : 'offline-ico'
              "
            />
            <svg-icon
              v-if="scope.row.statusWarning === 1"
              class="icon-item"
              icon-class="warn-num"
            />
            <svg-icon
              v-if="scope.row.isEmptyUnit === 1"
              class="icon-item"
              icon-class="empty-ico"
            />
            <svg-icon
              v-if="scope.row.isAlarmSuspend === 1"
              class="icon-item"
              icon-class="stop-alarm"
            />
            <svg-icon
              v-if="scope.row.isParamLock === true"
              class="icon-item"
              icon-class="lock-ico"
            />
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    tableData: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'fullScreen']),
    isfullScreen() {
      return this.fullScreen
    }
  },
  methods: {
    valueExist(value) {
      if (
        value === '' ||
        value === undefined ||
        value === null ||
        isNaN(value)
      ) {
        return false
      } else {
        return true
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
    },
    getStyle(val) {
      let color_obj = null
      switch (val) {
        case 'MostComfortZone':
          color_obj = {
            color: '#FFFFFF',
            backgroundColor: '#03B050'
          }
          break
        case 'LessComfortZone':
          color_obj = {
            color: '#424242',
            backgroundColor: '#D1DEEE'
          }
          break
        case 'ComfortZone':
          color_obj = {
            color: '#FFFFFF',
            backgroundColor: '#93D04F'
          }
          break
        case 'UnComfortZone':
          color_obj = {
            color: '#424242',
            backgroundColor: '#FFE698'
          }
          break
        case 'HeatStressZone':
          color_obj = {
            color: '#424242',
            backgroundColor: '#F4B182'
          }
          break
        case 'HeatDamageZone':
          color_obj = {
            color: '#FFFFFF',
            backgroundColor: '#C55A11'
          }
          break
        case 'HeatDestructionZone':
          color_obj = {
            color: '#FFFFFF',
            backgroundColor: '#C55A11'
          }
          break
        case 'ColdStressZone':
          color_obj = {
            color: '#FFFFFF',
            backgroundColor: '#00B0F0'
          }
          break
        case 'ColdDamageZone':
          color_obj = {
            color: '#FFFFFF',
            backgroundColor: '#2D76B5'
          }
          break
        case 'ColdDestructionZone':
          color_obj = {
            color: '#FFFFFF',
            backgroundColor: '#2D76B5'
          }
          break
        default:
          break
      }
      return color_obj ? `color:${color_obj.color};background-color:${color_obj.backgroundColor}` : ''
    },
    handleRowClick(event) {
      this.$emit('handleRowClick', event)
    },
    handleSelectionChange() {},
    // 斑马色
    tabRowClassName({ row, rowIndex }) {
      const index = rowIndex + 1
      if (index % 2 === 0) {
        return 'warning-row'
      } else {
        return 'default-row'
      }
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
    // 翻页时，记住上一页的勾选标识
    getRowKey(row) {
      return row.id
    }
  }
}
</script>

<style lang="scss">
.comfortZoomTable .el-table {
  .el-table__fixed-right{
    height:auto !important; // 此处的important表示优先于element.style
    bottom:7px; // 改为自动高度后，设置与父容器的底部距离，则高度会动态改变
    right:0px!important;
  }
  .el-table__fixed {
    height:auto !important; // 此处的important表示优先于element.style
    bottom:7px; // 改为自动高度后，设置与父容器的底部距离，则高度会动态改变
  }
}
.comfortZoomTable .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar {
  width: 0px!important;/* 滚动条宽度， width：对应竖滚动条的宽度  height：对应横滚动条的高度*/
  height: 7px!important;
  border-radius: 2px!important;
  // background-color: transparent!important;
  display: inline-block!important;
  cursor: pointer!important;
}
.comfortZoomTable .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-thumb {
  border-radius: 2px!important;
  height: 100%!important;
  // background-color: rgb(34, 50, 130)!important;
  outline: none!important;
  border:none!important;
  cursor: pointer!important;
  display: inline-block!important;
}
.comfortZoomTable .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-thumb:hover {
  background-color: #227fe6!important;
}

.el-table .default-row {
  // background: transparent !important;
  // background: #0b1b4b !important ;
}
.zoom {
  display: inline-block;
  text-align: center;
  width: 60px;
  height: 24px;
  line-height: 24px;
  border-radius: 2px;
  font-size: 12px;
  font-family: SourceHanSansCN, SourceHanSansCN-Medium;
  font-weight: 500;
}
.view-table {
  .el-table__row {
    cursor: pointer;
  }
  .table-full {
    height: calc(100vh - 200px) !important;
  }
  .el-table__fixed-right-patch {
    background: #43619f;
  }
  .icon-item {
    margin-right: 10px;
  }
  // .el-table--striped .el-table__body tr.el-table__row--striped td {
  //   background: #0d2055;
  // }
  .el-table thead {
    font-size: 12px;
  }
  // .el-table tbody tr:hover > td {
  //   background-color: #0d2055 !important; /*高亮*/
  // }
  // .hover-row,
  // .current-row {
  //   td {
  //     background-color: #0d2055 !important; /*高亮*/
  //   }
  // }
  .el-table__fixed-right-patch{
    width:10px!important;
    // background-color: #223282;
    // border-bottom:1px solid #223282;
  }
}
</style>
