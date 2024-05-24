<template>
  <li class="layout-root-menuitem">
    <div class="layout-menuitem-root-text" v-if="item.items">
      {{ item.label }}
    </div>
    <!-- Nếu cần render ra subnav -->
    <transition v-if="item.items">
      <ul>
        <AppMenuItem
          v-for="(childItem, index) in item.items"
          :key="childItem.label"
          :item="childItem"
        ></AppMenuItem>
      </ul>
    </transition>

    <!-- Không render ra subnav -->
    <router-link v-if="!item.items" :to="item.to" tabindex="0">
      <i :class="item.icon" class="layout-menuitem-icon mr-2"></i>
      <span>{{ item.label }}</span>
    </router-link>
  </li>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
});
</script>

<style lang="scss" scoped></style>
