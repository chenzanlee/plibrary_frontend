<template>
  <div>转让记录</div>
</template>

<script>
import {
  getWaitingAuditRecords
} from '@/http/interface/library/library-transfer-record-service'

import { mapGetters } from 'vuex'

export default {
  components: {},
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['sidebar', 'fullScreen']),
    isfullScreen() {
      return this.fullScreen
    }
  },
  watch: {
    cascadervalue(newVal, old) {
    }
  },
  provide() {
    return {
      overview: this
    }
  },
  async created() {
    console.log('created')
    await this.getWaitingAuditRecordList()
  },
  mounted() {

  },

  destroyed() {

  },

  methods: {
    async getWaitingAuditRecordList() {
      const res = await getWaitingAuditRecords()
      console.log(res)
    }
  },
  beforeRouteLeave(to, from, next) {

  }
}
</script>
<style>
</style>
