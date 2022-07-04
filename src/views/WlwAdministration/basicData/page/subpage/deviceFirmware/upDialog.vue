<!-- 设备固件管理 升级弹框 -->
<template>
  <!-- 升级 dialog -->
  <div class="up-dialog">
    <el-dialog
      title="固件升级"
      :modal-append-to-body="false"
      :visible.sync="cumDialogFormVisible1"
      :close-on-click-modal="false"
      width="700px"
      @close="closeUp"
    >
      <div class="body">
        <p class="instruction">
          本次批量升级共<span>{{ deviceCount }}</span>个设备
        </p>
        <general-form
          ref="delog1"
          label-width="200px"
          :data="formInfo.data"
          :field-list="formInfo.fieldList"
          :list-type-info="listTypeInfo"
          theme-type="default"
          @cascaderEvent="cascaderEvent"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <div style="margin:0 auto;">
          <el-button class="btn-border foot-close" @click="closeUp">取 消</el-button>
          <el-popconfirm
            title="确认升级吗"
            @onConfirm="determine"
          >
            <el-button slot="reference" class="btn-blue" type="primary">确 定</el-button>
          </el-popconfirm>
        </div>
      </div>
    </el-dialog>
    <up-up-dialog
      ref="upUpDialog"
      :dialog-form-visible2="dialogFormVisible2"
      :row="row"
      :selection-table-data="selection"
      :device-ids-list="formInfo.data.upgradedVersions"
      :upgraded-versions-list="upgradedVersionsList"
      :room-type-list="roomTypeList"
      @closeUpUp="closeUpUp"
      @doDeviceIds="doDeviceIds"
    />
  </div>
