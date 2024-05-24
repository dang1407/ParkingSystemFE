import { ref } from "vue";
import { useHelperStore } from "@/stores/HelperStore";
import { useAxios } from "@/hooks/useAxios";
import { useValidate } from "@/hooks/useValidate";
const { request } = useAxios();
const isPending = ref(false);
const formError = ref({});
const formData = ref({});
const parkMemberRegisterFieldValidate = {
  FullName: {
    maxLength: 255,
    require: true,
  },
  Address: {
    maxLength: 255,
    require: true,
  },
  Mobile: {
    regex: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
    require: true,
  },
  PersonalIdentification: {
    regex: /^0[0-9]{9}$/,
    require: true,
  },
  LicensePlate: {
    maxLength: 255,
    regex: /[[0-9]{2}|[0-9]{2}[A-Z]][0-9]{4,5}/,
    require: true,
  },
  UserName: {
    maxLength: 255,
    require: true,
  },
  Password: {
    maxLength: 255,
    require: true,
  },
  ConfirmPassword: {
    maxLength: 255,
    require: true,
  },
};

function validateParkMemberRegisterFormData() {
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

  for (let field in parkMemberRegisterFieldValidate) {
    for (let key in parkMemberRegisterFieldValidate[field]) {
      if (key == "maxLength") {
        const errorMessageField = parkMemberRegisterFieldValidate[field].require
          ? "MaxLengthAndRequire"
          : "Length";
        errorObject[field] = validateCustomRequireAndMaxlength(
          data[field],
          parkMemberRegisterConstantsLanguage.value.formError[
            field + errorMessageField
          ],
          parkMemberRegisterFieldValidate[field].require
        );
      } else if (key == "regex") {
        if (parkMemberRegisterFieldValidate[field].require) {
          errorObject[field] = validateByRegex(
            data[field],
            parkMemberRegisterConstantsLanguage.value.formError[
              field + "InvalidFormat"
            ],
            parkMemberRegisterFieldValidate[field].regex
          );
        } else if (data[field]) {
          errorObject[field] = validateByRegex(
            data[field],
            parkMemberRegisterConstantsLanguage.value.formError[
              field + "InvalidFormat"
            ],
            parkMemberRegisterFieldValidate[field].regex
          );
        }
      }
    }
  }
}
async function registerAsync() {
  if (!validateParkMemberRegisterFormData()) {
    return;
  }
  try {
    const response = await request({
      url: "",
      method: "POST",
      data: formData.value,
    });
  } catch (error) {
    console.error(error);
  }
}

const RegisterConstances = {
  vi: {
    register: "Đăng ký",
    login: "Đã có tài khoản",
    vehicleOptions: [
      { name: "Xe máy", value: 1 },
      { name: "Ô tô", value: 2 },
    ],
    formLabel: {
      fullName: "Họ và tên",
      password: "Mật khẩu",
      confirmPassword: "Nhập lại mật khẩu",
      licensePlate: "Biển số xe",
      vehicle: "Loại xe",
      personalIdentification: "Số CCCD",
      personalIdentificationTooltip: "Số căn cước công dân",
      mobile: "Số điện thoại",
      userName: "Tài khoản",
      company: "Công ty",
    },
    formError: {
      FullNameMaxLengthAndRequire: "Họ và tên là bắt buộc.",
      FullNameLength: "Họ và tên không vượt quá 255 kí tự.",
      AddressLength: "Địa chỉ không vượt quá 255 kí tự.",
      PasswordInvalidFormat:
        "Mật khẩu tối thiểu 8 kí tự, chứa chữ cái, chữ số và kí tự đặc biệt.",
      PasswordNotMatchConfirmPassword:
        "Mật khẩu không khớp với nhập lại mật khẩu.",
    },
  },
  en: {
    register: "Register",
    login: "Already have an account",
    vehicleOptions: [
      { name: "Motorbike", value: 1 },
      { name: "Car", value: 2 },
    ],
    formLabel: {
      fullName: "Full Name",
      password: "Password",
      confirmPassword: "Confirm Password",
      licensePlate: "License Plate",
      vehicle: "Vehicle",
      personalIdentification: "National ID",
      personalIdentificationTooltip:
        "Enter your national identification number",
      mobile: "Mobile",
      userName: "User name",
      company: "Company",
    },
    formError: {
      FullNameMaxLengthAndRequire: "Full name is required.",
      FullNameLength: "Full name cannot exceed 255 characters.",
      AddressLength: "Address must not exceed 255 characters.",
      PasswordInvalidFormat:
        "Password must be at least 8 characters, contain letters, numbers and special characters.",
      PasswordNotMatchConfirmPassword:
        "Password doesn't match with confirm password.",
    },
  },
};

export function CustomerRegisterService() {
  return {
    RegisterConstances,
    formData,
    formError,
    isPending,
    registerAsync,
  };
}
