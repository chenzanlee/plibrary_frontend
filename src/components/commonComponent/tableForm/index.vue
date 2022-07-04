<template>
  <div class="table-form">
    <el-form ref="tableForm" :model="option">
      <el-table
        :data="option.data"
        :header-cell-style="getRowClassHeader"
        :row-style="getRowClass"
        :row-class-name="tabRowClassName"
        :max-height="option.config.height"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column
          v-if="!!option.config.index"
          label="序号"
          type="index"
          width="50"
          align="center"
        />
        <template v-for="(column, key) in option.columns">
          <el-table-column
            :key="key"
            :render-header="labelHead"
            :label="column.label"
            :width="column.width"
            :min-width="column.minWidth"
            :align="column.align"
            :fixed="column.fixed"
          >
            <template slot-scope="scope">
              <el-form-item :rules="column.formOption.rules" :prop="`data.${scope.$index}.${column.formOption.prop}`">
                <cellItem :cell="column.formOption" :model="scope.row" :selects="option.selects" />
              </el-form-item>
            </template>
          </el-table-column>
        </template>
        <el-table-column
          v-if="!option.config.isAudited"
          label="操作"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <el-button type="danger" size="small" @click="delRow(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>
<script>
import cellItem from './cellItem'
export default {
  components: {
    cellItem
  },
  props: {
    option: {
      type: Object,
      required: true,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    // 表头行颜色
    getRowClassHeader({ row, rowIndwx }) {
      var styleJson = {}
      styleJson = {
        background: '#223282',
        color: '#CDD8F7',
        height: '43px'
      }
      return styleJson // 返回对象
    },
    // 普通行颜色
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
      }
    },
    // 初始列宽根据字符数计算
    labelHead: function(h, { column, $index }) {
      const l = column.label.length
      const f = 16
      column.minWidth = f * (l + 2) // 加上一个文字长度
      return h('div', { style: { fontSize: '14px', width: '100%' }}, [
        column.label
      ])
    },
    // 删除行
    delRow(rowIndex, row) {
      if (this.option.delCallback && this.option.delCallback instanceof Function) {
        this.option.delCallback(rowIndex, row)
      }
      this.option.data.splice(rowIndex, 1)
    },
    // 添加行
    addRow() {
      this.option.data.push({})
    },
    // 验证表单
    verifyTableForm() {
      let isVerity = null
      this.$refs.tableForm.validate(valid => {
        isVerity = valid
      })
      return isVerity
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/style/feedScheduling/index.scss";
.table-form {
  .btn-wrap {
    .addBtn {
      margin-top: 20px;
      background: transparent;
      width: 100%;
      border: 1px dashed #1a3166;
      color: #cdd8f7;
    }
  }
  .el-form-item{
    margin-top: 15px;
    margin-bottom: 15px;
  }
  .el-button--danger{
    @extend .feedingTime-el-button-danger;
    border:none;
  }
}
</style>
<style>
.table-form .el-form-item__error{
  width: 100% !important;
}
</style>
