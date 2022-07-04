<!--  -->
<template>
  <div class="button-group">
    <template v-for="(btn, i) in btnList">
      <button
        v-if="btn.event == 'export' "
        :key="i"
        v-hasAuth="btn.authCode"
        :class="btn.class"
        :size="btn.size"
        :disabled="!!btn.disabled"
        @click.stop="ext()"
      >{{ btn.name }}</button>
      <button
        v-if="btn.event == 'removes' "
        :key="i"
        v-hasAuth="btn.authCode"
        :class="btn.class"
        :size="btn.size"
        :disabled="!!btn.disabled"
        @click.stop="removes()"
      >{{ btn.name }}</button>
      <button
        v-if="btn.event == 'shenhe' "
        :key="i"
        v-hasAuth="btn.authCode"
        :class="btn.class"
        :size="btn.size"
        :disabled="!!btn.disabled"
        @click.stop="shenhe()"
      >{{ btn.name }}</button>
      <button
        v-if="btn.event == 'fanshenhe' "
        :key="i"
        v-hasAuth="btn.authCode"
        :class="btn.class"
        :size="btn.size"
        :disabled="!!btn.disabled"
        @click.stop="fanshenhe()"
      >{{ btn.name }}</button>
      <button
        v-if="btn.event == 'piliangpeizhi' "
        :key="i"
        v-hasAuth="btn.authCode"
        :class="btn.class"
        :size="btn.size"
        :disabled="!!btn.disabled"
        @click.stop="piliangpeizhi()"
      >{{ btn.name }}</button>

      <!--  -->
      <button
        v-if="btn.event == 'added' "
        :key="i"
        v-hasAuth="btn.authCode"
        :class="btn.class"
        :size="btn.size"
        :disabled="!!btn.disabled"
        @click.stop="btnAdded()"
      >{{ btn.name }}</button>
      <button
        v-if="btn.event == 'added2' "
        :key="i"
        v-hasAuth="btn.authCode"
        :class="btn.class"
        :size="btn.size"
        :disabled="!!btn.disabled"
        @click.stop="btnAdded2()"
      >{{ btn.name }}</button>
      <button
        v-if="btn.event == 'added3' "
        :key="i"
        v-hasAuth="btn.authCode"
        :class="btn.class"
        :size="btn.size"
        :disabled="!!btn.disabled"
        @click.stop="btnAdded3()"
      >{{ btn.name }}</button>
      <button
        v-if="btn.event == 'edit' "
        :key="i"
        v-hasAuth="btn.authCode"
        :class="btn.class"
        :size="btn.size"
        :disabled="!!btn.disabled"
        @click.stop="btnEdit()"
      >{{ btn.name }}</button>
      <button
        v-if="btn.event == 'delete' "
        :key="i"
        v-hasAuth="btn.authCode"
        :class="btn.class"
        :size="btn.size"
        :disabled="!!btn.disabled"
        @click.stop="btnDelete()"
      >{{ btn.name }}</button>
    </template>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    btnList: {
      type: Array,
      default: function() {
        return []
      }
    },
    selection: {
      type: String,
      default: ''
    }
  },
  data() {
    // 这里存放数据
    return {}
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {

  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {

  },
  // 方法集合
  methods: {
    ext: function() {
      if (this.selection) {
        this.$emit('btn-ext', this.selection)
      } else {
        alert('请选择要导出的数据' + this.selection)
      }
    },
    removes: function() {
      if (this.selection) {
        this.$emit('btn-removes', this.selection)
      } else {
        alert('请选择要删除的数据' + this.selection)
      }
    },
    shenhe: function() {
      if (this.selection) {
        this.$emit('btn-shenhe', this.selection)
      } else {
        alert('请选择要审核的数据' + this.selection)
      }
    },
    fanshenhe: function() {
      if (this.selection) {
        this.$emit('btn-fanshenhe', this.selection)
      } else {
        alert('请选择要反审核的数据' + this.selection)
      }
    },
    piliangpeizhi: function() {
      if (this.selection) {
        this.$emit('btn-piliangpeizhi', this.selection)
      } else {
        alert('请选择要配置的数据' + this.selection)
      }
    },
    btnAdded() {
      this.$emit('btn-added')
    },
    btnAdded2() {
      this.$emit('btn-added2')
    },
    btnAdded3() {
      this.$emit('btn-added3')
    },
    btnEdit() {
      this.$emit('btn-edit')
    },
    btnDelete() {
      this.$emit('btn-delete')
    }
  }
}
</script>
<style lang='scss' scoped>
.button-group {
  > button {
    margin: 0 10px 10px 0;
  }
}
</style>
