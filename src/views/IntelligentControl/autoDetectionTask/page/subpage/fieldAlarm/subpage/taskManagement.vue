<template>
  <div class="home dialog90">
    <!-- 头部导航 -->
    <nav-form
      ref="navForm"
      style="margin-bottom:10px;"
      :data="navFormInfo.data"
      :field-list="navFormInfo.fieldList"
    >
      <span slot="right">
        <button class="btn-blue backW70" @click="goBack()"><i class="iconfont">&#xe61d;</i>返回</button>
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
      @child-seeRow="childSeeRow"
      @child-editRow="editRow"
    />
    <el-dialog
      class="w90"
      :title="dialogTit"
      :modal-append-to-body="false"
      :visible.sync="dialogFormVisible"
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
import { derive } from '@/http/api/exportData/export'
import taskDialog from '../../../../component/dialog'
import { getConfigElement } from '@/utils/overtService'
// import {
//   myEvcAlarmUnionLog,
//   getRegionAreaFieldRoomTypeUnitV2
// } from '@/http/api/autoDetectionTask/taskManagement.js'
export default {
  components: {
    tablePage,
    navForm,
    taskDialog
  },
  data() {
    return {
      propObj: this.$route,
      optionsList: [],
      dialogTit: '场区进度列表及数据统计',
      isLoading: false,
      dialogFormVisible: false,
      buttonLoading: false,
      defaultValue: [], // 默认选中
      // 查询条件
      search: {
        regionId: '-11', // 大区ID
        areaId: '-101', // 区域ID
        fieldId: '-1001', // 场区ID
        block: '', // A座 or B座
        pageIndex: '', // 页码
        pageSize: '', // 页码显示数
        type: ''
      },
      navFormInfo: {
        data: {
          area: ''
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
                clearable: true,
                customLabel: 'title',
                customValue: '',
                checkStrictly: true
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
                  this.$refs['navForm'].resetFields()
                }
              },
              {
                innerText: '刷新',
                className: 'btn-border',
                handleClick: () => {
                  this.reset()
                }
              }
            ]
          }
        }
      },
      columns: [
        {
          longData: 'true',
          prop: 'id',
          label: '任务编码',
          width: '250'
        },
        {
          longData: 'true',
          prop: 'fieldNames',
          label: '场区名称',
          width: '200'
        },
        {
          prop: 'totalFieldNum',
          label: '场区数',
          width: 100
        },
        {
          prop: 'finishedFieldNum',
          label: '已完成检测的场区',
          width: 150
        },
        {
          prop: 'ongoingFieldNum',
          label: '正在检测的场区',
          width: 130
        },
        {
          prop: 'waitingFieldNum',
          label: '待检测的场区',
          width: 120
        },
        {
          prop: 'taskStatus',
          label: '状态',
          rule: {
            1: '待检测',
            2: '执行中',
            3: '已完成'
          }
        },
        {
          prop: 'crtName',
          label: '创建人'
        },
        {
          longData: 'true',
          prop: 'crtTime',
          label: '创建时间',
          width: '150'
        },
        {
          longData: 'true',
          prop: 'updTime',
          label: '更新时间',
          width: '150'
        },
        {
          button: true,
          label: '单元详情',
          fixed: 'right',
          width: '160',
          group: [
            {
              name: '查看',
              class: 'btn-blue',
              size: 'auto',
              authCode: 'unitAlarmSystemCheck:getStatsForTask',
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
    await this.getmyEvcAlarmUnionLog()
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
    },
    // 二次查询、重置刷新table 并返回第一页
    reset() {
      if (this.pagination.pageIndex > 1) {
        this.pagination.pageIndex = 1
        this.resetGetmyEvcAlarmLog()
      } else {
        this.resetGetmyEvcAlarmLog()
      }
    },
    getmyEvcAlarmUnionLog() {
      console.log(this.$route, 1111111)
      this.isLoading = true
      this.buttonLoading = true
      let obj = {}
      if (this.$route.params.selectedOption) {
        obj = {
          regionId: this.$route.params.selectedOption[0],
          regionName: this.$route.params.selectedLabel[0],
          areaId: this.$route.params.selectedOption[1],
          areaName: this.$route.params.selectedLabel[1],
          fieldId: this.$route.params.selectedOption[2],
          fieldName: this.$route.params.selectedLabel[2],
          limit: this.pagination.limit,
          page: this.pagination.pageIndex
        }
      } else {
        obj = {
          limit: this.pagination.limit,
          page: this.pagination.pageIndex
        }
      }
      const element = getConfigElement('unitAlarmSystemCheck')
      console.log(element)
      this.$httpRequest({
        type: element ? element.getTask.method : '',
        uri: element ? element.getTask.uri : '',
        payload: obj,
        callback: (res) => {
          this.isLoading = false
          this.buttonLoading = false
          if (res && res.status === 200) {
            this.pagination.total = res.data.total
            if (res.data.total !== 0) {
              this.tableData = res.data.rows
            }
          }
        }
      })
      // myEvcAlarmUnionLog(obj).then((res) => {
      //   this.isLoading = false
      //   this.buttonLoading = false
      //   this.pagination.total = res.data.total
      //   if (res.data.total !== 0) {
      //     this.tableData = res.data.rows
      //   }
      // }).catch(() => {
      //   this.isLoading = false
      //   this.buttonLoading = false
      // })
    },
    resetGetmyEvcAlarmLog() {
      this.isLoading = true
      this.buttonLoading = true
      let obj = {}
      if (this.$route.params.selectedOption) {
        obj = {
          regionId: this.$route.params.selectedOption[0],
          regionName: this.$route.params.selectedLabel[0],
          areaId: this.$route.params.selectedOption[1],
          areaName: this.$route.params.selectedLabel[1],
          fieldId: this.$route.params.selectedOption[2],
          fieldName: this.$route.params.selectedLabel[2],
          limit: this.pagination.limit,
          page: this.pagination.pageIndex
        }
      } else {
        obj = {
          limit: this.pagination.limit,
          page: this.pagination.pageIndex
        }
      }
      const element = getConfigElement('unitAlarmSystemCheck')
      console.log(element)
      this.$httpRequest({
        type: element ? element.getTask.method : '',
        uri: element ? element.getTask.uri : '',
        payload: obj,
        callback: (res) => {
          this.isLoading = false
          this.buttonLoading = false
          if (res && res.status === 200) {
            this.pagination.total = res.data.total
            if (res.data.total !== 0) {
              this.tableData = res.data.rows
            }
          }
        }
      })
    },
    getTableData() {
      this.isLoading = true
      this.buttonLoading = true
      const obj = {
        regionId: this.navFormInfo.data.area[0] || '',
        areaId: this.navFormInfo.data.area[1] || '',
        fieldId: this.navFormInfo.data.area[2] || '',
        limit: this.pagination.limit,
        page: this.pagination.pageIndex
      }
      const element = getConfigElement('unitAlarmSystemCheck')
      console.log(element)
      this.$httpRequest({
        type: element.getTask ? element.getTask.method : '',
        uri: element.getTask ? element.getTask.uri : '',
        payload: obj,
        callback: (res) => {
          this.isLoading = false
          this.buttonLoading = false
          if (res && res.status === 200) {
            this.pagination.total = res.data.total
            this.tableData = res.data.rows
          }
        }
      })
    },
    // 点查看和编辑前的操作
    seeAndEditBefore(row) {
      this.childSeeRow(row)
      this.editRow(row)
    },
    // 点查看
    childSeeRow(row, index) {
      console.log(row, '选择的行数据')
      this.dialogFormVisible = true
      setTimeout(() => {
        this.$refs.child.check(row)
      }, 100)
    },
    goBack() {
      // window.history.go(-1)
      this.$router.push({
        name: 'fieldAlarm'
      })
    },
    // 导出
    editRow(row, index) {
      console.log(row, '选择的行数据')
      const obj = { taskId: row.id }
      const element = getConfigElement('unitAlarmSystemCheck')
      const url = element ? element.exportTask.uri : ''
      derive('/api' + url, obj)
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
    }
  }
}
</script>
<style lang="scss">
  .w90 .el-dialog{
      width: 90% !important;
  }
  .backW70{
    width: 70px;
    padding: 8px 10px 9px 5px  !important;
    margin-right: 10px;
    font-size: 14px;
    i{
      position: relative;
      top: 1px;
    }
  }
</style>
<style lang="scss" scoped>

</style>
