<template>
  <div ref="login" v-loading="loadingReset" class="login">
    <div class="login-body">
      <video oncontextmenu="return false;" class="login-video" muted autoplay loop>
        <source src="@/assets/video/loginVideo.mp4" type="video/mp4">
        您的浏览器不支持 HTML5 video 标签。
      </video>
      <div class="login-r">
        <div class="login-main" :class="landingType === 'modifyKey' ? 'login-main2' : ''">
          <div class="login-title">
            <img src="@/assets/image/appname.png" alt="i管书">
          </div>
          <div :class="landingType === 'account' ? '' : 'login-main2'">
            <div class="login-row">
              <div class="login-row-tips">用户名</div>
              <input
                v-model="loginForm.username"
                class="login-row-put1"
                type="text"
                @input="verificationLogin('username')">
              <span v-show="loginForm.usernameS" class="login-row-errtip">请输入用户名</span>
            </div>
            <div class="login-row login-row2">
              <div class="login-row-tips">密码</div>
              <input
                v-model="loginForm.password"
                class="login-row-put1"
                type="password"
                @input="verificationLogin('password')">
              <span v-show="loginForm.passwordS" class="login-row-errtip">
                {{ loginForm.password.length > 0 ? '密码最少六位' : '请输入密码' }}
              </span>
            </div>
            <div class="login-foot">
              <div
                v-show="imgCheckFlag === 2"
                class="login-btn login-btn2 login-btn-bot imgFlagFail"
                @click="checkLogin"><img class="shield-img" src="@/assets/image/shieldFail.svg">{{ msg }}
              </div>
              <div
                v-show="!imgCheckFlag && msg !== '验证失败'"
                class="login-btn login-btn2 login-btn-bot"
                :class="imgCheckFlag === 2 ? 'imgFlagFail' : ''"
                @click="checkLogin">
                <img
                  class="shield-img"
                  src="@/assets/image/shield.svg">{{
                msg }}
              </div>
              <div
                v-show="!imgCheckFlag && msg === '验证失败'"
                class="login-btn login-btn2 login-btn-bot imgFlagFail"
                @click="checkLogin"><img class="shield-img" src="@/assets/image/shieldFail.svg">{{ msg }}
              </div>
              <div v-show="imgCheckFlag && imgCheckFlag !== 2" class="login-btn login-btn2 login-btn-bot imgFlagSucc">
                <img class="shield-img" src="@/assets/image/shieldSucc.svg">{{ msg }}
              </div>

              <div
                v-show="loginBtnS && imgCheckFlag === true"
                class="login-btn login-btn1"
                @click="handleLogin()">
                <i
                  v-show="loadingState"
                  class="el-icon-loading"/>{{ loginBtnText }}
              </div>
              <div
                v-show="!loginBtnS || imgCheckFlag !== true"
                class="login-btn login-btn1 login-btn-disable">{{
                loginBtnText }}
              </div>
            </div>
            <div class="login-title2">
              <div class="login-txtBtn" @click="switchType('wechart')">
                <img
                  src="@/assets/image/wetherIcon.svg"
                  class="img-con">企业微信登录
              </div>
              <div class="login-txtBtn" @click="switchType('modifyKey')">忘记密码</div>
            </div>
          </div>
        </div>
        <!--  -->
        <div class="login-wechart" :class="landingType === 'wechart' ? 'login-wechart2' : ''">
          <div class="login-title login-wechart-title">
            <!-- i管书 -->
            <img style="opacity:0;" src="@/assets/image/appname.png" alt="i管书">
          </div>
          <div class="login-wechart-body">
            <div id="qrcode_element" ref="wechartBody" class="login-wechart-img"/>
          </div>
          <div class="login-foot2">
            <div class="login-btns login-btn2" @click="switchType('account')">密码登录</div>
          </div>
        </div>
        <!--  -->
        <div
          v-if="landingTypeStatus === 'modifyKey'"
          class="login-reset"
          :class="landingType === 'modifyKey' ? 'login-reset2' : ''">
          <div class="login-title login-reset-title">
            <!-- i管书 -->
            <img src="@/assets/image/appname.png" alt="i管书">
          </div>
          <div class="login-row login-reset-row">
            <div class="login-row-tips login-row-tips2">工号</div>
            <input
              v-model="jobNumber"
              class="login-row-put1 login-row-put2"
              type="text"
              @keyup="entryPut('job')"
            >
            <p
              class="login-txtBtn2 login-row-txt"
              @click="queryAccount('job')">查询账户</p>
          </div>
          <div class="login-row login-reset-row">
            <div class="login-row-tips login-row-tips2">账户列表</div>
            <input
              v-model="accoundName"
              class="login-row-put1 login-row-put2"
              readonly="readonly"
              style="cursor:auto"
              type="text"
              @focus="entryPut('accountFocus')"
              @blur="entryPut('accountBlur')">
            <i class="iconfont login-row-icon" :class="accoundStatus ? 'iconfont login-row-icon2' : ''">&#xe632;</i>
            <div v-show="accoundStatus" class="login-reset-accList">
              <div v-show="accoundList.length === 0" class="login-reset-accList-nodata">暂无数据</div>
              <div v-show="accoundList.length > 0">
                <div
                  v-for="(i, index) in accoundList"
                  :key="index"
                  class="login-reset-accList-li"
                  @click="selectAccount(i)">{{ i.username }}
                </div>
              </div>
            </div>
          </div>
          <div class="login-row login-reset-row">
            <div class="login-row-tips login-row-tips2">验证码</div>
            <input
              v-model="VerificationCode"
              class="login-row-put1 login-row-put2"
              type="text"
              @keyup="entryPut('code')"
            >
            <p v-show="VerificationCodeS" class="login-txtBtn2 login-row-txt" @click="verificationCode">获取验证码</p>
            <p v-show="!VerificationCodeS" class="login-row-txt login-row-txt2">{{ VerificationCodeNumber }}s</p>
          </div>
          <div class="login-row login-reset-row">
            <div class="login-row-tips login-row-tips2">新密码</div>
            <input
              v-model="newPassword"
              placeholder="至少8位密码，区分大小写"
              class="login-row-put1 login-row-put2"
              type="password"
              @keyup="entryPut('newpassword')"
            >
            <span v-show="newPasswordS" class="login-row-errtip2">新密码最少8位</span>
          </div>
          <div class="login-row login-reset-row">
            <div class="login-row-tips login-row-tips2">确认密码</div>
            <input
              v-model="nextPassword"
              placeholder="确认密码"
              class="login-row-put1 login-row-put2"
              type="password"
              @keyup="entryPut('nextpassword')"
            >
            <span v-show="nextPasswordS" class="login-row-errtip2">两次密码不一致</span>
          </div>
          <div class="login-foot3 login-reset-foot">
            <div v-show="submitStatus" class="login-btn login-btn1 login-foot3-btn" @click="submitFrom">确认修改</div>
            <button v-show="!submitStatus" class="login-btn login-btn1-disable">确认修改</button>
            <div class="login-btn login-btn2" @click="switchType('account')">返回登录</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 二维码登录选择 -->
    <div v-show="wechartUserStatus" class="account-qrcode">
      <div class="account-qrcode-body Highlight">
        <p class="account-qrcode-body-title">选择账号
          <i
            class="iconfont account-qrcode-body-title-close"
            @click="colseWechart()">&#xe61a;</i></p>
        <div class="account-qrcode-body-main">
          <div
            v-for="(i, index) in wechartUseList"
            :key="index"
            class="account-qrcode-body-main-col"
            :class="userInfo && (userInfo.id === i.id) ? 'account-qrcode-body-main-col2' : ''"
            @click="loginOwner(i)"
          >{{ i.username }}
          </div>
        </div>
        <div class="account-qrcode-body-foot">
          <button class="btn-border buttons account-qrcode-body-foot-btn" @click="colseWechart()">取消</button>
          <button class="btn-blue buttons account-qrcode-body-foot-btn" @click="setLocalInfo(null)">确定</button>
        </div>
      </div>
      <div class="account-qrcode-foil"/>
    </div>

    <!-- 手机二维码 -->
    <div class="account-iphone">
      <div class="account-iphone-qrcode"><img :src="iphoneQrcode"></div>
      <div class="account-iphone-body" title="暂未开放" @click="goTo()">
        <!-- <img src="@/assets/image/iphone.svg"> -->
        应用下载
      </div>
    </div>

    <!-- 图片验证 -->
    <div v-if="isImgCheck" class="img-mask">
      <div class="img-r">
        <div class="img-r-1">
          <div class="img-check">
            <div class="icon-contain" @click="doColse">
              <div class="error"/>
            </div>
            <SlideVerify
              :l="42"
              :r="8"
              :h="240"
              :w="380"
              :accuracy="3"
              :imgs="imgs"
              slider-text="向右滑动"
              class="check-contain"
              @success="onSuccess"
              @fail="onFail"
              @refresh="onRefresh"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import img0 from './img.jpg'
