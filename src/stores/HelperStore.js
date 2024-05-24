import { defineStore } from "pinia";
import { ref, reactive } from "vue";
export const useHelperStore = defineStore("helperStore", {
  state: () => ({
    language: {
      label: "English",
      code: "en",
      languageLabel: "Language",
    },
    workingStartAge: 18,
    workingEndAge: {
      0: 60,
      1: 65,
      2: 65,
    },
  }),
  getters: {
    languageCode: (state) => {
      return state.language.code;
    },
  },
  actions: {},
});
