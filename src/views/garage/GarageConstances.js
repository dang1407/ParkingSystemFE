export const GarageConstances = {
  vi: {
    accept: "Đồng ý",
    cancel: "Không",
    price: "Thành tiền",
    billInfor: "Thông tin hóa đơn",
    takePhotoAgain: "Chụp biển số xe lại",
    updateCustomerLicensePlate: "Sửa biển số xe đã đặt",
    exportBillButtonLabel: "Xuất hóa đơn",
    update: "Sửa",
    infor: "Thông tin xe có trong bãi đỗ xe",
    outGarageFormHeader: "Thông tin hóa đơn",
    column: "Cột",
    mapTitle: "Bản đồ bãi đỗ xe",
    intervalCallTitle: (time) =>
      `Thông tin bãi đỗ xe được cập nhật ${time} giây một lần`,
    emptyParkingLot: "Bạn chưa thêm bãi đỗ xe nào!",
    state: "Trạng thái",
    formTitle: "Thông tin vị trí để xe",
    missingFieldRequired: "Bạn chưa nhập trường bắt buộc",
    formError: {
      FieldNotValid: "Lỗi nhập liệu",
      MissingLicensePlate: "Bạn chưa điền thông tin biển số xe",
      LicensePlateInNotMatch: "Biển số xe không khớp với biển đã đăng ký!",
      LicensePlateOutNotMatch: "Biển số xe ra không khớp với biển số xe vào!",
      LicensePlateNotValid:
        "Biển số xe không đúng định dạng. Vui lòng kiểm tra lại.",
    },
    formLabel: {
      enterVehilceToGarage: "Đưa xe vào bãi",
      enterVehicleOutGarage: "Đưa xe ra khỏi bãi",
      caculateBill: "Xuất hóa đơn",
      LicensePlatePredictLabel: "Biển số xe đọc được",
      LicensePlateImageTakedLabel: "Hình ảnh xe đã chụp",
      LicensePlate: "Biển số xe",
      ParkSlotCode: "Mã vị trí gửi xe",
      VehicleLabel: "Loại xe",
      VehicleInDateLabel: "Thời gian vào",
      VehicleOutDateLabel: "Thời gian ra",
      Vehicle: {
        0: "Xe đạp",
        1: "Xe máy",
        2: "Ô tô",
      },
      StateLabel: "Trạng thái",
      State: {
        0: "Chưa có xe",
        1: "Đã được đặt chỗ",
        2: "Đã có xe",
      },

      Order: "Đặt chỗ",
    },
    toast: {
      OrderParSlotSuccess: {
        summary: "Thành công",
        severity: "success",
        detail: "Đặt chỗ thành công",
        life: 10000,
      },
      EnterVehicleToGarageSuccess: {
        summary: "Thành công",
        severity: "success",
        detail: "Thêm xe vào bãi thành công",
        life: 10000,
      },
      EnterVehicleOutGarageSuccess: {
        summary: "Thành công",
        severity: "success",
        detail: "Lấy xe ra khỏi bãi thành công",
        life: 10000,
      },
      UpdatePreOrderSuccess: {
        summary: "Thành công",
        severity: "success",
        detail: "Sửa thông tin đặt trước vị trí đỗ xe thành công",
        life: 10000,
      },
    },
  },
  en: {
    accept: "Accept",
    cancel: "Cancel",
    update: "Update",
    price: "Price",
    takePhotoAgain: "Take license plate photo again",
    updateCustomerLicensePlate: "Edit the booked license plate",

    billInfor: "Invoice information",
    exportBillButtonLabel: "Export invoice",
    infor: "Vehicle information available in the parking lot",
    column: "Column",
    mapTitle: "Parking Lot Map",
    intervalCallTitle: (time) =>
      `Parking information is updated every ${time} seconds`,
    emptyParkingLot: "You haven't added any parking lots yet!",
    missingFieldRequired: "You have not entered a required field",
    outGarageFormHeader: "Invoice information",
    state: "State",
    formTitle: "Park slot information",
    formError: {
      FieldNotValid: "Input error",
      MissingLicensePlate:
        "You have not filled in the license plate information",
      LicensePlateInNotMatch:
        "The license plate number does not match the registered license plate!",
      LicensePlateOutNotMatch:
        "The outgoing license plate does not match the incoming license plate!",
      LicensePlateNotValid:
        "The license plate is not in the correct format. Please check again.",
    },
    formLabel: {
      enterVehilceToGarage: "Enter vehicle to parking lot",
      enterVehicleOutGarage: "Take the vehicle out of the yard",
      caculateBill: "Export invoice",
      LicensePlatePredictLabel: "License plate readable",
      LicensePlateImageTakedLabel: "Vehicle image taken",
      LicensePlate: "License plate",
      ParkSlotCode: "Parking location code",
      VehicleLabel: "Vehicle type",
      VehicleOutDateLabel: "Out time",
      VehicleInDateLabel: "Time in",
      Vehicle: {
        0: "Bicycle",
        1: "Motorcycle",
        2: "Car",
      },
      StateLabel: "State",
      State: {
        0: "No car yet",
        1: "Reserved for other",
        2: "Vehicle entered",
      },
      Order: "Reserve",
    },

    toast: {
      OrderParSlotSuccess: {
        summary: "Success",
        severity: "success",
        detail: "Reservation parkslot successful",
        life: 10000,
      },
      EnterVehicleToGarageSuccess: {
        summary: "Success",
        severity: "success",
        detail: "Successfully added vehicle to the parking lot",
        life: 10000,
      },
      EnterVehicleOutGarageSuccess: {
        summary: "Success",
        severity: "success",
        detail: "Successfully enter out the car from the parking lot",
        life: 10000,
      },
      UpdatePreOrderSuccess: {
        summary: "Success",
        severity: "success",
        detail: "Successfully edited parking location reservation information",
        life: 10000,
      },
    },
  },
};
