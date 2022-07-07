<template>
  <div id="app">
    <navbar v-if="navbarShow" />
    <router-view />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import whiteList from '@/common/constants/whiteList'
import { mapGetters } from 'vuex'
export default {
  name: 'App',
  components: {
    Navbar
  },
  data() {
    return {
      navbarShow: true
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'fullScreen']),
    isfullScreen() {
      return this.fullScreen
    }
  },
  watch: {
    $route(to, from) {
      if (whiteList.indexOf(to.path) === -1) {
        this.navbarShow = true
      } else {
        this.navbarShow = true
      }
    }
  },
  created() {
  },
  methods: {
    getQueryString(name) {
      const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
      const r = window.location.search.substr(1).match(reg)
      if (r != null) return unescape(r[2])
      return null
    }
  }
}
</script>
<style lang="scss">
@import './common/fonts/acens.css';
@import "@/style/common.scss";
body {
  //background-color: #13346e;
}
#app {
  /* display: flex;
  justify-content: center;
  align-items: center;
  font-size: 80px; */
  padding: 0;
  width: 100%;
  height: 100vh;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  font-size: 16px;
  /* margin-top: 60px; */
}
.header-svg {
  width: 100px;
  height: 100px;
}
.plate-view {
  display: flex;
  position: fixed;
  top: 64px;
  height: calc(100vh - 64px);
  width: 100%;
}
/* .border{
  width: 500px;
  height: 500px;
  border: 1px solid #6985FB;
box-shadow: inset 0 0 20px 0 #396DFF;
border-radius: 20px 10px 10px 10px;
background-image: linear-gradient(90deg, #00E6FF 3%, rgba(3,40,98,0.00) 100%);
} */
.element-tree
  .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content,
.element-tree .el-tree-node__content:hover,
.element-tree .el-tree-node:focus > .el-tree-node__content:hover {
  background-color: #3e59a2 !important;
}
.element-tree .el-tree-node:focus > .el-tree-node__content{
  background: rgba(0,0,0,0) !important;
}
.el-picker-panel__icon-btn {
  font-size: 16px;
}
.el-date-table {
  font-size: 16px;
}
.el-popper[x-placement^=bottom] .popper__arrow::after {
  top: 0;
}
.el-date-range-picker__time-header,
.el-date-table th {
  border-bottom-color: #1a3165;
}
.el-picker-panel__footer {
  border-top-color: #1a3165;
}
</style>
