<template>
  <section class="app-main" :style="isfullScreen ? 'height:100%' : ''">
    <transition name="fade-transform" mode="out-in">
      <!-- <keep-alive > -->
      <router-view />
      <!-- <keep-alive>
        <router-view v-if="!$route.meta.noCache" />
      </keep-alive>
      <router-view v-if="$route.meta.noCache" /> -->
      <!-- </keep-alive> -->
    </transition>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'AppMain',
  computed: {
    ...mapGetters(['sidebar', 'fullScreen']),
    isfullScreen() {
      return this.fullScreen
    },
    key() {
      return this.$route.path
    }
  }
}
</script>
