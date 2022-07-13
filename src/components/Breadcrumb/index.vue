<template>
  <!--
   @file 面包屑组件
   @author author-name(li chenzan)
  -->
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="index">
        <!-- @click.native="breadcrumbClick(item)" -->
        <span
          v-if="item.redirect==='noRedirect'||index==levelList.length-1"
          class="no-redirect"
        >{{ item.title }}</span>
        <a v-else>{{ item.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import pathToRegexp from 'path-to-regexp'
import { mapState } from 'vuex'

export default {
  props: {
    breadList: {
      type: Array,
      default: new Array(0)
    }
  },
  data() {
    return {
      levelList: [
        {
          title: '馆藏'
        },
        {
          title: '成员'
        },
        {
          title: '类目'
        }, {
          title: '书架'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      routes: state => {
        return state.app.siderMenuList
      }
    })
  },
  watch: {
    breadList(vals) {
      this.getBreadList(vals)
    },
    routes() {
      // setTimeout(() => {
      //   const breadList = JSON.parse(sessionStorage.getItem('keyPath'))
      //   if (breadList && breadList.length) {
      //     this.getBreadList(breadList)
      //   }
      // }, 1500)
    },
    $route(route) {
      this.levelList = []
      const breadList = JSON.parse(sessionStorage.getItem('keyPath'))
      if (breadList && breadList.length) {
        this.getBreadList(breadList)
      }
      // if you go to the redirect page, do not update the breadcrumbs
      // if (route.path.startsWith('/redirect/')) {
      //   return
      // }
      // this.getBreadcrumb()
    }
  },
  mounted() {
    const vals = JSON.parse(sessionStorage.getItem('breadcrumb'))
    this.levelList = vals
  },
  methods: {
    getBreadList(list) {
      if (this.routes.length) {
        let routes = this.routes
        this.levelList = []
        for (let index = 0; index < list.length; index++) {
          const element = list[index]
          const route = routes.find(r => {
            return r.frontendRoutePath === element
          })
          this.levelList.push(route)
          if (route && route.children) {
            routes = route.children
          }
        }
      } else {
        this.levelList = []
      }
      if (this.levelList.length > 0) {
        sessionStorage.setItem('breadcrumb', JSON.stringify(this.levelList))
      }
    },
    getBreadcrumb() {
      // only show routes with meta.title
      const matched = this.$route.matched.filter((item) => item.meta && item.meta.title)
      // const F = matched[0]

      // if (!this.isDashboard(first)) {
      //   matched = [{ path: '/dashboard', meta: { title: 'Dashboard' }}].concat(matched)
      // }
      this.levelList = matched.filter((item) => item.meta && item.meta.title && item.meta.breadcrumb !== false)
    },
    // breadcrumbClick(item) {
    //   if (item.meta && item.meta.title === '场区告警自检') {
    //     this.$router.push({
    //       path: item.path
    //     })
    //   }
    // },
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return (name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase())
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    handleLink(item) {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(this.pathCompile(path))
    }
  }
}
</script>
