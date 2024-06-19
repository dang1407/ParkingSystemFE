import { createApp } from "vue";
import App from "./App.vue";
import "@/css/index.css";
import "@/scss/styles.scss";
import PrimeVue from "primevue/config";
import "primeicons/primeicons.css";
import Lara from "@/presets/lara"; //import preset
import ConfirmationService from "primevue/confirmationservice";
import ToastService from "primevue/toastservice";
import DialogService from "primevue/dialogservice";
import BadgeDirective from "primevue/badgedirective";
import Tooltip from "primevue/tooltip";
import Ripple from "primevue/ripple";
import router from "@/router";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";
//in main.js

// Locale for Primevue
const app = createApp(App);
// use pinia
app.use(createPinia());
// use vue i18n
app.use(createI18n());
app.use(ConfirmationService);
app.use(ToastService);
app.use(DialogService);
app.directive("ripple", Ripple);
app.directive("tooltip", Tooltip);
app.directive("badge", BadgeDirective);
app.use(PrimeVue, {
  unstyled: true,
  pt: Lara, //apply preset
});

app.config.errorHandler = (err, vm, info) => {
  // handle error
  // `info` is a Vue-specific error info, e.g. which lifecycle hook
  // the error was found in
  console.log(err + "\n" + vm + "\n" + info);
};

app.config.warnHandler = function (msg, vm, trace) {
  // `trace` is the component hierarchy trace
  console.log(msg + "\n" + vm + "\n" + trace);
};

app.use(router);
app.mount("#app");
