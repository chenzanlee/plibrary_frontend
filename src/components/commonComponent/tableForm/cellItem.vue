<template>
  <div class="cell-item default">
    <span v-if="cell.type === 'text'">{{ model[cell.prop] }}</span>
    <el-input
      v-if="cell.type === 'input'"
      v-model="model[cell.prop]"
      :disabled="cell.disabled"
      :size="cell.size || 'small'"
      :placeholder="cell.placeholder || '请输入'"
    />
    <el-input-number
      v-if="cell.type === 'number'"
      v-model="model[cell.prop]"
      :disabled="cell.disabled"
      :size="cell.size || 'small'"
      :placeholder="cell.placeholder || '请输入'"
      :min="cell.min || -Infinity"
      :max="cell.max || Infinity"
      :step="cell.step || 1"
      :step-strictly="cell.stepStrictly || false"
      :controls-position="cell.controlsPosition || 'right'"
      :controls="cell.controls || true"
    />
    <el-select
      v-if="cell.type === 'select'"
      v-model="model[cell.prop]"
      :disabled="cell.disabled"
      :size="cell.size || 'small'"
      :placeholder="cell.placeholder || '请选择'"
      @change="handleChange"
    >
      <el-option
        v-for="(item, index) in selects[cell.list] || []"
        :key="index"
        :label="item[cell.optionProp.label]"
        :value="item[cell.optionProp.value]"
      />
    </el-select>
  </div>
</template>
<script>
export default {
  props: {
    cell: {
      type: Object,
      default: () => {
        return {}
      }
    },
    model: {
      type: Object,
      default: () => {
        return {}
      }
    },
    selects: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  mounted() {
    // (this.model)
  },
  methods: {
    handleChange(val) {
      if (!this.cell.onChange) return false
      this.cell.onChange(val, this.model)
    }
  }
}
</script>
<style lang="scss">
.cell-item{
  .el-input-number.is-controls-right{
    .el-icon-arrow-up,
    .el-icon-arrow-down {
        color: #cdd8f7;
    }
    .el-input-number__increase{
      top: 2px;
      line-height: 16px;
      border-bottom: 1px solid #1a3166;
      border-left: 1px solid #1a3166;
      background: var(--el-form-back-color);
    }
    .el-input-number__decrease{
      bottom: 2px;
      line-height: 16px;
      border-left: 1px solid #1a3166;
      background: var(--el-form-back-color);
    }
  }
}
</style>
