const order = [
    /*订单列表*/
    {
        path: '/order/list',
        name: 'orderList',
        component: () => import('@/views/order/list.vue'),
    },
    /*订单列表-搜索历史*/
    {
        path: '/order/searchHistory',
        name: 'orderSearchHistory',
        component: () => import('@/views/order/searchHistory.vue'),
    },
    /*订单列表-搜索*/
    {
        path: '/order/search',
        name: 'orderSearch',
        component: () => import('@/views/order/search.vue'),
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
        path: '/wuliu/list',
        name: 'wuliuList',
        component: () => import('@/views/wuliu/list.vue'),
    },
    {
        path: '/wuliu/detail',
        name: 'wuliuDetail',
        component: () => import('@/views/wuliu/detail.vue'),
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
    },
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
    /*选择售后类型*/
    {
        path: '/refund/entrance',
        name: 'refundEntrance',
        component: () => import('@/views/refund/entrance.vue'),
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
    /*填写单号*/
    {
        path: '/refund/ship',
        name: 'refundShip',
        component: () => import('@/views/refund/ship.vue'),
    },
]
export default order
