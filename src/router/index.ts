import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue'
import TransactionSearch from '@/views/TransactionSearch.vue'
import NomadTransaction from '@/views/Transaction/Nomad/Main.vue'
// import ConnextTransaction from '@/views/Transaction/Connext/Main.vue'
import PageNotFound from '@/views/PageNotFound.vue'
import PrivacyPolicy from '@/views/PrivacyPolicy.vue'
import TermsOfUse from '@/views/TermsOfUse.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Bridge',
    component: Home,
  },
  {
    path: '/tx',
    name: 'Transaction',
    component: TransactionSearch,
  },
  {
    path: '/tx/nomad/:network/:id',
    name: 'NomadTransaction',
    component: NomadTransaction,
  },
  // {
  //   path: '/tx/connext/:id',
  //   name: 'ConnextTransaction',
  //   component: ConnextTransaction,
  // },
  {
    path: '/privacy-policy',
    name: 'PrivacyPolicy',
    component: PrivacyPolicy,
  },
  {
    path: '/terms',
    name: 'TermsOfUse',
    component: TermsOfUse,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: PageNotFound,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
