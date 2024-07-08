<template>
  <div
    class="lg:min-w-[800px] md:min-w-[600px] xs:max-w-[90%] xs:min-w-[300px]"
  >
    <h1 class="font-bold text-2xl">{{ GarageConstancesLanguage.formTitle }}</h1>
    <div class="flex">
      <div
        :class="{
          'w-full': !(
            userStore.role == 'admin' || userStore.role == 'employee'
          ),
          'w-[50%]':
            (userStore.role == 'admin' || userStore.role == 'employee') &&
            parkSlotFormData.Vehicle != 0,
          'w-full':
            parkSlotFormData.Vehicle == 0 || userStore.role == 'parkmember',
        }"
      >
        <div class="mt-4">
          <div class="flex flex-col flex-1 gap-1">
            <label class="font-bold">{{
              GarageConstancesLanguage?.formLabel?.ParkSlotCode
            }}</label>
            <InputText
              readonly
              class="h-[36px]"
              v-model="parkSlotFormData.ParkSlotCode"
              aria-describedby="parkslotcode-help"
            />
            <small
              class="text-[red] font-bold"
              v-show="formError?.ParkSlotCode"
              id="parkslotcode-help"
              >{{ formError?.ParkSlotCode }}</small
            >
            <br />
          </div>
          <div class="flex flex-col flex-1 gap-1">
            <label class="font-bold">{{
              GarageConstancesLanguage.formLabel.StateLabel
            }}</label>
            <InputText
              readonly
              class="h-[36px]"
              :value="
                GarageConstancesLanguage.formLabel.State[
                  parkSlotFormData.ParkSlotState
                ]
              "
              aria-describedby="state-help"
            />
            <br />
          </div>
          <div class="flex flex-col flex-1 gap-1">
            <label class="font-bold">{{
              GarageConstancesLanguage.formLabel.VehicleLabel
            }}</label>
            <InputText
              readonly
              class="h-[36px]"
              :value="
                GarageConstancesLanguage.formLabel.Vehicle[
                  parkSlotFormData.Vehicle
                ]
              "
              aria-describedby="vehicle-help"
            />
            <br />
          </div>
          <div
            class="flex flex-col flex-1 gap-1"
            v-if="parkSlotFormData.ParkSlotState == 2"
          >
            <label class="font-bold">{{
              GarageConstancesLanguage.formLabel.VehicleInDateLabel
            }}</label>
            <InputText
              readonly
              class="h-[36px]"
              :value="
                convertDateDBToDDMMYYYHHMM(parkSlotFormData.VehicleInDate)
              "
              aria-describedby="vehicle-help"
            />
            <br />
          </div>
        </div>
        <div
          v-if="
            parkSlotFormData.ParkSlotState == 0 || userStore.role == 'admin'
          "
        >
          <div
            class="flex flex-col flex-1 gap-1"
            v-if="parkSlotFormData.Vehicle != 0"
          >
            <label class="font-bold" for="employee-full-name"
              >{{ GarageConstancesLanguage.formLabel.LicensePlate }}
              <span class="text-required text-[1.5rem]">*</span>
            </label>
            <InputText
              :invalid="formError?.LicensePlate ? true : false"
              class="h-[36px]"
              id="employee-full-name"
              v-model="parkSlotFormData.LicensePlate"
              aria-describedby="employee-full-name-help"
            />
            <small
              class="text-[red] font-bold"
              v-show="formError?.LicensePlate"
              id="employee-full-name-help"
              >{{ formError?.LicensePlate }}</small
            >
            <br />
          </div>
          <div>
            <Button
              v-if="
                parkSlotFormData.ParkSlotState == 0 &&
                userStore.role == 'parkmember'
              "
              :label="GarageConstancesLanguage.formLabel.Order"
              @click="orderParkSlot(parkSlotFormData.ParkSlotId)"
            >
            </Button>
            <Button
              v-if="
                parkSlotFormData.ParkSlotState == 1 &&
                !isUpdateCustomerLicensePlate
              "
              :label="GarageConstancesLanguage.formLabel.enterVehilceToGarage"
              @click="enterVehicleToGarage(parkSlotFormData.ParkSlotId)"
            >
            </Button>
            <Button
              v-if="
                parkSlotFormData.ParkSlotState == 1 &&
                isUpdateCustomerLicensePlate
              "
              :label="GarageConstancesLanguage.update"
              @click="updateParkSlotOrder(parkSlotFormData.ParkSlotId)"
            >
            </Button>
            <Button
              v-if="parkSlotFormData.ParkSlotState == 2"
              :label="GarageConstancesLanguage.exportBillButtonLabel"
              @click="showOutGarageBill"
            >
            </Button>
          </div>
        </div>
      </div>
      <div
        v-if="
          (userStore.role == 'admin' || userStore.role == 'employee') &&
          !isUpdateCustomerLicensePlate &&
          parkSlotFormData.Vehicle != 0
        "
        class="p-4"
      >
        <div class="flex flex-col flex-1 gap-1">
          <label class="font-bold"
            >{{ GarageConstancesLanguage.formLabel.LicensePlatePredictLabel }}
          </label>
          <InputText
            readonly
            :invalid="formError?.LicensePlate ? true : false"
            class="h-[36px]"
            id="employee-full-name"
            :value="licensePlate"
            aria-describedby="employee-full-name-help"
          />
          <br />
        </div>
        <div class="flex flex-col gap-1">
          <label class="font-bold"
            >{{
              GarageConstancesLanguage.formLabel.LicensePlateImageTakedLabel
            }}
          </label>
          <div>
            <img
              :src="licensePlateImageUrl"
              alt=""
              class="max-h-60 rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Vehicle Out Garage Form -->
    <Dialog
      @hide="hideOutGarageBill"
      v-model:visible="isShowOutGarageBill"
      :header="GarageConstancesLanguage.billInfor"
      modal
      :style="{ width: '50rem' }"
    >
      <div class="w-full flex">
        <div class="w-[50%]">
          <div class="w-full flex flex-col flex-1 gap-1">
            <label class="font-bold"
              >{{ GarageConstancesLanguage.formLabel.LicensePlate }}
            </label>
            <InputText
              readonly
              :invalid="formError?.LicensePlate ? true : false"
              class="h-[36px]"
              id="employee-full-name"
              :value="licensePlate"
              aria-describedby="employee-full-name-help"
            />
            <br />
          </div>
          <div class="flex flex-col">
            <div
              class="flex flex-col flex-1 gap-1"
              v-if="parkSlotFormData.ParkSlotState != 0"
            >
              <label class="font-bold">{{
                GarageConstancesLanguage.formLabel.VehicleInDateLabel
              }}</label>
              <InputText
                readonly
                class="h-[36px]"
                :value="
                  convertDateDBToDDMMYYYHHMM(parkSlotFormData.VehicleInDate)
                "
                aria-describedby="vehicle-help"
              />
              <br />
            </div>
          </div>
          <div class="flex flex-col">
            <div
              class="flex flex-col flex-1 gap-1"
              v-if="parkSlotFormData.ParkSlotState != 0"
            >
              <label class="font-bold">{{
                GarageConstancesLanguage.formLabel.VehicleOutDateLabel
              }}</label>
              <InputText
                readonly
                class="h-[36px]"
                :value="convertDateDBToDDMMYYYHHMM(getCurrentTimeString())"
                aria-describedby="vehicle-help"
              />
              <br />
            </div>
          </div>
          <div class="flex flex-col">
            <div class="flex flex-col flex-1 gap-1">
              <label class="font-bold">{{
                GarageConstancesLanguage.price
              }}</label>
              <InputText
                readonly
                class="h-[36px]"
                :value="priceUse"
                aria-describedby="vehicle-help"
              />
              <br />
            </div>
          </div>
          <Button
            :label="GarageConstancesLanguage.formLabel.enterVehicleOutGarage"
            @click="enterVehicleOutGarage(parkSlotFormData.ParkSlotId)"
          ></Button>
        </div>
        <div class="flex-1 h-full">
          <img class="w-full" :src="billUrl" alt="QR thanh toán" />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import { GarageConstances } from "./GarageConstances.js";
