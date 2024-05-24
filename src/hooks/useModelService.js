import { ref } from "vue";
// Thông tin model sẽ gửi cho backend
const modelFormData = ref({});

const formModeEnum = {
  Create: 1,
  Update: 2,
  Delete: 3,
};
const formMode = ref();

// Thông tin model
const modelData = ref();

// Thông tin các model được chọn
const modelSelected = ref([]);
// Thông tin phân trang
const modelPaging = ref({
  totalRecords: 0,
  page: 1, // Đang xem trang thứ mấy
  pageSize: 20, // Bao nhiêu bản ghi trong trang
  searchProperty: "", // Thông tin tìm kiếm model
});
// Danh sách số bản ghi mỗi trang truyển thẳng vào BackEndPaginator
const numberRecordsPerPageOptions = [10, 20, 50, 100];

// Thông tin lỗi trên form
const formError = ref({});

// Hiển thị paginator sau khi đã fetch API về thành công để phân trang không bị trống
const paginatorPending = ref(false);

// Form thông tin model
const isShowModelForm = ref(false);

export function useModelService() {
  return {
    modelFormData,
    formError,
    isShowModelForm,
    paginatorPending,
    formMode,
    formModeEnum,
    modelData,
    modelSelected,
    modelPaging,
    numberRecordsPerPageOptions,
    ref,
  };
}
