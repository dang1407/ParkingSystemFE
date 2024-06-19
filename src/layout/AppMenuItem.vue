<template>
  <li class="layout-root-menuitem">
    <div
      class="layout-menuitem-root-text"
      v-if="item.items && !item.hasSubMenu"
    >
      {{ item.label }}
    </div>
    <a
      v-if="item.hasSubMenu"
      class="flex justify-between"
      @click="toggleSubMenu"
    >
      <span>
        <i :class="item.icon" class="layout-menuitem-icon mr-2"></i>
        <span>{{ item.label }}</span>
      </span>
      <i
        class="pi"
        :class="{
          'pi-angle-down': !isOpenSubMenu,
          'pi-angle-up': isOpenSubMenu,
        }"
      ></i>
    </a>
    <transition v-if="item.items && (!item.hasSubMenu || isOpenSubMenu)">
      <ul>
        <AppMenuItem
          v-for="(childItem, index) in item.items"
          :key="childItem.label"
          :item="childItem"
        ></AppMenuItem>
      </ul>
    </transition>

    <router-link
      v-if="!item.items && !item.hasSubMenu"
      :to="item.to"
      tabindex="0"
    >
      <i :class="item.icon" class="layout-menuitem-icon mr-2"></i>
      <span>{{ item.label }}</span>
    </router-link>
  </li>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
});
const isOpenSubMenu = ref(false);

function toggleSubMenu() {
  isOpenSubMenu.value = !isOpenSubMenu.value;
}

onMounted(() => {
  if (route.params.parkingId) {
    isOpenSubMenu.value = true;
  }
});
</script>

<style lang="scss" scoped></style>
