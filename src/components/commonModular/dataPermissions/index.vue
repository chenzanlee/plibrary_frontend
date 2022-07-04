<template>
  <div class="home">
    <!-- 头部导航 -->
    <nav-form
      ref="navForm"
      :data="navFormInfo.data"
      :field-list="navFormInfo.fieldList"
      @dateChange="dateChange"
    />
    <!-- 表格内容 -->
    <tablePage
      ref="tablePage"
      :is-loading="loading"
      :columns="columns"
      :data-source="tableData"
      :options="options"
      :fetch="fetchTableData"
      :pagination="pagination"
      @handleSizeChange="handleSizeChange"
      @handleIndexChange="handleIndexChange"
      @selection-change="handleSelectionChange"
      @handleRowDblclick="handleRowDblclick"
    />
    <!-- 编辑位置 -->
    <el-dialog
      title="编辑"
      :modal-append-to-body="false"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <div v-loading="loadingTree || loadingTree2" class="dataRights-tree-container element-tree overfolw">
        <el-checkbox v-show="menuTreeList.length > 0" v-model="allChecked" class="allTree" @change="isAllChecked">全部</el-checkbox>
        <el-tree
          v-show="menuTreeList.length > 0"
          ref="tttr"
          :props="defaultProps"
          :data="menuTreeList"
          show-checkbox
          node-key="value"
          :default-checked-keys="defaultSelectMenuTree"
          :disabled="allChecked"
          @check-change="selectElementTree"
          @node-click="clickElementTree"
        />
        <div v-show="menuTreeList.length === 0" class="no-data-img">
          <img style="width: 300px" :src="noData | noDataFile('noData', 'svg')">
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="btn-border" @click="cancel">取 消</el-button>
        <el-button v-loading="loadingBtn" class="btn-blue" type="primary" @click="determine">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import navForm from '@/components/commonComponent/navForm/index.vue'
