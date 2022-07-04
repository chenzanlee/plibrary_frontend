<template>
  <div class="view-table table_page" style="width:100%">
    <el-table
      ref="tables"
      style="width: 100%"
      :class="isfullScreen ? 'table-full' : ''"
      height="calc(100vh - 353px)"
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
      <!-- <el-table-column label="厂区" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{
            scope.row.roomTypeName ? scope.row.roomTypeName : '---'
          }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="批次" fixed width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{
            scope.row.batchNumber ? scope.row.batchNumber : '---'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单元" fixed width="120">
        <template slot-scope="scope">
          <span
            style="margin-left: 10px"
            :style="
              scope.row.statusWarning === 1 ? 'color: #FF5656!important;' : ''
            "
          >{{
            scope.row.roomTypeName
              ? scope.row.roomTypeName + scope.row.unit
              : '---'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="室内前温" width="70">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{
            valueExist(scope.row.temperatureInner1) &&
              scope.row.temperatureInner1 !== -100
              ? scope.row.temperatureInner1 + '°C'
              : '---'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="室内后温" width="70">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{
            valueExist(scope.row.temperatureInner2) &&
              scope.row.temperatureInner2 !== -100
              ? scope.row.temperatureInner2 + '°C'
              : '---'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="室内前湿" width="70">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{
            valueExist(scope.row.humiditieInner1) &&
              scope.row.humiditieInner1 !== -100
              ? scope.row.humiditieInner1 + '%'
              : '---'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="室内后湿" width="70">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{
            valueExist(scope.row.humiditieInner2) &&
              scope.row.humiditieInner2 !== -100
              ? scope.row.humiditieInner2 + '%'
              : '---'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开启风机数" width="90">
        <template slot-scope="scope">
          <span
            style="margin-left: 10px;width: 28px;
            display: inline-block;
            height: 28px;
            line-height: 28px;
            text-align: center;
            border-radius: 14px;
font-weight: 900;font-size: 16px;"
          >{{
            valueExist(scope.row.totalFanNum) ? scope.row.totalFanNum : '---'
          }}</span>
        </template>
      </el-table-column>

      <el-table-column label="装猪数量" width="70">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{
            valueExist(scope.row.pigCount) ? scope.row.pigCount : '---'
          }}</span>
        </template>
      </el-table-column>

      <el-table-column label="日龄" width="70">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{
            valueExist(scope.row.pigDays) ? scope.row.pigDays : '---'
          }}</span>
        </template>
      </el-table-column>

      <el-table-column label="单猪体重" width="70">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{
            valueExist(scope.row.weight) ? scope.row.weight + 'kg' : '---'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日死亡率" width="70">
        <template slot-scope="scope">
          <span
            style="margin-left: 10px"
            :style="viewColor(scope.row.deathRateDay)"
          >{{
            valueExist(scope.row.deathRateDay)
              ? scope.row.deathRateDay + '%'
              : '---'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="周死亡率" width="70">
        <template slot-scope="scope">
          <span
            style="margin-left: 10px"
            :style="viewColor(scope.row.deathRateWeek)"
          >{{
            valueExist(scope.row.deathRateWeek)
              ? scope.row.deathRateWeek + '%'
              : '---'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="累计死亡率" width="80">
        <template slot-scope="scope">
          <span
            style="margin-left: 10px"
            :style="viewColor(scope.row.deathRateTotal)"
          >{{
            valueExist(scope.row.deathRateTotal)
              ? scope.row.deathRateTotal + '%'
              : '---'
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
  computed: {
    ...mapGetters(['sidebar', 'fullScreen']),
    isfullScreen() {
      return this.fullScreen
    }
  },
  props: {
    tableData: {
      type: Array,
      default: function() {
        return []
      }
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
  .el-table td,
  .el-table th.is-leaf {
    border-bottom: none;
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
}
</style>
