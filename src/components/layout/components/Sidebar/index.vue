<template>
  <div class="menuSidebar">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :default-openeds="openList"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
        is-popup
        @select="handleSelect"
      >
        <sidebar-item
          v-for="route in routes"
          :key="route.id"
          :item="route"
          :base-path="route.frontendRoutePath"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import SidebarItem from './SidebarItem'
import variables from '@/common/styles/variables.scss'
import menuList from '@/http/api/plibrary/menuList'

export default {
  components: {
    SidebarItem
  },
  data() {
    return {
      openList: [],
      appMenuList: menuList.children
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'fullScreen']),
    ...mapState({
      routes: state => {
        return menuList.children
      }
    }),
    routes() {
      console.log('sss', menuList.children)
      return menuList.children
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    },
    appCode() {
      const hashs = location.hash.split('/')
      const appCode = Array.isArray(hashs) && hashs[1]
      return appCode
    }
  },
  methods: {
    tree(trees, name) {
      let level = 0
      const retNode = trees

      function deepSearch(trees, name) {
        level += 1
        for (var i = 0; i < trees.length; i++) {
          if (trees[i].children && trees[i].children.length > 0) {
            trees[i]['level'] = level
            deepSearch(trees[i].children, name)
          }
        }
      }

      deepSearch(trees, name)
      retNode != null ? retNode.data : null
      return retNode
    },
    // 让 router 与 menu 分离
    handleSelect(key, keyPath) {
      sessionStorage.setItem('keyPath', JSON.stringify(keyPath))
      this.openList = keyPath
      this.$emit('selectKeyPath', keyPath)
    }
  }
}
</script>
<style lang="scss">
  .menuSidebar {
    .el-icon-arrow-down:before {
      color: #CDD8F7;
      font-weight: 600;
      font-size: 14px;
    }

    .el-menu-item, .el-submenu__title {
      overflow: hidden; //超出部分隐藏
      white-space: nowrap; //文本不换行
      text-overflow: ellipsis; // 不完全显示的末尾加上省略号
    }
  }
</style>
