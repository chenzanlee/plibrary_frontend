<template>
  <div class="equipment-type-wrap manufacturer">
    <!-- 头部导航 -->
    <nav-form ref="navForm" :data="navFormInfo.data" :field-list="navFormInfo.fieldList" />
    <!-- 表格内容 -->

    <tablePage
      ref="tablePage"
      style="margin-top: 10px;"
      :is-loading="isLoading"
      :columns="columns"
      :data-source="tableData"
      :options="options"
      :pagination="pagination"
      @handleSizeChange="handleSizeChange"
      @handleIndexChange="handleIndexChange"
      @selection-change="handleSelectionChange"
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
      <!-- <div v-if="headerObj.user" class="dialog-header">
        <span class="update-user">
          {{ headerObj.title }}:
        </span>
        <span class="update-date">
          {{ headerObj.user }}
        </span>
      </div> -->
      <div style="margin:0 auto;">
        <general-form
          ref="delogForm"
          label-width="80px"
          :data="formInfo.data"
          :field-list="formInfo.fieldList"
          :list-type-info="listTypeInfo"
          theme-type="default"
          @handleChange="handleChange"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="btn-border canleButton" @click="dialogFormVisible = false">返回列表</el-button>
        <el-button v-if="dialogStatus ==='add' || dialogStatus === 'edit'" class="btn-blue" :loading="buttonLoading" @click="determine">
          {{ dialogStatus ==='add' ? '保存': '更新' }}
        </el-button>
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
import { getAPI, postUrlAPI } from '@/http/api/commonApi.js'
const dataInterfacePageElement = getConfigElement('myEquipmentType')
const userInfo = localStorage.getItem('MY-Bytes')
const protocolList = [
  {
    label: 'LoRa',
    value: 'LoRa'
  },
  {
    label: 'MQTT',
    value: 'MQTT'
  },
  {
    label: 'IP',
    value: 'IP'
  }
]
const idList = {
  label: '编码',
  key: 'id',
  type: 'input',
  className: 'shadow',
  disabled: true,
  required: true
}
export default {
  components: {
    tablePage,
    navForm,
    generalForm
  },
  data() {
    return {
      headerObj: {
        user: JSON.parse(userInfo).partyName,
        title: '新增人'
      },
      nameList: [],
      navformDisabled: false,
      dialogFormVisible: false,
      isLoading: false,
      buttonLoading: false,
      title: '',
      dialogStatus: 'add',
      status: 0, // 0=>查看 1=>xinzeng  2=>修改
      selection: '',
      auditarr: [], // 已审核数组
      unAuditarr: [], // 未审核数组
      manufacturerObj: {},
      typeServiceObj: {},
      businessObj: {},
      navFormInfo: {
        data: {
          product_key: '',
          id: '',
          access_provider: '',
          status: ''
        },
        fieldList: {
          left: {
            inpLists: [
              {
                type: 'button',
                innerText: '新增',
                className: 'btn-blue',
                handleClick: () => {
                  if (this.formInfo.fieldList[0].key === 'id') {
                    this.formInfo.fieldList.shift()
                  }
                  this.initData()
                  this.title = '设备类型新增'
                  this.dialogStatus = 'add'
                  this.headerObj.title = '新增者'
                  this.formInfo.fieldList.map(res => {
                    res.disabled = false
                  })
                  this.dialogFormVisible = true
                  this.$refs.delogForm && this.$refs.delogForm.resetFields()
                }
              },
              {
                type: 'button',
                innerText: '审核',
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
                      type: 'error'
                    })
                    return
                  }
                  this.setReview(this.unAuditarr)
                }
              },
              {
                type: 'button',
                innerText: '反审核',
                // authCode: 'myManufacturerInfo:btn_unreview',
                className: 'btn-blue-disabled',
                isDisabled: true,
                handleClick: () => {
                  if (this.unAuditarr.length !== 0) {
                    this.$message.warning('只能选择已审核数据进行反审核')
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
              },
              {
                type: 'button',
                innerText: '禁用',
                // authCode: 'myManufacturerInfo:btn_unreview',
                className: 'btn-blue',
                isDisabled: true,
                handleClick: () => {
                  if (this.unAuditarr.length !== 0) {
                    this.$message.warning('存在未审核的数据,不可禁用')
                    return
                  }
                  if (this.auditarr.length === 0) {
                    this.$message({
                      message: '最少需要选择一条已审核数据',
                      type: 'warning'
                    })
                    return
                  }
                  this.setDisabled(this.auditarr)
                }
              }
            ]
          },
          right: {
            inpLists: [
              {
                key: 'product_key',
                type: 'input',
                className: 'shadow',
                placeholder: '设备类型标识',
                handleChange: (value) => {
                  this.selectedManufacturerName = value
                }
              },
              {
                key: 'id',
                type: 'select',
                className: 'shadow',
                placeholder: '设备类型',
                clearable: true,
                filterable: true,
                props: {
                  label: 'equiptype_name',
                  value: 'id'
                },
                list: [],
                handleChange: (value) => {
                }
              },
              {
                key: 'access_provider',
                type: 'select',
                className: 'shadow',
                clearable: true,
                filterable: true,
                placeholder: '接入商',
                props: {
                  label: 'title',
                  value: 'title'
                },
                list: [],
                handleChange: (value) => {
                }
              },
              {
                key: 'status',
                type: 'select',
                className: 'shadow',
                clearable: true,
                filterable: true,
                placeholder: '状态',
                props: {
                  label: 'label',
                  value: 'value'
                },
                list: [
                  {
                    label: '未审核',
                    value: 1
                  },
                  {
                    label: '已审核',
                    value: 2
                  },
                  {
                    label: '禁用',
                    value: 3
                  }
                ],
                handleChange: (value) => {
                }
              }

            ],
            btnLists: [
              {
                innerText: '查询',
                authCode: 'myManufacturerInfo:view_getPageList',
                className: 'btn-blue',
                handleClick: () => {
                  this.searchHandle()
                }
              },
              {
                innerText: '重置',
                className: 'btn-border',
                handleClick: () => {
                  this.resetHandle()
                }
              }
            ]
          }
        }
      },
      columns: [
        {
          prop: 'product_key',
          label: '设备类型标识'
        },
        {
          prop: 'equiptype_name',
          label: '设备类型'
        },
        {
          prop: 'access_provider',
          label: '接入商'
        },
        {
          prop: 'manufacturer',
          label: '制造商'
        },
        {
          prop: 'protocol',
          label: '协议'
        },
        {
          prop: 'status',
          label: '状态',
          render: (h, params) => {
            const arr = ['未审核', '已审核', '禁用']
            const s = params.row.status
            return h('span', arr[s - 1])
          }
          // rule: {
          //   NORMAL: '未审核',
          //   AUDITED: '已审核',
          //   DISABLED: '禁用'
          // }
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
              // authCode: '',
              size: 'auto',
              click: 'see',
              status: 2
            },
            {
              name: '查看',
              class: 'btn-blue',
              // authCode: '',
              size: 'auto',
              click: 'see',
              status: 3
            },
            {
              name: '修改',
              class: 'btn-blue',
              // authCode: 'myManufacturerInfo:btn_edit',
              size: 'auto',
              click: 'edit',
              status: 1
            }
            // {
            //   name: '删除',
            //   class: 'btn-red',
            //   // authCode: 'myManufacturerInfo:btn_del',
            //   size: 'auto',
            //   click: 'remove',
            //   status: 'NORMAL'
            // }
          ]
        }
      ],
      // 表单对应列表
      listTypeInfo: {
        manufacturerList: [],
        accessList: [],
        businessList: [],
        typeOfService: [],
        protocolList
      },
      // 表单相关
      formInfo: {
        data: {
          id: '',
          equiptypeName: '',
          manufacturer_id: '',
          protocol: '',
          access_provider: '',
          belong_business_id: '',
          type_of_service_id: '',
          description: ''
        },
        fieldList: [
          {
            label: '编码',
            key: 'id',
            type: 'input',
            className: 'shadow',
            disabled: true,
            required: true
          },
          {
            label: '设备类型',
            key: 'equiptype_name',
            type: 'input',
            className: 'shadow',
            disabled: false,
            rules: [
              { required: true, message: '请输入设备类型', trigger: 'change' }
            ]
          },
          {
            label: '制造商',
            key: 'manufacturer_id',
            valueKey: 'manufacturer_id',
            type: 'select',
            className: 'shadow',
            props: {
              label: 'manufacturer',
              value: 'manufacturer_id'
            },
            disabled: false,
            required: true,
            rules: [
              { required: true, message: '请选择制造商', trigger: 'change' }
            ],
            list: 'manufacturerList',
            handleChange: (value) => {
              this.manufacturerObj = value
            }
          },
          {
            label: '协议',
            key: 'protocol',
            type: 'select',
            className: 'shadow',
            props: {
              label: 'label',
              value: 'value'
            },
            disabled: false,
            required: true,
            rules: [
              { required: true, message: '请选择协议', trigger: 'change' }
            ],
            list: 'protocolList',
            handleChange: (value) => {
            }
          },
          {
            label: '接入商',
            key: 'access_provider',
            type: 'select',
            className: 'shadow',
            placeholder: '接入商',
            props: {
              label: 'title',
              value: 'title'
            },
            list: 'accessList',
            rules: [
              { required: true, message: '请选择接入商', trigger: 'change' }
            ],
            handleChange: (value) => {
            }
          },
          {
            label: '所属系统',
            key: 'belong_business_id',
            type: 'select',
            valueKey: 'id',
            className: 'shadow',
            placeholder: '所属系统',
            props: {
              label: 'title',
              value: 'id'
            },
            list: 'businessList',
            rules: [
              { required: true, message: '请选择所属业务系统', trigger: 'change' }
            ],
            handleChange: (value) => {
              this.businessObj = value
            }
          },
          {
            label: '固件业务',
            key: 'type_of_service_id',
            type: 'select',
            valueKey: 'id',
            className: 'shadow',
            placeholder: '固件业务类型',
            props: {
              label: 'title',
              value: 'id'
            },
            list: 'typeOfService',
            rules: [
              { required: true, message: '请选择固件业务类型', trigger: 'change' }
            ],
            handleChange: (value) => {
              this.typeServiceObj = value
            }
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
  computed: {
    listParams() {
      const { product_key, id, access_provider, status } = this.navFormInfo.data
      const params = {
        product_key,
        id,
        access_provider,
        status,
        limit: this.pagination.limit,
        page: this.pagination.pageIndex
      }
      Object.keys(params).forEach(k => {
        if (params[k] === '') {
          delete params[k]
        }
      })
      return params
    }
  },
  watch: {
    auditarr(val) {
      if (val.length > 0) {
        this.navFormInfo.fieldList.left.inpLists[2].className = 'btn-blue'
        this.navFormInfo.fieldList.left.inpLists[2].isDisabled = false
        this.navFormInfo.fieldList.left.inpLists[3].className = 'btn-blue'
        this.navFormInfo.fieldList.left.inpLists[3].isDisabled = false
      } else {
        this.navFormInfo.fieldList.left.inpLists[2].className = 'btn-blue-disabled'
        this.navFormInfo.fieldList.left.inpLists[2].isDisabled = true
        this.navFormInfo.fieldList.left.inpLists[3].className = 'btn-blue-disabled'
        this.navFormInfo.fieldList.left.inpLists[3].isDisabled = true
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
  created() {
    this.getTypeList()
    this.getAccessList()
    this.getMyEvcMcuInfo()
  },
  mounted() {
    this.getBusinessList()
    this.getTypeOfService()
    this.getManufacturerList()
  },
  methods: {
    initData() {
      this.formInfo.data = {
        id: '',
        equiptype_name: '',
        manufacturer_id: '',
        protocol: '',
        access_provider: '',
        belong_business_id: '',
        type_of_service_id: '',
        description: ''
      }
      this.manufacturerObj = {}
      this.typeServiceObj = {}
      this.businessObj = {}
    },
    resetHandle() {
      this.navFormInfo.data = {
        field: [],
        equiptypeId: '',
        onlineStatus: ''
      }
      this.tableData = []
      this.pagination = {
        total: 0,
        pageIndex: 1,
        limit: 10
      }
      this.getMyEvcMcuInfo()
    },
    searchHandle() {
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
    },
    getAccessList() {
      getAPI(null, '/wlw/myBaseInfo/dict/code/1302').then(res => {
        this.navFormInfo.fieldList.right.inpLists[2].list = res
        this.listTypeInfo.accessList = res
      })
    },
    getBusinessList() { // 获取所属系统
      getAPI(null, '/wlw/myBaseInfo/dict/code/1307').then(res => {
        this.listTypeInfo.businessList = res
      })
    },
    getTypeOfService() { // 获取固件业务类型
      getAPI(null, '/wlw/myBaseInfo/dict/code/1303').then(res => {
        this.listTypeInfo.typeOfService = res
      })
    },
    getManufacturerList() { // 获取厂商列表
      getAPI({ page: 1,
        limit: 10000, status: 'AUDITED' }, '/wlw/myManufacturerInfo/getPageList').then(res => {
        if (res.status === 200) {
          res.data.rows.forEach(r => {
            this.listTypeInfo.manufacturerList.push({
              'manufacturer_id': r.id,
              'manufacturer': r.manufacturer
            })
          })
        }
      })
    },
    getTypeList() {
      const pageElement = getConfigElement('myEquipmentType')
      this.$httpRequest({
        type: 'post',
        payload: {
          page: 1,
          limit: 10000
        },
        uri: pageElement.view_getPageList && pageElement.view_getPageList.uri,
        callback: (res) => {
          if (res.status === 200) {
            this.navFormInfo.fieldList.right.inpLists[1].list = res.data.rows
          }
        }
      })
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
        const uri = dataInterfacePageElement.btn_review && dataInterfacePageElement.btn_review.uri
        this.uploadRequest(uri, obj, '审核成功')
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
        const uri = dataInterfacePageElement.btn_unreview && dataInterfacePageElement.btn_unreview.uri
        this.uploadRequest(uri, obj, '反审核成功')
      })
    },
    setDisabled(idArr) {
      const ids = idArr.join(',')
      this.$confirm('此操作将禁用这些数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        confirmButtonClass: 'btn-blue btn-blue-confirm',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const obj = {
          ids: ids
        }
        const uri = dataInterfacePageElement.btn_disabled && dataInterfacePageElement.btn_disabled.uri
        this.uploadRequest(uri, obj, '禁用成功')
      })
    },
    uploadRequest(uri, payload, message) {
      postUrlAPI(payload, uri).then(res => {
        this.isLoading = false
        if (res.status === 200) {
          this.$message({
            message: message,
            type: 'success'
          })
        }
        this.selection = []
        this.unAuditarr = []
        this.auditarr = []
        this.$refs.tablePage.$refs.tables.clearSelection()
        this.getMyEvcMcuInfo()
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
      if (this.formInfo.fieldList[0].key !== 'id') {
        this.formInfo.fieldList.unshift(idList)
      }
      this.dialogStatus = null
      this.title = '设备类型查看'
      this.formInfo.data = { ...row }
      this.formInfo.data.manufacturer_id = row.manufacturer
      this.formInfo.fieldList.map(res => {
        res.disabled = true
      })
      this.headerObj.title = '查看者'
      this.dialogFormVisible = true
      this.$refs.delogForm && this.$refs.delogForm.resetFields()
    },
    // 修改
    editRow(row, index) {
      if (this.formInfo.fieldList[0].key !== 'id') {
        this.formInfo.fieldList.unshift(idList)
      }
      this.dialogStatus = 'edit'
      this.title = '设备类型更新'
      this.initData()
      this.formInfo.data = { ...row }
      this.formInfo.data.manufacturer_id = row.manufacturer
      this.formInfo.data.manufacturerId = row.manufacturer_id
      this.formInfo.fieldList.map(res => {
        res.disabled = false
      })
      this.headerObj.title = '更新者'
      this.formInfo.fieldList[0].disabled = true
      this.dialogFormVisible = true
      this.$refs.delogForm && this.$refs.delogForm.resetFields()
    },
    // 复选框
    handleSelectionChange(selection) {
      this.selection = selection
      this.auditarr = [] // 已审核数组
      this.unAuditarr = [] // 未审核数组
      selection.forEach((item) => {
        if (item.status === 2) {
          this.auditarr.push(item.id)
        } else if (item.status === 1) {
          this.unAuditarr.push(item.id)
        }
      })
    },
    // dialog确定按钮
    determine() {
      const bol = this.$refs.delogForm.validateSelf()
      if (!bol) return
      let uri = dataInterfacePageElement.btn_add && dataInterfacePageElement.btn_add.uri
      const obj = {
        accessProvider: this.formInfo.data.access_provider,
        belongBusinessId: this.formInfo.data.belong_business_id,
        belongBusiness: { key: this.businessObj.id, label: this.businessObj.title },
        belongBusinessName: this.businessObj.title,
        description: this.formInfo.data.description,
        equiptypeName: this.formInfo.data.equiptype_name,
        id: this.formInfo.data.id,
        manufacturer: this.manufacturerObj.manufacturer,
        manufacturerId: this.manufacturerObj.manufacturer_id,
        protocol: this.formInfo.data.protocol,
        typeOfServiceId: this.typeServiceObj.id,
        typeOfServiceName: this.typeServiceObj.title,
        typeOfService: { key: this.typeServiceObj.id, label: this.typeServiceObj.title }
      }
      if (this.dialogStatus === 'edit') {
        uri = dataInterfacePageElement.btn_edit && dataInterfacePageElement.btn_edit.uri
        const manu = this.listTypeInfo.manufacturerList.find(m => {
          return m.manufacturer_id === this.formInfo.data.manufacturer_id
        })
        if (manu) {
          obj.manufacturer = manu.manufacturer
          obj.manufacturerId = manu.manufacturer_id
        } else {
          obj.manufacturer = this.formInfo.data.manufacturer_id
          obj.manufacturerId = this.formInfo.data.manufacturerId
        }
        const busis = this.listTypeInfo.businessList.find(b => {
          return b.id === this.formInfo.data.belong_business_id
        })
        obj.belongBusiness = { key: busis.id, label: busis.title }
        obj.belongBusinessName = busis.title

        const type = this.listTypeInfo.typeOfService.find(m => {
          return m.id === this.formInfo.data.type_of_service_id
        })
        obj.typeOfServiceId = type.id
        obj.typeOfServiceName = type.title
        obj.typeOfService = { key: type.id, label: type.title }
      }
      this.buttonLoading = true
      httpRequest({
        type: 'post',
        uri: uri,
        payload: this.handleObj(obj),
        callback: (res) => {
          this.buttonLoading = false
          if (res.status === 200) {
            const msg = this.dialogStatus === 'edit' ? '修改成功' : '新增成功'
            this.$message.success(msg)
            this.getMyEvcMcuInfo()
            this.getTypeList()
          }
        }
      })
      this.dialogFormVisible = false
    },
    // 获取列表信息
    getMyEvcMcuInfo() {
      this.isLoading = true
      httpRequest({
        type: 'post',
        uri: dataInterfacePageElement.view_getPageList && dataInterfacePageElement.view_getPageList.uri,
        payload: this.listParams,
        callback: (res) => {
          this.isLoading = false
          if (res.status === 200) {
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
<style lang="scss" scoped>
.dialog-header {
  font-size: 14px;
  color: #ffffff;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  .update-user {
    width: 60px;
    text-align: left;
  }
}
</style>
