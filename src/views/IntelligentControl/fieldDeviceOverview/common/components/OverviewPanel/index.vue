<template>
  <div class="overview-panel indexIndex">
    <el-form ref="overviewPanelForm" :model="data">
      <div v-if="fieldList.hasOwnProperty('head')" class="box-head">
        <!-- solt -->
        <template v-if="fieldList.head.hasOwnProperty('slot')">
          <slot name="head" />
        </template>
        <template v-else>
          <div class="title">
            <svg-icon
              v-if="fieldList.head.titleIcon"
              class="waring-icon"
              :icon-class="fieldList.head.titleIcon"
            />
            {{ fieldList.head.title }}
          </div>
          <div class="option">
            <template v-if="!isSend">
              <div class="edit" @click="sendShow = true">
                <svg-icon class="waring-icon" icon-class="edit-ico" />
                编辑
              </div>
            </template>
            <template v-else>
              <div class="cancel" @click="cancel">取消</div>
              <div
                class="send"
                @click.stop.prevent="fieldList.head.handleClick"
              >
                <svg-icon class="waring-icon" icon-class="send-instructions" />
                发送指令
              </div>
            </template>
          </div>
        </template>
      </div>
      <div v-if="fieldList.hasOwnProperty('body')" class="box-body">
        <el-row class="form-title" :gutter="10">
          <el-col :span="4" style="color:rgba(0,0,0,0)">1</el-col>
          <el-col
            v-for="(item, index) in titles()"
            :key="index"
            class="title"
            :span="20 / titles().length"
          >{{ item }}</el-col>
        </el-row>
        <el-row
          v-for="(item, index) in labels()"
          :key="index"
          class="form-body"
          :gutter="10"
        >
          <el-col class="label" :span="4">{{ item.label }}</el-col>
          <el-col
            v-for="(childItem, index) in item.lists"
            :key="index"
            :span="20 / item.lists.length"
          >
            <el-form-item :prop="childItem.key" :rules="childItem.rules">
              <!-- solt -->
              <template v-if="childItem.type === 'slot'">
                <slot :name="'form-' + childItem.key" />
              </template>
              <el-input-number
                v-model="data[item.key][childItem.key]"
                :disabled="fieldList.body.disabled"
                :controls-position="childItem.controlsPositionRight"
                :size="childItem.size"
                :min="childItem.min"
                :max="childItem.max"
                @change="handleEvent(childItem.event)"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    // 表单主题
    themeType: {
      type: String,
      default: 'default'
    },
    // 自定义类名
    className: {
      type: String
    },
    // 表单数据
    data: {
      type: Object
    },
    // 相关字段信息
    fieldList: {
      type: Object
    }
    // sendShow:{
    //   type:Boolean,
    //   default:false
    // }
  },
  data() {
    return {
      sendShow: false
    }
  },
  computed: {
    isSend() {
      return this.sendShow
    }
  },
  methods: {
    cancel() {
      this.sendShow = false
    },
    labels() {
      return this.fieldList.body.labels
    },
    titles() {
      return this.fieldList.body.titles
    },
    // 获取字段列表
    getConfigList() {
      // eslint-disable-next-line no-prototype-builtins
      if (this.fieldList.hasOwnProperty('body')) {
        return this.fieldList.body.filter(
          (item) =>
          // eslint-disable-next-line no-prototype-builtins
            !item.hasOwnProperty('show') ||
            // eslint-disable-next-line no-prototype-builtins
            (item.hasOwnProperty('show') && item.show)
        )
      }
    },
    // 绑定的相关事件
    handleEvent(evnet) {
      // console.log('触发的时间',evnet)
      this.$emit('handleEvent', evnet)
    }
  }
}
</script>
<style lang="scss">
.indexIndex {
  .el-form-item {
    .el-radio__inner {
      border: 1px solid #cdd8f7;
      background: transparent;
    }
    .el-input__inner {
      background: #162456;
      border: 1px solid #475a9a;
      border-radius: 2px;
    }
    .el-radio__input.is-checked .el-radio__inner {
      background: #517af0;
    }
    .el-input-number {
      line-height: 36px;
      height: 36px;
      overflow: hidden;
      border: 1px solid #475a9a;
      border-radius: 2px;
      .el-input__inner {
        background: #162456;
        border: none;
      }
      .el-input-number__decrease,
      .el-input-number__increase {
        background: #162456;
        border-left: 1px solid #162456;
        border-bottom: none;
        & [class*='el-icon'] {
          color: #ffffff;
        }
      }
      .el-input-number__decrease {
        border-right: 1px solid #475a9a;
      }
      .el-input-number__increase {
        border-left: 1px solid #475a9a;
      }
    }
    .is-controls-right {
      .el-input-number__decrease {
        border-right: none;
        border-left: 1px solid #475a9a;
      }
    }
    .el-form-item__label,
    .el-form-item__content {
      font-size: 12px;
    }
    .el-form-item__label {
      // color: #cdd8f7;
      @include font_color('mainFontColor11');
    }
    .el-form-item__content {
    }
  }
}
</style>
<style lang="scss" scoped>
.overview-panel {
  border-radius: 4px;
  background: #27376f;
  overflow: hidden;
  .el-form-item {
    margin-bottom: 0;
  }
  .box-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #034c90;
    padding: 10px 20px;
    .title {
      font-size: 16px;
      // color: #cdd8f7;
      @include font_color('mainFontColor11');
    }
    .option {
      font-size: 12px;
      color: #68ccff;
      display: flex;
      .edit,
      .cancel,
      .send {
        cursor: pointer;
      }
      .send {
        margin-left: 20px;
      }
    }
  }
  .box-body {
    font-size: 12px;
    .form-title {
      .title {
        // color: #6e83be;
        @include font_color('viewFontColor3');
      }
    }
    .form-body {
      display: flex;
      // align-items: center;
      // color: #cdd8f7;
      @include font_color('mainFontColor11');
      .label{
        display: flex;
        align-items: center;
        justify-content: flex-end;
        height: 36px;
      }

    }
  }
}
</style>
