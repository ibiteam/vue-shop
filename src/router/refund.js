const refund = [
    /*退款列表*/
    {
        path: '/refund/list',
        name: 'refundList',
        component: () => import('@/views/refund/list.vue'),
    },
    /*退款详情*/
    {
        path: '/refund/detail',
        name: 'refundDetail',
        component: () => import('@/views/refund/detail.vue'),
    },
    /*申请退款*/
    {
        path: '/refund/form',
        name: 'refundForm',
        component: () => import('@/views/refund/form.vue'),
    },
    /*协商历史*/
    {
        path: '/refund/history',
        name: 'refundHistory',
        component: () => import('@/views/refund/history.vue'),
    },
]
export default refund
