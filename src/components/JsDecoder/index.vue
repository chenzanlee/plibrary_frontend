<template>
  <div ref="decoder" v-loading="isLoading" class="js-decoder-container" :style="{'max-height': height}">
    <div class="video-main">
      <div id="playWind" :style="styleObj" />
      <div class="v-con-m-control">
        <div class="contain">
          <div :class="[ this.isShotOpen ? 'c-cm-all c-cm-01-open' : 'c-cm-all c-cm-01-close']" @click="changeShot" />
          <!-- <div :class="[ this.isTalkOpen ? 'c-cm-all c-cm-02-open' : 'c-cm-all c-cm-02-close']" @click="changeTalk"/> -->
          <div :class="[ this.isMute ? 'c-cm-all c-cm-03-open' : 'c-cm-all c-cm-03-close']" @click="changeVoice" />
          <div class="c-cm-all c-cm-04" @click="changeCapture" />
          <div :class="[ this.isFull ? 'c-cm-all c-cm-05-open' : 'c-cm-all c-cm-05-open']" @click="changeFull" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from '@/lib/utils'
export default {
  name: 'Decoder',
  props: {
    height: {
      type: [String, Number],
      default: '625px'
    }
  },
  data() {
    return {
      isLoading: false,
      isShotOpen: false, // 是否开启录屏
      isTalkOpen: false, // 是否开启对话
      isMute: false, // 是否开启静音
      isCapture: false, // 截屏
      isFull: false, // 是否全屏
      videoUrl: null,
      cameralId: null,
      oPlugin: null,
      videoTimer: null,
      owidth: 600,
      oheight: 625,
      iWind: 0
    }
  },
  computed: {
    styleObj() {
      return {
        width: this.owidth + 'px',
        height: this.oheight + 'px'
      }
    },
    styleType() {
      return this.$store.state.echartStyle.allStyles.styleType
    }
  },
  watch: {
    'styleType'(newValue, oldValue) {
      console.log('lStyles.fla')
      this.initPlugin()
    }
  },
  mounted() {
    this.initPlugin()
    this.loadPlugin()
    this.getParentBox()
    window.addEventListener('resize', debounce(this.getParentBox, 1000).bind(this))
  },
  destroyed() {
    this.Destroy()
  },
  methods: {
    loadPlugin() {
      const self = this
      this.oPlugin.JS_SetWindowControlCallback({
        windowEventSelect: function(iWndIndex) { // 插件选中窗口回调
          self.iWind = iWndIndex
          console.log(iWndIndex)
        },
        pluginErrorHandler: function(iWndIndex, iErrorCode, oError) { // 插件错误回调
          if (oError === undefined) {
            self.getCameralData(self.cameralId)
          }
          console.log(iWndIndex, iErrorCode, oError)
        },
        windowEventOver: function(iWndIndex) { // 鼠标移过回调
          // console.log(iWndIndex);
        },
        windowEventOut: function(iWndIndex) { // 鼠标移出回调
          // console.log(iWndIndex);
        },
        windowEventUp: function(iWndIndex) { // 鼠标mouseup事件回调
          // console.log(iWndIndex);
        },
        windowFullCcreenChange: function(bFull) { // 全屏切换回调
          console.log(bFull)
        },
        firstFrameDisplay: function(iWndIndex, iWidth, iHeight) { // 首帧显示回调
          console.log(iWndIndex, iWidth, iHeight)
        },
        performanceLack: function() { // 性能不足回调

        }
      })
      this.oPlugin.JS_SetOptions({
        // bSupportSound: false // 是否支持音频，默认支持
        // bSupporDoubleClickFull: false  //是否双击窗口全屏，默认支持
        // bOnlySupportMSE: true  //只支持MSE
        // bOnlySupportJSDecoder: true  //只支持JSDecoder
      }).then(function() {
        console.log('JS_SetOptions')
      })
    },
    getCameralData(val) {
      this.Destroy()
      this.cameralId = val
      this.isLoading = true
      this.$httpRequest({
        type: 'POST',
        uri: '/bar_patrol/api/app/isc/camera/url',
        payload: {
          cameraIndexCode: val,
          'streamType': 0,
          'protocol': 'ws',
          'transmode': 1,
          'expand': 'streamform=mse'
        },
        callback: res => {
          console.log('--------视频插件，数据请求', res)
          if (res.status === 200) {
            this.videoUrl = res.data
            this.realplay()
            this.isLoading = false
            console.log(res, '=====')
          }
        }
      })
    },
    getParentBox() {
      this.videoTimer && window.clearTimeout(this.videoTimer)
      const dom = document.querySelector('.js-decoder-container')
      if (dom) {
        const height = dom.offsetHeight
        const width = dom.offsetWidth
        this.owidth = width || 600
        this.oheight = height || 625
        this.oPlugin.JS_Resize(this.owidth, this.oheight).then(function() {
          console.log('JS_Resize success')
        }, function() {
          console.log('JS_Resize failed')
        })
      }
    },
    initPlugin() {
      const self = this
      // eslint-disable-next-line no-undef
      this.oPlugin = new JSPlugin({
        szId: 'playWind',
        iWidth: self.owidth,
        iHeight: self.oheight,
        iMaxSplit: 4,
        iCurrentSplit: 1,
        szBasePath: './jsDecoder',
        oStyle: {
          border: self.styleType === 1 ? '#343434' : '#ddd',
          borderSelect: self.styleType === 1 ? 'rgb(41, 77, 149)' : '#cfcfcf',
          background: self.styleType === 1 ? 'rgb(16, 40, 88)' : '#fff'
        }
      })
    },
    realplay() {
      const self = this
      const url = this.videoUrl // document.getElementById('url').value // "ws://10.19.141.64:7314/EUrl/ybcwxHO"; 联网共享下该url和playurl是一样的
      this.oPlugin.JS_Play(url, {
        // 流媒体
        playURL: url
        // proxy: "10.5.6.8:559",  //proxy后面的属性为代理的目标地址，根据实际情况配置，联网共享https下需要用到该参数
        // mode: "media"  //建立连接的url新增一个media节点, 联网共享https下需要用到该参数
      }, this.iWind).then(function() {
        self.arrangeWindow(1)
        console.log('realplay success')
      }, function(err) {
        console.log(err, 'realplay failed')
      })
    },
    Destroy() { // 销毁 链接
      this.oPlugin.JS_DestroyWorker(this.iWind).then(function() {
        console.log('destroyWorker success')
      })
    },
    openSound() { // 开启声音
      this.oPlugin.JS_OpenSound(this.iWind).then(function() {
        console.log('JS_OpenSound success')
      }, function() {
        console.log('JS_OpenSound failed')
      })
    },
    closeSound() { // 关闭声音
      this.oPlugin.JS_CloseSound(this.iWind).then(function() {
        console.log('JS_CloseSound success')
      }, function() {
        console.log('JS_CloseSound failed')
      })
    },
    record() { // 开启录像
      const szTime = this.dateFormat(new Date(), 'yyyyMMddhhmmssS')
      this.oPlugin.JS_StartSave(this.iWind, '10.17.137.229_01_' + szTime + '.mp4').then(function() {
        console.log('record success')
      }, function() {
        console.log('record failed')
      })
    },
    stopRecord() { // 关闭录像
      this.oPlugin.JS_StopSave(this.iWind).then(function() {
        console.log('stopRecord success')
      }, function() {
        console.log('stopRecord failed')
      })
    },
    startTalk() { // 对讲功能,需要设备url
      this.oPlugin.JS_StartTalk('wss://10.19.133.143:6014/proxy/10.19.133.143:7314/dac/talk/55bab5bba9654ab9818fa265f3139019/TCP', 1, 1, 16000, 16000, 16).then(function() {
        console.log('startTalk success')
      }, function() {
        console.log('startTalk failed')
      })
    },
    capturePicture(szType) { // 抓取图片，支持传入 JPEG bmp
      this.oPlugin.JS_CapturePicture(this.iWind, 'img', szType).then(function() {
        console.log('CapturePicture success')
      }, function() {
        console.log('CapturePicture failed')
      })
    },
    fullSreen() { // 全屏
      this.oPlugin.JS_FullScreenDisplay(true).then(function() {
        console.log('JS_FullScreenDisplay success')
      }, function() {
        console.log('JS_FullScreenDisplay failed')
      })
    },
    arrangeWindow(i) {
      this.oPlugin.JS_ArrangeWindow(i).then(function() {
        console.log('JS_ArrangeWindow success')
      })
    },
    changeShot() { // 点击录屏
      this.isShotOpen = !this.isShotOpen
      console.log('🚀 ~ file: index.vue ~ line 215 ~ changeShot ~ this.isShotOpen', this.isShotOpen)
      if (this.isShotOpen) {
        this.record()
        return
      }
      if (!this.isShotOpen) {
        this.stopRecord()
        return
      }
    },
    changeTalk() { // 点击对讲
      this.isTalkOpen = !this.isTalkOpen
      this.startTalk()
      console.log('🚀 ~ file: index.vue ~ line 227 ~ changeTalk ~ this.isTalkOpen', this.isTalkOpen)
    },
    changeVoice() { // 点击声音
      this.isMute = !this.isMute
      console.log('🚀 ~ file: index.vue ~ line 231 ~ changeVoice ~ this.isMute', this.isMute)
      if (this.isMute) {
        this.openSound()
        return
      }
      if (!this.isMute) {
        this.closeSound()
        return
      }
    },
    changeCapture() { // 点击截屏
      this.capturePicture('JPEG')
    },
    changeFull() { // 点击全屏
      this.fullSreen()
    },
    dateFormat(oDate, fmt) { // 时间日期格式处理函数
      const o = {
        'M+': oDate.getMonth() + 1, // 月份
        'd+': oDate.getDate(), // 日
        'h+': oDate.getHours(), // 小时
        'm+': oDate.getMinutes(), // 分
        's+': oDate.getSeconds(), // 秒
        'q+': Math.floor((oDate.getMonth() + 3) / 3), // 季度
        'S': oDate.getMilliseconds()// 毫秒
      }
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (oDate.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      for (const k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
      }
      return fmt
    }
  }
}
</script>
<style lang="scss">
@import './decoder.scss';
</style>

