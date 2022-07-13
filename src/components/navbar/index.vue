<template>
  <!--
  @file 头部导航
  @author author-name(li chenzan)
  -->
  <div class="navbar">
    <div class="left-menu">
      <div class="muyuan-logo">
        {{ appTitle }}
        <img src="@/assets/image/my-logo.png">
      </div>
      <div class="left-menu-body">
        <div v-show="arrow" class="left-menu-body-direction" @click="switchNav('left')">
          <img src="@/assets/image/nav-left.png">
        </div>
        <div ref="tabsParent" class="tabs-baody">
          <div ref="tabsChild" class="tabs">
            <div
              v-for="(item, index) in tabs"
              :key="index"
              class="tab-item"
              :class="item.path === selectPath ? 'select': 'unselect'"
              :style="{visibility: isOnlyFeedScheduling ? 'hidden' : 'auto' }"
              @click="select(item)"
            >{{ item.name }}
            </div>
          </div>
        </div>
        <div v-show="arrow" class="left-menu-body-direction" @click="switchNav('right')">
          <img src="@/assets/image/nav-right.png">
        </div>
      </div>
    </div>
    <div class="right-menu">
      <div class="new-message-icon avatar-container">
        <div class="prompt" :style="{display: isShow ? 'block' : 'none'}">版本已更新，
          <a
            :href="publishUrl"
            target="_blank"
            @click="updatePublishUr()">点击查看详情</a>
          <span
            class="closeIcon"
            @click="closePrompt()">x</span></div>
        <div class="to_right" :style="{display: isShow ? 'block' : 'none'}"/>
        <el-badge :is-dot="isDot" class="item">
          <img src="../../assets/image/new-message.svg" alt="" @click="openPrompt()">
        </el-badge>
      </div>
    </div>
    <div class="right-menu">
      <div class="avatar-container">
        <el-dropdown style="color: #fff; padding-top: 5px;">
          <span class="el-dropdown-link">
            <!-- <i class="el-icon-arrow-down el-icon-s-operation" /> -->
            <img src="../../assets/image/system.svg" alt="">
          </span>
          <el-dropdown-menu slot="dropdown" class="mainAll_bg" style="border: 0;">
            <el-dropdown-item
              :class="fontTypeData.webFontType	=== 1 ? 'systemColorActive' : ''"
              @click.native="handleCorClick(1)">深色主题
            </el-dropdown-item>
            <el-dropdown-item
              style="color: #fff !important"
              :class="fontTypeData.webFontType	=== 2 ? 'systemColorActive' : ''"
              @click.native="handleCorClick(2)">浅色主题
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="right-menu">
      <div id="navBar" class="avatar-container">
        <el-dropdown style="color: #fff;" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ username }}
            <i class="el-icon-arrow-down el-icon--right"/>
          </span>
          <el-dropdown-menu slot="dropdown" style="border: 0;">
            <el-dropdown-item command="logout" style="color: #fff;">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import { getMenuList, getFontType, updateFontType } from '@/http/api/menuInfo'
import { lStorage } from '@/common/base/storage/baseStorage'
import navList from '@/common/constants/navList'
import { getBytes } from '@/views/userManagement/common/auth/userStore'
import { storageFrontInfo } from '@/utils/overtService'
import request from '@/http/http'
import { whichStyle } from '@/utils/echartStyle' // 用于确定echarts样式
import { createNamespacedHelpers } from 'vuex'

const { mapActions } = createNamespacedHelpers('IntelligentFeed')

