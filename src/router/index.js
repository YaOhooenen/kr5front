import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LibraryView from '../views/LibraryView.vue'
import ExportView from '../views/ExportView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { title: 'Генератор палитр' }
  },
  {
    path: '/library',
    name: 'Library',
    component: LibraryView,
    meta: { title: 'Библиотека палитр' }
  },
  {
    path: '/export',
    name: 'Export',
    component: ExportView,
    meta: { title: 'Экспорт палитр' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Изменение заголовка страницы
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} | Color Palette Generator` : 'Color Palette Generator'
  next()
})

export default router