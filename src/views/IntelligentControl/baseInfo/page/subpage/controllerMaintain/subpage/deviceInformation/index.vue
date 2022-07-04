<template>
  <div class="home deviceInformation">
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
      width="550px"
    >
      <general-form
        ref="delog"
        label-width="80px"
        :data="formInfo.data"
        :field-list="formInfo.fieldList"
        :list-type-info="listTypeInfo"
        theme-type="default"
        @cascaderEvent="cascaderEvent"
      />
      <div slot="footer" class="dialog-footer">
        <div style="margin:0 auto;">
          <el-button class="btn-border canleButton" @click="dialogFormVisible = false">取 消</el-button>
          <el-button v-if="status==1" class="btn-blue" :loading="buttonLoading" @click="determine">确 定</el-button>
          <el-button v-if="status==2" class="btn-blue" :loading="buttonLoading" @click="determine">更 新</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import tablePage from '@/components/ElementComponent/iTable'
import navForm from '@/components/commonComponent/navForm/index.vue'
import generalForm from '@/components/commonComponent/generalForm'
import {
  getRegionAreaFieldTree,
  getRootTypeUnitTreeV2
} from '@/http/api/baseInfo/regionAreaField.js'
import { evcJsonh2Tree } from '@/components/tree/evcJsonh2Tree.js'
import { getConfigElement } from '@/utils/overtService'
export default {
  components: {
    tablePage,
    navForm,
    generalForm
  },
  data() {
    return {
      pageElement: [], // 页面权限数组
      dataInterface: [], // 数据接口权限数组
      dialogFormVisible: false,
      isLoading: true,
      buttonLoading: false,
      allTypeList: [],
      title: '查看',
      status: 0, // 0=>查看 1=>xinzeng  2=>修改
      downlist: [],
      selection: '',
      row: {}, // 当前选中行的数据
      search: {
        deviceId: '', // 设备标识
        mac: '', // mac地址
        limit: '', // 一页多少条
        page: '', // 页码
        regionId: '',
        areaId: '',
        fieldId: '',
        roomTypeId: '',
        unitId: '',
        status: '',
        controllerType: 'BUNGALOW_UNIT_CONTROLLER'
      },
      submit: {
        regionId: '',
        areaId: '',
        fieldId: '',
        roomTypeId: '',
        unitId: '',
        deviceId: '',
        deviceVersionId: '',
        deviceVersionName: '',
        equipmentId: '',
        equiptypeId: '',
        equiptypeName: '',
        deviceName: '',
        floor: '',
        segmentId: '',
        segmentName: ''
      },
      auditarr: [], // 已审核数组
      unAuditarr: [], // 未审核数组
      navFormInfo: {
        data: {
          area: [],
          roomtypeUnit: [],
          status: '', // *模板名称
          deviceId: '',
          mac: ''
        },
        fieldList: {
          left: {
            inpLists: [
              {
                type: 'button',
                innerText: '新增',
                className: 'btn-blue',
                handleClick: () => {
                  this.status = 1
                  this.formInfo.data.area = ''
                  this.formInfo.data.code = ''
                  // this.formInfo.fieldList[0]['disabled'] = false
                  // this.formInfo.fieldList[1]['disabled'] = false
                  this.formInfo.fieldList.map(item => {
                    item['disabled'] = false
                  })
                  this.dialogFormVisible = true
                }
              },
              {
                type: 'button',
                innerText: '审核',
                authCode: 'deviceInfoMaintain:btn_review',
                className: 'btn-blue',
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
                authCode: 'deviceInfoMaintain:btn_unreview',
                className: 'btn-blue',
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
                clearable: true,
                checkStrictly: true,
                valueKey: 0,
                customLabel: 'title',
                width: '200px',
                className: 'shadow',
                placeholder: '大区 / 区域 / 场区',
                options: [],
                handleChange: (v1) => {
                  if (v1.length === 3) {
                    getRootTypeUnitTreeV2({ fieldId: v1[2], isBuilding: false }).then(data => {
                      if (data.status === 200) {
                        this.navFormInfo.fieldList.right.inpLists[1].options = data.data
                      } else {
                        this.navFormInfo.fieldList.right.inpLists[1].options = []
                      }
                    })
                    this.navFormInfo.data.roomtypeUnit = []
                  } else {
                    this.navFormInfo.fieldList.right.inpLists[1].options = []
                    this.navFormInfo.data.roomtypeUnit = []
                  }
                }
              },
              {
                key: 'roomtypeUnit',
                type: 'cascader2',
                width: '200px',
                valueKey: 1,
                checkStrictly: true,
                customLabel: 'title',
                className: 'shadow',
                placeholder: '猪舍类型 / 单元',
                clearable: true,
                options: []
              },
              {
                key: 'deviceId',
                type: 'input',
                label: '',
                className: 'shadow',
                placeholder: '设备标识'
              },
              {
                key: 'mac',
                type: 'input',
                label: '',
                className: 'shadow',
                placeholder: 'Mac地址'
              },
              {
                key: 'status',
                type: 'radio',
                required: true,
                width: '220px',
                className: 'shadow',
                placeholder: '333',
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
      columns: [
        {
          prop: 'regionName',
          label: '大区',
          width: '100'
        },
        {
          prop: 'areaName',
          label: '区域',
          width: '100'
        },
        {
          prop: 'fieldName',
          label: '场区',
          width: '120',
          longData: true
        },
        {
          prop: 'segmentName',
          label: '工段',
          width: '100'
        },
        {
          prop: 'roomTypeName',
          label: '猪舍类型',
          width: '120'
        },
        {
          prop: 'unitName',
          label: '单元',
          width: '90'
        },
        {
          prop: 'deviceName',
          label: '设备名称',
          width: '220'
        },
        {
          prop: 'deviceId',
          label: '设备标识',
          width: '220'
        },
        {
          prop: 'deviceVersionName',
          label: '设备型号',
          width: '150'
        },
        {
          prop: 'mac',
          label: 'Mac地址',
          width: '160'
        },
        {
          prop: 'status',
          label: '状态',
          width: '80',
          rule: {
            NORMAL: '未审核',
            AUDITED: '已审核'
          }
        },
        {
          prop: 'crtName',
          label: '创建人',
          width: '80'
        },
        {
          prop: 'crtTime',
          label: '创建时间',
          width: '160'
        },
        {
          prop: 'updName',
          label: '修改人',
          width: '80'
        },
        {
          prop: 'updTime',
          label: '修改时间',
          width: '160'
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
              size: 'auto',
              click: 'see',
              status: 'AUDITED'
            },
            {
              name: '修改',
              class: 'btn-blue',
              size: 'auto',
              click: 'edit',
              status: 'NORMAL'
            },
            {
              name: '删除',
              class: 'btn-red',
              authCode: 'deviceInfoMaintain:btn_del',
              size: 'auto',
              click: 'remove',
              status: 'NORMAL'
            }
          ]
        }
      ],
      // 表单对应列表
      listTypeInfo: {
        typeList: [
        ]
      },
      // 表单相关
      formInfo: {
        data: {
          area: '', // *部署位置
          code: '' // 设备编码

        },
        fieldList: [
          {
            label: '部署位置',
            key: 'area',
            type: 'cascader',
            className: 'shadow',
            customNode: 'title',
            customLabel: 'title',
            customValue: '',
            placeholder: '大区 / 区域 / 场区 / 猪舍类型 / 单元',
            clearable: true,
            required: true,
            rules: [
              { required: true, message: '请选择部署位置', trigger: 'change' }
            ],
            options: []
          },
          {
            label: '设备条码',
            key: 'code',
            type: 'select',
            className: 'shadow',
            valueKey: 'id',
            filterable: true,
            remote: true,
            loading: false,
            remoteMethod: (val) => {
              this.deviceId = val
              this.getListEquipment()
            },
            focusEvent: () => {
              this.deviceId = ''
              this.getListEquipment()
            },
            // filter: (val) => {
            //   this.typeListFilter(val)
            //   this.formInfo.data.code = val
            // },
            props: {
              label: 'device_id',
              value: 'id'
            },
            list: 'typeList',
            required: true,
            rules: [{ required: true, message: '请选择类型', trigger: 'change' }],
            handleChange: (data) => {
              const newData = {}
              Object.keys(data).map(name => {
                const newK = name.replace(/\_(\w)/g, function(all, letter) {
                  return letter.toUpperCase()
                })
                if (name !== 'id') {
                  newData[newK] = data[name]
                }
              })
              this.row = Object.assign(this.row, newData)
            }
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
    // 赋值搜索条件
    'navFormInfo.data': {
      handler: function(n) {
        this.search.regionId = n.area[0] || ''
        this.search.areaId = n.area[1] || ''
        this.search.fieldId = n.area[2] || ''
        this.search.roomTypeId = n.roomtypeUnit[0] || ''
        this.search.unitId = n.roomtypeUnit[1] || ''
        this.search.status = n.status
        this.search.mac = n.mac
        this.search.deviceId = n.deviceId
        if (n.area.length === 0) {
          this.navFormInfo.fieldList.right.inpLists[0].valueKey++ // 只要监听到数据源发生变化 ，改变keyValue的值，达到重新渲染的效果
          this.navFormInfo.fieldList.right.inpLists[1].valueKey++
        }
      },
      deep: true
    },
    'formInfo.data': {
      handler: function(n) {
        this.submit.regionId = n.area[0] || ''
        this.submit.areaId = n.area[1] || ''
        this.submit.fieldId = n.area[2] || ''
        this.submit.roomTypeId = n.area[3] || ''
        this.submit.unitId = n.area[4] || ''
        this.submit.deviceId = n.code
        this.addProperty()
      },
      deep: true
    },
    'status'(n) {
      if (n === 0) {
        this.title = '查看'
      } else if (n === 1) {
        this.title = '新增'
      } else {
        this.title = '修改'
      }
    },
    dialogFormVisible(val) {
      if (!val) {
        this.$refs['delog'].resetFields() // 手动清楚一下提示语
      }
    },
    // 这里侦听审核 反审核 下发配置的dis状态
    auditarr(val) {
      if (val.length > 0) {
        this.navFormInfo.fieldList.left.inpLists[2].isDisabled = false
      } else {
        this.navFormInfo.fieldList.left.inpLists[2].isDisabled = true
      }
    },
    unAuditarr(val) {
      if (val.length > 0) {
        this.navFormInfo.fieldList.left.inpLists[1].isDisabled = false
      } else {
        this.navFormInfo.fieldList.left.inpLists[1].isDisabled = true
      }
    }
    // selection(val) {
    //   if (val.length > 0) {
    //     this.navFormInfo.fieldList.left.inpLists[2].className = 'btn-blue'
    //     this.navFormInfo.fieldList.left.inpLists[2].isDisabled = false
    //     this.navFormInfo.fieldList.left.inpLists[1].className = 'btn-blue'
    //     this.navFormInfo.fieldList.left.inpLists[1].isDisabled = false
    //   } else {
    //     this.navFormInfo.fieldList.left.inpLists[2].className = 'btn-blue-disabled'
    //     this.navFormInfo.fieldList.left.inpLists[2].isDisabled = true
    //     this.navFormInfo.fieldList.left.inpLists[1].className = 'btn-blue-disabled'
    //     this.navFormInfo.fieldList.left.inpLists[1].isDisabled = true
    //   }
    // }
  },
  created() {
    this.pageElement = getConfigElement('deviceInfoMaintain')
    this.dataInterface = getConfigElement('unit-evcDataInterface')
    this.getTree()
    this.getMyEvcMcuInfo()
  },
  mounted() {
    this.getListEquipment()
  },
  methods: {
    cascaderEvent(val, val1, val2, val3, val4, val5) {
      this.submit.regionName = val1[0] || ''
      this.submit.areaName = val1[1] || ''
      this.submit.fieldName = val1[2] || ''
      this.submit.roomTypeName = val1[3] || ''
      this.submit.unitName = val1[4] || ''
      this.submit.segmentId = val5.attributes.segmentId || ''
      this.submit.segmentName = val5.attributes.segmentName || ''
      this.submit.floor = val5.attributes.floor || ''
    },
    // 获取设备条码接口
    getListEquipment() {
      const element = this.pageElement['viewOld']
      this.formInfo.fieldList[1].loading = true
      this.$httpRequest({
        type: element ? element.method : '',
        uri: element ? element.uri : '',
        payload: { deviceId: this.deviceId, limit: 20 },
        callback: data => {
          this.formInfo.fieldList[1].loading = false
          if (data.status === 200) {
            this.listTypeInfo.typeList = data.data.rows
          }
        }
      })
    },
    // 新增修改接口
    async setmyEvcMcuInfoAdd() {
      if (!this.$refs['delog'].validateSelf()) {
        return false
      }
      this.buttonLoading = true
      if (this.status === 1) {
        const element = this.pageElement['btn_add']
        this.$httpRequest({
          type: element.method,
          uri: element.uri,
          payload: this.submit,
          callback: data => {
            this.buttonLoading = false
            if (data.status === 200 && data.rel) {
              this.getMyEvcMcuInfo()
              this.$message({
                message: '新增成功',
                type: 'success'
              })
              this.dialogFormVisible = false
            }
          }
        })
      } else if (this.status === 2) {
        const params = {}
        params.deviceId = this.row.deviceId
        params.regionName = this.submit.regionName || this.row.regionName
        params.areaName = this.submit.areaName || this.row.areaName
        params.fieldName = this.submit.fieldName || this.row.fieldName
        params.roomTypeName = this.submit.roomTypeName || this.row.roomTypeName
        params.unitName = this.submit.unitName || this.row.unitName
        params.segmentId = this.submit.segmentId || this.row.segmentId
        params.segmentName = this.submit.segmentName || this.row.segmentName
        params.floor = this.submit.floor
        params.regionId = this.submit.regionId
        params.areaId = this.submit.areaId
        params.fieldId = this.submit.fieldId
        params.roomTypeId = this.submit.roomTypeId
        params.unitId = this.submit.unitId
        params.deviceVersionId = this.row.deviceVersionId
        params.crtName = this.row.crtName
        params.crtTime = this.row.crtTime
        params.crtUser = this.row.crtUser
        params.deviceVersionName = this.row.deviceVersionName
        params.crtHost = this.row.crtHost
        params.deviceName = this.row.deviceName
        params.equiptypeId = this.row.equiptypeId
        params.equipmentId = this.row.equipmentId
        params.equiptypeName = this.row.equiptypeName
        params.updHost = this.row.updHost
        params.updName = this.row.updName
        params.updUser = this.row.updUser
        params.updTime = this.row.updTime
        params.qrCode = this.row.qrCode
        params.id = this.row.id
        params.mac = this.row.mac
        params.lockParam = this.row.lockParam
        params.deviceType = this.row.deviceType
        params.status = this.row.status
        params.description = this.row.description
        const element = this.pageElement['btn_update']
        this.$httpRequest({
          type: element.method,
          uri: element.uri,
          payload: params,
          callback: data => {
            this.buttonLoading = false
            if (data.status === 200 && data.rel) {
              this.getMyEvcMcuInfo()
              this.$message({
                message: '更新成功',
                type: 'success'
              })
              this.dialogFormVisible = false
            }
          }
        })
      }
    },
    addProperty() {
      this.listTypeInfo.typeList.forEach((item, idx) => {
        if (item.id === this.formInfo.data.code) {
          this.submit.deviceVersionId = item.device_version_id
          this.submit.deviceVersionName = item.version_name
          this.submit.equipmentId = item.id
          this.submit.equiptypeId = item.equiptype_id
          this.submit.equiptypeName = item.equiptype_name
          this.submit.deviceId = item.device_id
          this.submit.deviceName = item.device_name
          this.submit.qrCode = item.qr_code
        }
      })
    },
    handleChange() {
    },
    // 审核数据接口
    setReview(idArr) {
      const ids = idArr.join(',')
      this.$confirm('此操作将审核这些数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        confirmButtonClass: 'btn-blue btn-blue-confirm',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const element = this.pageElement['btn_review']
        this.$httpRequest({
          type: element.method,
          uri: element.uri + '?ids=' + ids,
          callback: data => {
            if (data.status === 200 && data.rel) {
              this.$message({
                message: '审核成功',
                type: 'success'
              })
              this.selection = []
              this.unAuditarr = []
              this.auditarr = []
              this.getMyEvcMcuInfo()
            }
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
        const element = this.pageElement['btn_unreview']
        this.$httpRequest({
          type: element.method,
          uri: element.uri + '?ids=' + ids,
          callback: data => {
            if (data.status === 200 && data.rel) {
              this.$message({
                message: '反审核成功',
                type: 'success'
              })
              this.selection = []
              this.unAuditarr = []
              this.auditarr = []
              this.getMyEvcMcuInfo()
            }
          }
        })
      })
    },
    handleIndexChange(current) {
      this.pagination.pageIndex = current
      this.getMyEvcMcuInfo()
    },
    handleSizeChange(size) {
      this.pagination.pageIndex = 1
      this.pagination.limit = size
      this.getMyEvcMcuInfo()
    },
    // 点查看
    childSeeRow(row, index) {
      this.formInfo.data.regionId = row.regionId
      this.formInfo.data.areaId = row.areaId
      this.formInfo.data.fieldId = row.fieldId
      this.formInfo.data.roomTypeId = row.roomTypeId
      this.formInfo.data.unitId = row.unitId
      this.formInfo.data.area = [row.regionId, row.areaId, row.fieldId, row.roomTypeId, row.unitId]
      this.formInfo.data.code = row.deviceId
      this.formInfo.fieldList.map(item => {
        item['disabled'] = true
      })
      this.status = 0
      this.dialogFormVisible = true
    },
    // 删除
    removeRow(row, index) {
      const element = this.pageElement['btn_del']
      this.$httpRequest({
        type: element.method,
        uri: element.uri + '?ids=' + row.id,
        callback: data => {
          if (data.status === 200 && data.rel) {
            this.getMyEvcMcuInfo()
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          }
        }
      })
    },
    // 修改
    editRow(row, index) {
      const newRow = Object.assign({}, row)
      this.formInfo.data.regionId = newRow.regionId
      this.formInfo.data.areaId = newRow.areaId
      this.formInfo.data.fieldId = newRow.fieldId
      this.formInfo.data.roomTypeId = newRow.roomTypeId
      this.formInfo.data.unitId = newRow.unitId
      this.formInfo.data.area = [newRow.regionId, newRow.areaId, newRow.fieldId, newRow.roomTypeId, newRow.unitId]
      this.formInfo.data.code = newRow.deviceId
      this.formInfo.fieldList.map(item => {
        item['disabled'] = false
      })
      this.status = 2
      this.dialogFormVisible = true
      this.row = newRow
    },
    // 复选框
    handleSelectionChange(selection) {
      this.selection = selection
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
    // 点击了delog中的数据按钮
    determine() {
      this.setmyEvcMcuInfoAdd()
    },
    // 获取区域联动数据
    getTree() {
      getRegionAreaFieldTree({ isBuilding: false }).then(data => {
        if (data.status === 200 && data.rel) {
          this.navFormInfo.fieldList.right.inpLists[0].options = data.data
        } else {
          this.navFormInfo.fieldList.right.inpLists[0].options = []
        }
      })
      const dataInterface = this.dataInterface['getRegionAreaFieldRoomTypeUnitV2']
      this.$httpRequest({
        type: dataInterface.method,
        uri: dataInterface.uri,
        payload: { isBuilding: false },
        callback: data => {
          const arr = evcJsonh2Tree(data.data)
          this.formInfo.fieldList[0].options = arr
        }
      })
    },
    // 获取表单信息
    getMyEvcMcuInfo() {
      const element = this.pageElement['view']
      this.search.page = this.pagination.pageIndex
      this.search.limit = this.pagination.limit
      this.isLoading = true
      this.$httpRequest({
        type: element.method,
        uri: element.uri,
        payload: this.search,
        callback: data => {
          this.isLoading = false
          if (data.status === 200) {
            this.tableData = data.data.rows
            this.total = data.data.total
            this.pagination.total = data.data.total
            this.$refs['tablePage'].$children[0].clearSelection()
          }
        }
      })
    }
  }
}
</script>
<style lang="scss">
// .el-dialog__header{
//   padding: 7px 20px 10px;
// }
// .deviceInformation {
//   .canleButton{
//     padding: 11px 20px;
//   }
//   .nav-form .el-form-item{
//     margin-right: 10px;
//   }
//   .el-dialog__header {
//     padding: 7px 20px 10px;
// }
// .itable-empty-box-wrap{
//     position: relative;
//     right: 300px;
//   }
// }
// .discolor{
//   .el-input.is-disabled .el-input__inner::-webkit-input-placeholder { /* WebKit browsers */
//     color: #adadad;
//   }
//   .el-input.is-disabled .el-input__inner{
//     color: #adadad;
//   }
// }
</style>
