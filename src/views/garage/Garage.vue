<template>
  <div>Garage Page</div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from "vue";
import GarageController from "./GarageController";
const gargeStore = new GarageController();
const parkSlotData = ref({});
onMounted(async () => {
  await gargeStore.getParkSlotByFloorAsync();
  // Chưa tìm ra cách reactive với parkSlotsObject nên phải gán lại
  parkSlotData.value = gargeStore.parkSlotsObject;
});
</script>

<!-- <style lang="css" scoped>
.car__slot {
  width: 32px;
  height: 64px;
  padding: 4px;
  border-radius: var(--border-radius-general);
  background-color: #bdbdbd;
  margin-right: 4px;
}

// .motorbike__slot {
//   width: 48px;
//   height: 96px;
//   border-radius: var(--border-radius-general);
//   background-color: #bdbdbd;
//   margin-right: 4px;
// }

.motorbike__slot--horizontal {
  margin-top: 2px;
  margin-bottom: 2px;
  width: 48px;
  height: 32px;
  border-radius: var(--border-radius-general);
  background-color: #bdbdbd;
  margin-right: 4px;
}

.bikecycle__slot--horizontal {
  width: 40px;
  height: 24px;
  border-radius: var(--border-radius-general);
  background-color: #bdbdbd;
  margin-right: 4px;
  margin-top: 4px;
  margin-bottom: 3px;
}

.center_image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.column__icon {
  border-radius: 50%;
  width: 12px;
  height: 12px;
  background: #000;
}

.elevator {
  border-style: dashed;
  border-color: #ccc; /* Màu sắc của border */

  /* Chỉ định border cho top, left và right */
  border-top-width: 0px;
  border-left-width: 2px;
  border-right-width: 2px;

  /* Không có border ở phía bottom */
  border-bottom-width: 0;
}
</style> -->
