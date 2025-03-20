import { createRouter, createWebHistory } from 'vue-router'
import LayoutComponent from '@/components/Layout/Layout'
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/',
            component: LayoutComponent,
            children: [
                {
                    path: '',
                    name: 'home',
                    component: () => import('@/views/Home.vue'),
                },
            ],
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/user/Login.vue'),
        },
    ],
})

export default router
