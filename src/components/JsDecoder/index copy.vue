<template>
  <div ref="decoder" class="js-decoder-container" :style="{'max-height': height}">
    <!-- <el-button type="btn-blue" @click="realplay">预览</el-button> -->
    <div id="playWind" :style="styleObj" />
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
    }
  },
  mounted() {
    this.initPlugin()
    this.loadPlugin()
    this.getParentBox()
    window.addEventListener('resize', debounce(this.getParentBox, 1000).bind(this))
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
      this.cameralId = val
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
          if (res.status === 200) {
            this.videoUrl = res.data
            this.realplay()
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
          border: '#343434',
          borderSelect: 'rgb(41, 77, 149)',
          background: 'rgb(16, 40, 88)'
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
    arrangeWindow(i) {
      this.oPlugin.JS_ArrangeWindow(i).then(function() {
        console.log('JS_ArrangeWindow success')
      })
    }
  }
}
</script>
<style lang="scss">
@import './decoder.scss';
</style>

