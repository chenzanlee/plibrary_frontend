<template>
  <div class="home fieldCommand">
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
// import { evcJsonh2Tree } from '@/components/tree/evcJsonh2Tree.js'
import { getConfigElement } from '@/utils/overtService'
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
      defaultTitle: [],
      nameList: [], // 这个对应大区/区域/厂区/猪舍类型/单元。
      nameList2: [],
      isLoading: false,
      buttonLoading: false,
      defaultValue: [], // 默认选中
      search: {
        fromTime: '',
        toTime: '',
        regionId: '',
        areaId: '',
        fieldId: '',
        block: '', // A座 or B座
        roomTypeId: '',
        unitName: '',
        pageIndex: '',
        pageSize: ''
      },
      navFormInfo: {
        data: {
          area: [],
          roomtypeUnit: [],
          time: []
        },
        fieldList: {
          right: {
            inpLists: [
              {
                key: 'area',
                type: 'cascader',
                className: 'shadow',
                placeholder: '大区 / 区域 / 场区',
                customLabel: 'title',
                width: '200px',
                customValue: '',
                checkStrictly: true,
                options: [],
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
              }
            ],
            btnLists: [
              {
                innerText: '查询',
                className: 'btn-blue',
                authCode: 'fieldInstructionLogs:get_unit_instrcution_logs',
                handleClick: () => {
                  this.pagination.pageIndex = 1
                  if (!this.navFormInfo.data.time || this.navFormInfo.data.time.length === 0) {
                    this.$message.warning('请选择查询时间段')
                    return false
                  }
                  this.getcontrolInstruction()
                }
              },
              {
                innerText: '重置',
                className: 'btn-border',
                handleClick: () => {
                  this.$refs['navForm'].resetFields()
                  this.tableData = []
                  this.pagination.total = 0
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
          width: '120'
        },
        {
          prop: 'areaName',
          label: '区域',
          width: '120'
        },
        {
          prop: 'location',
          label: '位置信息',
          width: '220'
        },
        {
          longData: true,
          prop: 'instructionEcho',
          label: '日志信息',
          minWidth: '300'
        },
        {
          prop: 'sendUserName',
          label: '发送人',
          width: '80'
        },
        {
          longData: true,
          prop: 'sendTime',
          label: '发送时间',
          // render: (h, params) => {
          //   const d = params.row.sendTime.split('.')[0].replace('T', ' ')
          //   console.log(d)
          //   return h('span', d)
          // },
          width: '160'
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
          this.search.fromTime = n.time[0] || this.formatDate(new Date().getTime() - (86400000 * 2))
          this.search.toTime = n.time[1] || this.formatDate(new Date().getTime())
        } else {
          // 防止未null===报错
          this.search.fromTime = this.formatDate(new Date().getTime() - (86400000 * 2))
          this.search.toTime = this.formatDate(new Date().getTime())
        }
        if (n.area.length === 0) {
          this.navFormInfo.fieldList.right.inpLists[0].valueKey++ // 只要监听到数据源发生变化 ，改变keyValue的值，达到重新渲染的效果
          this.navFormInfo.fieldList.right.inpLists[1].valueKey++
        }
        if (n.area === null) {
          return
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
      let json = ''
      // const element = getConfigElement('unit-evcDataInterface')
      // console.log(element)
      // await this.$httpRequest({
      //   type: element ? element.getRegionAreaFieldRoomTypeUnitV2.method : '',
      //   uri: element ? element.getRegionAreaFieldRoomTypeUnitV2.uri : '',
      //   payload: '',
      //   callback: (res) => {
      //     if (res && res.status === 200 && res.rel) {
      //       json = res.data
      //     }
      //   }
      // })
      getRegionAreaFieldTree({ isBuilding: false }).then(data => {
        if (data.status === 200 && data.rel) {
          json = data.data
        }
      })
      // await getRegionAreaFieldRoomTypeUnitV2().then((data) => {
      //   json = data.data
      // })
      this.navFormInfo.fieldList.right.inpLists[0].options = json
      await this.defaultValueMe(this.navFormInfo.fieldList.right.inpLists[0].options)
      this.search.fromTime = this.formatDate(new Date(new Date().setHours(0, 0, 0, 0)))
      this.search.toTime = this.formatDate(new Date().getTime())
      this.navFormInfo.data.time = [this.search.fromTime, this.search.toTime]
      // this.navFormInfo.data.area = this.defaultValue
      this.nameList = this.defaultTitle
    },
    getOptions(json) {
      this.navFormInfo.fieldList.right.inpLists[0].options = json
      this.search.fromTime = this.formatDate(new Date(new Date().setHours(0, 0, 0, 0)))
      this.search.toTime = this.formatDate(new Date().getTime())
      this.navFormInfo.data.time = [this.search.fromTime, this.search.toTime]
    },
    // 获取列表数据
    getcontrolInstruction() {
      this.search.regionId = this.navFormInfo.data.area[0] || ''
      this.search.areaId = this.navFormInfo.data.area[1] || ''
      this.search.fieldId = this.navFormInfo.data.area[2] || ''
      if (this.navFormInfo.data.roomtypeUnit[0] === 'BLOCK_A' || this.navFormInfo.data.roomtypeUnit[0] === 'BLOCK_B') {
        this.search.block = this.navFormInfo.data.roomtypeUnit[0] || ''
        this.search.roomTypeId = this.navFormInfo.data.roomtypeUnit[1] || ''
        this.search.unitName = this.nameList2[2] || ''
      } else {
        this.search.block = ''
        this.search.roomTypeId = this.navFormInfo.data.roomtypeUnit[0] || ''
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
      this.isLoading = true
      this.buttonLoading = true
      this.search.pageIndex = this.pagination.pageIndex
      this.search.pageSize = this.pagination.limit
      const element = getConfigElement('fieldInstructionLogs')
      console.log(element)
      this.$httpRequest({
        type: element ? element.get_unit_instrcution_logs.method : '',
        uri: element ? element.get_unit_instrcution_logs.uri : '',
        payload: this.search,
        callback: (res) => {
          this.isLoading = false
          this.buttonLoading = false
          if (res && res.status === 200) {
            res.data.rows.map(ele => {
              if (ele.instructionEcho) {
                const arr = []
                Object.values(ele.instructionEcho).map((item, index) => {
                  const key = Object.keys(ele.instructionEcho)[index]
                  const str = index < 1 ? '  ' + item + '  ' : key + ':' + item + '  '
                  arr.push(str)
                })
                ele.instructionEcho = arr.join(';')
              }
            })
            this.tableData = res.data.rows
            this.pagination.total = res.data.total
          }
        }
      })
      // controlInstruction(this.search).then((res) => {
      //   this.isLoading = false
      //   this.buttonLoading = false
      //   res.data.rows.map(ele => {
      //     if (ele.instructionEcho) {
      //       const arr = []
      //       Object.values(ele.instructionEcho).map((item, index) => {
      //         const key = Object.keys(ele.instructionEcho)[index]
      //         const str = index < 1 ? '  ' + item + '  ' : key + ':' + item + '  '
      //         arr.push(str)
      //       })
      //       ele.instructionEcho = arr.join(';')
      //     }
      //   })
      //   this.tableData = res.data.rows
      //   this.pagination.total = res.data.total
      // }).catch(() => {
      //   this.isLoading = false
      //   this.buttonLoading = false
      // })
    },
    formatEcho(obj) {
      if (obj) {
        const arr = []
        Object.values(obj).map((res, index) => {
          const key = Object.keys(obj)[index]
          const str = index < 1 ? '  ' + res + '  ' : key + ':' + res + '  '
          arr.push(str)
        })
        return arr.join(';')
      }
    },
    // 分页器页码
    handleIndexChange(current) {
      this.pagination.pageIndex = current
      this.getcontrolInstruction()
    },
    // 分页器一页多少条
    handleSizeChange(size) {
      this.pagination.limit = size
      this.getcontrolInstruction()
    }
  }
}
</script>
<style lang="scss">
.fieldCommand {
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
}
</style>
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
