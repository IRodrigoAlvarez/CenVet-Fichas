import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import RutUtils from "./utils/rut.utils";

Vue.config.productionTip = false;

Vue.filter("rut", function (text) {
  return RutUtils.formatRut(text);
});

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
