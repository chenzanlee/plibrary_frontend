<template>
  <div class="main">
    <div id="qrcode_element" ref="wechartBody" class="wechart-img" />
  </div>
</template>

<script>
import {
  buildWxLoginInfo
} from '@/http/api/signIn/loginIn'

export default {
  data() {
    return {
      systemId: this.$route.query.systemId || 'BAR-PATROL-CLIENT'
    }
  },
  mounted() {
    console.log(this.systemId)
    this.buildWechatState()
  },
  methods: {
    async buildWechatState() {
      const data = {
        systemId: this.systemId
      }
      await buildWxLoginInfo(data).then((res) => {
        if (res && res.status === 200) {
          this.obtainQRcode(res.data.state)
        }
      })
    },
    obtainQRcode(state) {
      // let QRCssHref = ''
      // if (process.env.NODE_ENV === 'production') {
      //   QRCssHref = 'https://iot.imuyuan.com/wechartCss.css'
      // } else if (process.env.NODE_ENV === 'development') {
      //   QRCssHref = 'https://iot-test.imuyuan.com/wechartCss.css'
      // }
      window.WwLogin({
        'id': 'qrcode_element',
        'appid': 'ww7d751c0944e1ab5f',
        'agentid': '1000024',
        'redirect_uri': encodeURI('https://my.imuyuan.com/api/wechat/auth/wxLogin'),
        'state': state,
        'href': ''
      })
      // this.loadingRQcode = false
      // document.getElementsByTagName('iframe')[0].width = '100%'
      // document.getElementsByTagName('iframe')[0].height = '100%'
    }
  }
}
</script>

<style lang="scss" scoped>
.main{
  width: 100%;
  height: 100%;
  background: #fff;
}
.wechart-img{
  // width: 400px;
  // height: 600px;
}
</style>
