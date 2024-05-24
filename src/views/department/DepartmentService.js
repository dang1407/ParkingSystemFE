import { useAxios } from "@/hooks/useAxios";
import { useConvert } from "@/hooks/useConvert";
import { ref, computed } from "vue";
import { DepartmentAPI } from "../department/DepartmentAPI";
import { useValidate } from "@/hooks/useValidate";
import { departmentConstants } from "./DepartmentConstants";
import { useHelperStore } from "@/stores/HelperStore";
import { mergeWith } from "lodash-es";
import { data } from "autoprefixer";
const { request } = useAxios();
const helperStore = useHelperStore();
const {
  convertDateDBToUIText,
  convertDatePrimeCalendarToDateDB,
  convertDateUIToDateDB,
  getCurrentTimeString,
} = useConvert();
const { getDepartmentDataAsync } = DepartmentAPI();
const isGettingDepartmentData = ref(false);
// Thông tin sẽ hiển thị lên bảng
const tableInf = [
  {
    field: "DepartmentName",
    tdStyle: "w-[150px] sm:min-w-40",
  },
];

const departmentOptions = ref();

// Thông tin đơn vị sẽ gửi cho backend
const departmentFormData = ref({});

const formModeEnum = {
  Create: 1,
  Update: 2,
  Delete: 3,
};
const formMode = ref();

// Thông tin đơn vị
const departmentData = ref();

// Thông tin các đơn vị được chọn
const departmentSelected = ref([]);
// Thông tin phân trang
const departmentPaging = ref({
  totalRecords: 0,
  page: 1, // Đang xem trang thứ mấy
  pageSize: 20, // Bao nhiêu bản ghi trong trang
  departmentSearchProperty: "", // Thông tin tìm kiếm đơn vị
});
// Danh sách số bản ghi mỗi trang truyển thằng vào BackEndPaginator
const numberRecordsPerPageOptions = [10, 20, 50, 100];

// Thông tin lỗi trên form
const formError = ref({});

// Hiển thị paginator sau khi đã fetch API về thành công để phân trang không bị trống
const paginatorPending = ref(false);
// Thông tin trên bảng các đơn vị
const departmentTableInf = computed(() => {
  const newDepartmentTableInf = mergeWith(
    tableInf,
    departmentConstants[helperStore.language.code]["tableHeader"]
  );
  // console.log(newDepartmentTableInf);
  return newDepartmentTableInf;
});

// Form thông tin đơn vị
const isShowDepartmentForm = ref(false);
const departmentConstantsLanguage = computed(() => {
  return departmentConstants[helperStore.language.code];
});

/**
 * Hàm bỏ chọn tất cả những đơn vị đã chọn
 * Created by: nkmdang 01/03/2024
 */
function unSelectAllDepartment() {
  departmentSelected.value = [];
}

/**
 * Hàm lấy thông tin đơn vị với pending để tránh Paginator không hiện danh sách trang
 * do chưa lấy được tổng số bản ghi
 * Created by: nkmdang 06/01/2024
 */
async function getDepartmentAsyncWitdhPending() {
  paginatorPending.value = false;
  await getDepartmentAsync();
  paginatorPending.value = true;
}

/**
 * Hàm mở Form thông tin đơn vị lên
 * Created by: nkmdang 11/03/2024
 */
async function showDepartmentForm(mode, data) {
  formMode.value = mode;
  if (mode == formModeEnum.Update) {
    departmentFormData.value = {
      ...data.data,
    };
    // departmentFormData.value
  } else if (mode == formModeEnum.Create) {
    const newDepartmentCode = await getNewDepartmentCode();
    departmentFormData.value = {
      DepartmentCode: newDepartmentCode,
    };
  }
  isShowDepartmentForm.value = true;
  // console.log(departmentFormData.value);
}

/**
 * Hàm mở Form thông tin đơn vị lên
 * Created by: nkmdang 11/03/2024
 */
function hideDepartmentForm() {
  isShowDepartmentForm.value = false;
  formError.value = {};
}
/**
 * Hàm mở Dialog xác nhận thực hiện hành động của người dùng
 * Created by: nkmdang 12/03/2024
 */
