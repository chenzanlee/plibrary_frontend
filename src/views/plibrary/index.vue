<template>
  <div class="content-page">
    <div class="my-manage-libraries">
      <div>我管理的书馆</div>
      <div ref="tabsParent" class="libraries-body">
        <div ref="tabsChild" class="libraries">
          <router-link
            :to="{name:'library_home_page',params:{'libraryId':library.libraryId}}"
            v-for="(library, index) in libraries"
            :key="index"
            class="library-item"
            :class="library.libraryId === selectLibraryId ? 'select': 'unselect'">{{ library.name }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { getToken } from '@/views/userManagement/common/auth/authStore'
import { clearTimeout } from 'timers'
import { mapGetters } from 'vuex'

let timerOut = null
export default {
  beforeRouteLeave(to, from, next) {
    this.closeTimer()
    next()
  },
  data() {
    return {
      seconds: 300,
      token: getToken(),
      libraries: [{
        libraryId: 1,
        name: '1号书馆'
      }, {
        libraryId: 2,
        name: '2号书馆'
      }],
      selectLibraryId: ''
    }
  },
  mounted() {
    if (!this.isfullScreen) {
      this.$store.dispatch('checkFullScreen')
    }
    // this.startTimer()
  },
  destroyed() {
    if (this.isfullScreen) {
      this.$store.dispatch('checkFullScreen')
    }
    // this.closeTimer()
  },
  computed: {
    ...mapGetters(['fullScreen']),
    isfullScreen() {
      return this.fullScreen
    }
  },
  methods: {
    startTimer() {
      const timer = () => {
        timerOut = setTimeout(() => {
          if (this.seconds > 0) {
            this.seconds--
            if (timerOut) {
              timer()
            }
          } else {
            timerOut = null
            clearTimeout(timerOut)
            this.$router.push({
              path: '/dashboard/operationsMap'
            })
          }
        }, 1000)
      }
      timer()
    },
    closeTimer() {
      timerOut = null
      clearTimeout(timerOut)
    },
    goLogin() {
      this.$router.push({ path: '/login' })
    },
    select(library) {
      this.selectLibraryId = library.libraryId
      // this.$router.push({ path: '/library_home_page/' + this.selectLibraryId })
      this.$router.push({ path: '/library_home_page/library_transfer_records' })
    },
    goBack() {
      this.closeTimer()
      window.history.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
  .to-box {
    margin-top: 10px;
    color: #cdd8f7;
    display: flex;
    justify-content: center;
  }

  .option {
    display: flex;
    justify-content: center;
  }

  .content-page {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    background-size: 100% 100%;
    padding: 16px 16px;
  }

  .my-manage-libraries {
    width: 100%;
    height: 100%;
  }

  .libraries-body {

  }

  .libraries {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-items: center;
  }

  .library-item {
    padding: 16px 16px;
    cursor: pointer;
  }

  .select {
    color: red;
  }

  .login-btn-view {
    display: inline-block;
    cursor: pointer;
    height: 36px;
    line-height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
    width: 20%;
    color: #FFFFFF;
    border: solid 1px #3f80b9;
    border-radius: 2px;
    background-color: transparent;
    background-image: linear-gradient(to right bottom, #3965FF, #2390F3);
    -webkit-background-clip: text; /*按字体裁剪*/
    -webkit-text-fill-color: transparent; /*设置字体透明*/
    transition: opacity .5s;
  }
</style>
