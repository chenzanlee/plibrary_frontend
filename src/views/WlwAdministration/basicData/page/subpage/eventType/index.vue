<template>
  <div>
    <!-- 头部导航 -->
    <nav-form ref="navForm" :data="navFormInfo.data" :field-list="navFormInfo.fieldList" />
    <!-- 表格内容 -->

    <tablePage
      ref="tablePage"
      :is-loading="isLoading"
      :columns="columns"
      :data-source="tableData"
      :options="options"
      :pagination="pagination"
      @handleSizeChange="handleSizeChange"
      @handleIndexChange="handleIndexChange"
      @selection-change="handleSelectionChange"
      @child-removeRow="removeRow"
      @child-editRow="editRow"
    />
  </div>
</template>
<script>
import tablePage from '@/components/ElementComponent/iTable'
import navForm from '@/components/commonComponent/navForm/index.vue'

import { getConfigElement } from '@/utils/overtService'
import { httpRequest } from '@/http/dispatch'

import Dialog from '@/components/dialog/dialog.js'
import Dom from '@/views/WlwAdministration/basicData/page/subpage/eventType/add.vue'

const powerList = getConfigElement('myOperationType')
console.log('权限', powerList)

export default {
  components: {
    tablePage,
    navForm
  },
  data() {
    return {
      isLoading: true,
      typeId: '',
      navFormInfo: {
        data: {
          keyWord: ''
        },
        fieldList: {
          right: {
            inpLists: [
              {
                type: 'button',
                innerText: '新增',
                authCode: 'myManufacturerInfo:btn_add',
                className: 'btn-blue',
                handleClick: () => {
                  this.add()
                }
              },
              {
                key: 'keyWord',
                type: 'select',
                className: 'shadow',
                placeholder: '事件类型',
                filterable: true,
                list: [],
                handleChange: (v) => {
                  console.log(v)
                  this.typeId = v.value
                }
              }
            ],
            btnLists: [
              {
                innerText: '查询',
                disabled: true,
                className: 'btn-blue',
                handleClick: () => {
                  this.query()
                }
              },
              {
                innerText: '重置',
                className: 'btn-border',
                handleClick: () => {
                  this.reset()
                }
              }
            ]
          }
        }
      },
      columns: [
        {
          prop: 'eventName',
          label: '事件类型'
          // ,
          // width: '170'
        },
        {
          prop: 'description',
          label: '备注'
          // ,
          // width: '170'
        },
        {
          prop: 'crtName',
          label: '录入人'
          // ,
          // width: '170'
        },
        {
          // longData: true,
          prop: 'updTime',
          label: '更新时间'
          // ,
          // width: '170'
        },
        {
          button: true,
          label: '操作',
          fixed: 'right',
          align: 'center',
          show: 'status',
          width: '180', // 操作按钮宽度
          group: [
            {
              name: '修改',
              class: 'btn-blue',
              authCode: 'myOperationType:btn_edit',
              size: 'auto',
              click: 'edit',
              status: 'NORMAL'
            },
            {
              name: '删除',
              class: 'btn-red',
              authCode: 'myOperationType:btn_del',
              size: 'auto',
              click: 'remove',
              status: 'NORMAL'
            }
          ]
        }
      ],
      tableData: [],
      selectData: [
        { name: '11', value: 222 }
      ],
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
        // index: true, // 显示序号， 多选则 mutiSelect
        loading: false, // 表格动画
        initTable: true // 是否一挂载就加载数据
      }
    }
  },
  created() {
    if (powerList.view_getPageList) {
      this.init()
    } else {
      this.$message.warning('暂无权限')
      this.isLoading = false
    }
  },
  methods: {
    init() {
      this.getTableList()
      this.getSelectList()
    },
    query() {
      // this.typeId = this.
      this.getTableList()
    },
    reset() {
      this.typeId = ''
      this.navFormInfo.data.keyWord = ''
      this.pagination.pageIndex = 1
      this.pagination.limit = 10
      this.getTableList()
    },
    getTableList() {
      this.isLoading = true
      const data = {
        limit: this.pagination.limit,
        page: this.pagination.pageIndex,
        id: this.typeId
      }
      httpRequest({
        type: 'get',
        uri: powerList.view_getPageList && powerList.view_getPageList.uri,
        payload: this.handleObj(data),
        callback: (res) => {
          this.isLoading = false
          if (res && res.status === 200) {
            this.pagination.total = res.data.total
            this.tableData = res.data.rows
          } else { this.$message.error(res.message) }
        }
      }).catch(() => {
        this.isLoading = false
      })
    },
    getSelectList() {
      this.isLoading = true
      const data = {
        limit: 10000,
        page: 1
      }
      httpRequest({
        type: 'get',
        uri: powerList.view_getPageList && powerList.view_getPageList.uri,
        payload: this.handleObj(data),
        callback: (res) => {
          this.isLoading = false
          if (res && res.status === 200) {
            if (res.data.rows.length > 0) {
              const arr = []
              for (const i of res.data.rows) {
                arr.push({
                  name: i.eventName,
                  value: i.id
                })
              }
              this.navFormInfo.fieldList.right.inpLists[1].list = arr
            }
          } else { this.$message(res.message) }
        }
      })
    },
    handleIndexChange(current) {
      this.pagination.page = current
      this.getTableList()
    },
    handleSizeChange(size) {
      this.pagination.limit = size
      this.getTableList()
    },
    handleSelectionChange() {
      console.log('复选框')
    },
    add() {
      console.log('新增')
      const options = {
        type: 'added',
        power: powerList,
        closeDialog: () => {
        },
        handleOk: (v) => {
          this.init()
        },
        childs: Dom
      }
      Dialog(options)
    },
    editRow(v) {
      console.log('修改', v)
      const options = {
        type: 'edit',
        power: powerList,
        info: v,
        closeDialog: () => {
        },
        handleOk: (v) => {
          this.init()
        },
        childs: Dom
      }
      Dialog(options)
    },
    removeRow(v) {
      const data = {
        ids: v.id
      }
      if (v) {
        httpRequest({
          type: 'DELETE',
          uri: powerList.btn_del && powerList.btn_del.uri,
          payload: this.handleObj(data),
          callback: (res) => {
            this.isLoading = false
            if (res && res.status === 200) {
              this.$message.success('删除成')
              this.getTableList()
              this.getSelectList()
            } else { this.$message.error(res.message) }
          }
        })
      }
    },
    // 处理对象 删除值为''字段 返回对象
    handleObj(obj) {
      for (const key in obj) {
        if (obj[key] === null || obj[key] === '' || obj[key] === undefined) {
          delete obj[key]
        }
      }
      return obj
    }
  }
}
</script>
