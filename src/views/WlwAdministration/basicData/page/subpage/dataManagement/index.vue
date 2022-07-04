<template>
  <div class="fieldOnlineStatus">
    <!-- 头部导航 -->
    <nav-form
      ref="navForm"
      :data="navFormInfo.data"
      :field-list="navFormInfo.fieldList"
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
    />
  </div>
</template>
<script>
import navForm from '@/components/commonComponent/navForm/index.vue'
import tablePage from '@/components/ElementComponent/iTable'
import { getConfigElement } from '@/utils/overtService'
export default {
  components: {
    navForm,
    tablePage
  },
  data() {
    return {
      pageElement: [], // 当前页面 权限数组
      isLoading: false,
      navFormInfo: {
        data: {
          deviceName: '',
          deviceId: '',
          qrCode: '',
          direction: ''
        },
        fieldList: {
          right: {
            inpLists: [
              {
                key: 'deviceName',
                type: 'input',
                required: true,
                className: 'shadow',
                placeholder: '设备名称'
              },
              {
                key: 'deviceId',
                type: 'input',
                required: true,
                className: 'shadow',
                placeholder: '设备标识'
              },
              {
                key: 'qrCode',
                type: 'input',
                required: true,
                className: 'shadow',
                placeholder: '设备条码'
              },
              {
                key: 'direction',
                type: 'select',
                className: 'shadow',
                clearable: true,
                placeholder: '数据方向',
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
                  this.pagination.pageIndex = 1
                  this.$refs['navForm'].resetFields()
                  this.getTableData()
                }
              }
            ]
          }
        }
      },
      columns: [
        {
          longData: true,
          prop: 'deviceName',
          label: '设备名称',
          width: 260
        },
        {
          longData: true,
          prop: 'deviceId',
          label: '设备标识',
          width: 260
        },
        {
          prop: 'qrCode',
          label: '设备条码',
          width: 120
        },
        {
          prop: 'direction',
          label: '数据方向',
          width: 100,
          rule: {
            DOWN: '下行',
            UP: '上行'
          }
        },
        {
          longData: true,
          prop: 'cmdContent',
          label: '数据'
        },
        {
          prop: 'crtTime',
          label: '上传时间',
          width: 160
        }
      ],
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
  created() {
    this.pageElement = getConfigElement('myEquipmentOperationDynamics')
    this.init()
  },
  methods: {
    init() {
      this.getTableData()
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
    getTableData() {
      const element = this.pageElement['view_getPageList']
      const params = {
        limit: this.pagination.limit,
        page: this.pagination.pageIndex
      }
      if (this.navFormInfo.data.deviceName) {
        params['deviceName'] = this.navFormInfo.data.deviceName
      }
      if (this.navFormInfo.data.deviceId) {
        params['deviceId'] = this.navFormInfo.data.deviceId
      }
      if (this.navFormInfo.data.qrCode) {
        params['qrCode'] = this.navFormInfo.data.qrCode
      }
      if (this.navFormInfo.data.direction) {
        params['direction'] = this.navFormInfo.data.direction
      }
      this.isLoading = true
      this.$httpRequest({
        type: element.method,
        uri: element.uri,
        payload: params,
        callback: data => {
          this.isLoading = false
          if (data.status === 200) {
            if (data.data.total > 0) {
              this.tableData = data.data.rows
              this.pagination.total = data.data.total
            } else {
              this.tableData = []
              this.pagination.total = 0
            }
          } else {
            this.$message.error(data.message)
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
