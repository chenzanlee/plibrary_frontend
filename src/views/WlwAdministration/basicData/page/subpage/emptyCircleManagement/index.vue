<template>
  <div class="home emptyCircle">
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
      @child-seeRow="childSeeRow"
      @child-editRow="editRow"
    />
  </div>
</template>

<script>
import tablePage from '@/components/ElementComponent/iTable'
import navForm from '@/components/commonComponent/navForm/index.vue'
import { wlwJsonh2Tree } from '@/components/tree/evcJsonh2Tree.js'
import { getConfigElement } from '@/utils/overtService'
import { httpRequest } from '@/http/dispatch'
const dataInterfacePageElement = getConfigElement('emptyStyManage')
export default {
  components: {
    tablePage,
    navForm
  },
  data() {
    return {
      nameList: [],
      isLoading: false,
      rowData: '', // 点击查看选中的行数据
      status: 0, // 0=>查看 1=>xinzeng  2=>修改
      selection: '',
      auditarr: [], // 已审核数组
      unAuditarr: [], // 未审核数组
      navFormInfo: {
        data: {
          area: '',
          status: ''
        },
        fieldList: {
          left: {
            inpLists: [
              {
                type: 'button',
                innerText: '新增',
                authCode: 'emptyStyManage:add',
                className: 'btn-blue',
                handleClick: () => {
                  this.$router.push({
                    type: 'add',
                    name: 'emptyCircleDetail'
                  })
                }
              },
              {
                type: 'button',
                innerText: '审核',
                authCode: 'emptyStyManage:review',
                className: 'btn-blue-disabled',
                isDisabled: true,
                handleClick: () => {
                  if (this.auditarr.length !== 0) {
                    this.$message.error('只能选择未审核数据进行审核')
                    return
                  }
                  if (this.unAuditarr.length === 0) {
                    this.$message({
                      message: '最少需要选择一条未审核数据',
                      type: 'warning'
                    })
                    return
                  }
                  this.setReview(this.unAuditarr)
                }
              },
              {
                type: 'button',
                innerText: '反审核',
                authCode: 'emptyStyManage:unreview',
                className: 'btn-blue-disabled',
                isDisabled: true,
                handleClick: () => {
                  if (this.unAuditarr.length !== 0) {
                    this.$message.error('只能选择已审核数据进行反审核')
                    return
                  }
                  if (this.auditarr.length === 0) {
                    this.$message({
                      message: '最少需要选择一条已审核数据',
                      type: 'warning'
                    })
                    return
                  }
                  this.setUnreview(this.auditarr)
                }
              }
            ]
          },
          right: {
            inpLists: [
              {
                key: 'area',
                type: 'cascader',
                checkStrictly: true,
                customLabel: 'title',
                customValue: 'value',
                className: 'shadow',
                placeholder: '大区 / 区域 / 场区 / 工段 / 单元',
                options: []
              },
              {
                key: 'status',
                type: 'radio',
                required: true,
                className: 'shadow',
                customLabel: 'name',
                customVal: 'val',
                optList: [{ name: '全部', val: '' }, { name: '已审核', val: 'AUDITED' }, { name: '未审核', val: 'NORMAL' }]
              }

            ],
            btnLists: [
              {
                innerText: '查询',
                className: 'btn-blue',
                handleClick: () => {
                  if (this.selection) {
                    this.selection.forEach(row => {
                      this.$refs.tablePage.$refs.tables.toggleRowSelection(row)
                    })
                  } else {
                    this.$refs.tablePage.$refs.tables.clearSelection()
                  }
                  if (this.pagination.pageIndex > 1) {
                    this.pagination.pageIndex = 1
                    this.getMyEvcMcuInfo()
                  } else {
                    this.getMyEvcMcuInfo()
                  }
                }
              },
              {
                innerText: '重置',
                className: 'btn-border',
                handleClick: () => {
                  this.$refs['navForm'].resetFields()
                  this.getMyEvcMcuInfo()
                }
              }
            ]
          }
        }
      },
      columns: [
        {
          prop: 'regionName',
          label: '大区'
        },
        {
          prop: 'areaName',
          label: '区域'
        },
        {
          longData: true,
          width: '180',
          prop: 'fieldName',
          label: '场区'
        },
        {
          prop: 'segmentName',
          label: '工段'
        },
        {
          prop: 'unitName',
          label: '单元'
        },
        {
          prop: 'styAmount',
          label: '栏位总数'
        },
        {
          prop: 'isEmptyUnit',
          label: '是否全部空圈',
          rule: {
            1: '是',
            0: '否'
          }
        },
        {
          longData: true,
          prop: 'emptySty',
          label: '空栏位'
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
              name: '查看',
              class: 'btn-blue',
              authCode: '',
              size: 'auto',
              click: 'see',
              status: 'AUDITED'
            },
            {
              name: '修改',
              class: 'btn-blue',
              authCode: 'emptyStyManage:update',
              size: 'auto',
              click: 'edit',
              status: 'NORMAL'
            },
            {
              name: '删除',
              class: 'btn-red',
              authCode: 'emptyStyManage:delete',
              size: 'auto',
              click: 'remove',
              status: 'NORMAL'
            }
          ]
        }
      ],
      // 表单对应列表
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
      }
    }
  },
  watch: {
    auditarr(val) {
      if (val.length > 0) {
        this.navFormInfo.fieldList.left.inpLists[2].className = 'btn-blue'
        this.navFormInfo.fieldList.left.inpLists[2].isDisabled = false
      } else {
        this.navFormInfo.fieldList.left.inpLists[2].className = 'btn-blue-disabled'
        this.navFormInfo.fieldList.left.inpLists[2].isDisabled = true
      }
    },
    unAuditarr(val) {
      if (val.length > 0) {
        this.navFormInfo.fieldList.left.inpLists[1].className = 'btn-blue'
        this.navFormInfo.fieldList.left.inpLists[1].isDisabled = false
      } else {
        this.navFormInfo.fieldList.left.inpLists[1].className = 'btn-blue-disabled'
        this.navFormInfo.fieldList.left.inpLists[1].isDisabled = true
      }
    }
  },
  async created() {
    await this.getTree()
    await this.getMyEvcMcuInfo()
  },
  mounted() {},
  methods: {
    cascaderEvent(val, val1, val2) {
      console.log(val)
      console.log(val1)
      console.log(val2)
      this.nameList = val1
    },
    handleChange() {},
    // 审核数据接口
    setReview(idArr) {
      const ids = idArr.join(',')
      this.$confirm('此操作将审核这些数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        confirmButtonClass: 'btn-blue btn-blue-confirm',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const obj = {
          ids: ids
        }
        httpRequest({
          type: 'PUT',
          uri: dataInterfacePageElement.review && dataInterfacePageElement.review.uri + `?ids=${ids}`,
          payload: obj,
          callback: (res) => {
            this.isLoading = false
            if (res && res.status === 200) {
              this.$message({
                message: '审核成功',
                type: 'success'
              })
            }
            this.selection = []
            this.unAuditarr = []
            this.auditarr = []
            this.getMyEvcMcuInfo()
          }
        })
      })
    },
    // 反审核数据接口
    setUnreview(idArr) {
      const ids = idArr.join(',')
      this.$confirm('此操作将反审核这些数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        confirmButtonClass: 'btn-blue btn-blue-confirm',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const obj = {
          ids: ids
        }
        httpRequest({
          type: 'PUT',
          uri: dataInterfacePageElement.unreview && dataInterfacePageElement.unreview.uri + `?ids=${ids}`,
          payload: obj,
          callback: (res) => {
            this.isLoading = false
            if (res && res.status === 200) {
              this.$message({
                message: '反审核成功',
                type: 'success'
              })
            }
            this.selection = []
            this.unAuditarr = []
            this.auditarr = []
            this.getMyEvcMcuInfo()
          }
        })
      })
    },
    handleIndexChange(current) {
      this.pagination.page = current
      this.getMyEvcMcuInfo()
    },
    handleSizeChange(size) {
      this.pagination.limit = size
      this.getMyEvcMcuInfo()
    },
    // 点查看
    childSeeRow(row, index) {
      this.rowData = row
      this.$router.push({
        name: 'emptyCircleDetail',
        params: {
          type: 'see',
          rowData: this.rowData
        }
      })
    },
    // 删除
    removeRow(row, index) {
      // this.$confirm('是否删除?', '提示', {
      //   confirmButtonText: '确定',
      //   confirmButtonClass: 'btn-blue btn-blue-confirm',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      httpRequest({
        type: 'DELETE',
        uri: dataInterfacePageElement.delete && dataInterfacePageElement.delete.uri,
        payload: { ids: row.id },
        callback: (res) => {
          if (res && res.status === 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getMyEvcMcuInfo()
          }
        }
      })
      // })
    },
    // 修改
    editRow(row, index) {
      this.rowData = row
      this.$router.push({
        name: 'emptyCircleDetail',
        params: {
          type: 'edit',
          rowData: this.rowData
        }
      })
    },
    // 复选框
    handleSelectionChange(selection) {
      this.selection = selection
      console.log(selection)
      this.auditarr = [] // 已审核数组
      this.unAuditarr = [] // 未审核数组
      selection.forEach((item) => {
        if (item.status === 'AUDITED') {
          this.auditarr.push(item.id)
        } else {
          this.unAuditarr.push(item.id)
        }
      })
    },
    // 获取区域联动数据
    getTree() {
      httpRequest({
        type: 'get',
        uri: '/wlw/myBaseInfo/getTreeForDataAuthV2',
        payload: '',
        callback: (res) => {
          if (res && res.status === 200) {
            const arr = wlwJsonh2Tree(res.data)
            console.log(arr)
            this.navFormInfo.fieldList.right.inpLists[0].options = arr
            console.log(this.navFormInfo.fieldList.right.inpLists)
          }
        }
      })
    },
    // 获取表单信息
    getMyEvcMcuInfo() {
      // this.$refs['tablePage'].$children[0].clearSelection()
      this.$refs.tablePage.$refs.tables.clearSelection()
      this.isLoading = true
      const obj = {
        regionId: this.navFormInfo.data.area[0],
        areaId: this.navFormInfo.data.area[1],
        fieldId: this.navFormInfo.data.area[2],
        segmentId: this.navFormInfo.data.area[3] && (this.navFormInfo.data.area[3] === 'BLOCK_A' || this.navFormInfo.data.area[3] === 'BLOCK_B') ? this.navFormInfo.data.area[4] : this.navFormInfo.data.area[3],
        unitId: this.navFormInfo.data.area[3] && (this.navFormInfo.data.area[3] === 'BLOCK_A' || this.navFormInfo.data.area[3] === 'BLOCK_B') ? this.navFormInfo.data.area[5] : this.navFormInfo.data.area[4],
        limit: this.pagination.limit,
        page: this.pagination.pageIndex,
        status: this.navFormInfo.data.status
      }
      httpRequest({
        type: 'get',
        uri: dataInterfacePageElement.getPageList && dataInterfacePageElement.getPageList.uri,
        payload: this.handleObj(obj),
        callback: (res) => {
          this.isLoading = false
          if (res && res.status === 200) {
            const arr = res.data.rows
            this.tableData = arr || []
            this.pagination.total = res.data.total
          }
        }
      })
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
<style lang="scss">
.emptyCircle{
  .el-dialog__body{
    padding: 20px 0 0 0;
  }
}
</style>
