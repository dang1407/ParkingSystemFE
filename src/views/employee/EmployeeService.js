import { useAxios } from "@/hooks/useAxios";
import { useConvert } from "@/hooks/useConvert";
import { ref, computed } from "vue";
import { DepartmentAPI } from "../department/DepartmentAPI";
import { TitleAPI } from "../title/TitleAPI";
import { useValidate } from "@/hooks/useValidate";
import { employeeConstants } from "./EmployeeConstants";
import { useHelperStore } from "@/stores/HelperStore";
import { useUserStore } from "@/stores/UserStore";
import { mergeWith } from "lodash-es";
import {
  storage,
  firebaseRef,
  timeStamp,
  uploadBytes,
  getDownloadURL,
} from "@/services/FireBase";
const { request } = useAxios();
const helperStore = useHelperStore();
const userStore = useUserStore();
const {
  convertDateDBToUIText,
  convertDatePrimeCalendarToDateDB,
  convertDateUIToDateDB,
  getCurrentTimeString,
} = useConvert();
const { getDepartmentDataAsync } = DepartmentAPI();
const { getTitleDataAsync } = TitleAPI();
const isGettingEmployeeData = ref(false);
// Thông tin sẽ hiển thị lên bảng
const tableInf = [
  {
    field: "EmployeeCode",
    tdStyle: "w-[150px] sm:min-w-40",
  },
  {
    field: "FullName",
    tdStyle: "w-[200px] sm:min-w-56",
  },
  {
    field: "DateOfBirth",
    tdStyle: "w-[120px] sm:min-w-32",
    headerStyle: "min-width: 120px;",
  },
  {
    field: "Gender",
    tdStyle: "w-[200px] sm:min-w-56",
  },
  {
    field: "DepartmentName",
    tdStyle: "w-[200px] sm:min-w-56",
  },
  {
    field: "TitleName",
    tdStyle: "w-[240px] sm:min-w-60",
  },
  {
    field: "BankAccount",
    tdStyle: "w-[200px] sm:min-w-56",
  },
  {
    field: "BankName",
    tdStyle: "w-[200px] sm:min-w-56",
  },
  {
    field: "BankBranch",
    tdStyle: "w-[200px] sm:min-w-56",
  },
];

const departmentOptions = ref();
let departmentData = [];
const titleOptions = ref([]);
// Thông tin nhân viên sẽ gửi cho backend
const employeeFormData = ref({});

const formModeEnum = {
  Create: 1,
  Update: 2,
  Delete: 3,
};
const formMode = ref();

// Thông tin nhân viên
const employeeData = ref();

// Thông tin các nhân viên được chọn
const employeeSelected = ref([]);
// Thông tin phân trang
const employeePaging = ref({
  totalRecords: 0,
  page: 1, // Đang xem trang thứ mấy
  pageSize: 20, // Bao nhiêu bản ghi trong trang
  searchProperty: "", // Thông tin tìm kiếm nhân viên
});
// Danh sách số bản ghi mỗi trang truyển thằng vào BackEndPaginator
const numberRecordsPerPageOptions = [10, 20, 50, 100];

// Thông tin lỗi trên form
const formError = ref({});

// Hiển thị paginator sau khi đã fetch API về thành công để phân trang không bị trống
const paginatorPending = ref(false);
// Thông tin trên bảng các nhân viên
const employeeTableInf = computed(() => {
  const newEmployeeTableInf = mergeWith(
    tableInf,
    employeeConstants[helperStore.language.code]["tableHeader"]
  );
  // console.log(newEmployeeTableInf);
  return newEmployeeTableInf;
});

// Form thông tin nhân viên
const isShowEmployeeForm = ref(false);
const employeeConstantsLanguage = computed(() => {
  return employeeConstants[helperStore.language.code];
});

const exportExcelOptions = [
  { name: "Trang hiện tại", value: 0 },
  { name: "Tất cả các trang", value: 1 },
];

/**
 * Hàm bỏ chọn tất cả những nhân viên đã chọn
 * Created by: nkmdang 01/03/2024
 */
function unSelectAllEmployee() {
  employeeSelected.value = [];
}

