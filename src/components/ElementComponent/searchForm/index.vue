<template>
  <!--
   @file from封装
   @author author-name(孙亚飞 17600837372)
 -->
  <div class="sumbit-form">
    <el-form ref="ruleForm" :model="value" class="demo-ruleForm">
      <slot name="formItem" />
      <div class="chaxun">
        <template v-for="(item, index) in formConfig.formItemList">
          <div
            :key="index"
            class="chaxun-cli"
            :style="{ width: formConfig.formWidth == 1 ? '100%' : '50%' }"
          >
            <template>
              <div>
                <template
                  v-if="
                    ['text', 'textarea', 'number', 'email'].indexOf(
                      item.type
                    ) !== -1
                  "
                >
                  <el-form-item
                    :rules="item.rules ? item.rules : ''"
                    :prop="item.prop ? item.prop : ''"
                  >
                    <el-input
                      v-model="value[item.name]"
                      class="noShadow"
                      :type="item.type"
                      :placeholder="item.placeholder"
                    />
                  </el-form-item>
                </template>
                <!-- select下拉框 -->
                <template v-if="item.type === 'select'">
                  <el-form-item
                    :rules="item.rules ? item.rules : ''"
                    :prop="item.prop ? item.prop : ''"
                  >
                    <el-select
                      v-model="value[item.name]"
                      :placeholder="item.placeholder"
                      class="shadow"
                    >
                      <el-option
                        v-for="(j, k) in item.optList"
                        :key="k"
                        :value="j.value"
                      />
                    </el-select>
                  </el-form-item>
                </template>
                <!-- 滑块 -->
                <!-- <template v-if="item.type == 'switch'">
                        <el-form-item :label="item.label" :prop="item.prop ? item.prop : ''">
                        <el-switch v-model="value[item.name]"></el-switch>
                        </el-form-item>
                    </template> -->
                <!-- 单选框 -->
                <template v-if="item.type == 'radio'">
                  <el-form-item :label="item.label">
                    <el-radio-group v-model="value[item.name]">
                      <el-radio
                        v-for="(j, k) in item.optList"
                        :key="k"
                        :label="j"
                      />
                    </el-radio-group>
                  </el-form-item>
                </template>
                <!-- 级联选择器 -->
                <template v-if="item.type == 'cascader'">
                  <el-form-item>
                    <el-cascader
                      ref="cascader"
                      v-model="value[item.name]"
                      clearable
                      :options="item.optList"
                      class="shadow"
                      :placeholder="item.placeholder"
                    >
                      <template slot-scope="{ node, data }">
                        <span v-if="!node.isLeaf">{{ data.label }}</span>
                      </template>
                    </el-cascader>
                  </el-form-item>
                </template>
              </div>
            </template>
          </div>
        </template>
      </div>

      <!-- 按钮 -->
      <div
        class="searchBtn"
        :style="{
          'justify-content': formConfig.btnPosition
            ? formConfig.btnPosition
            : 'center',
        }"
      >
        <el-button-group>
          <button
            v-for="(item, index) in formConfig.operate"
            :key="index"
            :class="item.class"
            :size="item.size"
            @click.stop.prevent="item.handleClick"
          >
            {{ item.name }}
          </button>
        </el-button-group>
        <slot name="operate" />
      </div>
    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    formConfig: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isSearchLock: true,
      value: {}
    }
  },
  created() {
    this.formConfig.formItemList.each
  },
  mounted() {},
  methods: {
    // 子组件校验，传递到父组件
    validateForm() {
      let flag = null
      if (this.isSearchLock) {
        this.$refs['ruleForm'].validate((valid) => {
          const vm = this
          if (valid) {
            flag = true
            vm.isSearchLock = flag
          } else {
            flag = false
            vm.isSearchLock = flag
            this.$message.error('保存信息不完整，请继续填写完整')
            setTimeout(function() {
              vm.isSearchLock = true
            }, 2000)
          }
        })
        return {
          flag,
          value: this.value
        }
      }
    },
    resetFields() {
      if (this.value.cascader) {
        this.value.cascader = []
        this.$refs.cascader.activePath = []
      }
      this.$refs['ruleForm'].resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>
.demo-ruleForm {
  width: 100%;
}
.searchBtn {
  display: flex;
  justify-content: center; /*水平居中*/
  flex-wrap: no-wrap;
  .el-button-group {
    display: flex;
    flex-wrap: no-wrap;
  }
}
.chaxun {
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .chaxun-cli {
    min-width: 200px;
    padding-right: 10px;
    box-sizing: border-box;
  }
}
.el-radio-group {
  height: 40px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.el-button-group {
  > button {
    margin: 0 5px;
  }
}
.el-select {
  width: 100%;
}
</style>
