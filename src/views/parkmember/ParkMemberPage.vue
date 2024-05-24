<template>
  <div class="w-[100%] h-[100%] flex flex-col">
    <div class="h-[36px] flex justify-between items-center mb-2">
      <h1 class="font-semibold text-[1rem] sm:text-[1.5rem]">
        {{ parkMemberConstantsLanguage.listOfParkMemberTitle }}
      </h1>
      <Button
        @click="showParkMemberForm(formModeEnum.Create)"
        class="h-[32px]"
        icon="pi pi-plus"
        :label="parkMemberConstantsLanguage.createButtonText"
      ></Button>
    </div>
    <div class="card w-[100%] flex-1 bg-white">
      <!-- Toolbar thực hiện hàng loạt + tìm kiếm + xuất file excel -->
      <Toolbar class="parkMember-toolbar h-[44px] mb-[4px]">
        <template #start>
          <div
            class="flex items-center gap-3"
            v-show="parseInt(parkMemberSelected.length) > 1"
          >
            <div class="font-semibold">
              {{ parkMemberConstantsLanguage.selected }}
              {{ parkMemberSelected.length }}
            </div>
            <Button
              class="h-[36px]"
              @click="unSelectAllParkMember"
              :label="parkMemberConstantsLanguage.unselect"
              severity="info"
              outlined
            />
            <Button
              class="h-[36px]"
              :label="parkMemberConstantsLanguage.delete"
              icon="pi pi-trash"
              severity="danger"
              outlined
            />
          </div>
        </template>

        <template #end>
          <div class="flex gap-3 items-center">
            <div>
              <IconField iconPosition="left">
                <InputIcon>
                  <i class="pi pi-search" />
                </InputIcon>
                <InputText
                  class="h-[36px]"
                  v-model="parkMemberPaging.searchProperty"
                  placeholder="Search"
                  autofocus
                  @keydown.enter="getParkMemberAsync"
                />
              </IconField>
            </div>
            <div @click="">
              <Dropdown :options="exportExcelOptions" option-label="name">
                <template #value="slotProps">
                  <div class="!text-[black]">Excel</div>
                </template>
                <template #dropdownicon>
                  <i
                    class="text-2xl pi pi-file-export pi-click-icon text-[black]"
                  ></i>
                </template>
              </Dropdown>
              <a href="" class="invisible" ref="aRef"></a>
            </div>
            <div @click="getParkMemberAsync">
              <i class="text-2xl pi-click-icon pi pi-replay"></i>
            </div>
          </div>
        </template>
      </Toolbar>
      <!-- Bảng hiển thị thông tin -->
      <div class="table-container relative flex flex-col">
        <div class="flex-1">
          <DataTable
            :loading="isGettingParkMemberData"
            v-model:selection="parkMemberSelected"
            :value="parkMemberData"
            :show-gridlines="true"
            :striped-rows="true"
            :reorderableColumns="true"
            selection-mode="multiple"
            :metaKeySelection="false"
            style="position: static !important"
          >
            <div>
              <Column
                selectionMode="multiple"
                class="sticky left-0 text-center"
                headerStyle="width: 3rem"
              ></Column>
              <div
                v-for="(columnData, index) in parkMemberTableInf"
                :key="columnData.field"
              >
                <Column
                  v-if="columnData.field != 'Gender'"
                  :key="index"
                  :header="columnData.header"
                  :columnStyle="columnData.headerStyle"
                >
                  <template #body="data">
                    <div class="text-wrap" :class="columnData.tdStyle">
                      {{ data.data[columnData.field] }}
                    </div>
                  </template>
                </Column>
                <Column
                  v-if="columnData.field == 'Gender'"
                  :field="columnData.field"
                  :header="columnData.header"
                  style="min-width: 100px"
                >
                  <template #body="slotProps">
                    {{
                      genderLanguage[helperStore.languageCode][
                        slotProps.data[columnData.field]
                      ]
                    }}
                  </template>
                </Column>
              </div>
              <Column
                class="sticky right-0 bg-inherit border-[1px] border-solid"
                :header="parkMemberConstantsLanguage.functionColumnHeader"
              >
                <template #body="data">
                  <div class="">
                    <!-- Danh sách dropdown các chức năng thêm: nhân bản, ...  -->
                    <div class="">
                      <!-- Nút sửa  -->
                      <SplitButton
                        @click="showParkMemberForm(formModeEnum.Update, data)"
                        class="h-[32px]"
                        :label="parkMemberConstantsLanguage.update"
                        icon="pi pi-chevron-down"
                        :model="[
                          {
                            label: parkMemberConstantsLanguage.delete,
                            command: () => {
                              // console.log(data.data.ParkMemberId);
                              confirmDeleteOneParkMember(confirm, toast, data);
                            },
                          },
                          {
                            label: parkMemberConstantsLanguage.replication,
                          },
                        ]"
                      >
                      </SplitButton>
                    </div>
                  </div>
                </template>
              </Column>
            </div>
          </DataTable>
        </div>

        <div
          class="sticky py-1 bottom-0 left-0 bg-white border-[1px] border-solid border-[#e0e0e0]"
        >
          <BackEndPaginator
            v-if="paginatorPending"
            v-model:totalDBRecords="parkMemberPaging.totalRecords"
            :total-page-records="parkMemberPaging.pageSize"
            :number-records-per-page-options="numberRecordsPerPageOptions"
            v-model:numberRecordsPerpage="parkMemberPaging.pageSize"
            v-model:currentPage="parkMemberPaging.page"
            @onNumberRecordPerPageChanged="getParkMemberAsync"
            @onPageChanged="getParkMemberAsync"
          ></BackEndPaginator>
        </div>
      </div>
      <!-- <div v-else class="h-[calc(100%-44px)] flex justify-center items-center">
        <ProgressSpinner
          class="z-[100]"
          stroke-width="8"
          animation-duration="0.3s"
        ></ProgressSpinner>
      </div> -->
    </div>

    <div class="form-container" v-if="isShowParkMemberForm">
      <div class="form-box bg-white rounded-xl px-6">
        <div
          class="flex items-center justify-between mb-2 sticky top-0 left-0 pt-6 bg-white"
        >
          <h1 class="font-bold text-[20px]">
            {{
              formMode == formModeEnum.Create
                ? parkMemberConstantsLanguage.formHeading.Create
                : parkMemberConstantsLanguage.formHeading.Update
            }}
          </h1>
          <div class="form-close-button" @click="hideParkMemberForm">
            <i class="pi pi-times text-[18px]"></i>
          </div>
        </div>
        <ParkMemberFormBody
          :departmentOptions="departmentOptions"
          :titleOptions="titleOptions"
          v-model:parkMemberCode="parkMemberFormData.ParkMemberCode"
          v-model:parkMemberFullName="parkMemberFormData.FullName"
          v-model:gender="parkMemberFormData.Gender"
          v-model:dateOfBirth="parkMemberFormData.DateOfBirth"
          v-model:personalIdentification="
            parkMemberFormData.PersonalIdentification
          "
          v-model:piCreatedDate="parkMemberFormData.PICreatedDate"
          v-model:piCreatedPlace="parkMemberFormData.PICreatedPlace"
          v-model:address="parkMemberFormData.Address"
          v-model:bankAccount="parkMemberFormData.BankAccount"
          v-model:bankBranch="parkMemberFormData.BankBranch"
          v-model:bankName="parkMemberFormData.BankName"
          v-model:mobile="parkMemberFormData.Mobile"
          v-model:avatarFile="parkMemberFormData.AvatarFile"
          v-model:avatarLink="parkMemberFormData.AvatarLink"
          v-model:email="parkMemberFormData.Email"
          :department-options="departmentOptions"
          v-model:formError="formError"
        ></ParkMemberFormBody>
        <div
          class="form-footer sticky bottom-0 left-0 right-0 w-[100%] bg-white pb-6 pt-2 flex justify-between mt-3"
        >
          <Button
            :label="parkMemberConstantsLanguage.formCancelButtonText"
            severity="secondary"
            outlined
          ></Button>
          <div class="flex gap-2">
            <Button
              @click="showParkMemberFormConfirmDialog(confirm, toast, false)"
              :label="parkMemberConstantsLanguage.formAcceptButtonText"
              outlined
            ></Button>
            <Button
              @click="showParkMemberFormConfirmDialog(confirm, toast, true)"
              :label="
                parkMemberConstantsLanguage.formAcceptAndDuplicateButtonText
              "
              ref="createAndCreateNewButton"
            ></Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, reactive, nextTick } from "vue";
