<template>
  <el-submenu v-if="item.child && item.child.length" :index="navIndex">
    <!-- 创建父级菜单 -->
    <template slot="title">{{ item.MenuName }}</template>
    <!-- 创建子菜单 -->
    <nav-item
      v-for="sItem in item.child"
      :navIndex="sItem.MenuUrl"
      :item="sItem"
      >
    </nav-item>
  </el-submenu>

  <el-menu-item v-else :index="item.MenuUrl">{{ item.MenuName }}</el-menu-item>
</template>
<script>
  export default {
    // 递归组件必须有name
    name: 'navItem',
    props: ['item','navIndex']
  }
</script>
