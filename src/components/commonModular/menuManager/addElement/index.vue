<template>
  <div class="dialog addElementDIalog" :class="dialogDtatus ? 'dialog-block' : 'dialog-hidden'">
    <div
      v-loading="loading"
      class="dialog-body Highlight"
    >
      <!-- 头部 -->
      <div class="dialog-head addedTitle2">
        <span>{{ data.type === 'addElement' ? '新增资源' : '编辑资源' }}</span>
        <div class="dialog-head-close" @click="close"><i class="iconfont">&#xe61a;</i></div>
      </div>

      <!-- 内容 -->
      <div class="dialog-container">
        <div class="dialog-container-row">
          <div class="dialog-container-row-title">
            <span><i class="dialog-container-row-sign">*</i>资源编码</span>
          </div>
          <input v-model="codeValue" class="dialog-container-row-put inputStyle" type="text" placeholder="请输入资源编码">
        </div>

        <div class="dialog-container-row">
          <div class="dialog-container-row-title">
            <span><i class="dialog-container-row-sign">*</i>资源类型</span>
          </div>
          <div class="dialog-container-row-col">
            <input
              v-model="typeValue"
              class="dialog-container-row-put inputStyle dialog-container-row-select"
              type="text"
              readonly="readonly"
              placeholder="请选择资源类型"
              @focus="putFocus(true, 'type')"
              @blur="putFocus(false, 'type')"
            >
            <ul v-show="typeStatus">
              <!-- <li
                                v-for="(i, index) in elementList"
                                :key="index"
                                @click="selectContent(i, 'type')"
                            >{{i.title}}</li> -->
              <li @click="selectContent('URI', 'type')">URI</li>
              <li @click="selectContent('BUTTON', 'type')">BUTTON</li>
              <li @click="selectContent('HttpRestful', 'type')">HttpRestful</li>
              <li @click="selectContent('WebService', 'type')">WebService</li>
            </ul>
            <i class="iconfont iconfont-direction1" :class="typeStatus ? 'iconfont-direction2' : ''">&#xe632;</i>
          </div>
        </div>
        <div class="dialog-container-row">
          <div class="dialog-container-row-title">
            <span><i class="dialog-container-row-sign">*</i>资源名称</span>
          </div>
          <input v-model="nameValue" class="dialog-container-row-put inputStyle" type="text" placeholder="请输入资源名称">
        </div>
        <div class="dialog-container-row">
          <div class="dialog-container-row-title">
            <span><i class="dialog-container-row-sign">*</i>资源地址</span>
          </div>
          <input v-model="addressValue" class="dialog-container-row-put inputStyle" type="text" placeholder="请输入资源地址">
        </div>

        <div class="dialog-container-row">
          <div class="dialog-container-row-title">
            <span><i class="dialog-container-row-sign">*</i>资源请求类型</span>
          </div>
          <div class="dialog-container-row-col">
            <input
              v-model="typeValue2"
              class="dialog-container-row-put inputStyle dialog-container-row-select"
              type="text"
              readonly="readonly"
              placeholder="请选择资源类型"
              @focus="putFocus(true, 'type2')"
              @blur="putFocus(false, 'type2')"
            >
            <ul v-show="typeStatus2">
              <li @click="selectContent('GET', 'type2')">GET</li>
              <li @click="selectContent('PUT', 'type2')">PUT</li>
              <li @click="selectContent('POST', 'type2')">POST</li>
              <li @click="selectContent('DELETE', 'type2')">DELETE</li>
            </ul>
            <i class="iconfont iconfont-direction1" :class="typeStatus2 ? 'iconfont-direction2' : ''">&#xe632;</i>
          </div>
        </div>

      </div>

      <!-- 底部 -->
      <div class="dialog-foot">
        <button-list
          :btn-list="btnList"
          @btn-added="confirm"
          @btn-edit="close"
        />
      </div>

    </div>
    <div class="dialog-close" @click="close" />

  </div>
</template>
<script>
import buttonList from '@/components/ElementComponent/button'

import {
  addMentElementList,
  editMentElementList
} from '@/http/api/menuInfo'

