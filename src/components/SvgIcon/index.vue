
<template>
  <!--
   @file svg组件
   @author author-name(李红波 15537053107)
 -->
  <svg :class="svgClass" aria-hidden="true">
    <use :href="iconName" />
  </svg>
</template>

<script>
export default {
  name: 'SvgIcon',
  props: {
    // svg图标名
    iconClass: {
      type: String,
      required: true
    },
    // 图标类名
    className: {
      type: String,
      default: ''
    }
  },
  computed: {
    // 资源链接
    iconName() {
      return `#icon-${this.iconClass}`
    },
    // svg类名
    svgClass() {
      if (this.className) {
        return 'svg-icon ' + this.className
      } else {
        return 'svg-icon'
      }
    }
  }
}
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