/**
 * Hàm lấy thông tin nhân viên với pending để tránh Paginator không hiện danh sách trang
 * do chưa lấy được tổng số bản ghi
 * Created by: nkmdang 06/01/2024
 */
async function getEmployeeAsyncWitdhPending() {
  paginatorPending.value = false;
  await getEmployeeAsync();
  paginatorPending.value = true;
}

/**
 * Hàm mở Form thông tin nhân viên lên
 * Created by: nkmdang 11/03/2024
 */
async function showEmployeeForm(mode, data) {
  formMode.value = mode;
  if (mode == formModeEnum.Update) {
    employeeFormData.value = {
      ...data.data,
    };
    // employeeFormData.value
  } else if (mode == formModeEnum.Create) {
    const newEmployeeCode = await getNewEmployeeCode();
    employeeFormData.value = {
      EmployeeCode: newEmployeeCode,
    };
  }
  isShowEmployeeForm.value = true;
  // console.log(employeeFormData.value);
}

/**
 * Hàm mở Form thông tin nhân viên lên
 * Created by: nkmdang 11/03/2024
 */
function hideEmployeeForm() {
  isShowEmployeeForm.value = false;
  formError.value = {};
}
/**
 * Hàm mở Dialog xác nhận thực hiện hành động của người dùng
 * Created by: nkmdang 12/03/2024
 */
function showEmployeeFormConfirmDialog(confirm, toast, showDuplicateForm) {
  // console.log(employeeFormData.value.EmployeeCode);
  const dialogContent = employeeConstantsLanguage.value.confirmDialog;
  confirm.require({
    message: dialogContent.message[formMode.value](
      employeeFormData.value.EmployeeCode
    ),
    header: employeeConstantsLanguage.value.confirmDialog.header,
    accept: async () => {
      // Tạo mới một nhân viên
      if (formMode.value === formModeEnum.Create) {
        await createOneEmployeeAsync(toast, helperStore.languageCode);
      } else if (formMode.value === formModeEnum.Update) {
        await updateOneEmployeeAsync(toast, helperStore.languageCode);
      }
      if (showDuplicateForm) {
        employeeFormData.value.EmployeeCode = await getNewEmployeeCode();
      } else {
        if (!formError.value.isError) {
          hideEmployeeForm();
        }
      }
    },
    reject: () => {},
  });
}

/**
 * Confirm Dialog xác nhận có xóa thông tin nhân viên hay không
 * @param {useConfirm() ("primevue/useconfirm")} confirm
 * @param {useToast() ("primevue/usetoast")} toast
 * @param {Object (nhận từ DataTable)} data
 * Created by: nkmdang 11/03/2024
 */
function confirmDeleteOneEmployee(confirm, toast, data) {
  // console.log();
  confirm.require({
    message: employeeConstantsLanguage.value.confirmDialog.message[3](
      data.data.EmployeeCode
    ),
    header: employeeConstantsLanguage.value.confirmDialog.header,
    rejectClass:
      "bg-white !text-primary-500 outline-[1px] outline-[solid] outline-primary-500",
    accept: async () => {
      await deleteEmployeeByIdAsync(toast, data.data.EmployeeId);
    },
    reject: () => {},
  });
}

/**
 * Hàm lấy thông tin nhân viên từ Backend theo phân trang
 * Created by: nkmdang 01/03/2024
 */
