import { useAxios } from "@/hooks/useAxios";
import { useConvert } from "@/hooks/useConvert";
import { ref, computed } from "vue";
import { DepartmentAPI } from "../department/DepartmentAPI";
import { TitleAPI } from "../title/TitleAPI";
import { useValidate } from "@/hooks/useValidate";
import { parkMemberConstants } from "./ParkMemberConstants";
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
const isGettingParkMemberData = ref(false);
// Thông tin sẽ hiển thị lên bảng
const tableInf = [
  {
    field: "ParkMemberCode",
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
    field: "LicensePlate",
    tdStyle: "w-[200px] sm:min-w-56",
  },
];
const VNLicensePlateRegex = /^([0-9]{2}|[0-9]{2}[A-Z])([0-9]{4,5})$/;
const departmentOptions = ref();
let departmentData = [];
const titleOptions = ref([]);
// Thông tin nhân viên sẽ gửi cho backend
const parkMemberFormData = ref({});

const formModeEnum = {
  Create: 1,
  Update: 2,
  Delete: 3,
};
const formMode = ref();

// Thông tin nhân viên
const parkMemberData = ref();

// Thông tin các nhân viên được chọn
const parkMemberSelected = ref([]);
// Thông tin phân trang
const parkMemberPaging = ref({
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
const parkMemberTableInf = computed(() => {
  const newParkMemberTableInf = mergeWith(
    tableInf,
    parkMemberConstants[helperStore.language.code]["tableHeader"]
  );
  // console.log(newParkMemberTableInf);
  return newParkMemberTableInf;
});

// Form thông tin nhân viên
const isShowParkMemberForm = ref(false);
const parkMemberConstantsLanguage = computed(() => {
  return parkMemberConstants[helperStore.language.code];
});

const exportExcelOptions = [
  { name: "Trang hiện tại", value: 0 },
  { name: "Tất cả các trang", value: 1 },
];

/**
 * Hàm bỏ chọn tất cả những nhân viên đã chọn
 * Created by: nkmdang 01/03/2024
 */
function unSelectAllParkMember() {
  parkMemberSelected.value = [];
}

/**
 * Hàm lấy thông tin nhân viên với pending để tránh Paginator không hiện danh sách trang
 * do chưa lấy được tổng số bản ghi
 * Created by: nkmdang 06/01/2024
 */
async function getParkMemberAsyncWitdhPending() {
  paginatorPending.value = false;
  await getParkMemberAsync();
  paginatorPending.value = true;
}

/**
 * Hàm mở Form thông tin nhân viên lên
 * Created by: nkmdang 11/03/2024
 */
async function showParkMemberForm(mode, data) {
  formMode.value = mode;
  if (mode == formModeEnum.Update) {
    parkMemberFormData.value = {
      ...data.data,
    };
    // parkMemberFormData.value
  } else if (mode == formModeEnum.Create) {
    const newParkMemberCode = await getNewParkMemberCode();
    parkMemberFormData.value = {
      ParkMemberCode: newParkMemberCode,
    };
  }
  isShowParkMemberForm.value = true;
  // console.log(parkMemberFormData.value);
}

/**
 * Hàm mở Form thông tin nhân viên lên
 * Created by: nkmdang 11/03/2024
 */
function hideParkMemberForm() {
  isShowParkMemberForm.value = false;
  formError.value = {};
}
/**
 * Hàm mở Dialog xác nhận thực hiện hành động của người dùng
 * Created by: nkmdang 12/03/2024
 */
function showParkMemberFormConfirmDialog(confirm, toast, showDuplicateForm) {
  // console.log(parkMemberFormData.value.ParkMemberCode);
  const dialogContent = parkMemberConstantsLanguage.value.confirmDialog;
  confirm.require({
    message: dialogContent.message[formMode.value](
      parkMemberFormData.value.ParkMemberCode
    ),
    header: parkMemberConstantsLanguage.value.confirmDialog.header,
    accept: async () => {
      // Tạo mới một nhân viên
      if (formMode.value === formModeEnum.Create) {
        await createOneParkMemberAsync(toast, helperStore.languageCode);
      } else if (formMode.value === formModeEnum.Update) {
        await updateOneParkMemberAsync(toast, helperStore.languageCode);
      }
      if (showDuplicateForm) {
        parkMemberFormData.value.ParkMemberCode = await getNewParkMemberCode();
      } else {
        if (!formError.value.isError) {
          hideParkMemberForm();
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
function confirmDeleteOneParkMember(confirm, toast, data) {
  // console.log();
  confirm.require({
    message: parkMemberConstantsLanguage.value.confirmDialog.message[3](
      data.data.ParkMemberCode
    ),
    header: parkMemberConstantsLanguage.value.confirmDialog.header,
    rejectClass:
      "bg-white !text-primary-500 outline-[1px] outline-[solid] outline-primary-500",
    accept: async () => {
      await deleteParkMemberByIdAsync(toast, data.data.ParkMemberId);
    },
    reject: () => {},
  });
}

/**
 * Hàm lấy thông tin nhân viên từ Backend theo phân trang
 * Created by: nkmdang 01/03/2024
 */
async function getParkMemberAsync() {
  try {
    isGettingParkMemberData.value = true;
    const response = await request({
      url: `ParkMembers?page=${parkMemberPaging.value.page}&pageSize=${parkMemberPaging.value.pageSize}&searchProperty=${parkMemberPaging.value.searchProperty}`,
      method: "get",
    });
    isGettingParkMemberData.value = false;
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
    parkMemberData.value = response.ModelData;
    // console.log(parkMemberData.value);
    parkMemberPaging.value.totalRecords = response.NumberRecords;
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
async function createOneParkMemberAsync(toast, languageCode) {
  try {
    const data = processParkMemberFormData(formModeEnum.Create);
    if (!validateParkMemberFormData(data)) {
      return;
    }
    if (parkMemberFormData.value.AvatarFile) {
      const imageNameSplit =
        parkMemberFormData.value.AvatarFile.name.split(".");
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
        url: `ParkMembers`,
        method: "post",
        data,
      },
      toast
    );
    await getParkMemberAsync();
    const toastContent = parkMemberConstantsLanguage.value.Toast;
    toast.add(
      toastContent.ActionParkMemberSuccess(toastContent[formMode.value])
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
async function updateOneParkMemberAsync(toast, languageCode) {
  try {
    const data = processParkMemberFormData(formModeEnum.Update);
    if (!validateParkMemberFormData(data)) {
      return;
    }
    const response = await request(
      {
        url: `ParkMembers/${parkMemberFormData.value.ParkMemberId}`,
        method: "put",
        data,
      },
      toast
    );
    await getParkMemberAsync();
    const toastContent = parkMemberConstantsLanguage.value.Toast;
    toast.add(
      toastContent.ActionParkMemberSuccess(toastContent[formMode.value])
    );
    // Sau khi người dùng sửa lỗi và gọi API thành công thì bỏ lỗi của form
    formError.value = {};
  } catch (error) {
    console.log(error);
  }
}
/**
 * Hàm chuyển đổi parkMemberFormData từ Object sang FormData
 * @returns FormData
 * Created by: nkmdang 18/03/2024
 */
function convertParkMemberFormDataToFormData(mode) {
  const formData = new FormData();
  for (let key in parkMemberFormData.value) {
    formData.append(key, parkMemberFormData.value[key]);
  }

  if (mode === formModeEnum.Create) {
    if (parkMemberFormData.value.DateOfBirth) {
      console.log(parkMemberFormData.value.DateOfBirth);
      formData.set(
        "DateOfBirth",
        convertDatePrimeCalendarToDateDB(parkMemberFormData.value.DateOfBirth)
      );
    }
    if (parkMemberData.value.PICreatedDate) {
      formData.set(
        "PICreatedDate",
        convertDatePrimeCalendarToDateDB(parkMemberFormData.value.PICreatedDate)
      );
    }
  } else if (mode === formModeEnum.Update) {
    if (parkMemberFormData.value.DateOfBirth) {
      formData.set(
        "DateOfBirth",
        convertDateUIToDateDB(parkMemberFormData.value.DateOfBirth)
      );
    }
    if (parkMemberFormData.value.PICreatedDate) {
      formData.set(
        "PICreatedDate",
        convertDateUIToDateDB(parkMemberFormData.value.PICreatedDate)
      );
    }
  }
  formData.set("ModifiedDate", getCurrentTimeString());
  // formData.set(
  //   "DepartmentId",
  //   parkMemberFormData.value.Department?.DepartmentId ||
  //     parkMemberFormData.value?.DepartmentId
  // );
  console.log(formData.get("TitleId"), formData.get("DepartmentId"));
  return formData;
}

/**
 * Hàm xử lý parkMemberFormData trước khi gửi cho Backend
 * @param {Number} mode
 * Created by: nkmdang 09/04/2024
 */
function processParkMemberFormData(mode) {
  const parkMemberSendFormData = {
    ...parkMemberFormData.value,
  };
  const departmentName = parkMemberSendFormData.DepartmentName;
  for (let department of departmentData) {
    if (department.DepartmentName === departmentName) {
      parkMemberSendFormData.DepartmentId = department.DepartmentId;
      break;
    }
  }
  const titleName = parkMemberSendFormData.TitleName;
  for (let titleData of titleOptions.value) {
    if (titleData.TitleName === titleName) {
      parkMemberSendFormData.TitleId = titleData.TitleId;
      break;
    }
  }

  if (mode === formModeEnum.Create) {
    if (parkMemberSendFormData.DateOfBirth) {
      parkMemberSendFormData.DateOfBirth = convertDatePrimeCalendarToDateDB(
        parkMemberSendFormData.DateOfBirth
      );
    } else {
      parkMemberSendFormData.DateOfBirth = null;
    }
    if (parkMemberSendFormData.PICreatedDate) {
      parkMemberSendFormData.PICreatedDate = convertDatePrimeCalendarToDateDB(
        parkMemberSendFormData.PICreatedDate
      );
    } else {
      parkMemberSendFormData.PICreatedDate = null;
    }
  } else if (mode === formModeEnum.Update) {
    if (parkMemberSendFormData.DateOfBirth) {
      parkMemberSendFormData.DateOfBirth = convertDateUIToDateDB(
        parkMemberSendFormData.DateOfBirth
      );
    }
    if (parkMemberSendFormData.PICreatedDate) {
      parkMemberSendFormData.PICreatedDate = convertDateUIToDateDB(
        parkMemberSendFormData.PICreatedDate
      );
    }
  }
  parkMemberSendFormData.ModifiedDate = getCurrentTimeString();
  console.log(parkMemberSendFormData);
  return parkMemberSendFormData;
}

/**
 * Hàm validate các thông tin nhân viên
 * @returns Boolean
 */
function validateParkMemberFormData(data) {
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
  const parkMemberFieldValidate = {
    ParkMemberCode: {
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

  for (let field in parkMemberFieldValidate) {
    for (let key in parkMemberFieldValidate[field]) {
      if (key == "maxLength") {
        const errorMessageField = parkMemberFieldValidate[field].require
          ? "MaxLengthAndRequire"
          : "Length";
        errorObject[field] = validateCustomRequireAndMaxlength(
          data[field],
          parkMemberConstantsLanguage.value.formError[
            field + errorMessageField
          ],
          parkMemberFieldValidate[field].require
        );
      } else if (key == "regex") {
        if (parkMemberFieldValidate[field].require) {
          errorObject[field] = validateByRegex(
            data[field],
            parkMemberConstantsLanguage.value.formError[
              field + "InvalidFormat"
            ],
            parkMemberFieldValidate[field].regex
          );
        } else if (data[field]) {
          errorObject[field] = validateByRegex(
            data[field],
            parkMemberConstantsLanguage.value.formError[
              field + "InvalidFormat"
            ],
            parkMemberFieldValidate[field].regex
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
      parkMemberConstantsLanguage.value.formError.DateOfBirthGenderInvalid,
      16,
      200
    );
  }

  if (data["PICreatedDate"]) {
    errorObject.PICreatedDate = validateDateNotMoreThanTargetDate(
      data["PICreatedDate"],
      parkMemberConstantsLanguage.value.formError.PICreatedDateInfuture
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

function handleParkMemberFormDataError(error) {
  if (error.response?.status === 400) {
  }
}

/**
 * Hàm xóa thông tin nhân viên theo Id
 * @param {Guid (String)} parkMemberId
 * @returns
 */
async function deleteParkMemberByIdAsync(toast, parkMemberId) {
  const response = await request({
    url: `ParkMembers/${parkMemberId}`,
    method: "delete",
  });
  await getParkMemberAsync();
  return response;
}

/**
 * Hàm lấy mã nhân viên mới từ backend
 * @returns Mã nhân viên mới
 * Created by: nkmdang 14/03/2024
 */
async function getNewParkMemberCode() {
  const response = await request({
    url: `ParkMembers/NewParkMemberCode/${userStore.companyId}`,
    method: "get",
  });
  return response;
}

/**
 * Hàm nhận file excel từ backend
 * @param {Int} page
 * @param {Int} pageSize
 * @param {String} parkMemberProperty
 *
 * Created By: nkmdang 10/10/2023
 */
async function exportExcelCurrentPage(aRef) {
  // this.parkMemberPropertyExcel = this.parkMemberProperty;
  try {
    const response = await request({
      url: `ParkMembers/ParkMembersExcel?page=${parkMemberPaging.value.page}&pageSize=${parkMemberPaging.value.pageSize}&searchProperty=${parkMemberPaging.value.searchProperty}`,
      method: "get",
      responseType: "blob",
    });
    // const response = await axios.get(
    //   `ParkMembers/ParkMembersExcel?page=${page}&pageSize=${pageSize}`,
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

export function ParkMemberService() {
  return {
    isGettingParkMemberData,
    isShowParkMemberForm,
    parkMemberData,
    parkMemberSelected,
    parkMemberPaging,
    parkMemberFormData,
    tableInf,
    numberRecordsPerPageOptions,
    departmentOptions,
    titleOptions,
    formMode,
    formModeEnum,
    parkMemberTableInf,
    parkMemberConstantsLanguage,
    paginatorPending,
    formError,
    exportExcelOptions,
    VNLicensePlateRegex,
    showParkMemberForm,
    showParkMemberFormConfirmDialog,
    hideParkMemberForm,
    unSelectAllParkMember,
    confirmDeleteOneParkMember,
    getParkMemberAsyncWitdhPending,
    getNewParkMemberCode,
    getParkMemberAsync,
    createOneParkMemberAsync,
    updateOneParkMemberAsync,
    deleteParkMemberByIdAsync,
    exportExcelCurrentPage,
    getDepartmentOptionsAsync,
    getTitleOptionsAsync,
  };
}
