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
    <div
      v-if="Object.keys(fieldList.right).length"
      class="right flex flex-center"
      :style="fieldList['right'].rightStyle || ''"
    >
      <div class="inp-group flex">
        <el-row>
          <el-col v-for="(item, index) in getConfigList('right')" :key="index" :span="4">
            <el-form-item
              :prop="item.key"
              :label="item.label"
              :class="item.className"
            >
              <!-- 普通输入框 -->
              <el-input
                v-if="item.type === 'input' || item.type === 'password'"
                v-model="data[item.key]"
                :type="item.type"
                :disabled="item.disabled"
                :placeholder="item.placeholder || getPlaceholder(item)"
                @focus="handleEvent(item.event)"
              />
              <!-- number 输入框 -->
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
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </div>
  </el-form>
</template>

<script>
import { collection } from '@/common/utils/array'
export default {
  // components: {
  //   btnGroup,
  //   inpGroup,
  // },
  // provide() {
  //   return {
  //     form: this,
  //   }
  // },
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
    }
  },
  methods: {
    resetFields() {
      // if (this.data.cascader) {
      //   this.value.cascader = []
      //   this.$refs.cascader.activePath = []
      // }
      // this.$refs.cascader.forEach((item)=>{
      //  console.log('cascader',item)
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
      // console.log('触发的时间',evnet)
      if (evnet === 'cascader') {
        //  console.log(this.$refs["cascader"][0].getCheckedNodes()[0])
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
      // console.log('获取的级联组件',event.key)
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
    selectEvent(event) {
      console.log('获取的select组件', this.data[event.key], this.$refs[event.key])
      const selectArr = this.listTypeInfo && this.listTypeInfo[event.list] ? this.listTypeInfo[event.list] : event.list
      const selectItem = collection(selectArr, this.data[event.key], this.$refs[event.key][0].valueKey)
      // console.log(selectArr)
      // console.log(selectItem)
      if (event.handleChange) {
        event.handleChange(selectItem)
      }
      // console.log(this,event.list)
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
