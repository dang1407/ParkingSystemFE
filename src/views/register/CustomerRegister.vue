<template>
  <div class="w-full h-screen flex justify-center items-center">
    <div
      class="flex md:w-[70%] md:h-[95%] lg:px-8 lg:py-4 md:overflow-auto xs:w-full xs:h-full xs:overflow-y-scroll shadow-getcssscan-1 rounded-2xl"
    >
      <div
        class="min-h-full lg:w-[40%] sidebar:block xs:hidden flex justify-center items-center"
      >
        <div class="flex flex-col min-h-full justify-center">
          <h1
            class="text-primary-500 font-semibold text-center text-[1.5rem] sm:text-[2rem] mb-8"
          >
            MD Parking System
          </h1>
          <img
            class="max-w-[100%] max-h-[100%] rounded-xl"
            src="../../assets/imgs/logo-1.png"
            alt=""
          />
        </div>
      </div>
      <div class="flex-1 min-w-52 xs:p-8">
        <div class="w-[100%] sm:min-h-[100%] flex flex-col justify-center">
          <div
            class="absolute xs:hidden lg:block right-4 sm:right-12 top-4 sm:top-6"
          >
            <Dropdown
              :options="languageDictionary"
              option-label="label"
              v-model="helperStore.language"
            ></Dropdown>
          </div>
          <!-- <div class="logo-box flex justify-center">
            <img
              class="xs:h-[100px] lg:h-[130px]"
              src="../../assets/imgs/logo-1.png"
              alt=""
            />
          </div> -->

          <h1
            class="text-primary-500 font-semibold text-center text-[1.5rem] sm:text-[2rem] mb-8"
          >
            {{ registerConstancesLanguage.register }}
          </h1>

          <div class="w-[100%]">
            <div class="flex gap-x-4">
              <div class="w-[55%]">
                <label for="fullname" class="font-[500] flex"
                  >{{ registerConstancesLanguage?.formLabel?.fullName }}
                  <span class="text-required font-bold pl-[2px]">*</span>
                </label>
                <InputText
                  :invalid="formError.FullName ? true : false"
                  v-model="formData.FullName"
                  id="fullname"
                  class="h-[36px] w-[100%]"
                ></InputText>
                <br />
                <small
                  v-show="formError.FullName"
                  class="block h-[1rem] text-[red]"
                  >{{ formError.FullName }}</small
                >
              </div>
              <div class="w-[45%]">
                <label
                  for="personalIdentification"
                  class="font-[500] flex w-fit"
                  v-tooltip.top="
                    registerConstancesLanguage.formLabel
                      .personalIdentificationTooltip
                  "
                  >{{
                    registerConstancesLanguage?.formLabel
                      ?.personalIdentification
                  }}
                  <span class="text-required font-bold pl-[2px]">*</span>
                </label>
                <InputText
                  :invalid="formError.PersonalIdentification ? true : false"
                  v-model="formData.PersonalIdentification"
                  id="personalIdentification"
                  class="h-[36px] w-[100%]"
                ></InputText>
                <br />
                <small
                  :v-show="formError.PersonalIdentification"
                  class="block h-[1rem] text-[red]"
                  >{{ formError.PersonalIdentification }}</small
                >
              </div>
            </div>
            <div
              class="flex xl:flex-row xs:flex-col gap-x-2"
              :class="{
                'mt-6': formError.PersonalIdentification ? true : false,
              }"
            >
              <div class="flex gap-x-2 sm:w-full xl:w-auto">
                <div class="min-w-52 xl:w-auto w-full">
                  <label for="licenseplate" class="font-[500] flex"
                    >{{ registerConstancesLanguage?.formLabel?.licensePlate }}
                    <span class="text-required font-bold pl-[2px]">*</span>
                  </label>
                  <InputText
                    :invalid="formError.LicensePlate ? true : false"
                    v-model="formData.LicensePlate"
                    id="licenseplate"
                    class="h-[36px] w-[100%]"
                  ></InputText>
                  <br />
                  <small
                    v-show="formError.LicensePlate"
                    class="block h-[1rem] text-[red]"
                    >{{ formError.LicensePlate }}</small
                  >
                </div>
                <!-- <div class="min-w-40 sm:w-[50%] xl:w-auto">
                  <label for="vehicle" class="font-[500] flex"
                    >{{ registerConstancesLanguage?.formLabel?.vehicle }}
                    <span class="text-required font-bold pl-[2px]">*</span>
                  </label>
                  <Dropdown
                    :invalid="formError.VehicleOption ? true : false"
                    class="w-full"
                    :options="registerConstancesLanguage?.vehicleOptions"
                    option-label="name"
                    v-model="formData.VehicleOption"
                  ></Dropdown>
                  <br />
                  <small class="block h-[1rem] text-[red]">{{
                    formError.VehicleOption
                  }}</small>
                </div> -->
              </div>

              <!-- Mobile -->
              <div class="flex-1">
                <label for="mobile" class="font-[500] flex"
                  >{{ registerConstancesLanguage?.formLabel?.mobile }}
                  <span class="text-required font-bold pl-[2px]">*</span>
                </label>
                <InputText
                  :invalid="formError.Mobile ? true : false"
                  v-model="formData.Mobile"
                  id="mobile"
                  class="h-[36px] w-[100%]"
                ></InputText>
                <small
                  v-show="formError.Mobile"
                  class="block h-[1rem] text-[red]"
                  >{{ formError.Mobile }}</small
                >
              </div>
            </div>
            <div
              class="mb-4 mt-2"
              :class="{ 'mt-4': formError.Mobile || formError.LicensePlate }"
            >
              <label for="company" class="font-[500] flex"
                >{{ registerConstancesLanguage?.formLabel?.company }}
                <span class="text-required font-bold pl-[2px]">*</span>
              </label>
              <Dropdown
                class="w-full"
                :options="companyData"
                option-label="CompanyName"
                v-model="companySelected"
              ></Dropdown>
              <br />
              <small class="block h-[1rem text-[red]"></small>
            </div>

            <!-- UserName -->
            <div class="">
              <label for="username" class="font-[500] flex"
                >{{ registerConstancesLanguage?.formLabel.userName }}
                <span class="text-required font-bold pl-[2px]">*</span>
              </label>
              <InputText
                :invalid="formError.UserName ? true : false"
                v-model="formData.UserName"
                id="username"
                class="h-[36px] w-[100%]"
              ></InputText>
              <br />
              <small
                v-show="formError.UserName"
                class="block h-[1rem] text-[red]"
                >{{ formError.UserName }}</small
              >
            </div>

            <div class="mt-4">
              <label for="password" class="font-[500] flex"
                >{{ registerConstancesLanguage?.formLabel?.password }}
                <span class="text-required font-bold pl-[2px]">*</span>
              </label>
              <Password
                :invalid="formError?.Password ? true : false"
                v-model="formData.Password"
                :feedback="false"
                :toggle-mask="true"
                id="password"
                class="h-[36px] w-[100%]"
                type="password"
                placeholder="Password"
              ></Password>
              <small
                v-show="formError?.Password"
                class="block h-[1rem] text-[red]"
                >{{ formError?.Password }}</small
              >
            </div>

            <div class="mt-4">
              <label for="password" class="font-[500] flex"
                >{{ registerConstancesLanguage?.formLabel?.confirmPassword }}
                <span class="text-required font-bold pl-[2px]">*</span>
              </label>
              <Password
                v-model="formData.ConfirmPassword"
                :feedback="false"
                :toggle-mask="true"
                id="confirmPassword"
                class="h-[36px] w-[100%]"
                type="password"
                placeholder="Password"
              ></Password>
              <small class="block h-[1rem] invisible text-[red]">{{}}</small>
            </div>

            <div class="flex justify-between mt-2">
              <div class=""></div>
              <div class="text-primary-500">
                <router-link to="/login">
                  {{ registerConstancesLanguage.login }}
                </router-link>
              </div>
            </div>

            <div class="mt-8 mb-4">
              <Button
                v-if="!isPending"
                class="w-[100%] h-12 rounded-[40px]"
                @click="registerParkMember"
                >{{ registerConstancesLanguage.register }}</Button
              >
              <Button
                v-else
                severity="secondary"
                class="w-[100%] h-12 rounded-[40px]"
                disabled
                >{{
              }}</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import Password from "primevue/password";
