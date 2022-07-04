<template>
  <div class="checker-box">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Checker',
  props: {
    defaultItemClass: String,
    selectedItemClass: String,
    disabledItemClass: String,
    type: {
      type: String,
      default: 'radio'
    },
    value: [String, Number, Array, Object],
    max: Number,
    radioRequired: Boolean
  },
  data() {
    return {
      currentValue: this.value
    }
  },
  watch: {
    value(newValue) {
      this.currentValue = newValue
    },
    currentValue(val) {
      this.$emit('input', val)
      this.$emit('on-change', val)
    }
  }
}
</script>

<style>
.vux-checker-item {
  display: inline-block;
}
</style>
