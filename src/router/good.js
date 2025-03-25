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
    }

]
export default good