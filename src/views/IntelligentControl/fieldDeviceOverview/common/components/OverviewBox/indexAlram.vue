<template>
  <div class="overview-box indexAlarm">
    <el-form
      ref="overviewBoxForm"
      :model="data"
      :rules="rules"
      class="overview-box-form"
      :class="[themeType, className]"
    >
      <div v-if="fieldList.hasOwnProperty('head')" class="box-head">
        <!-- solt -->
        <template v-if="fieldList.head.hasOwnProperty('slot')">
          <slot name="head" />
        </template>
        <template v-else>
          <div class="title">
            <!-- <svg-icon
              class="waring-icon"
              :icon-class="fieldList.head.titleIcon"
            /> -->
            {{ fieldList.head.title }}
          </div>
          <!-- <el-tooltip
            class="item"
            :visible-arrow="false"
            popper-class="view-tooltip"
            effect="dark"
            placement="top-start"
          > -->
          <!-- <div slot="content" class="content">{{ fieldList.head.option }}<div class="nabla" /></div> -->
          <div
            v-hasAuth="fieldList.head.authCode"
            class="option"
          >
            <el-popconfirm
              title="确定发送指令到设备吗？"
              @onConfirm="fieldList.head.handleClick"
            >
              <svg-icon
                slot="reference"
                class="waring-icon"
                :icon-class="fieldList.head.optionIcon"
              />
            <!-- {{ fieldList.head.option }} -->
            </el-popconfirm>
          </div>
          <!-- </el-tooltip> -->
        </template>
      </div>
      <div v-if="fieldList.hasOwnProperty('body')" class="box-body">
        <el-form-item
          v-for="(item, index) in getConfigList()"
          :key="index"
          :prop="item.key"
          :label="!item.isShow ? item.label : ''"
          :class="item.className"
          :rules="item.rules"
          :label-width="item.labelWidth"
          :style="{ width: item.width, height: item.height }"
        >
          <template>
            <div v-if="!item.isShow">
              <!-- solt -->
              <template v-if="item.type === 'slot'">
                <slot :name="'form-' + item.key" />
              </template>
              <!-- Checker -->
              <div v-if="item.type === 'checker'" class="checker-box">
                <div v-if="item.title" class="title">{{ item.title }}:</div>
                <checker
                  v-model="currentId"
                  class="checker"
                  radio-required
                  :default-item-class="item.defaultClass || 'default-class'"
                  :selected-item-class="item.selectedClass || 'selected-class'"
                >
                  <checker-item
                    v-for="(childItem, index) in item.list"
                    :key="index"
                    class="checker-item"
                    :value="childItem.id"
                    @on-item-click="onItemClick(childItem.type, childItem)"
                  >{{ childItem.value }}</checker-item>
                </checker>
              </div>
              <!-- Switch -->
              <div v-if="item.type === 'switch'" class="switch-box">
                <div v-if="item.title" class="title">{{ item.title }}:</div>
                <el-switch
                  v-model="data[item.key]"
                  :active-color="item.activeColor || '#10AEFF'"
                  :inactive-color="item.inactiveColor || '#586CA5'"
                />
              </div>
              <!-- 计数器 -->
              <div v-if="item.type === 'inputNumber'" class="number-box">
                <div v-if="item.title" class="title">{{ item.title }}:</div>
                <div class="inputNumber-con">
                  <el-input-number
                    v-model="data[item.key]"
                    :disabled="fieldList.disabled"
                    :controls-position="item.controlsPositionRight"
                    :precision="item.precision"
                    :step="item.step"
                    :size="item.size"
                    :min="item.min"
                    :max="item.max"
                    @change="handleEvent(item.event)"
                  />
                </div>
                <!-- :min="item.min"
                  :max="item.max" -->
              </div>
              <!-- radio选择器 -->
              <div v-if="item.type === 'radio'" class="radio-box">
                <div v-if="item.title" class="title">{{ item.title }}:</div>
                <el-radio-group
                  v-model="data[item.key]"
                  :disabled="fieldList.disabled"
                  @change="radioEvent(item)"
                >
                  <el-radio
                    v-for="(j, k) in item.optList"
                    :key="k"
                    class="radio"
                    :label="j.value"
                  >{{ j.label }}</el-radio>
                </el-radio-group>
              </div>
              <!-- 普通输入框 -->
              <div v-if="item.type === 'input'" class="input-box">
                <div v-if="item.title" class="title">{{ item.title }}:</div>
                <el-input
                  v-if="item.secKey"
                  v-model="data[item.key][item.secKey]"
                  :type="item.type"
                  :disabled="fieldList.disabled || item.disabled"
                  :placeholder="item.placeholder"
                  @focus="handleEvent(item.event)"
                />
                <el-input
                  v-else
                  v-model="data[item.key]"
                  :type="item.type"
                  :disabled="fieldList.disabled || item.disabled"
                  :placeholder="item.placeholder"
                  @focus="handleEvent(item.event)"
                />
              </div>
            </div>
          </template>
        </el-form-item>
        <slot name="body-fot" />
      </div>
    </el-form>
  </div>
