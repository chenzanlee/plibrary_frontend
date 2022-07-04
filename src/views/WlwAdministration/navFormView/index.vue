<template>
  <div>
    <nav-form ref="navForm" :data="navFormInfo.data" :field-list="navFormInfo.fieldList" />

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
    >
      <div class="body">
        <h1>内容1</h1>
        <h2>详情1</h2>
      </div>
      <div slot="footer" class="dialog-footer">
        <div style="width:100%;margin:0 auto;">
          <el-button class="btn-border" @click="dialogFormVisible = false">取 消</el-button>
          <el-button class="btn-blue" type="primary" @click="determine">确 定</el-button>
          <!-- <el-button v-if="status==2" class="btn-blue" type="primary" @click="determine">更 新</el-button> -->
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import tablePage from '@/components/ElementComponent/iTable'
import navForm from '@/components/commonComponent/navForm/index.vue'

export default {
  components: {
    tablePage,
    navForm
  },
  data() {
    return {
      isLoading: false,
      dialogFormVisible: false,
      navFormInfo: {
        data: {
          city: [], // 区域三级
          status: '', // 审核状态
          deviceId: '', // 设备标识
          mac: '' // MAC地址
        },
        fieldList: {
          left: {
            inpLists: [
              {
                type: 'button',
                innerText: '新增',
                className: 'btn-blue',
                authCode: 'roofMainControllerMaintain:btn_add',
                handleClick: () => {
                  console.log('新增')
                  this.dialogFormVisible = true
                }
              },
              {
                type: 'button',
                innerText: '审核',
                className: 'btn-blue-disabled',
                isDisabled: true,
                authCode: 'roofMainControllerMaintain:btn_review',
                handleClick: () => {
                  console.log('审核')
                }
              },
              {
                type: 'button',
                innerText: '反审核',
                className: 'btn-blue-disabled',
                isDisabled: true,
                authCode: 'roofMainControllerMaintain:btn_unreview',
                handleClick: () => {
                  console.log('反审核')
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
                placeholder: '大区 / 区域 / 场区',
                options: []
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
                authCode: 'roofMainControllerMaintain:list',
                handleClick: () => {
                  this.pagination.pageIndex = 1
                  this.getMyEvcMcuInfoList()
                }
              },
              {
                innerText: '重置',
                className: 'btn-border',
                handleClick: () => {
                  console.log('重置')
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
          longData: true,
          prop: 'deviceName',
          label: '设备名称',
          width: '160'
        },
        {
          longData: true,
          prop: 'deviceId',
          label: '设备标识',
          width: '220'
        },
        {
          prop: 'crtName',
          label: '创建人'
        },
        {
          longData: true,
          prop: 'crtTime',
          label: '创建日期',
          width: '160'
        },
        {
          prop: 'status',
          label: '状态',
          rule: {
            'NORMAL': '未审核',
            'AUDITED': '已审核'
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
              authCode: 'roofMainControllerMaintain:btn_update',
              size: 'auto',
              click: 'edit',
              status: 'NORMAL'
            },
            {
              name: '删除',
              class: 'btn-red',
              authCode: 'roofMainControllerMaintain:btn_del',
              size: 'auto',
              click: 'remove',
              status: 'NORMAL'
            }
          ]
        }
      ],
      tableData: [
        { areaName: '南阳', fieldName: '卧龙11厂', deviceName: '设备00001', deviceId: '4D59203134423550501200360021', crtTime: '2020-11-01 10:12:50', crtName: '张佳林', status: 'NORMAL' },
        { areaName: '南阳', fieldName: '卧龙12厂', deviceName: '设备00001', deviceId: '4D59203134423550501200361231', crtTime: '2020-11-02 10:12:50', crtName: '张佳林', status: 'NORMAL' },
        { areaName: '南阳', fieldName: '卧龙13厂', deviceName: '设备00001', deviceId: '4D59203134423550501200360021', crtTime: '2020-11-03 10:12:50', crtName: '张佳林', status: 'NORMAL' },
        { areaName: '南阳', fieldName: '卧龙14厂', deviceName: '设备00001', deviceId: '4D592031344235505012wqeeas21', crtTime: '2020-11-04 10:12:50', crtName: '张佳林', status: 'NORMAL' },
        { areaName: '南阳', fieldName: '卧龙15厂', deviceName: '设备00001', deviceId: '4D59203134423550501200360021', crtTime: '2020-11-05 10:12:50', crtName: '张佳林', status: 'NORMAL' },
        { areaName: '南阳', fieldName: '卧龙16厂', deviceName: '设备00001', deviceId: '4D5920313442355050120036qwes', crtTime: '2020-11-06 10:12:50', crtName: '张佳林', status: 'NORMAL' },
        { areaName: '南阳', fieldName: '卧龙17厂', deviceName: '设备00001', deviceId: '4D5920313442355050120ghjxdff', crtTime: '2020-11-07 10:12:50', crtName: '张佳林', status: 'NORMAL' },
        { areaName: '南阳', fieldName: '卧龙18厂', deviceName: '设备00001', deviceId: '4D592031344235505012003gtyyu', crtTime: '2020-11-08 10:12:50', crtName: '张佳林', status: 'NORMAL' },
        { areaName: '南阳', fieldName: '卧龙19厂', deviceName: '设备00001', deviceId: '4D5920313442355050176fhwe456', crtTime: '2020-11-09 10:12:50', crtName: '张佳林', status: 'NORMAL' }
      ], // 表单数据
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
      },
      // 弹框
      dialogTitle: '新增'
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      console.log('初始化数据')
    },
    /* *************nav-gorm************ */

    /* *************表格************ */
    handleSizeChange() {},
    handleIndexChange() {},
    handleSelectionChange() {},
    // 删除
    removeRow() {
      console.log('删除')
    },
    // 查看
    childSeeRow() {
      console.log('查看')
    },
    // 修改
    editRow() {
      this.dialogFormVisible = true
      this.dialogTitle = '修改'
      console.log('修改')
    },
    /* *************弹框************ */
    // 弹框 提交
    determine() {
      console.log('提交')
    }
  }
}
</script>
