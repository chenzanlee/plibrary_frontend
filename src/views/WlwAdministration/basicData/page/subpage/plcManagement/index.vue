<template>
  <div class="home plcManage">
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
      width="900px"
      max-height="80vh"
    >
      <div class="body">
        <general-form
          ref="delog"
          label-width="100px"
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
        <el-button v-if="title === 'PLC管理新增' || title === 'PLC管理修改'" class="btn-blue" :loading="buttonLoading" @click="determine">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import tablePage from '@/components/ElementComponent/iTable'
import navForm from '@/components/commonComponent/navForm/index.vue'
import generalForm from '@/components/commonComponent/generalForm'
// import { evcJsonh2Tree } from '@/components/tree/evcJsonh2Tree.js'
import { getConfigElement } from '@/utils/overtService'
// import { this.$httpRequest } from '@/http/dispatch'
const dataInterfacePageElement = getConfigElement('myPlcInfo')
export default {
  components: {
    tablePage,
    navForm,
    generalForm
  },
  data() {
    return {
      nameList: [],
      navformDisabled: false,
      dialogFormVisible: false,
      isLoading: false,
      buttonLoading: false,
      title: '',
      rowData: '', // 点击查看选中的行数据
      status: 0, // 0=>查看 1=>xinzeng  2=>修改
      selection: '',
      auditarr: [], // 已审核数组
      unAuditarr: [], // 未审核数组
      navFormInfo: {
        data: {
          area: '',
          fieldCode: '',
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
                  this.title = 'PLC管理新增'
                  this.dialogFormVisible = true
                  this.formInfo.data.area = []
                  this.formInfo.data.plcName = ''
                  this.formInfo.data.innerCode = ''
                  this.formInfo.data.ip = ''
                  this.formInfo.data.port = ''
                  this.formInfo.data.plcType = ''
                  this.formInfo.data.address1 = ''
                  this.formInfo.data.address1Type = ''
                  this.formInfo.data.address1Length = ''
                  this.formInfo.data.address2 = ''
                  this.formInfo.data.address2Type = ''
                  this.formInfo.data.address2Length = ''
                  this.formInfo.data.plcMode = ''
                  this.formInfo.data.plcType = ''
                  this.formInfo.data.deviceManufactor = ''
                  this.formInfo.data.model = ''
                  this.formInfo.data.description = ''
                  this.formInfo.fieldList.map(res => {
                    res.disabled = false
                  })
                  if (this.$refs['delog'].$refs['cascader'][0]) {
                    this.$refs['delog'].$refs['cascader'][0].panel.activePath = []
                  }
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
                customLabel: 'regionName',
                customValue: 'regionNum',
                className: 'shadow',
                placeholder: '大区 / 区域 / 场区',
                options: []
              },
              {
                key: 'fieldCode',
                type: 'input',
                className: 'shadow',
                placeholder: '场内编码'
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
                  this.pagination.pageIndex = 1
                  this.getMyEvcMcuInfo()
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
          width: '100',
          prop: 'regionName',
          label: '大区'
        },
        {
          width: '100',
          prop: 'areaName',
          label: '区域'
        },
        {
          width: '200',
          prop: 'fieldName',
          label: '场区'
        },
        {
          longData: true,
          width: '160',
          prop: 'deviceManufactor',
          label: '设备厂家'
        },
        {
          width: '100',
          prop: 'model',
          label: '型号'
        },
        {
          width: '160',
          prop: 'ip',
          label: 'IP地址',
          render: (h, params) => {
            return h('div', params.row.ip + ':' + params.row.port)
          }
        },
        {
          width: '160',
          prop: 'innerCode',
          label: '场内编码'
        },
        {
          width: '160',
          prop: 'appName',
          label: '所属系统'
        },
        {
          longData: true,
          width: '160',
          prop: 'plcMode',
          label: '所属应用',
          render: (h, params) => {
            return h('div', this.getPlcModeName(params, params.row.plcMode) || '---')
          }
        },
        {
          width: '160',
          prop: 'plcType',
          label: '设备类型',
          render: (h, params) => {
            return h('div', this.getPlcTypeName(params, params.row.plcType) || '---')
          }
        },
        {
          width: '160',
          prop: 'status',
          label: '状态',
          rule: {
            NORMAL: '未审核',
            AUDITED: '已审核'
          }
        },
        {
          width: '200',
          prop: 'crtTime',
          label: '创建日期'
        },
        {
          width: '130',
          prop: 'crtName',
          label: '创建人'
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
      listTypeInfo: {
        typeList: [],
        ModbusTypeList: [],
        AppList: [],
        PlcModeList: [],
        PlcTypeList: []
      },
      // 表单相关
      formInfo: {
        data: {
          area: '', // 位置
          // status: '1',
          plcName: '',
          innerCode: '',
          ip: '',
          port: '',
          address1: '', // 起始地址
          address1Type: '', // 类型
          address1Length: '', // 长度
          address2: '', // 异常起始地址
          address2Type: '', // 类型
          address2Length: '', // 长度
          appCode: '',
          plcMode: '',
          plcType: '',
          deviceManufactor: '',
          model: '',
          description: ''
        },
        fieldList: [
          {
            span: 12,
            label: 'PLC名称',
            key: 'plcName',
            type: 'input',
            className: 'shadow',
            placeholder: 'PLC名称',
            disabled: false,
            required: true,
            rules: [
              { required: true, message: '请填写PLC名称', trigger: 'change' }
            ]
          },
          {
            span: 12,
            label: '地区',
            key: 'area',
            type: 'cascader',
            className: 'shadow',
            customLabel: 'regionName',
            customValue: 'regionNum',
            placeholder: '请选择大区 / 区域 / 场区',
            clearable: 'clearable',
            disabled: false,
            required: true,
            rules: [
              { required: true, message: '请选择地区', trigger: 'change' }
            ],
            options: []
          },
          {
            span: 12,
            label: '场内编码',
            key: 'innerCode',
            type: 'input',
            className: 'shadow',
            placeholder: '场内编码',
            disabled: false,
            required: true,
            rules: [
              { required: true, message: '请填写场内编码', trigger: 'change' }
            ]
          },
          {
            span: 12,
            label: 'IP地址',
            key: 'ip',
            type: 'input',
            className: 'shadow',
            placeholder: 'IP地址',
            disabled: false,
            required: true,
            rules: [
              { required: true, message: '请填写IP地址', trigger: 'change' }
            ]
          },
          {
            span: 12,
            label: '设备端口',
            key: 'port',
            type: 'input',
            controlsPositionRight: 'right',
            precision: 0,
            className: 'shadow',
            placeholder: '请选择设备端口',
            min: 1,
            disabled: false,
            required: true,
            rules: [
              {
                validator: (rule, value, callback) => {
                  // console.log('rule---', rule)
                  // console.log('value---', value)
                  if (value === '') callback() // 这里 为空直接放过去
                  if (!Number.isInteger(Number(value))) callback('请输入正整数')
                  else if (value < 0.9) callback('请输入正整数')
                  else callback()
                },
                trigger: ['blur']
              }
            ]
          },
          {
            span: 12,
            label: '设备类型',
            key: 'plcType',
            type: 'select',
            className: 'shadow',
            placeholder: '请选择设备类型',
            props: {
              label: 'name',
              value: 'value'
            },
            disabled: false,
            required: true,
            rules: [
              { required: true, message: '请选择设备类型', trigger: 'change' }
            ],
            list: 'PlcTypeList'
          },
          {
            span: 12,
            label: '起始地址',
            key: 'address1',
            type: 'input',
            className: 'shadow',
            placeholder: '起始地址',
            disabled: false,
            required: true,
            rules: [
              { required: true, message: '请填写起始地址', trigger: 'change' }
            ]
          },
          {
            span: 12,
            label: '类型',
            key: 'address1Type',
            type: 'select',
            className: 'shadow',
            placeholder: '请选择类型',
            props: {
              label: 'modbusType',
              value: 'modbusType'
            },
            disabled: false,
            required: true,
            rules: [
              { required: true, message: '请选择类型', trigger: 'change' }
            ],
            list: 'ModbusTypeList'
          },
          {
            span: 12,
            label: '长度',
            key: 'address1Length',
            type: 'input',
            controlsPositionRight: 'right',
            className: 'shadow',
            placeholder: '长度',
            min: 1,
            disabled: false,
            required: true,
            rules: [
              {
                validator: (rule, value, callback) => {
                  // console.log('rule---', rule)
                  // console.log('value---', value)
                  if (value === '') callback() // 这里 为空直接放过去
                  if (!Number.isInteger(Number(value))) callback('请输入整数')
                  // else if (value < 0.9) callback('请输入正整数')
                  else callback()
                },
                trigger: ['blur']
              }
            ]
          },
          {
            span: 12,
            label: '异常起始地址',
            key: 'address2',
            type: 'input',
            className: 'shadow',
            placeholder: '异常起始地址',
            disabled: false
          },
          {
            span: 12,
            label: '类型',
            key: 'address2Type',
            type: 'select',
            className: 'shadow',
            placeholder: '请选择类型',
            props: {
              label: 'modbusType',
              value: 'modbusType'
            },
            disabled: false,
            list: 'ModbusTypeList'
          },
          {
            span: 12,
            label: '长度',
            key: 'address2Length',
            type: 'input',
            // controlsPositionRight: 'right',
            // min: 1,
            className: 'shadow',
            placeholder: '请输入长度',
            disabled: false,
            required: false,
            rules: [
              {
                validator: (rule, value, callback) => {
                  // console.log('rule---', rule)
                  // console.log('value---', value)
                  if (value === '') callback() // 这里 为空直接放过去
                  if (!Number.isInteger(Number(value))) callback('请输入整数')
                  // else if (value < 0.9) callback('请输入正整数')
                  else callback()
                },
                trigger: ['blur']
              }
            ]
          },
          {
            span: 12,
            label: '所属系统',
            key: 'appCode',
            type: 'select',
            className: 'shadow',
            placeholder: '请选择所属系统',
            props: {
              label: 'appName',
              value: 'appCode'
            },
            disabled: false,
            required: true,
            rules: [
              { required: true, message: '请选择所属系统', trigger: 'change' }
            ],
            list: 'AppList'
          },
          {
            span: 12,
            label: '所属应用',
            key: 'plcMode',
            type: 'select',
            className: 'shadow',
            placeholder: '请选择所属应用',
            props: {
              label: 'name',
              value: 'value'
            },
            disabled: false,
            required: true,
            rules: [
              { required: true, message: '请选择所属应用', trigger: 'change' }
            ],
            list: 'PlcModeList'
          },
          {
            span: 12,
            label: '设备厂家',
            key: 'deviceManufactor',
            type: 'input',
            className: 'shadow',
            placeholder: '设备厂家',
            disabled: false
          },
          {
            span: 12,
            label: '设备型号',
            key: 'model',
            type: 'input',
            className: 'shadow',
            placeholder: '设备型号',
            disabled: false
          },
          {
            span: 12,
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
  async mounted() {
    await this.getTree()
    await this.getModbusTypeList()
    await this.getAppList()
    await this.getListPlcMode()
    await this.getlistPlcType()
    await this.getMyEvcMcuInfo()
  },
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
        this.$httpRequest({
          type: 'post',
          uri: dataInterfacePageElement.review && (dataInterfacePageElement.review.uri + `?ids=${obj.ids}`),
          payload: obj,
          callback: (res) => {
            this.isLoading = false
            this.$message({
              message: '审核成功',
              type: 'success'
            })
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
        this.$httpRequest({
          type: 'post',
          uri: dataInterfacePageElement.unreview && (dataInterfacePageElement.unreview.uri + `?ids=${obj.ids}`),
          payload: obj,
          callback: (res) => {
            this.isLoading = false
            this.$message({
              message: '反审核成功',
              type: 'success'
            })
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
      let plcMode = ''
      let plcType = ''
      let appCode = ''
      this.listTypeInfo.PlcModeList.map(res => {
        if (row.plcMode === res.value) {
          plcMode = res.name
        }
      })
      this.listTypeInfo.PlcTypeList.map(res => {
        if (row.plcType === res.value) {
          plcType = res.name
        }
      })
      this.listTypeInfo.AppList.map(res => {
        if (row.appCode === res.appCode) {
          appCode = res.appName
        }
      })
      this.title = 'PLC管理查看'
      this.formInfo.data.area = [row.regionId, row.areaId, row.fieldId]
      this.formInfo.data.plcName = row.plcName
      this.formInfo.data.innerCode = row.innerCode
      this.formInfo.data.ip = row.ip
      this.formInfo.data.port = row.port
      this.formInfo.data.address1 = row.address1
      this.formInfo.data.address1Type = row.address1Type
      this.formInfo.data.address1Length = row.address1Length
      this.formInfo.data.address2 = row.address2
      this.formInfo.data.address2Type = row.address2Type
      this.formInfo.data.address2Length = row.address2Length
      this.formInfo.data.appCode = appCode
      this.formInfo.data.plcMode = plcMode
      this.formInfo.data.plcType = plcType
      this.formInfo.data.deviceManufactor = row.deviceManufactor
      this.formInfo.data.model = row.model
      this.formInfo.data.description = row.description
      this.formInfo.fieldList.map(res => {
        res.disabled = true
      })
      this.dialogFormVisible = true
    },
    // 删除
    removeRow(row, index) {
      this.$httpRequest({
        type: 'DELETE',
        uri: dataInterfacePageElement.delete && dataInterfacePageElement.delete.uri,
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
      let plcMode = ''
      let plcType = ''
      let appCode = ''
      this.listTypeInfo.PlcModeList.map(res => {
        if (row.plcMode === res.value) {
          plcMode = res.name
        }
      })
      this.listTypeInfo.PlcTypeList.map(res => {
        if (row.plcType === res.value) {
          plcType = res.name
        }
      })
      this.listTypeInfo.AppList.map(res => {
        if (row.appCode === res.appCode) {
          appCode = res.appName
        }
      })
      this.title = 'PLC管理修改'
      this.formInfo.data.area = [row.regionId, row.areaId, row.fieldId]
      this.formInfo.data.plcName = row.plcName
      this.formInfo.data.innerCode = row.innerCode
      this.formInfo.data.ip = row.ip
      this.formInfo.data.port = row.port
      this.formInfo.data.address1 = row.address1
      this.formInfo.data.address1Type = row.address1Type
      this.formInfo.data.address1Length = row.address1Length
      this.formInfo.data.address2 = row.address2
      this.formInfo.data.address2Type = row.address2Type
      this.formInfo.data.address2Length = row.address2Length
      this.formInfo.data.appCode = appCode
      this.formInfo.data.plcMode = plcMode
      this.formInfo.data.plcType = plcType
      this.formInfo.data.deviceManufactor = row.deviceManufactor
      this.formInfo.data.model = row.model
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
      const obj = {
        regionId: this.formInfo.data.area[0] || '',
        regionName: this.nameList[0] || '',
        areaId: this.formInfo.data.area[1] || '',
        areaName: this.nameList[1] || '',
        fieldId: this.formInfo.data.area[2] || '',
        fieldName: this.nameList[2] || '',
        address1: this.formInfo.data.address1,
        address1Length: this.formInfo.data.address1Length,
        address1Type: this.formInfo.data.address1Type,
        address2: this.formInfo.data.address2,
        address2Length: this.formInfo.data.address2Length,
        address2Type: this.formInfo.data.address2Type,
        description: this.formInfo.data.description,
        deviceManufactor: this.formInfo.data.deviceManufactor,
        innerCode: this.formInfo.data.innerCode,
        ip: this.formInfo.data.ip,
        model: this.formInfo.data.model,
        appCode: this.formInfo.data.appCode,
        plcMode: this.formInfo.data.plcMode,
        plcName: this.formInfo.data.plcName,
        plcType: this.formInfo.data.plcType,
        port: this.formInfo.data.port,
        id: this.rowData.id
      }
      let uri = ''
      let p = ''
      if (this.title === 'PLC管理修改') {
        uri = dataInterfacePageElement.update && dataInterfacePageElement.update.uri
        p = 'put'
      } else {
        uri = dataInterfacePageElement.add && dataInterfacePageElement.add.uri
        p = 'post'
      }
      this.buttonLoading = true
      this.$httpRequest({
        type: p,
        uri: uri,
        payload: this.handleObj(obj),
        callback: (res) => {
          this.buttonLoading = false
          if (res.status === 200) {
            console.log(res.data)
          }
        }
      })
      this.dialogFormVisible = false
      this.getMyEvcMcuInfo()
    },
    // 获取区域联动数据
    getTree() {
      this.$httpRequest({
        type: 'post',
        uri: '/wlw/myBaseInfo/treeForSelectV1',
        payload: '',
        callback: (res) => {
          if (res.status === 200) {
            // const arr = evcJsonh2Tree(res.data)
            this.navFormInfo.fieldList.right.inpLists[0].options = res.data
            this.formInfo.fieldList[1].options = res.data
          }
        }
      })
    },
    // 获取类型
    getModbusTypeList() {
      this.$httpRequest({
        type: 'get',
        uri: dataInterfacePageElement.getModbusTypeList && dataInterfacePageElement.getModbusTypeList.uri,
        payload: '',
        callback: (res) => {
          if (res.status === 200) {
            this.listTypeInfo.ModbusTypeList = res.data.rows || []
          }
        }
      })
    },
    // 获取设备所属系统
    getAppList() {
      this.$httpRequest({
        type: 'get',
        uri: dataInterfacePageElement.getAppList && dataInterfacePageElement.getAppList.uri,
        payload: '',
        callback: (res) => {
          if (res.status === 200) {
            this.listTypeInfo.AppList = res.data.rows || []
          }
        }
      })
    },
    // 获取设备所属应用
    getListPlcMode() {
      this.$httpRequest({
        type: 'get',
        uri: dataInterfacePageElement.listPlcMode && dataInterfacePageElement.listPlcMode.uri,
        payload: '',
        callback: (res) => {
          if (res.status === 200) {
            this.listTypeInfo.PlcModeList = res.data || []
          }
        }
      })
    },
    // 获取设备类型
    getlistPlcType() {
      this.$httpRequest({
        type: 'get',
        uri: dataInterfacePageElement.listPlcType && dataInterfacePageElement.listPlcType.uri,
        payload: '',
        callback: (res) => {
          if (res.status === 200) {
            this.listTypeInfo.PlcTypeList = res.data || []
          }
        }
      })
    },
    // 获取表单信息
    getMyEvcMcuInfo() {
      this.isLoading = true
      const obj = {
        regionId: this.navFormInfo.data.area[0],
        areaId: this.navFormInfo.data.area[1],
        fieldId: this.navFormInfo.data.area[2],
        fieldCode: this.navFormInfo.data.fieldCode,
        limit: this.pagination.limit,
        page: this.pagination.pageIndex,
        status: this.navFormInfo.data.status
      }
      this.$httpRequest({
        type: 'get',
        uri: dataInterfacePageElement.getPageList && dataInterfacePageElement.getPageList.uri,
        payload: this.handleObj(obj),
        callback: (res) => {
          this.isLoading = false
          if (res.status === 200) {
            const arr = res.data.rows
            this.tableData = arr || []
            this.pagination.total = res.data.total
            this.$refs['tablePage'].$children[0].clearSelection()
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
    },
    getPlcModeName(arr, val) {
      let name = ''
      const id = val
      this.listTypeInfo.PlcModeList.map((item) => {
        if (item.value === id) {
          name = item.name
        }
      })
      return name
    },
    getPlcTypeName(arr, val) {
      let name = ''
      const id = val
      this.listTypeInfo.PlcTypeList.map((item) => {
        if (item.value === id) {
          name = item.name
        }
      })
      return name
    }
  }
}
</script>
<style lang="scss">
.plcManage{
  .el-dialog {
    max-height: 80vh;
  }
  .el-dialog__body{
    // padding: 20px 30px;
  }
  .el-table__empty-text{
    width: 58% !important;
  }
  .itable-empty-box-wrap{
    justify-content: inherit !important;
  }
}
</style>
