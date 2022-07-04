<template>
  <div
    class="itable-empty-box-wrap"
    style="margin-top: 50px; margin-bottom: 60px;"
    :style="emptyStyle"
  >
    <!-- <img
      v-if="this.$store.state.echartStyle.allStyles.styleType === 1"
      style="max-width:300px;"
      src="@/assets/image/page/noData2x.png"
      alt="暂无数据"
    >
    <img
      v-else
      style="max-width:300px;"
      src="@/assets/image/page/noDataG.svg"
      alt="暂无数据"
    > -->
    <img
      style="max-width:300px;"
      :src="noData | noDataFile('noData', 'svg')"
      alt="暂无数据"
    >
  </div>
</template>

<script>
export default {
  props: {
    emptyStyle: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      noData: null
    }
  }
}
</script>

<style lang="scss" scoped>
.itable-empty-box-wrap {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>
