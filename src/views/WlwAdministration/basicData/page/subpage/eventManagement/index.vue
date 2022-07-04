<template>
  <div class="fieldOnlineStatus">
    <!-- 头部导航 -->
    <nav-form
      ref="navForm"
      :data="navFormInfo.data"
      :field-list="navFormInfo.fieldList"
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
      @child-removeRow="completeRow"
      @child-seeRow="confirmRow"
      @child-editRow="repairRow"
    />
    <!-- 新增 -->
    <el-dialog
      :title="title"
      :modal-append-to-body="false"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      width="600px"
    >
      <div class="detailContent">
        <div class="detailItem">设备类型：{{ formInfo.data.equiptypeName }}</div>
        <div class="detailItem">协议：{{ formInfo.data.protocolName }}</div>
        <div class="detailItem">设备标识：{{ formInfo.data.deviceId }}</div>
        <div class="detailItem">设备型号：{{ formInfo.data.versionName }}</div>
      </div>
      <general-form
        ref="delog"
        label-width="100px"
        style="margin-top: 20px;"
        :data="formInfo.data"
        :field-list="formInfo.fieldList"
        :list-type-info="listTypeInfo"
        theme-type="default"
      />
    </el-dialog>
  </div>
</template>
<script>
import navForm from '@/components/commonComponent/navForm/index.vue'
import generalForm from '@/components/commonComponent/generalForm'
import tablePage from '@/components/ElementComponent/iTable'
import { getConfigElement } from '@/utils/overtService'
export default {
  components: {
    navForm,
    tablePage,
    generalForm
  },
  data() {
    return {
      pageElement: [], // 当前页面 权限数组
      dataInterface: [], // 数据接口权限数组
      isLoading: false,
      dialogFormVisible: false,
      clickId: '',
      title: '事件新增',
      listTypeInfo: {
        deviceIdList: [],
        eventIdList: [],
        troubleIdList: []
      },
      formInfo: {
        data: {
          deviceId: '',
          deviceName: '',
          deviceVersionId: '',
          versionName: '',
          equipmentId: '',
          equiptypeId: '',
          equiptypeName: '',
          firmwareVersion: '',
          firmwareVersionId: '',
          eventContent: '',
          eventId: '',
          eventName: '',
          protocolId: '',
          protocolName: '',
          troubleCode: '',
          troubleId: '',
          troubleName: '',
          description: ''
        },
        fieldList: [
          {
            label: '设备名称',
            key: 'deviceId',
            valueKey: 'deviceId',
            type: 'select',
            className: 'shadow',
            clearable: true,
            filterable: true,
            placeholder: '请选择设备名称',
            list: 'deviceIdList',
            required: true,
            rules: [
              { required: true, message: '请选择设备名称', trigger: 'change' }
            ],
            props: {
              label: 'deviceName',
              value: 'deviceId'
            },
            handleChange: (val) => {
              console.log(val)
              if (val) {
                this.formInfo.data.deviceName = val.deviceName
                this.formInfo.data.deviceVersionId = val.deviceVersionId
                this.formInfo.data.versionName = val.versionName
                this.formInfo.data.equiptypeId = val.equiptypeId
                this.formInfo.data.equiptypeName = val.equiptypeName
                this.formInfo.data.protocolId = val.protocol
                this.formInfo.data.protocolName = val.protocol
                this.formInfo.data.firmwareVersion = val.firmwareVersion
                this.formInfo.data.firmwareVersionId = val.firmwareVersionId
              } else {
                this.formInfo.data.deviceName = ''
                this.formInfo.data.deviceVersionId = ''
                this.formInfo.data.versionName = ''
                this.formInfo.data.equiptypeId = ''
                this.formInfo.data.equiptypeName = ''
                this.formInfo.data.protocolId = ''
                this.formInfo.data.protocolName = ''
                this.formInfo.data.firmwareVersion = ''
                this.formInfo.data.firmwareVersionId = ''
              }
            }
          },
          {
            label: '事件类型',
            key: 'eventId',
            valueKey: 'id',
            type: 'select',
            className: 'shadow',
            clearable: true,
            filterable: true,
            placeholder: '请选择事件类型',
            list: 'eventIdList',
            required: true,
            rules: [
              { required: true, message: '请选择事件类型', trigger: 'change' }
            ],
            props: {
              label: 'version_name',
              value: 'id'
            },
            handleChange: (val) => {
              if (val) {
                this.formInfo.data.eventName = val.version_name
              } else {
                this.formInfo.data.eventName = ''
              }
            }
          }
          // {
          //   label: '故障码',
          //   key: 'troubleId',
          //   valueKey: 'id',
          //   type: 'select',
          //   className: 'shadow',
          //   clearable: true,
          //   filterable: true,
          //   placeholder: '请选择故障码',
          //   list: 'troubleIdList',
          //   props: {
          //     label: 'version_name',
          //     value: 'id'
          //   },
          //   handleChange: (val) => {
          //     if (val) {
          //       this.formInfo.data.troubleCode = val.version_name
          //     } else {
          //       this.formInfo.data.troubleCode = ''
          //     }
          //   }
          // }
        ]
      },
      navFormInfo: {
        data: {
          deviceName: '',
          eventName: '',
          timeType: '',
          timeDate: [],
          startTime: '',
          endTime: '',
          protocolId: ''
        },
        fieldList: {
          left: {
            inpLists: [
              {
                type: 'button',
                innerText: '新增',
                className: 'btn-blue',
                handleClick: () => {
                  this.dialogFormVisible = true
                }
              }
            ]
          },
          right: {
            inpLists: [
              {
                key: 'deviceName',
                type: 'select',
                className: 'shadow',
                clearable: true,
                filterable: true,
                placeholder: '设备名称',
                list: [],
                props: {
                  label: 'deviceName',
                  value: 'deviceName'
                }
              },
              {
                key: 'eventName',
                type: 'select',
                className: 'shadow',
                clearable: true,
                placeholder: '事件类型',
                list: [
                  {
                    key: '告警',
                    value: '1'
                  },
                  {
                    key: '维修',
                    value: '2'
                  },
                  {
                    key: '故障',
                    value: '3'
                  },
                  {
                    key: '巡检',
                    value: '4'
                  }
                ]
              },
              {
                key: 'timeType',
                type: 'select',
                className: 'shadow',
                clearable: true,
                placeholder: '时间类型',
                list: [
                  {
                    key: '完成时间',
                    value: '1'
                  },
                  {
                    key: '创建时间',
                    value: '2'
                  },
                  {
                    key: '处理时间',
                    value: '3'
                  }
                ]
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
                key: 'protocolId',
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
                  this.getTableData()
                }
              }
            ]
          }
        }
      },
      columns: [
        {
          longData: true,
          prop: 'device_name',
          label: '设备名称',
          width: 260
        },
        {
          longData: true,
          prop: 'device_id',
          label: '设备标识',
          width: 260
        },
        {
          prop: 'firmware_version',
          label: '固件版本',
          width: 120
        },
        {
          prop: 'protocol_name',
          label: '协议',
          width: 100
        },
        {
          longData: true,
          prop: 'equiptype_name',
          label: '设备类型',
          width: 160
        },
        {
          longData: true,
          prop: 'version_name',
          label: '设备型号',
          width: 160
        },
        {
          prop: 'event_name',
          label: '事件类型',
          width: 120,
          rule: {
            1: '告警',
            2: '维修',
            3: '故障',
            4: '巡检'
          }
        },
        {
          prop: 'trouble_code',
          label: '故障码',
          width: 120
        },
        {
          prop: 'crt_time',
          label: '创建时间',
          width: 160
        },
        {
          prop: 'dealwith_time',
          label: '处理时间',
          width: 160
        },
        {
          prop: 'carryout_time',
          label: '完成时间',
          width: 160
        },
        {
          longData: true,
          prop: 'description',
          label: '备注',
          width: 120
        },
        {
          label: '操作',
          fixed: 'right',
          align: 'center',
          width: '220', // 操作按钮宽度
          render: (h, params) => {
            return h('div', [
              h('a', {
                style: {
                  color: !params.row.dealwith_status ? '#FFF' : '#CDD8F7',
                  display: (params.row.event_name === '1' || params.row.event_name === '3') ? 'inline-block' : 'none'
                },
                on: {
                  click: () => {
                    console.log(this.title)
                  }
                }
              }, '确认'),
              h('a', {
                style: {
                  color: params.row.dealwith_status !== 2 ? '#FFF' : '#CDD8F7',
                  marginLeft: '10px',
                  marginRight: '10px',
                  display: (params.row.event_name === '3' || params.row.event_name === '4') ? 'inline-block' : 'none'
                },
                on: {
                  click: () => {
                    console.log(this.title)
                  }
                }
              }, '维修'),
              h('a', {
                style: {
                  color: !params.row.carryout_status ? '#FFF' : '#CDD8F7',
                  display: (params.row.event_name !== '1') ? 'inline-block' : 'none'
                },
                on: {
                  click: () => {
                    if (!params.row.carryout_status) {
                      this.clickId = params.row.id
                    }
                  }
                }
              }, '完成')
            ])
          }
        }
      ],
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
  created() {
    this.pageElement = getConfigElement('myEquipmentOperationEvent')
    this.dataInterface = getConfigElement('wlwDataInterface')
    this.init()
  },
  methods: {
    init() {
      this.getTableData()
      this.getDeviceNameList()
    },
    // 修改时间
    navDateTimeChange(val) {
      if (val) {
        this.navFormInfo.data.startTime = val[0]
        this.navFormInfo.data.endTime = val[1]
      } else {
        this.navFormInfo.data.startTime = ''
        this.navFormInfo.data.endTime = ''
      }
    },
    // 获取设备名称下拉框数据
    getDeviceNameList() {
      const dataInterface = getConfigElement('myEquipment')['view_getPageList']
      const params = {
        limit: 10000,
        page: 1
      }
      this.$httpRequest({
        type: dataInterface.method,
        uri: dataInterface.uri,
        payload: params,
        callback: data => {
          if (data.status === 200) {
            if (data.data.total > 0) {
              this.navFormInfo.fieldList.right.inpLists[0].list = data.data.rows
              this.listTypeInfo.deviceIdList = data.data.rows
            } else {
              this.navFormInfo.fieldList.right.inpLists[0].list = []
              this.listTypeInfo.deviceIdList = []
            }
          }
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
    // 确认
    confirmRow() {

    },
    // 维修
    repairRow() {

    },
    // 完成
    completeRow(id) {
      console.log('完成')
    },
    getTableData() {
      const element = this.pageElement['view_getPageList']
      const params = {
        limit: this.pagination.limit,
        page: this.pagination.pageIndex
      }
      if (this.navFormInfo.data.deviceName) {
        params['deviceName'] = this.navFormInfo.data.deviceName
      }
      if (this.navFormInfo.data.eventName) {
        params['eventName'] = this.navFormInfo.data.eventName
      }
      if (this.navFormInfo.data.timeType) {
        params['timeType'] = this.navFormInfo.data.timeType
      }
      if (this.navFormInfo.data.timeDate) {
        params['startTime'] = this.navFormInfo.data.startTime
        params['endTime'] = this.navFormInfo.data.endTime
      }
      if (this.navFormInfo.data.protocolId) {
        params['protocolId'] = this.navFormInfo.data.protocolId
      }
      this.isLoading = true
      this.$httpRequest({
        type: element.method,
        uri: element.uri,
        payload: params,
        callback: data => {
          this.isLoading = false
          if (data.status === 200) {
            if (data.data.total > 0) {
              this.tableData = data.data.rows
              this.pagination.total = data.data.total
            } else {
              this.tableData = []
              this.pagination.total = 0
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
<style lang="scss" scoped>
.detailContent {
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 10px;
  background:  #0C2A54;
  border-radius: 2px;
  align-items: center;
  .detailItem {
    width: 300px;
    margin: 10px 0;
    color: #CDD8F7;
  }
}
</style>
