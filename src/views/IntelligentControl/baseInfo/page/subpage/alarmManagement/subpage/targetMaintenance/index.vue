<template>
  <div class="home targetMaintenance">
    <!-- 头部导航 -->
    <nav-form ref="navForm2" :data="navFormInfo.data" :field-list="navFormInfo.fieldList" />

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
      :destroy-on-close="true"
      @close="closeDialog"
    >
      <general-form
        ref="delog"
        label-width="100px"
        :data="formInfo.data"
        :field-list="formInfo.fieldList"
        :list-type-info="listTypeInfo"
        theme-type="default"
        @handleChange="handleChange"
      >
        <template v-slot:form-byList>
          <div id="check_diy" style="display:flex;justify-content:flex-start;position:relative;top:2px">
            <el-checkbox-group v-model="formInfo.data.byList">
              <el-checkbox :disabled="phoneDisabled" label="电话" />
              <el-checkbox disabled label="短信" />
              <el-checkbox disabled label="企业微信" />
            </el-checkbox-group>
          </div>
        </template>
      </general-form>
      <div slot="footer" class="dialog-footer dialogChecbox">
        <el-button class="btn-border canleButton" @click="showfalse">取 消</el-button>
        <el-button v-if="status==1" class="btn-blue" :loading="buttonLoading" @click="determine">确 定</el-button>
        <el-button v-if="status==2" class="btn-blue" :loading="buttonLoading" @click="determine">更 新</el-button>
      </div>
    </el-dialog>
    <!-- 树状图数据              显示开关                        默认选中 -->
    <tree :id="id" :data-array="dataArray" :tree-loading="treeLoading" :configuration="configuration" @change="change" @treeDialogVisible="treeDialogVisible" />
  </div>
</template>

