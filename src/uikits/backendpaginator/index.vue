<template>
  <div class="flex items-center justify-between px-2">
    <slot name="totalDBRecords">
      <div class="flex">
        {{ paginatorConstantsLanguage.total }}
        <span class="ml-[0.35rem] hidden xl:block">{{
          paginatorConstantsLanguage.numberRecords
        }}</span>
        :
        {{ props.totalDBRecords }}
      </div>
    </slot>

    <slot name="pageSelect">
      <div class="flex items-center">
        <i
          @click="goToFirstPage"
          class="pi pi-angle-double-left !flex be-paginator-item"
          :class="{ 'disabled-item': disableItem.firstListPage }"
        ></i>

        <i
          class="pi pi-angle-left !flex be-paginator-item"
          @click="onPageChanged(Math.max(1, currentPage - 1))"
          :class="{ 'disabled-item': disableItem.prevPage }"
        ></i>
        <div
          v-for="(page, index) in pageOptions"
          class="be-paginator-item hidden sm:flex"
          :class="{ 'be-paginator-item-active': page === currentPage }"
          :key="index"
          @click="onPageChanged(page)"
        >
          {{ page }}
        </div>
        <i
          class="pi pi-angle-right !flex be-paginator-item"
          @click="onPageChanged(Math.min(numberOfPages, currentPage + 1))"
          :class="{ 'disabled-item': disableItem.nextPage }"
        ></i>

        <i
          @click="goToLastPage"
          class="pi pi-angle-double-right !flex be-paginator-item"
          :class="{ 'disabled-item': disableItem.lastListPage }"
        ></i>
      </div>
    </slot>

    <slot name="end">
      <div class="flex items-center">
        <span class="mr-1 hidden md:block">{{
          paginatorConstantsLanguage.numberRecordsPerPage
        }}</span>
        <Dropdown
          v-model="numberRecordsPerPage"
          :options="props.numberRecordsPerPageOptions"
        ></Dropdown>
      </div>
    </slot>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, watch } from "vue";
import Dropdown from "primevue/dropdown";
import { PaginatorConstants } from "./PaginatorConstants";
import { useHelperStore } from "@/stores/HelperStore";
const props = defineProps({
  firstRecordIndex: Number,
  lastRecordIndex: Number,
  numberRecordsPerPageOptions: Array,
});
const emits = defineEmits(["onPageChanged", "onNumberRecordPerPageChanged"]);
const helperStore = useHelperStore();
const paginatorConstantsLanguage = computed(() => {
  return PaginatorConstants[helperStore.language.code];
});
// Mảng các số thứ tự trang sẽ xuất hiện trên paginator
const pageOptions = ref([]);

const currentPage = defineModel("currentPage");
const numberRecordsPerPage = defineModel("numberRecordsPerpage");
const totalDBRecords = defineModel("totalDBRecords");
// Tính số lượng trang sẽ có
const numberOfPages = computed(() => {
  return Math.ceil(
    parseInt(totalDBRecords.value) / parseInt(numberRecordsPerPage.value)
  );
});

const disableItem = ref({
  firstListPage: false,
  prevPage: false,
  nextPage: false,
  lastListPage: false,
});

/**
 * Hàm tính toán các số sẽ xuất hiện trên paginator
 * Created by: nkmdang 06/03/2024
 */