</template>

<script>
import { Checker, CheckerItem } from '@/components/commonComponent/checker'
export default {
  name: 'OverviewBox',
  components: {
    Checker,
    CheckerItem
  },
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
    rules: {
      type: Object
    },
    // checker
    checkerId: {
      type: Number
    },
    // 相关字段信息
    fieldList: {
      type: Object
    }
  },
  data() {
    return {
      currentId: this.checkerId
    }
  },
  methods: {
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
    radioEvent(event) {
      console.log(event)
      // eslint-disable-next-line no-prototype-builtins
      if (event.hasOwnProperty('handleChange')) {
        event.handleChange(this.data[event.key])
      }
    },
    // 绑定的相关事件
    handleEvent(evnet) {
      // console.log('触发的时间',evnet)
      this.$emit('handleEvent', evnet)
    },
    onItemClick(type, childItem) {
      if (type) {
        this.data.ctrlDevType = type
      }
      this.data.way = childItem.key
      console.log('输出的checker选项', type, this.data, childItem)
    }
  }
}
</script>

<style lang="scss">
.view-tooltip {
  background: #364687 !important;
  position: relative;

  .nabla {
    position: absolute;
    bottom: -7px;
    z-index: 99999999;
    width: 0px;
    height: 0px;
    border-top: 7px solid #364687;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
  }
}
.indexAlarm {
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
    // .el-input-number {
    //   line-height: 36px;
    //   height: 36px;
    //   overflow: hidden;
    //   border: 1px solid #475a9a;
    //   border-radius: 2px;
    //   .el-input__inner {
    //     background: #162456;
    //     border: none;
    //   }
    //   .el-input-number__decrease,
    //   .el-input-number__increase {
    //     background: #162456;
    //     border-left: 1px solid #162456;
    //     border-bottom: none;
    //     & [class*='el-icon'] {
    //       color: #ffffff;
    //     }
    //   }
    //   .el-input-number__decrease {
    //     border-right: 1px solid #475a9a;
    //   }
    //   .el-input-number__increase {
    //     border-left: 1px solid #475a9a;
    //   }
    // }
    // .is-controls-right {
    //   .el-input-number__decrease {
    //     border-right: none;
    //     border-left: 1px solid #475a9a;
    //   }
    // }
    .el-form-item__label,
    .el-form-item__content {
      font-size: 12px;
      .title {
        @include font_color('mainFontColor12');
      }
    }
    .el-form-item__label {
      // color: #cdd8f7;
      @include font_color('mainFontColor12');
    }
    .el-form-item__content {
    }
  }
}
</style>
<style lang="scss" scoped>

.default-class {
  border-radius: 18px;
  background: #122053;
}
.selected-class {
  color: #ffffff;
  background: #10aeff;
}
.overview-box {
  border-radius: 4px;
  // background: #27376f;
  @include background('comfortBackGround');
  overflow: hidden;
  // border: 1px solid;
  // @include border_color('alarmLongBoxTitleBorderColor');
  // display: inline-block;
  .el-form-item {
    display: inline-block;
    margin-bottom: 0;
    width: 50%;
    // border: 1px solid pink;
  }
  .box-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    // background: #034c90;
    @include background('overviewBoxBackGround');
    border: 1px solid;
    @include border_color('overviewBoxBorderBottomColor');
    padding: 10px 20px;
    .title {
      font-size: 16px;
      // color: #cdd8f7;
      @include font_color('mainFontColor12');
    }
    .option {
      cursor: pointer;
      font-size: 12px;
      color: #68ccff;
      &:hover{
              .waring-icon {
        fill: #90D9FF;
      }
      }
      .waring-icon {
        font-size: 22px;
      }
    }
  }
  .box-body {
    padding: 10px 20px;
    // color: #cdd8f7;
    @include font_color('mainFontColor12');
    .number-box{
      // border: 1px solid red;
      width: 100%;
      // display: inline-block;
    }
    .inputNumber-con{
      // border: 1px solid blue;
    }
    .checker-box {
      .title {
        padding-left: 10px;
      }
      .checker {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        .checker-item {
          width: 45%;
          cursor: pointer;
          // flex: 2;
          text-align: center;
          margin-right: 20px;
          margin-bottom: 15px;
          &:nth-child(even) {
            margin-right: 0px;
          }
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
  }
}
</style>