<script>
import tablePage from '@/components/ElementComponent/iTable'
import navForm from '@/components/commonComponent/navForm/index.vue'
import generalForm from '@/components/commonComponent/generalForm'
import { getConfigElement } from '@/utils/overtService'
// import {dropDownList,userList} from "@/http/api/baseInfo/basicsInformation.js"
import tree from '../../../../../common/components/targetMaintenance/tree'
export default {
  components: {
    tablePage,
    navForm,
    generalForm,
    tree
  },
  data() {
    return {
      pageElement: [], // 页面权限数组
      dataInterface: [], // 数据接口权限数组
      phoneDisabled: false, // 电话是否禁用
      id: '',
      dataArray: [],
      treeLoading: true,
      dialogFormVisible: false,
      isLoading: true,
      buttonLoading: false,
      configuration: false, // 配置用户开关
      title: '查看',
      status: 0, // 0=>查看 1=>xinzeng  2=>修改
      downlist: [],
      selection: '',
      row: '', // 当前选中行的数据
      search: {
        phone: '', // 手机号
        status: '', // 状态
        userName: '', // 姓名
        jobNo: '', // 工号
        noticeLevelCode: '', // 等级
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
      // 筛选条件表头
      navFormInfo: {
        data: {
          phone: '', // 手机号
          status: '', // 状态
          userName: '', // 姓名
          jobNo: '', // 工号
          noticeLevelCode: '' // 等级
        },
        fieldList: {
          left: {
            inpLists: [
              {
                type: 'button',
                innerText: '新增',
                className: 'btn-blue',
                handleClick: () => {
                  this.status = 1
                  this.clearJson()
                  this.formInfo.fieldList.map(item => {
                    item['disabled'] = false
                  })
                  this.dialogFormVisible = true
                }
              },
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
              },
              {
                type: 'button',
                innerText: '报警通知区域配置',
                className: 'btn-blue',
                handleClick: () => {
                  if (this.selection.length === 0) {
                    this.$message({
                      message: '请选择配置的用户',
                      type: 'warning'
                    })
                    return
                  } else {
                    if (this.selection.length > 1) {
                      this.$message({
                        message: '只能选择一个用户进行配置',
                        type: 'warning'
                      })
                      return
                    }
                    this.id = this.selection[0].id
                    this.configuration = !this.configuration
                  }
                }
              }
            ]

          },
          right: {

            inpLists: [
              {
                key: 'userName',
                type: 'input',
                label: '',
                width: '150px',
                className: 'shadow',
                placeholder: '姓名'
              },
              {
                key: 'jobNo',
                type: 'input',
                label: '',
                width: '150px',
                className: 'shadow',
                placeholder: '工号'
              },
              {
                key: 'noticeLevelCode',
                type: 'select',
                label: '',
                width: '150px',
                className: 'shadow',
                placeholder: '告警通知等级',
                list: [
                  // { key: '一级', value: 1312001 },
                  // { key: '二级', value: 1312002 },
                  // { key: '三级', value: 1312003 },
                  // { key: '四级', value: 1312004 }
                ]
              },
              {
                key: 'phone',
                type: 'input',
                label: '',
                width: '150px',
                className: 'shadow',
                placeholder: '手机号码'
              },
              {
                key: 'status',
                type: 'radio',
                required: true,
                className: 'shadow',
                placeholder: '333',
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
                  this.pagination.pageIndex = 1
                  this.getMyEvcMcuInfo()
                }
              },
              {
                innerText: '重置',
                className: 'btn-border',
                handleClick: () => {
                  this.pagination.pageIndex = 1
                  this.$refs['navForm2'].resetFields()
                  this.getMyEvcMcuInfo()
                }
              }
            ]
          }
        }
      },
      columns: [
        {
          prop: 'jobNo',
          label: '工号'
        },
        {
          longData: true,
          prop: 'userName',
          label: '姓名'
        },
        {
          prop: 'position',
          label: '职务'
        },
        {
          prop: 'noticeLevel',
          label: '报警通知等级'
        },
        {
          prop: 'phone',
          label: '手机号码'
        },
        {
          icon: true,
          prop: 'contact',
          label: '报警通知方式',
          width: '280px',
          rule: {
            show: 1
          },
          status: [
            {
              icon: 'wxWork',
              value: 'byWxWork',
              name: '企业微信'
            },
            {
              icon: 'sms',
              value: 'bySms',
              name: '短信'
            },
            {
              icon: 'phone',
              value: 'byPhone',
              name: '电话'
            }
          ]
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
          show: 'status',
          align: 'center',
          width: '180px', // 操作按钮宽度
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
            }
          ]
        }
      ],
      // 表单对应列表
      listTypeInfo: {
        typeList: [
          // {
          //   key: '生产总监',
          //   value: '1313001'
          // },
          // {
          //   key: '场长',
          //   value: '1313002'
          // },
          // {
          //   key: '段长',
          //   value: '1313003'
          // },
          // {
          //   key: '饲养员',
          //   value: '1313004'
          // },
          // {
          //   key: '场区水电',
          //   value: '1313005'
          // }
        ],
        noticeLevelList: [
          // { key: '一级', value: '1312001' },
          // { key: '二级', value: '1312002' },
          // { key: '三级', value: '1312003' },
          // { key: '四级', value: '1312004' }
        ]
      },
      // 表单相关
      formInfo: {
        data: {
          userName: '', // 姓名
          jobNo: '', // 工号
          phone: '', // 手机号
          noticeLevelCode: '', // 等级
          positionCode: '', // 职位
          noticeLevel: '', // 级别汉字
          byList: [], // 通知方式
          byPhone: 0,
          bySms: 0,
          byWxWork: 0
        },
        fieldList: [
          {
            label: '姓名',
            key: 'userName',
            type: 'input',
            className: 'shadow',
            required: true,
            rules: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
          },
          {
            label: '工号',
            key: 'jobNo',
            type: 'input',
            className: 'shadow',
            required: true,
            rules: [{ required: true,
              validator: (rule, value, callback) => {
                if (value === undefined || value === null || value === '') {
                  callback('请输入工号（不包含空格）')
                } else if (!/^[^\s]*$/.test(value)) {
                  callback(new Error('请输入工号（不包含空格）'))
                } else {
                  callback()
                }
              },
              trigger: 'blur' }]
          },
          {
            label: '职位',
            key: 'positionCode',
            type: 'select',
            className: 'shadow',
            list: 'typeList',
            required: true,
            rules: [{ required: true, message: '请选择职位', trigger: 'change' }],
            handleChange: (data) => {
              // console.log(data)
              this.formInfo.data.position = data.key
            }
          },
          {
            label: '手机号',
            key: 'phone',
            type: 'input',
            className: 'shadow',
            required: true,
            rules: [{ required: true,
              validator: (rule, value, callback) => {
                if (!value) {
                  callback(new Error('请输入手机号'))
                } else {
                  if (!/^1[3456789]\d{9}$/.test(value)) {
                    callback(new Error('请输入正确的手机号'))
                  } else {
                    callback()
                  }
                }
              },
              trigger: 'blur'
            }]
          },
          {
            label: '等级',
            key: 'noticeLevelCode',
            type: 'select',
            className: 'shadow',
            list: 'noticeLevelList',
            valueKey: 'value',
            required: true,
            handleChange: (data) => {
              this.formInfo.data.noticeLevel = data.key
              const { value } = data // 1312001
              if (['1312001', '1312002'].includes(value)) { // 所有等级的报警通知方式默认选中短信和企业微信，一级二级时默认三种都选中，用户无法取消，三级四级时电话可选可不选
                this.formInfo.data.byList = ['电话', '短信', '企业微信']
                this.formInfo.data.byPhone = 1
                this.formInfo.data.bySms = 1
                this.formInfo.data.byWxWork = 1
                this.phoneDisabled = true
              }
              if (['1312003', '1312004'].includes(value)) {
                // this.formInfo.data.byList = ['短信', '企业微信']
                // this.formInfo.data.byPhone = 0
                this.formInfo.data.bySms = 1
                this.formInfo.data.byWxWork = 1
                this.phoneDisabled = false
              }
            },
            rules: [{ required: true, message: '请选择等级', trigger: 'change' }]
          },
          {
            label: '报警通知方式',
            key: 'byList',
            type: 'slot',
            rules: [{ required: true, message: '请选择报警通知方式', trigger: 'blur' }]
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
    'formInfo.data.byList'(val) {
      if (val instanceof Array && val.length > 0) {
        this.formInfo.fieldList[5].rules[0].trigger = 'change'
      } else {
      //   this.formInfo.fieldList[5].rules[0].trigger = 'blur'
      }
    },
    dialogFormVisible(val) {
      if (!val) {
        this.formInfo.fieldList[5].rules[0].trigger = 'blur'
      }
      // if (!val) {
      //
      // const parent = document.getElementById('check_diy').parentNode
      // const last = parent.lastChild
      // console.log('last--', last.className)
      // if (last.className === 'el-form-item__error') {
      //   last.style.display = 'none'
      // }
      // }
    },
    // 赋值搜索条件
    'navFormInfo.data': {
      handler: function(n) {
        this.search.phone = n.phone || ''
        this.search.userName = n.userName || ''
        this.search.jobNo = n.jobNo || ''
        this.search.status = n.status
        this.search.noticeLevelCode = n.noticeLevelCode
      },
      deep: true
    },
    'formInfo.data.byPhone': {
      handler: function(n) {
        this.byPhone()
      },
      deep: true
    },
    'formInfo.data.bySms': {
      handler: function(n) {
        this.bySms()
      },
      deep: true
    },
    'formInfo.data.byWxWork': {
      handler: function(n) {
        this.byWxWork()
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
    this.pageElement = getConfigElement('alarmNoticeUserManage')
    this.dataInterface = getConfigElement('unit-evcDataInterface')
    this.init()
  },
  mounted() {
    this.getDataArray()
    this.getMyEvcMcuInfo()
  },
  methods: {
    treeDialogVisible(flag) {
      if (!flag) {
        this.$refs['tablePage'].$children[0].clearSelection()
      }
    },
    init() {
      const element = this.dataInterface['getDirectDicItems']
      this.$httpRequest({ // 告警通知等级
        type: element ? element.method : '',
        uri: element && element.uri.replace('{*}/{*}', 'wlw/1312'),
        payload: {},
        callback: res => {
          // console.log('获取的wlw/1312--', res)
          if (res.status === 200 && res.rel) {
            const arr = res.data.map(item => {
              return {
                key: item.title,
                value: item.code
              }
            })
            this.navFormInfo.fieldList.right.inpLists[2].list = arr
            this.listTypeInfo.noticeLevelList = arr
          } else {
            this.navFormInfo.fieldList.right.inpLists[2].list = []
            this.listTypeInfo.noticeLevelList = []
          }
        }
      })
      this.$httpRequest({ // 职位
        type: element ? element.method : '',
        uri: element && element.uri.replace('{*}/{*}', 'wlw/1313'),
        payload: {},
        callback: res => {
          // console.log('获取的wlw/1312--', res)
          if (res.status === 200 && res.rel) {
            const arr = res.data.map(item => {
              return {
                key: item.title,
                value: item.code
              }
            })
            this.listTypeInfo.typeList = arr
          } else {
            this.listTypeInfo.typeList = []
          }
        }
      })
    },
    getDataArray() {
      const element = this.pageElement['getNoticeAreaTree']
      this.treeLoading = true
      this.$httpRequest({
        type: element ? element.method : '',
        uri: element ? element.uri + '/unit-evc' : '',
        payload: { viewType: 'ROOMTYPE' },
        callback: data => {
          this.treeLoading = false
          if (data.status === 200 && data.rel) {
            const newArr = [
              {
                title: '全部',
                value: 'all',
                key: 'all',
                parentId: '-1',
                children: data.data
              }
            ]
            this.dataArray = newArr
            console.log('🚀 ~ file: index.vue ~ line 690 ~ getDataArray ~ this.dataArray', this.dataArray)
          }
        }
      })
      // getRegionAreaFieldRoomTypeUnitV2().then(data => {
      //   this.dataArray = data.data
      // })
    },
    showfalse() {
      this.dialogFormVisible = false
      this.clearJson()
    },
    byPhone() {
      this.formInfo.data.byList = this.formInfo.data.byList || []
      if (this.formInfo.data.byPhone === 1) {
        if (!this.sea('电话', this.formInfo.data.byList || [])) {
          this.formInfo.data.byList.push('电话')
        }
      } else {
        if (this.sea('电话', this.formInfo.data.byList)) {
          this.formInfo.data.byList.splice(this.formInfo.data.byList.indexOf('电话'), 1)
        }
      }
    },
    bySms() {
      this.formInfo.data.byList = this.formInfo.data.byList || []
      if (this.formInfo.data.bySms === 1) {
        if (!this.sea('短信', this.formInfo.data.byList || [])) {
          this.formInfo.data.byList.push('短信')
        }
      } else {
        if (this.sea('短信', this.formInfo.data.byList || [])) {
          this.formInfo.data.byList.splice(this.formInfo.data.byList.indexOf('短信'), 1)
        }
      }
    },
    byWxWork() {
      this.formInfo.data.byList = this.formInfo.data.byList || []
      if (this.formInfo.data.byWxWork === 1) {
        if (!this.sea('企业微信', this.formInfo.data.byList || [])) {
          this.formInfo.data.byList.push('企业微信')
        }
      } else {
        if (this.sea('企业微信', this.formInfo.data.byList || [])) {
          this.formInfo.data.byList.splice(this.formInfo.data.byList.indexOf('企业微信'), 1)
        }
      }
    },
    sea(name, arr) {
      this.formInfo.data.byList = this.formInfo.data.byList || []
      if (arr.indexOf(name) !== -1) {
        return true
      } else {
        return false
      }
    },
    // 树状刷新
    change() {
      this.getMyEvcMcuInfo()
    },
    clearJson() {
      this.formInfo.data.byList = []
      for (var i in this.formInfo.data) {
        if (i !== 'byList') {
          this.formInfo.data[i] = ''
        } else {
          this.formInfo.data.byList = ['短信', '企业微信']
        }
      }
      this.formInfo.data.byPhone = 0
      this.formInfo.data.bySms = 1
      this.formInfo.data.byWxWork = 1
      this.phoneDisabled = false
    },
    setStatus() {
      if (this.sea('电话', this.formInfo.data.byList)) {
        this.formInfo.data.byPhone = 1
      } else {
        this.formInfo.data.byPhone = 0
      }
      if (this.sea('企业微信', this.formInfo.data.byList)) {
        this.formInfo.data.byWxWork = 1
      } else {
        this.formInfo.data.byWxWork = 0
      }
      if (this.sea('短信', this.formInfo.data.byList)) {
        this.formInfo.data.bySms = 1
      } else {
        this.formInfo.data.bySms = 0
      }
    },
    // 新增修改接口
    async setalarmNoticeUserAdd() {
      await this.setStatus()
      if (this.status === 1) {
        const element = this.pageElement['add']
        if (this.$refs['delog'].validateSelf()) {
          console.log(true)
        } else {
          return false
        }
        const o = {
          ...this.formInfo.data
        }
        o.alarmTypes = [...o.byList]
        delete o.byList
        this.buttonLoading = true
        this.$httpRequest({
          type: element.method,
          uri: element.uri,
          payload: {
            ...o,
            appCode: 'unit-evc'
          },
          callback: data => {
            this.buttonLoading = false
            if (data.status === 200 && data.rel) {
              this.$message({
                message: '新增成功',
                type: 'success'
              })
              this.clearJson()
              this.dialogFormVisible = false
              this.getMyEvcMcuInfo()
            }
          }
        })
      } else {
        const element = this.pageElement['update']
        if (this.$refs['delog'].validateSelf()) {
          console.log(true)
        } else {
          return false
        }

        this.row.deviceId = this.submit.code
        for (var i in this.formInfo.data) {
          if (i !== 'code') {
            this.row[i] = this.formInfo.data[i]
          }
        }
        const obj = { ...this.row }
        delete obj.crtHost
        delete obj.crtName
        delete obj.crtTime
        delete obj.crtUser
        delete obj.crtHost
        delete obj.updHost
        delete obj.updName
        delete obj.updTime
        delete obj.updUser
        delete obj.alarmNotice
        obj.alarmTypes = [...obj.byList]
        delete obj.byList
        this.buttonLoading = true
        this.$httpRequest({
          type: element.method,
          uri: element.uri,
          payload: obj,
          callback: data => {
            this.buttonLoading = false
            if (data.status === 200 && data.rel) {
              this.$message({
                message: '更新成功',
                type: 'success'
              })
              this.clearJson()
              this.dialogFormVisible = false
              this.getMyEvcMcuInfo()
            }
          }
        })
        // alarmNoticeUserUpdate(this.row).then(data => {
        //   this.$message({
        //     message: '更新成功',
        //     type: 'success'
        //   })
        //   this.buttonLoading = false
        //   this.clearJson()
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
        const element = this.pageElement['review']
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
        const element = this.pageElement['unreview']
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
      console.log(row)
      for (var i in this.formInfo.data) {
        this.formInfo.data[i] = row[i]
      }
      this.formInfo.fieldList.map(item => {
        item['disabled'] = true
      })
      this.status = 0
      this.dialogFormVisible = true
    },
    // 删除
    removeRow(row, index) {
      const element = this.pageElement['delete']
      this.$httpRequest({
        type: element.method,
        uri: element.uri + '?ids=' + row.id,
        callback: data => {
          if (data.status === 200 && data.rel) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getMyEvcMcuInfo()
          }
        }
      })
      // alarmNoticeUserDelete({
      //   ids: row.id
      // }).then(data => {
      //   this.$message({
      //     message: '删除成功',
      //     type: 'success'
      //   })
      //   this.getMyEvcMcuInfo()
      // })
    },
    // 修改
    editRow(row, index) {
      this.status = 2
      this.clearJson()
      this.dialogFormVisible = true
      this.formInfo.data.byList = []
      setTimeout(data => {
        this.row = row
      }, 0)
      this.formInfo.fieldList.map(item => {
        item['disabled'] = false
      })
      if (row.noticeLevelCode === '1312001' || row.noticeLevelCode === '1312002') { // 一级 二级
        this.phoneDisabled = true
      } else {
        this.phoneDisabled = false
      }
      for (var i in this.formInfo.data) {
        if (i !== 'byList') {
          this.formInfo.data[i] = row[i]
        }
      }
    },
    // 复选框
    handleSelectionChange(selection) {
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
    // 点击了delog中的数据按钮
    determine() {
      this.setalarmNoticeUserAdd()
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
    closeDialog() {
      this.formInfo.data.userName = ''
      this.formInfo.data.jobNo = ''
      this.formInfo.data.phone = ''
      this.formInfo.data.noticeLevelCode = ''
      this.formInfo.data.positionCode = ''
      this.formInfo.data.noticeLevel = ''
      this.formInfo.data.byList = ''
      this.formInfo.data.byPhone = ''
      this.formInfo.data.bySms = ''
      this.formInfo.data.byWxWork = ''
    }
  }
}
</script>
<style lang="scss">
// .targetMaintenance {
//   .el-dialog {
//     max-width: 662px;
//   }
//   .canleButton{
//     padding: 11px 20px;
//   }
//   .el-dialog__body {
//     padding: 10px;
//   }
//   .dialogChecbox{
//     .el-checkbox{
//       color:white
//     }
//   }
//   .el-checkbox__input.is-disabled .el-checkbox__inner {
//     background-color: #999;
//   }
//   .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner{
//     background-color: #409EFF;
//   }
// }
</style>
<style lang="scss" scoped>
</style>
