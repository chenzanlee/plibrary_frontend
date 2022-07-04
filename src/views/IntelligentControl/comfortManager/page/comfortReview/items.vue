<template>
  <div class="itemCont">
    <el-row v-if="list.length > 0" :gutter="10" style="width: 100%">
      <el-col v-for="(item, index) in list" :key="index" :span="4">
        <div class="itemCont_box">
          <img :src="item.img2" alt="" @click="() => handexamine(item, index)">
          <p class="title">{{ `${item.regionName}${item.fieldName}/${item.segmentName || '---'}/${item.unit || '---'}` }}</p>
          <p><i class="el-icon-user" /> {{ item.crtName }} ({{ item.jobNo }})</p>
          <p><i class="el-icon-time" /> {{ item.crtTime }}</p>
          <div v-if="type === '0'" class="itemCont_btn" @click="() => handexamine(item, index)">审核</div>
          <img v-if="type !== '0'" class="examine" :src="type === '2' ? require('@/assets/image/rightexamine.png') : require('@/assets/image/noexamine.png')" alt="">
          <div v-if="type !== '0'" class="itemCont_ok">
            <p>审批人：{{ item.checkUserName }} ({{ item.checkUserNo }})</p>
            <p>审批时间：{{ item.checkTime }}</p>
            <!-- <el-tooltip effect="dark" :content="item.checkRemark" placement="top">
              <p class="seeThink">查看审核意见</p>
            </el-tooltip> -->
            <el-popover
              placement="top-start"
              width="300"
              trigger="click"
              :content="item.checkRemark"
            >
              <p slot="reference" class="seeThink">查看审核意见</p>
            </el-popover>
          </div>
        </div></el-col>
    </el-row>
    <div v-if="list.length === 0" class="noData">
      <!-- <img style="width:300px" src="@/assets/image/page/noData.png" alt=""> -->
      <img :src="url" style="max-width:300px" alt="暂无数据">
    </div>

    <div v-if="modelObj.visable" class="model_cont">
      <div class="model_content Highlight">
        <div class="prev" :class="prevDisable ? 'prevDisable' : ''" @click="prev">
          <i class="el-icon-arrow-left" />
        </div>
        <div class="next" :class="nextDisable ? 'nextDisable' : ''" @click="next">
          <i class="el-icon-arrow-right" />
        </div>
        <div class="tit">
          <p>审核意见</p>
          <i class="el-icon-close" @click="handClose" />
        </div>
        <!-- <img :src="modelData.img2" alt=""> -->
        <el-image
          class="elimg"
          :src="modelData.img2"
          :preview-src-list="[modelData.img2]"
          @click.stop="handleClickItem"
        />

        <p class="title">{{ `${modelData.regionName}${modelData.fieldName}/${modelData.segmentName || '---'}/${modelData.unit || '---'}` }}</p>
        <div class="flex_text">
          <p><i class="el-icon-user" /> {{ modelData.crtName }} ({{ modelData.jobNo }})</p>
          <p><i class="el-icon-time" /> {{ modelData.crtTime }}</p>
        </div>
        <el-radio-group v-model="modelObj.radio" :disabled="type !== '0'" style="margin: 15px 0;">
          <el-radio :label="2">通过</el-radio>
          <el-radio :label="1">不通过</el-radio>
        </el-radio-group>
        <el-input
          v-model="modelObj.textarea"
          type="textarea"
          :rows="3"
          maxlength="100"
          placeholder="请输入内容"
          :disabled="type !== '0'"
          resize="none"
        />
        <div v-if="type === '0'" class="flex_btn">
          <el-button class="btn-border" @click="handClose">取消</el-button>
          <el-button class="btn-blue" :loading="btnLoading" type="primary" style="margin-left: 10px!important;" @click="send">确定</el-button>
        </div>
        <div v-else class="flex_btn">
          <el-button class="btn-blue" type="primary" @click="handClose">确定</el-button>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import { getConfigElement } from '@/utils/overtService'
