<template>
  <div class="home">
    <div>
      <!-- 头部导航 -->
      <nav-form
        ref="navForm"
        :data="navFormInfo.data"
        :field-list="navFormInfo.fieldList"
      />
      <!-- 表格内容 -->
      <tablePage
        ref="tablePage"
        :is-loading="isLoading"
        :loading="buttonLoading"
        :columns="columns"
        :data-source="tableData"
        :options="options"
        :pagination="pagination"
        @handleSizeChange="handleSizeChange"
        @handleIndexChange="handleIndexChange"
        @selection-change="handleSelectionChange"
        @child-seeRow="childSeeRow"
        @child-editRow="editRow"
      />
      <!-- 新增 -->
      <el-dialog
        :title="dialogTit"
        class="fieldDialog"
        :modal-append-to-body="false"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
      >
        <general-form
          ref="delog"
          label-width="80px"
          :data="formInfo.data"
          :field-list="formInfo.fieldList"
          @cascaderEvent="diacascaderEvent"
        />
        <div style="text-align: right;">
          <el-button class="btn-border" @click="dialogFormVisible = false">取 消</el-button>
          <el-button class="btn-blue" :loading="btnLoading" @click="dialogSubmit">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import navForm from '@/components/commonComponent/navForm/index.vue'
import generalForm from '@/components/commonComponent/generalForm'
import tablePage from '@/components/ElementComponent/iTable'
// import { evcJsonh2Tree } from '@/components/tree/evcJsonh2Tree.js'
// import {
//   myEvcAlarmUnionLog,
//   getRegionAreaFieldRoomTypeUnitV2,
//   AutoCheckTaskAdd
// } from '@/http/api/autoDetectionTask/fieldAlarm.js'
import { getConfigElement } from '@/utils/overtService'
export default {
  components: {
    tablePage,
    navForm,
    generalForm
  },
  data() {
    return {
      btnLoading: false,
      dialogTit: '创建自检任务',
      selection: [],
      isLoading: false,
      dialogFormVisible: false,
      buttonLoading: false,
      defaultValue: [], // 默认选中
      // 查询条件
      search: {
        regionId: '', // 大区ID
        areaId: '', // 区域ID
        fieldId: '', // 场区ID
        // block: '', // A座 or B座
        pageIndex: '', // 页码
        pageSize: '' // 页码显示数
        // type: ''
      },
      search2: {
        regionId: '', // 大区ID
        areaId: '', // 区域ID
        fieldId: '', // 场区ID
        block: '', // A座 or B座
        pageIndex: '', // 页码
        pageSize: '', // 页码显示数
        type: ''
      },
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
                clearable: true,
                customLabel: 'title',
                customValue: '',
                checkStrictly: true
              }
            ],
            btnLists: [
              {
                innerText: '查询',
                authCode: '',
                className: 'btn-blue',
                handleClick: () => {
                  this.pagination.pageIndex = 1
                  this.getmyEvcAlarmUnionLog()
                }
              },
              {
                innerText: '创建自检任务',
                className: 'btn-blue',
                authCode: 'unitAlarmSystemCheck:addTask',
                handleClick: () => {
                  if (this.selection.length > 0) {
                    this.dialogSubmit()
                  } else {
                    this.dialogFormVisible = true
                  }
                }
              },
              {
                innerText: '任务记录',
                authCode: 'unitAlarmSystemCheck:getTask',
                className: 'btn-border',
                handleClick: () => {
                  this.goTaskList()
                }
              },
              {
                innerText: '重置',
                className: 'btn-border',
                handleClick: () => {
                  this.$refs['navForm'].resetFields()
                }
              }
            ]
          }
        }
      },
      formInfo: {
        data: {
          area: '',
          time: ''
        },
        fieldList: [
          {
            key: 'area',
            type: 'cascader',
            label: '检测范围',
            className: 'shadow',
            placeholder: '请选择大区 / 区域 / 场区',
            options: [],
            clearable: true,
            customLabel: 'title',
            customValue: '',
            checkStrictly: true
          }
        ]
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
          prop: 'fieldName',
          label: '场区'
        },
        {
          button: true,
          label: '操作',
          fixed: 'right',
          align: 'center',
          width: '160', // 操作按钮宽度
          authCode: 'unitAlarmSystemCheck:getTask',
          group: [
            {
              name: '检测',
              class: 'btn-border',
              size: 'auto',
              click: 'edit'
            },
            {
              name: '查看',
              class: 'btn-blue',
              size: 'auto',
              authCode: 'unitAlarmSystemCheck:getTask',
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
        console.log(n)
        this.search.regionId = n.area[0] || ''
        this.search.areaId = n.area[1] || ''
        this.search.fieldId = n.area[2] || ''
      },
      deep: true
    },
    'formInfo.data': {
      handler: function(n) {
        console.log(n)
        this.search2.regionId = n.area[0] || ''
        this.search2.areaId = n.area[1] || ''
        this.search2.fieldId = n.area[2] || ''
      },
      deep: true
    }
  },
  async created() {
    await this.getTree()
    // this.getcontrolInstruction();
  },
  mounted() {
    this.getmyEvc()
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
    defaultValMe(arr) {
      if (!arr || arr.length === 0) {
        return
      }
      this.defaultValue.push(arr[0].value)
      if (arr[0].children) {
        this.defaultValMe(arr[0].children)
      }
    },
    // 获取区域联动数据
    async getTree() {
      const element = getConfigElement('unit-evcDataInterface')
      console.log(element)
      await this.$httpRequest({
        type: element ? element.getRegionAreaFieldTree.method : '',
        uri: element ? element.getRegionAreaFieldTree.uri : '',
        payload: '',
        callback: (res) => {
          if (res && res.status === 200 && res.rel) {
            const arr = res.data
            // const arr = evcJsonh2Tree(res.data)
            // arr.forEach(item => {
            //   if (item.children && item.children.length) {
            //     item.children.forEach(child => {
            //       if (child.children && child.children.length) {
            //         child.children.forEach(delItem => {
            //           delete delItem.children
            //         })
            //       }
            //     })
            //   }
            // })
            this.navFormInfo.fieldList.right.inpLists[0].options = arr
            this.formInfo.fieldList[0].options = arr
          }
        }
      })
      // await getRegionAreaFieldRoomTypeUnitV2().then((data) => {
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
      //   this.formInfo.fieldList[0].options = arr
      // })
      // await this.defaultValMe(this.navFormInfo.fieldList.right.inpLists[0].options)
      // this.navFormInfo.data.area = this.defaultValue
    //   await setTimeout((e) => {
    //     this.getmyEvcAlarmUnionLog()
    //   }, 50)
    },
    getmyEvcAlarmUnionLog() {
      // if (this.search.regionId === '') {
      //   this.pagination.total = 0
      //   this.$message({
      //     message: '请选择区域',
      //     type: 'warning'
      //   })
      //   return
      // }
      this.isLoading = true
      this.buttonLoading = true
      this.search.pageIndex = this.pagination.pageIndex
      this.search.pageSize = this.pagination.limit
      const obj = {
        regionId: this.search.regionId,
        areaId: this.search.areaId,
        fieldId: this.search.fieldId,
        page: this.search.pageIndex,
        limit: this.search.pageSize
      }
      const element = getConfigElement('unit-evcDataInterface')
      console.log(element)
      this.$httpRequest({
        type: element ? element.getFields.method : '',
        uri: element ? element.getFields.uri : '',
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
      // myEvcAlarmUnionLog(obj).then((res) => {
      //   this.isLoading = false
      //   this.buttonLoading = false
      //   this.tableData = res.data.rows
      //   this.pagination.total = res.data.total
      // }).catch(() => {
      //   this.isLoading = false
      //   this.buttonLoading = false
      // })
    },
    getmyEvc() {
      this.isLoading = true
      this.buttonLoading = true
      this.search.pageIndex = this.pagination.pageIndex
      this.search.pageSize = this.pagination.limit
      const obj = {
        regionId: '',
        areaId: '',
        fieldId: '',
        page: this.pagination.pageIndex,
        limit: this.pagination.limit
      }
      const element = getConfigElement('unit-evcDataInterface')
      console.log(element)
      this.$httpRequest({
        type: element ? element.getFields.method : '',
        uri: element ? element.getFields.uri : '',
        payload: obj,
        callback: (res) => {
          this.isLoading = false
          this.buttonLoading = false
          if (res && res.status === 200) {
            this.tableData = res.data.rows
            this.pagination.total = res.data.total
            this.$refs['tablePage'].$children[0].clearSelection()
          }
        }
      })
      // myEvcAlarmUnionLog(obj).then((res) => {
      //   this.isLoading = false
      //   this.buttonLoading = false
      //   this.tableData = res.data.rows
      //   this.pagination.total = res.data.total
      // }).catch(() => {
      //   this.isLoading = false
      //   this.buttonLoading = false
      // })
    },
    dialogSubmit() {
      if (!this.formInfo.data.area[0] && this.dialogFormVisible === true) {
        this.$message({
          message: '请选择区域',
          type: 'warning'
        })
        return
      }
      this.dialogFormVisible = false
      let obj = {}
      console.log(this.selection)
      if (this.selection.length < 1) {
        let regionName = ''
        let areaName = ''
        let fieldName = ''
        this.formInfo.fieldList[0].options.map(a => {
          if (this.formInfo.data.area[0] === a.value) {
            regionName = a.title
            a.children.map(b => {
              if (this.formInfo.data.area[1] && this.formInfo.data.area[1] === b.value) {
                areaName = b.title
                b.children.map(c => {
                  if (this.formInfo.data.area[2] && this.formInfo.data.area[2] === c.value) {
                    fieldName = c.title
                  }
                })
              }
            })
          }
        })
        obj = {
          fields: [{
            regionId: this.search2.regionId,
            regionName: regionName,
            areaId: this.search2.areaId,
            areaName: areaName,
            fieldId: this.search2.fieldId,
            fieldName: fieldName
          }]
        }
      } else {
        const arr = []
        this.selection.map(res => {
          arr.push(
            {
              regionId: res.regionId,
              regionName: res.regionName,
              areaId: res.areaId,
              areaName: res.areaName,
              fieldId: res.fieldId,
              fieldName: res.fieldName
            }
          )
        })
        obj = {
          fields: arr
        }
      }
      const element = getConfigElement('unitAlarmSystemCheck')
      this.btnLoading = true
      console.log(element)
      this.$httpRequest({
        type: element ? element.addTask.method : '',
        uri: element ? element.addTask.uri : '',
        payload: obj,
        callback: (res) => {
          this.btnLoading = false
          if (res && res.status === 200) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.getmyEvc()
          } else {
            this.$message.error(res.message)
          }
        }
      })
      // AutoCheckTaskAdd(obj).then((res) => {
      //   if (res && res.status === 200) {
      //     this.getmyEvc()
      //   }
      // })
    },
    // 点查看和编辑前的操作
    seeAndEditBefore(row) {
      this.childSeeRow(row)
    },
    // 点查看
    childSeeRow(row, index) {
      console.log(row, '选择的行数据')
      const selectedOption = [row.regionId, row.areaId, row.fieldId]
      const selectedLabel = [row.regionName, row.areaName, row.fieldName]
      this.$router.push({
        name: 'taskManagement',
        params: {
          overview: row,
          selectedOption: selectedOption,
          selectedLabel: selectedLabel
        }
      })
    },
    // 检测
    async editRow(row, index) {
      console.log(row, '选择的行数据')
      const obj = {
        fields: [{
          regionId: row.regionId,
          regionName: row.regionName,
          areaId: row.areaId,
          areaName: row.areaName,
          fieldId: row.fieldId,
          fieldName: row.fieldName
        }]
      }
      const element = getConfigElement('unitAlarmSystemCheck')
      console.log(element)
      await this.$httpRequest({
        type: element ? element.addTask.method : '',
        uri: element ? element.addTask.uri : '',
        payload: obj,
        callback: (res) => {
          if (res && res.status === 200) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.getmyEvc()
          }
        }
      })
      // await AutoCheckTaskAdd(obj).then((res) => {
      //   if (res && res.status === 200) {
      //     this.$message({
      //       message: '操作成功',
      //       type: 'success'
      //     })
      //     this.getmyEvc()
      //   }
      // })
    },
    goTaskList() {
      this.taskRoute = false
      this.$router.push({
        name: 'taskManagement'
      })
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
    // 复选框
    handleSelectionChange(selection) {
      this.selection = selection
    },
    diacascaderEvent() {
      const children = this.$refs['delog'].$refs['cascader'][0].getCheckedNodes()
      console.log(children)
      console.log(this.$refs['delog'].$refs['cascader'])
      if (children.length > 0 && children[0].children.length < 1) { // 判断有没有下级
        this.$refs['delog'].$refs['cascader'][0].dropDownVisible = false // 监听值发生变化就关闭它
      }
    }
  }
}
</script>
<style lang="scss">
.fieldDialog{
  .el-dialog{
    width: 30%;
    display: block;
  }
  .el-dialog__body {
    padding: 10px 10px 10px 0;
  }
}
</style>
