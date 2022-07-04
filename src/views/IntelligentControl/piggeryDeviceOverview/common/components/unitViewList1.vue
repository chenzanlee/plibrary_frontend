<template>
  <div class="view-table table_page" style="width:100%">
    <el-table
      ref="tables"
      style="width: 100%;max-height: calc(100vh - 328px);"
      :class="isfullScreen ? 'table-full' : ''"
      height="calc(100vh - 412px)"
      :data="list"
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
      <el-table-column label="单元" fixed width="120">
        <template slot-scope="scope">
          <span
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
      <el-table-column label="舒适区" width="70">
        <template slot-scope="scope">
          <span
            style="text-align: center; width:58px; height: 24px; border-radius: 2px;"
            :style="{backgroundColor: getColor(scope.row.comfortZone).backgroundColor,
                     display: getColor(scope.row.comfortZone).display,
                     color: getColor(scope.row.comfortZone).color}"
          >
            {{ scope.row.comfortZoneName || '---' }}
          </span>
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
          <span>{{
            scope.row.deathRateDay || '---'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="周死亡率"
        width="100"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.deathRateWeek || '---'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="累计死亡率"
        width="120"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.deathRateTotal || '---'
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
            <svg-icon
              v-if="scope.row.alarmStatus"
              class="icon-item"
              icon-class="warn-num"
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
    list: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  methods: {
    getColor(val) {
      console.log(val)
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
    formatComfortZone(val) {
      console.log(val)
      let text = ''
      switch (val) {
        case 'MostComfortZone': text = '最舒适区'; break
        case 'LessComfortZone': text = '次舒适区'; break
        case 'ComfortZone': text = '舒适区'; break
        case 'UnComfortZone': text = '不舒适区'; break // 不舒适区-热
        case 'HeatStressZone': text = '热应激区'; break
        case 'HeatDamageZone': text = '热伤害区'; break
        case 'HeatDestructionZone': text = '热毁灭区'; break
        case 'ColdStressZone': text = '冷应激区'; break
        case 'ColdDamageZone': text = '冷伤害区'; break
        case 'ColdDestructionZone': text = '冷毁灭区'; break
        default: break
      }
      return text
    },
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
