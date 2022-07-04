<!-- 设备固件管理详情页 -->
<template>
  <div class="deviceFirmwareDetail">
    <button class="btn-blue go-back-btn" @click="goBack()"><i class="iconfont">&#xe61d;</i>返回</button><span class="page_title">固件管理</span>
    <button class="btn-blue go-back-btn go-refresh" @click="refresh">刷新</button>
    <div v-loading="isTaskLoading" class="top-container Highlight">
      <div class="item">
        <img src="@/assets/image/wlw/total.svg" alt="" srcset="">
        <div class="item-right">
          <p class="number" style="color:#34A3F8">{{ task.total || 0 }}</p>
          <p class="title">目标设备总数</p>
        </div>
      </div>
      <div class="item">
        <img src="@/assets/image/wlw/success.svg" alt="" srcset="">
        <div class="item-right">
          <p class="number" style="color:#1AF0A1">{{ task.successNum || 0 }}</p>
          <p class="title">目标成功数</p>
        </div>
      </div>
      <div class="item">
        <img src="@/assets/image/wlw/fail.svg" alt="" srcset="">
        <div class="item-right">
          <p class="number" style="color:#E24444">{{ task.failNum || 0 }}</p>
          <p class="title">目标失败数</p>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeName" class="tabs-container Highlight" @tab-click="handleClick">
      <el-tab-pane label="批次管理" name="first">
        <tablePage
          ref="tablePage0"
          :is-loading="isLoading0"
          :columns="columns0"
          :data-source="tableData0"
          :options="options0"
          :pagination="pagination0"
          @handleSizeChange="handleSizeChange0"
          @handleIndexChange="handleIndexChange0"
          @selection-change="handleSelectionChange0"
          @child-slotRow="slotRow0"
          @child-removeRow="slotRowPop0"
        />
      </el-tab-pane>
      <el-tab-pane label="设备列表" name="second">
        <div class="btn-container">
          <el-button v-hasAuth="'my_equipment_firmware_version:reUpgrade'" class="btn-blue reUpgrade" type="primary" :disabled="reUpgradeFlag" @click="reUpgrade">批量重升级</el-button>
        </div>
        <tablePage
          ref="tablePage1"
          :is-loading="isLoading1"
          :columns="columns1"
          :data-source="tableData1"
          :options="options1"
          :pagination="pagination1"
          @handleSizeChange="handleSizeChange1"
          @handleIndexChange="handleIndexChange1"
          @selection-change="handleSelectionChange1"
          @child-removeRow="childDelete"
          @child-slotStatusPop="childSlotStatusPop"
        />
      </el-tab-pane>
      <el-tab-pane label="固件信息" name="third">
        <div class="third-top">
          <span style="font-size: 20px;font-weight: bold;">固件基本信息</span>
          <el-button v-hasAuth="'my_equipment_firmware_version:btn_edit'" class="btn-blue edit" type="primary" @click="edit">编辑</el-button>
        </div>
        <div class="tables" :v-loading="tableLoading">
          <div class="left bkg">
            <div>固件版本号</div>
            <div>设备固件业务类型</div>
            <div>文件</div>
            <div>备注</div>
          </div>
          <div class="right">
            <div class="right-top">
              <div class="top0">
                <div>{{ deviceFirmwareDetail.firmware_version || '---' }}</div>
                <div>{{ deviceFirmwareDetail.type_of_service_name || '---' }}</div>
                <div class="a-download">
                  <el-link type="primary" :href="deviceFirmwareDetail.url" :underline="false">下载</el-link>
                </div>
              </div>
              <div class="top1 bkg">
                <div>设备类型</div>
                <div>文件大小</div>
                <div>添加时间</div>
              </div>
              <div class="top2">
                <div>{{ deviceFirmwareDetail.equiptype_name || '---' }}</div>
                <div>{{ deviceFirmwareDetail.file_size || '---' }}</div>
                <div>{{ deviceFirmwareDetail.crt_time || '---' }}</div>
              </div>
              <div class="top3 bkg">
                <div>设备型号</div>
                <div>文件校验码</div>
                <div>状态</div>
              </div>
              <div class="top4">
                <div>{{ deviceFirmwareDetail.device_version_name || '---' }}</div>
                <div>{{ deviceFirmwareDetail.crc || '---' }}</div>
                <div>{{ statusObj[deviceFirmwareDetail.status] }}</div>
              </div>
            </div>
            <div class="right-bottom">
              {{ deviceFirmwareDetail.description || '---' }}
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 设备固件更新 -->
    <el-dialog
      :title="'设备固件更新'"
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
              :file-list="fileList"
              :disabled="formInfo.fieldList[1].disabled"
              :on-preview="uploadHandlePreview"
            >
              <el-button size="small" type="primary" icon="el-icon-upload2" :disabled="formInfo.fieldList[1].disabled">点击上传</el-button>
            </el-upload>
          </template>
        </general-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <div style="width:100%;margin:0 auto;">
          <el-button class="btn-border" @click="dialogFormVisible = false">取 消</el-button>
          <el-button class="btn-blue" :loading="btnLoading" type="primary" @click="determine">更 新</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="批次管理"
      width="80%"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <div class="body">
        <dia-log ref="child" :row-data="rowData" @initRefresh="refresh" />
      </div>
    </el-dialog>
  </div>
