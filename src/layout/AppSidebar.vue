<template>
  <ul class="layout-menu" v-if="isShowSideBar">
    <template
      v-for="(item, index) in mergeWith(sidebar_route, sidebar_label_language)"
      :key="item.label"
    >
      <AppMenuItem :item="item" v-if="!item.separator" :index="index">
        <!-- {{ item.label }} -->
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
import { ref, computed, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { mergeWith, template } from "lodash-es";
import { SIDEBAR_MENU_ITEMS } from "@/constants/menus";
import { useHelperStore } from "@/stores/HelperStore";
import AppMenuItem from "./AppMenuItem.vue";
import Dropdown from "primevue/dropdown";
import { languageDictionary } from "@/constants/languages";
import { useAxios } from "@/hooks/useAxios";
const { request } = useAxios();
import { method } from "lodash-es";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/UserStore";
const helperStore = useHelperStore();
const isShowSideBar = ref(false);
const userStore = useUserStore();
const route = useRoute();
/** Hàm computed có reactive với sự thay đổi của language nhưng UI ko rerender
 *  nên cầm thêm isRerenderSideBar
 */
// const isRerenderSidebar = ref(false);
const {
  SIDEBAR_ROUTE_ADMIN,
  SIDEBAR_LABEL_ADMIN,
  SIDEBAR_LABEL_PARKMEMBER,
  SIDEBAR_ROUTE_PARKMEMBER,
} = SIDEBAR_MENU_ITEMS;
const sidebarLabel = computed(() => {
  return SIDEBAR_LABEL_ADMIN[helperStore.language.code];
});

async function getParkingDataAsync() {
  try {
    const response = await request({
      url: "Parkings?page=1&pageSize=1000",
      method: "GET",
    });
    let parkingMenuData = [];
    for (let parking of response?.ModelData) {
      parkingMenuData.push({
        label: parking.ParkingName,
        to: `/garage/${parking.ParkingId}`,
        icon: "pi pi-box",
      });
    }
    console.log(parkingMenuData);
    if (parkingMenuData.length > 0) {
      if (userStore.role == "admin") {
        SIDEBAR_ROUTE_ADMIN[1].items[1].items = parkingMenuData;
        // SIDEBAR_ROUTE_ADMIN[1].items[1].items = parkingMenuData;
      } else if (userStore.role == "parkmember") {
        SIDEBAR_ROUTE_PARKMEMBER[0].items.hasSubMenu = true;
        SIDEBAR_ROUTE_PARKMEMBER[0].items[0].items = parkingMenuData;
      }
    }
  } catch (error) {
    console.log(error);
  }
}
const sidebar_route = ref([]);
const sidebar_label = ref({
  vi: {},
  en: {},
});
const sidebar_label_language = computed(() => {
  return sidebar_label.value[helperStore.languageCode];
});
onMounted(async () => {
  await getParkingDataAsync();

  if (userStore.role == "parkmember") {
    sidebar_route.value = SIDEBAR_ROUTE_PARKMEMBER;
    sidebar_label.value = SIDEBAR_LABEL_PARKMEMBER;
    console.log(SIDEBAR_LABEL_PARKMEMBER);
  } else if (userStore.role == "admin") {
    SIDEBAR_ROUTE_ADMIN[1].items[1].hasSubMenu = true;
    sidebar_route.value = SIDEBAR_ROUTE_ADMIN;
    sidebar_label.value = SIDEBAR_LABEL_ADMIN;
    console.log(SIDEBAR_LABEL_ADMIN);
  }
  console.log(helperStore.languageCode);

  // console.log(
  //   mergeWith(sidebar_route.value, sidebar_label.value[userStore.language.code])
  // );
  isShowSideBar.value = true;
});
</script>

<style lang="scss" scoped></style>
