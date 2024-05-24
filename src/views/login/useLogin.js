import { useUserStore } from "@/stores/UserStore";
import { useAxios } from "@/hooks/useAxios";
import { useResource } from "@/hooks/useResource";
import { useHelperStore } from "@/stores/HelperStore";
import { useToastService } from "@/hooks/useToastService";
import { useValidate } from "@/hooks/useValidate";
import { ref } from "vue";
const loginConstants = {
  vi: {
    EmailEmpty: "Bạn chưa nhập tài khoản",
    PasswordEmpty: "Bạn chưa nhập mật khẩu",
    EmailAndPasswordEmpty: "Bạn chưa nhập tài khoản và mật khẩu",
    EmptyFieldSummary: "Chưa nhập đủ các trường",
    login: "Đăng nhập",
    account: "Tài khoản",
    password: "Mật khẩu",
    donnotHaveAccount: "Chưa có tài khoản",
    keepMeSignIn: "Giữ tôi đăng nhập",
  },
  en: {
    EmailEmpty: "You have not entered your email yet",
    PasswordEmpty: "You have not entered your password yet",
    EmptyFieldSummary: "Not enough fields have been entered",
    EmailAndPasswordEmpty: "You have not entered your account and password",
    login: "Login",
    account: "Account",
    password: "Password",
    donnotHaveAccount: "Don't have an account",
    keepMeSignIn: "Keep me sign in",
  },
};

const email = ref(null);
const password = ref(null);
const keepMeSignIn = ref(false);
const formError = ref({
  Email: "",
  Password: "",
});
const { getResource } = useResource();
const helperStore = useHelperStore();
/**
 *
 * @param {*} toast
 */
function validateLogin(email, password, toast) {
  let emptyErrorMessage = "";
  formError.value = {
    Email: "",
    Password: "",
  };
  // Validate các trường dữ liệu để trống
  if (!email && !password) {
    errorMessages =
      loginConstants[helperStore.language.code].EmailAndPasswordEmpty;
    formError.value.Email =
      loginConstants[helperStore.language.code].EmailEmpty;
    formError.value.Password =
      loginConstants[helperStore.language.code].PasswordEmpty;
  } else if (!email) {
    formError.value.Email =
      loginConstants[helperStore.language.code].EmailEmpty;
    emptyErrorMessage =
      loginConstants[helperStore.language.code].EmailEmpty + ". ";
  } else if (!password) {
    formError.value.Password =
      loginConstants[helperStore.language.code].PasswordEmpty;
    emptyErrorMessage =
      loginConstants[helperStore.language.code].PasswordEmpty + ". ";
  }
  if (emptyErrorMessage) {
    toast.add({
      severity: "warn",
      summary: loginConstants[helperStore.language.code].EmptyFieldSummary,
      detail: emptyErrorMessage,
      life: 5000,
    });
    console.log(formError.value);
    return false;
  }
  return true;
}

/**
 * Hàm đăng nhập người dùng vào hệ thống
 * @param {String} email
 * @param {String} password
 * @returns Kết quả đăng nhập
 * Created by: nkmdang 1/3/2024
 */
async function login(email, password, toast, router) {
  if (!validateLogin(email, password, toast)) {
    return;
  }
  const { request } = useAxios();
  try {
    const data = await request(
      {
        url: "Authenticate/login",
        method: "post",
        data: {
          UserName: email,
          Password: password,
        },
      },
      toast
    );
    const userStore = useUserStore();
    userStore.accessToken = data.AccessToken;
    localStorage.setItem("accessToken", data.AccessToken);
    localStorage.setItem("companyId", data.CompanyId);
    userStore.role = data.Role;
    userStore.isLogined = true;
    userStore.companyId = data.CompanyId;
    console.log(data);
    const { showToast } = useToastService();
    showToast(toast, "LoginSuccess");
    // Sau khi hiển thị toast thông báo thành công thì chuyển trang đến trang Home
    setTimeout(
      () =>
        router.push({
          name: "Home",
          params: {},
        }),
      500
    );
    return data;
  } catch (error) {
    console.log(error);
    if (error?.response?.status === 400) {
      toast.add(getResource("Toast", "ForgotLoginData"));
    }
  }
}

export function useLogin() {
  const { isPending } = useAxios();
  return {
    email,
    password,
    keepMeSignIn,
    isPending,
    formError,
    loginConstants,
    login,
  };
}
