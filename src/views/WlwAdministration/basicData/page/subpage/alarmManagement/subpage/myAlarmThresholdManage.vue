<!-- 告警阈值管理 -->
<template>
  <div class="myAlarmThresholdManage">
    <!-- 头部导航 -->
    <nav-form ref="navForm" :data="navFormInfo.data" :field-list="navFormInfo.fieldList" />
    <!-- 内容表格 -->
    <tablePage
      ref="tablePage"
      :is-loading="isLoading"
      :columns="columns"
      :data-source="tableData"
      :options="options"
      :pagination="pagination"
      @handleSizeChange="handleSizeChange"
      @handleIndexChange="handleIndexChange"
      @selection-change="handleSelectionChange"
      @child-removeRow="removeRow"
      @child-seeRow="childSeeRow"
      @child-editRow="editRow"
    />
    <!-- 新增/编辑/查看 dialog -->
    <el-dialog
      :title="title"
      :modal-append-to-body="false"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      width="700px"
    >
      <div class="body">
        <general-form
          ref="delog"
          label-width="80px"
          :data="formInfo.data"
          :field-list="formInfo.fieldList"
          :list-type-info="listTypeInfo"
          theme-type="default"
          @cascaderEvent="cascaderEvent"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <div style="margin:0 auto;">
          <el-button class="btn-border" @click="dialogFormVisible = false">取 消</el-button>
          <el-button v-if="status==1" class="btn-blue" type="primary" @click="determine">确 定</el-button>
          <el-button v-if="status==2" class="btn-blue" type="primary" @click="determine">更 新</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import navForm from '@/components/commonComponent/navForm/index.vue'
