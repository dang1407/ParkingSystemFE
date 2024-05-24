<template>
  <div class="w-full h-screen flex justify-center items-center">
    <div
      class="flex md:w-[70%] md:h-[95%] lg:px-8 lg:py-4 md:overflow-auto xs:w-full xs:h-full xs:overflow-y-scroll shadow-getcssscan-1 rounded-2xl"
    >
      <div
        class="min-h-full lg:w-[40%] md:block xs:hidden flex justify-center items-center"
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
                  v-model="formData.FullName"
                  id="fullname"
                  class="h-[36px] w-[100%]"
                ></InputText>
                <br />
                <small class="block h-[1rem] invisible text-[red]"></small>
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
                  v-model="formData.PersonalIdentification"
                  id="personalIdentification"
                  class="h-[36px] w-[100%]"
                ></InputText>
                <br />
                <small class="block h-[1rem] invisible text-[red]"></small>
              </div>
            </div>
            <div class="flex md:flex-row xs:flex-col gap-x-2">
              <div class="min-w-52">
                <label for="licenseplate" class="font-[500] flex"
                  >{{ registerConstancesLanguage?.formLabel?.licensePlate }}
                  <span class="text-required font-bold pl-[2px]">*</span>
                </label>
                <InputText
                  v-model="formData.LicensePlate"
                  id="licenseplate"
                  class="h-[36px] w-[100%]"
                ></InputText>
                <br />
                <small class="block h-[1rem] invisible text-[red]"></small>
              </div>
              <div class="min-w-40">
                <label for="vehicle" class="font-[500] flex"
                  >{{ registerConstancesLanguage?.formLabel?.vehicle }}
                  <span class="text-required font-bold pl-[2px]">*</span>
                </label>
                <Dropdown
                  class="w-full"
                  :options="registerConstancesLanguage?.vehicleOptions"
                  option-label="name"
                  v-model="formData.VehicleOption"
                ></Dropdown>
                <br />
                <small class="block h-[1rem] invisible text-[red]"></small>
              </div>

              <!-- Mobile -->
              <div class="flex-1">
                <label for="mobile" class="font-[500] flex"
                  >{{ registerConstancesLanguage?.formLabel?.mobile }}
                  <span class="text-required font-bold pl-[2px]">*</span>
                </label>
                <InputText
                  v-model="formData.Mobile"
                  id="mobile"
                  class="h-[36px] w-[100%]"
                ></InputText>
                <small class="block h-[1rem] invisible text-[red]"></small>
              </div>
            </div>
            <div class="">
              <label for="company" class="font-[500] flex"
                >{{ registerConstancesLanguage?.formLabel?.company }}
                <span class="text-required font-bold pl-[2px]">*</span>
              </label>
              <Dropdown class="w-full"></Dropdown>
              <br />
              <small class="block h-[1rem] invisible text-[red]"></small>
            </div>

            <!-- Email -->
            <div class="">
              <label for="email" class="font-[500] flex"
                >{{ registerConstancesLanguage?.formLabel.userName }}
                <span class="text-required font-bold pl-[2px]">*</span>
              </label>
              <InputText
                v-model="formData.UserName"
                id="email"
                class="h-[36px] w-[100%]"
              ></InputText>
              <br />
              <small class="block h-[1rem] invisible text-[red]"></small>
            </div>

            <div class="mt-4">
              <label for="password" class="font-[500] flex"
                >{{ registerConstancesLanguage?.formLabel?.password }}
                <span class="text-required font-bold pl-[2px]">*</span>
              </label>
              <Password
                v-model="formData.Password"
                :feedback="false"
                :toggle-mask="true"
                id="password"
                class="h-[36px] w-[100%]"
                type="password"
                placeholder="Password"
              ></Password>
              <small class="block h-[1rem] invisible text-[red]">{{}}</small>
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
              <Button v-if="!isPending" class="w-[100%] h-12 rounded-[40px]">{{
                registerConstancesLanguage.register
              }}</Button>
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
import { ref, computed } from "vue";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import Password from "primevue/password";
import InputText from "primevue/inputtext";
import { useHelperStore } from "@/stores/HelperStore";
import { CustomerRegisterService } from "./CustomerRegisterService.js";
import { languageDictionary } from "@/constants/languages";
const helperStore = useHelperStore();
const { RegisterConstances, formData, formError, isPending } =
  CustomerRegisterService();
const registerConstancesLanguage = computed(() => {
  return RegisterConstances[helperStore.languageCode];
});
</script>

<style lang="scss" scoped></style>
