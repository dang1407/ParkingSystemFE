import { useAxios } from "@/hooks/useAxios";
import { ref } from "vue";
import { useUserStore } from "@/stores/UserStore";
const { request } = useAxios();
const userStore = useUserStore();
/**
 * Hàm lấy thông tin tất cả các đơn vị có trong công ty
 * @returns Thông tin đơn vị
 * Created by: nkmdang 13/03/2024
 */
async function getTitleDataAsync() {
  const response = await request({
    url: `Titles?page=1&pageSize=1000`,
    method: "get",
  });
  return response;
}

export function TitleAPI() {
  return { getTitleDataAsync };
}
