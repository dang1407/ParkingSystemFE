<template>
  <div class="layout-topbar">
    <router-link to="/" class="layout-topbar-logo" tabindex="0">
      <img src="../assets/imgs/logo-1.png" alt="logo" />
      <span class="text-[20px]">MD Management System</span>
    </router-link>
    <button
      class="layout-topbar-button layout-menu-button"
      @click="onMenuToggle()"
    >
      <i class="pi pi-bars"></i>
    </button>

    <div class="layout-topbar-menu">
      <div>
        <Dropdown
          :options="languageDictionary"
          option-label="label"
          v-model="helperStore.language"
          @change="onChangeLanguage"
        ></Dropdown>
      </div>
      <div>
        <router-link
          to="/infor"
          tabindex="0"
          class="p-link layout-topbar-button"
          v-tooltip.bottom="topBarTooltipLanguage.profile"
        >
          <i class="pi pi-user"></i>
          <span>Profile</span>
        </router-link>
      </div>

      <button
        tabindex="0"
        class="p-link layout-topbar-button"
        v-tooltip.bottom="topBarTooltipLanguage.setting"
      >
        <i class="pi pi-cog"></i>
        <span>Settings</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useHelperStore } from "@/stores/HelperStore";
import { useLayout } from "./composable/useLayout";
import { usePrimeVue } from "primevue/config";
import Dropdown from "primevue/dropdown";
import Listbox from "primevue/listbox";
import { locales } from "@/constants/locale";
import { languageDictionary } from "@/constants/languages";
const { onMenuToggle } = useLayout();
const primevue = usePrimeVue();
const helperStore = useHelperStore();
const localesLanguage = computed(() => {
  return locales[helperStore.language.code];
});

const topBarTooltip = {
  vi: {
    profile: "Hồ sơ cá nhân",
    setting: "Cài đặt",
  },
  en: {
    profile: "My profile",
    setting: "Setting",
  },
};
const topBarTooltipLanguage = computed(() => {
  return topBarTooltip[helperStore.language.code];
});

/**
 * Hàm chuyển đổi locale của primevue khi thay đổi ngôn ngữ
 * Created by: nkmdang 11/03/2024
 */
function onChangeLanguage() {
  primevue.config.locale = {
    ...primevue.config.locale,
    ...localesLanguage.value,
  };
}

// Gọi hàm onChangeLanguage để lấy locale khi mở trang web
onChangeLanguage();
</script>

<style lang="scss" scoped></style>
