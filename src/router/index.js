import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/LoginView.vue"),
  },

  {
    path: "/",
    name: "main",
    component: () =>
      import(/* webpackChunkName: "main" */ "../views/MainView.vue"),
    children: [
      {
        path: "",
        component: () =>
          import(/* webpackChunkName: "menu" */ "../views/MenuView.vue"),
      },
      {
        path: "clientes",
        component: () =>
          import(
            /* webpackChunkName: "clientes" */ "../views/ClientesView.vue"
          ),
      },
      {
        path: "agenda",
        component: () =>
          import(/* webpackChunkName: "agenda" */ "../views/AgendaView.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
