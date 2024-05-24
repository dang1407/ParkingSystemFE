<template>
  <div>
    <table>
      <thead>
        <th v-for="tableData in tableInf">
          {{ tableData?.header }}
        </th>
      </thead>
      <tbody>
        <tr v-for="element in data">
          <td></td>
          <td v-for="key in element">
            {{ element[key] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from "vue";
import CheckBox from "primevue/checkbox";
const data = defineModel("data");
const tableInf = defineModel("tableInf");
</script>

<style lang="scss" scoped></style>
