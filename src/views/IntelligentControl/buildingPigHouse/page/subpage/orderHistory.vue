<template>
  <div class="home fanDatabase">
    <!-- 头部导航 -->
    <div class="orderHistory">
      <button class="btn-blue go-back-btn" @click="goBack()"><i class="iconfont">&#xe61d;</i>返回</button>
      <nav-form ref="navForm" :data="navFormInfo.data" :field-list="navFormInfo.fieldList" />
    </div>
    <!-- 表格内容 -->
    <div style="height:15px" />
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
    />
    <!-- 查看详细 -->
    <el-dialog
      :title="title"
      :modal-append-to-body="false"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <div>
        <div style="width:100%;margin:0 auto;">
          <tablePage
            ref="tablePage"
            :columns="columnsOne"
            :data-source="tableDataOne"
            :options="options"
            :pagination="paginationOne"
            :is-loading="isLoading"
            @handleSizeChange="handleSizeChange"
            @handleIndexChange="handleIndexChange"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import tablePage from '@/components/ElementComponent/iTable'
import navForm from '@/components/commonComponent/navForm/index.vue'
import {
  getOrderListAll,
  getOrderDetail
} from '@/http/api/orderHistory.js'
export default {
  components: {
    tablePage,
    navForm
    // generalForm
  },
  data() {
    return {
      queryStatus: false,
      dialogFormVisible: false,
      isLoading: false,
      buttonLoading: false,
      linkage: true, // form选择框是否联动 （修改查看赋值不联动）
      title: '查看',
      status: 0, // 0=>查看 1=>xinzeng  2=>修改
      downlist: [],
      selection: '',
      row: '', // 当前选中行的数据
      search: {
        limit: 10,
        page: 1
      },
      submit: {
        regionId: '',
        areaId: '',
        fieldId: '',
        roomTypeId: '',
        unitId: '',
        equipmentId: ''
      },
      fieldFisrtId: '',
      auditarr: [], // 已审核数组
      unAuditarr: [], // 未审核数组
      // 审核表头
      navFormInfo: {
        data: {
          nameList: '',
          time: []
        },
        fieldList: {
          left: {
            inpLists: [
              {
                key: 'nameList',
                type: 'input',
                required: true,
                className: 'shadow',
                placeholder: '人员名字'
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
                  this.queryStatus = true
                  this.getMyEvcMcuInfo()
                }
              },
              {
                innerText: '重置',
                className: 'btn-border',
                handleClick: () => {
                  this.queryStatus = false
                  this.$refs['navForm'].resetFields()
                  this.navFormInfo.data.nameList = ''
                  this.navFormInfo.data.time = []
                  this.pagination.pageIndex = 1
                  this.getMyEvcMcuInfo()
                }
              }
            ]
          }
        }
      },
      columns: [
        {
          prop: 'crtName',
          label: '操作人员',
          minWidth: '300'
        },
        {
          prop: 'crtTime',
          label: '创建日期',
          minWidth: '300'
        },
        {
          prop: 'status',
          label: '状态',
          minWidth: '300',
          rule: {
            1: '正在下发',
            2: '下发完成'
          }
        },
        {
          prop: 'instructions',
          label: '操作指令',
          minWidth: '300'
        },
        {
          button: true,
          label: '操作',
          fixed: 'right',
          align: 'center',
          minWidth: '200', // 操作按钮宽度
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
      columnsOne: [
        {
          prop: 'unitName',
          label: '单元'
          // width: '200'
        },
        {
          prop: 'status',
          label: '状态',
          width: '200',
          rule: {
            1: '待下发',
            2: '正在下发',
            3: '下发完成'
          }
        },
        {
          prop: 'successdispatchedInstructs',
          label: '已下发的指令',
          width: '200'
        },
        {
          prop: 'waitDispatchInstructs',
          label: '待下发的指令'
        },
        {
          prop: 'failedDispatchedInstructs',
          label: '下发失败指令'
          // width: '200'
        }
      ],
      // 表单对应列表
      listTypeInfo: {
        nameList: [],
        typeList: [],
        modelList: []
      },
      // 表单相关
      formInfo: {
        data: {
          otherName: '', // 别名
          volume: '', // 风量
          formula: '', // 计算公式
          nameCode: '', // 名称
          typeCode: '', // 类型
          modelCode: '' // 型号
        },
        fieldList: [
          {
            label: '风机别名',
            key: 'otherName',
            type: 'input',
            className: 'shadow'
          },
          {
            label: '风机名称',
            key: 'nameCode',
            type: 'select',
            className: 'shadow',
            list: 'nameList',
            required: true,
            props: {
              value: 'code',
              label: 'title'
            },
            rules: [
              { required: true, message: '请选择风机名称', trigger: 'change' }
            ]
          },
          {
            label: '风机类型',
            key: 'typeCode',
            type: 'select',
            className: 'shadow',
            list: 'typeList',
            required: true,
            props: {
              value: 'code',
              label: 'title'
            },
            rules: [
              { required: true, message: '请选择风机类型', trigger: 'change' }
            ]
          },
          {
            label: '风机型号',
            key: 'modelCode',
            type: 'select',
            className: 'shadow',
            list: 'modelList',
            required: true,
            props: {
              value: 'code',
              label: 'title'
            },
            rules: [
              { required: true, message: '请选择风机类型', trigger: 'change' }
            ]
          },
          {
            label: '风量Q',
            key: 'volume',
            type: 'number',
            className: 'shadow',
            required: true,
            rules: [
              { required: true, message: '请输入风量Q', trigger: 'blur' }
            ]
          },
          {
            label: '通风量计算公式',
            key: 'formula',
            type: 'input',
            placeholder: '转速(n)频率(f)风量(Q)风机数量(x)',
            className: 'shadow',
            required: true,
            rules: [
              { required: true, message: '请输入计算公式', trigger: 'blur' }
            ]
          }
        ]
      },
      tableData: [],
      // 分页
      tableDataOne: [],
      pagination: {
        total: 0,
        pageIndex: 1,
        limit: 10
      },
      paginationOne: {
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
  created() {
    // this.getMyEvcMcuInfo()
  },
  mounted() {
    if (this.$route.query.fieldId) {
      this.fieldFisrtId = this.$route.query.fieldId
      this.getMyEvcMcuInfo()
    } else {
      this.$message.error('信息丢失，请重新选择单元')
    }
  },
  methods: {
    goBack() {
      this.$router.push({
        name: 'buildingPigHouseDetail',
        params: {
          toPath: 'multiUnitSetting'
        }
      })
    },
    // 点查看和编辑前的操作
    seeAndEditBefore(row) {
      this.childSeeRow(row)
    },
    // 点查看
    childSeeRow(row, index) {
      this.linkage = false
      const searchData = {}
      searchData.page = this.paginationOne.pageIndex
      searchData.limit = this.paginationOne.index
      searchData.mainId = row.id
      getOrderDetail(searchData).then(data => {
        this.tableDataOne = data.data.rows
        this.paginationOne.total = data.data.total
      })
      // setTimeout((item) => {
      //   this.linkage = true
      // }, 0)
      this.status = 0
      this.dialogFormVisible = true
    },
    // 获取展示数据
    // 分页器页码
    handleIndexChange(current) {
      this.pagination.pageIndex = current
      this.getMyEvcMcuInfo()
    },
    // 分页器一页多少条
    handleSizeChange(size) {
      this.pagination.limit = size
      this.getMyEvcMcuInfo()
    },
    // 获取表单信息  请求
    getMyEvcMcuInfo() {
      const name = this.navFormInfo.data.nameList
      const time = this.navFormInfo.data.time
      const d = {
        limit: this.pagination.limit,
        page: this.pagination.pageIndex,
        fieldId: this.fieldFisrtId
      }

      this.search.page = this.pagination.pageIndex
      this.search.limit = this.pagination.limit
      this.search.fieldId = this.fieldFisrtId
      if (this.queryStatus) {
        name ? d.operator = name : null
        if (time.length > 0) {
          d.startTime = time[0]
          d.endTime = time[1]
        }
      }
      this.isLoading = true
      getOrderListAll(d).then((data) => {
        this.tableData = data.data.rows
        this.pagination.total = data.data.total
        this.isLoading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.orderHistory{
  .go-back-btn{
    float: left;
    height: 36px;
  }
}
</style>

