<template>
  <div class="main">
    <v-overlay
      :value="logoutOverlay || loading"
      absolute
      color="white"
      opacity="1"
      z-index="999"
    >
      <v-progress-circular
        :size="70"
        :width="7"
        color="primary"
        indeterminate
      ></v-progress-circular
    ></v-overlay>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
      <div class="d-flex align-center">
        <a style="color: white; text-decoration: none" href="/"
          >Veterinaria CenVet</a
        >
      </div>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list nav dense>
        <v-list-item-group v-model="group">
          <v-list-item
            v-for="item in items"
            :key="item.title"
            :to="item.link ? item.link : null"
            @click="item.method == 'logout' ? logout() : null"
            link
          >
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-list-item-icon v-bind="attrs" v-on="on">
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>
              </template>
              <span>{{ item.title }}</span>
            </v-tooltip>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-card class="pa-4">
      <router-view></router-view>
    </v-card>
  </div>
</template>

<script>
import BackendService from "@/services/backend.service";
import LocalStorageUtils from "@/utils/local-storage.utils";
import Vue from "vue";

export default Vue.extend({
  name: "MainView",
  data: () => ({
    drawer: false,
    group: null,
    items: [
      {
        title: "Clientes",
        icon: "mdi-account",
        link: "/clientes",
      },
      {
        title: "Agenda",
        icon: "mdi-notebook",
        link: "/agenda",
      },
      {
        title: "Cerrar sesión",
        icon: "mdi-logout",
        method: "logout",
      },
    ],
    logoutOverlay: false,
    loading: true,
  }),
  beforeMount() {
    this.checkUser();
  },
  methods: {
    async checkUser() {
      this.loading = true;
      try {
        const usuario = LocalStorageUtils.read("usuario");
        if (!usuario) {
          this.logout();
          return;
        }
        await BackendService.check();
      } catch (error) {
        // Handle error
        this.logout();
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      this.logoutOverlay = true;
      setTimeout(() => {
        LocalStorageUtils.remove("usuario");
        this.$router.push({ path: "/login" });
      }, 2000);
    },
  },
});
</script>

<style lang="scss" scoped>
.main {
  background-color: #f5f5f5;
  height: 100%;
  padding: 1rem;
}
</style>