import tablePage from '@/components/ElementComponent/iTable'
import {
  getDataPermissionList,
  getDataMenuListTree,
  getDataDefaultMenuList,
  saveDataMenuList
} from '@/http/api/jurisdiction'
import { evcJsonh2Tree, wlwJsonh2Tree } from '@/components/tree/evcJsonh2Tree'
import { getConfigElement } from '@/utils/overtService'
export default {
  components: {
    tablePage,
    navForm
  },
  props: {
    appCode: String,
    url: String,
    code: String
  },
  data() {
    return {
      dialogFormVisible: false,
      allChecked: false,
      defaultProps: {
        label: 'title',
        children: 'children'
      },
      // 菜单树列表
      menuTreeList: [],
      // 初始化菜单树列表
      initTreeList: [],
      // 不能选择菜单树列表
      disabledTreeList: [],
      // 默认选中的菜单
      defaultSelectMenuTree: [],
      navFormInfo: {
        data: {
          date: [],
          beginDate: '',
          endDate: '',
          jobNo: '',
          accountType: ''
        },
        fieldList: {
          left: {
            inpLists: [
              {
                key: 'date',
                type: 'date',
                dateType: 'daterange',
                className: 'shadow',
                // rangeSeparator: '至',
                startPlaceholder: '开始时间',
                endPlaceholder: '结束时间'
              },
              {
                key: 'jobNo',
                type: 'input',
                className: 'shadow',
                placeholder: '请输入工号'
              },
              {
                key: 'accountType',
                type: 'select',
                className: 'shadow',
                placeholder: '用户类型',
                list: [
                  { label: '运维', value: '0' },
                  { label: '内部', value: '1' },
                  { label: '外部', value: '2' },
                  { label: '单项疾病外部', value: '3' }
                ]
              }
            ],
            btnLists: [
              {
                innerText: '查询',
                className: 'btn-blue',
                handleClick: () => {
                  this.pagination.pageIndex = 1
                  this.getLists()
                }
              },
              {
                innerText: '重置',
                className: 'btn-border',
                handleClick: () => {
                  this.pagination.pageIndex = 1
                  this.$refs['navForm'].resetFields()
                  this.getLists()
                }
              },
              {
                innerText: '编辑',
                className: 'btn-blue',
                handleClick: () => {
                  if (this.selection.length === 0) {
                    this.$message.warning('请选择数据！')
                  } else if (this.selection.length > 1) {
                    this.$message.warning('请选择一条数据！')
                  } else {
                    this.defaultSelectMenuTree = []
                    this.allChecked = false
                    this.isAllChecked()
                    this.dialogFormVisible = true
                    this.getDefaultMenuList()
                    this.getMenuTreeList()
                  }
                }
              }
            ]
          }
        }
      },
      selection: [],
      columns: [
        {
          prop: 'username',
          label: '用户名',
          width: 180
        },
        {
          prop: 'accountType',
          label: '账户类型',
          width: 160,
          render: (h, params) => {
            if (params.row.accountType === '0') {
              return h('span', '运维')
            } else if (params.row.accountType === '1') {
              return h('span', '内部')
            }
            if (params.row.accountType === '2') {
              return h('span', '外部')
            }
            if (params.row.accountType === '3') {
              return h('span', '单项疾病外部')
            }
          }
        },
        {
          prop: 'jobNo',
          label: '工号',
          width: 180
        },
        {
          longData: true,
          prop: 'compName',
          label: '公司'
          // width: 240
        },
        {
          prop: 'deptName',
          label: '部门',
          width: 300
        },
        {
          prop: 'updTime',
          label: '更新日期',
          width: 200
        }
      ],
      // 数据
      tableData: [],
      // 分页
      pagination: {
        total: 0,
        pageIndex: 1,
        limit: 10
      },
      options: {
        stripe: false, // 斑马纹
        firstFixed: true, // 首航固定
        mutiSelect: true, // 多选框
        index: false, // 显示序号， 多选则 mutiSelect
        loading: false, // 表格动画
        initTable: true // 是否一挂载就加载数据
      },
      loading: true,
      loadingTree: false,
      loadingTree2: false,
      loadingBtn: false,
      powerLitst: null,
      selectId: '',
      segmentIdMap: []
    }
  },
  created() {
    this.getLists()
  },
  mounted() {
    this.powerLitst = getConfigElement(this.code)
    console.log('权限', getConfigElement('DataManager'))
  },
  methods: {
    givePower() {
      if (!this.powerLitst.btn_update) {
        this.navFormInfo.fieldList.left.btnLists.pop()
      }
    },
    dateChange(event) {
      console.log('时间选择的内容', event)
    },

    // 保存菜单
    conserveMenu() {
      const selectList = this.$refs.tttr.getCheckedNodes(false, true)
      const arr = []
      selectList.map((item) => {
        if (this.appCode === 'unit-evc') {
          if (item.title.indexOf('舍') > -1) {
            arr.push(item.key)
          } else {
            arr.push(item.value)
          }
        } else {
          if (this.segmentIdMap.indexOf(item.value) > -1) {
            arr.push(item.key)
          } else {
            arr.push(item.value)
          }
        }
      })
      const menuTree = arr.toString()
      this.setMenuTree(menuTree)
    },
    changeDisabled(arr) {
      arr.map((item) => {
        item.disabled = true
        if (item.children && item.children.length > 0) {
          this.changeDisabled(item.children)
        }
      })
    },
    // 获取菜单树
    getMenuTreeList() {
      const data = {
        appCode: this.url
      }
      this.loadingTree2 = true
      getDataMenuListTree(data).then((res) => {
        this.loadingTree2 = false
        this.segmentIdMap = Object.values(res.segmentIdMap)

        let arr
        if (this.appCode === 'unit-evc') {
          arr = [...evcJsonh2Tree(res)]
          this.initTreeList = [...evcJsonh2Tree(res)]
          this.menuTreeList = [...evcJsonh2Tree(res)]
        } else {
          arr = [...wlwJsonh2Tree(res)]
          this.initTreeList = [...wlwJsonh2Tree(res)]
          this.menuTreeList = [...wlwJsonh2Tree(res)]
        }
        this.changeDisabled(arr)
        this.disabledTreeList = arr
        console.log(111, arr)
      })
    },
    // 获取已有权限列表
    getDefaultMenuList() {
      this.loadingTree = true
      const data = {
        appCode: this.appCode,
        id: this.selectId
      }
      getDataDefaultMenuList(data).then((res) => {
        this.loadingTree = false
        if (res[0] === 'all') {
          this.menuTreeList = [...this.disabledTreeList]
          this.allChecked = true
        } else {
          const arr = []
          const regex = /[A-Za-z]/ig
          const regex2 = /[0-9]/ig
          for (const i of res) {
            if (i.match(regex) && i.match(regex2)) {
              arr.push(i)
            }
          }
          this.defaultSelectMenuTree = arr
        }
      })
    },
    // 保存菜单
    setMenuTree(menuTree) {
      const data = {
        userId: this.selectId,
        dataIds: this.allChecked ? 'all' : menuTree,
        appCode: this.appCode
      }
      this.loadingBtn = true
      saveDataMenuList(data).then((res) => {
        this.loadingBtn = false
        this.dialogFormVisible = false
        if (res && res.status === 200 && res.rel) {
          this.$message.success('保存成功！')
          this.dialogFormVisible = false
          this.defaultSelectMenuTree = []
          this.menuTreeList = [...this.initTreeList]
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 点击菜单树
    clickElementTree(data, checked, indeterminate) {},
    // 选中菜单树
    selectElementTree(data, checked, indeterminate) {},
    isAllChecked() {
      if (this.allChecked) {
        this.menuTreeList = [...this.disabledTreeList]
        this.defaultSelectMenuTree = []
      } else {
        this.menuTreeList = this.initTreeList
      }
    },
    // 获取tible数据
    getLists() {
      this.loading = true
      const data = {
        page: this.pagination.pageIndex,
        limit: this.pagination.limit
      }
      if (this.navFormInfo.data.date.length > 0) {
        data.beginDate = this.navFormInfo.data.date[0]
        data.endDate = this.navFormInfo.data.date[1]
      }
      if (this.navFormInfo.data.jobNo) {
        data.jobNo = this.navFormInfo.data.jobNo
      }
      if (this.navFormInfo.data.accountType) {
        data.accountType = this.navFormInfo.data.accountType
      }
      getDataPermissionList(data).then((res) => {
        this.loading = false
        if (res && res.status === 200) {
          if (res.data.total > 0) {
            this.tableData = res.data.rows
            this.pagination.total = res.data.total
            this.$refs['tablePage'].$children[0].clearSelection()
          } else {
            this.tableData = []
            this.pagination.total = 0
          }
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 编辑
    determine() {
      this.conserveMenu()
      // this.dialogFormVisible = false
    },
    cancel() {
      this.dialogFormVisible = false
      this.defaultSelectMenuTree = []
      this.menuTreeList = [...this.initTreeList]
    },
    // 分页器页码
    handleIndexChange(current) {
      this.pagination.pageIndex = current
      this.getLists()
    },
    // 分页器一页多少条
    handleSizeChange(size) {
      this.pagination.pageIndex = 1
      this.pagination.limit = size
      this.getLists()
    },
    // 复选框
    handleSelectionChange(selection) {
      if (selection.length > 0) {
        this.selection = selection
        this.selectId = selection[0].id
      }
    },
    // 双击某一行时
    handleRowDblclick(row, event, column) {
      this.defaultSelectMenuTree = []
      this.allChecked = false
      this.isAllChecked()
      this.dialogFormVisible = true
      this.selectId = row.id
      this.getDefaultMenuList()
      this.getMenuTreeList()
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
.dataRights-tree-container {
  padding: 20px 20px;
  background-color: transparent;
  border: 1px solid ;
  @include border_color('permisions_checkbox_innerBorder3');
  height: 50vh;
  // margin-top: 20px;
  overflow-x: auto;
  .el-checkbox__label{
    @include font_color('checkboxALL_color');
    margin-bottom: 10px;
  }
  .el-tree {
    padding-left: 0 !important;
    padding-top: 0 !important;
  }
  .element-tree .el-tree-node__content{
    @include font_color('checkboxALL_color');
  }
  .el-checkbox__input.is-disabled .el-checkbox__inner{
    @include background('permisions_checkbox_innerBG');
    @include border_color('permisions_checkbox_innerBorder');
    // background-color: #3a4152;
    // border-color: #3a4152;
  }
  .el-radio__inner, .el-checkbox__inner{
    border: 1px solid;
    @include border_color('permisions_checkbox_innerBorder2');
  }
  .el-tree-node:focus > .el-tree-node__content {
    background-color: transparent;
  }
  .el-tree {
    background-color: transparent;
    color: #cdd8f7;
  }
  .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    // background-color: rgb(34, 50, 130);
    @include background('permisions_elTreeNodeBG');
  }
  .el-tree-node__content:hover {
    // background-color: rgb(34, 50, 130);
    @include background('permisions_elTreeNodehoverBG');
  }
}
</style>