import { useHelperStore } from "@/stores/HelperStore";
import { useUserStore } from "@/stores/UserStore.js";
import { useAxios } from "@/hooks/useAxios.js";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import { useConvert } from "@/hooks/useConvert.js";

const confirm = useConfirm();
const emits = defineEmits(["closeForm", "updateParkSlotSuccess"]);
const toast = useToast();
const { convertDateDBToDDMMYYYHHMM, getCurrentTimeString } = useConvert();
console.log(convertDateDBToDDMMYYYHHMM("2024-06-06T23:28:22+07:00"));
const { request } = useAxios();
const price = {
  2: {
    0: {
      InDayBefore18: 2000,
      InDayAfter18: 3000,
      OutDay: 5000,
    },
    1: {
      InDayBefore18: 3000,
      InDayAfter18: 5000,
      OutDay: 8000,
    },
    2: {
      Hour: 5000,
    },
  },
  1: {
    0: {
      InDayBefore18: 3000,
      InDayAfter18: 4000,
      OutDay: 8000,
    },
    1: {
      InDayBefore18: 4000,
      InDayAfter18: 6000,
      OutDay: 10000,
    },
    2: {
      Hour: 8000,
    },
  },
};
const billUrl = ref(
  `https://api.vietqr.io/image/970407-19036744400010-jsBXndE.jpg?accountName=NGUYEN%20KHANH%20MINH%20DANG&amount=&addInfo=Chuyen%20khoan%20gui%20`
);
const userStore = useUserStore();
const HelperStore = useHelperStore();
const GarageConstancesLanguage = computed(() => {
  return GarageConstances[HelperStore.languageCode];
});
const parkSlotFormData = defineModel("parkSlotFormData");
const formError = ref({});
const licensePlate = defineModel("licensePlate");
const licensePlateImageUrl = defineModel("licensePlateImageUrl");
const priceUse = ref();
const isUpdateCustomerLicensePlate = ref(false);
const isShowOutGarageBill = ref(false);
const VNLicensePlateRegex = /^([0-9]{2}|[0-9]{2}[A-Z]{1,2})([0-9]{4,5})$/;

