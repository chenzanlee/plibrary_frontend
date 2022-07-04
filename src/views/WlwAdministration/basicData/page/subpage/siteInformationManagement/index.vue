<template>
  <div class="fieldOnlineStatus">
    <!-- 头部导航 -->
    <nav-form
      ref="navForm"
      :data="navFormInfo.data"
      :field-list="navFormInfo.fieldList"
      @cascaderEvent="cascaderNavEvent"
    />
    <!-- 表格内容 -->
    <tablePage
      ref="tablePage"
      :is-loading="isLoading"
      :columns="columns"
      :data-source="tableData"
      :options="options"
      @child-editRow="editRow"
    />
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
          theme-type="default"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <div style="margin:0 auto;">
          <el-button class="btn-border" @click="dialogFormVisible = false">取 消</el-button>
          <el-button class="btn-blue" type="primary" :loading="buttonLoading" @click="determine">保存</el-button>
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
export default {
  components: {
    navForm,
    tablePage,
    generalForm
  },
  data() {
    return {
      pageElement: [], // 当前页面 权限数组
      commonElement: [], // 公共 权限数组
      options: { // 表格配置项
        stripe: false, // 斑马纹
        firstFixed: true, // 首航固定
        mutiSelect: true, // 多选框
        loading: false, // 表格动画
        initTable: true // 是否一挂载就加载数据
      },
      selection: [], // 表格选中数组
      isLoading: false,
      dialogFormVisible: false,
      buttonLoading: false,
      dialogType: 1, // 判断框
      title: '新增',
      namesList: [], // navForm的区域 名称
      navFormInfo: {
        data: {
          area: []
        },
        fieldList: {
          right: {
            inpLists: [
              {
                key: 'area',
                type: 'cascader',
                className: 'shadow',
                customLabel: 'regionName',
                customValue: 'regionNum',
                placeholder: '请选择大区 / 区域 / 场区',
                checkStrictly: true,
                clearable: true,
                options: []
              }
            ],
            btnLists: [
              {
                innerText: '查询',
                className: 'btn-blue',
                handleClick: () => {
                  const { area } = this.navFormInfo.data
                  if (area.length < 2) {
                    this.$message.warning('请至少选择区域！')
                    return
                  }
                  this.getTableData()
                }
              },
              {
                innerText: '重置',
                className: 'btn-border',
                handleClick: () => {
                  this.$refs['navForm'].resetFields()
                  this.tableData = []
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
          prop: 'fieldName',
          label: '场区'
        },
        {
          prop: 'longitude',
          label: '经度'
        },
        {
          prop: 'latitude',
          label: '纬度'
        },
        {
          button: true,
          label: '操作',
          fixed: 'right',
          align: 'center',
          width: '180', // 操作按钮宽度
          group: [
            {
              name: '修改',
              class: 'btn-blue',
              size: 'auto',
              click: 'edit'
            }
          ]
        }
      ],
      tableData: [],
      formInfo: {
        data: {
          area: [], // 场区
          regionId: '',
          regionName: '',
          areaId: '',
          areaName: '',
          fieldId: '',
          fieldName: '',
          longitude: '', // 经度
          latitude: '' // 纬度
        },
        fieldList: [
          // {
          //   label: '场区',
          //   key: 'area',
          //   type: 'cascader',
          //   className: 'shadow',
          //   customLabel: 'regionName',
          //   customValue: 'regionNum',
          //   placeholder: '请选择大区 / 区域 / 场区',
          //   checkStrictly: true,
          //   options: []
          // },
          {
            label: '经度',
            disabled: false,
            key: 'longitude',
            type: 'input',
            className: 'shadow',
            required: true,
            rules: [{ required: true, message: '请输入经度', trigger: 'blur' }]
          },
          {
            label: '纬度',
            disabled: false,
            key: 'latitude',
            type: 'input',
            className: 'shadow',
            required: true,
            rules: [{ required: true, message: '请输入纬度', trigger: 'blur' }]
          },
          {
            label: '是否展示',
            disabled: false,
            key: 'isShow',
            type: 'radio',
            customLabel: 'name',
            customVal: 'val',
            className: 'shadow',
            optList: [
              {
                name: '是',
                val: 1
              },
              {
                name: '否',
                val: -1
              }
            ]
          }
        ]
      }
    }
  },
  watch: {
    dialogFormVisible(val) {
      if (!val) {
        this.$refs['delog'].resetFields() // 手动清楚一下提示语
      }
    }
  },
  created() {
    this.pageElement = getConfigElement('test')
    this.commonElement = getConfigElement('wlwDataInterface')
    this.init()
  },
  methods: {
    init() {
      this.getTree()
    },
    // 获取区域联动数据
    getTree() {
      const element = this.commonElement['view_treeForRegionAreaField']
      const params = { filter: '' }
      this.$httpRequest({
        type: element.method,
        uri: element.uri,
        payload: params,
        callback: data => {
          if (data.status === 200) {
            this.navFormInfo.fieldList.right.inpLists[0].options = data.data.rows
            this.formInfo.fieldList[0].options = data.data.rows
          }
        }
      })
    },
    determine() {
      if (!this.$refs['delog'].validateSelf()) {
        return false
      }
      if (this.dialogType === 1) {
        const element = this.pageElement['updateFieldMap']
        const params = this.formInfo.data
        params['instructionType'] = '1'
        this.buttonLoading = true
        this.$httpRequest({
          type: element.method,
          uri: element.uri,
          payload: params,
          callback: res => {
            this.buttonLoading = false
            if (res.status === 200 && res.rel) {
              this.dialogFormVisible = false
              if (this.navFormInfo.data.area.length > 0) {
                this.getTableData()
              }
              this.$message.success('新增成功')
            }
          }
        })
      } else {
        const element = this.pageElement['updateFieldMap']
        const params = this.formInfo.data
        params['instructionType'] = '3'
        this.buttonLoading = true
        this.$httpRequest({
          type: element.method,
          uri: element.uri,
          payload: params,
          callback: res => {
            this.buttonLoading = false
            if (res.status === 200 && res.rel) {
              this.dialogFormVisible = false
              this.$message.success('修改成功')
              if (this.navFormInfo.data.area.length > 0) {
                this.getTableData()
              }
            } else if (res.status === 200 && !res.rel) {
              this.$message.error('修改失败')
            }
          }
        })
      }
    },
    editRow(row) { // 修改
      this.dialogType = 2
      this.title = '修改'
      this.formInfo.data = { ...row }
      // this.formInfo.data.area = [this.formInfo.data.regionId, this.formInfo.data.areaId, this.formInfo.data.fieldId]
      // console.log(this.formInfo.data.area)
      // this.formInfo.fieldList[0].disabled = true
      this.dialogFormVisible = true
    },
    cascaderNavEvent(idVals, nameVals, nodeVlas) {
      this.namesList = nameVals
    },
    getTableData() {
      const element = this.pageElement['getFieldMapData']
      const params = {}
      const { area } = this.navFormInfo.data
      const { namesList } = this
      params['regionId'] = area[0]
      params['regionName'] = namesList[0]
      params['areaId'] = area[1]
      params['areaName'] = namesList[1]
      if (area.length === 3) {
        params['fieldId'] = area[2]
        params['fieldName'] = namesList[2]
      }
      this.isLoading = true
      this.$httpRequest({
        type: element.method,
        uri: element.uri,
        payload: params,
        callback: data => {
          this.isLoading = false
          if (data.status === 200 && data.rel) {
            if (data.data.length > 0) {
              this.tableData = data.data
            } else {
              this.tableData = []
            }
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