async function caculatePageOptionsAndDisabledItem(numberOfPageParam) {
  await nextTick();
  const currentNumberOfPages = numberOfPageParam || numberOfPages.value;
  // console.log(currentNumberOfPages);
  if (currentNumberOfPages <= 0) {
    throw "Lỗi phân trang";
  }
  // Nếu số trang lớn hơn 5 thì mới cần tính toán lại pageOptions
  if (currentNumberOfPages >= 5) {
    const currentPageInt = parseInt(currentPage.value);
    // Trang đầu tiên sẽ là 1 hoặc currentPageInt - 2
    let firstPageIndex = Math.min(currentNumberOfPages - 4, currentPageInt - 2);
    firstPageIndex = Math.max(1, firstPageIndex);
    // Trang cuối cùng sẽ là currentPageInt + 2 hoặc currentNumberOfPages hoặc 5
    let lastPageIndex = Math.min(currentPageInt + 2, currentNumberOfPages);
    lastPageIndex = Math.max(lastPageIndex, 5);
    const emptyArray = [];
    for (let i = firstPageIndex; i <= lastPageIndex; i++) {
      emptyArray.push(i);
    }
    pageOptions.value = emptyArray;
  } else {
    const emptyArray = [];
    for (let i = 1; i <= currentNumberOfPages; i++) {
      emptyArray.push(i);
    }
    pageOptions.value = emptyArray;
  }

  disableItem.value = {
    firstListPage: false,
    prevPage: false,
    nextPage: false,
    lastListPage: false,
  };

  if (currentPage.value <= 3) {
    disableItem.value.firstListPage = true;
    if (currentPage.value == 1) {
      disableItem.value.prevPage = true;
    }
  } else if (currentPage.value >= currentNumberOfPages - 2) {
    disableItem.value.lastListPage = true;
    if (currentPage.value == currentNumberOfPages) {
      disableItem.value.nextPage = true;
    }
  }
  await nextTick();
}

/**
 * Tính toán việc các nút chuyển trang có bị disabled hay không
 * Created by: nkmdang 06/03/2024
 */

/**
 * Hàm tính toán lại các thành phần khi chuyển trang và emit sự kiện lên cha
 * Created by: nkmdang 06/03/2024
 */
async function onPageChanged(newPage) {
  currentPage.value = newPage;
  caculatePageOptionsAndDisabledItem();

  emits("onPageChanged");
  // console.log("onPageChanged");
}

async function goToFirstPage() {
  currentPage.value = 1;
  caculatePageOptionsAndDisabledItem();
  emits("onPageChanged");
}

async function goToLastPage() {
  currentPage.value = numberOfPages.value;
  caculatePageOptionsAndDisabledItem();
  emits("onPageChanged");
}

/**
 * Component Dropdown không có onChange event nên cần watch để emit sự kiện lên cha
 * Created by: nkmdang 06/03/2024
 */
watch(numberRecordsPerPage, async (newValue) => {
  numberOfPages.value = Math.ceil(
    parseInt(totalDBRecords.value) / parseInt(numberRecordsPerPage.value)
  );
  /** Sau khi đổi số bản ghi trong trang thí số trang hiện tại đang chọn có thể
   * lớn hơn số trang hiện có, nên cần điều chỉnh lại
   */
  if (currentPage.value > numberOfPages.value) {
    currentPage.value = numberOfPages.value;
  }
  caculatePageOptionsAndDisabledItem();
  // await nextTick để đảm bảo giá trị trong ref đã được cập nhật
  emits("onNumberRecordPerPageChanged");
  // console.log("onNumberRecordPerPageChanged");
});

watch(totalDBRecords, async (newValue) => {
  await caculatePageOptionsAndDisabledItem();
});

/**
 * Khi Paginator được mounted thì tính toán các trang xuất hiện
 * Created by: nkmdang 06/03/2024
 */
onMounted(async () => {
  caculatePageOptionsAndDisabledItem();
});
</script>

<style lang="scss" scoped>
// @import "@/scss/_mixins.scss";
$icon-size: 32px;
$page-fontsize: 14px;
$page-active-fontsize: 18px;
.be-paginator-item {
  justify-content: center;
  align-items: center;
  width: $icon-size;
  height: $icon-size;
  border-radius: 50%;
  font-size: $page-fontsize;
  cursor: pointer;
}

.be-paginator-item-active {
  display: flex !important;
  background-color: rgb(var(--primary-100));
  color: rgb(var(--primary-600));
  font-size: $page-active-fontsize;
}

.disabled-item {
  opacity: 0.5;
  pointer-events: none;
}
</style>
