// import { useConvert } from "../../../src/hooks/useConvert";
// const { convertDateUIToDateDB, getCurrentTimeString } = useConvert();
// console.log(getCurrentTimeString());
// import { useValidate } from "../../hooks/useValidate";
// const { validateByRegex } = useValidate();
// console.log(new Date("2024-04-09T21:46:54"));
// Address: null;
// AvatarLink: "https://t4.ftcdn.net/jpg/00/64/67/63/240_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg";
// BankAccount: "19036744400010";
// BankBranch: null;
// BankName: "Techcombank";
// CompanyAddress: "750 NE Beachwood Loop, Equitable Building, Denver, CO, 31201";
// CompanyMobile: "+420 295 422 169";
// CompanyName: "International Cars Inc.";
// CreatedBy: "NKMDANG";
// CreatedDate: "2024-04-09T14:38:00+07:00";
// DateOfBirth: "2002-07-15T00:00:00Z";
// DepartmentId: "674934cc-42cf-20cf-1d4a-aea48a10ed18";
// DepartmentName: "Information Technology";
// Email: "dang14072k2@gmail.com";
// EmployeeCode: "NV-009947";
// EmployeeId: "f66964fa-21e1-4866-bd71-2022f04db1e4";
// FullName: "Nguyễn Khánh Minh Đăng";
// Gender: 1;
// Mobile: "0961037364";
// ModifiedBy: "NKMDANG";
// ModifiedDate: "2024-04-09T22:45:28";
// PICreatedDate: null;
// PICreatedPlace: null;
// PersonalIdentification: "0252002000993";
// TitleId: "28b1edec-15f7-56b3-20cf-aa51525c979b";
// TitleName: "Lập trình viên Web FullStack";

// const regex = /^([0-9]{2}|[0-9]{2}[A-Z])([0-9]{4,5})$/;
// console.log(regex.test("30A-14556"));

// function convertDateDBToDDMMYYYHHMM(dateDB) {
//   if (dateDB && dateDB !== "") {
//     const datePattern = "dd/MM/yyyy hh:mm";
//     const year = dateDB.substring(0, 4);
//     const month = dateDB.substring(5, 7);
//     const date = dateDB.substring(8, 10);
//     const hour = date.substring(11, 13);
//     const minute = date.substring(14, 16);
//     let result = datePattern;
//     result = result.replace("dd", date);
//     result = result.replace("yyyy", year);
//     result = result.replace("MM", month);
//     result = result.replace("hh", hour);
//     result = result.replace("mm", minute);
//     // return `${date}/${month}/${year}`;
//     return result;
//   } else {
//     return "";
//   }
// }

// console.log(convertDateDBToDDMMYYYHHMM("2024-06-06T23:28:22+07:00"));
// const value = [{ value: 2023 }, { value: 2022 }];
// console.log(
//   value.reduce((total, currentValue, currentIndex, arr) => {
//     if (currentIndex > 0) return total + "," + currentValue.value;
//     else return currentValue.value;
//   }, "")
// );

const regex = /^(?=.*[a-z, A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
console.log(regex.test("absdsdc1!"));