function showDepartmentFormConfirmDialog(confirm, toast, showDuplicateForm) {
  // console.log(departmentFormData.value.DepartmentCode);
  const dialogContent = departmentConstantsLanguage.value.confirmDialog;
  confirm.require({
    message: dialogContent.message[formMode.value](
      departmentFormData.value.DepartmentCode
    ),
    header: departmentConstantsLanguage.value.confirmDialog.header,
    accept: async () => {
      // Tạo mới một đơn vị
      if (formMode.value === formModeEnum.Create) {
        await createOneDepartmentAsync(toast, helperStore.languageCode);
      } else if (formMode.value === formModeEnum.Update) {
        await updateOneDepartmentAsync(toast, helperStore.languageCode);
      }
      if (showDuplicateForm) {
        departmentFormData.value.DepartmentCode = await getNewDepartmentCode();
      } else {
        if (!formError.value) {
          hideDepartmentForm();
        }
      }
    },
    reject: () => {},
  });
}

/**
 * Confirm Dialog xác nhận có xóa thông tin đơn vị hay không
 * @param {useConfirm() ("primevue/useconfirm")} confirm
 * @param {useToast() ("primevue/usetoast")} toast
 * @param {Object (nhận từ DataTable)} data
 * Created by: nkmdang 11/03/2024
 */
function confirmDeleteOneDepartment(confirm, toast, data) {
  // console.log();
  confirm.require({
    message: departmentConstantsLanguage.value.confirmDialog.message[3](
      data.data.DepartmentCode
    ),
    header: departmentConstantsLanguage.value.confirmDialog.header,
    rejectClass:
      "bg-white !text-primary-500 outline-[1px] outline-[solid] outline-primary-500",
    accept: async () => {
      await deleteDepartmentByIdAsync(toast, data.data.DepartmentId);
    },
    reject: () => {},
  });
}

/**
 * Hàm lấy thông tin đơn vị từ Backend theo phân trang
 * Created by: nkmdang 01/03/2024
 */
async function getDepartmentAsync() {
  isGettingDepartmentData.value = true;
  const response = await request({
    url: `Departments?page=${departmentPaging.value.page}&pageSize=${departmentPaging.value.pageSize}&departmentProperty=${departmentPaging.value.departmentSearchProperty}`,
    method: "get",
  });
  isGettingDepartmentData.value = false;
  // console.log(response);
  // Chuyển đổi định dạng ngày tháng trong db thành dd/mm/yyyy
  for (let i = 0; i < response.data.length; i++) {
    response.data[i].DateOfBirth = convertDateDBToUIText(
      response.data[i].DateOfBirth
    );
    response.data[i].PICreatedDate = convertDateDBToUIText(
      response.data[i].PICreatedDate
    );
  }
  departmentData.value = response.data;
  // console.log(departmentData.value);
  departmentPaging.value.totalRecords = response.countDepartments;
}

/**
 * Hàm thêm mới một đơn vị
 * @param {ToastServiceMethods} toast Toast service dùng để mở Toast
 * @param {String} languageCode
 * Created by: nkmdang 18/03/2024
 */
