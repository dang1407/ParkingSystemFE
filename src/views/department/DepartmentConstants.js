export const employeeConstants = {
  vi: {
    tableHeader: [
      { header: "Số thứ tự" },
      {
        header: "Tên phòng ban",
      },
    ],
    formHeading: {
      Create: "Thêm mới nhân viên",
      Update: "Thông tin nhân viên",
    },
    formLabel: {
      EmployeeCode: "Mã nhân viên",
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
    },
    formError: {
      FullNameMaxLengthAndRequire:
        "Họ và tên là bắt buộc và không vượt quá 255 kí tự.",
      FullNameLength: "Họ và tên không vượt quá 255 kí tự.",
      AddressLength: "Địa chỉ không vượt quá 255 kí tự.",
      PositionNameLength: "Chức danh không vượt quá 255 kí tự.",
      BankNameLength: "Tên ngân hàng không vượt quá 255 kí tự.",
      BankBrachNameLength: "Chi nhánh ngân hàng không vượt quá 255 kí tự.",
      BankAccountInvalid: "Số tài khoản ngân hàng không hợp lệ",
      DateOfBirthGenderInvalid: {
        0: "Độ tuổi người lao động nữ phải từ 18 đến 60",
        1: "Độ tuổi người lao động nam phải từ 18 đến 65",
        2: "Độ tuổi người lao động phải từ 18 đến 65",
      },
      PICreatedPlaceLength: "Nơi cấp không quá 255 kí tự.",
      PICreatedDateInfuture: "Ngày cấp không được vượt quá ngày hiện tại.",
      DepartmentEmty: "Đơn vị là bắt buộc.",
      EmployeeCodeInvalidFormat:
        "Mã nhân viên phải có định dạng NV-00abcd, trong đó a, b, c, d là các chữ số.",
      PersonalIdentificationInvalid: "Số CCCD không đúng định dạng.",
    },
    listOfEmployeeTitle: "Danh sách nhân viên",
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
        1: (employeeCode) => `Tạo mới nhân viên ${employeeCode}?`,
        // Update
        2: (employeeCode) => `Cập nhật thông tin nhân viên ${employeeCode}?`,
        // Delete
        3: (employeeCode) => `Xóa nhân viên ${employeeCode}?`,
      },
      header: "Xác nhận",
    },
    Toast: {
      1: "Tạo mới",
      2: "Cập nhật thông tin",
      3: "Xóa thông tin",
      ActionEmployeeSuccess: (action) => ({
        summary: "Success",
        detail: `${action} một nhân viên thành công.`,
        severity: "success",
        life: 3000,
      }),
    },
  },
  en: {
    tableHeader: [
      { header: "Numerical Order" },
      {
        header: "Deparment name",
      },
    ],
    formHeading: {
      Create: "Create new employee",
      Update: "Employee Information",
    },
    formLabel: {
      EmployeeCode: "EmployeeCode",
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
    },
    formError: {
      FullNameMaxLengthAndRequire:
        "Full name is required and cannot not exceed 255 characters.",
      FullNameLength: "Full name cannot exceed 255 characters.",
      DepartmentEmty: "Department is required.",
      EmployeeCodeInvalidFormat:
        "The employee code must be in the format NV-00abcd, where a, b, c, d are digits.",
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
        2: "Employee age must be from 18 to 65",
      },
      PICreatedPlaceLength: "The grant must not exceed 255 characters.",
      PICreatedDateInfuture: "The issue date cannot exceed the current date.",
      DepartmentIdEmty: "You have not selected a department",
    },
    listOfEmployeeTitle: "List of employee",
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
        1: (employeeCode) => `Create new employee ${employeeCode}?`,
        // Update
        2: (employeeCode) => `Update employee information ${employeeCode}?`,
        // Delete
        3: (employeeCode) => `Delete employee ${employeeCode}?`,
      },
    },
    Toast: {
      1: "Create new one",
      2: "Update one",
      3: "Delete one",
      ActionEmployeeSuccess: (action) => ({
        summary: "Success",
        detail: `${action} employee successfully.`,
        severity: "success",
        life: 3000,
      }),
    },
  },
};
