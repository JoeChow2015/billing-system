import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    redirect: 'billing'
  },
  {
    path: '/billing',
    name: 'Billing',
    component: () => import(/* webpackChunkName: "billing" */ '../views/components/Billing.vue')
  },
  {
    path: '/customer',
    name: 'Customer',
    component: () => import(/* webpackChunkName: "customer" */ '../views/components/Customer.vue')
  },
  {
    path: '/statistic',
    name: 'Statistic',
    component: () => import(/* webpackChunkName: "statistic" */ '../views/components/Statistic.vue')
  },
  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
