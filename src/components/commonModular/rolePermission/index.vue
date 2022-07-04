<template>
  <div class="rolePermission">
    <!-- 头部查询 -->
    <navForm
      ref="navForm"
      class="firstAssembly"
      :data="navFormInfo.data"
      :field-list="navFormInfo.fieldList"
    />
    <div class="main Highlight">
      <!-- 头部编辑 -->
      <navForm
        ref="navForm"
        class="navfrom"
        :data="navform.data"
        :field-list="navform.fieldList"
      />
      <div class="content">

        <!-- 列表树 -->
        <div class="ct-left element-tree overfolw">
          <el-tree
            v-loading="loadingTree"
            :data="roldList"
            :props="defaultProps"
            highlight-current
            @node-click="switchTree"
          />
        </div>

        <!-- 表单 -->
        <div class="ct-right overfolw">
          <div class="ct-right-body">
            <div class="user-jurisdiction">
              <div class="user-jurisdiction-row">
                <div class="user-jurisdiction-row-title">
                  <span><i class="user-jurisdiction-row-sign">*</i>名称</span>
                </div>
                <input v-model="tableName" :class="disabledStatus ? 'user-jurisdiction-row-disabled put-disabled put-disabled' :'user-jurisdiction-row-put inputStyle'" type="text" placeholder="请输入名称" :disabled="disabledStatus">
              </div>
              <div class="user-jurisdiction-row">
                <div class="user-jurisdiction-row-title">
                  <span><i class="user-jurisdiction-row-sign">*</i>编码</span>
                </div>
                <input v-model="tableCode" :class="disabledStatus ? 'user-jurisdiction-row-disabled put-disabled' :'user-jurisdiction-row-put inputStyle'" type="text" placeholder="请输入编码" :disabled="disabledStatus">
              </div>
              <div class="user-jurisdiction-row">
                <div class="user-jurisdiction-row-title">
                  <span><i class="user-jurisdiction-row-sign">*</i>类型</span>
                </div>
                <div class="user-jurisdiction-row-col">
                  <!-- class="user-jurisdiction-row-put user-jurisdiction-row-select user-jurisdiction-row-disabled put-disabled"  -->
                  <input
                    v-model="tableTypeName"
                    class="user-jurisdiction-row-select"
                    :class="disabledStatusType ? 'user-jurisdiction-row-disabled put-disabled' :'user-jurisdiction-row-put inputStyle'"
                    type="text"
                    readonly="readonly"
                    placeholder="请选择类型"
                    :disabled="disabledStatusType"
                    @focus="putFocus(true, 'type')"
                    @blur="putFocus(false, 'type')"
                  >
                  <ul v-show="typeStatus">
                    <li @click="selectContent('INNER_ACCOUNT=应用角色', 'type')">应用角色</li>
                    <li @click="selectContent('EXTERNAL_ACCOUNT=外部角色', 'type')">外部角色</li>
                  </ul>
                  <i class="iconfont iconfont-direction1" :class="typeStatus ? 'iconfont-direction2' : ''">&#xe632;</i>
                </div>
              </div>
              <div class="user-jurisdiction-row">
                <div class="user-jurisdiction-row-title">
                  <span>排序</span>
                </div>
                <input v-model="tableSort" :class="disabledStatusSort ? 'user-jurisdiction-row-disabled put-disabled' :'user-jurisdiction-row-put inputStyle'" type="text" placeholder="请输入排序" :disabled="disabledStatusSort">
              </div>
              <div class="user-jurisdiction-row">
                <div class="user-jurisdiction-row-title">
                  <span>目录</span>
                </div>
                <input v-model="tableCatalog" class="user-jurisdiction-row-disabled put-disabled" type="text" placeholder="请输入目录" disabled>
              </div>
              <div class="user-jurisdiction-row">
                <div class="user-jurisdiction-row-title">
                  <span>描述</span>
                </div>
                <textarea v-model="tableDesc" class="user-jurisdiction-row-text" :class="disabledStatus ? 'user-jurisdiction-row-disabled put-disabled' :'user-jurisdiction-row-put inputStyle'" type="text" placeholder="请输入描述" rows="3" :disabled="disabledStatus" />
              </div>
            </div>
            <div class="ct-right-foot">
              <button-list
                :btn-list="btnList"
                @btn-added="addEd"
                @btn-added2="toUpdate"
                @btn-edit="cancel"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navForm from '@/components/commonComponent/navForm/index.vue'
