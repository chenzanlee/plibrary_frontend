<template>
  <div class="inp-group flex">
    <el-form-item
      v-for="(item, index) in getConfigList()"
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
        v-model="form.data[item.key]"
        :type="item.type"
        :disabled="item.disabled"
        :placeholder="item.placeholder || getPlaceholder(item)"
        @focus="handleEvent(item.event)"
      />
      <!-- number输入框 -->
      <el-input
        v-if="item.type === 'float'"
        v-model="form.data[item.key]"
        :type="item.type"
        :disabled="item.disabled"
        :placeholder="item.placeholder || getPlaceholder(item)"
        @focus="handleEvent(item.event)"
        @input="checkNumber(item.key)"
      />
      <!-- 文本输入框 -->
      <el-input
        v-if="item.type === 'textarea'"
        v-model.trim="form.data[item.key]"
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
        v-model="form.data[item.key]"
        size="small"
        :min="item.min"
        :max="item.max"
        @change="handleEvent(item.event)"
      />
      <!-- 选择框 -->
      <el-select
        v-if="item.type === 'select'"
        v-model="form.data[item.key]"
        :disabled="item.disabled"
        :clearable="item.clearable"
        :filterable="item.filterable"
        :placeholder="getPlaceholder(item)"
        @change="handleEvent(item.event, data[item.key])"
      >
        <el-option
          v-for="(childItem, childIndex) in listTypeInfo[item.list]"
          :key="childIndex"
          :label="childItem.key"
          :value="childItem.value"
        />
      </el-select>
      <!-- 日期选择框 -->
      <el-date-picker
        v-if="item.type === 'date'"
        v-model="form.data[item.key]"
        :type="item.dateType"
        :picker-options="item.TimePickerOptions || {}"
        :clearable="item.clearable"
        :disabled="item.disabled"
        :range-separator="item.rangeSeparator"
        :start-placeholder="item.startPlaceholder"
        :end-placeholder="item.endPlaceholder"
        :placeholder="getPlaceholder(item)"
        :style="{width:item.width}"
        @focus="handleEvent(item.event)"
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
        value-format="yyyy-mm-dd hh:mm:ss"
        :start-placeholder="item.startPlaceholder"
        :end-placeholder="item.endPlaceholder"
        :placeholder="getPlaceholder(item)"
        :style="{ width: item.width }"
        @focus="handleEvent(item.event)"
      />
      <!-- radio选择器 -->
      <el-radio-group
        v-if="item.type === 'radio'"
        v-model="form.data[item.key]"
      >
        <el-radio
          v-for="(j, k) in item.optList"
          :key="k"
          :label="j"
        />
      </el-radio-group>
      <!-- 级联选择器 -->
      <el-cascader
        v-if="item.type == 'cascader'"
        ref="cascader"
        v-model="form.data[item.key]"
        clearable
        :options="item.options"
        :props="{ expandTrigger: 'hover' }"
        class="shadow"
        :placeholder="item.placeholder"
        :style="{width:item.width || '300px'}"
      >
        <template slot-scope="{ data }">
          <!-- {{JSON.stringify(node)}} -->
          <!-- {{data}} -->
          <span>{{ data.title }}</span>
          <!-- <span >{{ !item.customNode ? data[customNode] :  data.label }}</span> -->

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
</template>

<script>
export default {
  name: 'InpGroup',
  inject: ['form'],
  props: {
    // 放置位置
    place: {
      type: String
    }
  },
  methods: {
    checkNumber(val) {
      if (this.form.data[val].match(/\d+(\.\d{0,2})?/)) {
        this.form.data[val] =
        this.form.data[val].match(/\d+(\.\d{0,3})?/)[0] || null
      } else {
        this.form.data[val] = null
      }
    },
    // 获取字段列表
    getConfigList() {
      if (
        this.form.fieldList.hasOwnProperty(this.place) &&
        this.form.fieldList[this.place].hasOwnProperty('inpLists')
      ) {
        return this.form.fieldList[this.place].inpLists.filter(
          (item) =>
            !item.hasOwnProperty('show') ||
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
      // console.log('触发的时间',evnet)
      this.$emit('handleEvent', evnet)
    },
    // 派发按钮点击事件
    handleClick(event, data) {
      this.$emit('handleClick', event, data)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}
.nav-form-btn{
    padding: 10px 20px;
}
</style>
