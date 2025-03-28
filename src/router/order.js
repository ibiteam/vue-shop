const order = [
    /*订单列表*/
    {
        path: '/order/list',
        name: 'orderList',
        component: () => import('@/views/order/list.vue'),
    },
    /*订单详情*/
    {
        path: '/order/detail',
        name: 'orderDetail',
        component: () => import('@/views/order/detail.vue'),
    },
    /*下单*/
    {
        path: '/order/checkout',
        name: 'checkout',
        component: () => import('@/views/order/checkout.vue'),
    },
    /*物流*/
    {
        path: '/order/wuliu',
        name: 'wuliu',
        component: () => import('@/views/order/wuliu.vue'),
    },
    /*物流*/
    {
        path: '/order/wuliu',
        name: 'wuliu',
        component: () => import('@/views/order/wuliu.vue'),
    },
    /*物流*/
    {
        path: '/order/refund',
        name: 'refund',
        component: () => import('@/views/order/refund.vue'),
    },
]
export default order
