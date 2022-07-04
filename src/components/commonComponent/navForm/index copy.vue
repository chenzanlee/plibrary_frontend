<template>
  <el-form
    ref="navForm"
    class="nav-form "
    :class="[themeType, className]"
    label-position="left"
    :model="data"
    :rules="rules"
    :label-width="labelWidth"
  >
    <!-- planB -->
    <!-- <div style="display: flex;justify-content: space-between;overflow: hidden;height: 30px;">
      <div>
        <button>one</button>
        <button>one</button>
        <button>one</button>
        <button>one</button>
        <button>one</button>
        <button>one</button>
        <button>one</button>
        <button>one</button>
        <button>one</button>
        <button>one</button>
        <button>one</button>
        <button>one</button>
      </div>

      <div style="flex-grow: 1;">
        <div style="border: 1px solid red;color: #fff; display: flex;">

          <div style="flex-grow: 1;">
            <el-row>
              <el-col
                class="right-top-input-1"
                style="height: 50px"
                :lg="{span: spanObj.lg}"
                :md="{span: spanObj.md}"
                :xs="{span: spanObj.xs}"
              >1</el-col>
              <el-col
                class="right-top-input-2"
                style="height: 50px"
                :lg="{span: spanObj.lg}"
                :md="{span: spanObj.md}"
                :xs="{span: spanObj.xs}"
              >2</el-col>
              <el-col
                class="right-top-input-3"
                style="height: 50px"
                :lg="{span: spanObj.lg}"
                :md="{span: spanObj.md}"
                :xs="{span: spanObj.xs}"
              >3</el-col>
              <el-col
                class="right-top-input-4"
                style="height: 50px"
                :lg="{span: spanObj.lg}"
                :md="{span: spanObj.md}"
                :xs="{span: spanObj.xs}"
              >4</el-col>
              <el-col
                class="right-top-input-5"
                style="height: 50px"
                :lg="{span: spanObj.lg}"
                :md="{span: spanObj.md}"
                :xs="{span: spanObj.xs}"
              >5</el-col>
            </el-row>
          </div>

          <div>
            <button>one</button>
            <button>one</button>
            <button>one</button>
            <button>one</button>
            <button>one</button>
            <button>one</button>
            <button>one</button>
            <button>one</button>
            <span style="color: #fff">更多</span>
          </div>
        </div>
      </div>
    </div>
    <el-row>
      <el-col
        style="color: #fff"
        class="right-input-1"
        :lg="{span: spanObj.lg}"
        :md="{span: spanObj.md}"
        :xs="{span: spanObj.xs}"
      >1</el-col>
      <el-col
        class="right-input-2"
        style="color: #fff"
        :lg="{span: spanObj.lg}"
        :md="{span: spanObj.md}"
        :xs="{span: spanObj.xs}"
      >2</el-col>
      <el-col
        class="right-input-3"
        style="color: #fff"
        :lg="{span: spanObj.lg}"
        :md="{span: spanObj.md}"
        :xs="{span: spanObj.xs}"
      >3</el-col>
      <el-col
        class="right-input-4"
        style="color: #fff"
        :lg="{span: spanObj.lg}"
        :md="{span: spanObj.xs}"
      >4</el-col>
      <el-col
        class="right-input-5"
        style="color: #fff"
        :lg="{span: spanObj.lg}"
        :md="{span: spanObj.md}"
        :xs="{span: spanObj.xs}"
      >5</el-col>
    </el-row> -->

    <div style="display: flex;flex-wrap: nowrap;" />

    <div
      v-if=" fieldList.hasOwnProperty('left') && Object.keys(fieldList.left).length"
      class="left"
      :style="{marginTop: fieldList.hasOwnProperty('right') && Object.keys(fieldList.right).length ? '20px' : 0,}"
    >
      <div
        class="inp-group flex"
        style="flex-wrap: nowrap;"
      >
        <el-form-item
          v-for="(item, index) in getConfigList('left')"
          :key="index"
          :prop="item.key"
          :label="item.label"
          :class="item.className"
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
            :placeholder="item.placeholder || getPlaceholder(item)"
            @focus="handleEvent(item.event)"
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
            size="small"
            :min="item.min"
            :max="item.max"
            @change="handleEvent(item.event)"
          />
          <!-- 选择框 -->
          <el-select
            v-if="item.type === 'select'"
            :ref="item.key"
            v-model="data[item.key]"
            :disabled="item.disabled"
            :clearable="item.clearable"
            :filterable="item.filterable"
            :placeholder="
              item.placeholder ? item.placeholder : getPlaceholder(item)
            "
            @change="selectEvent(item)"
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
            :placeholder="getPlaceholder(item)"
            :style="{ width: item.width }"
            @focus="handleEvent(item.event)"
            @change="dateChange"
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
            value-format="yyyy-MM-dd hh:mm:ss"
            :default-value="item.defaultValue"
            :start-placeholder="item.startPlaceholder"
            :end-placeholder="item.endPlaceholder"
            :placeholder="getPlaceholder(item)"
            :style="{ width: item.width }"
            @focus="handleEvent(item.event)"
            @change="dateTimeChange"
          />
          <!-- radio选择器 -->
          <el-radio-group v-if="item.type === 'radio'" v-model="data[item.key]">
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
            v-model="data[item.key]"
            clearable
            :options="item.options"
            :props="{
              checkStrictly:item.checkStrictly,
              expandTrigger: 'hover',
              label: item.customLabel ? item.customLabel : 'label',
              value: item.customValue ? item.customValue : 'value',
            }"
            :class="item.checkStrictly || item.width?'shadow addwidth':'shadow '"
            filterable
            :placeholder="item.placeholder"
            :style="{ width: '300px' }"
            @change="cascaderEvent(item)"
          >
            <!-- <template slot-scope="{ data }"> -->
            <!-- {{JSON.stringify(node)}} -->
            <!-- {{data}} -->
            <!-- <span>{{ data.title }}</span> -->
            <!-- <span @click="item.handleChange">{{ item.customLabel ? data[item.customLabel] :  data.label }}</span> -->
            <!-- </template> -->
          </el-cascader>
          <!-- 可选任意级联选择器 -->
          <el-cascader
            v-if="item.type == 'cascaderany'"
            ref="cascader"
            v-model="data[item.key]"
            clearable
            :options="item.options"
            :props="{
              checkStrictly: true,
              expandTrigger: 'hover',
              label: 'title',
            }"
            class="shadow addwidth"
            filterable
            :placeholder="item.placeholder"
            :style="{ width: '300px' }"
            @change="
              item.hasOwnProperty('handleChange') ? item.handleChange : ''
            "
          >
            <template slot-scope="{ data }">
              <!-- {{JSON.stringify(node)}} -->
              <!-- {{data}} -->
              <span>{{ data.title }}</span>
              <!-- <span >{{ item.customNode ? data[customNode] :  data.label }}</span> -->
            </template>
          </el-cascader>
          <!-- 按钮 -->
          <button
            v-if="item.type == 'button'"
            :key="index"
            :class="item.className"
            class="nav-form-btn"
            @click.stop.prevent="item.handleClick"
          >
            {{ item.innerText }}
          </button>
        </el-form-item>
      </div>
      <div
        v-if="
          fieldList.hasOwnProperty('left') &&
            fieldList['left'].hasOwnProperty('btnLists')
        "
        class="btn-group flex"
        style="flex-wrap: nowrap;"
      >
        <el-button
          v-for="(item, index) in fieldList['left'].btnLists"
          :key="index"
          :class="item.className"
          @click.stop.prevent="item.handleClick"
        >
          {{ item.innerText }}
        </el-button>
      </div>
      <!-- <inp-group place="left"></inp-group> -->
      <!-- <btn-group place="left"></btn-group> -->
      <!-- solt -->
      <template>
        <slot name="left" />
      </template>
    </div>

    <div
      v-if=" fieldList.hasOwnProperty('right') && Object.keys(fieldList.right).length"
      class="right flex flex-center"
      :style="fieldList['right'].rightStyle || ''"
    >
      <div class="inp-group flex">
        <el-form-item
          v-for="(item, index) in getConfigList('right')"
          :key="index"
          :prop="item.key"
          :label="item.label"
          :class="item.className"
          :style="{ width: item.type === 'cascader' || item.type === 'cascaderany' ? '300px' : item.width, height: item.height }"
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
            :placeholder="item.placeholder || getPlaceholder(item)"
            @focus="handleEvent(item.event)"
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
            size="small"
            :min="item.min"
            :max="item.max"
            @change="handleEvent(item.event)"
          />
          <!-- 选择框 -->
          <el-select
            v-if="item.type === 'select'"
            :ref="item.key"
            v-model="data[item.key]"
            :disabled="item.disabled"
            :clearable="item.clearable"
            :filterable="item.filterable"
            :placeholder="
              item.placeholder ? item.placeholder : getPlaceholder(item)
            "
            @change="selectEvent(item)"
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
            :placeholder="getPlaceholder(item)"
            :style="{ width: item.width }"
            @focus="handleEvent(item.event)"
            @change="dateChange"
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
            value-format="yyyy-MM-dd hh:mm:ss"
            :start-placeholder="item.startPlaceholder"
            :end-placeholder="item.endPlaceholder"
            :placeholder="getPlaceholder(item)"
            :style="{ width: item.width }"
            @focus="handleEvent(item.event)"
            @change="dateTimeChange"
          />
          <!-- radio选择器 -->
          <el-radio-group v-if="item.type === 'radio'" v-model="data[item.key]">
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
            v-model="data[item.key]"
            clearable
            :options="item.options"
            :props="{
              checkStrictly:item.checkStrictly,
              expandTrigger: 'hover',
              label: item.customLabel ? item.customLabel : 'label',
              value: item.customValue ? item.customValue : 'value',
            }"
            :class="item.checkStrictly || item.width ?'shadow addwidth':'shadow '"
            filterable
            :placeholder="item.placeholder"
            :style="{ width: item.width }"
            @change="cascaderEvent(item)"
          >
            <!-- <template slot-scope="{ data }"> -->
            <!-- {{JSON.stringify(node)}} -->
            <!-- {{data}} -->
            <!-- <span>{{ data.title }}</span> -->
            <!-- <span  @click="item.handleChange">{{ !item.customNode ? data[customNode] :  data.label }}</span> -->
            <!-- </template> -->
          </el-cascader>
          <!-- 可选任意级联选择器 -->
          <el-cascader
            v-if="item.type == 'cascaderany'"
            ref="cascader"
            v-model="data[item.key]"
            clearable
            :options="item.options"
            :props="{
              checkStrictly: true,
              expandTrigger: 'hover',
              label: 'title',
            }"
            class="shadow addwidth"
            filterable
            :placeholder="item.placeholder"
            :style="{ width: item.width }"
            @change="
              item.hasOwnProperty('handleChange') ? item.handleChange : ''
            "
          >
            <template slot-scope="{ data }">
              <!-- {{JSON.stringify(node)}} -->
              <!-- {{data}} -->
              <span>{{ data.title }}</span>
              <!-- <span >{{ item.customNode ? data[customNode] :  data.label }}</span> -->
            </template>
          </el-cascader>
          <!-- 按钮 -->
          <button
            v-if="item.type == 'button'"
            :key="index"
            :class="item.className"
            class="nav-form-btn"
            @click.stop.prevent="item.handleClick"
          >
            {{ item.innerText }}
          </button>
        </el-form-item>
      </div>
      <div
        v-if="
          fieldList.hasOwnProperty('right') &&
            fieldList['right'].hasOwnProperty('btnLists')
        "
        class="btn-group flex"
      >
        <el-button
          v-for="(item, index) in fieldList['right'].btnLists"
          :key="index"
          :class="item.className"
          :style="item.btnStyle || ''"
          @click.stop.prevent="item.handleClick"
        >
          {{ item.innerText }}
        </el-button>
      </div>
      <!-- <inp-group place="right"></inp-group>
      <btn-group place="right"></btn-group> -->
      <template>
        <slot name="right" />
      </template>
    </div>

  </el-form>
