<template>
  <div v-if="item.frontendRoutePath" class="menu-item">
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
          (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
          !item.alwaysShow
      "
    >
      <app-link v-if="onlyOneChild.frontendRoutePath" :to="onlyOneChild.frontendRoutePath">
        <el-menu-item
          :index="onlyOneChild.frontendRoutePath"
          :class="{ 'submenu-title-noDropdown': !isNest }"
        >
          <item
            :icon="onlyOneChild.icon"
            :title="onlyOneChild.title"
            :menu-active-class="
              $route.path.indexOf(item.frontendRoutePath) > -1 ? 'menuActiveClass' : ''
            "
          />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu
      v-else
      ref="subMenu"
      :index="item.frontendRoutePath"
      :popper-append-to-body="false"
    >
      <!-- TODO: 弹框的属性-->
      <!-- :is-popup="isPopup(item)" -->
      <template slot="title">
        <item
          v-if="item.frontendRoutePath"
          :icon="item.icon"
          :title="item.title"
        />
      </template>
      <sidebar-item
        v-for="(child,i) in item.children"
        :key="child.frontendRoutePath+i"
        :is-nest="true"
        :item="child"
        :base-path="child.frontendRoutePath"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/common/utils'
import Item from './Item'
import AppLink from '@/components/Link'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink
  },
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    this.onlyOneChild = null
    return {}
  },
  methods: {
    isPopup(item) {
      if (item.frontendRoutePath.split('/').length - 1 !== 3) {
        return false
      } else {
        return true
      }
    },
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter((item) => {
        if (item.hidden) {
          return false
        } else {
          this.onlyOneChild = item
          return true
        }
      })
      if (showingChildren.length === 1) {
        return true
      }
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }
      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>
