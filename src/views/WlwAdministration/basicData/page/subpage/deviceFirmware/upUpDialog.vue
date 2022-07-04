<!-- 设备固件管理 升级--请选择设备 弹框 -->
<template>
  <!-- 升级--请选择设备 dialog -->
  <el-dialog
    title="请选择设备"
    :modal-append-to-body="false"
    :visible.sync="dialogFormVisible2_fb"
    :close-on-click-modal="false"
    width="1000px"
    class="up-up-dialog"
    @close="closeUpUp"
  >
    <div class="body">
      <!-- 头部导航 -->
      <nav-form
        ref="navFormUpUp"
        :data="navFormInfo.data"
        :field-list="navFormInfo.fieldList"
        class="d-navForm"
        @cascaderEvent="cascaderEvent"
      />
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
        @filter-change="filterChange"
      />
    </div>
    <div slot="footer" class="dialog-footer">
      <div style="margin:0 auto;">
        <el-button class="btn-border" @click="closeUpUp">取 消</el-button>
        <el-button class="btn-blue" type="primary" @click="determineUpUp">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
const boundStatusList = [
  { name: '未绑定', val: '0' }, { name: '已绑定', val: '1' }
]
const statusOnlineList = [
  { name: '离线', val: '0' }, { name: '在线', val: '1' }
]
import navForm from '@/components/commonComponent/navForm/index.vue'
import tablePage from '@/components/ElementComponent/iTable'
import { getConfigElement } from '@/utils/overtService'
const pageElement = getConfigElement('my_equipment_firmware_version')
export default {
  components: {
    navForm,
    tablePage
  },
  props: {
    dialogFormVisible2: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => {
        return {}
      }
    },
    deviceIdsList: { // 选中的待升级版本号
      type: Array,
      default: () => {
        return []
      }
    },
    upgradedVersionsList: {
      type: Array,
      default: () => {
        return []
      }
    },
    roomTypeList: {
      type: Array,
      default: () => {
        return []
      }
    },
    selectionTableData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      dialogFormVisible2_fb: false,
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
      isLoading: false, // 表格loading
      curAllTableData: [], // 当前页的表格 所有
      tableData: [], // 展示的表格数据
      selection: [], // 选中表格数据
      columns: [// 列项
        {
          prop: 'firmwareVersion',
          longData: 'true',
          label: '固件版本号',
          width: '100',
          align: 'center'
        },
        {
          longData: 'true',
          prop: 'deviceId',
          width: '240',
          label: '设备ID'
        },
        {
          longData: 'true',
          prop: 'regionName',
          label: '区域',
          render: (h, scope) => {
            const { regionName, areaName, fieldName, segmentName, room_type_name, unit, type, areaTxt } = scope.row
            if (type === 'PiggeryShower') { // 喷淋特殊处理
              return h('span', areaTxt || '---')
            }
            let str = ''
            if (regionName) str += regionName
            if (areaName) str += ' / ' + areaName
            if (fieldName) str += ' / ' + fieldName
            if (segmentName) str += ' / ' + segmentName
            if (room_type_name) str += '(' + room_type_name + ')'
            if (unit) str += ' / ' + unit
            if (!regionName) str = '---'
            return h('span', str)
          }
        }
      ],
      areaNameList: [], // 区域名称
      navFormInfo: {
        data: {
          area: [], // 区域
          firmwareVersions: [], // 固件版本号
          keyword: '', // 关键字
          boundStatus: '', // 绑定状态
          statusOnline: '', // 在线状态
          roomTypeId: '', // 猪舍类型
          isAll: true // 是否全部
        },
        fieldList: {
          left: {
            inpLists: []
          },
          right: {
            inpLists: [
              {
                key: 'area',
                type: 'cascader',
                checkStrictly: true,
                clearable: true,
                customLabel: 'title',
                customValue: 'value',
                className: 'shadow',
                placeholder: '请选择大区 / 区域 / 场区 / 工段 / 单元',
                options: []
              },
              {
                key: 'firmwareVersions',
                type: 'select',
                placeholder: '版本筛选',
                className: 'shadow',
                multiple: true,
                filterable: true, // 可搜索
                valueKey: 'value',
                props: {
                  label: 'value',
                  value: 'value'
                },
                clearable: true,
                list: [] // this.upgradedVersionsList
              },
              {
                key: 'keyword',
                type: 'input',
                placeholder: '请输入设备ID',
                className: 'shadow',
                clearable: true,
                list: []
              },
              {
                key: 'boundStatus',
                type: 'select',
                placeholder: '请选择绑定状态',
                className: 'shadow',
                filterable: true, // 可搜索
                props: {
                  label: 'name',
                  value: 'val'
                },
                clearable: true,
                list: boundStatusList
              },
              {
                key: 'statusOnline',
                type: 'select',
                placeholder: '请选择在线状态',
                className: 'shadow',
                filterable: true, // 可搜索
                props: {
                  label: 'name',
                  value: 'val'
                },
                clearable: true,
                list: statusOnlineList
              },
              {
                key: 'roomTypeId',
                type: 'select',
                placeholder: '请选择猪舍类型',
                filterable: true, // 可搜索
                clearable: true,
                list: [], // this.roomTypeList
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
                key: 'isAll',
                type: 'radio',
                className: 'shadow',
                placeholder: '333',
                customLabel: 'name',
                customVal: 'val',
                optList: [{ name: '全部', val: true }, { name: '已选择', val: false }]
              }
            ],
            btnLists: [
              {
                innerText: '搜索',
                className: 'btn-blue',
                handleClick: () => {
                  this.pagination.pageIndex = 1
                  this.navFormInfo.data.isAll = true
                  this.getMyEvcMcuInfo()
                }
              }
            ]
          }
        }
      }
    }
  },
  watch: {
    selectionTableData(val) {
      this.selection = val
    },
    dialogFormVisible2(val) {
      this.dialogFormVisible2_fb = val
      if (val) {
        console.log('watch----')
        this.init()
      } else {
        this.navFormInfo.data = {
          area: [], // 区域
          firmwareVersions: [], // 固件版本号
          keyword: '', // 关键字
          boundStatus: '', // 绑定状态
          statusOnline: '', // 在线状态
          roomTypeId: '', // 猪舍类型
          isAll: true // 是否全部
        }
        // 这里清空一下 navForm里的选中状态
        // console.log('this.$refs.navFormUpUp.$refs.cascader[0]---', this.$refs.navFormUpUp.$refs.cascader[0])
        if (this.$refs.navFormUpUp.$refs.cascader[0].$refs.panel) {
          this.$refs.navFormUpUp.$refs.cascader[0].$refs.panel.clearCheckedNodes()
          this.$refs.navFormUpUp.$refs.cascader[0].$refs.panel.activePath = []
        }
      }
    },
    'navFormInfo.data.isAll': {
      handler(val) {
        const { selection, curAllTableData } = this
        if (val) {
          this.tableData = curAllTableData
        } else {
          const selectIds = selection.map(item => { return item.id })
          this.tableData = curAllTableData.filter(item => selectIds.indexOf(item.id) > -1)
        }
      },
      deep: true
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    init() {
      this.navFormInfo.data.firmwareVersions = this.deviceIdsList
      this.navFormInfo.fieldList.right.inpLists[1].list = this.upgradedVersionsList
      this.navFormInfo.fieldList.right.inpLists[5].list = this.roomTypeList
      const arr = this.selectionTableData // 传入的 selection数组
      arr.forEach(item => {
        if (this.navFormInfo.data.firmwareVersions.indexOf(item.firmwareVersion) === -1) {
          this.navFormInfo.data.firmwareVersions.push(item.firmwareVersion)
        }
      })
      this.getMyEvcMcuInfo()
    },
    getMyEvcMcuInfo() {
      const element = pageElement['getDevicesForUpgrade']
      const { areaNameList } = this
      const { area, firmwareVersions, keyword, boundStatus, statusOnline, roomTypeId } = this.navFormInfo.data
      const { device_version_id, equiptype_id } = this.row
      const { pageIndex, limit } = this.pagination
      const params = {
        areaId: area[1] || '',
        boundStatus,
        deviceVersionId: device_version_id,
        equipTypeId: equiptype_id,
        fieldId: area[2] || '',
        firmwareVersions: firmwareVersions.join(','),
        keyword,
        limit,
        page: pageIndex,
        regionId: area[0] || '',
        roomTypeId,
        segmentId: area[3] || '',
        statusOnline,
        unit: area[4] ? areaNameList[4] : ''
      }
      this.isLoading = true
      this.$httpRequest({
        type: element && element.method,
        uri: element && element.uri,
        payload: params,
        callback: res => {
          this.isLoading = false
          if (res.status === 200) {
            this.pagination.total = res.data.total
            this.curAllTableData = res.data.rows
            this.tableData = res.data.rows
            // // 若没有传入的选中或没有选中 时 清一下，不然会有上次的表格数据存在--
            if (this.selectionTableData.length === 0 && this.selection.length === 0) {
              this.$refs['tablePage'].$children[0].clearSelection()
            }
          }
        }
      })
    },
    closeUpUp() {
      this.dialogFormVisible2_fb = false
      this.$emit('closeUpUp')
    },
    determineUpUp() {
      // console.log('this.selection----', this.selection)
      this.$emit('doDeviceIds', this.selection || [])
      this.closeUpUp()
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
    },
    cascaderEvent(val0, val1, val2) {
      this.areaNameList = val1
    },
    filterChange(filters) {
      console.dir('filters---', filters)
    }
  }
}
</script>
<style lang="scss">
.up-up-dialog{
  .el-select__tags{
    z-index: 1;
  }
  .el-pagination{
    @include background_color('dialogPaginationBkColor');
  }
}
</style>
