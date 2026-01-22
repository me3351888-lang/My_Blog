import HomeView from '@/views/HomeView.vue'
import Loginview from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '@/firebase/config'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: { name: 'home' },
    },
    {
      name: 'login',
      path: '/login',
      component: Loginview,
      meta: { requireAuth: false },
    },
    {
      name: 'register',
      path: '/register',
      component: RegisterView,
      meta: { requireAuth: false },
    },
    {
      name: 'home',
      path: '/home',
      component: HomeView,
      meta: { requireAuth: true },
    },
    {
      name: 'createpost',
      path: '/createpost',
      component: () => import('@/views/CreatePostView.vue'),
      meta: { requireAuth: true },
    },
    {
      path: '/post/:id',
      name: 'PostDetail',
      component: () => import('../views/PostDetailView.vue'),
      meta: { requireAuth: true },
    },
    {
      path: '/edit/:id',
      name: 'EditPost',
      component: () => import('../views/EditPostView.vue'),
      meta: { requireAuth: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const user = auth.currentUser
  if (to.meta.requireAuth && !user) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
