<template>
  <ul class="layout-menu">
    <template
      v-for="(item, index) in mergeWith(SIDEBAR_ROUTE, sidebarLabel)"
      :key="item.label"
    >
      <AppMenuItem :item="item">
        {{ item.label }}
      </AppMenuItem>
    </template>
    <div class="w-full">
      <div class="my-[0.75rem]">
        {{ helperStore.language.languageLabel }}
      </div>
      <Dropdown
        :options="languageDictionary"
        optionLabel="label"
        v-model="helperStore.language"
      ></Dropdown>
    </div>
  </ul>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { mergeWith, template } from "lodash-es";
import { SIDEBAR_MENU_ITEMS } from "@/constants/menus";
import { useHelperStore } from "@/stores/HelperStore";
import AppMenuItem from "./AppMenuItem.vue";
import Dropdown from "primevue/dropdown";
import { languageDictionary } from "@/constants/languages";
const helperStore = useHelperStore();

/** Hàm computed có reactive với sự thay đổi của language nhưng UI ko rerender
 *  nên cầm thêm isRerenderSideBar
 */
// const isRerenderSidebar = ref(false);
const { SIDEBAR_ROUTE, SIDEBAR_LABEL } = SIDEBAR_MENU_ITEMS;
const sidebarLabel = computed(() => {
  return SIDEBAR_LABEL[helperStore.language.code];
});
</script>

<style lang="scss" scoped></style>