export default {
  props: {
    list: Array,
    type: String
  },
  data() {
    return {
      btnLoading: false,
      pageElement: null,
      modelObj: {
        visable: false,
        index: null,
        radio: 2,
        textarea: ''
      },
      modelData: {},
      prevDisable: false,
      nextDisable: false,
      url: null

    }
  },
  computed: {
    allStyles() {
      return this.$store.state.echartStyle.allStyles
    }
  },
  watch: {
    'allStyles.flag'(newValue, oldValue) {
      console.log('lStyles.fla')
      this.initUrl()
    }
  },
  created() {
    this.pageElement = getConfigElement('comfortReview')
    this.initUrl()
  },
  mounted() {
  },
  methods: {
    initUrl() {
      this.url = this.$getImgUrl('noData', 'svg')
    },
    handleClickItem() {
      this.$nextTick(() => {
        // 获取遮罩层dom
        const domImageMask = document.querySelector('.el-image-viewer__mask')
        if (!domImageMask) {
          return
        }
        domImageMask.addEventListener('click', () => {
          // 点击遮罩层时调用关闭按钮的 click 事件
          document.querySelector('.el-image-viewer__close').click()
        })
      })
    },
    handexamine(item, index) {
      this.modelData = item
      this.modelObj.visable = true
      this.modelObj.index = index
      this.prevDisable = false
      this.nextDisable = false
      if (this.type !== '0') {
        this.radio = Number(this.type)
        this.modelObj.textarea = item.checkRemark
      }
    },
    prev() {
      const num = this.list.length
      const index = (this.modelObj.index - 1) < 0 ? num - 1 : this.modelObj.index - 1
      this.prevDisable = false
      if ((this.modelObj.index - 1) < 0) {
        this.prevDisable = true
        return false
      }
      this.handexamine(this.list[index], index)
    },
    next() {
      const num = this.list.length
      const index = (this.modelObj.index + 1) > (num - 1) ? 0 : this.modelObj.index + 1
      this.nextDisable = false

      if ((this.modelObj.index + 1) > (num - 1)) {
        this.nextDisable = true
        return false
      }
      this.handexamine(this.list[index], index)
    },
    handClose(type = '') {
      if (type === 'close') {
        this.$emit('getinit')
      }
      this.modelObj.index = null
      this.modelObj.radio = 2
      this.modelObj.textarea = ''
      this.modelObj.visable = false
    },
    send() {
      const params = {
        id: this.modelData.id,
        jobNo: this.modelData.jobNo,
        partyName: this.modelData.crtName,
        checkRemark: this.modelObj.textarea
      }
      if (!this.modelObj.textarea || this.modelObj.textarea === '') {
        this.$message.error('请输入审核意见')
        return false
      }
      console.log(params)
      const element = this.pageElement['review']
      const element1 = this.pageElement['unReview']
      this.btnLoading = true
      this.$httpRequest({
        type: this.modelObj.radio === 2 ? element.method : element1.method,
        uri: this.modelObj.radio === 2 ? element.uri : element1.uri,
        payload: params,
        callback: res => {
          this.btnLoading = false
          if (res.status === 200) {
            this.$message.success('请求成功')
            this.handClose('close')
          } else {
            this.$message.error(res.message)
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.itemCont {
  display: flex;
  flex: 1;
}
.itemCont_box {
  // opacity: 0.6;
  // background: #27376f;
  @include background("comfortBackGround");
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 18px;
  position: relative;
  img {
    display: block;
    width: 100%;
    height: 165px;
    cursor: pointer;
  }
  p, i {
    font-weight: 400;
    font-family: MicrosoftYaHei;
    text-align: left;
    color: #6e83be;
    @include font-color("mainFontColor2");
    line-height: 17px;
    font-size: 12px;
  }
  .title {
    font-size: 12px;
    font-family: MicrosoftYaHei;
    text-align: left;
    // color: #ffffff;
    @include font-color("mainFontColor2");
    line-height: 16px;
    margin: 8px 0;
  }
  .itemCont_btn {
    width: 80%;
    line-height: 36px;
    background: linear-gradient(180deg, #3a98ff 0%, #105fb6 100%);
    // border: 1px solid transparent;
    // border-image: linear-gradient(180deg, #3a98ff, #0b3360) 1 1;
    border-radius: 3px;
    margin: 10px auto 0;
    color: #fff;
    // @include font-color("mainFontColor2");
    text-align: center;
    cursor: pointer;
  }
  .examine {
    display: block;
    width: 69px;
    height: 60px;
    position: absolute;
    right: 10px;
    top: 185px;
  }
  .itemCont_ok {
    margin-top: 10px;
    border-top: 1px solid #6E83BE;
    @include border_top_color("comforCont_borderColor");
    padding-top: 5px;
  }
  .seeThink {
    color: #1FBFFF;
    @include font-color("mainFontColorseeThink");
    text-align: center;
     padding: 10px 0 0;
     cursor: pointer;
  }
}
.noData {
    flex: 1;
    min-height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
.model_cont {
  width: 100%;
  height: 100%;
  position: relative;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2000;
  background-color: rgba(#0D1333, .6);
  display: flex;
  justify-content: center;
  align-items: center;
  .model_content {
    width: 540px;
    height: 680px;
    padding: 10px 20px;
    box-sizing: border-box;
    position: relative;
    .prev, .next {
      width: 58px;
      height: 58px;
      // background: rgba(13,79,165,0.6);
      @include background_color("prevNextBackGround");
      border-image: linear-gradient(180deg, #cdd8f7, #6f83b9) 1 1;
      text-align: center;
      line-height: 58px;
      position: absolute;
      top: 50%;
      transform: translate(0,-50%);
      cursor: pointer;
      border-radius: 30px;
       border: 1px solid;
      i {
        font-size: 14px;
        // color: #fff;
        @include font-color("mainFontColor2");
      }
    }
    .prev {
      left: -100px;
    }
    .next {
      right: -100px;
    }
    .nextDisable, .prevDisable {
      cursor: not-allowed;
    }

    .elimg {
      display: block;
      width: 500px;
    height: 375px;
    object-fit: contain;
    }
    .tit {
      line-height: 36px;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
        // color: #fff;
        @include font-color("mainFontColor2");
      i {
        display: block;
        width: 36px;
        cursor: pointer;
            text-align: right;
          padding: 0 5px;
          line-height: 30px;

      }
    }
    .title {
      margin-top: 10px;
      line-height: 20px;
      // color: #fff;
      @include font-color("mainFontColor2");
      font-size: 14px;
    }
    .flex_text {
      display: flex;
      justify-content: flex-start;
      font-size: 12px;
      color: #6E83BE;
    }
    .flex_text p {
      margin-right: 10px;
    }
    .flex_btn {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }
  }
}

</style>
