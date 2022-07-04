<!--  -->
<template>
  <div class="equipmentFaultCode">
    <!-- 头部导航 -->
    <nav-form ref="navForm" :data="navFormInfo.data" :field-list="navFormInfo.fieldList" />
    <!-- 内容表格 -->
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
    <!-- 新增/编辑/查看 dialog -->
    <el-dialog
      :title="title"
      :modal-append-to-body="false"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      width="500px"
    >
      <div class="body">
        <div class="top-title">
          <div>
            <div class="item">
              <span class="label">设备类型</span>
              <span class="value">{{ row && row.equiptype_name ? row.equiptype_name : '---' }}</span>
            </div>
            <div class="item">
              <span class="label">厂商名称</span>
              <span class="value">{{ row && row.check_name !== null ? row.check_name : '---' }}</span>
            </div>
            <div class="item">
              <span class="label">协议</span>
              <span class="value">{{ row && row.check_host !== null ? row.check_host : '---' }}</span>
            </div>
          </div>

          <!-- <div class="item">厂商名称：{{ !row || row.check_name!== null ? row.check_name : '---' }}</div>
          <div class="item">协议：{{ !row || row.check_name!== null ? row.check_host : '---' }}</div> -->
        </div>
        <general-form
          ref="delog"
          label-width="80px"
          :data="formInfo.data"
          :field-list="formInfo.fieldList"
          :list-type-info="listTypeInfo"
          theme-type="default"
          @cascaderEvent="cascaderEvent"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <div style="margin:0 auto;">
          <el-button class="btn-border" @click="dialogFormVisible = false">取 消</el-button>
          <el-button v-if="status==1" class="btn-blue" :loading="btnLoading" type="primary" @click="determine">确 定</el-button>
          <el-button v-if="status==2" class="btn-blue" :loading="btnLoading" type="primary" @click="determine">更 新</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const trouble_type_list = [
  {
    name: '告警',
    value: '1'
  },
  {
    name: '故障',
    value: '3'
  }
]
import navForm from '@/components/commonComponent/navForm/index.vue'
import tablePage from '@/components/ElementComponent/iTable'
import generalForm from '@/components/commonComponent/generalForm'
import { getConfigElement } from '@/utils/overtService'
export default {
  components: {
    navForm,
    tablePage,
    generalForm
  },
  data() {
    return {
      btnLoading: false,
      pageElement: [], // 当前页面数据权限
      commonElement: [], // 公共数据权限
      pagination: { // 表格分页
        total: 0,
        pageIndex: 1,
        limit: 10
      },
      options: { // 表格配置项
        stripe: false, // 斑马纹
        firstFixed: true, // 首航固定
        mutiSelect: true, // 多选框
        loading: false, // 表格动画
        initTable: true // 是否一挂载就加载数据
      },
      selection: [], // 表格选中数组
      auditarr: [], // 已审核数组
      unAuditarr: [], // 未审核数组
      isLoading: false, // 表格loading
      tableData: [], // 表格数据
      columns: [ // 列项
        {
          longData: true,
          prop: 'trouble_code',
          label: '故障码',
          width: '150'
        },
        {
          longData: 'true',
          prop: 'trouble_name',
          label: '故障名称',
          width: '180'
        },
        {
          prop: 'trouble_type',
          label: '故障类型',
          width: '130',
          rule: {
            '1': '告警',
            '3': '故障'
          }
        },
        {
          longData: 'true',
          prop: 'equiptype_name',
          label: '设备类型',
          width: '180'
        },
        {
          longData: 'true',
          prop: 'equipment_version_name',
          label: '设备型号',
          width: '180'
        },
        {
          longData: 'true',
          prop: 'check_name',
          label: '厂商名称',
          width: '180'
        },
        {
          longData: 'true',
          prop: 'check_host',
          label: '协议',
          width: '180'
        },
        {
          longData: 'true',
          prop: 'upd_time',
          label: '更新时间',
          width: '180'
        },
        {
          prop: 'status',
          label: '状态',
          width: '180',
          rule: {
            0: '初始化',
            1: '未审核',
            2: '已审核',
            3: '禁用'
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
              status: '2'
            },
            {
              name: '查看',
              class: 'btn-blue',
              authCode: '',
              size: 'auto',
              click: 'see',
              status: '3'
            },
            {
              name: '修改',
              class: 'btn-blue',
              authCode: 'myEquipmentTroubleCode:btn_edit',
              size: 'auto',
              click: 'edit',
              status: '1'
            },
            {
              name: '删除',
              class: 'btn-red',
              authCode: 'myEquipmentTroubleCode:btn_delete',
              size: 'auto',
              click: 'remove',
              status: '1'
            },
            {
              name: '修改',
              class: 'btn-blue',
              authCode: 'myEquipmentTroubleCode:btn_edit',
              size: 'auto',
              click: 'edit',
              status: '0'
            },
            {
              name: '删除',
              class: 'btn-red',
              authCode: 'myEquipmentTroubleCode:btn_delete',
              size: 'auto',
              click: 'remove',
              status: '0'
            }
          ]
        }
      ],
      navFormInfo: {
        data: {
          trouble_code: '', // 故障码
          id: '', // 故障名称 ID
          equipment_version_id: '', // 设备型号 ID
          status: ''
        },
        fieldList: {
          left: {
            inpLists: [
              {
                type: 'button',
                innerText: '新增',
                authCode: 'myEquipmentTroubleCode:btn_add',
                className: 'btn-blue',
                handleClick: () => {
                  this.status = 1
                  this.dialogFormVisible = true
                }
              },
              {
                type: 'button',
                innerText: '审核',
                authCode: 'myEquipmentTroubleCode:btn_review',
                isDisabled: true,
                className: 'btn-blue',
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
                  this.$confirm('此操作将审核这些数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    confirmButtonClass: 'btn-blue btn-blue-confirm',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.setReview(this.unAuditarr)
                  }).catch(() => {})
                }
              },
              {
                type: 'button',
                innerText: '反审核',
                authCode: 'myEquipmentTroubleCode:btn_unreview',
                isDisabled: true,
                className: 'btn-blue',
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
                  this.$confirm('此操作将反审核这些数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    confirmButtonClass: 'btn-blue btn-blue-confirm',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.setUnreview(this.auditarr)
                  }).catch(() => {})
                }
              },
              {
                type: 'button',
                innerText: '禁用',
                authCode: 'myEquipmentTroubleCode:btn_disabled',
                isDisabled: true,
                className: 'btn-blue',
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
                  this.$confirm('此操作将禁用这些数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    confirmButtonClass: 'btn-blue btn-blue-confirm',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.setDisabled(this.auditarr)
                  }).catch(() => {})
                }
              }
            ]
          },
          right: {
            inpLists: [
              {
                key: 'status',
                type: 'radio',
                required: true,
                className: 'shadow',
                placeholder: '333',
                customLabel: 'name',
                customVal: 'val',
                optList: [{ name: '禁用', val: '3' }, { name: '已审核', val: '2' }, { name: '未审核', val: '1' }]
              },
              {
                key: 'trouble_code',
                type: 'input',
                placeholder: '请输入故障码',
                className: 'shadow',
                clearable: true,
                options: []
              },
              {
                key: 'id',
                type: 'select',
                placeholder: '请选择故障名称',
                className: 'shadow',
                filterable: true, // 可搜索
                props: {
                  label: 'trouble_name',
                  value: 'id'
                },
                clearable: true,
                list: []
              },
              {
                key: 'equipment_version_id',
                type: 'select',
                placeholder: '请选择设备型号',
                className: 'shadow',
                filterable: true, // 可搜索
                props: {
                  label: 'version_name',
                  value: 'id'
                },
                clearable: true,
                list: []
              }
            ],
            btnLists: [
              {
                innerText: '查询',
                className: 'btn-blue',
                handleClick: () => {
                  this.pagination.pageIndex = 1
                  this.getMyEvcMcuInfo()
                }
              },
              {
                innerText: '重置',
                className: 'btn-border',
                handleClick: () => {
                  this.$refs['navForm'].resetFields()
                  // console.log(this.navFormInfo.data.area)
                  this.getMyEvcMcuInfo()
                }
              }
            ]
          }
        }
      },
      status: 0, // 0查看 1新增 2修改
      row: null, // 查看/编辑时 当前选中行数据
      dialogFormVisible: false, // 新增/编辑/查看 dialog控制变量
      listTypeInfo: { // dialog下拉框对应内容OBJ
        equipment_version_id_list: [],
        trouble_type_list
      },
      equipment_version_obj: {}, // 设备型号的 obj
      formInfo: {
        data: {
          equipment_version_id: '', // 设备型号 ID
          trouble_code: '', // 故障码
          trouble_name: '', // 故障名称
          trouble_type: '', // 故障类型
          description: '' // 备注
        },
        fieldList: [
          {
            key: 'equipment_version_id',
            label: '设备型号',
            type: 'select',
            filterable: true, // 可搜索
            list: 'equipment_version_id_list',
            className: 'shadow',
            required: true,
            rules: [{ required: true, message: '请选择设备型号', trigger: 'change' }],
            handleChange: (data) => {
              console.log('设备OBJ--', data)
              this.equipment_version_obj = data
            },
            valueKey: 'id',
            props: {
              label: 'version_name',
              value: 'id'
            }
          },
          {
            key: 'trouble_code',
            type: 'input',
            label: '故障码',
            className: 'shadow',
            required: true,
            rules: [{ required: true, message: '请输入16进制字符', trigger: 'rule' }]
          },
          {
            key: 'trouble_name',
            type: 'input',
            label: '故障名称',
            className: 'shadow',
            required: true,
            rules: [{ required: true, message: '请输入故障名称', trigger: 'rule' }]
          },
          {
            key: 'trouble_type',
            label: '故障类型',
            type: 'select',
            filterable: true, // 可搜索
            list: 'trouble_type_list',
            className: 'shadow',
            required: true,
            rules: [{ required: true, message: '请选择故障类型', trigger: 'change' }],
            handleChange: (data) => {
              // console.log(data)
            },
            props: {
              label: 'name',
              value: 'value'
            }
          },
          {
            key: 'description',
            type: 'input',
            placeholder: '请输入备注',
            className: 'shadow',
            label: '备注'
          }
        ]
      }
    }
  },
  computed: {
    title() {
      const titleArr = ['查看', '新增', '修改']
      const status = this.status
      return titleArr[status]
    }
  },
  watch: {
    dialogFormVisible(val) { // 手动清楚一下提示语
      if (!val) {
        this.$refs['delog'].resetFields()
        this.equipment_version_obj = {}
        this.row = null
        const data = {
          equipment_version_id: '', // 设备型号 ID
          trouble_code: '', // 故障码
          trouble_name: '', // 故障名称
          trouble_type: '', // 故障类型
          description: '' // 备注
        }
        this.resetFormInfo(data, false)
      }
    },
    auditarr(val) { // 已审核数组
      this.navFormInfo.fieldList.left.inpLists[2].isDisabled = !(val.length) // 改变反审核按钮DIS状态
      this.navFormInfo.fieldList.left.inpLists[3].isDisabled = !(val.length) // 改变禁用按钮DIS状态
    },
    unAuditarr(val) { // 未审核数组
      this.navFormInfo.fieldList.left.inpLists[1].isDisabled = !(val.length) // 改变审核按钮DIS状态
    }
  },
  created() {
    this.pageElement = getConfigElement('myEquipmentTroubleCode')
    this.commonElement = getConfigElement('wlwDataInterface')
    this.init()
  },
  methods: {
    init() {
      this.getIds()
      this.getEquipmentVersionIds()
      this.getMyEvcMcuInfo()
    },
    getEquipmentVersionIds() { // 设备型号
      const element = this.commonElement['myEquipmentVersionGetPageListByDto']
      console.log('element', element)
      const params = {
        limit: 10000,
        page: 1
      }
      this.$httpRequest({
        type: element.method,
        uri: element.uri,
        payload: params,
        callback: res => {
          if (res.status === 200) {
            this.navFormInfo.fieldList.right.inpLists[3].list = res.data.rows
            this.listTypeInfo.equipment_version_id_list = res.data.rows
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    getIds() { // 故障名称
      const element = this.pageElement['view_getPageList']
      const params = {
        limit: 10000,
        page: 1
      }
      this.$httpRequest({
        type: element.method,
        uri: element.uri,
        payload: params,
        callback: res => {
          if (res.status === 200) {
            this.navFormInfo.fieldList.right.inpLists[2].list = res.data.rows
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    getMyEvcMcuInfo() { // 查询表格数据
      const element = this.pageElement['view_getPageList']
      const params = {
        limit: this.pagination.limit,
        page: this.pagination.pageIndex
      }
      const { trouble_code, id, equipment_version_id, status } = this.navFormInfo.data
      if (trouble_code) params.trouble_code = trouble_code
      if (id) params.id = id
      if (equipment_version_id) params.equipment_version_id = equipment_version_id
      if (status) params.status = status
      this.isLoading = true
      this.$httpRequest({
        type: element.method,
        uri: element.uri,
        payload: params,
        callback: res => {
          this.isLoading = false
          if (res.status === 200) {
            this.pagination.total = res.data.total
            this.tableData = res.data.rows
            this.$refs['tablePage'].$children[0].clearSelection()
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    setReview(idArr) { // 审核
      const element = this.pageElement['btn_review']
      const params = {
        ids: idArr.join(',')
      }
      this.$httpRequest({
        type: element.method,
        uri: element.uri,
        payload: params,
        callback: res => {
          if (res.status === 200) {
            this.$message.success('审核成功')
            this.getMyEvcMcuInfo()
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    setUnreview(idArr) { // 反审核
      const element = this.pageElement['btn_unreview']
      const params = {
        ids: idArr.join(',')
      }
      this.$httpRequest({
        type: element.method,
        uri: element.uri,
        payload: params,
        callback: res => {
          if (res.status === 200 && res.rel) {
            this.$message.success('反审核成功')
            this.getMyEvcMcuInfo()
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    setDisabled(idArr) { // 禁用
      const element = this.pageElement['btn_disabled']
      const params = {
        ids: idArr.join(',')
      }
      this.$httpRequest({
        type: element.method,
        uri: element.uri,
        payload: params,
        callback: res => {
          if (res.status === 200 && res.rel) {
            this.$message.success('禁用成功')
            this.getMyEvcMcuInfo()
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    removeRow(row) { // 表格行删除
      const element = this.pageElement['btn_delete']
      const params = {
        ids: row.id
      }
      this.$httpRequest({
        type: element.method,
        uri: element.uri,
        payload: params,
        callback: res => {
          if (res.status === 200 && res.rel) {
            this.$message.success('删除成功')
            this.getMyEvcMcuInfo()
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    childSeeRow(row) { // 表格行查看
      this.row = row
      this.status = 0
      this.dialogFormVisible = true
      this.equipment_version_obj = {}
      const { equipment_version_id, trouble_code, trouble_name, trouble_type, description } = row
      const data = {
        equipment_version_id, // 设备型号 ID
        trouble_code, // 故障码
        trouble_name, // 故障名称
        trouble_type, // 故障类型
        description // 备注
      }
      this.resetFormInfo(data, true)
    },
    editRow(row) { // 表格行编辑
      this.row = row
      this.status = 2
      this.dialogFormVisible = true
      this.equipment_version_obj = {}
      const { equipment_version_id, trouble_code, trouble_name, trouble_type, description } = row
      const data = {
        equipment_version_id, // 设备型号 ID
        trouble_code, // 故障码
        trouble_name, // 故障名称
        trouble_type, // 故障类型
        description // 备注
      }
      this.resetFormInfo(data, false)
    },
    handleSizeChange(current) { // 改变表格size
      this.pagination.page = current
      this.getMyEvcMcuInfo()
    },
    handleIndexChange(size) { // 改变表格页码
      this.pagination.limit = size
      this.getMyEvcMcuInfo()
    },
    handleSelectionChange(selection) { // 改变表格选中
      this.selection = selection
      this.auditarr = [] // 已审核数组
      this.unAuditarr = [] // 未审核数组
      selection.forEach((item) => {
        if (item.status === 2) { // 2 已审核
          this.auditarr.push(item.id)
        } else if (item.status === 0 || item.status === 1) {
          this.unAuditarr.push(item.id)
        }
      })
    },
    determine() { // 点击 新增/更新时的操作
      // 1 新增 2 修改
      if (!this.$refs['delog'].validateSelf()) {
        return false
      }
      const { status, equipment_version_obj } = this
      const { id, version_name, equiptype_id, equiptype_name, manufacturer, protocol } = equipment_version_obj
      const { description, trouble_code, trouble_name, trouble_type } = this.formInfo.data
      if (status === 1) {
        const element = this.pageElement['btn_add']
        const params = {
          description,
          equipmentVersionId: id,
          equipmentVersionName: version_name,
          equiptypeId: equiptype_id,
          equiptypeName: equiptype_name,
          manufacturer,
          protocol,
          troubleCode: trouble_code,
          troubleName: trouble_name,
          troubleType: trouble_type
        }
        this.btnLoading = true
        this.$httpRequest({
          type: element.method,
          uri: element.uri,
          payload: params,
          callback: res => {
            this.btnLoading = false
            this.dialogFormVisible = false
            if (res.status === 200 && res.rel) {
              this.$message.success('新增成功')
              this.getMyEvcMcuInfo()
            } else {
              this.$message.error(res.message)
            }
          }
        })
      } else { // 修改
        const element = this.pageElement['btn_edit']
        const params = {
          description,
          equipmentVersionId: id || this.row.equipment_version_id,
          // equipmentVersionName: version_name,
          equiptypeId: equiptype_id || this.row.equiptype_id,
          equiptypeName: equiptype_name || this.row.equiptype_name,
          // manufacturer,
          // protocol,
          id: this.row.id,
          troubleCode: trouble_code,
          troubleName: trouble_name,
          troubleType: trouble_type
        }
        this.btnLoading = true
        this.$httpRequest({
          type: element.method,
          uri: element.uri,
          payload: params,
          callback: res => {
            this.btnLoading = false
            this.dialogFormVisible = false
            if (res.status === 200 && res.rel) {
              this.$message.success('更新成功')
              this.getMyEvcMcuInfo()
            } else {
              this.$message.error(res.message)
            }
          }
        })
      }
    },
    cascaderEvent(idVals, nameVals, nodeVlas) { // 新增时的级联，抛出三个数组值

    },
    resetFormInfo(data, flag) { // 此处重置一下 dialog数据  flag为boolean表示dialog项DISABLED状态
      this.formInfo.data = data // 这里 重置为初始状态
      this.formInfo.fieldList = this.formInfo.fieldList.map(item => {
        item.disabled = flag
        return item
      })
    }
  }
}

</script>
<style lang='scss' scoped>
.equipmentFaultCode{
  .top-title{
    // color: #fff;
    display: flex;
    // justify-content: center;
    // margin-bottom: 20px;
    .item{
      padding-bottom: 15px;
      // color: #ffffff;
      @include font_color('spFontColor4');
      font-size: 14px;
      // display: flex;
      // align-items: center;
      // justify-content: center;
    }
    span {
      display: inline-block;
    }
    .label {
      width: 67px;
      text-align: right;
    }
    .value {
      margin-left: 20px;
      text-align: left;
    }
  }
}
</style>
