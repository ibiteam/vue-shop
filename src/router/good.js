const good = [
    /*商品详情*/
    {
        path: '/good',
        name: 'good',
        component: () => import('@/views/good/Detail.vue'),
    },
    {
        path: '/good/play',
        name: 'goodPlay',
        component: () => import('@/views/good/Play.vue'),
    },
    {
        path: '/good/evaluate',
        name: 'evaluate',
        component: () => import('@/views/good/Evaluate.vue'),
    }
]
export default good