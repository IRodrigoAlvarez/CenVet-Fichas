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
        redirect: () => {
          // the function receives the target route as the argument
          // we return a redirect path/location here.
          return { path: "/clientes" };
        },
      },
      {
        path: "clientes",
        component: () =>
          import(
            /* webpackChunkName: "clientes" */ "../views/ClientesView.vue"
          ),
      },
      {
        path: "clientes/:clienteId",
        component: () =>
          import(
            /* webpackChunkName: "clienteDetail" */ "../views/ClienteDetailView.vue"
          ),
      },
      {
        path: "mascotas/:mascotaId",
        component: () =>
          import(
            /* webpackChunkName: "clienteDetail" */ "../views/MascotaView.vue"
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
