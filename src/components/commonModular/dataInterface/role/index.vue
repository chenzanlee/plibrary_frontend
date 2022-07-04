<template>
  <div class="dialog" :class="dialogDtatus ? 'dialog-block' : 'dialog-hidden'">
    <div
      v-loading="loading"
      class="dialog-body Highlight"
    >
      <!-- 头部 -->
      <div class="dialog-head">
        <span>授权角色</span>
        <div class="dialog-head-close" @click="close"><i class="iconfont">&#xe61a;</i></div>
      </div>

      <!-- 内容 -->
      <div class="dialog-container">
        <div class="container-head">
          <input v-model="queryName" class="container-head-query" type="text" placeholder="请输入关键字">
          <div class="container-head-r">
            <button-list
              :btn-list="headBtnList"
              @btn-added="btnReset"
              @btn-edit="btnQuery"
            />
          </div>
        </div>
        <div class="container-body">
          <tablePage
            :columns="columns"
            :data-source="tableData"
            :options="options"
            :pagination="pagination"
            @handleSizeChange="handleSizeChange"
            @handleIndexChange="handleIndexChange"
          />
          <!-- @child-editRow="getRole"
                            @child-seeRow="getPersonnel" -->
        </div>
      </div>

      <!-- 底部 -->
      <div class="dialog-foot">
        <button-list
          :btn-list="btnList"
          @btn-added="close"
          @btn-edit="close"
        />
      </div>

    </div>
    <div class="dialog-close" @click="close" />

  </div>
</template>
<script>
import buttonList from '@/components/ElementComponent/button'
import tablePage from '@/components/ElementComponent/iTable'

import {
  getGroup
  // getPerson
} from '@/http/api/menuInfo'

export default {
  components: {
    buttonList,
    tablePage

  },
  data() {
    return {
      // 弹框动画
      dialogDtatus: true,
      upDate: true,
      // element_id
      elementId: '',
      // 查询重置按钮
      headBtnList: [
        {
          name: '查询',
          class: 'btn-blue',
          size: '60',
          event: 'edit'
        }, {
          name: '重置',
          class: 'btn-border',
          size: '60',
          event: 'added'
        }
      ],
      // 保存取消按钮
      btnList: [
        {
          name: '取消',
          class: 'btn-border',
          size: '90',
          event: 'edit'
        },
        {
          name: '确定',
          class: 'btn-blue',
          size: '90',
          event: 'added'
        }
      ],
      // 查询字段
      queryName: '',
      // 表头
      columns: [
        {
          prop: 'name',
          label: '角色名称',
          align: 'left'
        }, {
          prop: 'crt_name',
          label: '授权人',
          align: 'left'
        }, {
          prop: 'crt_time',
          label: '授权日期',
          align: 'left'
        }

      ],
      // 表格数据
      tableData: [],
      // 表格属性
      options: {
        stripe: false, // 斑马纹
        firstFixed: true, // 首航固定
        mutiSelect: false, // 多选框
        index: false, // 显示序号， 多选则 mutiSelect
        loading: false, // 表格动画
        initTable: false // 是否一挂载就加载数据
      },
      // 分页
      pagination: {
        total: 0,
        pageIndex: 1,
        limit: 10
      },
      loading: true

    }
  },
  mounted() {
    if (this.upDate) {
      this.upDate = !this.upDate
      this.init()

      this.getRole()
    }
  },
  methods: {
    // 初始化数据
    init() {
      this.elementId = this.data.parentData.id
      // 编辑模式，初始化内容
      // if(this.data.type === "editElement" && this.data.childrenInfo){
      //     this.elementId = this.data.parentData.id
      // }
    },
    // 查询
    btnQuery() {
      this.getRole()
    },
    // 重置
    btnReset() {
      this.queryName = ''
      this.getRole()
    },
    // 分页
    handleIndexChange(current) {
    },
    handleSizeChange(size) {
      this.pagination.limit = size
      this.getRole()
    },

    // 提交
    confirm() {
      // this.data.handleOk('test提交')
    },
    // 关闭
    close() {
      this.dialogDtatus = false
      setTimeout(() => { this._close() }, 300)
    },
    // 授权角色列表
    async getRole() {
      this.loading = true
      const data = {
        elementId: this.elementId,
        limit: this.pagination.limit,
        page: this.pagination.pageIndex,
        keyword: this.queryName
      }
      await getGroup(data).then((res) => {
        this.loading = false
        if (res && res.status === 200) {
          this.tableData = res.data.rows
          this.pagination.total = res.data.total
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.loading = false
      })
    }

  }
}
</script>
<style lang="scss" scoped>
@import "@/style/_handle.scss";
.dialog{
    color: #EBEEF5;
}
.dialog-head{
    border-bottom: 1px solid;
    padding: 0 10px 4px 10px;
    @include font_color('addedTitle');
    @include border_bottom_color('addedTitle_bottomborder');
    &-close{
        float: right;
        // display: inline-block;
        cursor: pointer;
    }
}
.dialog-foot{
    text-align: right;
    margin: 0 20px;
    margin-bottom: 15px;
}
.dialog-container::-webkit-scrollbar{
    display: none;
}
.dialog-container{
    min-width: 600px;
    min-height: 200px;
    max-height: 70vh;
    overflow-x: auto;
    margin: 30px;
}

.container-head{
    &-query{
    border-radius: 4px;
    outline: none;
		background: none;
		height: 30px;
		background: none;
    border: 1px solid;
    @include border_color('interface_containerHead_border');
		@include font_color('addedTitle');
    padding: 0 10px;
    &::placeholder{
       @include font_color('inputStyle_placeholder');
      }
    }
     &-query:hover,  &-query:focus{
      // box-shadow: inset 0px 0px 10px #2A6EBC;
      // border-color: #409EFF;
      @include border_color('interface_containerHead_hoverborder');
    }
    &-r{
        float: right;
        margin-right: -10px;
    }
}
.container-body{
    margin-top: 20px;
    min-height: 403px;
}

</style>
