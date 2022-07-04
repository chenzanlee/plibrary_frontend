<template>
  <div class="home">
    <!-- 头部导航 -->
    <nav-form
      ref="navForm"
      :data="navFormInfo.data"
      :field-list="navFormInfo.fieldList"
    />
    <el-scrollbar class="radio-scrollbar">
      <div class="radio">
        <el-button
          v-for="(j, k) in item"
          :key="k"
          :class="{ active: currentSort == k }"
          @click="active(j, k)"
        >
          {{ j.name }}  ({{ j.number }})</el-button>
      </div>
    </el-scrollbar>
    <!-- 表格内容 -->
    <tablePage
      ref="tables"
      :is-loading="isLoading"
      :loading="buttonLoading"
      :columns="columns"
      :data-source="tableData"
      :options="options"
      :pagination="pagination"
      :height="tableHeight"
      @handleSizeChange="handleSizeChange"
      @handleIndexChange="handleIndexChange"
      @selection-change="handleSelectionChange"
      @child-seeRow="childSeeRow"
    />
  </div>
</template>

<script>
import navForm from '@/components/commonComponent/navForm/index.vue'
import tablePage from '@/components/ElementComponent/iTable'
// import {
//   unitStatsForTask,
//   checkTask
// } from '@/http/api/autoDetectionTask/taskManagement.js'
import { getConfigElement } from '@/utils/overtService'
export default {
  components: {
    tablePage,
    navForm
  },
  data() {
    return {
      activeIndex: '',
      taskCheck: '',
      currentSort: '',
      tableHeight: '300',
      isLoading: false,
      dialogFormVisible: false,
      buttonLoading: false,
      unoperation: [], // 操作数据
      seletedRow: [], // 选中的数据
      defaultValue: [], // 默认选中
      // 查询条件
      search: {
        regionId: '', // 大区ID
        areaId: '', // 区域ID
        fieldId: '', // 场区ID
        block: '', // A座 or B座
        pageIndex: '', // 页码
        pageSize: '', // 页码显示数
        type: '',
        unit: ''
      },
      item: [
        { name: '全部', number: '' },
        { name: '待发送', number: '' },
        { name: '等待自检结果', number: '' },
        { name: '成功', number: '' },
        { name: '失败', number: '' }
      ],
      navFormInfo: {
        data: {
          area: '',
          time: '',
          keyword: '',
          duration: ''
        },
        fieldList: {
          left: {},
          right: {
            inpLists: [
              {
                key: 'unit',
                type: 'input',
                placeholder: '单元'
              }
            ],
            btnLists: [
              {
                innerText: '查询',
                className: 'btn-blue',
                authCode: 'unitAlarmSystemCheck:getFieldStats',
                handleClick: () => {
                //   this.dialogFormVisible = true
                  this.reset()
                }
              },
              {
                innerText: '刷新',
                className: 'btn-border',
                handleClick: () => {
                  this.getmyEvc()
                }
              },
              {
                innerText: '批量重试',
                className: 'btn-blue',
                authCode: '',
                handleClick: () => {
                  this.operation()
                }
              }
            ]
          }
        }
      },
      columns: [
        {
          prop: 'areaName',
          label: '区域'
        },
        {
          prop: 'fieldName',
          label: '场区'
        },
        {
          prop: 'roomTypeName',
          label: '猪舍类型'
        },
        {
          prop: 'unit',
          label: '单元'
        },
        {
          prop: 'areaName',
          label: '状态',
          rule: {
            1: '待发送',
            2: '等待自检结果',
            3: '成功',
            4: '失败'
          }
        },
        {
          prop: 'failReason',
          label: '自检失败原因'
        },
        {
          button: true,
          label: '操作',
          // fixed: 'right',
          width: '100', // 操作按钮宽度
          group: [
            {
              name: '重试',
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
        this.search.unit = n.unit || ''
      },
      deep: true
    }
  },
  async created() {
    // await this.getTree()

    // this.getcontrolInstruction();
  },
  methods: {
    // 默认选中
    defaultValueMe(arr) {
      if (!arr || arr.length === 0) {
        return
      }
      this.defaultValue.push(arr[0].value)
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
    // 获取区域联动数据
    // async getTree() {
    //   getRegionAreaFieldRoomTypeUnitV2().then((data) => {
    //     const arr = evcJsonh2Tree(data.data)
    //     arr.forEach(item => {
    //       if (item.children && item.children.length) {
    //         item.children.forEach(child => {
    //           if (child.children && child.children.length) {
    //             child.children.forEach(delItem => {
    //               delete delItem.children
    //             })
    //           }
    //         })
    //       }
    //     })
    //     this.navFormInfo.fieldList.right.inpLists[0].options = arr
    //   })
    //   await setTimeout((e) => {
    //     this.getmyEvcAlarmUnionLog()
    //   }, 50)
    // },
    // 二次查询、重置刷新table 并返回第一页
    reset(rows) {
      if (rows) {
        this.selection.forEach(row => {
          this.$refs.tables.$refs.tables.toggleRowSelection(row)
        })
      } else {
        this.$refs.tables.$refs.tables.clearSelection()
      }
      if (this.pagination.pageIndex > 1) {
        this.pagination.pageIndex = 1
        this.getmyEvcAlarmUnionLog()
      } else {
        this.getmyEvcAlarmUnionLog()
      }
    },
    getmyEvcAlarmUnionLog() {
      this.isLoading = true
      this.buttonLoading = true
      this.search.pageIndex = this.pagination.pageIndex
      this.search.pageSize = this.pagination.limit
      const obj = {
        fieldId: this.taskCheck.fieldId,
        limit: this.search.pageSize,
        page: this.search.pageIndex,
        taskId: this.taskCheck.mainId,
        keyword: this.search.unit,
        status: this.activeIndex
      }
      const element = getConfigElement('unitAlarmSystemCheck')
      console.log(element)
      this.$httpRequest({
        type: element ? element.getFieldStats.method : '',
        uri: element ? element.getFieldStats.uri : '',
        payload: obj,
        callback: (res) => {
          this.isLoading = false
          this.buttonLoading = false
          if (res && res.status === 200) {
            this.tableData = res.data.rows
            this.pagination.total = res.data.total
          }
        }
      })
      // unitStatsForTask(obj).then((res) => {
      //   this.isLoading = false
      //   this.buttonLoading = false
      //   this.tableData = res.data.rows
      //   this.pagination.total = res.data.total
      // }).catch(() => {
      //   this.isLoading = false
      //   this.buttonLoading = false
      // })
    },
    getmyEvc(rows) {
      if (rows) {
        this.selection.forEach(row => {
          this.$refs.tables.$refs.tables.toggleRowSelection(row)
        })
      } else {
        this.$refs.tables.$refs.tables.clearSelection()
      }
      const obj = {
        fieldId: this.taskCheck.fieldId,
        limit: this.pagination.limit,
        page: this.pagination.pageIndex,
        taskId: this.taskCheck.mainId
      }
      this.isLoading = true
      this.buttonLoading = true
      const element = getConfigElement('unitAlarmSystemCheck')
      console.log(element)
      this.$httpRequest({
        type: element ? element.getFieldStats.method : '',
        uri: element ? element.getFieldStats.uri : '',
        payload: obj,
        callback: (res) => {
          this.isLoading = false
          this.buttonLoading = false
          if (res && res.status === 200) {
            this.tableData = res.data.rows
            this.pagination.total = res.data.total
          }
        }
      })
      // unitStatsForTask(obj).then((res) => {
      //   this.isLoading = false
      //   this.buttonLoading = false
      //   this.tableData = res.data.rows
      //   this.pagination.total = res.data.total
      // }).catch(() => {
      //   this.isLoading = false
      //   this.buttonLoading = false
      // })
    },
    // 点查看和编辑前的操作
    seeAndEditBefore(row) {
      this.childSeeRow(row)
    },
    // 重试
    childSeeRow(row, index) {
      console.log(row, '选择的行数据')
      const obj = [
        {
          areaId: row.areaId,
          fieldId: row.fieldId,
          regionId: row.regionId,
          roomTypeId: row.roomTypeId,
          unit: row.unit,
          taskId: row.taskId,
          status: row.status
        }
      ]
      const element = getConfigElement('unitAlarmSystemCheck')
      console.log(element)
      this.$httpRequest({
        type: element ? element.checkUnitTask.method : '',
        uri: element ? element.checkUnitTask.uri : '',
        payload: obj,
        callback: (res) => {
          if (res && res.status === 200) {
            this.getmyEvc()
          }
        }
      })
      // checkTask(obj).then((res) => {
      // console.log(res)
      // this.$message({
      //   message: res.message,
      //   type: 'error'
      // })
      // })
      // this.getmyEvc()
    },
    // 复选框
    handleSelectionChange(selection) {
      this.unoperation = this.seletedRow = selection
    },
    active(item, index) {
      console.log('状态的点击事件', item, index)
      console.log('当前的大区', this.navFormInfo.data)
      this.currentSort = index
      let stat = ''
      if (index === 0) {
        stat = ''
      } else {
        stat = index
      }
      this.activeIndex = stat
      const obj = {
        fieldId: this.taskCheck.fieldId,
        limit: this.search.pageSize,
        page: this.search.pageIndex,
        keyword: this.search.unit,
        taskId: this.taskCheck.mainId,
        status: stat
      }
      this.isLoading = true
      this.buttonLoading = true
      const element = getConfigElement('unitAlarmSystemCheck')
      console.log(element)
      this.$httpRequest({
        type: element ? element.getFieldStats.method : '',
        uri: element ? element.getFieldStats.uri : '',
        payload: obj,
        callback: (res) => {
          this.isLoading = false
          this.buttonLoading = false
          if (res && res.status === 200) {
            this.tableData = res.data.rows
            this.item[0].number = res.data.stats.total
            this.item[1].number = res.data.stats.waitingNum
            this.item[2].number = res.data.stats.ongoingNum
            this.item[3].number = res.data.stats.successNum
            this.item[4].number = res.data.stats.failNum
            this.pagination.total = res.data.total
          }
        }
      })
      // unitStatsForTask(obj).then((res) => {
      //   this.tableData = res.data.rows
      //   this.item[0].number = res.data.stats.total
      //   this.item[1].number = res.data.stats.waitingNum
      //   this.item[2].number = res.data.stats.ongoingNum
      //   this.item[3].number = res.data.stats.successNum
      //   this.item[4].number = res.data.stats.failNum
      //   this.pagination.total = res.data.total
      //   this.isLoading = false
      //   this.buttonLoading = false
      // }).catch(() => {
      //   this.isLoading = false
      //   this.buttonLoading = false
      // })
    },
    // 操作
    operation() {
      if (this.unoperation.length === 0) {
        this.$message({
          message: '最少需要选择一条数据',
          type: 'warning'
        })
        return
      }
      const obj = []
      console.log(this.taskCheck, 'taskCheck')
      this.unoperation.map(res => {
        obj.push({
          areaId: this.taskCheck.areaId,
          fieldId: this.taskCheck.fieldId,
          regionId: this.taskCheck.regionId,
          roomTypeId: res.roomTypeId,
          unit: res.unit,
          taskId: this.taskCheck.mainId,
          status: res.status
        })
      })
      const element = getConfigElement('unitAlarmSystemCheck')
      console.log(element)
      this.$httpRequest({
        type: element ? element.checkUnitTask.method : '',
        uri: element ? element.checkUnitTask.uri : '',
        payload: obj,
        callback: (res) => {
          if (res && res.status === 200) {
            this.unoperation = []
            this.getmyEvc()
          }
        }
      })
      // checkTask(obj).then((res) => {
      //   // alert(res.data.message)
      //   this.unoperation = []
      // })
      // this.getmyEvc()
    },
    // 分页器页码
    handleIndexChange(current) {
      this.pagination.pageIndex = current
      this.getmyEvcAlarmUnionLog()
    },
    // 分页器一页多少条
    handleSizeChange(size) {
      this.pagination.limit = size
      this.getmyEvcAlarmUnionLog()
    },
    check(row) {
      this.taskCheck = row
      const obj = {
        fieldId: row.fieldId,
        limit: this.pagination.limit,
        page: this.pagination.pageIndex,
        taskId: row.mainId
      }
      this.isLoading = true
      this.buttonLoading = true
      const element = getConfigElement('unitAlarmSystemCheck')
      console.log(element)
      this.$httpRequest({
        type: element ? element.getFieldStats.method : '',
        uri: element ? element.getFieldStats.uri : '',
        payload: obj,
        callback: (res) => {
          this.isLoading = false
          this.buttonLoading = false
          if (res && res.status === 200) {
            this.tableData = res.data.rows
            this.item[0].number = res.data.stats.total
            this.item[1].number = res.data.stats.waitingNum
            this.item[2].number = res.data.stats.ongoingNum
            this.item[3].number = res.data.stats.successNum
            this.item[4].number = res.data.stats.failNum
            this.pagination.total = res.data.total
          }
        }
      })
      // unitStatsForTask(obj).then((res) => {
      //   this.tableData = res.data.rows
      //   this.item[0].number = res.data.stats.total
      //   this.item[1].number = res.data.stats.waitingNum
      //   this.item[2].number = res.data.stats.ongoingNum
      //   this.item[3].number = res.data.stats.successNum
      //   this.item[4].number = res.data.stats.failNum
      //   this.pagination.total = res.data.total
      //   this.isLoading = false
      //   this.buttonLoading = false
      // }).catch(() => {
      //   this.isLoading = false
      //   this.buttonLoading = false
      // })
    }
  }
}
</script>
<style>
.radio-scrollbar .el-scrollbar__wrap{
      overflow: auto;
}
</style>
<style lang="scss" scoped>
  .radio-scrollbar {
    padding-left: 10px;
    padding-right: 10px;
    .el-scrollbar__view {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .option {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      .layout {
        cursor: pointer;
        margin: 0 10px;
      }
      .full-screen {
        cursor: pointer;
      }
    }
  .el-scrollbar__wrap{
      overflow: auto;
  }
  }

.radio {
  height: 40px;
  display: flex;
  justify-content: end;
  // margin-bottom: 10px;
  button[type='button'] {
    padding: 3px 7px;
    font-size: 12px;
    background: transparent;
    border: 1px solid #42548b;
    color: #7894e3;
    padding: 0 5px;
    height: 24px;
  }
  button.active[type='button'] {
    color: #1fbfff;
    background: rgba(9, 30, 64, 0);
    border: 1px solid #1fbfff;
    box-shadow: inset 0 0 10px 0 #217bfc;
  }
}
</style>
