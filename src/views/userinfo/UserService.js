import { ref, computed } from "vue";
import { EmployeeService } from "../employee/EmployeeService";
import { useHelperStore } from "@/stores/HelperStore";
import { CustomerRegisterService } from "../register/CustomerRegisterService";
import { LICENSE_PLATE_REGEX } from "@/constants/regex";
import { useValidate } from "@/hooks/useValidate";
import { useAxios } from "@/hooks/useAxios";
import { UserInforConstance } from "./UserConstance";
import {
  storage,
  firebaseRef,
  timeStamp,
  uploadBytes,
  getDownloadURL,
} from "@/services/FireBase";
const { request } = useAxios();
const { validateEmployeeFormData } = EmployeeService();
const { validateFormData, validateWorkingAge } = useValidate();
const { validateParkMemberRegisterFormData, registerConstancesLanguage } =
  CustomerRegisterService();
const HelperStore = useHelperStore();
const formError = ref({});
const parkMemberRegisterFieldValidate = {
  FullName: {
    maxLength: 255,
    require: true,
  },
  Address: {
    maxLength: 255,
    require: false,
  },
  Mobile: {
    regex: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
    require: true,
  },
  PersonalIdentification: {
    regex: /^0[0-9]{9}$/,
    maxLength: 20,
    require: true,
  },
  LicensePlate: {
    regex: LICENSE_PLATE_REGEX,
    maxLength: 255,
    require: true,
  },
};

// const RegisterConstances = {
//   vi: {
//     register: "Đăng ký",
//     login: "Đã có tài khoản",
//     vehicleOptions: [
//       { name: "Xe máy", value: 1 },
//       { name: "Ô tô", value: 2 },
//     ],
//     formLabel: {
//       fullName: "Họ và tên",
//       password: "Mật khẩu",
//       confirmPassword: "Nhập lại mật khẩu",
//       licensePlate: "Biển số xe",
//       vehicle: "Loại xe",
//       personalIdentification: "Số CCCD",
//       personalIdentificationTooltip: "Số căn cước công dân",
//       mobile: "Số điện thoại",
//       userName: "Tài khoản",
//       company: "Công ty",
//     },
//     formError: {
//       FullNameMaxLengthAndRequire: "Họ và tên là bắt buộc.",
//       FullNameLength: "Họ và tên không vượt quá 255 kí tự.",
//       LicensePlateMaxLengthAndRequire: "Biển số xe là bắt buộc.",
//       LicensePlateLength: "Biển số xe không vượt quá 255 kí tự.",
//       UserNameMaxLengthAndRequire: "Tài khoản là bắt buộc.",
//       UserNameLength: "Tài khoản không vượt quá 255 kí tự.",
//       UserNameInvalidFormat:
//         "Tài khoản phải bao gồm chữ in hoa, chữ in thường, chữ số và tối thiểu 6 kí tự",
//       AddressLength: "Địa chỉ không vượt quá 255 kí tự.",
//       PasswordInvalidFormat:
//         "Mật khẩu tối thiểu 8 kí tự, chứa chữ cái, chữ số và kí tự đặc biệt.",
//       PasswordNotMatchConfirmPassword:
//         "Mật khẩu không khớp với nhập lại mật khẩu.",
//       MobileMaxLengthAndRequire: "Số điện thoại là bắt buộc.",
//       MobileLength: "Số điện thoại không vượt quá 255 kí tự.",
//       MobileInvalidFormat: "Số điện thoại không hợp lệ",
//       PersonalIdentificationInvalidFormat:
//         "Số căn cước công dân chưa đúng định dạng.",
//       PersonalIdentificationMaxLengthAndRequire:
//         "Số căn cước công dân là bắt buộc.",
//       PersonalIdentificationLength:
//         "Số căn cước công dân không vượt quá 255 kí tự.",
//       LicensePlateInvalidFormat: "Biển số xe chưa đúng định dạng.",
//       VehicleOptionNotSelect: "Bạn chưa chọn loại xe.",
//     },
//     toast: {
//       RegisterSucces: {
//         summary: "Thành công",
//         detail: "Đăng ký thành công",
//         severity: "success",
//         life: 5000,
//       },
//     },
//   },
//   en: {
//     register: "Register",
//     login: "Already have an account",
//     vehicleOptions: [
//       { name: "Motorbike", value: 1 },
//       { name: "Car", value: 2 },
//     ],
//     formLabel: {
//       fullName: "Full Name",
//       password: "Password",
//       confirmPassword: "Confirm Password",
//       licensePlate: "License Plate",
//       vehicle: "Vehicle",
//       personalIdentification: "National ID",
//       personalIdentificationTooltip:
//         "Enter your national identification number",
//       mobile: "Mobile",
//       userName: "User name",
//       company: "Company",
//     },
//     formError: {
//       FullNameMaxLengthAndRequire: "Full name is required.",
//       FullNameLength: "Full name cannot exceed 255 characters.",
//       LicensePlateMaxLengthAndRequire: "License plate is required.",
//       LicensePlateLength:
//         "Vehicle license plate must not exceed 255 characters.",
//       UserNameMaxLengthAndRequire: "User name is required.",
//       UserNameLength: "User name must not exceed 255 characters.",
//       UserNameInvalidFormat:
//         "The user name must contain uppercase letters, lowercase letters, numbers and at least 6 characters",
//       AddressLength: "Address must not exceed 255 characters.",
//       PasswordInvalidFormat:
//         "Password must be at least 8 characters, contain letters, numbers and special characters.",
//       PasswordNotMatchConfirmPassword:
//         "Password doesn't match with confirm password.",

