export const parkMemberConstants = {
  vi: {
    tableHeader: [
      { header: "Mã khách hàng" },
      {
        header: "Họ và tên",
      },
      {
        header: "Ngày sinh",
      },
      {
        header: "Giới tính",
      },
      {
        header: "Biển số xe",
      },
    ],
    formHeading: {
      Create: "Thêm mới khách hàng",
      Update: "Thông tin khách hàng",
    },
    formLabel: {
      ParkMemberCode: "Mã khách hàng",
      FullName: "Họ và tên",
      Mobile: "Số điện thoại",
      Department: "Đơn vị",
      Position: "Chức danh",
      Gender: "Giới tính",
      DateOfBirth: "Ngày sinh",
      Address: "Địa chỉ",
      PersonalIdentification: "Số CCCD",
      PersonalIdentificationTooltip: "Số căn cước công dân",
      PICreatedDate: "Ngày cấp",
      PICreatedPlace: "Nơi cấp",
      BankAccount: "Số tài khoản ngân hàng",
      BankName: "Tên ngân hàng",
      BankBranch: "Chi nhánh ngân hàng",
      chooseImage: "Chọn hình ảnh",
      ChooseDepartmentBefore: "Vui lòng chọn đơn vị trước",
      LicensePlate: "Biển số xe",
    },
    formError: {
      FullNameMaxLengthAndRequire: "Họ và tên là bắt buộc.",
      FullNameLength: "Họ và tên không vượt quá 255 kí tự.",
      AddressLength: "Địa chỉ không vượt quá 255 kí tự.",
      PositionNameLength: "Chức danh không vượt quá 255 kí tự.",
      BankNameLength: "Tên ngân hàng không vượt quá 255 kí tự.",
      BankBrachNameLength: "Chi nhánh ngân hàng không vượt quá 255 kí tự.",
      BankAccountInvalid: "Số tài khoản ngân hàng không hợp lệ",
      DateOfBirthGenderInvalid: "Độ tuổi khách hàng phải đủ 16 tuổi",
      PICreatedPlaceLength: "Nơi cấp không quá 255 kí tự.",
      PICreatedDateInfuture: "Ngày cấp không được vượt quá ngày hiện tại.",
      DepartmentEmty: "Đơn vị là bắt buộc.",
      ParkMemberCodeInvalidFormat:
        "Mã khách hàng phải có định dạng NV-00abcd, trong đó a, b, c, d là các chữ số.",
      PersonalIdentificationInvalid: "Số CCCD không đúng định dạng.",
      TitleNameMaxLengthAndRequire: "Chức danh là bắt buộc.",
      BankAccountMaxLengthAndRequire: "Số tài khoản ngân hàng là bắt buộc.",
      BankNameMaxLengthAndRequire: "Tên ngân hàng là bắt buộc.",
    },
    listOfParkMemberTitle: "Danh sách khách hàng",
    createButtonText: "Thêm mới",
    formCancelButtonText: "Hủy",
    formAcceptButtonText: "Lưu",
    formAcceptAndDuplicateButtonText: `Lưu và nhân bản`,
    functionColumnHeader: "Chức năng",
    delete: "Xóa",
    replication: "Nhân bản",
    update: "Sửa",
    selected: "Đã chọn",
    unselect: "Bỏ chọn",
    exportExcelFileTooltip: "Xuất file excel",
    confirmDialog: {
      message: {
        // Create
        1: (parkMemberCode) => `Tạo mới khách hàng ${parkMemberCode}?`,
        // Update
        2: (parkMemberCode) =>
          `Cập nhật thông tin khách hàng ${parkMemberCode}?`,
        // Delete
        3: (parkMemberCode) => `Xóa khách hàng ${parkMemberCode}?`,
      },
      header: "Xác nhận",
    },
    Toast: {
      1: "Tạo mới",
      2: "Cập nhật thông tin",
      3: "Xóa thông tin",
      ActionParkMemberSuccess: (action) => ({
        summary: "Success",
        detail: `${action} một khách hàng thành công.`,
        severity: "success",
        life: 3000,
      }),
    },
  },
  en: {
    tableHeader: [
      { header: "ParkMember code" },
      {
        header: "Full name",
      },
      {
        header: "Date of birth",
      },
      {
        header: "Gender",
      },
      {
        header: "License Plate",
      },
    ],
    formHeading: {
      Create: "Create new parkMember",
      Update: "ParkMember Information",
    },
    formLabel: {
      ParkMemberCode: "ParkMemberCode",
      FullName: "Full name",
      Mobile: "Mobile",
      Department: "Department",
      Position: "Postion",
      Gender: "Gender",
      Address: "Address",
      DateOfBirth: "Date of birth",
      PersonalIdentification: "Citizen Identification Number",
      PersonalIdentificationTooltip: "Citizen Identification Number",
      PICreatedDate: "Date of Issue",
      PICreatedPlace: "Place of Issue",
      BankAccount: "Bank Account",
      BankName: "Bank Name",
      BankBranch: "Bank Branch",
      chooseImage: "Choose an image",
      ChooseDepartmentBefore: "Please select one department",
      LicensePlate: "LicensePlate",
    },
    formError: {
      FullNameMaxLengthAndRequire: "Full name is required.",
      FullNameLength: "Full name cannot exceed 255 characters.",
      DepartmentEmty: "Department is required.",
      ParkMemberCodeInvalidFormat:
        "The parkMember code must be in the format NV-00abcd, where a, b, c, d are digits.",
      PersonalIdentificationInvalid:
        "Citizen identification number is not in the correct format",
      AddressLength: "Address must not exceed 255 characters.",
      PositionNameLength: "The title must not exceed 255 characters.",
      BankNameLength: "Bank name must not exceed 255 characters.",
      BankBrachNameLength: "Bank branch must not exceed 255 characters.",
      BankAccountInvalid: "Invalid bank account number",
      DateOfBirthGenderInvalid: {
        0: "The age of female workers must be from 18 to 65",
        1: "The age of male workers must be from 18 to 60",
        2: "ParkMember age must be from 18 to 65",
      },
      PICreatedPlaceLength: "The grant must not exceed 255 characters.",
      PICreatedDateInfuture: "The issue date cannot exceed the current date.",
      DepartmentIdEmty: "You have not selected a department",
      TitleNameMaxLengthAndRequire: "You have not selected a position.",
      BankAccountMaxLengthAndRequire: "You have not entered bank account.",
      BankNameMaxLengthAndRequire: "You have not enter bank name.",
    },
    listOfParkMemberTitle: "List of parkMember",
    createButtonText: "Create new one",
    formCancelButtonText: "Cancel",
    formAcceptButtonText: "Save",
    formAcceptAndDuplicateButtonText: `Save and duplicate`,
    functionColumnHeader: "Function",
    delete: "Delete",
    replication: "Replication",
    update: "Update",
    selected: "Selected",
    unselect: "Unselect",
    exportExcelFileTooltip: "Export to excel",
    confirmDialog: {
      header: "Confirmation",
      message: {
        // Create
        1: (parkMemberCode) => `Create new parkMember ${parkMemberCode}?`,
        // Update
        2: (parkMemberCode) =>
          `Update parkMember information ${parkMemberCode}?`,
        // Delete
        3: (parkMemberCode) => `Delete parkMember ${parkMemberCode}?`,
      },
    },
    Toast: {
      1: "Create new one",
      2: "Update one",
      3: "Delete one",
      ActionParkMemberSuccess: (action) => ({
        summary: "Success",
        detail: `${action} parkMember successfully.`,
        severity: "success",
        life: 3000,
      }),
    },
  },
};
