<template>
  <el-dialog
    title="提示"
    :modal-append-to-body="false"
    :visible.sync="dialogVisibleV"
    :close-on-click-modal="false"
    width="600px"
    @close="closeDiaglog"
  >
    <div id="d-content" class="body">
      <span v-if="step==='first'" style="color: #fff;">文件生成中，请耐心等待</span>
      <span v-if="step==='second'" style="color: #fff;">文件已生成,点击下方下载按钮下载</span>
      <span v-if="step==='error1'" style="color: #f56c6c;">生成导出文件失败</span>
      <span v-if="step==='error2'" style="color: #f56c6c;">导出失败</span>
    </div>
    <span slot="footer" class="dialog-footer">
      <div style="margin:0 auto;">
        <el-button class="btn-border" @click="closeDiaglog">取 消</el-button>
        <el-button v-if="step==='second'" class="btn-blue" type="primary" @click="downLoad">下载</el-button>
      </div>
    </span>
  </el-dialog>
</template>
<script>
import { deriveV } from '@/http/api/exportData/export'
import { Loading } from 'element-ui'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
      default: () => {
        return false
      }
    },
    element: { // 请求导出的 权限OBJ
      type: Object,
      required: true,
      default: () => {
        return {}
      }
    },
    refreshElement: { // 刷新 请求导出的 权限OBJ
      type: Object,
      required: true,
      default: () => {
        return {}
      }
    },
    params: { // 请求导出的 参数OBJ
      type: Object,
      required: true,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      dialogVisibleV: false, // 控制显隐
      step: 'first',
      downLoadUrl: '', // 下载 路径
      interVal: null // 定时器
    }
  },
  watch: {
    dialogVisible: {
      handler(n) {
        this.dialogVisibleV = n
        this.step = 'first'
        n && this.init()
      },
      deep: true
    }
  },
  created() {
  },
  beforeDestroy() {
    clearInterval(this.interVal)
    this.interVal = null
  },
  methods: {
    init() {
      const { element, params } = this
      this.$httpRequest({
        type: element ? element.method : '',
        uri: element && element.uri,
        payload: params,
        callback: data => {
          if (data.status === 200 && data.rel) {
            const target = document.querySelector('#d-content')
            const options = {
              target
            }
            const instance = Loading.service(options)
            this.interVal && clearInterval(this.interVal)
            this.interVal = setInterval(() => {
              const { refreshElement, params } = this
              this.$httpRequest({
                type: refreshElement ? refreshElement.method : '',
                uri: refreshElement && refreshElement.uri,
                payload: params,
                callback: res => {
                  if (res.status === 200 && res.rel) {
                    clearInterval(this.interVal)
                    this.interVal = null
                    instance.close()
                    this.step = 'second'
                    this.downLoadUrl = res.data.downloadUrl // 瞎子地址
                  } else if (res.status === 200 && !res.rel) {
                    // instance.close()
                    // this.step = 'error1'
                    // this.$message.error('生成导出文件失败')
                  } else if (res.status !== 200 && !res.rel) {
                    instance.close()
                    clearInterval(this.interVal)
                    this.interVal = null
                    this.step = 'error1'
                  }
                }
              })
            }, 1000)
          } else if (data.status === 200 && !data.rel) {
            this.step = 'error2'
            this.$message.error('导出失败')
          } else {
            // this.$message.error(data.message)
          }
        }
      })
    },
    downLoad() { // 下载文件
      this.closeDiaglog()
      const { downLoadUrl } = this
      deriveV(downLoadUrl)
    },
    closeDiaglog() {
      this.$emit('closeDiaglog')
    }
  }
}
</script>
