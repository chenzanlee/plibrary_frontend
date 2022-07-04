<template>
  <div class="home">
    <!-- 头部导航 -->
    <!-- <div class="menu-container-header"> -->
    <!-- 查询，重置 -->
    <!-- <span >资源名称</span> -->
    <!-- <span class="menu-container-header-input"><input type="text" v-model="resourcesName" placeholder="请输入关键字"></span>
			<button class="menu-container-header-btn btn-blue " @click="btnQuery">查询</button>
			<button class="menu-container-header-btn btn-border" @click="btnReset">重置</button> -->
    <!-- <button class="menu-container-header-btn btn-blue" @click="btnAddElement">新增元素</button> -->
    <!-- </div> -->
    <nav-form
      ref="navForm"
      :data="navFormInfo.data"
      :field-list="navFormInfo.fieldList"
    />
    <!-- :data="绑定数据" -->
    <!-- :field-list="操作列表" -->
    <!-- 表格内容 -->
    <!-- :fetch="fetchTableData" -->
    <tablePage
      :is-loading="loading"
      :columns="columns"
      :data-source="tableData"
      :options="options"

      :pagination="pagination"
      @handleSizeChange="handleSizeChange"
      @handleIndexChange="handleIndexChange"
      @child-editRow="getRole"
      @child-seeRow="getPersonnel"
    />
    <!-- columns="表头" -->
    <!-- dataSource="表格数据" -->
    <!-- options="表格配置项" -->
    <!-- pagination="分页信息配置项" -->
    <!-- handleSizeChange="每页显示数更改事件" -->
    <!-- handleIndexChange="页码更改事件" -->
    <!-- child-editRow="编辑行事件" -->
    <!-- child-seeRow="查看行事件" -->
    <!-- @selection-change="handleSelectionChange" -->
  </div>
</template>

<script>
import tablePage from '@/components/ElementComponent/iTable'
import navForm from '@/components/commonComponent/navForm/index.vue'
import {
  getDataInterface
} from '@/http/api/menuInfo'
// import { getConfigElement } from '@/utils/overtService'

import Dialog from '@/components/dialog/dialog.js'
import Role from '@/components/commonModular/dataInterface/role'

export default {
  components: {
    tablePage,
    navForm
  },
  props: {
    appCode: String,
    code: String
  },
  data() {
    return {
      resourcesName: '',
      navFormInfo: {
        data: {
          name: '' // *模板名称
        },
        fieldList: {
          left: {
            // 输入框列表
            inpLists: [{
              // 绑定值
              key: 'name',
              // 输入框类型
              type: 'input',
              // 是否必填
              required: true,
              // 绑定class
              className: 'shadow',
              // 默认提示信息
              placeholder: '请输入关键字'
            }],
            // 按钮列表
            btnLists: [{
              // 文本s
              innerText: '查询',
              // 绑定类名
              className: 'btn-blue',
              // 事件类型
              event: 'added',
              // 事件执行
              handleClick: () => {
                this.btnQuery()
              }
            }, {
              innerText: '重置',
              className: 'btn-border',
              event: 'edit',
              handleClick: () => {
                this.btnReset()
              }
            }]
          }
        }
      },
      // 表头配置项
      columns: [
        {
          // 绑定值
          prop: 'title',
          // 表头文本
          label: '所属菜单',
          // 对齐方式
          align: 'left',
          minWidth: '120'
        },
        {
          prop: 'name',
          label: '接口描述',
          longData: true,
          align: 'left',
          minWidth: '400'
        },
        {
          prop: 'method',
          label: '方法类型',
          align: 'left',
          width: '100'
        },
        {
          prop: 'uri',
          label: 'URI',
          align: 'left',
          // longData: true,
          width: '480'
        },
        {
          prop: 'open',
          label: '对外开放',
          align: 'left',
          width: '100'
        },
        {
          prop: 'crt_time',
          label: '录入日期',
          align: 'left',
          minWidth: '180'
        },
        {
          button: true,
          label: '权限所属',
          align: 'left',
          fixed: 'right',
          minWidth: '100', // 操作按钮宽度
          group: [
            {
              name: '角色',
              class: 'btn-blue',
              size: 'auto',
              click: 'edit'
            }
            // {
            //   name: '人员',
            //   class: 'btn-blue',
            //   size: 'auto',
            //   click: 'see'
            // }
          ]
        }
      ],
      // 表单信息（数组格式）
      tableData: [],
      // 分页
      pagination: {
        // 总数
        total: 0,
        // 当前页
        pageIndex: 1,
        // 一页条数
        limit: 10
      },
      // 表格配置项
      options: {
        stripe: false, // 斑马纹
        firstFixed: true, // 首航固定
        mutiSelect: false, // 多选框
        index: false, // 显示序号， 多选则 mutiSelect
        loading: false, // 表格动画
        initTable: true // 是否一挂载就加载数据
      },
      loading: true
    }
  },
  created() {
  },
  mounted() {
    this.queryDataInterface()
  },
  methods: {
    // 查询
    btnQuery() {
      this.pagination.pageIndex = 1
      this.queryDataInterface()
    },
    // 重置
    btnReset() {
      this.navFormInfo.data.name = ''
      this.pagination = {
        total: this.pagination.total,
        limit: 10,
        pageIndex: 1
      }
      this.queryDataInterface()
    },

    // 分页
    handleIndexChange(current) {
      this.pagination.pageIndex = current
      this.queryDataInterface()
    },
    // 一页条数更改
    handleSizeChange(size) {
      this.pagination.limit = size
      this.queryDataInterface()
    },
    // 点击人员
    getPersonnel(row, index) {
    },
    // 点击角色
    getRole(row, index) {
      const options = {
        // type: 'added',
        parentData: row,
        closeDialog: () => {
        },
        handleOk: (e) => {
        },
        childs: Role
      }
      Dialog(options)
    },
    //   查询数据接口
    async queryDataInterface() {
      this.loading = true
      const data = {
        code: this.appCode,
        limit: this.pagination.limit,
        page: this.pagination.pageIndex
      }
      if (this.navFormInfo.data.name) { data.title = this.navFormInfo.data.name }
      await getDataInterface(data).then((res) => {
        this.loading = false
        const arr = []
        if (res && res.status === 200) {
          if (res.data.rows.length !== 0) {
            res.data.rows.forEach((item, idx) => {
              arr.push(item)
              arr[idx].title = arr[idx].title || '默认菜单'
              if (arr[idx].open === '1') {
                arr[idx].open = '是'
              } else {
                arr[idx].open = '否'
              }
            })
          }
          this.tableData = arr
          this.pagination.total = res.data.total
        } else { this.$message.error(res.message) }
      }).catch(() => {
        this.loading = false
      })
    }

  }
}
</script>
<style lang="scss" scoped>
@import "@/style/_handle.scss";
.menu-container-header{
  color: #fff;
  margin-bottom: 15px;
  // font-size: 14px;
  &-input{
    display: inline-block;
    position: relative;
    top: -2px;
	input[type=text]{
		border-radius: 4px;
        outline: none;
		background: none;
		height: 34px;
		background: none;
		border: 1px solid #2A6EBC;
		color: #fff;
		padding: 0 10px;

	}
    input:hover, input:focus{
      box-shadow: inset 0px 0px 10px #2A6EBC;
 border-color: #409EFF;
    }
  }
  &-btn{
    width: 90px;
    font-size: var(--size16);
    height: 36px;
    margin-left: 10px !important;
  }
}
</style>