import Button from "primevue/button";
import SplitButton from "primevue/splitbutton";
import Toolbar from "primevue/toolbar";
import InputText from "primevue/inputtext";
import InputIcon from "primevue/inputicon";
import IconField from "primevue/iconfield";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dropdown from "primevue/dropdown";
import ProgressSpinner from "primevue/progressspinner";
import BackEndPaginator from "@/uikits/backendpaginator/index.vue";
import ParkMemberFormBody from "./ParkMemberFormBody.vue";
import { parkMemberConstants } from "./ParkMemberConstants";
import { genderLanguage } from "@/constants/gender";
import { useDialog } from "primevue/usedialog";
import { ParkMemberService } from "./ParkMemberService";
import { useConvert } from "@/hooks/useConvert.js";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { useHelperStore } from "@/stores/HelperStore";
// import the styles
import "vue-good-table/dist/vue-good-table.css";
import { VueGoodTable } from "vue-good-table";
import Listbox from "primevue/listbox";
const helperStore = useHelperStore();
const confirm = useConfirm();
const toast = useToast();
const dialog = useDialog();
const isShowExportFuntion = ref();
const aRef = ref();
const excelListBoxPosition = ref({
  x: 0,
  y: 0,
});
// Các hàm covert thông tin từ DB sang chữ cho người dùng đọc
const { convertGenderDBToUIText, convertDateDBToUIText } = useConvert();

