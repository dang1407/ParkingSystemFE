/**
 * Hàm validate chiều dài của dữ liệu
 * @param {any} data
 * @param {Number} maxLength
 * @param {Boolean} isRequire Nếu isRequire = true thì mã lỗi truyền vào phải mô tả bao gồm cả bắt buộc và chiều dài tối đa
 * @param {String} errorMessage
 * @returns errorrMessage || ""
 * Created by: nkmdang 12/03/2024
 */
function validateCustomRequireAndMaxlength(
  data,
  errorMessage,
  isRequire = false,
  maxLength = 255
) {
  // Nếu trường dữ liệu là bắt buộc
  if (isRequire && !data) {
    return errorMessage;
  }
  // kiểm tra độ dài
  if (data && data.length > maxLength) {
    return errorMessage;
  } else return "";
}

/**
 * Hàm validate thời gian không lớn hơn ngày chỉ định
 * @param {Date} date
 * @param {String} errorMessage
 * @param {Date} targetDate
 * Created by: nkmdang 12/03/2024
 */
function validateDateNotMoreThanTargetDate(
  date,
  errorMessage,
  targetDate = new Date()
) {
  let localDate;
  let localTargetDate;
  if (typeof date === "string") {
    // Tạo mới biến và gán để tránh làm thay đổi nếu truyền vào là object
    localDate = new Date(date);
  } else {
    localDate = date;
  }
  if (typeof targetDate === "string") {
    // Tạo mới biến và gán để tránh làm thay đổi nếu truyền vào là object
    localTargetDate = new Date(targetDate);
  } else {
    localTargetDate = targetDate;
  }

  if (localDate <= localTargetDate) {
    return "";
  } else {
    return errorMessage;
  }
}

/**
 * Hàm kiểm tra email có hợp lệ hay không
 * @param {String} data Thông tin email cần test
 * @param {String} errorMessage
 * @param {String} emailRegex
 * @returns errorMessage nếu không hợp lệ
 * Created by: nkmdang 15/03/2024
 */
function validateEmail(data, errorMessage, emailRegex) {
  const emailLocalRegex =
    emailRegex ||
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return validateByRegex(data, errorMessage, emailLocalRegex);
}

/**
 * Hàm validate theo biểu thức chính quy
 * @param {*} data
 * @param {*} regex
 * @param {*} errorMessage
 */
function validateByRegex(data, errorMessage, regex) {
  if (!regex.test(data)) {
    return errorMessage;
  } else {
    return "";
  }
}

/**
 * Hàm validate một trường dữ liệu phải có chiều dài cố định
 * @param {String} data
 * @param {String} errorMessage
 * @param {Number} targetLength
 * @returns errorMessage || ""
 * Created by: nkmdang 35/03/2024
 */
function validateCorrectLength(data, errorMessage, targetLength) {
  if (data.length !== targetLength) {
    return errorMessage;
  } else {
    return "";
  }
}

// Các hàm validate ngày tháng
function validateWorkingAge(
  dateString,
  errorMessage,
  workingStartDate = 18,
  workingEndAge = 65
) {
  const nowDate = new Date();
  const dataDate = new Date(dateString);
  const age = nowDate.getFullYear() - dataDate.getFullYear();
  console.log(dateString, dataDate);
  if (!(workingStartDate <= age && age <= workingEndAge)) {
    return errorMessage;
  } else return "";
}

export function useValidate() {
  return {
    validateCustomRequireAndMaxlength,
    validateDateNotMoreThanTargetDate,
    validateCorrectLength,
    validateByRegex,
    validateEmail,
    validateWorkingAge,
  };
}
