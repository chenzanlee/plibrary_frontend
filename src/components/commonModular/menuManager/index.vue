<template>

  <div class="home">

    <div class="menu-container-head" style="display: flex; justify-content: space-between;">
      <!-- 新增，编辑，删除 -->
      <button-list
        :btn-list="btnList"
        :selection="selection"
        @btn-added="btnAdded"
        @btn-edit="btnEdit"
        @btn-delete="btnDelete"
      />

      <div class="menu-container-header">
        <!-- 查询，重置，新增元素 -->
        <span>资源名称</span>
        <span class="menu-container-header-input"><input v-model="resourcesName" class="inputStyle" type="text" placeholder="请输入资源名称"></span>
        <button class="menu-container-header-btn btn-blue " @click="btnQuery">查询</button>
        <button class="menu-container-header-btn btn-border" @click="btnReset">重置</button>
        <button v-show="powerLitst && powerLitst.btn_element_add" class="menu-container-header-btn btn-blue" @click="btnAddElement">新增元素</button>
      </div>
    </div>

    <div class="menu-container">
      <!-- 树形目录 -->
      <div class="menu-container-l element-tree overfolw">
        <el-tree
          v-loading="loadingTree"
          :data="menuData"
          :props="defaultProps"
          node-key="id"
          :default-expanded-keys="defaultKeys"
          highlight-current
          @node-click="handleNodeClick"
        />
      </div>

      <!-- 表单 -->
      <div class="menu-container-r overfolw">
        <tablePage
          :is-loading="loadingTable"
          :columns="columns"
          :data-source="tableShowData"
          :options="options"
          :fetch="fetchTableData"
          :pagination="pagination"
          @handleSizeChange="handleSizeChange"
          @handleIndexChange="handleIndexChange"
          @selection-change="handleSelectionChange"

          @child-removeRow="btnDeleteElement"
          @child-editRow="btnEditElement"
        />
        <!-- @child-addRow='childAddRow'
        @child-seeRow='childSeeRow' -->

        <!-- selection-change 选择框事件-->
        <!-- child-addRow 增加 -->
        <!-- child-removeRow 删除 -->
        <!-- child-editRow 编辑 -->
        <!-- child-seeRow 查看 -->
        <!-- <alert /> -->
      </div>
    </div>
    <!-- Sql消息提示框 -->
    <div class="menuManager-message" :class="addedStatus ? 'menuManager-message2' : ''">
      <i class="iconfont menuManager-message-close" @click="addedStatus = false">&#xe61a;</i>
      <div class="menuManager-message-body">
        <p style="color: rgb(205, 216, 247);margin-bottom: 10px;">请复制下面SQL语句</p>
        <el-input
          v-model="addedMessage"
          type="textarea"
          :rows="15"
          readonly
        />
        <!-- {{ addedMessage }} -->
      </div>
    </div>

  </div>
</template>

<script>
import {
  getElementList,
  // getMenuList,
  deleteMentList,
  deleteMentElementList,
  getMenuListTree,
  getAdminMenu
} from '@/http/api/menuInfo'
import buttonList from '@/components/ElementComponent/button'
import tablePage from '@/components/ElementComponent/iTable'
import { getConfigElement } from '@/utils/overtService'

import Added from './added'
import AddElement from './addElement'
import Dialog from '@/components/dialog/dialog.js'

