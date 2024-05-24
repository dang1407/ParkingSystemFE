import { useResource } from "./useResource";
/**
 *
 * @param {useToast from primevue/usetoast} toast Phải truyền vào toast vì toast ko được dùng bên ngoài setup or component function
 * @param {String} resourceName Tên resource muốn lấy
 * @param {Integer} lifeCustom Đặt lại thời gian xuất hiện nếu muốn
 */
function showToast(toast, resourceName, lifeCustom) {
  const { getResource } = useResource();
  const resource = getResource("Toast", resourceName);
  toast.add({
    severity: resource.severity,
    summary: resource.summary,
    detail: resource.detail,
    life: lifeCustom ? lifeCustom : resource.life,
  });
}

export function useToastService() {
  return { showToast };
}
