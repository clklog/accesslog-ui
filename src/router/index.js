import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);
import Layout from "@/layout";
import logDataAnalysis from "./modules/logo-analysis";
// import businessMonitor from "./modules/business-monitor";


export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/log-analysis/data-overview/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },{
    path: '/',
    component: Layout,
    redirect: '/logAnalysis/dataOverview',
  },
]

export const asyncRoutes = [
  logDataAnalysis,
  { path: '*', redirect: '/logAnalysis/dataOverview', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: "history", 
    // base: "/accesslog/",
    // base: "",
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher;
}

export default router;
