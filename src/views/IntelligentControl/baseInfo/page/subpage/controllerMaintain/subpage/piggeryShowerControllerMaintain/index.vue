<template>
  <div class="home deviceInformation piggeryShowerControllerMaintain">
    <!-- 头部导航 -->
    <nav-form ref="navForm" :data="navFormInfo.data" :field-list="navFormInfo.fieldList">
      <span slot="right" :authCode="'piggeryShowerControllerMaintain:export'" @click="exportData()">
        <el-button class="btn-blue">
          <svg-icon icon-class="newExport" />
          导出
        </el-button>
      </span>
    </nav-form>
    <!-- 表格内容 -->

    <tablePage
      ref="tablePage"
      class="pdR10"
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
      <div class="body">
        <general-form
          ref="delog"
          label-width="120px"
          :data="formInfo.data"
          :field-list="formInfo.fieldList"
          :list-type-info="listTypeInfo"
          theme-type="default"
          @handleChange="handleChange"
          @cascaderEvent="cascaderEvent"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <div style="margin:0 auto;">
          <el-button class="btn-border canleButton" @click="dialogFormVisible = false">取 消</el-button>
          <el-button v-if="status==1" class="btn-blue" :loading="buttonLoading" @click="determine">确 定</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 修改 或 查看 -->
    <el-dialog
      :title="title"
      :modal-append-to-body="false"
      :visible.sync="dialogEditFormVisible"
      :close-on-click-modal="false"
      width="550px"
    >
      <div class="body">
        <general-form
          ref="editdelog"
          label-width="80px"
          :data="formInfo1.data"
          :field-list="formInfo1.fieldList"
          :list-type-info="listTypeInfo"
          theme-type="default"
          @handleChange="handleChange"
          @cascaderEvent="cascaderEvent1"
        />
      </div>
      <div slot="footer" class="dialog-footer label73">
        <div style="margin:0 auto;">
          <el-button class="btn-border canleButton" @click="dialogEditFormVisible = false">取 消</el-button>
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
import { derive } from '@/http/api/exportData/export'
import {
  myEvcMcuInfo,
  getRegionAreaFieldRoomTypeUnitV2,
  getRegionAreaFieldRoomTypeTree,
  getUnitsUnderRoomType,
  unreview,
  review,
  listEquipment,
  myEvcMcuInfoAdd,
  myEvcMcuInfoUpdate,
  myEvcMcuInfoDelete,
  getBindInfoByPiggeryDeviceList
} from '@/http/api/baseInfo/piggeryShowerControllerMaintain.js'
import {
  getRegionAreaFieldTree,
  getRootTypeUnitTreeV2
} from '@/http/api/baseInfo/regionAreaField.js'
import { evcJsonh2Tree } from '@/components/tree/evcJsonh2Tree.js'
export default {
  components: {
    tablePage,
    navForm,
    generalForm
  },
  data() {
    return {
      dialogFormVisible: false,
      dialogEditFormVisible: false, // 编辑的显示框
      isLoading: true,
      buttonLoading: false,
      pageElement: [], // 权限数组
      title: '查看',
      status: 0, // 0=>查看 1=>xinzeng  2=>修改
      downlist: [],
      selection: [],
      row: {}, // 当前选中行的数据
      auditarr: [], // 已审核数组
      unAuditarr: [], // 未审核数组
      navFormInfo: {
        data: {
          area: [],
          roomtypeUnit: [],
          status: '', // *模板名称
          deviceId: '',
          mac: '',
          channel: ''
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
                  this.formInfo.data.area = []
                  this.formInfo.fieldList.map(item => {
                    item['disabled'] = false
                  })
                  this.dialogFormVisible = true
                }
              },
              {
                type: 'button',
                innerText: '审核',
                authCode: 'piggeryShowerControllerMaintain:review',
                className: 'btn-blue-disabled',
                isDisabled: true,
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
                  this.setReview(this.unAuditarr)
                }
              },
              {
                type: 'button',
                innerText: '反审核',
                authCode: 'piggeryShowerControllerMaintain:unreview',
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
                className: 'shadow',
                width: '200px',
                placeholder: '大区 / 区域 / 场区',
                clearable: true,
                valueKey: 0,
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
                checkStrictly: true,
                customLabel: 'title',
                className: 'shadow',
                width: '200px',
                placeholder: '猪舍类型 / 单元',
                clearable: true,
                valueKey: 1,
                options: []
              },
              {
                key: 'channel',
                type: 'select',
                label: '',
                props: {
                  label: 'value',
                  value: 'value'
                },
                className: 'shadow',
                placeholder: '通道号',
                clearable: true,
                list: [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }]
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
                  this.pagination.pageIndex = 1
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
          label: '大区',
          width: '120'
        },
        {
          prop: 'areaName',
          label: '区域',
          width: '120'
        },
        {
          longData: true,
          prop: 'fieldName',
          label: '场区',
          width: '120'
        },
        {
          prop: 'roomTypeName',
          label: '猪舍类型',
          width: '120'
        },
        {
          prop: 'segmentName',
          label: '工段',
          width: '120'
        },
        {
          prop: 'unitName',
          label: '单元',
          width: '90'
        },
        {
          prop: 'channel',
          label: '通道号',
          width: '90'
        },
        {
          longData: true,
          prop: 'deviceId',
          label: '设备标识',
          width: '220'
        },
        {
          longData: true,
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
            AUDITED: '已审核',
            INIT: '初始化'
          }
        },
        {
          prop: 'statusOnline',
          label: '在线状态',
          width: '80',
          rule: {
            0: '离线',
            1: '在线'
          }
        },
        {
          prop: 'updName',
          label: '修改人',
          width: '80'
        },
        {
          prop: 'updTime',
          label: '修改日期',
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
              authCode: '',
              size: 'auto',
              click: 'see',
              status: 'AUDITED'
            },
            {
              name: '修改',
              class: 'btn-blue',
              authCode: 'piggeryShowerControllerMaintain:update',
              size: 'auto',
              click: 'edit',
              status: 'NORMAL'
            },
            {
              name: '删除',
              class: 'btn-red',
              authCode: 'piggeryShowerControllerMaintain:delete',
              size: 'auto',
              click: 'remove',
              status: 'NORMAL'
            },
            {
              name: '修改',
              class: 'btn-blue',
              authCode: 'piggeryShowerControllerMaintain:update',
              size: 'auto',
              click: 'edit',
              status: 'INIT'
            },
            {
              name: '删除',
              class: 'btn-red',
              authCode: 'piggeryShowerControllerMaintain:delete',
              size: 'auto',
              click: 'remove',
              status: 'INIT'
            }
          ]
        }
      ],
      // 表单对应列表
      listTypeInfo: {
        typeList: [],
        unitList: [], // 新增时 对应的部署单元 可能为[]
        channelList: [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }]
      },
      // 新增表单相关
      formInfo: {
        data: {
          area: [], // *部署位置
          deviceId: '', // 设备编码
          unit1: '',
          unit2: '',
          unit3: '',
          unit4: ''
        },
        fieldList: [
          {
            label: '设备条码',
            key: 'deviceId',
            type: 'select',
            className: 'shadow',
            filterable: true,
            props: {
              label: 'device_id',
              value: 'device_id'
            },
            valueKey: 'device_id',
            list: 'typeList',
            required: true,
            rules: [{ required: true, message: '请选择设备条码', trigger: 'change' }],
            handleChange: (data) => {
              // console.log(data)
              this.deviceobj = data
              const o = { deviceId: this.formInfo.data.deviceId }
              console.log(o)
              getBindInfoByPiggeryDeviceList(o).then(res => {
                if (res.status === 200 && res.rel && res.data.length > 0) {
                  const arr = res.data.slice(0)
                  this.listTypeInfo.unitList = res.data.slice(0)
                  const ids = [arr[0].regionId, arr[0].areaId, arr[0].fieldId, arr[0].roomTypeId]
                  console.log('ids---', ids)
                  const areaIds = this.formInfo.data.area
                  console.log('areaIds---', areaIds)
                  if (areaIds.length) { // 这里 处理一下area值和下面级联框一致的情况，不处理会清空area了 NO-WHY
                    const flag = areaIds.every(a => {
                      return ids.includes(a)
                    })
                    console.log('flag---', flag)
                    if (!flag) { // 不yizhi--付下值；一致就不付了
                      this.formInfo.data.area = ids
                    }
                    // else {
                    //   this.formInfo.data.area = ids // 这里也付个值----
                    // }
                  } else {
                    this.formInfo.data.area = ids
                    this.namesList = [arr[0].regionName, arr[0].areaName, arr[0].fieldName, arr[0].roomTypeName]
                  }
                  const params = {
                    regionId: arr[0].regionId,
                    areaId: arr[0].areaId,
                    fieldId: arr[0].fieldId,
                    roomTypeId: arr[0].roomTypeId
                  }
                  getUnitsUnderRoomType(params).then(res => { // 获取该猪舍类型下 所有单元
                    if (res.status === 200 && res.rel) {
                      this.listTypeInfo.unitList = res.data // 这里先付列表值 再付单元值
                      this.formInfo.data.unit1 = '' // 这里先清一下
                      this.formInfo.data.unit2 = ''
                      this.formInfo.data.unit3 = ''
                      this.formInfo.data.unit4 = ''
                      arr.forEach(item => {
                        if (item.channel === 1) {
                          this.formInfo.data.unit1 = item.unitName
                        }
                        if (item.channel === 2) {
                          this.formInfo.data.unit2 = item.unitName
                        }
                        if (item.channel === 3) {
                          this.formInfo.data.unit3 = item.unitName
                        }
                        if (item.channel === 4) {
                          this.formInfo.data.unit4 = item.unitName
                        }
                      })
                      console.log('返this.listTypeInfo.unitList回', res.data)
                    }
                  })
                } else {
                  this.formInfo.data.area = []
                  this.formInfo.data.unit1 = ''
                  this.formInfo.data.unit2 = ''
                  this.formInfo.data.unit3 = ''
                  this.formInfo.data.unit4 = ''
                }
              })
            }
          },
          {
            label: '猪舍类型',
            key: 'area',
            type: 'cascader',
            className: 'shadow',
            customNode: 'title',
            customLabel: 'title',
            customValue: '',
            placeholder: '大区 / 区域 / 场区 / 猪舍类型',
            clearable: true,
            required: true,
            rules: [
              { required: true, message: '请选择猪舍类型', trigger: 'change' }
            ],
            options: []
          },
          {
            label: '通道号1部署单元',
            key: 'unit1',
            type: 'select',
            className: 'shadow',
            filterable: true,
            clearable: true,
            placeholder: '请选择单元',
            props: {
              label: 'unit', // unit
              value: 'unit' // id
            },
            valueKey: 'unit',
            list: 'unitList',
            rules: [
              {
                validator: (rule, value, callback) => {
                  console.log('value---', value)
                  if (value) { // 有值
                    const list = this.listTypeInfo.unitList
                    const flag = list.findIndex(item => item.unit === value)
                    if (flag < 0) callback('该单元已无效!')
                    else callback()
                  } else {
                    callback()
                  }
                },
                trigger: ['blur', 'change']
              }
            ],
            handleChange: (data) => {
              this.unit1Obj = data
            }
          },
          {
            label: '通道号2部署单元',
            key: 'unit2',
            type: 'select',
            className: 'shadow',
            filterable: true,
            clearable: true,
            placeholder: '请选择单元',
            props: {
              label: 'unit',
              value: 'unit'
            },
            valueKey: 'unit',
            list: 'unitList',
            rules: [
              {
                validator: (rule, value, callback) => {
                  console.log('value---', value)
                  if (value) { // 有值
                    const list = this.listTypeInfo.unitList
                    const flag = list.findIndex(item => item.unit === value)
                    if (flag < 0) callback('该单元已无效!')
                    else callback()
                  } else {
                    callback()
                  }
                },
                trigger: ['blur', 'change']
              }
            ],
            handleChange: (data) => {
              this.unit2Obj = data
            }
          },
          {
            label: '通道号3部署单元',
            key: 'unit3',
            type: 'select',
            className: 'shadow',
            filterable: true,
            clearable: true,
            placeholder: '请选择单元',
            props: {
              label: 'unit',
              value: 'unit'
            },
            valueKey: 'unit',
            list: 'unitList',
            rules: [
              {
                validator: (rule, value, callback) => {
                  if (value) { // 有值
                    const list = this.listTypeInfo.unitList
                    const flag = list.findIndex(item => item.unit === value)
                    if (flag < 0) callback('该单元已无效!')
                    else callback()
                  } else {
                    callback()
                  }
                },
                trigger: ['blur', 'change']
              }
            ],
            handleChange: (data) => {
              this.unit3Obj = data
            }
          },
          {
            label: '通道号4部署单元',
            key: 'unit4',
            type: 'select',
            className: 'shadow',
            filterable: true,
            clearable: true,
            placeholder: '请选择单元',
            props: {
              label: 'unit',
              value: 'unit'
            },
            list: 'unitList',
            rules: [
              {
                validator: (rule, value, callback) => {
                  if (value) { // 有值
                    const list = this.listTypeInfo.unitList
                    const flag = list.findIndex(item => item.unit === value)
                    if (flag < 0) callback('该单元已无效!')
                    else callback()
                  } else {
                    callback()
                  }
                },
                trigger: ['blur', 'change']
              }
            ],
            handleChange: (data) => {
              this.unit4Obj = data
            }
          }
        ]
      },
      // 编辑表单相关
      formInfo1: {
        data: {
          area: [], // *部署位置
          deviceId: '', // 设备编码
          channel: '' // 通道号
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
            key: 'deviceId',
            type: 'select',
            className: 'shadow',
            filterable: true,
            props: {
              label: 'device_id',
              value: 'device_id'
            },
            valueKey: 'device_id',
            list: 'typeList',
            required: true,
            rules: [{ required: true, message: '请选择设备条码', trigger: 'change' }],
            handleChange: (data) => {
              this.deviceEditObj = data
            }
          },
          {
            label: '通道号',
            key: 'channel',
            type: 'select',
            className: 'shadow',
            filterable: true,
            placeholder: '请选择通道号',
            props: {
              label: 'value',
              value: 'value'
            },
            list: 'channelList',
            required: true,
            rules: [{ required: true, message: '请选择通道号', trigger: 'change' }],
            handleChange: (data) => {
              console.log(data)
            }
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
      },
      namesList: [], // 级联的namesList
      deviceobj: {}, // 选择的设备的对象
      unit1Obj: {},
      unit2Obj: {},
      unit3Obj: {},
      unit4Obj: {},
      deviceEditObj: {}, // 编辑时---选择的设备对象
      segmentObj: {} // 编辑时这里 会有 工段 floor
    }
  },
  watch: {
    'navFormInfo.data.area': {
      handler: function(n) {
        if (n.length === 0) {
          this.navFormInfo.fieldList.right.inpLists[0].valueKey++ // 只要监听到数据源发生变化 ，改变keyValue的值，达到重新渲染的效果
          this.navFormInfo.fieldList.right.inpLists[1].valueKey++
        }
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
        this.formInfo.data = {
          area: [], // *部署位置
          deviceId: '', // 设备编码
          unit1: '',
          unit2: '',
          unit3: '',
          unit4: ''
        }
        this.namesList = [] // 级联的namesList
        this.deviceobj = {} // 选择的设备的对象
        this.unit1Obj = {}
        this.unit2Obj = {}
        this.unit3Obj = {}
        this.unit4Obj = {}
        this.$refs['delog'].resetFields() // 手动清楚一下新增 提示语
      }
    },
    dialogEditFormVisible(val) {
      if (!val) {
        this.formInfo1.data = {
          area: [], // *部署位置
          deviceId: '', // 设备编码
          channel: '' // 通道号
        }
        this.deviceEditObj = {} // 编辑时---选择的设备对象
        this.segmentObj = {} // 编辑时这里 会有 工段 floor
        this.$refs['editdelog'].resetFields() // 手动修改/查看清楚一下提示语
      }
    },
    // 这里侦听审核 反审核 下发配置的dis状态
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
  created() {
    this.getTree()
    this.getMyEvcMcuInfo()
  },
  mounted() {
    this.getListEquipment()
  },
  methods: {
    exportData() { // 导出
      const element = this.$getConfigElement('piggeryShowerControllerMaintain')['export']
      const url = element ? element.uri : ''
      const { status, deviceId, mac, roomtypeUnit, area } = this.navFormInfo.data
      const { limit, pageIndex } = this.pagination
      const params = {
        regionId: area[0] ?? '',
        areaId: area[1] ?? '',
        fieldId: area[2] ?? '',
        roomTypeId: roomtypeUnit[0] ?? '',
        unitId: roomtypeUnit[1] ?? '',
        deviceId,
        limit,
        mac,
        page: pageIndex,
        status
      }
      derive('/api' + url, params)
    },
    cascaderEvent(val, val1, val2) {
      console.log('arguments---', arguments)
      this.namesList = val1
      console.log('区域切换---')
      this.formInfo.data.unit1 = ''
      this.formInfo.data.unit2 = ''
      this.formInfo.data.unit3 = ''
      this.formInfo.data.unit4 = ''
      const { area } = this.formInfo.data
      if (area.length === 0) return
      const params = {
        regionId: area[0],
        areaId: area[1],
        fieldId: area[2],
        roomTypeId: area[3]
      }
      getUnitsUnderRoomType(params).then(res => { // 获取该猪舍类型下 所有单元
        if (res.status === 200 && res.rel) {
          this.listTypeInfo.unitList = res.data
        }
      })
    },
    cascaderEvent1(val, val1, val2) {
      console.log('arguments---', arguments)
      this.namesList = val1
      this.segmentObj = val2[4].data
    },
    // 获取设备条码接口
    getListEquipment() {
      listEquipment({}).then((data) => {
        this.listTypeInfo.typeList = data.data.rows
      })
    },
    // 新增修改接口
    setmyEvcMcuInfoAdd() {
      if (this.status === 1) { // 新增
        if (!this.$refs['delog'].validateSelf()) {
          return false
        }
        const arr = []
        const { area, deviceId, unit1, unit2, unit3, unit4 } = this.formInfo.data
        const { namesList, deviceobj, unit1Obj, unit2Obj, unit3Obj, unit4Obj } = this
        const { unitList } = this.listTypeInfo
        let u1, u2, u3, u4
        if (unit1 && (!unit1Obj || !unit1Obj.unit)) {
          console.log('unitList---', unitList)
          console.log('unit1---', unit1)
          u1 = unitList.find(item => item.unit === unit1)
          console.log('u1---', u1)
        }
        if (unit2 && (!unit2Obj || !unit2Obj.unit)) {
          u2 = unitList.find(item => item.unit === unit2)
        }
        if (unit3 && (!unit3Obj || !unit3Obj.unit)) {
          u3 = unitList.find(item => item.unit === unit3)
        }
        if (unit4 && (!unit4Obj || !unit4Obj.unit)) {
          u4 = unitList.find(item => item.unit === unit4)
        }
        const { qr_code, id, equiptype_id, equiptype_name, device_name, device_version_id, version_name } = deviceobj
        for (let item = 1; item < 5; item++) { // 遍历赋值
          ((item) => {
            const o = {
              regionId: area[0],
              areaId: area[1],
              fieldId: area[2],
              roomTypeId: area[3],
              regionName: namesList[0],
              areaName: namesList[1],
              fieldName: namesList[2],
              roomTypeName: namesList[3],
              deviceId,
              qrCode: qr_code,
              equipmentId: id,
              equiptypeId: equiptype_id,
              equiptypeName: equiptype_name,
              deviceName: device_name,
              deviceVersionId: device_version_id,
              deviceVersionName: version_name
            }
            if (item === 1 && ((unit1Obj && unit1Obj.unit) || u1)) {
              console.log('遍历赋值1----', item)
              let tempObj
              if (unit1Obj && unit1Obj.unit) {
                tempObj = unit1Obj
              } else {
                tempObj = u1
              }
              const { segmentId, segmentName, block, floor, id, unit } = tempObj
              o.segmentId = segmentId
              o.segmentName = segmentName
              o.block = block
              o.floor = floor
              o.channel = 1
              o.unitId = id
              o.unitName = unit
              arr.push(o)
            }
            if (item === 2 && ((unit2Obj && unit2Obj.unit) || u2)) {
              let tempObj
              if (unit2Obj && unit2Obj.unit) {
                tempObj = unit2Obj
              } else {
                tempObj = u2
              }
              const { segmentId, segmentName, block, floor, id, unit } = tempObj
              o.segmentId = segmentId
              o.segmentName = segmentName
              o.block = block
              o.floor = floor
              o.channel = 2
              o.unitId = id
              o.unitName = unit
              arr.push(o)
            }
            if (item === 3 && ((unit3Obj && unit3Obj.unit) || u3)) {
              let tempObj
              if (unit3Obj && unit3Obj.unit) {
                tempObj = unit3Obj
              } else {
                tempObj = u3
              }
              const { segmentId, segmentName, block, floor, id, unit } = tempObj
              o.segmentId = segmentId
              o.segmentName = segmentName
              o.block = block
              o.floor = floor
              o.channel = 3
              o.unitId = id
              o.unitName = unit
              arr.push(o)
            }
            if (item === 4 && ((unit4Obj && unit4Obj.unit) || u4)) {
              let tempObj
              if (unit4Obj && unit4Obj.unit) {
                tempObj = unit4Obj
              } else {
                tempObj = u4
              }
              const { segmentId, segmentName, block, floor, id, unit } = tempObj
              o.segmentId = segmentId
              o.segmentName = segmentName
              o.block = block
              o.floor = floor
              o.channel = 4
              o.unitId = id
              o.unitName = unit
              arr.push(o)
            }
          })(item)
        }
        if (arr.length === 0) { // 没有至少装一个
          this.$message.warning('请至少选择一个通道号和部署位置！')
          return false
        }
        this.buttonLoading = true
        myEvcMcuInfoAdd(arr).then(res => {
          this.buttonLoading = false
          if (res.status === 200 && res.rel) {
            this.dialogFormVisible = false
            this.getMyEvcMcuInfo()
            this.$message.success('新增成功')
          } else if (res.status === 200 && !res.rel) {
            this.$message.error(res.message || '新增失败')
          }
        }).catch(() => {
          this.buttonLoading = false
        })
      } else { // 修改
        if (!this.$refs['editdelog'].validateSelf()) {
          return false
        }
        const { area, channel, deviceId } = this.formInfo1.data
        const { namesList, deviceEditObj, row, segmentObj } = this
        // const { segmentId, segmentName } = segmentObj
        // const { id, device_name, version_name, STATUS, equiptype_id, equiptype_name, description } = deviceEditObj
        const { floor, segmentId, segmentName } = segmentObj
        const { id, block, description, device_name, device_version_id, version_name, equiptype_id, equiptype_name, qr_code, mac, status_online, lock_param, device_type, STATUS } = deviceEditObj
        const params = {
          regionId: area[0],
          regionName: namesList[0] || row.regionName,
          areaId: area[1],
          areaName: namesList[1] || row.areaName,
          fieldId: area[2],
          fieldName: namesList[2] || row.fieldName,
          segmentId: segmentId || row.segmentId,
          segmentName: segmentName || row.segmentName,
          unitId: area[4],
          unitName: namesList[4] || row.unitName,
          channel,
          deviceName: device_name || row.deviceName,
          deviceId,
          deviceVersionName: version_name || row.deviceVersionName,
          equipmentId: id || row.equipmentId, // ---
          equiptypeId: equiptype_id || row.equiptypeId,
          equiptypeName: equiptype_name || row.equiptypeName,
          id: row.id,
          status: STATUS || row.status,
          description: description || row.description,
          roomTypeId: area[3],
          roomTypeName: namesList[3] || row.roomTypeName,
          block: block || row.block,
          // crtHost: crt_host || row.crtHost, // 这些不用穿 lcz确认过
          // crtName: crt_name || row.crtName,
          // crtTime: crt_time || row.crtTime,
          // crtUser: crt_user || row.crtUser,
          deviceType: device_type || row.deviceType, // ---
          deviceVersionId: device_version_id || row.deviceVersionId,
          floor: floor || row.floor,
          lockParam: lock_param || row.lockParam, // ---
          mac: mac || row.mac,
          qrCode: qr_code || row.qrCode,
          statusOnline: status_online || row.statusOnline
          // updHost: updHost || row.updHost,
          // updName: updName || row.updName,
          // updTime: updTime || row.updTime,
          // updUser: updUser || row.updUser
        }
        this.buttonLoading = true
        myEvcMcuInfoUpdate(params).then(data => {
          this.buttonLoading = false
          if (data.status === 200) {
            this.getMyEvcMcuInfo()
            this.$message.success('修改成功')
            this.dialogEditFormVisible = false
          } else {
            this.$message.error(data.message || '修改失败')
          }
        }).catch(() => {
          this.buttonLoading = false
        })
      }
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
        review({
          ids: ids
        }).then((data) => {
          if (data.status === 200 && data.rel) {
            this.$message({
              message: '审核成功',
              type: 'success'
            })
            this.selection = []
            this.unAuditarr = []
            this.auditarr = []
            this.getMyEvcMcuInfo()
          } else if (data.status === 200 && !data.rel) {
            this.$message.error('审核失败')
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
        unreview({
          ids: ids
        }).then((data) => {
          if (data.status === 200 && data.rel) {
            this.$message({
              message: '反审核成功',
              type: 'success'
            })
            this.selection = []
            this.unAuditarr = []
            this.auditarr = []
            this.getMyEvcMcuInfo()
          } else if (data.status === 200 && !data.rel) {
            this.$message.error('审核失败')
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
      this.formInfo1.data.area = [row.regionId, row.areaId, row.fieldId, row.roomTypeId, row.unitId]
      this.formInfo1.data.deviceId = row.deviceId
      this.formInfo1.data.channel = row.channel
      this.formInfo1.fieldList.map(item => {
        item['disabled'] = true
      })
      this.status = 0
      this.dialogEditFormVisible = true
    },
    // 删除
    removeRow(row, index) {
      myEvcMcuInfoDelete({
        ids: row.id
      }).then(data => {
        if (data.status === 200 && data.rel) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getMyEvcMcuInfo()
        } else if (data.status === 200 && data.rel) {
          this.$message.error('删除失败')
        }
      })
    },
    // 修改
    editRow(row, index) {
      this.formInfo1.data.area = [row.regionId, row.areaId, row.fieldId, row.roomTypeId, row.unitId]
      this.formInfo1.data.deviceId = row.deviceId
      this.formInfo1.data.channel = row.channel
      this.formInfo1.fieldList.map(item => {
        item['disabled'] = false
      })
      this.status = 2
      this.dialogEditFormVisible = true
      this.row = row
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
    // 点击了delog中的数据按钮
    determine() {
      this.setmyEvcMcuInfoAdd()
    },
    // 获取表数据方法
    fetchTableData() {
      // alert('触发请求表数据')
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
      getRegionAreaFieldRoomTypeUnitV2({}).then((data) => {
        const arr = evcJsonh2Tree(data.data)
        this.formInfo1.fieldList[0].options = arr
      })
      getRegionAreaFieldRoomTypeTree({}).then((data) => {
        this.formInfo.fieldList[1].options = data.data
      })
    },
    // 获取表单信息
    getMyEvcMcuInfo() {
      const { area, status, deviceId, channel, mac, roomtypeUnit } = this.navFormInfo.data
      console.log(roomtypeUnit)
      const o = {
        regionId: area[0],
        areaId: area[1],
        block: null,
        channel,
        deviceId,
        fieldId: area[2],
        limit: this.pagination.limit,
        mac,
        page: this.pagination.pageIndex,
        roomTypeId: roomtypeUnit[0],
        segmentId: '',
        status: status,
        unitId: roomtypeUnit[1]
      }
      this.isLoading = true
      myEvcMcuInfo(o).then((data) => {
        this.isLoading = false
        if (data.status === 200) {
          this.tableData = data.data.rows
          this.total = data.data.total
          this.pagination.total = data.data.total
          this.$refs['tablePage'].$children[0].clearSelection()
        } else {
          console.error(data.message)
        }
      }).catch(() => { this.isLoading = false })
    }
  }
}
</script>
<style lang="scss">
// .deviceInformation {
//   .el-dialog__body {
//     padding: 10px;
//   }
//   .canleButton{
//     padding: 11px 20px;
//   }
//   .el-dialog__header{
//     padding: 7px 20px 10px;
//   }
// }
// .pdR10{
//   // padding-right: 10px;
// }
// .label73{
//   .el-form-item__label{
//     width: 73px !important;
//   }
//   .el-form-item__content{
//     margin-left: 75px !important;
//   }
// }
// .piggeryShowerControllerMaintain{
//   .itable-empty-box-wrap{
//     position: relative;
//     right: 150px;
//   }
// }
</style>