export default {
  components: {
    buttonList
  },
  data() {
    return {
      // 弹框动画
      dialogDtatus: true,
      upDate: true,
      btnList: [
        {
          name: '取消',
          class: 'btn-border',
          size: '90',
          event: 'edit'
        }, {
          name: '保存',
          class: 'btn-blue',
          size: '90',
          event: 'added'
        }
      ],
      // 编码
      codeValue: '',
      // 类型
      typeValue: '',
      typeStatus: false,
      // 名称
      nameValue: '',
      // 地址
      addressValue: '',
      // 资源类型
      typeValue2: '',
      typeStatus2: false,

      // 延时器
      timeOuter: null,
      loading: false

    }
  },
  mounted() {
    if (this.upDate) {
      this.upDate = !this.upDate
      this.init()
    }
  },
  methods: {
    // 初始化数据
    init() {
      // 编辑模式，初始化内容
      if (this.data.type === 'editElement' && this.data.childrenInfo) {
        this.codeValue = this.data.childrenInfo.code
        this.typeValue = this.data.childrenInfo.type
        this.nameValue = this.data.childrenInfo.name
        this.addressValue = this.data.childrenInfo.uri
        this.typeValue2 = this.data.childrenInfo.method
      }
    },
    // 提交
    confirm() {
      // this.data.handleOk('test提交')
      if (!this.codeValue) { this.$message({ message: '请输入资源编码', type: 'error' }); return }
      if (!this.typeValue) { this.$message({ message: '请选择资源类型', type: 'error' }); return }
      if (!this.nameValue) { this.$message({ message: '请输入资源名称', type: 'error' }); return }
      if (!this.addressValue) { this.$message({ message: '请输入资源地址', type: 'error' }); return }
      if (!this.typeValue2) { this.$message({ message: '请选择资源请求类型', type: 'error' }); return }

      if (this.data.type === 'addElement') {
        this.addElement()
      } else if (this.data.type === 'editElement') {
        this.editElement()
      }
    },
    // 新增要素
    async addElement() {
      this.loading = true
      const n = this.codeValue.indexOf(':')
      const codes = n > -1 ? this.codeValue.split(':')[1] : this.codeValue
      const new_code = this.data.parentInfo.code + ':' + codes
      const data = {
        appCode: this.data.parentInfo.appCode,
        code: new_code,
        menuId: this.data.parentInfo.id,
        method: this.typeValue2,
        name: this.nameValue,
        type: this.typeValue,
        uri: this.addressValue
      }
      await addMentElementList(data).then((res) => {
        this.loading = false
        if (res && res.status === 200) {
          this.data.handleOk(res.data)
          this._close()
        } else {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'error'
          })
        }
        // setTimeout(()=>{
        //     this._close();
        // }, 1000)
      }).catch(() => {
        this.loading = false
      })
    },
    // 编辑要素
    async editElement() {
      this.loading = true
      const n = this.codeValue.indexOf(':')
      const codes = n > -1 ? this.codeValue.split(':')[1] : this.codeValue
      const new_code = this.data.parentInfo.code + ':' + codes
      const data = {
        appCode: this.data.parentInfo.appCode,
        code: new_code,
        id: this.data.childrenInfo.id,
        menuId: this.data.parentInfo.id,
        method: this.typeValue2,
        name: this.nameValue,
        type: this.typeValue,
        uri: this.addressValue
      }
      await editMentElementList(data, data.id).then((res) => {
        this.loading = false
        if (res && res.status === 200 && res.rel) {
          this.$message.success('保存成功！')
          this.data.handleOk()
          this._close()
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    // 关闭
    close() {
      this.dialogDtatus = false
      setTimeout(() => { this._close() }, 300)
    },
    // 失焦
    putFocus(s, name) {
      clearTimeout(this.timeOuter)
      this.timeOuter = setTimeout(() => {
        if (name === 'type') {
          this.typeStatus = s
          this.typeStatus2 = false
        } else if (name === 'type2') {
          this.typeStatus2 = s
          this.typeStatus = false
        }
      }, 150)
    },
    // 选择下拉框
    selectContent(v, name) {
      if (name === 'type') { this.typeValue = v } else if (name === 'type2') { this.typeValue2 = v }
    }

  }
}
</script>
<style lang="scss">
@import "@/style/_handle.scss";
.addElementDIalog{
  .inputStyle{
    @include font_color('formColor');
    @include background('formBackgroundColor');
    @include border_color('formBorderColor');
  }
  .inputStyle:hover, .inputStyle:focus{
    @include border_color('formBorderColor');
  }
}
</style>
<style lang="scss" scoped>
.dialog-container::-webkit-scrollbar{
    display: none;
}
.addedTitle2{
  @include font_color('formColor');
  @include border_bottom_color('formBorderColor')
}
.dialog-container{
    min-width: 400px;
    // min-height: 200px;
    // max-height: 70vh;
    // overflow-x: auto;
    margin: 30px 30px 18px 30px;

    &-row{
        display: flex;
        margin-bottom: 12px;

        &-sign{
            position: absolute;
            color: #F56C6C;
            left: -10px;
        }
        &-title{
            // display: inline-block;
            width: 108px;
            text-align: right;
            vertical-align: middle;
            float: left;
            font-size: 14px;
            // color: #606266;
            // color: rgb(205, 216, 247);
            @include font_color('dialog_container_rowtitle');
            line-height: 40px;
            padding: 0 12px 0 0;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            font-weight: 600;
            span{
                position: relative;
            }
        }
        &-put{
            flex: 1;
            height: 36px;
            line-height: 36px;
            font-size: 12px;
        }
        &-col{
            flex: 1;
            position: relative;
            ul{
                list-style:none;
                border: 1px solid;
                @include font_color('addedTitle');
                @include border_color('dialog_container_colBorder');
                width: 100%;
                position: absolute;
                z-index: 999;
                max-height: 30vh;
                // background: #00113A;
                @include background('dialog_container_colBg');
                padding: 5px 0;
                overflow-x: auto;
                font-size: 12px;
                li{
                    padding: 0 15px;
                    height: 34px;
                    line-height: 34px;
                }
                li:hover{
                    // background-color: var(--liBg);
                    @include background('dialog_container_LIhoverBG');
                }
            }
        }
        &-select{
            width: 100%;
            &-icon{
                @include font_color('addedTitle');
            }
        }
        &-text{
            height: 100px;
        }
    }
}
.iconfont-direction1{
    position: absolute;
    font-size: 14px;
    top: 11px;
    right:10px;
    transform:rotate(0deg);
    transition: all .3s;
    @include font_color('addedTitle');
}
.iconfont-direction2{
    transform:rotate(-180deg);
    transition: all .3s;
    @include font_color('addedTitle');
}

.el-form-block{
    .el-textarea__inner{
        height: 100px !important;
    }
}

</style>