//       MobileMaxLengthAndRequire: "Full name is required.",
//       MobileLength: "Full name cannot exceed 255 characters.",
//       MobileInvalidFormat: "Mobile invalid",
//       LicensePlateInvalidFormat:
//         "License plates are required and must be in the correct format.",
//       PersonalIdentificationInvalidFormat:
//         "Citizen identification number is required and must be in the correct format.",
//       PersonalIdentificationMaxLengthAndRequire:
//         "Citizen ID number is required.",
//       PersonalIdentificationLength:
//         "Citizen identification number must not exceed 255 characters.",
//       VehicleOptionNotSelect: "You have not selected a vehicle type.",
//     },
//     toast: {
//       RegisterSucces: {
//         summary: "Success",
//         detail: "Successful registration",
//         severity: "success",
//         life: 5000,
//       },
//     },
//   },
// };

// const registerConstancesLanguage = computed(() => {
//   return RegisterConstances[HelperStore.languageCode];
// });
const UserInforConstanceLanguage = computed(() => {
  return UserInforConstance[HelperStore.languageCode];
});

async function updateParkMember(data, toast) {
  try {
    if (
      !validateFormData(
        data,
        formError,
        parkMemberRegisterFieldValidate,
        registerConstancesLanguage.value
      )
    ) {
      console.log(formError.value);
      return false;
    }

    if (data.DateOfBirth) {
      formError.value = validateWorkingAge(
        data.DateOfBirth,
        registerConstancesLanguage.value.DateOfBirth
      );
    }
    console.log(data);
    const response = await request(
      {
        url: "Account/parkmember",
        method: "PUT",
        data,
      },
      toast
    );
    console.log(response);
    toast.add(UserInforConstanceLanguage.value.toast.UpdateUserInforSuccess);
    return true;
  } catch (error) {
    console.log(error);
  }
}

async function getDepartmentInfor(departmentId, toast) {
  try {
    const response = await request(
      {
        url: `Departments/${departmentId}`,
        method: "GET",
      },
      toast
    );
    return response;
  } catch (error) {
    console.log(error);
  }
}

async function getTitleInfor(titleId, toast) {
  try {
    const response = await request(
      {
        url: `Titles/${titleId}`,
        method: "GET",
      },
      toast
    );
    return response;
  } catch (error) {
    console.log(error);
  }
}

export function UserService() {
  return {
    formError,
    updateParkMember,
    getDepartmentInfor,
    getTitleInfor,
  };
}
