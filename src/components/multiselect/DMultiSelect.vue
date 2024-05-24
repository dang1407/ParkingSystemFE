<template>
  <div>
    <MultiSelect
      v-model="value"
      :options="options"
      :optionLabel="optionLabel"
      :placeholder="placeholder"
      :maxSelectedLabels="maxSelectedLabels"
      class="w-full md:w-20rem"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import MultiSelect from "primevue/multiselect";

const value = defineModel("value");

const props = defineProps({
  options: {
    type: Object,
  },
  optionLabel: {
    type: String,
  },
  placeholder: {
    type: String,
  },
  maxSelectedLabels: {
    type: String,
  },
});
</script>

<style lang="scss" scoped></style>
