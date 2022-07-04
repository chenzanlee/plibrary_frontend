<template>
  <div class="dialog roleuserDIA" :class="dialogDtatus ? 'dialog-block' : 'dialog-hidden'">
    <div v-loading="loading1 || loading2" class="dialog-body Highlight">
      <!-- 头部 -->
      <div class="dialog-head addedTitle5">
        <span>分配用户</span>
        <div class="dialog-head-close" @click="close"><i class="iconfont">&#xe61a;</i></div>
      </div>

      <!-- 内容 -->
      <div class="jurisdiction-user">
        <div class="jurisdiction-user-body">
          <div class="jurisdiction-user-l">
            <p>未关联用户列表</p>
            <div class="jurisdiction-user-container">
              <div class="jurisdiction-user-container-head">
                <input v-model="notRelationName" class="jurisdiction-user-container-put inputStyle" type="text" placeholder="请输入关键字">
                <button class="btn-blue buttons2" @click="queryName('no')">查询</button>
              </div>
              <div class="jurisdiction-user-container-body">
                <tablePage
                  ref="userNoTable"
                  :columns="columns"
                  :data-source="noRelationList"
                  :options="options"
                  :pagination="pagination1"
                  @handleSizeChange="handleSizeChange1"
                  @handleIndexChange="handleIndexChange1"
                  @selection-change="checkedBox1"
                />
              </div>
            </div>
          </div>
          <div class="jurisdiction-user-c">
            <div>
              <button class="btn-blue buttons2" @click="addedList()">增加<i class="iconfont jurisdiction-user-c-icon1">&#xe619;</i></button>
              <button class="btn-red buttons2" @click="deleteList()"><i class="iconfont jurisdiction-user-c-icon2">&#xe618;</i>移除</button>
            </div>

          </div>
          <div class="jurisdiction-user-r">
            <p>已关联用户列表</p>
            <div class="jurisdiction-user-container">
              <div class="jurisdiction-user-container-head">
                <input v-model="relationName" class="jurisdiction-user-container-put inputStyle" type="text" placeholder="请输入关键字">
                <button class="btn-blue buttons2" @click="queryName('yi')">查询</button>
              </div>
              <div class="jurisdiction-user-container-body">
                <tablePage
                  ref="userYiTable"
                  :columns="columns"
                  :data-source="yiRelationList"
                  :options="options"
                  :pagination="pagination2"
                  @handleSizeChange="handleSizeChange2"
                  @handleIndexChange="handleIndexChange2"
                  @selection-change="checkedBox2"
                />
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>

    <div class="dialog-close" @click="close" />

  </div>
</template>
<script>
import tablePage from '@/components/ElementComponent/iTable'

import {
  notRelation,
  alreadyRelation,
  addRelation,
  deleteRelation
} from '@/http/api/jurisdiction'

