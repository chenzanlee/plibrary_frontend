<template>
  <div v-if="form.fieldList.hasOwnProperty(place) && form.fieldList[place].hasOwnProperty('btnLists')" class="btn-group flex">
    <el-button
      v-for="(item, index) in form.fieldList[place].btnLists"
      :key="index"
      :class="item.className"
      @click.stop.prevent="item.handleClick"
    >
      {{ item.innerText }}
    </el-button>
  </div>
</template>

<script>
export default {
  inject: ['form'],
  props: {
    // 放置位置
    place: {
      type: String
    }
  }
}
</script>

<style lang="scss" scoped></style>
