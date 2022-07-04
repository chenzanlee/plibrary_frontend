/* eslint-disable no-labels */
import { getFeedList } from '@/http/api/getFeedList'
// 定义一个混入对象
const feedMixin = {
  data() {
    // eslint-disable-next-line no-unused-labels
    unitInfo: [
      {
        number: '-',
        name: '日龄',
        position: 'left',
        company: '天'
      },
      {
        number: '-',
        name: '装猪数量',
        position: 'top',
        company: '头'
      },
      {
        number: '-',
        name: '单猪体重',
        position: 'right',
        company: 'kg'
      },
      {
        number: '-',
        name: '饲养员',
        position: 'right',
        company: ''
      },
      {
        number: '-',
        name: '工号',
        position: 'right',
        company: ''
      }
    ]
  },
  //   created: function() {
  //     this.getFeedList()
  //   },
  methods: {
    // 获取饲养员信息
    getFeedList(o) {
      // this.loadingPig = true
      getFeedList(o).then(res => {
        // this.loadingPig = false
        if (res && res.status === 200 && res.rel && res.data) {
          // 饲养员姓名
          const index0 = this.unitInfo.findIndex(item => item.name === '饲养员')
          this.unitInfo[index0].number = res.data.breederName || '-'
          // 饲养员工号
          const index1 = this.unitInfo.findIndex(item => item.name === '工号')
          this.unitInfo[index1].number = res.data.breederNumber || '-'
        } else {
          // this.$message.error(res.message || '1111')
        }
      }).catch(err => {
        // this.loadingPig = false
        this.$message.error(err.message || '服务器错误')
      })
    }
  }
}

export default feedMixin