import img1 from './img1.jpg'
import img2 from './img2.jpg'
import img3 from './img3.jpg'
import img4 from './img4.jpg'
import img5 from './img5.jpg'
// import { getMenuList } from '@/http/api/menuInfo'
import menuList from '@/http/api/mock'
import { mapGetters } from 'vuex'
// import navList from '@/common/constants/navList'

import {
  queryAccountJon,
  queryAccountPhone,
  getVerificationCode,
  getVerificationCodePhone,
  setResetPassword,
  getWechart,
  buildWxLoginInfo
} from '@/http/api/signIn/loginIn'
import { storageFrontInfo } from '@/utils/overtService'
import jwtDecode from 'jwt-decode'

export default {
  components: {},
  data() {
    return {
      isOnlyFeedScheduling: false,
      imgs: [ // 图片验证的图片数组
        img0,
        img1,
        img2,
        img3,
        img4,
        img5
      ],
      h: '100%',
      w: '100',
      msg: '点击进行登录验证', // 验证显示文字
      isImgCheck: false, // 图片验证是否显示
      imgCheckFlag: false, // 图片验证是否通过
      defaWidth: 1920,
      defaSize: 20,
      menuList: menuList,
      loginForm: {
        username: '',
        usernameS: false,
        password: '',
        passwordS: false
      },
      loginBtnText: '登录',
      redirect: undefined,
      landingType: 'account', // 登陆类型
      landingTypeStatus: '',
      loadingState: false, // 登陆状态
      loginBtnS: false,
      // 重置
      resetType: 'job',
      jobNumber: '',
      phoneNumber: '',
      accoundName: '',
      accoundList: [],
      accoundStatus: false,
      VerificationCode: '',
      VerificationCodeS: true,
      VerificationCodeNumber: 59,
      VerificationSetInter: null,
      newPassword: '',
      newPasswordS: false,
      nextPassword: '',
      nextPasswordS: false,
      submitStatus: false,
      //
      wechartUseList: [],
      wechartUserStatus: false,
      userInfo: null,
      loadingReset: false,
      loadingRQcode: true,
      iphoneQrcode: require('@/assets/image/qrcode-onTrial.png')
    }
  },
  watch: {
    $route: {
      handler(route) {
        this.landingType = 'account'
        if (route.path !== '/login') {
          this.landingType = null
        }
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    const code = this.getQueryString('code')
    if (code) {
      this.codeLogin(code)
    }
    localStorage.clear()
    sessionStorage.clear()
    this.setUrl()
    if (process.env.NODE_ENV === 'production') {
      this.iphoneQrcode = require('@/assets/image/qrcode-formal.png')
    } else {
      this.iphoneQrcode = require('@/assets/image/qrcode-onTrial.png')
    }
  },
  computed: {
    ...mapGetters(['fullScreen']),
    isfullScreen() {
      return this.fullScreen
    }
  },
  mounted() {
    this.init()
    document.onkeydown = (e) => {
      if (this.landingType === 'account') {
        if (e.keyCode === 13) {
          if (this.loginBtnS && this.imgCheckFlag && this.imgCheckFlag !== 2) {
            this.handleLogin()
          } else {
            if (!this.loginBtnS) {
              this.$message.error('账号/密码格式错误')
            } else if (!this.imgCheckFlag && this.imgCheckFlag !== 2) {
              this.imgCheckFlag = 2
            }
          }
        }
      }
    }
    window.onresize = () => {
      this.fontResize()
    }
  },
  beforeRouteLeave(to, form, next) {
    document.onkeydown = null
    window.onresize = null
    next()
  },
  methods: {
    goTo() {
      // if (process.env.NODE_ENV === 'production') {
      //   // 正式
      //   window.open('http://cloud.imuyuan.com/#/download')
      // } else {
      //   window.open('http://cloud-test.imuyuan.com/#/download')
      // }
    },
    checkLogin() { // 新验证逻辑
      if (!this.loginForm.username || !this.loginForm.password || this.loginForm.passwordS) {
        this.$message({
          message: '请输入账户/密码',
          type: 'error'
        })
        return false
      }
      this.isImgCheck = true
    },
    onSuccess(times) { // 验证成功
      this.msg = `验证成功`
      this.imgCheckFlag = true
      // this.loginBtnS = true
      this.isImgCheck = false
    },
    onFail() { // 验证失败
      this.imgCheckFlag = false
      // this.loginBtnS = false
      this.msg = '验证失败'
    },
    onRefresh() { // 刷新
      this.imgCheckFlag = false
      // this.loginBtnS = false
      this.msg = '验证失败'
    },
    doColse() { // 关闭
      // this.onRefresh()
      this.isImgCheck = false
    },
    init() {
      this.fontResize()
    },
    fontResize() {
      const winWidth = document.body.clientWidth
      const size = 20 * (winWidth / this.defaWidth)
      size < 12 ? this.defaSize = 12 : this.defaSize = size
      this.$refs.login.style.fontSize = this.defaSize + 'px'
    },
    setUrl() {
      const url = window.location.href
      const n_before = url.indexOf('?')
      const n_after = url.indexOf('#')
      const new_url = url.substring(0, n_before) + url.substring(n_after, url.length)
      history.replaceState(null, null, new_url)
    },
    getQueryString(name) {
      const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
      const r = window.location.search.substr(1).match(reg)
      if (r != null) return unescape(r[2])
      return null
    },
    // 登录表单验证
    verificationLogin(type) {
      if (type === 'username') {
        !this.loginForm.username ? this.loginForm.usernameS = true : this.loginForm.usernameS = false
      }
      if (type === 'password') {
        this.loginForm.password.length < 6 ? this.loginForm.passwordS = true : this.loginForm.passwordS = false
      }

      // 验证登录按钮状态
      (this.loginForm.username && this.loginForm.password && !this.loginForm.passwordS) ? this.loginBtnS = true : this.loginBtnS = false
    },
    switchType(type) {
      if (type === 'modifyKey') {
        setTimeout(() => {
          this.landingType = type
        }, 10)
        this.landingTypeStatus = type
        // this.onRefresh()
        this.imgCheckFlag = false
        this.msg = '点击进行登录验证'
      } else {
        this.landingType = type
        setTimeout(() => {
          this.landingTypeStatus = type
        }, 300)
      }
      clearInterval(this.VerificationSetInter)

      this.loginForm.username = ''
      this.loginForm.usernameS = false
      this.loginForm.password = ''
      this.loginForm.passwordS = false
      this.loadingState = false
      this.loginBtnS = false
      // 重置
      this.resetType = 'job'
      this.jobNumber = ''
      this.phoneNumber = ''
      this.accoundName = ''
      this.accoundList = []
      this.accoundStatus = false
      this.VerificationCode = ''
      this.VerificationCodeS = true
      this.newPassword = ''
      this.newPasswordS = false
      this.nextPassword = ''
      this.nextPasswordS = false

      if (type === 'wechart') {
        this.loadingRQcode = false
        this.$refs.wechartBody.innerHTML = ''
        this.imgCheckFlag = false
        this.msg = '点击进行登录验证'
        this.buildWechatState()
      }
    },
    selectAccount(i) {
      this.accoundName = i.username
      this.verificationSubStatus()
    },
    // 重置表单验证
    entryPut(type) {
      if (type === 'job') {
        this
      } else if (type === 'job') {
        this
      } else if (type === 'phone') {
        this
      } else if (type === 'code') {
        this
      } else if (type === 'newpassword') {
        this.newPassword.length < 8 ? this.newPasswordS = true : this.newPasswordS = false
        if (this.nextPassword) {
          this.nextPassword !== this.newPassword ? this.nextPasswordS = true : this.nextPasswordS = false
        }
      } else if (type === 'nextpassword') {
        this.nextPassword !== this.newPassword ? this.nextPasswordS = true : this.nextPasswordS = false
      } else if (type === 'accountFocus') {
        setTimeout(() => {
          this.accoundStatus = true
        }, 200)
      } else if (type === 'accountBlur') {
        setTimeout(() => {
          this.accoundStatus = false
        }, 200)
      }
      this.verificationSubStatus()
    },
    verificationSubStatus() {
      const number = this.resetType === 'job' ? this.jobNumber : this.phoneNumber
      if (number && this.accoundName && this.VerificationCode && this.newPassword && !this.newPasswordS && this.nextPassword && !this.nextPasswordS) {
        this.submitStatus = true
      } else {
        this.submitStatus = false
      }
    },
    resetSwitch(type) {
      this.resetType = type
      this.jobNumber = ''
      this.phoneNumber = ''
      this.accoundName = ''
      this.accoundList = []
      this.accoundStatus = false
      this.VerificationCode = ''
      this.newPassword = ''
      this.newPasswordS = false
      this.nextPassword = ''
      this.nextPasswordS = false
    },
    // 验证码倒计时
    countDown() {
      clearInterval(this.VerificationSetInter)
      this.VerificationCodeS = false
      this.VerificationCodeNumber = 59
      this.VerificationSetInter = setInterval(() => {
        this.VerificationCodeNumber--
        if (this.VerificationCodeNumber <= 0) {
          clearInterval(this.VerificationSetInter)
          this.VerificationCodeS = true
        }
      }, 1000)
    },
    // 登录
    handleLogin() {
      this.loadingState = true
      this.$store.commit('changeStyle', 'dark')
      this.$store
        .dispatch('LoginByUsername', this.loginForm)
        .then((res) => {
          this.getPermission()
          console.log('登陆成功')
          // const arr = [{
          //   appCode: 'unit-evc',
          //   title: '环控',
          //   frontendRoutePath: '/unit-evc'
          // }]
          // this.getUserJurisdiction(arr)
        })
        .catch(() => {
          this.loadingState = false
          // this.imgCheckFlag = false
        })
    },
    // 获取登录权限
    async getUserJurisdiction(arr = []) {
      console.log('in getuserJuirs')
      storageFrontInfo('plibrary').then((ress) => {
        localStorage.currentlySelect = JSON.stringify({
          appCode: 'plibrary',
          name: 'i管书',
          path: '/home'
        })
        this.$router.push({
          path: '/home'
        })
      })
    },
    // 获取菜单
    getPermission() {
      const res = menuList.children
      sessionStorage.setItem('navMenu', JSON.stringify(res))
      console.log('res', res)
      console.log('res length', res.length)
      if (res && res.length > 0) {
        const arr = res
        if (arr && arr.length > 0) {
          console.log('getuserJuris')
          this.getUserJurisdiction(arr)
        } else {
          this.noPermission()
        }
      } else {
        if (res.length === 0) {
          this.noPermission()
          this.$message.error('用户暂无菜单权限')
          return
        }
        // this.noPermission()
        this.$message.error('获取菜单失败，请重新登录')
      }
    },
    // 暂无权限，跳转403页面
    noPermission() {
      if (!this.isfullScreen) {
        this.$store.dispatch('checkFullScreen')
      }
      this.$router.push({
        path: '/403'
      })
    },
    // 查询账户
    async queryAccount(type) {
      if (type === 'job') {
        if (!this.jobNumber) {
          this.$message.error('请输入工号')
          return
        }
        this.loadingReset = true
        await queryAccountJon({ jobNo: this.jobNumber }).then((res) => {
          this.loadingReset = false
          if (res) {
            this.accoundList = res
          } else {
            this.$message.error('获取账号列表失败')
          }
        })
      } else if (type === 'phone') {
        if (!this.phoneNumber) {
          this.$message.error('请输入手机号')
          return
        }
        this.loadingReset = true
        await queryAccountPhone({ mobilePhone: this.phoneNumber }).then((res) => {
          this.loadingReset = false
          if (res) {
            this.accoundList = res
          } else {
            this.$message.error('获取账号列表失败')
          }
        })
      }
    },
    // 获取验证码
    async verificationCode() {
      if (this.resetType === 'job') {
        if (!this.jobNumber || !this.accoundName) {
          this.$message.error('信息不完整，请完善')
          return
        }
        this.loadingReset = true
        const data = {
          jobNo: this.jobNumber,
          // cause: encodeURI('智能化养殖平台密码修改验证码')
          cause: '智能化养殖平台密码修改验证码'
        }
        await getVerificationCode(data).then((res) => {
          this.loadingReset = false
          if (res && res.status === 200 && res.rel) {
            this.$message.success('验证码发送成功')
            this.countDown()
          } else {
            this.$message.error('验证码发送失败')
          }
        })
      } else if (this.resetType === 'phone') {
        if (!this.phoneNumber || !this.accoundName) {
          this.$message.error('信息不完整，请完善')
          return
        }
        this.loadingReset = true
        await getVerificationCodePhone({ mobile: this.phoneNumber }).then((res) => {
          this.loadingReset = false
          if (res && res.status === 200 && res.rel) {
            this.countDown()
          } else {
            this.$message.error('验证码发送失败')
          }
        })
      }
    },
    // 确认修改
    async submitFrom() {
      this.loadingReset = true
      const data = {
        loginName: this.accoundName,
        newPwd: this.newPassword,
        verifyCode: this.VerificationCode
      }
      if (this.resetType === 'job') {
        data.jobNo = this.jobNumber
      } else {
        data.mobile = this.phoneNumber
      }
      await setResetPassword(data).then((res) => {
        this.loadingReset = false
        if (res && res.status === 200 && res.rel) {
          this.$message.success('修改成功，请返回登录')
          this.switchType('modifyKey')
          this.submitStatus = false
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.loadingReset = false
        // this.$message.error(err.message)
      })
    },
    // 二维码
    obtainQRcode(state) {
      let QRCssHref = ''
      if (process.env.NODE_ENV === 'production') {
        QRCssHref = 'https://iot.imuyuan.com/wechartCss.css'
      } else if (process.env.NODE_ENV === 'development') {
        QRCssHref = 'https://iot-test.imuyuan.com/wechartCss.css'
      }

      // 环控
      window.WwLogin({
        'id': 'qrcode_element',
        'appid': 'ww7d751c0944e1ab5f',
        'agentid': '1000024',
        'redirect_uri': encodeURI('https://my.imuyuan.com/api/wechat/auth/wxLogin'),
        'state': state,
        'href': QRCssHref
      })
      this.loadingRQcode = false
      document.getElementsByTagName('iframe')[0].width = '100%'
      document.getElementsByTagName('iframe')[0].height = '100%'
      // dev
      // window.WwLogin({
      //   'id': 'qrcode_element',
      //   'appid': 'wwb8dcf448030bc7b1',
      //   'agentid': '1000003',
      //   'redirect_uri': encodeURI('http://dev.imuyuan.com'),
      //   'state': '',
      //   'href': ''
      // })
      // 正式
      // window.WwLogin({
      //   'id': 'qrcode_element',
      //   'appid': 'ww7d751c0944e1ab5f',
      //   'agentid': '1000024',
      //   'redirect_uri': encodeURI('https://my.imuyuan.com/'),
      //   'state': '',
      //   'href': ''
      // })
    },
    async codeLogin(code) {
      const data = {
        code: code
      }
      await getWechart(data).then((res) => {
        if (res.length >= 2) {
          this.wechartUseList = res
          this.wechartUserStatus = true
        } else if (res.length === 1) {
          this.setLocalInfo(res[0])
        }
      }).catch(() => {
        this.$message.error('获取用户信息失败，请重新扫码')
        this.buildWechatState()
        // location.reload()
      })
    },
    async buildWechatState() {
      const data = {
        systemId: 'IOT'
      }
      await buildWxLoginInfo(data).then((res) => {
        if (res && res.status === 200) {
          this.obtainQRcode(res.data.state)
        }
      }).catch(() => {
        this.$message.error('获取二维码失败')
      })
    },
    loginOwner(i) {
      this.userInfo = i
    },
    colseWechart() {
      this.setUrl()
      this.wechartUserStatus = false
      localStorage.clear()
      sessionStorage.clear()
      this.wechartUseList = []
      this.info = null
    },
    // 获取菜单
    getMenuDataList() {
      // getMenuList(data).then(res => {
      const res = menuList
      res[0].children.map(item => {
        if (item.appCode === 'unit-evc') {
          localStorage.setItem(
            'appMenuList',
            JSON.stringify(item)
          )
        }
      })
      this.$router.push({
        path: 'platform-overview'
      })
    },
    setLocalInfo(info) {
      const userInfo = !info ? this.userInfo : info
      const token = jwtDecode(userInfo.accessToken.accessToken)
      localStorage.setItem('MY-Auth-Time', token.iat)
      localStorage.setItem('MY-Refresh-Expires', token.exp)
      localStorage.setItem('MY-Bytes', JSON.stringify(token))
      localStorage.setItem('MY-UserInfo', userInfo.accessToken.loginName)
      localStorage.setItem('TOKEN', userInfo.accessToken.accessToken)
      localStorage.setItem('MY-Refresh-Token', userInfo.accessToken.refreshToken)
      localStorage.setItem('user-token', userInfo.accessToken.accessToken)

      this.getPermission()
    }
  }
}

</script>
<style lang="scss">
  @import "./index.scss";
</style>