</template>
<script>
const statusObj = {
  0: '初始化',
  1: '未审核',
  2: '已审核',
  3: '禁用'
}
import tablePage from '@/components/ElementComponent/iTable'
import generalForm from '@/components/commonComponent/generalForm'
import { getConfigElement } from '@/utils/overtService'
import diaLog from '../lmDialog.vue'
export default {
  name: 'DeviceFirmwareDetail',
  components: {
    tablePage,
    generalForm,
    diaLog
  },
  data() {
    return {
      btnLoading: false,
      dialogFormVisible: false,
      formInfo: {
        data: {
          firmwareVersion: '', // 固件版本号
          file: {}, // 文件
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
            disabled: true,
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
              if (!type_of_service_id) return false // 没值不请求，否则500
              const element = this.pageElement['getListByServiceType']
              const params = { typeOfServiceId: type_of_service_id }
              this.$httpRequest({
                type: element && element.method,
                uri: element && element.uri,
                payload: params,
                callback: res => {
                  if (res.status === 200 && res.rel) {
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
      },
      device_version_obj: {},
      referenceFirmwareId_obj: {},
      headers: {},
      listTypeInfo: {
        deviceVersionId_list: [],
        referenceFirmwareId_list: []
      },
      fileList: [], // 已上传文件列表
      statusObj,
      deviceFirmwareDetail: {}, // 当前行对象
      tableLoading: false,
      pageElement: [],
      commonElement: [],
      query: this.$route.query,
      isTaskLoading: false,
      task: {},
      activeName: 'first',
      isLoading0: false, // first --表格数据
      tableData0: [],
      columns0: [
        {
          longData: 'true',
          prop: 'id',
          label: '批次ID',
          width: '220'
        },
        {
          prop: 'batchType',
          label: '批次类型',
          rule: {
            'BATCH': '批量升级',
            'VERIFICATION': '验证升级'
          }
        },
        {
          prop: 'strategy',
          label: '升级策略',
          rule: {
            'STATIC': '静态升级',
            'DYNAMIC': '动态升级'
          }
        },
        {
          prop: 'status',
          label: '状态',
          width: '80',
          rule: {
            'WAIT': '待升级',
            'UPGRADING': '升级中',
            'FINISH': '已完成',
            'CANCELLED': '已取消'
          }
        },
        {
          prop: 'crtTime',
          label: '添加时间'
          // width: '120'
        },
        {
          // longData: 'true',
          prop: 'crtName',
          label: '操作人'
          // width: '220'
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
              click: 'slot',
              status: ''
            },
            {
              name: '取消',
              class: 'btn-blue',
              authCode: 'my_equipment_firmware_version:cancelOTATask',
              size: 'auto',
              title: '确定取消该升级任务吗？',
              click: 'remove',
              status: 'UPGRADING'
            },
            {
              name: '取消',
              class: 'btn-blue',
              authCode: 'my_equipment_firmware_version:cancelOTATask',
              size: 'auto',
              title: '确定取消该升级任务吗？',
              click: 'remove',
              status: 'WAIT'
            }
          ]
        }
      ],
      pagination0: {
        total: 0,
        pageIndex: 1,
        limit: 10
      },
      isLoading1: false, // second --表格数据
      tableData1: [],
      reUpgradeFlag: true, // 批量重升级 按钮DIS状态
      selection: [], // second --表格选中数据
      columns1: [
        {
          longData: true,
          prop: 'unit',
          label: '单元',
          width: '120',
          render: (h, scope) => {
            const { fieldName, segmentName, unit } = scope.row
            if (unit) {
              return h('div', {
                class: 'no-warp'
              }, fieldName + segmentName + unit + '单元')
            } else if (segmentName) {
              return h('div', {
                class: 'no-warp'
              }, fieldName + segmentName)
            } else if (fieldName) {
              return h('div', {
                class: 'no-warp'
              }, fieldName)
            } else {
              return h('span', '---')
            }
          }
        },
        {
          longData: 'true',
          prop: 'deviceId',
          label: '设备ID',
          width: '100'
        },
        {
          longData: 'true',
          prop: 'equiptypeName',
          label: '设备类型'
        },
        {
          longData: 'true',
          prop: 'deviceVersionName',
          label: '设备型号'
          // width: '180'
        },
        {
          prop: 'firmwareVersion',
          label: '固件版本'
          // width: '120'
        },
        {
          prop: 'status',
          label: '状态',
          width: '80',
          rule: {
            'WAIT': '待升级',
            'UPGRADING': '升级中',
            'SUCCESS': '升级成功',
            'FAIL': '升级失败'
          }
        },
        {
          longData: 'true',
          prop: 'updTime',
          label: '状态更新时间'
          // width: '120'
        },
        {
          prop: 'statusOnLine',
          label: '是否在线',
          rule: {
            0: '离线',
            1: '在线'
          }
        },
        {
          longData: 'true',
          prop: 'reason',
          label: '升级失败原因'
          // width: '120'
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
              name: '重升级',
              class: 'btn-blue',
              authCode: 'my_equipment_firmware_version:reUpgrade',
              size: 'auto',
              title: '确定重升级该设备吗？',
              click: 'slotStatusPop',
              status: 'FAIL'
            },
            {
              name: '取消',
              class: 'btn-blue',
              authCode: 'my_equipment_firmware_version:cancelOTATask',
              size: 'auto',
              title: '确定取消该升级任务吗？',
              click: 'remove',
              status: 'UPGRADING'
            },
            {
              name: '取消',
              class: 'btn-blue',
              authCode: 'my_equipment_firmware_version:cancelOTATask',
              size: 'auto',
              title: '确定取消该升级任务吗？',
              click: 'remove',
              status: 'WAIT'
            }
          ]
        }
      ],
      pagination1: {
        total: 0,
        pageIndex: 1,
        limit: 10
      },
      options0: {
        stripe: false, // 斑马纹
        firstFixed: true, // 首航固定
        // mutiSelect: true, // 多选框
        // index: true, // 显示序号， 多选则 mutiSelect
        loading: false, // 表格动画
        initTable: true // 是否一挂载就加载数据
      },
      options1: {
        stripe: false, // 斑马纹
        firstFixed: true, // 首航固定
        mutiSelect: true, // 多选框
        // index: true, // 显示序号， 多选则 mutiSelect
        loading: false, // 表格动画
        initTable: true // 是否一挂载就加载数据
      },
      dialogVisible: false,
      rowData: {} // 选择的行数据
    }
  },
  watch: {
    selection(val) {
      if (val.length === 0) {
        this.reUpgradeFlag = true
        return false
      }
      this.reUpgradeFlag = false
      // const arr = val.filter(item => {
      //   return (item.strategy === 'STATIC' && item.status === 'FAIL')
      // })
      // if (arr.length < val.length) {
      //   // this.$message.warning('只能对升级策略为静态升级并且升级失败的设备进行重升级操作!')
      //   this.reUpgradeFlag = false
      // }
    }
  },
  created() {
    this.pageElement = getConfigElement('my_equipment_firmware_version')
    this.commonElement = getConfigElement('wlwDataInterface')
    this.deviceFirmwareDetail = JSON.parse(sessionStorage.getItem('deviceFirmwareDetail'))
    this.init()
  },
  methods: {
    uploadHandlePreview(file) { // 点击已上传文件列表时的钩子
      console.log('文件点击---', file)
      const { url } = file
      location.href = url
    },
    determine() { // 点击 更新时的操作
      if (!this.$refs['delog'].validateSelf()) {
        return false
      }
      const { device_version_obj, referenceFirmwareId_obj } = this
      const { firmwareVersion, file, fileSize, crc, deviceVersionId, referenceFirmwareId, description } = this.formInfo.data
      const params = {
        crc,
        description,
        deviceVersionId,
        deviceVersionName: device_version_obj.version_name,
        equiptypeId: device_version_obj.equiptype_id,
        equiptypeName: device_version_obj.equiptype_name,
        fileName: file.file_name,
        fileSize,
        url: file.url,
        firmwareVersion,
        id: this.deviceFirmwareDetail.id,
        referenceFirmwareId,
        referenceFirmwareVersion: referenceFirmwareId_obj.firmwareVersion,
        typeOfServiceId: referenceFirmwareId_obj.typeOfServiceId,
        typeOfServiceName: referenceFirmwareId_obj.typeOfServiceName
      }
      const element = this.pageElement['btn_edit']
      this.btnLoading = true
      this.$httpRequest({
        type: element && element.method,
        uri: element && element.uri,
        payload: params,
        callback: res => {
          this.btnLoading = false
          this.dialogFormVisible = false
          if (res.status === 200 && res.rel) {
            this.deviceFirmwareDetail = res.data
            // sessionStorage.setItem('deviceFirmwareDetail', JSON.stringify(res.data))
            this.$message.success('编辑成功')
            this.getOneFireInfo(this.deviceFirmwareDetail.id)
          } else if (res.status === 200 && !res.rel) {
            this.$message.error('编辑失败')
          }
        }
      })
    },
    getOneFireInfo(id) { // 查询某一条 固件基本信息
      const element = this.pageElement['view_getPageList']
      const params = {
        id,
        limit: 10,
        page: 1
      }
      this.tableLoading = true
      this.$httpRequest({
        type: element && element.method,
        uri: element && element.uri,
        payload: params,
        callback: res => {
          this.tableLoading = false
          if (res.status === 200) {
            this.deviceFirmwareDetail = res.data.rows[0]
            sessionStorage.setItem('deviceFirmwareDetail', JSON.stringify(res.data.rows[0]))
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    init() {
      const { deviceVersionId, firmwareVersion } = this.query
      if (!deviceVersionId || !firmwareVersion) {
        this.$message.warning('参数丢失')
        return false
      }
      this.getUpgradeStatsForTask()
      this.getMyEvcMcuInfo0()
      this.getMyEvcMcuInfo1()
      this.giveValue()
      this.getEquipmentVersionDiaIds()
      this.getreferenceFirmwareIds()
    },
    getUpgradeStatsForTask() {
      const element = this.pageElement['getUpgradeStatsForTask']
      const params = {
        ...this.query
      }
      this.isTaskLoading = true
      this.$httpRequest({
        type: element && element.method,
        uri: element && element.uri,
        payload: params,
        callback: res => {
          this.isTaskLoading = false
          if (res.status === 200 && res.rel) {
            this.task = res.data
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    getMyEvcMcuInfo0() { // 批次管理 table数据
      const element = this.pageElement['getOTATasks']
      const params = {
        ...this.query,
        limit: this.pagination0.limit,
        page: this.pagination0.pageIndex
      }
      this.isLoading0 = true
      this.$httpRequest({
        type: element && element.method,
        uri: element && element.uri,
        payload: params,
        callback: res => {
          this.isLoading0 = false
          if (res.status === 200) {
            this.pagination0.total = res.data.total
            this.tableData0 = res.data.rows
            this.$refs['tablePage0'].$children[0].clearSelection()
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    getMyEvcMcuInfo1() { // 设备列表 table数据
      const element = this.pageElement['getDevicesUpgradingStatus']
      const params = {
        ...this.query,
        limit: this.pagination1.limit,
        page: this.pagination1.pageIndex
      }
      this.isLoading1 = true
      this.$httpRequest({
        type: element && element.method,
        uri: element && element.uri,
        payload: params,
        callback: res => {
          this.isLoading1 = false
          if (res.status === 200) {
            this.pagination1.total = res.data.total
            this.tableData1 = res.data.rows
            this.$refs['tablePage1'].$children[0].clearSelection()
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    giveValue() { // 给设备固件更新 dialog 赋值
      const { firmware_version, file_name, file_size, crc, device_version_id, reference_firmware_id, description, url } = this.deviceFirmwareDetail
      this.formInfo.data = {
        firmwareVersion: firmware_version, // 固件版本号
        file: { // 文件
          file_name,
          file_size,
          url
        },
        fileSize: file_size, // 文件大小
        crc, // 文件校验码
        deviceVersionId: device_version_id, // 设备型号 ID
        referenceFirmwareId: reference_firmware_id, // 指令集参照版本
        description
      }
      this.fileList = [{
        name: file_name,
        url
      }]
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
    getreferenceFirmwareIds() { // dialog里的指令集参照版本
      const { type_of_service_id } = this.deviceFirmwareDetail
      if (!type_of_service_id) return false // 没值不请求，否则500
      const element = this.pageElement['getListByServiceType']
      const params = { typeOfServiceId: type_of_service_id }
      this.$httpRequest({
        type: element && element.method,
        uri: element && element.uri,
        payload: params,
        callback: res => {
          if (res.status === 200 && res.rel) {
            this.listTypeInfo.referenceFirmwareId_list = res.data
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    // first-table  event
    handleIndexChange0(current) {
      this.pagination0.page = current
      this.getMyEvcMcuInfo0()
    },
    handleSizeChange0(size) {
      this.pagination0.limit = size
      this.getMyEvcMcuInfo0()
    },
    handleSelectionChange0(selection) {

    },
    slotRow0(row) {
      console.log('row---', row)
      this.dialogVisible = true
      this.$nextTick(() => {
        this.rowData = row
      })
    },
    slotRowPop0(row) { // 取消批次---
      const { id } = row
      const params = {
        ids: id
      }
      const element = this.pageElement['cancelOTATask']
      this.$httpRequest({
        type: element && element.method,
        uri: element && element.uri + `?ids=${params.ids}`,
        payload: {},
        callback: res => {
          if (res.status === 200 && res.rel) {
            this.$message.success(res.message || '取消成功')
            this.init()
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    // second-table  event
    handleIndexChange1(current) {
      this.pagination1.page = current
      this.getMyEvcMcuInfo1()
    },
    handleSizeChange1(size) {
      this.pagination1.limit = size
      this.getMyEvcMcuInfo1()
    },
    handleSelectionChange1(selection) {
      this.selection = selection
    },
    childSlotStatusPop(row) { // 重升级
      console.log('row-----', row)
      // this.$confirm('此操作将重升级该设备, 是否继续?', '提示', {
      //   confirmButtonText: '确定',
      //   confirmButtonClass: 'btn-blue btn-blue-confirm',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      const { deviceId, mainId } = row
      const params = [{
        deviceId,
        taskId: mainId
      }]
      this.setReUpgrade(params)
      // }).catch(() => {})
    },
    setReUpgrade(arr) {
      const element = this.pageElement['reUpgrade']
      this.$httpRequest({
        type: element && element.method,
        uri: element && element.uri,
        payload: arr,
        callback: res => {
          if (res.status === 200 && res.rel) {
            this.$message.success('重升级任务下发成功！')
            this.init()
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    childDelete(row) { // 取消 固件升级
      console.log('row----', row)
      const { id } = row
      const params = {
        ids: id
      }
      const element = this.pageElement['cancelSingleDeviceOTA']
      this.$httpRequest({
        type: element && element.method,
        uri: element && element.uri + `?ids=${params.ids}`,
        payload: params,
        callback: res => {
          if (res.status === 200 && res.rel) {
            this.$message.success(res.message || '取消成功')
            this.init()
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    reUpgrade() { // 批量重升级 只能对升级策略为静态升级并且升级失败的设备进行重升级操作!
      if (this.selection.length === 0) {
        this.$message.warning('请至少选择一条数据')
        return false
      }
      const arr = this.selection.filter(item => {
        return (item.strategy === 'STATIC' && item.status === 'FAIL')
      })
      if (arr.length < this.selection.length) {
        this.$message.warning('只能对升级策略为静态升级并且升级失败的设备进行重升级操作!')
        return false
      }
      const params = arr.map(item => {
        return {
          deviceId: item.deviceId,
          taskId: item.mainId
        }
      })
      this.$confirm('此操作将重升级选中设备, 是否继续?', '提示', {
        confirmButtonText: '确定',
        confirmButtonClass: 'btn-blue btn-blue-confirm',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.setReUpgrade(params)
      }).catch(() => {})
    },
    handleClick() {

    },
    cascaderEvent(val0, val1, val2) {
    },
    edit() { // 设备固件更新
      this.dialogFormVisible = true
    },
    goBack() {
      window.history.go(-1)
    },
    refresh() { // 刷新
      this.pagination0.pageIndex = 1
      this.pagination0.limit = 10
      this.pagination1.pageIndex = 1
      this.pagination1.limit = 10
      this.init()
    }
  }
}
</script>
<style lang="scss">
.deviceFirmwareDetail{
  color: #fff;
  .go-back-btn,.go-refresh{margin-bottom: 16px;}
  .page_title{
    @include font_color('spFontColor4');
  }
  .go-refresh{float: right;}
    .top-container{
        display: flex;
        justify-content: space-around;
        padding: 30px 0;
        .item{
            display: flex;align-items: center;justify-content: center;flex:1;
            img{margin-right: 16px;}
            &:nth-of-type(2) {border-left: 1px solid #e3e3e3;border-right: 1px solid #e3e3e3;}
            &-right{
                .number{font-size: 30px;}
                .title{
                  @include font_color('spFontColor4');
                }
            }
        }
    }
    .el-tabs__nav-wrap::after {
        background-color: #3A4F9E;
        @include background_color('wlwBorderColor1');
    }
    .tabs-container{
        margin-top: 20px;
        .btn-container {
          // text-align: right;
          .reUpgrade{margin-bottom: 14px;}
        }
        .third-top{display: flex;justify-content: space-between;align-items: center;padding: 10px 0 16px;
          @include font_color('spFontColor7');
        }
        .tables{
          border: 1px solid #43619F ;
          @include border_color('wlwBorderColor');
          border-left: none;
          border-bottom: none;
          display:flex;height: 248px;
          // color: #cdd8f7;
          @include font_color('spFontColor2');
          .left{width:200px;display: flex;justify-content: space-around;flex-direction: column;padding-left: 20px;}
          .right{flex:1;display: flex;flex-direction: column;
              &-top{flex:1;display: flex;
                div{display: flex;flex-direction: column;justify-content: space-around;}
                .top{
                  &1,&3{width:200px;
                    div{flex: 1;padding-left: 20px;}
                  }
                  &0,&2,&4{flex: 1;
                    .a-download{padding-left: 0;}
                    div{flex: 1;padding-left: 20px; border-bottom: 1px solid #43619F;@include border_color('wlwBorderColor');}
                  }
                }
              }
              &-bottom{padding-left: 20px;height: 60px;line-height: 60px;
                        border-bottom: 1px solid #43619F;
                        @include border_color('wlwBorderColor');
              }
              }
              .bkg{
                // background-color: #092B5B;
                @include background_color('wlwBackGroundColor');
                @include font_color('wlwFontColor');
                border-left: 1px solid #43619F ;
                border-right: 1px solid #43619F ;
                @include border_color('wlwBorderColor');
              }
        }
    }
}
</style>
