<template>
  <div>
    <el-tooltip placement="top">
      <div slot="content">
        {{ formatEcho() }}
      </div>
      {{ formatEcho() }}
    </el-tooltip>
  </div>
</template>

<script>
export default {
  props: {
    instructionEcho: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    formatEcho() {
      // return Object.keys(obj)[1] + ':' + Object.values(obj)[1] + ' '
      const obj = this.instructionEcho
      if (obj) {
        const arr = []
        Object.values(obj).map((res, index) => {
          const key = Object.keys(obj)[index]
          const str = key + ':' + res + ' '
          arr.push(str)
        })
        return arr.join(';')
      }
    }
  }

}
</script>

<style>

</style>