/**
 * Hàm đặt trước vị trí bãi đỗ xe cho khách hàng
 * @param parkSlotId Id của vị trí đỗ xe muốn đặt
 */
async function orderParkSlot(parkSlotId) {
  if (parkSlotFormData.Vehicle != 0 && !parkSlotFormData.value.LicensePlate) {
    console.log(GarageConstancesLanguage.value);
    formError.value.LicensePlate =
      GarageConstancesLanguage.value.formError.MissingLicensePlate;
    toast.add({
      severity: "info",
      summary: GarageConstancesLanguage.value.missingFieldRequired,
      detail: GarageConstancesLanguage.value.formError.MissingLicensePlate,
      life: 3000,
    });
    return;
  }

  const formData = { ...parkSlotFormData.value };
  formData.ParkSlotState = 1;
  formData.VehicleInDate = getCurrentTimeString() + "Z";
  // console.log(parkSlotFormData.value);
  // Validate thông tin biển số xe nhập vào
  if (!validateLicensePlateRegex(formData.LicensePlate)) {
    formError.value.LicensePlate =
      GarageConstancesLanguage.value.formError.LicensePlateNotValid;
    confirm.require({
      message: GarageConstancesLanguage.value.formError.LicensePlateNotValid,
      header: GarageConstancesLanguage.value.formError.FieldNotValid,
      icon: "pi pi-exclamation-triangle text-[48px] mr-2",
      // rejectLabel: GarageConstancesLanguage.value.takePhotoAgain,
      rejectClass: "invisible",
      acceptLabel: GarageConstancesLanguage.value.accept,
      accept: () => {},
      reject: () => {},
    });
    return;
  }
  try {
    const response = await request({
      url: `ParkSlots/${parkSlotId}`,
      method: "PUT",
      data: formData,
    });
    emits("closeForm");
    emits("updateParkSlotSuccess");
    toast.add(GarageConstancesLanguage.value.toast.OrderParSlotSuccess);
    console.log(response, parkSlotFormData.value);
    isUpdateCustomerLicensePlate.value = false;
  } catch (error) {
    console.log(error);
  }
}

function validateLicensePlateRegex(licensePlate) {
  return VNLicensePlateRegex.test(licensePlate);
}

/**
 * Hàm hiển thị thông báo biển số xe vào và biển đã đăng ký không khớp
 */
function showDialogLicensePlateInNotValid() {
  confirm.require({
    message: GarageConstancesLanguage.value.formError.LicensePlateInNotMatch,
    header: "Confirmation",
    icon: "pi pi-exclamation-triangle text-[48px] mr-2",
    rejectProps: {
      label: GarageConstancesLanguage.value.takePhotoAgain,
      severity: "danger",
      outlined: true,
    },
    rejectLabel: GarageConstancesLanguage.value.takePhotoAgain,
    acceptLabel: GarageConstancesLanguage.value.updateCustomerLicensePlate,
    accept: () => {
      isUpdateCustomerLicensePlate.value = true;
    },
    reject: () => {
      isUpdateCustomerLicensePlate.value = false;
    },
  });
}

function showDialogLicensePlateOutNotValid() {
  confirm.require({
    message: GarageConstancesLanguage.value.formError.LicensePlateOutNotMatch,
    header: "Confirmation",
    icon: "pi pi-exclamation-triangle text-[48px] mr-2",

    // rejectLabel: GarageConstancesLanguage.value.takePhotoAgain,
    acceptLabel: GarageConstancesLanguage.value.accept,
    rejectClass: "invisible",
    acceptClass:
      "bg-red-500 dark:bg-red-400 border border-red-500 dark:border-red-400 focus:outline-none focus:outline-offset-0 focus:ring-1 hover:bg-red-600 dark:hover:bg-red-300 hover:border-red-600 dark:hover:border-red-300 focus:ring-red-500 dark:focus:ring-red-400",
    accept: () => {
      isUpdateCustomerLicensePlate.value = false;
    },
    // reject: () => {
    //   isUpdateCustomerLicensePlate.value = false;
    // },
  });
}

