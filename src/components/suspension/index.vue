<template>
  <div
    class="container-carrier3-surface-row"
    :class="type === 'sensing-on' ? 'container-carrier3-surface-row2' : ''"
    @mouseenter="change(true)"
    @mouseleave="change(false)"
  >
    <div class="container-carrier3-surface-row-tl" :class="status ? 'container-carrier3-surface-row-tl2' : ''">
      <p>{{ title }}：{{ value || '-' }}</p>
      <i class="container-carrier3-surface-row-ic" />
    </div>
    <img v-if="type === 'sensing-off'" src="@/assets/image/unitStatus/sensing-off.svg">
    <img v-if="type === 'sensing-on'" src="@/assets/image/unitStatus/sensing-on.svg">
    <img v-if="type === 'signal1'" src="@/assets/image/unitStatus/signal1.png">
    <img v-if="type === 'signal2'" src="@/assets/image/unitStatus/signal2.png">
    <img v-if="type === 'signal3'" src="@/assets/image/unitStatus/signal3.png">
    <img v-if="type === 'signal4'" src="@/assets/image/unitStatus/signal4.png">
    <img v-if="type === 'voltage1'" src="@/assets/image/unitStatus/voltage1.svg">
    <img v-if="type === 'voltage2'" src="@/assets/image/unitStatus/voltage2.svg">
    <img v-if="type === 'voltage3'" src="@/assets/image/unitStatus/voltage3.svg">
    <img v-if="type === 'voltage4'" src="@/assets/image/unitStatus/voltage4.svg">
  </div>
</template>
<script>
export default {
  name: 'Suspension',
  props: {
    type: String,
    title: String,
    value: [String, Number]
  },
  data() {
    return {
      status: false
    }
  },
  mounted() {
  },
  methods: {
    change(s) {
      this.status = s
    }
  }
}
</script>
<style lang="scss" scoped>
.container-carrier3-surface-row{
  // border: 1px solid red;
  img { width: 14px; display:block;}
}
.container-carrier3 {
  &-surface{
    &-row{
      display: inline-block;
      width: 22px;
      height: 22px;
      margin-right: 10px;
      background: #10AEFF;
      border-radius: 2px;
      position: relative;
      cursor: pointer;
      box-shadow: 0 0 10px rgba(16, 23, 52, .55);
      &-tl{
        display: none;
        position: absolute;
        top: -40px;
        left: -460%;
        background: #364687;
        @include background_color('suspensionBkColor');
        padding: 5px 15px;
        font-size: 12px;
        cursor: auto;
        border-radius: 2px;
        text-align: center;
        min-width: 140px;
        transition: all .5s;
      }
      &-tl2{
        display: block;
        transition: all .5s;
      }
      &-ic{
        position: absolute;
        bottom: -10px;
        right: 22px;
        border-top: 5px solid #364687;;
        @include border_top_color('border_topColor');
        border-bottom: 5px solid rgba(0,0,0,0);
        border-left: 5px solid rgba(0,0,0,0);
        border-right: 5px solid rgba(0,0,0,0);
      }
      img{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    &-row2{
      background: #064567;
    }
  }
}

</style>
