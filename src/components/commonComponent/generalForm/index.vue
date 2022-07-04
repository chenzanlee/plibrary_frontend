<template>
  <el-form
    ref="generalForm"
    class="general-form"
    :class="[themeType, className]"
    :model="data"
    :rules="rules"
    :label-width="labelWidth"
    :label-position="labelPosition"
    :validate-on-rule-change="validatchange"
  >
    <el-row :gutter="gutter">
      <el-col v-for="(item, index) in getConfigList()" :key="item.key + index" :span="item.span">
        <el-form-item
          :label-width="item.labelWidth"
          :prop="item.key"
          :label="item.label"
          :class="item.className"
          :rules="item.rules"
          :style="{ width: item.width, height: item.height, color: item.color }"
        >
          <!-- solt -->
          <template v-if="item.type === 'slot'">
            <!-- 1111 {{item.key}} -->
            <slot :name="`form-${item.key}`" />
          </template>
          <!-- 普通输入框 -->
          <el-input
            v-if="item.type === 'input' || item.type === 'password'"
            v-model="data[item.key]"
            :type="item.type"
            :disabled="item.disabled"
            :placeholder="getPlaceholder(item)"
            :readonly="item.readonly"
            debounce="200"
            @blur="handleBlur(item)"
            @focus="handleEvent(item.event)"
            @input="handleChange(item)"
          >
            <template v-if="item.append" slot="append">
              <RenderDom :key="index" :row="data[item.key]" :render="item.append" />
            </template>
          </el-input>
          <!-- 计数器 -->
          <el-input-number
            v-if="item.type === 'number'"
            v-model="data[item.key]"
            :disabled="item.disabled"
            :controls-position="item.position"
            :min="item.min"
            :max="item.max"
            :placeholder="getPlaceholder(item)"
            @focus="handleEvent(item.event)"
            @change="handleEvent(item.event)"
          />
          <!-- number输入框 -->
          <el-input
            v-if="item.type === 'float'"
            v-model="data[item.key]"
            :type="item.type"
            :disabled="item.disabled"
            :placeholder="item.placeholder || getPlaceholder(item)"
            @focus="handleEvent(item.event)"
            @input="checkNumber(item.key)"
          />
          <!-- 文本输入框 -->
          <el-input
            v-if="item.type === 'textarea'"
            v-model.trim="data[item.key]"
            :resize="item.resize"
            :show-word-limit="item.showWordLimit"
            :maxlength="item.maxlength"
            :type="item.type"
            :disabled="item.disabled"
            :placeholder="getPlaceholder(item)"
            :autosize="item.autosize || { minRows: 2, maxRows: 10 }"
            @focus="handleEvent(item.event)"
          />
          <!-- 计数器 -->
          <el-input-number
            v-if="item.type === 'inputNumber'"
            v-model="data[item.key]"
            :placeholder="getPlaceholder(item)"
            :precision="item.precision"
            :step="item.step"
            :size="item.size"
            :controls-position="item.controlsPositionRight"
            :disabled="item.disabled"
            :min="item.min"
            :max="item.max"
            :class="{flatSpace: !!item.flatSpace}"
            @change="handleEvent(item.event)"
          />
          <!-- 添加了 select 的 collapse-tags属性， 2020-12-10 -->
          <!-- 选择框 -->
          <el-select
            v-if="item.type === 'select'"
            :ref="item.key"
            v-model="data[item.key]"
            :disabled="item.disabled"
            :clearable="item.clearable"
            :filterable="item.filterable"
            :filter-method="item.filter"
            :remote="item.remote"
            :remote-method="item.remoteMethod"
            :loading="item.loading"
            :placeholder="item.placeholder || getPlaceholder(item)"
            :value-key="item.valueKey"
            :multiple="item.multiple"
            :collapse-tags="item.collapse"
            :props="item.props"
            @change="selectEvent(item)"
            @focus="focusEvent(item)"
            @click.native="clickEvent(item)"
          >
            <el-option
              v-for="(childItem,i) in listTypeInfo[item.list]"
              :key="item.hasOwnProperty('props')?childItem[item.props.value]:i"
              :label="
                item.hasOwnProperty('props')
                  ? childItem[item.props.label]
                  : childItem[Object.keys(childItem)[0]]
              "
              :value="
                item.hasOwnProperty('props')
                  ? childItem[item.props.value]
                  : childItem[Object.keys(childItem)[1]]
              "
            />
          </el-select>
          <!-- 选择框 -->
          <el-select
            v-if="item.type === 'selectDiy'"
            v-model="data[item.key]"
            :disabled="item.disabled"
            :clearable="item.clearable"
            :filterable="item.filterable"
            :filter-method="item.filter"
            :remote="item.remote"
            :remote-method="item.remoteMethod"
            :loading="item.loading"
            :props="item.props"
            :placeholder="getPlaceholder(item)"
            @change="handleEvent(item.event, data[item.key])"
          >
            <el-option
              v-for="(childItem, childIndex) in listTypeInfo[item.list]"
              :key="childIndex"
              :label="childItem[item.props.label]"
              :value="childItem[item.props.value]"
            />
          </el-select>
          <!-- 日期选择框 -->
          <el-date-picker
            v-if="item.type === 'date'"
            v-model="data[item.key]"
            :type="item.dateType"
            :picker-options="item.TimePickerOptions"
            :clearable="item.clearable"
            :disabled="item.disabled"
            :placeholder="getPlaceholder(item)"
            :format="item.format"
            :value-format="item.valueFormat"
            @focus="handleEvent(item.event)"
            @change="timerChange(item,data[item.key])"
          />
          <!-- 时间选择框 -->
          <!-- 该组件有官方bug  -->
          <!-- <el-time-picker
            v-if="item.type === 'time'"
            v-model="data[item.key]"
            class="showbox slot_el-time_piker"
            :disabled="item.disabled"
            :is-range="item.isRange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
          /> -->
          <el-time-picker
            v-if="item.type === 'timeSingle'"
            v-model="data[item.key]"
            class="showbox slot_el-time_piker"
            :disabled="item.disabled"
            :format="item.format || 'HH:mm:ss'"
            :value-format="item.format || 'HH:mm:ss'"
            placeholder="请选择时间"
          />
          <el-time-picker
            v-if="item.type === 'time'"
            v-model="data[item.key]"
            value-format="'HH:mm:ss'"
            placeholder="请选择时间"
            :clearable="item.clearable"
            :disabled="item.disabled"
          />

          <!-- <el-time-picker
            v-if="item.type === 'timeSingle' || 'time'"
            v-model="data[item.key]"
            class="showbox slot_el-time_piker"
            :disabled="item.disabled"
            :format="item.format || 'HH:mm:ss'"
            :value-format="item.format || 'HH:mm:ss'"
            placeholder="请选择时间"
            :clearable="item.clearable"
          /> -->
          <div v-if="item.type === 'timeDiy'" class="slot_el-time_piker_containner">
            <el-time-picker
              v-model="timeOne"
              class="showbox slot_el-time_piker"
              :disabled="item.disabled"
              :is-range="item.isRange"
              placeholder="请选择开始时间"
              value-format="HH:mm:ss"
              :picker-options="{
                selectableRange: selectableRange0
              }"
              @change="selectOne"
            />
            <span class="zhi">-</span>
            <el-time-picker
              v-model="timeTwo"
              class="showbox slot_el-time_piker"
              :disabled="item.disabled"
              :is-range="item.isRange"
              placeholder="请选择结束时间"
              value-format="HH:mm:ss"
              :picker-options="{
                selectableRange: selectableRange1
              }"
              @change="selectTwo"
            />
            <!-- 这里处理一下 -->
            <el-time-picker
              v-model="data[item.key]"
              style="display:none;"
            />
          </div>
          <!-- Checkbox  多选框 -->
          <el-checkbox-group
            v-if="item.type === 'checkbox'"
            v-model="data[item.key]"
          >
            <el-checkbox
              v-for="(childItem, childIndex) in item.list"
              :key="childIndex"
              :disabled="childItem.disabled"
              :label="item.customVal ? childItem[item.customVal] : childItem"
            >
              {{ item.customLabel ? childItem[item.customLabel] : childItem }}
            </el-checkbox>
          </el-checkbox-group>
          <!-- radio选择器 -->
          <el-radio-group v-if="item.type === 'radio'" v-model="data[item.key]" :disabled="item.disabled" @change="radioChange(item)">
            <el-radio
              v-for="(j, k) in item.optList"
              :key="k"
              :label="item.customVal ? j[item.customVal] : j"
            >{{ item.customLabel ? j[item.customLabel] : j }}</el-radio>
          </el-radio-group>
          <!-- 级联选择器 -->
          <el-cascader
            v-if="item.type == 'cascader'"
            ref="cascader"
            v-model="data[item.key]"
            clearable
            :disabled="item.disabled"
            :options="item.options"
            :props="{
              checkStrictly: item.checkStrictly,
              expandTrigger: 'hover',
              label: item.customLabel ? item.customLabel : 'label',
              value: item.customValue ? item.customValue : 'value',
              children: item.children ? item.children : 'children'

            }"
            class="shadow"
            filterable
            :placeholder="item.placeholder"
            :style="{ width: item.width || '100%' }"
            @change="cascaderEvent(item)"
          >
            <!-- <template slot-scope="{ data }"> -->
            <!-- <span v-if="!node.isLeaf">{{ data.label }}</span> -->
            <!-- <span>{{ data.title }}</span> -->
            <!-- </template> -->
          </el-cascader>
          <!-- 自定义级联选择器 -->
          <el-cascader
            v-if="item.type == 'cascaderDiy'"
            ref="cascader"
            v-model="data[item.key]"
            clearable
            :disabled="item.disabled"
            :props="item.props"
            class="shadow"
            filterable
            :popper-class="item.props.checkStrictly ? item.popperClass : ''"
            :placeholder="item.placeholder"
            :style="{ width: item.width || '100%' }"
            @change="cascaderEventDiy"
            @expand-change="expandChange"
            @visible-change="visibleChange"
          />
          <!-- 自定义级联选择器(巡检群机器人配置) -->
          <el-cascader
            v-if="item.type == 'cascaderDiy2'"
            ref="cascader"
            v-model="data[item.key]"
            clearable
            :disabled="item.disabled"
            :multiple="item.multiple"
            :options="item.options"
            :props="{
              checkStrictly: item.checkStrictly,
              expandTrigger: 'hover',
              label: item.customLabel ? item.customLabel : 'label',
              value: item.customValue ? item.customValue : 'value',
              children: item.children ? item.children : 'children'

            }"
            class="shadow"
            filterable
            :placeholder="item.placeholder"
            :style="{ width: item.width || '100%' }"
            @change="cascaderEvent(item)"
          />
          <!-- 按钮 -->
          <el-button
            v-if="item.type == 'button'"
            :key="index"
            :style="item.style"
            :class="item.className"
            :disabled="item.disabled"
            @click.stop.prevent="item.handleClick"
          >
            {{ item.name }}
          </el-button>
          <template v-else-if="item.render">
            <RenderDom :key="index" :row="data[item.key]" :render="item.render" />
          </template>
        </el-form-item>
      </el-col>
    </el-row>
    <template v-if="formType === 'slot'">
      <slot name="form" />
    </template>
  </el-form>
