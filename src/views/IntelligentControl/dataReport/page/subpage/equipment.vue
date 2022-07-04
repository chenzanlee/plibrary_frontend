<template>
  <div class="home equipment">
    <!-- 头部导航 -->
    <nav-form
      ref="navForm"
      :data="navFormInfo.data"
      :field-list="navFormInfo.fieldList"
    />
    <!-- 表格内容 -->
    <tablePage
      :is-loading="isLoading"
      :columns="columns"
      :data-source="tableData"
      :options="options"
      :pagination="pagination"
      @handleSizeChange="handleSizeChange"
      @handleIndexChange="handleIndexChange"
    />
  </div>
</template>

<script>
import navForm from '@/components/commonComponent/navForm/index.vue'
import tablePage from '@/components/ElementComponent/iTable'
import {
// myEvcOperationDynamicsRealTime,
// getRegionAreaFieldRoomTypeUnitV2,
// dataReport
} from '@/http/api/exportData/equipment.js'
import { getConfigElement } from '@/utils/overtService'
const pageElement = getConfigElement('deviceStatusExport')
export default {
  components: {
    tablePage,
    navForm
  },
  data() {
    return {
      isLoading: false,
      search: {
        startTime: '',
        endTime: '',
        regionId: '',
        areaId: '',
        fieldId: '',
        roomTypeId: '',
        unitId: '',
        page: '',
        limit: ''
      },
      defaultValue: [], // 默认选中
      navFormInfo: {
        data: {
          area: '',
          time: ''
        },
        fieldList: {
          left: {
            inpLists: [
              {
                key: 'area',
                type: 'cascader',
                customLabel: 'title',
                customValue: '',
                checkStrictly: false,
                clearable: true,
                className: 'shadow',
                placeholder: '大区 / 区域 / 场区',
                options: []
              },
              {
                key: 'time',
                type: 'dateTime',
                className: 'shadow',
                dateType: 'datetimerange',
                startPlaceholder: '开始时间',
                endPlaceholder: '结束时间'
              }
            ],
            btnLists: [
              {
                innerText: '查询',
                className: 'btn-blue',
                handleClick: () => {
                  this.dataReport()
                }
              },
              {
                innerText: '重置',
                className: 'btn-border',
                handleClick: () => {
                  this.navFormInfo.data.area = ''
                  if (!this.search.regionId) {
                    return this.$message.error('请选择场区')
                  }
                }
              },
              {
                innerText: '刷新',
                className: 'btn-border',
                handleClick: () => {
                  this.pagination.pageIndex = 1
                  this.pagination.limit = 10
                  this.getmyEvcOperationDynamicsRealTime()
                }
              }
            ]
          }
        }
      },
      columns: [
        {
          prop: 'regionName',
          label: '大区'
          // width: '120'
        },
        {
          prop: 'areaName',
          label: '区域'
          // width: '120'
        },
        {
          prop: 'fieldName',
          label: '场区'
          // width: '120'
        },
        {
          prop: 'roomTypeName',
          label: '猪舍类型'
          // width: '120'
        },
        {
          prop: 'segmentName',
          label: '工段'
          // minWidth: '80'
        },
        {
          prop: 'unitName',
          label: '单元'
          // width: '80'
        },
        {
          prop: 'startTime',
          label: '导出开始时间'
          // width: '160'
        },
        {
          prop: 'endTime',
          label: '导出结束时间'
          // width: '160'
        },
        {
          prop: 'status',
          label: '状态',
          // width: '180',
          rule: {
            1: '已生成',
            2: '生成中',
            0: '已删除'
          }
        },
        {
          download: true,
          prop: 'downloadUrl',
          show: 'status',
          label: '操作',
          align: 'center',
          fixed: 'right',
          width: '120'
        }
      ],
      // 数据
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
        mutiSelect: false, // 多选框
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
        if (n.time && n.time.length) {
          this.search.startTime = n.time[0]
          this.search.endTime = n.time[1]
        } else {
          // 防止未null===报错
          this.search.startTime = this.$moment().subtract(4, 'hours').format('YYYY-MM-DD HH:mm:ss')
          this.search.endTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
        }
        this.search.regionId = n.area[0] || ''
        this.search.areaId = n.area[1] || ''
        this.search.fieldId = n.area[2] || ''
        this.search.roomTypeId = n.area[3] || ''
        this.search.unitId = n.area[4] || ''
      },
      deep: true
    }
  },
  async created() {
    await this.getTree()
    // this.getmyEvcOperationDynamicsRealTime()
  },
  methods: {
    // 默认值递归
    defaultValueMe(arr) {
      if (!arr) {
        return
      }
      this.defaultValue.push(arr[0].value)
      if (arr[0].children) {
        this.defaultValueMe(arr[0].children)
      }
    },
    // 获取区域联动数据
    async getTree() {
      const pageElement = getConfigElement('unit-evcDataInterface')
      this.$httpRequest({
        type: 'GET',
        payload: { isBuilding: false },
        uri: pageElement && pageElement.getRegionAreaFieldTree && pageElement.getRegionAreaFieldTree.uri,
        callback: data => {
          if (data.status === 200 && data.rel) {
            this.navFormInfo.fieldList.left.inpLists[0].options = data.data
            this.defaultValueMe(this.navFormInfo.fieldList.left.inpLists[0].options)
            this.search.startTime = this.$moment().subtract(4, 'hours').format('YYYY-MM-DD HH:mm:ss')
            this.search.endTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
            this.navFormInfo.data.time = [this.search.startTime, this.search.endTime]
          }
        }
      })
    },
    // 时间格式化
    timeFommater(value) {
      var dateee = new Date(value).toJSON()
      var date = new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
      return date
    },
    // 导出
    dataReport() {
      // deviceStatusExport:exportStatusData
      if (!this.search.regionId) {
        return this.$message.error('请选择场区')
      }
      const query = { ...this.search }
      Object.keys(query).forEach(k => {
        if (query[k] === undefined || query[k] === null || query[k] === '') {
          delete query[k]
        }
      })
      if (query.roomTypeId) {
        query['segmentId'] = query.roomTypeId
      }
      delete query.page
      delete query.limit
      this.$httpRequest({
        type: 'GET',
        payload: query,
        uri: pageElement && pageElement.exportStatusData && pageElement.exportStatusData.uri,
        callback: data => {
          if (data.status === 200) {
            this.getmyEvcOperationDynamicsRealTime()
          }
        }
      })
    },
    // 获取列表数据
    getmyEvcOperationDynamicsRealTime() {
      this.search.page = this.pagination.pageIndex
      this.search.limit = this.pagination.limit
      const query = { ...this.search }
      Object.keys(query).forEach(k => {
        if (query[k] === undefined || query[k] === null || query[k] === '') {
          delete query[k]
        }
      })
      if (query.roomTypeId) {
        query['segmentId'] = query.roomTypeId
      }
      this.isLoading = true
      this.$httpRequest({
        type: 'GET',
        payload: query,
        uri: pageElement && pageElement.getExcelUrls && pageElement.getExcelUrls.uri,
        callback: res => {
          this.isLoading = false
          if (res.status === 200) {
            if (res.data.total > 0) {
              this.pagination.total = res.data.total
              const arr = res.data.rows
              if (arr != null) {
                arr.forEach((item, idx) => {
                  const date = arr[idx].startTime
                  arr[idx].startTime = this.timeFommater(date)
                  const date2 = arr[idx].endTime
                  arr[idx].endTime = this.timeFommater(date2)
                })
              }
              this.tableData = arr
            } else {
              this.tableData = []
              this.pagination.total = 0
            }
          }
        }
      })
    },
    // 分页器页码
    handleIndexChange(current) {
      this.pagination.pageIndex = current
      this.getmyEvcOperationDynamicsRealTime()
    },
    // 分页器一页多少条
    handleSizeChange(size) {
      this.pagination.limit = size
      this.getmyEvcOperationDynamicsRealTime()
    }
  }
}
</script>
<style lang="scss" scoped>
.alsrtInfo {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  background: rgba(0, 0, 0, 0.1);

  .profPrompt_test {
    padding: 10px;
    width: 120px;
    overflow: hidden;
    line-height: 28px;
    border: 1px solid #4eb6d3;
    color: #4eb6d3;
    position: absolute;
    background-color: #fbfbfb;
    top: 356px;
    left: 50%;
    font-size: 16px;
    font-family: Gotham-Book;
    opacity: 1;
    text-align: center;
    transform: translate(-50%, -50%);
  }
}
</style>
