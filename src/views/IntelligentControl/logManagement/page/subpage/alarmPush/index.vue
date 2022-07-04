<template>
  <div class="alarmPush home push">
    <!-- 头部导航 -->
    <nav-form
      ref="navForm"
      :data="navFormInfo.data"
      :field-list="navFormInfo.fieldList"
      @cascaderEvent="cascaderEvent"
      @cascaderEvent2="cascaderEvent2"
      @dateTimeChange="dateTimeChange"
    >
      <div slot="left" class="top-tab-container">
        <el-button
          :class="{ active: activeTab === 'notBuliding', 'topBtn':true }"
          @click="changeTopBtn('notBuliding')"
        >平房</el-button>
        <el-button
          :class="{ active: activeTab === 'isBuliding', 'topBtn':true }"
          @click="changeTopBtn('isBuliding')"
        >楼房</el-button>
      </div>
      <span slot="right" :authCode="'fieldAlarmLogs:export'" @click="exportData()">
        <!-- <el-tooltip class="" effect="dark" content="导出" placement="top-start">
          <img src="@/assets/image/export.png">
        </el-tooltip> -->
        <el-button class="btn-blue">
          <svg-icon icon-class="newExport" />
          导出
        </el-button>
      </span>
    </nav-form>
    <!-- 表格内容 -->
    <tablePage
      :is-loading="isLoading"
      :columns="columns"
      :data-source="tableData"
      :options="options"
      :pagination="pagination"
      @handleSizeChange="handleSizeChange"
      @handleIndexChange="handleIndexChange"
      @child-seeRow="childSeeRow"
    />
  </div>
</template>

<script>
import navForm from '@/components/commonComponent/navForm/index.vue'
import tablePage from '@/components/ElementComponent/iTable'
// import { evcJsonh2Tree } from '@/components/tree/evcJsonh2Tree.js'
// import { getAlarmDeviceInfo } from '@/http/api/logManagement.js'
// import { getTreeData } from '../common.js'
import { derive } from '@/http/api/exportData/export'
import { getConfigElement } from '@/utils/overtService'
import {
  getRegionAreaFieldTree,
  getRootTypeUnitTreeV2
} from '@/http/api/baseInfo/regionAreaField.js'