</template>

<script>
// import btnGroup from '@/components/commonComponent/navForm/btnGroup'
// import inpGroup from '@/components/commonComponent/navForm/inpGroup'
import { collection } from '@/common/utils/array'
export default {
  props: {
    // 表单主题
    themeType: {
      type: String
    },
    // 自定义类名
    className: {
      type: String
    },
    // 表单数据
    data: {
      type: Object
    },
    // 验证规则
    rules: {
      type: Object
    },
    // label宽度
    labelWidth: {
      type: String
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
      type: Object
    },
    btnLists: {
      type: Array
    }
  },
  // components: {
  //   btnGroup,
  //   inpGroup,
  // },
  // provide() {
  //   return {
  //     form: this,
  //   }
  // },
  data: () => {
    return {
      spanObj: {
        lg: 8,
        md: 12,
        xs: 24
      }
    }
  },

  mounted() {
    // this.planB()
  },
  methods: {
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
      } else if (
        row.type === 'select' ||
        row.type === 'time' ||
        row.type === 'date'
      ) {
        placeholder = '请选择' + row.label
      } else {
        placeholder = row.label
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
        event.handleChange(selectItem)
      }
    },
    // 派发按钮点击事件
    handleClick(event, data) {
      this.$emit('handleClick', event, data)
    }
  }
}
</script>

<style lang="scss" scoped>
.nav-form {
  // display: flex;
  // justify-content: space-between;
  height: auto;
  .inp-group {
    min-height: 36px;
    line-height: 36px;
  }
  .el-form-item {
    margin-right: 10px;
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

</style>
