<template>
  <div class="w-full h-full rounded-2xl bg-white p-4">
    <h1 class="font-bold text-2xl">
      {{ StatisticalConstancesLanguage.title }}
    </h1>
    <div class="px-4">
      <div>
        <Chart
          v-if="!isRerender"
          type="line"
          :data="chartData"
          :options="chartOptions"
          class="h-30rem"
        />
      </div>
      <div>
        <h1 class="font-bold text-xl">
          {{ StatisticalConstancesLanguage.filterTitle }}
        </h1>

        <div class="flex gap-x-4">
          <!-- Năm -->
          <div class="flex flex-col gap-1">
            <label class="font-bold" for="employee-code"
              >{{ StatisticalConstancesLanguage.filterLabel.year }}
              <span class="text-required text-[1.5rem] font-bold pt-1"
                >*</span
              ></label
            >
            <!-- {{ yearOptions }} -->
            <MultiSelect
              :options="yearOptions"
              option-label="value"
              v-model="yearSearchVModel"
              filter
              :selectionLimit="chartLineColor.length"
              :maxSelectedLabels="4"
              empty-message="Không"
              :emptyFilterMessage="
                StatisticalConstancesLanguage.filterLabel.emptyFilterMessage
              "
              :emptySelectionMessage="
                StatisticalConstancesLanguage.filterLabel.emptySelectionMessage
              "
              :selectedItemsLabel="
                StatisticalConstancesLanguage.filterLabel.selectedItemsLabel
              "
              selection-message="'{0} đã được chọn'"
            >
              <template #value="{ value }">
                <div v-if="value.length == 0">
                  {{ StatisticalConstancesLanguage.filterLabel.emptyValue }}
                </div>
                <div v-else>
                  <!-- <span v-for="(item, index) in value">
                    {{ item.value }}
                    <span v-if="index < value.length - 1">,</span>
                  </span> -->
                  {{
                    value.reduce((total, currentValue, currentIndex, arr) => {
                      if (currentIndex > 0)
                        return total + "," + currentValue.value;
                      else return currentValue.value;
                    }, "")
                  }}
                </div>
              </template>
            </MultiSelect>
          </div>

          <!-- Loại xe -->
          <div class="flex flex-col gap-1">
            <label class="font-bold" for="employee-code"
              >{{ StatisticalConstancesLanguage.filterLabel.vehicleType }}
              <span class="text-required text-[1.5rem] font-bold pt-1"
                >*</span
              ></label
            >
            <Dropdown
              v-if="!isRerender"
              :options="vehicleOptions"
              option-label="label"
              v-model="vehicleOptionsSelected"
            >
              <!-- <template #value="slotProps">
                <div v-if="slotProps.value" class="flex items-center">
                  <div>{{ vehicleOptions[slotProps.value.value].label }}</div>
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template> -->
            </Dropdown>
          </div>
        </div>
        <Button
          class="mt-4"
          :label="StatisticalConstancesLanguage.filterLabel?.applyButton"
          @click="applyFilterAndGetParkingHistoryDataAsync(toast)"
        ></Button>
      </div>

      <!-- Top month parkmember -->
      <div class="w-full overflow-y-scroll">
        <div v-for="(item, index) in topMonthParkMember">
          <div>{{ item.FullName }}</div>
          <div>{{ item.ParkMemberCode }}</div>
          <div>{{ item.LicensePlate }}</div>
          <div>{{ item.TotalPrice }}</div>
        </div>
      </div>

      <!-- Top month parkmember -->
      <h1 class="text-xl mt-4 mb-1">
        {{ StatisticalConstancesLanguage.topMonthParkMember + " " + monthNow }}
      </h1>
      <div class="w-full overflow-x-auto flex gap-x-2">
        <div
          v-for="(item, index) in topYearParkMember"
          class="px-4 py-2 rounded-xl bg-primary-200"
        >
          <div class="flex gap-x-4">
            <div class="w-16 flex items-center">
              <img
                class="rounded-full"
                :src="
                  item.AvatarLink
                    ? item.AvatarLink
                    : 'https://t4.ftcdn.net/jpg/00/64/67/63/240_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg'
                "
                alt=""
              />
            </div>
            <div>
              <div>
                <b
                  >{{
                    StatisticalConstancesLanguage.parkMemberInfor?.FullName
                  }}:</b
                >
                {{ item.FullName }}
              </div>
              <div>
                <b
                  >{{
                    StatisticalConstancesLanguage.parkMemberInfor
                      ?.ParkMemberCode
                  }}:</b
                >
                {{ item.ParkMemberCode }}
              </div>
              <div>
                <b
                  >{{
                    StatisticalConstancesLanguage.parkMemberInfor?.LicensePlate
                  }}:</b
                >
                {{ item.LicensePlate }}
              </div>
              <div>
                <b
                  >{{
                    StatisticalConstancesLanguage.parkMemberInfor?.TotalPrice
                  }}:</b
                >
                {{ item.TotalPrice }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { locales } from "@/constants/locale";
import Chart from "primevue/chart";
import Dropdown from "primevue/dropdown";
import MultiSelect from "primevue/multiselect";
import { StatisticalService } from "./StatisticalService.js";
import { useToast } from "primevue/usetoast";
const toast = useToast();
const isRerender = ref(false);
const yearNow = new Date().getFullYear();
const monthNow = new Date().getMonth() + 1;
const {
  StatisticalConstancesLanguage,
  yearsSearch,
  yearOptions,
  vehicleOptions,
  vehicleOptionsSelected,
  yearSearchVModel,
  topMonthParkMember,
  topYearParkMember,
  getCompanyInfor,
  getParkingHistoryStatisticalAsync,
  getTopParkMemberAsync,
} = StatisticalService();
// const year = ref(new Date().getFullYear());

const chartLineColor = [
  "#10B981",
  "#64B5F6",
  "#898989",
  "#a0a0a0",
  "#64748b",
  "#eab308",
  "#d4d4d8",
  "#546e7a",
];

const chartData = ref({
  labels: StatisticalConstancesLanguage.value.chartLabel,
  datasets: [
    {
      label: StatisticalConstancesLanguage.value.chartItemTitle,
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      borderColor: "#10B981",
      tension: 0.4,
    },
  ],
});
const chartOptions = ref();
const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue("--text-color");
  const textColorSecondary = documentStyle.getPropertyValue(
    "--text-color-secondary"
  );
  const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
    },
  };
};

