<template>
  <el-form
    ref="navForm"
    class="nav-form"
    :class="[themeType, className]"
    label-position="left"
    :model="data"
    :rules="rules"
    :label-width="labelWidth"
  >
    <div style="display: flex;">

      <div>
        <div class="logManagement" style="display: flex;flex-wrap: wrap;">
          <el-form-item
            v-for="(item, index) in fieldList.hasOwnProperty('left') && Object.keys(fieldList.left).length ? getConfigList('left') : []"
            :key="JSON.stringify(item)"
            :prop="item.key"
            :label="item.label"
            :class="item.className"
            style="margin-bottom: 10px;"
            :style="{ width: item.width, height: item.height }"
          >
            <!-- solt -->
            <template v-if="item.type === 'slot'">
              <slot :name="'form-' + item.key" />
            </template>
            <!-- 普通输入框 -->
            <el-input
              v-if="item.type === 'input' || item.type === 'password'"
              v-model="data[item.key]"
              :type="item.type"
              :disabled="item.disabled"
              :clearable="item.clearable"
              :placeholder="item.placeholder || getPlaceholder(item)"
              @focus="handleEvent(item.event)"
              @keyup.enter.native="enterHandler"
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
              @keyup.enter.native="enterHandler"
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
              @keyup.enter.native="enterHandler"
            />
            <!-- 计数器 -->
            <el-input-number
              v-if="item.type === 'inputNumber'"
              v-model="data[item.key]"
              size="small"
              :min="item.min"
              :max="item.max"
              @change="handleEvent(item.event)"
              @keyup.enter.native="enterHandler"
            />
            <!-- 选择框  multiple-limit 最做选择几个 默认不限制 -->
            <el-select
              v-if="item.type === 'select'"
              :ref="item.key"
              v-model="data[item.key]"
              :disabled="item.disabled"
              :clearable="item.clearable"
              :multiple-limit="item.multipleLimit ? item.multipleLimit : 0"
              :collapse-tags="item.collapseTags"
              :filterable="item.filterable"
              :style="{width: item.width}"
              :multiple="item.multiple"
              :placeholder="
                item.placeholder ? item.placeholder : getPlaceholder(item)
              "
              @focus="focusEvent(item)"
              @blur="blurEvent(item)"
              @change="selectEvent(item)"
              @keyup.enter.native="enterHandler"
            >
              <el-option
                v-for="(childItem, childIndex) in Array.isArray(item.list)
                  ? item.list
                  : listTypeInfo[item.list]"
                :key="childIndex"
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
            <!-- 日期选择框 -->
            <el-date-picker
              v-if="item.type === 'date'"
              v-model="data[item.key]"
              :type="item.dateType"
              :picker-options="item.TimePickerOptions || {}"
              :clearable="item.clearable"
              :disabled="item.disabled"
              :range-separator="item.rangeSeparator"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              :start-placeholder="item.startPlaceholder"
              :end-placeholder="item.endPlaceholder"
              :placeholder="item.placeholder || getPlaceholder(item)"
              @focus="handleEvent(item.event)"
              @change="dateChange"
              @keyup.enter.native="enterHandler"
            />
            <!-- 月份选择框 -->
            <el-date-picker
              v-if="item.type === 'month'"
              v-model="data[item.key]"
              :type="item.dateType"
              :clearable="item.clearable"
              :disabled="item.disabled"
              value-format="yyyy-MM"
              :placeholder="item.placeholder"
              @focus="handleEvent(item.event)"
              @change="dateChange"
              @keyup.enter.native="enterHandler"
            />
            <!-- 日期时间选择框 -->
            <el-date-picker
              v-if="item.type === 'dateTime'"
              v-model="data[item.key]"
              :type="item.dateType"
              :picker-options="item.TimePickerOptions || {}"
              :clearable="item.clearable"
              :disabled="item.disabled"
              :range-separator="item.rangeSeparator"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-value="item.defaultValue"
              :start-placeholder="item.startPlaceholder"
              :end-placeholder="item.endPlaceholder"
              :placeholder="getPlaceholder(item)"
              @focus="handleEvent(item.event)"
              @change="dateTimeChange"
              @keyup.enter.native="enterHandler"
            />
            <!-- radio选择器 -->
            <!-- <el-radio-group v-if="item.type === 'radio'" v-model="data[item.key]" @keyup.enter.native="enterHandler">
              <el-radio
                v-for="(j, k) in item.optList"
                :key="k"
                :label="item.customVal ? j[item.customVal] : j"
              >{{ item.customLabel ? j[item.customLabel] : '' }}</el-radio>
            </el-radio-group> -->
            <!-- 级联选择器 -->
            <el-cascader
              v-if="item.type == 'cascader'"
              ref="cascader"
              v-model="data[item.key]"
              :clearable="item.clearable"
              :options="item.options"
              :props="{
                checkStrictly:item.checkStrictly,
                expandTrigger: 'click',
                label: item.customLabel ? item.customLabel : 'label',
                value: item.customValue ? item.customValue : 'value',
              }"
              :class="item.checkStrictly || item.width?'shadow addwidth':'shadow '"
              filterable
              :placeholder="item.placeholder"
              :style="{ width: item.width || '300px' }"
              @change="cascaderEvent(item)"
              @keyup.enter.native="enterHandler"
            >
            <!-- <template slot-scope="{ data }"> -->
            <!-- {{JSON.stringify(node)}} -->
            <!-- {{data}} -->
            <!-- <span>{{ data.title }}</span> -->
            <!-- <span @click="item.handleChange">{{ item.customLabel ? data[item.customLabel] :  data.label }}</span> -->
            <!-- </template> -->
            </el-cascader>
            <!-- 自定义级联选择器 可用于懒加载区域数据-->
            <!-- @expand-change="expandChange"
            @visible-change="visibleChange" -->
            <el-cascader
              v-if="item.type == 'cascaderDiy'"
              ref="cascader"
              v-model="data[item.key]"
              class="cascaderDiy"
              clearable
              :disabled="item.disabled"
              :props="item.props"
              :class="item.checkStrictly || item.width ?'shadow addwidth':'shadow'"
              filterable
              :placeholder="item.placeholder"
              :popper-class="item.props.checkStrictly ? item.popperClass : ''"
              @change="cascaderEventDiy(item)"
              @expand-change="expandChange"
              @visible-change="visibleChange"
              @keyup.enter.native="enterHandler"
            />
            <!-- 按钮 -->
            <el-button
              v-if="item.type == 'button'"
              :key="index"
              v-hasAuth="item.authCode"
              :loading="item.isLoading"
              :disabled="item.isDisabled"
              :class="item.className"
              class="nav-form-btn"
              @click.stop.prevent="item.handleClick"
            >
              {{ item.innerText }}
            </el-button>
          </el-form-item>
          <div
            v-if="
              fieldList.hasOwnProperty('left') &&
                fieldList['left'].hasOwnProperty('btnLists')
            "
            class="btn-group flex"
            style="flex-wrap: nowrap;"
          >
            <el-button
              v-for="(item) in fieldList['left'].btnLists"
              :key="JSON.stringify(item)"
              v-hasAuth="item.authCode"
              :loading="item.isLoading"
              :disabled="item.isDisabled"
              :class="item.className"
              @click.stop.prevent="item.handleClick"
            >
              {{ item.innerText }}
            </el-button>
          </div>
          <!-- solt -->
          <template>
            <slot name="left" />
          </template>

          <el-form-item
            v-for="(item, index) in fieldList.hasOwnProperty('right') && Object.keys(fieldList.right).length ? getConfigList('right') : []"
            :key="index"
            :prop="item.key"
            :label="item.label"
            :class="item.className"
            style="margin-bottom: 10px;"
            :style="{ width: item.type === 'cascader' ? item.width || '300px' : item.width, height: item.height }"
          >
            <!-- solt -->
            <template v-if="item.type === 'slot'">
              <slot :name="'form-' + item.key" />
            </template>
            <!-- 普通输入框 -->
            <el-input
              v-if="item.type === 'input' || item.type === 'password'"
              v-model="data[item.key]"
              :type="item.type"
              :clearable="item.clearable"
              :disabled="item.disabled"
              :placeholder="item.placeholder || getPlaceholder(item)"
              @focus="handleEvent(item.event)"
              @keyup.enter.native="enterHandler"
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
              @keyup.enter.native="enterHandler"
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
              @keyup.enter.native="enterHandler"
            />
            <!-- 计数器 -->
            <el-input-number
              v-if="item.type === 'inputNumber'"
              v-model="data[item.key]"
              size="small"
              :precision="item.precision"
              :step="item.step"
              :controls-position="item.controlsPositionRight"
              :disabled="item.disabled"
              :min="item.min"
              :max="item.max"
              :placeholder="item.placeholder"
              :class="{flatSpace: !!item.flatSpace}"
              @change="handleEvent(item.event)"
              @keyup.enter.native="enterHandler"
            />
            <template v-if="item.type === 'inputNumberTwo'">
              <el-input-number
                v-model="data[item.left.key]"
                size="small"
                :precision="item.left.precision"
                :step="item.left.step"
                :controls-position="item.left.controlsPositionRight"
                :disabled="item.left.disabled"
                :min="item.left.min"
                :max="item.left.max"
                :placeholder="item.left.placeholder"
                :class="{flatSpace: !!item.left.flatSpace}"
                @change="handleEvent(item.left.event)"
                @keyup.enter.native="enterHandler"
              />{{ item.concat||'-' }}<el-input-number
                v-model="data[item.right.key]"
                size="small"
                :precision="item.right.precision"
                :step="item.right.step"
                :controls-position="item.right.controlsPositionRight"
                :disabled="item.right.disabled"
                :min="item.right.min"
                :max="item.right.max"
                :placeholder="item.right.placeholder"
                :class="{flatSpace: !!item.right.flatSpace}"
                @change="handleEvent(item.right.event)"
                @keyup.enter.native="enterHandler"
              />
            </template>
            <!-- 选择框 -->
            <el-select
              v-if="item.type === 'select'"
              :ref="item.key"
              v-model="data[item.key]"
              :disabled="item.disabled"
              :clearable="item.clearable"
              :filterable="item.filterable"
              :collapse-tags="item.collapseTags"
              :style="{width: item.width}"
              :placeholder="
                item.placeholder ? item.placeholder : getPlaceholder(item)
              "
              :multiple="item.multiple"
              :value-key="item.valueKey"
              @focus="focusEvent(item)"
              @blur="blurEvent(item)"
              @change="selectEvent(item)"
              @keyup.enter.native="enterHandler"
            >
              <el-option
                v-for="(childItem, childIndex) in Array.isArray(item.list)
                  ? item.list
                  : listTypeInfo[item.list]"
                :key="childIndex"
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
            <!-- 日期选择框 -->
            <el-date-picker
              v-if="item.type === 'date'"
              v-model="data[item.key]"
              :type="item.dateType"
              :picker-options="item.TimePickerOptions || {}"
              :clearable="item.clearable"
              :disabled="item.disabled"
              value-format="yyyy-MM-dd"
              :range-separator="item.rangeSeparator"
              :start-placeholder="item.startPlaceholder"
              :end-placeholder="item.endPlaceholder"
              :placeholder="item.placeholder ? item.placeholder : getPlaceholder(item)"
              :style="{ width: item.width }"
              @change="dateChange"
            />
            <!-- 月份选择框 -->
            <el-date-picker
              v-if="item.type === 'month'"
              v-model="data[item.key]"
              :type="item.dateType"
              :clearable="item.clearable"
              :disabled="item.disabled"
              value-format="yyyy-MM"
              :placeholder="item.placeholder"
              @focus="handleEvent(item.event)"
              @change="dateChange"
              @keyup.enter.native="enterHandler"
            />
            <!-- 日期时间选择框 -->
            <el-date-picker
              v-if="item.type === 'dateTime'"
              v-model="data[item.key]"
              :type="item.dateType"
              :picker-options="item.TimePickerOptions || {}"
              :clearable="item.clearable"
              :disabled="item.disabled"
              :range-separator="item.rangeSeparator"
              value-format="yyyy-MM-dd HH:mm:ss"
              :start-placeholder="item.startPlaceholder"
              :end-placeholder="item.endPlaceholder"
              :placeholder="getPlaceholder(item)"
              :style="{ width: item.width }"
              @focus="handleEvent(item.event)"
              @change="dateTimeChange"
              @keyup.enter.native="enterHandler"
            />
            <!-- radio选择器 -->
            <el-radio-group v-if="item.type === 'radio'" v-model="data[item.key]" @keyup.enter.native="enterHandler" @change="radioChange(item)">
              <el-radio
                v-for="(j, k) in item.optList"
                :key="k"
                :label="item.customVal ? j[item.customVal] : j"
              >{{ item.customLabel ? j[item.customLabel] : '' }}</el-radio>
            </el-radio-group>
            <!-- 级联选择器 -->
            <el-cascader
              v-if="item.type == 'cascader'"
              ref="cascader"
              :key="item.valueKey"
              v-model="data[item.key]"
              :clearable="item.clearable"
              :options="item.options"
              :props="{
                checkStrictly:item.checkStrictly,
                children:item.children ? item.children : 'children',
                expandTrigger: 'click',
                label: item.customLabel ? item.customLabel : 'label',
                value: item.customValue ? item.customValue : 'value',
              }"
              :class="item.checkStrictly || item.width ?'shadow addwidth':'shadow '"
              filterable
              :placeholder="item.placeholder"
              :style="{ width: item.width || '300px' }"
              @change="cascaderEvent(item)"
              @keyup.enter.native="enterHandler"
            >
            <!-- <template slot-scope="{ data }"> -->
            <!-- {{JSON.stringify(node)}} -->
            <!-- {{data}} -->
            <!-- <span>{{ data.title }}</span> -->
            <!-- <span  @click="item.handleChange">{{ !item.customNode ? data[customNode] :  data.label }}</span> -->
            <!-- </template> -->
            </el-cascader>
            <!-- 级联选择器 -->
            <el-cascader
              v-if="item.type == 'cascader2'"
              ref="cascader2"
              :key="item.valueKey"
              v-model="data[item.key]"
              :clearable="item.clearable"
              :options="item.options"
              :props="{
                checkStrictly:item.checkStrictly,
                children:item.children ? item.children : 'children',
                expandTrigger: 'click',
                label: item.customLabel ? item.customLabel : 'label',
                value: item.customValue ? item.customValue : 'value',
              }"
              :class="item.checkStrictly || item.width ?'shadow addwidth':'shadow '"
              filterable
              :placeholder="item.placeholder"
              :style="{ width: item.width || '300px' }"
              @change="cascaderEvent2(item)"
              @keyup.enter.native="enterHandler"
            >
            <!-- <template slot-scope="{ data }"> -->
            <!-- {{JSON.stringify(node)}} -->
            <!-- {{data}} -->
            <!-- <span>{{ data.title }}</span> -->
            <!-- <span  @click="item.handleChange">{{ !item.customNode ? data[customNode] :  data.label }}</span> -->
            <!-- </template> -->
            </el-cascader>
            <!-- 自定义级联选择器 可用于懒加载区域数据-->
            <!-- @expand-change="expandChange"
             @visible-change="visibleChange" -->
            <el-cascader
              v-if="item.type == 'cascaderDiy'"
              ref="cascader"
              v-model="data[item.key]"
              class="cascaderDiy"
              clearable
              :disabled="item.disabled"
              :props="item.props"
              :class="item.checkStrictly || item.width ?'shadow addwidth':'shadow'"
              filterable
              :popper-class="item.props.checkStrictly ? item.popperClass : ''"
              :placeholder="item.placeholder"
              @change="cascaderEventDiy(item)"
              @expand-change="expandChange"
              @visible-change="visibleChange"
              @keyup.enter.native="enterHandler"
            />
            <!-- 按钮 -->
            <el-button
              v-if="item.type == 'button'"
              :key="index"
              v-hasAuth="item.authCode"
              :loading="item.isLoading"
              :disabled="item.isDisabled"
              :class="item.className"
              class="nav-form-btn"
              @click.stop.prevent="item.handleClick"
            >
              {{ item.innerText }}
            </el-button>
          </el-form-item>

        </div>

      </div>

      <!-- 查询与重置部分
        :style="{width: fieldList.right.rightStyle ? '100%' : 'auto'}" -->
      <!-- <div> -->
      <div
        v-if="fieldList.hasOwnProperty('right') && fieldList['right'].hasOwnProperty('btnLists')"
        class="btn-group flex"
        :style="fieldList.right.rightStyle || ''"
      >
        <el-button
          v-for="(item) in fieldList['right'].btnLists"
          :key="JSON.stringify(item)"
          v-hasAuth="item.authCode"
          :loading="item.isLoading"
          :disabled="item.isDisabled"
          :class="item.className"
          :style="item.btnStyle || ''"
          :icon="item.icon"
          @click.stop.prevent="() => { handleDate(item); item.handleClick()}"
        >
          <!-- <i v-if="item.iconShow" class="iconfont">&#xe61d;</i> -->
          {{ item.innerText }}
        </el-button>
      </div>
      <!-- <inp-group place="right"></inp-group>
      <btn-group place="right"></btn-group> -->
      <template>
        <slot name="right" />
      </template>

      <!-- </div> -->
    </div>

  </el-form>
