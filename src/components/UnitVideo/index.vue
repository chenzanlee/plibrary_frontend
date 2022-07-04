<template>
  <!-- v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)" -->
  <div
    class="unit-wrap"
  >
    <div :class="['videoBox', isMixBox ? 'is-mixin-box':'']" :style="{'height':height }">
      <div id="playerWrap">
        <div id="playWnd" />
      </div>
    </div>
  </div>
</template>
<script>
let oWebControl = ''
let configParam = {}
let initCount = 0
let videoHeight = 580
import request from '@/http/http'
export default {
  name: 'UnitVideo',
  props: {
    height: {
      type: String,
      default: '625px'
    },
    isMixBox: {
      type: Boolean,
      default: true
    },
    videoHeight: {
      type: Number,
      default: 580
    }
  },
  data() {
    videoHeight = this.videoHeight
    return {
      isInitPlugin: false,
      loading: false
    }
  },
  watch: {
    loading(val) {
      // this.onPopupVisibleChange(val, 510)
    }
  },
  activated() {
    if (!this.isInitPlugin) {
      this.initPlugin()
    }
  },
  mounted() {
    this.isInitPlugin = true
    this.initPlugin()
  },
  methods: {
    destroyed() {
      this.loading = false
      this.isInitPlugin = false
      if (oWebControl) {
        oWebControl.JS_Disconnect().then(function() { }, function() { })
      }
    },
    // 视频加载
    webControlRender(rtmp1, rtmp2) {
      this.loading = true
      let funcName = 'startPreview'
      let layout = '1x1'
      let argument = {
        cameraIndexCode: rtmp1,
        streamMode: 0, // 主子码流标识，0-主码流 1-子码流
        transMode: 1, // 传输协议，0-UDP 1-TCP
        gpuMode: 0, // 是否开启 GPU 硬解，不建议开启，0-不开启 1-开启
        wndId: -1
      }
      if (rtmp2) {
        funcName = 'startMultiPreviewByCameraIndexCode'
        layout = '1x2'
        argument = {
          list: [{
            cameraIndexCode: rtmp1 || '',
            ezvizDirect: 0,
            gpuMode: 0,
            streamMode: 0,
            transMode: 1,
            wndId: 1
          },
          {
            cameraIndexCode: rtmp2 || '',
            ezvizDirect: 0,
            gpuMode: 0,
            streamMode: 0,
            transMode: 1,
            wndId: 2
          }
          ]
        }
      }
      try {
        if (oWebControl.oRequest) {
          oWebControl
            .JS_RequestInterface({
              funcName: 'setLayout',
              argument: {
                layout
              }
            })
            .then(() => {
              oWebControl.JS_RequestInterface({
                funcName,
                argument: JSON.stringify(argument)
              })
            })
        }
      } catch (error) {
        this.$message.error('插件启动失败，请检查本地是否安装了插件！')
      }
    },
    async initPlugin(paramsValue = null) {
      const _this = this
      configParam = {
        appkey: '27964180',
        secret: 'FMZ5sTIhnqvp2lI4gOAn',
        ip: '117.158.68.102',
        port: 10446,
        enableHTTPS: 1
      }
      const {
        data
      } = await request(
        '/api/bar_patrol/noToken/api/dataView/getIscConfig', {
          method: 'get',
          params: {}
        }
      )
      configParam = {
        appkey: data.appkey,
        secret: data.secret,
        ip: data.ip,
        port: data.port,
        enableHTTPS: data.enableHTTPS,
        unicomAppkey: data.unicomAppkey,
        unicomSecret: data.unicomSecret,
        intranetAppkey: data.intranetAppkey,
        intranetSecret: data.intranetSecret,
        unicomIp: data.unicomIp,
        unicomPort: data.unicomPort,
        intranetIp: data.intranetIp,
        intranetPort: data.intranetPort
      }
      this.createOwebControl()
      // eslint-disable-next-line no-undef
      let conTimer = null
      document.querySelector('.app-main').onscroll = () => {
        if (oWebControl != null) {
          const video_left_width = document.getElementById('playWnd')
            .offsetWidth
          conTimer && clearTimeout(conTimer)
          let newH = videoHeight
          const dom = document.querySelector('.video-box')
          if (dom) {
            newH = dom.offsetHeight - 70
          }
          conTimer = setTimeout(() => {
            oWebControl.JS_Resize(video_left_width, newH)
          }, 500)
          _this.setWndCover()
        }
      }
      let resizeTimer = null
      window.onresize = () => {
        if (oWebControl != null) {
          const pdom = document.getElementById('playWnd')
          if (pdom) {
            const video_left_width = pdom.offsetWidth
            if (this.$parent.isCascaderOpen) {
              return this.onPopupVisibleChange(true, 610)
            }
            const dom = document.querySelector('.el-dialog__wrapper')
            if (dom && dom.style.display !== 'none') {
              return this.onPopupVisibleChange(true, 610)
            }
            resizeTimer && clearTimeout(resizeTimer)
            resizeTimer = setTimeout(() => {
              oWebControl.JS_Resize(video_left_width, videoHeight)
            }, 300)
            _this.setWndCover()
          }
        }
      }
    },
    setWndCover() {
      var iWidth = window.screen.width
      var iHeight = window.screen.height
      var oDivRect = document.getElementById('playWnd').getBoundingClientRect()
      var iCoverLeft = oDivRect.left < 0 ? Math.abs(oDivRect.left) : 0
      var iCoverTop = oDivRect.top - 115 < 0 ? Math.abs(oDivRect.top - 115) : 0
      var iCoverRight =
        oDivRect.right - iWidth > 0 ? Math.round(oDivRect.right - iWidth) : 0
      var iCoverBottom =
        oDivRect.bottom - iHeight > 0
          ? Math.round(oDivRect.bottom - iHeight)
          : 0

      iCoverLeft = iCoverLeft > 820 ? 800 : iCoverLeft
      iCoverTop = iCoverTop > 473 ? 473 : iCoverTop
      iCoverRight = iCoverRight > 820 ? 800 : iCoverRight
      iCoverBottom = iCoverBottom > 473 ? 473 : iCoverBottom

      oWebControl.JS_RepairPartWindow(0, 0, 1000, 473) // 多1个像素点防止还原后边界缺失一个像素条
      if (iCoverLeft !== 0) {
        oWebControl.JS_CuttingPartWindow(0, 0, iCoverLeft, 473)
      }
      if (iCoverTop !== 0) {
        oWebControl.JS_CuttingPartWindow(0, 0, 1000, iCoverTop + 1) // 多剪掉一个像素条，防止出现剪掉一部分窗口后出现一个像素条
      }
      if (iCoverRight !== 0) {
        oWebControl.JS_CuttingPartWindow(
          800 - iCoverRight,
          0,
          iCoverRight,
          473
        )
      }
      if (iCoverBottom !== 0) {
        oWebControl.JS_CuttingPartWindow(
          0,
          473 - iCoverBottom,
          820,
          iCoverBottom
        )
      }
    },
    onPopupVisibleChange(value, height = 180) {
      // 此方法用来防止下拉框被遮挡
      if (value) {
        oWebControl.JS_CuttingPartWindow(0, 0, 1000, height)
      } else {
        oWebControl.JS_RepairPartWindow(0, 0, 1000, height)
      }
    },
    createOwebControl(paramsValue = null) {
      const _this = this
      this.loading = true
      // eslint-disable-next-line no-undef
      oWebControl = new WebControl({
        szPluginContainer: 'playWnd',
        iServicePortStart: 15900,
        iServicePortEnd: 15909,
        cbConnectSuccess: function() {
          oWebControl
            .JS_StartService('window', {
              dllPath: './VideoPluginConnect.dll'
            })
            .then(
              function() {
                const video_left_width = document.getElementById('playWnd')
                  .offsetWidth
                let newH = videoHeight
                const dom = document.querySelector('.video-box')
                if (dom) {
                  newH = dom.offsetHeight - 70
                }
                oWebControl
                  .JS_CreateWnd('playWnd', video_left_width, newH)
                  .then(function() {
                    oWebControl
                      .JS_RequestInterface({
                        funcName: 'getRSAPubKey',
                        argument: JSON.stringify({
                          keyLength: 1024
                        })
                      })
                      .then(function(oData) {
                        if (oData.responseMsg.data) {
                          // eslint-disable-next-line no-undef
                          const encrypt = new JSEncrypt()
                          encrypt.setPublicKey(oData.responseMsg.data)
                          // eslint-disable-next-line no-unused-vars
                          const encryptSecret = encrypt.encrypt(
                            'FMZ5sTIhnqvp2lI4gOAn'
                          )
                          const params = _this.createControlParams(encrypt, paramsValue)
                          oWebControl
                            .JS_RequestInterface({
                              funcName: 'init',
                              argument: JSON.stringify({ ...params })
                            })
                            .then(function(oData) {
                              _this.$emit('initSuccess', true)
                              _this.loading = false
                            })
                        }
                      })
                  })
              },
              function() {}
            )
        },
        cbConnectError: function() {
          _this.loading = false
          _this.$message.warning('插件未启动，正在尝试启动，请稍候...')
          // eslint-disable-next-line no-undef
          oWebControl.JS_WakeUp && oWebControl.JS_WakeUp('VideoWebPlugin://') // 程序未启动时执行error函数，采用wakeup来启动程序
          initCount++
          if (initCount < 3) {
            setTimeout(() => {
              _this.initPlugin()
            }, 3000)
          } else {
            _this.$message({
              message: '插件启动失败，请检查本地是否安装了插件！',
              type: 'warning'
            })
          }
        },
        cbConnectClose: function() {
          oWebControl = null
        }
      })
    },
    createControlParams(encrypt, value = null) {
      // eslint-disable-next-line no-undef
      const appkeyMap = {
        1: configParam.appkey,
        2: configParam.unicomAppkey,
        3: configParam.intranetAppkey
      }
      const secretMap = {
        1: configParam.secret,
        2: configParam.unicomSecret,
        3: configParam.intranetSecret
      }
      const ipMap = {
        1: configParam.ip,
        2: configParam.unicomIp,
        3: configParam.intranetIp
      }
      const portMap = {
        1: configParam.port,
        2: configParam.unicomPort,
        3: configParam.intranetPort
      }
      return {
        appkey: value ? appkeyMap[value] : configParam.appkey,
        secret: value ? encrypt.encrypt(secretMap[value]) : encrypt.encrypt(configParam.secret), // encrypt.encrypt())
        ip: value ? ipMap[value] : configParam.ip,
        playMode: 0,
        port: value ? parseInt(portMap[value]) : parseInt(configParam.port),
        snapDir: 'E:\\SnapDir',
        videoDir: 'E:\\VideoDir',
        layout: '1x1',
        enableHTTPS: configParam.enableHTTPS, // 1,
        encryptedFields: 'secret'
      }
    }
  }
}
</script>
<style scoped>
.unit-wrap>>>.el-loading-mask {
  border-radius: 10px;
}
</style>
<style lang="scss" scoped>

@mixin box {
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    background-image: url("../../assets/border/left-top-bg.png"),
      url("../../assets/border/right-top-bg.png"),
      url("../../assets/border/right-bottom-bg.png"),
      url("../../assets/border/left-bottom-bg.png");
    @include background_image('field_content_BGimage');
    background-repeat: no-repeat, no-repeat, no-repeat, no-repeat;
    background-position: top left, top right, bottom right, bottom left;
    border-radius: 10px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -10;
  }

  &::after {
    content: "";
    width: calc(100% - 2px);
    height: calc(100% - 2px);
    border: 1px solid #8669fb;
    @include border_color('field_content_boxBorder');
    box-shadow: inset 0 0 10px 0 #396dff;
    @include box_shadow('field_content_boxShadow');
    border-radius: 10px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -50;
  }
}
  .videoBox {
    // height: 625px;
    position: relative;
    padding: 20px;
  }
  .is-mixin-box {
    @include box;
  }
  #playerWrap {
    overflow: hidden;
  }
  #playerWrap,
  video {
    width: 100%;
    height: 100%;
  }
</style>