</template>
<script>
const dynamicList = [
  {
    isDyn: true,
    key: 'area',
    label: '指定区域',
    type: 'cascader',
    checkStrictly: true,
    customLabel: 'regionName',
    customValue: 'regionNum',
    className: 'shadow',
    placeholder: '请选择大区 / 区域 / 场区',
    options: [],
    required: true,
    rules: [{ required: true, message: '请选择大区 / 区域 / 场区', trigger: 'blur' }]
  },
  {
    isDyn: true,
    key: 'roomTypeId',
    label: '猪舍类型',
    type: 'select',
    filterable: true, // 可搜索
    list: 'roomTypeList',
    className: 'shadow',
    handleChange: (data) => {
      // this.roomType = data
    },
    valueKey: 'code',
    props: {
      label: 'title',
      value: 'code'
    }
  },
  {
    isDyn: true,
    key: 'deviceIds',
    type: 'select',
    label: '设备范围',
    multiple: true,
    remote: true, // 为了掩藏 下拉框
    className: 'shadow',
    list: [],
    required: true,
    disabled: false,
    rules: [{ required: true, message: '请选择设备范围', trigger: 'blur' }],
    clickEvent: () => {}
  }
]
const strategyList = [
  { name: '静态升级', val: 'STATIC' },
  { name: '动态升级', val: 'DYNAMIC' }
]
const upgradeTimeTypeList = [
  { name: '立即升级', val: 'INSTANT' }
  // ,
  // { name: '定时升级', val: 'SCHEDULED' }
]
import generalForm from '@/components/commonComponent/generalForm'
import { wlwJsonh2Tree } from '@/components/tree/evcJsonh2Tree.js'
import { getConfigElement } from '@/utils/overtService'
const pageElement = getConfigElement('my_equipment_firmware_version')
const commonElement = getConfigElement('wlwDataInterface')
import upUpDialog from './upUpDialog'
export default {
  components: {
    // navForm,
    // tablePage,
    upUpDialog,
    generalForm
  },
  props: {
    dialogFormVisible1: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  // inject: ['rows'],
  data() {
    return {
      cumDialogFormVisible1: false,
      // row: this.rows,
      dialogFormVisible2: false, // 请选择设备 dialog弹框 显隐
      scopeList: [
        { name: '定向升级', val: 'DIRECT' },
        { name: '区域升级', val: 'AREA' },
        { name: '全部设备', val: 'ALL' }
      ],
      roomTypeList: [],
      upgradedVersionsList: [],
      selection: [], // upUpdialog 传过来的 选那种数组
      formInfo: { // 升级 dialog框内容
        data: {
          upgradedVersions: [],
          strategy: 'STATIC',
          scope: 'DIRECT',
          area: [],
          roomTypeId: '',
          deviceIds: [],
          upgradeTimeType: 'INSTANT',
          timeOut: '10'
        },
        fieldList: [
          {
            key: 'upgradedVersions',
            label: '待升级版本号',
            required: true,
            type: 'select',
            filterable: true, // 可搜索
            list: 'upgradedVersionsList',
            className: 'shadow',
            multiple: true,
            handleChange: (data) => {
              this.getUpToatlNum()
            },
            valueKey: 'value',
            props: {
              label: 'value',
              value: 'value'
            },
            rules: [{ required: true, message: '请选择待升级版本号', trigger: 'blur' }]
          },
          {
            key: 'strategy',
            label: '升级策略',
            required: true,
            type: 'select',
            filterable: true, // 可搜索
            list: 'strategyList',
            className: 'shadow',
            handleChange: (data) => {
              const arr = [
                { name: '全部设备', val: 'ALL' },
                { name: '区域升级', val: 'AREA' },
                { name: '定向升级', val: 'DIRECT' }
              ]
              if (data.val === 'DYNAMIC') { // 动态升级
                this.formInfo.data.scope = 'ALL' // 动态升级 的升级范围 只有全部设备
                this.scopeList = [arr[0]]
                this.formInfo.data.roomTypeId = ''
                this.formInfo.data.area = []
                this.formInfo.data.deviceIds = []
                const list = this.formInfo.fieldList.filter(item => !item.isDyn)
                this.formInfo.fieldList = list
                this.formInfo.fieldList.splice(3, 0, dynamicList[1])
              } else {
                this.scopeList = arr
              }
              this.getUpToatlNum()
            },
            valueKey: 'val',
            props: {
              label: 'name',
              value: 'val'
            },
            rules: [{ required: true, message: '请选择升级策略', trigger: 'blur' }]
          },
          {
            key: 'scope',
            label: '升级范围',
            required: true,
            type: 'select',
            filterable: true, // 可搜索
            list: 'scopeList',
            className: 'shadow',
            handleChange: (data) => {
              console.log('scope_obj---', data)
              this.formInfo.data.roomTypeId = ''
              this.formInfo.data.area = []
              this.formInfo.data.deviceIds = []
              const list = this.formInfo.fieldList.filter(item => !item.isDyn)
              this.formInfo.fieldList = list
              const { val } = data
              if (val === 'ALL') { // 全部升级
                this.formInfo.fieldList.splice(3, 0, dynamicList[1])
              } else if (val === 'AREA') { // 区域升级
                this.formInfo.fieldList.splice(3, 0, dynamicList[0], dynamicList[1])
              } else if (val === 'DIRECT') { // 定向升级
                this.formInfo.fieldList.splice(3, 0, dynamicList[2])
              }
            },
            valueKey: 'val',
            props: {
              label: 'name',
              value: 'val'
            },
            rules: [{ required: true, message: '请选择升级范围', trigger: 'blur' }]
          },
          {
            key: 'upgradeTimeType',
            label: '升级时间',
            type: 'select',
            filterable: true, // 可搜索
            list: 'upgradeTimeTypeList',
            className: 'shadow',
            handleChange: (data) => {
            },
            valueKey: 'val',
            props: {
              label: 'name',
              value: 'val'
            },
            required: true,
            rules: [{ required: true, message: '请选择升级时间', trigger: 'blur' }]
          },
          {
            key: 'timeOut',
            type: 'inputNumber',
            controlsPositionRight: 'right',
            min: 1,
            max: 1440,
            label: '设备升级超时时间(1~1440分钟)',
            className: 'shadow',
            required: true,
            disabled: false,
            rules: [{ required: true, message: '请输入设备升级超时时间', trigger: 'blur' }]
          }
        ]
      },
      deviceCount: 0, // 本次批量升级 设备个数
      roomType: {}, //
      areaNameList: [] // 区域名称 数组
    }
  },
  computed: {
    listTypeInfo() {
      return {
        upgradedVersionsList: this.upgradedVersionsList,
        strategyList,
        scopeList: this.scopeList,
        roomTypeList: this.roomTypeList,
        upgradeTimeTypeList
      }
    }
  },
  watch: {
    dialogFormVisible1: {
      handler(val) {
        this.cumDialogFormVisible1 = val
        if (val) {
          console.log('watch----')
          this.init()
          this.formInfo.fieldList.splice(3, 0, dynamicList[2])
          this.deviceCount = 0
        } else {
          this.$refs['delog1'].resetFields()
          this.formInfo.data = {
            upgradedVersions: [],
            strategy: 'STATIC',
            scope: 'DIRECT',
            area: [],
            roomTypeId: '',
            deviceIds: [],
            upgradeTimeType: 'INSTANT',
            timeOut: '10'
          }
          const list = this.formInfo.fieldList.filter(item => !item.isDyn)
          this.formInfo.fieldList = list
        }
      },
      deep: true
    },
    'formInfo.data.deviceIds': {
      handler(n) {
        this.deviceCount = n.length
      },
      deep: true
    }
  },
  created() {
  },
  methods: {
    init() {
      this.getUpgradedVersionsList()
      this.getRoomTypeList()
      this.getTree()
      this.getAuthV2Tree()
      dynamicList[1].handleChange = (data) => {
        this.roomType = data
      }
      this.clickEvent()
    },
    clickEvent() { // 设备范围 赋点击事件
      // console.log('eventClick')
      dynamicList[2].clickEvent = () => {
        const { deviceIds } = this.formInfo.data
        if (deviceIds.length === 0) {
          this.selection = []
        } else {
          this.selection = this.selection.filter(item => deviceIds.indexOf(item.deviceId) > -1)
        }
        this.dialogFormVisible2 = true
      }
    },
    getAuthV2Tree() { // 获取UpUp里的区域树
      const element = commonElement['getTreeForDataAuthV2']
      const params = {}
      this.$httpRequest({
        type: element && element.method,
        uri: element && element.uri,
        payload: params,
        callback: res => {
          if (res.status === 200 && res.rel) {
            this.$refs.upUpDialog.navFormInfo.fieldList.right.inpLists[0].options = wlwJsonh2Tree(res.data)
          } else {
            // this.$message.error(res.message)
          }
        }
      })
    },
    getTree() { // 获取区域树
      const element = commonElement['treeForSelectV1']
      const params = {}
      this.$httpRequest({
        type: element && element.method,
        uri: element && element.uri,
        payload: params,
        callback: res => {
          if (res.status === 200 && res.rel) {
            dynamicList[0].options = res.data
            console.log('dynamicList[0]', dynamicList[0])
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    getRoomTypeList() { // 获取猪舍类型列表
      const element = commonElement['getRoomTypes']
      const params = {}
      this.$httpRequest({
        type: element && element.method,
        uri: element && element.uri,
        payload: params,
        callback: res => {
          if (res.status === 200) {
            this.roomTypeList = res.data
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    getUpgradedVersionsList() { // 待升级版本号 列表
      const element = pageElement['getFirmwareVersionsForUpgrade']
      const { device_version_id, equiptype_id } = this.row
      const params = {
        deviceVersionId: device_version_id,
        equipTypeId: equiptype_id
      }
      this.$httpRequest({
        type: element && element.method,
        uri: element && element.uri,
        payload: params,
        callback: res => {
          if (res.status === 200) {
            this.upgradedVersionsList = res.data.map(item => {
              return {
                value: item
              }
            })
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    getUpToatlNum() {
      const { upgradedVersions, strategy, area, scope, deviceIds } = this.formInfo.data
      // 如果是 定向升级  ------则不走接口了
      if (scope === 'DIRECT') {
        this.deviceCount = deviceIds.length
        return false
      }
      const ids = upgradedVersions.join(',')
      const element = pageElement['getUpgradeTotalNum']
      const { device_version_id, equiptype_id } = this.row
      const params = {
        areaId: area[1] || '',
        deviceVersionId: device_version_id,
        equipTypeId: equiptype_id,
        fieldId: area[2] || '',
        regionId: area[0] || '',
        strategy,
        upgradedVersions: ids
      }
      this.$httpRequest({
        type: element && element.method,
        uri: element && element.uri,
        payload: params,
        callback: res => {
          if (res.status === 200 && res.rel) {
            this.deviceCount = res.data
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    determine() { // 确定升级
      console.log(1234567)
      if (!this.$refs['delog1'].validateSelf()) {
        return false
      }
      const element = pageElement['addOTATask']
      const { roomType, areaNameList } = this
      const { area, strategy, upgradedVersions, scope, roomTypeId, deviceIds, upgradeTimeType, timeOut } = this.formInfo.data
      const { device_version_id, device_version_name, equiptype_id, equiptype_name, firmware_version } = this.row
      const params = {
        areaId: area[1] || '',
        areaName: areaNameList[1] || '',
        batchType: 'BATCH', // 任务类型：VERIFICATION-验证升级，BATCH-批量升级
        deviceIds: deviceIds.join(',') || '',
        deviceVersionId: device_version_id,
        deviceVersionName: device_version_name,
        equipTypeId: equiptype_id,
        equipTypeName: equiptype_name,
        fieldId: area[2] || '',
        fieldName: areaNameList[2] || '',
        firmwareVersion: firmware_version,
        numPerMin: 10, // 推送速率，目前定义为每分钟推送的设备数目
        regionId: area[0] || '',
        regionName: areaNameList[0] || '',
        repeatType: 'DO_NOT_REPEAT', // DO_NOT_REPEAT——不重试,REPEAT_INSTANT——立即重试,REPEAT_AFTER_HALF_HOUR——30分钟后重试,REPEAT_AFTER_ONE_HOUR——1个小时后重试,REPEAT_AFTER_ONE_DAY——24小时后重试
        roomType: { key: roomType.code, label: roomType.title }, // {key: "13906", label: "保育舍"}
        roomTypeId,
        roomTypeName: roomType.title,
        scope,
        segmentId: area[3] || '',
        segmentName: areaNameList[3] || '',
        strategy,
        timeOut,
        unit: areaNameList[4] || '',
        upgradeTimeType,
        upgradedVersions: upgradedVersions.join(',')
      }
      this.$httpRequest({
        type: element && element.method,
        uri: element && element.uri,
        payload: params,
        callback: res => {
          if (res.status === 200 && res.rel) {
            this.$message.success('操作成功')
            this.closeUp()
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    closeUp() { // 关闭 upDialog
      this.cumDialogFormVisible1 = false
      this.$emit('closeUpDialog')
    },
    closeUpUp() { // 关闭 upUpDialog
      this.dialogFormVisible2 = false
    },
    doDeviceIds(arr) { // 子组件关闭时的 处理方法
      this.selection = arr // 选中表格数组
      const idsArr = arr.map(item => { return item.deviceId })
      this.formInfo.data.deviceIds = idsArr
      this.deviceCount = idsArr.length
      this.formInfo.data.upgradedVersions = []
      arr.forEach(item => {
        if (this.formInfo.data.upgradedVersions.indexOf(item.firmwareVersion) === -1) {
          this.formInfo.data.upgradedVersions.push(item.firmwareVersion)
        }
      })
    },
    cascaderEvent(val0, val1, val2) {
      this.areaNameList = val1
      this.getUpToatlNum()
    }
  }
}
</script>
<style lang="scss">
  .up-dialog{
      ::-webkit-scrollbar{ // 这里不置0的话 设备范围选择框会多出 4px的高度---
        height: 0px;
      }
      .instruction{
          text-align: center;
          // color: #fff;
          @include font_color('spFontColor4');
          padding: 10px;
          padding-top: 0;
          span{color: red;}
      }
      .el-select__tags{
          max-height: 36px!important;
          overflow: scroll;
        }
      .el-dialog__body{
          .el-col-24{
            .el-select__tags{
              // position: absolute!important;
              max-height: 36px!important;
              overflow: scroll!important;
            }
        }
      }
  }
.foot-close{
  margin-right: 10px;
}
</style>