</template>

<script>
// import btnGroup from '@/components/commonComponent/navForm/btnGroup'
// import inpGroup from '@/components/commonComponent/navForm/inpGroup'
import { collection } from '@/common/utils/array'
// import ACascader from './component/cascader'
export default {
  // components: {
  //   ACascader
  // },
  props: {
    // 表单主题
    themeType: {
      type: String,
      default: () => ''
    },
    // 自定义类名
    className: {
      type: String,
      default: () => ''
    },
    // 表单数据
    data: {
      type: Object,
      default: () => ({})
    },
    // 验证规则
    rules: {
      type: Object,
      default: () => ({})
    },
    // label宽度
    labelWidth: {
      type: String,
      default: () => ''
    },
    // 相关的列表
    listTypeInfo: {
      type: Object,
      default: function() {
        return {}
      }
    },
    // 相关字段信息
    fieldList: {
      type: Object,
      default: () => ({})
    },
    btnLists: {
      type: Array,
      default: () => []
    },
    cascaderNum: { // 级联一共几级 默认5级 仅在cascaderDiy 使用
      type: Number,
      default: 5
    }
  },
  data: () => {
    return {
      spanObj: {
        lg: 8,
        md: 12,
        xs: 24
      },
      cascaderCurNum: 0 // 当前级联渲染到第几级了 默认0 仅在cascaderDiy 使用
    }
  },
  computed: {
  },
  mounted() {
  },
  beforeDestroy() {
  },
  methods: {
    // @focus="focusEvent(item)"
    // @blur="blurEvent(item)"
    focusEvent(item) {
      item.focus && item.focus()
    },
    blurEvent(item) {
      item.blur && item.blur()
    },
    radioChange(evnet) {
      if (evnet && evnet.handleChange && evnet.handleChange instanceof Function) {
        evnet.handleChange(this.data[evnet.key])
      }
    },
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
    // 监听页面回车事件
    enterHandler(e) {
      const fieldList = this.fieldList // 对象 有left right俩属性
      const { right, left } = fieldList
      if (right && right.btnLists && right.btnLists.length > 0) { // 存在  且
        const { btnLists } = right
        const o = btnLists.find(item => item.innerText === '查询' || item.innerText === '搜索')
        o && o.handleClick()
        if (o) return false
      }
      if (left && left.btnLists && left.btnLists.length > 0) {
        const { btnLists } = left
        const o = btnLists.find(item => item.innerText === '查询' || item.innerText === '搜索')
        o && o.handleClick()
        if (o) return false
      }
    },
    planB() {
      window.onresize = () => {
        const clientWidth = document.body.clientWidth

        // eslint-disable-next-line yoda
        if (clientWidth >= 1200 && clientWidth < 1920) {
          // lg num 24 / lgNum
          // eslint-disable-next-line no-constant-condition
          if (24 / 8 < 4) {
            document.querySelector('.right-top-input-5').style.display = 'none'
            document.querySelector('.right-top-input-4').style.display = 'none'
            document.querySelector('.right-top-input-3').style.display = 'block'
            document.querySelector('.right-input-1').style.display = 'none'
            document.querySelector('.right-input-2').style.display = 'none'
            document.querySelector('.right-input-3').style.display = 'none'
            document.querySelector('.right-input-5').style.display = 'block'
            document.querySelector('.right-input-4').style.display = 'block'
          }
        }

        // eslint-disable-next-line yoda
        if (clientWidth >= 992 && clientWidth < 1200) {
          // eslint-disable-next-line no-constant-condition
          if (24 / 12 < 3) {
            document.querySelector('.right-top-input-5').style.display = 'none'
            document.querySelector('.right-top-input-4').style.display = 'none'
            document.querySelector('.right-top-input-3').style.display = 'none'
            document.querySelector('.right-input-1').style.display = 'none'
            document.querySelector('.right-input-2').style.display = 'none'
            document.querySelector('.right-input-3').style.display = 'block'
            document.querySelector('.right-input-5').style.display = 'block'
            document.querySelector('.right-input-4').style.display = 'block'
          }
        }
      }
    },
    resetFields() {
      // if (this.data.cascader) {
      //   this.value.cascader = []
      //   this.$refs.cascader.activePath = []
      // }
      // this.$refs.cascader.forEach((item)=>{
      // })
      this.$refs['navForm'].resetFields()
    },
    checkNumber(val) {
      if (this.data[val].match(/\d+(\.\d{0,2})?/)) {
        this.data[val] = this.data[val].match(/\d+(\.\d{0,3})?/)[0] || null
      } else {
        this.data[val] = null
      }
    },
    // 获取字段列表
    getConfigList(place) {
      if (
        // eslint-disable-next-line no-prototype-builtins
        this.fieldList.hasOwnProperty(place) &&
        // eslint-disable-next-line no-prototype-builtins
        this.fieldList[place].hasOwnProperty('inpLists')
      ) {
        return this.fieldList[place].inpLists.filter(
          (item) =>
            // eslint-disable-next-line no-prototype-builtins
            !item.hasOwnProperty('show') ||
            // eslint-disable-next-line no-prototype-builtins
            (item.hasOwnProperty('show') && item.show)
        )
      } else {
        return []
      }
    },
    // 得到placeholder的显示
    getPlaceholder(row) {
      let placeholder
      if (row.type === 'input' || row.type === 'textarea') {
        placeholder = '请输入' + row.label
      } else if (row.type === 'date' && row.label === ''
      ) {
        placeholder = '请选择日期'
      } else if (
        row.type === 'select' ||
        row.type === 'time' ||
        row.type === 'date'
      ) {
        placeholder = '请选择' + (row.label || '')
      } else {
        placeholder = row.label || ''
      }
      return placeholder
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
    cascaderEvent(event) {
      console.log('sssssssddddddddddddddddddddd')
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
              cascader.pathNodes
            )
          } else {
            this.$emit(
              'cascaderEvent',
              [],
              [],
              []
            )
          }
        })
      }
      const children = this.$refs['cascader'][0].getCheckedNodes()
      if (children.length > 0 && children[0].children.length < 1) { // 判断有没有下级
        this.$refs['cascader'][0].dropDownVisible = false // 监听值发生变化就关闭它
      }
    },
    cascaderEvent2(event) {
      if (event.handleChange) {
        event.handleChange(this.data[event.key])
      } else {
        this.$nextTick(() => {
          const cascader = this.$refs['cascader2'][0].getCheckedNodes()[0]
          if (cascader) {
            this.$emit(
              'cascaderEvent2',
              cascader.path,
              cascader.pathLabels,
              cascader.pathNodes
            )
          } else {
            this.$emit(
              'cascaderEvent2',
              [],
              [],
              []
            )
          }
        })
      }
      const children = this.$refs['cascader2'][0].getCheckedNodes()
      if (children.length > 0 && children[0].children.length < 1) { // 判断有没有下级
        this.$refs['cascader2'][0].dropDownVisible = false // 监听值发生变化就关闭它
      }
    },
    dateChange(event) {
      this.$emit('dateChange', event)
    },
    dateTimeChange(event) {
      this.$emit('dateTimeChange', event)
    },
    selectEvent(event) {
      const selectArr = this.listTypeInfo && this.listTypeInfo[event.list] ? this.listTypeInfo[event.list] : event.list
      const selectItem = collection(selectArr, this.data[event.key], this.$refs[event.key][0].valueKey)
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
<style>
.el-time-spinner__item{
  color: #6C7DAD !important;
}
.el-time-panel__btn{
  color: #6C7DAD !important;
}
.el-cascader-panel .el-radio {
  width: 132px;
  height: 34px;
  line-height: 34px;
  padding: 0 10px;
  z-index: 10;
  position: absolute;
}
.el-cascader-panel .el-radio__input {
  visibility: hidden;
}
/* 自定义弹浮框 start----*/
.popperClass-radio-normal .el-radio {
  margin-right: 0;
  width:auto;
  height: auto;
  position: relative;
  font-weight: 500;
  line-height: 1;
  padding: 0;
  z-index: 0;
  display: none;
}
.popperClass-radio-normal .el-cascader-panel .el-radio__input {
  visibility: visible;
}
/* end---- */
.el-cascader-panel .el-cascader-node__postfix {
  top: 10px;
}
.el-cascader-node.is-active, .el-cascader-node.is-selectable.in-checked-path{
  background-color: #034c90;
}
/* .el-input-number.is-controls-right .el-input-number__decrease,.el-input-number__increase{
      background-color: #1d2c4c;
      border: 1px solid #1d2c4c!important;
      color: #adadad;
  } */
</style>
<style lang="scss" scoped>
.nav-form {
  margin-bottom: 10px;
  .btn-group,.nav-form-btn{
    height: 36px;
  }
  // display: flex;
  // justify-content: space-between;
  height: auto;
  .inp-group {
    min-height: 36px;
    line-height: 36px;
  }
  .el-button {
    margin-right: 10px;
  }
  .addwidth{
    width: 300px;
  }
}
.el-form-item shadow {
  height: auto;
}
.el-form-item__content .el-button.nav-form-btn {
  margin-right: 0;
}
</style>
