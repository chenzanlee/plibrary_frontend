<template>
  <div class="home parameter parameterChange">
    <!-- 头部导航 -->
    <nav-form
      ref="navForm"
      :data="navFormInfo.data"
      :field-list="navFormInfo.fieldList"
      @cascaderEvent="cascaderEvent"
      @cascaderEvent2="cascaderEvent2"
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
      <span slot="right" :authCode="'paramChangeLog:exportAlarmLog'" @click="exportData()">
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
      :loading="buttonLoading"
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
import { evcJsonh2Tree } from '@/components/tree/evcJsonh2Tree.js'
import { derive } from '@/http/api/exportData/export'
import { getConfigElement } from '@/utils/overtService'
// import { getTreeData } from '../common.js'
// import {
//   siteUnitAlarmLog,
//   getRegionAreaFieldRoomTypeUnitV2
// } from '@/http/api/siteLog.js'
import { deleteObjectPropertyOfno } from '@/lib/utils/index'
import {
  getRegionAreaFieldTree,
  getRootTypeUnitTreeV2
} from '@/http/api/baseInfo/regionAreaField.js'
export default {
  components: {
    tablePage,
    navForm
  },
  data() {
    return {
      activeTab: 'notBuliding',
      nameList: [], // 这个对应大区/区域/厂区/猪舍类型/单元。
      nameList2: [],
      defaultTitle: [],
      isLoading: false,
      buttonLoading: false,
      defaultValue: [], // 默认选中
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
        type: 'PARAM_CHANGE'
      },
      navFormInfo: {
        data: {
          area: [],
          roomtypeUnit: [],
          time: '',
          keyword: '',
          push: ''
        },
        fieldList: {
          right: {
            inpLists: [
              {
                key: 'area',
                type: 'cascader',
                className: 'shadow',
                placeholder: '大区 / 区域 / 场区',
                width: '200px',
                options: [],
                customLabel: 'title',
                customValue: '',
                clearable: true,
                valueKey: 0,
                checkStrictly: true
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
              }, {
                key: 'push',
                type: 'select',
                label: '',
                className: 'shadow',
                placeholder: '推送状态',
                clearable: 'clearable',
                list: [
                  { key: '推送', value: 1 },
                  { key: '不推送', value: 0 }
                ],
                required: true,
                rules: [
                  { required: true, message: '请选择推送状态', trigger: 'blur' }
                ]
              },
              {
                key: 'keyword',
                type: 'input',
                required: true,
                className: 'shadow',
                placeholder: '请输入关键字'
              }
            ],
            btnLists: [
              {
                innerText: '查询',
                className: 'btn-blue',
                authCode: 'paramChangeLog:get_unit_alarm_logs',
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
                  this.search.keyword = ''
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
          longData: true,
          prop: 'content',
          label: '报警信息',
          minWidth: '260'
        },
        {
          prop: 'push',
          label: '是否推送',
          width: '80',
          rule: {
            1: '是',
            0: '否'
          }
        },
        {
          prop: 'noticeUserNames',
          label: '报警推送人员',
          width: '150'
        },
        {
          longData: true,
          prop: 'alarmTime',
          label: '报警时间',
          width: '180'
          // render: (h, params) => {
          //   return h('div', this.formatDate(params.row.alarmTime) || '---')
          // }
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
        const { keyword, push } = n
        this.search.push = push
        this.search.keyword = keyword || ''
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
      console.log(pathLabels)
      this.nameList2 = pathLabels
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
    // 获取正确的事件格式
    formatDate(datevalue) {
      var date = new Date(datevalue)
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
    // 获取区域联动数据
    async getTree() {
      let json = ''
      const element = getConfigElement('unit-evcDataInterface')
      console.log(element)
      await this.$httpRequest({
        type: element ? element.getRegionAreaFieldRoomTypeUnitV2.method : '',
        uri: element ? element.getRegionAreaFieldRoomTypeUnitV2.uri : '',
        payload: '',
        callback: (res) => {
          if (res && res.status === 200 && res.rel) {
            json = res.data
          }
        }
      })
      // await getRegionAreaFieldRoomTypeUnitV2().then((data) => {
      //   json = data.data
      // })
      this.navFormInfo.fieldList.right.inpLists[0].options = await evcJsonh2Tree(
        json
      )
      await this.defaultValueMe(this.navFormInfo.fieldList.right.inpLists[0].options)
      // this.navFormInfo.data.area = this.defaultValue
      this.nameList = this.defaultTitle
      this.search.fromTime = this.formatDate(new Date(new Date().setHours(0, 0, 0, 0)))
      this.search.toTime = this.formatDate(new Date().getTime())
      this.navFormInfo.data.time = [this.search.fromTime, this.search.toTime]
      // this.$nextTick(() => {
      //   this.getsiteUnitAlarmLog()
      // })
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
      this.search.areaId = this.navFormInfo.data.area[1] || ''
      this.search.fieldId = this.navFormInfo.data.area[2] || ''
      // ----
      // console.log(this.nameList)
      this.search.block = (this.navFormInfo.data.roomtypeUnit[0] === 'BLOCK_B' || this.navFormInfo.data.roomtypeUnit[0] === 'BLOCK_A') ? this.navFormInfo.data.roomtypeUnit[0] : ''
      this.search.roomTypeId = (this.navFormInfo.data.roomtypeUnit[0] === 'BLOCK_B' || this.navFormInfo.data.roomtypeUnit[0] === 'BLOCK_A') ? this.navFormInfo.data.roomtypeUnit[1] : this.navFormInfo.data.roomtypeUnit[0]
      this.search.unitName = (this.navFormInfo.data.roomtypeUnit[0] === 'BLOCK_B' || this.navFormInfo.data.roomtypeUnit[0] === 'BLOCK_A') ? this.nameList2[2] : this.nameList2[1]
      if (this.search.regionId === '') {
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
      this.isLoading = true
      this.buttonLoading = true
      this.search.pageIndex = this.pagination.pageIndex
      this.search.pageSize = this.pagination.limit
      const obj = {
        push: this.search.push,
        keyword: this.search.keyword, // 关键字
        fromTime: this.search.fromTime, // 开始时间
        toTime: this.search.toTime, // 结束时间
        regionId: this.search.regionId, // 大区ID
        areaId: this.search.areaId, // 区域ID
        fieldId: this.search.fieldId, // 场区ID
        block: this.search.block, // A座 or B座
        roomTypeId: this.search.roomTypeId, // 舍ID
        unitName: this.search.unitName, // 单元ID
        pageIndex: this.search.pageIndex, // 页码
        pageSize: this.search.pageSize, // 页码显示数
        type: this.search.type
      }
      const o = deleteObjectPropertyOfno(obj)
      const element = getConfigElement('paramChangeLog')
      console.log(element)
      this.$httpRequest({
        type: element ? element.get_unit_alarm_logs.method : '',
        uri: element ? element.get_unit_alarm_logs.uri : '',
        payload: o,
        callback: (res) => {
          this.isLoading = false
          this.buttonLoading = false
          if (res && res.status === 200) {
            // this.isLoading = false
            // this.buttonLoading = false
            this.tableData = res.data.rows
            const arr = res.data.rows
            if (arr.length > 0) {
              arr.forEach((item, idx) => {
                const date = arr[idx].alarmTime
                arr[idx].alarmTime = this.formatDate(date)
              })
            }
            this.tableData = arr
            this.pagination.total = res.data.total
          }
        }
      })
      // siteUnitAlarmLog(o).then((res) => {
      //   this.isLoading = false
      //   this.buttonLoading = false
      //   this.tableData = res.data.rows
      //   const arr = res.data.rows
      //   this.tableData = arr
      //   this.pagination.total = res.data.total
      // }).catch(() => {
      //   this.isLoading = false
      //   this.buttonLoading = false
      // })
    },
    // 导出
    exportData() {
      this.search.pageIndex = this.pagination.pageIndex
      this.search.pageSize = this.pagination.limit
      this.search.regionId = this.navFormInfo.data.area[0] || ''
      this.search.areaId = this.navFormInfo.data.area[1] || ''
      this.search.fieldId = this.navFormInfo.data.area[2] || ''
      // ----
      // console.log(this.nameList)
      this.search.block = (this.navFormInfo.data.roomtypeUnit[0] === 'BLOCK_B' || this.navFormInfo.data.roomtypeUnit[0] === 'BLOCK_A') ? this.navFormInfo.data.roomtypeUnit[0] : ''
      this.search.roomTypeId = (this.navFormInfo.data.roomtypeUnit[0] === 'BLOCK_B' || this.navFormInfo.data.roomtypeUnit[0] === 'BLOCK_A') ? this.navFormInfo.data.roomtypeUnit[1] : this.navFormInfo.data.roomtypeUnit[0]
      this.search.unitName = (this.navFormInfo.data.roomtypeUnit[0] === 'BLOCK_B' || this.navFormInfo.data.roomtypeUnit[0] === 'BLOCK_A') ? this.nameList2[2] : this.nameList2[1]
      if (this.search.regionId === '') {
        this.$message({
          message: '至少需要选择大区',
          type: 'warning'
        })
        return
      }
      console.log(this.search, 33333)
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
      const obj = {
        ...this.search,
        regionName: this.nameList[0] || '',
        areaName: this.nameList[1] || '',
        fieldName: this.nameList[2] || '',
        roomTypeName: (this.nameList[3] === 'A座' || this.nameList[3] === 'B座') ? this.nameList[4] : this.nameList[3]
      }
      const element = getConfigElement('paramChangeLog')
      console.log('deleteObjectPropertyOfno(obj)', deleteObjectPropertyOfno(obj))
      const url = element ? element.exportAlarmLog.uri : ''
      derive('/api' + url, deleteObjectPropertyOfno(obj))
    },
    // 分页器页码
    handleIndexChange(current) {
      this.pagination.pageIndex = current
      this.getsiteUnitAlarmLog()
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
.parameterChange {
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