async function enterVehicleToGarage(parkSlotId) {
  try {
    if (licensePlate.value != parkSlotFormData.value.LicensePlate) {
      showDialogLicensePlateInNotValid();
      return;
    }
    const formData = { ...parkSlotFormData.value };
    formData.ParkSlotState = 2;
    formData.VehicleInDate = getCurrentTimeString();
    console.log(parkSlotFormData.value);
    const response = await request({
      url: `ParkSlots/${parkSlotId}`,
      method: "PUT",
      data: formData,
    });
    emits("closeForm");
    emits("updateParkSlotSuccess");

    console.log(response, parkSlotFormData.value);
  } catch (error) {
    console.log(error);
  }
}

async function updateParkSlotOrder(parkSlotId) {
  try {
    const formData = { ...parkSlotFormData.value };
    formData.ParkSlotState = 1;
    console.log(parkSlotFormData.value);
    // formData.VehicleInDate = formData.VehicleInDate.replace("+07:00", "");
    console.log(formData.VehicleInDate);
    const response = await request({
      url: `ParkSlots/${parkSlotId}`,
      method: "PUT",
      data: formData,
    });
    emits("closeForm");
    emits("updateParkSlotSuccess");
    toast.add(GarageConstancesLanguage.value?.toast?.UpdatePreOrderSuccess);
    console.log(response, parkSlotFormData.value);
  } catch (error) {
    console.log(error);
  }
}

function showOutGarageBill() {
  if (licensePlate.value != parkSlotFormData.value.LicensePlate) {
    showDialogLicensePlateOutNotValid();
    return;
  }
  isShowOutGarageBill.value = true;
  const timeNow = getCurrentTimeString();
  const timeOut = new Date(timeNow);
  const timeIn = new Date(parkSlotFormData.value.VehicleInDate);
  const time = timeOut.getTime() - timeIn.getTime();
  console.log("time in", timeIn);
  console.log("time out", timeOut);
  const hours = Math.ceil(time / (60 * 60 * 1000));
  priceUse.value = caculatePrice(
    parkSlotFormData.value.VehicleInDate,
    timeNow,
    parkSlotFormData.value.Vehicle,
    2
  );

  billUrl.value = `https://api.vietqr.io/image/970407-19036744400010-jsBXndE.jpg?accountName=NGUYEN%20KHANH%20MINH%20DANG&amount=${priceUse.value}&addInfo=Chuyen%20khoan%20gui%20`;
}

function hideOutGarageBill() {
  isShowOutGarageBill.value = false;
  billUrl.value = "";
}

async function enterVehicleOutGarage(parkSlotId) {
  if (licensePlate.value != parkSlotFormData.value.LicensePlate) {
    showDialogLicensePlateNotValid();
    return;
  }
  const formData = { ...parkSlotFormData.value };
  formData.ParkSlotState = 0;
  formData.LicensePlate = "";
  const parkingHistoryData = { ...parkSlotFormData.value };
  parkingHistoryData.VehicleOutDate = getCurrentTimeString() + "Z";
  parkingHistoryData.Price = priceUse.value;
  console.log(parkSlotFormData.value);
  try {
    const parkingHistory = await request({
      url: "ParkingHistory",
      method: "POST",
      data: parkingHistoryData,
    });

    const response = await request({
      url: `ParkSlots/${parkSlotId}`,
      method: "PUT",
      data: formData,
    });
    emits("closeForm");
    emits("updateParkSlotSuccess");
    console.log(response, parkSlotFormData.value);
  } catch (error) {
    console.log(error);
  }
}

function caculatePrice(dateString1, dateString2, vehicle, ticketType) {
  console.log(dateString1, dateString2, vehicle, ticketType);
  if (!dateString2) {
    return;
  }
  const dateObject1 = new Date(dateString1);
  const dateObject2 = new Date(dateString2);
  if (dateObject1 >= dateObject2) {
    console.log(
      "Thời điểm xe vào không thể trùng hoặc lớn hơn thời điểm xe ra. Vui lòng kiểm tra lại cách truyền tham số."
    );
  }

  const date1 = dateObject1.getDate();
  const date2 = dateObject2.getDate();
  // Tính giá tiền cho ô tô
  if (vehicle == 2) {
    const time = dateObject2.getTime() - dateObject1.getTime();
    const hours = Math.ceil(time / (60 * 60 * 1000));
    console.log(hours);
    return price[ticketType][2].Hour * hours;
  } else {
    if (date2 > date1) {
      return price[ticketType][vehicle].OutDay * (date2 - date1);
    } else {
      if (dateObject2.getHours() <= 17) {
        return price[ticketType][vehicle].InDayBefore18;
      } else if (dateObject2.getHours() >= 18 && dateObject2.getHours() <= 23) {
        return price[ticketType][vehicle].InDayAfter18;
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
