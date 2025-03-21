import { createRouter, createWebHistory } from 'vue-router'
import LayoutComponent from '@/components/Layout/Layout'
import user from "./user";
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
        ...user
    ],
})

export default router
