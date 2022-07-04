<template>
  <div class="home deviceInformation unitInformation">
    <!-- 头部导航 -->
    <nav-form ref="navForm" :data="navFormInfo.data" :field-list="navFormInfo.fieldList" />
    <!-- 表格内容 -->

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
      @child-slotRow="slotRow"
    />
    <!-- 新增 -->
    <el-dialog
      :title="title"
      :modal-append-to-body="false"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      class="unitInfoDialog"
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
          @handleChange="handleChange"
          @cascaderEvent="cascaderEvent"
        />
      </div>
      <div slot="footer" class="dialog-footer" style="text-align: right">
        <el-button class="btn-border canleButton" @click="dialogFormVisible = false">返回列表</el-button>
        <el-button v-if="title === '单元新增' || title === '单元修改'" class="btn-blue" :loading="buttonLoading" @click="determine">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import tablePage from '@/components/ElementComponent/iTable'
import navForm from '@/components/commonComponent/navForm/index.vue'
import generalForm from '@/components/commonComponent/generalForm'
import { getConfigElement } from '@/utils/overtService'
import { httpRequest } from '@/http/dispatch'
const dataInterfacePageElement = getConfigElement('myBaseFieldUnit')
const BlockList = [{
  name: 'A座',
  value: 'BLOCK_A'
}, {
  name: 'B座',
  value: 'BLOCK_B'
}]
const FloorList = [
  {
    name: '1楼',
    value: 'FLOOR_ONE'
  },
  {
    name: '2楼',
    value: 'FLOOR_TWO'
  },
  {
    name: '3楼',
    value: 'FLOOR_THREE'
  },
  {
    name: '4楼',
    value: 'FLOOR_FOUR'
  },
  {
    name: '5楼',
    value: 'FLOOR_FIVE'
  },
  {
    name: '6楼',
    value: 'FLOOR_SIX'
  }
]
const blockItem = {
  label: '楼栋',
  key: 'block',
  type: 'select',
  className: 'shadow',
  placeholder: '楼栋',
  props: {
    label: 'name',
    value: 'value'
  },
  disabled: false,
  required: true,
  rules: [
    { required: true, message: '请选择楼栋', trigger: 'change' }
  ],
  list: 'BlockList'
}
const floorItem = {
  label: '楼层',
  key: 'floor',
  type: 'select',
  className: 'shadow',
  placeholder: '楼层',
  props: {
    label: 'name',
    value: 'value'
  },
  disabled: false,
  required: true,
  rules: [
    { required: true, message: '请选择楼层', trigger: 'change' }
  ],
  list: 'FloorList'
}
export default {
  components: {
    tablePage,
    navForm,
    generalForm
  },
  data() {
    return {
      nameList: [],
      navformDisabled: false,
      dialogFormVisible: false,
      isLoading: false,
      buttonLoading: false,
      title: '单元新增',
      rowData: '', // 点击查看选中的行数据
      status: 0, // 0=>查看 1=>xinzeng  2=>修改
      selection: '', // 复选框数据
      auditarr: [], // 已审核数组
      unAuditarr: [], // 未审核数组
      navFormInfo: {
        data: {
          area: '',
          status: '',
          segmentName: '',
          roomTypeName: ''
        },
        fieldList: {
          left: {
            inpLists: [
              {
                type: 'button',
                innerText: '新增',
                authCode: 'myBaseFieldUnit:add',
                className: 'btn-blue',
                handleClick: () => {
                  this.title = '单元新增'
                  this.dialogFormVisible = true
                  this.formInfo.data.area = []
                  this.formInfo.data.block = ''
                  this.formInfo.data.floor = ''
                  this.formInfo.data.segmentName = ''
                  this.formInfo.data.roomTypeName = ''
                  this.formInfo.data.unit = ''
                  this.formInfo.data.styAmount = ''
                  this.formInfo.data.description = ''
                  this.formInfo.fieldList.map(res => {
                    res.disabled = false
                  })
                  blockItem.disabled = false
                  floorItem.disabled = false
                }
              },
              {
                type: 'button',
                innerText: '审核',
                authCode: 'myBaseFieldUnit:review',
                className: 'btn-blue-disabled',
                isDisabled: true,
                handleClick: () => {
                  if (this.auditarr.length !== 0) {
                    this.$message.warning('只能选择未审核数据进行审核')
                    return
                  }
                  if (this.unAuditarr.length === 0) {
                    this.$message({
                      message: '最少需要选择一条未审核数据',
                      type: 'warning'
                    })
                    return
                  }
                  this.setReview(this.unAuditarr)
                }
              },
              {
                type: 'button',
                innerText: '反审核',
                authCode: 'myBaseFieldUnit:unreview',
                className: 'btn-blue-disabled',
                isDisabled: true,
                handleClick: () => {
                  if (this.unAuditarr.length !== 0) {
                    this.$message.warning('只能选择已审核数据进行反审核')
                    return
                  }
                  if (this.auditarr.length === 0) {
                    this.$message({
                      message: '最少需要选择一条已审核数据',
                      type: 'warning'
                    })
                    return
                  }
                  this.setUnreview(this.auditarr)
                }
              },
              {
                type: 'button',
                innerText: '同步',
                authCode: 'myBaseFieldUnit:sync',
                className: 'btn-blue',
                handleClick: () => {
                  this.syncData()
                }
              }
            ]
          },
          right: {
            inpLists: [
              {
                key: 'area',
                type: 'cascader',
                checkStrictly: true,
                customLabel: 'regionName',
                customValue: 'regionNum',
                className: 'shadow',
                placeholder: '大区 / 区域 / 场区',
                options: []
              },
              {
                key: 'segmentName',
                type: 'select',
                className: 'shadow',
                customLabel: '',
                customValue: '',
                placeholder: '工段',
                clearable: 'clearable',
                props: {
                  label: 'FName',
                  value: 'FItemID'
                },
                list: []
              },
              {
                key: 'roomTypeName',
                type: 'select',
                className: 'shadow',
                customLabel: '',
                customValue: '',
                placeholder: '猪舍类型',
                clearable: 'clearable',
                props: {
                  label: 'title',
                  value: 'code'
                },
                list: []
              },
              {
                key: 'status',
                type: 'radio',
                required: true,
                className: 'shadow',
                customLabel: 'name',
                customVal: 'val',
                optList: [{ name: '全部', val: '' }, { name: '已审核', val: 'AUDITED' }, { name: '未审核', val: 'NORMAL' }]
              }

            ],
            btnLists: [
              {
                innerText: '查询',
                className: 'btn-blue',
                handleClick: () => {
                  if (this.selection) {
                    this.selection.forEach(row => {
                      this.$refs.tablePage.$refs.tables.toggleRowSelection(row)
                    })
                  } else {
                    this.$refs.tablePage.$refs.tables.clearSelection()
                  }
                  this.pagination.pageIndex = 1
                  this.getMyEvcMcuInfo()
                }
              },
              {
                innerText: '重置',
                className: 'btn-border',
                handleClick: () => {
                  this.$refs['navForm'].resetFields()
                  this.pagination.pageIndex = 1
                  this.pagination.limit = 10
                  this.getMyEvcMcuInfo()
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
          longData: true,
          prop: 'fieldName',
          label: '场区'
        },
        {
          prop: 'block',
          label: '座',
          rule: {
            BLOCK_A: 'A座',
            BLOCK_B: 'B座'
          }
        },
        {
          prop: 'floor',
          label: '楼层',
          rule: {
            FLOOR_ONE: '1楼',
            FLOOR_TWO: '2楼',
            FLOOR_THREE: '3楼',
            FLOOR_FOUR: '4楼',
            FLOOR_FIVE: '5楼',
            FLOOR_SIX: '6楼'
          }
        },
        {
          prop: 'segmentName',
          label: '工段'
        },
        {
          prop: 'roomTypeName',
          label: '猪舍类型'
        },
        {
          prop: 'unit',
          label: '单元编号'
        },
        {
          prop: 'styAmount',
          label: '栏位数量'
        },
        {
          prop: 'status',
          label: '状态',
          rule: {
            NORMAL: '未审核',
            AUDITED: '已审核'
          }
        },
        {
          button: true,
          label: '操作',
          fixed: 'right',
          align: 'center',
          show: 'status',
          width: '220', // 操作按钮宽度
          group: [
            {
              name: '查看',
              class: 'btn-blue',
              authCode: 'myBaseFieldUnit:view',
              size: 'auto',
              click: 'see',
              status: 'AUDITED'
            },
            {
              name: '修改',
              class: 'btn-blue',
              authCode: 'myBaseFieldUnit:update',
              size: 'auto',
              click: 'edit',
              status: 'NORMAL'
            },
            {
              name: '复制',
              class: 'btn-blue',
              authCode: '',
              size: 'auto',
              click: 'slot'
            },
            {
              name: '删除',
              class: 'btn-red',
              authCode: 'myBaseFieldUnit:delete',
              size: 'auto',
              click: 'remove',
              status: 'NORMAL'
            }
          ]
        }
      ],
      // 表单对应列表
      listTypeInfo: {
        typeList: [],
        roomTypeList: [],
        segmentList: [],
        BlockList,
        FloorList
      },
      // 表单相关
      formInfo: {
        data: {
          area: '', // 位置
          status: '1',
          block: '',
          floor: '',
          segmentName: '',
          roomTypeName: '',
          unit: '',
          styAmount: '',
          description: ''
        },
        fieldList: [
          {
            label: '是否楼房猪舍',
            key: 'status',
            type: 'radio',
            width: '250px',
            className: 'shadow',
            customLabel: 'name',
            customVal: 'val',
            disabled: false,
            required: true,
            rules: [
              { required: true, message: '请选择是否楼房猪舍', trigger: 'change' }
            ],
            optList: [{ name: '是', val: '2' }, { name: '否', val: '1' }]
          },
          {
            label: '地区',
            key: 'area',
            type: 'cascader',
            className: 'shadow',
            customLabel: 'regionName',
            customValue: 'regionNum',
            placeholder: '大区 / 区域 / 场区',
            clearable: 'clearable',
            disabled: false,
            required: true,
            rules: [
              { required: true, message: '请选择地区', trigger: 'change' }
            ],
            options: []
          },
          {
            label: '楼栋',
            key: 'block',
            type: 'select',
            className: 'shadow',
            placeholder: '楼栋',
            props: {
              label: 'name',
              value: 'value'
            },
            disabled: false,
            required: true,
            rules: [
              { required: true, message: '请选择楼栋', trigger: 'change' }
            ],
            list: 'BlockList'
          },
          {
            label: '楼层',
            key: 'floor',
            type: 'select',
            className: 'shadow',
            placeholder: '楼层',
            props: {
              label: 'name',
              value: 'value'
            },
            disabled: false,
            required: true,
            rules: [
              { required: true, message: '请选择楼层', trigger: 'change' }
            ],
            list: 'FloorList'
          },
          {
            label: '工段',
            key: 'segmentName',
            type: 'select',
            className: 'shadow',
            placeholder: '工段',
            disabled: false,
            required: true,
            rules: [
              { required: true, message: '请选择工段', trigger: 'change' }
            ],
            props: {
              label: 'FName',
              value: 'FItemID'
            },
            list: 'segmentList',
            handleChange: () => {
              httpRequest({
                type: 'GET',
                uri: '/wlw/myBaseInfo/roomTypes',
                payload: { segmentId: this.formInfo.data.segmentName },
                callback: (res) => {
                  if (res && res.status === 200) {
                    this.listTypeInfo.roomTypeList = res.data || []
                    this.formInfo.data.roomTypeName = this.listTypeInfo.roomTypeList[0].title || ''
                  }
                }
              })
            }
          },
          {
            label: '猪舍类型',
            key: 'roomTypeName',
            type: 'select',
            className: 'shadow',
            placeholder: '猪舍类型',
            clearable: 'clearable',
            disabled: false,
            required: true,
            rules: [
              { required: true, message: '请选择猪舍类型', trigger: 'change' }
            ],
            props: {
              label: 'title',
              value: 'code'
            },
            list: 'roomTypeList'
          },
          {
            label: '单元编号',
            key: 'unit',
            type: 'number',
            position: 'right',
            className: 'shadow',
            placeholder: '单元编号',
            disabled: false,
            required: true,
            rules: [
              { required: true, message: '请选择单元编号', trigger: 'change' }
            ]
          },
          {
            label: '栏位数量',
            key: 'styAmount',
            type: 'number',
            position: 'right',
            className: 'shadow',
            placeholder: '栏位数量',
            disabled: false,
            required: true,
            rules: [
              { required: true, message: '请选择栏位数量', trigger: 'change' }
            ]
          },
          {
            label: '描述',
            key: 'description',
            type: 'input',
            className: 'shadow',
            disabled: false,
            placeholder: '栏位数量'
          }
        ]
      },
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
    'formInfo.data': {
      handler: function(val) {
        if (val) {
          if (val.status === '1') {
            this.formInfo.data.block = ''
            this.formInfo.data.floor = ''
            delete this.formInfo.fieldList[2]
            delete this.formInfo.fieldList[3]
          } else {
            this.formInfo.fieldList[2] = blockItem
            this.formInfo.fieldList[3] = floorItem
          }
        }
      },
      deep: true
    },
    auditarr(val) {
      if (val.length > 0) {
        this.navFormInfo.fieldList.left.inpLists[2].className = 'btn-blue'
        this.navFormInfo.fieldList.left.inpLists[2].isDisabled = false
      } else {
        this.navFormInfo.fieldList.left.inpLists[2].className = 'btn-blue-disabled'
        this.navFormInfo.fieldList.left.inpLists[2].isDisabled = true
      }
    },
    unAuditarr(val) {
      if (val.length > 0) {
        this.navFormInfo.fieldList.left.inpLists[1].className = 'btn-blue'
        this.navFormInfo.fieldList.left.inpLists[1].isDisabled = false
      } else {
        this.navFormInfo.fieldList.left.inpLists[1].className = 'btn-blue-disabled'
        this.navFormInfo.fieldList.left.inpLists[1].isDisabled = true
      }
    },
    dialogFormVisible(val) { // 手动清楚一下提示语
      if (!val) {
        this.$refs['delog'].resetFields()
      }
    }
  },
  async created() {
    await this.getTree()
    await this.getSegmentAndRoomtype()
    await this.getMyEvcMcuInfo()
  },
  mounted() {},
  methods: {
    cascaderEvent(val, val1, val2) {
      this.nameList = val1
      // if (this.nameList.length === 0) {
      //   this.formInfo.fieldList[1].options.map(a => {
      //     if (this.formInfo.data.area[0] === a.regionNum) {
      //       this.nameList[0] = a.regionName
      //       a.children.map(b => {
      //         if (this.formInfo.data.area[1] && this.formInfo.data.area[1] === b.regionNum) {
      //           this.nameList[1] = b.regionName
      //           b.children.map(c => {
      //             if (this.formInfo.data.area[2] && this.formInfo.data.area[2] === c.regionNum) {
      //               this.nameList[2] = c.regionName
      //             }
      //           })
      //         }
      //       })
      //     }
      //   })
      // }
    },
    handleChange() {},
    // 审核数据接口
    setReview(idArr) {
      const ids = idArr.join(',')
      this.$confirm('此操作将审核这些数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        confirmButtonClass: 'btn-blue btn-blue-confirm',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        httpRequest({
          type: 'POST',
          uri: dataInterfacePageElement.review && dataInterfacePageElement.review.uri + '?ids=' + ids,
          callback: (res) => {
            this.isLoading = false
            if (res && res.status === 200) {
              this.$message({
                message: '审核成功',
                type: 'success'
              })
            }
            this.selection = []
            this.unAuditarr = []
            this.auditarr = []
            this.getMyEvcMcuInfo()
          }
        })
      })
    },
    // 反审核数据接口
    setUnreview(idArr) {
      const ids = idArr.join(',')
      this.$confirm('此操作将反审核这些数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        confirmButtonClass: 'btn-blue btn-blue-confirm',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        httpRequest({
          type: 'POST',
          uri: dataInterfacePageElement.unreview && dataInterfacePageElement.unreview.uri + '?ids=' + ids,
          callback: (res) => {
            this.isLoading = false
            if (res && res.status === 200) {
              this.$message({
                message: '反审核成功',
                type: 'success'
              })
            }
            this.selection = []
            this.unAuditarr = []
            this.auditarr = []
            this.getMyEvcMcuInfo()
          }
        })
      })
    },
    handleIndexChange(current) {
      this.pagination.page = current
      this.getMyEvcMcuInfo()
    },
    handleSizeChange(size) {
      this.pagination.limit = size
      this.getMyEvcMcuInfo()
    },
    // 点查看
    childSeeRow(row, index) {
      this.title = '单元查看'
      this.formInfo.data.area = [row.regionId, row.areaId, row.fieldId]
      this.formInfo.data.status = row.block === null ? '1' : '2'
      this.formInfo.data.block = row.block
      this.formInfo.data.floor = row.floor
      this.formInfo.data.segmentName = row.segmentName
      this.formInfo.data.roomTypeName = row.roomTypeName
      this.formInfo.data.unit = row.unit
      this.formInfo.data.styAmount = row.styAmount
      this.formInfo.data.description = row.description
      this.formInfo.fieldList.map(res => {
        res.disabled = true
      })
      blockItem.disabled = true
      floorItem.disabled = true
      this.dialogFormVisible = true
    },
    // 删除
    removeRow(row, index) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        confirmButtonClass: 'btn-blue btn-blue-confirm',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        httpRequest({
          type: 'DELETE',
          uri: dataInterfacePageElement.delete && dataInterfacePageElement.delete.uri,
          payload: { ids: row.id },
          callback: (res) => {
            if (res && res.status === 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
            }
          }
        })
        this.getMyEvcMcuInfo()
      })
    },
    // 复制
    slotRow(row, index) {
      this.title = '单元新增'
      this.listTypeInfo.roomTypeList = []
      this.rowData = row
      this.nameList = [row.regionName, row.areaName, row.fieldName]
      this.formInfo.data.area = [row.regionId, row.areaId, row.fieldId]
      this.formInfo.data.status = row.block === null ? '1' : '2'
      this.formInfo.data.block = row.block
      this.formInfo.data.floor = row.floor
      this.formInfo.data.segmentName = row.segmentName
      this.formInfo.data.roomTypeName = row.roomTypeName
      this.formInfo.data.unit = row.unit
      this.formInfo.data.styAmount = row.styAmount
      this.formInfo.data.description = row.description
      this.formInfo.fieldList.map(res => {
        res.disabled = false
      })
      blockItem.disabled = false
      floorItem.disabled = false
      this.dialogFormVisible = true
    },
    // 修改
    editRow(row, index) {
      this.title = '单元修改'
      this.listTypeInfo.roomTypeList = []
      this.rowData = row
      this.nameList = [row.regionName, row.areaName, row.fieldName]
      this.formInfo.data.area = [row.regionId, row.areaId, row.fieldId]
      this.formInfo.data.status = row.block === null ? '1' : '2'
      this.formInfo.data.block = row.block
      this.formInfo.data.floor = row.floor
      this.formInfo.data.segmentName = row.segmentName
      this.formInfo.data.roomTypeName = row.roomTypeName
      this.formInfo.data.unit = row.unit
      this.formInfo.data.styAmount = row.styAmount
      this.formInfo.data.description = row.description
      this.formInfo.fieldList.map(res => {
        res.disabled = false
      })
      blockItem.disabled = false
      floorItem.disabled = false
      this.dialogFormVisible = true
    },
    // 复选框
    handleSelectionChange(selection) {
      this.selection = selection
      console.log(selection)
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
    // dialog确定按钮
    determine() {
      if (!this.$refs['delog'].validateSelf()) {
        return false
      }
      let uri = ''
      let roomTypeName = ''
      let roomTypeId = ''
      let segmentName = ''
      let segmentId = ''
      this.listTypeInfo.segmentList.map(res => {
        if (this.formInfo.data.segmentName === res.FItemID || this.formInfo.data.segmentName === res.FName) {
          segmentName = res.FName
          segmentId = res.FItemID
        }
      })
      this.navFormInfo.fieldList.right.inpLists[2].list.map(res => {
        if (this.formInfo.data.roomTypeName === res.code || this.formInfo.data.roomTypeName === res.title) {
          roomTypeName = res.title
          roomTypeId = res.code
        }
      })
      const obj = {
        id: this.rowData.id || '',
        regionId: this.formInfo.data.area[0],
        regionName: this.nameList[0],
        areaId: this.formInfo.data.area[1],
        areaName: this.nameList[1],
        fieldId: this.formInfo.data.area[2],
        fieldName: this.nameList[2],
        roomTypeId: roomTypeId,
        roomTypeName: roomTypeName,
        segmentId: segmentId,
        segmentName: segmentName,
        block: this.formInfo.data.block,
        floor: this.formInfo.data.floor,
        unit: this.formInfo.data.unit,
        styAmount: this.formInfo.data.styAmount,
        description: this.formInfo.data.description
      }
      console.log(obj)
      let p = ''
      if (this.title === '单元修改') {
        uri = dataInterfacePageElement.update && dataInterfacePageElement.update.uri
        p = 'PUT'
      } else {
        delete obj.id
        uri = dataInterfacePageElement.add && dataInterfacePageElement.add.uri
        p = 'POST'
      }
      this.buttonLoading = true
      httpRequest({
        type: p,
        uri: uri,
        payload: this.handleObj(obj),
        callback: (res) => {
          this.buttonLoading = false
          if (res && res.status === 200) {
            console.log(res.data)
            this.dialogFormVisible = false
            if (this.title === '单元修改') {
              this.$message.success('修改成功')
            } else {
              this.$message.success('新增成功')
            }
            this.rowData = ''
            this.getMyEvcMcuInfo()
          }
        }
      })
    },
    // 同步
    syncData() {
      httpRequest({
        type: 'POST',
        uri: dataInterfacePageElement.sync && dataInterfacePageElement.sync.uri,
        payload: {},
        callback: (res) => {
          if (res && res.status === 200) {
            if (res.rel) {
              this.$message.success(res.message || '同步完成')
            } else {
              this.$message.warning(res.message)
            }
          }
        }
      })
    },
    // 获取区域联动数据
    getTree() {
      httpRequest({
        type: 'POST',
        uri: '/wlw/myBaseInfo/treeForRegionAreaField',
        payload: '',
        callback: (res) => {
          if (res && res.status === 200) {
            this.navFormInfo.fieldList.right.inpLists[0].options = res.data.rows
            this.formInfo.fieldList[1].options = res.data.rows
          }
        }
      })
    },
    // 获取工段和猪舍
    async getSegmentAndRoomtype() {
      await httpRequest({
        type: 'POST',
        uri: '/wlw/myBaseInfo/segmentInfo',
        payload: {},
        callback: (res) => {
          if (res && res.status === 200) {
            this.navFormInfo.fieldList.right.inpLists[1].list = res.data.rows || []
            this.listTypeInfo.segmentList = res.data.rows || []
            console.log(this.listTypeInfo)
            console.log(this.formInfo.fieldList[4])
          }
        }
      })
      await httpRequest({
        type: 'GET',
        uri: '/wlw/myBaseInfo/roomTypes',
        payload: {},
        callback: (res) => {
          if (res && res.status === 200) {
            this.navFormInfo.fieldList.right.inpLists[2].list = res.data && res.data || []
          }
        }
      })
    },
    // 获取表单信息
    getMyEvcMcuInfo() {
      this.isLoading = true
      const obj = {
        regionId: this.navFormInfo.data.area[0],
        areaId: this.navFormInfo.data.area[1],
        fieldId: this.navFormInfo.data.area[2],
        limit: this.pagination.limit,
        page: this.pagination.pageIndex,
        roomTypeId: this.navFormInfo.data.roomTypeName,
        segmentId: this.navFormInfo.data.segmentName,
        status: this.navFormInfo.data.status
      }
      httpRequest({
        type: 'POST',
        uri: dataInterfacePageElement.view && dataInterfacePageElement.view.uri,
        payload: this.handleObj(obj),
        callback: (res) => {
          this.isLoading = false
          if (res && res.status === 200) {
            const arr = res.data.rows
            this.tableData = arr || []
            this.pagination.total = res.data.total
            this.$refs['tablePage'].$children[0].clearSelection()
          }
        }
      })
      this.unAuditarr = []
      this.auditarr = []
    },
    // 处理对象 删除值为''字段 返回对象
    handleObj(obj) {
      for (const key in obj) {
        if (obj[key] === null || obj[key] === '' || obj[key] === undefined) {
          delete obj[key]
        }
      }
      return obj
    }
  }
}
</script>
<style lang="scss">
.unitInformation .unitInfoDialog{
  .el-dialog__body{
    // padding: 20px 30px;
  }
  .el-form-item{
    margin-bottom: 20px;
  }
  .el-form-item__label{
    width: 100px !important;
  }
  .el-form-item__content{
    margin-left: 100px !important;
  }
  .el-radio__input.is-disabled.is-checked .el-radio__inner::after{
    background-color: #409EFF;
  }
}
.unitInformation{
  .el-table__empty-block{
    width: 100% !important;
  }
}
</style>
