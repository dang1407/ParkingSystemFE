import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/UserStore";
import { Role } from "./Role";
// // Auth Guards
const requireAuth = async (to, from, next) => {
  const userStore = useUserStore();
  await userStore.reloginAsync();
  if (!userStore.isLogined) {
    next({ name: "Login", params: {} });
  } else {
    next();
  }
};

const routes = [
  {
    name: "Home",
    path: "/",
    component: () =>
      import(/* webPackChunkName: "home" */ "@/layout/AppLayout.vue"),
    children: [
      {
        name: "Dash Board",
        path: "/",
        component: () => import("@/views/dashboard/DashBoard.vue"),
      },
      {
        name: "User Infor",
        path: "/infor",
        component: () => import("@/views/userinfo/UserInfor.vue"),
      },
      {
        name: "Employee Page",
        path: "/employee",
        component: () =>
          import(
            /* webPackChunkName: "employee" */ "@/views/employee/EmployeePage.vue"
          ),
        beforeEnter: (to, from, next) => {
          const userStore = useUserStore();
          if (userStore.role != Role.Admin) {
            next({ name: "Error", params: {} });
          } else {
            next();
          }
        },
      },
      {
        name: "Garage",
        path: "/garage",
        component: () =>
          import(/* webPackChunkName: "garage" */ "@/views/garage/Garage.vue"),
      },
      {
        name: "Garage Infor",
        path: "/garage/:parkingId",
        component: () =>
          import(/* webPackChunkName: "garage" */ "@/views/garage/Garage.vue"),
      },
      {
        name: "Park Member",
        path: "/parkmember",
        component: () =>
          import(
            /* webPackChunkName: "parkmember" */ "@/views/parkmember/ParkMemberPage.vue"
          ),
        beforeEnter: (to, from, next) => {
          const userStore = useUserStore();
          if (userStore.role != Role.Admin) {
            next({ name: "Error", params: {} });
          } else {
            next();
          }
        },
      },
      {
        name: "Statistical",
        path: "/statistical",
        component: () =>
          import(
            /* webPackChunkName: "statistical" */ "@/views/statistical/Statistical.vue"
          ),
        beforeEnter: (to, from, next) => {
          const userStore = useUserStore();
          if (userStore.role != Role.Admin) {
            next({ name: "Error", params: {} });
          } else {
            next();
          }
        },
      },
      {
        name: "Vehicle",
        path: "/vehicle",
        component: () =>
          import(
            /* webPackChunkName: "statistical" */ "@/views/vehicleinout/Vehicle.vue"
          ),
        beforeEnter: (to, from, next) => {
          const userStore = useUserStore();
          if (userStore.role != Role.Admin) {
            next({ name: "Error", params: {} });
          } else {
            next();
          }
        },
      },
    ],
    beforeEnter: (to, from, next) => {
      requireAuth(to, from, next);
    },
  },
  {
    name: "Login",
    path: "/login",
    component: () =>
      import(/* webPackChunkName: "login" */ "@/views/login/Login.vue"),
  },
  {
    name: "Register Page",
    path: "/register",
    component: () =>
      import(
        /*webPackChunkName: "register" */ "@/views/register/CustomerRegister.vue"
      ),
  },
  {
    name: "Test",
    path: "/test",
    component: () =>
      import(/* webPackChunkName: "login" */ "@/views/test/Test.vue"),
  },
  {
    name: "Error",
    path: "/:pathMatch(.*)*",
    component: () =>
      import(/* webPackChunkName: "error" */ "@/views/error/ErrorPage.vue"),
    name: "Page not found",
  },
];

const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory(),
  routes, // short for `routes: routes`
});

export default router;
