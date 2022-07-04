<template>
  <div class="fieldOnlineStatus">
    <!-- 头部导航 -->
    <nav-form
      ref="navForm"
      :data="navFormInfo.data"
      :field-list="navFormInfo.fieldList"
      @cascaderEvent="navCascaderEvent"
      @dateTimeChange="navDateTimeChange"
    />
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
    />
    <!-- 新增 -->
    <el-dialog
      class="conditionDialog"
      :modal-append-to-body="false"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      width="550px"
      @close="closeDialog"
    >
      <div slot="title">
        <!-- <span class="dialogTitle">{{ dialogType === '1' ? '批量升级' : '单个升级' }}</span> -->
        <span class="dialogTitle">固件升级</span>
        <!-- <el-button v-if="contentType === '1'" size="small" class="btn-blue" @click="changeDialogTyle">{{ dialogType === '1' ? '切换单个升级' : '切换批量升级' }}</el-button> -->
      </div>
      <el-tabs v-model="activeName" class="tabs-container" @tab-click="tabHandleClick">
        <el-tab-pane label="批量升级" name="first">
          <general-form
            ref="delog1"
            label-width="100px"
            :data="formInfo1.data"
            :field-list="formInfo1.fieldList"
            :list-type-info="listTypeInfo"
            theme-type="default"
            @cascaderEvent="cascaderEvent"
          />
        </el-tab-pane>
        <el-tab-pane label="单个升级" name="second">
          <general-form
            v-show="dialogType === '2'"
            ref="delog2"
            label-width="100px"
            :data="formInfo2.data"
            :field-list="formInfo2.fieldList"
            :list-type-info="listTypeInfo"
            theme-type="default"
          />
        </el-tab-pane>
      </el-tabs>
      <div v-if="contentType === '2'" div class="dialogDetail">
        <el-form ref="form" :model="formInfo1.data" label-width="100px">
          <el-form-item v-show="dialogType === '1'" label="所在场区：">
            {{ formInfo1.data.regionName + '-' + formInfo1.data.areaName + '-' + formInfo1.data.fieldName }}
          </el-form-item>
          <el-form-item v-show="dialogType === '1'" label="设备类型：">
            {{ formInfo1.data.equiptypeName }}
          </el-form-item>
          <el-form-item v-show="dialogType === '1'" label="设备型号：">
            {{ formInfo1.data.deviceVersionName }}
          </el-form-item>
          <el-form-item label="设备名称：">
            {{ dialogType === '1' ? formInfo1.data.deviceName : formInfo2.data.deviceName }}
          </el-form-item>
          <el-form-item label="固件版本号：">
            {{ dialogType === '1' ? formInfo1.data.firmwareVersionName : formInfo2.data.firmwareVersionName }}
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="contentType === '1'" class="btn-border canleButton" @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="contentType === '2'" class="btn-border canleButton" @click="contentType = contentType === '1' ? '2' : '1'">上一步</el-button>
        <el-button v-if="contentType === '1'" class="btn-blue" @click="joinDetail">升级固件</el-button>
        <el-button v-if="contentType === '2'" class="btn-blue" :loading="buttonLoading" @click="firmware">核对无误，确认升级</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import navForm from '@/components/commonComponent/navForm/index.vue'
