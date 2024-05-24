import { defineStore } from "pinia";
import axios from "axios";
import { useRouter } from "vue-router";
import { useAxios } from "@/hooks/useAxios";
export const useUserStore = defineStore("userStore", {
  state: () => ({
    isShowProgress: false,
    isLogined: false,
    accessToken: localStorage.getItem("accessToken"),
    companyId: localStorage.getItem("companyId"),
    role: "",
    loginData: {
      UserName: "",
      Password: "",
    },
  }),
  getters: {},
  actions: {
    async loginAsync() {
      await reloginAsync();
      try {
        this.isShowProgress = true;
        const { request } = useAxios();
        // const response = await axios.post("Authenticate/login", this.loginData);
        // const response = await request({
        //   url: "Authenticate/login",
        //   method: "post",
        //   data: this.loginData,
        // });
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_API}/Authenticate/relogin`,
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            },
          }
        );
        this.isLogined = true;
        this.accessToken = response.data.AccessToken;
        localStorage.setItem("accessToken", response.data.AccessToken);
        this.role = response.data.Role;
        this.isShowProgress = false;
      } catch (error) {
        this.isShowProgress = false;
        console.log(error);
      }
    },

    /**
     * Hàm đăng nhập lại khi người dùng vào lại trang web
     * @returns
     */
    async reloginAsync() {
      console.log("relogin");
      try {
        console.log(localStorage.getItem("accessToken"));
        if (localStorage.getItem("accessToken")) {
          this.isShowProgress = true;
          const { request } = useAxios();
          const response = await request({
            url: "Authenticate/relogin",
            method: "get",
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            },
          });
          console.log(response);
          this.isLogined = true;
          this.role = response[0];
          this.accessToken = localStorage.getItem("accessToken");
          // console.log(this.accessToken);
          this.isShowProgress = false;
          // console.log(response);
          return;
        }
      } catch (error) {
        this.isShowProgress = false;
        console.log(error);
      }
    },

    signOut() {
      localStorage.setItem("accessToken", undefined);
      this.isLogined = false;
      this.accessToken = undefined;
      const router = useRouter();
      router.push({
        name: "Login",
        params: {},
      });
    },
  },
});
