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
      :is-loading="isLoading"
      :loading="buttonLoading"
      :columns="columns"
      :data-source="tableData"
      :options="options"
      :pagination="pagination"
      @handleSizeChange="handleSizeChange"
      @handleIndexChange="handleIndexChange"
      @child-seeRow="childSeeRow"
      @child-editRow="editRow"
    />
    <el-dialog
      class="w90"
      :title="dialogTit"
      :modal-append-to-body="false"
      :visible.sync="unitDialogFormVisible"
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <div>
        <task-dialog ref="child" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import navForm from '@/components/commonComponent/navForm/index.vue'
import tablePage from '@/components/ElementComponent/iTable'
import { evcJsonh2Tree } from '@/components/tree/evcJsonh2Tree.js'
import { derive } from '@/http/api/siteLog.js'
import taskDialog from './unitDialog'
// import {
//   getmyEvcAlarmUnionLogForTask,
//   getRegionAreaFieldRoomTypeUnitV2,
//   statsForTask
// } from '@/http/api/autoDetectionTask/taskManagement.js'
import { getConfigElement } from '@/utils/overtService'
export default {
  components: {
    tablePage,
    navForm,
    taskDialog
  },
  data() {
    return {
      dialogTit: '单元自检情况及统计数据',
      taskCheckId: '',
      currentSort: '',
      isLoading: false,
      unitDialogFormVisible: false,
      buttonLoading: false,
      defaultValue: [], // 默认选中
      // 查询条件
      search: {
        regionId: '', // 大区ID
        areaId: '', // 区域ID
        fieldId: '', // 场区ID
        block: '', // A座 or B座
        pageIndex: '', // 页码
        pageSize: '', // 页码显示数
        type: ''
      },
      item: [
        { name: '全部', number: '' },
        { name: '待执行', number: '' },
        { name: '执行中', number: '' },
        { name: '已完成', number: '' }
      ],
      navFormInfo: {
        data: {
          area: '',
          time: '',
          keyword: '',
          duration: ''
        },
        fieldList: {
          right: {
            inpLists: [
              {
                key: 'area',
                type: 'cascader',
                className: 'shadow',
                placeholder: '请选择大区 / 区域 / 场区',
                options: [],
                customLabel: 'title',
                customValue: '',
                checkStrictly: true
              }
            ],
            btnLists: [
              {
                innerText: '查询',
                className: 'btn-blue',
                authCode: 'unitAlarmSystemCheck:getStatsForTask',
                handleClick: () => {
                //   this.unitDialogFormVisible = true
                  this.reset()
                }
              },
              {
                innerText: '刷新',
                className: 'btn-border',
                handleClick: () => {
                  this.refresh()
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
        },
        {
          prop: 'areaName',
          label: '区域'
        },
        {
          longData: 'true',
          prop: 'fieldName',
          label: '场区'
        },
        {
          prop: 'taskStatus',
          label: '状态',
          rule: {
            1: '待执行',
            2: '执行中',
            3: '已完成'
          }
        },
        {
          prop: 'unitNum',
          label: '单元总数'
        },
        {
          prop: 'finishedUnitNum',
          label: '已完成单元数'
        },
        {
          prop: 'successUnitNum',
          label: '检测成功单元数'
        },
        {
          prop: 'failedUnitNum',
          label: '检测失败单元数'
        },
        {
          prop: 'crtTime',
          label: '创建时间',
          width: '150'
        },
        {
          prop: 'updTime',
          label: '更新时间',
          width: '150'
        },
        {
          button: true,
          label: '操作',
          fixed: 'right',
          align: 'center',
          width: '160', // 操作按钮宽度
          group: [
            {
              name: '查看',
              class: 'btn-blue',
              size: 'auto',
              authCode: 'unitAlarmSystemCheck:getFieldStats',
              click: 'see'
            },
            {
              name: '导出',
              class: 'btn-blue',
              size: 'auto',
              click: 'edit'
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
        this.search.regionId = n.area[0] || ''
        this.search.areaId = n.area[1] || ''
        this.search.fieldId = n.area[2] || ''
      },
      deep: true
    }
  },
  async created() {
    await this.getTree()

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
    async getTree() {
      const element = getConfigElement('unit-evcDataInterface')
      console.log(element)
      await this.$httpRequest({
        type: element ? element.getRegionAreaFieldRoomTypeUnitV2.method : '',
        uri: element ? element.getRegionAreaFieldRoomTypeUnitV2.uri : '',
        payload: '',
        callback: (res) => {
          if (res && res.status === 200 && res.rel) {
            const arr = evcJsonh2Tree(res.data)
            arr.forEach(item => {
              if (item.children && item.children.length) {
                item.children.forEach(child => {
                  if (child.children && child.children.length) {
                    child.children.forEach(delItem => {
                      delete delItem.children
                    })
                  }
                })
              }
            })
            this.navFormInfo.fieldList.right.inpLists[0].options = arr
          }
        }
      })
      // getRegionAreaFieldRoomTypeUnitV2().then((data) => {
      //   const arr = evcJsonh2Tree(data.data)
      //   arr.forEach(item => {
      //     if (item.children && item.children.length) {
      //       item.children.forEach(child => {
      //         if (child.children && child.children.length) {
      //           child.children.forEach(delItem => {
      //             delete delItem.children
      //           })
      //         }
      //       })
      //     }
      //   })
      //   this.navFormInfo.fieldList.right.inpLists[0].options = arr
      // })
    //   await setTimeout((e) => {
    //     this.getmyEvcAlarmUnionLog()
    //   }, 50)
    },
    // 二次查询、重置刷新table 并返回第一页
    reset() {
      if (this.pagination.pageIndex > 1) {
        this.pagination.pageIndex = 1
        this.getmyEvcAlarmUnionLog()
      } else {
        this.getmyEvcAlarmUnionLog()
      }
    },
    getmyEvcAlarmUnionLog() {
      if (this.search.regionId === '') {
        this.tableData = []
        this.pagination.total = 0
        this.$forceUpdate()
        this.$message({
          message: '请选择大区',
          type: 'warning'
        })
        return
      }

      this.isLoading = true
      this.buttonLoading = true
      this.search.pageIndex = this.pagination.pageIndex
      this.search.pageSize = this.pagination.limit
      const obj = {
        areaId: this.search.areaId,
        fieldId: this.search.fieldId,
        limit: this.search.pageSize,
        page: this.search.pageIndex,
        regionId: this.search.regionId,
        taskId: this.taskCheckId.id
      }
      const element = getConfigElement('unitAlarmSystemCheck')
      console.log(element)
      this.$httpRequest({
        type: element ? element.getStatsForTask.method : '',
        uri: element ? element.getStatsForTask.uri : '',
        payload: obj,
        callback: (res) => {
          this.isLoading = false
          this.buttonLoading = false
          if (res && res.status === 200) {
            this.tableData = res.data.rows
            const arr = res.data.rows
            if (arr != null) {
              arr.forEach((item, idx) => {
                // arr.alarmTime = arr.alarmTime.split('T')[0]+' '+arr.alarmTime.split('T')[1].substring(0,8)
                if (arr[idx].endTime === null) {
                  arr[idx].endTime = ''
                } else {
                  const date = arr[idx].endTime
                  arr[idx].endTime = this.timeFommater(date)
                }
                const date2 = arr[idx].beginTime
                arr[idx].beginTime = this.timeFommater(date2)
              })
            }
            this.tableData = arr
            this.pagination.total = res.data.total
          }
        }
      })
      // getmyEvcAlarmUnionLogForTask(obj).then((res) => {
      //   this.isLoading = false
      //   this.buttonLoading = false
      //   this.tableData = res.data.rows
      //   const arr = res.data.rows
      //   if (arr != null) {
      //     arr.forEach((item, idx) => {
      //       // arr.alarmTime = arr.alarmTime.split('T')[0]+' '+arr.alarmTime.split('T')[1].substring(0,8)
      //       if (arr[idx].endTime === null) {
      //         arr[idx].endTime = ''
      //       } else {
      //         const date = arr[idx].endTime
      //         arr[idx].endTime = this.timeFommater(date)
      //       }
      //       const date2 = arr[idx].beginTime
      //       arr[idx].beginTime = this.timeFommater(date2)
      //     })
      //   }
      //   this.tableData = arr
      //   this.pagination.total = res.data.total
      // }).catch(() => {
      //   this.isLoading = false
      //   this.buttonLoading = false
      // })
    },
    // 点查看和编辑前的操作
    seeAndEditBefore(row) {
      this.childSeeRow(row)
      this.editRow(row)
    },
    // 点查看
    childSeeRow(row, index) {
      console.log(row, '选择的行数据')
      this.unitDialogFormVisible = true
      setTimeout(() => {
        this.$refs.child.check(row)
      }, 100)
    },
    // 导出
    editRow(row, index) {
      console.log(row, '选择的行数据')
      const obj = { taskId: row.mainId }
      derive('/api/unit_evc/fieldAlarmCheckUnitStatus/export', obj)
    },
    goTaskList() {
      this.$router.push({
        name: 'taskManagement'
      })
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
      const obj = {
        areaId: this.search.areaId,
        fieldId: this.search.fieldId,
        limit: this.search.pageSize,
        page: this.search.pageIndex,
        regionId: this.search.regionId,
        taskId: this.taskCheckId.id,
        taskStatus: stat
      }
      this.isLoading = true
      this.buttonLoading = true
      const element = getConfigElement('unitAlarmSystemCheck')
      console.log(element)
      this.$httpRequest({
        type: element ? element.getStatsForTask.method : '',
        uri: element ? element.getStatsForTask.uri : '',
        payload: obj,
        callback: (res) => {
          this.isLoading = false
          this.buttonLoading = false
          if (res && res.status === 200) {
            this.tableData = res.data.rows
            this.item[0].number = res.data.stats.total
            this.item[1].number = res.data.stats.waitNum
            this.item[2].number = res.data.stats.ongoingNum
            this.item[3].number = res.data.stats.finishedNum
            this.pagination.total = res.data.total
          }
        }
      })
      // statsForTask(obj).then((res) => {
      //   this.tableData = res.data.rows
      //   this.item[0].number = res.data.stats.total
      //   this.item[1].number = res.data.stats.waitNum
      //   this.item[2].number = res.data.stats.ongoingNum
      //   this.item[3].number = res.data.stats.finishedNum
      //   this.pagination.total = res.data.total
      //   this.isLoading = false
      //   this.buttonLoading = false
      // }).catch(() => {
      //   this.isLoading = false
      //   this.buttonLoading = false
      // })
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
      this.taskCheckId = row
      const obj = {
        fieldId: row.fieldId,
        limit: this.pagination.limit,
        page: this.pagination.pageIndex,
        taskId: row.id
      }
      this.isLoading = true
      this.buttonLoading = true
      const element = getConfigElement('unitAlarmSystemCheck')
      console.log(element)
      this.$httpRequest({
        type: element ? element.getStatsForTask.method : '',
        uri: element ? element.getStatsForTask.uri : '',
        payload: obj,
        callback: (res) => {
          this.isLoading = false
          this.buttonLoading = false
          if (res && res.status === 200) {
            this.tableData = res.data.rows
            this.item[0].number = res.data.stats.total
            this.item[1].number = res.data.stats.waitNum
            this.item[2].number = res.data.stats.ongoingNum
            this.item[3].number = res.data.stats.finishedNum
            this.pagination.total = res.data.total
          }
        }
      })
      // statsForTask(obj).then((res) => {
      //   this.tableData = res.data.rows
      //   this.item[0].number = res.data.stats.total
      //   this.item[1].number = res.data.stats.waitNum
      //   this.item[2].number = res.data.stats.ongoingNum
      //   this.item[3].number = res.data.stats.finishedNum
      //   this.pagination.total = res.data.total
      //   this.isLoading = false
      //   this.buttonLoading = false
      // }).catch(() => {
      //   this.isLoading = false
      //   this.buttonLoading = false
      // })
    },
    refresh() {
      let obj = {}
      if (this.search.regionId !== '') {
        obj = {
          regionId: this.search.regionId,
          areaId: this.search.areaId,
          fieldId: this.search.fieldId,
          limit: this.pagination.limit,
          page: this.pagination.pageIndex,
          taskId: this.taskCheckId.id
        }
      } else {
        obj = {
          limit: this.pagination.limit,
          page: this.pagination.pageIndex,
          taskId: this.taskCheckId.id
        }
      }
      this.isLoading = true
      this.buttonLoading = true
      const element = getConfigElement('unitAlarmSystemCheck')
      console.log(element)
      this.$httpRequest({
        type: element ? element.getStatsForTask.method : '',
        uri: element ? element.getStatsForTask.uri : '',
        payload: obj,
        callback: (res) => {
          this.isLoading = false
          this.buttonLoading = false
          if (res && res.status === 200) {
            this.tableData = res.data.rows
            this.item[0].number = res.data.stats.total
            this.item[1].number = res.data.stats.waitNum
            this.item[2].number = res.data.stats.ongoingNum
            this.item[3].number = res.data.stats.finishedNum
            this.pagination.total = res.data.total
          }
        }
      })
      // statsForTask(obj).then((res) => {
      //   this.tableData = res.data.rows
      //   this.item[0].number = res.data.stats.total
      //   this.item[1].number = res.data.stats.waitNum
      //   this.item[2].number = res.data.stats.ongoingNum
      //   this.item[3].number = res.data.stats.finishedNum
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
  .w90 .el-dialog{
      width: 90% !important;
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
    // border: 1px solid #42548b;
    border: 1px solid;
    @include border_color("taskTagBorderColor");
    // color: #7894e3;
    @include font_color('taskTagFontColor');
    padding: 0 5px;
    height: 24px;
  }
  button.active[type='button'] {
    // color: #1fbfff;
    @include font_color('environmentTagActiveFontColor');
    // background: rgba(9, 30, 64, 0);
    @include background("taskTagBackGround");
    // border: 1px solid #1fbfff;
    border: 1px solid;
    @include border_color("environmentTagActiveFontColor");
    // box-shadow: inset 0 0 10px 0 #217bfc;
    @include box_shadow("taskTagBoxShadow");
  }
}
</style>
