<template>
  <!--
   @file 主体视图
   @author author-name(李红波 15537053107)
 -->
  <div class="app-wrapper" :style="isfullScreen ? 'top: 0;height: 100%;' : 'top: 64px;height: calc(100vh - 64px);'">
    <!-- TODO：演示使用需注释 -->
    <sidebar v-show="!isfullScreen" class="sidebar-container Highlight" @selectKeyPath="selectKeyPath" />
    <div class="main-container" :style="isfullScreen ? 'width: 100%;margin-left:0' : ''">
      <breadcrumb v-show="!isfullScreen" id="breadcrumb-container" :bread-list="breadList" class="breadcrumb-container" />
      <app-main />
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import { AppMain, Sidebar } from './components'
import { mapGetters } from 'vuex'
// import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Breadcrumb,
    Sidebar
  },
  computed: {
    ...mapGetters(['sidebar', 'fullScreen']),
    isfullScreen() {
      return this.fullScreen
    }
  },
  data() {
    return {
      breadList: []
    }
  },
  methods: {
    selectKeyPath(arr) {
      this.breadList = arr
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/common/styles/mixin.scss";
  @import "~@/common/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    display: flex;
    padding: 20px;
    position: fixed;
    width: 100%;
    //  background: url('~@/assets/image/BG.webp') no-repeat 100% 100%;
    background: url('~@/assets/image/BG.webp');
    // background-image: url("~@/assets/image/login_bg.webp");
    background-size: 100% 100%;
    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }
  .full-screen{
    top: 0;
    height: 100%;
  }
  .no-full-screen{
    top: 64px;
    // height: 100%;
    height: calc(100vh - 64px);
  }

</style>
