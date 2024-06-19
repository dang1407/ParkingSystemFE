<template>
  <div
    class="w-full h-full bg-white rounded-2xl p-4 xs:overflow-y-scroll md:overflow-auto"
  >
    <h1 class="font-bold text-2xl xs:mb-2 md:mb-4">
      {{ UserInforConstanceLanguage.title }}
    </h1>
    <div v-if="userStore.role == 'employee' || userStore.role == 'admin'">
      <div>
        <div class="flex flex-col sm:flex-row gap-x-4">
          <div class="employee-form flex flex-col justify-between">
            <div class="flex justify-center mb-2">
              <img
                class="w-28 h-28 object-cover rounded-[50%]"
                v-if="userData.AvatarLink"
                :src="userData.AvatarLink"
                alt=""
              />
              <img
                class="h-28"
                v-else
                src="../../assets/imgs/anonymous_avatar.png"
                alt=""
              />
            </div>
            <div class="flex justify-center">
              <label
                for="avatar"
                class="flex min-h-basic-input max-w-52 bg-primary-500 px-4 py-3 rounded-md cursor-pointer hover:bg-primary-600 text-white"
              >
                <i class="pi pi-sign-out -rotate-90"></i>
                <span class="text-[1rem] flex-1 ml-[0.35rem] overflow-hidden">{{
                  userData?.AvatarFile?.name || employeeFormLabel.chooseImage
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
                  v-model="userData.EmployeeCode"
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
                  v-model="userData.FullName"
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
                v-model="userData.Department"
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
              v-model="userData.TitleName"
            >
            </Dropdown>
            <small class="text-[red] font-bold" v-show="formError?.TitleName">
              {{ formError?.TitleName }}
            </small>
          </div>
          <div class="flex flex-col sm:flex-row gap-2">
            <div class="flex flex-col gap-1">
              <label class="font-bold" for="bankaccount"
                >{{ employeeFormLabel.BankAccount }}
                <span class="text-required text-[1.5rem]">*</span>
              </label>
              <InputText
                :invalid="formError?.BankAccount ? true : false"
                class="h-basic-input w-[100%]"
                id="bankaccount"
                v-model="userData.BankAccount"
              >
              </InputText>
              <small
                class="text-[red] font-bold"
                v-show="formError?.BankAccount"
                >{{ formError?.BankAccount }}</small
              >
            </div>
            <div class="flex-1 flex flex-col sm:flex-row gap-2">
              <div class="w-[100%] flex flex-col gap-1">
                <label class="font-bold" for="bankname"
                  >{{ employeeFormLabel.BankName }}
                  <span class="text-required text-[1.5rem]">*</span>
                </label>
                <InputText
                  class="h-basic-input"
                  :invalid="formError?.BankName ? true : false"
                  id="bankname"
                  v-model="userData.BankName"
                >
                </InputText>
                <small
                  class="text-[red] font-bold"
                  v-show="formError?.BankName"
                  >{{ formError?.BankName }}</small
                >
              </div>
              <div class="w-[100%] flex flex-col gap-1">
                <label class="font-bold" for="bankbranch"
                  >{{ employeeFormLabel.BankBranch }}
                  <span class="invisible text-[1.5rem]">*</span>
                </label>
                <InputText
                  class="h-basic-input"
                  id="bankaccount"
                  v-model="userData.BankBranch"
                >
                </InputText>
                <small
                  class="text-[red] font-bold"
                  v-show="formError?.BankBranch"
                ></small>
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-2">
            <div class="flex flex-col gap-1">
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
                v-model="userData.PersonalIdentification"
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
              <div class="w-[100%] flex flex-col gap-1">
                <label class="font-bold" for="piCreatedPlace">{{
                  employeeFormLabel.PICreatedPlace
                }}</label>
                <InputText
                  :invalid="formError?.PICreatedPlace ? true : false"
                  class="h-basic-input"
                  inputId="piCreatedPlace"
                  v-model="userData.PICreatedPlace"
                  dateFormat="dd/mm/yy"
                  showButtonBar
                />
                <small
                  class="text-[red] font-bold"
                  v-show="formError?.PICreatedPlace"
                ></small>
              </div>
              <div class="w-[100%] flex flex-col gap-1">
                <label class="font-bold" for="picreateddate">{{
                  employeeFormLabel.PICreatedDate
                }}</label>
                <Calendar
                  :invalid="formError?.PICreatedDate ? true : false"
                  class="h-basic-input calendar-container"
                  inputId="picreateddate"
                  v-model="userData.PICreatedDate"
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
            <div class="">
              <div class="mb-2">{{ employeeFormLabel.Gender }}</div>
              <div class="w-[100%] flex gap-3">
                <div>
                  <RadioButton
                    v-model="userData.Gender"
                    name="Gender"
                    :value="0"
                    inputId="female"
                  ></RadioButton>
                  <label class="ml-1" for="female">{{ genderLabel[0] }}</label>
                </div>
                <div>
                  <RadioButton
                    v-model="userData.Gender"
                    name="Gender"
                    :value="1"
                    inputId="male"
                  ></RadioButton>
                  <label class="ml-1" for="male">{{ genderLabel[1] }}</label>
                </div>
                <div>
                  <RadioButton
                    v-model="userData.Gender"
                    name="Gender"
                    :value="2"
                    inputId="other"
                  ></RadioButton>
                  <label class="ml-1" for="other">{{ genderLabel[2] }}</label>
                </div>
              </div>
            </div>
            <div class="flex flex-col flex-1 gap-y-2 sm:flex-row sm:gap-2">
              <div class="flex flex-col flex-1">
                <label class="font-bold" for="mobile">{{
                  employeeFormLabel.Mobile
                }}</label>
                <InputText
                  :invalid="formError?.Mobile ? true : false"
                  class="h-basic-input"
                  id="mobile"
                  v-model="userData.Mobile"
                ></InputText>
                <small class="text-[red] font-bold" v-show="formError?.Mobile">
                  {{ formError?.Mobile }}
                </small>
              </div>

              <div class="flex flex-col flex-1">
                <label class="font-bold" for="email">Email</label>
                <InputText
                  :invalid="formError?.Email ? true : false"
                  class="h-basic-input"
                  id="email"
                  v-model="userData.Email"
                ></InputText>
                <small class="text-[red] font-bold" v-show="formError?.Email">
                  {{ formError?.Email }}
                </small>
              </div>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row gap-2">
            <div class="sm:w-64 flex flex-col gap-1">
              <label class="font-bold" for="dateofbirth">{{
                employeeFormLabel.DateOfBirth
              }}</label>
              <Calendar
                :invalid="formError?.DateOfBirth ? true : false"
                class="h-basic-input calendar-container"
                inputId="dateofbirth"
                v-model="userData.DateOfBirth"
                dateFormat="dd/mm/yy"
                showButtonBar
                showIcon
                :showOnFocus="false"
              />
              <small
                class="text-[red] font-bold"
                v-show="formError?.DateOfBirth"
                >{{ formError?.DateOfBirth }}</small
              >
            </div>
            <div class="flex flex-col flex-1 gap-1">
              <label class="font-bold" for="address">{{
                employeeFormLabel.Address
              }}</label>
              <InputText
                class="h-basic-input"
                v-model="userData.Address"
              ></InputText>
              <small class="text-[red] font-bold" v-show="formError?.Address">
                {{ formError?.Address }}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="userStore.role == 'parkmember'">
      <div class="flex flex-col sm:flex-row gap-x-4">
        <!-- Ảnh đại diện -->
        <div class="parkMember-form flex flex-col justify-between">
          <div class="flex justify-center mb-2">
            <img
              class="w-28 h-28 object-cover rounded-[50%]"
              v-if="userData.AvatarLink"
              :src="userData.AvatarLink"
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
                userData?.AvatarFile?.name || parkMemberFormLabel.chooseImage
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
                v-model="userData.ParkMemberCode"
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
                v-model="userData.FullName"
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
              v-model="userData.LicensePlate"
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
              v-model="userData.PersonalIdentification"
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
            <div class="w-[100%] flex flex-col gap-1">
              <label class="font-bold" for="piCreatedPlace">{{
                parkMemberFormLabel.PICreatedPlace
              }}</label>
              <InputText
                :invalid="formError?.PICreatedPlace ? true : false"
                class="h-basic-input"
                inputId="piCreatedPlace"
                v-model="userData.PICreatedPlace"
                dateFormat="dd/mm/yy"
                showButtonBar
              />
              <small
                class="text-[red] font-bold"
                v-show="formError?.PICreatedPlace"
              ></small>
            </div>
            <div class="w-[100%] flex flex-col gap-1">
              <label class="font-bold" for="picreateddate">{{
                parkMemberFormLabel.PICreatedDate
              }}</label>
              <Calendar
                :invalid="formError?.PICreatedDate ? true : false"
                class="h-basic-input calendar-container"
                inputId="picreateddate"
                v-model="userData.PICreatedDate"
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
                  v-model="userData.Gender"
                  name="Gender"
                  :value="0"
                  inputId="female"
                ></RadioButton>
                <label class="ml-1" for="female">{{ genderLabel[0] }}</label>
              </div>
              <div>
                <RadioButton
                  v-model="userData.Gender"
                  name="Gender"
                  :value="1"
                  inputId="male"
                ></RadioButton>
                <label class="ml-1" for="male">{{ genderLabel[1] }}</label>
              </div>
              <div>
                <RadioButton
                  v-model="userData.Gender"
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
                v-model="userData.Mobile"
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
                v-model="userData.Email"
              ></InputText>
              <small class="text-[red] font-bold" v-show="formError?.Email">
                {{ formError?.Email }}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAxios } from "@/hooks/useAxios";
import { useUserStore } from "@/stores/UserStore";
import { useHelperStore } from "@/stores/HelperStore.js";
import { UserInforConstance } from "./UserConstance.js";
import { employeeConstants } from "@/views/employee/EmployeeConstants";
import { EmployeeService } from "../employee/EmployeeService.js";
import { parkMemberConstants } from "../parkmember/ParkMemberConstants.js";
import { genderLanguage } from "@/constants/gender";
import Dropdown from "primevue/dropdown";
import Calendar from "primevue/calendar";
import InputText from "primevue/inputtext";
import RadioButton from "primevue/radiobutton";
const HelperStore = useHelperStore();
const userStore = useUserStore();
const { request } = useAxios();
const { departmentOptions, getDepartmentOptionsAsync } = EmployeeService();
const UserInforConstanceLanguage = computed(() => {
  return UserInforConstance[HelperStore.languageCode];
});
const employeeFormLabel = computed(() => {
  return employeeConstants[HelperStore.languageCode].formLabel;
});
const genderLabel = computed(() => {
  return genderLanguage[HelperStore.languageCode];
});
const parkMemberFormLabel = computed(() => {
  return parkMemberConstants[HelperStore.languageCode].formLabel;
});
const userData = ref({});
const formData = ref({});
const formError = ref({});
const titleDropdownOptions = ref([]);
async function upLoadImage(event) {
  // console.log(event);
  const file = event.target.files[0];
  currentUrl.value = URL.createObjectURL(file);
}

async function getUserInfor() {
  try {
    const response = await request({
      url: "Account/infor",
      method: "GET",
    });
    formData.value = response[0];
  } catch (error) {}
}

onMounted(async () => {
  try {
    const response = await request({
      url: "Account/infor",
      method: "GET",
    });
    userData.value = response[0];
  } catch (error) {
    console.log(error);
  }
});
</script>

<style lang="scss" scoped></style>