import InputText from "primevue/inputtext";
import { useHelperStore } from "@/stores/HelperStore";
import { CustomerRegisterService } from "./CustomerRegisterService.js";
import { languageDictionary } from "@/constants/languages";
import { useAxios } from "@/hooks/useAxios.js";
import { method } from "lodash-es";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import { Role } from "@/router/Role.js";
const toast = useToast();
const router = useRouter();
const helperStore = useHelperStore();
const { request } = useAxios();
const {
  RegisterConstances,
  formData,
  formError,
  isPending,
  registerConstancesLanguage,
  registerAsync,
} = CustomerRegisterService();

const companyData = ref([]);
const companyDropDownOption = ref([]);
const companySelected = ref({});
async function getAllCompany() {
  try {
    const response = await request({
      url: "Companys/all",
      method: "GET",
    });
    if (response.length > 0) {
      companyData.value = response;
      companySelected.value = response[0];
    }
  } catch (error) {
    console.log(error);
  }
}

async function registerParkMember() {
  try {
    // console.log(formData.value);

    // console.log(formData.value);
    formData.value.CompanyId = companySelected.value.CompanyId;
    formData.value.Role = Role.ParkMember;
    if (formData.value.VehicleOption) {
      formData.value.Vehicle = formData.value?.VehicleOption?.value;
    }
    const response = await registerAsync(
      formData.value,
      companySelected.value.CompanyId,
      toast
    );
    // console.log(response);
    if (!formError.value.isError) {
      toast.add(registerConstancesLanguage.value.toast.RegisterSucces);
      router.push({ name: "Login", params: {} });
    }
    // if (response) {
    // } else {
    //   return;
    // }
  } catch (error) {
    console.log(error);
  }
}

onMounted(async () => {
  await getAllCompany();
});
</script>

<style lang="scss" scoped></style>
