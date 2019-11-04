import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import TablePage from "../views/TablePage.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: TablePage
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
