import axios from "axios";
import { ref } from "vue";
import { useToastService } from "./useToastService";
import { useUserStore } from "@/stores/UserStore";
import { merge } from "lodash-es";
const isPending = ref(false);

/** Hàm tạo axios service */
function createService(toast) {
  // Tạo một instance của axios có tên service
  const service = axios.create();
  // yêu cầu chặn
  service.interceptors.request.use(
    (config) => {
      isPending.value = true;
      return config;
    },
    // Gửi yêu cầu thất bại
    (error) => {
      isPending.value = false;
      Promise.reject(error);
    }
  );
  // chặn phản hồi, có thể điều chỉnh theo hoạt động kinh doanh cụ thể
  service.interceptors.response.use(
    (response) => {
      isPending.value = false;
      // apiData là dữ liệu được api trả về
      const apiData = response.data;
      // Dữ liệu nhị phân được trả về trực tiếp
      const responseType = response.request?.responseType;
      if (responseType === "blob" || responseType === "arraybuffer")
        return apiData;
      // Tạm thời chưa chặn phản hồi
      else {
        return apiData;
      }
    },
    (error) => {
      console.log(error);
      isPending.value = false;
      if (error.code === "ERR_NETWORK") {
        const { showToast } = useToastService();
        showToast(toast, "NetworkError");
      }
      // status 是 HTTP 状态码
      // const status = error.response.status;
      // switch (status) {
      //   case 400:
      //     error.message = "请求错误";
      //     break;
      //   case 401:
      //     // Unauthorized
      //     const resource = getResource("Toast", "Unauthorized");
      //     const userStore = useUserStore();
      //     toast.add({
      //       severity: "info",
      //       summary: resource.summary,
      //       detail: resource.detail,
      //       life: 3000,
      //     });

      //     setTimeout(() => userStore.signOut(), 3000);
      //     break;
      //   case 403:
      //     error.message = "拒绝访问";
      //     break;
      //   case 404:
      //     error.message = "请求地址出错";
      //     break;
      //   case 408:
      //     error.message = "请求超时";
      //     break;
      //   case 500:
      //     error.message = "服务器内部错误";
      //     break;
      //   case 501:
      //     error.message = "服务未实现";
      //     break;
      //   case 502:
      //     error.message = "网关错误";
      //     break;
      //   case 503:
      //     error.message = "服务不可用";
      //     break;
      //   case 504:
      //     error.message = "网关超时";
      //     break;
      //   case 505:
      //     error.message = "HTTP 版本不受支持";
      //     break;
      //   default:
      //     break;
      // }
      return Promise.reject(error);
    }
  );
  return service;
}

function request(axiosConfig, toast) {
  const userStore = useUserStore();
  if (!axiosConfig.method) {
    throw "axiosConfig chưa có method hoặc model";
  }

  if (
    (axiosConfig.method == "post" || axiosConfig.method == "put") &&
    !axiosConfig.data
  ) {
    throw "axiosConfig chưa có data khi post hoặc put";
  }

  const defaultConfig = {
    headers: {
      // Token
      Authorization: `Bearer ${userStore.accessToken}`,
      "Content-Type": "application/json",
    },
    timeout: 5000,
    baseURL: import.meta.env.VITE_BASE_API,
    data: {},
  };

  const mergeService = merge(defaultConfig, axiosConfig);
  const service = createService(toast);
  return service(mergeService);
}

export function useAxios() {
  return { isPending, request };
}