// Thông tin nhân viên lấy từ ParkMemberService
const {
  isGettingParkMemberData,
  isShowParkMemberForm,
  parkMemberData,
  parkMemberSelected,
  tableInf,
  parkMemberFormData,
  parkMemberPaging,
  numberRecordsPerPageOptions,
  formMode,
  formModeEnum,
  departmentOptions,
  titleOptions,
  parkMemberConstantsLanguage,
  parkMemberTableInf,
  paginatorPending,
  formError,
  exportExcelOptions,
  showParkMemberForm,
  showParkMemberFormConfirmDialog,
  hideParkMemberForm,
  unSelectAllParkMember,
  confirmDeleteOneParkMember,
  getParkMemberAsyncWitdhPending,
  getParkMemberAsync,
  getNewParkMemberCode,
  createOneParkMemberAsync,
  updateOneParkMemberAsync,
  deleteParkMemberByIdAsync,
  exportExcelCurrentPage,
  getDepartmentOptionsAsync,
  getTitleOptionsAsync,
} = ParkMemberService();

async function showExportExcelOption(event) {
  const origin = event.target.getBoundingClientRect();
  console.log(origin);
  excelListBoxPosition.value.x = window.innerWidth - Math.ceil(origin.right);
  excelListBoxPosition.value.y = Math.ceil(origin.bottom);
  await nextTick();
}

onMounted(async () => {
  await getParkMemberAsyncWitdhPending();
  await getDepartmentOptionsAsync();
  await getTitleOptionsAsync();
});
</script>

<style lang="scss">
.card {
  width: 100%;
  height: calc(100% - 36px);

  .table-container {
    width: 100%;
    height: calc(100% - 48px);
    overflow: scroll;
  }
}

.table-container div[data-pc-section="wrapper"] {
  overflow: visible !important;
  width: 100%;
  height: 100%;
}

div[data-pc-section="wrapper"] {
  top: 0;
}

th[data-pc-section="headercell"][data-pc-name="headercell"] {
  background-color: #cbd5e1 !important;
  // color: rgb(var(--surface-700));
  color: black;
  z-index: 1;
}

tr[data-pc-section="bodyrow"][role="row"]:nth-child(even) {
  background-color: white !important;
}

tr[data-pc-section="bodyrow"][role="row"]:nth-child(odd) {
  background-color: #f5f5f5 !important;
}
td:first-child {
  background-color: inherit;
}

thead[data-pc-section="thead"] {
  // position: absolute !important;
  top: 0;
  left: 0;
  z-index: 100;
  color: white !important;
}

tr:focus,
tr.dark\:text-white\/80.bg-primary-50.text-primary-700.dark\:bg-primary-400\/30.odd\:bg-surface-0.odd\:text-surface-600.dark\:odd\:bg-surface-800.even\:bg-surface-50.even\:text-surface-600.dark\:even\:bg-surface-900\/50.focus\:outline-none.focus\:outline-offset-0.focus\:ring.focus\:ring-primary-400\/50.ring-inset.dark\:focus\:ring-primary-300\/50.cursor-pointer {
  // background-color: rgb(var(--primary-100)) !important;
  color: rgb(var(--primary-600)) !important;

  --tw-ring-offset-width: 0px !important;
  box-shadow: none !important;
}

/*Chỉnh sửa css phần toolbar */
div[role="toolbar"].parkMember-toolbar {
  padding: 4px 12px;
}

// Chỉnh sửa phần paginator
nav[data-pc-section="paginatorwrapper"] {
  position: sticky;
  bottom: 0;
  border: 1px solid #e0e0e0;
}

.table-container input[type="checkbox"] {
  border-color: red !important;
}

tbody[role="rowgroup"] td {
  padding: 8px 14px !important;
}

.form-box {
  max-height: 90vh;
  max-width: 95vw;
  overflow-y: auto;
}
</style>
