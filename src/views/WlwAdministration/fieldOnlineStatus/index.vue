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
      commonElement: [], // 公共 权限数组
      isLoading: false,
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
                  this.getTableData()
                }
              },
              {
                innerText: '重置',
                className: 'btn-border',
                handleClick: () => {
                  this.pagination.pageIndex = 1
                  this.$refs['navForm'].resetFields()
                  // console.log(this.navFormInfo.data.area)
                  this.getTableData()
                }
              }
            ]
          }
        }
      },
      columns: [
        {
          prop: 'fproName',
          label: '大区'
        },
        {
          prop: 'fareaName',
          label: '区域'
        },
        {
          prop: 'ffieldName',
          label: '场区'
        },
        {
          prop: 'ffieldTypeName',
          label: '场区类型'
        },
        {
          prop: 'onlineStatus',
          label: '状态',
          rule: {
            ONLINE: '在线',
            OFFLINE: '离线'
          }
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
    this.pageElement = getConfigElement('wlwFiledStatus')
    this.commonElement = getConfigElement('wlwDataInterface')
    this.init()
  },
  methods: {
    init() {
      this.getTree()
      this.getTableData()
    },
    // 获取区域联动数据
    getTree() {
      const element = this.commonElement['treeForSelectV1']
      const params = { filter: '' }
      this.$httpRequest({
        type: element.method,
        uri: element.uri,
        payload: params,
        callback: data => {
          if (data.status === 200 && data.rel) {
            this.navFormInfo.fieldList.right.inpLists[0].options = data.data
          } else {
            this.$message.error(data.message)
          }
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
    getTableData() {
      const element = this.pageElement['view']
      const params = {
        limit: this.pagination.limit,
        page: this.pagination.pageIndex
      }
      if (this.navFormInfo.data.area.length > 0) {
        params['regionId'] = this.navFormInfo.data.area[0]
        params['areaId'] = this.navFormInfo.data.area[1]
        params['fieldId'] = this.navFormInfo.data.area[2]
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
              this.pagination.toatl = data.data.total
            } else {
              this.tableData = []
              this.pagination.toatl = 0
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