export default {

  components: {
    buttonList,
    tablePage
  },
  props: {
    appCode: String,
    code: String
  },
  data() {
    return {
      defaultKeys: [],
      // 树形目录
      menuData: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      // 整合树形目录
      menuTreeList: [],
      // 资源要素列表参数
      // 当前选中树的信息
      currentLocation: null,
      // 查询资源名称
      resourcesName: '',
      selection: '',
      // 菜单列表
      // menuDataList:[],

      btnList: [],
      columns: [
        {
          fixed: 'left',
          prop: 'code',
          label: '资源编码',
          align: 'left',
          width: '280'
        },
        {
          prop: 'type',
          label: '资源类型',
          align: 'left',
          minWidth: '100'
        },
        {
          prop: 'name',
          label: '资源名称',
          align: 'left',
          width: '170'
        },
        {
          prop: 'uri',
          label: '资源地址',
          align: 'left',
          width: '280'
        },
        {
          prop: 'method',
          label: '请求类型',
          align: 'left',
          width: '100'
        },
        {
          prop: 'description',
          label: '描述',
          align: 'left'
        },
        {
          button: true,
          label: '操作',
          align: 'center',
          fixed: 'right',
          width: '160', // 操作按钮宽度
          group: [
            {
              name: '编辑',
              class: 'btn-blue',
              // authCode: `${this.appCode}MenuManager:btn_edit`,
              size: 'auto',
              click: 'edit'
            },
            {
              name: '删除',
              class: 'btn-red',
              // authCode: `${this.appCode}MenuManager:btn_element_del`,
              size: 'auto',
              click: 'remove'
            }
          ]
        }
      ],
      tableData: [],
      tableShowData: [],
      // 分页
      pagination: {
        total: 0,
        limit: 10,
        pageIndex: 1
      },
      adminMenuDetail: {},
      options: {
        stripe: false, // 斑马纹
        firstFixed: true, // 首航固定
        mutiSelect: false, // 多选框
        index: false, // 显示序号， 多选则 mutiSelect
        loading: false, // 表格动画
        initTable: true // 是否一挂载就加载数据
      },
      addedMessage: '',
      addedStatus: false,
      loadingTree: true,
      loadingTable: false,
      powerLitst: null,
      addedCode: '',
      editCpde: '',
      delCode: ''
    }
  },
  mounted() {
    document.onkeydown = (e) => {
      if (this.currentLocation && this.resourcesName) {
        if (e.keyCode === 13) {
          this.btnQuery()
        }
      }
    }
    this.init()
    this.getMenuLists()
  },
  beforeRouteLeave(to, form, next) {
    document.onkeydown = null
    next()
  },
  methods: {
    init() {
      this.powerLitst = getConfigElement(this.code)
      const btnArr = [
        { name: '新增', class: 'btn-blue', size: '90', event: 'added', authCode: '' },
        { name: '编辑', class: 'btn-border', size: '90', event: 'edit', authCode: '' },
        { name: '删除', class: 'btn-red', size: '90', event: 'delete', authCode: '' }
      ]

      btnArr[0].authCode = this.powerLitst.btn_add ? this.powerLitst.btn_add.code : 'a:a'
      btnArr[1].authCode = this.powerLitst.btn_edit ? this.powerLitst.btn_edit.code : 'a:a'
      btnArr[2].authCode = this.powerLitst.btn_del ? this.powerLitst.btn_del.code : 'a:a'
      this.btnList = btnArr

      !this.powerLitst.btn_element_edit ? this.columns[this.columns.length - 1].group.shift() : ''
      !this.powerLitst.btn_element_del ? this.columns[this.columns.length - 1].group.pop() : ''

      this.setBtnStatus()
    },
    setBtnStatus() {
      for (const i of this.btnList) {
        if (i.name === '编辑') {
          i.class = this.currentLocation ? 'btn-border' : 'btn-border-disabled'
        } else if (i.name === '删除') {
          i.class = this.currentLocation ? 'btn-red' : 'btn-red-disabled'
        }
      }
    },
    // 新增
    btnAdded() {
      const options = {
        type: 'added',
        parentList: this.menuTreeList,
        childrenInfo: this.currentLocation,
        adminMenuDetail: this.adminMenuDetail,
        closeDialog: (type) => {
          if (type) {
            this.currentLocation = null
            this.setBtnStatus()
            this.tableShowData = []
          }
        },
        handleOk: (v) => {
          this.addedMessage = v
          this.addedStatus = true
          this.getMenuLists()
        },
        childs: Added
      }
      Dialog(options)
    },
    getAdminMenuDetail() {
      getAdminMenu(this.currentLocation.id).then(res => {
        if (res && res.status === 200) {
          this.adminMenuDetail = res.data
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 编辑
    btnEdit() {
      if (!this.currentLocation) {
        return
      }
      const options = {
        type: 'edit',
        parentList: this.menuTreeList,
        parentTree: this.menuData,
        childrenInfo: this.currentLocation,
        adminMenuDetail: this.adminMenuDetail,
        closeDialog: (type) => {
          if (type) {
            this.currentLocation = null
            this.setBtnStatus()
            this.tableShowData = []
          }
        },
        handleOk: (e) => {
          this.getMenuLists()
          this.getAdminMenuDetail()
        },
        childs: Added
      }
      Dialog(options)
    },
    // 删除
    async btnDelete() {
      if (!this.currentLocation) {
        return
      }
      this.$confirm('此操作将删除这些数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        confirmButtonClass: 'btn-blue btn-blue-confirm',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loadingTree = true
        const data = {
          id: this.currentLocation.id
        }
        deleteMentList(data).then((res) => {
          this.loadingTree = false
          if (res && res.status === 200) {
            this.$message.success('删除成功')
            this.getMenuLists()
            this.currentLocation = null
            this.setBtnStatus()
          } else {
            this.$message({ type: 'error', message: res.essage })
          }
        }).catch(() => {
          this.loadingTree = false
        })
      }).catch(() => {
      })
    },

    // 查询
    btnQuery() {
      // if (this.resourcesName) {
      if (this.currentLocation) {
        this.getMenuElementLists()
      } else {
        this.$message({ type: 'warning', message: '请先选择一个菜单' })
      }
      // }
    },
    // 重置
    btnReset() {
      this.resourcesName = null
      this.tableShowData = []
      this.pagination.pageIndex = 1
      this.getMenuElementLists()
    },
    // 新增元素
    btnAddElement() {
      if (!this.currentLocation) {
        this.$message.error('请选择要添加的节点')
        return
      }
      const options = {
        type: 'addElement',
        parentInfo: this.currentLocation,
        closeDialog: () => {
        },
        handleOk: (v) => {
          this.addedMessage = v
          this.addedStatus = true
          this.getMenuElementLists()
        },
        childs: AddElement
      }
      Dialog(options)
    },
    // 编辑元素
    btnEditElement(row, index) {
      if (!this.currentLocation) {
        this.$message.error('请选择要编辑的节点')
        return
      }
      const options = {
        type: 'editElement',
        parentInfo: this.currentLocation,
        childrenInfo: row,
        closeDialog: () => {
        },
        handleOk: (e) => {
          this.getMenuElementLists()
        },
        childs: AddElement
      }
      Dialog(options)
    },
    // 删除元素
    async btnDeleteElement(row, index) {
      this.loadingTable = true
      const data = {}
      await deleteMentElementList(data, row.id).then((res) => {
        this.loadingTable = false
        if (res && res.status === 200 && res.rel) {
          this.$message.success('删除成功')
          this.getMenuElementLists()
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.loadingTable = false
      })
    },

    // 查询菜单的要素列表
    handleNodeClick(data) {
      this.currentLocation = data
      this.pagination.pageIndex = 1
      this.getMenuElementLists()
      this.getAdminMenuDetail()
      this.setBtnStatus()
    },

    // 菜单要素列表
    async getMenuElementLists() {
      this.loadingTable = true
      const data = {
        page: this.pagination.pageIndex,
        limit: this.pagination.limit,
        menuId: this.currentLocation.id,
        appCode: this.currentLocation.appCode
      }
      if (this.resourcesName) {
        data.name = this.resourcesName
        // data.menuId = ''
      }

      await getElementList(data).then((res) => {
        this.loadingTable = false
        if (res && res.status === 200) {
          this.tableData = res.data.rows
          // this.pagination.total = res.data.total
          this.elementPaging()
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.loadingTable = false
      })
    },
    // 菜单列表
    async getMenuLists() {
      this.loadingTree = true
      const data = {
        appCode: this.appCode
      }
      await getMenuListTree(data).then((res) => {
        this.loadingTree = false
        if (!res) {
          // this.$message.error('Net Work')
          return
        }
        this.defaultKeys = []
        this.menuTreeList = []
        this.menuData = res
        this.defaultKeys.push(res[0].id)
        const r = JSON.parse(JSON.stringify(res))

        this.setArr(r)
      }).catch(() => {
        this.loadingTree = false
      })
    },
    setArr(arr) {
      for (const i of arr) {
        this.menuTreeList.push(i)
        if (typeof (i.children) === 'object') {
          this.setArr(i.children)
        }
        // i.children = [];
      }
    },

    // 假分页
    elementPaging() {
      this.pagination.total = this.tableData.length
      this.tableShowData = []
      if (this.pagination.pageIndex * this.pagination.limit > this.tableData.length) {
        this.tableShowData = this.tableData.slice((this.pagination.pageIndex - 1) * this.pagination.limit, this.tableData.length)
      } else {
        this.tableShowData = this.tableData.slice((this.pagination.pageIndex - 1) * this.pagination.limit, this.pagination.pageIndex * this.pagination.limit)
      }
      // if (this.selectElementList && this.tableShowData) {
      //   this.manageChecked()
      // }
    },
    // 分页
    handleIndexChange(current) {
      this.pagination.pageIndex = current
      this.elementPaging()
    },

    handleSizeChange(size) {
      this.pagination.limit = size
      this.elementPaging()
    },
    handleSelectionChange(selection) {
      this.selection = selection
    },
    // 获取表数据方法
    fetchTableData() {
      // alert('触发请求表数据')
    }

  }
}
</script>
<style lang="scss">
@import "@/style/_handle.scss";
.menu-container{
  // display: flex;
  position: relative;
  &-r{
    margin-left: 340px;
    height: calc(100vh - 184px);
    overflow: hidden;
    overflow-y: auto;
  }

  &-l{
    position: absolute;
    top:0;
    left: 0;
    width: 320px;
    height: calc(100vh - 184px);
    overflow: hidden;
    overflow-y: auto;
    @include background('menu_container_l')
    // background: rgba(38, 54, 118, 0.5);
  }

}
.menu-container-head{
  margin-bottom: 10px;
}
.menu-container-header{
  .inputStyle{
    @include font_color('addedTitle');
    @include background('addDIalog_inputStyle');
    @include border_color('addedTitle_bottomborder');
  }
  .inputStyle::placeholder{
      @include font_color('inputStyle_placeholder');
    }
  @include font_color('menu_container_header_font');
  // color: #fff;
  // font-size: 14px;
  &-input{
    display: inline-block;
    position: relative;
    // top: -2px;
    margin-left: 10px;
    input[type=text]{
      height: 36px;
    }
  }
  &-btn{
    width: 90px;
    font-size: var(--size16);
    height: 36px;
    margin-left: 10px !important;
  }
}

.menuManager-message{
  transition: all .3s;
  width: 500px;
  padding: 20px 30px;
  @include background('menuManager_messageBG');
  // background: #1F2A6B;
  border: 1px solid;
  @include border_color('menuManager_message_border');
  // color: #909399;
  @include font_color('menuManager_message_font');
  border-radius: 4px;
  position: fixed;
  top: -400px;
  left: 50%;
  transform: translate(-50%, 0);
  margin: 0 auto;
  z-index: 99999;
  &-close{
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
  }
  &-body{
    word-break:break-all;
    // margin-top: 30px;
  }
  textarea {
    background-color: #08235199;
    color: #999;
    border-color: rgb(51 69 136);
    &:hover {
    border-color: #3a4b8a;
    }
    &:focus {
    border-color: #4e65bb;
    }
  }
}
.menuManager-message2{
  transition: all .3s;
  top: calc(50% - 250px);
}
.menu-container-l .el-tree{
  background: none;
}
</style>
