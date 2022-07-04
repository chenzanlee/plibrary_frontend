<template>
  <div class="home fanDatabase">
    <!-- 头部导航 -->
    <nav-form ref="navForm" :data="navFormInfo.data" :field-list="navFormInfo.fieldList" />

    <!-- 表格内容 -->
    <tablePage
      ref="tablePage"
      :columns="columns"
      :data-source="tableData"
      :options="options"
      :pagination="pagination"
      :is-loading="isLoading"
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
      <general-form
        ref="delog"
        :data="formInfo.data"
        :field-list="formInfo.fieldList"
        :list-type-info="listTypeInfo"
        theme-type="default"
        @handleChange="handleChange"
      />
      <div slot="footer">
        <div style="width:100%;margin:0 auto;">
          <el-button class="btn-border canleButton" @click="dialogFormVisible = false">取 消</el-button>
          <el-button v-if="status==1" class="btn-blue" :loading="btnLoading" type="primary" @click="determine">确 定</el-button>
          <el-button v-if="status==2" class="btn-blue" :loading="btnLoading" type="primary" @click="determine">更 新</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import tablePage from '@/components/ElementComponent/iTable'
import navForm from '@/components/commonComponent/navForm/index.vue'
import generalForm from '@/components/commonComponent/generalForm'
import { getConfigElement } from '@/utils/overtService'
// import {dropDownList,userList} from "@/http/api/baseInfo/basicsInformation.js"
export default {
  components: {
    tablePage,
    navForm,
    generalForm
  },
  data() {
    return {
      pageElement: [], // 页面权限数组
      dataInterface: [], // 数据接口权限数组
      dialogFormVisible: false,
      isLoading: false,
      btnLoading: false,
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
      auditarr: [], // 已审核数组
      unAuditarr: [], // 未审核数组
      // 审核表头
      navFormInfo: {
        data: {
          nameCode: '', // 名称
          typeCode: '', // 类型
          modelCode: '', // 型号
          status: '' // 状态
        },
        fieldList: {
          left: {
            inpLists: [
              {
                type: 'button',
                innerText: '新增',
                className: 'btn-blue',
                handleClick: () => {
                  for (var i in this.formInfo.data) {
                    this.formInfo.data[i] = ''
                  }
                  this.formInfo.fieldList.map(item => {
                    item['disabled'] = false
                  })
                  this.status = 1
                  this.dialogFormVisible = true
                }
              },
              {
                type: 'button',
                innerText: '审核',
                authCode: 'unitWindConfigManager:btn_review',
                className: 'btn-blue',
                isDisabled: true,
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
                  this.setReview(this.unAuditarr)
                }
              },
              {
                type: 'button',
                innerText: '反审核',
                authCode: 'unitWindConfigManager:btn_unreview',
                className: 'btn-blue',
                isDisabled: true,
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
                  this.setUnreview(this.auditarr)
                }
              }
            ]
          },
          right: {
            inpLists: [
              {
                key: 'nameCode',
                type: 'select',
                label: '',
                width: '150px',
                className: 'shadow',
                clearable: true,
                props: {
                  value: 'code',
                  label: 'title'
                },
                placeholder: '风机名称',
                list: []
              },
              {
                key: 'typeCode',
                type: 'select',
                label: '',
                width: '150px',
                className: 'shadow',
                placeholder: '风机类型',
                clearable: true,
                props: {
                  value: 'code',
                  label: 'title'
                },
                list: []
              },
              {
                key: 'modelCode',
                type: 'select',
                label: '',
                width: '150px',
                clearable: true,
                className: 'shadow',
                placeholder: '风机型号',
                props: {
                  value: 'code',
                  label: 'title'
                },
                list: []
              },
              {
                key: 'status',
                type: 'radio',
                required: true,
                className: 'shadow',
                placeholder: '333',
                customLabel: 'name',
                customVal: 'val',
                optList: [
                  { name: '全部', val: '' },
                  { name: '已审核', val: 'AUDITED' },
                  { name: '未审核', val: 'NORMAL' }
                ]
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
                  this.pagination.pageIndex = 1
                  this.$refs['navForm'].resetFields()
                  this.getMyEvcMcuInfo()
                }
              }
            ]
          }
        }
      },
      columns: [
        {
          prop: 'otherName',
          label: '风机别名',
          minWidth: '120'
        },
        {
          prop: 'name',
          label: '风机名称',
          width: '120'
        },
        {
          prop: 'model',
          label: '风机型号',
          width: '100'
        },
        {
          prop: 'volume',
          label: '风量Q',
          width: '80'
        },
        {
          prop: 'formula',
          label: '通风量计算公式',
          minWidth: '180'
        },
        {
          prop: 'status',
          label: '状态',
          width: '80',
          rule: {
            NORMAL: '未审核',
            AUDITED: '已审核'
          }
        },
        {
          prop: 'crtTime',
          label: '创建日期',
          width: '160'
        },
        {
          prop: 'crtName',
          label: '创建人',
          width: '80'
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
              authCode: 'unitWindConfigManager:btn_update',
              size: 'auto',
              click: 'edit',
              status: 'NORMAL'
            },
            {
              name: '删除',
              class: 'btn-red',
              authCode: 'unitWindConfigManager:btn_del',
              size: 'auto',
              click: 'remove',
              status: 'NORMAL'
            }
          ]
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
            type: 'inputNumber',
            controlsPositionRight: 'right',
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
            className: 'shadow'
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
    // 名称选择改变修改类型列表
    'navFormInfo.data.nameCode': {
      handler: function(n) {
        this.getTypeList({
          code: n
        })
        this.navFormInfo.data.typeCode = ''
        this.navFormInfo.data.mocelCode = ''
      },
      deep: true
    },
    // 类型选择改变修改型号列表
    'navFormInfo.data.typeCode': {
      handler: function(n) {
        this.getModelList({
          code: n
        })
        this.navFormInfo.data.mocelCode = ''
      },
      deep: true
    },

    status(n) {
      if (n === 0) {
        this.title = '查看'
      } else if (n === 1) {
        this.title = '新增'
      } else {
        this.title = '修改'
      }
    },
    // 名称选择改变修改类型列表
    'formInfo.data.nameCode': {
      handler: function(n) {
        this.getTypeList(
          {
            code: n
          },
          1
        )
        if (this.linkage) {
          console.log('还是联动了', this.linkage)
          this.formInfo.data.typeCode = ''
          this.formInfo.data.modelCode = ''
        }
      },
      deep: true
    },
    // 类型选择改变修改型号列表
    'formInfo.data.typeCode': {
      handler: function(n) {
        this.getModelList(
          {
            code: n
          },
          1
        )
        if (this.linkage) {
          this.formInfo.data.modelCode = ''
        }
      },
      deep: true
    },
    dialogFormVisible(val) {
      if (!val) {
        this.$refs['delog'].resetFields() // 手动清楚一下提示语
      }
    },
    // 这里侦听审核 反审核 下发配置的dis状态
    auditarr(val) {
      if (val.length > 0) {
        this.navFormInfo.fieldList.left.inpLists[2].isDisabled = false
      } else {
        this.navFormInfo.fieldList.left.inpLists[2].isDisabled = true
      }
    },
    unAuditarr(val) {
      if (val.length > 0) {
        this.navFormInfo.fieldList.left.inpLists[1].isDisabled = false
      } else {
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
    this.pageElement = getConfigElement('unitWindConfigManager')
    this.dataInterface = getConfigElement('unit-evcDataInterface')
  },
  mounted() {
    this.getNameList() // 获取名称
    this.getTypeList({ code: '' }, 2) // 获取类型
    this.getModelList({ code: '1903' }, 2)
    this.getMyEvcMcuInfo()
  },
  methods: {
    // 新增修改接口
    settableAdd() {
      if (this.status === 1) {
        const element = this.pageElement['btn_add']
        if (this.$refs['delog'].validateSelf()) {
          console.log(true)
        } else {
          return false
        }
        this.btnLoading = true
        this.$httpRequest({
          type: element.method,
          uri: element.uri,
          payload: this.formInfo.data,
          callback: data => {
            this.btnLoading = false
            if (data.status === 200 && data.rel) {
              this.$message({
                message: '新增成功',
                type: 'success'
              })
              for (var i in this.formInfo.data) {
                this.formInfo.data[i] = ''
              }
              this.dialogFormVisible = false
              this.getMyEvcMcuInfo()
            }
          }
        })
        // tableAdd(this.formInfo.data).then((data) => {
        //   this.$message({
        //     message: '新增成功',
        //     type: 'success'
        //   })
        //   this.buttonLoading = false
        //   for (var i in this.formInfo.data) {
        //     this.formInfo.data[i] = ''
        //   }
        //   this.dialogFormVisible = false
        //   this.getMyEvcMcuInfo()
        // })
      } else {
        const element = this.pageElement['btn_update']
        if (this.$refs['delog'].validateSelf()) {
          console.log(true)
        } else {
          return false
        }
        this.row.regionId = this.submit.regionId
        this.row.areaId = this.submit.areaId
        this.row.fieldId = this.submit.fieldId
        this.row.roomTypeId = this.submit.roomTypeId
        this.row.unitId = this.submit.unitId
        this.row.deviceId = this.submit.code
        for (var i in this.formInfo.data) {
          this.row[i] = this.formInfo.data[i]
        }
        this.btnLoading = true
        this.$httpRequest({
          type: element.method,
          uri: element.uri,
          payload: this.row,
          callback: data => {
            this.btnLoading = false
            if (data.status === 200 && data.rel) {
              this.$message({
                message: '更新成功',
                type: 'success'
              })
              for (var i in this.formInfo.data) {
                this.formInfo.data[i] = ''
              }
              this.dialogFormVisible = false
              this.getMyEvcMcuInfo()
            }
          }
        })
        // tableUpdate(this.row).then((data) => {
        //   this.$message({
        //     message: '更新成功',
        //     type: 'success'
        //   })
        //   this.buttonLoading = false
        //   for (var i in this.formInfo.data) {
        //     this.formInfo.data[i] = ''
        //   }
        //   this.dialogFormVisible = false
        //   this.getMyEvcMcuInfo()
        // })
      }
    },
    handleChange() {
      console.log('触发了handleChange')
    },
    // 审核数据接口
    setReview(idArr) {
      const ids = idArr.join(',')
      this.$confirm('此操作将审核这些数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        confirmButtonClass: 'btn-blue btn-blue-confirm',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const element = this.pageElement['btn_review']
        this.$httpRequest({
          type: element.method,
          uri: element.uri + '?ids=' + ids,
          callback: data => {
            if (data.status === 200 && data.rel) {
              this.$message({
                message: '审核成功',
                type: 'success'
              })
              this.selection = []
              this.unAuditarr = []
              this.auditarr = []
              this.getMyEvcMcuInfo()
            }
          }
        })
        // review({
        //   ids: ids
        // }).then((data) => {
        //   if (data.status === 200) {
        //     this.$message({
        //       message: '审核成功',
        //       type: 'success'
        //     })
        //     this.selection = []
        //     this.unAuditarr = []
        //     this.auditarr = []
        //     this.getMyEvcMcuInfo()
        //   }
        // })
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
        const element = this.pageElement['btn_unreview']
        this.$httpRequest({
          type: element.method,
          uri: element.uri + '?ids=' + ids,
          callback: data => {
            if (data.status === 200 && data.rel) {
              this.$message({
                message: '反审核成功',
                type: 'success'
              })
              this.selection = []
              this.unAuditarr = []
              this.auditarr = []
              this.getMyEvcMcuInfo()
            }
          }
        })
        // unreview({
        //   ids: ids
        // }).then((data) => {
        //   if (data.status === 200) {
        //     this.$message({
        //       message: '反审核成功',
        //       type: 'success'
        //     })
        //     this.selection = []
        //     this.unAuditarr = []
        //     this.auditarr = []
        //     this.getMyEvcMcuInfo()
        //   }
        // })
      })
    },
    handleIndexChange(current) {
      this.pagination.pageIndex = current
      this.getMyEvcMcuInfo()
    },
    handleSizeChange(size) {
      this.pagination.pageIndex = 1
      this.pagination.limit = size
      this.getMyEvcMcuInfo()
    },
    // 点查看
    childSeeRow(row, index) {
      this.linkage = false
      for (var i in this.formInfo.data) {
        this.formInfo.data[i] = row[i]
      }
      setTimeout((item) => {
        this.linkage = true
      }, 0)
      this.formInfo.fieldList.map(item => {
        item['disabled'] = true
      })
      console.log(this.formInfo.fieldList)
      this.status = 0
      this.dialogFormVisible = true
    },
    // 删除
    removeRow(row, index) {
      const element = this.pageElement['btn_del']
      this.$httpRequest({
        type: element.method,
        uri: element.uri + '?ids=' + row.id,
        callback: data => {
          if (data.status === 200 || data.rel) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getMyEvcMcuInfo()
          }
        }
      })
      // tableDelete({
      //   ids: row.id
      // }).then((data) => {
      //   this.$message({
      //     message: '删除成功',
      //     type: 'success'
      //   })
      //   this.getMyEvcMcuInfo()
      // })
    },
    // 修改
    editRow(row, index) {
      console.log(row, 'row')
      this.linkage = false
      for (var i in this.formInfo.data) {
        this.formInfo.data[i] = row[i]
      }
      setTimeout((item) => {
        this.linkage = true
      }, 0)
      this.formInfo.fieldList.map(item => {
        item['disabled'] = false
      })
      this.status = 2
      this.dialogFormVisible = true
      this.row = row
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
    // 点击了delog中的数据按钮
    determine() {
      this.settableAdd()
    },
    // 获取表数据方法
    fetchTableData() {
      // alert('触发请求表数据')
    },
    // 获取表单信息
    getMyEvcMcuInfo() {
      const element = this.pageElement['getPageList']
      this.search.page = this.pagination.pageIndex
      this.search.limit = this.pagination.limit
      for (var i in this.navFormInfo.data) {
        this.search[i] = this.navFormInfo.data[i]
      }
      this.isLoading = true
      this.$httpRequest({
        type: element ? element.method : '',
        uri: element ? element.uri : '',
        payload: this.search,
        callback: data => {
          this.isLoading = false
          if (data.status === 200) {
            this.tableData = data.data.rows
            // const arr = data.data.rows
            // TODO formatter
            this.total = data.data.total
            this.pagination.total = data.data.total
            this.$refs['tablePage'].$children[0].clearSelection()
          }
        }
      })
      // getPageList(this.search).then((data) => {
      //   this.tableData = data.data.rows
      //   // const arr = data.data.rows
      //   // TODO formatter
      //   this.total = data.data.total
      //   this.pagination.total = data.data.total
      //   this.isLoading = false
      //   this.$refs['tablePage'].$children[0].clearSelection()
      // })
    },
    getNameList() {
      const element = this.pageElement['getDirectDict']
      this.$httpRequest({
        type: element ? element.method : '',
        uri: element ? element.uri + '/1901' : '',
        payload: {},
        callback: data => {
          if (data.status === 200 && data.rel) {
            this.navFormInfo.fieldList.right.inpLists[0].list = data.data
            this.listTypeInfo.nameList = data.data
          }
        }
      })
      // nameList().then((data) => {
      //   this.navFormInfo.fieldList.right.inpLists[0].list = data.data
      //   this.listTypeInfo.nameList = data.data
      // })
    },
    getTypeList(json, status) {
      const element = this.pageElement['getAlternativeWindType']
      this.$httpRequest({
        type: element ? element.method : '',
        uri: element ? element.uri : '',
        payload: json,
        callback: data => {
          if (data.status === 200 && data.rel) {
            if (status === 1) {
              // 仅仅是form
              this.listTypeInfo.typeList = data.data
            } else if (status === 2) {
              // form和nav同时赋值
              this.listTypeInfo.typeList = data.data
              this.navFormInfo.fieldList.right.inpLists[1].list = data.data
            } else {
              // form赋值
              this.navFormInfo.fieldList.right.inpLists[1].list = data.data
            }
          }
        }
      })
      // satus 判断是nav还是form
      // typeList(json).then((data) => {
      //   if (status === 1) {
      //     // 仅仅是form
      //     this.listTypeInfo.typeList = data.data
      //   } else if (status === 2) {
      //     // form和nav同时赋值
      //     this.listTypeInfo.typeList = data.data
      //     this.navFormInfo.fieldList.right.inpLists[1].list = data.data
      //   } else {
      //     // form赋值
      //     this.navFormInfo.fieldList.right.inpLists[1].list = data.data
      //   }
      // })
    },
    getModelList(json, status) {
      const element = this.pageElement['getDirectDict']
      this.$httpRequest({
        type: element ? element.method : '',
        uri: element ? element.uri + '/' + json.code : '',
        payload: {},
        callback: data => {
          if (data.status === 200 && data.rel) {
            if (status === 1) {
            // 仅仅是form
              this.listTypeInfo.modelList = data.data
            } else if (status === 2) {
            // form和nav同时赋值
              this.listTypeInfo.modelList = data.data
              this.navFormInfo.fieldList.right.inpLists[2].list = data.data
            } else {
            // form赋值
              this.navFormInfo.fieldList.right.inpLists[2].list = data.data
            }
          }
        }
      })
      // satus 判断是nav还是form
      // modelList(json).then((data) => {
      //   if (status === 1) {
      //     // 仅仅是form
      //     this.listTypeInfo.modelList = data.data
      //   } else if (status === 2) {
      //     // form和nav同时赋值
      //     this.listTypeInfo.modelList = data.data
      //     this.navFormInfo.fieldList.right.inpLists[2].list = data.data
      //   } else {
      //     // form赋值
      //     this.navFormInfo.fieldList.right.inpLists[2].list = data.data
      //   }
      // })
    }
  }
}
</script>
<style lang="scss">
// .fanDatabase {
//   .el-dialog {
//     max-width: 662px;
//   }
//   .el-input-number {
//     width: 100%;
//   }
//   // .el-input-number__decrease,
//   // .el-input-number__increase {
//   //   height: 24px;
//   //   background-color: #00113a;
//   //   color: white;
//   // }
//   // .el-input-number__increase {
//   //   border-left: none;
//   //   top: 6px;
//   //   right: 5px;
//   //   display: flex;
//   //   align-items: center;
//   //   justify-content: center;
//   //   padding-left: 6px;
//   //   box-sizing: border-box;
//   //   padding-top: 3px;
//   // }
//   // .el-input-number__decrease {
//   //   border-right: none;
//   //   top: 6px;
//   //   left: 5px;
//   //   display: flex;
//   //   align-items: center;
//   //   justify-content: center;
//   //   padding-right: 6px;
//   //   box-sizing: border-box;
//   //   padding-top: 3px;
//   // }
//   .canleButton{
//     padding: 11px 20px;
//   }
//   .el-dialog__body {
//     padding: 10px;
//   }
//   // .el-input-number__decrease {
//   //   background-color: transparent
//   // }
//   // .el-input-number__increase {
//   //   background-color: transparent
//   // }
// }
</style>
