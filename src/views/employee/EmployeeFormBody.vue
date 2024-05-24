<template>
  <div>
    <div class="flex flex-col sm:flex-row gap-x-4">
      <!-- Ảnh đại diện -->
      <div class="employee-form flex flex-col justify-between">
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
              employeeFormData?.AvatarFile?.name ||
              employeeFormLabel.chooseImage
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
            <label class="font-bold" for="employee-code"
              >{{ employeeFormLabel.EmployeeCode }}
              <span class="text-required text-[1.5rem] font-bold pt-1"
                >*</span
              ></label
            >
            <InputText
              :invalid="formError?.EmployeeCode ? true : false"
              id="employee-code"
              v-model="employeeCode"
              class="h-basic-input"
              aria-describedby="employee-code-help"
            />
            <small
              class="text-[red] font-bold"
              v-show="formError?.EmployeeCode"
              id="employee-code-help"
              >{{ formError?.EmployeeCode }}</small
            >
          </div>
          <div class="flex flex-col flex-1 gap-1">
            <label class="font-bold" for="employee-full-name"
              >{{ employeeFormLabel.FullName }}
              <span class="text-required text-[1.5rem]">*</span></label
            >
            <InputText
              :invalid="formError?.FullName ? true : false"
              class="h-[36px]"
              id="employee-full-name"
              v-model="employeeFullName"
              aria-describedby="employee-full-name-help"
            />
            <small
              class="text-[red] font-bold"
              v-show="formError?.FullName"
              id="employee-full-name-help"
              >{{ formError?.FullName }}</small
            >
          </div>
        </div>
        <div class="flex-col gap-1 flex">
          <label class="font-bold" for="employee-department"
            >{{ employeeFormLabel.Department }}
            <span class="text-required text-[1.5rem]">*</span></label
          >
          <Dropdown
            :invalid="formError.Department ? true : false"
            :options="departmentOptions"
            inputId="employee-department"
            v-model="department"
            class="h-basic-input"
            aria-describedby="employee-department-help"
          />
          <small
            class="text-[red] font-bold"
            v-show="formError?.Department"
            id="employee-department-help"
            >{{ formError?.Department }}</small
          >
        </div>
      </div>
    </div>

    <div class="mt-4 flex flex-col gap-y-3">
      <!-- Chức danh -->
      <div class="flex flex-col flex-1">
        <label class="font-bold" for="position"
          >{{ employeeFormLabel.Position }}
          <span class="text-required text-[1.5rem]">*</span>
        </label>
        <Dropdown
          :options="titleDropdownOptions"
          :invalid="formError?.TitleName ? true : false"
          :empty-message="employeeFormLabel.ChooseDepartmentBefore"
          class="h-basic-input"
          id="position"
          v-model="titleName"
        >
        </Dropdown>
        <small class="text-[red] font-bold" v-show="formError?.TitleName">
          {{ formError?.TitleName }}
        </small>
      </div>
      <!-- Số tài khoản ngân hàng, tên ngân hàng, chi nhánh  -->
      <div class="flex flex-col sm:flex-row gap-2">
        <div class="sm:w-64 flex flex-col gap-1">
          <label class="font-bold" for="bankaccount"
            >{{ employeeFormLabel.BankAccount }}
            <span class="text-required text-[1.5rem]">*</span>
          </label>
          <InputText
            :invalid="formError?.BankAccount ? true : false"
            class="h-basic-input w-[100%]"
            id="bankaccount"
            v-model="bankaccount"
          >
          </InputText>
          <small class="text-[red] font-bold" v-show="formError?.BankAccount">{{
            formError?.BankAccount
          }}</small>
        </div>
        <div class="flex-1 flex flex-col sm:flex-row gap-2">
          <div class="w-[100%] sm:max-w-64 flex flex-col gap-1">
            <label class="font-bold" for="bankname"
              >{{ employeeFormLabel.BankName }}
              <span class="text-required text-[1.5rem]">*</span>
            </label>
            <InputText
              class="h-basic-input"
              :invalid="formError?.BankName ? true : false"
              id="bankname"
              v-model="bankname"
            >
            </InputText>
            <small class="text-[red] font-bold" v-show="formError?.BankName">{{
              formError?.BankName
            }}</small>
          </div>
          <div class="w-[100%] sm:max-w-64 flex flex-col gap-1">
            <label class="font-bold" for="bankbranch"
              >{{ employeeFormLabel.BankBranch }}
              <span class="invisible text-[1.5rem]">*</span>
            </label>
            <InputText
              class="h-basic-input"
              id="bankaccount"
              v-model="bankbranch"
            >
            </InputText>
            <small
              class="text-[red] font-bold"
              v-show="formError?.BankBranch"
            ></small>
          </div>
        </div>
      </div>

      <!-- Số CCCD, Nơi cấp, Ngày cấp,  -->
      <div class="flex flex-col sm:flex-row gap-2">
        <div class="sm:w-64 flex flex-col gap-1">
          <label
            class="font-bold"
            for="employee-full-name"
            v-tooltip="employeeFormLabel.PersonalIdentificationTooltip"
            >{{ employeeFormLabel.PersonalIdentification }}</label
          >
          <InputText
            :invalid="formError?.PersonalIdentification ? true : false"
            class="h-[36px]"
            id="employee-cccd"
            v-model="personalIdentification"
            aria-describedby="employee-full-name-help"
          />
          <small
            class="text-[red] font-bold"
            v-show="formError?.PersonalIdentification"
            id="employee-full-name-help"
            >formError?.PersonalIdentification</small
          >
        </div>
        <div class="flex-1 flex flex-col sm:flex-row gap-2">
          <div class="w-[100%] sm:max-w-64 flex flex-col gap-1">
            <label class="font-bold" for="piCreatedPlace">{{
              employeeFormLabel.PICreatedPlace
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
              employeeFormLabel.PICreatedDate
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
              id="employee-full-name-help"
              >{{ formError?.PICreatedDate }}</small
            >
          </div>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row gap-2">
        <!-- Giới tính -->
        <div class="sm:w-64">
          <div class="mb-2">{{ employeeFormLabel.Gender }}</div>
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
              employeeFormLabel.Mobile
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
      <!-- Ngày sinh, Địa chỉ -->
      <div class="flex flex-col sm:flex-row gap-2">
        <div class="sm:w-64 flex flex-col gap-1">
          <label class="font-bold" for="dateofbirth">{{
            employeeFormLabel.DateOfBirth
          }}</label>
          <Calendar
            :invalid="formError?.DateOfBirth ? true : false"
            class="h-basic-input calendar-container"
            inputId="dateofbirth"
            v-model="dateOfBirth"
            dateFormat="dd/mm/yy"
            showButtonBar
            showIcon
            :showOnFocus="false"
          />
          <small class="text-[red] font-bold" v-show="formError?.DateOfBirth">{{
            formError?.DateOfBirth
          }}</small>
        </div>
        <div class="flex flex-col flex-1 gap-1">
          <label class="font-bold" for="address">{{
            employeeFormLabel.Address
          }}</label>
          <InputText class="h-basic-input" v-model="address"></InputText>
          <small class="text-[red] font-bold" v-show="formError?.Address">
            {{ formError?.Address }}
          </small>
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
import { employeeConstants } from "./EmployeeConstants";
import { EmployeeService } from "./EmployeeService";
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
const employeeCode = defineModel("employeeCode");
const employeeFullName = defineModel("employeeFullName");
const avatarLink = defineModel("avatarLink");
// const [avatarFile, avatarFileModifiers] = defineModel("avatarFile", {});
const avatarFile = ref();
const currentUrl = ref();
const formError = defineModel("formError");
const department = defineModel("department");
const gender = defineModel("gender");
const titleName = defineModel("titleName");
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
const employeeFormLabel = computed(() => {
  return employeeConstants[helperStore.languageCode].formLabel;
});
const genderLabel = computed(() => {
  return genderLanguage[helperStore.languageCode];
});

const titleDropdownOptions = computed(() => {
  const emptyArray = [];

  for (let i = 0; i < props.titleOptions.length; i++) {
    if (props.titleOptions[i].DepartmentName == department.value) {
      emptyArray.push(props.titleOptions[i].TitleName);
    }
  }
  return emptyArray;
});

const { employeeFormData } = EmployeeService();

async function upLoadImage(event) {
  // console.log(event);
  const file = event.target.files[0];
  employeeFormData.value.AvatarFile = file;
  currentUrl.value = URL.createObjectURL(file);
}

onMounted(async () => {
  await nextTick();
  const employeeCodeInput = document.getElementById("employee-code");
  employeeCodeInput.focus();
  employeeCodeInput.select();
});
</script>

<style lang="scss" scoped>
.employee-form {
  div[data-pc-name="fileupload"] {
    display: flex;
    justify-content: center;
  }
}

.employee-form-col1 {
  width: 16rem;
}
</style>