async function getEmployeeAsync() {
  try {
    isGettingEmployeeData.value = true;
    const response = await request({
      url: `Employees/${userStore.companyId}?page=${employeePaging.value.page}&pageSize=${employeePaging.value.pageSize}&searchProperty=${employeePaging.value.searchProperty}`,
      method: "get",
    });
    isGettingEmployeeData.value = false;
    // console.log(response);
    // Chuyển đổi định dạng ngày tháng trong db thành dd/mm/yyyy
    for (let i = 0; i < response.ModelData.length; i++) {
      response.ModelData[i].DateOfBirth = convertDateDBToUIText(
        response.ModelData[i].DateOfBirth
      );
      response.ModelData[i].PICreatedDate = convertDateDBToUIText(
        response.ModelData[i].PICreatedDate
      );
    }
    employeeData.value = response.ModelData;
    // console.log(employeeData.value);
    employeePaging.value.totalRecords = response.NumberRecords;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Hàm thêm mới một nhân viên
 * @param {ToastServiceMethods} toast Toast service dùng để mở Toast
 * @param {String} languageCode
 * Created by: nkmdang 18/03/2024
 */
async function createOneEmployeeAsync(toast, languageCode) {
  try {
    const data = processEmployeeFormData(formModeEnum.Create);
    if (!validateEmployeeFormData(data)) {
      return;
    }
    if (employeeFormData.value.AvatarFile) {
      const imageNameSplit = employeeFormData.value.AvatarFile.name.split(".");
      const extension = imageNameSplit.pop();
      const name = imageNameSplit.join(".");
      const imageStorageRef = firebaseRef(
        storage,
        `images/${name + new Date().getTime() + "." + extension}`
      );

      uploadBytes(imageStorageRef, data.AvatarFile)
        .then((snapshot) => {
          console.log("Uploaded a blob or file!", snapshot);
          getDownloadURL(snapshot.ref).then((downloadURL) => {
            console.log(downloadURL);
            data.AvatarLink = downloadURL;
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
    const response = await request(
      {
        url: `Employees/${userStore.companyId}`,
        method: "post",
        data,
      },
      toast
    );
    await getEmployeeAsync();
    const toastContent = employeeConstantsLanguage.value.Toast;
    toast.add(toastContent.ActionEmployeeSuccess(toastContent[formMode.value]));
    formError.value = {};
  } catch (error) {
    console.log(error);
    if (error.response?.status === 400) {
    }
  }
}

/**
 * Hàm cập nhật thông tin một nhân viên
 * @param {ToastServiceMethods} toast Toast service dùng để mở Toast
 * @param {} languageCode
 * Created by: nkmdang 18/03/2024
 */
async function updateOneEmployeeAsync(toast, languageCode) {
  try {
    const data = processEmployeeFormData(formModeEnum.Update);
    if (!validateEmployeeFormData(data)) {
      return;
    }
    const response = await request(
      {
        url: `Employees/${employeeFormData.value.EmployeeId}`,
        method: "put",
        data,
      },
      toast
    );
    await getEmployeeAsync();
    const toastContent = employeeConstantsLanguage.value.Toast;
    toast.add(toastContent.ActionEmployeeSuccess(toastContent[formMode.value]));
    // Sau khi người dùng sửa lỗi và gọi API thành công thì bỏ lỗi của form
    formError.value = {};
  } catch (error) {
    console.log(error);
  }
}
/**
 * Hàm chuyển đổi employeeFormData từ Object sang FormData
 * @returns FormData
 * Created by: nkmdang 18/03/2024
 */
function convertEmployeeFormDataToFormData(mode) {
  const formData = new FormData();
  for (let key in employeeFormData.value) {
    formData.append(key, employeeFormData.value[key]);
  }
  for (let i = 0; i < titleOptions.value.length; i++) {
    console.log(titleOptions.value[i].TitleName);
    if (titleOptions.value[i].TitleName == employeeFormData.value.TitleName) {
      formData.set("TitleId", employeeFormData.value.TitleId);
      break;
    }
  }

  for (let i = 0; i < departmentData.length; i++) {
    if (
      departmentData[i].DepartmentName == employeeFormData.value.DepartmentName
    ) {
      formData.set("DepartmentId", departmentData[i].DepartmentId);
      break;
    }
  }
  if (mode === formModeEnum.Create) {
    if (employeeFormData.value.DateOfBirth) {
      console.log(employeeFormData.value.DateOfBirth);
      formData.set(
        "DateOfBirth",
        convertDatePrimeCalendarToDateDB(employeeFormData.value.DateOfBirth)
      );
    }
    if (employeeData.value.PICreatedDate) {
      formData.set(
        "PICreatedDate",
        convertDatePrimeCalendarToDateDB(employeeFormData.value.PICreatedDate)
      );
    }
  } else if (mode === formModeEnum.Update) {
    if (employeeFormData.value.DateOfBirth) {
      formData.set(
        "DateOfBirth",
        convertDateUIToDateDB(employeeFormData.value.DateOfBirth)
      );
    }
    if (employeeFormData.value.PICreatedDate) {
      formData.set(
        "PICreatedDate",
        convertDateUIToDateDB(employeeFormData.value.PICreatedDate)
      );
    }
  }
  formData.set("ModifiedDate", getCurrentTimeString());
  // formData.set(
  //   "DepartmentId",
  //   employeeFormData.value.Department?.DepartmentId ||
  //     employeeFormData.value?.DepartmentId
  // );
  console.log(formData.get("TitleId"), formData.get("DepartmentId"));
  return formData;
}

/**
 * Hàm xử lý employeeFormData trước khi gửi cho Backend
 * @param {Number} mode
 * Created by: nkmdang 09/04/2024
 */
function processEmployeeFormData(mode) {
  const employeeSendFormData = {
    ...employeeFormData.value,
  };
  const departmentName = employeeSendFormData.DepartmentName;
  for (let department of departmentData) {
    if (department.DepartmentName === departmentName) {
      employeeSendFormData.DepartmentId = department.DepartmentId;
      break;
    }
  }
  const titleName = employeeSendFormData.TitleName;
  for (let titleData of titleOptions.value) {
    if (titleData.TitleName === titleName) {
      employeeSendFormData.TitleId = titleData.TitleId;
      break;
    }
  }

  if (mode === formModeEnum.Create) {
    if (employeeSendFormData.DateOfBirth) {
      employeeSendFormData.DateOfBirth = convertDatePrimeCalendarToDateDB(
        employeeSendFormData.DateOfBirth
      );
    } else {
      employeeSendFormData.DateOfBirth = null;
    }
    if (employeeSendFormData.PICreatedDate) {
      employeeSendFormData.PICreatedDate = convertDatePrimeCalendarToDateDB(
        employeeSendFormData.PICreatedDate
      );
    } else {
      employeeSendFormData.PICreatedDate = null;
    }
  } else if (mode === formModeEnum.Update) {
    if (employeeSendFormData.DateOfBirth) {
      employeeSendFormData.DateOfBirth = convertDateUIToDateDB(
        employeeSendFormData.DateOfBirth
      );
    }
    if (employeeSendFormData.PICreatedDate) {
      employeeSendFormData.PICreatedDate = convertDateUIToDateDB(
        employeeSendFormData.PICreatedDate
      );
    }
  }
  employeeSendFormData.ModifiedDate = getCurrentTimeString();
  console.log(employeeSendFormData);
  return employeeSendFormData;
}

/**
 * Hàm validate các thông tin nhân viên
 * @returns Boolean
 */
function validateEmployeeFormData(data) {
  const errorObject = {};
  formError.value = {};
  let isError = false;
  const {
    validateCorrectLength,
    validateCustomRequireAndMaxlength,
    validateByRegex,
    validateWorkingAge,
    validateDateNotMoreThanTargetDate,
  } = useValidate();
  const employeeFieldValidate = {
    EmployeeCode: {
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
    TitleName: {
      maxLength: 255,
      require: true,
    },
    BankName: {
      maxLength: 255,
      require: true,
    },
    BankBranch: {
      maxLength: 255,
      require: false,
    },
    BankAccount: {
      require: true,
      maxLength: 255,
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
    TitleId: {
      length: 36,
      require: true,
    },
  };

  for (let field in employeeFieldValidate) {
    for (let key in employeeFieldValidate[field]) {
      if (key == "maxLength") {
        const errorMessageField = employeeFieldValidate[field].require
          ? "MaxLengthAndRequire"
          : "Length";
        errorObject[field] = validateCustomRequireAndMaxlength(
          data[field],
          employeeConstantsLanguage.value.formError[field + errorMessageField],
          employeeFieldValidate[field].require
        );
      } else if (key == "regex") {
        if (employeeFieldValidate[field].require) {
          errorObject[field] = validateByRegex(
            data[field],
            employeeConstantsLanguage.value.formError[field + "InvalidFormat"],
            employeeFieldValidate[field].regex
          );
        } else if (data[field]) {
          errorObject[field] = validateByRegex(
            data[field],
            employeeConstantsLanguage.value.formError[field + "InvalidFormat"],
            employeeFieldValidate[field].regex
          );
        }
      }
    }
  }
  const departmentId = data["DepartmentId"];
  if (!departmentId) {
    errorObject.Department =
      employeeConstantsLanguage.value.formError.DepartmentEmty;
  }
  const dateOfBirth = data["DateOfBirth"];
  if (data["DateOfBirth"]) {
    const gender = data["Gender"] || 2;
    errorObject.DateOfBirth = validateWorkingAge(
      data["DateOfBirth"],
      employeeConstantsLanguage.value.formError.DateOfBirthGenderInvalid[
        gender
      ],
      helperStore.workingStartAge,
      helperStore.workingEndAge[gender]
    );
  }

  if (data["PICreatedDate"]) {
    errorObject.PICreatedDate = validateDateNotMoreThanTargetDate(
      data["PICreatedDate"],
      employeeConstantsLanguage.value.formError.PICreatedDateInfuture
    );
  }
  console.log(errorObject);
  for (let key in errorObject) {
    if (errorObject[key]) {
      formError.value = errorObject;
      formError.value.isError = true;
      return false;
    }
  }

  return true;
}

function handleEmployeeFormDataError(error) {
  if (error.response?.status === 400) {
  }
}

/**
 * Hàm xóa thông tin nhân viên theo Id
 * @param {Guid (String)} employeeId
 * @returns
 */
async function deleteEmployeeByIdAsync(toast, employeeId) {
  const response = await request({
    url: `Employees/${employeeId}`,
    method: "delete",
  });
  await getEmployeeAsync();
  return response;
}

/**
 * Hàm lấy mã nhân viên mới từ backend
 * @returns Mã nhân viên mới
 * Created by: nkmdang 14/03/2024
 */
async function getNewEmployeeCode() {
  const response = await request({
    url: `Employees/NewEmployeeCode/${userStore.companyId}`,
    method: "get",
  });
  return response;
}

/**
 * Hàm nhận file excel từ backend
 * @param {Int} page
 * @param {Int} pageSize
 * @param {String} employeeProperty
 *
 * Created By: nkmdang 10/10/2023
 */
async function exportExcelCurrentPage(aRef) {
  // this.employeePropertyExcel = this.employeeProperty;
  try {
    const response = await request({
      url: `Employees/EmployeesExcel/${userStore.companyId}?page=${employeePaging.value.page}&pageSize=${employeePaging.value.pageSize}&searchProperty=${employeePaging.value.searchProperty}`,
      method: "get",
      responseType: "blob",
    });
    // const response = await axios.get(
    //   `Employees/EmployeesExcel?page=${page}&pageSize=${pageSize}`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${this.userStore.accessToken}`,
    //     },
    //     responseType: "blob",
    //   }
    // );
    // Tạo một Blob từ dữ liệu trả về từ API
    const blob = new Blob([response]);

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
  } catch (error) {
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
  departmentData = response.ModelData;
  response.ModelData.forEach((department) => {
    departmentOptions.value.push(department.DepartmentName);
  });
}

// Title
/**
 * Hàm lấy thông tin các chức danh
 * Created by: nkmdang 29/03/2024
 */
async function getTitleOptionsAsync() {
  try {
    const response = await getTitleDataAsync();

    titleOptions.value = response.ModelData;
  } catch (error) {
    console.log(error);
  }
}

export function EmployeeService() {
  return {
    isGettingEmployeeData,
    isShowEmployeeForm,
    employeeData,
    employeeSelected,
    employeePaging,
    employeeFormData,
    tableInf,
    numberRecordsPerPageOptions,
    departmentOptions,
    titleOptions,
    formMode,
    formModeEnum,
    employeeTableInf,
    employeeConstantsLanguage,
    paginatorPending,
    formError,
    exportExcelOptions,
    showEmployeeForm,
    showEmployeeFormConfirmDialog,
    hideEmployeeForm,
    unSelectAllEmployee,
    confirmDeleteOneEmployee,
    getEmployeeAsyncWitdhPending,
    getNewEmployeeCode,
    getEmployeeAsync,
    createOneEmployeeAsync,
    updateOneEmployeeAsync,
    deleteEmployeeByIdAsync,
    exportExcelCurrentPage,
    getDepartmentOptionsAsync,
    getTitleOptionsAsync,
  };
}
