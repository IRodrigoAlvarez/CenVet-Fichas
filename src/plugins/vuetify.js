import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#19a25c",
        secondary: "#168b94",
        accent: "#168b94",
        error: "#b71c1c",
      },
      dark: {
        primary: colors.orange.darken4,
        secondary: colors.blue.darken1,
        accent: colors.amber.base,
        error: colors.red.accent2,
      },
    },
  },
});
