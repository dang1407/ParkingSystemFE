<template>
  <Dropdown :options="options">
    <template #value="slotProps"> Excel </template>
    <template #dropdownicon>
      <i class="text-2xl pi pi-file-export pi-click-icon"></i>
    </template>
  </Dropdown>
</template>

<script setup>
import Calendar from "primevue/calendar";
import Dropdown from "primevue/dropdown";
import { ref } from "vue";
const date = ref("2002-07-14T00:00:00");
const options = ["Trang hiện tại", "Tất cả"];
function onShowCalendarPicker() {
  // alert("Show");
  console.log("show");
}
</script>
