<template>
  <div class="home deviceInformation manufacturer">
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
    <!-- 新增 -->
    <el-dialog
      :title="title"
      :modal-append-to-body="false"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      class="unitInfoDialog"
      width="700px"
    >
      <div class="body">
        <general-form
          ref="delog"
          label-width="80px"
          :data="formInfo.data"
          :field-list="formInfo.fieldList"
          :list-type-info="listTypeInfo"
          theme-type="default"
          @handleChange="handleChange"
          @cascaderEvent="cascaderEvent"
        />
      </div>
      <div slot="footer" class="dialog-footer" style="text-align: right">
        <el-button class="btn-border canleButton" @click="dialogFormVisible = false">返回列表</el-button>
        <el-button v-if="title === '新增厂商' || title === '修改厂商'" class="btn-blue" :loading="buttonLoading" @click="determine">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import tablePage from '@/components/ElementComponent/iTable'
import navForm from '@/components/commonComponent/navForm/index.vue'
import generalForm from '@/components/commonComponent/generalForm'
import { getConfigElement } from '@/utils/overtService'
import { httpRequest } from '@/http/dispatch'
const dataInterfacePageElement = getConfigElement('myManufacturerInfo')
const manufacturerTypeList = [
  { name: '自研', value: '3bQudb9O8A3KW31xSjfVUl' },
  { name: '外购', value: '70TEP7qaDQ6qW2LiUMdWwC' }
]
export default {
  components: {
    tablePage,
    navForm,
    generalForm
  },
  data() {
    return {
      nameList: [],
      selectedManufacturerName: '', // 选中的厂商名称
      selectedManufacturerType: '', // 选中新增 修改 厂商类别
      navformDisabled: false,
      dialogFormVisible: false,
      isLoading: false,
      buttonLoading: false,
      allTypeList: [],
      pageElement: [], // 页面权限数组
      commonElement: [], // 公共权限数组
      title: '',
      status: 0, // 0=>查看 1=>xinzeng  2=>修改
      downlist: [],
      selection: '',
      rowData: '', // 当前选中行的数据
      auditarr: [], // 已审核数组
      unAuditarr: [], // 未审核数组
      navFormInfo: {
        data: {
          manufacturerName: '',
          status: ''
        },
        fieldList: {
          left: {
            inpLists: [
              {
                type: 'button',
                innerText: '新增',
                authCode: 'myManufacturerInfo:btn_add',
                className: 'btn-blue',
                handleClick: () => {
                  this.title = '新增厂商'
                  this.dialogFormVisible = true
                  this.formInfo.data.manufacturerType = ''
                  this.formInfo.data.manufacturerName = ''
                  this.formInfo.data.description = ''
                  this.formInfo.fieldList.map(res => {
                    res.disabled = false
                  })
                }
              },
              {
                type: 'button',
                innerText: '审核',
                authCode: 'myManufacturerInfo:btn_review',
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
                authCode: 'myManufacturerInfo:btn_unreview',
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
                key: 'manufacturerName',
                type: 'select',
                className: 'shadow',
                placeholder: '厂商名称',
                customLabel: 'name',
                customValue: 'value',
                clearable: 'clearable',
                checkStrictly: false,
                list: [],
                handleChange: (value) => {
                  this.selectedManufacturerName = value || ''
                }
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
                authCode: 'myManufacturerInfo:view_getPageList',
                className: 'btn-blue',
                handleClick: () => {
                  // if (this.selection) {
                  //   this.selection.forEach(row => {
                  //     this.$refs.tablePage.$refs.tables.toggleRowSelection(row)
                  //   })
                  // } else {
                  this.$refs.tablePage.$refs.tables.clearSelection()
                  // }
                  this.pagination.pageIndex = 1
                  this.getMyEvcMcuInfo()
                }
              },
              {
                innerText: '重置',
                className: 'btn-border',
                handleClick: () => {
                  this.selectedManufacturerName = ''
                  this.selectedManufacturerType = ''
                  this.$refs['navForm'].resetFields()
                  this.pagination.pageIndex = 1
                  this.getMyEvcMcuInfo()
                }
              }
            ]
          }
        }
      },
      columns: [
        {
          prop: 'manufacturer',
          label: '厂商名称'
        },
        {
          prop: 'manufacturerType',
          label: '厂商类别'
        },
        {
          prop: 'crtName',
          label: '录入人'
        },
        {
          prop: 'updTime',
          label: '更新时间'
        },
        {
          prop: 'status',
          label: '状态',
          rule: {
            NORMAL: '未审核',
            AUDITED: '已审核'
          }
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
              authCode: 'myManufacturerInfo:btn_edit',
              size: 'auto',
              click: 'edit',
              status: 'NORMAL'
            },
            {
              name: '删除',
              class: 'btn-red',
              authCode: 'myManufacturerInfo:btn_del',
              size: 'auto',
              click: 'remove',
              status: 'NORMAL'
            }
          ]
        }
      ],
      // 表单对应列表
      listTypeInfo: {
        typeList: [],
        manufacturerTypeList
      },
      // 表单相关
      formInfo: {
        data: {
          manufacturerType: '',
          manufacturerName: '',
          description: ''
        },
        fieldList: [
          {
            label: '厂商类别',
            key: 'manufacturerType',
            type: 'select',
            className: 'shadow',
            props: {
              label: 'name',
              value: 'value'
            },
            disabled: false,
            required: true,
            rules: [
              { required: true, message: '请选择厂商类别', trigger: 'change' }
            ],
            list: 'manufacturerTypeList',
            handleChange: (value) => {
              this.selectedManufacturerType = value
            }
          },
          {
            label: '厂商名称',
            key: 'manufacturerName',
            type: 'input',
            className: 'shadow',
            disabled: false,
            required: true,
            rules: [
              { required: true, message: '请选择厂商名称', trigger: 'change' }
            ]
          },
          {
            label: '备注',
            key: 'description',
            type: 'input',
            className: 'shadow',
            disabled: false
          }
        ]
      },
      tableData: [],
      deviceId: '',
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
    },
    dialogFormVisible(val) { // 手动清楚一下提示语
      if (!val) {
        this.$refs['delog'].resetFields()
      }
    }
  },
  created() {
    this.commonElement = getConfigElement('wlwDataInterface')
    this.getMyEvcMcuInfo()
    this.getManufacturerNameList()
    this.getManufacturerTypeList(1301)
  },
  mounted() {},
  methods: {
    getManufacturerTypeList(code) {
      const element = this.commonElement['view_getCode']
      const params = {}
      this.$httpRequest({
        type: element.method,
        uri: element.uri + `/${code}`,
        payload: params,
        callback: res => { // 此接口没有 status
          console.log(res)
          this.listTypeInfo.manufacturerTypeList = res.map(item => {
            return {
              name: item.title,
              value: item.id
            }
          })
        }
      }, true)
    },
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
          type: 'post',
          uri: dataInterfacePageElement.btn_review && dataInterfacePageElement.btn_review.uri + `?ids=${ids}`,
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
            this.getMyEvcMcuInfo('view')
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
          type: 'post',
          uri: dataInterfacePageElement.btn_unreview && dataInterfacePageElement.btn_unreview.uri + `?ids=${ids}`,
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
            this.getMyEvcMcuInfo('view')
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
      this.title = '查看厂商'
      this.formInfo.data.manufacturerType = row.manufacturerType
      this.formInfo.data.manufacturerName = row.manufacturer
      this.formInfo.data.description = row.description
      this.formInfo.fieldList.map(res => {
        res.disabled = true
      })
      this.dialogFormVisible = true
    },
    // 删除
    removeRow(row, index) {
      httpRequest({
        type: 'DELETE',
        uri: dataInterfacePageElement.btn_del && dataInterfacePageElement.btn_del.uri,
        payload: { ids: row.id },
        callback: (res) => {
          if (res.status === 200 && res.rel) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getMyEvcMcuInfo()
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    // 修改
    editRow(row, index) {
      this.rowData = row
      this.title = '修改厂商'
      this.formInfo.data.manufacturerType = row.manufacturerType
      this.formInfo.data.manufacturerName = row.manufacturer
      this.formInfo.data.description = row.description
      this.formInfo.fieldList.map(res => {
        res.disabled = false
      })
      this.dialogFormVisible = true
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
    // dialog确定按钮
    determine() {
      if (!this.$refs['delog'].validateSelf()) {
        return false
      }
      let obj = {}
      let uri = ''
      let p = ''
      if (this.title === '修改厂商') {
        uri = dataInterfacePageElement.btn_edit && dataInterfacePageElement.btn_edit.uri
        obj = {
          id: this.rowData.id,
          manufacturer: this.formInfo.data.manufacturerName,
          manufacturerType: this.selectedManufacturerType === '' ? this.rowData.manufacturerType : this.selectedManufacturerType.name,
          manufacturerTypeId: this.formInfo.data.manufacturerName,
          description: this.formInfo.data.description
        }
        p = 'put'
      } else {
        uri = dataInterfacePageElement.btn_add && dataInterfacePageElement.btn_add.uri
        obj = {
          manufacturer: this.formInfo.data.manufacturerName,
          manufacturerType: this.selectedManufacturerType.name,
          manufacturerTypeId: this.selectedManufacturerType.value,
          description: this.formInfo.data.description
        }
        p = 'post'
      }
      console.log(this.rowData)
      console.log(obj)
      this.buttonLoading = true
      httpRequest({
        type: p,
        uri: uri,
        payload: this.handleObj(obj),
        callback: (res) => {
          this.buttonLoading = false
          if (res.status === 200 && res.rel) {
            console.log(res.data)
            this.$message.success('操作成功')
            this.dialogFormVisible = false
            this.selectedManufacturerType = ''
            this.getMyEvcMcuInfo()
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    // 获取表单信息
    getMyEvcMcuInfo(val) {
      if (val === 'view') {
        this.$refs.tablePage.$refs.tables.clearSelection()
      }
      this.isLoading = true
      const obj = {
        id: this.selectedManufacturerName.value || '',
        status: this.navFormInfo.data.status,
        limit: this.pagination.limit,
        page: this.pagination.pageIndex
      }
      httpRequest({
        type: 'get',
        uri: dataInterfacePageElement.view_getPageList && dataInterfacePageElement.view_getPageList.uri,
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
      this.selectedManufacturerType = ''
    },
    getManufacturerNameList() {
      const obj = {
        limit: '1000',
        page: '1'
      }
      httpRequest({
        type: 'get',
        uri: dataInterfacePageElement.view_getPageList && dataInterfacePageElement.view_getPageList.uri,
        payload: this.handleObj(obj),
        callback: (res) => {
          this.isLoading = false
          if (res && res.status === 200) {
            res.data.rows.map(res => {
              this.navFormInfo.fieldList.right.inpLists[0].list.push(
                { name: res.manufacturer, value: res.id }
              )
            })
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
.manufacturer{
  .el-dialog__body{
    // padding: 20px 30px;
  }
}
</style>
