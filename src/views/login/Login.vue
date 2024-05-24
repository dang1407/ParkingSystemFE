<template>
  <div
    class="card w-full h-screen overflow-y-scroll 2xl:flex justify-center items-center bg-slate-100"
  >
    <div
      class="flex lg:w-[100%] lg:h-[100%] lg:pt-8 2xl:pt-0 min-h-[100%] bg-white rounded-xl shadow-getcssscan-1"
    >
      <!-- Left section -->
      <div
        class="hidden xl:flex xl:w-[60%] 2xl:w-[50%] h-[100%] items-center justify-center"
      >
        <!-- <h1 class="text-primary-500 font-semibold text-center text-[24px] mb-8">
          MD Manament System
        </h1> -->
        <img
          class="max-w-[100%] max-h-[100%] rounded-xl"
          src="../../assets/imgs/login-image.png"
          alt=""
        />
      </div>

      <!-- Login Section -->
      <div
        class="login-form relative sm:px-12 px-4 xs:min-h-[100%] w-[100%] xl:w-[40%] 2xl:w-[50%] flex items-center justify-center"
      >
        <div class="w-[100%] sm:min-h-[100%] flex flex-col justify-center">
          <div class="absolute right-4 sm:right-12 top-4 sm:top-6">
            <Dropdown
              :options="languageDictionary"
              option-label="label"
              v-model="helperStore.language"
            ></Dropdown>
          </div>
          <div class="logo-box flex justify-center">
            <img
              class="xs:h-[100px] lg:h-[130px]"
              src="../../assets/imgs/logo-1.png"
              alt=""
            />
          </div>
          <h1
            class="text-primary-500 font-semibold text-center text-[1.5rem] sm:text-[2rem] mb-8"
          >
            {{ loginConstants[helperStore.languageCode].login }}
          </h1>

          <div class="w-[100%]">
            <div class="">
              <label for="email" class="font-[500]">Email</label>
              <br />
              <InputText
                :invalid="formError?.Email ? true : false"
                id="email"
                class="h-[36px] w-[100%]"
                placeholder="Email"
                v-model="email"
              ></InputText>
              <br />
              <small
                class="block h-[1rem] invisible text-[red]"
                :class="{ '!visible': formError.Email }"
                >{{ formError?.Email }}</small
              >
            </div>

            <div class="mt-4">
              <label for="password" class="font-[500]">{{
                loginConstantsLanguage.password
              }}</label>
              <br />
              <Password
                :invalid="formError?.Password ? true : false"
                :feedback="false"
                :toggle-mask="true"
                id="password"
                class="h-[36px] w-[100%]"
                type="password"
                placeholder="Password"
                v-model="password"
              ></Password>
              <small
                class="block h-[1rem] invisible text-[red]"
                :class="{ '!visible': formError.Email }"
                >{{ formError?.Password }}</small
              >
            </div>

            <div class="flex justify-between mt-2">
              <div class="">
                <Checkbox v-model="keepMeSignIn" :binary="true"></Checkbox>
                <label class="ml-2">{{
                  loginConstantsLanguage.keepMeSignIn
                }}</label>
              </div>
              <div class="text-primary-500">
                <router-link to="/register">
                  {{ loginConstantsLanguage.donnotHaveAccount }}
                </router-link>
              </div>
            </div>

            <div class="mt-8 mb-4">
              <Button
                v-if="!isPending"
                class="w-[100%] h-12 rounded-[40px]"
                @click="loginAsync"
                >{{ loginConstantsLanguage.login }}</Button
              >
              <Button
                v-else
                severity="secondary"
                class="w-[100%] h-12 rounded-[40px]"
                disabled
                @click="loginAsync"
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
import { computed, onMounted } from "vue";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Checkbox from "primevue/checkbox";
import Dropdown from "primevue/dropdown";
import { useToast } from "primevue/usetoast";
import { languageDictionary } from "@/constants/languages";
import { useLogin } from "./useLogin";
import { useHelperStore } from "@/stores/HelperStore";
import { useUserStore } from "@/stores/UserStore";
import { useRouter } from "vue-router";
const helperStore = useHelperStore();
const toast = useToast();
const {
  email,
  password,
  keepMeSignIn,
  isPending,
  formError,
  loginConstants,
  login,
} = useLogin();
const loginConstantsLanguage = computed(() => {
  return loginConstants[helperStore.languageCode];
});
const router = useRouter();
async function loginAsync() {
  try {
    await login(email.value, password.value, toast, router);
  } catch (error) {
    console.log(error);
  }
}
onMounted(async () => {
  const UserStore = useUserStore();
  await UserStore.reloginAsync();
});
</script>

<style lang="scss" scoped></style>
