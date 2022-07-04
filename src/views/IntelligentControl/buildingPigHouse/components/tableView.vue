<template>
  <div class="view-table table_page buildingTable" style="width: 100%;margin-top: 10px;">
    <el-table
      ref="tables"
      style="width: 100%"
      :class="isfullScreen ? 'table-full' : ''"
      height="100%"
      :data="tableData"
      :row-style="getRowClass"
      :header-cell-style="getRowClassHeader"
      :stripe="true"
      :row-class-name="tabRowClassName"
      highlight-current-row
      :cell-style="cellStyle"
      @row-click="handleRowClick"
      @select="handleSelectionChange"
      @select-all="handleSelectAll"
    >
      <el-table-column v-if="hasCheckBox" type="selection" :selectable="handleSelectable" fixed width="55" />
      <el-table-column label="楼层" fixed width="70">
        <template slot-scope="scope">
          <span>
            {{ scope.row.floor ? floor[scope.row.floor] : "---" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="单元" fixed width="120">
        <template slot-scope="scope">
          <span :style=" scope.row.statusWarning === 1 ? 'color: #FF5656!important;' : ''">
            {{ scope.row.roomTypeName ? scope.row.roomTypeName + scope.row.unit : "---" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="舒适区" width="80">
        <template slot-scope="scope">
          <span class="zoom" :style="getStyle(scope.row.comfortZone)">
            {{ scope.row.comfortZoneName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="推荐温度">
        <template slot-scope="scope">
          <span>
            {{
              valueExist(scope.row.mostComfortTemperature) &&
                scope.row.mostComfortTemperature !== -100
                ? scope.row.mostComfortTemperature + "°C"
                : "---"
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="室内前温">
        <template slot-scope="scope">
          <span>
            {{
              valueExist(scope.row.beforeIndoorTemp) &&
                scope.row.beforeIndoorTemp !== -100
                ? scope.row.beforeIndoorTemp + "°C"
                : "---"
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="室内后温">
        <template slot-scope="scope">
          <span>
            {{
              valueExist(scope.row.afterIndoorTemp) &&
                scope.row.afterIndoorTemp !== -100
                ? scope.row.afterIndoorTemp + "°C"
                : "---"
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="室内前湿">
        <template slot-scope="scope">
          <span>
            {{
              valueExist(scope.row.beforeIndoorHumidity) &&
                scope.row.beforeIndoorHumidity !== -100
                ? scope.row.beforeIndoorHumidity + "%"
                : "---"
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="室内后湿">
        <template slot-scope="scope">
          <span>
            {{
              valueExist(scope.row.afterIndoorHumidity) &&
                scope.row.afterIndoorHumidity !== -100
                ? scope.row.afterIndoorHumidity + "%"
                : "---"
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="日龄">
        <template slot-scope="scope">
          <span>{{ scope.row.pigDays }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单猪体重">
        <template slot-scope="scope">
          <span>{{ valueExist(scope.row.weight) ? scope.row.weight + "kg" : "---" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="0级开度">
        <template slot-scope="scope">
          <span>{{ valueExist(scope.row.windowZeroOpenPercent) ? scope.row.windowZeroOpenPercent + "%" : "---" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="4级开度">
        <template slot-scope="scope">
          <span>{{ valueExist(scope.row.windowFourOpenPercent) ? scope.row.windowFourOpenPercent + "%" : "---" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="1级风">
        <template slot-scope="scope">
          <span>{{ valueExist(scope.row.windowOneSpeed) ? scope.row.windowOneSpeed + "m/s" : "---" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="2级风">
        <template slot-scope="scope">
          <span>{{ valueExist(scope.row.windowTwoSpeed) ? scope.row.windowTwoSpeed + "m/s" : "---" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="4级风">
        <template slot-scope="scope">
          <span>{{ valueExist(scope.row.windowFourSpeed) ? scope.row.windowFourSpeed + "m/s" : "---" }}</span>
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
              v-if="scope.row.isAlarmSuspend === 1"
              class="icon-item"
              icon-class="stop-alarm"
            />
            <svg-icon
              v-if="scope.row.isEmptyUnit === 1"
              class="icon-item"
              icon-class="empty-ico"
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
    },
    checkedObj: {
      type: Object,
      default: () => {
        const data = this.$props.tableData
        const obj = {}
        data.forEach(item => {
          obj[item.deviceId] = false
        })
        return obj
      }
    },
    hasCheckBox: {
      type: Boolean,
      default: false
    },
    // checkChange: Function,
    handleDetail: Function
  },
  data() {
    return {
      floor: {
        'FLOOR_ONE': '1楼',
        'FLOOR_TWO': '2楼',
        'FLOOR_THREE': '3楼',
        'FLOOR_FOUR': '4楼',
        'FLOOR_FIVE': '5楼',
        'FLOOR_SIX': '6楼'
      },
      multipleSelection: []
    }
  },
  watch: {
    tableData: function(newVal, oldVal) {
      console.log(newVal)
      const that = this
      const { checkedObj, tableData } = this.$props
      console.log(checkedObj)
      setTimeout(() => {
        tableData.forEach((item) => {
          if (checkedObj[item.deviceId]) {
            that.$refs.tables.toggleRowSelection(item, true)
          } else {
            that.$refs.tables.toggleRowSelection(item, false)
          }
        })
      }, 0)
    }
  },
  beforeUpdate() {
    return false
  },
  mounted() {
    const that = this
    const { checkedObj, tableData } = this.$props
    tableData.forEach((item) => {
      if (checkedObj[item.deviceId]) {
        that.$refs.tables.toggleRowSelection(item, true)
      } else {
        that.$refs.tables.toggleRowSelection(item, false)
      }
    })
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
    handleEmit(val) {
      this.$emit('checkChange', val)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.handleEmit(val)
    },
    handleSelectable(row, index) {
      if (row.statusOnline === 1) {
        return true
      } else {
        return false
      }
    },
    handleSelect(selection, row) {
      // const { checkedObj } = this.$props
      // if (selection.length > 0) {
      //   for (const key in checkedObj) {
      //     const index = selection.map((item) => { return item.deviceId }).indexOf(key)
      //     if (index !== -1) {
      //       // this.$refs.tables.toggleRowSelection(tableData.filter((item) => { return item.deviceId === key })[0], true)
      //       // this.$emit('checkTableChange', key, true)
      //     } else {
      //       // this.$refs.tables.toggleRowSelection(tableData.filter((item) => { return item.deviceId === key })[0], false)
      //       // this.$emit('checkTableChange', key, false)
      //     }
      //   }
      // } else {
      //   this.$emit('checkTableAllChange', false)
      // }
    },
    handleSelectAll(rows) {
      if (rows.length > 0) {
        this.$emit('checkTableAllChange', true)
      } else {
        this.$emit('checkTableAllChange', false)
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
    handleRowClick(row, event, cloumn) {
      const { handleDetail } = this.$props
      handleDetail(row)
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
      return row.unitId
    }
  }
}
</script>

<style lang="scss">
.el-table .default-row {
  // background: transparent !important;
  background: #0b1b4b !important ;
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
.buildingTable .el-table {
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
.buildingTable .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar {
  width: 0px!important;/* 滚动条宽度， width：对应竖滚动条的宽度  height：对应横滚动条的高度*/
  height: 7px!important;
  border-radius: 2px!important;
  // background-color: transparent!important;
  display: inline-block!important;
  cursor: pointer!important;
}
.buildingTable .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-thumb {
  border-radius: 2px!important;
  height: 100%!important;
  // background-color: rgb(34, 50, 130)!important;
  outline: none!important;
  border:none!important;
  cursor: pointer!important;
  display: inline-block!important;
}
.buildingTable .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-thumb:hover {
  background-color: #227fe6!important;
}
.buildingTable .el-table__fixed-right-patch{
  width:10px!important;
  height:48px!important;
  background-color: #223282!important;
  border-bottom:1px solid #223282!important;
}
</style>
