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
    /*下单成功*/
    {
        path: '/order/success',
        name: 'orderSuccess',
        component: () => import('@/views/order/success.vue'),
    },
    /*物流*/
    {
        path: '/order/wuliu',
        name: 'orderWuliu',
        component: () => import('@/views/order/wuliu.vue'),
    },
    /*售后*/
    {
        path: '/order/refund',
        name: 'orderRefund',
        component: () => import('@/views/order/refund.vue'),
    },
    {
        path: '/pay/index',
        name: 'payIndex',
        component: () => import('@/views/pay/index.vue'),
    },
    {
        path: '/pay/success',
        name: 'paySuccess',
        component: () => import('@/views/pay/success.vue'),
    },
    /*评价*/
    {
        path: '/order/comment',
        name: 'orderComment',
        component: () => import('@/views/order/comment.vue'),
    }
]
export default order
