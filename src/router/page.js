const page = [
    /*搜索*/
    {
        path: '/search',
        name: 'search',
        component: () => import('@/views/search/Index.vue'),
        meta:{keepAlive:false}
    },
    {
        path: '/search/history',
        name: 'search_history',
        component: () => import('@/views/search/History.vue'),
        meta:{keepAlive:true}
    },
    {
        path: '/special',
        name: 'special',
        component: () => import('@/views/special/Special.vue')
    },
]
export default page
