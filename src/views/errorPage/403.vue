<template>
  <div class="error">
    <div class="view">
      <img src="../../assets/image/page/403.png" alt="" style="max-width: 600px;">
      <div class="option">
        <span class="login-btn-view " @click="goLogin">返回登录</span>
      </div>
    </div>

  </div>
</template>

<script>
// 前往登录 返回上一页
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
      token: getToken()
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
      color:#cdd8f7;
      display: flex;
      justify-content: center;
    }
   .option{
      display: flex;
      justify-content: center;
   }
  .error{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    //     display: flex;
    // padding: 20px;
    // position: fixed;
    width: 100%;
    background: url(/img/BG.a5577387.webp);
    background-size: 100% 100%
  }
  .login-btn-view{
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
    -webkit-background-clip: text;/*按字体裁剪*/
    -webkit-text-fill-color: transparent;/*设置字体透明*/
    transition: opacity .5s;
  }
</style>
