<template>
  <div class="home el-delogBG2 unitControllerInformationMaintenance">
    <!-- 头部导航 -->
    <nav-form ref="navForm" :data="navFormInfo.data" :field-list="navFormInfo.fieldList" />
    <!-- 表格内容 -->

    <tablePage
      ref="tablePage"
      :is-loading="isLoading"
      class="delog"
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
    <!-- 新增 -->
    <el-dialog
      :title="title"
      :modal-append-to-body="false"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <div class="body">
        <general-form
          ref="delog"
          :data="formInfo.data"
          :field-list="formInfo.fieldList"
          :list-type-info="listTypeInfo"
          theme-type="default"
          @handleChange="handleChange"
          @cascaderEvent="cascaderEvent"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <div style="width:100%;margin:0 auto;">
          <el-button class="btn-border" @click="dialogFormVisible = false">取 消</el-button>
          <el-button v-if="status==1" class="btn-blue" :loading="btnLoading" @click="determine">确 定</el-button>
          <el-button v-if="status==2" class="btn-blue" :loading="btnLoading" @click="determine">更 新</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const floorList = [{
  name: '一楼',
  value: 'FLOOR_ONE'
}, {
  name: '二楼',
  value: 'FLOOR_TWO'
}, {
  name: '三楼',
  value: 'FLOOR_THREE'
}, {
  name: '四楼',
  value: 'FLOOR_FOUR'
}, {
  name: '五楼',
  value: 'FLOOR_FIVE'
}, {
  name: '六楼',
  value: 'FLOOR_SIX'
}]
import tablePage from '@/components/ElementComponent/iTable'
import navForm from '@/components/commonComponent/navForm/index.vue'
import generalForm from '@/components/commonComponent/generalForm'
import { evcJsonh2Tree } from '@/components/tree/evcJsonh2Tree.js'
import {
  getRegionAreaFieldRoomTypeUnitV2,
  myEvcMcuInfo,
  getMyEvcMcuInfoList,
  add,
  update,
  deleteObj,
  unreview,
  review
} from '@/http/api/baseInfo/unitControllerInformationMaintenance.js'
import {
  getRegionAreaFieldTree,
  getRootTypeUnitTreeV2
} from '@/http/api/baseInfo/regionAreaField.js'
export default {
  components: {
    tablePage,
    navForm,
    generalForm
  },
  data() {
    return {
      btnLoading: false,
      isLoading: false, // 表格loading
      dialogFormVisible: false,
      title: '查看',
      status: 0, // 0=>查看 1=>xinzeng  2=>修改
      downlist: [],
      selection: '',
      row: '', // 当前选中行的数据
      auditarr: [], // 已审核数组
      unAuditarr: [], // 未审核数组
      navFormInfo: {
        data: {
          city: [], // 区域三级
          roomtypeUnit: [],
          status: '', // 审核状态
          deviceId: '', // 设备标识
          mac: '', // MAC地址
          floor: '' // 楼
        },
        fieldList: {
          left: {
            inpLists: [
              {
                type: 'button',
                innerText: '新增',
                className: 'btn-blue',
                authCode: 'unitControllerMaintain:add',
                handleClick: () => {
                  this.status = 1
                  this.resetGenerForm()
                  this.formInfo.fieldList = this.formInfo.fieldList.map((item) => {
                    item.disabled = false
                    return item
                  })
                  this.dialogFormVisible = true
                }
              },
              {
                type: 'button',
                innerText: '审核',
                className: 'btn-blue-disabled',
                isDisabled: true,
                authCode: 'unitControllerMaintain:review',
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
                  this.$confirm('此操作将审核这些数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    confirmButtonClass: 'btn-blue btn-blue-confirm',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    // this.setUnreview(this.unAuditarr)
                    this.setReview(this.unAuditarr)
                  }).catch(() => {})
                }
              },
              {
                type: 'button',
                innerText: '反审核',
                className: 'btn-blue-disabled',
                isDisabled: true,
                authCode: 'unitControllerMaintain:unreview',
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
                key: 'city',
                type: 'cascader',
                checkStrictly: true,
                customLabel: 'title',
                clearable: true,
                className: 'shadow',
                width: '200px',
                valueKey: 0,
                placeholder: '大区 / 区域 / 场区',
                options: [],
                handleChange: (v1) => {
                  if (v1.length === 3) {
                    getRootTypeUnitTreeV2({ isBuilding: true, fieldId: v1[2] }).then(data => {
                      if (data.status === 200) {
                        this.navFormInfo.fieldList.right.inpLists[2].options = data.data
                      } else {
                        this.navFormInfo.fieldList.right.inpLists[2].options = []
                      }
                    })
                    this.navFormInfo.data.roomtypeUnit = []
                  } else {
                    this.navFormInfo.fieldList.right.inpLists[2].options = []
                    this.navFormInfo.data.roomtypeUnit = []
                  }
                }
              },
              {
                key: 'roomtypeUnit',
                type: 'cascader2',
                checkStrictly: true,
                customLabel: 'title',
                className: 'shadow',
                placeholder: '楼座 / 猪舍类型 / 单元',
                width: '200px',
                valueKey: 1,
                clearable: true,
                options: [],
                handleChange: (v1) => {
                  console.log(this.navFormInfo.data.roomtypeUnit)
                }
              },
              {
                key: 'floor',
                type: 'select',
                className: 'shadow',
                props: {
                  label: 'name',
                  value: 'value'
                },
                list: floorList,
                placeholder: '请选择楼层'
              },
              {
                key: 'deviceId',
                type: 'input',
                label: '',
                className: 'shadow',
                placeholder: '设备标识'
              },
              {
                key: 'mac',
                type: 'input',
                label: '',
                className: 'shadow',
                placeholder: 'Mac地址'
              }
            ],
            btnLists: [
              {
                innerText: '查询',
                className: 'btn-blue',
                authCode: 'unitControllerMaintain:list',
                handleClick: () => {
                  this.pagination.pageIndex = 1
                  this.getMyEvcMcuInfoList()
                }
              },
              {
                innerText: '重置',
                className: 'btn-border',
                handleClick: () => {
                  this.pagination.pageIndex = 1
                  this.$refs['navForm'].resetFields()
                  this.getMyEvcMcuInfoList()
                }
              }
            ]
          }
        }
      },
      columns: [
        {
          longData: true,
          prop: 'areaName',
          label: '区域',
          width: '120'
        },
        {
          longData: true,
          prop: 'fieldName',
          label: '场区',
          width: '120'
        },
        {
          prop: 'block',
          label: '座',
          width: '90',
          rule: {
            'BLOCK_A': 'A座',
            'BLOCK_B': 'B座'
          }
        },
        {
          prop: 'floor',
          label: '楼层',
          width: '90',
          rule: {
            'FLOOR_ONE': '一楼',
            'FLOOR_TWO ': '二楼',
            'FLOOR_THREE': '三楼',
            'FLOOR_FOUR': '四楼',
            'FLOOR_FIVE': '五楼',
            'FLOOR_SIX': '六楼',
            'FLOOR_SEVEN': '七楼'
          }
        },
        {
          prop: 'roomTypeName',
          label: '猪舍类型',
          width: '120'
        },
        {
          longData: true,
          prop: 'segmentName',
          label: '工段',
          width: '120'
        },
        {
          prop: 'unitName',
          label: '单元',
          width: '90'
        },
        {
          longData: true,
          prop: 'deviceName',
          label: '设备名称',
          width: '220'
        },
        {
          longData: true,
          prop: 'deviceId',
          label: '设备标识',
          width: '220'
        },
        {
          longData: true,
          prop: 'deviceVersionName',
          label: '设备型号',
          width: '150'
        },
        {
          longData: true,
          prop: 'mac',
          label: 'MAC地址',
          width: '160'
        },
        {
          prop: 'status',
          label: '状态',
          width: '80',
          rule: {
            'NORMAL': '未审核',
            'AUDITED': '已审核'
          }
        },
        {
          prop: 'crtName',
          label: '创建人',
          width: '80'
        },
        {
          longData: true,
          prop: 'crtTime',
          label: '创建日期',
          width: '160'
        },
        {
          prop: 'updName',
          label: '修改人',
          width: '80'
        },
        {
          longData: true,
          prop: 'updTime',
          label: '修改日期',
          width: '160'
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
              size: 'auto',
              click: 'see',
              status: 'AUDITED'
            },
            {
              name: '修改',
              class: 'btn-blue',
              authCode: 'unitControllerMaintain:update',
              size: 'auto',
              click: 'edit',
              status: 'NORMAL'
            },
            {
              name: '删除',
              class: 'btn-red',
              authCode: 'unitControllerMaintain:delete',
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
        floorList
      },
      // 表单相关
      formInfo: {
        data: {
          city: '', // *部署位置
          deviceId: '', // 设备编码
          mac: '',
          status: '',
          floor: '' // 楼
        },
        fieldList: [
          {
            label: '部署位置',
            key: 'city',
            type: 'cascader',
            checkStrictly: false,
            className: 'shadow',
            customNode: 'title',
            customLabel: 'title',
            customValue: '',
            placeholder: '大区 / 区域 / 场区 / 猪舍类型 / 单元',
            required: true,
            rules: [
              { required: true, message: '请选择部署位置', trigger: 'change' }
            ],
            options: []
          },
          {
            label: '设备条码',
            key: 'deviceId',
            type: 'select',
            className: 'shadow',
            filterable: true,
            remote: true,
            loading: false,
            remoteMethod: (val) => {
              this.deviceId = val
              this.getEquipmentList()
            },
            focusEvent: () => {
              this.deviceId = ''
              this.getEquipmentList()
            },
            props: {
              label: 'device_id',
              value: 'id'
            },
            list: 'typeList',
            required: true,
            rules: [{ required: true, message: '请选择设备条码', trigger: 'change' }],
            handleChange: (data) => {
              const id = this.formInfo.data.deviceId
              const obj = this.listTypeInfo.typeList.find(item => { return item.id === id })
              console.log('obj', obj)
              this.formInfo.data.deviceId = obj.device_id
              this.formInfo.data.deviceName = obj.device_name
              this.formInfo.data.deviceVersionId = obj.device_version_id
              this.formInfo.data.deviceVersionName = obj.version_name
              this.formInfo.data.equipmentId = obj.id
              this.formInfo.data.equiptypeId = obj.equiptype_id
              this.formInfo.data.equiptypeName = obj.equiptype_name
              this.formInfo.data.qrCode = obj.qr_code
            }
          }
        ]
      },
      tableData: [], // 表单数据
      deviceId: '',
      // 分页信息
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
    dialogFormVisible(val) {
      if (!val) {
        this.$refs['delog'].resetFields() // 手动清楚一下提示语
      }
    },
    'navFormInfo.data.city': {
      handler: function(n) {
        if (n.length === 0) {
          this.navFormInfo.fieldList.right.inpLists[1].valueKey++ // 只要监听到数据源发生变化 ，改变keyValue的值，达到重新渲染的效果
          this.navFormInfo.fieldList.right.inpLists[2].valueKey++
        }
      },
      deep: true
    },
    'status'(n) {
      if (n === 0) {
        this.title = '查看'
      } else if (n === 1) {
        this.title = '新增'
      } else {
        this.title = '修改'
      }
    },
    // 这里侦听审核 反审核 下发配置的dis状态
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
    }
    // selection(val) {
    //   if (val.length > 0) {
    //     this.navFormInfo.fieldList.left.inpLists[2].className = 'btn-blue'
    //     this.navFormInfo.fieldList.left.inpLists[2].isDisabled = false
    //     this.navFormInfo.fieldList.left.inpLists[1].className = 'btn-blue'
    //     this.navFormInfo.fieldList.left.inpLists[1].isDisabled = false
    //   } else {
    //     this.navFormInfo.fieldList.left.inpLists[2].className = 'btn-blue-disabled'
    //     this.navFormInfo.fieldList.left.inpLists[2].isDisabled = true
    //     this.navFormInfo.fieldList.left.inpLists[1].className = 'btn-blue-disabled'
    //     this.navFormInfo.fieldList.left.inpLists[1].isDisabled = true
    //   }
    // }
  },
  created() {
    this.init()
    this.getMyEvcMcuInfoList()
  },
  mounted() {
  },
  methods: {
    // 获取三级区域 以及设备条码列表
    init() {
      const o = { isBuilding: true }
      getRegionAreaFieldTree(o).then(data => {
        if (data.status === 200 && data.rel) {
          this.navFormInfo.fieldList.right.inpLists[1].options = data.data
        } else {
          this.navFormInfo.fieldList.right.inpLists[1].options = []
        }
      })
      getRegionAreaFieldRoomTypeUnitV2(o).then(res => {
        if (res && res.status === 200 && res.rel === true) {
          const arr = evcJsonh2Tree(res.data)
          this.formInfo.fieldList[0].options = arr
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {})
      this.getEquipmentList()
    },
    getEquipmentList() {
      this.formInfo.fieldList[1].loading = true
      myEvcMcuInfo({ deviceId: this.deviceId, limit: 20 }).then(res => {
        this.formInfo.fieldList[1].loading = false
        if (res && res.status === 200) {
          this.listTypeInfo.typeList = res.data.rows
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {})
    },
    // 获取table列表
    getMyEvcMcuInfoList() {
      const o = {
        regionId: this.navFormInfo.data.city[0] || '',
        areaId: this.navFormInfo.data.city[1] || '',
        fieldId: this.navFormInfo.data.city[2] || '',
        floor: this.navFormInfo.data.floor,
        deviceId: this.navFormInfo.data.deviceId,
        mac: this.navFormInfo.data.mac,
        status: this.navFormInfo.data.status,
        page: this.pagination.pageIndex, // 页码
        limit: this.pagination.limit
      }
      if (this.navFormInfo.data.roomtypeUnit.length > 0) {
        if (this.navFormInfo.data.roomtypeUnit[0] === 'BLOCK_A' || this.navFormInfo.data.roomtypeUnit[0] === 'BLOCK_B') {
          o['block'] = this.navFormInfo.data.roomtypeUnit[0]
          o['roomTypeId'] = this.navFormInfo.data.roomtypeUnit[1]
          o['unitId'] = this.navFormInfo.data.roomtypeUnit[2]
        } else {
          o['roomTypeId'] = this.navFormInfo.data.roomtypeUnit[0]
          o['unitId'] = this.navFormInfo.data.roomtypeUnit[1]
        }
      }
      this.isLoading = true
      getMyEvcMcuInfoList(o).then(res => {
        this.isLoading = false
        if (res && res.status === 200) {
          this.tableData = res.data.rows
          this.pagination.total = res.data.total
          this.$refs['tablePage'].$children[0].clearSelection()
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => { this.isLoading = false })
    },
    // 区域级联
    cascaderEvent(val, val1, val2) {
      this.formInfo.data.regionName = val1[0] || ''
      this.formInfo.data.areaName = val1[1] || ''
      this.formInfo.data.fieldName = val1[2] || ''
      this.formInfo.data.roomTypeName = val1[4] || ''
      this.formInfo.data.unitName = val1[5] || ''
      // 这里额外处理取得 segmentName segmentId floor字段
      // console.log(val)
      // console.log(val1)
      // console.log(val2)
      this.formInfo.data.segmentName = val2[5] ? val2[5].data.attributes.segmentName : ''
      this.formInfo.data.segmentId = val2[5] ? val2[5].data.attributes.segmentId : ''
      this.formInfo.data.floor = val2[5] ? val2[5].data.attributes.floor : ''
      // id
      this.formInfo.data.regionId = val[0] || ''
      this.formInfo.data.areaId = val[1] || ''
      this.formInfo.data.fieldId = val[2] || ''
      this.formInfo.data.block = val[3] || ''
      this.formInfo.data.roomTypeId = val[4] || ''
      this.formInfo.data.unitId = val[5] || ''
    },
    handleChange(val) {

    },
    // 翻页
    handleIndexChange(current) {
      this.pagination.pageIndex = current
      this.getMyEvcMcuInfoList()
    },
    // 设置一页显示数
    handleSizeChange(size) {
      this.pagination.pageIndex = 1
      this.pagination.limit = size
      this.getMyEvcMcuInfoList()
    },
    // 点查看
    childSeeRow(row, index) {
      if (!row.city) {
        row.city = [row.regionId, row.areaId, row.fieldId, row.block, row.roomTypeId, row.unitId]
      }
      this.formInfo.data = { ...row }
      // 查看时 表单元素dis
      this.formInfo.fieldList = this.formInfo.fieldList.map((item) => {
        item.disabled = true
        return item
      })
      this.status = 0
      this.dialogFormVisible = true
    },
    // 删除
    removeRow(row, index) {
      deleteObj({
        ids: row.id
      }).then(res => {
        if (res && res.status === 200 && res.rel === true) {
          this.$message.success('删除成功')
          this.getMyEvcMcuInfoList()
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {})
    },
    // 修改
    editRow(row, index) {
      console.log('row', row)
      if (!row.city) { // 自己组装下city数组
        row.city = [row.regionId, row.areaId, row.fieldId, row.block, row.roomTypeId, row.unitId]
      }
      this.formInfo.data = { ...row }
      // 查看时 表单元素dis
      this.formInfo.fieldList = this.formInfo.fieldList.map((item) => {
        item.disabled = false
        return item
      })
      this.status = 2
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
    // 新增 status = 1 修改 status = 2 查看 0
    determine() {
      if (!this.$refs['delog'].validateSelf()) {
        return false
      }
      if (this.status === 1) {
        const o = Object.assign({}, this.formInfo.data)
        delete o.city
        // console.log('o', o)
        this.btnLoading = true
        add(o).then(res => {
          this.btnLoading = false
          if (res && res.status === 200 && res.rel === true) {
            this.dialogFormVisible = false
            this.$message.success('新增成功')
            this.resetGenerForm()
            this.getMyEvcMcuInfoList()
          } else {
            this.$message.error(res.message)
          }
        }).catch(() => {
          this.btnLoading = false
        })
      } else if (this.status === 2) {
        const o = this.formInfo.data
        this.btnLoading = true
        update(o).then(res => {
          this.btnLoading = false
          if (res && res.status === 200 && res.rel === true) {
            this.dialogFormVisible = false
            this.$message.success('更新成功')
            this.resetGenerForm()
            this.getMyEvcMcuInfoList()
          } else {
            this.$message.error(res.message)
          }
        }).catch(() => {
          this.btnLoading = false
        })
      }
    },
    resetGenerForm() { // 新增 编辑 查看清空表单
      this.formInfo.data = {
        city: [],
        deviceId: ''
      }
    },
    // 反审核
    setUnreview() {
      const ids = this.auditarr.join()
      unreview({ ids }).then(res => {
        if (res && res.status === 200 && res.rel === true) {
          this.$message.success('反审核成功')
          this.selection = []
          this.unAuditarr = []
          this.auditarr = []
          this.getMyEvcMcuInfoList()
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {})
    },
    // 审核
    setReview() {
      const ids = this.unAuditarr.join()
      review({ ids }).then(res => {
        if (res && res.status === 200 && res.rel === true) {
          this.$message.success('审核成功')
          this.selection = []
          this.unAuditarr = []
          this.auditarr = []
          this.getMyEvcMcuInfoList()
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.el-delogBG2 {
  .el-dialog {
    max-width: 662px;
    width: 100%;
  }

  .dialog-footer{
    padding: 10px 30px 20px;
    .el-cascader{
      width: 100% !important;
    }
  }
}
.el-form-item__content{
 .el-cascader{
      width: 100% !important;
    }
}
</style>
<style lang="scss">
.unitControllerInformationMaintenance{
.itable-empty-box-wrap{
    position: relative;
    right: 360px;
  }
}
</style>
