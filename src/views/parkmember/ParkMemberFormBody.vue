<template>
  <div>
    <div class="flex flex-col sm:flex-row gap-x-4">
      <!-- Ảnh đại diện -->
      <div class="parkMember-form flex flex-col justify-between">
        <div class="flex justify-center mb-2">
          <img
            class="w-28 h-28 object-cover rounded-[50%]"
            v-if="currentUrl || avatarLink"
            :src="currentUrl ? currentUrl : avatarLink"
            alt=""
          />
          <img
            class="h-28"
            v-else
            src="../../assets/imgs/anonymous_avatar.png"
            alt=""
          />
        </div>
        <!-- <FileUpload
          class="flex justify-center"
          mode="basic"
          choose-label="Chọn hình ảnh"
          accept="image/*"
          :maxFileSize="1000000"
          v-model="avatarFile"
        >
        </FileUpload> -->
        <div class="flex justify-center">
          <label
            for="avatar"
            class="flex min-h-basic-input max-w-52 bg-primary-500 px-4 py-3 rounded-md cursor-pointer hover:bg-primary-600 text-white"
          >
            <i class="pi pi-sign-out -rotate-90"></i>
            <span class="text-[1rem] flex-1 ml-[0.35rem] overflow-hidden">{{
              parkMemberFormData?.AvatarFile?.name ||
              parkMemberFormLabel.chooseImage
            }}</span>
          </label>
          <input
            type="file"
            id="avatar"
            accept="image/*"
            class="w-0 h-0"
            @change="upLoadImage"
          />
        </div>
      </div>
      <!-- Mã nhân viên, Họ và tên, Đơn vị -->
      <div class="flex flex-col flex-1 justify-between">
        <div class="flex gap-2 flex-col sm:flex-row">
          <div class="flex flex-col gap-1">
            <label class="font-bold" for="parkMember-code"
              >{{ parkMemberFormLabel.ParkMemberCode }}
              <span class="text-required text-[1.5rem] font-bold pt-1"
                >*</span
              ></label
            >
            <InputText
              :invalid="formError?.ParkMemberCode ? true : false"
              id="parkMember-code"
              v-model="parkMemberCode"
              class="h-basic-input"
              aria-describedby="parkMember-code-help"
            />
            <small
              class="text-[red] font-bold"
              v-show="formError?.ParkMemberCode"
              id="parkMember-code-help"
              >{{ formError?.ParkMemberCode }}</small
            >
          </div>
          <div class="flex flex-col flex-1 gap-1">
            <label class="font-bold" for="parkMember-full-name"
              >{{ parkMemberFormLabel.FullName }}
              <span class="text-required text-[1.5rem]">*</span></label
            >
            <InputText
              :invalid="formError?.FullName ? true : false"
              class="h-[36px]"
              id="parkMember-full-name"
              v-model="parkMemberFullName"
              aria-describedby="parkMember-full-name-help"
            />
            <small
              class="text-[red] font-bold"
              v-show="formError?.FullName"
              id="parkMember-full-name-help"
              >{{ formError?.FullName }}</small
            >
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <label class="font-bold" for="parkMember-code"
            >{{ parkMemberFormLabel.LicensePlate }}
            <span class="text-required text-[1.5rem] font-bold pt-1"
              >*</span
            ></label
          >
          <InputText
            :invalid="formError?.LicensePlate ? true : false"
            id="parkMember-code"
            v-model="licensePlate"
            class="h-basic-input"
            aria-describedby="parkMember-code-help"
          />
          <small
            class="text-[red] font-bold"
            v-show="formError?.LicensePlate"
            id="parkMember-code-help"
            >{{ formError?.LicensePlate }}</small
          >
        </div>
      </div>
    </div>

    <div class="mt-4 flex flex-col gap-y-3">
      <!-- Số CCCD, Nơi cấp, Ngày cấp,  -->
      <div class="flex flex-col sm:flex-row gap-2">
        <div class="sm:w-64 flex flex-col gap-1">
          <label
            class="font-bold"
            for="parkMember-full-name"
            v-tooltip="parkMemberFormLabel.PersonalIdentificationTooltip"
            >{{ parkMemberFormLabel.PersonalIdentification }}</label
          >
          <InputText
            :invalid="formError?.PersonalIdentification ? true : false"
            class="h-[36px]"
            id="parkMember-cccd"
            v-model="personalIdentification"
            aria-describedby="parkMember-full-name-help"
          />
          <small
            class="text-[red] font-bold"
            v-show="formError?.PersonalIdentification"
            id="parkMember-full-name-help"
            >formError?.PersonalIdentification</small
          >
        </div>
        <div class="flex-1 flex flex-col sm:flex-row gap-2">
          <div class="w-[100%] sm:max-w-64 flex flex-col gap-1">
            <label class="font-bold" for="piCreatedPlace">{{
              parkMemberFormLabel.PICreatedPlace
            }}</label>
            <InputText
              :invalid="formError?.PICreatedPlace ? true : false"
              class="h-basic-input"
              inputId="piCreatedPlace"
              v-model="piCreatedPlace"
              dateFormat="dd/mm/yy"
              showButtonBar
            />
            <small
              class="text-[red] font-bold"
              v-show="formError?.PICreatedPlace"
            ></small>
          </div>
          <div class="w-[100%] sm:max-w-64 flex flex-col gap-1">
            <label class="font-bold" for="picreateddate">{{
              parkMemberFormLabel.PICreatedDate
            }}</label>
            <Calendar
              :invalid="formError?.PICreatedDate ? true : false"
              class="h-basic-input calendar-container"
              inputId="picreateddate"
              v-model="piCreatedDate"
              dateFormat="dd/mm/yy"
              showButtonBar
              showIcon
              :showOnFocus="false"
            />
            <small
              class="text-[red] font-bold"
              v-show="formError?.PICreatedDate"
              id="parkMember-full-name-help"
              >{{ formError?.PICreatedDate }}</small
            >
          </div>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-2">
        <!-- Giới tính -->
        <div class="sm:w-64">
          <div class="mb-2">{{ parkMemberFormLabel.Gender }}</div>
          <div class="w-[100%] flex gap-3">
            <div>
              <RadioButton
                v-model="gender"
                name="Gender"
                :value="0"
                inputId="female"
              ></RadioButton>
              <label class="ml-1" for="female">{{ genderLabel[0] }}</label>
            </div>
            <div>
              <RadioButton
                v-model="gender"
                name="Gender"
                :value="1"
                inputId="male"
              ></RadioButton>
              <label class="ml-1" for="male">{{ genderLabel[1] }}</label>
            </div>
            <div>
              <RadioButton
                v-model="gender"
                name="Gender"
                :value="2"
                inputId="other"
              ></RadioButton>
              <label class="ml-1" for="other">{{ genderLabel[2] }}</label>
            </div>
          </div>
        </div>
        <div class="flex flex-col flex-1 gap-y-2 sm:flex-row sm:gap-2">
          <!-- Số điện thoại-->
          <div class="flex flex-col flex-1">
            <label class="font-bold" for="mobile">{{
              parkMemberFormLabel.Mobile
            }}</label>
            <InputText
              :invalid="formError?.Mobile ? true : false"
              class="h-basic-input"
              id="mobile"
              v-model="mobile"
            ></InputText>
            <small class="text-[red] font-bold" v-show="formError?.Mobile">
              {{ formError?.Mobile }}
            </small>
          </div>

          <!-- Email-->
          <div class="flex flex-col flex-1">
            <label class="font-bold" for="email">Email</label>
            <InputText
              :invalid="formError?.Email ? true : false"
              class="h-basic-input"
              id="email"
              v-model="email"
            ></InputText>
            <small class="text-[red] font-bold" v-show="formError?.Email">
              {{ formError?.Email }}
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, computed } from "vue";
import InputText from "primevue/inputtext";
import Calendar from "primevue/calendar";
import FileUpload from "primevue/fileupload";
import Avatar from "primevue/avatar";
import Dropdown from "primevue/dropdown";
import RadioButton from "primevue/radiobutton";
import Button from "primevue/button";
import { parkMemberConstants } from "./ParkMemberConstants";
import { ParkMemberService } from "./ParkMemberService";
import { useHelperStore } from "@/stores/HelperStore";
import { genderLanguage } from "@/constants/gender";
const props = defineProps({
  departmentOptions: {
    type: Array,
    required: true,
  },
  titleOptions: {
    type: Array,
    required: true,
  },
});
const parkMemberCode = defineModel("parkMemberCode");
const parkMemberFullName = defineModel("parkMemberFullName");
const avatarLink = defineModel("avatarLink");
// const [avatarFile, avatarFileModifiers] = defineModel("avatarFile", {});
const avatarFile = ref();
const currentUrl = ref();
const licensePlate = defineModel("licensePlate");
const formError = defineModel("formError");
const department = defineModel("department");
const gender = defineModel("gender");
const dateOfBirth = defineModel("dateOfBirth");
const personalIdentification = defineModel("personalIdentification");
const piCreatedDate = defineModel("piCreatedDate");
const piCreatedPlace = defineModel("piCreatedPlace");
const address = defineModel("address");
const bankaccount = defineModel("bankAccount");
const bankbranch = defineModel("bankBranch");
const bankname = defineModel("bankName");
const mobile = defineModel("mobile");
const email = defineModel("email");
const helperStore = useHelperStore();
const parkMemberFormLabel = computed(() => {
  return parkMemberConstants[helperStore.languageCode].formLabel;
});
const genderLabel = computed(() => {
  return genderLanguage[helperStore.languageCode];
});

const { parkMemberFormData } = ParkMemberService();

async function upLoadImage(event) {
  // console.log(event);
  const file = event.target.files[0];
  parkMemberFormData.value.AvatarFile = file;
  currentUrl.value = URL.createObjectURL(file);
}

onMounted(async () => {
  await nextTick();
  const parkMemberCodeInput = document.getElementById("parkMember-code");
  parkMemberCodeInput.focus();
  parkMemberCodeInput.select();
});
</script>

<style lang="scss" scoped>
.parkMember-form {
  div[data-pc-name="fileupload"] {
    display: flex;
    justify-content: center;
  }
}

.parkMember-form-col1 {
  width: 16rem;
}
</style>
