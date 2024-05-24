import { useHelperStore } from "@/stores/HelperStore";
import { genderLanguage } from "@/constants/gender";
import dayjs from "dayjs";

const language = useHelperStore().languageCode;
/**
 * Chuyển đổi định dạng ngày từ DB yyyy-mm-dd sang dd/mm/yyyy để hiện thị ở datepicker
 * @param {String} dateDB Chuỗi nhận từ CSDL có dạng yyyy-mm-dd
 * @returns Ngày định dạng dd/mm/yyyy
 * Created by: nkmdang (03/10/2023)
 */
function convertDateDBToUIText(dateDB, datePattern) {
  if (!datePattern) {
    datePattern = "dd/MM/yyyy";
  }
  if (dateDB && dateDB !== "") {
    const year = dateDB.substring(0, 4);
    const month = dateDB.substring(5, 7);
    const date = dateDB.substring(8, 10);
    let result = datePattern;
    result = result.replace("dd", date);
    result = result.replace("yyyy", year);
    result = result.replace("MM", month);
    // return `${date}/${month}/${year}`;
    return result;
  } else {
    return "";
  }
}
/**
 * Hàm chuyển đổi ngày tháng trên giao diện thành ngày tháng YYYY-MM-DD HH:mm:ss
 * để gửi sang backend
 * @param {Date} inputString
 * @returns Date YYYY-MM-DD HH:mm:ss
 * Created by: nkmdang 18/03/2024
 */
function convertDateUIToDateDB(inputString) {
  // Phân tích chuỗi thời gian đầu vào
  var parts = inputString.toString().split(/[\s/]+/);
  let timePart = [];
  // trong trường hợp người dùng ko chọn giờ phút thì cho bằng 00
  if (parts[3]) {
    timePart = parts[3].split(":");
  } else {
    timePart[0] = "00";
    timePart[1] = "00";
  }

  return `${parts[2]}-${parts[1]}-${parts[0]}T${timePart[0]}:${timePart[1]}:00`;
}

function convertDatePrimeCalendarToDateDB(primeCalendarDate) {
  const dateObj = new Date(Date.parse(primeCalendarDate));
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1; // Tháng bắt đầu từ 0
  const day = dateObj.getDate();
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const seconds = dateObj.getSeconds();
  return `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}T${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}Z`;
}

function convertGenderDBToUIText(gender) {
  // console.log(gender);
  return genderLanguage[language][gender];
}

function getCurrentTimeString() {
  const now = dayjs();

  const year = now.year();
  let month = now.month() + 1;
  if (month < 10) {
    month = "0" + month;
  }
  let day = now.date();
  if (day < 10) {
    day = "0" + day;
  }
  let hours = now.hour();
  if (hours < 10) {
    hours = "0" + hours;
  }
  let minutes = now.minute();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  let seconds = now.second();
  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

export function useConvert() {
  return {
    convertGenderDBToUIText,
    convertDateDBToUIText,
    convertDateUIToDateDB,
    convertDatePrimeCalendarToDateDB,
    getCurrentTimeString,
  };
}