export default {
  name: 'AlarmPush',
  components: {
    tablePage,
    navForm
  },
  data() {
    return {
      activeTab: 'notBuliding',
      selectAreaShow: true,
      nameList: [], // 这个对应大区/区域/厂区/猪舍类型/单元。。。的名字
      nameList2: [],
      allTableData: [],
      isLoading: false,
      defaultValue: [], // 默认选中
      defaultTitle: [],
      // 查询条件
      search: {
        push: '', // 类型
        keyword: '', // 关键字
        fromTime: '', // 开始时间
        toTime: '', // 结束时间
        regionId: '', // 大区ID
        areaId: '', // 区域ID
        fieldId: '', // 场区ID
        block: '', // A座 or B座
        roomTypeId: '', // 舍ID
        unitName: '', // 单元ID
        pageIndex: '', // 页码
        pageSize: '', // 页码显示数
        regionName: '', // 大区名称
        areaName: '', // 区域名称
        fieldName: '', // 场区名称
        roomTypeName: '',
        type: ''
      },
      navFormInfo: {
        data: {
          area: [],
          roomtypeUnit: [],
          time: '',
          keyword: '',
          push: '',
          type: ''
        },
        fieldList: {
          right: {
            inpLists: [
              {
                key: 'area',
                type: 'cascader',
                className: 'shadow',
                placeholder: '大区 / 区域 / 场区',
                options: [],
                customLabel: 'title',
                customValue: '',
                width: '200px',
                checkStrictly: true,
                clearable: true,
                valueKey: 0
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
                key: 'time',
                type: 'dateTime',
                className: 'shadow',
                dateType: 'datetimerange',
                startPlaceholder: '开始时间',
                endPlaceholder: '结束时间'
              },
              {
                key: 'type',
                type: 'select',
                label: '',
                className: 'shadow',
                placeholder: '告警类型',
                clearable: 'clearable',
                list: [
                  { key: '设备离线', value: 'OFFLINE' },
                  // { key: '断网告警', value: 'FIELD_DISCONNECT' },
                  { key: '设备故障', value: 'FAULT' }
                ],
                required: true,
                rules: [
                  { required: true, message: '请选择告警类型', trigger: 'blur' }
                ]
              },
              {
                key: 'keyword',
                type: 'input',
                required: true,
                className: 'shadow',
                placeholder: '请输入关键字'
              },
              {
                key: 'push',
                type: 'select',
                label: '',
                className: 'shadow',
                clearable: 'clearable',
                placeholder: '推送状态',
                list: [
                  { key: '推送', value: 1 },
                  { key: '不推送', value: 0 }
                ],
                required: true,
                rules: [
                  { required: true, message: '请选择推送状态', trigger: 'blur' }
                ]
              }
            ],
            btnLists: [
              {
                innerText: '查询',
                className: 'btn-blue',
                authCode: 'fieldAlarmLogs:getAlarmPushLogs',
                handleClick: () => {
                  this.pagination.pageIndex = 1
                  if (!this.navFormInfo.data.time || this.navFormInfo.data.time.length === 0) {
                    this.$message.warning('请选择查询时间段')
                    return false
                  }
                  this.getsiteUnitAlarmLog()
                }
              },
              {
                innerText: '重置',
                className: 'btn-border',
                handleClick: () => {
                  this.$refs['navForm'].resetFields()
                  this.tableData = []
                  this.pagination.total = 0
                  // this.search.keyword = ''
                  this.search.fromTime = this.formatDate(
                    new Date().getTime() - 86400000 * 2
                  )
                  this.search.toTime = this.formatDate(new Date().getTime())
                  this.navFormInfo.data.time = [this.search.fromTime, this.search.toTime]
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
          longData: true,
          prop: 'location',
          label: '位置信息',
          width: '210'
        },
        {
          prop: 'contentType',
          label: '报警类型',
          width: '120'
        },
        {
          longData: true,
          prop: 'content',
          label: '报警信息',
          minWidth: '300'
        },
        {
          align: 'center',
          prop: 'push',
          label: '是否推送',
          width: '90',
          rule: {
            1: '是',
            0: '否'
          }
        },
        {
          longData: true,
          prop: 'noticeUserNames',
          label: '告警推送人员',
          width: '170'
        },
        {
          longData: true,
          prop: 'alarmTime',
          label: '报警时间',
          width: '150'
        },
        {
          button: true,
          label: '单元详情',
          fixed: 'right',
          width: '100', // 操作按钮宽度
          group: [
            {
              name: '查看',
              class: 'btn-blue',
              size: 'auto',
              click: 'see'
            }
          ]
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
        if (n.time) {
          this.search.fromTime =
            n.time[0] || this.formatDate(new Date().getTime() - 86400000 * 2)
          this.search.toTime =
            n.time[1] || this.formatDate(new Date().getTime())
        } else {
          // 防止未null===报错
          this.search.fromTime = this.formatDate(
            new Date().getTime() - 86400000 * 2
          )
          this.search.toTime = this.formatDate(new Date().getTime())
        }
        if (n.area.length === 0) {
          this.navFormInfo.fieldList.right.inpLists[0].valueKey++ // 只要监听到数据源发生变化 ，改变keyValue的值，达到重新渲染的效果
          this.navFormInfo.fieldList.right.inpLists[1].valueKey++
        }
      },
      deep: true
    }
  },
  activated() {
    this.initTreeData()
  },
  methods: {
    changeTopBtn(item) {
      if (this.activeTab === item) {
        return
      }
      if (item === 'isBuliding') {
        this.navFormInfo.fieldList.right.inpLists[1].placeholder = '楼座 / 猪舍类型 / 单元'
      } else {
        this.navFormInfo.fieldList.right.inpLists[1].placeholder = '猪舍类型 / 单元'
      }
      this.activeTab = item
      this.navFormInfo.data.area = []
      this.navFormInfo.data.roomtypeUnit = []
      this.initTreeData()
    },
    initTreeData() {
      getRegionAreaFieldTree({ isBuilding: this.activeTab !== 'notBuliding' }).then(data => {
        if (data.status === 200 && data.rel) {
          this.getOptions(data.data)
        }
      })
      // getTreeData(this).then(data => {
      //   if (data) {
      //     this.getOptions(data)
      //   }
      // })
    },
    handleObj(obj) { // 处理对象 删除值为''字段 返回对象
      for (const key in obj) {
        !obj[key] && delete obj[key]
      }
      this.search.regionId = this.navFormInfo.data.area[0] || ''
      this.search.regionName = this.nameList[0] || ''
      this.search.areaId = this.navFormInfo.data.area[1] || ''
      this.search.areaName = this.nameList[1] || ''
      this.search.fieldId = this.navFormInfo.data.area[2] || ''
      this.search.fieldName = this.nameList[2] || ''
      if (this.navFormInfo.data.roomtypeUnit[0] === 'BLOCK_A' || this.navFormInfo.data.roomtypeUnit[0] === 'BLOCK_B') {
        this.search.block = this.navFormInfo.data.roomtypeUnit[0] || ''
        this.search.roomTypeId = this.navFormInfo.data.roomtypeUnit[1] || ''
        this.search.roomTypeName = this.nameList2[1] || ''
        this.search.unitName = this.nameList2[2] || ''
      } else {
        this.search.block = ''
        this.search.roomTypeId = this.navFormInfo.data.roomtypeUnit[0] || ''
        this.search.roomTypeName = this.nameList2[0] || ''
        this.search.unitName = this.nameList2[1] || ''
      }
      this.search.push = this.navFormInfo.data.push
      this.search.type = this.navFormInfo.data.type
      this.search.keyword = this.navFormInfo.data.keyword
      return obj
    },
    dateTimeChange(val) {},
    cascaderEvent(path, pathLabels, pathNodes) {
      if (path.length === 3) {
        getRootTypeUnitTreeV2({ fieldId: path[2], isBuilding: this.activeTab !== 'notBuliding' }).then(data => {
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
      this.nameList = pathLabels
    },
    cascaderEvent2(path, pathLabels, pathNodes) {
      this.nameList2 = pathLabels
      console.log(this.nameList2)
    },
    formatDate(dateValue) {
      var date = new Date(dateValue)
      var YY = date.getFullYear() + '-'
      var MM =
        (date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) + '-'
      var DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      var hh =
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      var mm =
        (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
        ':'
      var ss =
        date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      return YY + MM + DD + ' ' + hh + mm + ss
    },
    sortArr(a, b) {
      return b.count - a.count
    },
    // 默认选中
    defaultValueMe(arr) {
      if (!arr || arr.length === 0) {
        return
      }
      this.defaultValue.push(arr[0].value)
      this.defaultTitle.push(arr[0].title)
      if (arr[0].children) {
        this.defaultValueMe(arr[0].children)
      }
    },
    // 中国标准时间格式转换
    timeFommater(value) {
      var dateee = new Date(value).toJSON()
      var date = new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
      return date
    },
    // 获取区域联动数据
    async getTree() {
      let json = []
      getRegionAreaFieldTree({ isBuilding: false }).then(data => {
        if (data.status === 200 && data.rel) {
          json = data.data
        }
      })
      // const element = getConfigElement('unit-evcDataInterface')
      // await this.$httpRequest({
      //   type: element ? element.getRegionAreaFieldRoomTypeUnitV2.method : '',
      //   uri: element ? element.getRegionAreaFieldRoomTypeUnitV2.uri : '',
      //   payload: '',
      //   callback: (res) => {
      //     if (res && res.status === 200 && res.rel) {
      //       json = res.data
      //       sessionStorage.setItem('unitEvclogManagement', JSON.stringify(json))
      //     }
      //   }
      // })
      this.getOptions(json)
    },
    getOptions(json) {
      this.navFormInfo.fieldList.right.inpLists[0].options = json
      this.search.fromTime = this.formatDate(new Date(new Date().setHours(0, 0, 0, 0)))
      this.search.toTime = this.formatDate(new Date().getTime())
      this.navFormInfo.data.time = [this.search.fromTime, this.search.toTime]
    },

    // 获取列表
    getsiteUnitAlarmLog() {
      this.search.regionId = this.navFormInfo.data.area[0] || ''
      this.search.regionName = this.nameList[0] || ''
      this.search.areaId = this.navFormInfo.data.area[1] || ''
      this.search.areaName = this.nameList[1] || ''
      this.search.fieldId = this.navFormInfo.data.area[2] || ''
      this.search.fieldName = this.nameList[2] || ''
      if (this.navFormInfo.data.roomtypeUnit[0] === 'BLOCK_A' || this.navFormInfo.data.roomtypeUnit[0] === 'BLOCK_B') {
        this.search.block = this.navFormInfo.data.roomtypeUnit[0] || ''
        this.search.roomTypeId = this.navFormInfo.data.roomtypeUnit[1] || ''
        this.search.roomTypeName = this.nameList2[1] || ''
        this.search.unitName = this.nameList2[2] || ''
      } else {
        this.search.block = ''
        this.search.roomTypeId = this.navFormInfo.data.roomtypeUnit[0] || ''
        this.search.roomTypeName = this.nameList2[0] || ''
        this.search.unitName = this.nameList2[1] || ''
      }
      if (this.search.regionId === '') {
        this.tableData = []
        this.pagination.total = 0
        this.$forceUpdate()
        this.$message({
          message: '至少需要选择大区',
          type: 'warning'
        })
        return
      }
      if (this.$moment(this.navFormInfo.data.time[1]).subtract(7, 'days') > this.$moment(this.navFormInfo.data.time[0])) {
        this.$message({
          message: '最多查看7天内的日志信息',
          type: 'warning'
        })
        return
      }
      this.selectAreaShow = false
      this.search.pageIndex = this.pagination.pageIndex
      this.search.pageSize = this.pagination.limit
      const obj = {
        push: this.navFormInfo.data.push,
        type: this.navFormInfo.data.type,
        keyword: this.navFormInfo.data.keyword, // 关键字
        fromTime: this.search.fromTime, // 开始时间
        toTime: this.search.toTime, // 结束时间
        regionId: this.search.regionId, // 大区ID
        areaId: this.search.areaId, // 区域ID
        fieldId: this.search.fieldId, // 场区ID
        block: this.search.block, // A座 or B座
        roomTypeId: this.search.roomTypeId, // 舍ID
        unitName: this.search.unitName, // 单元ID
        pageIndex: this.search.pageIndex, // 页码
        pageSize: this.search.pageSize // 页码显示数
      }
      this.isLoading = true
      const element = getConfigElement('fieldAlarmLogs')
      this.$httpRequest({
        type: element ? element.getAlarmPushLogs.method : '',
        uri: element ? element.getAlarmPushLogs.uri : '',
        payload: obj,
        callback: (res) => {
          this.isLoading = false
          if (res && res.status === 200) {
            // this.isLoading = false
            this.tableData = res.data.rows
            const arr = res.data.rows
            if (arr !== null) {
              arr.forEach((item, idx) => {
                const date = arr[idx].alarmTime
                arr[idx].alarmTime = this.timeFommater(date)
              })
            }
            this.tableData = arr
            this.allTableData = arr
            const array = []
            if (this.tableData.length >= this.pagination.limit) {
              for (let idx = 0; idx < this.pagination.limit; idx++) {
                array.push(this.tableData[idx])
              }
            }
            if (this.tableData.length < this.pagination.limit) {
              for (let idx = 0; idx < this.tableData.length; idx++) {
                array.push(this.tableData[idx])
              }
            }
            this.tableData = array
            this.pagination.total = res.data.total
          }
        }
      })
      // siteUnitAlarmPushLog(obj).then((res) => {
      //   this.isLoading = false
      //   this.tableData = res.data.rows
      //   const arr = res.data.rows
      //   if (arr !== null) {
      //     arr.forEach((item, idx) => {
      //       const date = arr[idx].alarmTime
      //       arr[idx].alarmTime = this.timeFommater(date)
      //     })
      //   }
      //   this.tableData = arr
      //   this.allTableData = arr
      //   const array = []
      //   if (this.tableData.length >= this.pagination.limit) {
      //     for (let idx = 0; idx < this.pagination.limit; idx++) {
      //       array.push(this.tableData[idx])
      //     }
      //   }
      //   if (this.tableData.length < this.pagination.limit) {
      //     for (let idx = 0; idx < this.tableData.length; idx++) {
      //       array.push(this.tableData[idx])
      //     }
      //   }
      //   console.log(array)
      //   this.tableData = array
      //   this.pagination.total = res.data.total
      // }).catch(() => {
      //   this.isLoading = false
      // })
    },
    // 点查看和编辑前的操作
    seeAndEditBefore(row) {
      this.childSeeRow(row)
    },
    // 点查看
    childSeeRow(row, index) {
      const obj = {
        deviceId: row.deviceId,
        fieldId: row.fieldId,
        roomTypeId: row.roomTypeId,
        segmentId: row.segmentId,
        unitId: row.unitId
      }
      let data
      const element = getConfigElement('fieldAlarmLogs')
      this.$httpRequest({
        type: element ? element.getMyEvcMcuInfoByLocation.method : '',
        uri: element ? element.getMyEvcMcuInfoByLocation.uri : '',
        payload: obj,
        callback: (res) => {
          if (res && res.status === 200) {
            data = res.data
            if (res.data.segmentId && res.data.segmentId !== null) {
              const selectedOption = [row.regionId, row.areaId, row.fieldId]
              const selectedLabel = [row.regionName, row.areaName, row.fieldName]
              sessionStorage.setItem('fieldDeviceOverviewDetail', JSON.stringify({
                overview: data,
                selectedOption: selectedOption,
                selectedLabel: selectedLabel,
                unitList: []
              }))
              if (res.data.deviceVersionId === '6aKGZaUNLp9poYSNu1PhnU') {
                this.$router.push({
                  name: 'intelligentControlOverviewV3',
                  params: {
                    overview: data,
                    selectedOption: selectedOption,
                    selectedLabel: selectedLabel,
                    unitList: []
                  }
                })
              } else {
                this.$router.push({
                  name: 'intelligentControlOverview',
                  params: {
                    overview: data,
                    selectedOption: selectedOption,
                    selectedLabel: selectedLabel,
                    unitList: []
                  }
                })
              }
            } else {
              this.$message({
                message: '该日志缺少数据',
                type: 'warning'
              })
            }
          }
        }
      })
      // getAlarmDeviceInfo(obj).then(res => {
      //   if (res && res.status === 200) {
      //     data = res.data
      //     console.log(data, '选择的行数据')
      //     if (res.data.segmentId && res.data.segmentId !== null) {
      //       const selectedOption = [row.regionId, row.areaId, row.fieldId]
      //       const selectedLabel = [row.regionName, row.areaName, row.fieldName]
      //       sessionStorage.setItem('fieldDeviceOverviewDetail', JSON.stringify({
      //         overview: data,
      //         selectedOption: selectedOption,
      //         selectedLabel: selectedLabel,
      //         unitList: []
      //       }))
      //       if (res.data.deviceVersionId === '6aKGZaUNLp9poYSNu1PhnU') {
      //         this.$router.push({
      //           name: 'intelligentControlOverviewV3',
      //           params: {
      //             overview: data,
      //             selectedOption: selectedOption,
      //             selectedLabel: selectedLabel,
      //             unitList: []
      //           }
      //         })
      //       } else {
      //         this.$router.push({
      //           name: 'intelligentControlOverview',
      //           params: {
      //             overview: data,
      //             selectedOption: selectedOption,
      //             selectedLabel: selectedLabel,
      //             unitList: []
      //           }
      //         })
      //       }
      //     } else {
      //       this.$message({
      //         message: '该日志缺少数据',
      //         type: 'warning'
      //       })
      //     }
      //   }
      // })
    },
    // 导出
    exportData() {
      this.search.pageIndex = this.pagination.pageIndex
      this.search.pageSize = this.pagination.limit
      this.search.regionId = this.navFormInfo.data.area[0] || ''
      this.search.regionName = this.nameList[0] || ''
      this.search.areaId = this.navFormInfo.data.area[1] || ''
      this.search.areaName = this.nameList[1] || ''
      this.search.fieldId = this.navFormInfo.data.area[2] || ''
      this.search.fieldName = this.nameList[2] || ''
      if (this.navFormInfo.data.roomtypeUnit[0] === 'BLOCK_A' || this.navFormInfo.data.roomtypeUnit[0] === 'BLOCK_B') {
        this.search.block = this.navFormInfo.data.roomtypeUnit[0] || ''
        this.search.roomTypeId = this.navFormInfo.data.roomtypeUnit[1] || ''
        this.search.roomTypeName = this.nameList2[1] || ''
        this.search.unitName = this.nameList2[2] || ''
      } else {
        this.search.block = ''
        this.search.roomTypeId = this.navFormInfo.data.roomtypeUnit[0] || ''
        this.search.roomTypeName = this.nameList2[0] || ''
        this.search.unitName = this.nameList2[1] || ''
      }
      if (this.search.regionId === '') {
        this.$message({
          message: '至少需要选择大区！',
          type: 'warning'
        })
        return
      }
      if (this.navFormInfo.data.time === '' || this.navFormInfo.data.time === null || this.navFormInfo.data.time.length === 0) {
        this.$message({
          message: '请选择导出时间段',
          type: 'warning'
        })
        return
      }
      if (this.$moment(this.navFormInfo.data.time[1]).subtract(7, 'days') > this.$moment(this.navFormInfo.data.time[0])) {
        this.$message({
          message: '最多导出7天内的日志信息',
          type: 'warning'
        })
        return
      }
      const obj = { ...this.search }
      const element = getConfigElement('fieldAlarmLogs')
      const url = element ? element.export.uri : ''
      derive('/api' + url, this.handleObj(obj))
    },
    // 分页器页码
    handleIndexChange(current) {
      this.pagination.pageIndex = current
      // this.getsiteUnitAlarmLog()
      this.isLoading = true
      if (this.pagination.total > this.pagination.limit) {
        const endIndex = this.pagination.limit * this.pagination.pageIndex
        const startIndex = endIndex - this.pagination.limit
        const array = []
        const lastCurrent = Math.floor(this.pagination.total / this.pagination.limit) + 1
        if (current === lastCurrent) {
          for (let idx = (lastCurrent - 1) * this.pagination.limit; idx < this.pagination.total; idx++) {
            array.push(this.allTableData[idx])
          }
        } else {
          for (let idx = startIndex; idx < endIndex; idx++) {
            array.push(this.allTableData[idx])
          }
        }
        this.tableData = array
      }
      this.isLoading = false
    },
    // 分页器一页多少条
    handleSizeChange(size) {
      this.pagination.limit = size
      this.getsiteUnitAlarmLog()
    }
  }
}
</script>
<style lang="scss">
.alarmPush {
  .nav-form .top-tab-container {
    .topBtn[type='button'] {
      padding: 11px 12px;
      font-size: 12px;
      border: 1px solid;
      @include border_color('formBorderColor');
      @include font_color("taskTagFontColor");
      background: transparent;
      margin-right: 10px;
    }
    .topBtn.active[type='button'] {
      color: #1fbfff !important;
      background: rgba(9, 30, 64, 0);
      border: 1px solid #1fbfff !important;
      @include box_shadow('taskTagBoxShadow');
      margin-right: 10px;
    }
  }
  .export-icon-btn{
    cursor: pointer;
    height: 36px;
    padding: 7px 0;
  }
}
</style>
