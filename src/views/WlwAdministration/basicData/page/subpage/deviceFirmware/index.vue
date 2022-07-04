<!-- 设备固件管理 -->
<template>
  <div class="deviceFirmware">
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
      @child-slotRow="slotRow"
    />
    <!-- 新增 dialog -->
    <el-dialog
      :title="title"
      :modal-append-to-body="false"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      width="700px"
    >
      <div class="body">
        <general-form
          ref="delog"
          label-width="120px"
          :data="formInfo.data"
          :field-list="formInfo.fieldList"
          :list-type-info="listTypeInfo"
          theme-type="default"
          @cascaderEvent="cascaderEvent"
        >
          <template v-slot:form-file>
            <el-upload
              name="upload_file"
              :headers="headers"
              class="upload-file"
              action="/file/upload/v4"
              :limit="1"
              :file-list="fileList"
              :on-success="uploadHandleSuccess"
              :on-remove="removeFile"
              :on-preview="uploadHandlePreview"
            >
              <el-button v-show="fileList.length === 0" slot="trigger" size="small" type="primary" icon="el-icon-upload2">点击上传</el-button>
              <el-button v-show="fileList.length === 1" slot="tip" size="small" type="primary" icon="el-icon-upload2" disabled>点击上传</el-button>
            </el-upload>
          </template>
        </general-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <div style="margin:0 auto;">
          <el-button class="btn-border" @click="dialogFormVisible = false">取 消</el-button>
          <el-button v-if="status==1" class="btn-blue" :loading="btnLoading" type="primary" @click="determine">确 定</el-button>
          <el-button v-if="status==2" class="btn-blue" :loading="btnLoading" type="primary" @click="determine">更 新</el-button>
        </div>
      </div>
    </el-dialog>
    <up-dialog :dialog-form-visible1="dialogFormVisible1" :row="row" @closeUpDialog="closeUpDialog" />
    <el-image-viewer
      v-if="showViewer"
      :on-close="closeViewer"
      :url-list="[url]"
    />
  </div>
</template>

