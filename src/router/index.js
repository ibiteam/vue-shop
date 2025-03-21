import { createRouter, createWebHistory } from 'vue-router'
import LayoutComponent from '@/components/Layout/Layout'
import user from "./user";
import account from "./account";
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
                {
                    path: 'ucenter',
                    name: 'ucenter',
                    component: () => import('@/views/Ucenter.vue'),
                },
            ],
        },
        ...user,
        ...account
    ],
})

export default router
