<template>
  <div>
    基础配置{{ myNum }}<br>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('baseDeploy', {
      myNum: state => state.num
    })
  }
}
</script>

<style lang="scss" scoped>

</style>