</template>

<script>
import { collection } from '@/common/utils/array'
export default {
  name: 'GeneralForm',
  components: {
    RenderDom: {
      name: 'RenderDom',
      functional: true,
      props: {
        row: String,
        render: Function,
        key: String
      },
      render: (h, data) => {
        const params = {
          row: data.props.row,
          key: data.props.key
        }
        return data.props.render(h, params)
      }
    }
  },
  props: {
    // 表单主题
    themeType: {
      type: String,
      default: 'default'
    },
    formType: {
      type: String,
      default: 'default'
    },
    // 自定义类名
    className: {
      type: String,
      default: ''
    },
    // 表单数据
    data: {
      type: Object,
      default: () => {}
    },
    // 相关字段信息
    fieldList: {
      type: Array,
      default: () => []
    },
    // 验证规则
    rules: {
      type: Object,
      default: () => {}
    },
    // 相关的列表
    listTypeInfo: {
      type: Object,
      default: function() {
        return {}
      }
    },
    // label宽度
    labelWidth: {
      type: String,
      default: '120px'
    },
    labelPosition: {
      type: String,
      default: 'right'
    },
    validatchange: {
      type: Boolean,
      default: true
    },
    refObj: {
      type: Object,
      default: () => {}
    },
    gutter: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      timeOne: '', // 时间范围下选择的开始时间
      timeTwo: '', // 时间范围------的结束时间
      selectableRange0: '00:00:00 - 23:59:59', // timeOne 开始时间范围
      selectableRange1: '00:00:00 - 23:59:59' // timeTwo 结束时间范围
    }
  },
  computed: {
    timeKey() {
      const o = this.fieldList.find(item => item.type === 'timeDiy')
      if (o) return o.key
      return null
    }
  },
  watch: {
    // 这里 清一下级联的 选中状态
    'data.area': {
      handler(arr) {
        const curArr = Array.isArray(arr) ? arr : [] // 有些默认不是数组
        try {
          if (curArr.length === 0) {
            this.$refs && this.$refs['cascader'] && this.$refs['cascader'][0].$refs.panel.clearCheckedNodes()
          }
          if (this.$refs && this.$refs['cascader']) {
            this.$refs['cascader'][0].$refs.panel.clearCheckedNodes()
            this.$refs['cascader'][0].$refs.panel.activePath = []
          }
        } catch (err) {
          console.error('cascader--DOM未渲染-正常错误')
        }
      },
      deep: true
    },
    timeOne(val) {
      if (this.timeKey && val && this.timeTwo) {
        this.data[this.timeKey] = [val, this.timeTwo]
      } else if (this.timeKey && (!val || !this.timeTwo)) {
        this.data[this.timeKey] = []
      }
    },
    timeTwo(val) {
      if (this.timeKey && val && this.timeOne) {
        this.data[this.timeKey] = [this.timeOne, val]
      } else if (this.timeKey && (!val || !this.timeOne)) {
        this.data[this.timeKey] = []
      }
    }
  },

  methods: {
    // 下拉框出现/隐藏时触发 只在cascaderDiy 有调用
    visibleChange(flag) {
      const _this = this
      const liDoms = document.querySelectorAll('.popperClass-radio-normal .el-cascader-menu .el-cascader-node')
      liDoms.forEach(element => {
        const checkDom = element.firstChild
        const textDom = element.lastChild
        function addClick() {
          const node = _this.$refs['cascader'][0].getCheckedNodes()[0]
          if (node && node.isLeaf) { // 最后一级了
            _this.$refs['cascader'][0].dropDownVisible = false
          }
          textDom.click()
          checkDom.click()
        }
        if (flag) { // 添加监听
          element.addEventListener('click', addClick, false)
        } else { // 移除监听
          element.removeEventListener('click', addClick, false)
        }
      })
    },
    // 当展开节点发生变化时触发 只在cascaderDiy 有调用
    expandChange(arr) { // 该回调在最后一级不会触发
      setTimeout(() => { this.visibleChange(true) }, 300)
    },
    // 这个 只在cascaderDiy 有调用
    cascaderEventDiy(event) {
      if (event.handleChange) {
        event.handleChange(this.data[event.key])
      } else {
        const cascader = this.$refs['cascader'][0].getCheckedNodes()[0]
        if (cascader) {
          this.$emit(
            'cascaderEvent',
            cascader.path,
            cascader.pathLabels,
            cascader.pathNodes
          )
        }
      }
      const children = this.$refs['cascader'][0].getCheckedNodes()
      if (children.length > 0 && children[0].children.length < 1) { // 判断有没有下级
        this.$refs['cascader'][0].dropDownVisible = false // 监听值发生变化就关闭它
      }
    },
    timerChange(item, v) {
      if (item.handleChange) {
        item.handleChange(v)
      }
      return
    },
    selectOne(time) {
      this.selectableRange1 = time + this.selectableRange1.slice(8)
    },
    selectTwo(time) {
      this.selectableRange0 = this.selectableRange0.slice(0, 11) + time
    },
    checkNumber(val) {
      if (this.data[val].match(/\d+(\.\d{0,2})?/)) {
        this.data[val] = this.data[val].match(/\d+(\.\d{0,3})?/)[0] || null
      } else {
        this.data[val] = null
      }
    },
    // 获取字段列表
    getConfigList() {
      return this.fieldList.filter(
        (item) =>
          // eslint-disable-next-line no-prototype-builtins
          !item.hasOwnProperty('show') ||
          // eslint-disable-next-line no-prototype-builtins
          (item.hasOwnProperty('show') && item.show)
      )
    },
    // 得到placeholder的显示
    getPlaceholder(row) {
      let placeholder
      if (row.type === 'input' || row.type === 'textarea') {
        if (row.placeholder) {
          placeholder = row.placeholder
        } else {
          placeholder = '请输入' + row.label
        }
      } else if (
        row.type === 'select' ||
        row.type === 'time' ||
        row.type === 'date'
      ) {
        if (row.placeholder) {
          placeholder = row.placeholder
        } else {
          placeholder = '请选择' + row.label
        }
      } else {
        placeholder = row.label
      }
      return placeholder
    },
    // 重置form
    resetFields() {
      // this.$refs.cascader.forEach((item) => {
      // })
      this.$refs['generalForm'].resetFields()
    },
    // 验证form
    validateSelf() {
      let bool = null
      this.$refs['generalForm'].validate((valid) => {
        if (valid) {
          bool = true
        } else {
          bool = false
          return false
        }
      })
      return bool
    },
    radioChange(evnet) {
      if (evnet && evnet.handleChange && evnet.handleChange instanceof Function) {
        evnet.handleChange(this.data[evnet.key])
      }
    },
    // 绑定的相关事件
    handleEvent(evnet) {
      if (evnet === 'cascader') {
        const cascader = this.$refs['cascader'][0].getCheckedNodes()[0]
        this.$emit(
          'handleEvent',
          cascader.path,
          cascader.pathLabels,
          cascader.pathNodes
        )
      } else {
        this.$emit('handleEvent', evnet)
      }
    },
    handleChange(evnet, item, nowValue) {
      this.$emit('handleChange', evnet, item, this.data[evnet.key], evnet.key)
    },
    handleBlur(evnet, item, nowValue) {
      this.$emit('handleBlur', evnet, item, this.data[evnet.key], evnet.key)
    },
    cascaderEvent(event) {
      if (event.handleChange) {
        event.handleChange(this.data[event.key])
      } else {
        this.$nextTick(() => {
          const cascader = this.$refs['cascader'][0].getCheckedNodes()[0]
          if (cascader) {
            this.$emit(
              'cascaderEvent',
              cascader.path,
              cascader.pathLabels,
              cascader.pathNodes,
              cascader.level,
              cascader.value,
              cascader.data
            )
          } else {
            this.$emit(
              'cascaderEvent',
              [],
              [],
              [],
              [],
              [],
              []
            )
          }
        })
      }
    },
    focusEvent(event) {
      if (event.focusEvent) {
        event.focusEvent()
      }
    },
    clickEvent(item) {
      if (item.clickEvent) {
        item.clickEvent()
      }
    },
    selectEvent(event) {
      const selectArr = this.listTypeInfo && this.listTypeInfo[event.list]
        ? this.listTypeInfo[event.list]
        : event.list
      const selectItem = collection(
        selectArr,
        this.data[event.key],
        this.$refs[event.key][0].valueKey
      )
      if (event.handleChange) {
        event.handleChange(selectItem, this.data[event.key])
      }
    },
    // 派发按钮点击事件
    handleClick(event, data) {
      this.$emit('handleClick', event, data)
    }
  }
}
</script>

