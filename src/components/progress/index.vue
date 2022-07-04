<template>
  <div class="progressBar">
    <div role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" class="el-progress el-progress--line el-progress--text-inside">
      <div class="el-progress-bar">
        <div class="el-progress-bar__outer" style="height: 18px;background: #3e477f;">
          <div class="el-progress-bar__inner" :style="{width:countWidth, ...styleObj}">
            <div class="el-progress-bar__innerText">{{ percentageText }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ProgressBar',
  props: {
    percentageText: {
      type: [String, Number],
      default: 0
    },
    percentage: {
      type: [String, Number],
      default: 0
    },
    styleObj: {
      type: Object,
      default: () => {
        return {
          background: 'linear-gradient(270deg,#3b47ff, #1990ff)'
        }
      }
    }
  },
  computed: {
    countWidth() {
      return this.percentage + '%'
    }
  }
}
</script>
<style lang="scss">
.progressBar{
  .el-progress-bar__outer{
    @include background('el_progress_bar_outer')
  }
  .el-progress-bar__inner{
    @include background('el_progress_bar_inner')
  }
}
</style>