async function applyFilterAndGetParkingHistoryDataAsync() {
  try {
    if (!yearSearchVModel.value) {
      toast.add(StatisticalConstancesLanguage.value.toast?.yearEmpty);
      return;
    } else {
      yearsSearch.value = yearSearchVModel.value.reduce(
        (total, currentValue, currentIndex, arr) => {
          if (currentIndex > 0) return total + "," + currentValue.value;
          else return currentValue.value;
        },
        ""
      );
    }
    const response = await getParkingHistoryStatisticalAsync(
      yearsSearch.value,
      vehicleOptionsSelected.value.value
    );

    console.log(response);

    // Search theo nhiều năm
    chartData.value.datasets = [];
    if (response.length > 0) {
      response.forEach((element, index) => {
        console.log(element);
        chartData.value.datasets.push({
          label:
            StatisticalConstancesLanguage.value.chartItemTitle +
            " " +
            element.Year,
          data: element.Prices,
          fill: false,
          borderColor: chartLineColor[index],
          tension: 0.4,
        });
      });
    } else {
      chartData.value.datasets[0].data = response.Prices;
    }
  } catch (error) {
    console.log(error);
  }
}

watch(StatisticalConstancesLanguage, (newValue, oldValue) => {
  isRerender.value = true;
  vehicleOptionsSelected.value.label =
    StatisticalConstancesLanguage.value.vehicleOptions[
      vehicleOptionsSelected.value.value
    ].label;
  chartData.value.datasets.forEach((element) => {
    element.label = StatisticalConstancesLanguage.value.chartItemTitle;
  });
  // console.log(vehicleOptionsSelected.value);
  isRerender.value = false;
});

onMounted(async () => {
  chartOptions.value = setChartOptions();
  const companyInfor = await getCompanyInfor();
  const response = await getParkingHistoryStatisticalAsync(yearsSearch.value);
  const date = new Date();
  topYearParkMember.value = await getTopParkMemberAsync(5, date.getFullYear());
  topMonthParkMember.value = await getTopParkMemberAsync(
    5,
    date.getFullYear(),
    date.getMonth()
  );
  const data = response.Price;
  chartData.value.datasets[0].data = response.Prices;
  console.log(data);
});
</script>