export default {
  components: {
    tablePage
  },
  data() {
    return {
      // 弹框动画
      dialogDtatus: true,
      upDate: true,
      // 添加
      addUserList: [],
      // 删除
      deleteUserList: [],

      // 未关联查询
      notRelationName: '',
      // 已关联查询
      relationName: '',

      // 表单
      columns: [
        {
          prop: 'username',
          label: '登录名',
          align: 'left'
        }, {
          prop: 'name',
          label: '姓名',
          align: 'left'
        },
        // {
        //   prop: 'compName',
        //   label: '公司',
        //   align: 'left'
        // },
        {
          prop: 'deptName',
          label: '部门',
          align: 'left'
        }
      ],
      // 表格配置项
      options: {
        stripe: false, // 斑马纹
        firstFixed: true, // 首航固定
        mutiSelect: true, // 多选框
        index: false, // 显示序号， 多选则 mutiSelect
        loading: false, // 表格动画
        initTable: false // 是否一挂载就加载数据
      },
      // 未关联表
      noRelationList: [],
      // 已关联表
      yiRelationList: [],

      // 分页
      pagination1: {
        total: 0,
        pageIndex: 1,
        limit: 10,
        small: true,
        layout: 'prev, pager, next, jumper'
      },

      // 分页
      pagination2: {
        total: 0,
        pageIndex: 1,
        limit: 10,
        small: true,
        layout: 'prev, pager, next, jumper'
      },
      loading1: true,
      loading2: true

    }
  },
  mounted() {
    if (this.upDate) {
      this.upDate = !this.upDate
      this.init()

      this.getNotRelation()
      this.getAlreadyRelation()
    }
  },
  methods: {
    init() {
    },

    // 添加
    addedList() {
      this.setAddRelation()
    },
    // 移除
    deleteList() {
      this.setDeleteRelation()
    },

    // 查询
    queryName(type) {
      if (type === 'no') {
        this.pagination1.pageIndex = 1
        this.getNotRelation()
      } else if (type === 'yi') {
        this.pagination2.pageIndex = 1
        this.getAlreadyRelation()
      }
    },
    // 分页
    // 表单1 - 未关联
    handleIndexChange1(current) {
      this.pagination1.pageIndex = current
      this.getNotRelation()
    },
    handleSizeChange1(size) {
      this.pagination1.pageIndex = 1
      this.pagination1.limit = size
      this.getNotRelation()
    },
    checkedBox1(selection) {
      this.addUserList = []
      selection.map((i, index) => {
        this.addUserList.push(i.id)
      })
    },
    // 表单2 - 已关联
    handleIndexChange2(current) {
      this.pagination2.pageIndex = current
      this.getAlreadyRelation()
    },
    handleSizeChange2(size) {
      this.pagination2.pageIndex = 1
      this.pagination2.limit = size
      this.getAlreadyRelation()
    },
    checkedBox2(selection) {
      this.deleteUserList = []
      selection.map((i, index) => {
        this.deleteUserList.push(i.id)
      })
    },

    // 未关联列表 - 查询：设置keyword的值
    async getNotRelation() {
      this.loading1 = true
      const data = {
        groupId: this.data.rows.id,
        keyword: this.notRelationName,
        page: this.pagination1.pageIndex,
        limit: this.pagination1.limit
      }
      await notRelation(data).then((res) => {
        this.loading1 = false
        if (res && res.status === 200) {
          this.$refs['userNoTable'].$children[0].clearSelection()
          this.noRelationList = res.data.rows
          this.pagination1.total = res.data.total
        } else { this.$message.error(res.message) }
      }).catch(() => {
        this.loading1 = false
      })
    },
    // 已关联列表 - 查询：设置keyword的值
    async getAlreadyRelation() {
      this.loading2 = true
      const data = {
        groupId: this.data.rows.id,
        keyword: this.relationName,
        page: this.pagination2.pageIndex,
        limit: this.pagination2.limit,
        type: 1

      }
      await alreadyRelation(data).then((res) => {
        this.loading2 = false
        if (res && res.status === 200) {
          this.$refs['userYiTable'].$children[0].clearSelection()
          this.yiRelationList = res.data.rows
          this.pagination2.total = res.data.total
        } else { this.$message.error(res.message) }
      }).catch(() => {
        this.loading2 = false
      })
    },
    // 添加关联列表
    async setAddRelation() {
      if (!this.data.powerLitst.addGroupUsers) {
        this.$message.error('暂无权限')
        return
      }
      if (!this.addUserList || this.addUserList.length === 0) {
        this.$message.error('请选择增的加用户')
        return
      }
      this.loading1 = true
      this.loading2 = true
      const data = {
        groupId: this.data.rows.id,
        leaders: '',
        members: this.addUserList.toString()
      }
      await addRelation(data).then((res) => {
        this.loading1 = false
        this.loading2 = false
        if (res && res.status === 200 && res.rel) {
          this.$message.success('添加成功')
          this.addUserList = []
          this.getAlreadyRelation()
          this.getNotRelation()
        } else { this.$message.error(res.message) }
      }).catch(() => {
        this.loading1 = false
        this.loading2 = false
      })
    },
    // 删除关联列表
    async setDeleteRelation() {
      if (!this.data.powerLitst.delGroupUsers) {
        this.$message.error('暂无权限')
        return
      }
      if (!this.deleteUserList || this.deleteUserList.length === 0) {
        this.$message.error('请选择删除的用户')
        return
      }
      this.loading1 = true
      this.loading2 = true
      const data = {
        groupId: this.data.rows.id,
        leaders: '',
        members: this.deleteUserList.toString()
      }
      await deleteRelation(data).then((res) => {
        this.loading1 = false
        this.loading2 = false
        if (res && res.status === 200 && res.rel) {
          this.$message.success('移除成功')
          this.deleteUserList = []
          this.getAlreadyRelation()
          this.getNotRelation()
        } else { this.$message.error(res.message) }
      }).catch(() => {
        this.loading1 = false
        this.loading2 = false
      })
    },
    close() {
      this.dialogDtatus = false
      setTimeout(() => { this._close() }, 300)
    }
  }

}
</script>
<style lang="scss">
.roleuserDIA{
  .addedTitle5{
    @include font_color('addedTitle');
    @include border_bottom_color('addedTitle_bottomborder')
  }
}
</style>
<style lang="scss" scoped>
@import "@/style/_handle.scss";

.jurisdiction-user::-webkit-scrollbar{
    display: none;
}
.jurisdiction-user{
    width: 80vw;
    min-width: 400px;
    min-height: 200px;
    max-height: 70vh;
    overflow-x: auto;
    margin: 0 15px;
    padding: 30px 15px;
}
.jurisdiction-user-body{
    display: flex;;
}
.jurisdiction-user-l{
    flex: 1;
    width: 50%;
    overflow: hidden;
    box-sizing: border-box;
    padding: 20px 0;
    P{
        display: block;
        height: 35px;
        margin-top:-20px;
        @include font_color('addedTitle');
    }
}
.jurisdiction-user-c{
    width: 100px;
    display: flex;
    align-items: center;
    text-align: center;
    &-icon1{
      font-size: 12px;
      margin-left: 4px;
      position: relative;
      top: -1px;
    }
    &-icon2{
      font-size: 12px;
      margin-right: 4px;
      position: relative;
      top: -1px;
    }
}
.jurisdiction-user-r{
    flex: 1;
    width: 50%;
    overflow: hidden;
    box-sizing: border-box;
    padding: 20px 0;
    P{
        display: block;
        height: 35px;
        margin-top:-20px;
        @include font_color('addedTitle');
    }
}

.jurisdiction-user-container{
    border: 1px solid;
    @include border_color('roleUser_border1');
    border-radius: 10px;
    height:100%;
    // height: calc(100% - 61px);

    &-put{
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        position: relative;
        top: -1px;
        margin-right: 10px;
        @include background('addDIalog_inputStyle');
        @include border_color('addedTitle_bottomborder');
        @include font_color('addedTitle');
        &:hover{
          @include border_color('addedTitle_bottomborder');
        }
        &::placeholder{
          @include font_color('inputStyle_placeholder');
        }
    }

    &-head{
        margin: 10px 15px 10px 15px;
    }
    &-body{
        margin: 0 15px;
        min-height: 303px;
    }

}

.buttons2{
    padding: 5px 20px;
    margin: 10px 0;
}

</style>
