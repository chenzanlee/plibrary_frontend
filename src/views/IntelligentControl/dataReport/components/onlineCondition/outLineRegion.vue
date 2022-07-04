<template>
  <div class="facility titleHighlight">
    <h3 class="short-title5">离线场区({{ list.length }})</h3>
    <div class="flexbg">
      <div class="home">
        <!-- columns相当于th里边的内容 -->
        <!-- tableData代表table表中内容区，数据列表 -->
        <!-- options代表对table的配置项 -->
        <!-- fetchTableData 代表请求数据的方法 -->
        <!-- pagination 代表分页器的配置 -->
        <tablePage
          :columns="columns"
          :data-source="tableData"
          :options="options"
          :height="height"
          :fetch="fetchTableData"
          @handleSizeChange="handleSizeChange"
          @handleIndexChange="handleIndexChange"
          @selection-change="handleSelectionChange"
        />
        <!-- selection-change 选择框事件-->
        <!-- child-addRow 增加 -->
        <!-- child-removeRow 删除 -->
        <!-- child-editRow 编辑 -->
        <!-- child-seeRow 查看 -->
      </div>
    </div>
  </div>
</template>
<script>
import tablePage from '@/components/ElementComponent/iTable'
export default {
  components: {
    tablePage
  },
  props: {
    list: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      pagination: {
        total: 0,
        pageIndex: 1,
        limit: 10000
      },
      total: 0,
      height: '230px',
      width: '',
      // 配置from表单的显示
      formConfig: {
        // 显示选项配置
        formItemList: [
          {
            type: 'select',
            model: 'importOrExport',
            prop: 'importOrExport',
            label: '进出港',
            name: 'importOrExport',
            placeholder: '请输入进出港',
            rules: [
              { required: true, message: '请输入进出港', trigger: 'blur' }
            ],
            optList: [
              {
                value: '测试数据',
                label: '测试数据'
              },
              {
                value: '进港',
                label: '进港'
              },
              {
                value: '出港',
                label: '出港'
              }
            ]
          }
        ],
        // 按钮配置项跟处理按钮事件名称的填写 type: "90" 表示宽度90的按钮 class:'btn-blue' 代表蓝色按钮以下同理
        operate: [
          {
            size: '90',
            class: 'btn-blue',
            name: '查询',
            handleClick: this.search
          },
          {
            size: '90',
            class: 'btn-border',
            name: '重置',
            handleClick: this.add
          }
        ]
      },
      columns: [
        {
          prop: 'fieldName',
          label: '场区名称'
        },
        {
          prop: 'offlineTime',
          label: '离线时间'
        }
      ],
      tableData: [
      ],
      options: {
        stripe: false, // 斑马纹
        firstFixed: true, // 首航固定
        mutiSelect: false, // 多选框
        index: false, // 显示序号， 多选则 mutiSelect
        loading: false, // 表格动画
        initTable: true // 是否一挂载就加载数据
      }
    }
  },
  watch: {
    list(newData) {
      console.log('变化的list', newData)
      this.tableData = this.list
    }
  },
  mounted() {
  },
  created() {},
  methods: {
    handleIndexChange(current) {
      console.log('点击了前后按钮' + current)
    },
    handleSizeChange(size) {
      console.log('点击了每页显示几条数据' + size)
    },
    btnExt(se) {
      console.log('导出' + se)
    },
    btnRemoves(se) {
      console.log('批量删除' + se)
    },
    btnShenhe(se) {
      console.log('审核' + se)
    },
    btnFanshenhe(se) {
      console.log('反审核' + se)
    },
    // 查询
    search() {
      const returnValue = this.$refs['childRules'].validateForm()
      if (returnValue.flag) {
        console.log('父组件拿到参数值' + JSON.stringify(returnValue.value))
      }
    },
    // 新增或重置
    add() {
      this.$refs['childRules'].resetFields()
    },
    handleSelectionChange(selection) {
      this.selection = selection
      console.log(selection)
    },
    // 获取表数据方法
    fetchTableData() {
      // alert('触发请求表数据')
    }
  }
}
</script>
<style lang="css" scoped>
.flexbg {
  width: 100%;
  /* height: 220px; */
}
.flexbg >>> .itable-empty-box-wrap{
  margin-top: 20px !important;
}
.flexbg >>> .itable-empty-box-wrap img {
  max-width: 200px !important;
  line-height: 1
}
.facility {
  flex: 1;
  /* height: 300px; */
}
.mapLi {
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0 0 0;
}
.chart {
  width: 350px;
  height: 100%;
}
</style>
