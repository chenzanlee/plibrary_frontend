<template>
  <div class="dialog" :class="dialogDtatus ? 'dialog-block' : 'dialog-hidden'">
    <div class="dialog-body Highlight">
      <!-- 头部 -->
      <div class="dialog-head addedTitle6">
        <span>分配权限</span>
        <div class="dialog-head-close" @click="close"><i class="iconfont">&#xe61a;</i></div>
      </div>

      <!-- 内容 -->
      <div class="jurisdiction-distribution">
        <div class="jurisdiction-distribution-body">

          <!-- 菜单 -->
          <div class="jurisdiction-distribution-l">
            <div>
              <button class="btn-blue buttons" @click="conserveMenu"> 保存权限</button>
              <button class="btn-blue buttons jurisdiction-distribution-r-head-btn" @click="checkoutAllMenu"> {{ ckeckoutAllMenuStatus === '0' ? '全选' : '反选' }}</button>
            </div>
            <div class="jurisdiction-distribution-l-container element-tree">
              <el-tree
                ref="tttr"
                v-loading="loadingTree"
                :props="defaultProps"
                :data="menuTreeList"
                show-checkbox
                :check-strictly="true"
                node-key="id"
                highlight-current
                :default-checked-keys="defaultSelectMenuTree.id"
                :default-expanded-keys="defaultKeys"
                @check-change="selectElementTree"
                @node-click="clickElementTree"
              />
            </div>
          </div>

          <!-- 资源列表 -->
          <div v-loading="loadingTable" class="jurisdiction-distribution-r">
            <div>
              <button class="btn-blue buttons" @click="conserveElement"> 保存资源</button>
              <!-- <button class="btn-blue buttons jurisdiction-distribution-r-head-btn" @click="ckeckoutAllElement">{{ ckeckoutAllStatus === '2'? '取消所有' : '选中所有' }} </button> -->
              <button v-show="ckeckoutAllStatus === '2'" class="btn-blue buttons jurisdiction-distribution-r-head-btn" @click="ckeckoutAllElement(false)">取消所有 </button>
              <button v-show="ckeckoutAllStatus !== '2'" class="btn-blue buttons jurisdiction-distribution-r-head-btn" @click="ckeckoutAllElement(true)">选中所有 </button>
              <el-pagination
                class="buttons jurisdiction-distribution-r-head-pagin"
                background
                layout="prev, pager, next"
                :page-size="pagination.limit"
                :total="pagination.totals"
                @current-change="handleIndexChange"
              />
            </div>
            <div class="jurisdiction-distribution-r-container">
              <tablePage
                ref="ttba"
                class="jurisdiction-distribution-r-container-table"
                :columns="columns"
                :data-source="elementList"
                :options="options"
                @handleSizeChange="handleSizeChange"
                @handleIndexChange="handleIndexChange"
                @selection-change="checkedBox"
              />
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
  getMenuListTree,
  getElementList
} from '@/http/api/menuInfo'
import {
  getMenuList,
  preservationMenuList,
  getJurisdictionIDList,
  preservationResourcesList
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
      // 菜单树列表
      menuTreeList: [],
      defaultKeys: [],
      // 默认选中的菜单
      defaultSelectMenuTree: { data: [], id: [] },
      // 选中的菜单
      seclectMenu: null,
      // 点中的菜单
      clickMenuInfo: null,
      // 资源列表
      elementList: [],
      elementTotalList: [],
      // 默认选中列表
      selectElementList: [],
      // 全选菜单状态
      ckeckoutAllMenuStatus: '0',
      allMenuList: [],
      // 全选元素状态
      ckeckoutAllStatus: '0',
      // 选中列表
      checkedElementList: [],

      defaultProps: {
        label: 'label',
        children: 'children'
      },

      // 表单配置
      // 表头配置项
      columns: [
        {
          prop: 'code',
          label: '资源编码',
          align: 'left'
        }, {
          prop: 'type',
          label: '资源类型',
          align: 'left',
          width: 100
        }, {
          prop: 'name',
          label: '资源名称',
          align: 'left'
        }, {
          prop: 'uri',
          label: '资源地址',
          align: 'left'
        }, {
          prop: 'method',
          label: '资源请求类型',
          align: 'left',
          width: 120
        }
      ],
      // 分页
      pagination: {
        total: 0,
        pageIndex: 1,
        limit: 10,
        totals: 0
      },
      // 表格配置项
      options: {
        stripe: false, // 斑马纹
        firstFixed: true, // 首航固定
        mutiSelect: true, // 多选框
        index: false, // 显示序号， 多选则 mutiSelect
        loading: false, // 表格动画
        initTable: true // 是否一挂载就加载数据
      },
      loadingTree: true,
      loadingTable: false

    }
  },
  mounted() {
    if (this.upDate) {
      this.upDate = !this.upDate
      this.init()

      this.obtainMenuTree()
      this.obtainJurisdictionList()
      this.obtainSelectElenemt()
    }
  },
  methods: {
    // 初始化数据
    init() {
    },

    /** ********菜单树********************************* */
    // 保存菜单
    conserveMenu() {
      if (!this.data.powerLitst.menu) {
        this.$message.error('暂无权限')
        return
      }
      const selectList = this.$refs.tttr.getCheckedNodes()
      const arr = []
      for (const i of selectList) {
        const a = this.findPathByLeafId(i.id, this.menuTreeList)
        for (const j of a) {
          if (arr.indexOf(j) === -1) {
            arr.push(j)
          }
        }
      }
      const menuTree = arr.toString() + ',muyuan_menu_root'
      this.setMenuTree(menuTree)
    },
    // 全选 - 菜单树
    checkoutAllMenu() {
      if (this.ckeckoutAllMenuStatus === '0') {
        this.$refs.tttr.setCheckedNodes(this.allMenuList)
        this.ckeckoutAllMenuStatus = '1'
      } else {
        this.$refs.tttr.setCheckedKeys([])
        this.ckeckoutAllMenuStatus = '0'
      }
    },
    // 保存资源
    conserveElement() {
      if (!this.clickMenuInfo) {
        this.$message.warning('请选中菜单，获取资源列表')
        return
      }
      const selectList = this.$refs.tttr.getCheckedNodes()
      const selectId = []
      for (const i of selectList) {
        selectId.push(i.id)
      }
      if (selectId.indexOf(this.clickMenuInfo.id) < 0) {
        // this.$message({ message: '当前菜单没选择', duration: 0 })
        this.$message('当前菜单没选择')
      }
      if (!this.data.powerLitst.element) {
        this.$message.error('暂无权限')
        return
      }
      const arr = []
      if (this.checkedElementList.length > 0) {
        this.checkedElementList.map((i, index) => {
          arr.push(i.id)
        })
      }
      const id = arr.length > 0 ? arr.toString() : ''
      this.saveResources(id)
      this.obtainSelectElenemt()
    },
    // 全选 - 元素列表
    ckeckoutAllElement(type) {
      if (!this.clickMenuInfo) {
        this.$message.warning('请选中菜单，获取资源列表')
        return
      }
      for (const i of this.elementTotalList) {
        this.$refs['ttba'].$children[0].toggleRowSelection(i, type)
      }
      if (type) {
        this.ckeckoutAllStatus = '2'
      } else {
        this.ckeckoutAllStatus = '1'
      }
    },
    // 递归-找到子级所有的上级
    findPathByLeafId(leafId, nodes, path) {
      if (path === undefined) { path = [] }
      for (let i = 0; i < nodes.length; i++) {
        const tmpPath = path.concat()
        tmpPath.push(nodes[i].id)
        if (leafId === nodes[i].id) { return tmpPath }
        if (nodes[i].children) {
          const findResult = this.findPathByLeafId(leafId, nodes[i].children, tmpPath)
          if (findResult) { return findResult }
        }
      }
    },
    // 点击菜单树
    clickElementTree(data, checked, indeterminate) {
      this.clickMenuInfo = data
      this.pagination.pageIndex = 1
      this.ckeckoutAllStatus = '0'
      this.obtainElementList()
      // this.elementTotalList = []
      this.obtainJurisdictionList()

      if (!this.selectElementList) { this.obtainSelectElenemt() }
    },
    // 选中菜单树
    selectElementTree(data, checked, indeterminate) {
    },
    getMenuAllID(res) {
      const list = JSON.parse(JSON.stringify(res))
      this.allMenuList = this.findChildrenID(list)
    },
    findChildrenID(res) {
      const arr = []
      res.forEach(item => {
        const tmp = { ...item }
        if (tmp.children) {
          const chirlList = this.findChildrenID(tmp.children)
          arr.push(tmp)
          arr.push(...chirlList)
        } else {
          arr.push(tmp)
        }
      })
      return arr
    },

    /** ****************资源列表*************************** */
    // 复选框
    checkedBox(selection) {
      this.ckeckoutAllStatus = '0'
      this.checkedElementList = selection
    },
    // 处理默认选中
    manageChecked() {
      if (this.ckeckoutAllStatus === '0') {
        this.$refs['ttba'].$children[0].clearSelection()
        if (this.elementTotalList && this.selectElementList) {
          this.elementTotalList.forEach(row => {
            if (this.selectElementList.indexOf(row.id) >= 0) {
              this.$refs['ttba'].$children[0].toggleRowSelection(row, true)
            }
          })
        }
      } else {
        let s = false
        if (this.ckeckoutAllStatus === '2') {
          s = true
        } else {
          s = false
        }
        for (const i of this.elementTotalList) {
          this.$refs['ttba'].$children[0].toggleRowSelection(i, s)
        }
      }
    },
    // 假分页
    elementPaging() {
      this.pagination.totals = this.elementTotalList.length
      this.elementList = []
      if (this.pagination.pageIndex * this.pagination.limit > this.elementTotalList.length) {
        this.elementList = this.elementTotalList.slice((this.pagination.pageIndex - 1) * this.pagination.limit, this.elementTotalList.length)
      } else {
        this.elementList = this.elementTotalList.slice((this.pagination.pageIndex - 1) * this.pagination.limit, this.pagination.pageIndex * this.pagination.limit)
      }
      if (this.selectElementList && this.elementList) {
        this.manageChecked()
      }
    },
    // 分页
    handleIndexChange(current) {
      this.pagination.pageIndex = current
      this.elementPaging()
    },
    // 一页条数更改
    handleSizeChange(size) {
      this.pagination.limit = size
      this.elementPaging()
    },

    /** *******************接口***************************** */
    // 保存菜单
    async setMenuTree(menuTree) {
      // muyuan_menu_root
      this.loadingTree = true
      const data = {
        menuTrees: menuTree
      }
      await preservationMenuList(data, this.data.rows.id).then((res) => {
        this.loadingTree = false
        if (res && res.status === 200 && res.rel) {
          this.$message.success('保存成功！')
          this.obtainJurisdictionList()
        } else { this.$message.error(res.message) }
      }).catch(() => {
        this.loadingTree = false
      })
    },
    // 获取菜单树
    async obtainMenuTree() {
      this.loadingTree = true
      const data = {
        appCode: this.data.appCode
      }
      this.defaultKeys = []
      await getMenuListTree(data).then((res) => {
        this.loadingTree = false
        if (res && res.length > 0) {
          this.menuTreeList = res
          this.defaultKeys.push(res[0].id)
          this.getMenuAllID(res)
        }
      }).catch(() => {
        this.loadingTree = false
      })
    },
    // 获取已有权限列表
    async obtainJurisdictionList() {
      const data = {
        appCode: this.data.appCode
      }
      await getMenuList(data, this.data.rows.id).then((res) => {
        this.defaultSelectMenuTree.data = []
        this.defaultSelectMenuTree.id = []
        if (res && res.status === 200 && res.rel) {
          res.data.map((i, index) => {
            this.defaultSelectMenuTree.id.push(i.id)
          })
          this.defaultSelectMenuTree.data = res.data
        } else { this.$message.error(res.message) }
      })
    },
    // 获取资源列表
    async obtainElementList() {
      this.loadingTable = true
      const data = {
        menuId: this.clickMenuInfo.id,
        appCode: this.data.appCode
      }
      await getElementList(data).then((res) => {
        this.loadingTable = false
        if (res && res.status === 200) {
          this.elementTotalList = res.data.rows
          this.elementPaging()
        } else { this.$message.error(res.message) }
      }).catch(() => {
        this.loadingTable = false
      })
    },
    // 获取选中的资源
    async obtainSelectElenemt() {
      const data = { appCode: this.data.appCode }
      await getJurisdictionIDList(data, this.data.rows.id).then((res) => {
        if (res && res.status === 200 && res.rel) {
          this.selectElementList = res.data
        } else { this.$message.error(res.message) }
      })
    },
    // 保存资源
    async saveResources(eleID) {
      this.loadingTable = true
      const data = {
        appCode: this.data.appCode,
        elementId: eleID,
        menuId: this.clickMenuInfo.id
      }
      await preservationResourcesList(data, this.data.rows.id).then((res) => {
        this.loadingTable = false
        if (res && res.status === 200 && res.rel) {
          this.$message.success('保存成功！')
          this.obtainSelectElenemt()
        } else { this.$message.error(res.message) }
      }).catch(() => {
        this.loadingTable = false
      })
    },
    close() {
      this.dialogDtatus = false
      setTimeout(() => { this._close() }, 300)
    }

  }
  // updated(){
  //     this.$nextTick(() => {
  //         this.manageChecked();
  //     })
  // }
}
</script>
<style lang="scss" >
@import "@/style/_handle.scss";
.dialog{
  .addedTitle6{
    @include font_color('addedTitle');
    @include border_bottom_color('addedTitle_bottomborder')
  }
  .jurisdiction-distribution::-webkit-scrollbar{
      display: none;
  }
  .jurisdiction-distribution{
      width: 80vw;
      min-width: 400px;
      min-height: 200px;
      max-height: 70vh;
      overflow-x: auto;
      margin: 30px;
  }
  .jurisdiction-distribution-body{
    // display: flex;
  }
  .jurisdiction-distribution-l{
    width: 300px;
    float: left;
    &-container::-webkit-scrollbar{
         display: none;
    }
    &-container{
        @include background('menu_container_l');
        // background: rgba(38, 54, 118, 0.5);
        // height: calc(100% - 37px);
        max-height: 60vh;
        margin-top: 20px;
        overflow-x: auto;
    }
}
.jurisdiction-distribution-r{
    // flex: 1;
    margin-left: 330px;
    &-head-btn{
      margin-left: 20px;
    }
    &-container{
      margin-top: 20px;
      &-table{
        // border: 1px solid #313c82;
        // border-radius: 4px;
      }
    }
    &-head-pagin{
      float: right;
      position: relative;
      right: -26px;
      top: -7px;
    }
  }
  .el-tree{
      background: transparent;
    }
  .btn-preservation{
      position: relative;
      top: 1px;
  }
}
</style>

