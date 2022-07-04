<template>
  <div class="home parameter paramReportLog">
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
      <span slot="right" :authCode="'paramReportLog:export'" @click="exportData()">
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
    />
  </div>
</template>

<script>
import navForm from '@/components/commonComponent/navForm/index.vue'
import tablePage from '@/components/ElementComponent/iTable'
import { evcJsonh2Tree } from '@/components/tree/evcJsonh2Tree.js'
import { getConfigElement } from '@/utils/overtService'
// import {
//   getRegionAreaFieldRoomTypeUnitV2,
//   getPushLogsList
// } from '@/http/api/siteLog.js'
import {
  downloadBlob
} from '@/http/api/exportData/export'
// import { getTreeData } from '../common.js'
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
      isLoading: false,
      navFormInfo: {
        data: {
          area: [],
          roomtypeUnit: [],
          time: [],
          deviceId: ''
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
                clearable: true,
                width: '200px',
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
              },
              {
                key: 'deviceId',
                type: 'input',
                className: 'shadow',
                placeholder: '请输入设备ID'
              }
            ],
            btnLists: [
              {
                innerText: '查询',
                className: 'btn-blue',
                authCode: 'paramReportLog:pushLogs',
                handleClick: () => {
                  const { area, time } = this.navFormInfo.data
                  this.tableData = []
                  if (area.length === 0) {
                    this.$message.warning('至少需要选择大区')
                    return false
                  }
                  if (!time || time.length === 0) {
                    this.$message.warning('请选择查询时间段')
                    return false
                  }
                  this.pagination.pageIndex = 1
                  this.getPushLogsList()
                }
              },
              {
                innerText: '重置',
                className: 'btn-border',
                handleClick: () => {
                  this.$refs['navForm'].resetFields()
                  // const fromTime = this.formatDate(new Date().getTime() - (86400000 * 1))
                  // const toTime = this.formatDate(new Date().getTime())
                  // this.navFormInfo.data.time = [fromTime, toTime]
                  this.tableData = []
                  this.pagination.total = 0
                  this.pagination.pageIndex = 1
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
          prop: 'location',
          label: '位置信息',
          width: '200'
        },
        {
          longData: true,
          prop: 'deviceId',
          label: '设备ID',
          width: '200'
        },
        {
          longData: true,
          prop: 'content',
          label: '内容'
        },
        {
          prop: 'reportTime',
          label: '上报时间',
          width: '170',
          render: (h, val) => {
            console.log('11111111111111111111', val.row.reportTime)
            return h('span', this.timeFommater(val.row.reportTime))
          }
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
      },
      nameList: [], // 这个对应大区/区域/厂区/猪舍类型/单元。。。的名字
      nameList2: []
    }
  },
  watch: {
    // 赋值搜索条件
    'navFormInfo.data': {
      handler: function(n) {
        if (n.area.length === 0) {
          this.navFormInfo.fieldList.right.inpLists[0].valueKey++ // 只要监听到数据源发生变化 ，改变keyValue的值，达到重新渲染的效果
          this.navFormInfo.fieldList.right.inpLists[1].valueKey++
        }
      },
      deep: true
    }
  },
  async created() {
    const fromTime = this.formatDate(new Date(new Date().setHours(0, 0, 0, 0)))
    const toTime = this.formatDate(new Date().getTime())
    this.navFormInfo.data.time = [fromTime, toTime]
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
        if (obj[key] === null || obj[key] === '' || obj[key] === undefined) {
          delete obj[key]
        }
      }
      return obj
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
      this.nameList2 = pathLabels
    },
    // 获取列表
    getPushLogsList() { // 获取参数上报日志 列表
      const { area, roomtypeUnit, time, deviceId } = this.navFormInfo.data
      const o = {
        regionId: area[0] || '',
        areaId: area[1] || '',
        fieldId: area[2] || '',
        block: (roomtypeUnit[0] === 'BLOCK_B' || roomtypeUnit[0] === 'BLOCK_A') ? roomtypeUnit[0] : '',
        roomTypeId: (roomtypeUnit[0] === 'BLOCK_B' || roomtypeUnit[0] === 'BLOCK_A') ? roomtypeUnit[1] : roomtypeUnit[0], // 工段ID ---> 猪舍类型ID
        // unitId: (area[3] === 'BLOCK_B' || area[3] === 'BLOCK_A') ? area[5] : area[4],
        unitName: (roomtypeUnit[0] === 'BLOCK_B' || roomtypeUnit[0] === 'BLOCK_A') ? this.nameList2[2] : this.nameList2[1],
        fromTime: time[0] || '',
        toTime: time[1] || '',
        deviceId: deviceId,
        // regionName: regionName || '',
        // areaName: areaName || '',
        // fieldName: fieldName || '',
        pageIndex: this.pagination.pageIndex,
        pageSize: this.pagination.limit
      }
      if (this.navFormInfo.data.time.length) {
        if (this.$moment(this.navFormInfo.data.time[1]).subtract(7, 'days') > this.$moment(this.navFormInfo.data.time[0])) {
          this.$message({
            message: '最多查看7天内的日志信息',
            type: 'warning'
          })
          return
        }
      }
      this.isLoading = true
      const element = getConfigElement('paramReportLog')
      console.log(element)
      this.$httpRequest({
        type: element ? element.pushLogs.method : '',
        uri: element ? element.pushLogs.uri : '',
        payload: this.handleObj(o),
        callback: (res) => {
          this.isLoading = false
          if (res && res.status === 200) {
            this.pagination.total = res.data.total
            this.tableData = res.data.rows
          } else {
            this.$message.error(res.message || '获取列表失败')
          }
        }
      })
      // getPushLogsList(this.handleObj(o)).then(res => {
      //   this.isLoading = false
      //   if (res && res.status === 200) {
      //     this.pagination.total = res.data.total
      //     this.tableData = res.data.rows
      //   } else {
      //     this.$message.error(res.message || '获取列表失败')
      //   }
      // }).catch(err => { this.$message.error(err.message || '服务器错误') })
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
    // 调用取 值
    recursiveGetVal(arr, key) {
      if (!arr || arr.length === 0) return []
      const tepArr = []
      function selfDo(arr, key) {
        const obj = arr[0]
        tepArr.push(obj[key])
        if (obj.children && obj.children.length > 0) {
          selfDo(obj.children, key)
        }
      }
      selfDo(arr, key)
      return tepArr
    },
    // 获取区域联动数据
    async getTree() {
      const element = getConfigElement('unit-evcDataInterface')
      console.log(element)
      this.$httpRequest({
        type: element ? element.getRegionAreaFieldRoomTypeUnitV2.method : '',
        uri: element ? element.getRegionAreaFieldRoomTypeUnitV2.uri : '',
        payload: '',
        callback: (res) => {
          if (res && res.status === 200 && res.rel) {
            const arr = evcJsonh2Tree(res.data)
            this.navFormInfo.fieldList.right.inpLists[0].options = arr
            this.nameList = this.recursiveGetVal(arr, 'title') // 赋初值
          } else {
            console.log('获取区域联动数据失败', res.message)
          }
        }
      })
      // getRegionAreaFieldRoomTypeUnitV2().then((res) => {
      //   if (res && res.status === 200 && res.rel) {
      //     const arr = evcJsonh2Tree(res.data)
      //     this.navFormInfo.fieldList.right.inpLists[0].options = arr
      //     // this.navFormInfo.data.area = this.recursiveGetVal(arr, 'value')
      //     this.nameList = this.recursiveGetVal(arr, 'title') // 赋初值
      //     // this.$nextTick(() => {
      //     //   this.getPushLogsList()
      //     // })
      //   } else {
      //     console.log('获取区域联动数据失败', res.message)
      //   }
      // }).catch(err => {
      //   console.log('获取区域联动数据失败', err.message)
      // })
    },
    getOptions(json) {
      this.navFormInfo.fieldList.right.inpLists[0].options = json
    },
    exportData() {
      const { area, roomtypeUnit, time, deviceId } = this.navFormInfo.data
      if (area.length === 0) {
        this.$message.warning('至少需要选择大区')
        return false
      }
      if (!time || time.length === 0) {
        this.$message.warning('请选择导出时间段')
        return false
      }
      if (this.$moment(this.navFormInfo.data.time[1]).subtract(7, 'days') > this.$moment(this.navFormInfo.data.time[0])) {
        this.$message({
          message: '最多导出7天内的日志信息',
          type: 'warning'
        })
        return
      }
      const o = {
        regionId: area[0] || '',
        areaId: area[1] || '',
        fieldId: area[2] || '',
        block: (roomtypeUnit[0] === 'BLOCK_B' || roomtypeUnit[0] === 'BLOCK_A') ? roomtypeUnit[0] : '',
        roomTypeId: (roomtypeUnit[0] === 'BLOCK_B' || roomtypeUnit[0] === 'BLOCK_A') ? roomtypeUnit[1] : roomtypeUnit[0], // 工段ID ---> 猪舍类型ID
        // unitId: (area[3] === 'BLOCK_B' || area[3] === 'BLOCK_A') ? area[5] : area[4],
        unitName: (roomtypeUnit[0] === 'BLOCK_B' || roomtypeUnit[0] === 'BLOCK_A') ? this.nameList2[2] : this.nameList2[1],
        fromTime: time[0] || '',
        toTime: time[1] || '',
        // regionName: this.nameList[0] || '',
        // areaName: this.nameList[1] || '',
        // fieldName: this.nameList[2] || '',
        deviceId: deviceId
      }
      const element = getConfigElement('paramReportLog')
      const url = element ? element.export.uri : ''
      downloadBlob('/api' + url, this.handleObj(o)).then(res => {
        console.log(res)
      }).catch(() => {
        this.$message.error('导出失败')
      })
    },
    // 分页器页码
    handleIndexChange(current) {
      this.pagination.pageIndex = current
      this.getPushLogsList()
    },
    // 分页器一页多少条
    handleSizeChange(size) {
      this.pagination.limit = size
      this.getPushLogsList()
    }
  }
}
</script>
<style lang="scss">
.paramReportLog {
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
