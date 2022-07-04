<template>
  <div class="controlInstruction">
    <!-- 头部导航 -->
    <nav-form
      ref="navForm"
      :data="navFormInfo.data"
      :field-list="navFormInfo.fieldList"
      @dateTimeChange="navDateTimeChange"
    />
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
    />
    <!-- 新增 -->
    <el-dialog
      :title="dialogTitle"
      :modal-append-to-body="false"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      width="80%"
    >
      <general-form
        ref="delog"
        label-width="100px"
        style="margin-top: 10px;"
        :data="formInfo.data"
        :field-list="formInfo.fieldList"
        :list-type-info="listTypeInfo"
        theme-type="default"
      />
      <div style="color: #FFF;font-size: 14px;margin-bottom: 20px;">
        <span class="textTitle">指令格式</span>
        <el-button v-if="dialogType !== '0'" class="btn-blue" size="mini" @click="addData">新增</el-button>
      </div>
      <el-form ref="formData" :model="formData" :rules="formDataRules">
        <el-table class="default" :data="formData.tableData" highlight-current-row style="width: 100%;">
          <el-table-column prop="fieldsId" label="字段名称" width="180" header-align="center" align="center" placeholder="请选择字段名称">
            <template slot-scope="scope">
              <el-form-item :prop="'tableData.' + scope.$index + '.fieldsId'">
                <el-select v-if="dialogType!=='0'" v-model="scope.row.fieldsId" @visible-change="getIndex(scope.$index)" @change="fieldsIdChange">
                  <el-option
                    v-for="(childItem, childIndex) in formData.fieldsIdList"
                    :key="childIndex"
                    :label="childItem.title"
                    :value="childItem.id"
                  />
                </el-select>
                <span v-else>{{ scope.row.fieldsName }}</span>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="fieldsDescription" label="字段描述" width="260" header-align="center" align="center" placeholder="请输入字段描述">
            <template slot-scope="scope">
              <el-form-item :prop="'tableData.' + scope.$index + '.fieldsDescription'">
                <el-input v-if="dialogType!=='0'" v-model="scope.row.fieldsDescription" />
                <span v-else>{{ scope.row.fieldsDescription }}</span>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="orderNum" label="次序" width="120" header-align="center" align="center" placeholder="请输入次序">
            <template slot-scope="scope">
              <el-form-item :prop="'tableData.' + scope.$index + '.orderNum'">
                <el-input v-if="dialogType!=='0'" v-model="scope.row.orderNum" />
                <span v-else>{{ scope.row.orderNum }}</span>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="repeatTypeid" label="数据组合类型" width="120" header-align="center" align="center" placeholder="请选择数据组合类型">
            <template slot-scope="scope">
              <el-form-item :prop="'tableData.' + scope.$index + '.repeatTypeid'">
                <el-select v-if="dialogType!=='0'" v-model="scope.row.repeatTypeid" @visible-change="getIndex(scope.$index)" @change="repeatTypeidChange">
                  <el-option
                    v-for="(childItem, childIndex) in formData.repeatTypeidList"
                    :key="childIndex"
                    :label="childItem.title"
                    :value="childItem.id"
                  />
                </el-select>
                <span v-else>{{ scope.row.repeatType }}</span>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="byteAmount" label="字节个数" width="120" header-align="center" align="center" placeholder="请输入字节个数">
            <template slot-scope="scope">
              <el-form-item :prop="'tableData.' + scope.$index + '.byteAmount'">
                <el-input v-if="dialogType!=='0'" v-model="scope.row.byteAmount" />
                <span v-else>{{ scope.row.byteAmount }}</span>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="subEntryNum" label="条目数" width="120" header-align="center" align="center" placeholder="请输入条目数">
            <template slot-scope="scope">
              <el-form-item :prop="'tableData.' + scope.$index + '.subEntryNum'">
                <el-input v-if="dialogType!=='0'" v-model="scope.row.subEntryNum" />
                <span v-else>{{ scope.row.subEntryNum }}</span>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="描述" width="260" header-align="center" align="center" placeholder="请输入描述">
            <template slot-scope="scope">
              <el-form-item :prop="'tableData.' + scope.$index + '.description'">
                <el-input v-if="dialogType!== '0'" v-model="scope.row.description" />
                <span v-else>{{ scope.row.description }}</span>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作" header-align="center" align="center">
            <template slot-scope="scope">
              <el-form-item prop="button">
                <el-popconfirm
                  title="确定要删除该条数据吗？"
                  @onConfirm="deleteData(scope.row,scope.$index)"
                >
                  <el-button slot="reference" class="btn-red" size="medium" :disabled="dialogType === '0'">删除</el-button>
                </el-popconfirm>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="btn-border canleButton" @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogType === '1'" class="btn-blue" :loading="buttonLoading" @click="myBpCarMqttcmdBaseSave">确定</el-button>
        <el-button v-if="dialogType === '2'" class="btn-blue" :loading="buttonLoading" @click="myBpCarMqttcmdBaseEdit">更新</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import navForm from '@/components/commonComponent/navForm/index.vue'