async function createOneDepartmentAsync(toast, languageCode) {
  try {
    const data = convertDepartmentFormDataToFormData(formModeEnum.Create);
    if (!validateDepartmentFormData(data)) {
      return;
    }
    const response = await request(
      {
        url: `Departments`,
        method: "post",
        data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
      toast
    );
    await getDepartmentAsync();
    const toastContent = departmentConstantsLanguage.value.Toast;
    toast.add(
      toastContent.ActionDepartmentSuccess(toastContent[formMode.value])
    );
  } catch (error) {
    console.log(error);
    if (error.response.status === 400) {
    }
  }
}

/**
 * Hàm cập nhật thông tin một đơn vị
 * @param {ToastServiceMethods} toast Toast service dùng để mở Toast
 * @param {} languageCode
 * Created by: nkmdang 18/03/2024
 */
async function updateOneDepartmentAsync(toast, languageCode) {
  try {
    const data = convertDepartmentFormDataToFormData(formModeEnum.Update);
    if (!validateDepartmentFormData(data)) {
      return;
    }
    const response = await request(
      {
        url: `Departments/${departmentFormData.value.DepartmentId}`,
        method: "put",
        data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
      toast
    );
    await getDepartmentAsync();
    const toastContent = departmentConstantsLanguage.value.Toast;
    toast.add(
      toastContent.ActionDepartmentSuccess(toastContent[formMode.value])
    );
  } catch (error) {
    console.log(error);
  }
}
/**
 * Hàm chuyển đổi departmentFormData từ Object sang FormData
 * @returns FormData
 * Created by: nkmdang 18/03/2024
 */
function convertDepartmentFormDataToFormData(mode) {
  const formData = new FormData();
  for (let key in departmentFormData.value) {
    formData.append(key, departmentFormData.value[key]);
  }
  if (mode === formModeEnum.Create) {
    if (departmentFormData.value.DateOfBirth) {
      console.log(departmentFormData.value.DateOfBirth);
      formData.set(
        "DateOfBirth",
        convertDatePrimeCalendarToDateDB(departmentFormData.value.DateOfBirth)
      );
    }
    if (departmentData.value.PICreatedDate) {
      formData.set(
        "PICreatedDate",
        convertDatePrimeCalendarToDateDB(departmentFormData.value.PICreatedDate)
      );
    }
  } else if (mode === formModeEnum.Update) {
    if (departmentFormData.value.DateOfBirth) {
      formData.set(
        "DateOfBirth",
        convertDateUIToDateDB(departmentFormData.value.DateOfBirth)
      );
    }
    if (departmentFormData.value.PICreatedDate) {
      formData.set(
        "PICreatedDate",
        convertDateUIToDateDB(departmentFormData.value.PICreatedDate)
      );
    }
  }
  formData.set("ModifiedDate", getCurrentTimeString());
  formData.set(
    "DepartmentId",
    departmentFormData.value.Department?.DepartmentId
  );
  return formData;
}

/**
 * Hàm validate các thông tin đơn vị
 * @returns Boolean
 */
function validateDepartmentFormData(formData) {
  const errorObject = {};
  let isError = false;
  const {
    validateCorrectLength,
    validateCustomRequireAndMaxlength,
    validateByRegex,
    validateWorkingAge,
    validateDateNotMoreThanTargetDate,
  } = useValidate();
  const departmentFieldValidate = {
    DepartmentCode: {
      regex: /^NV-00[0-9]{4}$/,
      require: true,
    },
    FullName: {
      maxLength: 255,
      require: true,
    },
    DepartmentId: {
      length: 36,
      require: true,
    },
    PositionName: {
      maxLength: 255,
      require: false,
    },
    BankName: {
      maxLength: 255,
      require: false,
    },
    BankBranch: {
      maxLength: 255,
      require: false,
    },
    PersonalIdentification: {
      regex: /^0[0-9]{9}$/,
      require: false,
    },
    Address: {
      maxLength: 255,
      require: false,
    },
    PICreatedPlace: {
      maxLength: 255,
      require: false,
    },
    Mobile: {
      regex: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
      require: false,
    },
  };

  for (let field in departmentFieldValidate) {
    for (let key in departmentFieldValidate[field]) {
      if (key == "maxLength") {
        const errorMessageField = departmentFieldValidate[field].require
          ? "MaxLengthAndRequire"
          : "Length";
        errorObject[field] = validateCustomRequireAndMaxlength(
          formData.get(field),
          departmentConstantsLanguage.value.formError[
            field + errorMessageField
          ],
          departmentFieldValidate[field].require
        );
      } else if (key == "regex") {
        if (departmentFieldValidate[field].require) {
          errorObject[field] = validateByRegex(
            formData.get(field),
            departmentConstantsLanguage.value.formError[
              field + "InvalidFormat"
            ],
            departmentFieldValidate[field].regex
          );
        } else if (formData.get(field)) {
          errorObject[field] = validateByRegex(
            formData.get(field),
            departmentConstantsLanguage.value.formError[
              field + "InvalidFormat"
            ],
            departmentFieldValidate[field].regex
          );
        }
      }
    }
  }
  const departmentId = formData.get("DepartmentId");
  if (departmentId == "undefined") {
    errorObject.Department =
      departmentConstantsLanguage.value.formError.DepartmentEmty;
  }
  const dateOfBirth = formData.get("DateOfBirth");
  if (formData.get("DateOfBirth") != "undefined") {
    const gender = formData.get("Gender") || 2;
    errorObject.DateOfBirth = validateWorkingAge(
      formData.get("DateOfBirth"),
      departmentConstantsLanguage.value.formError.DateOfBirthGenderInvalid[
        gender
      ],
      helperStore.workingStartAge,
      helperStore.workingEndAge[gender]
    );
  }

  if (formData.get("PICreatedDate") != "undefined") {
    errorObject.PICreatedDate = validateDateNotMoreThanTargetDate(
      formData.get("PICreatedDate"),
      departmentConstantsLanguage.value.formError.PICreatedDateInfuture
    );
  }
  console.log(errorObject);
  for (let key in errorObject) {
    if (errorObject[key]) {
      formError.value = errorObject;
      return false;
    }
  }

  return true;
}

function handleDepartmentFormDataError(error) {
  if (error.response?.status === 400) {
  }
}

/**
 * Hàm xóa thông tin đơn vị theo Id
 * @param {Guid (String)} departmentId
 * @returns
 */
async function deleteDepartmentByIdAsync(toast, departmentId) {
  const response = await request({
    url: `Departments/${departmentId}`,
    method: "delete",
  });
  await getDepartmentAsync();
  return response;
}

/**
 * Hàm lấy mã đơn vị mới từ backend
 * @returns Mã đơn vị mới
 * Created by: nkmdang 14/03/2024
 */
async function getNewDepartmentCode() {
  const response = await request({
    url: "Departments/NewDepartmentCode",
    method: "get",
  });
  return response;
}

/**
 * Hàm nhận file excel từ backend
 * @param {Int} page
 * @param {Int} pageSize
 * @param {String} departmentProperty
 *
 * Created By: nkmdang 10/10/2023
 */
async function exportExcelCurrentPage(
  page,
  pageSize,
  departmentProperty,
  aRef
) {
  // this.departmentPropertyExcel = this.departmentProperty;
  try {
    this.notificationStore.showLoading();
    const response = await axios.get(
      `Departments/DepartmentsExcel?page=${page}&pageSize=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${this.userStore.accessToken}`,
        },
        responseType: "blob",
      }
    );
    // Tạo một Blob từ dữ liệu trả về từ API
    const blob = new Blob([response.data]);

    // Tạo URL cho Blob
    const url = window.URL.createObjectURL(blob);

    // Lấy thẻ <a> tải xuống và đặt href là URL của Blob
    aRef.href = url;

    // Đặt tên tệp Excel mà bạn muốn khi người dùng tải về
    aRef.download = "Danh_sach_nhan_vien.xlsx";

    // Simulate a click to trigger the download
    aRef.click();

    // Giải phóng URL để tránh rò rỉ bộ nhớ
    window.URL.revokeObjectURL(url);
    // console.log(response);
    this.notificationStore.hideLoading();
  } catch (error) {
    this.notificationStore.hideLoading();
    console.log(error);
    this.notificationStore.showToastMessage(
      this.resourceLanguage.ToastMessage.CannotExportExcel
    );
  }
}

// Deparment

/**
 * Hàm lấy thông tin các đơn vị để đưa vào Dropdown
 * Created by: nkmdang 13/03/2024
 */
async function getDepartmentOptionsAsync() {
  const response = await getDepartmentDataAsync();
  departmentOptions.value = [];
  response.forEach((department) => {
    departmentOptions.value.push(department.DepartmentName);
  });
}

export function DepartmentService() {
  return {
    isGettingDepartmentData,
    isShowDepartmentForm,
    departmentData,
    departmentSelected,
    departmentPaging,
    departmentFormData,
    tableInf,
    numberRecordsPerPageOptions,
    departmentOptions,
    formMode,
    formModeEnum,
    departmentTableInf,
    departmentConstantsLanguage,
    paginatorPending,
    formError,
    showDepartmentForm,
    showDepartmentFormConfirmDialog,
    hideDepartmentForm,
    unSelectAllDepartment,
    confirmDeleteOneDepartment,
    getDepartmentAsyncWitdhPending,
    getNewDepartmentCode,
    getDepartmentAsync,
    createOneDepartmentAsync,
    updateOneDepartmentAsync,
    deleteDepartmentByIdAsync,
    getDepartmentOptionsAsync,
    exportExcelCurrentPage,
  };
}