export default {
  name: 'Navbar',
  data() {
    return {
      publishUrl: '',
      isShow: false,
      isDot: false,
      navBarLeft: '',
      navBarright: '',
      appTitle: 'i管书',
      currentPath: null,
      arrow: false,
      widthP: null,
      widthC: null,
      themeCor: 'light',
      n: 0,
      navUnselect: `url(${require('../../assets/image/nav-unselect.png')})`,
      currentlySelect: lStorage.get('currentlySelect') ? lStorage.get('currentlySelect').name : '数据中心',
      username: getBytes() ? getBytes().partyName : '匿名',
      tabs: [
        {
          index: 1,
          name: '书籍'
        },
        {
          index: 2,
          name: '成员'
        },
        {
          index: 3,
          name: '类目'
        },
        {
          index: 4,
          name: '书架'
        }
      ],
      fontTypeData: {
        webFontType: null
      },
      isOnlyFeedScheduling: false
    }
  },
  computed: {
    selectPath() {
      const urls = this.$route.path
      let selectPath = '/dashboard'
      const currentUrl = this.tabs.find(item => {
        return urls.includes(item.path)
      })
      if (currentUrl) {
        selectPath = currentUrl.path
      }
      return selectPath
    },
    allStyles() {
      // eslint-disable-next-line no-irregular-whitespace
      return this.$store.state.echartStyle.allStyles
    }
  },
  watch: {
    'allStyles.flag'(newValue, oldValue) {
      console.log(12313, newValue, oldValue)
    },
    $route(to, from) {
      // if (this.tabs.length === 0) {
      //   return
      // }
      // const obj = collection(
      //   this.tabs,
      //   to.matched[0].path,
      //   'path'
      // )
      // if (obj && obj.name) {
      //   this.currentlySelect = obj.name
      // } else {
      //   this.$router.push({
      //     path: '/404'
      //   })
      // }
    }
  },
  created() {
    this.saveFontType()
    this.getPublishUrl()
  },
  mounted() {
    // this.getDomWidth()
    window.onresize = () => {
      this.getDomWidth()
    }
    const hashs = location.hash.split('/')
    const appCode = Array.isArray(hashs) && hashs[1]
    this.$store.dispatch('getSiderMenuDataList', { appCode })
    // this.handleCorCommand('dark')
    this.getMenuDataList()
    // this.saveFontType()

    if (process.env.VUE_APP_ONLY_PACK_APP_NAME === 'feed-scheduling') {
      this.appTitle = '牧原智能饲喂系统'
      this.isOnlyFeedScheduling = true
    }
  },
  methods: {
    ...mapActions([
      'resetIntelligentFeedVuexState'
    ]),
    saveFontType() {
      const userId = localStorage.getItem('partyId')
      this.handleCorCommand('dark')
      getFontType({ userId }).then(res => {
        if (res.status === 200) {
          this.fontTypeData = res.data
          if (res.data.webFontType === 1) {
            this.handleCorCommand('dark')
          }
          if (res.data.webFontType === 2) {
            this.handleCorCommand('light')
          }
        }
      })
    },
    getDomWidth() {
      this.widthP = this.$refs.tabsParent.offsetWidth
      this.widthC = this.$refs.tabsChild.offsetWidth
      this.arrow = this.widthC > this.widthP
      if (!this.arrow) {
        this.slide(0, 'right')
      }
    },
    switchNav(t) {
      this.getDomWidth()
      t === 'left' ? this.n-- : this.n++
      this.n = this.n < 0 ? 0 : this.n
      this.slide(this.n, t)
    },
    slide(n, t) {
      if (this.widthP && this.widthC) {
        const DOM = this.$refs.tabsChild
        if (this.widthC > this.widthP) {
          const cha_w = this.widthC - this.widthP
          const half_w = this.widthP * 0.5
          let number = 0
          if (cha_w >= half_w) {
            const n_c = Math.floor(cha_w / half_w)
            number = (n > n_c) ? -cha_w : -(half_w * n)
            this.n = (n > n_c) ? n_c + 1 : this.n
          } else {
            number = t === 'right' ? -cha_w : 0
          }
          DOM.style.left = number + 'px'
        } else {
          DOM.style.left = n + 'px'
        }
      }
    },
    // 获取菜单
    getMenuDataList() {
      const data = {
        frontAppCode: 'iot'
      }
      getMenuList(data).then(res => {
        if (res) {
          this.navDom(res)
        } else {
          const r = sessionStorage.getItem('navMenu')
          this.navDom(JSON.parse(r))
        }
      }).catch(() => {
        console.log('导航菜单加载失败！')
        // this.$message.error('导航菜单加载失败！')
      })
    },
    navDom(res) {
      this.tabs = []
      for (const j of res) {
        if (j.appCode && j.title && j.frontendRoutePath) {
          this.tabs.push({
            appCode: j.appCode,
            name: j.title,
            path: j.frontendRoutePath
          })
        }
      }
      if (process.env.VUE_APP_ONLY_PACK_APP_NAME === 'feed-scheduling') {
        // 手动设置权限
        this.tabs = this.tabs.filter(item => navList[item.appCode])
      }
      setTimeout(() => {
        this.getDomWidth()
      }, 1000)
    },
    select(item) {
      this.cancel()
      this.currentPath = item
      sessionStorage.setItem('keyPath', JSON.stringify([]))
      if (item.appCode) {
        storageFrontInfo(item.appCode).then((ress) => {
          this.currentlySelect = item.name
          this.$router.push({ path: item.path })
          this.$store.dispatch('setCurrentlySelect', item)
          setTimeout(() => {
            this.$store.dispatch('getSiderMenuDataList', item)
          }, 200)
          storageFrontInfo('all')
        })
      } else {
        this.currentlySelect = item.name
        this.$router.push({ path: item.path })
        this.$store.dispatch('setCurrentlySelect', item)
      }
    },
    // 换主题
    handleCorClick(num) {
      const { userId, id } = this.fontTypeData
      const params = {
        webFontType: num,
        userId,
        id
      }
      updateFontType(params).then(res => {
        if (res.status === 200) {
          this.fontTypeData = res.data
          if (res.data.webFontType === 1) {
            this.handleCorCommand('dark')
          }
          if (res.data.webFontType === 2) {
            this.handleCorCommand('light')
          }
        }
      })
    },
    handleCorCommand(type) {
      this.themeCor = type
      const echartSty = whichStyle(type)
      this.$store.commit('changeStyle', echartSty)
      this.$store.commit('carOperation/changeGdTheme', type)
      window.document.documentElement.setAttribute('data-theme', type)
      // location.reload()
    },
    handleCommand(command) {
      if (command === 'logout') {
        request('logout', {})
        this.$router.push({ path: '/login' })
        this.resetIntelligentFeedVuexState()
        localStorage.clear()
        sessionStorage.clear()
      } else {
        this.$router.push({ path: command })
      }
    },
    // 更新内容弹窗
    getPublishUrl() {
      this.$httpRequest({
        type: 'get',
        uri: '/admin/user/front/publish/getPublishUrl',
        payload: {
          userId: localStorage.getItem('partyId')
        },
        callback: res => {
          if (res && res.status === 200) {
            if (res.data) {
              this.isShow = true
              this.isDot = true
              this.publishUrl = res.data.publishUrl
            } else {
              this.isShow = false
              this.isDot = false
            }
          }
        }
      })
    },
    // 更改更新内容弹窗状态
    updatePublishUr() {
      this.$httpRequest({
        type: 'get',
        uri: '/admin/user/front/publish/updatePublishUrl',
        payload: {
          userId: localStorage.getItem('partyId')
        },
        callback: res => {
          if (res && res.status === 200) {
            this.isShow = false
            this.isDot = false
          }
        }
      })
    },
    // 关闭更新内容弹框
    closePrompt() {
      this.isShow = false
    },
    // 显示更新内容弹框
    openPrompt() {
      if (this.isDot) {
        this.isShow = true
      } else {
        return
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "@/style/_handle.scss";

  #navBar {
    .el-icon-arrow-down::before, .el-icon-arrow-up::before {
      // color: rgb(255, 255, 255)!important;
      @include font_color('navArrowColor');
    }
  }

  .class001 {
    @include background_color("mainBackgroundColor");
    @include background_image("mainBackgroundImage");
    @include border_color("mainBorderColor");
  }

  .navbar {
    @extend .class001;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    padding: 0 20px;
    width: 100%;
    box-sizing: border-box;
    height: 64px;
    overflow: hidden;
    box-shadow: 0 2px 15px 0 #00133f;
    @include box_shadow("mainshadowColor");
    @include background_color("mainBackgroundColor");
    @include background_image("mainBackgroundImage");
    // background-color: $header_bg_cor;
    // border-bottom: 1px solid;
    z-index: 999;
    position: relative;

    .left-menu {
      display: flex;
      align-items: center;
      width: calc(100% - 150px);

      &-body {
        width: calc(100% - 376px);
        display: flex;
        align-items: center;

        &-direction {
          display: flex;
          align-items: center;
          cursor: pointer;

          img {
            height: 34px;
          }

          &:first-child {
            margin-right: 15px;
          }

          &:last-child {
            margin-left: 20px;
          }
        }
      }

      .muyuan-logo {
        width: 300px;
        height: 64px;
        line-height: 64px;
        margin-right: 40px;
        font-size: 26px;
        // color: #ffffff;
        @include font_color("navBarFontColor");
        position: relative;
        font-weight: 600;

        img {
          position: absolute;
          top: 0px;
          right: -10px;
          height: 64px;
          z-index: -1;
        }
      }

      .tabs-baody {
        flex: 1;
        overflow: hidden;
        height: 64px;
        position: relative;
        // display: flex;
        // align-items: center;
      }

      .tabs {
        position: absolute;
        left: 0;
        display: flex;
        align-items: center;
        transition: all .3s;

        div {
          background-size: 130px 41px !important;
        }
      }

      .tab-item {
        width: 130px;
        min-width: 130px;
        margin-right: 30px;
        // padding: 10px;
        height: 64px;
        line-height: 64px;
        cursor: pointer;
        // color: #cdd8f7;
        @include font_color("mainFontColor1");
        text-align: center;
      }

      .tab-item:hover {
        @include font_color("navBarActiveFontColor");
        // background: url("~@/assets/image/nav-select.png") no-repeat;
        @include background("navBarActiveBlockBackground");
        // @include background_image("navBarActiveBlockBackground");
      }

      .unselect {
        // background: url("~@/assets/image/nav-unselect.png") no-repeat;
        @include background("navBarBlockBackground");
        // @include background_image("navBarBlockBackground");
      }

      .select {
        font-weight: 600;
        @include font_color("navBarActiveFontColor");
        // background: url("~@/assets/image/nav-select.png") no-repeat;
        @include background("navBarActiveBlockBackground");
      }
    }

    .right-menu {
      display: flex;

      .message-ico {
        fill: #ffffff;
      }

      .new-message-icon {
        height: 27px;

        .item {
          top: 5px;
        }

        .prompt {
          text-align: center;
          box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.20);
          border-radius: 2px;
          height: 30px;
          width: 192px;
          position: absolute;
          right: 163px;
          font-size: 12px;
          @include font_color("navBarFontColor1");
          @include background("navBarBackgroundColor");
          font-family: SourceHanSansCN, SourceHanSansCN-Normal;
          font-weight: Normal;
          line-height: 30px;

          a {
            @include font_color("navBarFontColor2");
            @include border_bottom("navBarBorderColor1");
          }

          .closeIcon {
            position: absolute;
            top: -10px;
            right: 5px;
            cursor: pointer;
          }
        }

        .to_right {
          position: absolute;
          top: 27px;
          right: 156px;
          width: 0;
          height: 0;
          @include border_bottom("navBarBorderColor");
          border-top: 7px solid transparent;
          border-bottom: 7px solid transparent;
        }
      }

      .avatar-container {
        font-size: 12px;
        @include font_color("mainFontColor2");
        letter-spacing: 0;
        margin-left: 10px;

        .avatar-wrapper {
          margin-top: 5px;
          position: relative;

          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }

          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }

    .el-dropdown-link {
      cursor: pointer;
    }
  }

  .navbar .left-menu .tab-item {
    @include background_position("navBarBackgroundPosition");
    @include background_size("navBarBackgroundSize");
    border-radius: 2px;

    &:hover {
      @include background_position("navBarBackgroundPosition");
      @include background_size("navBarBackgroundSize");
    }
  }
</style>
