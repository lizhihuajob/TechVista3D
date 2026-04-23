import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './styles/main.scss'

import Home from './views/Home.vue'
import BlogList from './views/BlogList.vue'
import BlogDetail from './views/BlogDetail.vue'
import CesiumCategory from './views/CesiumCategory.vue'
import CesiumDetail from './views/CesiumDetail.vue'
import ThreejsCategory from './views/ThreejsCategory.vue'
import ThreejsDetail from './views/ThreejsDetail.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/blog', name: 'BlogList', component: BlogList },
  { path: '/blog/:id', name: 'BlogDetail', component: BlogDetail },
  { path: '/cesium', name: 'CesiumCategory', component: CesiumCategory },
  { path: '/cesium/:category', name: 'CesiumCategoryList', component: CesiumCategory },
  { path: '/cesium/:category/:id', name: 'CesiumDetail', component: CesiumDetail },
  { path: '/threejs', name: 'ThreejsCategory', component: ThreejsCategory },
  { path: '/threejs/:category', name: 'ThreejsCategoryList', component: ThreejsCategory },
  { path: '/threejs/:category/:id', name: 'ThreejsDetail', component: ThreejsDetail }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

const app = createApp(App)
app.use(router)
app.mount('#app')
