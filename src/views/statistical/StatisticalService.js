import { useAxios } from "@/hooks/useAxios";
import { ref, computed } from "vue";
import { useHelperStore } from "@/stores/HelperStore";
import { mergeWith } from "lodash-es";
import { StatisticalConstances } from "./StatisticalConstants";
const helperStore = useHelperStore();
const StatisticalConstancesLanguage = computed(() => {
  return StatisticalConstances[helperStore.languageCode];
});
const { request } = useAxios();
const parkingHistoryData = ref([]);
const parkingHistoryPaging = ref({
  page: 1,
  pageSize: 10,
  searchProperty: {
    value: 3,
  },
});

const topYearParkMember = ref();
const topMonthParkMember = ref();

const yearsSearch = ref(parseInt(new Date().getFullYear()));
const yearSearchVModel = ref([
  {
    value: yearsSearch.value,
  },
]);
const yearOptions = ref([]);
const vehicleOptionValues = [
  {
    // xe đạp
    value: 0,
  },
  {
    // Xe máy
    value: 1,
  },
  {
    // Ô tô
    value: 2,
  },
  {
    // Tất cả
    value: 3,
  },
];

const vehicleOptions = computed(() => {
  return mergeWith(
    vehicleOptionValues,
    StatisticalConstancesLanguage.value.vehicleOptions
  );
});
const vehicleOptionsSelected = ref(vehicleOptions.value[3]);

async function getParkingHistoryStatisticalAsync(year, vehicle) {
  try {
    let requestUrl = `ParkingHistory/statistical?year=${year}`;
    if (vehicle) {
      requestUrl += `&vehicle=${vehicle}`;
    }
    const response = await request({
      url: requestUrl,
      method: "GET",
    });
    return response;
  } catch (error) {
    console.log(error);
  }
}

async function getCompanyInfor(toast) {
  try {
    const response = await request({
      url: "Companys/infor",
      method: "GET",
    });
    const startYear = new Date(response?.CreatedDate).getFullYear();
    const nowYear = new Date().getFullYear();
    yearOptions.value = [];
    for (let i = startYear; i <= nowYear; i++) {
      yearOptions.value.push({
        value: i,
      });
    }
  } catch (error) {
    console.log(error);
  }
}

async function getTopParkMemberAsync(limit, year, month) {
  try {
    if (!limit) {
      console.log("truyền thiếu tham số limit");
      return;
    }
    let URL = `ParkMembers/TopParkMember?limit=${limit}`;
    if (year) {
      URL += `&year=${year}`;
    }
    if (month) {
      URL += `&month=${month}`;
    }
    console.log(year, month);
    const response = await request({
      url: URL,
      method: "GET",
    });
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export function StatisticalService() {
  return {
    vehicleOptions,
    vehicleOptionsSelected,
    parkingHistoryData,
    StatisticalConstances,
    parkingHistoryPaging,
    StatisticalConstancesLanguage,
    yearSearchVModel,
    yearsSearch,
    yearOptions,
    topMonthParkMember,
    topYearParkMember,
    getCompanyInfor,
    getParkingHistoryStatisticalAsync,
    getTopParkMemberAsync,
  };
}