import buttonList from '@/components/ElementComponent/button'

import {
  getGroupTypeId,
  getGroupTree,
  userGetGroupTree,
  getGroupInfo,
  getAddGroupInfo,
  getEditGroupInfo,
  getDeleteGroupInfo
} from '@/http/api/jurisdiction'

import Dialog from '@/components/dialog/dialog.js'
import Jurisdiction from './jurisdiction'
import User from './user'

import { getConfigElement } from '@/utils/overtService'

export default {
  components: {
    navForm,
    buttonList
  },
  props: {
    appCode: String,
    code: String
  },
  data() {
    return {
      // 角色类型 - groupType
      userType: '',
      roldList: [],
      roldindex: null,
      isLoading: false,
      // 查询重置
      navFormInfo: {
        data: { name: '' },
        fieldList: {
          left: {
            inpLists: [{
              key: 'name',
              type: 'input',
              required: true,
              className: 'shadow',
              placeholder: '请输入角色/用户名'
            }],
            btnLists: [
              {
                innerText: '按角色查询',
                className: 'btn-blue',
                handleClick: this.btnQueryRole
              }, {
                innerText: '按用户名查询',
                className: 'btn-blue',
                handleClick: this.btnQueryName
              }, {
                innerText: '重置',
                className: 'btn-border',
                handleClick: this.btnReset
              }
            ]
          }
        }
      },
      // 新增编辑
      navform: {
        data: {
          name: '' // *名称
        },
        fieldList: {
          left: { btnLists: [] }
        }
      },
      // 按钮控制
      titleBtnStatus: false,
      titleBtnList: [],
      titleBtnList1: [],
      titleBtnList2: [],
      // 树形列表配置
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 按角色查询
      queryName: '',
      // 按用户名查询
      // 选择列表数据
      selectRowInfo: '',

      /** **************表单************************ */
      // 名称
      tableName: '',
      // 编码
      tableCode: '',
      // 类型
      tableType: '',
      tableTypeName: '',
      typeStatus: false,
      // 排序
      tableSort: '',
      // 目录
      tableCatalog: '',
      // 描述
      tableDesc: '',
      // 延时器
      timeOuter: '',
      // 是否禁用输入框
      disabledStatus: true,
      disabledStatusType: true,
      disabledStatusSort: true,
      // 新增、编辑按钮
      btnList: [],
      btnAddList: [
        {
          name: '取消',
          class: 'btn-border',
          size: '60',
          event: 'edit'
        },
        {
          name: '保存',
          class: 'btn-blue',
          size: '60',
          event: 'added'
        }
      ],
      btnEditList: [
        {
          name: '取消',
          class: 'btn-border',
          size: '60',
          event: 'edit'
        },
        {
          name: '更新',
          class: 'btn-blue',
          size: '60',
          event: 'added2'
        }
      ],
      loadingTree: true,
      loadingFrom: false,
      powerLitst: null
    }
  },
  mounted() {
    this.initPower()
    this.btnHideen()
    this.groupTypeId()
  },
  methods: {
    initPower() {
      this.powerLitst = getConfigElement(this.code)
      const btnAr = [
        { innerText: '新增', className: 'btn-blue', handleClick: this.btnAdd, authCode: '' },
        { innerText: '编辑', className: 'btn-blue-disabled', handleClick: this.btnNull, authCode: '' },
        { innerText: '删除', className: 'btn-red-disabled', handleClick: this.btnNull, authCode: '' },
        { innerText: '分配权限', className: 'btn-blue-disabled', handleClick: this.btnNull, authCode: '' },
        { innerText: '分配用户', className: 'btn-blue-disabled', handleClick: this.btnNull, authCode: '' }
      ]
      const btnArr = [
        { innerText: '新增', className: 'btn-blue', handleClick: this.btnAdd, authCode: '' },
        { innerText: '编辑', className: 'btn-blue', handleClick: this.btnEdit, authCode: '' },
        { innerText: '删除', className: 'btn-red', handleClick: this.btnDelete, authCode: '' },
        { innerText: '分配权限', className: 'btn-blue', handleClick: this.btnJurisdiction, authCode: '' },
        { innerText: '分配用户', className: 'btn-blue', handleClick: this.btnUser, authCode: '' }
      ]
      if (this.powerLitst) {
        btnAr[0].authCode = btnArr[0].authCode = this.powerLitst.btn_add ? this.powerLitst.btn_add.code : 'a:a'
        btnAr[1].authCode = btnArr[1].authCode = this.powerLitst.btn_edit ? this.powerLitst.btn_edit.code : 'a:a'
        btnAr[2].authCode = btnArr[2].authCode = this.powerLitst.btn_del ? this.powerLitst.btn_del.code : 'a:a'
        btnAr[3].authCode = btnArr[3].authCode = this.powerLitst.btn_resourceManager ? this.powerLitst.btn_resourceManager.code : 'a:a'
        btnAr[4].authCode = btnArr[4].authCode = this.powerLitst.btn_userManager ? this.powerLitst.btn_userManager.code : 'a:a'
      }
      this.titleBtnList1 = btnAr
      this.titleBtnList2 = btnArr
    },
    // 查询-角色
    btnQueryRole() {
      if (this.navFormInfo.data.name) {
        this.queryName = this.navFormInfo.data.name // encodeURI(this.navFormInfo.data.name);
      }
      this.groupTree()
    },
    // 重置
    btnReset() {
      this.navFormInfo.data.name = ''
      this.queryName = ''
      this.selectRowInfo = null

      this.tableName = ''
      this.tableCode = ''
      this.tableType = ''
      this.tableSort = ''
      this.tableDesc = ''
      this.tableCatalog = ''
      this.tableTypeName = ''
      this.titleBtnStatus = false
      this.groupTree()
      this.btnHideen()
    },
    btnNull() {},
    // 新增
    btnAdd() {
      this.putDisabled('add')

      this.tableName = ''
      this.tableCode = ''
      this.tableType = ''
      this.tableSort = ''
      this.tableDesc = ''
      this.tableTypeName = ''
      this.tableCatalog = this.selectRowInfo.name || ''
    },
    // 编辑
    btnEdit() {
      this.putDisabled('edit')
      this.fillTable()
    },
    // 删除
    btnDelete() {
      if (this.selectRowInfo) {
        this.deleteListTree()
      } else {
        // this.$message.error('Net Work')x
      }
    },
    // 分配权限
    btnJurisdiction() {
      const options = {
        appCode: this.appCode,
        rows: this.selectRowInfo,
        powerLitst: this.powerLitst,
        closeDialog: () => { },
        handleOk: (e) => {},
        childs: Jurisdiction
      }
      Dialog(options)
    },
    // 分配用户
    btnUser() {
      const options = {
        rows: this.selectRowInfo,
        powerLitst: this.powerLitst,
        closeDialog: () => { },
        handleOk: (e) => {},
        childs: User
      }
      Dialog(options)
    },
    // 新增 - 保存
    addEd() {
      if (!this.tableName) { this.$message.error('请输入名称'); return } else if (!this.tableCode) { this.$message.error('请输入编码'); return } else if (!this.tableType) { this.$message.error('请选择类型'); return }
      this.addlistTree()
      this.cancel()
      this.putDisabled('delete')
    },
    // 编辑 - 更新
    toUpdate() {
      if (this.selectRowInfo) {
        this.editListTree()
        this.cancel()
        this.putDisabled('delete')
      } else {
        // this.$message.error('Net Work')
      }
    },
    // 取消新增、编辑
    cancel() {
      this.fillTable()
      this.putDisabled('cancel')
    },
    // 禁用输入框
    putDisabled(type) {
      if (type === 'add') {
        this.disabledStatus = false
        this.disabledStatusType = false
        this.disabledStatusSort = true

        this.btnList = this.btnAddList
      } else if (type === 'edit') {
        this.disabledStatus = false
        this.disabledStatusType = true
        this.disabledStatusSort = false

        this.btnList = this.btnEditList
      } else if (type === 'cancel') {
        this.disabledStatus = true
        this.disabledStatusType = true
        this.disabledStatusSort = true
        this.btnList = []
      } else if (type === 'delete') {
        this.tableName = ''
        this.tableCode = ''
        this.tableType = ''
        this.tableSort = ''
        this.tableDesc = ''
        this.tableTypeName = ''
        this.tableCatalog = ''
      }
    },
    // 编辑、重置按钮隐藏
    btnHideen() {
      if (this.titleBtnStatus) {
        this.navform.fieldList.left.btnLists = this.titleBtnList2
      } else {
        this.navform.fieldList.left.btnLists = this.titleBtnList1
      }
    },
    // select下拉框
    selectContent(val, type) {
      if (type === 'type') {
        this.tableType = val.split('=')[0]
        this.tableTypeName = val.split('=')[1]
      }
    },
    // 失焦
    putFocus(s, name) {
      clearTimeout(this.timeOuter)
      this.timeOuter = setTimeout(() => {
        if (name === 'type') {
          this.typeStatus = s
        }
      }, 150)
    },
    // 填充表单
    fillTable() {
      if (this.selectRowInfo) {
        this.tableName = this.selectRowInfo.name
        this.tableCode = this.selectRowInfo.code
        this.tableType = this.selectRowInfo.type
        this.tableSort = this.selectRowInfo.orderNum
        this.tableDesc = this.selectRowInfo.description

        const typeName = this.selectRowInfo.type === 'INNER_ACCOUNT' ? '应用角色' : '外部角色'
        this.tableTypeName = typeName
        this.tableCatalog = this.selectRowInfo.name
      }
    },
    // 新增
    async addlistTree() {
      this.loadingFrom = true
      const data = {
        appCode: this.appCode,
        code: this.tableCode,
        description: this.tableDesc,
        groupType: this.userType.id,
        mullu: this.tableCatalog || '',
        name: this.tableName,
        parentId: this.selectRowInfo.id || '-1',
        type: this.tableType
      }

      await getAddGroupInfo(data).then((res) => {
        this.loadingFrom = false
        if (res && res.status === 200 && res.rel) {
          this.$message.success('保存成功！')
          this.groupTree()
        } else { this.$message.error(res.message) }
      }).catch(() => {
        this.loadingFrom = false
      })
    },
    // 编辑
    async editListTree() {
      this.loadingFrom = true
      const data = JSON.parse(JSON.stringify(this.selectRowInfo))
      data.name = this.tableName
      data.mullu = this.tableName
      data.code = this.tableCode
      data.description = this.tableDesc
      data.orderNum = this.tableSort
      await getEditGroupInfo(data, this.selectRowInfo.id).then((res) => {
        this.loadingFrom = false
        if (res && res.status === 200 && res.rel) {
          this.$message.success('保存成功！')
          this.groupTree()
        } else { this.$message.error(res.message) }
      }).catch(() => {
        this.loadingFrom = false
      })
    },
    // 删除
    async deleteListTree() {
      this.$confirm('此操作将删除这些数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        confirmButtonClass: 'btn-blue btn-blue-confirm',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loadingTree = true
        getDeleteGroupInfo({}, this.selectRowInfo.id).then((res) => {
          if (res && res.status === 200 && res.rel) {
            this.$message.success('删除成功')
            this.putDisabled('delete')
            this.groupTree()
          } else { this.$message.error(res.message) }
        }).catch(() => {
          this.loadingTree = false
        })
      }).catch(() => {
      })
      // return
      // this.loadingTree = true
      // await getDeleteGroupInfo({}, this.selectRowInfo.id).then((res) => {
      //   if (res && res.status === 200 && res.rel) {
      //     this.$message.success('删除成功')
      //     this.putDisabled('delete')
      //     this.groupTree()
      //   } else { this.$message.error(res.message) }
      // }).catch(() => {
      //   this.loadingTree = false
      // })
    },
    // 点击列表树
    async switchTree(i) {
      if (!this.powerLitst.view) {
        this.$message.error('暂无权限')
        return
      }
      this.loadingFrom = true
      await getGroupInfo({}, i.id).then((res) => {
        this.loadingFrom = false
        if (res && res.status === 200 && res.rel) {
          // this.formInfo.data = res.data;
          this.selectRowInfo = res.data
          this.titleBtnStatus = true
          this.btnHideen()
          this.fillTable()
        } else {
          // this.$message.error('Net Work')
        }
      }).catch(() => {
        this.loadingFrom = false
      })
    },
    // 查询-用户名
    async btnQueryName() {
      this.loadingTree = true
      const data = {
        groupType: this.userType.id,
        userName: encodeURI(this.navFormInfo.data.name),
        appCode: this.appCode
      }
      await userGetGroupTree(data).then((res) => {
        this.loadingTree = false
        if (res) {
          this.roldList = res
        } else {
          // this.$message.error('Net Work')
        }
      }).catch(() => {
        this.loadingTree = false
      })
      // const element = this.powerLitst.get_by_username
      // this.$httpRequest({
      //   type: element.method,
      //   uri: element.uri,
      //   payload: data,
      //   callback: res => {
      //     this.loadingTree = false
      //     if (res) {
      //       if (res.rel === false) {
      //         this.$message.error(res.message)
      //         return
      //       }
      //       this.roldList = res
      //     }
      //   }
      // })
    },
    // 查询列表
    async groupTree() {
      this.loadingTree = true
      const data = {
        groupType: this.userType.id,
        name: '',
        appCode: this.appCode
      }
      if (this.queryName) { data.name = this.queryName }
      await getGroupTree(data).then((res) => {
        this.loadingTree = false
        if (res) {
          this.roldList = res
        } else {
          // this.$message.error('Net Work')
        }
      }).catch(() => {
        this.loadingTree = false
      })
      // const element = this.powerLitst.view
      // this.$httpRequest({
      //   type: element.method,
      //   uri: '/admin/group/tree',
      //   payload: data,
      //   callback: res => {
      //     this.loadingTree = false
      //     if (res) {
      //       this.roldList = res
      //     }
      //   }
      // })
    },
    // 获取角色信息 - groupType
    async groupTypeId() {
      const data = {
        appCode: this.appCode
      }
      this.isLoading = true
      await getGroupTypeId(data).then((res) => {
        if (res) {
          this.userType = res[0]
          this.groupTree()
        }
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
    }

  }
}
</script>
<style lang="scss">
.rolePermission{
  .inputStyle{
    @include font_color('addedTitle');
    @include background('addDIalog_inputStyle');
    @include border_color('addedTitle_bottomborder');
  }
  .inputStyle:hover, .inputStyle:focus{
    @include border_color('addedTitle_bottomborder');
  }
  .inputStyle::placeholder{
    @include font_color('inputStyle_placeholder');
  }
  .put-disabled{
    @include background('role_disabledBG');
  }
}
</style>
<style lang="scss" scoped>
@import "@/style/_handle.scss";
.rolePermission{
  .firstAssembly{
    /* margin-left: -30px;
    margin-top: -30px; */
  }
  .main{
    position: relative;
    background: rgba(0,29,69,1);
    z-index: 100;
    padding: 20px;
    box-sizing: border-box;
    /* margin-left: -30px; */
    // margin-top: 10px;
    height: calc(100vh - 185px);
  }
  .navfrom{
    // margin-bottom: 20px;
  }
  .content{
    display: flex;
    overflow: hidden;
    overflow-y: auto;
    overflow-x: auto;
    height: calc(100% - 45px);
  }
  .ct-left{
    min-width: 320px;
    width: 320px;
    max-height: calc(100vh - 252px);
    overflow: hidden;
    overflow-y: auto;
    @include background('menu_container_l');
    // background: rgba(38, 54, 118, 0.5);
  }
  .ct-right{
    flex: 1;
    // min-width: 400px;
    // margin: 0 auto;
    // overflow: hidden;
    overflow-y: auto;
    &-body{
      width: 75%;
      min-width: 400px;
      margin: 0 auto;
    }
    &-foot{
      text-align: right;
      margin-right: -10px
    }
  }

  // 表单
  .user-jurisdiction{
    color: #EBEEF5;
    &-row{
      display: flex;
      margin-bottom: 22px;
      &-sign{
        position: absolute;
        color: #F56C6C;
        left: -10px;
      }
      &-title{
        display: inline-block;
        width: 120px;
        text-align: right;
        vertical-align: middle;
        float: left;
        font-size: 14px;
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
      &-disabled{
        flex: 1;
        height: 36px;
        line-height: 36px;
        border-radius: 2px;
        outline:none;
        padding: 0 15px;
        font-size: 12px;
        // background: #1d2c4c;
        @include background('role_disabledBG');
        border: 1px solid;
        @include border_color('role_disabled_border');
        @include font_color('disabled_font_color');
        cursor: no-drop;
        &::placeholder{
          @include font_color('inputStyle_placeholder');
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
            font-family: Avenir, Helvetica, Arial, sans-serif;
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
}
</style>
<style lang="scss">
.rolePermission{
  // el-tree 样式
  .element-tree{
    .el-tree{
        // border-radius: 10px;
        padding: 20px 10px 40px 10px;
        box-sizing: border-box;
        background: transparent;
        // height: calc(100vh - 280px);
        // max-height: calc(100vh - 280px);
        // margin-bottom: 86px;
        // border: 1px solid red;
    }
    .el-tree-node__content{
        border-radius: 4px;
        margin: 0 10px;
        margin-top: 14px;
        color: #A5AEC8;
        height: 36px;
    }
  }
}
</style>
