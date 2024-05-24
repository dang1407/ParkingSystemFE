import { useAxios } from "@/hooks/useAxios";
import { useConvert } from "@/hooks/useConvert";
import { ref, computed } from "vue";
import { DepartmentAPI } from "../department/DepartmentAPI";
import { TitleAPI } from "../title/TitleAPI";
import { useValidate } from "@/hooks/useValidate";
import { parkingHistoryConstants } from "./ParkingHistoryConstants";
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

const isGettingParkingHistoryData = ref(false);

// Thông tin nhân viên sẽ gửi cho backend
const parkingHistoryFormData = ref({});

const formModeEnum = {
  Create: 1,
  Update: 2,
  Delete: 3,
};
const formMode = ref();

// Thông tin nhân viên
const parkingHistoryData = ref();

// Thông tin các nhân viên được chọn
const parkingHistorySelected = ref([]);
// Thông tin phân trang
const parkingHistoryPaging = ref({
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
const parkingHistoryTableInf = computed(() => {
  const newParkingHistoryTableInf = mergeWith(
    tableInf,
    parkingHistoryConstants[helperStore.language.code]["tableHeader"]
  );
  // console.log(newParkingHistoryTableInf);
  return newParkingHistoryTableInf;
});

// Form thông tin nhân viên
const isShowParkingHistoryForm = ref(false);
const parkingHistoryConstantsLanguage = computed(() => {
  return parkingHistoryConstants[helperStore.language.code];
});

const exportExcelOptions = [
  { name: "Trang hiện tại", value: 0 },
  { name: "Tất cả các trang", value: 1 },
];

/**
 * Hàm bỏ chọn tất cả những nhân viên đã chọn
 * Created by: nkmdang 01/03/2024
 */
function unSelectAllParkingHistory() {
  parkingHistorySelected.value = [];
}

/**
 * Hàm lấy thông tin nhân viên với pending để tránh Paginator không hiện danh sách trang
 * do chưa lấy được tổng số bản ghi
 * Created by: nkmdang 06/01/2024
 */
async function getParkingHistoryAsyncWitdhPending() {
  paginatorPending.value = false;
  await getParkingHistoryAsync();
  paginatorPending.value = true;
}

/**
 * Hàm mở Form thông tin nhân viên lên
 * Created by: nkmdang 11/03/2024
 */
async function showParkingHistoryForm(mode, data) {
  formMode.value = mode;
  if (mode == formModeEnum.Update) {
    parkingHistoryFormData.value = {
      ...data.data,
    };
    // parkingHistoryFormData.value
  } else if (mode == formModeEnum.Create) {
    const newParkingHistoryCode = await getNewParkingHistoryCode();
    parkingHistoryFormData.value = {
      ParkingHistoryCode: newParkingHistoryCode,
    };
  }
  isShowParkingHistoryForm.value = true;
  // console.log(parkingHistoryFormData.value);
}

/**
 * Hàm mở Form thông tin nhân viên lên
 * Created by: nkmdang 11/03/2024
 */
function hideParkingHistoryForm() {
  isShowParkingHistoryForm.value = false;
  formError.value = {};
}
/**
 * Hàm mở Dialog xác nhận thực hiện hành động của người dùng
 * Created by: nkmdang 12/03/2024
 */
function showParkingHistoryFormConfirmDialog(
  confirm,
  toast,
  showDuplicateForm
) {
  // console.log(parkingHistoryFormData.value.ParkingHistoryCode);
  const dialogContent = parkingHistoryConstantsLanguage.value.confirmDialog;
  confirm.require({
    message: dialogContent.message[formMode.value](
      parkingHistoryFormData.value.ParkingHistoryCode
    ),
    header: parkingHistoryConstantsLanguage.value.confirmDialog.header,
    accept: async () => {
      // Tạo mới một nhân viên
      if (formMode.value === formModeEnum.Create) {
        await createOneParkingHistoryAsync(toast, helperStore.languageCode);
      } else if (formMode.value === formModeEnum.Update) {
        await updateOneParkingHistoryAsync(toast, helperStore.languageCode);
      }
      if (showDuplicateForm) {
        parkingHistoryFormData.value.ParkingHistoryCode =
          await getNewParkingHistoryCode();
      } else {
        if (!formError.value.isError) {
          hideParkingHistoryForm();
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
function confirmDeleteOneParkingHistory(confirm, toast, data) {
  // console.log();
  confirm.require({
    message: parkingHistoryConstantsLanguage.value.confirmDialog.message[3](
      data.data.ParkingHistoryCode
    ),
    header: parkingHistoryConstantsLanguage.value.confirmDialog.header,
    rejectClass:
      "bg-white !text-primary-500 outline-[1px] outline-[solid] outline-primary-500",
    accept: async () => {
      await deleteParkingHistoryByIdAsync(toast, data.data.ParkingHistoryId);
    },
    reject: () => {},
  });
}

/**
 * Hàm lấy thông tin nhân viên từ Backend theo phân trang
 * Created by: nkmdang 01/03/2024
 */
async function getParkingHistoryAsync() {
  try {
    isGettingParkingHistoryData.value = true;
    const response = await request({
      url: `ParkingHistorys/${userStore.companyId}?page=${parkingHistoryPaging.value.page}&pageSize=${parkingHistoryPaging.value.pageSize}&searchProperty=${parkingHistoryPaging.value.searchProperty}`,
      method: "get",
    });
    isGettingParkingHistoryData.value = false;

    parkingHistoryData.value = response.ModelData;
    // console.log(parkingHistoryData.value);
    parkingHistoryPaging.value.totalRecords = response.NumberRecords;
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
async function createOneParkingHistoryAsync(toast, languageCode) {
  try {
    const data = processParkingHistoryFormData(formModeEnum.Create);
    if (!validateParkingHistoryFormData(data)) {
      return;
    }
    if (parkingHistoryFormData.value.AvatarFile) {
      const imageNameSplit =
        parkingHistoryFormData.value.AvatarFile.name.split(".");
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
        url: `ParkingHistorys/${userStore.companyId}`,
        method: "post",
        data,
      },
      toast
    );
    await getParkingHistoryAsync();
    const toastContent = parkingHistoryConstantsLanguage.value.Toast;
    toast.add(
      toastContent.ActionParkingHistorySuccess(toastContent[formMode.value])
    );
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
async function updateOneParkingHistoryAsync(toast, languageCode) {
  try {
    const data = processParkingHistoryFormData(formModeEnum.Update);
    if (!validateParkingHistoryFormData(data)) {
      return;
    }
    const response = await request(
      {
        url: `ParkingHistorys/${parkingHistoryFormData.value.ParkingHistoryId}/${userStore.companyId}`,
        method: "put",
        data,
      },
      toast
    );
    await getParkingHistoryAsync();
    const toastContent = parkingHistoryConstantsLanguage.value.Toast;
    toast.add(
      toastContent.ActionParkingHistorySuccess(toastContent[formMode.value])
    );
    // Sau khi người dùng sửa lỗi và gọi API thành công thì bỏ lỗi của form
    formError.value = {};
  } catch (error) {
    console.log(error);
  }
}
/**
 * Hàm chuyển đổi parkingHistoryFormData từ Object sang FormData
 * @returns FormData
 * Created by: nkmdang 18/03/2024
 */
function convertParkingHistoryFormDataToFormData(mode) {
  const formData = new FormData();
  for (let key in parkingHistoryFormData.value) {
    formData.append(key, parkingHistoryFormData.value[key]);
  }

  if (mode === formModeEnum.Create) {
    if (parkingHistoryFormData.value.DateOfBirth) {
      console.log(parkingHistoryFormData.value.DateOfBirth);
      formData.set(
        "DateOfBirth",
        convertDatePrimeCalendarToDateDB(
          parkingHistoryFormData.value.DateOfBirth
        )
      );
    }
    if (parkingHistoryData.value.PICreatedDate) {
      formData.set(
        "PICreatedDate",
        convertDatePrimeCalendarToDateDB(
          parkingHistoryFormData.value.PICreatedDate
        )
      );
    }
  } else if (mode === formModeEnum.Update) {
    if (parkingHistoryFormData.value.DateOfBirth) {
      formData.set(
        "DateOfBirth",
        convertDateUIToDateDB(parkingHistoryFormData.value.DateOfBirth)
      );
    }
    if (parkingHistoryFormData.value.PICreatedDate) {
      formData.set(
        "PICreatedDate",
        convertDateUIToDateDB(parkingHistoryFormData.value.PICreatedDate)
      );
    }
  }
  formData.set("ModifiedDate", getCurrentTimeString());
  // formData.set(
  //   "DepartmentId",
  //   parkingHistoryFormData.value.Department?.DepartmentId ||
  //     parkingHistoryFormData.value?.DepartmentId
  // );
  console.log(formData.get("TitleId"), formData.get("DepartmentId"));
  return formData;
}

/**
 * Hàm xử lý parkingHistoryFormData trước khi gửi cho Backend
 * @param {Number} mode
 * Created by: nkmdang 09/04/2024
 */
function processParkingHistoryFormData(mode) {
  const parkingHistorySendFormData = {
    ...parkingHistoryFormData.value,
  };
  const departmentName = parkingHistorySendFormData.DepartmentName;
  for (let department of departmentData) {
    if (department.DepartmentName === departmentName) {
      parkingHistorySendFormData.DepartmentId = department.DepartmentId;
      break;
    }
  }
  const titleName = parkingHistorySendFormData.TitleName;
  for (let titleData of titleOptions.value) {
    if (titleData.TitleName === titleName) {
      parkingHistorySendFormData.TitleId = titleData.TitleId;
      break;
    }
  }

  if (mode === formModeEnum.Create) {
    if (parkingHistorySendFormData.DateOfBirth) {
      parkingHistorySendFormData.DateOfBirth = convertDatePrimeCalendarToDateDB(
        parkingHistorySendFormData.DateOfBirth
      );
    } else {
      parkingHistorySendFormData.DateOfBirth = null;
    }
    if (parkingHistorySendFormData.PICreatedDate) {
      parkingHistorySendFormData.PICreatedDate =
        convertDatePrimeCalendarToDateDB(
          parkingHistorySendFormData.PICreatedDate
        );
    } else {
      parkingHistorySendFormData.PICreatedDate = null;
    }
  } else if (mode === formModeEnum.Update) {
    if (parkingHistorySendFormData.DateOfBirth) {
      parkingHistorySendFormData.DateOfBirth = convertDateUIToDateDB(
        parkingHistorySendFormData.DateOfBirth
      );
    }
    if (parkingHistorySendFormData.PICreatedDate) {
      parkingHistorySendFormData.PICreatedDate = convertDateUIToDateDB(
        parkingHistorySendFormData.PICreatedDate
      );
    }
  }
  parkingHistorySendFormData.ModifiedDate = getCurrentTimeString();
  console.log(parkingHistorySendFormData);
  return parkingHistorySendFormData;
}

/**
 * Hàm validate các thông tin nhân viên
 * @returns Boolean
 */
function validateParkingHistoryFormData(data) {
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
  const parkingHistoryFieldValidate = {
    ParkingHistoryCode: {
      regex: /^PMB-00[0-9]{4}$/,
      require: true,
    },
    FullName: {
      maxLength: 255,
      require: true,
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

  for (let field in parkingHistoryFieldValidate) {
    for (let key in parkingHistoryFieldValidate[field]) {
      if (key == "maxLength") {
        const errorMessageField = parkingHistoryFieldValidate[field].require
          ? "MaxLengthAndRequire"
          : "Length";
        errorObject[field] = validateCustomRequireAndMaxlength(
          data[field],
          parkingHistoryConstantsLanguage.value.formError[
            field + errorMessageField
          ],
          parkingHistoryFieldValidate[field].require
        );
      } else if (key == "regex") {
        if (parkingHistoryFieldValidate[field].require) {
          errorObject[field] = validateByRegex(
            data[field],
            parkingHistoryConstantsLanguage.value.formError[
              field + "InvalidFormat"
            ],
            parkingHistoryFieldValidate[field].regex
          );
        } else if (data[field]) {
          errorObject[field] = validateByRegex(
            data[field],
            parkingHistoryConstantsLanguage.value.formError[
              field + "InvalidFormat"
            ],
            parkingHistoryFieldValidate[field].regex
          );
        }
      }
    }
  }
  const dateOfBirth = data["DateOfBirth"];
  if (dateOfBirth) {
    const gender = data["Gender"] || 2;
    errorObject.DateOfBirth = validateWorkingAge(
      dateOfBirth,
      parkingHistoryConstantsLanguage.value.formError.DateOfBirthGenderInvalid,
      16,
      200
    );
  }

  if (data["PICreatedDate"]) {
    errorObject.PICreatedDate = validateDateNotMoreThanTargetDate(
      data["PICreatedDate"],
      parkingHistoryConstantsLanguage.value.formError.PICreatedDateInfuture
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

function handleParkingHistoryFormDataError(error) {
  if (error.response?.status === 400) {
  }
}

/**
 * Hàm xóa thông tin nhân viên theo Id
 * @param {Guid (String)} parkingHistoryId
 * @returns
 */
async function deleteParkingHistoryByIdAsync(toast, parkingHistoryId) {
  const response = await request({
    url: `ParkingHistorys/${parkingHistoryId}`,
    method: "delete",
  });
  await getParkingHistoryAsync();
  return response;
}

/**
 * Hàm lấy mã nhân viên mới từ backend
 * @returns Mã nhân viên mới
 * Created by: nkmdang 14/03/2024
 */
async function getNewParkingHistoryCode() {
  const response = await request({
    url: `ParkingHistorys/NewParkingHistoryCode/${userStore.companyId}`,
    method: "get",
  });
  return response;
}

/**
 * Hàm nhận file excel từ backend
 * @param {Int} page
 * @param {Int} pageSize
 * @param {String} parkingHistoryProperty
 *
 * Created By: nkmdang 10/10/2023
 */
async function exportExcelCurrentPage(aRef) {
  // this.parkingHistoryPropertyExcel = this.parkingHistoryProperty;
  try {
    const response = await request({
      url: `ParkingHistorys/ParkingHistorysExcel/${userStore.companyId}?page=${parkingHistoryPaging.value.page}&pageSize=${parkingHistoryPaging.value.pageSize}&searchProperty=${parkingHistoryPaging.value.searchProperty}`,
      method: "get",
      responseType: "blob",
    });
    // const response = await axios.get(
    //   `ParkingHistorys/ParkingHistorysExcel?page=${page}&pageSize=${pageSize}`,
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

export function ParkingHistoryService() {
  return {
    isGettingParkingHistoryData,
    isShowParkingHistoryForm,
    parkingHistoryData,
    parkingHistorySelected,
    parkingHistoryPaging,
    parkingHistoryFormData,
    tableInf,
    numberRecordsPerPageOptions,
    departmentOptions,
    titleOptions,
    formMode,
    formModeEnum,
    parkingHistoryTableInf,
    parkingHistoryConstantsLanguage,
    paginatorPending,
    formError,
    exportExcelOptions,
    showParkingHistoryForm,
    showParkingHistoryFormConfirmDialog,
    hideParkingHistoryForm,
    unSelectAllParkingHistory,
    confirmDeleteOneParkingHistory,
    getParkingHistoryAsyncWitdhPending,
    getNewParkingHistoryCode,
    getParkingHistoryAsync,
    createOneParkingHistoryAsync,
    updateOneParkingHistoryAsync,
    deleteParkingHistoryByIdAsync,
    exportExcelCurrentPage,
    getDepartmentOptionsAsync,
    getTitleOptionsAsync,
  };
}
