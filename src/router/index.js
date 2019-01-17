import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/pages/Home/home')
    },
    {
      path: '/City/:cityid',
      name: 'City',
      component: () => import('@/pages/City/city')
    },
    {
      path: '/Msite',
      name: 'Msite',
      component: () => import('@/pages/Msite/msite')
    },
    {
      path: '/Food',
      name: 'Food',
      component: () => import('@/pages/Food/food')
    },
    {
      path: '/Shop',
      name: 'Shop',
      component: () => import('@/pages/Shop/shop')
    },
    {
      path: '/ConfirmOrder',
      name: 'ConfirmOrder',
      component: () => import('@/pages/ConfirmOrder/confirmOrder')
    },
    {
      path: '/Remark',
      name: 'Remark',
      component: () => import('@/pages/ConfirmOrder/remark')
    },
    {
      path: '/Order',
      name: 'Order',
      component: () => import('@/pages/Order/order')
    },
    {
      path: '/My',
      name: 'My',
      component: () => import('@/pages/My/my')
    },
    {
      path: '/Search',
      name: 'Search',
      component: () => import('@/pages/Search/search')
    }
  ]
})
