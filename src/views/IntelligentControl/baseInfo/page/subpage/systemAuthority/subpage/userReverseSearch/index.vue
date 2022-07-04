<template>
  <div class="home">
    <!-- 头部导航 -->
    <nav-form
      ref="navForm"
      :data="navFormInfo.data"
      :field-list="navFormInfo.fieldList"
    />
    <!-- 表格内容 -->
    <tablePage
      :is-loading="loading"
      :columns="columns"
      :data-source="tableData"
      :options="options"
      :pagination="pagination"
      @handleSizeChange="handleSizeChange"
      @handleIndexChange="handleIndexChange"
    />
    <!-- :fetch="fetchTableData" -->
  </div>
</template>

<script>
import {
  getGroupTypeId,
  getGroupTree,
  // getDataMenu,
  userDataAuthList
} from '@/http/api/jurisdiction'
import {
  getRegionAreaFieldTree,
  getRootTypeUnitTreeV2
} from '@/http/api/baseInfo/regionAreaField.js'
import navForm from '@/components/commonComponent/navForm/index.vue'
import tablePage from '@/components/ElementComponent/iTable'
export default {
  components: {
    tablePage,
    navForm
  },
  data() {
    return {
      // 角色列表
      roldList: [],
      // 大区列表
      regionList: [],
      navFormInfo: {
        data: {
          area: [],
          roomtypeUnit: [],
          groupId: ''
        },
        fieldList: {
          right: {
            inpLists: [
              {
                key: 'area',
                type: 'cascader',
                className: 'shadow',
                placeholder: '大区 / 区域 / 场区 ',
                customLabel: 'title',
                customValue: 'value',
                valueKey: 0,
                checkStrictly: true,
                clearable: true,
                options: [],
                handleChange: (v1) => {
                  if (v1.length === 3) {
                    getRootTypeUnitTreeV2({ isBuilding: false, fieldId: v1[2] }).then(data => {
                      if (data.status === 200) {
                        this.navFormInfo.fieldList.right.inpLists[1].options = data.data
                      } else {
                        this.navFormInfo.fieldList.right.inpLists[1].options = []
                      }
                    })
                    this.navFormInfo.data.roomtypeUnit = []
                  } else {
                    this.navFormInfo.fieldList.right.inpLists[1].options = []
                    this.navFormInfo.data.roomtypeUnit = []
                  }
                }
              },
              {
                key: 'roomtypeUnit',
                type: 'cascader2',
                checkStrictly: true,
                valueKey: 1,
                customLabel: 'title',
                className: 'shadow',
                placeholder: '猪舍类型 / 单元',
                clearable: true,
                options: []
              },
              {
                key: 'groupId',
                type: 'select',
                className: 'shadow',
                placeholder: '角色',
                list: []
              }
            ],
            btnLists: [
              {
                innerText: '查询',
                className: 'btn-blue',
                handleClick: () => {
                  this.pagination.pageIndex = 1
                  this.getList()
                }
              },
              {
                innerText: '重置',
                className: 'btn-border',
                handleClick: () => {
                  this.$refs['navForm'].resetFields()
                  this.pagination.pageIndex = 1
                  this.getList()
                }
              }
            ]
          }
        }
      },
      columns: [
        {
          prop: 'username',
          label: '账号',
          width: 160
        },
        {
          prop: 'name',
          label: '用户名',
          width: 120
        },
        {
          prop: 'jobNo',
          label: '工号',
          width: 160
        },
        {
          prop: 'mobilePhone',
          label: '手机',
          width: 180
        },
        {
          longData: true,
          prop: 'groupNames',
          label: '角色'
        },
        {
          longData: true,
          prop: 'compName',
          label: '公司'
        },
        {
          // longData: true,
          prop: 'deptName',
          label: '部门',
          width: 240
        }
      ],
      // 数据
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
        mutiSelect: false, // 多选框
        index: false, // 显示序号， 多选则 mutiSelect
        loading: false, // 表格动画
        initTable: true // 是否一挂载就加载数据
      },
      loading: false
    }
  },
  watch: {
    // 赋值搜索条件
    // 'navFormInfo.data': {
    //   handler: function(n) {
    //     this.search.regionId = n.area[0] || ''
    //     this.search.areaId = n.area[1] || ''
    //     this.search.fieldId = n.area[2] || ''
    //     this.search.roomTypeId = n.area[3] || ''
    //     this.search.unitId = n.area[4] || ''
    //     this.search.status = n.status
    //     this.search.mac = n.mac
    //     this.search.deviceId = n.deviceId
    //   },
    //   deep: true
    // },
    'navFormInfo.data.area': {
      handler: function(n) {
        if (n.length === 0) {
          this.navFormInfo.fieldList.right.inpLists[0].valueKey++ // 只要监听到数据源发生变化 ，改变keyValue的值，达到重新渲染的效果
          this.navFormInfo.fieldList.right.inpLists[1].valueKey++
        }
      },
      deep: true
    }
  },
  mounted() {
    this.groupTypeId()
    this.getRegionList()
  },
  methods: {
    // 默认值递归
    // defaultValueMe(arr) {
    //   this.navFormInfo.data.area.push(arr[0].value)
    //   if (arr[0].children) {
    //     this.defaultValueMe(arr[0].children)
    //   }
    // },
    getList() {
      const data = {
        appCode: 'unit-evc',
        page: this.pagination.pageIndex,
        limit: this.pagination.limit
      }
      this.navFormInfo.data.area.map((item, index) => {
        if (index === 0) {
          data.regionId = item
        } else if (index === 1) {
          data.areaId = item
        } else if (index === 2) {
          data.fieldId = item
        }
      })
      this.navFormInfo.data.roomtypeUnit.map((item, index) => {
        if (index === 1) {
          data.roomTypeId = item
        } else if (index === 2) {
          data.unitId = item
        }
      })
      if (this.navFormInfo.data.groupId) {
        data.groupId = this.navFormInfo.data.groupId
      }
      this.loading = true
      userDataAuthList(data).then((res) => {
        this.loading = false
        if (res && res.status === 200) {
          if (res.data.total > 0) {
            this.pagination.total = res.data.total
            this.tableData = res.data.rows
          } else {
            this.tableData = []
            this.pagination.total = 0
          }
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 分页器页码
    handleIndexChange(current) {
      this.pagination.pageIndex = current
      this.getList()
    },
    // 分页器一页多少条
    handleSizeChange(size) {
      this.pagination.pageIndex = 1
      this.pagination.limit = size
      this.getList()
    },
    // 大区列表
    getRegionList() {
      const data = {
        isBuilding: false
      }
      getRegionAreaFieldTree(data).then(data => {
        if (data.status === 200 && data.rel) {
          this.navFormInfo.fieldList.right.inpLists[0].options = data.data
        } else {
          this.navFormInfo.fieldList.right.inpLists[0].options = []
        }
      })
    },
    // 查询角色列表
    groupTree(id) {
      const data = {
        groupType: id,
        appCode: 'unit-evc'
      }
      getGroupTree(data).then((res) => {
        if (res) {
          const arr = []
          res.map((item) => {
            const obj = {}
            obj.label = item.label
            obj.value = item.id
            arr.push(obj)
          })
          this.navFormInfo.fieldList.right.inpLists[1].list = arr
        }
      })
    },
    // 获取角色信息 - groupType
    groupTypeId() {
      const data = {
        appCode: 'unit-evc'
      }
      getGroupTypeId(data).then((res) => {
        if (res) {
          this.groupTree(res[0].id)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.alsrtInfo {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  background: rgba(0, 0, 0, 0.1);

  .profPrompt_test {
    padding: 10px;
    width: 120px;
    overflow: hidden;
    line-height: 28px;
    border: 1px solid #4eb6d3;
    color: #4eb6d3;
    position: absolute;
    background-color: #fbfbfb;
    top: 356px;
    left: 50%;
    font-size: 16px;
    font-family: Gotham-Book;
    opacity: 1;
    text-align: center;
    transform: translate(-50%, -50%);
  }
}
</style>