import generalForm from '@/components/commonComponent/generalForm'
import tablePage from '@/components/ElementComponent/iTable'
import { getConfigElement } from '@/utils/overtService'
export default {
  components: {
    navForm,
    generalForm,
    tablePage
  },
  data() {
    return {
      pageElement: [], // 页面权限数组
      dataInterface: [], // 数据接口权限数组
      isLoading: false,
      dialogFormVisible: false,
      buttonLoading: false,
      dialogTitle: '指令新增',
      dialogType: '1',
      navFormInfo: {
        data: {
          equiptype_id: '', // 设备类型
          device_version_id: '', // 设备型号
          cmd_versionid: '', // 固态版本
          cmd_id: '', // 指令名称
          cmd_direction: '', // 指令方向
          reply: '', // 是否应答
          timeDate: [],
          start_time: '', // 开始日期
          end_time: '', // 结束日期
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
                  this.dialogFormVisible = true
                  this.dialogType = '1'
                  this.dialogTitle = '指令新增'
                  this.formData.tableData = [{
                    fieldsId: '',
                    fieldsName: '',
                    fieldsDescription: '',
                    orderNum: '',
                    repeatTypeid: '',
                    repeatType: '',
                    byteAmount: '',
                    description: '',
                    subEntryNum: ''
                  }]
                  this.formInfo.fieldList.map((item, index) => {
                    if (index !== 2 && index !== 10) {
                      item.disabled = false
                    }
                  })
                  this.getAddDeviceVersionIdList()
                  this.getAddEquipmentFirmwareVersionList()
                  this.getCmdContentHeaderidList()
                  this.getRepeatTypeidList()
                }
              },
              {
                type: 'button',
                innerText: '审核',
                className: 'btn-blue-disabled',
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
                  this.equipmentAudit(this.unAuditarr)
                }
              },
              {
                type: 'button',
                innerText: '反审核',
                className: 'btn-blue-disabled',
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
                  this.equipmentUnaudit(this.auditarr)
                }
              }
            ]
          },
          right: {
            inpLists: [
              {
                key: 'equiptype_id',
                type: 'select',
                className: 'shadow',
                clearable: true,
                filterable: true,
                placeholder: '设备类型',
                list: [],
                props: {
                  label: 'equiptype_name',
                  value: 'id'
                }
              },
              {
                key: 'device_version_id',
                type: 'select',
                className: 'shadow',
                clearable: true,
                filterable: true,
                placeholder: '设备型号',
                list: [],
                props: {
                  label: 'version_name',
                  value: 'id'
                }
              },
              {
                key: 'cmd_versionid',
                type: 'select',
                className: 'shadow',
                clearable: true,
                filterable: true,
                placeholder: '固态版本',
                list: [],
                props: {
                  label: 'firmware_version',
                  value: 'id'
                }
              },
              {
                key: 'cmd_id',
                type: 'select',
                className: 'shadow',
                clearable: true,
                filterable: true,
                placeholder: '指令名称',
                list: [],
                props: {
                  label: 'title',
                  value: 'id'
                }
              },
              {
                key: 'cmd_direction',
                type: 'select',
                className: 'shadow',
                clearable: true,
                placeholder: '指令方向',
                list: [
                  {
                    key: '上行',
                    value: '0'
                  },
                  {
                    key: '下行',
                    value: '1'
                  }
                ]
              },
              {
                key: 'reply',
                type: 'select',
                className: 'shadow',
                clearable: true,
                placeholder: '是否应答',
                list: [
                  {
                    key: '否',
                    value: '0'
                  },
                  {
                    key: '是',
                    value: '1'
                  }
                ]
              },
              {
                key: 'timeDate',
                type: 'dateTime',
                className: 'shadow',
                clearable: true,
                dateType: 'datetimerange',
                startPlaceholder: '开始时间',
                endPlaceholder: '结束时间'
              },
              {
                key: 'status',
                type: 'select',
                className: 'shadow',
                clearable: true,
                placeholder: '状态',
                list: [
                  {
                    key: '未审核',
                    value: '1'
                  },
                  {
                    key: '已审核',
                    value: '2'
                  }
                ]
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
                  this.navFormInfo.data.start_time = ''
                  this.navFormInfo.data.end_time = ''
                  this.getTableData()
                }
              }
            ]
          }
        }
      },
      columns: [
        {
          prop: 'equiptype_name',
          label: '设备类型',
          width: '200'
        },
        {
          prop: 'device_version_name',
          label: '设备型号',
          width: '200'
        },
        {
          prop: 'cmd_version',
          label: '固件版本',
          width: '120'
        },
        {
          prop: 'cmd_name',
          label: '指令名称',
          width: '200'
        },
        {
          prop: 'cmd',
          label: '指令',
          width: '120'
        },
        {
          prop: 'cmd_direction',
          label: '指令方向',
          width: '100',
          rule: {
            1: '下行',
            0: '上行'
          }
        },
        {
          prop: 'reply',
          label: '是否应答',
          width: '100',
          rule: {
            0: '否',
            1: '是'
          }
        },
        {
          prop: 'cmd_content_header',
          label: '数据包头',
          width: '100'
        },
        {
          prop: 'status',
          label: '状态',
          width: '100',
          rule: {
            1: '未审核',
            2: '已审核'
          }
        },
        {
          prop: 'crt_time',
          label: '创建时间',
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
              status: 2
            },
            {
              name: '修改',
              class: 'btn-blue',
              size: 'auto',
              click: 'edit',
              status: 1
            },
            {
              name: '删除',
              class: 'btn-red',
              size: 'auto',
              click: 'remove',
              status: 1
            }
          ]
        }
      ],
      tableData: [],
      selection: [],
      auditarr: [],
      unAuditarr: [],
      // 表单对应列表
      listTypeInfo: {
        deviceVersionIdList: [],
        cmdVersionidList: [],
        cmdIdList: [],
        cmdContentHeaderidList: [],
        cmdDirectionList: [
          {
            key: '上行',
            value: 'UP'
          },
          {
            key: '下行',
            value: 'DOWN'
          }
        ],
        replyList: [
          {
            key: '否',
            value: 0
          },
          {
            key: '是',
            value: 1
          }
        ],
        replyIdList: []
      },
      formInfo: {
        data: {
          deviceVersionId: '', // 设备型号id
          deviceVersionName: '', // 设备型号
          cmdVersionid: '', // 固态版本号id
          cmdVersion: '', // 固态版本号
          equiptypeId: '', // 设备类型id
          equiptypeName: '', // 设备类型
          cmdId: '', // 指令名称id
          cmdName: '', // 指令名称
          cmd: '', // 指令
          cmdDescription: '', // 指令描述
          cmdContentHeaderid: '', // 数据包头id
          cmdContentHeader: '', // 数据包头
          cmdFixedLength: '', // 数据长度
          cmdDirection: '', // 指令方向
          reply: 0, // 是否应答
          replyId: '', // 应答指令id
          replyCmdName: '' // 应答指令
        },
        fieldList: [
          {
            label: '设备型号',
            key: 'deviceVersionId',
            span: 8,
            valueKey: 'id',
            type: 'select',
            className: 'shadow',
            clearable: true,
            filterable: true,
            placeholder: '请选择设备型号',
            list: 'deviceVersionIdList',
            required: true,
            rules: [
              { required: true, message: '请选择设备型号', trigger: 'change' }
            ],
            props: {
              label: 'version_name',
              value: 'id'
            },
            handleChange: (val) => {
              this.listTypeInfo.firmwareVersionIdList = []
              this.formInfo.data.cmdVersionid = ''
              this.formInfo.data.cmdVersion = ''
              this.listTypeInfo.cmdIdList = []
              this.formInfo.data.cmdId = ''
              this.formInfo.data.cmdName = ''
              this.formData.fieldsIdList = []
              this.formData.tableData.map(item => {
                item.fieldsId = ''
                item.fieldsName = ''
              })
              if (val) {
                this.formInfo.data.deviceVersionName = val.version_name
                this.formInfo.data.equiptypeId = val.equiptype_id
                this.formInfo.data.equiptypeName = val.equiptype_name
                this.getAddEquipmentFirmwareVersionList()
                if (val.type_of_service_id) {
                  this.getCmdNamesList(val.type_of_service_id)
                }
                if (this.formInfo.data.reply === 1) {
                  this.getReplyIdList()
                }
              } else {
                this.formInfo.data.deviceVersionName = ''
                this.formInfo.data.equiptypeId = ''
                this.formInfo.data.equiptypeName = ''
              }
            }
          },
          {
            label: '固件版本',
            key: 'cmdVersionid',
            span: 8,
            valueKey: 'id',
            type: 'select',
            className: 'shadow',
            placeholder: '请选择固件版本',
            clearable: true,
            list: 'cmdVersionidList',
            required: true,
            rules: [
              { required: true, message: '请选择固件版本', trigger: 'change' }
            ],
            props: {
              label: 'firmware_version',
              value: 'id'
            },
            handleChange: (val) => {
              if (val) {
                this.formInfo.data.cmdVersion = val.firmware_version
                if (this.formInfo.data.reply === 1) {
                  this.getReplyIdList()
                }
              } else {
                this.formInfo.data.cmdVersion = ''
              }
            }
          },
          {
            label: '设备类型',
            key: 'equiptypeName',
            span: 8,
            type: 'input',
            disabled: true,
            className: 'shadow'
          },
          {
            label: '指令名称',
            key: 'cmdId',
            valueKey: 'id',
            span: 8,
            type: 'select',
            className: 'shadow',
            placeholder: '请选择指令名称',
            clearable: true,
            list: 'cmdIdList',
            required: true,
            rules: [
              { required: true, message: '请选择指令名称', trigger: 'change' }
            ],
            props: {
              label: 'title',
              value: 'id'
            },
            handleChange: (val) => {
              this.formData.fieldsIdList = []
              this.formData.tableData.map(item => {
                item.fieldsId = ''
                item.fieldsName = ''
              })
              if (val) {
                this.formInfo.data.cmdName = val.title
                this.getFieldsIdList(val.code)
              } else {
                this.formInfo.data.cmdName = ''
              }
            }
          },
          {
            label: '指令',
            key: 'cmd',
            span: 8,
            type: 'input',
            placeholder: '请输入十六进制指令',
            className: 'shadow',
            rules: [
              {
                required: true,
                validator: (rule, value, callback) => {
                  if (!value || value === '') {
                    callback(new Error('请输入十六进制指令'))
                  } else if (!/^0[xX][0-9a-fA-F]*$/.test(value)) {
                    callback(new Error('请输入十六进制指令'))
                  } else {
                    callback()
                  }
                },
                trigger: 'blur'
              }
            ]
          },
          {
            label: '指令描述',
            key: 'cmdDescription',
            span: 8,
            type: 'input',
            placeholder: '请输入指令描述',
            className: 'shadow',
            rules: [
              { required: true, message: '请输入指令描述', trigger: 'blur' }
            ]
          },
          {
            label: '数据包头',
            key: 'cmdContentHeaderid',
            valueKey: 'id',
            span: 8,
            type: 'select',
            className: 'shadow',
            placeholder: '请选择数据包头',
            clearable: true,
            list: 'cmdContentHeaderidList',
            required: true,
            rules: [
              { required: true, message: '请选择数据包头', trigger: 'change' }
            ],
            props: {
              label: 'title',
              value: 'id'
            },
            handleChange: (val) => {
              if (val) {
                this.formInfo.data.cmdContentHeader = val.title
              } else {
                this.formInfo.data.cmdContentHeader = ''
              }
            }
          },
          {
            label: '数据长度',
            key: 'cmdFixedLength',
            position: 'right',
            span: 8,
            type: 'number',
            placeholder: '请输入数据长度',
            className: 'shadow',
            rules: [
              { required: true, message: '请输入数据长度', trigger: 'change' }
            ]
          },
          {
            label: '指令方向',
            key: 'cmdDirection',
            span: 8,
            type: 'select',
            className: 'shadow',
            placeholder: '请选择指令方向',
            clearable: true,
            list: 'cmdDirectionList',
            required: true,
            rules: [
              { required: true, message: '请选择指令方向', trigger: 'change' }
            ]
          },
          {
            label: '是否应答',
            key: 'reply',
            span: 8,
            type: 'select',
            className: 'shadow',
            placeholder: '请选择是否应答',
            list: 'replyList',
            handleChange: (val) => {
              // console.log(val)
              // if (val.value === '1') {
              //   this.getReplyIdList()
              // }
            }
          },
          {
            label: '应答指令',
            key: 'replyId',
            span: 16,
            valueKey: 'id',
            disabled: true,
            multiple: 'multiple',
            type: 'select',
            className: 'shadow',
            placeholder: '请选择应答指令',
            clearable: true,
            list: 'replyIdList',
            props: {
              label: 'cmdName',
              value: 'id'
            },
            handleChange: (val) => {
              if (val) {
                this.formInfo.data.replyCmdName = val.cmdName
              } else {
                this.formInfo.data.replyCmdName = ''
              }
            }
          }
        ]
      },
      formDataRules: {},
      formData: {
        fieldsIdList: [],
        repeatTypeidList: [],
        tableData: [{
          fieldsId: '',
          fieldsName: '',
          fieldsDescription: '',
          orderNum: '',
          repeatTypeid: '',
          repeatType: '',
          byteAmount: '',
          description: '',
          subEntryNum: ''
        }]
      },
      clickIndex: 0,
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
    unAuditarr(val) {
      if (val.length > 0) {
        this.navFormInfo.fieldList.left.inpLists[1].className = 'btn-blue'
        this.navFormInfo.fieldList.left.inpLists[1].isDisabled = false
      } else {
        this.navFormInfo.fieldList.left.inpLists[1].className = 'btn-blue-disabled'
        this.navFormInfo.fieldList.left.inpLists[1].isDisabled = true
      }
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
    dialogFormVisible(val) {
      if (!val) {
        this.$refs['delog'].resetFields() // 手动清楚一下提示语
      }
    },
    'formInfo.data.reply'(val) {
      if (val === 1 && this.dialogType !== '0') {
        this.formInfo.fieldList[10].disabled = false
        this.getReplyIdList()
      } else {
        this.formInfo.fieldList[10].disabled = true
      }
    }
  },
  mounted() {
    // 当前页面的元素权限
    this.pageElement = getConfigElement('myBpCarMqttcmdBase')
    this.dataInterface = getConfigElement('wlwDataInterface')
    this.getTableData()
    this.getEquipmentTypeList()
    this.getDeviceVersionList()
    this.getEquipmentFirmwareVersionList()
    this.getAllCmdNamesList()
  },
  methods: {
    // 表格方法
    addData() {
      this.formData.tableData.push({
        fieldsId: '',
        fieldsName: '',
        fieldsDescription: '',
        orderNum: '',
        repeatTypeid: '',
        repeatType: '',
        byteAmount: '',
        description: '',
        subEntryNum: ''
      })
    },
    fieldsIdChange(val) {
      this.formData.fieldsIdList.map(item => {
        if (val === item.id) {
          this.formData.tableData[this.clickIndex].fieldsName = item.title
        }
      })
    },
    repeatTypeidChange(val) {
      this.formData.repeatTypeidList.map(item => {
        if (val === item.id) {
          this.formData.tableData[this.clickIndex].repeatType = item.title
        }
      })
    },
    getIndex(index) {
      this.clickIndex = index
    },
    deleteData(row, index) {
      this.formData.tableData.splice(index, 1)
    },
    // 获取设备类型下拉框数据
    getEquipmentTypeList() {
      const dataInterface = this.dataInterface['myEquipmentTypeGetPageListByDto']
      const params = {
        limit: 10000,
        page: 1
      }
      this.$httpRequest({
        type: dataInterface.method,
        uri: dataInterface.uri ? dataInterface.uri : '',
        payload: params,
        callback: data => {
          if (data.status === 200) {
            if (data.data.total > 0) {
              this.navFormInfo.fieldList.right.inpLists[0].list = data.data.rows
              this.listTypeInfo.equiptypeIdList = data.data.rows
            } else {
              this.navFormInfo.fieldList.right.inpLists[0].list = []
              this.listTypeInfo.equiptypeIdList = []
            }
          }
        }
      })
    },
    // 获取设备型号下拉框数据
    getDeviceVersionList() {
      const dataInterface = this.dataInterface['getEquipmentVersionListForSelect']
      const params = {
        limit: 10000,
        page: 1
      }
      this.$httpRequest({
        type: dataInterface.method,
        uri: dataInterface.uri ? dataInterface.uri : '',
        payload: params,
        callback: data => {
          if (data.status === 200) {
            if (data.data.length > 0) {
              this.navFormInfo.fieldList.right.inpLists[1].list = data.data
            } else {
              this.navFormInfo.fieldList.right.inpLists[1].list = []
            }
          }
        }
      })
    },
    // 获取设备固态版本号下拉框数据
    getEquipmentFirmwareVersionList() {
      const dataInterface = getConfigElement('my_equipment_firmware_version')['view_getPageList']
      const params = {
        limit: 10000,
        page: 1
      }
      this.$httpRequest({
        type: dataInterface.method,
        uri: dataInterface.uri ? dataInterface.uri : '',
        payload: params,
        callback: data => {
          if (data.status === 200) {
            if (data.data.total > 0) {
              this.navFormInfo.fieldList.right.inpLists[2].list = data.data.rows
              this.listTypeInfo.cmdVersionidList = data.data.rows
            } else {
              this.navFormInfo.fieldList.right.inpLists[2].list = []
              this.listTypeInfo.cmdVersionidList = []
            }
          }
        }
      })
    },
    // 获取全部指令名称
    getAllCmdNamesList() {
      const dataInterface = this.dataInterface['getAllCmdNameForSelect']
      this.$httpRequest({
        type: dataInterface.method,
        uri: dataInterface.uri ? dataInterface.uri : '',
        // payload: params,
        callback: data => {
          if (data.status === 200 && data.rel) {
            if (data.data.length > 0) {
              this.navFormInfo.fieldList.right.inpLists[3].list = data.data
              this.listTypeInfo.cmdIdList = data.data
            } else {
              this.navFormInfo.fieldList.right.inpLists[3].list = []
              this.listTypeInfo.cmdIdList = []
            }
          }
        }
      })
    },
    // 修改时间
    navDateTimeChange(val) {
      if (val) {
        this.navFormInfo.data.start_time = val[0]
        this.navFormInfo.data.end_time = val[1]
      } else {
        this.navFormInfo.data.start_time = ''
        this.navFormInfo.data.end_time = ''
      }
    },
    // 新增
    myBpCarMqttcmdBaseSave() {
      console.log('aaaaaaaaaaaaaaaaaaaaaaa', this.$refs['delog'])
      if (!this.$refs['delog'].validateSelf()) {
        return false
      }
      const element = this.pageElement['btn_add']
      const params = {}
      params['main'] = this.formInfo.data
      params['itemLisExplainEntry'] = this.formData.tableData
      this.buttonLoading = true
      this.$httpRequest({
        type: element.method,
        uri: element.uri ? element.uri : '',
        payload: params,
        callback: data => {
          this.buttonLoading = false
          if (data.status === 200 && data.rel) {
            this.$message.success('保存成功')
            this.dialogFormVisible = false
            this.getTableData()
          } else {
            this.$message.error(data.message)
          }
        }
      })
    },
    // 修改
    myBpCarMqttcmdBaseEdit() {
      console.log('aaaaaaaaaaaaaaaa', this.$refs['delog'])
      if (!this.$refs['delog'].validateSelf()) {
        return false
      }
      const element = this.pageElement['btn_edit']
      const params = {}
      params['main'] = this.formInfo.data
      params['itemLisExplainEntry'] = this.formData.tableData
      this.buttonLoading = true
      this.$httpRequest({
        type: element.method,
        uri: element.uri ? element.uri : '',
        payload: params,
        callback: data => {
          this.buttonLoading = false
          if (data.status === 200 && data.rel) {
            this.$message.success('更新成功')
            this.dialogFormVisible = false
            this.getTableData()
          } else {
            this.$message.error(data.message)
          }
        }
      })
    },
    // 审核
    equipmentAudit(idArr) {
      const element = this.pageElement['btn_review']
      const ids = idArr.join(',')
      this.$confirm('此操作将审核这些数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        confirmButtonClass: 'btn-blue btn-blue-confirm',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$httpRequest({
          type: element.method,
          uri: element.uri ? element.uri + '?ids=' + ids : '',
          callback: data => {
            if (data.status === 200) {
              this.$message({
                message: '审核成功',
                type: 'success'
              })
              this.getTableData()
            } else {
              this.$message.error(data.message)
            }
          }
        })
      }).catch(() => {})
    },
    // 反审核
    equipmentUnaudit(idArr) {
      const element = this.pageElement['btn_unreview']
      const ids = idArr.join(',')
      this.$confirm('此操作将反审核这些数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        confirmButtonClass: 'btn-blue btn-blue-confirm',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$httpRequest({
          type: element.method,
          uri: element.uri ? element.uri + '?ids=' + ids : '',
          callback: data => {
            if (data.status === 200) {
              this.$message({
                message: '反审核成功',
                type: 'success'
              })
              this.getTableData()
            } else {
              this.$message.error(data.message)
            }
          }
        })
      }).catch(() => {})
    },
    // 获取新增设备型号下拉框数据
    getAddDeviceVersionIdList() {
      const dataInterface = this.dataInterface['getEquipmentVersionListForSelect']
      const params = {
        limit: 10000,
        page: 1,
        status: 2
      }
      this.$httpRequest({
        type: dataInterface.method,
        uri: dataInterface.uri ? dataInterface.uri : '',
        payload: params,
        callback: data => {
          if (data.status === 200) {
            if (data.data.length > 0) {
              this.listTypeInfo.deviceVersionIdList = data.data
            } else {
              this.listTypeInfo.deviceVersionIdList = []
            }
          }
        }
      })
    },
    // 获取新增设备固态版本号下拉框数据
    getAddEquipmentFirmwareVersionList() {
      const dataInterface = getConfigElement('my_equipment_firmware_version')['view_getPageList']
      const params = {
        limit: 10000,
        page: 1,
        status: 2
      }
      if (this.formInfo.data.deviceVersionId) {
        params['device_version_id'] = this.formInfo.data.deviceVersionId
        params['equiptype_id'] = this.formInfo.data.equiptypeId
      }
      this.$httpRequest({
        type: dataInterface.method,
        uri: dataInterface.uri ? dataInterface.uri : '',
        payload: params,
        callback: data => {
          if (data.status === 200) {
            if (data.data.total > 0) {
              this.listTypeInfo.cmdVersionidList = data.data.rows
            } else {
              this.listTypeInfo.cmdVersionidList = []
            }
          }
        }
      })
    },
    // 获取新增指令名称
    getCmdNamesList(typeOfServiceId) {
      const dataInterface = this.dataInterface['getCmdNameList']
      const params = {
        typeOfServiceId: typeOfServiceId
      }
      this.$httpRequest({
        type: dataInterface.method,
        uri: dataInterface.uri ? dataInterface.uri : '',
        payload: params,
        callback: data => {
          if (data.status === 200 && data.rel) {
            if (data.data.length > 0) {
              this.listTypeInfo.cmdIdList = data.data
            } else {
              this.listTypeInfo.cmdIdList = []
            }
          }
        }
      })
    },
    // 获取新增应答指令
    getReplyIdList() {
      const element = this.pageElement['view_getSelectList']
      const params = {
        cmd_id: this.formInfo.data.cmdId,
        device_version_id: this.formInfo.data.deviceVersionId,
        equiptype_id: this.formInfo.data.equiptypeId,
        firmware_version_id: this.formInfo.data.cmdVersionid
      }
      this.$httpRequest({
        type: element.method,
        uri: element.uri ? element.uri : '',
        payload: params,
        callback: data => {
          if (data.status === 200) {
            if (data.data.total > 0) {
              this.listTypeInfo.replyIdList = data.data.rows
            } else {
              this.listTypeInfo.replyIdList = []
            }
          }
        }
      })
    },
    // 获取字典1306新增数据包头下拉框数据
    getCmdContentHeaderidList() {
      const dataInterface = this.dataInterface['view_getCode']
      this.$httpRequest({
        type: dataInterface.method,
        uri: dataInterface.uri ? dataInterface.uri + '/1306' : '',
        callback: data => {
          if (data.length > 0) {
            this.listTypeInfo.cmdContentHeaderidList = data
          } else {
            this.listTypeInfo.cmdContentHeaderidList = []
          }
        }
      }, true)
    },
    // 获取字典1305数据组合类型下拉框数据
    getRepeatTypeidList() {
      const dataInterface = this.dataInterface['view_getCode']
      this.$httpRequest({
        type: dataInterface.method,
        uri: dataInterface.uri ? dataInterface.uri + '/1305' : '',
        callback: data => {
          if (data.length > 0) {
            this.formData.repeatTypeidList = data
          } else {
            this.formData.repeatTypeidList = []
          }
        }
      }, true)
    },
    // 获取字典XX数据组合类型下拉框数据
    getFieldsIdList(code) {
      const dataInterface = this.dataInterface['view_getCode']
      this.$httpRequest({
        type: dataInterface.method,
        uri: dataInterface.uri ? dataInterface.uri + '/' + code : '',
        callback: data => {
          if (data.length > 0) {
            this.formData.fieldsIdList = data
          } else {
            this.formData.fieldsIdList = []
          }
        }
      }, true)
    },
    // 修改
    editRow(row, index) {
      this.getDetail(row.id)
      this.dialogType = '2'
      this.dialogTitle = '指令修改'
      this.formInfo.fieldList.map((item, index) => {
        if (index !== 2 && index !== 10) {
          item.disabled = false
        }
      })
      this.dialogFormVisible = true
    },
    // 查看
    childSeeRow(row, index) {
      this.getDetail(row.id)
      this.dialogType = '0'
      this.dialogTitle = '指令查看'
      this.formInfo.fieldList.map((item, index) => {
        if (index !== 2 && index !== 10) {
          item.disabled = true
        }
      })
      this.dialogFormVisible = true
    },
    // 删除
    removeRow(row, index) {
      const element = this.pageElement['btn_delete']
      this.$httpRequest({
        type: element.method,
        uri: element.uri ? element.uri : '',
        payload: { id: row.id },
        callback: data => {
          if (data.status === 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getTableData()
          } else {
            this.$message.error(data.message)
          }
        }
      })
    },
    // 复选框
    handleSelectionChange(selection) {
      this.selection = selection
      this.auditarr = [] // 已审核数组
      this.unAuditarr = [] // 未审核数组
      selection.forEach((item) => {
        if (item.status === 2) {
          this.auditarr.push(item.id)
        } else if (item.status === 1) {
          this.unAuditarr.push(item.id)
        }
      })
    },
    handleIndexChange(current) {
      this.pagination.pageIndex = current
      this.getTableData()
    },
    handleSizeChange(size) {
      this.pagination.pageIndex = 1
      this.pagination.limit = size
      this.getTableData()
    },
    getDetail(mainId) {
      const element = this.pageElement['view_getOne']
      this.$httpRequest({
        type: element.method,
        uri: element.uri ? element.uri : '',
        payload: { mainId: mainId },
        callback: data => {
          if (data.status === 200) {
            this.formInfo.data = data.data.main
            this.formInfo.data.reply = data.data.main.reply ? Number(data.data.main.reply) : 0
            this.formData.tableData = data.data.itemLisExplainEntry
            this.getAddDeviceVersionIdList()
            // this.getAddEquipmentFirmwareVersionList()
            this.getCmdContentHeaderidList()
            this.getRepeatTypeidList()
            this.listTypeInfo.cmdIdList.map(item => {
              if (this.formInfo.data.cmdId === item.id) {
                this.getFieldsIdList(item.code)
              }
            })
            if (this.formInfo.data.reply === 1) {
              this.getReplyIdList()
            }
            // this.getAllCmdNamesList()
          } else {
            this.$message.error(data.message)
          }
        }
      })
    },
    // 获取表格数据
    getTableData() {
      const element = this.pageElement['view_getPageList']
      const params = {
        limit: this.pagination.limit,
        page: this.pagination.pageIndex
      }
      this.isLoading = true
      this.$httpRequest({
        type: element.method,
        uri: element.uri ? element.uri : '',
        payload: { ...params, ...this.navFormInfo.data },
        callback: data => {
          this.isLoading = false
          if (data.status === 200) {
            if (data.data.total > 0) {
              this.tableData = data.data.rows
              this.pagination.total = data.data.total
              this.listTypeInfo.deviceNameList = data.data.rows
            } else {
              this.tableData = []
              this.pagination.total = 0
            }
            this.$refs['tablePage'].$children[0].clearSelection()
          } else {
            this.$message.error(data.message)
          }
        }
      })
    }
  }
}
</script>
<style lang="scss">
.controlInstruction {
  .textTitle {
    margin-right: 15px;
    @include font_color('spFontColor4');
  }
  .el-table th>.cell {
    // color: #fff;
  }
  .el-input-number__decrease, .el-input-number__increase{
    height: 36px;
    border: 1px solid #1a3166;
    background: #00113a;
  }
  .el-table--enable-row-hover .el-table__body tr:hover>td{
    // background-color: #F5F7FA;
    @include background_color('wlwBackGroundColor1');
  }
}
</style>