import tablePage from '@/components/ElementComponent/iTable'
import generalForm from '@/components/commonComponent/generalForm'
import { getConfigElement } from '@/utils/overtService'
import { evcJsonh2Tree } from '@/components/tree/evcJsonh2Tree.js'
export default {
  components: {
    navForm,
    tablePage,
    generalForm
  },
  data() {
    return {
      pageElement: [], // 当前页面数据权限
      commonElement: [], // 公共数据权限
      pagination: { // 表格分页
        total: 0,
        pageIndex: 1,
        limit: 10
      },
      options: { // 表格配置项
        stripe: false, // 斑马纹
        firstFixed: true, // 首航固定
        mutiSelect: true, // 多选框
        loading: false, // 表格动画
        initTable: true // 是否一挂载就加载数据
      },
      selection: [], // 表格选中数组
      auditarr: [], // 已审核数组
      unAuditarr: [], // 未审核数组
      isLoading: false, // 表格loading
      tableData: [], // 表格数据
      columns: [ // 列项
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
          label: '大区'
        },
        {
          prop: 'segmentName',
          label: '工段'
        },
        {
          prop: 'unitName',
          label: '单元'
        },
        {
          prop: 'unitName',
          label: '监控项'
        },
        {
          prop: 'unitName',
          label: '阈值上限'
        },
        {
          prop: 'unitName',
          label: '阈值下限'
        },
        {
          prop: 'unitName',
          label: '状态'
        },
        {
          prop: 'unitName',
          label: '录入人'
        },
        {
          prop: 'unitName',
          label: '更新时间'
        },
        {
          button: true,
          label: '操作',
          fixed: 'right',
          align: 'center',
          show: 'status',
          width: '180', // 操作按钮宽度
          group: [
            {
              name: '查看',
              class: 'btn-blue',
              authCode: '',
              size: 'auto',
              click: 'see',
              status: 'AUDITED'
            },
            {
              name: '修改',
              class: 'btn-blue',
              authCode: 'myAlarmThresholdManage:btn_edit',
              size: 'auto',
              click: 'edit',
              status: 'NORMAL'
            },
            {
              name: '删除',
              class: 'btn-red',
              authCode: 'myAlarmThresholdManage:btn_del',
              size: 'auto',
              click: 'remove',
              status: 'NORMAL'
            }
          ]
        }
      ],
      navFormInfo: {
        data: {
          area: [],
          status: ''
        },
        fieldList: {
          left: {
            inpLists: [
              {
                type: 'button',
                innerText: '新增',
                authCode: 'myDirections:add',
                className: 'btn-blue',
                handleClick: () => {
                  this.status = 1
                  this.dialogFormVisible = true
                }
              },
              {
                type: 'button',
                innerText: '审核',
                authCode: 'myAlarmThresholdManage:btn_review',
                isDisabled: true,
                className: 'btn-blue',
                handleClick: () => {
                  if (this.auditarr.length !== 0) {
                    this.$message.error('只能选择未审核数据进行审核')
                    return
                  }
                  if (this.unAuditarr.length === 0) {
                    this.$message({
                      message: '最少需要选择一条未审核数据',
                      type: 'warning'
                    })
                    return
                  }
                  this.$confirm('此操作将审核这些数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    confirmButtonClass: 'btn-blue btn-blue-confirm',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.setReview(this.unAuditarr)
                  }).catch(() => {})
                }
              },
              {
                type: 'button',
                innerText: '反审核',
                authCode: 'myAlarmThresholdManage:btn_unreview',
                isDisabled: true,
                className: 'btn-blue',
                handleClick: () => {
                  if (this.unAuditarr.length !== 0) {
                    this.$message.error('只能选择已审核数据进行反审核')
                    return
                  }
                  if (this.auditarr.length === 0) {
                    this.$message({
                      message: '最少需要选择一条已审核数据',
                      type: 'warning'
                    })
                    return
                  }
                  this.$confirm('此操作将反审核这些数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    confirmButtonClass: 'btn-blue btn-blue-confirm',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.setUnreview(this.auditarr)
                  }).catch(() => {})
                }
              }
            ]
          },
          right: {
            inpLists: [
              {
                key: 'status',
                type: 'radio',
                required: true,
                className: 'shadow',
                placeholder: '333',
                customLabel: 'name',
                customVal: 'val',
                optList: [{ name: '全部', val: '' }, { name: '已审核', val: 'AUDITED' }, { name: '未审核', val: 'NORMAL' }]
              },
              {
                key: 'area',
                type: 'cascader',
                className: 'shadow',
                customLabel: 'regionName',
                customValue: 'regionNum',
                placeholder: '请选择大区 / 区域 / 场区 / 工段 / 单元',
                clearable: true,
                options: []
              }
            ],
            btnLists: [
              {
                innerText: '查询',
                className: 'btn-blue',
                handleClick: () => {
                  this.pagination.pageIndex = 1
                  this.getMyEvcMcuInfo()
                }
              },
              {
                innerText: '重置',
                className: 'btn-border',
                handleClick: () => {
                  this.$refs['navForm'].resetFields()
                  // console.log(this.navFormInfo.data.area)
                  this.getMyEvcMcuInfo()
                }
              }
            ]
          }
        }
      },
      status: 0, // 0查看 1新增 2修改
      row: null, // 查看/编辑时 当前选中行数据
      dialogFormVisible: false, // 新增/编辑/查看 dialog控制变量
      listTypeInfo: {}, // dialog下拉框对应内容OBJ
      formInfo: {
        data: {},
        fieldList: []
      }
    }
  },
  computed: {
    title() {
      const titleArr = ['查看', '新增', '修改']
      const status = this.status
      return titleArr[status]
    }
  },
  watch: {
    dialogFormVisible(val) { // 手动清楚一下提示语
      !val && this.refs['delog'].resetFields()
    },
    auditarr(val) { // 已审核数组
      this.navFormInfo.fieldList.left.inpLists[2].isDisabled = !(val.length) // 改变反审核按钮DIS状态
    },
    unAuditarr(val) { // 未审核数组
      this.navFormInfo.fieldList.left.inpLists[1].isDisabled = !(val.length) // 改变审核按钮DIS状态
    }
  },
  created() {
    this.pageElement = getConfigElement('myAlarmThresholdManage')
    this.commonElement = getConfigElement('wlwDataInterface')
    this.init()
  },
  methods: {
    init() {
      this.getTree()
      this.getMyEvcMcuInfo()
    },
    getTree() { // 获取区域联动数据
      const element = this.commonElement['getTreeForDataAuthV2']
      const params = {}
      this.$httpRequest({
        type: element.method,
        uri: element.uri,
        payload: params,
        callback: data => {
          if (data.status === 200 && data.rel) {
            this.navFormInfo.fieldList.right.inpLists[0].options = evcJsonh2Tree(data.data)
          } else {
            this.$message.error(data.message)
          }
        }
      })
    },
    getMyEvcMcuInfo() { // 查询表格数据
      const element = this.pageElement['view']
      const params = {
        limit: this.pagination.limit,
        page: this.pagination.pageIndex
      }
      const { area, status } = this.navFormInfo.data
      if (area.length > 0) {
        // params.
      }
      if (status) params.status = status
      this.isLoading = true
      this.$httpRequest({
        type: element.method,
        uri: element.uri,
        payload: params,
        callback: res => {
          this.isLoading = false
          if (res.status === 200) {
            this.pagination.total = res.data.total
            this.tableData = res.data.rows
            this.$refs['tablePage'].$children[0].clearSelection()
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    setReview(idArr) { // 审核
      const element = this.pageElement['review']
      const params = {
        ids: idArr.join(',')
      }
      this.$httpRequest({
        type: element.method,
        uri: element.uri,
        payload: params,
        callback: res => {
          if (res.status === 200) {
            this.$message.success('审核成功')
            this.getMyEvcMcuInfo()
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    setUnreview(idArr) { // 反审核
      const element = this.pageElement['unreview']
      const params = {
        ids: idArr.join(',')
      }
      this.$httpRequest({
        type: element.method,
        uri: element.uri,
        payload: params,
        callback: res => {
          if (res.status === 200 && res.rel) {
            this.$message.success('反审核成功')
            this.getMyEvcMcuInfo()
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    removeRow(row) { // 表格行删除

    },
    childSeeRow(row) { // 表格行查看
      this.row = row
    },
    editRow(row) { // 表格行编辑
      this.row = row
    },
    handleSizeChange(current) { // 改变表格size
      this.pagination.page = current
      this.getMyEvcMcuInfo()
    },
    handleIndexChange(size) { // 改变表格页码
      this.pagination.limit = size
      this.getMyEvcMcuInfo()
    },
    handleSelectionChange(selection) { // 改变表格选中
      this.selection = selection
      this.auditarr = [] // 已审核数组
      this.unAuditarr = [] // 未审核数组
      selection.forEach((item) => {
        if (item.status === 'AUDITED') {
          this.auditarr.push(item.id)
        } else {
          this.unAuditarr.push(item.id)
        }
      })
    },
    determine() { // 点击 新增/更新时的操作

    },
    cascaderEvent(idVals, nameVals, nodeVlas) { // 新增时的级联，抛出三个数组值

    },
    resetFormInfo(flag) { // 此处重置一下 dialog数据  flag为boolean表示dialog项DISABLED状态
      this.formInfo = { // 这里 重置为初始状态
        data: {}
      }
      this.formInfo.fieldList = this.formInfo.fieldList.map(item => {
        item.disabled = flag
        return item
      })
    }
  }
}

</script>
<style lang='scss' scoped>
.myAlarmThresholdManage{
}
</style>