<script>
import navForm from '@/components/commonComponent/navForm/index.vue'
import tablePage from '@/components/ElementComponent/iTable'
import generalForm from '@/components/commonComponent/generalForm'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import upDialog from './upDialog'
import { getConfigElement, closeMask } from '@/utils/overtService'
import { isImage } from '@/lib/utils'
export default {
  components: {
    navForm,
    tablePage,
    generalForm,
    upDialog,
    ElImageViewer
  },
  // provide() {
  //   return {
  //     rows: this.row
  //   }
  // },
  data() {
    return {
      btnLoading: false,
      showViewer: false, // 显示查看器
      url: '',
      dialogFormVisible1: false, // 升级 dialog框 显隐
      headers: {}, // 上传文件header
      fileList: [], // 上传的文件列表
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
      columns: [// 列项
        {
          prop: 'firmware_version',
          label: '固件版本号',
          longData: true,
          width: '100',
          align: 'center'
        },
        {
          longData: 'true',
          prop: 'equiptype_name',
          label: '设备类型',
          width: '180'
        },
        {
          longData: 'true',
          prop: 'device_version_name',
          label: '设备型号',
          width: '180'
        },
        {
          longData: 'true',
          prop: 'type_of_service_name',
          label: '设备固件业务类型'
        },
        {
          prop: 'url',
          label: '文件',
          width: '60',
          aLink: true,
          aLinkName: '下载',
          blank: false, // 是否跳转新页面
          underline: false // 是否下划线
        },
        {
          prop: 'status',
          label: '状态',
          width: '80',
          rule: {
            0: '初始化',
            1: '未审核',
            2: '已审核',
            3: '禁用'
          }
        },
        {
          longData: true,
          prop: 'description',
          label: '备注',
          width: '160'
        },
        {
          button: true,
          label: '操作',
          fixed: 'right',
          align: 'center',
          show: 'status',
          width: '260', // 操作按钮宽度
          group: [
            {
              name: '升级',
              class: 'btn-blue',
              authCode: 'my_equipment_firmware_version:addOTATask',
              size: 'auto',
              click: 'LSlot',
              status: [1, 3] // 未审核 禁用
            },
            {
              name: '查看',
              class: 'btn-blue',
              authCode: '',
              size: 'auto',
              click: 'see',
              status: '0'
            },
            {
              name: '查看',
              class: 'btn-blue',
              authCode: '',
              size: 'auto',
              click: 'see',
              status: '1'
            },
            {
              name: '查看',
              class: 'btn-blue',
              authCode: '',
              size: 'auto',
              click: 'see',
              status: '2'
            },
            // {
            //   name: '查看',
            //   class: 'btn-blue',
            //   authCode: '',
            //   size: 'auto',
            //   click: 'see',
            //   status: '3'
            // },
            {
              name: '删除',
              class: 'btn-red',
              authCode: 'my_equipment_firmware_version:btn_delete',
              size: 'auto',
              click: 'remove',
              status: '1'
            }
            // {
            //   name: '删除',
            //   class: 'btn-red',
            //   authCode: 'my_equipment_firmware_version:btn_delete',
            //   size: 'auto',
            //   click: 'remove',
            //   status: '3'
            // }
          ]
        }
      ],
      navFormInfo: {
        data: {
          firmware_version: '', // 固件版本号
          device_version_id: '', // 设备型号 ID
          equiptype_id: '', // 设备类型 ID
          status: ''
        },
        fieldList: {
          left: {
            inpLists: [
              {
                type: 'button',
                innerText: '新增',
                authCode: 'my_equipment_firmware_version:btn_add',
                className: 'btn-blue',
                handleClick: () => {
                  this.status = 1
                  this.listTypeInfo.referenceFirmwareId_list = []
                  this.dialogFormVisible = true
                }
              },
              {
                type: 'button',
                innerText: '审核',
                authCode: 'my_equipment_firmware_version:btn_review',
                isDisabled: true,
                className: 'btn-blue',
                handleClick: () => {
                  if (this.auditarr.length !== 0) {
                    this.$message.warning('只能选择未审核数据进行审核')
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
                authCode: 'my_equipment_firmware_version:btn_unreview',
                isDisabled: true,
                className: 'btn-blue',
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
                authCode: 'my_equipment_firmware_version:btn_disabled',
                isDisabled: true,
                className: 'btn-blue',
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
                type: 'select',
                required: true,
                className: 'shadow',
                placeholder: '请选择状态',
                props: {
                  label: 'name',
                  value: 'val'
                },
                list: [{ name: '禁用', val: '3' }, { name: '已审核', val: '2' }, { name: '未审核', val: '1' }]
              },
              {
                key: 'firmware_version',
                type: 'input',
                placeholder: '请输入固件版本号',
                className: 'shadow',
                clearable: true,
                options: []
              },
              {
                key: 'equiptype_id',
                type: 'select',
                placeholder: '请选择设备类型',
                className: 'shadow',
                filterable: true, // 可搜索
                props: {
                  label: 'equiptype_name',
                  value: 'id'
                },
                clearable: true,
                list: []
              },
              {
                key: 'device_version_id',
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
                  this.pagination.pageIndex = 1
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
        deviceVersionId_list: [],
        referenceFirmwareId_list: []
      },
      device_version_obj: {},
      referenceFirmwareId_obj: {},
      formInfo: {
        data: {
          firmwareVersion: '', // 固件版本号
          file: [], // 文件
          fileSize: '', // 文件大小
          crc: '', // 文件校验码
          deviceVersionId: '', // 设备型号 ID
          referenceFirmwareId: '', // 指令集参照版本
          description: ''
        },
        fieldList: [
          {
            key: 'firmwareVersion',
            type: 'input',
            label: '固件版本号',
            className: 'shadow',
            required: true,
            disabled: false,
            rules: [{ required: true, message: '请输入文件版本号', trigger: 'blur' }]
          },
          {
            key: 'file',
            type: 'slot',
            label: '文件',
            className: 'shadow',
            required: true,
            disabled: false,
            rules: [{ required: true, message: '请选择文件', trigger: 'blur' }]
          },
          {
            key: 'fileSize',
            type: 'input',
            label: '文件大小',
            className: 'shadow',
            required: true,
            disabled: true,
            rules: [{ required: true, message: '请输入文件大小', trigger: 'blur' }]
          },
          {
            key: 'crc',
            type: 'input',
            label: '文件校验码',
            className: 'shadow',
            required: true,
            disabled: true,
            rules: [{ required: true, message: '请输入文件校验码', trigger: 'blur' }]
          },
          {
            key: 'deviceVersionId',
            label: '设备型号',
            type: 'select',
            filterable: true, // 可搜索
            list: 'deviceVersionId_list',
            className: 'shadow',
            required: true,
            rules: [{ required: true, message: '请选择设备型号', trigger: 'change' }],
            valueKey: 'id',
            props: {
              label: 'version_name',
              value: 'id'
            },
            handleChange: (data) => {
              console.log('设备OBJ--', data)
              this.device_version_obj = data
              const { type_of_service_id } = data
              const element = this.pageElement['getListByServiceType']
              // typeOfServiceId: value && value.type_of_service_id,
              // typeOfServiceName: value && value.type_of_service_name,
              // referenceFirmwareVersion: referenceFirmwareId_obj.firmwareVersion,
              // typeOfServiceId: referenceFirmwareId_obj.typeOfServiceId,
              // typeOfServiceName: referenceFirmwareId_obj.typeOfServiceName
              this.referenceFirmwareId_obj = { // 这里参考 dev----------------------------------------
                typeOfServiceId: data.type_of_service_id,
                typeOfServiceName: data.type_of_service_name
              }
              if (!type_of_service_id) {
                this.formInfo.data.referenceFirmwareId = ''
                this.referenceFirmwareId_obj.firmwareVersion = '' // 清一下---
                this.listTypeInfo.referenceFirmwareId_list = []
                return // 不存在 不调
              }
              const params = { typeOfServiceId: type_of_service_id }
              this.$httpRequest({
                type: element && element.method,
                uri: element && element.uri,
                payload: params,
                callback: res => {
                  if (res.status === 200 && res.rel) {
                    this.formInfo.data.referenceFirmwareId = ''
                    this.referenceFirmwareId_obj.firmwareVersion = '' // 清一下---
                    this.listTypeInfo.referenceFirmwareId_list = res.data
                  } else {
                    this.$message.error(res.message)
                  }
                }
              })
            }
          },
          {
            key: 'referenceFirmwareId',
            label: '指令集参照版本',
            type: 'select',
            filterable: true, // 可搜索
            list: 'referenceFirmwareId_list',
            className: 'shadow',
            handleChange: (data) => {
              console.log('指令集参照版本OBJ--', data)
              this.referenceFirmwareId_obj = data
            },
            valueKey: 'id',
            props: {
              label: 'firmwareVersion',
              value: 'id'
            }
          },
          {
            key: 'description',
            type: 'input',
            label: '备注',
            className: 'shadow',
            disabled: false
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
        this.fileList = []
      }
    },
    auditarr(val) { // 已审核数组
      this.navFormInfo.fieldList.left.inpLists[2].isDisabled = !(val.length) // 改变反审核按钮DIS状态
      this.navFormInfo.fieldList.left.inpLists[3].isDisabled = !(val.length) // 禁用按钮DIS
    },
    unAuditarr(val) { // 未审核数组
      this.navFormInfo.fieldList.left.inpLists[1].isDisabled = !(val.length) // 改变审核按钮DIS状态
    },
    'formInfo.data.file': { // 上传文件列表
      handler(val) {
        if (val.name) {
          this.formInfo.fieldList[1].disabled = true
        } else {
          this.formInfo.fieldList[1].disabled = false
        }
      },
      deep: true
    }
  },
  created() {
    this.headers = {
      appCode: 'wlw',
      Authorization: localStorage.getItem('MY-Admin-Token'),
      'X-Requested-With': 'XMLHttpRequest'
    }
    this.pageElement = getConfigElement('my_equipment_firmware_version')
    this.commonElement = getConfigElement('wlwDataInterface')
    this.init()
  },
  methods: {
    init() {
      this.getEquipmentTypeIds()
      this.getEquipmentVersionIds()
      this.getEquipmentVersionDiaIds()
      this.getMyEvcMcuInfo()
    },
    getEquipmentTypeIds() { // 设备类型
      const element = this.commonElement['myEquipmentTypeGetPageListByDto']
      const params = {
        limit: 10000,
        page: 1
      }
      this.$httpRequest({
        type: element && element.method,
        uri: element && element.uri,
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
    getEquipmentVersionIds() { // 设备型号
      const element = this.commonElement['getEquipmentVersionListForSelect']
      const params = {
        limit: 10000,
        page: 1
      }
      this.$httpRequest({
        type: element && element.method,
        uri: element && element.uri,
        payload: params,
        callback: res => {
          if (res.status === 200) {
            this.navFormInfo.fieldList.right.inpLists[3].list = res.data
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    getEquipmentVersionDiaIds() { // dialog里的设备型号
      const element = this.commonElement['getEquipmentVersionListForSelect']
      const params = {
        limit: 10000,
        page: 1,
        status: 2
      }
      this.$httpRequest({
        type: element && element.method,
        uri: element && element.uri,
        payload: params,
        callback: res => {
          if (res.status === 200) {
            this.listTypeInfo.deviceVersionId_list = res.data
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
      const { firmware_version, device_version_id, equiptype_id, status } = this.navFormInfo.data
      if (firmware_version) params.firmware_version = firmware_version
      if (device_version_id) params.device_version_id = device_version_id
      if (equiptype_id) params.equiptype_id = equiptype_id
      if (status) params.status = status
      this.isLoading = true
      this.$httpRequest({
        type: element && element.method,
        uri: element && element.uri,
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
    uploadHandlePreview(file) { // 点击已上传文件列表时的钩子
      console.log('文件点击---', file)
      // 新增---图片预览，，其他本页面下载
      const { name, response } = file
      let cUrl = ''
      if (isImage(name)) { // 是图片
        cUrl = response?.data.rows[0]?.url // 新增时 从response里取
        this.url = cUrl
        this.showViewer = true
      } else { // 非图片
        cUrl = response?.data.rows[0]?.url
        location.href = cUrl
      }
    },
    removeFile() { // 移除文件
      this.formInfo.data.file = []
      this.formInfo.data.fileSize = ''
      this.formInfo.data.crc = ''
      this.fileList = []
      // this.formInfo.fieldList[1].disabled = false
    },
    uploadHandleSuccess(res, file) { // 上传文件
      console.log(res)
      console.log(file)
      if (res.status === 200) {
        this.formInfo.data.file = file // 这里会覆盖--即永远保持一个
        this.formInfo.data.fileSize = file.size
        const url = res.data.rows[0].url
        this.fileList = [file] // 添加 这里也永远保持一个
        this.getCrc(url)
        // this.formInfo.fieldList[1].disabled = true
      } else {
        this.$message.error(res.message || '上传失败')
        // this.fileList = []
      }
    },
    getCrc(url) {
      const element = this.pageElement['crcCheck']
      const params = {
        url
      }
      this.$httpRequest({
        type: element && element.method,
        uri: element && element.uri,
        payload: params,
        callback: res => {
          if (res.status === 200 && res.rel) {
            this.formInfo.data.crc = res.data.crcCheck
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
        type: element && element.method,
        uri: element && element.uri + `?ids=${params.ids}`,
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
        type: element && element.method,
        uri: element && element.uri + `?ids=${params.ids}`,
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
    setDisabled(idArr) { // 禁用
      const element = this.pageElement['btn_disabled']
      const params = {
        ids: idArr.join(',')
      }
      this.$httpRequest({
        type: element && element.method,
        uri: element && element.uri + `?ids=${params.ids}`,
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
        id: row.id
      }
      this.$httpRequest({
        type: element && element.method,
        uri: element && element.uri,
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
      console.log('查看---')
      const { device_version_id, firmware_version } = row
      sessionStorage.setItem('deviceFirmwareDetail', JSON.stringify(row))
      this.$router.push({
        name: 'deviceFirmwareDetail',
        query: {
          deviceVersionId: device_version_id,
          firmwareVersion: firmware_version
        }
      })
    },
    editRow(row) { // 表格行编辑
      this.row = row
    },
    slotRow(row) { // 表格行升级
      this.row = row
      this.dialogFormVisible1 = true
    },
    handleSizeChange(size) { // 改变表格size
      this.pagination.limit = size
      this.getMyEvcMcuInfo()
    },
    handleIndexChange(current) { // 改变表格页码
      this.pagination.pageIndex = current
      this.getMyEvcMcuInfo()
    },
    handleSelectionChange(selection) { // 改变表格选中
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
    determine() { // 点击 新增/更新时的操作
      if (!this.$refs['delog'].validateSelf()) {
        return false
      }
      // firmwareVersion: '', // 固件版本号
      //     file: {}, // 文件
      //     fileSize: '', // 文件大小
      //     crc: '', // 文件校验码
      //     deviceVersionId: '', // 设备型号 ID
      //     referenceFirmwareId: '' // 指令集参照版本
      const { status, device_version_obj, referenceFirmwareId_obj } = this
      const { firmwareVersion, file, fileSize, crc, deviceVersionId, referenceFirmwareId, description } = this.formInfo.data
      if (status === 1) {
        const params = {
          crc,
          description,
          deviceVersionId,
          deviceVersionName: device_version_obj.version_name,
          equiptypeId: device_version_obj.equiptype_id,
          equiptypeName: device_version_obj.equiptype_name,
          fileName: file.name,
          fileSize,
          url: file.response.data.rows[0].url,
          firmwareVersion,
          referenceFirmwareId,
          referenceFirmwareVersion: referenceFirmwareId_obj.firmwareVersion,
          typeOfServiceId: referenceFirmwareId_obj.typeOfServiceId,
          typeOfServiceName: referenceFirmwareId_obj.typeOfServiceName
        }
        const element = this.pageElement['btn_add']
        this.btnLoading = true
        this.$httpRequest({
          type: element && element.method,
          uri: element && element.uri,
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
    },
    async beforeUpload(file) {
      console.log('fiel---')
      // if (this.fileList.length) {
      //   this.$message.warning('此处文件仅支持一个，该操作会覆盖已有上传！')
      // }
      const res = await this.$confirm('此操作将覆盖已有上传, 是否继续?', '提示', {
        confirmButtonText: '确定',
        confirmButtonClass: 'btn-blue btn-blue-confirm',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .catch(action => {
          console.log('action---', action)
          if (action === 'cancel') {
            return 'cancel'
          }
        })
      console.log('res---', res)
      if (res === 'confirm') { // 继续
        closeMask()
        return true
      }
      if (res === 'cancel') { // 取消
        closeMask()
        return false
      }
    },
    closeUpDialog() {
      console.log('closeUpDialog---')
      this.dialogFormVisible1 = false
    },
    // 关闭查看器
    closeViewer() {
      this.showViewer = false
    }
  }
}

</script>
<style lang='scss'>
.deviceFirmware{
    .el-image-viewer__wrapper{
    z-index: 12020!important;
    .el-image-viewer__close{
      color:#fff;
      top: 80px!important;
      opacity: 1!important;
    }
  }
}
</style>
