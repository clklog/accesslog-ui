import router from "./router";
import store from "./store";
import { Message } from "element-ui";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken } from "@/utils/auth"; // get token from cookie
import getPageTitle from "@/utils/get-page-title";

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ["/login", "/auth-redirect"]; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start();
  // set page title
  document.title = getPageTitle(to.meta.title);
  if (
    window.location.origin == "http://192.168.100.171:9527" ||
    window.location.origin == "http://localhost:9527"
  ) {
    const hasToken = "admin-token";
    const role = "admin";
    if (hasToken) {
      next();
      const accessRoutes = await store.dispatch(
        "permission/generateRoutes",
        role
      );
      // dynamically add accessible routes
      router.addRoutes(accessRoutes);
    }
  } else {
    next();
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
