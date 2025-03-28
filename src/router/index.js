import { createRouter, createWebHistory } from 'vue-router'
import LayoutComponent from '@/components/Layout/Layout'
import user from "./user";
import account from "./account";
import good from "./good";
import property from "./property";
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
                    component: () => import('@/views/ucenter/Ucenter.vue'),
                },
                {
                  path: 'cart',
                  name: 'cart',
                  component: () => import('@/views/cart/Cart.vue'),
                },
                {
                  path: 'category',
                  name: 'category',
                  component: () => import('@/views/category/Category.vue'),
                },
                {
                  path: 'search',
                  name: 'search',
                  component: () => import('@/views/search/Index.vue'),
                },
                {
                  path: 'search/history',
                  name: 'search_history',
                  component: () => import('@/views/search/History.vue'),
                }
            ],
        },
        ...user,
        ...account,
        ...good,
        ...property
    ],
})

export default router