<style lang="scss">
.general-form{
  .el-select {
    width: 100%;
  }
  .el-textarea.is-disabled .el-textarea__inner{
    background-color: #1d2c4c;
    border: 1px solid #1d2c4c;
    color: #adadad;
  }
  .el-input-number {
    width: 100%;
    line-height: 36px;
  }
  .el-input-number.flatSpace{
    width: 100%;
    .el-input__inner{
      text-align: left;
    }
  }
  .slot_el-time_piker_containner {
    display: flex;
    justify-content: space-around;
    align-items: center;
    span.zhi{padding: 0 5px;}
    .slot_el-time_piker{
      flex:1;
      display: inline-block;
      &.is-disabled{
        background-color: transparent;
        border: 1px solid transparent;
        color: #adadad;
        input{
          background-color: #1d2c4c;
          color: #adadad;
          cursor: not-allowed;
        }
      }
  }
  }
  .el-input-number.is-disabled.is-controls-right{
    .el-input-number__decrease,.el-input-number__increase{
      background-color: #1d2c4c;
      border: 1px solid #1d2c4c;
      color: #adadad;
    }
  }
  .el-select .el-input.is-disabled .el-input__inner,.el-select .el-input .el-input__inner{
    height: 36px!important;
  }
}
</style>
<style scoped>
 .general-form .is-disabled >>> .el-icon-arrow-down, .general-form .is-disabled >>> .el-icon-arrow-up{
  color:#1d2c4c;
 }
 /* .general-form .is-disabled >>> .el-input__inner{
   height: 36px!important;
 } */
</style>
