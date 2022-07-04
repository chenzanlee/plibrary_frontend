<template>
  <div class="home configurationManagement">
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
        ref="ceshi"
        label-width="120px"
        :data="formInfo.data"
        :field-list="formInfo.fieldList"
        :list-type-info="listTypeInfo"
        theme-type="default"
        @handleChange="handleChange"
      />
      <div slot="footer" class="dialog-footer">
        <div style="margin:0 auto;" class="addForm">
          <el-button class="btn-border canleButton" @click="dialogFormVisible = false">取 消</el-button>
          <el-button v-if="status==1" :loading="buttonLoading" class="btn-blue" type="primary" @click="determine">确 定</el-button>
          <el-button v-if="status==2" :loading="buttonLoading" class="btn-blue" type="primary" @click="determine">更 新</el-button>
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
import jsontype from './type.json'
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
      dialogDeletion: false,
      isLoading: false,
      buttonLoading: false,
      linkage: true, // form选择框是否联动 （修改查看赋值不联动）
      title: '批量配置',
      status: 0, // 0=>查看 1=>xinzeng  2=>修改
      downlist: [],
      selection: '',
      row: '', // 当前选中行的数据
      search: {
        regionId: '',
        areaId: '',
        fieldId: '',
        roomTypeId: '',
        limit: 10,
        page: 1
      },
      submit: {},
      auditarr: [], // 已审核数组
      unAuditarr: [], // 未审核数组
      // 审核表头
      navFormInfo: {
        data: {
          area: []
        },
        fieldList: {
          left: {
            inpLists: [
              {
                type: 'button',
                innerText: '批量配置',
                className: 'btn-blue',
                handleClick: () => {
                  if (this.selection.length === 0) {
                    this.$message({
                      message: '至少选择一条未审核或未配置的数据',
                      type: 'warning'
                    })
                    return
                  }
                  if (this.auditarr.length !== 0) {
                    this.$message.error('只能选择未审核数据')
                    return
                  }
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
              // {
              //   type: "button",
              //   innerText: "新增",
              //   className: "btn-blue",
              //   handleClick: () => {
              //     this.getNameList();
              //     for (var i in this.formInfo.data) {
              //       this.formInfo.data[i] = "";
              //     }
              //     this.status = 1;
              //     this.dialogFormVisible = true;
              //   },
              // },
              {
                type: 'button',
                innerText: '审核',
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
                      type: 'error'
                    })
                    return
                  }
                  this.setReview(this.unAuditarr)
                }
              },
              {
                type: 'button',
                innerText: '反审核',
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
                      type: 'error'
                    })
                    return
                  }
                  this.setUnreview(this.auditarr)
                }
              },
              {
                type: 'button',
                innerText: '批量删除',
                className: 'btn-blue',
                handleClick: () => {
                  if (this.selection.length === 0) {
                    this.$message({
                      message: '最少需要选择一条数据',
                      type: 'warning'
                    })
                  } else {
                    this.tableDeleteAll()
                  }
                }
              }
            ]
          },
          right: {
            inpLists: [
              {
                key: 'area',
                type: 'cascader',
                customLabel: 'title',
                customValue: '',
                className: 'shadow',
                clearable: true,
                width: '300px',
                // checkStrictly: true,
                placeholder: '大区 / 区域 / 场区 / 猪舍类型',
                options: [],
                handleChange: (val, val1, val2) => {
                  console.log('cascader选择', val)
                }
              }
            ],
            btnLists: [
              {
                innerText: '查询',
                className: 'btn-blue',
                handleClick: () => {
                  if (this.navFormInfo.data.area.length > 0) {
                    this.pagination.pageIndex = 1
                    this.getMyEvcMcuInfo()
                  } else {
                    this.$message.warning('请选择猪舍类型')
                  }
                }
              },
              {
                innerText: '重置',
                className: 'btn-border',
                handleClick: () => {
                  this.navFormInfo.data.area = []
                  this.pagination.limit = 10
                  this.pagination.pageIndex = 1
                  this.tableData = []
                  this.total = 0
                  this.pagination.total = 0
                  this.$refs['tablePage'].$children[0].clearSelection()
                  // this.selection = []
                  // this.auditarr = [] // 已审核数组
                  // this.unAuditarr = [] // 未审核数组
                }
              }
            ]
          }
        }
      },
      columns: [
        {
          prop: 'regionName',
          label: '单元',
          minWidth: '80'
        },
        {
          prop: 'crtName',
          label: '创建人',
          minWidth: '80'
        },
        {
          prop: 'crtTime',
          label: '创建时间',
          minWidth: '160'
        },
        {
          prop: 'updName',
          label: '修改人',
          minWidth: '80'
        },
        {
          prop: 'updTime',
          label: '修改时间',
          minWidth: '160'
        },
        {
          prop: 'status',
          label: '状态',
          minWidth: '80',
          render: (h, params) => {
            if (params.row.status === 'NORMAL') {
              return h('span', '未审核')
            } else if (params.row.status === 'AUDITED') {
              return h('span', '已审核')
            } else {
              return h('span', '未配置')
            }
          }
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
              size: 'auto',
              click: 'edit',
              status: 'NORMAL'
            },
            {
              name: '删除',
              class: 'btn-red',
              size: 'auto',
              click: 'remove',
              status: 'NORMAL'
            },
            {
              name: '修改',
              class: 'btn-blue',
              size: 'auto',
              click: 'edit',
              status: null
            },
            {
              name: '删除',
              class: 'btn-red',
              size: 'auto',
              click: 'remove',
              status: null
            }
          ]
        }
      ],
      // 表单对应列表
      listTypeInfo: {
        nameList: [
          {
            code: '37ZniY6EgUr1crGmM4q1uX',
            title: '1000/定速风机1/定速风机/54寸'
          }
        ],
        typeList: [],
        modelList: []
      },
      // 表单相关
      formInfo: {
        data: {
          windConstantConfig1: '', // 定速风机1
          windConstantConfig2: '', // 定速风机1
          windConstantConfig3: '', // 定速风机1
          windConstantConfig4: '', // 定速风机1
          windConstantConfig5: '', // 定速风机1
          windConstantConfig6: '', // 定速风机1
          windPressureConfig1: '', // 热交换变速风机
          windPressureConfig2: '', // 热交换变速风机
          windPressureConfig3: '', // 热交换变速风机
          windPressureConfig4: '', // 热交换变速风机
          windFrequencyConfig1: '', // 地沟变频风机
          windFrequencyConfig2: '', // 热交换变频风机
          windFrequencyConfig3: '', // 端部变频风机1
          windFrequencyConfig4: '', // 端部变频风机2
          windFrequencyConfig5: '', // 端部变频风机3
          windFrequencyConfig6: '', // 吊顶变频风机1
          windFrequencyConfig7: '', // 吊顶变频风机2
          windFrequencyConfig8: '', // 吊顶变频风机3
          windFrequencyConfig9: '' // 热交换变频风机
        },
        fieldList: jsontype.arr
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
    'navFormInfo.data.area': {
      handler: function(n) {
        this.search.regionId = n[0] || ''
        this.search.areaId = n[1] || ''
        this.search.fieldId = n[2] || ''
        this.search.roomTypeId = n[3] || ''
      },
      deep: true
    },
    status(n) {
      if (n === 0) {
        this.title = '查看'
      } else if (n === 1) {
        this.title = '批量配置'
      } else {
        this.title = '修改'
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
  async created() {
    this.pageElement = getConfigElement('unitWindConfigOperation')
    this.dataInterface = getConfigElement('unit-evcDataInterface')
    this.getTree()
    this.getNameList()
  },
  mounted() {},
  methods: {
    // 获取区域联动数据
    getTree() {
      const dataInterface = this.dataInterface['getRegionAreaFieldRoomTypeTree']
      this.$httpRequest({
        type: dataInterface.method,
        uri: dataInterface.uri,
        payload: { isBuilding: false },
        callback: data => {
          if (data.status === 200 && data.rel) { this.navFormInfo.fieldList.right.inpLists[0].options = data.data }
        }
      })
    },
    // 批量删除
    tableDeleteAll() {
      this.$confirm('此操作将永久删除这些数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const element = this.pageElement['deleteUnitWindConfig']
        const idList = this.selection.map(item => {
          return item.id
        })
        this.$httpRequest({
          type: element.method,
          uri: element.uri,
          payload: { ids: idList.toString() },
          callback: data => {
            this.dialogDeletion = false
            if (data && data.status === 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.getMyEvcMcuInfo()
            }
          }
        })
        // tableDelete({ ids: idList.toString() }).then(res => {
        //   this.dialogDeletion = false
        //   if (res && res.status === 200) {
        //     this.$message({
        //       message: '删除成功',
        //       type: 'success'
        //     })
        //     this.getMyEvcMcuInfo()
        //   }
        // })
      })
    },
    // 新增修改接口
    settableAdd() {
      if (this.status === 1) {
        const element = this.pageElement['editBatchUnitWindConfig']
        let ids = ''
        this.selection.forEach(item => {
          ids += item.regionNum + ','
        })
        // this.formInfo.data.ids = ids
        this.buttonLoading = true
        this.$httpRequest({
          type: element.method,
          uri: element.uri + '?ids=' + ids,
          payload: this.formInfo.data,
          callback: data => {
            this.buttonLoading = false
            if (data.status === 200 && data.rel) {
              this.$message({
                message: '批量配置成功',
                type: 'success'
              })
              this.dialogFormVisible = false
              for (var i in this.formInfo.data) {
                this.formInfo.data[i] = ''
              }
              this.getMyEvcMcuInfo()
            }
          }
        })
        // tableAdd(this.formInfo.data).then((data) => {
        //   this.$message({
        //     message: '批量配置成功',
        //     type: 'success'
        //   })
        //   this.buttonLoading = false
        //   this.dialogFormVisible = false
        //   for (var i in this.formInfo.data) {
        //     this.formInfo.data[i] = ''
        //   }
        //   this.getMyEvcMcuInfo()
        // })
      } else {
        const element = this.pageElement['editUnitWindConfig']
        this.row.regionId = this.submit.regionId
        this.row.areaId = this.submit.areaId
        this.row.fieldId = this.submit.fieldId
        this.row.roomTypeId = this.submit.roomTypeId
        for (var i in this.formInfo.data) {
          this.row[i] = this.formInfo.data[i]
        }
        this.buttonLoading = true
        this.$httpRequest({
          type: element.method,
          uri: element.uri,
          payload: this.row,
          callback: data => {
            this.buttonLoading = false
            if (data.status === 200 && data.rel) {
              this.$message({
                message: '更新成功',
                type: 'success'
              })
              this.dialogFormVisible = false
              for (var i in this.formInfo.data) {
                this.formInfo.data[i] = ''
              }
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
        //   this.dialogFormVisible = false
        //   for (var i in this.formInfo.data) {
        //     this.formInfo.data[i] = ''
        //   }
        //   this.getMyEvcMcuInfo()
        // })
      }
      // this.getMyEvcMcuInfo()
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
        const element = this.pageElement['reviewUnitWindConfig']
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
        const element = this.pageElement['unreviewUnitWindConfig']
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
        //   } else {
        //     this.$message.error(data.message)
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
      this.status = 0
      this.dialogFormVisible = true
      const element = this.pageElement['getOneUnitWindConfig']
      this.$httpRequest({
        type: element.method,
        uri: element.uri,
        payload: { id: row.id },
        callback: data => {
          console.log(data.data, 'row')
          for (var i in this.formInfo.data) {
            this.formInfo.data[i] = data.data[i]
          }
          setTimeout((item) => {
            this.linkage = true
          }, 0)
          this.formInfo.fieldList.map(item => {
            item['disabled'] = true
          })
        }
      })
    },
    // 删除
    removeRow(row, index) {
      const element = this.pageElement['deleteUnitWindConfig']
      this.$httpRequest({
        type: element.method,
        uri: element.uri,
        payload: { ids: row.id },
        callback: data => {
          this.dialogDeletion = false
          if (data && data.status === 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getMyEvcMcuInfo()
          }
        }
      })
    },
    // 修改
    editRow(row, index) {
      if (!row.id) {
        return
      }
      this.linkage = false
      this.status = 2
      this.dialogFormVisible = true
      this.row = row
      const element = this.pageElement['getOneUnitWindConfig']
      this.$httpRequest({
        type: element.method,
        uri: element.uri,
        payload: { id: row.id },
        callback: data => {
          console.log(data.data, 'row')
          for (var i in this.formInfo.data) {
            this.formInfo.data[i] = data.data[i]
          }
          setTimeout((item) => {
            this.linkage = true
          }, 0)
          this.formInfo.fieldList.map(item => {
            item['disabled'] = false
          })
        }
      })
    },
    // 复选框
    handleSelectionChange(selection) {
      this.selection = selection
      this.auditarr = [] // 已审核数组
      this.unAuditarr = [] // 未审核数组
      selection.forEach((item) => {
        if (item.status === 'AUDITED') {
          if (item.id) {
            this.auditarr.push(item.id)
          }
          // else {
          //   this.auditarr.push(item.regionNum)
          // }
        } else {
          if (item.id) {
            this.unAuditarr.push(item.id)
          }
          // else {
          //   this.unAuditarr.push(item.regionNum)
          // }
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
      const element = this.pageElement['getBaseUnitWindConfigList']
      this.search.page = this.pagination.pageIndex
      this.search.limit = this.pagination.limit
      this.isLoading = true
      this.$httpRequest({
        type: element ? element.method : '',
        uri: element ? element.uri : '',
        payload: this.search,
        callback: data => {
          this.isLoading = false
          if (data.status === 200) {
            if (data.data.total > 0) {
              this.tableData = data.data.rows
              // TODO formatter
              this.total = data.data.total
              this.pagination.total = data.data.total
              this.$refs['tablePage'].$children[0].clearSelection()
            } else {
              this.tableData = []
              this.total = 0
              this.pagination.total = 0
              this.$refs['tablePage'].$children[0].clearSelection()
            }
          }
        }
      })
    },
    getNameList() {
      const element = getConfigElement('unitWindConfigManager')['getPageList']
      this.$httpRequest({
        type: element ? element.method : '',
        uri: element ? element.uri : '',
        payload: {},
        callback: data => {
          this.listTypeInfo.nameList = []
          this.listTypeInfo.typeList = []
          this.listTypeInfo.modelList = []
          data.data.rows.forEach(item => {
            if (item.typeCode === '1902001') {
              this.listTypeInfo.nameList.push({
                code: item.id,
                title: item.volume + '/' + item.name + '/' + item.type + '/' + item.model
              })
            } else if (item.typeCode === '1902002') {
              this.listTypeInfo.typeList.push({
                code: item.id,
                title: item.volume + '/' + item.name + '/' + item.type + '/' + item.model
              })
            } else {
              this.listTypeInfo.modelList.push({
                code: item.id,
                title: item.volume + '/' + item.name + '/' + item.type + '/' + item.model
              })
            }
          })
        }
      })
      // nameList().then((data) => {
      //   this.listTypeInfo.nameList = []
      //   this.listTypeInfo.typeList = []
      //   this.listTypeInfo.modelList = []
      //   data.data.rows.forEach(item => {
      //     if (item.typeCode === '1902001') {
      //       this.listTypeInfo.nameList.push({
      //         code: item.id,
      //         title: item.volume + '/' + item.name + '/' + item.type + '/' + item.model
      //       })
      //     } else if (item.typeCode === '1902002') {
      //       this.listTypeInfo.typeList.push({
      //         code: item.id,
      //         title: item.volume + '/' + item.name + '/' + item.type + '/' + item.model
      //       })
      //     } else {
      //       this.listTypeInfo.modelList.push({
      //         code: item.id,
      //         title: item.volume + '/' + item.name + '/' + item.type + '/' + item.model
      //       })
      //     }
      //   })
      // })
    }
  }
}
</script>
<style lang="scss">
// .configurationManagement {
//   .el-input-number {
//     width: 100%;
//   }
//   .el-input-number__decrease,
//   .el-input-number__increase {
//     height: 24px;
//     background-color: #00113a;
//     color: white;
//   }
//   .el-input-number__increase {
//     border-left: none;
//     top: 6px;
//     right: 5px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     padding-left: 6px;
//     box-sizing: border-box;
//     padding-top: 3px;
//   }
//   .el-input-number__decrease {
//     border-right: none;
//     top: 6px;
//     left: 5px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     padding-right: 6px;
//     box-sizing: border-box;
//     padding-top: 3px;
//   }
//   .el-form {
//     display: flex;
//     flex-wrap: wrap;
//     justify-content: space-between;
//   }
//   .canleButton{
//     padding: 11px 20px;
//   }
//   .el-dialog__body {
//     padding: 10px;
//   }
// }
</style>
