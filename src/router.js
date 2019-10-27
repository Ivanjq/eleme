import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Goods from './components/goods.vue'
import Seller from './components/seller.vue'
import Ratings from './components/ratings.vue'
import 'mint-ui/lib/style.css'

Vue.use(Router)

export default new Router({
  linkActiveClass: 'active',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      redirect: '/goods',
      children: [{
        path: '/goods',
        name: 'goods',
        component: Goods
      }, {
        path: '/seller',
        name: 'seller',
        component: Seller
      }, {
        path: '/ratings',
        name: 'ratings',
        component: Ratings
      }]
    }
  ]
})
