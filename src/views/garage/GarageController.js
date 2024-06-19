import { ref, computed } from "vue";
import { useAxios } from "@/hooks/useAxios";
const { request } = useAxios();
const VehicleEnum = {
  Bikecycle: 0,
  Motorbike: 1,
  Car: 2,
};
const VehicleSlotState = {
  Bad: 0.9,
  Good: 0.5,
  VeryGood: 0,
};
const VehicleStateEnum = {
  Bad: 1,
  Good: 2,
  VeryGood: 3,
};

const price = {
  2: {
    0: {
      InDayBefore18: 2000,
      InDayAfter18: 3000,
      OutDay: 5000,
    },
    1: {
      InDayBefore18: 3000,
      InDayAfter18: 5000,
      OutDay: 8000,
    },
    2: {
      Hour: 5000,
    },
  },
  1: {
    0: {
      InDayBefore18: 3000,
      InDayAfter18: 4000,
      OutDay: 8000,
    },
    1: {
      InDayBefore18: 4000,
      InDayAfter18: 6000,
      OutDay: 10000,
    },
    2: {
      Hour: 8000,
    },
  },
};

const parkingVehicleData = ref({});
const parkingLotData = ref({});

async function getParkingVehicleDataAsync(parkingId) {
  try {
    const response = await request({
      url: `ParkSlots/statistical/${parkingId}`,
      method: "get",
    });
    parkingVehicleData.value = response;
  } catch (error) {
    console.log(error);
  }
}

async function getParkingLotDataAsync(parkingId) {
  try {
    const response = await request({
      url: `Parkings/${parkingId}`,
      method: "get",
    });
    parkingLotData.value = response[0];
  } catch (error) {
    console.log(error);
  }
}

function getVehicleSlotState(stateValue) {
  for (let key in VehicleSlotState) {
    if (stateValue > VehicleSlotState[key]) {
      return VehicleEnum[key];
    }
  }
}

export function GarageController() {
  return {
    parkingVehicleData,
    parkingLotData,
    GarageConstancesLanguage,
    price,
    getParkingVehicleDataAsync,
    getParkingLotDataAsync,
    getVehicleSlotState,
  };
}
