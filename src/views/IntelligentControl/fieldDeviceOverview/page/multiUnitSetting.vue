<template>
  <div class="multiUnitSetting-router">
    <el-row :gutter="10" style="margin:0">
      <multi-unit-setting-v3 v-if="multiUnitStore.deviceVersionId === '6aKGZaUNLp9poYSNu1PhnU'" />
      <multi-unit-setting v-else />
    </el-row>

  </div>
</template>

<script>
import multiUnitSetting from '@/views/IntelligentControl/fieldDeviceOverview/page/subpage/multiUnitSetting'
import multiUnitSettingV3 from '@/views/IntelligentControl/fieldDeviceOverview/page/subpageV3/multiUnitSetting'
export default {
  components: {
    multiUnitSetting,
    multiUnitSettingV3
  },
  data() {
    return {
      multiUnitStore: ''
    }
  },
  mounted() {
    console.log('获取的multiUnitSetting存储', JSON.parse(sessionStorage.getItem('multiUnitSetting')))
    this.multiUnitStore = JSON.parse(sessionStorage.getItem('multiUnitSetting'))
  }
}
</script>

<style lang="scss">
.title-col {
  width: 80px;
  min-width: 80px;
}

.send {
  .waring-icon {
    font-size: 22px;
  }
}
.col-box {
  height: 100%;
}
.title-col-8 {
  width: 50px;
  min-width: 50px;
}
.unit-config {
  .radio-box {
    margin-bottom: 30px;
  }
  .radio {
    width: 45%;
    margin-bottom: 20px;
    // &:nth-child(2n) {
    //   text-align: right;
    // }
  }
  .el-input-number {
    width: auto;
  }
}
.overview-box-main {
  width: 100%;
  display: flex;
}
.parameter-setting,
.multi-unit-setting,
.multi-function-setting {
  .overview-panel .el-form-item .el-input__inner{
    border: 1px solid #475a9a;
    @include border_color('inputInnerBorderColor');
  }
  @media screen and (max-width: 1600px) {
.light-config {
 .form-time-item{
   display: inherit !important;
 }
  .overview-box {
    .time-picker {
      width: 140px !important;
  }
  }
}
}
    .addForm .el-form-item{
    width: 48%;
  }
  .el-form{
    display: flex;
    flex-wrap: wrap;
    -webkit-box-pack: justify;
    justify-content: space-between;
  }
  .dialog-footer{
  .overview-panel{
    background: none;
  }
}
  .flex-grow-2 {
  flex: 2 !important;
}
  .equipment-config-equipmentConfig{
  .dialog-title{
    display: flex;
    color: #ffffff;
    .title{
      margin-right: 30px;
    }
  }
}
  .body-fot{
  position: absolute;
  bottom: 20px;
  width: 100%;
  left: 0;
  padding: 0 20px;
  display: flex;
  justify-content: center;
}
  .el-input-number {
    width: auto;
  }
  .overview-box {
    position: relative;
    border-radius: 4px;
    background: #27376f;
    overflow: hidden;
  }
}
.view-popover {
  // .el-popover{
  background: #001d45 !important;
  border: none !important;
  // }
}
.work-mode-config .manual-temp .manual-temp-inp {
  width: auto !important;
}
.work-mode-config {
  margin-left: 0 !important;
  .overview-box {
    margin-right: 0 !important;
  }
}
.light-config .el-date-editor .el-range-separator {
  padding: 0;
}
.overview-panel {
  .el-form-item {
    .el-radio__inner {
      border: 1px solid #cdd8f7;
      background: transparent;
    }
    .el-input__inner {
      background: #162456;
      border: 1px solid #475a9a;
      border-radius: 2px;
      // color: #cdd8f7;
      @include font_color('mainFontColor11');
    }
    .el-radio__input.is-checked .el-radio__inner {
      background: #517af0;
    }
    .el-input-number {
      width: 100%;
      line-height: 40px;
      height: 40px;
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

.work-mode-config,
.light-config {
  .el-input__inner {
    // color: #cdd8f7;
    @include font_color('mainFontColor11');
  }
}
// .work-mode-config,
// .light-config {
//   .overview-box {
//     padding: 10px !important;
//   }
// }
.overview-box .box-head {
  // padding: 10px !important;
  width: 100%;
}

// 表单校验错误提示

.parameter-setting{
  .el-form-item__error{
    top: 35px;
  }
  .overview-box{
    .el-form-item__error{
      top: 74px;
    }
    .form-body {
      .el-form-item__error{
        top: 34px;
      }
    }
    .form-item-row{
      .el-form-item__error{
        top: 36px;
      }
    }
  }
  .light-config{
    .el-form-item__error{
      top: 38px;
    }
  }
  .el-form-item_bottom{
    margin-bottom: 5px !important;
    .el-form-item__error{
        top: 40px;
      }
  }
}
.overview-panel {
  .el-form-item {
    .el-radio__inner {
      border: 1px solid #cdd8f7;
      background: transparent;
    }
    .el-input__inner {
      background: #162456;
      border: 1px solid #475a9a;
      border-radius: 2px;
      // color: #cdd8f7;
      @include font_color('mainFontColor11');
    }
    .el-radio__input.is-checked .el-radio__inner {
      background: #517af0;
    }
    .el-input-number {
      width: 100%;
      line-height: 40px;
      height: 40px;
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
 .win-title {
    font-size: 12px;
    // color: #cdd8f7;
    @include font_color('mainFontColor11');
    line-height: 15px;
    margin-bottom: 10px;
    display: inline-block;
  }
ul {
  list-style-type: none;
  margin: 0;
}
.template {
  .template-item {
    margin-bottom: 10px;
    color: rgb(205, 216, 247);
    cursor: pointer;
    &:hover{
    color: #409eff;
    }
  }
}
.header {
  .title {
    // color: #fff;
    @include font_color('mainFontColor2');
  }
  .unit-list {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    .unit-item {
      margin-left: 20px;
      margin-bottom: 10px;
      padding: 8px 15px;
      font-size: 12px;
      border-radius: 4px;
      color: #fff;
      background-image: linear-gradient(180deg, #0090E7 0%, #0090E7 100%);
    }
  }
}
.allcheckContent {
  // color: #cdd8f7;
  @include font_color('mainFontColor11');
  margin-bottom: 10px;
}
.nav {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 20px;
  .parameter-template {
    display: flex;
    // color: #cdd8f7;
    @include font_color('mainFontColor11');
    .current {
      color: #409eff;
    }
  }
}
.btn-border,
.btn-blue,
.btn-red {
  padding: 5px 15px;
  margin-left: 10px;
}
.row-box {
  margin-bottom: 20px;
  width: 100%;
}

.multi-unit-setting {
  // overflow: scroll;
  // &::-webkit-scrollbar {
  //   display: none;
  // }
}
.main {
  display: flex;
  flex-wrap: wrap;
  // min-width: 1680px;
}
.overview-box {
  // height: 418px;
  margin-bottom: 20px;
  margin-right: 20px;
  // width: 20%;
  // width: 320px;
  flex: 1;
  min-width: 10%;
  &:nth-child(5n) {
    // margin-right: 0;
  }
  .title {
    font-size: 12px;
    // color: #cdd8f7;
    @include font_color('mainFontColor11');
  }
}
.box-head {
  width: 100%;
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
.overview-panel {
  border-radius: 4px;
  background: #27376f;
  overflow: hidden;
  .el-form-item {
    margin-bottom: 0;
  }
  .box-body {
    font-size: 12px;
    padding: 10px 20px;
    .form-title {
      .title {
        // color: #cdd8f7;
        @include font_color('mainFontColor11');
      }
    }
    .form-body {
      display: flex;
      // align-items: center;
      // color: #cdd8f7;
      @include font_color('mainFontColor11');
      margin-bottom: 10px;
      .label {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        height: 36px;
      }
    }
  }
}
.work-mode-config,
.light-config {
  margin-left: 20px;
  border-radius: 4px;
  background: #27376f;
  overflow: hidden;
  .manual-temp {
    display: flex;
    .title {
      position: relative;
      top: 10px;
      font-size: 12px;
      margin-right: 10px;
    }
    .manual-temp-inp {
      width: 150px;
    }
  }
}
.work-mode-config,
.light-config {
  .overview-box {
    padding: 20px;
    .title {
      margin-bottom: 20px;
    }
  }
  .overview-radio {
    margin-bottom: 20px;
  }
}
.light-config {
  margin: 0;
  height: 681px;
  .form-time-item {
    display: flex;
  }
  .time-picker {
    width: 40%;
    .el-input__inner {
      text-align: center;
    }
  }
}
</style>

