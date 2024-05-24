import { useAxios } from "@/hooks/useAxios";
import { useUserStore } from "@/stores/UserStore";
class GarageController {
  constructor() {
    this.parkSlotsObject = {
      A1: [],
      A2: [],
      A3: [],
      B1: [],
      B2: [],
      B3: [],
      C1: [],
      C2: [],
      C3: [],
      C4: [],
      D1: [],
      D2: [],
      D3: [],
      D4: [],
      E1: [],
      E2: [],
      E3: [],
      F1: [],
      F2: [],
      G1: [],
      G2: [],
      H1: [],
      H2: [],
    };
    this.floor = "B2";
    this.userStore = useUserStore();
  }

  /**
   * Hàm lấy thông tin trạng thái vị trí gửi xe theo tầng
   * Created by: nkmdang 12/1/2024
   */
  async getParkSlotByFloorAsync() {
    // this.notificationStore.showLoading();
    const { request } = useAxios();
    const response = await request({
      url: `ParkSlots?floor=${this.floor}`,
      method: "get",
    });
    let rawData = response.data;
    // this.rawData = this.rawData.sort((a, b) => {
    //   a.ParkSlotState > b.ParkSlotState;
    // });
    // console.log(this.rawData);
    this.resetParkSlotsObject();
    for (let i = 0; i < rawData.length; i++) {
      if (rawData[i].ParkSlotCode) {
        const parkSlotProccessCode =
          rawData[i].ParkSlotCode[0] + rawData[i].ParkSlotCode[2];
        // console.log(parkSlotProccessCode);
        this.parkSlotsObject[parkSlotProccessCode].push(rawData[i]);
      }
    }
  }

  resetParkSlotsObject() {
    this.parkSlotsObject = {
      A1: [],
      A2: [],
      A3: [],
      B1: [],
      B2: [],
      B3: [],
      C1: [],
      C2: [],
      C3: [],
      C4: [],
      D1: [],
      D2: [],
      D3: [],
      D4: [],
      E1: [],
      E2: [],
      E3: [],
      F1: [],
      F2: [],
      G1: [],
      G2: [],
      H1: [],
      H2: [],
    };
  }
}

export default GarageController;
