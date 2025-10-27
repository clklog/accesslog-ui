import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
 
NProgress.configure({ showSpinner: false }) // NProgress Configuration
 
const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist
 
router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()
 
  // set page title
  document.title = getPageTitle(to.meta.title)
 
  // determine whether the user has logged in
  const hasToken = getToken()

  // 打开页面的时候，设置顶部FilterBar可以点击（加这个功能是防止首页频繁点击）
  store.dispatch("app/setIndexCanClick", true);

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const { roles } = await store.dispatch('user/getInfo')
 
          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
 
          // dynamically add accessible routes
          router.addRoutes(accessRoutes)
 
          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
 
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }

 
})
router.afterEach(() => {
  NProgress.done()
})