import tablePage from '@/components/ElementComponent/iTable'
import generalForm from '@/components/commonComponent/generalForm'
import { getConfigElement } from '@/utils/overtService'
// import { wlwJsonh2Tree } from '@/components/tree/evcJsonh2Tree.js'
import { derive } from '@/http/api/exportData/export'
export default {
  components: {
    navForm,
    tablePage,
    generalForm
  },
  data() {
    return {
      activeName: 'first',
      pageElement: [], // 页面权限数组
      dataInterface: [], // 数据接口权限数组
      isLoading: false,
      dialogFormVisible: false,
      dialogType: '1',
      buttonLoading: false,
      contentType: '1',
      navFormInfo: {
        data: {
          area: [],
          segmentIdUnit: [], // 工段 单元
          regionId: '',
          areaId: '',
          fieldId: '',
          block: '',
          segmentId: '',
          unit: '',
          equiptypeId: '', // 设备类型
          deviceVersionId: '', // 设备型号
          protocol: '', // 协议
          keyWord: '', // 关键字
          timeDate: [],
          startTime: '', // 开始日期
          endTime: '', // 结束日期
          statusOnline: '', // 是否在线
          firmware_version: '', // 固件版本
          mac: '' // Mac地址
        },
        fieldList: {
          left: {
            inpLists: [
              {
                type: 'button',
                innerText: '固件OTA',
                className: 'btn-blue',
                handleClick: () => {
                  // this.dialogType = '1'
                  // this.contentType = '1'
                  this.formInfo1.data = {
                    area: [], // 大区 / 区域 / 场区
                    equiptypeId: '', // 设备类型
                    deviceVersionId: '', // 设备型号
                    deviceName: '', // 设备名称
                    firmwareVersionId: '' // 固件版本号
                  }
                  this.getOTATree()
                  this.getEquipmentFirmwareVersionList()
                  this.dialogFormVisible = true
                }
              },
              {
                type: 'button',
                innerText: '禁用',
                isDisabled: true,
                className: 'btn-blue-disabled',
                handleClick: () => {
                  if (this.unAuditarr.length > 0 || this.disabledarr.length > 0) {
                    this.$message.error('存在未审核或已禁用的数据，不可禁用')
                    return
                  }
                  if (this.auditarr.length === 0) {
                    this.$message({
                      message: '最少需要选择一条已审核数据',
                      type: 'warning'
                    })
                    return
                  }
                  this.equipmentForbidden()
                }
              },
              {
                type: 'button',
                innerText: '审核',
                className: 'btn-blue-disabled',
                isDisabled: true,
                handleClick: () => {
                  if (this.auditarr.length !== 0 || this.disabledarr.length !== 0) {
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
                  this.equipmentAudit(this.unAuditarr)
                }
              }
              // {
              //   type: 'button',
              //   innerText: '反审核',
              //   className: 'btn-blue-disabled',
              //   isDisabled: true,
              //   handleClick: () => {
              //     if (this.unAuditarr.length !== 0 || this.disabledarr.length !== 0) {
              //       this.$message.error('只能选择已审核数据进行反审核')
              //       return
              //     }
              //     if (this.auditarr.length === 0) {
              //       this.$message({
              //         message: '最少需要选择一条已审核数据',
              //         type: 'warning'
              //       })
              //       return
              //     }
              //     this.equipmentUnaudit(this.auditarr)
              //   }
              // }
            ]
          },
          right: {
            inpLists: [
              {
                key: 'area',
                type: 'cascader',
                valueKey: 0,
                className: 'shadow',
                customNode: 'title',
                customLabel: 'title',
                customValue: '',
                checkStrictly: true,
                placeholder: '请选择大区 / 区域 / 场区', //  / 工段 / 单元
                clearable: true,
                options: [],
                handleChange: (v1) => {
                  if (v1.length === 3) {
                    this.navFormInfo.data.segmentIdUnit = [] // 先清一下 工段/单元
                    this.navFormInfo.fieldList.right.inpLists[1].options = []
                    const element = this.dataInterface['getSegmentUnitTree']
                    const params = {
                      fieldId: v1[2]
                    }
                    this.$httpRequest({
                      type: element?.method,
                      uri: element?.uri,
                      payload: params,
                      callback: res => {
                        console.log('获取的二级工段单元数据---', res)
                        if (res.status === 200 && res.rel) {
                          this.navFormInfo.fieldList.right.inpLists[1].options = res.data
                        } else {
                          console.error(res.message)
                        }
                      }
                    })
                  //   getRootTypeUnitTreeV2({ fieldId: v1[2], isBuilding: false }).then(data => {
                  //     if (data.status === 200) {
                  //       this.navFormInfo.fieldList.right.inpLists[1].options = data.data
                  //     } else {
                  //       this.navFormInfo.fieldList.right.inpLists[1].options = []
                  //     }
                  //   })
                  //   this.navFormInfo.data.roomtypeUnit = []
                  // } else {
                  //   this.navFormInfo.fieldList.right.inpLists[1].options = []
                  //   this.navFormInfo.data.roomtypeUnit = []
                  // }
                  } else {
                    this.navFormInfo.fieldList.right.inpLists[1].options = []
                    this.navFormInfo.data.segmentIdUnit = []
                  }
                }
              },
              {
                key: 'segmentIdUnit',
                type: 'cascader2',
                valueKey: 1,
                className: 'shadow',
                customNode: 'title',
                customLabel: 'title',
                customValue: '',
                checkStrictly: true,
                placeholder: '请选择工段 / 单元',
                clearable: true,
                options: []
              },
              {
                key: 'equiptypeId',
                type: 'select',
                className: 'shadow',
                clearable: true,
                filterable: true,
                placeholder: '设备类型',
                list: [],
                props: {
                  label: 'equiptype_name',
                  value: 'id'
                }
              },
              {
                key: 'deviceVersionId',
                type: 'select',
                className: 'shadow',
                clearable: true,
                filterable: true,
                placeholder: '设备型号',
                list: [],
                props: {
                  label: 'version_name',
                  value: 'id'
                }
              },
              {
                key: 'protocol',
                type: 'select',
                className: 'shadow',
                clearable: true,
                placeholder: '协议',
                list: [
                  {
                    key: 'LoRa',
                    value: 'LoRa'
                  },
                  {
                    key: 'MQTT',
                    value: 'MQTT'
                  },
                  {
                    key: 'IP',
                    value: 'IP'
                  }
                ]
              },
              {
                key: 'keyWord',
                type: 'input',
                required: true,
                className: 'shadow',
                placeholder: '关键字'
              },
              {
                key: 'timeDate',
                type: 'dateTime',
                className: 'shadow',
                clearable: true,
                dateType: 'datetimerange',
                startPlaceholder: '开始时间',
                endPlaceholder: '结束时间'
              },
              {
                key: 'statusOnline',
                type: 'select',
                className: 'shadow',
                clearable: true,
                placeholder: '是否在线',
                list: [
                  {
                    key: '离线',
                    value: 0
                  },
                  {
                    key: '在线',
                    value: 1
                  }
                ]
              },
              {
                key: 'firmware_version',
                type: 'input',
                required: true,
                className: 'shadow',
                placeholder: '请输入固件版本'
              },
              {
                key: 'mac',
                type: 'input',
                required: true,
                className: 'shadow',
                placeholder: '请输入Mac地址'
              }
            ],
            btnLists: [
              {
                innerText: '查询',
                className: 'btn-blue',
                handleClick: () => {
                  this.pagination.pageIndex = 1
                  this.getTableData()
                }
              },
              {
                innerText: '重置',
                className: 'btn-border',
                handleClick: () => {
                  this.pagination.pageIndex = 1
                  this.$refs['navForm'].resetFields()
                  this.navFormInfo.data.regionId = ''
                  this.navFormInfo.data.areaId = ''
                  this.navFormInfo.data.fieldId = ''
                  this.navFormInfo.data.block = ''
                  this.navFormInfo.data.segmentId = ''
                  this.navFormInfo.data.unit = ''
                  this.navFormInfo.data.startTime = ''
                  this.navFormInfo.data.endTime = ''
                  this.getTableData()
                }
              },
              {
                innerText: '导出',
                className: 'btn-blue',
                handleClick: () => {
                  const element = this.pageElement['export']
                  const searchForm = { ...this.navFormInfo.data }
                  delete searchForm.area
                  delete searchForm.timeDate
                  derive('api/' + element.uri, { ...searchForm })
                }
              }
            ]
          }
        }
      },
      columns: [
        {
          prop: 'deviceName',
          label: '设备名称',
          width: '250'
        },
        {
          prop: 'deviceId',
          label: '设备标识',
          width: '320'
        },
        {
          prop: 'mac',
          label: 'Mac地址',
          width: '200'
        },
        {
          prop: 'equiptypeName',
          label: '设备类型',
          width: '180'
        },
        {
          prop: 'versionName',
          label: '设备型号',
          width: '180'
        },
        {
          prop: 'firmwareVersion',
          label: '固件版本',
          width: '120'
        },
        {
          prop: 'fieldName',
          label: '部署场区',
          width: '190',
          render: (h, params) => {
            let txt = ''
            if (params.row.fieldName) {
              txt = txt + params.row.fieldName + '-'
            }
            if (params.row.segmentName) {
              txt = txt + params.row.segmentName + '-'
            }
            if (params.row.unit) {
              txt = txt + params.row.unit
            }
            return h('span', {}, txt || '---')
          }
        },
        {
          prop: 'statusOnline',
          label: '是否在线',
          width: '100',
          rule: {
            0: '离线',
            1: '在线'
          }
        },
        {
          prop: 'status',
          label: '是否审核',
          width: '100',
          fixed: 'right',
          rule: {
            '1': '未审核',
            '2': '已审核',
            '3': '已禁用'
          }
        },
        {
          prop: 'protocol',
          label: '协议',
          minWidth: '80'
        }
      ],
      tableData: [],
      selection: [],
      auditarr: [],
      unAuditarr: [],
      disabledarr: [],
      // 表单对应列表
      listTypeInfo: {
        equiptypeIdList: [
        ],
        deviceVersionIdList: [
        ],
        firmwareVersionIdList: [
        ],
        deviceNameList: [
        ]
      },
      // detailForm: {
      //   regionName: '',
      //   areaName: '',
      //   fieldName: '',
      //   equiptypeName: '',
      //   deviceVersionName: '',
      //   deviceName: '', // 设备名称
      //   firmwareVersionId: ''
      // },
      formInfo1: {
        data: {
          area: [], // 大区 / 区域 / 场区
          regionId: '',
          regionName: '',
          areaId: '',
          areaName: '',
          fieldId: '',
          fieldName: '',
          equiptypeId: '', // 设备类型id
          equiptypeName: '', // 设备类型
          deviceVersionId: '', // 设备型号id
          deviceVersionName: '', // 设备型号
          deviceName: '', // 设备名称
          firmwareVersionId: '', // 固件版本号id
          firmwareVersionName: '' // 固件版本号
        },
        fieldList: [
          {
            label: '所在场区',
            key: 'area',
            type: 'cascader',
            className: 'shadow',
            customLabel: 'regionName',
            customValue: 'regionNum',
            placeholder: '请选择大区 / 区域 / 场区',
            clearable: true,
            options: []
          },
          {
            label: '设备类型',
            key: 'equiptypeId',
            valueKey: 'id',
            type: 'select',
            className: 'shadow',
            clearable: true,
            filterable: true,
            placeholder: '设备类型',
            list: 'equiptypeIdList',
            props: {
              label: 'equiptype_name',
              value: 'id'
            },
            handleChange: (val) => {
              if (val) {
                this.formInfo1.data.equiptypeName = val.equiptype_name
              } else {
                this.formInfo1.data.equiptypeName = ''
              }
              this.formInfo1.data.firmwareVersionId = ''
              this.listTypeInfo.firmwareVersionIdList = []
              this.getEquipmentFirmwareVersionList()
            }
          },
          {
            label: '设备型号',
            key: 'deviceVersionId',
            valueKey: 'id',
            type: 'select',
            className: 'shadow',
            placeholder: '设备型号',
            clearable: true,
            filterable: true,
            list: 'deviceVersionIdList',
            props: {
              label: 'version_name',
              value: 'id'
            },
            handleChange: (val) => {
              if (val) {
                this.formInfo1.data.deviceVersionName = val.version_name
              } else {
                this.formInfo1.data.deviceVersionName = ''
              }
            }
          },
          {
            label: '固件版本号',
            key: 'firmwareVersionId',
            valueKey: 'id',
            type: 'select',
            className: 'shadow',
            placeholder: '固件版本号',
            clearable: true,
            list: 'firmwareVersionIdList',
            required: true,
            rules: [
              { required: true, message: '请选择固件版本号', trigger: 'change' }
            ],
            props: {
              label: 'firmware_version',
              value: 'id'
            },
            handleChange: (val) => {
              if (val) {
                this.formInfo1.data.firmwareVersionName = val.firmware_version
              } else {
                this.formInfo1.data.firmwareVersionName = ''
              }
            }
          }
        ]
      },
      formInfo2: {
        data: {
          deviceName: '', // 设备名称
          equiptypeId: '', // 设备类型
          firmwareVersionId: '' // 固件版本号
        },
        fieldList: [
          {
            label: '设备名称',
            key: 'deviceName',
            type: 'select',
            className: 'shadow',
            clearable: true,
            filterable: true,
            placeholder: '设备名称',
            list: 'deviceNameList',
            required: true,
            rules: [
              { required: true, message: '请选择设备名称', trigger: 'change' }
            ],
            props: {
              label: 'deviceName',
              value: 'deviceName'
            },
            handleChange: (data) => {
              this.formInfo2.data.firmwareVersionId = ''
              this.listTypeInfo.firmwareVersionIdList = []
              if (this.formInfo2.data.deviceName) {
                this.listTypeInfo.deviceNameList.map(item => {
                  if (this.formInfo2.data.deviceName === item.deviceName) {
                    this.formInfo2.data.equiptypeId = item.equiptypeId
                  }
                })
              } else {
                this.formInfo2.data.equiptypeId = ''
              }
              this.getEquipmentFirmwareVersionList()
            }
          },
          {
            label: '固件版本号',
            key: 'firmwareVersionId',
            valueKey: 'id',
            type: 'select',
            className: 'shadow',
            placeholder: '固件版本号',
            clearable: true,
            list: 'firmwareVersionIdList',
            required: true,
            rules: [
              { required: true, message: '请选择固件版本号', trigger: 'change' }
            ],
            props: {
              label: 'firmware_version',
              value: 'id'
            },
            handleChange: (val) => {
              if (val) {
                this.formInfo1.data.firmwareVersionName = val.firmware_version
              } else {
                this.formInfo1.data.firmwareVersionName = ''
              }
            }
          }
        ]
      },
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
    'navFormInfo.data': {
      handler(n) {
        this.navFormInfo.data.regionId = n.area[0] || ''
        this.navFormInfo.data.areaId = n.area[1] || ''
        this.navFormInfo.data.fieldId = n.area[2] || ''
        // this.navFormInfo.data.block = ''
        this.navFormInfo.data.segmentId = n.segmentIdUnit[0] || ''
        this.navFormInfo.data.unit = n.segmentIdUnit[1] || ''
        if (n.area.length === 0) {
          this.navFormInfo.fieldList.right.inpLists[0].valueKey++ // 只要监听到数据源发生变化 ，改变keyValue的值，达到重新渲染的效果
          this.navFormInfo.fieldList.right.inpLists[1].valueKey++
        }
      },
      deep: true
    },
    unAuditarr(val) {
      if (val.length > 0) {
        this.navFormInfo.fieldList.left.inpLists[2].className = 'btn-blue'
        this.navFormInfo.fieldList.left.inpLists[2].isDisabled = false
      } else {
        this.navFormInfo.fieldList.left.inpLists[2].className = 'btn-blue-disabled'
        this.navFormInfo.fieldList.left.inpLists[2].isDisabled = true
      }
    },
    auditarr(val) {
      if (val.length > 0) {
        this.navFormInfo.fieldList.left.inpLists[1].className = 'btn-blue'
        this.navFormInfo.fieldList.left.inpLists[1].isDisabled = false
      } else {
        this.navFormInfo.fieldList.left.inpLists[1].className = 'btn-blue-disabled'
        this.navFormInfo.fieldList.left.inpLists[1].isDisabled = true
      }
    },
    dialogType(val) {
      if (val === '1') {
        this.$refs['delog1'].resetFields() // 手动清楚一下提示语
      } else {
        this.$refs['delog2'].resetFields() // 手动清楚一下提示语
      }
    },
    dialogFormVisible(val) {
      if (!val) {
        this.activeName = 'first'
        if (this.dialogType === '1') {
          this.$refs['delog1'].resetFields() // 手动清楚一下提示语
        } else {
          this.$refs['delog2'].resetFields() // 手动清楚一下提示语
        }
      }
    }
  },
  mounted() {
    // 当前页面的元素权限
    this.pageElement = getConfigElement('myEquipment')
    this.dataInterface = getConfigElement('wlwDataInterface')
    this.getTree()
    this.getTableData()
    this.getEquipmentTypeList()
    this.getDeviceVersionList()
  },
  methods: {
    closeDialog() {
      this.dialogType = '1'
      this.contentType = '1'
    },
    // 获取区域联动数据
    getTree() {
      const dataInterface = this.dataInterface['getRegionAreaFieldTree']
      const params = {}
      this.$httpRequest({
        type: dataInterface?.method,
        uri: dataInterface.uri ? dataInterface.uri : '',
        payload: params,
        callback: data => {
          console.log('获取的三级区域数据---', data)
          if (data.status === 200 && data.rel) {
            // const arr = wlwJsonh2Tree(data.data)
            this.navFormInfo.fieldList.right.inpLists[0].options = data.data
          } else {
            // this.$message.error(data.message)
          }
        }
      })
    },
    // 获取OTA区域联动数据
    getOTATree() {
      const dataInterface = this.dataInterface['treeForSelectV1']
      const params = {
        limit: 10000,
        page: 1
      }
      this.$httpRequest({
        type: dataInterface.method,
        uri: dataInterface.uri ? dataInterface.uri : '',
        payload: params,
        callback: data => {
          if (data.status === 200 && data.rel) {
            this.formInfo1.fieldList[0].options = data.data
          } else {
            this.$message.error(data.message)
          }
        }
      })
      // treeForSelectV1().then((data) => {
      //   if (data.status === 200 && data.rel) {
      //     this.formInfo1.fieldList[0].options = data.data
      //   } else {
      //     this.$message.error(data.message)
      //   }
      // })
    },
    // 获取设备类型下拉框数据
    getEquipmentTypeList() {
      const dataInterface = this.dataInterface['myEquipmentTypeGetPageListByDto']
      const params = {
        limit: 10000,
        page: 1
      }
      this.$httpRequest({
        type: dataInterface.method,
        uri: dataInterface.uri ? dataInterface.uri : '',
        payload: params,
        callback: data => {
          if (data.status === 200) {
            if (data.data.total > 0) {
              this.navFormInfo.fieldList.right.inpLists[1].list = data.data.rows
              this.listTypeInfo.equiptypeIdList = data.data.rows
            } else {
              this.navFormInfo.fieldList.right.inpLists[1].list = []
              this.listTypeInfo.equiptypeIdList = []
            }
          }
        }
      })
      // getEquipmentType({ limit: 1000, page: 1 }).then(data => {
      //   if (data.status === 200) {
      //     if (data.data.total > 0) {
      //       this.navFormInfo.fieldList.right.inpLists[1].list = data.data.rows
      //       this.listTypeInfo.equiptypeIdList = data.data.rows
      //     } else {
      //       this.navFormInfo.fieldList.right.inpLists[1].list = []
      //       this.listTypeInfo.equiptypeIdList = []
      //     }
      //   }
      // })
    },
    // 获取设备型号下拉框数据
    getDeviceVersionList() {
      const dataInterface = this.dataInterface['myEquipmentVersionGetPageListByDto']
      const params = {
        limit: 10000,
        page: 1
      }
      this.$httpRequest({
        type: dataInterface.method,
        uri: dataInterface.uri ? dataInterface.uri : '',
        payload: params,
        callback: data => {
          if (data.status === 200) {
            if (data.data.total > 0) {
              this.navFormInfo.fieldList.right.inpLists[2].list = data.data.rows
              this.listTypeInfo.deviceVersionIdList = data.data.rows
            } else {
              this.navFormInfo.fieldList.right.inpLists[2].list = []
              this.listTypeInfo.deviceVersionIdList = []
            }
          }
        }
      })
      // getEquipmentVersion({ limit: 1000, page: 1 }).then(data => {
      //   if (data.status === 200) {
      //     if (data.data.total > 0) {
      //       this.navFormInfo.fieldList.right.inpLists[2].list = data.data.rows
      //       this.listTypeInfo.deviceVersionIdList = data.data.rows
      //     } else {
      //       this.navFormInfo.fieldList.right.inpLists[2].list = []
      //       this.listTypeInfo.deviceVersionIdList = []
      //     }
      //   }
      // })
    },
    // 获取设备固态版本号下拉框数据
    getEquipmentFirmwareVersionList() {
      const dataInterface = getConfigElement('my_equipment_firmware_version')['view_getPageList']
      const params = {
        limit: 10000,
        page: 1,
        status: 2
      }
      if (this.dialogType === '1') {
        if (this.formInfo1.data.equiptypeId) {
          params['equiptype_id'] = this.formInfo1.data.equiptypeId
        }
      } else if (this.dialogType === '2') {
        if (this.formInfo2.data.deviceName) {
          params['equiptype_id'] = this.formInfo2.data.equiptypeId
        }
      }
      this.$httpRequest({
        type: dataInterface.method,
        uri: dataInterface.uri ? dataInterface.uri : '',
        payload: params,
        callback: data => {
          if (data.status === 200) {
            if (data.data.total > 0) {
              this.listTypeInfo.firmwareVersionIdList = data.data.rows
            } else {
              this.listTypeInfo.firmwareVersionIdList = []
            }
          }
        }
      })
      // getEquipmentFirmwareVersion(params).then(data => {
      //   if (data.status === 200) {
      //     if (data.data.total > 0) {
      //       this.listTypeInfo.firmwareVersionIdList = data.data.rows
      //     } else {
      //       this.listTypeInfo.firmwareVersionIdList = []
      //     }
      //   }
      // })
    },
    cascaderEvent(val, val1, val2) {
      if (val.length > 0) {
        this.formInfo1.data.regionId = val[0]
        this.formInfo1.data.regionName = val1[0]
        this.formInfo1.data.areaId = val[1]
        this.formInfo1.data.areaName = val1[1]
        this.formInfo1.data.fieldId = val[2]
        this.formInfo1.data.fieldName = val1[2]
      } else {
        this.formInfo1.data.regionId = ''
        this.formInfo1.data.regionName = ''
        this.formInfo1.data.areaId = ''
        this.formInfo1.data.areaName = ''
        this.formInfo1.data.fieldId = ''
        this.formInfo1.data.fieldName = ''
      }
    },
    changeDialogTyle() {
      this.dialogType = this.dialogType === '1' ? '2' : '1'
      if (this.dialogType === '2') {
        this.formInfo2.data = {
          deviceName: '', // 设备名称
          firmwareVersionId: '' // 固件版本号
        }
      } else {
        this.formInfo1.data = {
          area: [], // 大区 / 区域 / 场区
          equiptypeId: '', // 设备类型
          deviceVersionId: '', // 设备型号
          deviceName: '', // 设备名称
          firmwareVersionId: '' // 固件版本号
        }
      }
      this.getEquipmentFirmwareVersionList()
    },
    tabHandleClick() {
      this.dialogType = this.dialogType === '1' ? '2' : '1'
      if (this.dialogType === '2') {
        this.formInfo2.data = {
          deviceName: '', // 设备名称
          firmwareVersionId: '' // 固件版本号
        }
      } else {
        this.formInfo1.data = {
          area: [], // 大区 / 区域 / 场区
          equiptypeId: '', // 设备类型
          deviceVersionId: '', // 设备型号
          deviceName: '', // 设备名称
          firmwareVersionId: '' // 固件版本号
        }
      }
      this.getEquipmentFirmwareVersionList()
    },
    joinDetail() {
      if (this.dialogType === '1') {
        if (!this.$refs['delog1'].validateSelf()) {
          return false
        }
        this.getDetailList()
      } else {
        if (!this.$refs['delog2'].validateSelf()) {
          return false
        }
      }
      this.contentType = '2'
    },
    firmware() {
      const element = this.pageElement['btn_firmwareOTA']
      const params = {}
      if (this.dialogType === '1') {
        params['deviceVersionId'] = this.formInfo1.data.deviceVersionId
        params['equiptypeId'] = this.formInfo1.data.equiptypeId
        params['fieldId'] = this.formInfo1.data.fieldId
        params['deviceName'] = this.formInfo1.data.deviceName
        params['firmwareVersionId'] = this.formInfo1.data.firmwareVersionId
      } else {
        params['deviceName'] = this.formInfo2.data.deviceName
        params['firmwareVersionId'] = this.formInfo2.data.firmwareVersionId
      }
      this.buttonLoading = true
      this.$httpRequest({
        type: element.method,
        uri: element.uri ? element.uri : '',
        payload: params,
        callback: data => {
          this.buttonLoading = false
          if (data.status === 200 && data.rel) {
            this.$message.success('升级成功')
            this.dialogFormVisible = false
          } else {
            this.$message.error(data.message)
          }
        }
      })
      // firmwareOTA(params).then(data => {
      //   this.buttonLoading = false
      //   if (data.status === 200 && data.rel) {
      //     this.$message.success('升级成功')
      //     this.dialogFormVisible = false
      //   } else {
      //     this.$message.error(data.message)
      //   }
      // })
    },
    navCascaderEvent(val, val1, val2) {
      // if (val.length > 0) {
      //   this.navFormInfo.data.regionId = val[0] || ''
      //   this.navFormInfo.data.areaId = val[1] || ''
      //   this.navFormInfo.data.fieldId = val[2] || ''
      //   if (val[3] === 'BLOCK_A' || val[3] === 'BLOCK_B') {
      //     this.navFormInfo.data.block = val[3] || ''
      //     this.navFormInfo.data.segmentId = val[4] || ''
      //     this.navFormInfo.data.unit = val1[5] || ''
      //   } else {
      //     this.navFormInfo.data.segmentId = val[3] || ''
      //     this.navFormInfo.data.unit = val1[4] || ''
      //   }
      // } else {
      //   this.navFormInfo.data.regionId = ''
      //   this.navFormInfo.data.areaId = ''
      //   this.navFormInfo.data.fieldId = ''
      //   this.navFormInfo.data.block = ''
      //   this.navFormInfo.data.segmentId = ''
      //   this.navFormInfo.data.unit = ''
      // }
    },
    navDateTimeChange(val) {
      if (val) {
        this.navFormInfo.data.startTime = val[0]
        this.navFormInfo.data.endTime = val[1]
      } else {
        this.navFormInfo.data.startTime = ''
        this.navFormInfo.data.endTime = ''
      }
    },
    // 审核
    equipmentAudit(idArr) {
      const element = this.pageElement['btn_review']
      const ids = idArr.join(',')
      this.$confirm('此操作将审核这些设备, 是否继续?', '提示', {
        confirmButtonText: '确定',
        confirmButtonClass: 'btn-blue btn-blue-confirm',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$httpRequest({
          type: element.method,
          uri: element.uri ? element.uri + '?ids=' + ids : '',
          callback: data => {
            if (data.status === 200) {
              this.$message({
                message: '审核成功',
                type: 'success'
              })
              this.getTableData()
            } else {
              this.$message.error(data.message)
            }
          }
        })
        // equipmentReview({
        //   ids: ids
        // }).then((data) => {
        //   if (data.status === 200) {
        //     this.$message({
        //       message: '审核成功',
        //       type: 'success'
        //     })
        //     this.getTableData()
        //   }
        // })
      }).catch(() => {})
    },
    // 反审核
    // equipmentUnaudit(idArr) {
    //   const ids = idArr.join(',')
    //   this.$confirm('此操作将审核这些设备, 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     confirmButtonClass: 'btn-blue btn-blue-confirm',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     equipmentUnreview({
    //       ids: ids
    //     }).then((data) => {
    //       if (data.status === 200) {
    //         this.$message({
    //           message: '审核成功',
    //           type: 'success'
    //         })
    //         this.getTableData()
    //       }
    //     })
    //   }).catch(() => {})
    // },
    // 禁用
    equipmentForbidden() {
      const element = this.pageElement['btn_disable']
      const ids = this.auditarr.join(',')
      this.$confirm('此操作将禁用这些设备, 是否继续?', '提示', {
        confirmButtonText: '确定',
        confirmButtonClass: 'btn-blue btn-blue-confirm',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$httpRequest({
          type: element.method,
          uri: element.uri ? element.uri + '?ids=' + ids : '',
          callback: data => {
            if (data.status === 200) {
              this.$message({
                message: '禁用成功',
                type: 'success'
              })
              this.getTableData()
            } else {
              this.$message.error(data.message)
            }
          }
        })
        // equipmentDisable({
        //   ids: ids
        // }).then((data) => {
        //   if (data.status === 200) {
        //     this.$message({
        //       message: '禁用成功',
        //       type: 'success'
        //     })
        //     this.getTableData()
        //   }
        // })
      }).catch(() => {})
    },
    // 复选框
    handleSelectionChange(selection) {
      this.selection = selection
      this.auditarr = [] // 已审核数组
      this.unAuditarr = [] // 未审核数组
      this.disabledarr = [] // 已禁用数组
      selection.forEach((item) => {
        if (item.status === '2') {
          this.auditarr.push(item.id)
        } else if (item.status === '1') {
          this.unAuditarr.push(item.id)
        } else if (item.status === '3') {
          this.disabledarr.push(item.id)
        }
      })
    },
    handleIndexChange(current) {
      this.pagination.pageIndex = current
      this.getTableData()
    },
    handleSizeChange(size) {
      this.pagination.pageIndex = 1
      this.pagination.limit = size
      this.getTableData()
    },
    getTableData() {
      const element = this.pageElement['view_getPageList']
      const params = {
        limit: this.pagination.limit,
        page: this.pagination.pageIndex
      }
      const searchForm = { ...this.navFormInfo.data }
      delete searchForm.area
      delete searchForm.segmentIdUnit
      delete searchForm.timeDate
      this.isLoading = true
      this.$httpRequest({
        type: element.method,
        uri: element.uri ? element.uri : '',
        payload: { ...params, ...searchForm },
        callback: data => {
          this.isLoading = false
          if (data.status === 200) {
            if (data.data.total > 0) {
              this.tableData = data.data.rows
              this.pagination.total = data.data.total
              this.listTypeInfo.deviceNameList = data.data.rows
            } else {
              this.tableData = []
              this.pagination.total = 0
            }
            this.$refs['tablePage'].$children[0].clearSelection()
          } else {
            this.$message.error(data.message)
          }
        }
      })
      // getPageList({ ...params, ...this.navFormInfo.data }).then(data => {
      //   this.isLoading = false
      //   if (data.status === 200) {
      //     if (data.data.total > 0) {
      //       this.tableData = data.data.rows
      //       this.pagination.total = data.data.total
      //       this.listTypeInfo.deviceNameList = data.data.rows
      //     } else {
      //       this.tableData = []
      //       this.pagination.total = 0
      //     }
      //     this.$refs['tablePage'].$children[0].clearSelection()
      //   }
      // }).catch(() => {
      //   this.isLoading = false
      // })
    },
    getDetailList() {
      const element = this.pageElement['view_getPageList']
      const params = {
        limit: 1000,
        page: 1
      }
      if (this.formInfo1.data.area.length > 0) {
        params['regionId'] = this.formInfo1.data.area[0]
        params['areaId'] = this.formInfo1.data.area[1]
        params['fieldId'] = this.formInfo1.data.area[2]
      }
      if (this.formInfo1.data.equiptypeId) {
        params['equiptypeId'] = this.formInfo1.data.equiptypeId
      }
      if (this.formInfo1.data.deviceVersionId) {
        params['deviceVersionId'] = this.formInfo1.data.deviceVersionId
      }
      this.$httpRequest({
        type: element.method,
        uri: element.uri ? element.uri : '',
        payload: params,
        callback: data => {
          if (data.status === 200) {
            if (data.data.total > 0) {
              const deviceName = data.data.rows.map(item => { return item['deviceName'] })
              this.formInfo1.data.deviceName = deviceName.join(',')
            } else {
              this.formInfo1.data.deviceName = ''
            }
          } else {
            this.$message.error(data.message)
          }
        }
      })
    }
  }
}
</script>
<style lang="scss">
.conditionDialog {
  .el-dialog__body{
    padding: 0 30px 20px !important;
  }
}
</style>
<style lang="scss" scoped>
  .dialogTitle {
    font-size: 18px;
    line-height: 24px;
    // color: #ffffff;
    @include font_color('spFontColor4');
    margin-right: 10px;
  }
</style>
