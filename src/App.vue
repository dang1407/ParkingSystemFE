<template>
  <Toast />
  <Dialog />
  <ConfirmDialog></ConfirmDialog>
  <router-view></router-view>
</template>

<script setup>
import { ref } from "vue";
import Toast from "primevue/toast";
import Dialog from "primevue/dialog";
import ConfirmDialog from "primevue/confirmdialog";
import { languageDictionary } from "./constants/languages";
import { useHelperStore } from "./stores/HelperStore";
const helperStore = useHelperStore();
const confirmDialogPt = ref({
  rejectButton: {
    root: {},
  },
});
/**
 * Hàm chỉ định ngôn ngữ của trang web theo ngôn ngữ của trình duyệt
 * Created by: nkmdang 20/03/2024
 */
function getBrowserLanguage() {
  const browserLanguage = navigator.language;
  for (let i = 0; i < languageDictionary.length; i++) {
    if (languageDictionary[i].code === browserLanguage) {
      helperStore.language = languageDictionary[i];
      break;
    }
  }
}
getBrowserLanguage();
</script>

<style lang="scss">
button[data-pc-name="rejectbutton"] {
  background-color: white !important;
  border-color: rgb(var(--primary-500));
  color: rgb(var(--primary-500));
}
</style>
